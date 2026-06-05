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
];

export function PageLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 border-b border-stone-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-xl font-bold tracking-tight text-stone-900">
            {SITE_NAME}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm font-medium text-stone-600 hover:text-red-600">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={"tel:" + PHONE.replace(/\s/g, "")}
              className="hidden rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 sm:block"
            >
              {PHONE}
            </a>
            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded md:hidden"
              aria-label="Menu"
            >
              <span className={"block h-0.5 w-6 bg-stone-700 transition-transform " + (menuOpen ? "translate-y-2 rotate-45" : "")} />
              <span className={"block h-0.5 w-6 bg-stone-700 transition-opacity " + (menuOpen ? "opacity-0" : "")} />
              <span className={"block h-0.5 w-6 bg-stone-700 transition-transform " + (menuOpen ? "-translate-y-2 -rotate-45" : "")} />
            </button>
          </div>
        </div>

        {/* Mobilní menu */}
        {menuOpen && (
          <div className="border-t border-stone-100 bg-white px-4 pb-4 md:hidden">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-base font-medium text-stone-700 hover:text-red-600"
              >
                {l.label}
              </Link>
            ))}
            <a
              href={"tel:" + PHONE.replace(/\s/g, "")}
              className="mt-2 block rounded bg-red-600 px-4 py-3 text-center text-sm font-semibold text-white"
            >
              {PHONE}
            </a>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-2xl px-4 py-10">
        {children}
      </main>
    </div>
  );
}
