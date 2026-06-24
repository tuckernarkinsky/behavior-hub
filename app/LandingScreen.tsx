// @ts-nocheck
'use client';

import React, { useState } from "react";

const c = {
  bg: "#F2FAF8", surface: "#FFFFFF", ink: "#1A2E2B", muted: "#62807A",
  primary: "#0E9F8F", primarySoft: "#D4F5F0", accent: "#F97316",
  accentSoft: "#FEF0E6", gold: "#F59E0B", line: "#DEF0EB",
};

export default function LandingScreen({ loginScreen }) {
  const [showLogin, setShowLogin] = useState(false);
  if (showLogin) return loginScreen;
  const go = () => setShowLogin(true);

  return (
    <div style={{ minHeight: "100vh", background: c.bg, color: c.ink }}>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 20px" }}>

        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: c.primary, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800 }}>BH</div>
            <span style={{ fontWeight: 800, fontSize: 18 }}>Behavior Hub</span>
          </div>
          <button onClick={go} style={{ background: "transparent", border: `1px solid ${c.line}`, color: c.ink, padding: "8px 16px", borderRadius: 10, fontWeight: 600, cursor: "pointer" }}>Sign in</button>
        </header>

        <section style={{ padding: "48px 0 32px", textAlign: "center" }}>
          <div style={{ display: "inline-block", background: c.accentSoft, color: c.accent, fontWeight: 700, fontSize: 13, padding: "6px 14px", borderRadius: 999, marginBottom: 20 }}>
            Now onboarding founding clinics
          </div>
          <h1 style={{ fontSize: "clamp(32px, 7vw, 46px)", lineHeight: 1.1, fontWeight: 800, margin: "0 0 18px", letterSpacing: "-0.02em" }}>
            The session moves fast.<br />Your data should keep up.
          </h1>
          <p style={{ fontSize: "clamp(16px, 4vw, 19px)", lineHeight: 1.5, color: c.muted, maxWidth: 620, margin: "0 auto 28px" }}>
            Behavior Hub is AI-native practice management built for the people actually running ABA sessions — fast probe and ABC data, live clinical summaries, and insurance-ready notes that draft themselves.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={go} style={{ background: c.primary, color: "#fff", border: "none", padding: "14px 28px", borderRadius: 12, fontWeight: 700, fontSize: 16, cursor: "pointer", boxShadow: "0 8px 20px rgba(14,159,143,0.25)" }}>Get started</button>
            <button onClick={go} style={{ background: c.surface, color: c.ink, border: `1px solid ${c.line}`, padding: "14px 28px", borderRadius: 12, fontWeight: 700, fontSize: 16, cursor: "pointer" }}>See it in action</button>
          </div>
        </section>

        <section style={{ background: c.surface, border: `1px solid ${c.line}`, borderRadius: 18, padding: "28px 26px", margin: "12px 0 40px" }}>
          <p style={{ fontSize: 17, lineHeight: 1.6, margin: 0, color: c.ink }}>
            <span style={{ fontWeight: 800 }}>Built from the floor, not the front office.</span>{" "}
            It started in a real session — a client in crisis, and data that needed logging at the exact same second. You can't do both well. Behavior Hub exists so you never have to choose between the kid in front of you and the documentation behind you.
          </p>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 44 }}>
          {[
            ["Probe & ABC data in seconds", "Score trials and log behavior without breaking eye contact with your client."],
            ["Notes that write themselves", "Insurance-ready CPT 97153 documentation, drafted by AI from what actually happened in session."],
            ["Live clinical summaries", "See the story of the session as it unfolds — patterns, not just numbers."],
            ["Made for RBTs & BCBAs", "Not a billing platform with a therapy tab bolted on. Built for the people in the room."],
          ].map(([t, d], i) => (
            <div key={i} style={{ background: c.surface, border: `1px solid ${c.line}`, borderRadius: 16, padding: "22px 20px" }}>
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 8 }}>{t}</div>
              <div style={{ color: c.muted, fontSize: 15, lineHeight: 1.5 }}>{d}</div>
            </div>
          ))}
        </section>

        <section style={{ textAlign: "center", marginBottom: 44 }}>
          <h2 style={{ fontSize: "clamp(22px, 5vw, 28px)", fontWeight: 800, margin: "0 0 12px", letterSpacing: "-0.01em" }}>
            The incumbents were built for billing departments.
          </h2>
          <p style={{ fontSize: 18, color: c.muted, maxWidth: 600, margin: "0 auto", lineHeight: 1.5 }}>
            Behavior Hub was built for the session. Lighter, faster, and genuinely intelligent — the tool clinicians reach for because it helps, not because they're required to.
          </p>
        </section>

        <section style={{ background: c.primary, borderRadius: 22, padding: "40px 28px", textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ color: "#fff", fontSize: "clamp(22px, 5vw, 28px)", fontWeight: 800, margin: "0 0 12px" }}>Become a founding clinic</h2>
          <p style={{ color: "#D4F5F0", fontSize: 17, maxWidth: 540, margin: "0 auto 24px", lineHeight: 1.5 }}>
            We're onboarding a small group of early clinics now. Get in before launch and help shape the product around how your team actually works.
          </p>
          <button onClick={go} style={{ background: "#fff", color: c.primary, border: "none", padding: "14px 32px", borderRadius: 12, fontWeight: 800, fontSize: 16, cursor: "pointer" }}>Get started</button>
        </section>

        <footer style={{ textAlign: "center", padding: "0 0 48px", color: c.muted, fontSize: 13, lineHeight: 1.6 }}>
          <div style={{ marginBottom: 6 }}>Security and HIPAA compliance are first-class here — not an afterthought.</div>
          <div>© {new Date().getFullYear()} Behavior Hub</div>
        </footer>

      </div>
    </div>
  );
}
