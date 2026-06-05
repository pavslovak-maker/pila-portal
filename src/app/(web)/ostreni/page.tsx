import { SharpeningForm } from "@/components/SharpeningForm";

export const metadata = {
  title: "Ostření pilových kotoučů a pásů | Portál pily",
  description:
    "Naostříme pilové kotouče i pásy. Přivezte k nám — výsledek je ostrý jako nový.",
};

export default function SharpeningPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-stone-900">
        Ostření pilových kotoučů a pásů
      </h1>
      <p className="mt-3 text-stone-600">
        Naostříme kotouče i pásy pro pily všech typů. Stačí přivézt — hotové vrátíme zpravidla
        do druhého dne. Cenu sdělíme telefonicky po upřesnění počtu a průměrů.
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
          Vyplňte níže a my vás do 24 hodin kontaktujeme.
        </p>
        <SharpeningForm />
      </section>
    </main>
  );
}
