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
  { href: "/porez", label: "Pořez dřeva", desc: "Nařežeme vaše klády nebo dodáme hotové řezivo přesně na míru." },
  { href: "/suseni", label: "Sušení dřeva", desc: "Komorová sušárna s přesnou vlhkostí. Ideální pro truhláře i stavbaře." },
  { href: "/palivo", label: "Palivo", desc: "Palivové dřevo, brikety, pelety a štěpka. Objednávka online." },
  { href: "/ostreni", label: "Ostření kotoučů", desc: "Pilové kotouče i pásy. Přivezte — hotové vrátíme zpravidla druhý den." },
];

const FEATURES = [
  { title: "Rychlá odpověď", desc: "Ozveme se do 24 hodin od přijetí poptávky." },
  { title: "Přesná práce", desc: "Řezivo na míru, sušení na požadovanou vlhkost." },
  { title: "Férová cena", desc: "Cenu vždy dohodneme před zahájením práce." },
];

const apple = {
  bg: "#f5f5f7",
  white: "#ffffff",
  text: "#1d1d1f",
  gray: "#6e6e73",
  lightGray: "#f2f2f2",
  border: "#d2d2d7",
  blue: "#0071e3",
  font: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: apple.bg, fontFamily: apple.font, color: apple.text }}>

      {/* Nav */}
      <header style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "saturate(180%) blur(20px)", borderBottom: `1px solid ${apple.border}`, position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 22px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 52 }}>
          <Link href="/" style={{ fontSize: 18, fontWeight: 600, color: apple.text, textDecoration: "none", letterSpacing: "-0.02em" }}>{SITE_NAME}</Link>
          <nav className="hidden md:flex" style={{ gap: 28 }}>
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} style={{ fontSize: 13, color: apple.gray, textDecoration: "none" }}>{l.label}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <a href={"tel:" + PHONE.replace(/\s/g, "")} className="hidden sm:block" style={{ fontSize: 13, color: apple.blue, textDecoration: "none", fontWeight: 400 }}>{PHONE}</a>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden" style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <div style={{ width: 20, display: "flex", flexDirection: "column", gap: 5 }}>
                <span style={{ display: "block", height: 1.5, background: apple.text, borderRadius: 1, transform: menuOpen ? "translateY(6.5px) rotate(45deg)" : "none", transition: "transform 0.2s" }} />
                <span style={{ display: "block", height: 1.5, background: apple.text, borderRadius: 1, opacity: menuOpen ? 0 : 1, transition: "opacity 0.2s" }} />
                <span style={{ display: "block", height: 1.5, background: apple.text, borderRadius: 1, transform: menuOpen ? "translateY(-6.5px) rotate(-45deg)" : "none", transition: "transform 0.2s" }} />
              </div>
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden" style={{ borderTop: `1px solid ${apple.border}`, background: "rgba(255,255,255,0.97)", padding: "10px 22px 18px" }}>
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)} style={{ display: "block", padding: "12px 0", fontSize: 16, color: apple.text, textDecoration: "none", borderBottom: `1px solid ${apple.lightGray}` }}>{l.label}</Link>
            ))}
            <a href={"tel:" + PHONE.replace(/\s/g, "")} style={{ display: "block", marginTop: 14, textAlign: "center", background: apple.blue, color: "white", borderRadius: 980, padding: "12px", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>{PHONE}</a>
          </div>
        )}
      </header>

      {/* Hero */}
      <section style={{ background: apple.white, padding: "80px 22px 70px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: apple.blue, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 14 }}>Dřevozpracující provoz</p>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.05, color: apple.text, margin: "0 auto 20px", maxWidth: 700 }}>
          Pořez, sušení<br />a palivo.
        </h1>
        <p style={{ fontSize: 19, color: apple.gray, maxWidth: 500, margin: "0 auto 36px", lineHeight: 1.5 }}>
          Pracujeme rychle a přesně. Poptávku přijmeme online — odpovíme do 24 hodin.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/suseni" style={{ background: apple.blue, color: "white", padding: "14px 28px", borderRadius: 980, fontSize: 15, fontWeight: 500, textDecoration: "none", display: "inline-block" }}>
            Odeslat poptávku
          </Link>
          <a href={"tel:" + PHONE.replace(/\s/g, "")} style={{ background: apple.lightGray, color: apple.text, padding: "14px 28px", borderRadius: 980, fontSize: 15, fontWeight: 500, textDecoration: "none", display: "inline-block" }}>
            {PHONE}
          </a>
        </div>
      </section>

      {/* Dlaždice */}
      <section style={{ maxWidth: 980, margin: "0 auto", padding: "64px 22px" }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 28, color: apple.text }}>Naše služby</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          {SERVICES.map((s) => (
            <Link key={s.href} href={s.href} style={{ display: "flex", flexDirection: "column", background: apple.white, borderRadius: 18, padding: "28px 24px", textDecoration: "none", border: `1px solid ${apple.border}`, transition: "box-shadow 0.2s" }}>
              <h3 style={{ fontSize: 17, fontWeight: 600, color: apple.text, marginBottom: 10 }}>{s.label}</h3>
              <p style={{ fontSize: 14, color: apple.gray, lineHeight: 1.5, flex: 1 }}>{s.desc}</p>
              <span style={{ marginTop: 16, fontSize: 14, color: apple.blue, fontWeight: 400 }}>Více info →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ background: apple.white, padding: "64px 22px" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 36, color: apple.text }}>Proč si vybrat nás</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32 }}>
            {FEATURES.map((f) => (
              <div key={f.title}>
                <h3 style={{ fontSize: 17, fontWeight: 600, color: apple.text, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: apple.gray, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 22px", textAlign: "center", background: apple.bg }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", color: apple.text, marginBottom: 10 }}>Máte otázku?</h2>
        <p style={{ fontSize: 17, color: apple.gray, marginBottom: 28 }}>Jsme k dispozici v pracovní dny.</p>
        <a href={"tel:" + PHONE.replace(/\s/g, "")} style={{ background: apple.blue, color: "white", padding: "14px 32px", borderRadius: 980, fontSize: 15, fontWeight: 500, textDecoration: "none", display: "inline-block" }}>
          Zavolat: {PHONE}
        </a>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${apple.border}`, padding: "32px 22px", background: apple.bg }}>
        <div style={{ maxWidth: 980, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <p style={{ fontSize: 13, color: apple.gray }}>© 2025 {SITE_NAME}</p>
          <div style={{ display: "flex", gap: 24 }}>
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} style={{ fontSize: 13, color: apple.gray, textDecoration: "none" }}>{l.label}</Link>
            ))}
            <Link href="/admin" style={{ fontSize: 13, color: apple.gray, textDecoration: "none" }}>Admin</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
