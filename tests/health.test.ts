import { describe, it, expect } from "vitest";
import { GET } from "@/app/api/health/route";

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
  });
});
