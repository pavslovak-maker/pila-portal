# 04 — Frontend / UX

> UI: **Tailwind + shadcn/ui**. Formuláře: **react-hook-form + @hookform/resolvers/zod**
> (stejné Zod schéma jako server). Klient validuje pro UX, server validuje pro bezpečnost.

## Designové principy

- Cílová skupina je smíšená (truhláři i běžní lidé). **Velká tlačítka, jasný telefon,
  fotky z provozu.** U řemesla lidé kupují důvěru — fotky strojů a dílny prodávají.
- Mobil first. Velká část poptávek přijde z telefonu (lidé „od dřeva“).
- Každá služba má vždy dvě cesty: **formulář** i **viditelné telefonní číslo**. Spousta
  lidí raději zavolá; nenuť je do formuláře.
- Kalkulačka ukazuje cenu okamžitě a vždy s popiskem **„orientační, potvrdíme telefonem“**.

## Mapa obrazovek

### `/` Titulka
- Hero s fotkou provozu + claim + telefon (sticky v hlavičce na mobilu).
- Tři velké dlaždice: **Pořez** / **Sušení** / **Palivo** → odkazy na podstránky.
- Pás důvěry: pár fotek strojů, „kde nás najdete“.
- Patička: kontakt, mapa, odkaz na poradnu.

### `/porez`
- Popis služby + fotky.
- Formulář (milling): režim (vlastní klády / hotové řezivo), dřevina, objem m³, typ řeziva,
  tloušťka, orientační termín, **upload fotek klád**, kontakt.
- CTA: „Odeslat poptávku — ozveme se s cenou.“

### `/suseni`
- Popis + **kalkulačka** (dřevina + objem → orientační cena).
- Formulář (drying): dřevina, objem, výchozí stav, cílová vlhkost, termín, kontakt.

### `/ostreni`
- Popis (kotouče i pásy — „přivezu k naostření“).
- Formulář (sharpening): typ nástroje, počet, průměr (volitelně), kontakt.

### `/palivo` (e-shop)
- Katalog produktů (karta: foto, název, jednotka, cena, skladem).
- Tlačítko „do košíku“ s výběrem množství.

### `/palivo/kosik`
- Položky, množství (editovatelné), součet.
- Výběr: vyzvednutí / doprava (+ adresa), platba kartou / při převzetí.
- Kontaktní údaje.
- Karta → Stripe Payment Element. Při převzetí → rovnou potvrzení.

### `/poradna` + `/poradna/[slug]`
- Seznam článků + detail. Články jsou statické MD (SSG) kvůli SEO.
- Témata: „jak dlouho schne dub“, „měkké vs. tvrdé palivo“, „kdy řezat dřevo“.

### `/o-nas`, `/kontakt`
- Příběh, fotky, lidé. Kontakt + mapa (embed) + otevírací doba.

### `/admin` (chráněné)
- Tabulka poptávek (filtr podle typu a stavu) + detail + změna stavu.
- Tabulka objednávek + detail + změna stavu.
- Jednoduchý editor `pricing_rules` a `products` (cena, sklad, aktivní).

## Sdílené komponenty

```
<ServiceTile />        // dlaždice služby na titulce
<InquiryForm type />   // jeden formulář, pole se mění podle type (sdílí submitInquiry)
<DryingCalculator />   // volá quoteDrying, debounce, zobrazí orientační cenu
<PhotoUpload />        // presigned URL upload, náhledy, limit počtu/velikosti
<ProductCard />        // karta produktu v e-shopu
<CartSummary />        // souhrn košíku
<StatusBadge />        // barevný stav (new/paid/...) v adminu
```

## UX detaily, které se obvykle zapomínají

- **Po odeslání formuláře**: jasné potvrzení („Děkujeme, ozveme se do 24 h na telefon X“),
  ne jen prázdná stránka. Tlačítko odeslat se po kliknutí zablokuje (zabrání dvojkliku
  i na úrovni UI; idempotency_key to jistí na serveru).
- **Chybové stavy**: srozumitelná česká hláška, ne technický text. „Něco se nepovedlo,
  zavolejte nám na X“ je lepší než ticho.
- **Kalkulačka bez ceny** (chybí rule): „Pro tuto dřevinu vám cenu rádi řekneme telefonicky.“
- **Prázdný košík**, **vyprodáno**, **doprava bez adresy** — všechny ošetřit textem.
- **Loading stavy** u kalkulačky a odesílání (spinner / disabled).

## Klientská část formuláře (vzor)

```tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { dryingPayload } from "@/lib/schemas";
import { submitInquiry } from "@/app/actions/inquiry";

export function DryingForm() {
  const form = useForm({ resolver: zodResolver(dryingPayload) });
  const onSubmit = async (values: any) => {
    const res = await submitInquiry({
      type: "drying",
      payload: values,
      contactName: values.contactName, // ... mapování kontaktu
      idempotencyKey: crypto.randomUUID(), // generuj jednou per formulář
    });
    if (res.ok) { /* zobraz potvrzení */ } else { /* zobraz res.error */ }
  };
  // ... pole + <button disabled={form.formState.isSubmitting}>
}
```
