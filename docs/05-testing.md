# 05 — Testovací strategie

> Princip: **kód bez testů není hotový.** Ale testuj podle rizika a návratnosti, ne 100 %
> všeho. Nejvyšší ROI: čistá business logika (kalkulačka, ceny, sklad) a dvě kritické cesty.

## Pyramida

| Vrstva | Nástroj | Co pokrýt |
|---|---|---|
| Unit | Vitest | kalkulačka, výpočet součtu objednávky, kontrola skladu, formátování cen |
| Integration | Vitest + Testcontainers (Postgres) | Server Actions proti reálné DB (idempotence, transakce) |
| E2E | Playwright | 2 kritické cesty + admin |
| Smoke | Playwright (proti produkci) | po deployi: titulka, odeslání poptávky, načtení e-shopu |

## Kritické cesty pro E2E (musí existovat)

1. **Odeslání poptávky na sušení** → potvrzení na stránce + záznam v DB + notifikace queued.
2. **Objednávka paliva (při převzetí)** → vytvoření objednávky + snížení skladu + potvrzení.
   (Karta se v E2E testuje přes Stripe test mode nebo se mockuje webhook.)

## Příklady testů

### Unit — kalkulačka (čistá funkce)
```ts
import { describe, it, expect } from "vitest";
import { calcDryingPrice } from "@/lib/quote";

describe("calcDryingPrice", () => {
  it("násobí objem cenou za m³ a vrací haléře", () => {
    expect(calcDryingPrice(3, 50000)).toBe(150000); // 3 m³ * 500 Kč
  });
  it("zaokrouhluje na celé haléře", () => {
    expect(calcDryingPrice(2.5, 49999)).toBe(124998);
  });
});
```

### Integration — idempotence poptávky
```ts
it("druhé odeslání se stejným idempotencyKey nevytvoří duplicitu", async () => {
  const key = crypto.randomUUID();
  const input = { type: "drying", payload: validDrying, contactName: "Jan",
                  contactPhone: "777111222", idempotencyKey: key };
  const a = await submitInquiry(input);
  const b = await submitInquiry(input);
  expect(a.ok && b.ok).toBe(true);
  const rows = await db.select().from(inquiries).where(eq(inquiries.idempotencyKey, key));
  expect(rows.length).toBe(1); // jen jeden záznam
});
```

### Integration — sklad
```ts
it("objednávka nad skladovou zásobu selže a nezmění stav", async () => {
  // produkt se stock=2, objednávka quantity=5
  const res = await createOrder(orderWithQty(5));
  expect(res.ok).toBe(false);
  // ověř, že žádná objednávka ani snížení skladu neproběhlo
});
```

### E2E — poptávka sušení (Playwright)
```ts
test("uživatel odešle poptávku na sušení", async ({ page }) => {
  await page.goto("/suseni");
  await page.getByLabel("Dřevina").fill("dub");
  await page.getByLabel("Objem (m³)").fill("3");
  await page.getByLabel("Telefon").fill("777111222");
  await page.getByLabel("Jméno").fill("Jan Novák");
  await page.getByRole("button", { name: /odeslat/i }).click();
  await expect(page.getByText(/děkujeme/i)).toBeVisible();
});
```

## Co NEtestovat přehnaně

- Statické marketingové stránky (titulka, o nás) — stačí smoke test, že se načtou.
- Externí služby (Stripe, Resend) — mockuj jejich rozhraní, netestuj jejich vnitřek.

## CI

- Na každý push: `lint` + `typecheck` + `vitest` (unit + integration).
- Před deployem na produkci: Playwright E2E proti preview prostředí.
- Po deployi: smoke test proti produkci.
