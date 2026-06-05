import { MillingForm } from "@/components/MillingForm";

export const metadata = {
  title: "Pořez dřeva na zakázku | Portál pily",
  description:
    "Nařežeme vaše klády nebo dodáme hotové řezivo přesně na míru. Poptejte se — zavoláme s cenou.",
};

export default function MillingPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-stone-900">
        Pořez dřeva na zakázku
      </h1>
      <p className="mt-3 text-stone-600">
        Nařežeme vaše vlastní klády, nebo vám dodáme hotové řezivo — prkna, fošny i hranoly.
        Cenu vždy dohodneme telefonicky po upřesnění rozměrů a objemu.
      </p>

      <div className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Raději zavoláte?{" "}
        <a
          href={`tel:${process.env.NEXT_PUBLIC_SITE_PHONE ?? "+420000000000"}`}
          className="font-semibold underline"
        >
          {process.env.NEXT_PUBLIC_SITE_PHONE ?? "+420 000 000 000"}
        </a>
      </div>

      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold text-stone-800">Poptávkový formulář</h2>
        <p className="mb-6 text-sm text-stone-500">
          Vyplňte níže a my vás do 24 hodin kontaktujeme s cenou.
        </p>
        <MillingForm />
      </section>
    </main>
  );
}
