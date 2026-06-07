import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { AddToCartButton } from "@/components/AddToCartButton";
import { CartNav } from "@/components/CartNav";
import { PageLayout } from "@/components/PageLayout";

export const metadata = {
  title: "Palivové dřevo a brikety | Portál pily",
  description: "Prodej palivového dřeva, briket, pelet a štěpky. Objednejte online.",
};

const UNIT_LABELS: Record<string, string> = {
  prm: "prm",
  paleta: "paleta",
  kg: "kg",
  ks: "ks",
};

function formatPrice(halere: number) {
  return (halere / 100).toLocaleString("cs-CZ", {
    style: "currency",
    currency: "CZK",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export default async function PalivoPage() {
  const items = await db
    .select()
    .from(products)
    .where(eq(products.active, true));

  return (
    <PageLayout>
      <p style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, color: "var(--c-gold)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>Nabídka</p>
      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: 12 }}>Palivo</h1>
      <p style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: 48 }}>
        Palivové dřevo, brikety, pelety a štěpka. Objednávka online, platba kartou nebo při převzetí.
      </p>

      {items.length === 0 ? (
        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", marginTop: 48 }}>
          Momentálně nemáme žádné produkty v nabídce.
        </p>
      ) : (
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
          {items.map((p) => (
            <div
              key={p.id}
              style={{ display: "flex", flexDirection: "column", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", padding: 24 }}
            >
              <div style={{ marginBottom: 16, height: 120, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", fontSize: 36 }}>
                🪵
              </div>

              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{p.name}</h2>
              {p.description && (
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: 8 }}>{p.description}</p>
              )}

              <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                <div>
                  <span style={{ fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 700, color: "var(--c-gold)" }}>
                    {formatPrice(p.priceB2c)}
                  </span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginLeft: 4 }}>
                    / {UNIT_LABELS[p.unit] ?? p.unit}
                  </span>
                </div>
                <span style={{ fontSize: 12, color: p.stock > 0 ? "#8aac6a" : "#ac6a6a" }}>
                  {p.stock > 0 ? `Skladem (${p.stock})` : "Vyprodáno"}
                </span>
              </div>

              {p.stock > 0 ? (
                <AddToCartButton
                  productId={p.id}
                  name={p.name}
                  unit={UNIT_LABELS[p.unit] ?? p.unit}
                  priceB2c={p.priceB2c}
                />
              ) : (
                <button
                  disabled
                  style={{ marginTop: 16, width: "100%", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)", padding: "10px 16px", fontSize: 13, fontWeight: 600, border: "1px solid rgba(255,255,255,0.08)", cursor: "not-allowed" }}
                >
                  Vyprodáno
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <CartNav />
    </PageLayout>
  );
}
