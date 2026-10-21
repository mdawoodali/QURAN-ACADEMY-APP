import { describe, it, expect, beforeEach } from "vitest";
import { 
  checkRateLimit, 
  resetRateLimitsForTesting 
} from "@/lib/security/rateLimit";
import { 
  maskStudentPii, 
  isRecordingPermitted, 
  hasScheduleCollision,
  StudentProfileData
} from "@/lib/security/childSafety";

describe("Phase 4 Security, Child Safety & Rate Limiting Test Suite", () => {
  beforeEach(() => {
    resetRateLimitsForTesting();
  });

  describe("API Rate Limiting Engine", () => {
    it("permits requests within defined threshold", () => {
      const ip = "192.168.1.10";
      const result = checkRateLimit(ip, "/api/health", 10);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(9);
      expect(result.retryAfterSeconds).toBe(0);
    });

    it("throttles excessive requests with 429 semantics and retryAfter", () => {
      const ip = "10.0.0.99";
      const limit = 5;

      for (let i = 0; i < limit; i++) {
        const res = checkRateLimit(ip, "/api/email/send", limit);
        expect(res.allowed).toBe(true);
      }

      // 6th request must be rejected
      const rejected = checkRateLimit(ip, "/api/email/send", limit);
      expect(rejected.allowed).toBe(false);
      expect(rejected.remaining).toBe(0);
      expect(rejected.retryAfterSeconds).toBeGreaterThan(0);
      expect(rejected.retryAfterSeconds).toBeLessThanOrEqual(60);
    });

    it("enforces stricter limits on sensitive token routes", () => {
      const ip = "172.16.0.5";
      // Default sensitive threshold is 15 req/min
      for (let i = 0; i < 15; i++) {
        expect(checkRateLimit(ip, "/api/livekit/token").allowed).toBe(true);
      }
      expect(checkRateLimit(ip, "/api/livekit/token").allowed).toBe(false);
    });
  });

  describe("Child Safety & COPPA PII Safeguarding", () => {
    const rawStudent: StudentProfileData = {
      id: "std_4901",
      firstName: "Hana",
      lastName: "Khan",
      age: 9,
      country: "United Kingdom",
      city: "Birmingham",
      postalCode: "B12 0TH",
      address: "42 High Street, Moseley",
      email: "parent.khan@example.co.uk",
      phoneNumber: "+44 7911 123456",
      guardianConsentRecorded: true,
    };

    it("strictly masks PII from teacher viewports", () => {
      const teacherView = maskStudentPii(rawStudent, "teacher");

      expect(teacherView.firstName).toBe("Hana");
      expect(teacherView.lastName).toBe("K.");
      expect(teacherView.age).toBe(9);
      expect(teacherView.country).toBe("United Kingdom");
      expect(teacherView.city).toBe("Birmingham");

      // Critical PII must be redacted
      expect(teacherView.phoneNumber).toBe("REDACTED_SAFEGUARDED");
      expect(teacherView.email).toBe("REDACTED_SAFEGUARDED");
      expect(teacherView.address).toBe("REDACTED_SAFEGUARDED");
      expect(teacherView.postalCode).toBe("REDACTED_SAFEGUARDED");
      expect(teacherView.isPiiMasked).toBe(true);
    });

    it("retains full profile access for authorized parents and admins", () => {
      const parentView = maskStudentPii(rawStudent, "parent");
      expect(parentView.phoneNumber).toBe("+44 7911 123456");
      expect(parentView.address).toBe("42 High Street, Moseley");
      expect(parentView.isPiiMasked).toBe(false);

      const adminView = maskStudentPii(rawStudent, "admin");
      expect(adminView.email).toBe("parent.khan@example.co.uk");
      expect(adminView.isPiiMasked).toBe(false);
    });

    it("enforces consent-gated recording policy", () => {
      expect(isRecordingPermitted(true)).toBe(true);
      expect(isRecordingPermitted(false)).toBe(false);
    });
  });

  describe("Schedule Overlap & Double-Booking Collision Prevention", () => {
    const existingSchedule = [
      { startTime: "2026-10-22T16:00:00Z", endTime: "2026-10-22T16:30:00Z" },
      { startTime: "2026-10-22T17:00:00Z", endTime: "2026-10-22T17:30:00Z" },
    ];

    it("detects exact and partial time collisions", () => {
      // Exact overlap
      expect(
        hasScheduleCollision(
          existingSchedule,
          "2026-10-22T16:00:00Z",
          "2026-10-22T16:30:00Z"
        )
      ).toBe(true);

      // Overlap beginning inside slot
      expect(
        hasScheduleCollision(
          existingSchedule,
          "2026-10-22T16:15:00Z",
          "2026-10-22T16:45:00Z"
        )
      ).toBe(true);

      // Overlap spanning entire slot
      expect(
        hasScheduleCollision(
          existingSchedule,
          "2026-10-22T15:45:00Z",
          "2026-10-22T16:45:00Z"
        )
      ).toBe(true);
    });

    it("permits non-overlapping adjacent and vacant time slots", () => {
      // Adjacent slot (starts exactly when previous ends)
      expect(
        hasScheduleCollision(
          existingSchedule,
          "2026-10-22T16:30:00Z",
          "2026-10-22T17:00:00Z"
        )
      ).toBe(false);

      // Later slot
      expect(
        hasScheduleCollision(
          existingSchedule,
          "2026-10-22T18:00:00Z",
          "2026-10-22T18:30:00Z"
        )
      ).toBe(false);
    });

    it("throws error on inverted or invalid date range", () => {
      expect(() =>
        hasScheduleCollision(
          existingSchedule,
          "2026-10-22T17:00:00Z",
          "2026-10-22T16:00:00Z"
        )
      ).toThrow("Invalid schedule range");
    });
  });
});
