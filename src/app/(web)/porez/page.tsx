import { MillingForm } from "@/components/MillingForm";
import { PageLayout } from "@/components/PageLayout";

export const metadata = { title: "Pořez dřeva | Pila", description: "Pořez dřeva na zakázku." };

export default function MillingPage() {
  return (
    <PageLayout>
      <h1 style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 700, letterSpacing: "-0.03em", color: "#1d1d1f", marginBottom: 12 }}>Pořez dřeva na zakázku</h1>
      <p style={{ fontSize: 17, color: "#6e6e73", lineHeight: 1.6, marginBottom: 40 }}>
        Nařežeme vaše vlastní klády nebo dodáme hotové řezivo — prkna, fošny i hranoly. Cenu dohodnem telefonicky.
      </p>
      <MillingForm />
    </PageLayout>
  );
}
