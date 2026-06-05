import { DryingForm } from "@/components/DryingForm";
import { PageLayout } from "@/components/PageLayout";

export const metadata = {
  title: "Sušení dřeva | Pila",
  description: "Profesionální sušení dřeva v komorové sušárně. Poptejte se online.",
};

export default function DryingPage() {
  return (
    <PageLayout>
      <h1 className="text-3xl font-bold tracking-tight text-stone-900">Sušení dřeva</h1>
      <p className="mt-3 text-stone-500">
        Sušíme dřevo v moderní komorové sušárně. Výsledkem je stabilní řezivo
        s přesnou vlhkostí — ideální pro truhláře i stavbaře.
      </p>
      <div className="mt-8">
        <DryingForm />
      </div>
    </PageLayout>
  );
}
