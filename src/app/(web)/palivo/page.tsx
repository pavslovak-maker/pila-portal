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
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-stone-900">Palivo</h1>
      <p className="mt-2 text-stone-600">
        Palivové dřevo, brikety, pelety a štěpka. Objednávka online, platba kartou nebo při
        převzetí.
      </p>

      {items.length === 0 ? (
        <p className="mt-12 text-center text-stone-400">
          Momentálně nemáme žádné produkty v nabídce.
        </p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <div
              key={p.id}
              className="flex flex-col rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
            >
              {/* Placeholder pro fotku */}
              <div className="mb-4 flex h-36 items-center justify-center rounded-lg bg-stone-100 text-4xl">
                🪵
              </div>

              <h2 className="font-semibold text-stone-900">{p.name}</h2>
              {p.description && (
                <p className="mt-1 text-sm text-stone-500">{p.description}</p>
              )}

              <div className="mt-3 flex items-end justify-between">
                <div>
                  <span className="text-xl font-bold text-amber-700">
                    {formatPrice(p.priceB2c)}
                  </span>
                  <span className="ml-1 text-sm text-stone-400">
                    / {UNIT_LABELS[p.unit] ?? p.unit}
                  </span>
                </div>
                <span
                  className={`text-xs ${p.stock > 0 ? "text-green-600" : "text-red-500"}`}
                >
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
                  className="mt-4 w-full rounded-lg bg-stone-200 px-4 py-2 text-sm font-semibold text-stone-400"
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
