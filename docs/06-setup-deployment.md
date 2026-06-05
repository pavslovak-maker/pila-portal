# 06 — Setup a deployment

## Předpoklady

- Node.js LTS (≥ 20), pnpm (nebo npm).
- Účty: Vercel, Neon/Supabase (Postgres), Stripe, Resend, Cloudflare R2 nebo AWS S3, Sentry.

## Inicializace projektu

```bash
pnpm create next-app@latest pila-portal --typescript --tailwind --app --eslint
cd pila-portal
pnpm add drizzle-orm postgres zod react-hook-form @hookform/resolvers \
         stripe @stripe/stripe-js @stripe/react-stripe-js resend pino \
         @sentry/nextjs
pnpm add -D drizzle-kit vitest @playwright/test @testcontainers/postgresql
npx shadcn@latest init
```

## Struktura repozitáře

```
pila-portal/
├─ PROJECT.md              # hlavní specifikace (číst první)
├─ docs/                   # tyto podklady
├─ src/
│  ├─ app/
│  │  ├─ (web)/            # veřejné stránky
│  │  ├─ admin/            # chráněný admin
│  │  ├─ actions/          # Server Actions (inquiry.ts, order.ts, ...)
│  │  └─ api/stripe/webhook/route.ts
│  ├─ db/                  # schema.ts, index.ts (klient), migrace
│  ├─ lib/                 # schemas.ts, result.ts, quote.ts, stripe.ts, notify.ts, logger.ts
│  └─ components/          # sdílené komponenty
├─ content/poradna/        # MD články blogu
├─ tests/                  # unit, integration, e2e
└─ drizzle.config.ts
```

## .env.example

```bash
# Databáze
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# E-mail (Resend)
RESEND_API_KEY="re_..."
OWNER_EMAIL="majitel@pila.cz"          # kam chodí notifikace o poptávkách

# Telegram notifikace (volitelný druhý kanál, doporučeno)
TELEGRAM_BOT_TOKEN=""
TELEGRAM_CHAT_ID=""

# Úložiště fotek (Cloudflare R2 / AWS S3)
S3_ENDPOINT=""
S3_BUCKET="pila-uploads"
S3_ACCESS_KEY_ID=""
S3_SECRET_ACCESS_KEY=""
S3_PUBLIC_BASE_URL=""                   # veřejná base URL pro čtení fotek

# Admin přístup (viz 07-security)
ADMIN_EMAIL="majitel@pila.cz"
AUTH_SECRET=""                          # tajný klíč pro session/magic link

# Sentry
SENTRY_DSN=""
```

## Migrace DB

```bash
# drizzle.config.ts ukazuje na src/db/schema.ts
pnpm drizzle-kit generate   # vygeneruje SQL migrace
pnpm drizzle-kit migrate    # aplikuje na DB
pnpm tsx src/db/seed.ts     # naplní seed data (produkty, pricing_rules, admin)
```

## Stripe webhook (lokálně i produkce)

```bash
# Lokálně přesměruj webhook na dev server:
stripe listen --forward-to localhost:3000/api/stripe/webhook
# Na produkci: ve Stripe dashboardu nastav endpoint na https://.../api/stripe/webhook
# a vlož signing secret do STRIPE_WEBHOOK_SECRET.
```

## Deploy (Vercel)

1. Propoj GitHub repo s Vercelem.
2. Vlož všechny env proměnné do Vercel projektu (Production + Preview).
3. Push do `main` → produkce; PR → preview prostředí (na něm běží E2E).
4. Po deployi nastav Stripe webhook na produkční URL.

## Provozní checklist po nasazení

- [ ] Odeslat testovací poptávku → přišla notifikace majiteli?
- [ ] Testovací objednávka kartou (Stripe test) → webhook nastavil `paid`, snížil sklad?
- [ ] Objednávka „při převzetí“ → vznikla, majitel ji vidí v adminu?
- [ ] Upload fotky funguje a fotka je viditelná?
- [ ] Sentry zachytává chyby (vyvolej testovací chybu)?
- [ ] Blog stránky se indexují (sitemap.xml, robots.txt)?
