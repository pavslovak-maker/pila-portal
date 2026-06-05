import { z } from "zod";

// Společná kontaktní část každé poptávky
const contact = z.object({
  contactName: z.string().min(2, "Zadejte jméno").max(100),
  contactPhone: z.string().min(6, "Zadejte telefon").max(20),
  contactEmail: z.string().email("Neplatný e-mail").optional().or(z.literal("")),
  note: z.string().max(2000).optional(),
});

// --- Payload podle typu služby ---

export const millingPayload = z.object({
  mode: z.enum(["cut_own_logs", "buy_sawn"]),
  species: z.string().min(1, "Zadejte dřevinu"),
  volumeM3: z.number({ invalid_type_error: "Zadejte objem" }).positive().max(1000),
  sawnType: z.enum(["fosny", "hranoly", "prkna"]),
  thicknessMm: z.number().positive().max(500).optional(),
  preferredDate: z.string().optional(),
});

export const dryingPayload = z.object({
  species: z.string().min(1, "Zadejte dřevinu"),
  volumeM3: z.number({ invalid_type_error: "Zadejte objem" }).positive().max(1000),
  startState: z.enum(["fresh", "partially_dry"]),
  targetMoisture: z.number().min(0).max(100),
  preferredDate: z.string().optional(),
});

export const sharpeningPayload = z.object({
  toolType: z.enum(["circular_blade", "band_saw"]),
  count: z.number({ invalid_type_error: "Zadejte počet" }).int().positive().max(500),
  diameterMm: z.number().positive().optional(),
});

// Diskriminovaná unie — payload se validuje podle `type`
export const inquirySchema = z
  .discriminatedUnion("type", [
    contact.extend({ type: z.literal("milling"),    payload: millingPayload }),
    contact.extend({ type: z.literal("drying"),     payload: dryingPayload }),
    contact.extend({ type: z.literal("sharpening"), payload: sharpeningPayload }),
  ])
  .and(
    z.object({
      idempotencyKey: z.string().uuid(),
      photos: z.array(z.string().url()).max(10).optional(),
    }),
  );

export type InquiryInput = z.infer<typeof inquirySchema>;

// --- Kalkulačka sušení ---
export const dryingQuoteSchema = z.object({
  species: z.string().min(1),
  volumeM3: z.number().positive().max(1000),
});

// --- Objednávka paliva ---
export const orderSchema = z
  .object({
    items: z
      .array(
        z.object({
          productId: z.string().uuid(),
          quantity: z.number().int().positive().max(1000),
        }),
      )
      .min(1),
    paymentMethod: z.enum(["card", "on_pickup"]),
    deliveryMethod: z.enum(["pickup", "delivery"]),
    deliveryAddress: z.string().max(300).optional(),
    contact: contact,
    idempotencyKey: z.string().uuid(),
  })
  .refine(
    (d) => d.deliveryMethod !== "delivery" || !!d.deliveryAddress,
    { message: "Při dopravě je adresa povinná", path: ["deliveryAddress"] },
  );

export type OrderInput = z.infer<typeof orderSchema>;
