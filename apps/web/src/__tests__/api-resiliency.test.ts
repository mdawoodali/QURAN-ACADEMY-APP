import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { GET as getLivekitToken, POST as postLivekitToken } from "@/app/api/livekit/token/route";
import { GET as getDeepgramToken } from "@/app/api/speech/deepgram-token/route";
import { GET as getScheduling, POST as postScheduling } from "@/app/api/scheduling/route";
import { POST as sendEmail } from "@/app/api/email/send/route";
import { GET as demoAccess } from "@/app/api/demo-access/route";
import { GET as downloadInvoice } from "@/app/api/invoices/[id]/download/route";
import { GET as downloadReport } from "@/app/api/reports/download/route";

describe("API Endpoint Resiliency & Parameter Boundary Verification Suite", () => {
  const origEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...origEnv };
  });

  afterEach(() => {
    process.env = origEnv;
  });

  describe("1. LiveKit Token Minting Endpoint (/api/livekit/token)", () => {
    it("handles GET requests in sandbox mode gracefully when credentials are absent", async () => {
      delete process.env.LIVEKIT_API_KEY;
      delete process.env.LIVEKIT_API_SECRET;

      const req = new NextRequest("http://localhost:3000/api/livekit/token?room=hifz-room-101&username=Hamza&role=student");
      const res = await getLivekitToken(req);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.mode).toBe("sandbox");
      expect(data.room).toBe("hifz-room-101");
      expect(data.username).toBe("Hamza");
      expect(data.role).toBe("student");
      expect(data.token).toContain("mock_token_student_");
    });

    it("handles POST requests with JSON payload in sandbox mode", async () => {
      delete process.env.LIVEKIT_API_KEY;
      delete process.env.LIVEKIT_API_SECRET;

      const req = new NextRequest("http://localhost:3000/api/livekit/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room: "tajweed-room-202",
          username: "Ustadha Maryam",
          role: "teacher",
        }),
      });

      const res = await postLivekitToken(req);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.mode).toBe("sandbox");
      expect(data.room).toBe("tajweed-room-202");
      expect(data.username).toBe("Ustadha Maryam");
      expect(data.role).toBe("teacher");
      expect(data.token).toContain("mock_token_teacher_");
    });

    it("generates signed LiveKit JWT token when API credentials are provided", async () => {
      process.env.LIVEKIT_API_KEY = "API_TEST_KEY_12345";
      process.env.LIVEKIT_API_SECRET = "SECRET_TEST_KEY_987654321012345678901234567890";

      const req = new NextRequest("http://localhost:3000/api/livekit/token?room=live-session-303&username=Zaid&role=student");
      const res = await getLivekitToken(req);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.mode).toBe("live");
      expect(data.room).toBe("live-session-303");
      expect(data.token).toBeDefined();
      expect(typeof data.token).toBe("string");
      expect(data.token.split(".").length).toBe(3); // Valid JWT structure (header.payload.signature)
    });
  });

  describe("2. Deepgram Speech-to-Text Token Endpoint (/api/speech/deepgram-token)", () => {
    it("reports unconfigured fallback when DEEPGRAM_API_KEY is missing", async () => {
      delete process.env.DEEPGRAM_API_KEY;

      const res = await getDeepgramToken();
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.configured).toBe(false);
      expect(data.message).toContain("Falling back to local browser speech recognition");
    });

    it("reports configured state and Arabic model when key is present", async () => {
      process.env.DEEPGRAM_API_KEY = "mock_valid_deepgram_key";

      const res = await getDeepgramToken();
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.configured).toBe(true);
      expect(data.model).toBe("nova-3");
      expect(data.language).toBe("ar");
    });
  });

  describe("3. Scheduling & Calendar API Endpoint (/api/scheduling)", () => {
    it("retrieves current recurring schedules and teacher assignments", async () => {
      const res = await getScheduling();
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(Array.isArray(data.schedules)).toBe(true);
      expect(Array.isArray(data.assignments)).toBe(true);
      expect(data.schedules.length).toBeGreaterThan(0);
      expect(data.assignments.length).toBeGreaterThan(0);

      const firstSchedule = data.schedules[0];
      expect(firstSchedule).toHaveProperty("dayOfWeek");
      expect(firstSchedule).toHaveProperty("startTimeLocal");
      expect(firstSchedule).toHaveProperty("teacherName");
      expect(firstSchedule).toHaveProperty("studentName");
    });

    it("registers new schedule slots via POST successfully", async () => {
      const req = new Request("http://localhost:3000/api/scheduling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherId: "t1",
          teacherName: "Ustadha Maryam",
          studentName: "Ibrahim Noor",
          dayOfWeek: "Thursday",
          startTimeLocal: "18:00",
          durationMinutes: 30,
          subject: "Noorani Qaida",
        }),
      });

      const res = await postScheduling(req);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.schedule.studentName).toBe("Ibrahim Noor");
      expect(data.schedule.dayOfWeek).toBe("Thursday");
      expect(data.schedule.startTimeLocal).toBe("18:00");
    });

    it("handles malformed JSON body in POST gracefully with 500 error response", async () => {
      const req = new Request("http://localhost:3000/api/scheduling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{malformed_json",
      });

      const res = await postScheduling(req);
      expect(res.status).toBe(500);

      const data = await res.json();
      expect(data.error).toBeDefined();
    });
  });

  describe("4. Transactional Email API Endpoint (/api/email/send)", () => {
    it("dispatches valid welcome email contract payload", async () => {
      const req = new NextRequest("http://localhost:3000/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "welcome",
          to: "student@example.org",
          studentName: "Bilal Tariq",
          portalUrl: "https://quranacademyapp.vercel.app/student",
        }),
      });

      const res = await sendEmail(req);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.recipient).toBe("student@example.org");
      expect(data.type).toBe("welcome");
    });

    it("dispatches valid class reminder email payload", async () => {
      const req = new NextRequest("http://localhost:3000/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "class_reminder",
          to: "parent@example.co.uk",
          studentName: "Sara Khan",
          subject: "Tajweed & Recitation",
          teacherName: "Sheikh Al-Qari",
          startTime: "2026-10-25T17:00:00Z",
          classroomUrl: "https://quranacademyapp.vercel.app/classroom/demo",
          reminderWindow: "30m",
        }),
      });

      const res = await sendEmail(req);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.type).toBe("class_reminder");
    });

    it("dispatches valid receipt confirmation email payload", async () => {
      const req = new NextRequest("http://localhost:3000/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "receipt_confirmation",
          to: "guardian@example.com",
          recipientName: "Rashid Mahmood",
          invoiceId: "INV-2026-9901",
          amount: "85.00",
          currency: "USD",
          transactionRef: "ZELLE-CONF-881923",
          planName: "5 Days/Week Intensive",
        }),
      });

      const res = await sendEmail(req);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.type).toBe("receipt_confirmation");
    });

    it("strictly rejects malformed payloads and invalid types with 400 Bad Request", async () => {
      const req = new NextRequest("http://localhost:3000/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "unsupported_email_type",
          to: "test@example.com",
        }),
      });

      const res = await sendEmail(req);
      expect(res.status).toBe(400);

      const data = await res.json();
      expect(data.error).toBe("Invalid email payload");
    });
  });

  describe("5. Demo Fast-Track Access Redirection Endpoint (/api/demo-access)", () => {
    it.each([
      ["admin", "/admin", "Super Admin"],
      ["teacher", "/teacher", "Maryam Ahmed (Teacher)"],
      ["parent", "/parent", "Family Guardian"],
      ["student", "/student", "Demo Student"],
    ])("redirects %s to %s and sets demo cookies", async (role, expectedPath, expectedUser) => {
      const req = new NextRequest(`http://localhost:3000/api/demo-access?role=${role}`);
      const res = await demoAccess(req);

      expect(res.status).toBe(307); // NextResponse.redirect default status
      const location = res.headers.get("location");
      expect(location).toContain(expectedPath);

      // Verify demo session cookies
      const setCookies = res.headers.getSetCookie();
      expect(setCookies.some((c) => c.includes(`demo_role=${role}`))).toBe(true);
      expect(setCookies.some((c) => c.includes(`demo_user=${encodeURIComponent(expectedUser)}` || c.includes(expectedUser)))).toBe(true);
    });
  });

  describe("6. PDF Document Generation Endpoints (/api/invoices and /api/reports)", () => {
    it("generates an official stamped invoice PDF stream with appropriate headers", async () => {
      const req = new NextRequest(
        "http://localhost:3000/api/invoices/INV-2026-QA-TEST/download?amount=65.00&currency=GBP&student=Yusuf+Khan&parent=Ahmed+Khan&ref=FPS-9901&plan=Standard+Plan"
      );
      const params = Promise.resolve({ id: "INV-2026-QA-TEST" });

      const res = await downloadInvoice(req, { params });
      expect(res.status).toBe(200);
      expect(res.headers.get("Content-Type")).toBe("application/pdf");
      expect(res.headers.get("Content-Disposition")).toContain('attachment; filename="Invoice-INV-2026-QA-TEST.pdf"');
    });

    it("generates an official student monthly progress report PDF stream", async () => {
      const res = await downloadReport();
      expect(res.status).toBe(200);
      expect(res.headers.get("Content-Type")).toBe("application/pdf");
      expect(res.headers.get("Content-Disposition")).toContain('attachment; filename="student-report.pdf"');
    });
  });
});
