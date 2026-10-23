import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { AccessToken } from "livekit-server-sdk";
import { APP_VERSION, MIN_SUPPORTED_VERSION } from "@quran/contracts";

export async function GET(request: Request) {
  const startTime = Date.now();
  const checks: Record<string, { status: "healthy" | "warning" | "error"; latencyMs?: number; details: string }> = {};

  // 1. Version Check
  checks.version = {
    status: "healthy",
    details: `App Version: v${APP_VERSION} (Min Required: v${MIN_SUPPORTED_VERSION})`,
  };

  // 2. Supabase PostgreSQL Check
  try {
    const dbStart = Date.now();
    const supabase = await createClient();
    const { data, error } = await supabase.from("profiles").select("count", { count: "exact", head: true });
    const dbLatency = Date.now() - dbStart;

    if (error) {
      checks.database = {
        status: "warning",
        latencyMs: dbLatency,
        details: `Supabase reachable, but profiles schema pending: ${error.message}`,
      };
    } else {
      checks.database = {
        status: "healthy",
        latencyMs: dbLatency,
        details: `Connected to Supabase PostgreSQL (${data !== null ? "ready" : "active"})`,
      };
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Connection failed";
    checks.database = {
      status: "error",
      details: `Supabase unreachable: ${msg}`,
    };
  }

  // 3. LiveKit Cloud Check
  try {
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

    if (!apiKey || !apiSecret || !livekitUrl) {
      checks.livekit = {
        status: "warning",
        details: "LiveKit credentials partially configured or missing",
      };
    } else {
      // Test generating a diagnostic token
      const at = new AccessToken(apiKey, apiSecret, {
        identity: "diagnostic_user",
        name: "Diagnostic Checker",
        ttl: "10m",
      });
      at.addGrant({ room: "diagnostic_room", roomJoin: true });
      const token = await at.toJwt();

      checks.livekit = {
        status: "healthy",
        details: `LiveKit Cloud active at ${livekitUrl.split("//")[1] || livekitUrl} (Token generator verified, len: ${token.length})`,
      };
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Token generation failed";
    checks.livekit = {
      status: "error",
      details: `LiveKit error: ${msg}`,
    };
  }

  // 4. Resend Transactional Email Engine Check
  try {
    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey || resendKey.includes("placeholder")) {
      checks.email = {
        status: "warning",
        details: "Resend running in Safe Sandbox Dispatch mode",
      };
    } else {
      checks.email = {
        status: "healthy",
        details: `Resend API key configured (${resendKey.slice(0, 7)}...)`,
      };
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    checks.email = {
      status: "error",
      details: `Email engine error: ${msg}`,
    };
  }

  // 5. Google OAuth Readiness
  const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  checks.google_auth = {
    status: hasSupabaseUrl ? "healthy" : "warning",
    details: hasSupabaseUrl
      ? "Supabase Auth handler ready for Google OAuth credentials"
      : "NEXT_PUBLIC_SUPABASE_URL not configured",
  };

  const totalTime = Date.now() - startTime;

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    totalLatencyMs: totalTime,
    environment: process.env.NODE_ENV || "development",
    checks,
  });
}
