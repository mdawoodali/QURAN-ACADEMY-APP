import { NextRequest, NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";

export async function GET(req: NextRequest) {
  return handleTokenRequest(req);
}

export async function POST(req: NextRequest) {
  return handleTokenRequest(req);
}

async function handleTokenRequest(req: NextRequest) {
  const url = new URL(req.url);
  let room = url.searchParams.get("room") || "classroom-demo";
  let username = url.searchParams.get("username") || "User";
  let role = url.searchParams.get("role") || "student";

  if (req.method === "POST") {
    try {
      const body = await req.json();
      if (body.room) room = body.room;
      if (body.username) username = body.username;
      if (body.role) role = body.role;
    } catch (e) {}
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || process.env.LIVEKIT_URL || "wss://quran-academy.livekit.cloud";

  // Check if live LiveKit credentials exist in environment
  if (!apiKey || !apiSecret) {
    // Generate an interoperable development room session payload
    const mockToken = `mock_token_${role}_${Buffer.from(`${room}:${username}:${Date.now()}`).toString("base64")}`;
    return NextResponse.json({
      token: mockToken,
      serverUrl: livekitUrl,
      room,
      username,
      role,
      mode: "sandbox",
      message: "LiveKit server credentials not found in .env.local. Running in WebRTC sandbox pairing mode.",
      setupInstructions: "Set LIVEKIT_API_KEY, LIVEKIT_API_SECRET, and NEXT_PUBLIC_LIVEKIT_URL in apps/web/.env.local for LiveKit Cloud pairing."
    });
  }

  try {
    const at = new AccessToken(apiKey, apiSecret, {
      identity: `${username.toLowerCase().replace(/\s+/g, "_")}_${Date.now().toString().slice(-4)}`,
      name: username,
      metadata: JSON.stringify({ role, classRoom: room })
    });

    at.addGrant({
      roomJoin: true,
      room: room,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true // Enables real-time synchronized Mushaf cursor & tajweed highlight sharing
    });

    const jwt = await at.toJwt();

    return NextResponse.json({
      token: jwt,
      serverUrl: livekitUrl,
      room,
      username,
      role,
      mode: "live",
      message: "LiveKit token generated successfully for multi-user WebRTC room."
    });
  } catch (error: any) {
    console.error("LiveKit token generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate LiveKit room token", details: error.message },
      { status: 500 }
    );
  }
}
