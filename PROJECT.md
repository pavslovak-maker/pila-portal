# Portál pily — hlavní specifikace

> **Pro AI nástroj (Cursor / Claude Code):** Tento soubor je vstupní bod. Než začneš
> generovat kód, přečti si i soubory ve složce `docs/`. Drž se rozhodnutí zde uvedených.
> Neměň technologický stack ani datový model bez výslovného pokynu. Když něco není
> specifikováno, zvol nejjednodušší robustní variantu a **napiš komentář `// DECISION:`**,
> proč ses tak rozhodl.

## 1. Co stavíme

Webový portál pro pilu / dřevozpracující provoz, který sjednocuje tři služby a sám sbírá
poptávky, zatímco majitel je ve výrobě. Cílový uživatel: majitel je jediná obsluha, takže
**každá poptávka i objednávka musí být zachycena bez výjimky** — ztráta poptávky = ztráta
zakázky.

### Služby (jádro)
1. **Pořez dřeva na zakázku** — poptávka přes formulář, ocenění telefonem. Nejde o automatickou cenu.
2. **Sušení dřeva** — poptávka + orientační kalkulačka ceny. (Rezervační kalendář až ve fázi 2.)
3. **Palivo** (palivové dříví, brikety, pelety, štěpka) — klasický e-shop s košíkem a platbou.
4. **Ostření pilových kotoučů a pásů** — poptávka přes formulář (stejný mechanismus jako 1).

## 2. Rozsah podle fází (DŮLEŽITÉ — nestav vše najednou)

### FÁZE 1 = MVP (stav toto jako první a kompletní)
- Tři poptávkové formuláře (pořez, sušení, ostření) — **jedna entita `inquiry`**.
- Orientační **kalkulačka** pro sušení (a palivo), čte ceny **z databáze**, ne z kódu.
- **E-shop na palivo**: katalog, košík, objednávka, platba kartou (Stripe) + „platba při převzetí“.
- **Admin** (jednoduchá tabulka) pro majitele: seznam poptávek a objednávek, změna stavu.
- **Notifikace majiteli** při nové poptávce/objednávce (e-mail, volitelně Telegram).
- **Upload fotek** klád u poptávky pořezu.
- SEO: titulka, stránky služeb, blog/poradna (statické MD články).

### FÁZE 2 (NEstav teď, jen nech architekturu otevřenou)
- Rezervační kalendář sušárny (kapacita dávky + délka cyklu).
- B2B režim: přihlášení truhláře, vlastní ceny, historie, opakovaná objednávka.
- Placené uskladnění řeziva.
- Věrnostní program.

> **Pravidlo:** Fáze 2 se nestaví, ale datový model a kód nesmí fázi 2 blokovat
> (např. `customers.role`, `products.price_b2b` už existují v modelu).

## 3. Technologický stack (NEMĚNIT)

| Vrstva | Volba | Proč |
|---|---|---|
| Framework | **Next.js 15, App Router, TypeScript** | jedna kodebáze (web+API+admin), SSR pro SEO |
| Mutace dat | **Server Actions** | formuláře a objednávky bez budování REST vrstvy (KISS) |
| DB | **PostgreSQL** (Supabase nebo Neon) | jedna relační DB stačí; jsonb pro payload poptávek |
| ORM | **Drizzle ORM** | typově bezpečné, lehké, blízko SQL |
| Validace | **Zod** | jedno schéma sdílené klient ↔ server |
| Platby | **Stripe** | Payment Intents; „při převzetí“ = jen stav objednávky |
| Upload souborů | **presigned URL** do S3/R2 | soubory nejdou přes náš server |
| Styl/UI | **Tailwind CSS + shadcn/ui** | rychlé, konzistentní, čitelné |
| E-maily | **Resend** (nebo SMTP) | notifikace majiteli a potvrzení zákazníkovi |
| Chyby/monitoring | **Sentry** | zachycení produkčních chyb |
| Logging | **pino** (strukturovaný JSON) | `requestId` u každé poptávky/objednávky |
| Hosting | **Vercel** | nativní pro Next.js, levné na start |
| Testy | **Vitest** (unit/integration) + **Playwright** (E2E) | |

## 4. Architektonické principy

- **KISS > chytrost.** Nepoužívej microservices, message bus, GraphQL. Monolit v Next.js.
- **DRY:** poptávky pořez/sušení/ostření = jedna tabulka `inquiry` s `type` + `payload jsonb`.
- **Typová bezpečnost end-to-end:** Zod schéma → TS typ → Drizzle → UI. Žádné `any`.
- **Hranice = validace:** každý vstup ze světa projde Zod schématem na serveru.
- **Idempotence:** formuláře i objednávky mají `idempotency_key` (lidé dvojklikají).
- **Fallback nikdy nezahodí poptávku:** selže-li platba/e-mail, záznam se uloží jako
  `pending`/`failed` a zůstane viditelný v adminu. Nikdy `throw` směrem k uživateli bez záchrany dat.
- **Ceny ber z DB** (`pricing_rules`), aby změna ceny nevyžadovala deploy.
- **Snapshot ceny** v `order_items` — historická objednávka nesmí změnit cenu zpětně.

## 5. Klíčová pravidla chování (business rules)

- Kalkulačka je vždy označená jako **„orientační, potvrdíme telefonem“** — nikdy závazná.
- Objednávka paliva je závazná až po úspěšné platbě (karta) nebo potvrzení „při převzetí“.
- Poptávka (pořez/sušení/ostření) **nikdy negeneruje platbu** — jen záznam + notifikaci.
- Sklad paliva: při objednávce ověř `stock`; nedovol objednat víc, než je skladem.
- Každá nová poptávka/objednávka → okamžitá notifikace majiteli (kritická cesta).

## 6. Struktura webu (stránky)

- `/` — titulka: 3 velká tlačítka (Pořez / Sušení / Palivo) + viditelný telefon.
- `/porez` — popis + formulář + upload fotek.
- `/suseni` — popis + kalkulačka + formulář.
- `/ostreni` — popis + formulář.
- `/palivo` — katalog produktů (e-shop).
- `/palivo/kosik` — košík + objednávka + platba.
- `/poradna` — blog (statické MD články, SEO).
- `/poradna/[slug]` — článek.
- `/o-nas` — kdo jsme, fotky provozu.
- `/kontakt` — kontakt + mapa.
- `/admin` — chráněná tabulka poptávek a objednávek (jen majitel).

## 7. Pořadí implementace (doporučené pro AI)

1. Inicializace projektu + stack + `.env.example` (viz `docs/06-setup-deployment.md`).
2. Datový model + migrace (viz `docs/02-data-model.md`).
3. `inquiry` Server Action + Zod schéma + jeden formulář (sušení) end-to-end.
4. Zbylé dva formuláře (pořez s uploadem, ostření) — sdílí stejnou akci.
5. Kalkulačka čtoucí z `pricing_rules`.
6. E-shop paliva: katalog → košík → objednávka → Stripe.
7. Notifikace majiteli + e-mail zákazníkovi.
8. Admin tabulka.
9. Statické stránky + blog + SEO.
10. Testy (viz `docs/05-testing.md`).

## Mapa dokumentů

- `docs/01-architecture.md` — architektura, trade-offs, rizika.
- `docs/02-data-model.md` — schéma DB + Drizzle definice.
- `docs/03-api-server-actions.md` — Server Actions, Zod schémata, klíčový kód.
- `docs/04-frontend-ux.md` — obrazovky, komponenty, UX poznámky.
- `docs/05-testing.md` — testovací strategie + příklady testů.
- `docs/06-setup-deployment.md` — env, setup, deploy, provoz.
- `docs/07-security-operations.md` — bezpečnost, logging, monitoring, fallbacky.
