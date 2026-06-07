import { MillingForm } from "@/components/MillingForm";
import { PageLayout } from "@/components/PageLayout";
export const metadata = { title: "Pořez dřeva | Pila" };
export default function Page() {
  return (
    <PageLayout>
      <p style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, color: "var(--c-gold)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>Poptávka</p>
      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800, color: "var(--c-dark)", letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: 16 }}>Pořez dřeva na zakázku</h1>
      <p style={{ fontSize: 16, color: "var(--c-text-muted)", lineHeight: 1.7, marginBottom: 40 }}>Nařežeme vaše vlastní klády nebo dodáme hotové řezivo — prkna, fošny i hranoly. Cenu dohodnem telefonicky.</p>
      <MillingForm />
    </PageLayout>
  );
}
