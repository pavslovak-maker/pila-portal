"use server";

import { db } from "@/db";
import { products, orders, orderItems, customers } from "@/db/schema";
import { orderSchema } from "@/lib/schemas";
import type { ActionResult } from "@/lib/result";
import { inArray, eq } from "drizzle-orm";
import { logger } from "@/lib/logger";
import { notifyOwner } from "@/lib/notify";

export async function createOrder(
  raw: unknown,
): Promise<ActionResult<{ orderId: string }>> {
  const parsed = orderSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Zkontrolujte prosím zadané údaje." };
  }
  const input = parsed.data;

  try {
    return await db.transaction(async (tx) => {
      // Načti produkty z DB (nikdy nedůvěřuj cenám z klienta)
      const ids = input.items.map((i) => i.productId);
      const found = await tx
        .select()
        .from(products)
        .where(inArray(products.id, ids));

      // Ověř dostupnost a sestav snapshot cen
      let total = 0;
      const itemsToInsert = input.items.map((i) => {
        const p = found.find((x) => x.id === i.productId);
        if (!p || !p.active) throw new Error("PRODUCT_UNAVAILABLE");
        if (p.stock < i.quantity) throw new Error("OUT_OF_STOCK");
        total += p.priceB2c * i.quantity;
        return {
          productId: p.id,
          productName: p.name,
          unitPrice: p.priceB2c,
          quantity: i.quantity,
        };
      });

      // Upsert zákazníka podle e-mailu (nebo jen kontakt bez účtu)
      let customerId: string | null = null;
      if (input.contact.contactEmail) {
        const existing = await tx
          .select()
          .from(customers)
          .where(eq(customers.email, input.contact.contactEmail))
          .limit(1);
        if (existing.length > 0) {
          customerId = existing[0].id;
        } else {
          const [newCustomer] = await tx
            .insert(customers)
            .values({
              email: input.contact.contactEmail,
              phone: input.contact.contactPhone,
              name: input.contact.contactName,
            })
            .returning();
          customerId = newCustomer.id;
        }
      }

      // Vytvoř objednávku
      const [order] = await tx
        .insert(orders)
        .values({
          customerId,
          status: "pending",
          paymentMethod: input.paymentMethod,
          totalAmount: total,
          deliveryMethod: input.deliveryMethod,
          deliveryAddress: input.deliveryAddress,
          idempotencyKey: input.idempotencyKey,
        })
        .onConflictDoNothing({ target: orders.idempotencyKey })
        .returning();

      // Idempotence: objednávka už existuje
      if (!order) {
        return { ok: true as const, data: { orderId: "duplicate" } };
      }

      // Vlož položky
      await tx
        .insert(orderItems)
        .values(itemsToInsert.map((it) => ({ ...it, orderId: order.id })));

      // Sniž sklad
      for (const it of itemsToInsert) {
        await tx
          .update(products)
          .set({ stock: found.find((p) => p.id === it.productId)!.stock - it.quantity })
          .where(eq(products.id, it.productId));
      }

      logger.info({ orderId: order.id, total, method: input.paymentMethod }, "order_created");

      notifyOwner({ kind: "order", orderId: order.id }).catch((e) =>
        logger.error({ orderId: order.id, err: String(e) }, "notify_failed"),
      );

      // Platba kartou — Stripe přidáme v dalším kroku
      // if (input.paymentMethod === "card") { ... }

      return { ok: true as const, data: { orderId: order.id } };
    });
  } catch (e) {
    const msg = String(e);
    if (msg.includes("OUT_OF_STOCK"))
      return { ok: false, error: "Některé zboží není skladem v požadovaném množství." };
    if (msg.includes("PRODUCT_UNAVAILABLE"))
      return { ok: false, error: "Některý produkt už není v nabídce." };
    logger.error({ err: msg }, "order_failed");
    return { ok: false, error: "Objednávku se nepodařilo dokončit. Zkuste to znovu nebo zavolejte." };
  }
}
