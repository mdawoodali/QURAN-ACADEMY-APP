import { describe, it, expect } from "vitest";
import { GET } from "@/app/api/health/route";
import { GET as getDeepgramToken } from "@/app/api/speech/deepgram-token/route";

describe("Health API Route", () => {
  it("returns 200 OK with runtime diagnostics, uptime, and services map", async () => {
    const res = await GET();
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.status).toBe("ok");
    expect(body.timestamp).toBeDefined();
    expect(body.system).toBeDefined();
    expect(body.system.memory.heapUsedMb).toBeGreaterThan(0);
    expect(body.services.livekit).toBeDefined();
    expect(body.services.deepgram).toBeDefined();
  });

  it("verifies Deepgram speech token endpoint successfully with configured API key", async () => {
    process.env.DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY || "mock-test-key";
    const res = await getDeepgramToken();
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.configured).toBe(true);
    expect(body.model).toBe("nova-3");
    expect(body.language).toBe("ar");
  });
});

