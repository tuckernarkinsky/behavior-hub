// @ts-nocheck
'use client';

import React, { useState } from "react";

// ── Founding-list signup endpoint ───────────────────────────────────────────
// Paste the Google Apps Script web-app URL here once it's deployed.
// Until then the form still works for demos — it just shows the thank-you
// state without recording anything, so it never errors in front of a prospect.
const FOUNDING_LIST_ENDPOINT = "https://script.google.com/macros/s/AKfycbwsijcVxGK81OPyeuzybu9UyNVOnlDrRAPdbvyYjlMPbHmqLN7r4NVotza0TqybmIiUPA/exec";
// ─────────────────────────────────────────────────────────────────────────────

const c = {
  bg: "#F2FAF8", surface: "#FFFFFF", ink: "#1A2E2B", muted: "#62807A",
  primary: "#0E9F8F", primarySoft: "#D4F5F0", accent: "#F97316",
  accentSoft: "#FEF0E6", gold: "#F59E0B", line: "#DEF0EB",
};

function FoundingListForm() {
  const [name, setName] = useState("");
  const [clinic, setClinic] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | done

  const submit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setStatus("sending");
    try {
      if (FOUNDING_LIST_ENDPOINT && !FOUNDING_LIST_ENDPOINT.startsWith("PASTE_")) {
        await fetch(FOUNDING_LIST_ENDPOINT, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({ name: name.trim(), clinic: clinic.trim(), email: email.trim() }),
        });
      }
    } catch (err) {
      // Best-effort: never show an error to an interested clinician.
      console.error("Founding-list submit failed:", err);
    }
    setStatus("done");
  };

  const inputStyle = {
    background: c.surface, border: `1.5px solid ${c.line}`, borderRadius: 12,
    padding: "13px 15px", fontSize: 15, color: c.ink, width: "100%", outline: "none",
    boxSizing: "border-box",
  };

  if (status === "done") {
    return (
      <div style={{ textAlign: "center", padding: "8px 0" }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
        <div style={{ color: "#fff", fontSize: 20, fontWeight: 800, marginBottom: 8 }}>
          You're on the founding list.
        </div>
        <p style={{ color: c.primarySoft, fontSize: 16, maxWidth: 440, margin: "0 auto", lineHeight: 1.5 }}>
          Thanks{name.trim() ? `, ${name.trim().split(" ")[0]}` : ""} — we'll reach out personally as we
          bring founding clinics on. No spam, no commitment.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ maxWidth: 460, margin: "0 auto", textAlign: "left" }}>
      <div style={{ display: "grid", gap: 10 }}>
        <input
          type="text" placeholder="Your name" value={name} required
          onChange={(e) => setName(e.target.value)} style={inputStyle}
        />
        <input
          type="text" placeholder="Clinic / organization" value={clinic}
          onChange={(e) => setClinic(e.target.value)} style={inputStyle}
        />
        <input
          type="email" placeholder="Work email" value={email} required
          onChange={(e) => setEmail(e.target.value)} style={inputStyle}
        />
        <button
          type="submit" disabled={status === "sending"}
          style={{
            background: "#fff", color: c.primary, border: "none", padding: "14px 24px",
            borderRadius: 12, fontWeight: 800, fontSize: 16,
            cursor: status === "sending" ? "default" : "pointer", marginTop: 2,
            opacity: status === "sending" ? 0.7 : 1,
          }}
        >
          {status === "sending" ? "Adding you…" : "Join the founding list →"}
        </button>
      </div>
      <p style={{ color: c.primarySoft, fontSize: 12.5, textAlign: "center", margin: "12px 0 0", lineHeight: 1.5 }}>
        No payment, no commitment — just interest. We'll only use this to reach out about early access.
      </p>
    </form>
  );
}

export default function LandingScreen({ loginScreen }) {
  const [showLogin, setShowLogin] = useState(false);
  if (showLogin) return loginScreen;

  const signIn = () => setShowLogin(true);
  const toForm = () => {
    const el = document.getElementById("founding-list");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div style={{ minHeight: "100vh", background: c.bg, color: c.ink }}>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 20px" }}>

        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="36" height="36" viewBox="0 0 64 64" aria-label="Behavior Hub" style={{ display: "block" }}>
              <defs>
                <radialGradient id="bhGlobe" cx="40%" cy="30%" r="78%">
                  <stop offset="0" stopColor="#2BC6B2" />
                  <stop offset="1" stopColor="#0E9F8F" />
                </radialGradient>
              </defs>
              <ellipse cx="32" cy="32" rx="29" ry="10.5" fill="none" stroke="#F5A623" strokeWidth="2.6" transform="rotate(-22 32 32)" />
              <circle cx="32" cy="32" r="20.5" fill="url(#bhGlobe)" />
              <g fill="#EAFBF7">
                <path d="M14.8 30.6c1.6-2.4 4.8-2.2 6.6-.4 1.2 1.2 1.1 3 2.8 3.6 2.3.8 2.6 3.4 1 4.8-1.8 1.6-4.4.8-6.2-.6-2-1.6-3-1-4.4-2.6-1.3-1.5-1.3-3.1.2-4.8z" />
                <path d="M33 17.6c2.6-1 5 .8 6.2 2.6.9 1.4 3 1.3 3.4 3.2.4 2-1.6 3.3-3.4 2.9-2.1-.5-2.6 1-4.8.4-2.3-.6-3.8-2-3.4-4.3.3-1.7.4-2.6 2-2.8z" />
                <path d="M36.2 36c2.2-.6 4.2 1 4 3.3-.2 2.1-2.2 3.4-4 2.6-1.6-.7-2-2.8-1.2-4.2.5-.9.9-1.4 1.2-1.7z" />
              </g>
              <ellipse cx="25" cy="22" rx="6" ry="3.2" fill="#ffffff" fillOpacity="0.25" transform="rotate(-22 25 22)" />
              <circle cx="9.4" cy="36.6" r="2.2" fill="#F5A623" />
            </svg>
            <span style={{ fontWeight: 800, fontSize: 18 }}>Behavior Hub</span>
          </div>
          <button onClick={signIn} style={{ background: "transparent", border: `1px solid ${c.line}`, color: c.ink, padding: "8px 16px", borderRadius: 10, fontWeight: 600, cursor: "pointer" }}>Sign in</button>
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
            <button onClick={toForm} style={{ background: c.primary, color: "#fff", border: "none", padding: "14px 28px", borderRadius: 12, fontWeight: 700, fontSize: 16, cursor: "pointer", boxShadow: "0 8px 20px rgba(14,159,143,0.25)" }}>Join the founding list</button>
            <button onClick={signIn} style={{ background: c.surface, color: c.ink, border: `1px solid ${c.line}`, padding: "14px 28px", borderRadius: 12, fontWeight: 700, fontSize: 16, cursor: "pointer" }}>See the demo</button>
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

        <section id="founding-list" style={{ background: c.primary, borderRadius: 22, padding: "40px 28px", textAlign: "center", marginBottom: 40, scrollMarginTop: 24 }}>
          <h2 style={{ color: "#fff", fontSize: "clamp(22px, 5vw, 28px)", fontWeight: 800, margin: "0 0 12px" }}>Become a founding clinic</h2>
          <p style={{ color: c.primarySoft, fontSize: 17, maxWidth: 540, margin: "0 auto 24px", lineHeight: 1.5 }}>
            We're onboarding a small group of early clinics now. Add your name and we'll reach out before launch — your team helps shape the product around how you actually work.
          </p>
          <FoundingListForm />
        </section>

        <footer style={{ textAlign: "center", padding: "0 0 48px", color: c.muted, fontSize: 13, lineHeight: 1.6 }}>
          <div style={{ marginBottom: 6 }}>Security and HIPAA compliance are first-class here — not an afterthought.</div>
          <div>© {new Date().getFullYear()} Behavior Hub</div>
        </footer>

      </div>
    </div>
  );
}
