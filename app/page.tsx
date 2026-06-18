// @ts-nocheck
'use client';

import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft, Plus, Minus, Mic, MicOff, Sparkles, FileText,
  ClipboardList, Activity, ChevronRight, TrendingUp, Loader2,
  BookOpen, Brain, Undo2, FileSignature, Calendar, Check, X,
  ChevronDown, RotateCcw, Eye, MessageSquare, Shield, Zap, Copy,
  Users, MapPin, Navigation, Send, Clock, CalendarPlus, UserCog, ChevronLeft,
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

@keyframes bh-border-pulse {
  0%,100% { box-shadow: 0 0 0 0 rgba(249,115,22,0), inset 0 0 0 3px rgba(249,115,22,0.9); }
  50%      { box-shadow: 0 0 0 18px rgba(249,115,22,0), inset 0 0 0 3px rgba(249,115,22,1); }
}
@keyframes bh-glow-pulse {
  0%,100% { box-shadow: 0 0 0 2px #F97316, 0 0 20px 4px rgba(249,115,22,0.35); }
  50%      { box-shadow: 0 0 0 3px #F97316, 0 0 40px 12px rgba(249,115,22,0.55); }
}
@keyframes bh-mic-ring {
  0%,100% { transform: scale(1);   opacity: 1; }
  50%      { transform: scale(1.12); opacity: 0.85; }
}
.bh-listening-border {
  animation: bh-glow-pulse 1.4s ease-in-out infinite;
  border-radius: 0 !important;
  position: relative;
  z-index: 0;
}
.bh-mic-pulse { animation: bh-mic-ring 1.4s ease-in-out infinite; }
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
  { id: "p1",  name: "Following directions",    prompt: "Independent",    domain: "Cooperation & Participation" },
  { id: "p2a", name: "Gross motor imitation",   prompt: "Model prompt",   group: "Movement imitation" },
  { id: "p2b", name: "Fine motor imitation",    prompt: "Model prompt",   group: "Movement imitation" },
  { id: "p2c", name: "Oral motor imitation",    prompt: "Independent",    group: "Movement imitation" },
  { id: "p3a", name: "Animals",                 prompt: "Gestural prompt", group: "Listener responding" },
  { id: "p3b", name: "Common objects",          prompt: "Independent",    group: "Listener responding" },
  { id: "p3c", name: "Body parts",              prompt: "Independent",    group: "Listener responding" },
  { id: "p4",  name: "Requesting a break",      prompt: "Independent",    domain: "Functional communication" },
  { id: "p5",  name: "Labeling objects",        prompt: "Independent",    domain: "Expressive language" },
];

const BEHAVIOR_TEMPLATE = [
  { id: "b1", name: "Unsafe departure (leaving area)" },
  { id: "b2", name: "Physical aggression (hitting)" },
  { id: "b3", name: "Vocal repetitive behavior" },
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
    { title: "Following directions", body: "SD: 'Jordan, [one-step instruction].' Target: independent response within 5s. Prompt hierarchy: independent → gestural → model → partial physical (least-to-most). Reinforce immediately and enthusiastically. Mastery: 80% independent across 3 consecutive sessions with two different instructors." },
    { title: "Unsafe departure — behavior support plan", body: "Definition: leaving the designated learning area (>3 ft) without permission or signaling need. Maintaining function: escape from demands. Prevention: embed preferred activities, offer choice-making, provide movement breaks proactively. FCT: teach 'I need a break' using PECS or verbal approximation before demands escalate. Response: calm, neutral guided return with minimal attention; honor break request once the learner is back in area." },
  ],
  c2: [{ title: "Functional communication — requesting", body: "Context: natural motivating operations (child is interested in preferred item). Target: spontaneous request using full word, approximation, or AAC. Never withhold for perfect pronunciation — honor any clear communicative attempt. Mastery: 80% unprompted, generalized across 3 environments and 2 communication partners." }],
  c3: [{ title: "Waiting with support", body: "SD: 'Just a moment' + visual timer. Target: tolerate a 30-second delay before receiving preferred item without challenging behavior. Prompt: gestural cue toward timer → verbal reminder 'almost time.' Reinforce waiting with preferred item + specific verbal praise ('Great waiting!'). Increase delay gradually in 10-second increments as tolerance builds." }],
};

// ---------------- BCBA Infrastructure data ----------------
const STAFF_DETAILS = {
  "Tucker":       { clients: ["c1", "c2", "c3"], hoursWeek: 22.5, certExp: "2027-03-15", supervisionHours: 3.5 },
  "Kayla R.":     { clients: ["c2", "c3"],        hoursWeek: 18.0, certExp: "2026-09-01", supervisionHours: 2.0 },
  "Sam T.":       { clients: ["c1", "c3"],        hoursWeek: 15.5, certExp: "2027-01-20", supervisionHours: 1.5 },
  "Jamie L.":     { clients: ["c1"],              hoursWeek: 10.0, certExp: "2026-11-30", supervisionHours: 1.0 },
  "Dr. Martinez": { clients: ["c1", "c2", "c3"], hoursWeek: 8.0,  certExp: "2028-06-01", supervisionHours: null },
  "Dr. Chen":     { clients: ["c2"],              hoursWeek: 4.0,  certExp: "2028-02-14", supervisionHours: null },
  "Priya N.":     { clients: ["c1"],              hoursWeek: 6.0,  certExp: "2027-05-10", supervisionHours: null },
  "Marcus W.":    { clients: ["c3"],              hoursWeek: 5.0,  certExp: "2027-08-22", supervisionHours: null },
  "Dr. Okonkwo":  { clients: ["c2"],              hoursWeek: 2.0,  certExp: "2029-01-01", supervisionHours: null },
};

const SCHED_KEY = "bh_schedule_v2";
function loadSchedule() {
  try { const r = typeof window !== "undefined" ? localStorage.getItem(SCHED_KEY) : null; return r ? JSON.parse(r) : null; } catch { return null; }
}
function saveSchedule(sessions) {
  try { localStorage.setItem(SCHED_KEY, JSON.stringify(sessions)); } catch {}
}
function getWeekDays(baseDate) {
  const d = new Date(baseDate + "T12:00:00");
  const day = d.getDay();
  const mon = new Date(d); mon.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  return Array.from({ length: 7 }, (_, i) => { const nd = new Date(mon); nd.setDate(mon.getDate() + i); return nd.toISOString().split("T")[0]; });
}
function certDaysLeft(exp) { return Math.ceil((new Date(exp) - new Date()) / (1000 * 60 * 60 * 24)); }
// ---------------- Auth ----------------
const PINS = {
  "Tucker":       "1234",
  "Kayla R.":     "2345",
  "Sam T.":       "3456",
  "Jamie L.":     "4567",
  "Dr. Martinez": "0000",
  "Dr. Chen":     "9999",
};
const BH_AUTH = "bh_auth_v1";
function getStoredUser() { try { return JSON.parse(sessionStorage?.getItem(BH_AUTH) || "null"); } catch { return null; } }
function storeUser(u)    { try { sessionStorage.setItem(BH_AUTH, JSON.stringify(u)); } catch {} }
function clearStoredUser(){ try { sessionStorage.removeItem(BH_AUTH); } catch {} }

// ---------------- Extra clients (user-added) ----------------
const EXTRA_CLIENTS_KEY = "bh_extra_clients_v1";
function loadExtraClients() { try { const r = localStorage.getItem(EXTRA_CLIENTS_KEY); return r ? JSON.parse(r) : []; } catch { return []; } }
function saveExtraClients(arr) { try { localStorage.setItem(EXTRA_CLIENTS_KEY, JSON.stringify(arr)); } catch {} }

// ---------------- Session notes archive ----------------
const NOTE_KEY = (clientId, date) => `bh_note_${clientId}_${date}`;
function saveNoteRecord(clientId, { date, duration, note, skillPct, behaviors }) {
  try { localStorage.setItem(NOTE_KEY(clientId, date), JSON.stringify({ date, duration, note, skillPct, behaviors, saved: new Date().toISOString() })); } catch {}
}
function loadNoteRecords(clientId) {
  const out = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(`bh_note_${clientId}_`)) {
        const v = localStorage.getItem(k);
        if (v) out.push(JSON.parse(v));
      }
    }
  } catch {}
  return out.sort((a, b) => b.date.localeCompare(a.date));
}

// ---------------- Notifications ----------------
async function requestNotifPermission() {
  if (!("Notification" in window)) return false;
  return (await Notification.requestPermission()) === "granted";
}
function scheduleSessionNotifs(sessions, clients) {
  if (typeof window === "undefined" || Notification.permission !== "granted") return;
  const now = Date.now();
  sessions.filter((s) => s.status === "upcoming").forEach((s) => {
    const cl = clients.find((c) => c.id === s.clientId);
    const [time, period] = s.startTime.split(" ");
    let [h, m] = time.split(":").map(Number);
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    const sessionMs = new Date(s.date + "T00:00:00").getTime() + h * 3600000 + m * 60000;
    const remindMs  = sessionMs - 30 * 60000;
    const delay = remindMs - now;
    if (delay > 0 && delay < 24 * 3600000) {
      setTimeout(() => {
        new Notification("Session in 30 min", { body: `${cl?.name ?? "Client"} · ${s.startTime}`, icon: "/icon.svg" });
      }, delay);
    }
  });
}

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
  const raw = await askClaude(`You are an expert ABA clinical documentation assistant parsing a therapist's spoken note. You are fluent in all standard ABA terminology.

Therapists use natural ABA clinical language. Extract structured data AND capture clinical observations/strategies that don't map to specific programs.

═══ TRIAL OUTCOME LANGUAGE (→ "+" or "−") ═══
INDEPENDENT (+): got it, nailed it, independent, unprompted, no prompt needed, correct, successful, mastered, full independence, spontaneous, without help, on their own, zero-second delay, errorless
PROMPTED (−): needed a prompt, required assistance, prompted, model prompt, gestural prompt, verbal prompt, partial physical, full physical, hand over hand, HOH, physical guidance, errorless teaching, prompted response, incorrect, error, needed help, failed, couldn't do it, maximum prompt, minimum prompt

═══ PROMPT HIERARCHY TERMS ═══
- "independent / I / no prompt / 0 prompt" → +
- "gestural / G / point / look" → −
- "verbal / V / verbal cue / vocal prompt" → −
- "model / M / visual model / demonstration" → −
- "partial physical / PP" → −
- "full physical / FP / hand over hand / HOH" → −
- "errorless / EL" → −

═══ BEHAVIOR FUNCTIONS (→ ABC function field) ═══
- "escape / escape-maintained / escape function / avoidance / wants to get away / terminate task" → "escape"
- "attention / attention-maintained / seeking attention / wants attention / social positive" → "attention"
- "tangible / access / wants the item / item-maintained / preferred item" → "tangible"
- "automatic / sensory / self-stimulatory / stimming / internal reinforcement / no social mediation" → "sensory"

═══ BEHAVIOR TERMINOLOGY (match to behaviors list) ═══
- "elopement / eloped / left the area / ran away / bolted / unsafe departure / left designated area" → elopement behavior
- "hitting / struck / hit / physical aggression / aggression / kicked / scratched / bit / bite / scratch" → aggression behavior
- "vocal stereotypy / scripting / repetitive vocalizations / vocal stim / echolalic / echolalia / repetitive speech" → vocal stereotypy behavior
- "self-injurious / SIB / head banging / self-harm" → any SIB behavior in list
- "tantrum / meltdown / crying / screaming / dropping" → any tantrum behavior in list
- "property destruction / throwing / tearing / breaking" → any property destruction behavior in list
- "noncompliance / refused / refusal / did not comply / ignoring" → any noncompliance behavior in list
- "PICA / putting in mouth / mouthing objects" → any PICA behavior in list

═══ CLINICAL TERMS TO CAPTURE IN "note" ═══
- FCT / functional communication training
- DRO / differential reinforcement of other behavior
- DRA / differential reinforcement of alternative behavior
- DRI / differential reinforcement of incompatible behavior
- extinction / planned ignoring / EXT
- token economy / token board / token system
- preference assessment / paired stimulus / MSWO / free operant
- reinforcer / reinforcement / SR+ / SR−
- punisher / punishment / positive punishment / negative punishment
- mand training / manding / requesting
- tact training / labeling
- intraverbal / fill-in / conversational
- echoic / imitation / vocal imitation
- PECS / picture exchange
- ABA / applied behavior analysis / behavior intervention
- behavior intervention plan / BIP
- functional behavior assessment / FBA
- VB-MAPP / ABLLS / AFLS / assessment
- task analysis / chaining / forward chain / backward chain / total task
- shaping / successive approximation
- generalization / maintenance / transfer of stimulus control
- discrimination / SD / delta / discriminative stimulus
- antecedent / setting event / establishing operation / EO / MO / motivating operation
- consequence / contingency / three-term contingency
- baseline / probe / probe data / rate / frequency / duration / latency
- IOA / interobserver agreement
- visual schedule / first-then / token board
- social story / video modeling / peer modeling
- crisis / restraint / de-escalation / calming strategy
- redirect / redirection / guided compliance / prompt to return
- time delay / progressive time delay / constant time delay
- transfer trial / mixed trial / mass trial / random rotation
- errorless learning / error correction / four-step error correction

PROGRAMS (match flexibly — a therapist saying "animals" means receptive ID animals):
${progList}

BEHAVIORS (match flexibly):
${behList}

Return ONLY valid JSON, no markdown fences:
{
  "trials": [{"programId": "p1", "marks": ["+"]}],
  "behaviors": [{"behaviorId": "b1", "delta": 1}],
  "abcs": [{"antecedent": "...", "behavior": "...", "consequence": "...", "function": "escape"}],
  "note": "Any clinical observations, behavior functions identified, intervention strategies mentioned, or anything that doesn't map to a specific program/behavior — captured verbatim as a session note. Empty string if nothing.",
  "summary": "One sentence plain-English summary of what was logged."
}

IMPORTANT:
- ALL arrays can be empty [] if nothing matches
- Put strategy language ("use FCT," "redirect to circle," "attention and escape maintain behavior") in the "note" field — never discard it
- Do not fabricate trial data. Only log what was explicitly stated.
- If the entire note is clinical observation with no trial data, return empty arrays and put everything in "note"

Therapist note: "${text}"`);

  // Robust parse — strip markdown, then try JSON.parse
  const cleaned = raw.replace(/```(?:json)?\n?/g, "").replace(/\n?```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    // If JSON is malformed, build a safe fallback that at least saves the text as a note
    return { trials: [], behaviors: [], abcs: [], note: text, summary: "Voice note saved." };
  }
}

// ================= APP =================
export default function BehaviorHubRBT() {
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const [navTab, setNavTab]       = useState("schedule");
  const [screen, setScreen]       = useState("main");
  const [client, setClient]       = useState(null);
  const [backTo, setBackTo]       = useState("schedule");
  const [chatBadge, setChatBadge] = useState(true);
  const [supervisorClientId, setSupervisorClientId] = useState(null);
  const [schedule, setSchedule]   = useState(() => loadSchedule() ?? SCHEDULE);
  const [addingSession, setAddingSession] = useState(false);
  const [extraClients, setExtraClients]   = useState(() => loadExtraClients());
  const [addingClient, setAddingClient]   = useState(false);
  const [notifGranted, setNotifGranted]   = useState(false);

  const allClients = [...CLIENTS, ...extraClients];

  const login  = (u) => { storeUser(u);    setCurrentUser(u); };
  const logout = ()  => { clearStoredUser(); setCurrentUser(null); };

  const addSession = (sess) => { const u = [...schedule, sess]; setSchedule(u); saveSchedule(u); };
  const addClient  = (cl)   => { const u = [...extraClients, cl]; setExtraClients(u); saveExtraClients(u); };

  const touchX = useRef(null);
  const TABS = ["schedule", "clients", "chat", "staff"];
  const handleTouchStart = (e) => { if (screen === "main") touchX.current = e.touches[0].clientX; };
  const handleTouchEnd   = (e) => {
    if (screen !== "main" || touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    const idx = TABS.indexOf(navTab);
    if (dx < -60 && idx < TABS.length - 1) switchTab(TABS[idx + 1]);
    if (dx >  60 && idx > 0) switchTab(TABS[idx - 1]);
    touchX.current = null;
  };

  const switchTab = (tab) => { setNavTab(tab); setScreen("main"); if (tab === "chat") setChatBadge(false); };
  const goToClientHub = (cl, from) => { setClient(cl); setBackTo(from ?? navTab); setScreen("clientHub"); };
  const goToSession   = (cl) => { setClient(cl); setScreen("session"); };
  const goBack        = () => { setScreen("main"); setNavTab(backTo); };

  useEffect(() => {
    const cid = new URLSearchParams(window.location.search).get("supervisor");
    if (cid) setSupervisorClientId(cid);
    setNotifGranted(typeof Notification !== "undefined" && Notification.permission === "granted");
  }, []);

  useEffect(() => {
    if (notifGranted) scheduleSessionNotifs(schedule, allClients);
  }, [notifGranted, schedule]);

  if (supervisorClientId) {
    const sc = allClients.find((cl) => cl.id === supervisorClientId);
    return (
      <div className="font-body min-h-screen w-full" style={{ background: c.bg, color: c.ink }}>
        <style>{FONTS}</style>
        <div className="max-w-3xl mx-auto px-4 py-5"><SupervisorView client={sc} /></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="font-body min-h-screen w-full" style={{ background: c.bg, color: c.ink }}>
        <style>{FONTS}</style>
        <LoginScreen onLogin={login} />
      </div>
    );
  }

  return (
    <div className="font-body min-h-screen w-full" style={{ background: c.bg, color: c.ink }}
      onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <style>{FONTS}</style>

      <div className="max-w-xl mx-auto px-4 pt-5">
        {screen === "main" && navTab === "schedule" && (
          <ScheduleScreen
            schedule={schedule} clients={allClients} currentUser={currentUser}
            onStartSession={(cl) => goToSession(cl)}
            onViewClient={(cl) => goToClientHub(cl, "schedule")}
            onAddSession={() => setAddingSession(true)}
            onLogout={logout}
            notifGranted={notifGranted}
            onRequestNotifs={async () => { const ok = await requestNotifPermission(); setNotifGranted(ok); }}
          />
        )}
        {screen === "main" && navTab === "clients" && (
          <ClientsScreen clients={allClients} onOpen={(cl) => goToClientHub(cl, "clients")} onAddClient={() => setAddingClient(true)} />
        )}
        {screen === "main" && navTab === "chat" && <ChatScreen />}
        {screen === "main" && navTab === "staff" && (
          <StaffScreen clients={allClients} onOpenClient={(cl, from) => goToClientHub(cl, from ?? "staff")} />
        )}
        {screen === "clientHub" && client && (
          <ClientHub client={client} onBack={goBack} onStart={() => goToSession(client)} />
        )}
        {screen === "session" && client && (
          <LiveSession client={client} onExit={goBack} />
        )}
      </div>

      {screen !== "session" && <BottomNav tab={navTab} onChange={switchTab} chatBadge={chatBadge} />}
      {screen !== "session" && <GlobalAIButton navTab={navTab} client={screen === "clientHub" ? client : null} />}
      {addingSession && <AddSessionModal onClose={() => setAddingSession(false)} onAdd={addSession} />}
      {addingClient  && <AddClientModal  onClose={() => setAddingClient(false)}  onAdd={addClient}  />}
    </div>
  );
}

// ---------------- Bottom Nav ----------------
function BottomNav({ tab, onChange, chatBadge }) {
  const tabs = [
    { k: "schedule", label: "Schedule", icon: Calendar },
    { k: "clients",  label: "Clients",  icon: Users },
    { k: "chat",     label: "Chat",     icon: MessageSquare },
    { k: "staff",    label: "Team",     icon: UserCog },
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
function ScheduleScreen({ schedule, clients, currentUser, onStartSession, onViewClient, onAddSession, onLogout, notifGranted, onRequestNotifs }) {
  const [showPast, setShowPast]   = useState(false);
  const [viewMode, setViewMode]   = useState("list");
  const today = new Date().toISOString().split("T")[0];
  const h = new Date().getHours();
  const greet = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  const allClients = clients ?? CLIENTS;

  const todaySessions    = schedule.filter((s) => s.date === today);
  const upcomingSessions = schedule.filter((s) => s.date > today).sort((a, b) => a.date.localeCompare(b.date));
  const pastSessions     = schedule.filter((s) => s.date < today).sort((a, b) => b.date.localeCompare(a.date));
  const completedSessions = schedule.filter((s) => s.status === "completed");
  const thisWeekDone      = completedSessions.length;

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

  const clientFor = (s) => allClients.find((cl) => cl.id === s.clientId);

  return (
    <div className="pb-28">
      {/* Greeting card */}
      <div className="rounded-2xl p-5 mb-5" style={{ background: `linear-gradient(135deg, ${c.primary} 0%, #0A7A6E 100%)`, color: "#fff" }}>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm mb-0.5" style={{ opacity: 0.8 }}>{greet}</div>
            <div className="font-display text-2xl" style={{ fontWeight: 800 }}>{currentUser?.name ?? "Tucker Narkinsky"}</div>
            <div className="text-sm mt-0.5" style={{ opacity: 0.75 }}>{currentUser?.role ?? "RBT"} · Cayer Behavioral Group</div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <button onClick={onLogout} className="px-2.5 py-1 rounded-lg text-xs" style={{ background: "rgba(255,255,255,0.18)", color: "#fff", fontWeight: 600 }}>Sign out</button>
            {!notifGranted && (
              <button onClick={onRequestNotifs} className="px-2.5 py-1 rounded-lg text-xs" style={{ background: "rgba(255,255,255,0.18)", color: "#fff", fontWeight: 600 }}>🔔 Reminders</button>
            )}
          </div>
        </div>
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

      {/* View controls row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: c.surface, border: `1px solid ${c.line}` }}>
          {[{ v: "list", label: "List" }, { v: "week", label: "Week" }].map(({ v, label }) => (
            <button key={v} onClick={() => setViewMode(v)} className="px-3 py-1.5 rounded-lg text-xs"
              style={{ background: viewMode === v ? c.primary : "transparent", color: viewMode === v ? "#fff" : c.muted, fontWeight: 600 }}>
              {label}
            </button>
          ))}
        </div>
        <button onClick={onAddSession}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm active:scale-95"
          style={{ background: c.primary, color: "#fff", fontWeight: 700, boxShadow: `0 2px 8px ${c.primary}44` }}>
          <CalendarPlus size={15} /> New session
        </button>
      </div>

      {/* Week view */}
      {viewMode === "week" && (
        <WeekCalendarView sessions={schedule} clients={CLIENTS} onStartSession={onStartSession} onViewClient={onViewClient} />
      )}

      {/* List view */}
      {viewMode === "list" && (
        <>
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
        </>
      )}
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
function ClientsScreen({ clients, onOpen, onAddClient }) {
  const [resetFlash, setResetFlash] = useState(false);
  const allClients = clients ?? CLIENTS;
  const handleReset = () => { clearAllSessions(); setResetFlash(true); setTimeout(() => setResetFlash(false), 1800); };
  return (
    <div className="pb-28">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="font-display text-2xl" style={{ fontWeight: 800 }}>Clients</div>
          <div className="text-xs mt-0.5" style={{ color: c.muted }}>{allClients.length} active · tap to open hub</div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleReset} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs"
            style={{ background: resetFlash ? c.primarySoft : c.bg, color: resetFlash ? c.primary : c.muted, fontWeight: 600, border: `1px solid ${c.line}` }}>
            <RotateCcw size={12} />{resetFlash ? "Reset!" : "Reset demo"}
          </button>
          <button onClick={onAddClient} className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs active:scale-95"
            style={{ background: c.primary, color: "#fff", fontWeight: 700 }}>
            <Plus size={13} /> Add
          </button>
        </div>
      </div>
      <div className="grid gap-3">
        {allClients.map((cl) => (
          <button key={cl.id} onClick={() => onOpen(cl)} className="flex items-center gap-3 p-4 rounded-2xl text-left transition-transform active:scale-[0.99]"
            style={{ background: c.surface, border: `1px solid ${c.line}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div className="grid place-items-center rounded-2xl font-display text-lg" style={{ width: 48, height: 48, background: cl.color, color: "#fff", fontWeight: 800 }}>
              {cl.name.split(" ").map((w) => w[0]).join("")}
            </div>
            <div className="flex-1">
              <div className="font-display text-base" style={{ fontWeight: 700 }}>{cl.name}</div>
              <div className="text-xs mt-0.5" style={{ color: c.muted }}>Age {cl.age} · {cl.programs ?? 0} programs · {cl.behaviors ?? 0} behaviors · last {cl.last ?? "—"}</div>
            </div>
            <ChevronRight size={18} style={{ color: c.muted }} />
          </button>
        ))}
      </div>
    </div>
  );
}

// ---- Role color helpers ----
const ROLE_COLOR = { BCBA: c.purple, OT: "#EC4899", PT: "#14B8A6", Peds: "#EF4444", RBT: c.primary };
const ROLE_BG    = { BCBA: c.purpleSoft, OT: "#FCE7F3", PT: "#CCFBF1", Peds: "#FEE2E2", RBT: c.primarySoft };

// ---- Build a flat inbox list ----
function buildInbox() {
  const rows = [];
  // Channels first
  Object.entries(CHANNELS).forEach(([id, ch]) => {
    const msgs = ch.messages;
    const last = msgs[msgs.length - 1];
    rows.push({ type: "channel", id, name: ch.name, icon: ch.icon, description: ch.description, lastMsg: last?.text ?? "", lastTime: last?.time ?? "", lastDate: last?.date ?? "", lastSender: last?.sender ?? "", unread: false });
  });
  // DMs
  Object.entries(DMS).forEach(([name, msgs]) => {
    const member = TEAM_MEMBERS[name] || { color: c.muted, initials: name[0], role: "" };
    const last   = msgs[msgs.length - 1];
    const unread = last && last.sender !== CURRENT_USER;
    rows.push({ type: "dm", id: name, name, member, lastMsg: last?.text ?? "", lastTime: last?.time ?? "", lastDate: last?.date ?? "", lastSender: last?.sender ?? "", unread });
  });
  return rows;
}

// ---------------- Chat Screen (inbox → conversation) ----------------
function ChatScreen() {
  const [open, setOpen] = useState(null); // null = inbox, or { type, id }
  const inbox = buildInbox();

  if (open) {
    return <ChatConversation view={open} onBack={() => setOpen(null)} />;
  }

  return (
    <div className="pb-28">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div>
          <div className="font-display text-2xl" style={{ fontWeight: 800 }}>Messages</div>
          <div className="text-xs mt-0.5" style={{ color: c.muted }}>Cayer Behavioral Group</div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs" style={{ background: c.primarySoft, color: c.primary, fontWeight: 700 }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.primary }} /> {Object.keys(TEAM_MEMBERS).length} online
        </div>
      </div>

      {/* Channels section */}
      <div className="mt-4 mb-1">
        <SectionLabel>Channels</SectionLabel>
      </div>
      <div className="rounded-2xl overflow-hidden mb-4" style={{ background: c.surface, border: `1px solid ${c.line}` }}>
        {inbox.filter((r) => r.type === "channel").map((row, i, arr) => (
          <button key={row.id} onClick={() => setOpen({ type: "channel", id: row.id })}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:opacity-70"
            style={{ borderBottom: i < arr.length - 1 ? `1px solid ${c.line}` : "none" }}>
            {/* Channel icon */}
            <div className="grid place-items-center rounded-xl shrink-0 text-xl" style={{ width: 44, height: 44, background: c.primarySoft }}>
              {row.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm" style={{ fontWeight: 700 }}>#{row.name}</span>
                <span className="text-xs shrink-0" style={{ color: c.muted }}>{row.lastTime}</span>
              </div>
              <div className="text-xs mt-0.5 truncate" style={{ color: c.muted }}>
                {row.lastSender && <span style={{ fontWeight: 600, color: c.ink }}>{row.lastSender.split(" ")[0]}: </span>}
                {row.lastMsg || row.description}
              </div>
            </div>
            <ChevronRight size={16} style={{ color: c.line, flexShrink: 0 }} />
          </button>
        ))}
      </div>

      {/* DMs section */}
      <div className="mb-1">
        <SectionLabel>Direct messages</SectionLabel>
      </div>
      <div className="rounded-2xl overflow-hidden" style={{ background: c.surface, border: `1px solid ${c.line}` }}>
        {inbox.filter((r) => r.type === "dm").map((row, i, arr) => {
          const m = row.member;
          const roleC = ROLE_COLOR[m.role] ?? c.muted;
          const roleBg = ROLE_BG[m.role] ?? c.bg;
          return (
            <button key={row.id} onClick={() => setOpen({ type: "dm", id: row.id })}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:opacity-70"
              style={{ borderBottom: i < arr.length - 1 ? `1px solid ${c.line}` : "none" }}>
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="grid place-items-center rounded-full font-display text-sm" style={{ width: 44, height: 44, background: m.color, color: "#fff", fontWeight: 800 }}>
                  {m.initials}
                </div>
                {row.unread && (
                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2" style={{ background: c.accent, borderColor: c.surface }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm" style={{ fontWeight: row.unread ? 700 : 600 }}>{row.name}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: roleBg, color: roleC, fontWeight: 700, fontSize: 10 }}>{m.role}</span>
                  <span className="ml-auto text-xs shrink-0" style={{ color: c.muted }}>{row.lastTime}</span>
                </div>
                <div className="text-xs mt-0.5 truncate" style={{ color: row.unread ? c.ink : c.muted, fontWeight: row.unread ? 600 : 400 }}>
                  {row.lastMsg || <span style={{ fontStyle: "italic" }}>No messages yet — say hi!</span>}
                </div>
              </div>
              <ChevronRight size={16} style={{ color: c.line, flexShrink: 0 }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------- Chat Conversation (full-screen) ----------------
function ChatConversation({ view, onBack }) {
  const isChannel = view.type === "channel";
  const loadMsgs  = () => isChannel ? loadChannelMsgs(view.id) : loadDmMsgs(view.id);
  const saveMsgs  = (msgs) => isChannel ? saveChannelMsgs(view.id, msgs) : saveDmMsgs(view.id, msgs);

  const [messages, setMessages] = useState(loadMsgs);
  const [input, setInput]       = useState("");
  const bottomRef               = useRef(null);
  const chRef                   = useRef(null);

  const meta   = isChannel ? CHANNELS[view.id] : null;
  const member = isChannel ? null : (TEAM_MEMBERS[view.id] || { color: c.muted, initials: view.id[0], role: "" });
  const roleC  = member ? (ROLE_COLOR[member.role] ?? c.muted) : c.primary;
  const roleBg = member ? (ROLE_BG[member.role] ?? c.bg) : c.primarySoft;

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

  return (
    <div className="flex flex-col pb-28" style={{ height: "calc(100dvh - 120px)" }}>
      {/* Conversation header */}
      <div className="flex items-center gap-3 mb-3 shrink-0">
        <button onClick={onBack} className="grid place-items-center rounded-xl shrink-0" style={{ width: 36, height: 36, background: c.bg }}>
          <ArrowLeft size={18} style={{ color: c.muted }} />
        </button>
        {isChannel ? (
          <div className="grid place-items-center rounded-xl text-xl shrink-0" style={{ width: 40, height: 40, background: c.primarySoft }}>{meta?.icon}</div>
        ) : (
          <div className="grid place-items-center rounded-full font-display shrink-0" style={{ width: 40, height: 40, background: member.color, color: "#fff", fontWeight: 800, fontSize: 14 }}>{member.initials}</div>
        )}
        <div className="flex-1 min-w-0">
          <div className="font-display text-base leading-tight" style={{ fontWeight: 800 }}>
            {isChannel ? `#${meta?.name}` : view.id}
          </div>
          <div className="text-xs" style={{ color: c.muted }}>
            {isChannel ? meta?.description : (
              <span className="px-1.5 py-0.5 rounded-full" style={{ background: roleBg, color: roleC, fontWeight: 700 }}>{member.role}</span>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto min-h-0 -mx-1 px-1">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 py-10" style={{ color: c.muted }}>
            <MessageSquare size={32} style={{ opacity: 0.3 }} />
            <p className="text-sm text-center">
              {isChannel ? `Start the conversation in #${meta?.name}` : `Send ${view.id} a message`}
            </p>
          </div>
        )}
        {Object.entries(grouped).map(([date, msgs]) => (
          <div key={date}>
            <div className="text-center my-4">
              <span className="text-xs px-3 py-1 rounded-full" style={{ background: c.line, color: c.muted }}>{date}</span>
            </div>
            {msgs.map((m, i) => {
              const isMine   = m.sender === CURRENT_USER;
              const sender   = TEAM_MEMBERS[m.sender] || { color: c.muted, initials: (m.sender || "?")[0], role: "" };
              const showHdr  = !isMine && (i === 0 || msgs[i - 1].sender !== m.sender);
              const showAvtr = !isMine && (i === msgs.length - 1 || msgs[i + 1].sender !== m.sender);
              const sRoleC   = ROLE_COLOR[sender.role] ?? c.muted;
              const sRoleBg  = ROLE_BG[sender.role]   ?? c.bg;
              return (
                <div key={m.id} className={`flex items-end gap-2 mb-1 ${isMine ? "justify-end" : "justify-start"}`}>
                  {/* Avatar placeholder keeps alignment for grouped messages */}
                  {!isMine && (
                    <div className="shrink-0" style={{ width: 32 }}>
                      {showAvtr && (
                        <div className="grid place-items-center rounded-full font-display" style={{ width: 32, height: 32, background: sender.color, color: "#fff", fontWeight: 800, fontSize: 11 }}>{sender.initials}</div>
                      )}
                    </div>
                  )}
                  <div style={{ maxWidth: "75%" }}>
                    {showHdr && (
                      <div className="flex items-center gap-1.5 mb-1 ml-1">
                        <span className="text-xs" style={{ fontWeight: 700, color: sender.color }}>{m.sender}</span>
                        {sender.role && <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: sRoleBg, color: sRoleC, fontWeight: 700, fontSize: 9 }}>{sender.role}</span>}
                        <span className="text-xs" style={{ color: c.muted }}>{m.time}</span>
                      </div>
                    )}
                    <div className="px-3.5 py-2.5 text-sm leading-relaxed" style={{
                      background: isMine ? c.primary : c.surface,
                      color: isMine ? "#fff" : c.ink,
                      border: isMine ? "none" : `1px solid ${c.line}`,
                      borderRadius: isMine
                        ? (i === 0 || msgs[i-1].sender !== m.sender ? "18px 18px 4px 18px" : "18px 4px 4px 18px")
                        : (showHdr ? "4px 18px 18px 18px" : "4px 18px 18px 4px"),
                    }}>{m.text}</div>
                    {isMine && (
                      <div className="text-right text-xs mt-0.5 mr-1" style={{ color: c.muted }}>{m.time}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 pt-3 shrink-0" style={{ borderTop: `1px solid ${c.line}` }}>
        <input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder={isChannel ? `Message #${meta?.name ?? view.id}…` : `Message ${view.id}…`}
          className="flex-1 px-4 py-3 rounded-2xl text-sm outline-none"
          style={{ background: c.surface, border: `1px solid ${c.line}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }} />
        <button onClick={send} disabled={!input.trim()} className="grid place-items-center rounded-2xl transition-transform active:scale-95"
          style={{ width: 46, height: 46, background: input.trim() ? c.primary : c.line, color: "#fff", flexShrink: 0, boxShadow: input.trim() ? `0 2px 8px ${c.primary}44` : "none" }}>
          <Send size={17} />
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
    { k: "notes",     label: "Notes",     icon: FileSignature },
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
            <ProgressChart client={client} />
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
        {tab === "notes"   && <NoteHistoryTab client={client} />}
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
  const [ending, setEnding]     = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  // Siri-style inline voice entry
  const [voicePhase, setVoicePhase] = useState(null); // null | "listening" | "stopped" | "busy"
  const [voiceText, setVoiceText]   = useState("");
  const [voiceError, setVoiceError] = useState("");
  const dict = useDictation();

  const startVoice = () => {
    setVoiceText(""); setVoiceError("");
    setVoicePhase("listening");
    dict.start((t) => setVoiceText(t));
  };
  const stopVoice   = () => { dict.stop(); setVoicePhase("stopped"); };
  const dismissVoice = () => { dict.stop(); setVoicePhase(null); setVoiceText(""); setVoiceError(""); };

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
  const handleDone = (noteText) => {
    const today = new Date().toISOString().split("T")[0];
    const skillAvg = (() => { const u = programs.filter((p) => p.trials.length); return u.length ? Math.round(u.reduce((s, p) => s + p.trials.filter((t) => t === "+").length / p.trials.length, 0) / u.length * 100) : null; })();
    const behTotal = behaviors.reduce((s, b) => s + b.count, 0);
    const dur = `${String(Math.floor(secs/60)).padStart(2,"0")}:${String(secs%60).padStart(2,"0")}`;
    saveNoteRecord(client.id, { date: today, duration: dur, note: noteText ?? "", skillPct: skillAvg, behaviors: behTotal });
    clearSession(client.id);
    onExit();
  };

  const applyVoiceEntry = ({ trials, behaviors: bds, abcs, note }) => {
    if (trials?.length) setPrograms((ps) => ps.map((p) => { const t = trials.find((t) => t.programId === p.id); return t ? { ...p, trials: [...p.trials, ...t.marks] } : p; }));
    if (bds?.length)    setBehaviors((bs) => bs.map((b) => { const bd = bds.find((d) => d.behaviorId === b.id); return bd ? { ...b, count: Math.max(0, b.count + (bd.delta || 0)) } : b; }));
    if (abcs?.length)   { const ts = now(); setAbc((a) => [...abcs.map((e) => ({ ...e, time: ts })), ...a]); }
    if (note?.trim())   setNotes((n) => [...n, { text: note.trim(), time: now() }]);
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

      {/* Pulsating orange border — alive while voice is active */}
      {voicePhase && (
        <div className="fixed inset-0 pointer-events-none z-30"
          style={{ border: "6px solid #F97316", animation: "bh-glow-pulse 1.4s ease-in-out infinite",
            boxShadow: "0 0 0 6px #F97316, 0 0 50px 16px rgba(249,115,22,0.5)", borderRadius: 0 }} />
      )}

      {/* Voice card — text box + Stop + Submit only */}
      {voicePhase && voicePhase !== "busy" && (
        <div className="fixed bottom-24 left-4 right-4 z-40 rounded-2xl p-4"
          style={{ background: "rgba(20,38,34,0.97)", backdropFilter: "blur(14px)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: voicePhase === "listening" ? "#F97316" : "#555", animation: voicePhase === "listening" ? "bh-mic-ring 1.4s ease-in-out infinite" : "none" }} />
              <span className="text-xs" style={{ color: voicePhase === "listening" ? "#F97316" : "#888", fontWeight: 700 }}>
                {voicePhase === "listening" ? "Listening…" : "Done — tap Submit"}
              </span>
            </div>
            <button onClick={dismissVoice} style={{ color: "#666" }}><X size={16} /></button>
          </div>

          <textarea readOnly={voicePhase === "listening"} value={voiceText}
            onChange={(e) => setVoiceText(e.target.value)}
            rows={3} placeholder="Speak naturally — programs, prompts, behaviors…"
            className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
            style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${voicePhase === "listening" ? "#F97316" : "rgba(255,255,255,0.12)"}`, color: "#fff" }} />

          {voiceError && <p className="text-xs mt-2" style={{ color: "#F97316" }}>{voiceError}</p>}

          <div className="flex gap-2 mt-3">
            {voicePhase === "listening"
              ? <button onClick={stopVoice} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm"
                  style={{ background: "#F97316", color: "#fff", fontWeight: 700 }}>
                  <MicOff size={15} /> Stop
                </button>
              : <>
                  <button onClick={startVoice} className="grid place-items-center rounded-xl shrink-0"
                    style={{ width: 44, height: 44, background: "rgba(255,255,255,0.08)", color: "#aaa" }}>
                    <Mic size={17} />
                  </button>
                  <button onClick={async () => { setVoicePhase("busy"); try { const p = await parseVoiceEntry(voiceText, programs, behaviors); applyVoiceEntry(p); dismissVoice(); } catch (e) { setVoiceError(e instanceof Error ? e.message : "Couldn't reach AI."); setVoicePhase("stopped"); } }}
                    disabled={!voiceText.trim()}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm"
                    style={{ background: voiceText.trim() ? c.primary : "#333", color: "#fff", fontWeight: 700 }}>
                    <Check size={15} /> Submit
                  </button>
                </>}
          </div>
        </div>
      )}

      {/* Busy submitting */}
      {voicePhase === "busy" && (
        <div className="fixed bottom-24 left-4 right-4 z-40 rounded-2xl p-4 flex items-center gap-3"
          style={{ background: "rgba(20,38,34,0.97)", backdropFilter: "blur(14px)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
          <Loader2 size={18} className="animate-spin" style={{ color: c.primary }} />
          <span className="text-sm" style={{ color: "#fff", fontWeight: 600 }}>Submitting…</span>
        </div>
      )}

      {/* FAB — voice entry button */}
      {!voicePhase && (
        <button onClick={startVoice} className="fixed bottom-6 right-4 z-40 flex items-center gap-2 px-4 py-3 rounded-full active:scale-95"
          style={{ background: c.ink, color: "#fff", fontWeight: 700, boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }}>
          <Mic size={17} /><span className="text-sm">Voice entry</span>
        </button>
      )}

      {shareOpen  && <ShareModal clientId={client.id} onClose={() => setShareOpen(false)} />}
      {ending     && <EndSessionModal client={client} duration={`${mm}:${ss}`} programs={programs} behaviors={behaviors} abc={abc} notes={notes} onClose={() => setEnding(false)} onDone={handleDone} />}
    </div>
  );
}

// ---------------- Global AI Assistant ----------------
// Accessible from any screen — context-aware based on navTab / current client
function GlobalAIButton({ navTab, client }) {
  const [open, setOpen]     = useState(false);
  const [text, setText]     = useState("");
  const [reply, setReply]   = useState("");
  const [busy, setBusy]     = useState(false);
  const [error, setError]   = useState("");
  const dict = useDictation();

  const context = () => {
    if (client) return `The clinician is viewing the client hub for ${client.name}, age ${client.age}. Past session data: ${JSON.stringify(PAST_SESSIONS[client.id] ?? [])}. Documents: ${JSON.stringify(DOCUMENTS[client.id] ?? [])}. Protocols: ${JSON.stringify(PROTOCOLS[client.id] ?? [])}.`;
    if (navTab === "schedule") {
      const today = new Date().toISOString().split("T")[0];
      const todaySessions = SCHEDULE.filter((s) => s.date === today).map((s) => { const cl = CLIENTS.find((c) => c.id === s.clientId); return `${cl?.name} ${s.startTime}–${s.endTime}`; });
      return `The clinician is on the Schedule screen. Today's sessions: ${todaySessions.join(", ") || "none"}. They have ${CLIENTS.length} active clients: ${CLIENTS.map((c) => c.name).join(", ")}.`;
    }
    if (navTab === "clients") return `The clinician is on the Clients screen. Active clients: ${CLIENTS.map((cl) => `${cl.name} (age ${cl.age}, ${cl.programs} programs)`).join("; ")}.`;
    if (navTab === "chat") return `The clinician is on the Team Chat screen. Team members: ${Object.entries(TEAM_MEMBERS).map(([n, m]) => `${n} (${m.role})`).join(", ")}.`;
    return "The clinician is using Behavior Hub, an ABA data collection app.";
  };

  const ask = async (input) => {
    const q = (input ?? text).trim();
    if (!q) return;
    setBusy(true); setReply(""); setError("");
    try {
      setReply(await askClaude(`You are an expert ABA clinical assistant inside Behavior Hub, a data collection app for RBTs and BCBAs. Answer concisely and clinically. Use ABA terminology correctly. If asked to draft something (message, note, letter), produce the draft directly.

CONTEXT: ${context()}

You are fluent in all ABA terminology including: ABC data, antecedent/behavior/consequence, escape/attention/tangible/sensory functions, DTT, NET, manding, tacting, echoic, intraverbal, prompt hierarchy (independent, gestural, verbal, model, partial physical, full physical), prompt fading, differential reinforcement (DRO, DRA, DRI, DRL), FCT, extinction, extinction burst, EO/MO, SD/S-delta, chaining, shaping, generalization, token economy, FBA, VB-MAPP, ABLLS, preference assessment, IOA, baseline, probe data, rate, frequency, duration, latency, partial/whole interval recording, momentary time sampling, NCR, behavioral momentum, high-p sequence, social validity, treatment integrity, behavior contract, and all BACB task list content.

Clinician's request: "${q}"`));
    } catch (e) { setError(e instanceof Error ? e.message : "Couldn't reach the AI."); }
    finally { setBusy(false); }
  };

  const handleVoice = () => {
    if (dict.listening) { dict.stop(); ask(text); }
    else { setText(""); setReply(""); dict.start((t) => setText(t)); }
  };

  if (!open) return (
    <button onClick={() => setOpen(true)} className="fixed bottom-20 right-4 z-40 flex items-center gap-2 px-4 py-3 rounded-full active:scale-95"
      style={{ background: c.ink, color: "#fff", fontWeight: 700, boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
      <Sparkles size={17} /><span className="text-sm">Ask AI</span>
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-3 pb-6" style={{ background: "rgba(26,46,43,0.5)" }}>
      <div className="w-full max-w-lg rounded-2xl overflow-hidden" style={{ background: "rgba(20,40,36,0.97)", backdropFilter: "blur(16px)" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <Sparkles size={16} style={{ color: c.primary }} />
            <span className="text-sm" style={{ color: "#fff", fontWeight: 700 }}>AI Assistant</span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(14,159,143,0.2)", color: c.primary, fontWeight: 600 }}>
              {client ? client.name : navTab === "schedule" ? "Schedule" : navTab === "clients" ? "Clients" : "Team"}
            </span>
          </div>
          <button onClick={() => { setOpen(false); dict.stop(); setText(""); setReply(""); setError(""); }} style={{ color: "#666" }}><X size={18} /></button>
        </div>

        {/* Suggestions */}
        {!reply && !busy && (
          <div className="px-4 pb-3 flex gap-2 flex-wrap">
            {(client
              ? [`Summarize ${client.name.split(" ")[0]}'s progress`, `What are the behavior protocols?`, `Draft a parent update`]
              : navTab === "schedule"
                ? ["What's on my schedule today?", "Prep tips for my next session", "Explain behavioral momentum"]
                : navTab === "clients"
                  ? ["Which client needs the most attention?", "Explain DRO vs DRA", "What is FCT?"]
                  : ["Draft a message to Dr. Martinez", "What is extinction burst?", "Explain high-p sequence"]
            ).map((s) => (
              <button key={s} onClick={() => { setText(s); ask(s); }} className="text-xs px-3 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)", color: "#ccc", border: "1px solid rgba(255,255,255,0.1)" }}>{s}</button>
            ))}
          </div>
        )}

        {/* Reply */}
        {(busy || reply || error) && (
          <div className="px-4 pb-3 max-h-60 overflow-y-auto">
            {busy && <div className="flex items-center gap-2 text-sm" style={{ color: "#888" }}><Loader2 size={14} className="animate-spin" style={{ color: c.primary }} /> Thinking…</div>}
            {reply && <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "#e0e0e0" }}>{reply}</p>}
            {error && <p className="text-sm" style={{ color: "#F97316" }}>{error}</p>}
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2 px-4 pb-4 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <input value={text} onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(); } }}
            placeholder="Ask anything — session prep, ABA terms, draft a message…"
            className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff" }} />
          <button onClick={handleVoice} className={`grid place-items-center rounded-xl shrink-0 ${dict.listening ? "bh-mic-pulse" : ""}`}
            style={{ width: 40, height: 40, background: dict.listening ? "#F97316" : "rgba(255,255,255,0.1)", color: "#fff" }}>
            {dict.listening ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
          <button onClick={() => ask()} disabled={busy || !text.trim()} className="grid place-items-center rounded-xl shrink-0 active:scale-95"
            style={{ width: 40, height: 40, background: text.trim() ? c.primary : "rgba(255,255,255,0.08)", color: "#fff" }}>
            <Send size={16} />
          </button>
        </div>
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
            <button onClick={() => onDone(note)} className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl text-base" style={{ background: c.plus, color: "#fff", fontWeight: 700 }}>
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
// ---- Staff Screen ----------------
function StaffScreen({ onOpenClient }) {
  const [selected, setSelected] = useState(null);
  const bcbas = Object.entries(TEAM_MEMBERS).filter(([, m]) => m.role === "BCBA");
  const rbts   = Object.entries(TEAM_MEMBERS).filter(([, m]) => m.role === "RBT");
  const others = Object.entries(TEAM_MEMBERS).filter(([, m]) => !["BCBA","RBT"].includes(m.role));

  if (selected) {
    return <StaffDetail name={selected} onBack={() => setSelected(null)} onOpenClient={onOpenClient} />;
  }

  const StaffGroup = ({ title, members }) => (
    <div className="mb-5">
      <SectionLabel>{title}</SectionLabel>
      <div className="grid gap-2.5">
        {members.map(([name, member]) => {
          const det   = STAFF_DETAILS[name] ?? { clients: [], hoursWeek: 0 };
          const days  = det.certExp ? certDaysLeft(det.certExp) : null;
          const warn  = days !== null && days < 90;
          const roleC = ROLE_COLOR[member.role] ?? c.muted;
          const roleBg= ROLE_BG[member.role]   ?? c.bg;
          return (
            <button key={name} onClick={() => setSelected(name)}
              className="flex items-center gap-3 p-4 rounded-2xl text-left transition-transform active:scale-[0.99]"
              style={{ background: c.surface, border: `1px solid ${warn ? c.accent + "55" : c.line}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div className="grid place-items-center rounded-full font-display shrink-0"
                style={{ width: 48, height: 48, background: member.color, color: "#fff", fontWeight: 800, fontSize: 15 }}>
                {member.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-display text-base" style={{ fontWeight: 700 }}>{name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: roleBg, color: roleC, fontWeight: 700 }}>{member.role}</span>
                  {warn && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: c.accentSoft, color: c.accent, fontWeight: 700 }}>Cert {days}d</span>}
                </div>
                <div className="text-xs mt-0.5" style={{ color: c.muted }}>
                  {det.clients.length} client{det.clients.length !== 1 ? "s" : ""} · {det.hoursWeek}h this week
                  {det.supervisionHours ? ` · ${det.supervisionHours}h supervision` : ""}
                </div>
              </div>
              <ChevronRight size={18} style={{ color: c.muted }} />
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="pb-28">
      <div className="mb-5">
        <div className="font-display text-2xl" style={{ fontWeight: 800 }}>Team</div>
        <div className="text-xs mt-0.5" style={{ color: c.muted }}>Cayer Behavioral Group · {Object.keys(TEAM_MEMBERS).length} members</div>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {[
          { label: "BCBAs", value: bcbas.length },
          { label: "RBTs", value: rbts.length },
          { label: "Total hrs/wk", value: Object.values(STAFF_DETAILS).reduce((s, d) => s + (d.hoursWeek || 0), 0) },
        ].map(({ label, value }) => (
          <div key={label} className="p-3 rounded-2xl text-center" style={{ background: c.surface, border: `1px solid ${c.line}` }}>
            <div className="font-display text-xl" style={{ fontWeight: 800 }}>{value}</div>
            <div className="text-xs" style={{ color: c.muted }}>{label}</div>
          </div>
        ))}
      </div>

      <StaffGroup title="BCBAs" members={bcbas} />
      <StaffGroup title="RBTs" members={rbts} />
      <StaffGroup title="Other specialists" members={others} />
    </div>
  );
}

// ---- Staff Detail ----
function StaffDetail({ name, onBack, onOpenClient }) {
  const member = TEAM_MEMBERS[name] ?? { color: c.muted, initials: name[0], role: "" };
  const det    = STAFF_DETAILS[name] ?? { clients: [], hoursWeek: 0, certExp: null };
  const clientList = CLIENTS.filter((cl) => det.clients.includes(cl.id));
  const roleC  = ROLE_COLOR[member.role] ?? c.muted;
  const roleBg = ROLE_BG[member.role]   ?? c.bg;
  const days   = det.certExp ? certDaysLeft(det.certExp) : null;
  const thisWeekSessions = SCHEDULE.filter((s) => det.clients.includes(s.clientId) && s.status === "upcoming").slice(0, 5);

  return (
    <div className="pb-28">
      <BackBar onBack={onBack} label="Team" />

      {/* Profile */}
      <div className="flex items-center gap-4 mt-4 mb-5">
        <div className="grid place-items-center rounded-full font-display"
          style={{ width: 64, height: 64, background: member.color, color: "#fff", fontWeight: 800, fontSize: 20 }}>
          {member.initials}
        </div>
        <div>
          <div className="font-display text-2xl" style={{ fontWeight: 800 }}>{name}</div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: roleBg, color: roleC, fontWeight: 700 }}>{member.role}</span>
            {days !== null && (
              <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: days < 90 ? c.accentSoft : c.primarySoft, color: days < 90 ? c.accent : c.primary, fontWeight: 700 }}>
                Cert expires {days}d
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: "Hrs / wk", value: det.hoursWeek },
          { label: "Clients", value: det.clients.length },
          { label: "Supervision hrs", value: det.supervisionHours ?? "N/A" },
        ].map(({ label, value }) => (
          <div key={label} className="p-3 rounded-2xl text-center" style={{ background: c.surface, border: `1px solid ${c.line}` }}>
            <div className="font-display text-xl" style={{ fontWeight: 800 }}>{value}</div>
            <div className="text-xs" style={{ color: c.muted }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Assigned clients */}
      <Card>
        <Label icon={Users}>Assigned clients</Label>
        {clientList.length === 0
          ? <p className="text-sm mt-3" style={{ color: c.muted }}>No clients assigned.</p>
          : <div className="grid gap-2 mt-3">
              {clientList.map((cl) => (
                <button key={cl.id} onClick={() => onOpenClient(cl, "staff")}
                  className="flex items-center gap-3 p-3 rounded-xl text-left active:opacity-70"
                  style={{ background: c.bg, border: `1px solid ${c.line}` }}>
                  <div className="grid place-items-center rounded-xl font-display shrink-0"
                    style={{ width: 36, height: 36, background: cl.color, color: "#fff", fontWeight: 800, fontSize: 13 }}>
                    {cl.name.split(" ").map((w) => w[0]).join("")}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm" style={{ fontWeight: 600 }}>{cl.name}</div>
                    <div className="text-xs" style={{ color: c.muted }}>Age {cl.age} · {cl.programs} programs</div>
                  </div>
                  <ChevronRight size={15} style={{ color: c.muted }} />
                </button>
              ))}
            </div>}
      </Card>

      {/* Upcoming sessions */}
      {thisWeekSessions.length > 0 && (
        <div className="mt-4">
          <Card>
            <Label icon={Calendar}>Upcoming sessions</Label>
            <div className="grid gap-2 mt-3">
              {thisWeekSessions.map((s) => {
                const cl = CLIENTS.find((c) => c.id === s.clientId);
                return (
                  <div key={s.id} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: c.bg }}>
                    <div className="grid place-items-center rounded-lg font-display shrink-0"
                      style={{ width: 32, height: 32, background: cl?.color ?? c.muted, color: "#fff", fontWeight: 800, fontSize: 11 }}>
                      {cl?.name.split(" ").map((w) => w[0]).join("")}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm" style={{ fontWeight: 600 }}>{cl?.name}</div>
                      <div className="text-xs" style={{ color: c.muted }}>{formatDayHeader(s.date)} · {s.startTime}–{s.endTime}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ---- Add Session Modal ----
function AddSessionModal({ onClose, onAdd }) {
  const today = new Date().toISOString().split("T")[0];
  const [clientId, setClientId]   = useState(CLIENTS[0]?.id ?? "");
  const [date, setDate]           = useState(today);
  const [startTime, setStartTime] = useState("9:00 AM");
  const [endTime, setEndTime]     = useState("11:00 AM");
  const [therapist, setTherapist] = useState("Tucker");
  const [address, setAddress]     = useState("");
  const [supervised, setSupervised] = useState(false);
  const [supervisor, setSupervisor] = useState("Dr. Martinez");

  const timeOptions = [
    "8:00 AM","8:30 AM","9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM",
    "12:00 PM","12:30 PM","1:00 PM","1:30 PM","2:00 PM","2:30 PM","3:00 PM","3:30 PM",
    "4:00 PM","4:30 PM","5:00 PM","5:30 PM","6:00 PM",
  ];

  const rbts   = Object.entries(TEAM_MEMBERS).filter(([, m]) => m.role === "RBT").map(([n]) => n);
  const bcbas  = Object.entries(TEAM_MEMBERS).filter(([, m]) => m.role === "BCBA").map(([n]) => n);

  // Auto-fill address from client's existing sessions
  const handleClientChange = (id) => {
    setClientId(id);
    const prev = SCHEDULE.find((s) => s.clientId === id && s.address);
    if (prev) setAddress(prev.address);
  };

  const save = () => {
    if (!clientId || !date || !address.trim()) return;
    onAdd({
      id: `s${Date.now()}`,
      clientId,
      date,
      startTime,
      endTime,
      address: address.trim(),
      status: "upcoming",
      ...(supervised ? { supervisor } : {}),
    });
    onClose();
  };

  const selStyle = { background: c.bg, border: `1px solid ${c.line}`, borderRadius: 12, padding: "10px 12px", fontSize: 14, outline: "none", width: "100%", color: c.ink };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3" style={{ background: "rgba(26,46,43,0.55)" }}>
      <div className="w-full max-w-md rounded-2xl p-5 max-h-[92vh] overflow-y-auto" style={{ background: c.surface }}>
        <div className="flex items-center justify-between mb-4">
          <div className="font-display text-xl" style={{ fontWeight: 800 }}>New session</div>
          <button onClick={onClose} className="grid place-items-center rounded-lg" style={{ width: 32, height: 32, background: c.bg }}><X size={18} /></button>
        </div>

        <div className="grid gap-3">
          {/* Client */}
          <div>
            <div className="text-xs mb-1" style={{ color: c.muted, fontWeight: 600 }}>Client</div>
            <select value={clientId} onChange={(e) => handleClientChange(e.target.value)} style={selStyle}>
              {CLIENTS.map((cl) => <option key={cl.id} value={cl.id}>{cl.name} (age {cl.age})</option>)}
            </select>
          </div>

          {/* Date */}
          <div>
            <div className="text-xs mb-1" style={{ color: c.muted, fontWeight: 600 }}>Date</div>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              style={{ ...selStyle }} />
          </div>

          {/* Times */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-xs mb-1" style={{ color: c.muted, fontWeight: 600 }}>Start time</div>
              <select value={startTime} onChange={(e) => setStartTime(e.target.value)} style={selStyle}>
                {timeOptions.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <div className="text-xs mb-1" style={{ color: c.muted, fontWeight: 600 }}>End time</div>
              <select value={endTime} onChange={(e) => setEndTime(e.target.value)} style={selStyle}>
                {timeOptions.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Therapist */}
          <div>
            <div className="text-xs mb-1" style={{ color: c.muted, fontWeight: 600 }}>Assigned therapist</div>
            <select value={therapist} onChange={(e) => setTherapist(e.target.value)} style={selStyle}>
              {rbts.map((n) => <option key={n}>{n}</option>)}
            </select>
          </div>

          {/* Address */}
          <div>
            <div className="text-xs mb-1" style={{ color: c.muted, fontWeight: 600 }}>Address</div>
            <input value={address} onChange={(e) => setAddress(e.target.value)}
              placeholder="Session location" style={selStyle} />
          </div>

          {/* Supervision toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: c.bg, border: `1px solid ${c.line}` }}>
            <div>
              <div className="text-sm" style={{ fontWeight: 600 }}>BCBA supervision</div>
              <div className="text-xs" style={{ color: c.muted }}>Mark as a supervised session</div>
            </div>
            <button onClick={() => setSupervised(!supervised)}
              className="w-11 h-6 rounded-full relative transition-colors"
              style={{ background: supervised ? c.primary : c.line }}>
              <span className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
                style={{ left: supervised ? "calc(100% - 20px)" : 4 }} />
            </button>
          </div>

          {supervised && (
            <div>
              <div className="text-xs mb-1" style={{ color: c.muted, fontWeight: 600 }}>Supervising BCBA</div>
              <select value={supervisor} onChange={(e) => setSupervisor(e.target.value)} style={selStyle}>
                {bcbas.map((n) => <option key={n}>{n}</option>)}
              </select>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm" style={{ background: c.bg, color: c.muted, fontWeight: 600 }}>Cancel</button>
          <button onClick={save} disabled={!address.trim()} className="flex-1 py-3 rounded-xl text-sm active:scale-95"
            style={{ background: address.trim() ? c.primary : c.line, color: "#fff", fontWeight: 700 }}>
            Add session
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- Week Calendar View ----
function WeekCalendarView({ sessions, clients, onStartSession, onViewClient }) {
  const today = new Date().toISOString().split("T")[0];
  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() - (d.getDay() === 0 ? 6 : d.getDay() - 1));
    return d.toISOString().split("T")[0];
  });

  const days = getWeekDays(weekStart);
  const dayLabels = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  const prevWeek = () => {
    const d = new Date(weekStart + "T12:00:00"); d.setDate(d.getDate() - 7);
    setWeekStart(d.toISOString().split("T")[0]);
  };
  const nextWeek = () => {
    const d = new Date(weekStart + "T12:00:00"); d.setDate(d.getDate() + 7);
    setWeekStart(d.toISOString().split("T")[0]);
  };

  const mon = new Date(weekStart + "T12:00:00");
  const sun = new Date(days[6] + "T12:00:00");
  const monthLabel = mon.getMonth() === sun.getMonth()
    ? `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][mon.getMonth()]} ${mon.getFullYear()}`
    : `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][mon.getMonth()]} – ${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][sun.getMonth()]} ${sun.getFullYear()}`;

  return (
    <div className="mb-5">
      {/* Week nav */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevWeek} className="grid place-items-center rounded-xl" style={{ width: 34, height: 34, background: c.surface, border: `1px solid ${c.line}` }}>
          <ChevronRight size={16} style={{ color: c.muted, transform: "rotate(180deg)" }} />
        </button>
        <span className="text-sm" style={{ fontWeight: 700 }}>{monthLabel}</span>
        <button onClick={nextWeek} className="grid place-items-center rounded-xl" style={{ width: 34, height: 34, background: c.surface, border: `1px solid ${c.line}` }}>
          <ChevronRight size={16} style={{ color: c.muted }} />
        </button>
      </div>

      {/* Day columns */}
      <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(7, 1fr)` }}>
        {days.map((day, i) => {
          const isToday = day === today;
          const daySessions = sessions.filter((s) => s.date === day);
          return (
            <div key={day} className="flex flex-col gap-1">
              <div className="text-center pb-1.5" style={{ borderBottom: `2px solid ${isToday ? c.primary : c.line}` }}>
                <div className="text-xs" style={{ color: isToday ? c.primary : c.muted, fontWeight: isToday ? 700 : 500 }}>{dayLabels[i]}</div>
                <div className="font-display text-base leading-tight" style={{ fontWeight: 800, color: isToday ? c.primary : c.ink }}>
                  {new Date(day + "T12:00:00").getDate()}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                {daySessions.map((s) => {
                  const cl = clients.find((c) => c.id === s.clientId);
                  return (
                    <button key={s.id} onClick={() => cl && onViewClient(cl)}
                      className="w-full rounded-lg p-1 text-left active:opacity-70"
                      style={{ background: cl?.color + "22" ?? c.primarySoft, border: `1.5px solid ${cl?.color ?? c.primary}` }}>
                      <div className="text-xs font-display leading-tight truncate" style={{ fontWeight: 700, color: cl?.color ?? c.primary, fontSize: 9 }}>
                        {cl?.name.split(" ")[0]}
                      </div>
                      <div className="text-xs leading-tight" style={{ color: c.muted, fontSize: 8 }}>{s.startTime.replace(" AM","").replace(" PM","")}</div>
                    </button>
                  );
                })}
                {daySessions.length === 0 && (
                  <div className="rounded-lg" style={{ height: 28, background: c.bg }} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Today's session count */}
      <div className="mt-2 text-center text-xs" style={{ color: c.muted }}>
        {sessions.filter((s) => s.date === today).length} session{sessions.filter((s) => s.date === today).length !== 1 ? "s" : ""} today
      </div>
    </div>
  );
}

// ============================================================
// NEW COMPONENTS: Auth, Note History, Progress Chart, Add Client
// ============================================================

// ---------------- Login Screen ----------------
function LoginScreen({ onLogin }) {
  const [selected, setSelected] = useState(null);
  const [pin, setPin]           = useState("");
  const [error, setError]       = useState("");

  const members = Object.entries(TEAM_MEMBERS).map(([name, m]) => ({ name, ...m }));

  const handlePin = (digit) => {
    if (pin.length >= 4) return;
    const next = pin + digit;
    setPin(next);
    setError("");
    if (next.length === 4) {
      if (PINS[selected.name] === next) {
        onLogin({ name: selected.name, role: selected.role, initials: selected.initials, color: selected.color });
      } else {
        setTimeout(() => { setPin(""); setError("Wrong PIN — try again"); }, 400);
      }
    }
  };

  const selStyle = { background: c.surface, border: `2px solid ${c.primary}`, transform: "scale(1.04)", boxShadow: `0 0 0 4px ${c.primarySoft}` };
  const norStyle = { background: c.surface, border: `1px solid ${c.line}` };

  if (!selected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 pb-10">
        <div className="font-display text-3xl mb-1 text-center" style={{ fontWeight: 800, color: c.ink }}>Behavior Hub</div>
        <div className="text-sm mb-8 text-center" style={{ color: c.muted }}>Cayer Behavioral Group · select your profile</div>
        <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
          {members.map((m) => {
            const roleC  = ROLE_COLOR[m.role]  ?? c.muted;
            const roleBg = ROLE_BG[m.role]     ?? c.bg;
            return (
              <button key={m.name} onClick={() => setSelected(m)}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl transition-all active:scale-95"
                style={{ background: c.surface, border: `1px solid ${c.line}` }}>
                <div className="grid place-items-center rounded-full font-display"
                  style={{ width: 52, height: 52, background: m.color, color: "#fff", fontWeight: 800, fontSize: 16 }}>
                  {m.initials}
                </div>
                <div className="text-xs text-center leading-tight" style={{ fontWeight: 700 }}>{m.name.split(" ")[0]}</div>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: roleBg, color: roleC, fontWeight: 700 }}>{m.role}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 pb-10">
      <div className="grid place-items-center rounded-full font-display mb-3"
        style={{ width: 72, height: 72, background: selected.color, color: "#fff", fontWeight: 800, fontSize: 22 }}>
        {selected.initials}
      </div>
      <div className="font-display text-xl mb-0.5" style={{ fontWeight: 800 }}>{selected.name}</div>
      <div className="text-sm mb-6" style={{ color: c.muted }}>Enter your 4-digit PIN</div>

      {/* PIN dots */}
      <div className="flex gap-3 mb-2">
        {[0,1,2,3].map((i) => (
          <div key={i} className="w-4 h-4 rounded-full transition-all"
            style={{ background: pin.length > i ? c.primary : c.line, transform: pin.length > i ? "scale(1.3)" : "scale(1)" }} />
        ))}
      </div>
      {error && <div className="text-xs mb-4" style={{ color: c.accent }}>{error}</div>}
      {!error && <div className="mb-4" style={{ height: 18 }} />}

      {/* Numpad */}
      <div className="grid grid-cols-3 gap-3 w-56">
        {[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map((d, i) => (
          d === "" ? <div key={i} /> :
          <button key={i} onClick={() => d === "⌫" ? setPin(p => p.slice(0,-1)) : handlePin(String(d))}
            className="h-14 rounded-2xl font-display text-xl active:scale-95 transition-transform"
            style={{ background: c.surface, border: `1px solid ${c.line}`, fontWeight: 700, color: c.ink }}>
            {d}
          </button>
        ))}
      </div>

      <button onClick={() => { setSelected(null); setPin(""); setError(""); }}
        className="mt-6 text-sm" style={{ color: c.muted }}>← Back</button>

      <div className="mt-8 p-3 rounded-xl text-xs text-center" style={{ background: c.primarySoft, color: c.muted, maxWidth: 240 }}>
        Demo PINs: RBTs use <b style={{color:c.primary}}>1234–4567</b> · BCBAs use <b style={{color:c.purple}}>0000 / 9999</b>
      </div>
    </div>
  );
}

// ---------------- Note History Tab ----------------
function NoteHistoryTab({ client }) {
  const [records, setRecords] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const saved = loadNoteRecords(client.id);
    const seeded = (PAST_SESSIONS[client.id] ?? []).map((s) => ({
      date: s.date ?? "2026-06-" + (s.date ?? "12"),
      duration: s.duration,
      skillPct: s.skillPct,
      behaviors: s.behaviors,
      note: s.signed ? "Session note signed and archived." : "Note pending signature.",
      saved: null,
    }));
    const merged = [...saved, ...seeded.filter((s) => !saved.find((r) => r.date === s.date))];
    setRecords(merged.sort((a,b) => (b.date ?? "").localeCompare(a.date ?? "")));
  }, [client.id]);

  if (records.length === 0) return <EmptyState icon={FileSignature} message="No signed notes yet. Complete a session to generate one." />;

  return (
    <div className="grid gap-2.5">
      {records.map((r, i) => (
        <div key={i} className="rounded-2xl overflow-hidden" style={{ background: c.surface, border: `1px solid ${c.line}` }}>
          <button onClick={() => setExpanded(expanded === i ? null : i)}
            className="w-full flex items-center gap-3 p-4 text-left">
            <div className="grid place-items-center rounded-xl shrink-0"
              style={{ width: 44, height: 44, background: c.primarySoft }}>
              <FileSignature size={18} style={{ color: c.primary }} />
            </div>
            <div className="flex-1">
              <div className="font-display text-base" style={{ fontWeight: 700 }}>
                {r.date ? new Date(r.date + "T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}) : "Session note"}
              </div>
              <div className="text-xs mt-0.5" style={{ color: c.muted }}>
                {r.duration} · {r.skillPct !== null && r.skillPct !== undefined ? `${r.skillPct}% skill avg` : ""} · {r.behaviors} behavior events
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: c.primarySoft, color: c.primary, fontWeight: 700 }}>✓ Signed</span>
              <ChevronDown size={16} style={{ color: c.muted, transform: expanded === i ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform .15s" }} />
            </div>
          </button>
          {expanded === i && r.note && (
            <div className="px-4 pb-4" style={{ borderTop: `1px solid ${c.line}` }}>
              <p className="text-sm leading-relaxed mt-3 whitespace-pre-wrap">{r.note}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ---------------- Progress Chart (SVG) ----------------
function ProgressChart({ client }) {
  const sessions = PAST_SESSIONS[client.id] ?? [];
  if (sessions.length < 2) return <EmptyState icon={TrendingUp} message="Need at least 2 sessions to show a trend." />;

  const W = 300, H = 120, PAD = { t: 12, r: 12, b: 30, l: 36 };
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;
  const pts = sessions.map((s, i) => ({ x: PAD.l + (i / (sessions.length - 1)) * innerW, y: PAD.t + ((100 - s.skillPct) / 100) * innerH, pct: s.skillPct, date: s.date }));
  const polyline = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const latest = pts[pts.length - 1];
  const trend  = latest.pct - pts[0].pct;

  return (
    <Card>
      <div className="flex items-center justify-between mb-2">
        <Label icon={TrendingUp}>Skill accuracy trend</Label>
        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: trend >= 0 ? c.primarySoft : c.accentSoft, color: trend >= 0 ? c.primary : c.accent, fontWeight: 700 }}>
          {trend >= 0 ? "+" : ""}{trend}% overall
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", overflow: "visible" }}>
        {/* Y gridlines */}
        {[0, 50, 80, 100].map((v) => {
          const y = PAD.t + ((100 - v) / 100) * innerH;
          return (
            <g key={v}>
              <line x1={PAD.l} y1={y} x2={W - PAD.r} y2={y} stroke={v === 80 ? c.primary + "44" : c.line} strokeWidth={v === 80 ? 1.5 : 1} strokeDasharray={v === 80 ? "4 3" : ""} />
              <text x={PAD.l - 4} y={y + 4} textAnchor="end" fontSize={9} fill={c.muted}>{v}%</text>
            </g>
          );
        })}
        {/* Area fill */}
        <defs>
          <linearGradient id="skillGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c.primary} stopOpacity="0.18" />
            <stop offset="100%" stopColor={c.primary} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={`${pts[0].x},${PAD.t + innerH} ${polyline} ${pts[pts.length-1].x},${PAD.t + innerH}`} fill="url(#skillGrad)" />
        {/* Line */}
        <polyline points={polyline} fill="none" stroke={c.primary} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
        {/* Dots + labels */}
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={4} fill={c.surface} stroke={pctColor(p.pct)} strokeWidth={2.5} />
            <text x={p.x} y={H - 8} textAnchor="middle" fontSize={8} fill={c.muted}>{p.date?.slice(5) ?? sessions[i].date}</text>
          </g>
        ))}
        {/* Latest value callout */}
        <rect x={latest.x - 16} y={latest.y - 20} width={32} height={16} rx={5} fill={pctColor(latest.pct)} />
        <text x={latest.x} y={latest.y - 8} textAnchor="middle" fontSize={9} fill="#fff" fontWeight="bold">{latest.pct}%</text>
      </svg>
    </Card>
  );
}

// ---------------- Add Client Modal ----------------
const CLIENT_COLORS = ["#0E9F8F","#F97316","#F59E0B","#7C3AED","#EC4899","#14B8A6","#EF4444","#84CC16","#8B5CF6"];

function AddClientModal({ onClose, onAdd }) {
  const [name, setName]     = useState("");
  const [age, setAge]       = useState("");
  const [diag, setDiag]     = useState("Autism Spectrum Disorder (F84.0)");
  const [color, setColor]   = useState(CLIENT_COLORS[0]);
  const [address, setAddress] = useState("");

  const save = () => {
    if (!name.trim() || !age) return;
    onAdd({
      id: `cx${Date.now()}`,
      name: name.trim(),
      age: parseInt(age),
      color,
      programs: 0,
      behaviors: 0,
      last: "Never",
      diagnosis: diag.trim(),
      address: address.trim(),
    });
    onClose();
  };

  const inp = { background: c.bg, border: `1px solid ${c.line}`, borderRadius: 12, padding: "10px 12px", fontSize: 14, outline: "none", width: "100%", color: c.ink };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3" style={{ background: "rgba(26,46,43,0.55)" }}>
      <div className="w-full max-w-md rounded-2xl p-5" style={{ background: c.surface }}>
        <div className="flex items-center justify-between mb-4">
          <div className="font-display text-xl" style={{ fontWeight: 800 }}>New client</div>
          <button onClick={onClose} className="grid place-items-center rounded-lg" style={{ width: 32, height: 32, background: c.bg }}><X size={18} /></button>
        </div>
        <div className="grid gap-3">
          <div>
            <div className="text-xs mb-1" style={{ color: c.muted, fontWeight: 600 }}>Full name</div>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Jordan M." style={inp} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-xs mb-1" style={{ color: c.muted, fontWeight: 600 }}>Age</div>
              <input type="number" min="1" max="25" value={age} onChange={(e) => setAge(e.target.value)} placeholder="6" style={inp} />
            </div>
            <div>
              <div className="text-xs mb-1" style={{ color: c.muted, fontWeight: 600 }}>Color</div>
              <div className="flex gap-1.5 flex-wrap pt-1">
                {CLIENT_COLORS.map((col) => (
                  <button key={col} onClick={() => setColor(col)}
                    className="rounded-full transition-transform active:scale-90"
                    style={{ width: 24, height: 24, background: col, border: `3px solid ${color === col ? c.ink : "transparent"}`, transform: color === col ? "scale(1.15)" : "scale(1)" }} />
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: c.muted, fontWeight: 600 }}>Diagnosis</div>
            <input value={diag} onChange={(e) => setDiag(e.target.value)} placeholder="Primary diagnosis" style={inp} />
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: c.muted, fontWeight: 600 }}>Session address (optional)</div>
            <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Home / clinic address" style={inp} />
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm" style={{ background: c.bg, color: c.muted, fontWeight: 600 }}>Cancel</button>
          <button onClick={save} disabled={!name.trim() || !age}
            className="flex-1 py-3 rounded-xl text-sm active:scale-95"
            style={{ background: name.trim() && age ? c.primary : c.line, color: "#fff", fontWeight: 700 }}>
            Add client
          </button>
        </div>
      </div>
    </div>
  );
}
