import { describe, it, expect, vi } from "vitest";
import { ResendEmailAdapter, generateEmailContent } from "./email";
import {
  WelcomeEmailPayload,
  ClassReminderPayload,
  ReceiptConfirmationPayload,
  ClassMissedPayload,
} from "@quran/contracts";

describe("Phase 3 Resend Transactional Email Engine", () => {
  it("renders Welcome Email template correctly with Islamic branding", () => {
    const payload: WelcomeEmailPayload = {
      type: "welcome",
      to: "student@example.com",
      studentName: "Yusuf Khan",
      portalUrl: "https://quranacademyapp.vercel.app/student",
      temporaryPassword: "PIN-4921",
    };

    const { subject, html, text } = generateEmailContent(payload);
    expect(subject).toContain("Welcome to Quran Learn Academy");
    expect(html).toContain("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ");
    expect(html).toContain("Yusuf Khan");
    expect(html).toContain("PIN-4921");
    expect(text).toContain("Yusuf Khan");
  });

  it("renders Class Reminder template correctly for 30m window", () => {
    const payload: ClassReminderPayload = {
      type: "class_reminder",
      to: "parent@example.com",
      studentName: "Hana Khan",
      subject: "Tajweed Rules - Madd & Qalqalah",
      teacherName: "Sheikh Al-Qari",
      startTime: "2026-10-22T17:00:00Z",
      classroomUrl: "https://quranacademyapp.vercel.app/classroom/demo",
      reminderWindow: "30m",
    };

    const { subject, html } = generateEmailContent(payload);
    expect(subject).toContain("in 30 Minutes");
    expect(subject).toContain("Tajweed Rules");
    expect(html).toContain("Sheikh Al-Qari");
    expect(html).toContain("Hana Khan");
    expect(html).toContain("LiveKit HD 48kHz");
  });

  it("renders Receipt Confirmation template correctly with invoice details", () => {
    const payload: ReceiptConfirmationPayload = {
      type: "receipt_confirmation",
      to: "parent@example.com",
      recipientName: "Ahmed Khan",
      invoiceId: "INV-2026-9012",
      amount: "18,000",
      currency: "PKR",
      transactionRef: "RAAST-902184",
      planName: "Family Plan (3 Days/Week)",
      downloadUrl: "https://quranacademyapp.vercel.app/api/invoices/INV-2026-9012/download",
    };

    const { subject, html } = generateEmailContent(payload);
    expect(subject).toContain("INV-2026-9012");
    expect(html).toContain("Ahmed Khan");
    expect(html).toContain("PKR 18,000");
    expect(html).toContain("RAAST-902184");
    expect(html).toContain("PAID &amp; CLEARED");
    expect(html).toContain("Download PDF Invoice");
  });

  it("renders Class Missed notification correctly with reschedule link", () => {
    const payload: ClassMissedPayload = {
      type: "class_missed",
      to: "parent@example.com",
      parentName: "Ahmed Khan",
      studentName: "Yusuf Khan",
      subject: "Noorani Qaida",
      scheduledTime: "2026-10-21T16:00:00Z",
      rescheduleUrl: "https://quranacademyapp.vercel.app/parent/classes",
    };

    const { subject, html } = generateEmailContent(payload);
    expect(subject).toContain("Missed Lesson Notification");
    expect(html).toContain("Ahmed Khan");
    expect(html).toContain("Reschedule Lesson in Portal");
  });

  it("dispatches in sandbox mode safely when no API key is provided", async () => {
    const adapter = new ResendEmailAdapter();
    const result = await adapter.send({
      type: "welcome",
      to: "student@example.com",
      studentName: "Test Student",
    });

    expect(result.success).toBe(true);
    expect(result.mode).toBe("sandbox");
    expect(result.id).toMatch(/^msg_sandbox_/);
  });

  it("handles live HTTP dispatch with mocked fetch", async () => {
    const fakeFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: "msg_re_test_123" }),
    });
    vi.stubGlobal("fetch", fakeFetch);

    const adapter = new ResendEmailAdapter("re_live_valid_key_123");
    const result = await adapter.send({
      type: "welcome",
      to: "student@example.com",
      studentName: "Live Student",
    });

    expect(result.success).toBe(true);
    expect(result.id).toBe("msg_re_test_123");
    expect(result.mode).toBe("live");
    expect(fakeFetch).toHaveBeenCalledWith(
      "https://api.resend.com/emails",
      expect.objectContaining({
        method: "POST",
      })
    );

    vi.unstubAllGlobals();
  });
});
