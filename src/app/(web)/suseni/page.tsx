import { DryingForm } from "@/components/DryingForm";

export const metadata = {
  title: "Sušení dřeva | Portál pily",
  description:
    "Profesionální sušení dřeva v komorové sušárně. Poptejte se a my vám zavoláme s cenou.",
};

export default function DryingPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      {/* Záhlaví */}
      <h1 className="text-3xl font-bold tracking-tight text-stone-900">Sušení dřeva</h1>
      <p className="mt-3 text-stone-600">
        Sušíme dřevo v moderní komorové sušárně. Výsledkem je stabilní řezivo s přesně
        požadovanou vlhkostí — ideální pro truhlářské a stavební práce.
      </p>

      {/* Orientační telefon — vždy viditelný */}
      <div className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Raději zavoláte?{" "}
        <a
          href={`tel:${process.env.NEXT_PUBLIC_SITE_PHONE ?? "+420000000000"}`}
          className="font-semibold underline"
        >
          {process.env.NEXT_PUBLIC_SITE_PHONE ?? "+420 000 000 000"}
        </a>
      </div>

      {/* Formulář */}
      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold text-stone-800">Poptávkový formulář</h2>
        <p className="mb-6 text-sm text-stone-500">
          Vyplňte níže a my vás do 24 hodin kontaktujeme s orientační cenou.
        </p>
        <DryingForm />
      </section>
    </main>
  );
}
