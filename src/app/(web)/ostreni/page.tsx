import { SharpeningForm } from "@/components/SharpeningForm";
import { PageLayout } from "@/components/PageLayout";
export const metadata = { title: "Ostření kotoučů | Pila" };
export default function Page() {
  return (
    <PageLayout>
      <p style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, color: "var(--c-gold)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>Poptávka</p>
      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: 16 }}>Ostření kotoučů a pásů</h1>
      <p style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: 40 }}>Naostříme kotouče i pásy. Přivezte k nám — hotové vrátíme zpravidla druhý den.</p>
      <SharpeningForm />
    </PageLayout>
  );
}
