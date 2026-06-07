"use client";

import Link from "next/link";
import { useState } from "react";

const PHONE = process.env.NEXT_PUBLIC_SITE_PHONE ?? "+420 000 000 000";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "Pila";

const NAV = [
  { href: "/porez", label: "Pořez dřeva" },
  { href: "/suseni", label: "Sušení" },
  { href: "/palivo", label: "Palivo" },
  { href: "/ostreni", label: "Ostření" },
];

export function PageLayout({ children }: { children: React.ReactNode }) {
  const [menu, setMenu] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "#1a1108", fontFamily: "var(--font-body)" }}>

      {/* Top bar */}
      <div style={{ background: "#110b04", color: "var(--c-gold)", textAlign: "center", padding: "7px 16px", fontSize: 12, fontWeight: 500, letterSpacing: "0.1em", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        Zavolejte nám: <strong style={{ color: "#fff" }}>{PHONE}</strong>
      </div>

      {/* Nav */}
      <header style={{ background: "#1a1108", borderBottom: "1px solid rgba(255,255,255,0.08)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>

          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ lineHeight: 1.15 }}>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>{SITE_NAME}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 600, color: "var(--c-gold)", letterSpacing: "0.22em", textTransform: "uppercase" }}>Dřevozpracující provoz</div>
            </div>
          </Link>

          <nav className="hidden md:flex" style={{ gap: 32, alignItems: "center" }}>
            {NAV.map(l => (
              <Link key={l.href} href={l.href} style={{ textDecoration: "none", fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.7)", letterSpacing: "0.07em", textTransform: "uppercase" }}>{l.label}</Link>
            ))}
          </nav>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Link href="/poptavka" className="hidden sm:block" style={{ border: "1px solid rgba(255,255,255,0.3)", color: "#fff", padding: "8px 18px", fontSize: 11, fontWeight: 600, textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Poptávka
            </Link>
            <button onClick={() => setMenu(!menu)} className="md:hidden" style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <div style={{ width: 22, display: "flex", flexDirection: "column", gap: 5 }}>
                {[0, 1, 2].map(i => <span key={i} style={{ display: "block", height: 1.5, background: "#fff" }} />)}
              </div>
            </button>
          </div>
        </div>

        {menu && (
          <div className="md:hidden" style={{ background: "#1a1108", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "10px 24px 20px" }}>
            {NAV.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMenu(false)} style={{ display: "block", padding: "12px 0", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.75)", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.08)", textTransform: "uppercase", letterSpacing: "0.07em" }}>{l.label}</Link>
            ))}
            <Link href="/poptavka" style={{ display: "block", marginTop: 16, textAlign: "center", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", padding: "12px", fontSize: 12, fontWeight: 600, textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase" }}>Poptávka zdarma</Link>
          </div>
        )}
      </header>

      <main style={{ maxWidth: 680, margin: "0 auto", padding: "56px 24px" }}>
        {children}
      </main>
    </div>
  );
}
