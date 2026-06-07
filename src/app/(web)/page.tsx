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

const HERO_IMAGE = "/hero.jpg";

export default function HomePage() {
  const [menu, setMenu] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "var(--c-cream)", fontFamily: "var(--font-body)" }}>

      {/* Top bar */}
      <div style={{ background: "var(--c-dark)", color: "var(--c-gold)", textAlign: "center", padding: "7px 16px", fontSize: 12, fontWeight: 500, letterSpacing: "0.1em" }}>
        Zavolejte nám: <strong style={{ color: "#fff" }}>{PHONE}</strong>
      </div>

      {/* Nav */}
      <header style={{ background: "var(--c-cream)", borderBottom: "1px solid var(--c-border)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>

          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ lineHeight: 1.15 }}>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 600, color: "var(--c-dark)", letterSpacing: "0.04em" }}>{SITE_NAME}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 600, color: "var(--c-gold)", letterSpacing: "0.22em", textTransform: "uppercase" }}>Dřevozpracující provoz</div>
            </div>
          </Link>

          <nav className="hidden md:flex" style={{ gap: 32, alignItems: "center" }}>
            {NAV.map(l => (
              <Link key={l.href} href={l.href} style={{ textDecoration: "none", fontSize: 12, fontWeight: 500, color: "var(--c-dark)", letterSpacing: "0.07em", textTransform: "uppercase" }}>{l.label}</Link>
            ))}
          </nav>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Link href="/poptavka" className="hidden sm:block" style={{ border: "1px solid var(--c-dark)", color: "var(--c-dark)", padding: "8px 18px", fontSize: 11, fontWeight: 600, textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Poptávka
            </Link>
            <button onClick={() => setMenu(!menu)} className="md:hidden" style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <div style={{ width: 22, display: "flex", flexDirection: "column", gap: 5 }}>
                {[0, 1, 2].map(i => <span key={i} style={{ display: "block", height: 1.5, background: "var(--c-dark)", borderRadius: 0 }} />)}
              </div>
            </button>
          </div>
        </div>

        {menu && (
          <div className="md:hidden" style={{ background: "var(--c-cream)", borderTop: "1px solid var(--c-border)", padding: "10px 24px 20px" }}>
            {NAV.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMenu(false)} style={{ display: "block", padding: "12px 0", fontSize: 13, fontWeight: 500, color: "var(--c-dark)", textDecoration: "none", borderBottom: "1px solid var(--c-border)", textTransform: "uppercase", letterSpacing: "0.07em" }}>{l.label}</Link>
            ))}
            <Link href="/poptavka" style={{ display: "block", marginTop: 16, textAlign: "center", border: "1px solid var(--c-dark)", color: "var(--c-dark)", padding: "12px", fontSize: 12, fontWeight: 600, textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase" }}>Poptávka zdarma</Link>
          </div>
        )}
      </header>

      {/* HERO */}
      <section style={{ position: "relative", height: "88vh", minHeight: 480, display: "flex", alignItems: "flex-end" }}>
        {/* Foto pozadí */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url('${HERO_IMAGE}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }} />
        {/* Tmavý překryv — gradient zdola */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(20,10,4,0.85) 0%, rgba(20,10,4,0.45) 50%, rgba(20,10,4,0.15) 100%)",
        }} />

        {/* Text */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "0 40px 72px", width: "100%" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, color: "var(--c-gold)", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 20 }}>
            Profesionální dřevovýroba · Od roku 2000
          </p>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(36px, 6vw, 80px)", fontWeight: 800, lineHeight: 1.05, color: "#fff", letterSpacing: "-0.03em", marginBottom: 32, maxWidth: 800 }}>
            Pořez, sušení<br /><span style={{ color: "var(--c-gold)" }}>&amp; palivo.</span>
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: 40, maxWidth: 440 }}>
            Poptávku přijmeme online — ozveme se do 24 hodin s cenou. Každá zakázka zpracována přesně a načas.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link href="/poptavka" style={{ background: "var(--c-gold)", color: "#fff", padding: "14px 32px", fontSize: 12, fontWeight: 600, textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Poptávka zdarma
            </Link>
            <a href={"tel:" + PHONE.replace(/\s/g, "")} style={{ background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.5)", padding: "14px 32px", fontSize: 12, fontWeight: 600, textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Zavolat
            </a>
          </div>
        </div>

        {/* Spodní stats lišta */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 2, borderTop: "1px solid rgba(255,255,255,0.12)", display: "flex" }}>
          {[{ n: "24 h", t: "Odpověď" }, { n: "100 %", t: "Přesnost" }, { n: "25+", t: "Let zkušeností" }].map((f, i) => (
            <div key={f.n} style={{ flex: 1, padding: "18px 24px", background: "rgba(20,10,4,0.6)", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.1)" : "none", backdropFilter: "blur(4px)" }}>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: 28, fontWeight: 600, color: "#fff", lineHeight: 1 }}>{f.n}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--c-gold)", textTransform: "uppercase", letterSpacing: "0.12em", marginTop: 4 }}>{f.t}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SEKCE SLUŽEB */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 40px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 48, paddingBottom: 24, borderBottom: "1px solid var(--c-border)" }}>
          <div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, color: "var(--c-gold)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>Co nabízíme</p>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "var(--c-dark)", letterSpacing: "-0.01em" }}>Naše služby</h2>
          </div>
          <Link href="/poptavka" className="hidden sm:block" style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--c-dark)", textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.1em", borderBottom: "1px solid var(--c-dark)", paddingBottom: 2 }}>
            Poptat →
          </Link>
        </div>

        <div>
          {SERVICES.map((s, i) => (
            <Link key={s.href} href={s.href} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", textDecoration: "none", borderBottom: "1px solid var(--c-border)", padding: "28px 0", gap: 24 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 32 }}>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--c-text-muted)", letterSpacing: "0.08em", minWidth: 24 }}>0{i + 1}</span>
                <div>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 600, color: "var(--c-dark)", marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 13, color: "var(--c-text-muted)" }}>{s.desc}</div>
                </div>
              </div>
              <span style={{ color: "var(--c-gold)", fontSize: 20, flexShrink: 0 }}>→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* FOOTER LIŠTA */}
      <footer style={{ borderTop: "1px solid var(--c-border)", background: "var(--c-cream-dark)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontFamily: "var(--font-heading)", fontSize: 18, fontWeight: 600, color: "var(--c-dark)" }}>{SITE_NAME}</span>
          <a href={"tel:" + PHONE.replace(/\s/g, "")} style={{ fontSize: 13, color: "var(--c-text-muted)", textDecoration: "none" }}>{PHONE}</a>
        </div>
      </footer>

    </div>
  );
}
