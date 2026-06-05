import { MillingForm } from "@/components/MillingForm";
import { PageLayout } from "@/components/PageLayout";

export const metadata = {
  title: "Pořez dřeva | Pila",
  description: "Pořez dřeva na zakázku. Poptejte se online.",
};

export default function MillingPage() {
  return (
    <PageLayout>
      <h1 className="text-3xl font-bold tracking-tight text-stone-900">Pořez dřeva na zakázku</h1>
      <p className="mt-3 text-stone-500">
        Nařežeme vaše vlastní klády nebo dodáme hotové řezivo — prkna, fošny i hranoly.
        Cenu dohodnem telefonicky po upřesnění rozměrů.
      </p>
      <div className="mt-8">
        <MillingForm />
      </div>
    </PageLayout>
  );
}
