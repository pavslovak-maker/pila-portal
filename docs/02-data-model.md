# 02 — Datový model

> ORM: **Drizzle**. Soubor: `src/db/schema.ts`. Migrace přes `drizzle-kit`.
> Všechny ceny v **haléřích** (integer), nikdy float — vyhneš se zaokrouhlovacím chybám.

## Přehled entit

```
customers      ── zákazník (b2c i b2b; b2b je fáze 2, ale role je v modelu už teď)
inquiries      ── poptávky: pořez | sušení | ostření (1 tabulka, type + payload jsonb)
products       ── palivo (e-shop)
orders         ── objednávky paliva
order_items    ── položky objednávky (snapshot ceny!)
pricing_rules  ── ceník pro kalkulačku (editovatelný, pohání orientační ceny)
notifications  ── log notifikací majiteli/zákazníkovi (pro fallback a audit)
```

## Stavové diagramy

```
inquiry.status:  new ──► contacted ──► quoted ──► won | lost
order.status:    pending ──► paid ──► fulfilled | cancelled
                    └──► failed (platba selhala; zůstává viditelná)
notification.status: queued ──► sent | failed
```

## Drizzle schéma (src/db/schema.ts)

```ts
import {
  pgTable, uuid, text, integer, timestamp, jsonb, pgEnum, boolean, index, unique
} from "drizzle-orm/pg-core";

// --- Enumy ---
export const customerRole = pgEnum("customer_role", ["b2c", "b2b"]);
export const inquiryType  = pgEnum("inquiry_type", ["milling", "drying", "sharpening"]);
export const inquiryStatus= pgEnum("inquiry_status", ["new", "contacted", "quoted", "won", "lost"]);
export const orderStatus  = pgEnum("order_status", ["pending", "paid", "fulfilled", "cancelled", "failed"]);
export const paymentMethod= pgEnum("payment_method", ["card", "on_pickup"]);
export const productUnit  = pgEnum("product_unit", ["prm", "paleta", "kg", "ks"]); // prm = prostorový metr
export const notifChannel = pgEnum("notif_channel", ["email", "telegram"]);
export const notifStatus  = pgEnum("notif_status", ["queued", "sent", "failed"]);

// --- Zákazníci ---
export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  phone: text("phone"),
  name: text("name"),
  role: customerRole("role").notNull().default("b2c"), // b2b = fáze 2
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => ({ emailIdx: unique("customers_email_uq").on(t.email) }));

// --- Poptávky (pořez/sušení/ostření) ---
// payload je jsonb, jeho tvar validuje Zod schéma podle `type` (viz 03-api).
export const inquiries = pgTable("inquiries", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: inquiryType("type").notNull(),
  status: inquiryStatus("status").notNull().default("new"),
  payload: jsonb("payload").notNull(),            // tvar dle type, validováno Zodem
  photos: jsonb("photos").$type<string[]>().default([]), // URL fotek (S3/R2)
  contactName: text("contact_name").notNull(),
  contactPhone: text("contact_phone").notNull(),
  contactEmail: text("contact_email"),
  note: text("note"),
  idempotencyKey: text("idempotency_key").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => ({
  idemUq: unique("inquiries_idem_uq").on(t.idempotencyKey),
  typeStatusIdx: index("inquiries_type_status_idx").on(t.type, t.status),
}));

// --- Produkty (palivo) ---
export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  sku: text("sku").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  unit: productUnit("unit").notNull(),
  priceB2c: integer("price_b2c").notNull(),       // v haléřích
  priceB2b: integer("price_b2b"),                 // fáze 2, může být null
  stock: integer("stock").notNull().default(0),
  active: boolean("active").notNull().default(true),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => ({ skuUq: unique("products_sku_uq").on(t.sku) }));

// --- Objednávky ---
export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: uuid("customer_id").references(() => customers.id),
  status: orderStatus("status").notNull().default("pending"),
  paymentMethod: paymentMethod("payment_method").notNull(),
  stripePaymentIntent: text("stripe_payment_intent"),
  totalAmount: integer("total_amount").notNull(),  // v haléřích, snapshot součtu
  deliveryMethod: text("delivery_method").notNull(), // "pickup" | "delivery"
  deliveryAddress: text("delivery_address"),
  idempotencyKey: text("idempotency_key").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => ({
  idemUq: unique("orders_idem_uq").on(t.idempotencyKey),
  statusIdx: index("orders_status_idx").on(t.status),
}));

// --- Položky objednávky (snapshot ceny v okamžiku objednání) ---
export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => products.id),
  productName: text("product_name").notNull(),     // snapshot názvu
  unitPrice: integer("unit_price").notNull(),       // snapshot ceny (haléře)
  quantity: integer("quantity").notNull(),
});

// --- Ceník pro kalkulačku ---
// Pohání orientační ceny sušení/paliva. Editovatelné v adminu bez deploye.
export const pricingRules = pgTable("pricing_rules", {
  id: uuid("id").primaryKey().defaultRandom(),
  service: text("service").notNull(),              // "drying" | "milling" | ...
  species: text("species"),                         // dřevina (dub, smrk, ...) nebo null
  unit: text("unit").notNull(),                     // "m3", "prm", ...
  pricePerUnit: integer("price_per_unit").notNull(),// v haléřích
  validFrom: timestamp("valid_from").notNull().defaultNow(),
  active: boolean("active").notNull().default(true),
}, (t) => ({ lookupIdx: index("pricing_lookup_idx").on(t.service, t.species, t.active) }));

// --- Log notifikací (fallback + audit) ---
export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  channel: notifChannel("channel").notNull(),
  status: notifStatus("status").notNull().default("queued"),
  relatedInquiry: uuid("related_inquiry").references(() => inquiries.id),
  relatedOrder: uuid("related_order").references(() => orders.id),
  payload: jsonb("payload").notNull(),              // co se posílalo (pro retry)
  error: text("error"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
```

## Poznámky k modelu

- **`inquiry` je jediná tabulka pro tři služby.** Liší se polem `type` a tvarem `payload`.
  Tvar payloadu pro každý typ je definovaný Zod schématem v `03-api-server-actions.md`.
  Přidat čtvrtou službu = přidat hodnotu enumu + Zod schéma, žádná nová tabulka.
- **Idempotence:** `idempotencyKey` je unikátní — druhé odeslání téhož formuláře/objednávky
  selže na unique constraint a my to ošetříme jako „už přijato“ (ne chyba).
- **Snapshot v `order_items`:** ukládáme `productName` i `unitPrice` v čase objednání.
  Pozdější změna ceny produktu nesmí přepsat historickou objednávku.
- **`notifications`** existuje proto, aby selhání notifikace bylo dohledatelné a šlo
  poslat znovu. Data poptávky jsou už uložená; notifikace je oddělená, nekritická vrstva.
- **Ceny vždy integer v haléřích.** Formátování na Kč až ve view.

## Seed data (pro vývoj)

- 3–5 produktů paliva (měkké/tvrdé dříví, brikety, pelety, štěpka).
- `pricing_rules` pro sušení: dub, smrk, buk (cena za m³).
- 1 admin uživatel (viz auth v `07-security-operations.md`).
