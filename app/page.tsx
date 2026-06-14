// @ts-nocheck
'use client';

import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft, Plus, Minus, Mic, MicOff, Sparkles, FileText,
  ClipboardList, Activity, ChevronRight, TrendingUp, Loader2,
  BookOpen, Brain, Undo2, FileSignature, Calendar, Check, X,
  ChevronDown, RotateCcw, Eye, MessageSquare, Shield, Zap, Copy,
  Users, MapPin, Navigation, Send, Clock,
} from "lucide-react";

// ---------------- Palette (happy + professional) ----------------
const c = {
  bg: "#F2FAF8",
  surface: "#FFFFFF",
  ink: "#1A2E2B",
  muted: "#62807A",
  primary: "#0E9F8F",
  primarySoft: "#D4F5F0",
  accent: "#F97316",
  accentSoft: "#FEF0E6",
  gold: "#F59E0B",
  goldSoft: "#FFFBEB",
  line: "#DEF0EB",
  plus: "#10B981",
  minus: "#F43F5E",
  purple: "#7C3AED",
  purpleSoft: "#EEF2FF",
};

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
.font-display{font-family:'Bricolage Grotesque',sans-serif;letter-spacing:-0.02em}
.font-body{font-family:'DM Sans',sans-serif}
`;

// ---------------- Seed data ----------------
const CLIENTS = [
  { id: "c1", name: "Jordan M.", age: 6, color: "#0E9F8F", programs: 5, behaviors: 3, last: "Yesterday" },
  { id: "c2", name: "Ava R.", age: 4, color: "#F97316", programs: 4, behaviors: 2, last: "2 days ago" },
  { id: "c3", name: "Mateo S.", age: 8, color: "#F59E0B", programs: 6, behaviors: 4, last: "Today" },
];

const SCHEDULE = [
  // Past — week of Jun 9
  { id: "s1",  clientId: "c1", date: "2026-06-09", startTime: "9:00 AM",  endTime: "11:00 AM", address: "2847 Sharer Rd, Tallahassee, FL 32312",     status: "completed" },
  { id: "s2",  clientId: "c2", date: "2026-06-09", startTime: "1:00 PM",  endTime: "2:30 PM",  address: "1205 N Monroe St, Tallahassee, FL 32303",    status: "completed" },
  { id: "s3",  clientId: "c3", date: "2026-06-10", startTime: "10:00 AM", endTime: "12:00 PM", address: "4815 Woodville Hwy, Tallahassee, FL 32305",  status: "completed" },
  { id: "s4",  clientId: "c1", date: "2026-06-11", startTime: "9:00 AM",  endTime: "11:00 AM", address: "2847 Sharer Rd, Tallahassee, FL 32312",     status: "completed" },
  { id: "s5",  clientId: "c3", date: "2026-06-11", startTime: "2:00 PM",  endTime: "4:00 PM",  address: "4815 Woodville Hwy, Tallahassee, FL 32305",  status: "completed" },
  { id: "s6",  clientId: "c2", date: "2026-06-12", startTime: "9:00 AM",  endTime: "10:30 AM", address: "1205 N Monroe St, Tallahassee, FL 32303",    status: "completed" },
  { id: "s7",  clientId: "c1", date: "2026-06-12", startTime: "1:00 PM",  endTime: "3:00 PM",  address: "2847 Sharer Rd, Tallahassee, FL 32312",     status: "completed" },
  // Upcoming — week of Jun 16
  { id: "s8",  clientId: "c1", date: "2026-06-16", startTime: "9:00 AM",  endTime: "11:00 AM", address: "2847 Sharer Rd, Tallahassee, FL 32312",     status: "upcoming" },
  { id: "s9",  clientId: "c2", date: "2026-06-16", startTime: "1:00 PM",  endTime: "2:30 PM",  address: "1205 N Monroe St, Tallahassee, FL 32303",    status: "upcoming" },
  { id: "s10", clientId: "c3", date: "2026-06-17", startTime: "10:00 AM", endTime: "12:00 PM", address: "4815 Woodville Hwy, Tallahassee, FL 32305",  status: "upcoming" },
  { id: "s11", clientId: "c1", date: "2026-06-17", startTime: "2:00 PM",  endTime: "4:00 PM",  address: "2847 Sharer Rd, Tallahassee, FL 32312",     status: "upcoming", supervisor: "Dr. Martinez" },
  { id: "s12", clientId: "c2", date: "2026-06-18", startTime: "9:00 AM",  endTime: "10:30 AM", address: "1205 N Monroe St, Tallahassee, FL 32303",    status: "upcoming" },
  { id: "s13", clientId: "c3", date: "2026-06-18", startTime: "1:00 PM",  endTime: "3:00 PM",  address: "4815 Woodville Hwy, Tallahassee, FL 32305",  status: "upcoming" },
  { id: "s14", clientId: "c1", date: "2026-06-19", startTime: "9:00 AM",  endTime: "11:00 AM", address: "2847 Sharer Rd, Tallahassee, FL 32312",     status: "upcoming" },
  { id: "s15", clientId: "c3", date: "2026-06-20", startTime: "10:00 AM", endTime: "12:00 PM", address: "4815 Woodville Hwy, Tallahassee, FL 32305",  status: "upcoming" },
];

const PROGRAM_TEMPLATE = [
  { id: "p1",  name: "Simple compliance",    prompt: "Independent",    domain: "Compliance" },
  { id: "p2a", name: "Gross motor",          prompt: "Model prompt",   group: "Motor imitation" },
  { id: "p2b", name: "Fine motor",           prompt: "Model prompt",   group: "Motor imitation" },
  { id: "p2c", name: "Oral motor",           prompt: "Independent",    group: "Motor imitation" },
  { id: "p3a", name: "Animals",              prompt: "Gestural prompt", group: "Receptive ID" },
  { id: "p3b", name: "Common objects",       prompt: "Independent",    group: "Receptive ID" },
  { id: "p3c", name: "Body parts",           prompt: "Independent",    group: "Receptive ID" },
  { id: "p4",  name: "Manding for break",    prompt: "Independent",    domain: "Manding" },
  { id: "p5",  name: "Tact: common objects", prompt: "Independent",    domain: "Tacting" },
];

const BEHAVIOR_TEMPLATE = [
  { id: "b1", name: "Elopement" },
  { id: "b2", name: "Aggression (hitting)" },
  { id: "b3", name: "Vocal stereotypy" },
];

const PAST_SESSIONS = {
  c1: [
    { date: "Jun 12", duration: "2h 00m", skillPct: 78, behaviors: 4, signed: true },
    { date: "Jun 11", duration: "2h 00m", skillPct: 71, behaviors: 6, signed: true },
    { date: "Jun 9",  duration: "2h 00m", skillPct: 66, behaviors: 5, signed: true },
  ],
  c2: [{ date: "Jun 12", duration: "1h 30m", skillPct: 82, behaviors: 2, signed: true }],
  c3: [{ date: "Jun 11", duration: "2h 00m", skillPct: 74, behaviors: 7, signed: false }],
};

const DOCUMENTS = {
  c1: [
    { title: "Initial Assessment (VB-MAPP)", date: "Mar 2026", body: "Jordan presented with strengths in mand and tact repertoires at Level 2. Areas for growth: listener responding, intraverbals, and group instruction. Recommended 25 hrs/week of direct ABA with parent training." },
    { title: "Reinforcer Inventory", date: "Apr 2026", body: "Preferred items/activities: tablet (high), trains, bubbles, crunchy snacks, trampoline. Avoid: loud sudden sounds, transitions without warning. Use 2-minute visual timer for transitions." },
  ],
  c2: [{ title: "Initial Assessment", date: "Feb 2026", body: "Ava presented with emerging mand and imitation skills. Recommended 20 hrs/week of direct ABA." }],
  c3: [{ title: "Reassessment", date: "May 2026", body: "Mateo has made significant gains in receptive identification. Updating programs to target intraverbal and tacting domains." }],
};

const PROTOCOLS = {
  c1: [
    { title: "Simple compliance", body: "SD: 'Jordan, [one-step instruction].' Target: independent compliance within 5s. Prompt hierarchy: independent → gestural → model → partial physical. Mastery: 80% independent across 3 consecutive sessions." },
    { title: "Elopement (behavior reduction)", body: "Definition: leaving designated area (>3 ft) without permission. Function: escape. Strategy: offer choices, errorless demands, FCT — teach 'break' mand. Consequence: guided return, no attention." },
  ],
  c2: [{ title: "Manding", body: "SD: natural establishing operations. Target: spontaneous mand for preferred items using full word or approximation. Mastery: 80% unprompted across 3 sessions." }],
  c3: [{ title: "Tolerance for waiting", body: "SD: 'Wait.' Target: tolerate 30-second delay before receiving preferred item. Prompt hierarchy: gestural → verbal. Reinforce with preferred item + verbal praise." }],
};

// ---------------- Team chat seed data ----------------
const CURRENT_USER = "Tucker";
const TEAM_MEMBERS = {
  "Tucker":         { role: "RBT",  color: "#0E9F8F", initials: "TN" },
  "Dr. Martinez":   { role: "BCBA", color: "#7C3AED", initials: "DM" },
  "Kayla R.":       { role: "RBT",  color: "#F97316", initials: "KR" },
  "Sam T.":         { role: "RBT",  color: "#F59E0B", initials: "ST" },
  "Dr. Chen":       { role: "BCBA", color: "#8B5CF6", initials: "EC" },
  "Priya N.":       { role: "OT",   color: "#EC4899", initials: "PN" },
  "Marcus W.":      { role: "PT",   color: "#14B8A6", initials: "MW" },
  "Dr. Okonkwo":    { role: "Peds", color: "#EF4444", initials: "AO" },
  "Jamie L.":       { role: "RBT",  color: "#84CC16", initials: "JL" },
};

// channel id → { name, description, seed messages }
const CHANNELS = {
  general: {
    name: "General",
    description: "Team-wide announcements",
    icon: "🏠",
    messages: [
      { id: "g1", sender: "Dr. Martinez", text: "Morning everyone! Reminder that Jordan's program update is due by Friday. Let me know if you have questions about the new manding targets.", time: "8:14 AM", date: "Jun 9" },
      { id: "g2", sender: "Kayla R.",     text: "Got it! Quick question — Jordan was really dysregulated during transitions yesterday. Should I try the visual timer before any new demand?", time: "8:31 AM", date: "Jun 9" },
      { id: "g3", sender: "Dr. Martinez", text: "Yes, 2-minute visual timer before ANY transition. His reinforcer inventory also notes bubbles work well for resetting — try that combo.", time: "8:45 AM", date: "Jun 9" },
      { id: "g4", sender: "Tucker",       text: "Noted — will try timer + bubbles this week and document it in session notes.", time: "9:02 AM", date: "Jun 9" },
    ],
  },
  clinical: {
    name: "Clinical",
    description: "Program updates & data questions",
    icon: "📋",
    messages: [
      { id: "c1", sender: "Dr. Martinez", text: "Ava's parent called asking for an update on her manding progress. Can someone send a summary after Thursday's session?", time: "2:15 PM", date: "Jun 11" },
      { id: "c2", sender: "Kayla R.",     text: "I have Ava on Thursday — I'll handle it! 👍", time: "2:22 PM", date: "Jun 11" },
      { id: "c3", sender: "Sam T.",       text: "Mateo hit mastery on common objects last session — should I advance to body parts or run one more probe?", time: "10:05 AM", date: "Jun 12" },
      { id: "c4", sender: "Dr. Martinez", text: "Run one more probe at 80%+ then advance. Good work Sam!", time: "10:41 AM", date: "Jun 12" },
    ],
  },
  scheduling: {
    name: "Scheduling",
    description: "Schedule changes & coverage",
    icon: "📅",
    messages: [
      { id: "sc1", sender: "Kayla R.",     text: "Heads up — I need to swap my Tuesday afternoon slot this week. Anyone able to cover Ava 1–2:30 PM?", time: "7:55 PM", date: "Jun 10" },
      { id: "sc2", sender: "Tucker",       text: "I can do it — I'll reach out to the family to confirm.", time: "8:03 PM", date: "Jun 10" },
      { id: "sc3", sender: "Dr. Martinez", text: "Thanks Tucker! Please log the coverage swap in the system.", time: "8:11 PM", date: "Jun 10" },
    ],
  },
};

// DMs: key = other person's name
const DMS = {
  "Dr. Martinez": [
    { id: "d1", sender: "Dr. Martinez", text: "Tucker — just want to confirm you're good for the supervision session Tuesday afternoon at Jordan's? I'll be observing 2–4 PM.", time: "3:00 PM", date: "Jun 12" },
    { id: "d2", sender: "Tucker",       text: "Yes, confirmed! I'll make sure to have the data sheets ready.", time: "3:14 PM", date: "Jun 12" },
    { id: "d3", sender: "Dr. Martinez", text: "Perfect. I'll be watching manding and transitions especially — those are our focus areas right now.", time: "3:17 PM", date: "Jun 12" },
  ],
  "Kayla R.": [
    { id: "k1", sender: "Kayla R.", text: "Hey! Do you have Jordan's reinforcer list handy? I'm covering for you Friday and want to be prepared.", time: "4:45 PM", date: "Jun 11" },
    { id: "k2", sender: "Tucker",   text: "Check the Documents tab in his client hub — Reinforcer Inventory is in there!", time: "5:02 PM", date: "Jun 11" },
  ],
  "Priya N.": [
    { id: "p1", sender: "Priya N.", text: "Hi Tucker! Just a heads up — I worked with Jordan this morning on fine motor and he was having a tough time with scissors. May be worth noting in your session if it comes up behaviorally.", time: "11:30 AM", date: "Jun 12" },
    { id: "p2", sender: "Tucker",   text: "Thanks Priya! Really helpful context. I'll watch for frustration during tabletop tasks.", time: "11:44 AM", date: "Jun 12" },
  ],
  "Marcus W.": [
    { id: "mw1", sender: "Marcus W.", text: "Tucker — Mateo's PT goals include increased core stability for seated tasks. If he's slouching during tabletop work let me know and I can share some positioning strategies.", time: "9:20 AM", date: "Jun 10" },
    { id: "mw2", sender: "Tucker",   text: "Noted! He does seem to tire out at the table around the 30-minute mark. I'll log it.", time: "9:35 AM", date: "Jun 10" },
  ],
  "Dr. Okonkwo": [
    { id: "do1", sender: "Dr. Okonkwo", text: "Hi Tucker, just a reminder that Ava's medication was adjusted last week. The family was told to watch for increased irritability in the first few days. Please flag anything unusual in your notes.", time: "8:00 AM", date: "Jun 9" },
    { id: "do2", sender: "Tucker",      text: "Understood, thank you Dr. Okonkwo. I'll keep a close eye and document any changes in affect.", time: "8:12 AM", date: "Jun 9" },
  ],
  "Dr. Chen": [],
  "Sam T.":    [],
  "Jamie L.":  [],
};

// ---------------- localStorage ----------------
const SESSION_KEY  = (id) => `bh_session_${id}`;
const CHANNEL_KEY  = (id) => `bh_channel_${id}`;
const DM_KEY       = (name) => `bh_dm_${name.replace(/\s+/g, "_")}`;
function loadSession(id) { try { const r = typeof window !== "undefined" ? localStorage.getItem(SESSION_KEY(id)) : null; return r ? JSON.parse(r) : null; } catch { return null; } }
function saveSession(id, data) { try { localStorage.setItem(SESSION_KEY(id), JSON.stringify(data)); } catch {} }
function clearSession(id) { try { localStorage.removeItem(SESSION_KEY(id)); } catch {} }
function clearAllSessions() { CLIENTS.forEach((cl) => clearSession(cl.id)); }
function loadChannelMsgs(channelId) { try { const r = typeof window !== "undefined" ? localStorage.getItem(CHANNEL_KEY(channelId)) : null; return r ? JSON.parse(r) : CHANNELS[channelId]?.messages ?? []; } catch { return CHANNELS[channelId]?.messages ?? []; } }
function saveChannelMsgs(channelId, msgs) { try { localStorage.setItem(CHANNEL_KEY(channelId), JSON.stringify(msgs)); } catch {} }
function loadDmMsgs(name) { try { const r = typeof window !== "undefined" ? localStorage.getItem(DM_KEY(name)) : null; return r ? JSON.parse(r) : DMS[name] ?? []; } catch { return DMS[name] ?? []; } }
function saveDmMsgs(name, msgs) { try { localStorage.setItem(DM_KEY(name), JSON.stringify(msgs)); } catch {} }

// ---------------- BroadcastChannel ----------------
const BC_SESSION = "bh_live_session";
const BC_CHAT    = "bh_chat_bc";

function useBroadcastSession(clientId, data) {
  const chRef = useRef(null);
  useEffect(() => { try { chRef.current = new BroadcastChannel(BC_SESSION); } catch {} return () => { try { chRef.current?.close(); } catch {} }; }, []);
  useEffect(() => { if (!clientId || !data) return; try { chRef.current?.postMessage({ type: "update", clientId, ...data }); } catch {} }, [clientId, data]);
}
function useReceiveBroadcast() {
  const [live, setLive] = useState(null);
  useEffect(() => { let ch; try { ch = new BroadcastChannel(BC_SESSION); ch.onmessage = (e) => { if (e.data?.type === "update") setLive(e.data); }; } catch {} return () => { try { ch?.close(); } catch {} }; }, []);
  return live;
}

// ---------------- Speech ----------------
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
  const stop = () => { recRef.current?.stop(); setListening(false); };
  return { listening, supported, start, stop };
}

// ---------------- AI ----------------
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
  const behList  = behaviors.map((b) => `- ${b.id}: "${b.name}"`).join("\n");
  const raw = await askClaude(`You are an ABA session data parser. Parse the RBT's verbal note into structured data.\n\nPROGRAMS:\n${progList}\n\nBEHAVIORS:\n${behList}\n\nReturn ONLY valid JSON with no markdown:\n{"trials":[{"programId":"p1","marks":["+"]}],"behaviors":[{"behaviorId":"b1","delta":1}],"abcs":[{"antecedent":"...","behavior":"...","consequence":"...","function":"escape"}],"summary":"one sentence"}\n\n+ = independent/correct, - = prompted/incorrect. Only include items actually mentioned.\n\nRBT note: "${text}"`);
  return JSON.parse(raw.replace(/```json\n?|\n?```/g, "").trim());
}

// ================= APP =================
export default function BehaviorHubRBT() {
  const [navTab, setNavTab]       = useState("schedule");
  const [screen, setScreen]       = useState("main"); // main | clientHub | session
  const [client, setClient]       = useState(null);
  const [backTo, setBackTo]       = useState("schedule");
  const [chatBadge, setChatBadge] = useState(true); // show unread dot until chat is visited
  const [supervisorClientId, setSupervisorClientId] = useState(null);

  // Swipe gesture
  const touchX = useRef(null);
  const TABS = ["schedule", "clients", "chat"];
  const handleTouchStart = (e) => { if (screen === "main") touchX.current = e.touches[0].clientX; };
  const handleTouchEnd   = (e) => {
    if (screen !== "main" || touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    const idx = TABS.indexOf(navTab);
    if (dx < -60 && idx < 2) switchTab(TABS[idx + 1]);
    if (dx >  60 && idx > 0) switchTab(TABS[idx - 1]);
    touchX.current = null;
  };

  const switchTab = (tab) => {
    setNavTab(tab);
    setScreen("main");
    if (tab === "chat") setChatBadge(false);
  };

  const goToClientHub = (cl, from) => { setClient(cl); setBackTo(from ?? navTab); setScreen("clientHub"); };
  const goToSession   = (cl) => { setClient(cl); setScreen("session"); };
  const goBack        = () => { setScreen("main"); setNavTab(backTo); };

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
    <div className="font-body min-h-screen w-full" style={{ background: c.bg, color: c.ink }}
      onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <style>{FONTS}</style>

      {/* Main content */}
      <div className="max-w-xl mx-auto px-4 pt-5">
        {screen === "main" && navTab === "schedule" && (
          <ScheduleScreen onStartSession={(cl) => goToSession(cl)} onViewClient={(cl) => goToClientHub(cl, "schedule")} />
        )}
        {screen === "main" && navTab === "clients" && (
          <ClientsScreen onOpen={(cl) => goToClientHub(cl, "clients")} />
        )}
        {screen === "main" && navTab === "chat" && <ChatScreen />}

        {screen === "clientHub" && client && (
          <ClientHub client={client} onBack={goBack} onStart={() => goToSession(client)} />
        )}
        {screen === "session" && client && (
          <LiveSession client={client} onExit={goBack} />
        )}
      </div>

      {/* Bottom nav — hide during session */}
      {screen !== "session" && (
        <BottomNav tab={navTab} onChange={switchTab} chatBadge={chatBadge} />
      )}
    </div>
  );
}

// ---------------- Bottom Nav ----------------
function BottomNav({ tab, onChange, chatBadge }) {
  const tabs = [
    { k: "schedule", label: "Schedule", icon: Calendar },
    { k: "clients",  label: "Clients",  icon: Users },
    { k: "chat",     label: "Chat",     icon: MessageSquare },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 flex" style={{ background: c.surface, borderTop: `1px solid ${c.line}`, paddingBottom: "env(safe-area-inset-bottom,8px)" }}>
      {tabs.map((t) => {
        const A = tab === t.k; const Icon = t.icon;
        return (
          <button key={t.k} onClick={() => onChange(t.k)} className="flex-1 flex flex-col items-center gap-1 py-3 relative">
            {t.k === "chat" && chatBadge && (
              <span className="absolute top-2.5 right-[calc(50%-14px)] w-2 h-2 rounded-full" style={{ background: c.accent }} />
            )}
            <Icon size={21} style={{ color: A ? c.primary : c.muted }} />
            <span className="text-xs" style={{ color: A ? c.primary : c.muted, fontWeight: A ? 700 : 500 }}>{t.label}</span>
            {A && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full" style={{ background: c.primary }} />}
          </button>
        );
      })}
    </div>
  );
}

// ---------------- Schedule Screen ----------------
function ScheduleScreen({ onStartSession, onViewClient }) {
  const [showPast, setShowPast] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const h = new Date().getHours();
  const greet = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";

  const todaySessions    = SCHEDULE.filter((s) => s.date === today);
  const upcomingSessions = SCHEDULE.filter((s) => s.date > today).sort((a, b) => a.date.localeCompare(b.date));
  const pastSessions     = SCHEDULE.filter((s) => s.date < today).sort((a, b) => b.date.localeCompare(a.date));
  const completedSessions = SCHEDULE.filter((s) => s.status === "completed");
  const thisWeekDone      = completedSessions.length;

  // Calculate total hours from completed sessions
  const parseHour = (t) => {
    const [time, period] = t.split(" ");
    let [h, m] = time.split(":").map(Number);
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    return h + m / 60;
  };
  const totalHours = completedSessions.reduce((sum, s) => sum + (parseHour(s.endTime) - parseHour(s.startTime)), 0);

  const groupByDate = (sessions) => {
    const m = {};
    sessions.forEach((s) => { (m[s.date] = m[s.date] || []).push(s); });
    return Object.entries(m);
  };

  const clientFor = (s) => CLIENTS.find((cl) => cl.id === s.clientId);

  return (
    <div className="pb-28">
      {/* Greeting card */}
      <div className="rounded-2xl p-5 mb-5" style={{ background: `linear-gradient(135deg, ${c.primary} 0%, #0A7A6E 100%)`, color: "#fff" }}>
        <div className="text-sm mb-0.5" style={{ opacity: 0.8 }}>{greet}</div>
        <div className="font-display text-2xl" style={{ fontWeight: 800 }}>Tucker Narkinsky</div>
        <div className="text-sm mt-0.5" style={{ opacity: 0.75 }}>RBT · Cayer Behavioral Group</div>
        <div className="flex gap-5 mt-4">
          <div className="text-center">
            <div className="font-display text-2xl" style={{ fontWeight: 800 }}>{totalHours % 1 === 0 ? totalHours : totalHours.toFixed(1)}</div>
            <div className="text-xs" style={{ opacity: 0.7 }}>hrs completed</div>
          </div>
          <div className="text-center">
            <div className="font-display text-2xl" style={{ fontWeight: 800 }}>{thisWeekDone}</div>
            <div className="text-xs" style={{ opacity: 0.7 }}>sessions done</div>
          </div>
          <div className="text-center">
            <div className="font-display text-2xl" style={{ fontWeight: 800 }}>{upcomingSessions.length}</div>
            <div className="text-xs" style={{ opacity: 0.7 }}>upcoming</div>
          </div>
        </div>
      </div>

      {/* Today */}
      {todaySessions.length > 0 && (
        <div className="mb-5">
          <SectionLabel>Today</SectionLabel>
          {todaySessions.map((s) => <SessionCard key={s.id} session={s} client={clientFor(s)} onStart={() => onStartSession(clientFor(s))} onViewClient={() => onViewClient(clientFor(s))} />)}
        </div>
      )}
      {todaySessions.length === 0 && (
        <div className="flex items-center gap-3 p-4 rounded-2xl mb-5" style={{ background: c.surface, border: `1px solid ${c.line}` }}>
          <span style={{ fontSize: 28 }}>🌿</span>
          <div>
            <div className="text-sm font-medium">No sessions today</div>
            <div className="text-xs" style={{ color: c.muted }}>Next up: {upcomingSessions.length > 0 ? formatDayHeader(upcomingSessions[0].date) : "nothing scheduled yet"}</div>
          </div>
        </div>
      )}

      {/* Toggle */}
      <div className="flex gap-2 mb-3">
        {[{ v: false, label: `Upcoming (${upcomingSessions.length})` }, { v: true, label: `Past (${pastSessions.length})` }].map(({ v, label }) => (
          <button key={String(v)} onClick={() => setShowPast(v)} className="px-3 py-1.5 rounded-xl text-sm"
            style={{ background: showPast === v ? c.primary : c.surface, color: showPast === v ? "#fff" : c.muted, fontWeight: 600, border: `1px solid ${c.line}` }}>
            {label}
          </button>
        ))}
      </div>

      {/* Session groups */}
      {(!showPast ? groupByDate(upcomingSessions) : groupByDate(pastSessions)).map(([date, sessions]) => (
        <div key={date} className="mb-4">
          <SectionLabel>{formatDayHeader(date)}</SectionLabel>
          {sessions.map((s) => <SessionCard key={s.id} session={s} client={clientFor(s)} onStart={() => onStartSession(clientFor(s))} onViewClient={() => onViewClient(clientFor(s))} />)}
        </div>
      ))}

      {!showPast && upcomingSessions.length === 0 && <EmptyState icon={Calendar} message="No upcoming sessions scheduled." />}
      {showPast  && pastSessions.length    === 0 && <EmptyState icon={Calendar} message="No past sessions to show." />}
    </div>
  );
}

// ---- Session card ----
function SessionCard({ session, client, onStart, onViewClient }) {
  const [open, setOpen] = useState(false);
  if (!client) return null;
  // Opens Apple Maps on iOS/Mac, Google Maps elsewhere
  const navUrl = /iPhone|iPad|iPod|Macintosh/.test(navigator?.userAgent ?? "")
    ? `http://maps.apple.com/?daddr=${encodeURIComponent(session.address)}&dirflg=d`
    : `https://maps.google.com/?q=${encodeURIComponent(session.address)}`;
  const done = session.status === "completed";

  return (
    <div className="mb-2.5 rounded-2xl overflow-hidden" style={{ background: c.surface, border: `1px solid ${c.line}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 p-4 text-left">
        <div className="grid place-items-center rounded-xl shrink-0 font-display" style={{ width: 44, height: 44, background: client.color, color: "#fff", fontWeight: 800 }}>
          {client.name.split(" ").map((w) => w[0]).join("")}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-display text-base" style={{ fontWeight: 700 }}>{client.name}</div>
          <div className="flex items-center gap-1 text-xs mt-0.5" style={{ color: c.muted }}>
            <Clock size={11} /> {session.startTime} – {session.endTime}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: done ? c.primarySoft : c.accentSoft, color: done ? c.primary : c.accent, fontWeight: 700 }}>
            {done ? "✓ Done" : "Upcoming"}
          </span>
          {session.supervisor && (
            <span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1" style={{ background: c.purpleSoft, color: c.purple, fontWeight: 700 }}>
              <Eye size={10} /> Supervised
            </span>
          )}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 grid gap-2.5" style={{ borderTop: `1px solid ${c.line}` }}>
          {session.supervisor && (
            <div className="flex items-center gap-2 pt-3 pb-1 px-1">
              <Users size={14} style={{ color: c.purple, flexShrink: 0 }} />
              <span className="text-sm" style={{ color: c.purple, fontWeight: 600 }}>BCBA supervision — {session.supervisor} will be present</span>
            </div>
          )}
          <div className={`flex items-start gap-2 ${session.supervisor ? "" : "pt-3"}`}>
            <MapPin size={14} style={{ color: c.primary, marginTop: 2, flexShrink: 0 }} />
            <span className="text-sm leading-snug">{session.address}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <a href={navUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm col-span-1" style={{ background: c.primary, color: "#fff", fontWeight: 700 }}>
              <Navigation size={14} /> Navigate to session
            </a>
            <button onClick={onViewClient} className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm" style={{ background: c.bg, color: c.muted, fontWeight: 700 }}>
              <Users size={14} /> View client
            </button>
          </div>
          {!done && (
            <button onClick={onStart} className="w-full py-2.5 rounded-xl text-sm transition-transform active:scale-95" style={{ background: c.primary, color: "#fff", fontWeight: 700 }}>
              Start session →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------- Clients Screen (roster) ----------------
function ClientsScreen({ onOpen }) {
  const [resetFlash, setResetFlash] = useState(false);
  const handleReset = () => { clearAllSessions(); setResetFlash(true); setTimeout(() => setResetFlash(false), 1800); };
  return (
    <div className="pb-28">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="font-display text-2xl" style={{ fontWeight: 800 }}>My clients</div>
          <div className="text-xs mt-0.5" style={{ color: c.muted }}>Tap a client to open their hub</div>
        </div>
        <button onClick={handleReset} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs"
          style={{ background: resetFlash ? c.primarySoft : c.bg, color: resetFlash ? c.primary : c.muted, fontWeight: 600, border: `1px solid ${c.line}` }}>
          <RotateCcw size={12} />{resetFlash ? "Reset!" : "Reset demo"}
        </button>
      </div>
      <div className="grid gap-3">
        {CLIENTS.map((cl) => (
          <button key={cl.id} onClick={() => onOpen(cl)} className="flex items-center gap-3 p-4 rounded-2xl text-left transition-transform active:scale-[0.99]"
            style={{ background: c.surface, border: `1px solid ${c.line}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div className="grid place-items-center rounded-2xl font-display text-lg" style={{ width: 48, height: 48, background: cl.color, color: "#fff", fontWeight: 800 }}>
              {cl.name.split(" ").map((w) => w[0]).join("")}
            </div>
            <div className="flex-1">
              <div className="font-display text-base" style={{ fontWeight: 700 }}>{cl.name}</div>
              <div className="text-xs mt-0.5" style={{ color: c.muted }}>Age {cl.age} · {cl.programs} programs · {cl.behaviors} behaviors · last {cl.last}</div>
            </div>
            <ChevronRight size={18} style={{ color: c.muted }} />
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------------- Chat Screen (Teams-style) ----------------
function ChatScreen() {
  const [view, setView]   = useState({ type: "channel", id: "general" }); // { type: "channel"|"dm", id }
  const [sideOpen, setSideOpen] = useState(true);

  const viewName = view.type === "channel"
    ? `# ${CHANNELS[view.id]?.name}`
    : TEAM_MEMBERS[view.id]?.role === "BCBA" ? `🔒 ${view.id}` : view.id;

  const viewSub = view.type === "channel"
    ? CHANNELS[view.id]?.description
    : `Direct message · ${TEAM_MEMBERS[view.id]?.role ?? ""}`;

  return (
    <div className="pb-28" style={{ height: "calc(100dvh - 72px)" }}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2 shrink-0">
          <button onClick={() => setSideOpen(!sideOpen)} className="grid place-items-center rounded-lg" style={{ width: 34, height: 34, background: sideOpen ? c.primary : c.bg, color: sideOpen ? "#fff" : c.muted, flexShrink: 0 }}>
            <Users size={16} />
          </button>
          <div className="min-w-0">
            <div className="font-display text-base leading-tight truncate" style={{ fontWeight: 800 }}>{viewName}</div>
            <div className="text-xs truncate" style={{ color: c.muted }}>{viewSub}</div>
          </div>
        </div>

        <div className="flex gap-2 flex-1 min-h-0">
          {/* Sidebar */}
          {sideOpen && (
            <div className="shrink-0 flex flex-col gap-1 overflow-y-auto" style={{ width: 200, paddingRight: 4 }}>
              {/* Workspace header */}
              <div className="px-2 py-1.5 rounded-xl mb-1" style={{ background: `linear-gradient(135deg, ${c.primary} 0%, #0A7A6E 100%)` }}>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>Cayer Behavioral</div>
                <div className="text-sm" style={{ color: "#fff", fontWeight: 800 }}>Group</div>
              </div>

              {/* Channels */}
              <div className="px-2 pt-1">
                <div className="text-xs mb-1" style={{ color: c.muted, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>Channels</div>
                {Object.entries(CHANNELS).map(([id, ch]) => {
                  const active = view.type === "channel" && view.id === id;
                  return (
                    <button key={id} onClick={() => setView({ type: "channel", id })} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left mb-0.5 text-sm"
                      style={{ background: active ? c.primarySoft : "transparent", color: active ? c.primary : c.ink, fontWeight: active ? 700 : 500 }}>
                      <span style={{ fontSize: 14 }}>{ch.icon}</span>{ch.name}
                    </button>
                  );
                })}
              </div>

              {/* Direct messages */}
              <div className="px-2 pt-2">
                <div className="text-xs mb-1" style={{ color: c.muted, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>Direct messages</div>
                {Object.keys(DMS).map((name) => {
                  const active = view.type === "dm" && view.id === name;
                  const member = TEAM_MEMBERS[name] || { color: c.muted, initials: name[0], role: "" };
                  const hasUnread = DMS[name].length > 0 && DMS[name][DMS[name].length - 1].sender !== CURRENT_USER;
                  const roleColor = { BCBA: c.purple, OT: "#EC4899", PT: "#14B8A6", Peds: "#EF4444", RBT: c.primary }[member.role] ?? c.muted;
                  const roleBg   = { BCBA: c.purpleSoft, OT: "#FCE7F3", PT: "#CCFBF1", Peds: "#FEE2E2", RBT: c.primarySoft }[member.role] ?? c.bg;
                  return (
                    <button key={name} onClick={() => setView({ type: "dm", id: name })} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left mb-0.5 text-sm"
                      style={{ background: active ? c.primarySoft : "transparent", color: active ? c.primary : c.ink, fontWeight: active ? 700 : 500 }}>
                      <div className="relative shrink-0">
                        <div className="grid place-items-center rounded-full text-xs" style={{ width: 22, height: 22, background: member.color, color: "#fff", fontWeight: 800 }}>{member.initials}</div>
                        {hasUnread && !active && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full" style={{ background: c.accent }} />}
                      </div>
                      <span className="truncate flex-1">{name}</span>
                      <span className="text-xs px-1 rounded shrink-0" style={{ background: roleBg, color: roleColor, fontWeight: 700, fontSize: 9 }}>{member.role}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Chat pane */}
          <div className="flex-1 min-w-0">
            <ChatPane view={view} key={`${view.type}-${view.id}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatPane({ view }) {
  const isChannel = view.type === "channel";
  const loadMsgs  = () => isChannel ? loadChannelMsgs(view.id) : loadDmMsgs(view.id);
  const saveMsgs  = (msgs) => isChannel ? saveChannelMsgs(view.id, msgs) : saveDmMsgs(view.id, msgs);

  const [messages, setMessages] = useState(loadMsgs);
  const [input, setInput]       = useState("");
  const bottomRef               = useRef(null);
  const chRef                   = useRef(null);

  useEffect(() => {
    try {
      chRef.current = new BroadcastChannel(`${BC_CHAT}_${view.type}_${view.id}`);
      chRef.current.onmessage = (e) => setMessages((prev) => { const u = [...prev, e.data]; saveMsgs(u); return u; });
    } catch {}
    return () => { try { chRef.current?.close(); } catch {} };
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "instant" }); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages.length]);

  const send = () => {
    if (!input.trim()) return;
    const msg = { id: `m${Date.now()}`, sender: CURRENT_USER, text: input.trim(), time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }), date: "Today" };
    setMessages((prev) => { const u = [...prev, msg]; saveMsgs(u); return u; });
    try { chRef.current?.postMessage(msg); } catch {}
    setInput("");
  };

  const grouped = {};
  messages.forEach((m) => { (grouped[m.date] = grouped[m.date] || []).push(m); });

  const placeholder = isChannel
    ? `Message #${CHANNELS[view.id]?.name ?? view.id}…`
    : `Message ${view.id}…`;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto min-h-0 pr-1">
        {Object.entries(grouped).map(([date, msgs]) => (
          <div key={date}>
            <div className="text-center my-3">
              <span className="text-xs px-3 py-1 rounded-full" style={{ background: c.line, color: c.muted }}>{date}</span>
            </div>
            {msgs.map((m, i) => {
              const isMine  = m.sender === CURRENT_USER;
              const member  = TEAM_MEMBERS[m.sender] || { color: c.muted, initials: (m.sender || "?")[0], role: "" };
              const showHdr = i === 0 || msgs[i - 1].sender !== m.sender;
              return (
                <div key={m.id} className={`flex mb-2 ${isMine ? "justify-end" : "justify-start"}`}>
                  {!isMine && (
                    <div className="grid place-items-center rounded-full shrink-0 mr-2 self-end mb-5" style={{ width: 28, height: 28, background: member.color, color: "#fff", fontSize: 9, fontWeight: 800 }}>
                      {member.initials}
                    </div>
                  )}
                  <div style={{ maxWidth: "78%" }}>
                    {!isMine && showHdr && (
                      <div className="flex items-center gap-1.5 mb-1 ml-0.5">
                        <span className="text-xs font-medium">{m.sender}</span>
                        {member.role && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: member.role === "BCBA" ? c.purpleSoft : c.primarySoft, color: member.role === "BCBA" ? c.purple : c.primary, fontWeight: 700, fontSize: 9 }}>{member.role}</span>
                        )}
                      </div>
                    )}
                    <div className="px-3 py-2 text-sm leading-relaxed" style={{
                      background: isMine ? c.primary : c.surface,
                      color: isMine ? "#fff" : c.ink,
                      border: isMine ? "none" : `1px solid ${c.line}`,
                      borderRadius: isMine ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    }}>{m.text}</div>
                    <div className={`text-xs mt-0.5 ${isMine ? "text-right" : "ml-0.5"}`} style={{ color: c.muted }}>{m.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 pt-2 shrink-0" style={{ borderTop: `1px solid ${c.line}` }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder={placeholder} className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: c.bg, border: `1px solid ${c.line}` }} />
        <button onClick={send} disabled={!input.trim()} className="grid place-items-center rounded-xl transition-transform active:scale-95"
          style={{ width: 40, height: 40, background: input.trim() ? c.primary : c.line, color: "#fff", flexShrink: 0 }}>
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

// ---------------- Supervisor View ----------------
function SupervisorView({ client }) {
  const live = useReceiveBroadcast();
  const hasData = live !== null;
  const programs = live?.programs ?? []; const behaviors = live?.behaviors ?? [];
  const abc = live?.abc ?? [];           const notes = live?.notes ?? [];
  const secs = live?.secs ?? 0;
  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");

  if (!client) return <div className="text-center py-20" style={{ color: c.muted }}><Users size={40} className="mx-auto mb-3 opacity-30" /><p className="text-sm">Client not found.</p></div>;

  return (
    <div className="pb-10">
      <div className="flex items-center justify-between mb-4">
        <div><div className="font-display text-2xl" style={{ fontWeight: 800 }}>Supervisor view</div><div className="text-xs mt-0.5" style={{ color: c.muted }}>Read-only · same-browser sync</div></div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm" style={{ background: hasData ? c.accentSoft : c.bg, color: hasData ? c.accent : c.muted, fontWeight: 700 }}>
          <span className="w-2 h-2 rounded-full" style={{ background: hasData ? c.accent : c.line }} />
          {hasData ? `LIVE · ${mm}:${ss}` : "Waiting…"}
        </div>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <div className="grid place-items-center rounded-2xl font-display text-xl" style={{ width: 52, height: 52, background: client.color, color: "#fff", fontWeight: 800 }}>{client.name.split(" ").map((w) => w[0]).join("")}</div>
        <div><div className="font-display text-xl" style={{ fontWeight: 800 }}>{client.name}</div><div className="text-xs" style={{ color: c.muted }}>Age {client.age}</div></div>
      </div>
      {!hasData ? (
        <Card><div className="text-center py-8" style={{ color: c.muted }}><Eye size={32} className="mx-auto mb-3 opacity-30" /><p className="text-sm font-medium">No active session broadcasting</p><p className="text-xs mt-1">Open the RBT session in another tab, then tap the eye icon.</p></div></Card>
      ) : (
        <div className="grid gap-3">
          <Card><Label icon={ClipboardList}>Skills</Label><div className="grid gap-2 mt-3">{programs.filter((p) => p.trials.length).length === 0 ? <p className="text-sm" style={{ color: c.muted }}>No trials yet.</p> : programs.filter((p) => p.trials.length).map((p) => { const v = pct(p.trials); return <div key={p.id} className="flex items-center justify-between"><div className="text-sm" style={{ fontWeight: 600 }}>{p.name}</div><div className="text-sm" style={{ fontWeight: 800, color: pctColor(v) }}>{v}%</div></div>; })}</div></Card>
          <Card><Label icon={Activity}>Behaviors</Label><div className="flex gap-3 mt-3 flex-wrap">{behaviors.map((b) => <div key={b.id} className="px-3 py-2 rounded-xl text-center" style={{ background: b.count > 0 ? c.accentSoft : c.bg }}><div className="font-display text-xl" style={{ fontWeight: 800, color: b.count > 0 ? c.accent : c.muted }}>{b.count}</div><div className="text-xs" style={{ color: c.muted }}>{b.name}</div></div>)}</div></Card>
          {abc.length > 0 && <Card><Label icon={Zap}>ABCs ({abc.length})</Label><div className="grid gap-2 mt-3">{abc.slice(0, 4).map((e, i) => <div key={i} className="p-2.5 rounded-xl text-sm" style={{ background: c.bg }}><span className="capitalize text-xs px-2 py-0.5 rounded-full mr-2" style={{ background: c.accentSoft, color: c.accent, fontWeight: 700 }}>{e.function}</span>{e.behavior}</div>)}</div></Card>}
          {notes.length > 0 && <Card><Label icon={Brain}>Notes</Label><div className="grid gap-1.5 mt-3">{notes.map((n, i) => <div key={i} className="text-sm p-2 rounded-lg" style={{ background: c.bg }}><span className="text-xs mr-2" style={{ color: c.muted }}>{n.time}</span>{n.text}</div>)}</div></Card>}
        </div>
      )}
    </div>
  );
}

// ---------------- Client Hub ----------------
function ClientHub({ client, onBack, onStart }) {
  const [tab, setTab] = useState("session");
  const hasActiveSession = !!loadSession(client.id);
  const tabs = [
    { k: "session",   label: "Session",   icon: Activity },
    { k: "history",   label: "History",   icon: TrendingUp },
    { k: "docs",      label: "Documents", icon: FileText },
    { k: "protocols", label: "Protocols", icon: BookOpen },
    { k: "preauth",   label: "Pre-auth",  icon: Shield },
  ];
  return (
    <div className="pb-28">
      <BackBar onBack={onBack} label="Back" />
      <div className="flex items-center gap-3 mt-3">
        <div className="grid place-items-center rounded-2xl font-display text-xl" style={{ width: 52, height: 52, background: client.color, color: "#fff", fontWeight: 800 }}>{client.name.split(" ").map((w) => w[0]).join("")}</div>
        <div><div className="font-display text-2xl" style={{ fontWeight: 800 }}>{client.name}</div><div className="text-xs mt-0.5" style={{ color: c.muted }}>Age {client.age} · {client.programs} active programs</div></div>
      </div>
      <SegTabs tabs={tabs} active={tab} onChange={setTab} />
      <div className="mt-4">
        {tab === "session" && (
          <Card>
            <Label icon={Calendar}>Today's session</Label>
            {hasActiveSession && (
              <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-xl text-xs" style={{ background: c.accentSoft, color: c.accent, fontWeight: 600 }}>
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c.accent }} /> In-progress session restored.
              </div>
            )}
            <p className="text-sm mt-2 mb-4" style={{ color: c.muted }}>
              {hasActiveSession ? `Continue your in-progress session for ${client.name}.` : `Start a new data-collection session for ${client.name}.`}
            </p>
            <button onClick={onStart} className="w-full py-3 rounded-xl font-display text-base transition-transform active:scale-95" style={{ background: c.primary, color: "#fff", fontWeight: 700 }}>
              {hasActiveSession ? "Continue session →" : "Start session →"}
            </button>
          </Card>
        )}
        {tab === "history" && (
          <div className="grid gap-2.5">
            {!(PAST_SESSIONS[client.id]?.length) ? <EmptyState icon={TrendingUp} message="No past sessions yet." /> :
              PAST_SESSIONS[client.id].map((s, i) => (
                <Card key={i}>
                  <div className="flex items-center justify-between">
                    <div><div className="font-display text-base" style={{ fontWeight: 700 }}>{s.date}</div><div className="text-xs" style={{ color: c.muted }}>{s.duration} · {s.behaviors} behavior events</div></div>
                    <div className="text-right">
                      <div className="font-display text-xl" style={{ fontWeight: 800, color: c.primary }}>{s.skillPct}%</div>
                      <div className="text-xs flex items-center gap-1 justify-end" style={{ color: s.signed ? c.plus : c.accent }}>{s.signed ? <><Check size={12} /> signed</> : <>note pending</>}</div>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        )}
        {tab === "docs" && (
          <div className="grid gap-2.5">
            {!(DOCUMENTS[client.id]?.length) ? <EmptyState icon={FileText} message="No documents on file yet." /> :
              DOCUMENTS[client.id].map((d, i) => (
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
              PROTOCOLS[client.id].map((p, i) => (
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
  const [hours, setHours]         = useState("25");
  const [period, setPeriod]       = useState("6 months");
  const [letter, setLetter]       = useState("");
  const [busy, setBusy]           = useState(false);
  const [error, setError]         = useState("");
  const sessions = PAST_SESSIONS[client.id] || [];
  const avgSkill = sessions.length ? Math.round(sessions.reduce((s, sess) => s + sess.skillPct, 0) / sessions.length) : null;

  const generate = async () => {
    setBusy(true); setError("");
    try {
      setLetter((await askClaude(`Draft a prior authorization request letter for ABA therapy services. Use professional, insurance-appropriate medical necessity language. Sections: patient info, diagnosis & clinical justification, current functioning, treatment goals, requested services, and supporting data.\n\nClient: ${client.name}, Age: ${client.age}\nDiagnosis: ${diagnosis}\nRequested: ${hours} hrs/week direct ABA (CPT 97153) for ${period}\n${avgSkill !== null ? `Recent performance: ${avgSkill}% avg skill accuracy across ${sessions.length} sessions.` : "Initial authorization request."}\nActive programs: compliance, motor imitation, receptive ID, manding, tacting.\nBehavior targets: ${BEHAVIOR_TEMPLATE.map((b) => b.name).join(", ")}.\n\nEnd with BCBA signature/date lines. Note this is a draft.`)).trim());
    } catch (e) { setError(e instanceof Error ? e.message : "Couldn't generate the letter."); }
    finally { setBusy(false); }
  };

  return (
    <div className="grid gap-3">
      <Card>
        <Label icon={Shield}>Prior authorization request</Label>
        <p className="text-sm mt-2 mb-3" style={{ color: c.muted }}>Fill in the details and AI drafts the medical necessity letter for your BCBA to review and submit.</p>
        <div className="grid gap-2">
          <div><div className="text-xs mb-1" style={{ color: c.muted, fontWeight: 600 }}>Diagnosis</div><Inp v={diagnosis} set={setDiagnosis} ph="Diagnosis + ICD-10 code" /></div>
          <div className="grid grid-cols-2 gap-2">
            <div><div className="text-xs mb-1" style={{ color: c.muted, fontWeight: 600 }}>Hours / week</div><Inp v={hours} set={setHours} ph="e.g. 25" /></div>
            <div><div className="text-xs mb-1" style={{ color: c.muted, fontWeight: 600 }}>Auth period</div><Inp v={period} set={setPeriod} ph="e.g. 6 months" /></div>
          </div>
        </div>
        {error && <div className="text-sm mt-3 p-3 rounded-xl" style={{ background: c.accentSoft, color: c.accent }}>{error}</div>}
        <button onClick={generate} disabled={busy} className="w-full mt-3 flex items-center justify-center gap-2 py-3 rounded-xl text-sm transition-transform active:scale-95" style={{ background: c.primary, color: "#fff", fontWeight: 700 }}>
          {busy ? <><Loader2 size={15} className="animate-spin" /> Drafting…</> : <><Sparkles size={15} /> {letter ? "Re-draft" : "Draft pre-auth letter"}</>}
        </button>
      </Card>
      {letter && (
        <Card>
          <div className="flex items-center gap-2 mb-2"><FileSignature size={15} style={{ color: c.primary }} /><span className="text-sm" style={{ fontWeight: 600 }}>Draft — edit before submitting</span></div>
          <textarea value={letter} onChange={(e) => setLetter(e.target.value)} rows={18} className="w-full p-3 rounded-xl text-sm outline-none leading-relaxed" style={{ background: c.bg, border: `1px solid ${c.line}`, whiteSpace: "pre-wrap" }} />
        </Card>
      )}
    </div>
  );
}

// ---------------- Live Session ----------------
function LiveSession({ client, onExit }) {
  const [tab, setTab]         = useState("skills");
  const [programs, setPrograms] = useState(() => loadSession(client.id)?.programs ?? PROGRAM_TEMPLATE.map((p) => ({ ...p, trials: [] })));
  const [behaviors, setBehaviors] = useState(() => loadSession(client.id)?.behaviors ?? BEHAVIOR_TEMPLATE.map((b) => ({ ...b, count: 0 })));
  const [abc, setAbc]         = useState(() => loadSession(client.id)?.abc ?? []);
  const [notes, setNotes]     = useState(() => loadSession(client.id)?.notes ?? []);
  const [secs, setSecs]       = useState(() => loadSession(client.id)?.secs ?? 0);
  const [ending, setEnding]   = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => { const t = setInterval(() => setSecs((s) => s + 1), 1000); return () => clearInterval(t); }, []);
  useEffect(() => { saveSession(client.id, { programs, behaviors, abc, notes, secs }); }, [programs, behaviors, abc, notes, secs]);
  useBroadcastSession(client.id, { programs, behaviors, abc, notes, secs });

  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");

  const score   = (pid, mark) => setPrograms((ps) => ps.map((p) => p.id === pid ? { ...p, trials: [...p.trials, mark] } : p));
  const undo    = (pid)       => setPrograms((ps) => ps.map((p) => p.id === pid ? { ...p, trials: p.trials.slice(0, -1) } : p));
  const bump    = (bid, d)    => setBehaviors((bs) => bs.map((b) => b.id === bid ? { ...b, count: Math.max(0, b.count + d) } : b));
  const addAbc  = (ev)        => setAbc((a) => [{ ...ev, time: now() }, ...a]);
  const addNote = (text)      => setNotes((n) => [...n, { text, time: now() }]);
  const handleExit = () => { clearSession(client.id); onExit(); };
  const handleDone = () => { clearSession(client.id); onExit(); };

  const applyVoiceEntry = ({ trials, behaviors: bds, abcs }) => {
    if (trials?.length) setPrograms((ps) => ps.map((p) => { const t = trials.find((t) => t.programId === p.id); return t ? { ...p, trials: [...p.trials, ...t.marks] } : p; }));
    if (bds?.length)    setBehaviors((bs) => bs.map((b) => { const bd = bds.find((d) => d.behaviorId === b.id); return bd ? { ...b, count: Math.max(0, b.count + (bd.delta || 0)) } : b; }));
    if (abcs?.length)   { const ts = now(); setAbc((a) => [...abcs.map((e) => ({ ...e, time: ts })), ...a]); }
  };

  const sessionTabs = [
    { k: "skills",    label: "Skills",    icon: ClipboardList },
    { k: "behaviors", label: "Behaviors", icon: Activity },
    { k: "ai",        label: "AI notes",  icon: Brain },
  ];

  return (
    <div>
      <div className="flex items-center justify-between gap-2 sticky top-0 z-10 py-2" style={{ background: c.bg }}>
        <button onClick={handleExit} className="flex items-center gap-1 text-sm" style={{ color: c.muted, fontWeight: 600 }}><ArrowLeft size={16} /> Exit</button>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm" style={{ background: c.accentSoft, color: c.accent, fontWeight: 700 }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: c.accent }} /> {mm}:{ss}
          </div>
          <button onClick={() => setShareOpen(true)} title="Supervisor view" className="grid place-items-center rounded-xl" style={{ width: 34, height: 34, background: c.primarySoft, color: c.primary }}>
            <Eye size={16} />
          </button>
        </div>
        <button onClick={() => setEnding(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm transition-transform active:scale-95" style={{ background: c.primary, color: "#fff", fontWeight: 700 }}>
          <FileSignature size={15} /> End
        </button>
      </div>

      <div className="font-display text-xl mt-1" style={{ fontWeight: 800 }}>{client.name} · session</div>
      <SegTabs tabs={sessionTabs} active={tab} onChange={setTab} />

      <div className="mt-4 pb-28">
        {tab === "skills"    && <SkillsPage    programs={programs} onScore={score} onUndo={undo} />}
        {tab === "behaviors" && <BehaviorsPage behaviors={behaviors} onBump={bump} abc={abc} onAddAbc={addAbc} />}
        {tab === "ai"        && <AINotesPage   client={client} programs={programs} behaviors={behaviors} abc={abc} notes={notes} onAddNote={addNote} />}
      </div>

      {/* Floating voice entry */}
      <button onClick={() => setVoiceOpen(true)} className="fixed bottom-6 right-4 z-20 flex items-center gap-2 px-4 py-3 rounded-full transition-transform active:scale-95"
        style={{ background: c.ink, color: "#fff", fontWeight: 700, boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }}>
        <Mic size={17} /><span className="text-sm">Voice entry</span>
      </button>

      {voiceOpen  && <VoiceEntryModal programs={programs} behaviors={behaviors} onApply={applyVoiceEntry} onClose={() => setVoiceOpen(false)} />}
      {shareOpen  && <ShareModal clientId={client.id} onClose={() => setShareOpen(false)} />}
      {ending     && <EndSessionModal client={client} duration={`${mm}:${ss}`} programs={programs} behaviors={behaviors} abc={abc} notes={notes} onClose={() => setEnding(false)} onDone={handleDone} />}
    </div>
  );
}

// ---------------- Voice Entry Modal ----------------
function VoiceEntryModal({ programs, behaviors, onApply, onClose }) {
  const [text, setText]   = useState("");
  const [parsed, setParsed] = useState(null);
  const [busy, setBusy]   = useState(false);
  const [error, setError] = useState("");
  const dict = useDictation();

  const parse = async () => {
    if (!text.trim()) return;
    setBusy(true); setError(""); setParsed(null);
    try { setParsed(await parseVoiceEntry(text, programs, behaviors)); }
    catch { setError("Couldn't parse your note. Try being more specific about program names."); }
    finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3" style={{ background: "rgba(26,46,43,0.5)" }}>
      <div className="w-full max-w-lg rounded-2xl p-5 max-h-[90vh] overflow-auto" style={{ background: c.surface }}>
        <div className="flex items-center justify-between mb-1">
          <div className="font-display text-xl" style={{ fontWeight: 800 }}>Voice entry</div>
          <button onClick={onClose} className="grid place-items-center rounded-lg" style={{ width: 32, height: 32, background: c.bg }}><X size={18} /></button>
        </div>
        <p className="text-sm mb-3" style={{ color: c.muted }}>Describe what happened — programs, prompts, behaviors. AI parses it into your session data.</p>
        <div className="relative">
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4}
            placeholder="e.g. Jordan got compliance independently, needed a model on gross and fine motor, got all the animals, had two elopements during transitions…"
            className="w-full p-3 pr-14 rounded-xl text-sm outline-none resize-none" style={{ background: c.bg, border: `1px solid ${dict.listening ? c.accent : c.line}` }} />
          <button onClick={dict.listening ? dict.stop : () => dict.start(setText)} className="absolute bottom-3 right-3 grid place-items-center rounded-lg" style={{ width: 36, height: 36, background: dict.listening ? c.ink : c.accent, color: "#fff" }}>
            {dict.listening ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
        </div>
        {dict.listening && <div className="text-xs mt-1" style={{ color: c.accent, fontWeight: 600 }}>● Listening…</div>}
        {error && <div className="text-sm mt-3 p-3 rounded-xl" style={{ background: c.accentSoft, color: c.accent }}>{error}</div>}
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
                {parsed.trials?.map((t) => { const prog = programs.find((p) => p.id === t.programId); if (!prog) return null; const pl = t.marks.filter((m) => m === "+").length; const mi = t.marks.filter((m) => m === "-").length; return (
                  <div key={t.programId} className="flex items-center gap-2 text-xs">
                    <span style={{ fontWeight: 600 }}>{prog.name}</span>
                    {pl > 0 && <span className="px-1.5 py-0.5 rounded" style={{ background: c.plus, color: "#fff", fontWeight: 700 }}>+{pl}</span>}
                    {mi > 0 && <span className="px-1.5 py-0.5 rounded" style={{ background: c.minus, color: "#fff", fontWeight: 700 }}>−{mi}</span>}
                  </div>
                ); })}
                {parsed.behaviors?.filter((bd) => bd.delta > 0).map((bd) => { const beh = behaviors.find((b) => b.id === bd.behaviorId); if (!beh) return null; return <div key={bd.behaviorId} className="text-xs"><span style={{ fontWeight: 600 }}>{beh.name}:</span> +{bd.delta}</div>; })}
                {parsed.abcs?.length > 0 && <div className="text-xs" style={{ color: c.muted }}>{parsed.abcs.length} ABC event{parsed.abcs.length > 1 ? "s" : ""}</div>}
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => setParsed(null)} className="flex-1 py-2.5 rounded-xl text-sm" style={{ background: c.bg, color: c.muted, fontWeight: 600 }}>Edit</button>
              <button onClick={() => { onApply(parsed); onClose(); }} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm active:scale-95" style={{ background: c.plus, color: "#fff", fontWeight: 700 }}>
                <Check size={16} /> Apply to session
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------- Share Modal ----------------
function ShareModal({ clientId, onClose }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? `${window.location.origin}/?supervisor=${clientId}` : "";
  const copy = () => { navigator.clipboard?.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3" style={{ background: "rgba(26,46,43,0.5)" }}>
      <div className="w-full max-w-md rounded-2xl p-5" style={{ background: c.surface }}>
        <div className="flex items-center justify-between mb-3">
          <div className="font-display text-lg" style={{ fontWeight: 800 }}>Supervisor view</div>
          <button onClick={onClose} className="grid place-items-center rounded-lg" style={{ width: 32, height: 32, background: c.bg }}><X size={18} /></button>
        </div>
        <p className="text-sm mb-3" style={{ color: c.muted }}>Open this link in another tab in <b>the same browser</b> to watch session data update live.</p>
        <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: c.bg }}>
          <div className="flex-1 text-xs break-all">{url}</div>
          <button onClick={copy} className="grid place-items-center rounded-lg shrink-0" style={{ width: 32, height: 32, background: copied ? c.plus : c.primary, color: "#fff" }}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
        <div className="flex items-start gap-2 mt-3 p-3 rounded-xl text-xs" style={{ background: c.primarySoft, color: c.primary }}>
          <Eye size={14} className="shrink-0 mt-0.5" /><span>Skills, behaviors, ABCs, and notes sync live. Cross-device sync is on the roadmap.</span>
        </div>
      </div>
    </div>
  );
}

// ---- Skills page ----
function pct(trials) { return trials.length ? Math.round(trials.filter((t) => t === "+").length / trials.length * 100) : null; }
function pctColor(v)  { return v >= 80 ? c.plus : v >= 50 ? c.gold : c.minus; }

function Chips({ trials }) {
  if (!trials.length) return null;
  return <div className="flex flex-wrap gap-1 mt-2">{trials.map((t, i) => <span key={i} className="grid place-items-center rounded-md text-xs" style={{ width: 20, height: 20, background: t === "+" ? c.plus : c.minus, color: "#fff", fontWeight: 800 }}>{t}</span>)}</div>;
}
function ScoreButtons({ p, onScore, onUndo, small }) {
  const pad = small ? "py-2" : "py-3"; const ic = small ? 18 : 22;
  return (
    <div className="flex items-center gap-2 mt-2">
      <button onClick={() => onScore(p.id, "+")} className={`flex-1 grid place-items-center ${pad} rounded-xl active:scale-95`} style={{ background: c.plus, color: "#fff" }}><Plus size={ic} strokeWidth={3} /></button>
      <button onClick={() => onScore(p.id, "-")} className={`flex-1 grid place-items-center ${pad} rounded-xl active:scale-95`} style={{ background: c.minus, color: "#fff" }}><Minus size={ic} strokeWidth={3} /></button>
      <button onClick={() => onUndo(p.id)} disabled={!p.trials.length} className={`grid place-items-center ${pad} px-3 rounded-xl`} style={{ background: c.bg, color: p.trials.length ? c.muted : c.line }}><Undo2 size={16} /></button>
    </div>
  );
}
function LeafCard({ p, onScore, onUndo }) {
  const v = pct(p.trials);
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1"><div className="font-display text-base" style={{ fontWeight: 700 }}>{p.name}</div><div className="text-xs" style={{ color: c.muted }}>{p.domain} · {p.prompt}</div></div>
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
          <div><div className="font-display text-base" style={{ fontWeight: 700 }}>{blk.name}</div><div className="text-xs" style={{ color: c.muted }}>{blk.items.length} sub-targets{v !== null ? ` · ${all.length} trials` : ""}</div></div>
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
  programs.forEach((p) => { if (p.group) { if (!seen[p.group]) { seen[p.group] = { type: "group", name: p.group, items: [] }; blocks.push(seen[p.group]); } seen[p.group].items.push(p); } else blocks.push({ type: "leaf", item: p }); });
  return (
    <div className="grid gap-3">
      <p className="text-sm" style={{ color: c.muted }}>Tap <b style={{ color: c.plus }}>+</b> for correct/independent, <b style={{ color: c.minus }}>−</b> for prompted/incorrect. Or use <b>Voice entry</b> to log multiple at once.</p>
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
              <button onClick={() => onBump(bh.id, 1)} className="grid place-items-center rounded-lg active:scale-95" style={{ width: 34, height: 34, background: c.accent, color: "#fff" }}><Plus size={16} /></button>
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
          <button onClick={log} className="py-2.5 rounded-xl text-sm active:scale-95" style={{ background: c.primary, color: "#fff", fontWeight: 600 }}>Log ABC</button>
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
  const [draft, setDraft]     = useState("");
  const [summary, setSummary] = useState("");
  const [busy, setBusy]       = useState(false);
  const [error, setError]     = useState("");
  const dict = useDictation();
  const hasData = programs.some((p) => p.trials.length) || behaviors.some((b) => b.count) || abc.length > 0 || notes.length > 0;

  const dataContext = () => {
    const skills = programs.filter((p) => p.trials.length).map((p) => `${p.group ? p.group + " – " : ""}${p.name}: ${p.trials.join(" ")} = ${Math.round(p.trials.filter((t) => t === "+").length / p.trials.length * 100)}%`).join("; ");
    const beh    = behaviors.filter((b) => b.count).map((b) => `${b.name} x${b.count}`).join("; ");
    const abcs   = abc.map((e) => `A:${e.antecedent} B:${e.behavior} C:${e.consequence} (fn:${e.function})`).join(" | ");
    const ns     = notes.map((n) => n.text).join(" ");
    return `Client: ${client.name}. Skills: ${skills || "none"}. Behaviors: ${beh || "none"}. ABCs: ${abcs || "none"}. Notes: ${ns || "none"}.`;
  };

  const generate = async () => {
    setBusy(true); setError("");
    try { setSummary((await askClaude(`You are an ABA clinical documentation assistant. Translate this in-progress session's raw data into a concise clinical narrative (3-5 sentences) in professional ABA language. Weave in technician notes. Be strictly factual.\n\nSession data:\n${dataContext()}`)).trim()); }
    catch (e) { setError(e instanceof Error ? e.message : "Couldn't generate summary."); }
    finally { setBusy(false); }
  };

  return (
    <div className="grid gap-3">
      <Card accent>
        <div className="flex items-center justify-between">
          <Label icon={Brain}>Quick note</Label>
          {!dict.listening
            ? <button onClick={() => dict.start(setDraft)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs" style={{ background: c.accent, color: "#fff", fontWeight: 600 }}><Mic size={13} /> Dictate</button>
            : <button onClick={dict.stop} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs" style={{ background: c.ink, color: "#fff", fontWeight: 600 }}><MicOff size={13} /> Stop</button>}
        </div>
        {!dict.supported && <div className="text-xs mt-2" style={{ color: c.accent }}>Mic unavailable — type your note instead.</div>}
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
          <button onClick={generate} disabled={busy || !hasData} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm active:scale-95"
            style={{ background: hasData ? c.primary : c.line, color: "#fff", fontWeight: 600, opacity: busy ? 0.7 : 1 }}>
            {busy ? <><Loader2 size={14} className="animate-spin" /> Translating…</> : <><Sparkles size={14} /> {summary ? "Regenerate" : "Generate"}</>}
          </button>
        </div>
        {error && <div className="flex items-center justify-between gap-3 text-sm mt-3 p-3 rounded-xl" style={{ background: c.accentSoft, color: c.accent }}><span>{error}</span><button onClick={generate} disabled={busy} className="px-3 py-1.5 rounded-lg text-xs shrink-0" style={{ background: c.accent, color: "#fff", fontWeight: 700 }}>Retry</button></div>}
        {summary
          ? <p className="text-sm leading-relaxed mt-3 p-3 rounded-xl" style={{ background: c.primarySoft }}>{summary}</p>
          : !error && (!hasData
              ? <div className="flex flex-col items-center text-center py-6 gap-2" style={{ color: c.muted }}><Brain size={30} style={{ opacity: 0.3 }} /><p className="text-sm">Score some trials or log a behavior first, then Generate will write a clinical narrative.</p></div>
              : <p className="text-sm mt-3" style={{ color: c.muted }}>AI reads your probe data, behavior counts, ABCs, and notes, then crafts a clinical narrative.</p>
            )}
      </Card>
      {abc.length >= 3 && <ABCInsights abc={abc} client={client} />}
    </div>
  );
}

// ---- ABC Insights ----
function ABCInsights({ abc, client }) {
  const [insight, setInsight] = useState("");
  const [busy, setBusy]       = useState(false);
  const [error, setError]     = useState("");

  const analyze = async () => {
    setBusy(true); setError("");
    try {
      const abcText = abc.map((e, i) => `${i + 1}. A: "${e.antecedent || "—"}" | B: "${e.behavior}" | C: "${e.consequence || "—"}" | Fn: ${e.function}`).join("\n");
      setInsight((await askClaude(`You are an ABA behavior analyst. Review these ${abc.length} ABC observations and identify patterns in 2-4 concise sentences. Identify the most likely maintaining function, note consistent antecedents, and suggest one practical implication for the technician.\n\nClient: ${client.name}\nABC data:\n${abcText}`)).trim());
    } catch (e) { setError(e instanceof Error ? e.message : "Couldn't analyze patterns right now."); }
    finally { setBusy(false); }
  };

  return (
    <Card>
      <div className="flex items-center justify-between">
        <Label icon={Zap}>ABC pattern analysis</Label>
        <button onClick={analyze} disabled={busy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm active:scale-95"
          style={{ background: c.gold, color: "#fff", fontWeight: 600, opacity: busy ? 0.7 : 1 }}>
          {busy ? <><Loader2 size={14} className="animate-spin" /> Analyzing…</> : <><Zap size={14} /> {insight ? "Re-analyze" : "Analyze"}</>}
        </button>
      </div>
      {error && <div className="flex items-center justify-between gap-3 text-sm mt-3 p-3 rounded-xl" style={{ background: c.accentSoft, color: c.accent }}><span>{error}</span><button onClick={analyze} disabled={busy} className="px-3 py-1.5 rounded-lg text-xs shrink-0" style={{ background: c.accent, color: "#fff", fontWeight: 700 }}>Retry</button></div>}
      {insight
        ? <p className="text-sm leading-relaxed mt-3 p-3 rounded-xl" style={{ background: c.goldSoft, border: `1px solid ${c.gold}44` }}>{insight}</p>
        : !error && <p className="text-sm mt-3" style={{ color: c.muted }}>{abc.length} ABC events — tap Analyze to identify maintaining functions and antecedent patterns.</p>}
    </Card>
  );
}

// ---- End session modal ----
function EndSessionModal({ client, duration, programs, behaviors, abc, notes, onClose, onDone }) {
  const [note, setNote]       = useState("");
  const [busy, setBusy]       = useState(false);
  const [drafted, setDrafted] = useState(false);
  const [error, setError]     = useState("");

  const draft = async () => {
    setBusy(true); setError("");
    const skills = programs.filter((p) => p.trials.length).map((p) => `${p.name}: ${Math.round(p.trials.filter((t) => t === "+").length / p.trials.length * 100)}% over ${p.trials.length} trials`).join("\n");
    const beh    = behaviors.filter((b) => b.count).map((b) => `${b.name}: ${b.count}`).join(", ");
    const abcs   = abc.map((e) => `${e.behavior} (A: ${e.antecedent}; C: ${e.consequence}; fn: ${e.function})`).join("; ");
    const ns     = notes.map((n) => n.text).join(" ");
    try {
      setNote((await askClaude(`Draft a session note for insurance / medical-necessity review (CPT 97153, direct ABA). Sections: SESSION INFORMATION, PROGRAMS & PERFORMANCE, BEHAVIORS OBSERVED, CLINICAL NARRATIVE, PROGRESS TOWARD GOALS, PLAN. Funder-appropriate language. Only use data provided. End noting draft requires clinician review and signature.\nClient: ${client.name}; Duration: ${duration}; Service: direct 1:1 ABA.\nPrograms:\n${skills || "none"}\nBehaviors: ${beh || "none"}\nABCs: ${abcs || "none"}\nNotes: ${ns || "none"}`)).trim());
      setDrafted(true);
    } catch (e) { setError(e instanceof Error ? e.message : "Couldn't draft the note."); }
    finally { setBusy(false); }
  };

  const skillAvg = (() => { const u = programs.filter((p) => p.trials.length); return u.length ? Math.round(u.reduce((s, p) => s + p.trials.filter((t) => t === "+").length / p.trials.length, 0) / u.length * 100) : null; })();
  const behTotal = behaviors.reduce((s, b) => s + b.count, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3" style={{ background: "rgba(26,46,43,0.5)" }}>
      <div className="w-full max-w-lg rounded-2xl p-5 max-h-[90vh] overflow-auto" style={{ background: c.surface }}>
        <div className="flex items-center justify-between">
          <div className="font-display text-xl" style={{ fontWeight: 800 }}>End session</div>
          <button onClick={onClose} className="grid place-items-center rounded-lg" style={{ width: 32, height: 32, background: c.bg }}><X size={18} /></button>
        </div>
        <p className="text-sm mt-1" style={{ color: c.muted }}>Review the recap, draft the insurance note with AI, then sign.</p>
        <div className="grid grid-cols-3 gap-2 mt-4">
          <Recap label="Duration" value={duration} />
          <Recap label="Skill avg" value={skillAvg !== null ? skillAvg + "%" : "—"} />
          <Recap label="Behaviors" value={behTotal} />
        </div>
        {error && <div className="text-sm mt-4 p-3 rounded-xl" style={{ background: c.accentSoft, color: c.accent }}>{error}</div>}
        {!drafted ? (
          <button onClick={draft} disabled={busy} className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl font-display text-base active:scale-95" style={{ background: c.primary, color: "#fff", fontWeight: 700 }}>
            {busy ? <><Loader2 size={16} className="animate-spin" /> Drafting note…</> : <><Sparkles size={16} /> {error ? "Try again" : "Draft insurance note with AI"}</>}
          </button>
        ) : (
          <>
            <div className="flex items-center gap-2 mt-4 mb-1"><FileSignature size={15} style={{ color: c.primary }} /><span className="text-sm" style={{ fontWeight: 600 }}>Session note — edit before signing</span></div>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={10} className="w-full p-3 rounded-xl text-sm outline-none leading-relaxed" style={{ background: c.bg, border: `1px solid ${c.line}`, whiteSpace: "pre-wrap" }} />
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

// ---- Parent summary ----
function ParentSummarySection({ client, programs, behaviors, duration }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy]       = useState(false);
  const [error, setError]     = useState("");
  const [copied, setCopied]   = useState(false);

  const generate = async () => {
    setBusy(true); setError("");
    const firstName = client.name.split(" ")[0];
    const skills  = programs.filter((p) => p.trials.length).map((p) => `${p.name}: ${Math.round(p.trials.filter((t) => t === "+").length / p.trials.length * 100)}% independent`).join(", ");
    const behTotal = behaviors.reduce((s, b) => s + b.count, 0);
    try {
      setMessage((await askClaude(`Write a warm, friendly 2-3 sentence parent update about their child's ABA session. Use simple non-clinical language. Be specific and encouraging.\n\nChild: ${firstName}, age ${client.age}\nDuration: ${duration}\nSkill highlights: ${skills || "worked on several programs"}\n${behTotal > 0 ? `${behTotal} behavior event${behTotal > 1 ? "s" : ""} occurred and were handled per the behavior plan.` : "No significant behavior events today."}`)).trim());
    } catch (e) { setError(e instanceof Error ? e.message : "Couldn't generate the message."); }
    finally { setBusy(false); }
  };

  const copy = () => { navigator.clipboard?.writeText(message); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="mt-3 p-3 rounded-xl" style={{ background: c.primarySoft }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm" style={{ color: c.primary, fontWeight: 600 }}><MessageSquare size={14} /> Parent update</div>
        <button onClick={generate} disabled={busy} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs" style={{ background: c.primary, color: "#fff", fontWeight: 700 }}>
          {busy ? <><Loader2 size={12} className="animate-spin" /> Writing…</> : <><Sparkles size={12} /> {message ? "Rewrite" : "Generate"}</>}
        </button>
      </div>
      {error && <div className="text-xs p-2 rounded-lg mb-2" style={{ background: c.accentSoft, color: c.accent }}>{error}</div>}
      {message ? (
        <div className="relative">
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className="w-full p-2.5 pr-10 rounded-xl text-sm outline-none resize-none" style={{ background: "rgba(255,255,255,0.7)", border: `1px solid ${c.primary}33` }} />
          <button onClick={copy} className="absolute top-2 right-2 grid place-items-center rounded-md" style={{ width: 28, height: 28, background: copied ? c.plus : c.primary, color: "#fff" }}>
            {copied ? <Check size={13} /> : <Copy size={13} />}
          </button>
        </div>
      ) : (
        <p className="text-xs" style={{ color: c.primary, opacity: 0.7 }}>Generate a friendly recap to text or email to the family.</p>
      )}
    </div>
  );
}

// ---------------- Shared UI ----------------
function now() { return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }); }
function formatDayHeader(dateStr) {
  const d = new Date(dateStr + "T12:00:00");
  return `${["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][d.getDay()]}, ${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()]} ${d.getDate()}`;
}
function Card({ children, accent }) {
  return <div className="p-4 rounded-2xl" style={{ background: c.surface, border: `1px solid ${accent ? c.primary : c.line}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>{children}</div>;
}
function Label({ icon: Icon, children }) {
  return <div className="flex items-center gap-2 text-sm" style={{ color: c.muted, fontWeight: 600 }}><Icon size={16} />{children}</div>;
}
function BackBar({ onBack, label }) {
  return <button onClick={onBack} className="flex items-center gap-1 text-sm" style={{ color: c.muted, fontWeight: 600 }}><ArrowLeft size={16} /> {label}</button>;
}
function SectionLabel({ children }) {
  return <div className="text-xs mb-2 mt-1" style={{ color: c.muted, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{children}</div>;
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
  return <div className="flex flex-col items-center text-center py-10 gap-3" style={{ color: c.muted }}><Icon size={32} style={{ opacity: 0.3 }} /><p className="text-sm">{message}</p></div>;
}
