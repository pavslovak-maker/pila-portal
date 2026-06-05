# 03 — API / Server Actions

> Veškerá mutace dat jde přes **Server Actions** (`"use server"`). Žádná REST vrstva.
> Každá akce: (1) validuje vstup Zodem, (2) provede v transakci, (3) vrací `{ ok, ... }`,
> nikdy nehází chybu přímo na klienta. Zod schémata jsou **sdílená** klient ↔ server.

## Konvence návratových hodnot

```ts
// src/lib/result.ts
export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string; code?: string };
```

UI rozhoduje podle `result.ok`. Technické detaily chyby jdou do logu/Sentry, uživatel
vidí jen srozumitelnou hlášku.

## Zod schémata (src/lib/schemas.ts)

```ts
import { z } from "zod";

// Společná kontaktní část každé poptávky
const contact = z.object({
  contactName: z.string().min(2).max(100),
  contactPhone: z.string().min(6).max(20),
  contactEmail: z.string().email().optional(),
  note: z.string().max(2000).optional(),
});

// --- Payload podle typu služby ---
export const millingPayload = z.object({
  mode: z.enum(["cut_own_logs", "buy_sawn"]),  // nařezat vlastní / koupit hotové
  species: z.string().min(1),                   // dřevina
  volumeM3: z.number().positive().max(1000),
  sawnType: z.enum(["fosny", "hranoly", "prkna"]),
  thicknessMm: z.number().positive().max(500).optional(),
  preferredDate: z.string().optional(),         // ISO; jen orientační
});

export const dryingPayload = z.object({
  species: z.string().min(1),
  volumeM3: z.number().positive().max(1000),
  startState: z.enum(["fresh", "partially_dry"]),
  targetMoisture: z.number().min(0).max(100),   // cílová vlhkost %
  preferredDate: z.string().optional(),
});

export const sharpeningPayload = z.object({
  toolType: z.enum(["circular_blade", "band_saw"]),
  count: z.number().int().positive().max(500),
  diameterMm: z.number().positive().optional(),
});

// Diskriminovaná unie — payload se validuje podle `type`
export const inquirySchema = z.discriminatedUnion("type", [
  contact.extend({ type: z.literal("milling"),    payload: millingPayload }),
  contact.extend({ type: z.literal("drying"),     payload: dryingPayload }),
  contact.extend({ type: z.literal("sharpening"), payload: sharpeningPayload }),
]).and(z.object({
  idempotencyKey: z.string().uuid(),
  photos: z.array(z.string().url()).max(10).optional(),
}));

export type InquiryInput = z.infer<typeof inquirySchema>;

// --- Kalkulačka sušení ---
export const dryingQuoteSchema = z.object({
  species: z.string().min(1),
  volumeM3: z.number().positive().max(1000),
});

// --- Objednávka paliva ---
export const orderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive().max(1000),
  })).min(1),
  paymentMethod: z.enum(["card", "on_pickup"]),
  deliveryMethod: z.enum(["pickup", "delivery"]),
  deliveryAddress: z.string().max(300).optional(),
  contact: contact,
  idempotencyKey: z.string().uuid(),
}).refine(
  (d) => d.deliveryMethod !== "delivery" || !!d.deliveryAddress,
  { message: "Při dopravě je adresa povinná", path: ["deliveryAddress"] }
);

export type OrderInput = z.infer<typeof orderSchema>;
```

## Server Action: poptávka (src/app/actions/inquiry.ts)

Pokrývá všechny tři služby — jedna akce, díky diskriminované unii.

```ts
"use server";
import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { inquirySchema } from "@/lib/schemas";
import type { ActionResult } from "@/lib/result";
import { logger } from "@/lib/logger";
import { notifyOwner } from "@/lib/notify";

export async function submitInquiry(raw: unknown): Promise<ActionResult<{ id: string }>> {
  const parsed = inquirySchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Zkontrolujte vyplněné údaje.", code: "VALIDATION" };
  }
  const input = parsed.data;
  const reqId = crypto.randomUUID();

  try {
    // Idempotence: druhý pokus se stejným klíčem nevytvoří duplicitu.
    const [row] = await db.insert(inquiries).values({
      type: input.type,
      payload: input.payload,
      photos: input.photos ?? [],
      contactName: input.contactName,
      contactPhone: input.contactPhone,
      contactEmail: input.contactEmail,
      note: input.note,
      idempotencyKey: input.idempotencyKey,
    }).onConflictDoNothing({ target: inquiries.idempotencyKey }).returning();

    // onConflictDoNothing → prázdné pole znamená "už přijato dříve" = úspěch pro uživatele.
    const id = row?.id;
    logger.info({ reqId, type: input.type, id, duplicate: !row }, "inquiry_received");

    // Notifikace je NEKRITICKÁ vrstva: její selhání nesmí shodit uložení poptávky.
    if (id) {
      notifyOwner({ kind: "inquiry", inquiryId: id, type: input.type })
        .catch((e) => logger.error({ reqId, id, err: String(e) }, "notify_failed"));
    }

    return { ok: true, data: { id: id ?? "duplicate" } };
  } catch (e) {
    logger.error({ reqId, err: String(e) }, "inquiry_insert_failed");
    return { ok: false, error: "Poptávku se nepodařilo uložit. Zkuste to prosím znovu." };
  }
}
```

## Kalkulačka sušení (src/lib/quote.ts) — čistá funkce + DB lookup

```ts
import { db } from "@/db";
import { pricingRules } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { dryingQuoteSchema } from "@/lib/schemas";
import type { ActionResult } from "@/lib/result";

// Čistá kalkulace — testovatelná bez DB.
export function calcDryingPrice(volumeM3: number, pricePerM3Halere: number): number {
  return Math.round(volumeM3 * pricePerM3Halere); // haléře
}

export async function quoteDrying(raw: unknown): Promise<ActionResult<{ priceHalere: number }>> {
  const parsed = dryingQuoteSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Neplatný vstup." };

  const [rule] = await db.select().from(pricingRules).where(
    and(eq(pricingRules.service, "drying"),
        eq(pricingRules.species, parsed.data.species),
        eq(pricingRules.active, true))
  ).limit(1);

  if (!rule) return { ok: false, error: "Pro tuto dřevinu nemáme orientační cenu.", code: "NO_RULE" };

  return { ok: true, data: { priceHalere: calcDryingPrice(parsed.data.volumeM3, rule.pricePerUnit) } };
}
```

## Server Action: objednávka paliva (src/app/actions/order.ts)

```ts
"use server";
import { db } from "@/db";
import { products, orders, orderItems } from "@/db/schema";
import { orderSchema } from "@/lib/schemas";
import type { ActionResult } from "@/lib/result";
import { inArray } from "drizzle-orm";
import { createPaymentIntent } from "@/lib/stripe";
import { logger } from "@/lib/logger";
import { notifyOwner } from "@/lib/notify";

export async function createOrder(raw: unknown): Promise<ActionResult<{ orderId: string; clientSecret?: string }>> {
  const parsed = orderSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Zkontrolujte objednávku." };
  const input = parsed.data;

  try {
    return await db.transaction(async (tx) => {
      const ids = input.items.map((i) => i.productId);
      const found = await tx.select().from(products).where(inArray(products.id, ids));

      // Ověření skladu a sestavení snapshotu cen.
      let total = 0;
      const itemsToInsert = input.items.map((i) => {
        const p = found.find((x) => x.id === i.productId);
        if (!p || !p.active) throw new Error("PRODUCT_UNAVAILABLE");
        if (p.stock < i.quantity) throw new Error("OUT_OF_STOCK");
        total += p.priceB2c * i.quantity;
        return { productId: p.id, productName: p.name, unitPrice: p.priceB2c, quantity: i.quantity };
      });

      const [order] = await tx.insert(orders).values({
        status: input.paymentMethod === "on_pickup" ? "pending" : "pending",
        paymentMethod: input.paymentMethod,
        totalAmount: total,
        deliveryMethod: input.deliveryMethod,
        deliveryAddress: input.deliveryAddress,
        idempotencyKey: input.idempotencyKey,
      }).onConflictDoNothing({ target: orders.idempotencyKey }).returning();

      if (!order) return { ok: true as const, data: { orderId: "duplicate" } }; // idempotence

      await tx.insert(orderItems).values(itemsToInsert.map((it) => ({ ...it, orderId: order.id })));

      // Platba kartou → Stripe PaymentIntent. Při převzetí → žádná online platba.
      let clientSecret: string | undefined;
      if (input.paymentMethod === "card") {
        const pi = await createPaymentIntent(total, order.id); // potvrzení stavu řeší webhook
        clientSecret = pi.client_secret ?? undefined;
      }

      notifyOwner({ kind: "order", orderId: order.id }).catch((e) =>
        logger.error({ orderId: order.id, err: String(e) }, "notify_failed"));

      return { ok: true as const, data: { orderId: order.id, clientSecret } };
    });
  } catch (e) {
    const msg = String(e);
    if (msg.includes("OUT_OF_STOCK")) return { ok: false, error: "Některé zboží není skladem v požadovaném množství." };
    if (msg.includes("PRODUCT_UNAVAILABLE")) return { ok: false, error: "Některý produkt už není v nabídce." };
    logger.error({ err: msg }, "order_failed");
    return { ok: false, error: "Objednávku se nepodařilo dokončit." };
  }
}
```

## Stripe webhook (src/app/api/stripe/webhook/route.ts)

Stav `paid` se nastavuje **jen přes webhook**, nikdy z klienta (klient se dá zfalšovat).

```ts
// Ověř podpis (STRIPE_WEBHOOK_SECRET). Na "payment_intent.succeeded" najdi order
// podle stripePaymentIntent / metadata.orderId a nastav status = "paid", sniž stock.
// Idempotentně: pokud už je "paid", nedělej nic. Vše v transakci.
```

## Upload fotek (presigned URL)

```
1) Klient požádá Server Action `getUploadUrl(fileType, fileSize)` → vrátí presigned PUT URL.
2) Validuj typ (image/jpeg|png|webp) a max velikost (např. 8 MB) PŘED vydáním URL.
3) Klient nahraje přímo do S3/R2 (ne přes náš server).
4) Výslednou veřejnou URL pošle v `photos[]` při submitu poptávky.
```
