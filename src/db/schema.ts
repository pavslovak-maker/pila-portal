import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  jsonb,
  pgEnum,
  boolean,
  index,
  unique,
} from "drizzle-orm/pg-core";

// --- Enumy ---
export const customerRole = pgEnum("customer_role", ["b2c", "b2b"]);
export const inquiryType = pgEnum("inquiry_type", ["milling", "drying", "sharpening"]);
export const inquiryStatus = pgEnum("inquiry_status", ["new", "contacted", "quoted", "won", "lost"]);
export const orderStatus = pgEnum("order_status", ["pending", "paid", "fulfilled", "cancelled", "failed"]);
export const paymentMethod = pgEnum("payment_method", ["card", "on_pickup"]);
export const productUnit = pgEnum("product_unit", ["prm", "paleta", "kg", "ks"]); // prm = prostorový metr
export const notifChannel = pgEnum("notif_channel", ["email", "telegram"]);
export const notifStatus = pgEnum("notif_status", ["queued", "sent", "failed"]);

// --- Zákazníci ---
export const customers = pgTable(
  "customers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    phone: text("phone"),
    name: text("name"),
    role: customerRole("role").notNull().default("b2c"), // b2b = fáze 2
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({ emailIdx: unique("customers_email_uq").on(t.email) }),
);

// --- Poptávky (pořez / sušení / ostření) ---
// payload je jsonb, jeho tvar validuje Zod schéma podle `type` (viz docs/03-api-server-actions.md).
export const inquiries = pgTable(
  "inquiries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    type: inquiryType("type").notNull(),
    status: inquiryStatus("status").notNull().default("new"),
    payload: jsonb("payload").notNull(),              // tvar dle type, validováno Zodem
    photos: jsonb("photos").$type<string[]>().default([]), // URL fotek (S3/R2)
    contactName: text("contact_name").notNull(),
    contactPhone: text("contact_phone").notNull(),
    contactEmail: text("contact_email"),
    note: text("note"),
    idempotencyKey: text("idempotency_key").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    idemUq: unique("inquiries_idem_uq").on(t.idempotencyKey),
    typeStatusIdx: index("inquiries_type_status_idx").on(t.type, t.status),
  }),
);

// --- Produkty (palivo) ---
export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sku: text("sku").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    unit: productUnit("unit").notNull(),
    priceB2c: integer("price_b2c").notNull(),         // v haléřích
    priceB2b: integer("price_b2b"),                   // fáze 2, může být null
    stock: integer("stock").notNull().default(0),
    active: boolean("active").notNull().default(true),
    imageUrl: text("image_url"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({ skuUq: unique("products_sku_uq").on(t.sku) }),
);

// --- Objednávky ---
export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    customerId: uuid("customer_id").references(() => customers.id),
    status: orderStatus("status").notNull().default("pending"),
    paymentMethod: paymentMethod("payment_method").notNull(),
    stripePaymentIntent: text("stripe_payment_intent"),
    totalAmount: integer("total_amount").notNull(),   // v haléřích, snapshot součtu
    deliveryMethod: text("delivery_method").notNull(), // "pickup" | "delivery"
    deliveryAddress: text("delivery_address"),
    idempotencyKey: text("idempotency_key").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    idemUq: unique("orders_idem_uq").on(t.idempotencyKey),
    statusIdx: index("orders_status_idx").on(t.status),
  }),
);

// --- Položky objednávky (snapshot ceny v okamžiku objednání) ---
export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id),
  productName: text("product_name").notNull(),        // snapshot názvu
  unitPrice: integer("unit_price").notNull(),          // snapshot ceny (haléře)
  quantity: integer("quantity").notNull(),
});

// --- Ceník pro kalkulačku ---
// Pohání orientační ceny sušení/paliva. Editovatelné v adminu bez deploye.
export const pricingRules = pgTable(
  "pricing_rules",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    service: text("service").notNull(),               // "drying" | "milling" | ...
    species: text("species"),                          // dřevina (dub, smrk, ...) nebo null
    unit: text("unit").notNull(),                      // "m3", "prm", ...
    pricePerUnit: integer("price_per_unit").notNull(), // v haléřích
    validFrom: timestamp("valid_from").notNull().defaultNow(),
    active: boolean("active").notNull().default(true),
  },
  (t) => ({
    lookupIdx: index("pricing_lookup_idx").on(t.service, t.species, t.active),
  }),
);

// --- Log notifikací (fallback + audit) ---
export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  channel: notifChannel("channel").notNull(),
  status: notifStatus("status").notNull().default("queued"),
  relatedInquiry: uuid("related_inquiry").references(() => inquiries.id),
  relatedOrder: uuid("related_order").references(() => orders.id),
  payload: jsonb("payload").notNull(),                // co se posílalo (pro retry)
  error: text("error"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
