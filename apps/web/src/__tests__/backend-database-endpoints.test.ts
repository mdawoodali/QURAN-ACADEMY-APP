import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { GET as getInvoices, POST as postInvoices, PATCH as patchInvoices } from "@/app/api/invoices/route";
import { GET as getEnrolments, POST as postEnrolments, PATCH as patchEnrolments } from "@/app/api/enrolments/route";
import { GET as getResources, POST as postResources, DELETE as deleteResources } from "@/app/api/resources/route";
import { GET as getPayouts, POST as postPayouts } from "@/app/api/payouts/route";
import { GET as getProgress, POST as postProgress } from "@/app/api/progress/route";
import { GET as getClassroomState, POST as postClassroomState } from "@/app/api/classroom/state/route";
import { GET as getPortalStats } from "@/app/api/portal/stats/route";

describe("Shaheen-Level Backend Database & Syncing API Suite", () => {
  describe("1. Invoices Endpoint (/api/invoices)", () => {
    it("returns clean structured invoice array with zero mock fallbacks", async () => {
      const res = await getInvoices();
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data.invoices)).toBe(true);
      expect(typeof data.count).toBe("number");
    });

    it("rejects invoice submissions lacking transaction reference or amount", async () => {
      const req = new NextRequest("http://localhost:3000/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ familyName: "Test Family" }),
      });
      const res = await postInvoices(req);
      expect(res.status).toBe(400);
    });

    it("accepts valid invoice submission and formats record", async () => {
      const req = new NextRequest("http://localhost:3000/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          familyName: "Khan Family",
          studentName: "Yusuf",
          amount: 18000,
          currency: "PKR",
          transactionRef: "RAAST-TEST-9921",
        }),
      });
      const res = await postInvoices(req);
      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.invoice.transactionRef).toBe("RAAST-TEST-9921");
    });
  });

  describe("2. Enrolments Endpoint (/api/enrolments)", () => {
    it("returns clean structured enrolment pipeline array", async () => {
      const res = await getEnrolments();
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data.enrolments)).toBe(true);
    });

    it("rejects enrolment submissions without learnerName", async () => {
      const req = new NextRequest("http://localhost:3000/api/enrolments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parentName: "Father" }),
      });
      const res = await postEnrolments(req);
      expect(res.status).toBe(400);
    });
  });

  describe("3. Academy Resources Endpoint (/api/resources)", () => {
    it("fetches uploaded documents cleanly", async () => {
      const res = await getResources();
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data.documents)).toBe(true);
    });

    it("validates document upload parameters", async () => {
      const req = new NextRequest("http://localhost:3000/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Incomplete Doc" }),
      });
      const res = await postResources(req);
      expect(res.status).toBe(400);
    });
  });

  describe("4. Teacher Payouts Endpoint (/api/payouts)", () => {
    it("returns payout ledger array", async () => {
      const req = new NextRequest("http://localhost:3000/api/payouts");
      const res = await getPayouts(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data.payouts)).toBe(true);
    });
  });

  describe("5. Student Progress Notes Endpoint (/api/progress)", () => {
    it("returns progress notes list", async () => {
      const req = new NextRequest("http://localhost:3000/api/progress?studentName=Yusuf");
      const res = await getProgress(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data.notes)).toBe(true);
    });
  });

  describe("6. Real-Time Classroom State Endpoint (/api/classroom/state)", () => {
    it("provides clean room initial state when room is new", async () => {
      const req = new NextRequest("http://localhost:3000/api/classroom/state?roomId=room_tajweed_99");
      const res = await getClassroomState(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.state.roomId).toBe("room_tajweed_99");
      expect(data.state.currentPage).toBe(1);
    });

    it("persists room state changes cleanly", async () => {
      const req = new NextRequest("http://localhost:3000/api/classroom/state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: "room_tajweed_99",
          currentPage: 4,
          currentSurah: 2,
          currentAyah: 15,
          tajweedMode: "color",
        }),
      });
      const res = await postClassroomState(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
    });
  });

  describe("7. Portal Statistics Aggregator Endpoint (/api/portal/stats)", () => {
    it("returns aggregated portal KPIs", async () => {
      const req = new NextRequest("http://localhost:3000/api/portal/stats");
      const res = await getPortalStats(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.stats).toBeDefined();
      expect(typeof data.stats.activeStudents).toBe("number");
      expect(typeof data.stats.approvedTeachers).toBe("number");
    });
  });
});
