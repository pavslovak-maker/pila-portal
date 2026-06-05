# 01 — Architektura

## Architektonické rozhodnutí

**Monolit v Next.js (App Router) na Vercelu + jedna PostgreSQL databáze.**

Vše — veřejný web, kalkulačka, e-shop, poptávkové formuláře, admin i notifikace — je
jedna kodebáze a jeden deploy. Důvod: provoz obsluhuje jeden člověk (majitel pily).
Jakákoli distribuovaná architektura (microservices, samostatné API, fronty) by přidala
provozní složitost bez jakéhokoli přínosu při tomto rozsahu.

```
┌─────────────────────────────────────────────┐
│                Next.js (Vercel)              │
│                                              │
│  Veřejné stránky (SSR/SSG) ── SEO            │
│  Kalkulačka (čte pricing_rules)              │
│  Formuláře ──► Server Actions ──► DB         │
│  E-shop ──► Server Actions ──► Stripe + DB   │
│  Admin (chráněný) ──► DB                     │
│                                              │
└───────┬───────────────┬─────────────┬────────┘
        │               │             │
   ┌────▼────┐    ┌──────▼─────┐  ┌────▼─────┐
   │Postgres │    │  Stripe    │  │ S3 / R2  │
   │(Drizzle)│    │ (platby)   │  │ (fotky)  │
   └─────────┘    └────────────┘  └──────────┘
        │
   ┌────▼─────────────────┐
   │ Resend (e-mail)      │  ◄── notifikace majiteli + zákazníkovi
   │ Sentry (chyby)       │
   └──────────────────────┘
```

## Proč ne WordPress / Webflow

Pro běžný web by to stačilo, ale tento projekt má tři věci, které je tam bolí:
B2B ceny (fáze 2), kalkulačka s logikou a vlastní stavový model poptávek. Na WordPressu
to znamená WooCommerce + mnoho pluginů = bezpečnostní a údržbové riziko, které jednočlenná
firma neutáhne. Webflow zase narazí na kalkulačku a B2B ceny. Next.js má vyšší vstupní
práci, ale je to jediná varianta s udržitelným stropem nahoru.

## Trade-offs

| Rozhodnutí | Co získáváme | Cena / riziko |
|---|---|---|
| Monolit Next.js | jednoduchost, 1 deploy, sdílené typy | nelze nezávisle škálovat části (při tomto rozsahu netřeba) |
| Server Actions místo REST | méně kódu, typová bezpečnost | horší pro veřejné API třetích stran (nepotřebujeme) |
| Jedna SQL DB | transakce, jednoduchost | nutná migrace při změně schématu |
| `inquiry` jako 1 tabulka + jsonb | DRY, snadné přidat typ služby | volnější typování payloadu (řešíme Zod schématem per type) |
| Ceny v DB | změna ceny bez deploye | nutný jednoduchý editor cen v adminu |
| Vercel | nulová správa serveru | vendor lock-in (přijatelný, lze migrovat na Node hosting) |

## Posouzení

- **Jednoduchost:** vysoká — jeden repozitář, jeden jazyk, jeden deploy.
- **Škálovatelnost:** dostatečná s velkou rezervou. Vercel + Postgres utáhne řádově
  tisíce poptávek měsíčně bez zásahu. Úzké hrdlo je majitel (telefon), ne technologie.
- **Udržovatelnost:** vysoká — typová bezpečnost end-to-end, malý počet závislostí.
- **Výkon:** SSG/SSR stránky jsou rychlé; kalkulačka je čistá funkce; e-shop má málo položek.
- **Náklady:** start ~0–25 €/měs (Vercel Hobby/Pro + Neon/Supabase free tier + Resend free).
  Stripe bere jen % z transakcí. Žádné fixní náklady na servery.
- **Bezpečnost:** viz `07-security-operations.md`.

## Edge cases (musí být ošetřeno)

- Dvojklik na odeslání → idempotency_key zabrání duplicitě.
- Výpadek Stripe → objednávka zůstane `pending`, majitel ji vidí v adminu, zákazník dostane
  jasnou hlášku „platba se nezdařila, zkuste znovu nebo zvolte platbu při převzetí“.
- Výpadek e-mailu (Resend) → poptávka už je uložená v DB; selhání notifikace se zaloguje
  a zobrazí v adminu jako „neodeslaná notifikace“. Data se nikdy neztratí.
- Objednávka paliva nad skladovou zásobu → blokováno před platbou.
- Upload obří/nevalidní fotky → limit velikosti a typu na presigned URL.
- Robot/spam ve formuláři → rate-limit + honeypot pole, CAPTCHA až při zneužití.

## Provozní rizika

1. **Jediná obsluha = úzké hrdlo.** Notifikace a admin musí být bezchybné. Doporučeno
   duplikovat notifikaci (e-mail + Telegram), aby se poptávka nikdy neztratila.
2. **Kalkulačka, co lže o ceně, poškodí důvěru víc než žádná.** Drž ji jako orientační.
3. **Vendor lock-in (Vercel/Stripe/Resend)** — přijatelný, vše má alternativu a migrace
   je možná díky standardním rozhraním (Node, Postgres, SMTP).
