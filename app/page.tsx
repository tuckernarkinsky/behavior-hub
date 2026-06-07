// @ts-nocheck
'use client';

import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft, Plus, Minus, Mic, MicOff, Sparkles, FileText, FolderOpen,
  ClipboardList, Activity, ChevronRight, Clock, TrendingUp, Loader2,
  BookOpen, Brain, Undo2, FileSignature, Calendar, Check, X, ChevronDown
} from "lucide-react";

const c = {
  bg: "#F4F1EA", surface: "#FFFFFF", ink: "#1B2A28", muted: "#6A7C79",
  primary: "#1E6B63", primarySoft: "#E3EFEC", accent: "#E0764F",
  accentSoft: "#FBE7DE", gold: "#E0A93B", line: "#E6E1D7",
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

// Leaves with a `group` collapse under that group header; leaves without one stand alone.
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

async function askClaude(prompt) {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "AI request failed");
  return data.text || "";
}

// ================= APP =================
export default function BehaviorHubRBT() {
  const [view, setView] = useState("roster"); // roster | client | session
  const [client, setClient] = useState(null);

  return (
    <div className="font-body min-h-screen w-full" style={{ background: c.bg, color: c.ink }}>
      <style>{FONTS}</style>
      <div className="max-w-3xl mx-auto px-4 py-5">
        {view === "roster" && <Roster onOpen={(cl) => { setClient(cl); setView("client"); }} />}
        {view === "client" && client && (
          <ClientHub client={client} onBack={() => setView("roster")} onStart={() => setView("session")} />
        )}
        {view === "session" && client && (
          <LiveSession client={client} onExit={() => setView("client")} />
        )}
      </div>
    </div>
  );
}

// ---------------- Roster ----------------
function Roster({ onOpen }) {
  return (
    <div>
      <Header title="My clients" subtitle="Tap a client to open their hub" icon={ClipboardList} />
      <div className="grid gap-3 mt-4">
        {CLIENTS.map((cl) => (
          <button key={cl.id} onClick={() => onOpen(cl)}
            className="flex items-center gap-3 p-4 rounded-2xl text-left transition-transform active:scale-[0.99]"
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
  const tabs = [
    { k: "session", label: "Session", icon: Activity },
    { k: "history", label: "Data history", icon: TrendingUp },
    { k: "docs", label: "Documents", icon: FileText },
    { k: "protocols", label: "Protocols", icon: BookOpen },
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
            <p className="text-sm mt-2 mb-4" style={{ color: c.muted }}>
              Start a new data-collection session for {client.name}. Skills and behaviors are collected on separate pages with a live AI assistant.
            </p>
            <button onClick={onStart} className="w-full py-3 rounded-xl font-display text-base transition-transform active:scale-95"
              style={{ background: c.primary, color: "#fff", fontWeight: 700 }}>
              Start session →
            </button>
          </Card>
        )}
        {tab === "history" && (
          <div className="grid gap-2.5">
            {(PAST_SESSIONS[client.id] || []).map((s, i) => (
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
            {(DOCUMENTS[client.id] || []).map((d, i) => (
              <Card key={i}>
                <div className="flex items-center gap-2 mb-1">
                  <FileText size={15} style={{ color: c.primary }} />
                  <span className="font-display text-base" style={{ fontWeight: 700 }}>{d.title}</span>
                </div>
                <div className="text-xs mb-2" style={{ color: c.muted }}>{d.date}</div>
                <p className="text-sm leading-relaxed">{d.body}</p>
              </Card>
            ))}
          </div>
        )}
        {tab === "protocols" && (
          <div className="grid gap-2.5">
            {(PROTOCOLS[client.id] || []).map((p, i) => (
              <Card key={i}>
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen size={15} style={{ color: c.primary }} />
                  <span className="font-display text-base" style={{ fontWeight: 700 }}>{p.title}</span>
                </div>
                <p className="text-sm leading-relaxed">{p.body}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------- Live Session ----------------
function LiveSession({ client, onExit }) {
  const [tab, setTab] = useState("skills");
  const [programs, setPrograms] = useState(PROGRAM_TEMPLATE.map((p) => ({ ...p, trials: [] })));
  const [behaviors, setBehaviors] = useState(BEHAVIOR_TEMPLATE.map((b) => ({ ...b, count: 0 })));
  const [abc, setAbc] = useState([]);
  const [notes, setNotes] = useState([]); // {text, time}
  const [secs, setSecs] = useState(0);
  const [ending, setEnding] = useState(false);

  useEffect(() => { const t = setInterval(() => setSecs((s) => s + 1), 1000); return () => clearInterval(t); }, []);
  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");

  const score = (pid, mark) => setPrograms((ps) => ps.map((p) => p.id === pid ? { ...p, trials: [...p.trials, mark] } : p));
  const undo = (pid) => setPrograms((ps) => ps.map((p) => p.id === pid ? { ...p, trials: p.trials.slice(0, -1) } : p));
  const bump = (bid, d) => setBehaviors((bs) => bs.map((b) => b.id === bid ? { ...b, count: Math.max(0, b.count + d) } : b));
  const addAbc = (ev) => setAbc((a) => [{ ...ev, time: now() }, ...a]);
  const addNote = (text) => setNotes((n) => [...n, { text, time: now() }]);

  const tabs = [
    { k: "skills", label: "Skills", icon: ClipboardList },
    { k: "behaviors", label: "Behaviors", icon: Activity },
    { k: "ai", label: "AI notes", icon: Brain },
  ];

  return (
    <div>
      {/* Session header */}
      <div className="flex items-center justify-between gap-3 sticky top-0 z-10 py-2" style={{ background: c.bg }}>
        <button onClick={onExit} className="flex items-center gap-1 text-sm" style={{ color: c.muted, fontWeight: 600 }}>
          <ArrowLeft size={16} /> Exit
        </button>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm" style={{ background: c.accentSoft, color: c.accent, fontWeight: 700 }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: c.accent }} /> {mm}:{ss}
        </div>
        <button onClick={() => setEnding(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm transition-transform active:scale-95"
          style={{ background: c.primary, color: "#fff", fontWeight: 700 }}>
          <FileSignature size={15} /> End
        </button>
      </div>

      <div className="font-display text-xl mt-1" style={{ fontWeight: 800 }}>{client.name} · session</div>

      <SegTabs tabs={tabs} active={tab} onChange={setTab} />

      <div className="mt-4 pb-10">
        {tab === "skills" && <SkillsPage programs={programs} onScore={score} onUndo={undo} />}
        {tab === "behaviors" && <BehaviorsPage behaviors={behaviors} onBump={bump} abc={abc} onAddAbc={addAbc} />}
        {tab === "ai" && <AINotesPage client={client} programs={programs} behaviors={behaviors} abc={abc} notes={notes} onAddNote={addNote} />}
      </div>

      {ending && (
        <EndSessionModal client={client} duration={`${mm}:${ss}`} programs={programs} behaviors={behaviors} abc={abc} notes={notes}
          onClose={() => setEnding(false)} onDone={onExit} />
      )}
    </div>
  );
}

// ---- Skills page (probes scored + / −, with collapsible subsections) ----
function pct(trials) { return trials.length ? Math.round(trials.filter((t) => t === "+").length / trials.length * 100) : null; }
function pctColor(v) { return v >= 80 ? c.plus : v >= 50 ? c.gold : c.minus; }

function Chips({ trials }) {
  if (!trials.length) return null;
  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {trials.map((t, i) => (
        <span key={i} className="grid place-items-center rounded-md text-xs" style={{ width: 20, height: 20, background: t === "+" ? c.plus : c.minus, color: "#fff", fontWeight: 800 }}>{t}</span>
      ))}
    </div>
  );
}
function ScoreButtons({ p, onScore, onUndo, small }) {
  const pad = small ? "py-2" : "py-3";
  const ic = small ? 18 : 22;
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
        {v !== null && (
          <div className="text-right">
            <div className="font-display text-lg" style={{ fontWeight: 800, color: pctColor(v) }}>{v}%</div>
            <div className="text-xs" style={{ color: c.muted }}>{p.trials.filter((t) => t === "+").length}/{p.trials.length}</div>
          </div>
        )}
      </div>
      <Chips trials={p.trials} />
      <ScoreButtons p={p} onScore={onScore} onUndo={onUndo} />
    </Card>
  );
}
function GroupCard({ blk, open, toggle, onScore, onUndo }) {
  const all = blk.items.flatMap((it) => it.trials);
  const v = pct(all);
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
          {blk.items.map((it) => {
            const sv = pct(it.trials);
            return (
              <div key={it.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm" style={{ fontWeight: 600 }}>{it.name}</div>
                    <div className="text-xs" style={{ color: c.muted }}>{it.prompt}</div>
                  </div>
                  {sv !== null && <div className="text-sm" style={{ fontWeight: 800, color: pctColor(sv) }}>{sv}% · {it.trials.filter((t) => t === "+").length}/{it.trials.length}</div>}
                </div>
                <Chips trials={it.trials} />
                <ScoreButtons p={it} onScore={onScore} onUndo={onUndo} small />
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
function SkillsPage({ programs, onScore, onUndo }) {
  const [open, setOpen] = useState({ "Motor imitation": true });
  const blocks = [];
  const seen = {};
  programs.forEach((p) => {
    if (p.group) {
      if (!seen[p.group]) { seen[p.group] = { type: "group", name: p.group, items: [] }; blocks.push(seen[p.group]); }
      seen[p.group].items.push(p);
    } else {
      blocks.push({ type: "leaf", item: p });
    }
  });
  return (
    <div className="grid gap-3">
      <p className="text-sm" style={{ color: c.muted }}>Tap <b style={{ color: c.plus }}>+</b> for correct/independent, <b style={{ color: c.minus }}>−</b> for prompted/incorrect. Programs with sub-targets (like Motor imitation) expand with the arrow.</p>
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

// ---- AI Notes page (live translation of log data) ----
function AINotesPage({ client, programs, behaviors, abc, notes, onAddNote }) {
  const [draft, setDraft] = useState("");
  const [summary, setSummary] = useState("");
  const [busy, setBusy] = useState(false);
  const dict = useDictation();

  const dataContext = () => {
    const skills = programs.filter((p) => p.trials.length).map((p) => `${p.group ? p.group + " – " : ""}${p.name} (${p.prompt}): ${p.trials.join(" ")} = ${Math.round(p.trials.filter((t) => t === "+").length / p.trials.length * 100)}%`).join("; ");
    const beh = behaviors.filter((b) => b.count).map((b) => `${b.name} x${b.count}`).join("; ");
    const abcs = abc.map((e) => `A:${e.antecedent} B:${e.behavior} C:${e.consequence} (fn:${e.function})`).join(" | ");
    const ns = notes.map((n) => n.text).join(" ");
    return `Client: ${client.name}. Skill probes: ${skills || "none yet"}. Behavior frequencies: ${beh || "none"}. ABC events: ${abcs || "none"}. Technician quick notes: ${ns || "none"}.`;
  };

  const generate = async () => {
    setBusy(true);
    try {
      const out = await askClaude(
        `You are an ABA clinical documentation assistant. Translate this in-progress session's raw data into a concise running clinical narrative (3-5 sentences) in professional ABA language. Weave in the extra detail from the technician's quick notes. Be strictly factual — do not invent data not present. Session data:\n${dataContext()}`
      );
      setSummary(out.trim());
    } catch { setSummary("Could not generate summary right now. Try again."); }
    finally { setBusy(false); }
  };

  return (
    <div className="grid gap-3">
      <Card accent>
        <div className="flex items-center justify-between">
          <Label icon={Brain}>Quick note (typed or dictated)</Label>
          {!dict.listening ? (
            <button onClick={() => dict.start(setDraft)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs" style={{ background: c.accent, color: "#fff", fontWeight: 600 }}><Mic size={13} /> Dictate</button>
          ) : (
            <button onClick={dict.stop} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs" style={{ background: c.ink, color: "#fff", fontWeight: 600 }}><MicOff size={13} /> Stop</button>
          )}
        </div>
        {!dict.supported && <div className="text-xs mt-2" style={{ color: c.accent }}>Mic unavailable here — type your note instead.</div>}
        <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={2} placeholder="e.g. Jordan needed two extra prompts on imitation but stayed regulated after the break mand…"
          className="w-full mt-2 p-2.5 rounded-xl text-sm outline-none resize-none" style={{ background: c.bg, border: `1px solid ${c.line}` }} />
        <button onClick={() => { if (draft.trim()) { onAddNote(draft.trim()); setDraft(""); } }} className="w-full mt-2 py-2 rounded-xl text-sm" style={{ background: c.primary, color: "#fff", fontWeight: 600 }}>Add note to session</button>
        {notes.length > 0 && (
          <div className="grid gap-1.5 mt-3">
            {notes.map((n, i) => (<div key={i} className="text-sm p-2 rounded-lg" style={{ background: c.bg }}><span className="text-xs mr-2" style={{ color: c.muted }}>{n.time}</span>{n.text}</div>))}
          </div>
        )}
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <Label icon={Sparkles}>Live clinical summary</Label>
          <button onClick={generate} disabled={busy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm transition-transform active:scale-95" style={{ background: c.primary, color: "#fff", fontWeight: 600 }}>
            {busy ? <><Loader2 size={14} className="animate-spin" /> Translating…</> : <><Sparkles size={14} /> {summary ? "Regenerate" : "Generate"}</>}
          </button>
        </div>
        {summary ? (
          <p className="text-sm leading-relaxed mt-3 p-3 rounded-xl" style={{ background: c.primarySoft }}>{summary}</p>
        ) : (
          <p className="text-sm mt-3" style={{ color: c.muted }}>AI reads your +/− probe data, behavior counts, ABCs, and notes, then crafts a clinical narrative — pulling out detail you mentioned but didn't formally log.</p>
        )}
      </Card>
    </div>
  );
}

// ---- End session → insurance note ----
function EndSessionModal({ client, duration, programs, behaviors, abc, notes, onClose, onDone }) {
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [drafted, setDrafted] = useState(false);

  const draft = async () => {
    setBusy(true);
    const skills = programs.filter((p) => p.trials.length).map((p) => `${p.group ? p.group + " – " : ""}${p.name} (${p.prompt}): ${Math.round(p.trials.filter((t) => t === "+").length / p.trials.length * 100)}% independent over ${p.trials.length} trials`).join("\n");
    const beh = behaviors.filter((b) => b.count).map((b) => `${b.name}: ${b.count}`).join(", ");
    const abcs = abc.map((e) => `${e.behavior} (antecedent: ${e.antecedent}; consequence: ${e.consequence}; function: ${e.function})`).join("; ");
    const ns = notes.map((n) => n.text).join(" ");
    try {
      const out = await askClaude(
        `You are an ABA clinical documentation assistant drafting a session note for insurance / medical-necessity review (CPT 97153, direct ABA). Produce a clear, professional note with these labeled sections: SESSION INFORMATION, PROGRAMS & PERFORMANCE, BEHAVIORS OBSERVED, CLINICAL NARRATIVE, PROGRESS TOWARD GOALS, PLAN. Use funder-appropriate ABA language. Use ONLY the data provided; do not fabricate. End with a line noting this is a draft requiring clinician review and signature.
DATA — Client: ${client.name}; Session duration: ${duration}; Service: direct 1:1 ABA.
Programs:\n${skills || "none recorded"}\nBehavior frequencies: ${beh || "none"}\nABC events: ${abcs || "none"}\nTechnician notes: ${ns || "none"}`
      );
      setNote(out.trim()); setDrafted(true);
    } catch { setNote("Could not draft the note. Please try again."); setDrafted(true); }
    finally { setBusy(false); }
  };

  const skillAvg = (() => {
    const used = programs.filter((p) => p.trials.length);
    if (!used.length) return null;
    return Math.round(used.reduce((s, p) => s + p.trials.filter((t) => t === "+").length / p.trials.length, 0) / used.length * 100);
  })();
  const behTotal = behaviors.reduce((s, b) => s + b.count, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3" style={{ background: "rgba(27,42,40,0.45)" }}>
      <div className="w-full max-w-lg rounded-2xl p-5 max-h-[88vh] overflow-auto" style={{ background: c.surface }}>
        <div className="flex items-center justify-between">
          <div className="font-display text-xl" style={{ fontWeight: 800 }}>End session</div>
          <button onClick={onClose} className="grid place-items-center rounded-lg" style={{ width: 32, height: 32, background: c.bg }}><X size={18} /></button>
        </div>
        <p className="text-sm mt-1" style={{ color: c.muted }}>Insurance requires a session note. Review the recap, then have AI draft it for you to edit and sign.</p>

        <div className="grid grid-cols-3 gap-2 mt-4">
          <Recap label="Duration" value={duration} />
          <Recap label="Skill avg" value={skillAvg !== null ? skillAvg + "%" : "—"} />
          <Recap label="Behaviors" value={behTotal} />
        </div>

        {!drafted ? (
          <button onClick={draft} disabled={busy} className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl font-display text-base transition-transform active:scale-95" style={{ background: c.primary, color: "#fff", fontWeight: 700 }}>
            {busy ? <><Loader2 size={16} className="animate-spin" /> Drafting insurance note…</> : <><Sparkles size={16} /> Draft insurance note with AI</>}
          </button>
        ) : (
          <>
            <div className="flex items-center gap-2 mt-4 mb-1">
              <FileSignature size={15} style={{ color: c.primary }} />
              <span className="text-sm" style={{ fontWeight: 600 }}>Draft note — edit before signing</span>
            </div>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={12}
              className="w-full p-3 rounded-xl text-sm outline-none leading-relaxed" style={{ background: c.bg, border: `1px solid ${c.line}`, whiteSpace: "pre-wrap" }} />
            <button onClick={onDone} className="w-full mt-3 flex items-center justify-center gap-2 py-3 rounded-xl text-base" style={{ background: c.plus, color: "#fff", fontWeight: 700 }}>
              <Check size={18} /> Sign & close session
            </button>
          </>
        )}
      </div>
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
      {tabs.map((t) => {
        const A = active === t.k; const Icon = t.icon;
        return (
          <button key={t.k} onClick={() => onChange(t.k)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm transition-all"
            style={{ background: A ? c.primary : "transparent", color: A ? "#fff" : c.muted, fontWeight: 600 }}>
            <Icon size={15} /> <span className="hidden xs:inline sm:inline">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
function Inp({ v, set, ph }) {
  return <input value={v} onChange={(e) => set(e.target.value)} placeholder={ph} className="p-2.5 rounded-xl text-sm outline-none" style={{ background: c.bg, border: `1px solid ${c.line}` }} />;
}
function Recap({ label, value }) {
  return <div className="p-2.5 rounded-xl text-center" style={{ background: c.bg }}><div className="font-display text-xl" style={{ fontWeight: 800 }}>{value}</div><div className="text-xs" style={{ color: c.muted }}>{label}</div></div>;
}
