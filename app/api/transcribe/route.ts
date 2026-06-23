import { NextRequest, NextResponse } from "next/server";

// Allow the upload + transcription up to 60s on Vercel.
export const maxDuration = 60;

// Speech-to-text. Prefers Groq (fast, generous free Whisper) and falls back to OpenAI.
// Set ONE of these in your environment: GROQ_API_KEY or OPENAI_API_KEY.
function provider() {
  if (process.env.GROQ_API_KEY) {
    return {
      url: "https://api.groq.com/openai/v1/audio/transcriptions",
      key: process.env.GROQ_API_KEY,
      model: "whisper-large-v3-turbo",
    };
  }
  if (process.env.OPENAI_API_KEY) {
    return {
      url: "https://api.openai.com/v1/audio/transcriptions",
      key: process.env.OPENAI_API_KEY,
      model: "whisper-1",
    };
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const p = provider();
    if (!p) {
      return NextResponse.json(
        { error: "Voice transcription isn't set up yet. Add a GROQ_API_KEY (or OPENAI_API_KEY) in the project settings." },
        { status: 503 }
      );
    }

    const inForm = await req.formData();
    const file = inForm.get("audio");
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No audio received. Please try recording again." }, { status: 400 });
    }

    const outForm = new FormData();
    outForm.append("file", file, (file as File).name || "recording.webm");
    outForm.append("model", p.model);
    outForm.append("language", "en");
    outForm.append("response_format", "json");

    const res = await fetch(p.url, {
      method: "POST",
      headers: { Authorization: `Bearer ${p.key}` },
      body: outForm,
    });

    const data = await res.json();

    if (!res.ok) {
      const raw = data?.error?.message ?? "";
      if (res.status === 401 || res.status === 403)
        return NextResponse.json({ error: "Voice transcription is temporarily unavailable." }, { status: res.status });
      if (res.status === 429)
        return NextResponse.json({ error: "Transcription is busy right now. Wait a moment and try again." }, { status: res.status });
      return NextResponse.json({ error: `Couldn't transcribe the audio. ${raw}`.trim() }, { status: res.status });
    }

    return NextResponse.json({ text: (data.text || "").trim() });
  } catch {
    return NextResponse.json(
      { error: "Couldn't reach the transcription service. Check your connection and try again." },
      { status: 500 }
    );
  }
}
