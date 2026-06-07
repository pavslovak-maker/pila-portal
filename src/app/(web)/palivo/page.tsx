import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { AddToCartButton } from "@/components/AddToCartButton";
import { CartNav } from "@/components/CartNav";

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
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 24px", fontFamily: "var(--font-body)" }}>
      <p style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, color: "var(--c-gold)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>Nabídka</p>
      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 600, color: "var(--c-dark)", letterSpacing: "-0.01em", lineHeight: 1.1, marginBottom: 12 }}>Palivo</h1>
      <p style={{ fontSize: 16, color: "var(--c-text-muted)", lineHeight: 1.7, marginBottom: 48 }}>
        Palivové dřevo, brikety, pelety a štěpka. Objednávka online, platba kartou nebo při převzetí.
      </p>

      {items.length === 0 ? (
        <p style={{ textAlign: "center", color: "var(--c-text-muted)", marginTop: 48 }}>
          Momentálně nemáme žádné produkty v nabídce.
        </p>
      ) : (
        <div style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
          {items.map((p) => (
            <div
              key={p.id}
              style={{ display: "flex", flexDirection: "column", border: "1px solid var(--c-border)", background: "var(--c-cream-dark)", padding: 24 }}
            >
              <div style={{ marginBottom: 16, height: 140, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--c-cream)", border: "1px solid var(--c-border)", fontSize: 40 }}>
                🪵
              </div>

              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 600, color: "var(--c-dark)", marginBottom: 4 }}>{p.name}</h2>
              {p.description && (
                <p style={{ fontSize: 14, color: "var(--c-text-muted)", lineHeight: 1.6, marginBottom: 8 }}>{p.description}</p>
              )}

              <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid var(--c-border)", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                <div>
                  <span style={{ fontFamily: "var(--font-heading)", fontSize: 24, fontWeight: 600, color: "var(--c-gold)" }}>
                    {formatPrice(p.priceB2c)}
                  </span>
                  <span style={{ fontSize: 13, color: "var(--c-text-muted)", marginLeft: 4 }}>
                    / {UNIT_LABELS[p.unit] ?? p.unit}
                  </span>
                </div>
                <span style={{ fontSize: 12, color: p.stock > 0 ? "#6B7A5A" : "#A05A5A" }}>
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
                  style={{ marginTop: 16, width: "100%", background: "var(--c-border)", color: "var(--c-text-muted)", padding: "10px 16px", fontSize: 13, fontWeight: 600, border: "none", cursor: "not-allowed" }}
                >
                  Vyprodáno
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <CartNav />
    </main>
  );
}
