import { NextRequest, NextResponse } from "next/server";

// Allow the AI call up to 30s to finish on Vercel.
export const maxDuration = 30;

function friendlyError(status: number, rawMessage: string): string {
  // Credit / quota exhausted
  if (status === 429 || rawMessage?.toLowerCase().includes("credit") || rawMessage?.toLowerCase().includes("quota") || rawMessage?.toLowerCase().includes("billing")) {
    return "AI features are temporarily unavailable. Please try again in a moment.";
  }
  // Overloaded
  if (status === 529 || rawMessage?.toLowerCase().includes("overloaded")) {
    return "The AI is busy right now. Wait a few seconds and tap Retry.";
  }
  // Auth / key issues — never show raw key errors to users
  if (status === 401 || status === 403) {
    return "AI features are temporarily unavailable. Please try again later.";
  }
  // Generic server error
  if (status >= 500) {
    return "Something went wrong on our end. Tap Retry — it usually clears up quickly.";
  }
  return "Couldn't complete the AI request. Tap Retry to try again.";
}

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      // Never expose missing-key details to end users
      return NextResponse.json(
        { error: "AI features are temporarily unavailable. Please try again later." },
        { status: 503 }
      );
    }

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1200,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      const raw = data?.error?.message ?? "";
      return NextResponse.json(
        { error: `DEBUG [${res.status}]: ${raw || JSON.stringify(data)}` },
        { status: res.status }
      );
    }

    const text = (data.content || [])
      .filter((i: { type: string }) => i.type === "text")
      .map((i: { text: string }) => i.text)
      .join("");

    return NextResponse.json({ text });
  } catch (e) {
    return NextResponse.json(
      { error: "Couldn't reach the AI. Check your connection and tap Retry." },
      { status: 500 }
    );
  }
}
