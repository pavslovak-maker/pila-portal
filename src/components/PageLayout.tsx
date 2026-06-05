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
    <div className="min-h-screen" style={{ background: "#f5f5f7", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {/* Nav */}
      <header style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "saturate(180%) blur(20px)", borderBottom: "1px solid #d2d2d7", position: "sticky", top: 0, zIndex: 50 }}>
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" style={{ fontSize: 18, fontWeight: 600, color: "#1d1d1f", letterSpacing: "-0.02em", textDecoration: "none" }}>
            {SITE_NAME}
          </Link>
          <nav className="hidden md:flex" style={{ gap: 32 }}>
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} style={{ fontSize: 14, color: "#6e6e73", textDecoration: "none", fontWeight: 400 }}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <a href={"tel:" + PHONE.replace(/\s/g, "")} className="hidden sm:block" style={{ fontSize: 14, fontWeight: 500, color: "#0071e3", textDecoration: "none" }}>
              {PHONE}
            </a>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden" style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <div style={{ width: 22, display: "flex", flexDirection: "column", gap: 5 }}>
                <span style={{ display: "block", height: 1.5, background: "#1d1d1f", borderRadius: 1, transform: menuOpen ? "translateY(6.5px) rotate(45deg)" : "none", transition: "transform 0.2s" }} />
                <span style={{ display: "block", height: 1.5, background: "#1d1d1f", borderRadius: 1, opacity: menuOpen ? 0 : 1, transition: "opacity 0.2s" }} />
                <span style={{ display: "block", height: 1.5, background: "#1d1d1f", borderRadius: 1, transform: menuOpen ? "translateY(-6.5px) rotate(-45deg)" : "none", transition: "transform 0.2s" }} />
              </div>
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden" style={{ borderTop: "1px solid #d2d2d7", background: "rgba(255,255,255,0.97)", padding: "12px 24px 20px" }}>
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)} style={{ display: "block", padding: "12px 0", fontSize: 16, color: "#1d1d1f", textDecoration: "none", borderBottom: "1px solid #f2f2f2" }}>
                {l.label}
              </Link>
            ))}
            <a href={"tel:" + PHONE.replace(/\s/g, "")} style={{ display: "block", marginTop: 16, textAlign: "center", background: "#0071e3", color: "white", borderRadius: 980, padding: "12px 20px", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>
              {PHONE}
            </a>
          </div>
        )}
      </header>
      <main className="mx-auto max-w-2xl px-6 py-14">
        {children}
      </main>
    </div>
  );
}
