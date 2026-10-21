import { NextResponse } from "next/server";
import { connection } from "next/server";

export async function GET() {
  try {
    await connection();
  } catch {
    // Gracefully handle unit test environments outside Next.js request context
  }

  const startTime = Date.now();
  const mem = process.memoryUsage();

  const services = {
    supabase: {
      status: process.env.NEXT_PUBLIC_SUPABASE_URL ? "configured" : "unconfigured",
      url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "present" : "missing"
    },
    livekit: {
      status:
        process.env.LIVEKIT_API_KEY && process.env.LIVEKIT_API_SECRET
          ? "configured"
          : "sandbox"
    },
    deepgram: {
      status: process.env.DEEPGRAM_API_KEY ? "configured" : "unconfigured"
    }
  };

  const responseTimeMs = Date.now() - startTime;

  return NextResponse.json(
    {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || "development",
      responseTimeMs,
      services,
      system: {
        nodeVersion: process.version,
        memory: {
          heapUsedMb: Math.round(mem.heapUsed / 1024 / 1024),
          heapTotalMb: Math.round(mem.heapTotal / 1024 / 1024),
          rssMb: Math.round(mem.rss / 1024 / 1024)
        }
      }
    },
    { status: 200 }
  );
}
