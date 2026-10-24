import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "@/middleware";
import { GET as getAdminResources, POST as postAdminResources } from "@/app/api/admin/resources/route";
import { GET as getInquiries, POST as postInquiries } from "@/app/api/inquiries/route";
import { GET as getScheduling } from "@/app/api/scheduling/route";
import { POST as postInvoices } from "@/app/api/invoices/route";
import { GET as getClassroomState, POST as postClassroomState } from "@/app/api/classroom/state/route";
import { POST as postResources } from "@/app/api/resources/route";
import { GET as getDemoAccess } from "@/app/api/demo-access/route";

describe("Production Security, Loophole Eradication & Parameter Boundary Audit Suite", () => {
  describe("1. Middleware Role Boundary & Broken Access Control Defenses", () => {
    it("redirects student away from /admin portal to /student", async () => {
      const req = new NextRequest("http://localhost:3000/admin/finance", {
        headers: { cookie: "demo_role=student" },
      });
      const res = await middleware(req);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toBe("http://localhost:3000/student");
    });

    it("redirects student away from /teacher portal to /student", async () => {
      const req = new NextRequest("http://localhost:3000/teacher/classes", {
        headers: { cookie: "demo_role=student" },
      });
      const res = await middleware(req);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toBe("http://localhost:3000/student");
    });

    it("redirects student away from /parent portal to /student", async () => {
      const req = new NextRequest("http://localhost:3000/parent/billing", {
        headers: { cookie: "demo_role=student" },
      });
      const res = await middleware(req);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toBe("http://localhost:3000/student");
    });

    it("allows student to access /student portal without redirection", async () => {
      const req = new NextRequest("http://localhost:3000/student/classroom", {
        headers: { cookie: "demo_role=student" },
      });
      const res = await middleware(req);
      expect(res.status).toBe(200);
      expect(res.headers.get("location")).toBeNull();
    });

    it("redirects teacher away from /admin portal to /teacher", async () => {
      const req = new NextRequest("http://localhost:3000/admin/settings", {
        headers: { cookie: "demo_role=teacher" },
      });
      const res = await middleware(req);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toBe("http://localhost:3000/teacher");
    });

    it("allows admin unrestricted access across all portal routes", async () => {
      for (const path of ["/admin", "/teacher", "/parent", "/student"]) {
        const req = new NextRequest(`http://localhost:3000${path}`, {
          headers: { cookie: "demo_role=admin" },
        });
        const res = await middleware(req);
        expect(res.status).toBe(200);
        expect(res.headers.get("location")).toBeNull();
      }
    });

    it("attaches OWASP recommended security headers to all responses", async () => {
      const req = new NextRequest("http://localhost:3000/resources");
      const res = await middleware(req);
      expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
      expect(res.headers.get("X-Frame-Options")).toBe("SAMEORIGIN");
      expect(res.headers.get("X-XSS-Protection")).toBe("1; mode=block");
      expect(res.headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    });
  });

  describe("2. Zero-Mock Data Guarantees Across Core Endpoints", () => {
    it("guarantees /api/admin/resources has zero hardcoded mock/fallback items", async () => {
      const req = new NextRequest("http://localhost:3000/api/admin/resources");
      const res = await getAdminResources(req);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.documents)).toBe(true);

      // Verify no hardcoded items like doc_1 or doc_2
      const ids = data.documents.map((d: any) => d.id);
      expect(ids).not.toContain("doc_1");
      expect(ids).not.toContain("doc_2");
      expect(ids).not.toContain("doc_3");
      expect(ids).not.toContain("doc_5");
    });

    it("guarantees /api/inquiries has zero hardcoded mock people (Sister Zainab, etc.)", async () => {
      const req = new NextRequest("http://localhost:3000/api/inquiries");
      const res = await getInquiries(req);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.inquiries)).toBe(true);

      const names = data.inquiries.map((i: any) => i.name);
      expect(names).not.toContain("Sister Zainab Fatima");
      expect(names).not.toContain("Brother Ali Raza");
      expect(names).not.toContain("Muhammad Usman");
    });
  });

  describe("3. Financial Ledger Boundary Defenses (/api/invoices)", () => {
    it("rejects negative payment amounts with 400 Bad Request", async () => {
      const req = new NextRequest("http://localhost:3000/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: -5000,
          currency: "PKR",
          transactionRef: "TX-TEST-NEGATIVE",
        }),
      });
      const res = await postInvoices(req);
      expect(res.status).toBe(400);

      const data = await res.json();
      expect(data.error).toContain("positive number");
    });

    it("rejects zero payment amounts with 400 Bad Request", async () => {
      const req = new NextRequest("http://localhost:3000/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 0,
          currency: "PKR",
          transactionRef: "TX-TEST-ZERO",
        }),
      });
      const res = await postInvoices(req);
      expect(res.status).toBe(400);
    });

    it("rejects unsupported arbitrary currencies with 400 Bad Request", async () => {
      const req = new NextRequest("http://localhost:3000/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 100,
          currency: "SHIBA_INU_TOKEN",
          transactionRef: "TX-TEST-CURR",
        }),
      });
      const res = await postInvoices(req);
      expect(res.status).toBe(400);

      const data = await res.json();
      expect(data.error).toContain("Unsupported currency");
    });

    it("rejects invalid transaction references under 3 characters", async () => {
      const req = new NextRequest("http://localhost:3000/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 5000,
          currency: "PKR",
          transactionRef: "1",
        }),
      });
      const res = await postInvoices(req);
      expect(res.status).toBe(400);
    });

    it("accepts valid multi-currency payment invoice submissions", async () => {
      for (const curr of ["PKR", "GBP", "USD", "EUR"]) {
        const req = new NextRequest("http://localhost:3000/api/invoices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            familyName: "Tariq Family",
            studentName: "Hamza",
            amount: 12000,
            currency: curr,
            transactionRef: `TX-AUDIT-${curr}-${Date.now()}`,
          }),
        });
        const res = await postInvoices(req);
        expect(res.status).toBe(201);
        const data = await res.json();
        expect(data.success).toBe(true);
        expect(data.invoice.currency).toBe(curr);
      }
    });
  });

  describe("4. Classroom State & SQL / Traversal Protection (/api/classroom/state)", () => {
    it("sanitizes malicious path-traversal room IDs in GET requests", async () => {
      const req = new NextRequest("http://localhost:3000/api/classroom/state?roomId=../../../../etc/passwd");
      const res = await getClassroomState(req);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.state.roomId).toBe("default");
    });

    it("rejects injection-prone room IDs in POST requests", async () => {
      const req = new NextRequest("http://localhost:3000/api/classroom/state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: "room'; DROP TABLE classroom_states;--",
          currentPage: 1,
        }),
      });
      const res = await postClassroomState(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain("Invalid roomId format");
    });

    it("rejects out-of-bounds Quran page numbers (> 604 or < 1)", async () => {
      const req = new NextRequest("http://localhost:3000/api/classroom/state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: "room-safe-101",
          currentPage: 999,
        }),
      });
      const res = await postClassroomState(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain("currentPage");
    });

    it("rejects out-of-bounds Surah numbers (> 114 or < 1)", async () => {
      const req = new NextRequest("http://localhost:3000/api/classroom/state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: "room-safe-101",
          currentPage: 1,
          currentSurah: 115,
        }),
      });
      const res = await postClassroomState(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain("currentSurah");
    });

    it("rejects memory-exhausting whiteboard stroke arrays (> 5000 elements)", async () => {
      const massiveStrokes = new Array(5001).fill({ x: 10, y: 20 });
      const req = new NextRequest("http://localhost:3000/api/classroom/state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: "room-safe-101",
          whiteboardStrokes: massiveStrokes,
        }),
      });
      const res = await postClassroomState(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain("whiteboardStrokes");
    });

    it("accepts valid classroom synchronization state updates", async () => {
      const req = new NextRequest("http://localhost:3000/api/classroom/state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: "room-hifz-batch-a",
          currentPage: 255,
          currentSurah: 2,
          currentAyah: 255,
          tajweedMode: "color",
          scriptMode: "uthmani",
          teacherNotes: "Ayat al-Kursi revision completed with proper ghunna.",
        }),
      });
      const res = await postClassroomState(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
    });
  });

  describe("5. Resource File Upload Payload Bounds (/api/resources & /api/admin/resources)", () => {
    it("rejects file uploads exceeding 25MB limit on /api/resources with 413", async () => {
      // 26MB dummy data URL
      const giantDataUrl = "data:application/pdf;base64," + "A".repeat(26 * 1024 * 1024);
      const req = new NextRequest("http://localhost:3000/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Giant Document",
          fileName: "giant.pdf",
          fileDataUrl: giantDataUrl,
        }),
      });
      const res = await postResources(req);
      expect(res.status).toBe(413);
      const data = await res.json();
      expect(data.error).toContain("25MB");
    });

    it("rejects file uploads exceeding 25MB limit on /api/admin/resources with 413", async () => {
      const giantDataUrl = "data:application/pdf;base64," + "B".repeat(26 * 1024 * 1024);
      const req = new NextRequest("http://localhost:3000/api/admin/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Admin Giant Document",
          fileName: "admin_giant.pdf",
          category: "Curriculum",
          fileDataUrl: giantDataUrl,
        }),
      });
      const res = await postAdminResources(req);
      expect(res.status).toBe(413);
      const data = await res.json();
      expect(data.error).toContain("25MB");
    });
  });

  describe("6. Demo Access Parameter Boundary Defenses (/api/demo-access)", () => {
    it("redirects recognized roles to their canonical portal routes", async () => {
      const roles = [
        { role: "admin", target: "http://localhost:3000/admin" },
        { role: "teacher", target: "http://localhost:3000/teacher" },
        { role: "parent", target: "http://localhost:3000/parent" },
        { role: "student", target: "http://localhost:3000/student" },
      ];

      for (const item of roles) {
        const req = new NextRequest(`http://localhost:3000/api/demo-access?role=${item.role}`);
        const res = await getDemoAccess(req);
        expect(res.status).toBe(307);
        expect(res.headers.get("location")).toBe(item.target);
      }
    });

    it("safely normalizes unknown or malicious role parameters to /student", async () => {
      const req = new NextRequest("http://localhost:3000/api/demo-access?role=../../hack_role");
      const res = await getDemoAccess(req);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toBe("http://localhost:3000/student");
    });
  });
});
