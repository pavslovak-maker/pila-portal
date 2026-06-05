"use server";

import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { inquirySchema } from "@/lib/schemas";
import type { ActionResult } from "@/lib/result";
import { logger } from "@/lib/logger";
import { notifyOwner } from "@/lib/notify";

export async function submitInquiry(
  raw: unknown,
): Promise<ActionResult<{ id: string }>> {
  const parsed = inquirySchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Zkontrolujte vyplněné údaje.", code: "VALIDATION" };
  }

  const input = parsed.data;
  const reqId = crypto.randomUUID();

  try {
    // onConflictDoNothing zajišťuje idempotenci:
    // druhé odeslání téhož formuláře (stejný idempotencyKey) nic nepřepíše.
    const [row] = await db
      .insert(inquiries)
      .values({
        type: input.type,
        payload: input.payload,
        photos: input.photos ?? [],
        contactName: input.contactName,
        contactPhone: input.contactPhone,
        contactEmail: input.contactEmail || null,
        note: input.note,
        idempotencyKey: input.idempotencyKey,
      })
      .onConflictDoNothing({ target: inquiries.idempotencyKey })
      .returning();

    const id = row?.id;
    logger.info({ reqId, type: input.type, id, duplicate: !row }, "inquiry_received");

    // Notifikace je NEKRITICKÁ — její selhání nesmí shodit uložení poptávky.
    if (id) {
      notifyOwner({ kind: "inquiry", inquiryId: id, type: input.type }).catch((e) =>
        logger.error({ reqId, id, err: String(e) }, "notify_failed"),
      );
    }

    return { ok: true, data: { id: id ?? "duplicate" } };
  } catch (e) {
    logger.error({ reqId, err: String(e) }, "inquiry_insert_failed");
    return {
      ok: false,
      error: "Poptávku se nepodařilo uložit. Zkuste to prosím znovu nebo nám zavolejte.",
    };
  }
}
