import { PageLayout } from "@/components/PageLayout";
import Link from "next/link";

export const metadata = { title: "Poptávka | Pila" };

const SERVICES = [
  { href: "/porez", label: "Pořez dřeva", desc: "Nařežeme vaše vlastní klády nebo dodáme hotové řezivo — prkna, fošny i hranoly." },
  { href: "/suseni", label: "Sušení dřeva", desc: "Sušíme dřevo v moderní komorové sušárně. Výsledkem je stabilní řezivo s přesnou vlhkostí." },
  { href: "/palivo", label: "Palivo", desc: "Palivové dřevo, brikety, pelety a štěpka. Objednávka online." },
  { href: "/ostreni", label: "Ostření kotoučů", desc: "Naostříme kotouče i pásy. Přivezte k nám — hotové vrátíme zpravidla druhý den." },
];

export default function PoptavkaPage() {
  return (
    <PageLayout>
      <p style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, color: "var(--c-gold)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>
        Nezávazná poptávka
      </p>
      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 600, color: "var(--c-dark)", letterSpacing: "-0.01em", lineHeight: 1.1, marginBottom: 12 }}>
        O co máte zájem?
      </h1>
      <p style={{ fontSize: 15, color: "var(--c-text-muted)", lineHeight: 1.7, marginBottom: 48 }}>
        Vyberte službu, o kterou máte zájem, a vyplňte poptávkový formulář. Ozveme se do 24 hodin.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {SERVICES.map((s, i) => (
          <Link
            key={s.href}
            href={s.href}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 24,
              padding: "28px 0",
              borderTop: "1px solid var(--c-border)",
              borderBottom: i === SERVICES.length - 1 ? "1px solid var(--c-border)" : "none",
              textDecoration: "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: 24, fontWeight: 600, color: "var(--c-dark)", marginBottom: 4 }}>
                  {s.label}
                </div>
                <div style={{ fontSize: 14, color: "var(--c-text-muted)", lineHeight: 1.5 }}>
                  {s.desc}
                </div>
              </div>
            </div>
            <span style={{ color: "var(--c-gold)", fontSize: 20, flexShrink: 0 }}>→</span>
          </Link>
        ))}
      </div>
    </PageLayout>
  );
}
