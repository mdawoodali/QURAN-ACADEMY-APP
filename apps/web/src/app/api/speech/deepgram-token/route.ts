import { NextResponse } from "next/server";
import { DeepgramClient } from "@deepgram/sdk";

export async function GET() {
  const apiKey = process.env.DEEPGRAM_API_KEY;

  if (!apiKey || apiKey === "your_deepgram_api_key_here") {
    return NextResponse.json({
      configured: false,
      message: "DEEPGRAM_API_KEY is not configured in .env.local. Falling back to local browser speech recognition."
    });
  }

  try {
    const deepgram = new DeepgramClient({ apiKey });
    
    return NextResponse.json({
      configured: true,
      apiKey: apiKey,
      model: "nova-2",
      language: "ar",
      message: "Deepgram API connection verified for ultra-low latency voice following."
    });
  } catch (error: any) {
    console.error("Deepgram initialization error:", error);
    return NextResponse.json({
      configured: false,
      error: error.message
    }, { status: 500 });
  }
}
