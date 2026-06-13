// @ts-nocheck
'use client';

import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft, Plus, Minus, Mic, MicOff, Sparkles, FileText,
  ClipboardList, Activity, ChevronRight, TrendingUp, Loader2,
  BookOpen, Brain, Undo2, FileSignature, Calendar, Check, X,
  ChevronDown, RotateCcw, Eye, MessageSquare, Shield, Zap, Copy, Users,
} from "lucide-react";

const c = {
  bg: "#F4F1EA", surface: "#FFFFFF", ink: "#1B2A28", muted: "#6A7C79",
  primary: "#1E6B63", primarySoft: "#E3EFEC", accent: "#E0764F",
  accentSoft: "#FBE7DE", gold: "#E0A93B", goldSoft: "#FEF9EE", line: "#E6E1D7",
  plus: "#2E8B6F", minus: "#D2604A",
};

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
.font-display{font-family:'Bricolage Grotesque',sans-serif;letter-spacing:-0.02em}
.font-body{font-family:'DM Sans',sans-serif}
`;

// ---------------- Seed data ----------------
const CLIENTS = [
  { id: "c1", name: "Jordan M.", age: 6, color: c.primary, programs: 5, behaviors: 3, last: "Yesterday" },
  { id: "c2", name: "Ava R.", age: 4, color: c.accent, programs: 4, behaviors: 2, last: "2 days ago" },
  { id: "c3", name: "Mateo S.", age: 8, color: c.gold, programs: 6, behaviors: 4, last: "Today" },
];

const PROGRAM_TEMPLATE = [
  { id: "p1", name: "Simple compliance", prompt: "Independent", domain: "Compliance" },
  { id: "p2a", name: "Gross motor", prompt: "Model prompt", group: "Motor imitation" },
  { id: "p2b", name: "Fine motor", prompt: "Model prompt", group: "Motor imitation" },
  { id: "p2c", name: "Oral motor", prompt: "Independent", group: "Motor imitation" },
  { id: "p3a", name: "Animals", prompt: "Gestural prompt", group: "Receptive ID" },
  { id: "p3b", name: "Common objects", prompt: "Independent", group: "Receptive ID" },
  { id: "p3c", name: "Body parts", prompt: "Independent", group: "Receptive ID" },
  { id: "p4", name: "Manding for break", prompt: "Independent", domain: "Manding" },
  { id: "p5", name: "Tact: common objects", prompt: "Independent", domain: "Tacting" },
];

const BEHAVIOR_TEMPLATE = [
  { id: "b1", name: "Elopement" },
  { id: "b2", name: "Aggression (hitting)" },
  { id: "b3", name: "Vocal stereotypy" },
];

const PAST_SESSIONS = {
  c1: [
    { date: "Jun 1", duration: "2h 00m", skillPct: 78, behaviors: 4, signed: true },
    { date: "May 30", duration: "1h 45m", skillPct: 71, behaviors: 6, signed: true },
    { date: "May 28", duration: "2h 00m", skillPct: 66, behaviors: 5, signed: true },
  ],
  c2: [{ date: "May 31", duration: "1h 30m", skillPct: 82, behaviors: 2, signed: true }],
  c3: [{ date: "Jun 2", duration: "2h 00m", skillPct: 74, behaviors: 7, signed: false }],
};

const DOCUMENTS = {
  c1: [
    { title: "Initial Assessment (VB-MAPP)", date: "Mar 2026", body: "Jordan presented with strengths in mand and tact repertoires at Level 2. Areas for growth: listener responding, intraverbals, and group instruction. Recommended 25 hrs/week of direct ABA with parent training." },
    { title: "Reinforcer Inventory", date: "Apr 2026", body: "Preferred items/activities: tablet (high), trains, bubbles, crunchy snacks, trampoline. Avoid: loud sudden sounds, transitions without warning. Use 2-minute visual timer for transitions." },
  ],
  c2: [{ title: "Initial Assessment", date: "Feb 2026", body: "Sample assessment write-up for Ava." }],
  c3: [{ title: "Reassessment", date: "May 2026", body: "Sample reassessment write-up for Mateo." }],
};

const PROTOCOLS = {
  c1: [
    { title: "Simple compliance", body: "SD: 'Jordan, [one-step instruction].' Target: independent compliance within 5s. Prompt hierarchy: independent → gestural → model → partial physical. Mastery: 80% independent across 3 consecutive sessions. Reinforce with brief praise + token." },
    { title: "Elopement (behavior reduction)", body: "Operational definition: leaving the designated activity area (>3 ft) without permission. Function (hypothesized): escape from demands. Strategy: antecedent — offer choices, errorless demands; FCT — teach 'break' mand; consequence — guided return, no attention. Record frequency + ABC." },
  ],
  c2: [{ title: "Manding", body: "Sample protocol for Ava." }],
  c3: [{ title: "Tolerance for waiting", body: "Sample protocol for Mateo." }],
};

// ---------------- localStorage helpers ----------------
const SESSION_KEY = (id) => `bh_session_${id}`;
function loadSession(id) {
  try { const r = typeof window !== "undefined" ? localStorage.getItem(SESSION_KEY(id)) : null; return r ? JSON.parse(r) : null; } catch { return null; }
}
function saveSession(id, data) { try { localStorage.setItem(SESSION_KEY(id), JSON.stringify(data)); } catch {} }
function clearSession(id) { try { localStorage.removeItem(SESSION_KEY(id)); } catch {} }
function clearAllSessions() { CLIENTS.forEach((cl) => clearSession(cl.id)); }

// ---------------- BroadcastChannel (live supervision) ----------------
const BC = "bh_live_session";
function useBroadcastSession(clientId, data) {
  const chRef = useRef(null);
  useEffect(() => { try { chRef.current = new BroadcastChannel(BC); } catch {} return () => { try { chRef.current?.close(); } catch {} }; }, []);
  useEffect(() => { if (!clientId || !data) return; try { chRef.current?.postMessage({ type: "update", clientId, ...data }); } catch {} }, [clientId, data]);
}
function useReceiveBroadcast() {
  const [live, setLive] = useState(null);
  useEffect(() => {
    let ch;
    try { ch = new BroadcastChannel(BC); ch.onmessage = (e) => { if (e.data?.type === "update") setLive(e.data); }; } catch {}
    return () => { try { ch?.close(); } catch {} };
  }, []);
  return live;
}

// ---------------- Speech helper ----------------
function useDictation() {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const recRef = useRef(null);
  const start = (onText) => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setSupported(false); return; }
    try {
      const rec = new SR();
      rec.continuous = true; rec.interimResults = true; rec.lang = "en-US";
      rec.onresult = (e) => { let f = ""; for (let i = 0; i < e.results.length; i++) f += e.results[i][0].transcript + " "; onText(f.trim()); };
      rec.onerror = () => { setSupported(false); setListening(false); };
      rec.onend = () => setListening(false);
      recRef.current = rec; rec.start(); setListening(true);
    } catch { setSupported(false); }
  };
  const stop = () => { recRef.current && recRef.current.stop(); setListening(false); };
  return { listening, supported, start, stop };
}

// ---------------- AI helpers ----------------
async function askClaude(prompt) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 35000);
  try {
    const res = await fetch("/api/claude", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt }), signal: controller.signal });
    let data = {}; try { data = await res.json(); } catch {}
    if (!res.ok) throw new Error(data.error || "AI request failed");
    return data.text || "";
  } catch (e) {
    if (e?.name === "AbortError") throw new Error("The AI took too long. Check your connection and try again.");
    if (e instanceof TypeError) throw new Error("Couldn't reach the server. Check your connection and try again.");
    throw e;
  } finally { clearTimeout(timer); }
}

async function parseVoiceEntry(text, programs, behaviors) {
  const progList = programs.map((p) => `- ${p.id}: "${p.name}" (${p.group ? p.group + " group" : (p.domain || "") + " domain"})`).join("\n");
  const behList = behaviors.map((b) => `- ${b.id}: "${b.name}"`).join("\n");
  const raw = await askClaude(
    `You are an ABA session data parser. Parse the RBT's verbal note into structured data.\n\nPROGRAMS:\n${progList}\n\nBEHAVIORS:\n${behList}\n\nReturn ONLY valid JSON with no markdown:\n{"trials":[{"programId":"p1","marks":["+"]}],"behaviors":[{"behaviorId":"b1","delta":1}],"abcs":[{"antecedent":"...","behavior":"...","consequence":"...","function":"escape"}],"summary":"one sentence of what was parsed"}\n\n+ = independent/correct, - = prompted/incorrect. Only include programs/behaviors actually mentioned. If count of a behavior is mentioned use that as delta.\n\nRBT note: "${text}"`
  );
  const cleaned = raw.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleaned);
}

// ================= APP =================
export default function BehaviorHubRBT() {
  const [view, setView] = useState("roster");
  const [client, setClient] = useState(null);
  const [supervisorClientId, setSupervisorClientId] = useState(null);

  useEffect(() => {
    const cid = new URLSearchParams(window.location.search).get("supervisor");
    if (cid) setSupervisorClientId(cid);
  }, []);

  if (supervisorClientId) {
    const sc = CLIENTS.find((cl) => cl.id === supervisorClientId);
    return (
      <div className="font-body min-h-screen w-full" style={{ background: c.bg, color: c.ink }}>
        <style>{FONTS}</style>
        <div className="max-w-3xl mx-auto px-4 py-5"><SupervisorView client={sc} /></div>
      </div>
    );
  }

  return (
    <div className="font-body min-h-screen w-full" style={{ background: c.bg, color: c.ink }}>
      <style>{FONTS}</style>
      <div className="max-w-3xl mx-auto px-4 py-5">
        {view === "roster" && <Roster onOpen={(cl) => { setClient(cl); setView("client"); }} />}
        {view === "client" && client && <ClientHub client={client} onBack={() => setView("roster")} onStart={() => setView("session")} />}
        {view === "session" && client && <LiveSession client={client} onExit={() => setView("client")} />}
      </div>
    </div>
  );
}

// ---------------- Supervisor View ----------------
function SupervisorView({ client }) {
  const live = useReceiveBroadcast();
  const hasData = live !== null;
  const programs = live?.programs ?? [];
  const behaviors = live?.behaviors ?? [];
  const abc = live?.abc ?? [];
  const notes = live?.notes ?? [];
  const secs = live?.secs ?? 0;
  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");

  if (!client) return (
    <div className="text-center py-20" style={{ color: c.muted }}>
      <Users size={40} className="mx-auto mb-3 opacity-30" />
      <p className="text-sm font-medium">Client not found.</p>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="font-display text-2xl" style={{ fontWeight: 800 }}>Supervisor view</div>
          <div className="text-xs mt-0.5" style={{ color: c.muted }}>Read-only · live via same-browser sync</div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm" style={{ background: hasData ? c.accentSoft : c.bg, color: hasData ? c.accent : c.muted, fontWeight: 700 }}>
          <span className="w-2 h-2 rounded-full" style={{ background: hasData ? c.accent : c.line, animation: hasData ? "pulse 2s infinite" : "none" }} />
          {hasData ? `LIVE · ${mm}:${ss}` : "Waiting for session…"}
        </div>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <div className="grid place-items-center rounded-2xl font-display text-xl" style={{ width: 52, height: 52, background: client.color, color: "#fff", fontWeight: 800 }}>
          {client.name.split(" ").map((w) => w[0]).join("")}
        </div>
        <div>
          <div className="font-display text-xl" style={{ fontWeight: 800 }}>{client.name}</div>
          <div className="text-xs" style={{ color: c.muted }}>Age {client.age}</div>
        </div>
      </div>
      {!hasData ? (
        <Card>
          <div className="text-center py-8" style={{ color: c.muted }}>
            <Eye size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No active session broadcasting</p>
            <p className="text-xs mt-1">Open the RBT's session in another tab in the same browser, then tap the eye icon to share.</p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-3">
          <Card>
            <Label icon={ClipboardList}>Skills</Label>
            <div className="grid gap-2 mt-3">
              {programs.filter((p) => p.trials.length).length === 0
                ? <p className="text-sm" style={{ color: c.muted }}>No trials recorded yet.</p>
                : programs.filter((p) => p.trials.length).map((p) => {
                    const v = pct(p.trials);
                    return (
                      <div key={p.id} className="flex items-center justify-between">
                        <div className="text-sm" style={{ fontWeight: 600 }}>{p.name}</div>
                        <div className="text-sm" style={{ fontWeight: 800, color: pctColor(v) }}>{v}% ({p.trials.filter((t) => t === "+").length}/{p.trials.length})</div>
                      </div>
                    );
                  })}
            </div>
          </Card>
          <Card>
            <Label icon={Activity}>Behaviors</Label>
            <div className="flex gap-3 mt-3 flex-wrap">
              {behaviors.map((b) => (
                <div key={b.id} className="px-3 py-2 rounded-xl text-center min-w-[80px]" style={{ background: b.count > 0 ? c.accentSoft : c.bg }}>
                  <div className="font-display text-xl" style={{ fontWeight: 800, color: b.count > 0 ? c.accent : c.muted }}>{b.count}</div>
                  <div className="text-xs" style={{ color: c.muted }}>{b.name}</div>
                </div>
              ))}
            </div>
          </Card>
          {abc.length > 0 && (
            <Card>
              <Label icon={Zap}>ABC events ({abc.length})</Label>
              <div className="grid gap-2 mt-3">
                {abc.slice(0, 4).map((e, i) => (
                  <div key={i} className="p-2.5 rounded-xl text-sm" style={{ background: c.bg }}>
                    <span className="capitalize text-xs px-2 py-0.5 rounded-full mr-2" style={{ background: c.accentSoft, color: c.accent, fontWeight: 700 }}>{e.function}</span>
                    <span style={{ color: c.muted }}>A:</span> {e.antecedent || "—"} · <b>B:</b> {e.behavior}
                  </div>
                ))}
              </div>
            </Card>
          )}
          {notes.length > 0 && (
            <Card>
              <Label icon={Brain}>Technician notes</Label>
              <div className="grid gap-1.5 mt-3">
                {notes.map((n, i) => (
                  <div key={i} className="text-sm p-2 rounded-lg" style={{ background: c.bg }}>
                    <span className="text-xs mr-2" style={{ color: c.muted }}>{n.time}</span>{n.text}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------- Roster ----------------
function Roster({ onOpen }) {
  const [resetFlash, setResetFlash] = useState(false);
  const handleReset = () => { clearAllSessions(); setResetFlash(true); setTimeout(() => setResetFlash(false), 1800); };
  return (
    <div>
      <div className="flex items-start justify-between gap-2">
        <Header title="My clients" subtitle="Tap a client to open their hub" icon={ClipboardList} />
        <button onClick={handleReset} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs shrink-0 mt-0.5"
          style={{ background: resetFlash ? c.primarySoft : c.bg, color: resetFlash ? c.primary : c.muted, fontWeight: 600, border: `1px solid ${c.line}` }}>
          <RotateCcw size={12} />{resetFlash ? "Demo reset!" : "Reset demo"}
        </button>
      </div>
      <div className="grid gap-3 mt-4">
        {CLIENTS.map((cl) => (
          <button key={cl.id} onClick={() => onOpen(cl)} className="flex items-center gap-3 p-4 rounded-2xl text-left transition-transform active:scale-[0.99]"
            style={{ background: c.surface, border: `1px solid ${c.line}` }}>
            <div className="grid place-items-center rounded-2xl font-display text-lg" style={{ width: 46, height: 46, background: cl.color, color: "#fff", fontWeight: 800 }}>
              {cl.name.split(" ").map((w) => w[0]).join("")}
            </div>
            <div className="flex-1">
              <div className="font-display text-lg" style={{ fontWeight: 700 }}>{cl.name}</div>
              <div className="text-xs" style={{ color: c.muted }}>Age {cl.age} · {cl.programs} programs · {cl.behaviors} behaviors · last {cl.last}</div>
            </div>
            <ChevronRight size={20} style={{ color: c.muted }} />
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------------- Client Hub ----------------
function ClientHub({ client, onBack, onStart }) {
  const [tab, setTab] = useState("session");
  const hasActiveSession = !!loadSession(client.id);
  const tabs = [
    { k: "session", label: "Session", icon: Activity },
    { k: "history", label: "History", icon: TrendingUp },
    { k: "docs", label: "Documents", icon: FileText },
    { k: "protocols", label: "Protocols", icon: BookOpen },
    { k: "preauth", label: "Pre-auth", icon: Shield },
  ];
  return (
    <div>
      <BackBar onBack={onBack} label="All clients" />
      <div className="flex items-center gap-3 mt-3">
        <div className="grid place-items-center rounded-2xl font-display text-xl" style={{ width: 52, height: 52, background: client.color, color: "#fff", fontWeight: 800 }}>
          {client.name.split(" ").map((w) => w[0]).join("")}
        </div>
        <div>
          <div className="font-display text-2xl" style={{ fontWeight: 800 }}>{client.name}</div>
          <div className="text-xs" style={{ color: c.muted }}>Age {client.age} · {client.programs} active programs</div>
        </div>
      </div>
      <SegTabs tabs={tabs} active={tab} onChange={setTab} />
      <div className="mt-4">
        {tab === "session" && (
          <Card>
            <Label icon={Calendar}>Today's session</Label>
            {hasActiveSession && (
              <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-xl text-xs" style={{ background: c.accentSoft, color: c.accent, fontWeight: 600 }}>
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c.accent }} />
                In-progress session restored — your data is safe.
              </div>
            )}
            <p className="text-sm mt-2 mb-4" style={{ color: c.muted }}>
              {hasActiveSession ? `Continue your in-progress session for ${client.name}.` : `Start a new data-collection session for ${client.name}. Skills and behaviors are collected on separate tabs with a live AI assistant.`}
            </p>
            <button onClick={onStart} className="w-full py-3 rounded-xl font-display text-base transition-transform active:scale-95" style={{ background: c.primary, color: "#fff", fontWeight: 700 }}>
              {hasActiveSession ? "Continue session →" : "Start session →"}
            </button>
          </Card>
        )}
        {tab === "history" && (
          <div className="grid gap-2.5">
            {!(PAST_SESSIONS[client.id]?.length) ? <EmptyState icon={TrendingUp} message="No past sessions recorded yet." /> :
              (PAST_SESSIONS[client.id] || []).map((s, i) => (
                <Card key={i}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-display text-base" style={{ fontWeight: 700 }}>{s.date}</div>
                      <div className="text-xs" style={{ color: c.muted }}>{s.duration} · {s.behaviors} behavior events</div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-xl" style={{ fontWeight: 800, color: c.primary }}>{s.skillPct}%</div>
                      <div className="text-xs flex items-center gap-1 justify-end" style={{ color: s.signed ? c.plus : c.accent }}>
                        {s.signed ? <><Check size={12} /> signed</> : <>note pending</>}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        )}
        {tab === "docs" && (
          <div className="grid gap-2.5">
            {!(DOCUMENTS[client.id]?.length) ? <EmptyState icon={FileText} message="No documents on file yet." /> :
              (DOCUMENTS[client.id] || []).map((d, i) => (
                <Card key={i}>
                  <div className="flex items-center gap-2 mb-1"><FileText size={15} style={{ color: c.primary }} /><span className="font-display text-base" style={{ fontWeight: 700 }}>{d.title}</span></div>
                  <div className="text-xs mb-2" style={{ color: c.muted }}>{d.date}</div>
                  <p className="text-sm leading-relaxed">{d.body}</p>
                </Card>
              ))}
          </div>
        )}
        {tab === "protocols" && (
          <div className="grid gap-2.5">
            {!(PROTOCOLS[client.id]?.length) ? <EmptyState icon={BookOpen} message="No protocols on file yet." /> :
              (PROTOCOLS[client.id] || []).map((p, i) => (
                <Card key={i}>
                  <div className="flex items-center gap-2 mb-2"><BookOpen size={15} style={{ color: c.primary }} /><span className="font-display text-base" style={{ fontWeight: 700 }}>{p.title}</span></div>
                  <p className="text-sm leading-relaxed">{p.body}</p>
                </Card>
              ))}
          </div>
        )}
        {tab === "preauth" && <PreAuthTab client={client} />}
      </div>
    </div>
  );
}

// ---------------- Pre-auth Tab ----------------
function PreAuthTab({ client }) {
  const [diagnosis, setDiagnosis] = useState("Autism Spectrum Disorder (F84.0), Level 2");
  const [hours, setHours] = useState("25");
  const [period, setPeriod] = useState("6 months");
  const [letter, setLetter] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const sessions = PAST_SESSIONS[client.id] || [];
  const avgSkill = sessions.length ? Math.round(sessions.reduce((s, sess) => s + sess.skillPct, 0) / sessions.length) : null;

  const generate = async () => {
    setBusy(true); setError("");
    try {
      const out = await askClaude(
        `Draft a prior authorization request letter for ABA therapy services. Use professional, insurance-appropriate medical necessity language. Sections: patient info, diagnosis & clinical justification, current functioning, treatment goals, requested services, and supporting data.\n\nClient: ${client.name}, Age: ${client.age}\nDiagnosis: ${diagnosis}\nRequested: ${hours} hours/week of direct ABA therapy (CPT 97153) for ${period}\n${avgSkill !== null ? `Recent performance: ${avgSkill}% average skill accuracy across ${sessions.length} documented sessions.` : "Initial authorization request."}\nActive programs: ${PROGRAM_TEMPLATE.length} programs across compliance, motor imitation, receptive identification, manding, and tacting domains.\nBehavior reduction targets: ${BEHAVIOR_TEMPLATE.map((b) => b.name).join(", ")}.\n\nEnd with BCBA signature and date lines. Note this is a draft for clinician review.`
      );
      setLetter(out.trim());
    } catch (e) { setError(e instanceof Error ? e.message : "Couldn't generate the letter right now."); }
    finally { setBusy(false); }
  };

  return (
    <div className="grid gap-3">
      <Card>
        <Label icon={Shield}>Prior authorization request</Label>
        <p className="text-sm mt-2 mb-3" style={{ color: c.muted }}>Fill in the details and let AI draft the medical necessity letter. Your BCBA reviews and submits.</p>
        <div className="grid gap-2">
          <div>
            <div className="text-xs mb-1" style={{ color: c.muted, fontWeight: 600 }}>Diagnosis</div>
            <Inp v={diagnosis} set={setDiagnosis} ph="Diagnosis + ICD-10 code" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-xs mb-1" style={{ color: c.muted, fontWeight: 600 }}>Hours / week</div>
              <Inp v={hours} set={setHours} ph="e.g. 25" />
            </div>
            <div>
              <div className="text-xs mb-1" style={{ color: c.muted, fontWeight: 600 }}>Auth period</div>
              <Inp v={period} set={setPeriod} ph="e.g. 6 months" />
            </div>
          </div>
        </div>
        {error && <div className="text-sm mt-3 p-3 rounded-xl" style={{ background: c.accentSoft, color: c.accent }}>{error}</div>}
        <button onClick={generate} disabled={busy} className="w-full mt-3 flex items-center justify-center gap-2 py-3 rounded-xl text-sm transition-transform active:scale-95" style={{ background: c.primary, color: "#fff", fontWeight: 700 }}>
          {busy ? <><Loader2 size={15} className="animate-spin" /> Drafting letter…</> : <><Sparkles size={15} /> {letter ? "Re-draft letter" : "Draft pre-auth letter"}</>}
        </button>
      </Card>
      {letter && (
        <Card>
          <div className="flex items-center gap-2 mb-2">
            <FileSignature size={15} style={{ color: c.primary }} />
            <span className="text-sm" style={{ fontWeight: 600 }}>Draft letter — edit before submitting</span>
          </div>
          <textarea value={letter} onChange={(e) => setLetter(e.target.value)} rows={18}
            className="w-full p-3 rounded-xl text-sm outline-none leading-relaxed" style={{ background: c.bg, border: `1px solid ${c.line}`, whiteSpace: "pre-wrap" }} />
        </Card>
      )}
    </div>
  );
}

// ---------------- Live Session ----------------
function LiveSession({ client, onExit }) {
  const [tab, setTab] = useState("skills");
  const [programs, setPrograms] = useState(() => loadSession(client.id)?.programs ?? PROGRAM_TEMPLATE.map((p) => ({ ...p, trials: [] })));
  const [behaviors, setBehaviors] = useState(() => loadSession(client.id)?.behaviors ?? BEHAVIOR_TEMPLATE.map((b) => ({ ...b, count: 0 })));
  const [abc, setAbc] = useState(() => loadSession(client.id)?.abc ?? []);
  const [notes, setNotes] = useState(() => loadSession(client.id)?.notes ?? []);
  const [secs, setSecs] = useState(() => loadSession(client.id)?.secs ?? 0);
  const [ending, setEnding] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => { const t = setInterval(() => setSecs((s) => s + 1), 1000); return () => clearInterval(t); }, []);
  useEffect(() => { saveSession(client.id, { programs, behaviors, abc, notes, secs }); }, [programs, behaviors, abc, notes, secs]);

  // Broadcast for supervisor view
  useBroadcastSession(client.id, { programs, behaviors, abc, notes, secs });

  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");

  const score = (pid, mark) => setPrograms((ps) => ps.map((p) => p.id === pid ? { ...p, trials: [...p.trials, mark] } : p));
  const undo = (pid) => setPrograms((ps) => ps.map((p) => p.id === pid ? { ...p, trials: p.trials.slice(0, -1) } : p));
  const bump = (bid, d) => setBehaviors((bs) => bs.map((b) => b.id === bid ? { ...b, count: Math.max(0, b.count + d) } : b));
  const addAbc = (ev) => setAbc((a) => [{ ...ev, time: now() }, ...a]);
  const addNote = (text) => setNotes((n) => [...n, { text, time: now() }]);
  const handleExit = () => { clearSession(client.id); onExit(); };
  const handleDone = () => { clearSession(client.id); onExit(); };

  const applyVoiceEntry = ({ trials, behaviors: behDeltas, abcs }) => {
    if (trials?.length) setPrograms((ps) => ps.map((p) => { const t = trials.find((t) => t.programId === p.id); return t ? { ...p, trials: [...p.trials, ...t.marks] } : p; }));
    if (behDeltas?.length) setBehaviors((bs) => bs.map((b) => { const bd = behDeltas.find((d) => d.behaviorId === b.id); return bd ? { ...b, count: Math.max(0, b.count + (bd.delta || 0)) } : b; }));
    if (abcs?.length) { const ts = now(); setAbc((a) => [...abcs.map((e) => ({ ...e, time: ts })), ...a]); }
  };

  const tabs = [
    { k: "skills", label: "Skills", icon: ClipboardList },
    { k: "behaviors", label: "Behaviors", icon: Activity },
    { k: "ai", label: "AI notes", icon: Brain },
  ];

  return (
    <div>
      <div className="flex items-center justify-between gap-2 sticky top-0 z-10 py-2" style={{ background: c.bg }}>
        <button onClick={handleExit} className="flex items-center gap-1 text-sm" style={{ color: c.muted, fontWeight: 600 }}><ArrowLeft size={16} /> Exit</button>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm" style={{ background: c.accentSoft, color: c.accent, fontWeight: 700 }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: c.accent }} /> {mm}:{ss}
          </div>
          <button onClick={() => setShareOpen(true)} title="Supervisor view" className="grid place-items-center rounded-xl transition-transform active:scale-95" style={{ width: 34, height: 34, background: c.primarySoft, color: c.primary }}>
            <Eye size={16} />
          </button>
        </div>
        <button onClick={() => setEnding(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm transition-transform active:scale-95" style={{ background: c.primary, color: "#fff", fontWeight: 700 }}>
          <FileSignature size={15} /> End
        </button>
      </div>

      <div className="font-display text-xl mt-1" style={{ fontWeight: 800 }}>{client.name} · session</div>
      <SegTabs tabs={tabs} active={tab} onChange={setTab} />

      <div className="mt-4 pb-24">
        {tab === "skills" && <SkillsPage programs={programs} onScore={score} onUndo={undo} />}
        {tab === "behaviors" && <BehaviorsPage behaviors={behaviors} onBump={bump} abc={abc} onAddAbc={addAbc} />}
        {tab === "ai" && <AINotesPage client={client} programs={programs} behaviors={behaviors} abc={abc} notes={notes} onAddNote={addNote} />}
      </div>

      {/* Floating voice entry button */}
      <button onClick={() => setVoiceOpen(true)} className="fixed bottom-6 right-4 z-20 flex items-center gap-2 px-4 py-3 rounded-full transition-transform active:scale-95"
        style={{ background: c.ink, color: "#fff", fontWeight: 700, boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }}>
        <Mic size={17} /><span className="text-sm">Voice entry</span>
      </button>

      {voiceOpen && <VoiceEntryModal programs={programs} behaviors={behaviors} onApply={applyVoiceEntry} onClose={() => setVoiceOpen(false)} />}
      {shareOpen && <ShareModal clientId={client.id} onClose={() => setShareOpen(false)} />}
      {ending && <EndSessionModal client={client} duration={`${mm}:${ss}`} programs={programs} behaviors={behaviors} abc={abc} notes={notes} onClose={() => setEnding(false)} onDone={handleDone} />}
    </div>
  );
}

// ---------------- Voice Entry Modal ----------------
function VoiceEntryModal({ programs, behaviors, onApply, onClose }) {
  const [text, setText] = useState("");
  const [parsed, setParsed] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const dict = useDictation();

  const parse = async () => {
    if (!text.trim()) return;
    setBusy(true); setError(""); setParsed(null);
    try { setParsed(await parseVoiceEntry(text, programs, behaviors)); }
    catch { setError("Couldn't parse your note. Try being more specific about program names, or check your connection."); }
    finally { setBusy(false); }
  };

  const apply = () => { onApply(parsed); onClose(); };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3" style={{ background: "rgba(27,42,40,0.5)" }}>
      <div className="w-full max-w-lg rounded-2xl p-5 max-h-[90vh] overflow-auto" style={{ background: c.surface }}>
        <div className="flex items-center justify-between mb-1">
          <div className="font-display text-xl" style={{ fontWeight: 800 }}>Voice entry</div>
          <button onClick={onClose} className="grid place-items-center rounded-lg" style={{ width: 32, height: 32, background: c.bg }}><X size={18} /></button>
        </div>
        <p className="text-sm mb-3" style={{ color: c.muted }}>Describe what happened — programs run, prompts needed, behaviors. AI will parse it into your session data.</p>

        <div className="relative">
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4}
            placeholder="e.g. Jordan got compliance independently, needed a model on gross and fine motor, got all the animals, had two elopements during transitions…"
            className="w-full p-3 pr-14 rounded-xl text-sm outline-none resize-none" style={{ background: c.bg, border: `1px solid ${dict.listening ? c.accent : c.line}` }} />
          <button onClick={dict.listening ? dict.stop : () => dict.start(setText)}
            className="absolute bottom-3 right-3 grid place-items-center rounded-lg" style={{ width: 36, height: 36, background: dict.listening ? c.ink : c.accent, color: "#fff" }}>
            {dict.listening ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
        </div>
        {dict.listening && <div className="text-xs mt-1" style={{ color: c.accent, fontWeight: 600 }}>● Listening — speak naturally…</div>}

        {error && (
          <div className="text-sm mt-3 p-3 rounded-xl" style={{ background: c.accentSoft, color: c.accent }}>{error}</div>
        )}

        {!parsed ? (
          <button onClick={parse} disabled={busy || !text.trim()} className="w-full mt-3 flex items-center justify-center gap-2 py-3 rounded-xl text-sm transition-transform active:scale-95"
            style={{ background: text.trim() ? c.primary : c.line, color: "#fff", fontWeight: 700 }}>
            {busy ? <><Loader2 size={15} className="animate-spin" /> Parsing…</> : <><Sparkles size={15} /> Parse with AI</>}
          </button>
        ) : (
          <div className="mt-3">
            <div className="p-3 rounded-xl" style={{ background: c.primarySoft }}>
              <div className="text-sm font-medium mb-2" style={{ color: c.primary }}>Ready to log:</div>
              {parsed.summary && <p className="text-sm mb-2">{parsed.summary}</p>}
              <div className="grid gap-1">
                {parsed.trials?.map((t) => { const prog = programs.find((p) => p.id === t.programId); if (!prog) return null; const plus = t.marks.filter((m) => m === "+").length; const minus = t.marks.filter((m) => m === "-").length; return (
                  <div key={t.programId} className="flex items-center gap-2 text-xs">
                    <span style={{ fontWeight: 600 }}>{prog.name}</span>
                    {plus > 0 && <span className="px-1.5 py-0.5 rounded" style={{ background: c.plus, color: "#fff", fontWeight: 700 }}>+{plus}</span>}
                    {minus > 0 && <span className="px-1.5 py-0.5 rounded" style={{ background: c.minus, color: "#fff", fontWeight: 700 }}>−{minus}</span>}
                  </div>
                ); })}
                {parsed.behaviors?.filter((bd) => bd.delta > 0).map((bd) => { const beh = behaviors.find((b) => b.id === bd.behaviorId); if (!beh) return null; return <div key={bd.behaviorId} className="text-xs"><span style={{ fontWeight: 600 }}>{beh.name}:</span> +{bd.delta} occurrence{bd.delta > 1 ? "s" : ""}</div>; })}
                {parsed.abcs?.length > 0 && <div className="text-xs" style={{ color: c.muted }}>{parsed.abcs.length} ABC event{parsed.abcs.length > 1 ? "s" : ""} logged</div>}
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => setParsed(null)} className="flex-1 py-2.5 rounded-xl text-sm" style={{ background: c.bg, color: c.muted, fontWeight: 600 }}>Edit note</button>
              <button onClick={apply} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm transition-transform active:scale-95" style={{ background: c.plus, color: "#fff", fontWeight: 700 }}>
                <Check size={16} /> Apply to session
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------- Share Modal (BCBA supervision) ----------------
function ShareModal({ clientId, onClose }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? `${window.location.origin}/?supervisor=${clientId}` : "";
  const copy = () => { navigator.clipboard?.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3" style={{ background: "rgba(27,42,40,0.5)" }}>
      <div className="w-full max-w-md rounded-2xl p-5" style={{ background: c.surface }}>
        <div className="flex items-center justify-between mb-3">
          <div className="font-display text-lg" style={{ fontWeight: 800 }}>Supervisor view</div>
          <button onClick={onClose} className="grid place-items-center rounded-lg" style={{ width: 32, height: 32, background: c.bg }}><X size={18} /></button>
        </div>
        <p className="text-sm mb-3" style={{ color: c.muted }}>Open this link in another tab in <b>the same browser</b> to watch session data as it's recorded — read-only.</p>
        <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: c.bg }}>
          <div className="flex-1 text-xs break-all" style={{ color: c.ink }}>{url}</div>
          <button onClick={copy} className="grid place-items-center rounded-lg shrink-0 transition-all" style={{ width: 32, height: 32, background: copied ? c.plus : c.primary, color: "#fff" }}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
        <div className="flex items-start gap-2 mt-3 p-3 rounded-xl text-xs" style={{ background: c.primarySoft, color: c.primary }}>
          <Eye size={14} className="shrink-0 mt-0.5" />
          <span>Skills, behaviors, ABCs, and notes sync live. Cross-device sync (database-backed) is on the roadmap.</span>
        </div>
      </div>
    </div>
  );
}

// ---- Skills page ----
function pct(trials) { return trials.length ? Math.round(trials.filter((t) => t === "+").length / trials.length * 100) : null; }
function pctColor(v) { return v >= 80 ? c.plus : v >= 50 ? c.gold : c.minus; }

function Chips({ trials }) {
  if (!trials.length) return null;
  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {trials.map((t, i) => <span key={i} className="grid place-items-center rounded-md text-xs" style={{ width: 20, height: 20, background: t === "+" ? c.plus : c.minus, color: "#fff", fontWeight: 800 }}>{t}</span>)}
    </div>
  );
}
function ScoreButtons({ p, onScore, onUndo, small }) {
  const pad = small ? "py-2" : "py-3"; const ic = small ? 18 : 22;
  return (
    <div className="flex items-center gap-2 mt-2">
      <button onClick={() => onScore(p.id, "+")} className={`flex-1 grid place-items-center ${pad} rounded-xl transition-transform active:scale-95`} style={{ background: c.plus, color: "#fff" }}><Plus size={ic} strokeWidth={3} /></button>
      <button onClick={() => onScore(p.id, "-")} className={`flex-1 grid place-items-center ${pad} rounded-xl transition-transform active:scale-95`} style={{ background: c.minus, color: "#fff" }}><Minus size={ic} strokeWidth={3} /></button>
      <button onClick={() => onUndo(p.id)} disabled={!p.trials.length} className={`grid place-items-center ${pad} px-3 rounded-xl`} style={{ background: c.bg, color: p.trials.length ? c.muted : c.line }}><Undo2 size={16} /></button>
    </div>
  );
}
function LeafCard({ p, onScore, onUndo }) {
  const v = pct(p.trials);
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="font-display text-base" style={{ fontWeight: 700 }}>{p.name}</div>
          <div className="text-xs" style={{ color: c.muted }}>{p.domain} · {p.prompt}</div>
        </div>
        {v !== null && <div className="text-right"><div className="font-display text-lg" style={{ fontWeight: 800, color: pctColor(v) }}>{v}%</div><div className="text-xs" style={{ color: c.muted }}>{p.trials.filter((t) => t === "+").length}/{p.trials.length}</div></div>}
      </div>
      <Chips trials={p.trials} />
      <ScoreButtons p={p} onScore={onScore} onUndo={onUndo} />
    </Card>
  );
}
function GroupCard({ blk, open, toggle, onScore, onUndo }) {
  const all = blk.items.flatMap((it) => it.trials); const v = pct(all);
  return (
    <Card>
      <button onClick={toggle} className="w-full flex items-center justify-between gap-3 text-left">
        <div className="flex items-center gap-2">
          <ChevronDown size={18} style={{ color: c.muted, transform: open ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform .15s" }} />
          <div>
            <div className="font-display text-base" style={{ fontWeight: 700 }}>{blk.name}</div>
            <div className="text-xs" style={{ color: c.muted }}>{blk.items.length} sub-targets{v !== null ? ` · ${all.length} trials` : ""}</div>
          </div>
        </div>
        {v !== null && <div className="font-display text-lg" style={{ fontWeight: 800, color: pctColor(v) }}>{v}%</div>}
      </button>
      {open && (
        <div className="grid gap-3 mt-3 pl-3" style={{ borderLeft: `2px solid ${c.primarySoft}` }}>
          {blk.items.map((it) => { const sv = pct(it.trials); return (
            <div key={it.id}>
              <div className="flex items-center justify-between">
                <div><div className="text-sm" style={{ fontWeight: 600 }}>{it.name}</div><div className="text-xs" style={{ color: c.muted }}>{it.prompt}</div></div>
                {sv !== null && <div className="text-sm" style={{ fontWeight: 800, color: pctColor(sv) }}>{sv}% · {it.trials.filter((t) => t === "+").length}/{it.trials.length}</div>}
              </div>
              <Chips trials={it.trials} />
              <ScoreButtons p={it} onScore={onScore} onUndo={onUndo} small />
            </div>
          ); })}
        </div>
      )}
    </Card>
  );
}
function SkillsPage({ programs, onScore, onUndo }) {
  const [open, setOpen] = useState({ "Motor imitation": true });
  const blocks = []; const seen = {};
  programs.forEach((p) => {
    if (p.group) { if (!seen[p.group]) { seen[p.group] = { type: "group", name: p.group, items: [] }; blocks.push(seen[p.group]); } seen[p.group].items.push(p); }
    else blocks.push({ type: "leaf", item: p });
  });
  return (
    <div className="grid gap-3">
      <p className="text-sm" style={{ color: c.muted }}>Tap <b style={{ color: c.plus }}>+</b> for correct/independent, <b style={{ color: c.minus }}>−</b> for prompted/incorrect. Or use <b>Voice entry</b> to log multiple programs at once.</p>
      {blocks.map((blk) => blk.type === "leaf"
        ? <LeafCard key={blk.item.id} p={blk.item} onScore={onScore} onUndo={onUndo} />
        : <GroupCard key={blk.name} blk={blk} open={!!open[blk.name]} toggle={() => setOpen((o) => ({ ...o, [blk.name]: !o[blk.name] }))} onScore={onScore} onUndo={onUndo} />
      )}
    </div>
  );
}

// ---- Behaviors page ----
function BehaviorsPage({ behaviors, onBump, abc, onAddAbc }) {
  const [a, setA] = useState(""), [b, setB] = useState(""), [con, setCon] = useState(""), [fn, setFn] = useState("escape");
  const log = () => { if (!b.trim()) return; onAddAbc({ antecedent: a, behavior: b, consequence: con, function: fn }); setA(""); setB(""); setCon(""); };
  return (
    <div className="grid gap-3">
      <Card>
        <Label icon={Activity}>Frequency counts</Label>
        <div className="grid gap-2 mt-3">
          {behaviors.map((bh) => (
            <div key={bh.id} className="flex items-center gap-3">
              <div className="flex-1 text-sm" style={{ fontWeight: 600 }}>{bh.name}</div>
              <button onClick={() => onBump(bh.id, -1)} className="grid place-items-center rounded-lg" style={{ width: 34, height: 34, background: c.bg, color: c.muted }}><Minus size={16} /></button>
              <div className="font-display text-xl w-8 text-center" style={{ fontWeight: 800 }}>{bh.count}</div>
              <button onClick={() => onBump(bh.id, 1)} className="grid place-items-center rounded-lg transition-transform active:scale-95" style={{ width: 34, height: 34, background: c.accent, color: "#fff" }}><Plus size={16} /></button>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <Label icon={Plus}>Log an ABC</Label>
        <div className="grid gap-2 mt-3">
          <Inp v={a} set={setA} ph="Antecedent — what happened before" />
          <Inp v={b} set={setB} ph="Behavior — observable" />
          <Inp v={con} set={setCon} ph="Consequence — what happened after" />
          <select value={fn} onChange={(e) => setFn(e.target.value)} className="p-2.5 rounded-xl text-sm outline-none capitalize" style={{ background: c.bg, border: `1px solid ${c.line}` }}>
            {["escape", "attention", "tangible", "sensory", "unclear"].map((o) => <option key={o}>{o}</option>)}
          </select>
          <button onClick={log} className="py-2.5 rounded-xl text-sm transition-transform active:scale-95" style={{ background: c.primary, color: "#fff", fontWeight: 600 }}>Log ABC</button>
        </div>
      </Card>
      {abc.length > 0 && (
        <Card>
          <Label icon={ClipboardList}>This session ({abc.length})</Label>
          <div className="grid gap-2 mt-3">
            {abc.map((e, i) => (
              <div key={i} className="p-2.5 rounded-xl text-sm" style={{ background: c.bg }}>
                <div className="flex justify-between"><span className="capitalize text-xs px-2 py-0.5 rounded-full" style={{ background: c.accentSoft, color: c.accent, fontWeight: 700 }}>{e.function}</span><span className="text-xs" style={{ color: c.muted }}>{e.time}</span></div>
                <div className="mt-1"><span style={{ color: c.muted }}>A:</span> {e.antecedent || "—"} · <b>B:</b> {e.behavior} · <span style={{ color: c.muted }}>C:</span> {e.consequence || "—"}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// ---- AI Notes page ----
function AINotesPage({ client, programs, behaviors, abc, notes, onAddNote }) {
  const [draft, setDraft] = useState("");
  const [summary, setSummary] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const dict = useDictation();
  const hasData = programs.some((p) => p.trials.length) || behaviors.some((b) => b.count) || abc.length > 0 || notes.length > 0;

  const dataContext = () => {
    const skills = programs.filter((p) => p.trials.length).map((p) => `${p.group ? p.group + " – " : ""}${p.name} (${p.prompt}): ${p.trials.join(" ")} = ${Math.round(p.trials.filter((t) => t === "+").length / p.trials.length * 100)}%`).join("; ");
    const beh = behaviors.filter((b) => b.count).map((b) => `${b.name} x${b.count}`).join("; ");
    const abcs = abc.map((e) => `A:${e.antecedent} B:${e.behavior} C:${e.consequence} (fn:${e.function})`).join(" | ");
    const ns = notes.map((n) => n.text).join(" ");
    return `Client: ${client.name}. Skill probes: ${skills || "none yet"}. Behavior frequencies: ${beh || "none"}. ABC events: ${abcs || "none"}. Technician notes: ${ns || "none"}.`;
  };

  const generate = async () => {
    setBusy(true); setError("");
    try { setSummary((await askClaude(`You are an ABA clinical documentation assistant. Translate this in-progress session's raw data into a concise running clinical narrative (3-5 sentences) in professional ABA language. Weave in detail from technician notes. Be strictly factual — do not invent data not present.\n\nSession data:\n${dataContext()}`)).trim()); }
    catch (e) { setError(e instanceof Error ? e.message : "Couldn't generate the summary right now."); }
    finally { setBusy(false); }
  };

  return (
    <div className="grid gap-3">
      <Card accent>
        <div className="flex items-center justify-between">
          <Label icon={Brain}>Quick note (typed or dictated)</Label>
          {!dict.listening
            ? <button onClick={() => dict.start(setDraft)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs" style={{ background: c.accent, color: "#fff", fontWeight: 600 }}><Mic size={13} /> Dictate</button>
            : <button onClick={dict.stop} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs" style={{ background: c.ink, color: "#fff", fontWeight: 600 }}><MicOff size={13} /> Stop</button>}
        </div>
        {!dict.supported && <div className="text-xs mt-2" style={{ color: c.accent }}>Mic unavailable here — type your note instead.</div>}
        <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={2} placeholder="e.g. Jordan needed two extra prompts on imitation but stayed regulated after the break mand…"
          className="w-full mt-2 p-2.5 rounded-xl text-sm outline-none resize-none" style={{ background: c.bg, border: `1px solid ${c.line}` }} />
        <button onClick={() => { if (draft.trim()) { onAddNote(draft.trim()); setDraft(""); } }} className="w-full mt-2 py-2 rounded-xl text-sm" style={{ background: c.primary, color: "#fff", fontWeight: 600 }}>Add note to session</button>
        {notes.length > 0 && (
          <div className="grid gap-1.5 mt-3">
            {notes.map((n, i) => <div key={i} className="text-sm p-2 rounded-lg" style={{ background: c.bg }}><span className="text-xs mr-2" style={{ color: c.muted }}>{n.time}</span>{n.text}</div>)}
          </div>
        )}
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <Label icon={Sparkles}>Live clinical summary</Label>
          <button onClick={generate} disabled={busy || !hasData} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm transition-transform active:scale-95"
            style={{ background: hasData ? c.primary : c.line, color: "#fff", fontWeight: 600, opacity: busy ? 0.7 : 1 }}>
            {busy ? <><Loader2 size={14} className="animate-spin" /> Translating…</> : <><Sparkles size={14} /> {summary ? "Regenerate" : "Generate"}</>}
          </button>
        </div>
        {error && (
          <div className="flex items-center justify-between gap-3 text-sm mt-3 p-3 rounded-xl" style={{ background: c.accentSoft, color: c.accent }}>
            <span>{error}</span>
            <button onClick={generate} disabled={busy} className="px-3 py-1.5 rounded-lg text-xs shrink-0" style={{ background: c.accent, color: "#fff", fontWeight: 700 }}>Retry</button>
          </div>
        )}
        {summary
          ? <p className="text-sm leading-relaxed mt-3 p-3 rounded-xl" style={{ background: c.primarySoft }}>{summary}</p>
          : !error && (!hasData
              ? <div className="flex flex-col items-center text-center py-6 gap-2" style={{ color: c.muted }}><Brain size={30} style={{ opacity: 0.3 }} /><p className="text-sm">Score trials or log a behavior first, then Generate will write a clinical narrative from your data.</p></div>
              : <p className="text-sm mt-3" style={{ color: c.muted }}>AI reads your +/− probe data, behavior counts, ABCs, and notes, then crafts a clinical narrative.</p>
            )
        }
      </Card>

      {/* ABC pattern analysis — appears after 3+ events */}
      {abc.length >= 3 && <ABCInsights abc={abc} client={client} />}
    </div>
  );
}

// ---- ABC Pattern Insights ----
function ABCInsights({ abc, client }) {
  const [insight, setInsight] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    setBusy(true); setError("");
    try {
      const abcText = abc.map((e, i) => `${i + 1}. A: "${e.antecedent || "—"}" | B: "${e.behavior}" | C: "${e.consequence || "—"}" | Fn: ${e.function}`).join("\n");
      setInsight((await askClaude(`You are an ABA behavior analyst. Review these ${abc.length} ABC observations and identify patterns. Be concise (2-4 sentences). Identify the most likely maintaining function based on the data, note any consistent antecedents, and suggest one practical implication for the technician.\n\nClient: ${client.name}\nABC data:\n${abcText}`)).trim());
    } catch (e) { setError(e instanceof Error ? e.message : "Couldn't analyze patterns right now."); }
    finally { setBusy(false); }
  };

  return (
    <Card>
      <div className="flex items-center justify-between">
        <Label icon={Zap}>ABC pattern analysis</Label>
        <button onClick={analyze} disabled={busy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm transition-transform active:scale-95"
          style={{ background: c.gold, color: "#fff", fontWeight: 600, opacity: busy ? 0.7 : 1 }}>
          {busy ? <><Loader2 size={14} className="animate-spin" /> Analyzing…</> : <><Zap size={14} /> {insight ? "Re-analyze" : "Analyze"}</>}
        </button>
      </div>
      {error && (
        <div className="flex items-center justify-between gap-3 text-sm mt-3 p-3 rounded-xl" style={{ background: c.accentSoft, color: c.accent }}>
          <span>{error}</span>
          <button onClick={analyze} disabled={busy} className="px-3 py-1.5 rounded-lg text-xs shrink-0" style={{ background: c.accent, color: "#fff", fontWeight: 700 }}>Retry</button>
        </div>
      )}
      {insight
        ? <p className="text-sm leading-relaxed mt-3 p-3 rounded-xl" style={{ background: c.goldSoft, border: `1px solid ${c.gold}44` }}>{insight}</p>
        : !error && <p className="text-sm mt-3" style={{ color: c.muted }}>{abc.length} ABC events recorded — tap Analyze to identify maintaining functions and antecedent patterns.</p>
      }
    </Card>
  );
}

// ---- End session → insurance note + parent summary ----
function EndSessionModal({ client, duration, programs, behaviors, abc, notes, onClose, onDone }) {
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [drafted, setDrafted] = useState(false);
  const [error, setError] = useState("");

  const draft = async () => {
    setBusy(true); setError("");
    const skills = programs.filter((p) => p.trials.length).map((p) => `${p.group ? p.group + " – " : ""}${p.name} (${p.prompt}): ${Math.round(p.trials.filter((t) => t === "+").length / p.trials.length * 100)}% independent over ${p.trials.length} trials`).join("\n");
    const beh = behaviors.filter((b) => b.count).map((b) => `${b.name}: ${b.count}`).join(", ");
    const abcs = abc.map((e) => `${e.behavior} (antecedent: ${e.antecedent}; consequence: ${e.consequence}; function: ${e.function})`).join("; ");
    const ns = notes.map((n) => n.text).join(" ");
    try {
      const out = await askClaude(`You are an ABA clinical documentation assistant drafting a session note for insurance / medical-necessity review (CPT 97153, direct ABA). Produce a clear, professional note with these labeled sections: SESSION INFORMATION, PROGRAMS & PERFORMANCE, BEHAVIORS OBSERVED, CLINICAL NARRATIVE, PROGRESS TOWARD GOALS, PLAN. Use funder-appropriate ABA language. Use ONLY the data provided; do not fabricate. End with a line noting this is a draft requiring clinician review and signature.\nDATA — Client: ${client.name}; Session duration: ${duration}; Service: direct 1:1 ABA.\nPrograms:\n${skills || "none recorded"}\nBehavior frequencies: ${beh || "none"}\nABC events: ${abcs || "none"}\nTechnician notes: ${ns || "none"}`);
      setNote(out.trim()); setDrafted(true);
    } catch (e) { setError(e instanceof Error ? e.message : "Couldn't draft the note right now."); }
    finally { setBusy(false); }
  };

  const skillAvg = (() => { const u = programs.filter((p) => p.trials.length); return u.length ? Math.round(u.reduce((s, p) => s + p.trials.filter((t) => t === "+").length / p.trials.length, 0) / u.length * 100) : null; })();
  const behTotal = behaviors.reduce((s, b) => s + b.count, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3" style={{ background: "rgba(27,42,40,0.45)" }}>
      <div className="w-full max-w-lg rounded-2xl p-5 max-h-[90vh] overflow-auto" style={{ background: c.surface }}>
        <div className="flex items-center justify-between">
          <div className="font-display text-xl" style={{ fontWeight: 800 }}>End session</div>
          <button onClick={onClose} className="grid place-items-center rounded-lg" style={{ width: 32, height: 32, background: c.bg }}><X size={18} /></button>
        </div>
        <p className="text-sm mt-1" style={{ color: c.muted }}>Insurance requires a session note. Review the recap, draft with AI, then sign.</p>

        <div className="grid grid-cols-3 gap-2 mt-4">
          <Recap label="Duration" value={duration} />
          <Recap label="Skill avg" value={skillAvg !== null ? skillAvg + "%" : "—"} />
          <Recap label="Behaviors" value={behTotal} />
        </div>

        {error && <div className="text-sm mt-4 p-3 rounded-xl" style={{ background: c.accentSoft, color: c.accent }}>{error}</div>}

        {!drafted ? (
          <button onClick={draft} disabled={busy} className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl font-display text-base transition-transform active:scale-95" style={{ background: c.primary, color: "#fff", fontWeight: 700 }}>
            {busy ? <><Loader2 size={16} className="animate-spin" /> Drafting insurance note…</> : <><Sparkles size={16} /> {error ? "Try again" : "Draft insurance note with AI"}</>}
          </button>
        ) : (
          <>
            <div className="flex items-center gap-2 mt-4 mb-1">
              <FileSignature size={15} style={{ color: c.primary }} />
              <span className="text-sm" style={{ fontWeight: 600 }}>Session note — edit before signing</span>
            </div>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={10}
              className="w-full p-3 rounded-xl text-sm outline-none leading-relaxed" style={{ background: c.bg, border: `1px solid ${c.line}`, whiteSpace: "pre-wrap" }} />

            {/* Parent summary */}
            <ParentSummarySection client={client} programs={programs} behaviors={behaviors} duration={duration} />

            <button onClick={onDone} className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl text-base" style={{ background: c.plus, color: "#fff", fontWeight: 700 }}>
              <Check size={18} /> Sign & close session
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ---- Parent Summary Section ----
function ParentSummarySection({ client, programs, behaviors, duration }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    setBusy(true); setError("");
    const firstName = client.name.split(" ")[0];
    const skills = programs.filter((p) => p.trials.length).map((p) => `${p.name}: ${Math.round(p.trials.filter((t) => t === "+").length / p.trials.length * 100)}% independent`).join(", ");
    const behTotal = behaviors.reduce((s, b) => s + b.count, 0);
    try {
      setMessage((await askClaude(`Write a warm, friendly 2-3 sentence parent update about their child's ABA therapy session today. Use simple non-clinical language. Be specific and encouraging. No jargon.\n\nChild: ${firstName}, age ${client.age}\nSession length: ${duration}\nSkill highlights: ${skills || "worked on several skill programs"}\n${behTotal > 0 ? `Behavior note: ${behTotal} behavior event${behTotal > 1 ? "s" : ""} occurred and were handled per the behavior plan.` : "No significant behavior events today."}`)).trim());
    } catch (e) { setError(e instanceof Error ? e.message : "Couldn't generate the message."); }
    finally { setBusy(false); }
  };

  const copy = () => { navigator.clipboard?.writeText(message); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="mt-3 p-3 rounded-xl" style={{ background: c.primarySoft }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm" style={{ color: c.primary, fontWeight: 600 }}>
          <MessageSquare size={14} /> Parent update
        </div>
        <button onClick={generate} disabled={busy} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs" style={{ background: c.primary, color: "#fff", fontWeight: 700 }}>
          {busy ? <><Loader2 size={12} className="animate-spin" /> Writing…</> : <><Sparkles size={12} /> {message ? "Rewrite" : "Generate"}</>}
        </button>
      </div>
      {error && <div className="text-xs p-2 rounded-lg mb-2" style={{ background: c.accentSoft, color: c.accent }}>{error}</div>}
      {message ? (
        <div className="relative">
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3}
            className="w-full p-2.5 pr-10 rounded-xl text-sm outline-none resize-none" style={{ background: "rgba(255,255,255,0.7)", border: `1px solid ${c.primary}33` }} />
          <button onClick={copy} className="absolute top-2 right-2 grid place-items-center rounded-md" style={{ width: 28, height: 28, background: copied ? c.plus : c.primary, color: "#fff" }}>
            {copied ? <Check size={13} /> : <Copy size={13} />}
          </button>
        </div>
      ) : (
        <p className="text-xs" style={{ color: c.primary, opacity: 0.7 }}>Generate a friendly session recap to text or email to the family.</p>
      )}
    </div>
  );
}

// ---------------- Shared UI ----------------
function now() { return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }); }
function Card({ children, accent }) {
  return <div className="p-4 rounded-2xl" style={{ background: c.surface, border: `1px solid ${accent ? c.primary : c.line}`, boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>{children}</div>;
}
function Label({ icon: Icon, children }) {
  return <div className="flex items-center gap-2 text-sm" style={{ color: c.muted, fontWeight: 600 }}><Icon size={16} />{children}</div>;
}
function Header({ title, subtitle, icon: Icon }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid place-items-center rounded-xl" style={{ width: 34, height: 34, background: c.primary }}><Icon size={18} color="#fff" /></div>
      <div><div className="font-display text-2xl" style={{ fontWeight: 800 }}>{title}</div><div className="text-xs" style={{ color: c.muted }}>{subtitle}</div></div>
    </div>
  );
}
function BackBar({ onBack, label }) {
  return <button onClick={onBack} className="flex items-center gap-1 text-sm" style={{ color: c.muted, fontWeight: 600 }}><ArrowLeft size={16} /> {label}</button>;
}
function SegTabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 p-1 rounded-2xl mt-4" style={{ background: c.surface, border: `1px solid ${c.line}` }}>
      {tabs.map((t) => { const A = active === t.k; const Icon = t.icon; return (
        <button key={t.k} onClick={() => onChange(t.k)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm transition-all"
          style={{ background: A ? c.primary : "transparent", color: A ? "#fff" : c.muted, fontWeight: 600 }}>
          <Icon size={15} /><span className="hidden sm:inline">{t.label}</span>
        </button>
      ); })}
    </div>
  );
}
function Inp({ v, set, ph }) {
  return <input value={v} onChange={(e) => set(e.target.value)} placeholder={ph} className="p-2.5 rounded-xl text-sm outline-none w-full" style={{ background: c.bg, border: `1px solid ${c.line}` }} />;
}
function Recap({ label, value }) {
  return <div className="p-2.5 rounded-xl text-center" style={{ background: c.bg }}><div className="font-display text-xl" style={{ fontWeight: 800 }}>{value}</div><div className="text-xs" style={{ color: c.muted }}>{label}</div></div>;
}
function EmptyState({ icon: Icon, message }) {
  return (
    <div className="flex flex-col items-center text-center py-10 gap-3" style={{ color: c.muted }}>
      <Icon size={32} style={{ opacity: 0.3 }} /><p className="text-sm">{message}</p>
    </div>
  );
}
