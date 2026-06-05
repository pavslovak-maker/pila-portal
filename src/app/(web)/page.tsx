import Link from "next/link";

const PHONE = process.env.NEXT_PUBLIC_SITE_PHONE ?? "+420 000 000 000";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "Pila";

const SERVICES = [
  {
    href: "/porez",
    emoji: "🪚",
    title: "Pořez dřeva",
    desc: "Nařežeme vaše klády nebo dodáme hotové řezivo. Cenu dohodnem telefonicky.",
    cta: "Poptat pořez",
    color: "bg-amber-50 border-amber-200 hover:bg-amber-100",
    ctaColor: "bg-amber-600 hover:bg-amber-700",
  },
  {
    href: "/suseni",
    emoji: "🌡️",
    title: "Sušení dřeva",
    desc: "Komorová sušárna, přesná vlhkost. Ideální pro truhláře a stavbaře.",
    cta: "Poptat sušení",
    color: "bg-sky-50 border-sky-200 hover:bg-sky-100",
    ctaColor: "bg-sky-600 hover:bg-sky-700",
  },
  {
    href: "/palivo",
    emoji: "🪵",
    title: "Palivo",
    desc: "Palivové dřevo, brikety, pelety a štěpka. Objednávka online.",
    cta: "Koupit palivo",
    color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
    ctaColor: "bg-orange-600 hover:bg-orange-700",
  },
  {
    href: "/ostreni",
    emoji: "⚙️",
    title: "Ostření kotoučů",
    desc: "Naostříme pilové kotouče i pásy. Přivezte — hotové vrátíme druhý den.",
    cta: "Poptat ostření",
    color: "bg-stone-50 border-stone-200 hover:bg-stone-100",
    ctaColor: "bg-stone-700 hover:bg-stone-800",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-stone-900 px-4 py-16 text-center text-white">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{SITE_NAME}</h1>
        <p className="mt-3 text-lg text-stone-300">
          Pořez, sušení, palivo a ostření — vše na jednom místě.
        </p>
        <a
          href={"tel:" + PHONE.replace(/\s/g, "")}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-lg font-semibold text-white shadow hover:bg-amber-400"
        >
          📞 {PHONE}
        </a>
        <p className="mt-2 text-sm text-stone-400">Zavolejte — odpovídáme ihned</p>
      </section>

      {/* Dlaždice služeb */}
      <section className="mx-auto grid max-w-5xl gap-6 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((s) => (
          <div
            key={s.href}
            className={"flex flex-col rounded-2xl border p-6 transition " + s.color}
          >
            <span className="text-4xl">{s.emoji}</span>
            <h2 className="mt-3 text-xl font-bold text-stone-900">{s.title}</h2>
            <p className="mt-2 flex-1 text-sm text-stone-600">{s.desc}</p>
            <Link
              href={s.href}
              className={"mt-5 rounded-xl px-4 py-2 text-center text-sm font-semibold text-white transition " + s.ctaColor}
            >
              {s.cta}
            </Link>
          </div>
        ))}
      </section>

      {/* Patička s kontaktem */}
      <footer className="border-t border-stone-100 bg-stone-50 px-4 py-8 text-center text-sm text-stone-500">
        <p className="font-medium text-stone-700">{SITE_NAME}</p>
        <a href={"tel:" + PHONE.replace(/\s/g, "")} className="mt-1 block text-amber-700 hover:underline">
          {PHONE}
        </a>
        <p className="mt-4">
          <Link href="/admin" className="text-stone-400 hover:text-stone-600">Admin</Link>
        </p>
      </footer>
    </main>
  );
}
