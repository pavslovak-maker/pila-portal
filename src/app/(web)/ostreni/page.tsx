import { SharpeningForm } from "@/components/SharpeningForm";
import { PageLayout } from "@/components/PageLayout";

export const metadata = {
  title: "Ostření kotoučů | Pila",
  description: "Ostření pilových kotoučů a pásů. Poptejte se online.",
};

export default function SharpeningPage() {
  return (
    <PageLayout>
      <h1 className="text-3xl font-bold tracking-tight text-stone-900">Ostření pilových kotoučů a pásů</h1>
      <p className="mt-3 text-stone-500">
        Naostříme kotouče i pásy. Přivezte k nám — hotové vrátíme zpravidla druhý den.
      </p>
      <div className="mt-8">
        <SharpeningForm />
      </div>
    </PageLayout>
  );
}
