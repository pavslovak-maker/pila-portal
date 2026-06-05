# 07 — Bezpečnost a provoz

## Bezpečnost

### Vstupy a validace
- **Každý** vstup ze světa projde Zod schématem na serveru (ne jen na klientu).
- Nikdy nedůvěřuj klientovi v ceně, stavu ani skladu — ceny a stav počítá server z DB.
- Stav objednávky `paid` nastavuje **výhradně Stripe webhook** s ověřeným podpisem.

### Platby
- Částku do Stripe počítá server z `products` v DB, ne z klienta.
- Webhook ověřuje podpis (`STRIPE_WEBHOOK_SECRET`), jinak request zahodí.
- Webhook je idempotentní (opakované doručení téže události nic nerozbije).

### Upload souborů
- Presigned URL se vydá až po kontrole typu (`image/jpeg|png|webp`) a velikosti (max ~8 MB).
- Bucket je zapsatelný jen přes presigned URL, čtení přes veřejnou CDN base URL.

### Admin / autentizace
- Admin je jediný uživatel (majitel). **Nejjednodušší bezpečná varianta: magic link**
  (přihlášení přes e-mail, žádná správa hesel). E-mail musí odpovídat `ADMIN_EMAIL`.
- Admin cesty (`/admin/*`) chráněné middlewarem — bez platné session redirect na login.
- Fáze 2 (B2B login truhlářů) použije stejný magic-link mechanismus + `customers.role`.

### Anti-spam
- **Honeypot** skryté pole ve formulářích (boti ho vyplní → zahodit).
- **Rate-limit** na Server Actions formulářů podle IP (např. 5 poptávek / 10 min).
- CAPTCHA (Turnstile) nasadit až při reálném zneužití — nezdržuj poctivé uživatele předem.

### Hlavičky a hygiena
- Bezpečnostní hlavičky (CSP, HSTS) v `next.config` / middleware.
- Žádné tajné klíče v klientském kódu (jen `NEXT_PUBLIC_*` jsou veřejné).
- Závislosti pravidelně aktualizovat (`pnpm audit`).

## Logging

- **pino**, strukturovaný JSON. Každá poptávka/objednávka má `reqId`.
- Logovat: přijetí poptávky, vytvoření objednávky, výsledek platby, selhání notifikace.
- **Nelogovat** citlivá data (celé kontakty redukovat, žádné platební údaje — ty drží Stripe).
- Úrovně: `info` pro business události, `error` pro selhání, `warn` pro fallbacky.

## Monitoring a alerting

- **Sentry** zachytává neočekávané chyby (frontend i server) + alert na e-mail.
- **Business alert majiteli** je důležitější než infra metriky: každá nová poptávka/objednávka
  → e-mail (Resend) a **volitelně Telegram** jako druhý nezávislý kanál. Když selže jeden,
  projde druhý — poptávka se neztratí.
- Jednoduchý uptime monitor (např. Better Stack / UptimeRobot) na `/` a `/palivo`.
- V adminu zvýraznit objednávky ve stavu `failed` a notifikace ve stavu `failed`
  (vyžadují ruční pozornost).

## Fallback scénáře (nikdy neztratit poptávku)

| Selhání | Chování |
|---|---|
| E-mail (Resend) nedostupný | Poptávka už je v DB. Notifikace se uloží jako `failed`, zaloguje se, jde poslat znovu z adminu. Volitelný Telegram kanál to zachytí. |
| Telegram nedostupný | Stejné — e-mail jako primární kanál stačí. |
| Stripe nedostupný / platba selže | Objednávka zůstane `pending`/`failed`, viditelná v adminu. Uživateli nabídnout „zkusit znovu“ nebo „platbu při převzetí“. |
| S3/R2 upload selže | Poptávku lze odeslat i bez fotek (fotky jsou volitelné); chybu zobrazit, ale neblokovat odeslání. |
| DB transakce selže | Nic se neuloží (atomicita), uživatel dostane hlášku „zkuste znovu / zavolejte“. |
| Dvojklik / opakované odeslání | `idempotency_key` → druhý pokus je no-op, uživatel vidí úspěch. |

**Zlaté pravidlo:** uložení poptávky/objednávky do DB je kritická cesta a je atomické.
Notifikace, e-maily a fotky jsou nekritické vrstvy — jejich selhání nikdy neshodí
uložení dat ani nezahodí zakázku.

## Rizika a omezení

- **Jediná obsluha (majitel) je úzké hrdlo.** Technologie zvládne mnohem víc poptávek,
  než stihne jeden člověk odbavit telefonem. Proto je dvojitá notifikace a přehledný admin
  nejdůležitější část systému.
- **Kalkulačka je jen orientační.** Reálné ocenění (hlavně pořez) vždy potvrzuje člověk.
- **Vendor lock-in** (Vercel, Stripe, Resend, R2) je vědomě přijatý kvůli rychlosti a ceně;
  všechny mají standardní rozhraní a lze je v budoucnu vyměnit.
- **Fáze 2 (rezervace, B2B, sklad)** se staví až podle reálné poptávky, ne dopředu.
