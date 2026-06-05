"use server";

import { db } from "@/db";
import { inquiries, orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/lib/result";

const updateInquirySchema = z.object({
  inquiryId: z.string().uuid(),
  status: z.enum(["new", "contacted", "quoted", "won", "lost"]),
});

export async function updateInquiryStatus(raw: unknown): Promise<ActionResult> {
  const parsed = updateInquirySchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Neplatna data." };

  await db
    .update(inquiries)
    .set({ status: parsed.data.status })
    .where(eq(inquiries.id, parsed.data.inquiryId));

  revalidatePath("/admin");
  return { ok: true, data: undefined };
}

const updateOrderSchema = z.object({
  orderId: z.string().uuid(),
  status: z.enum(["pending", "paid", "fulfilled", "cancelled", "failed"]),
});

export async function updateOrderStatus(raw: unknown): Promise<ActionResult> {
  const parsed = updateOrderSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Neplatna data." };

  await db
    .update(orders)
    .set({ status: parsed.data.status })
    .where(eq(orders.id, parsed.data.orderId));

  revalidatePath("/admin/orders");
  return { ok: true, data: undefined };
}
