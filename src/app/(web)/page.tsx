"use client";

import Link from "next/link";
import { useState } from "react";

const PHONE = process.env.NEXT_PUBLIC_SITE_PHONE ?? "+420 000 000 000";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "Pila";

const NAV_LINKS = [
  { href: "/porez", label: "Pořez dřeva" },
  { href: "/suseni", label: "Sušení" },
  { href: "/palivo", label: "Palivo" },
  { href: "/ostreni", label: "Ostření" },
  { href: "/kontakt", label: "Kontakt" },
];

const SERVICES = [
  { href: "/porez", label: "Pořez dřeva", desc: "Na zakázku, přesně na míru", bg: "bg-stone-800", emoji: "🪚" },
  { href: "/suseni", label: "Sušení dřeva", desc: "Komorová sušárna, přesná vlhkost", bg: "bg-stone-700", emoji: "🌡️" },
  { href: "/palivo", label: "Palivo", desc: "Dřevo, brikety, pelety, štěpka", bg: "bg-stone-900", emoji: "🪵" },
  { href: "/ostreni", label: "Ostření kotoučů", desc: "Kotouče i pásy, druhý den hotovo", bg: "bg-stone-600", emoji: "⚙️" },
];

const FEATURES = [
  { icon: "⏱️", title: "Rychlá odpověď", desc: "Ozveme se do 24 hodin od přijetí poptávky." },
  { icon: "📐", title: "Přesná práce", desc: "Řezivo na míru, sušení na požadovanou vlhkost." },
  { icon: "🤝", title: "Férová cena", desc: "Cenu vždy dohodneme před zahájením práce." },
];

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">

      {/* Navigace */}
      <header className="sticky top-0 z-50 border-b border-stone-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-xl font-bold tracking-tight text-stone-900">{SITE_NAME}</Link>
          <nav className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm font-medium text-stone-600 hover:text-red-600">{l.label}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <a href={"tel:" + PHONE.replace(/\s/g, "")} className="hidden rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 sm:block">
              {PHONE}
            </a>
            <button onClick={() => setMenuOpen(!menuOpen)} className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden" aria-label="Menu">
              <span className={"block h-0.5 w-6 bg-stone-700 transition-transform " + (menuOpen ? "translate-y-2 rotate-45" : "")} />
              <span className={"block h-0.5 w-6 bg-stone-700 transition-opacity " + (menuOpen ? "opacity-0" : "")} />
              <span className={"block h-0.5 w-6 bg-stone-700 transition-transform " + (menuOpen ? "-translate-y-2 -rotate-45" : "")} />
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="border-t border-stone-100 bg-white px-4 pb-4 md:hidden">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="block py-3 text-base font-medium text-stone-700 hover:text-red-600">{l.label}</Link>
            ))}
            <a href={"tel:" + PHONE.replace(/\s/g, "")} className="mt-2 block rounded bg-red-600 px-4 py-3 text-center text-sm font-semibold text-white">{PHONE}</a>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-stone-900 px-4 py-10 md:py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-stone-900/80 to-transparent" />
        <div className="relative mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-red-400 sm:text-sm">Dřevozpracující provoz</p>
          <h1 className="mt-3 max-w-2xl text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
            Pořez, sušení<br className="hidden sm:block" /> a palivo na jednom místě.
          </h1>
          <p className="mt-4 max-w-lg text-base text-stone-300 sm:text-lg">
            Pracujeme rychle a přesně. Poptávku přijmeme online a ozveme se do 24 hodin s cenou.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/suseni" className="rounded bg-red-600 px-7 py-3 text-center text-sm font-semibold text-white hover:bg-red-700">
              Odeslat poptávku
            </Link>
            <a href={"tel:" + PHONE.replace(/\s/g, "")} className="rounded border border-white/30 px-7 py-3 text-center text-sm font-semibold text-white hover:bg-white/10">
              Zavolat: {PHONE}
            </a>
          </div>
        </div>
      </section>

      {/* Služby */}
      <section className="mx-auto max-w-6xl px-4 py-8 md:py-10">
        <h2 className="mb-4 text-xl font-bold text-stone-900 sm:text-2xl">Naše služby</h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <Link key={s.href} href={s.href} className={"group relative flex h-36 flex-col justify-end overflow-hidden rounded-xl p-4 sm:h-44 sm:p-5 " + s.bg}>
              <span className="absolute right-3 top-3 text-2xl opacity-30 sm:right-4 sm:top-4 sm:text-3xl">{s.emoji}</span>
              <p className="text-xs text-white/60">{s.desc}</p>
              <h3 className="mt-1 text-sm font-bold text-white sm:text-lg">{s.label}</h3>
              <span className="mt-1 text-xs font-semibold text-red-400 group-hover:underline">Více info →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Proč my */}
      <section className="bg-stone-50 px-4 py-8 md:py-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-xl font-bold text-stone-900 sm:text-2xl">Proč si vybrat nás</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-xl bg-white p-6 shadow-sm">
                <span className="text-3xl">{f.icon}</span>
                <h3 className="mt-3 text-base font-bold text-stone-900">{f.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-stone-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-red-600 px-4 py-12 text-center">
        <h2 className="text-xl font-bold text-white sm:text-2xl">Přijďte se podívat nebo zavolejte</h2>
        <p className="mt-2 text-red-100">Jsme k dispozici v pracovní dny.</p>
        <a href={"tel:" + PHONE.replace(/\s/g, "")} className="mt-5 inline-block rounded bg-white px-8 py-3 text-sm font-bold text-red-600 hover:bg-red-50">
          {PHONE}
        </a>
      </section>

      {/* Patička */}
      <footer className="bg-stone-900 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap justify-between gap-6">
            <div>
              <p className="font-bold text-white">{SITE_NAME}</p>
              <p className="mt-1 text-sm text-stone-400">Dřevozpracující provoz</p>
            </div>
            <div className="flex flex-wrap gap-4">
              {NAV_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="text-sm text-stone-400 hover:text-white">{l.label}</Link>
              ))}
            </div>
          </div>
          <div className="mt-8 flex items-center justify-between border-t border-stone-800 pt-6 text-xs text-stone-500">
            <span>© 2025 {SITE_NAME}</span>
            <Link href="/admin" className="hover:text-stone-300">Admin</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
