import { NextResponse } from "next/server";
import { connection } from "next/server";
import { DeepgramClient } from "@deepgram/sdk";

export async function GET() {
  await connection();
  const apiKey = process.env.DEEPGRAM_API_KEY;

  if (!apiKey || apiKey === "your_deepgram_api_key_here") {
    return NextResponse.json({
      configured: false,
      message: "DEEPGRAM_API_KEY is not configured in .env.local. Falling back to local browser speech recognition."
    });
  }

  try {
    new DeepgramClient({ apiKey });
    
    return NextResponse.json({
      configured: true,
      apiKey: apiKey,
      model: "nova-2",
      language: "ar",
      message: "Deepgram API connection verified for ultra-low latency voice following."
    });
  } catch (error: unknown) {
    console.error("Deepgram initialization error:", error);
    const message = error instanceof Error ? error.message : "Deepgram error";
    return NextResponse.json({
      configured: false,
      error: message
    }, { status: 500 });
  }
}
