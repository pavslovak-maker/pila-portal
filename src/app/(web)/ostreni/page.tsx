import { SharpeningForm } from "@/components/SharpeningForm";
import { PageLayout } from "@/components/PageLayout";

export const metadata = { title: "Ostření kotoučů | Pila", description: "Ostření pilových kotoučů a pásů." };

export default function SharpeningPage() {
  return (
    <PageLayout>
      <h1 style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 700, letterSpacing: "-0.03em", color: "#1d1d1f", marginBottom: 12 }}>Ostření pilových kotoučů a pásů</h1>
      <p style={{ fontSize: 17, color: "#6e6e73", lineHeight: 1.6, marginBottom: 40 }}>
        Naostříme kotouče i pásy. Přivezte k nám — hotové vrátíme zpravidla druhý den.
      </p>
      <SharpeningForm />
    </PageLayout>
  );
}
