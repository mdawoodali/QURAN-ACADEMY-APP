import {
  TransactionalEmail,
  WelcomeEmailPayload,
  ClassReminderPayload,
  ReceiptConfirmationPayload,
  ClassMissedPayload,
} from "@quran/contracts";

export interface EmailSendResult {
  success: boolean;
  id: string;
  error?: string;
  mode: "live" | "sandbox";
}

export interface EmailService {
  send(payload: TransactionalEmail): Promise<EmailSendResult>;
}

/**
 * High-aesthetic responsive HTML email styling for Quran Learn Academy
 */
const BRAND_HEADER = `
  <div style="background: linear-gradient(135deg, #031d16 0%, #052b20 100%); padding: 32px 24px; text-align: center; border-radius: 16px 16px 0 0; border-bottom: 2px solid #f59e0b;">
    <div style="font-family: 'Amiri', serif, Georgia; font-size: 22px; color: #fbbf24; margin-bottom: 8px; direction: rtl;">
      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
    </div>
    <div style="font-family: Georgia, serif; font-size: 24px; font-weight: bold; color: #ffffff; letter-spacing: 0.5px;">
      Quran <span style="color: #f59e0b;">Learn Academy</span>
    </div>
    <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #6ee7b7; margin-top: 4px;">
      Excellence in Shia Quranic &amp; Tajweed Pedagogy
    </div>
  </div>
`;

const BRAND_FOOTER = `
  <div style="background: #02140e; padding: 24px; text-align: center; border-radius: 0 0 16px 16px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 11px; color: #94a3b8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6;">
    <div style="color: #cbd5e1; font-weight: 600; margin-bottom: 6px;">
      Quran Learn Academy Global Support Desk
    </div>
    <div>Incorporation NTN: PK-8291048-Q • UK Registry: 849201</div>
    <div style="margin-top: 6px;">WhatsApp Support: +44 20 3289 9880 • Email: admissions@quranlearnacademy.com</div>
    <div style="margin-top: 10px; color: #64748b; font-size: 10px;">
      You received this transactional service notification regarding your enrolled family account.
    </div>
  </div>
`;

function wrapTemplate(title: string, bodyContent: string): { subject: string; html: string; text: string } {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #01140e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background: #052b20; border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); overflow: hidden;">
    ${BRAND_HEADER}
    <div style="padding: 32px 28px; color: #f1f5f9; font-size: 14px; line-height: 1.7;">
      ${bodyContent}
    </div>
    ${BRAND_FOOTER}
  </div>
</body>
</html>
`;
  return { subject: title, html, text: bodyContent.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() };
}

export function generateEmailContent(payload: TransactionalEmail): { subject: string; html: string; text: string } {
  switch (payload.type) {
    case "welcome": {
      const p = payload as WelcomeEmailPayload;
      const title = `Welcome to Quran Learn Academy — Your Journey Begins`;
      const body = `
        <h2 style="color: #ffffff; font-family: Georgia, serif; font-size: 20px; margin-top: 0;">
          Assalamu Alaykum, <span style="color: #fbbf24;">${p.studentName}</span>!
        </h2>
        <p>
          Welcome to the Quran Learn Academy family. Your registration has been accepted, and your dedicated 1-on-1 tutor has been assigned.
        </p>
        <div style="background: rgba(0, 0, 0, 0.35); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 12px; padding: 20px; margin: 24px 0;">
          <div style="font-size: 12px; font-weight: bold; color: #fbbf24; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
            Enrolment Credentials &amp; Portal
          </div>
          <div style="margin-bottom: 6px;"><strong>Student Name:</strong> ${p.studentName}</div>
          <div style="margin-bottom: 6px;"><strong>Assigned Portal:</strong> Student &amp; Parent Dashboard</div>
          ${p.temporaryPassword ? `<div style="margin-bottom: 6px;"><strong>Temporary Access Pin:</strong> <span style="font-family: monospace; background: #01140e; padding: 2px 6px; border-radius: 4px; color: #34d399;">${p.temporaryPassword}</span></div>` : ""}
          <div style="font-size: 12px; color: #94a3b8; margin-top: 10px;">Please test your microphone and camera before your first session using our built-in hardware diagnostics modal.</div>
        </div>
        <div style="text-align: center; margin: 32px 0 16px;">
          <a href="${p.portalUrl}" style="background: #f59e0b; color: #022c22; font-weight: bold; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-size: 14px; display: inline-block; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);">
            Enter Student Portal &rarr;
          </a>
        </div>
      `;
      return wrapTemplate(title, body);
    }

    case "class_reminder": {
      const p = payload as ClassReminderPayload;
      const windowStr = p.reminderWindow === "24h" ? "Tomorrow" : "in 30 Minutes";
      const title = `Class Reminder: ${p.subject} starting ${windowStr}`;
      const body = `
        <h2 style="color: #ffffff; font-family: Georgia, serif; font-size: 20px; margin-top: 0;">
          Reminder for <span style="color: #fbbf24;">${p.studentName}</span>
        </h2>
        <p>
          Your upcoming 1-on-1 Quran lesson with <strong>${p.teacherName}</strong> is scheduled to commence <strong>${windowStr}</strong>.
        </p>
        <div style="background: rgba(0, 0, 0, 0.35); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 20px; margin: 24px 0;">
          <div style="margin-bottom: 6px;"><strong>Lesson Topic:</strong> ${p.subject}</div>
          <div style="margin-bottom: 6px;"><strong>Teacher:</strong> ${p.teacherName}</div>
          <div style="margin-bottom: 6px;"><strong>Scheduled Time:</strong> ${new Date(p.startTime).toUTCString()}</div>
          <div style="font-size: 12px; color: #34d399; margin-top: 10px;">
            &bull; LiveKit HD 48kHz audio &amp; interactive Tajweed sync will be live.
          </div>
        </div>
        <div style="text-align: center; margin: 32px 0 16px;">
          <a href="${p.classroomUrl}" style="background: #10b981; color: #ffffff; font-weight: bold; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-size: 14px; display: inline-block; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);">
            Join Classroom Now &rarr;
          </a>
        </div>
      `;
      return wrapTemplate(title, body);
    }

    case "receipt_confirmation": {
      const p = payload as ReceiptConfirmationPayload;
      const title = `Official Receipt & Payment Cleared: Invoice #${p.invoiceId}`;
      const body = `
        <h2 style="color: #ffffff; font-family: Georgia, serif; font-size: 20px; margin-top: 0;">
          Payment Verified, <span style="color: #fbbf24;">${p.recipientName}</span>
        </h2>
        <p>
          Alhamdulillah! Your tuition settlement has been reviewed and cleared by our Accounts department. Your schedule is active with zero interruption.
        </p>
        <div style="background: rgba(0, 0, 0, 0.35); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 12px; padding: 20px; margin: 24px 0;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span><strong>Invoice Number:</strong></span>
            <span style="font-family: monospace; color: #fbbf24;">${p.invoiceId}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span><strong>Package Enrolled:</strong></span>
            <span>${p.planName}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span><strong>Amount Paid:</strong></span>
            <span style="font-weight: bold; color: #34d399;">${p.currency} ${p.amount}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span><strong>Bank Reference / UTR:</strong></span>
            <span style="font-family: monospace;">${p.transactionRef}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span><strong>Status:</strong></span>
            <span style="color: #34d399; font-weight: bold;">PAID &amp; CLEARED</span>
          </div>
        </div>
        <p style="font-size: 13px; color: #cbd5e1;">
          You can download your official tax invoice and PDF receipt anytime directly from your Parent Billing hub.
        </p>
        ${
          p.downloadUrl
            ? `
          <div style="text-align: center; margin: 28px 0 16px;">
            <a href="${p.downloadUrl}" style="background: #f59e0b; color: #022c22; font-weight: bold; padding: 12px 24px; text-decoration: none; border-radius: 30px; font-size: 13px; display: inline-block;">
              Download PDF Invoice &darr;
            </a>
          </div>
        `
            : ""
        }
      `;
      return wrapTemplate(title, body);
    }

    case "class_missed": {
      const p = payload as ClassMissedPayload;
      const title = `Missed Lesson Notification: ${p.studentName} (${p.subject})`;
      const body = `
        <h2 style="color: #ffffff; font-family: Georgia, serif; font-size: 20px; margin-top: 0;">
          Assalamu Alaykum, <span style="color: #fbbf24;">${p.parentName}</span>
        </h2>
        <p>
          We noticed that <strong>${p.studentName}</strong> was unable to attend today's scheduled 1-on-1 Quran lesson for <strong>${p.subject}</strong> at ${new Date(p.scheduledTime).toUTCString()}.
        </p>
        <p>
          We know that unexpected family commitments arise. Under our Academy Guarantee, you are entitled to request a makeup session or arrange an alternative slot with your tutor.
        </p>
        <div style="text-align: center; margin: 32px 0 16px;">
          <a href="${p.rescheduleUrl}" style="background: #f59e0b; color: #022c22; font-weight: bold; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-size: 14px; display: inline-block;">
            Reschedule Lesson in Portal &rarr;
          </a>
        </div>
      `;
      return wrapTemplate(title, body);
    }
  }
}

/**
 * Resend Email Adapter with production HTTP API and local sandbox logger
 */
export class ResendEmailAdapter implements EmailService {
  private apiKey: string | undefined;
  private fromEmail: string;

  constructor(apiKey?: string, fromEmail?: string) {
    this.apiKey = apiKey || process.env.RESEND_API_KEY;
    this.fromEmail = fromEmail || process.env.EMAIL_FROM || "Quran Learn Academy <notifications@quranlearnacademy.com>";
  }

  async send(payload: TransactionalEmail): Promise<EmailSendResult> {
    const { subject, html, text } = generateEmailContent(payload);

    // If no real Resend API key or in sandbox/test mode, log and return mock success
    if (!this.apiKey || this.apiKey.startsWith("re_mock") || this.apiKey === "test") {
      const mockId = `msg_sandbox_${Math.random().toString(36).substring(2, 10)}`;
      console.log(`[Resend Sandbox Dispatch] To: ${payload.to} | Subject: "${subject}" | ID: ${mockId}`);
      return {
        success: true,
        id: mockId,
        mode: "sandbox",
      };
    }

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: this.fromEmail,
          to: [payload.to],
          subject,
          html,
          text,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`[Resend Error ${res.status}]`, errorText);

        // If custom domain is not yet verified in Resend (HTTP 403), fallback automatically to Resend default onboarding sender
        if (res.status === 403 && this.fromEmail !== "Quran Learn Academy <onboarding@resend.dev>") {
          console.warn("[Resend Notice] Custom domain not yet verified in Resend dashboard. Falling back to onboarding@resend.dev for reliable delivery.");
          const retryRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "Quran Learn Academy <onboarding@resend.dev>",
              to: [payload.to],
              subject,
              html,
              text,
            }),
          });
          if (retryRes.ok) {
            const retryData = (await retryRes.json()) as { id: string };
            console.log(`[Resend Live Dispatch (Fallback)] Successfully sent email to ${payload.to} (ID: ${retryData.id})`);
            return {
              success: true,
              id: retryData.id,
              mode: "live",
            };
          }
        }

        return {
          success: false,
          id: "",
          error: `Resend HTTP ${res.status}: ${errorText}`,
          mode: "live",
        };
      }

      const data = (await res.json()) as { id: string };
      console.log(`[Resend Live Dispatch] Successfully sent email to ${payload.to} (ID: ${data.id})`);
      return {
        success: true,
        id: data.id,
        mode: "live",
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[Resend Network Exception]", msg);
      return {
        success: false,
        id: "",
        error: msg,
        mode: "live",
      };
    }
  }
}

export function getEmailService(): EmailService {
  return new ResendEmailAdapter();
}
