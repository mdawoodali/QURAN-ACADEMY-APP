import { describe, it, expect } from "vitest";
import { getPaymentProvider } from "@quran/adapters";
import { POST as sendEmailRoute } from "@/app/api/email/send/route";
import { GET as downloadInvoiceRoute } from "@/app/api/invoices/[id]/download/route";

describe("Phase 3 Payments, Invoicing & Resend Messaging Engine", () => {
  it("generates multi-currency direct invoices without Stripe", async () => {
    const provider = getPaymentProvider();
    const checkout = await provider.createCheckout(
      18000,
      "PKR",
      "https://quranacademyapp.vercel.app/parent/billing",
      "https://quranacademyapp.vercel.app/packages",
      { studentId: "std_yusuf_khan" }
    );

    expect(checkout.id).toMatch(/^inv_\d+_std_yusuf_khan$/);
    expect(checkout.url).toContain("invoice_id=");
  });

  it("dispatches transactional email via API endpoint safely", async () => {
    const req = new Request("http://localhost:3000/api/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "welcome",
        to: "parent@example.com",
        studentName: "Yusuf Khan",
        portalUrl: "https://quranacademyapp.vercel.app/student",
      }),
    });

    const res = await sendEmailRoute(req as any);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.id).toBeDefined();
    expect(data.recipient).toBe("parent@example.com");
  });

  it("rejects invalid transactional email payloads with 400 Bad Request", async () => {
    const req = new Request("http://localhost:3000/api/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "welcome",
        to: "not-an-email-address",
        studentName: "Test Student",
      }),
    });

    const res = await sendEmailRoute(req as any);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toBe("Invalid email payload");
  });

  it("generates official downloadable PDF tax invoices via @react-pdf/renderer", async () => {
    const req = new Request(
      "http://localhost:3000/api/invoices/INV-2026-TEST/download?amount=65.00&currency=GBP&student=Yusuf+Khan&parent=Ahmed+Khan&ref=BARC-FPS-8921"
    );

    const res = await downloadInvoiceRoute(req as any, {
      params: Promise.resolve({ id: "INV-2026-TEST" }),
    });

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("application/pdf");
    expect(res.headers.get("Content-Disposition")).toContain('filename="Invoice-INV-2026-TEST.pdf"');
  });
});
