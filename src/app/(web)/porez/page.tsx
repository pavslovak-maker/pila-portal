import { MillingForm } from "@/components/MillingForm";
import { PageLayout } from "@/components/PageLayout";
export const metadata = { title: "Pořez dřeva | Pila" };
export default function Page() {
  return (
    <PageLayout>
      <p style={{ fontFamily: "var(--font-heading)", fontSize: 12, fontWeight: 600, color: "#c8441b", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>Poptávka</p>
      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 700, textTransform: "uppercase", color: "#1a3a2a", letterSpacing: "-0.01em", marginBottom: 16 }}>Pořez dřeva na zakázku</h1>
      <p style={{ fontSize: 16, color: "#4a5e4f", lineHeight: 1.7, marginBottom: 40 }}>Nařežeme vaše vlastní klády nebo dodáme hotové řezivo — prkna, fošny i hranoly. Cenu dohodnem telefonicky.</p>
      <MillingForm />
    </PageLayout>
  );
}
