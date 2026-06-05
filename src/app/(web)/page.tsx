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

const SERVICES = [
  { href: "/porez", label: "Pořez dřeva", desc: "Klády i hotové řezivo na míru." },
  { href: "/suseni", label: "Sušení dřeva", desc: "Komorová sušárna, přesná vlhkost." },
  { href: "/palivo", label: "Palivo", desc: "Dřevo, brikety, pelety. Online." },
  { href: "/ostreni", label: "Ostření kotoučů", desc: "Kotouče i pásy, druhý den hotovo." },
];

const g = "#1a3a2a", o = "#c8441b", cr = "#f5f0e8", gm = "#2d5a40";

export default function HomePage() {
  const [menu, setMenu] = useState(false);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: cr, fontFamily: "var(--font-body)", overflow: "hidden" }}>

      {/* Top bar */}
      <div style={{ background: o, color: "white", textAlign: "center", padding: "6px 16px", fontSize: 12, fontWeight: 500, letterSpacing: "0.05em", flexShrink: 0 }}>
        Zavolejte nám: <strong>{PHONE}</strong>
      </div>

      {/* Nav */}
      <header style={{ background: cr, borderBottom: `1px solid #d9d0c2`, flexShrink: 0 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ background: g, color: "white", padding: "6px 12px", lineHeight: 1.15 }}>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 700, letterSpacing: "0.08em" }}>{SITE_NAME.toUpperCase()}</div>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: 10, fontWeight: 400, color: o, letterSpacing: "0.15em" }}>DŘEVOZPRACUJÍCÍ PROVOZ</div>
            </div>
          </Link>
          <nav className="hidden md:flex" style={{ gap: 24, alignItems: "center" }}>
            {NAV.map(l => <Link key={l.href} href={l.href} style={{ textDecoration: "none", fontSize: 12, fontWeight: 500, color: g, letterSpacing: "0.06em", textTransform: "uppercase" }}>{l.label}</Link>)}
          </nav>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Link href="/suseni" className="hidden sm:block" style={{ background: o, color: "white", padding: "8px 16px", fontSize: 12, fontWeight: 700, textDecoration: "none", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Poptávka zdarma
            </Link>
            <button onClick={() => setMenu(!menu)} className="md:hidden" style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <div style={{ width: 22, display: "flex", flexDirection: "column", gap: 5 }}>
                {[0,1,2].map(i => <span key={i} style={{ display: "block", height: 2, background: g, borderRadius: 1 }} />)}
              </div>
            </button>
          </div>
        </div>
        {menu && (
          <div className="md:hidden" style={{ background: cr, borderTop: `1px solid #d9d0c2`, padding: "10px 24px 16px" }}>
            {NAV.map(l => <Link key={l.href} href={l.href} onClick={() => setMenu(false)} style={{ display: "block", padding: "10px 0", fontSize: 14, fontWeight: 600, color: g, textDecoration: "none", borderBottom: "1px solid #e8e2d8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{l.label}</Link>)}
            <Link href="/suseni" style={{ display: "block", marginTop: 12, textAlign: "center", background: o, color: "white", padding: "12px", fontSize: 13, fontWeight: 700, textDecoration: "none", letterSpacing: "0.06em", textTransform: "uppercase" }}>Poptávka zdarma</Link>
          </div>
        )}
      </header>

      {/* Hlavní obsah — flex grow, vyplní zbytek výšky */}
      <div style={{ flex: 1, overflow: "hidden", display: "grid", gridTemplateColumns: "1fr 1fr" }} className="main-grid">

        {/* Levá strana — hero text */}
        <div style={{ background: cr, display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 48px", overflow: "hidden" }}>
          <p style={{ fontFamily: "var(--font-heading)", fontSize: 11, fontWeight: 600, color: o, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 6, marginTop: -12 }}>Profesionální dřevovýroba · Od roku 2000</p>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(28px, 3.8vw, 52px)", fontWeight: 700, lineHeight: 1.25, color: g, textTransform: "uppercase", letterSpacing: "-0.01em", marginBottom: 20 }}>
            POŘEZ,<br />SUŠENÍ<br /><span style={{ color: o }}>&amp; PALIVO.</span>
          </h1>
          <p style={{ fontSize: 15, color: "#4a5e4f", lineHeight: 1.7, marginBottom: 32, maxWidth: 380 }}>
            Poptávku přijmeme online — ozveme se do 24 hodin s cenou. Každá zakázka zpracována přesně a načas.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/suseni" style={{ background: o, color: "white", padding: "13px 26px", fontSize: 13, fontWeight: 700, textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Poptávka zdarma
            </Link>
            <a href={"tel:" + PHONE.replace(/\s/g, "")} style={{ background: "transparent", color: g, border: `2px solid ${g}`, padding: "13px 26px", fontSize: 13, fontWeight: 700, textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Zavolat
            </a>
          </div>
          {/* Spodní info */}
          <div style={{ marginTop: "auto", paddingTop: 32, display: "flex", gap: 32, borderTop: `1px solid #d9d0c2`, marginTop: 40 }}>
            {[{ n: "24h", t: "Odpověď" }, { n: "100%", t: "Přesnost" }, { n: "∞", t: "Férová cena" }].map(f => (
              <div key={f.n}>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 700, color: g }}>{f.n}</div>
                <div style={{ fontSize: 11, color: "#6b7c6e", textTransform: "uppercase", letterSpacing: "0.08em" }}>{f.t}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pravá strana — tmavě zelená, seznam služeb */}
        <div style={{ background: g, display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 48px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -60, bottom: -60, width: 280, height: 280, borderRadius: "50%", background: gm, opacity: 0.35 }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={{ fontFamily: "var(--font-heading)", color: o, fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 28 }}>Naše služby</p>
            {SERVICES.map((s, i) => (
              <Link key={s.href} href={s.href} style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", textDecoration: "none", borderTop: i === 0 ? `1px solid rgba(255,255,255,0.12)` : `1px solid rgba(255,255,255,0.12)`, padding: "18px 0", gap: 16 }}>
                <div>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: 18, fontWeight: 600, color: "white", textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: 3 }}>{s.label}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{s.desc}</div>
                </div>
                <span style={{ color: o, fontSize: 18, flexShrink: 0 }}>→</span>
              </Link>
            ))}
            <div style={{ borderTop: `1px solid rgba(255,255,255,0.12)`, paddingTop: 20, marginTop: 4 }}>
              <a href={"tel:" + PHONE.replace(/\s/g, "")} style={{ fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 600, color: o, textDecoration: "none", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                📞 {PHONE}
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .main-grid { grid-template-columns: 1fr !important; overflow-y: auto !important; }
        }
      `}</style>
    </div>
  );
}
