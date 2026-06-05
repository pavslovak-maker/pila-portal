"use client";

import Link from "next/link";
import { useState } from "react";

const PHONE = process.env.NEXT_PUBLIC_SITE_PHONE ?? "+420 000 000 000";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "Pila";
const g = "#1a3a2a", o = "#c8441b", cr = "#f5f0e8";

const NAV = [
  { href: "/porez", label: "Pořez dřeva" },
  { href: "/suseni", label: "Sušení" },
  { href: "/palivo", label: "Palivo" },
  { href: "/ostreni", label: "Ostření" },
];

export function PageLayout({ children }: { children: React.ReactNode }) {
  const [menu, setMenu] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: cr, fontFamily: "var(--font-body)" }}>
      <div style={{ background: o, color: "white", textAlign: "center", padding: "8px", fontSize: 13, fontWeight: 500, letterSpacing: "0.05em" }}>
        Zavolejte nám: {PHONE}
      </div>
      <header style={{ background: cr, borderBottom: `1px solid #d9d0c2`, position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ background: g, color: "white", padding: "8px 14px", lineHeight: 1.1 }}>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: 15, fontWeight: 700, letterSpacing: "0.08em" }}>{SITE_NAME.toUpperCase()}</div>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: 11, fontWeight: 400, color: o, letterSpacing: "0.15em" }}>DŘEVOZPRACUJÍCÍ PROVOZ</div>
            </div>
          </Link>
          <nav className="hidden md:flex" style={{ gap: 28 }}>
            {NAV.map(l => <Link key={l.href} href={l.href} style={{ textDecoration: "none", fontSize: 13, fontWeight: 500, color: g, textTransform: "uppercase", letterSpacing: "0.04em" }}>{l.label}</Link>)}
          </nav>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Link href="/suseni" className="hidden sm:block" style={{ background: o, color: "white", padding: "10px 20px", fontSize: 13, fontWeight: 700, textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Poptávka zdarma
            </Link>
            <button onClick={() => setMenu(!menu)} className="md:hidden" style={{ background: "none", border: "none", cursor: "pointer" }}>
              <div style={{ width: 24, display: "flex", flexDirection: "column", gap: 5 }}>
                {[0,1,2].map(i => <span key={i} style={{ display: "block", height: 2, background: g, borderRadius: 1 }} />)}
              </div>
            </button>
          </div>
        </div>
        {menu && (
          <div className="md:hidden" style={{ background: cr, borderTop: `1px solid #d9d0c2`, padding: "12px 24px 20px" }}>
            {NAV.map(l => <Link key={l.href} href={l.href} onClick={() => setMenu(false)} style={{ display: "block", padding: "12px 0", fontSize: 14, fontWeight: 600, color: g, textDecoration: "none", borderBottom: "1px solid #e8e2d8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{l.label}</Link>)}
          </div>
        )}
      </header>
      <main style={{ maxWidth: 680, margin: "0 auto", padding: "56px 24px" }}>
        {children}
      </main>
    </div>
  );
}
