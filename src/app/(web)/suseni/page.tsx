import { DryingForm } from "@/components/DryingForm";
import { PageLayout } from "@/components/PageLayout";

export const metadata = { title: "Sušení dřeva | Pila", description: "Profesionální sušení dřeva." };

export default function DryingPage() {
  return (
    <PageLayout>
      <h1 style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 700, letterSpacing: "-0.03em", color: "#1d1d1f", marginBottom: 12 }}>Sušení dřeva</h1>
      <p style={{ fontSize: 17, color: "#6e6e73", lineHeight: 1.6, marginBottom: 40 }}>
        Sušíme dřevo v moderní komorové sušárně. Výsledkem je stabilní řezivo s přesnou vlhkostí — ideální pro truhláře i stavbaře.
      </p>
      <DryingForm />
    </PageLayout>
  );
}
