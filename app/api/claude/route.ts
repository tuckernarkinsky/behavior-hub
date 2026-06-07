import { NextRequest, NextResponse } from "next/server";

// Allow the AI call up to 30s to finish on Vercel.
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server is missing ANTHROPIC_API_KEY. Add it to .env.local (local) and to your Vercel project settings (live)." },
        { status: 500 }
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
      return NextResponse.json(
        { error: data?.error?.message || "Anthropic API error" },
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
      { error: e instanceof Error ? e.message : "Unknown server error" },
      { status: 500 }
    );
  }
}
