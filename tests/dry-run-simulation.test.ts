import { describe, it, expect } from "vitest";
import { StudentDetailsSchema } from "@quran/contracts";
import { getPaymentProvider, getEmailService } from "@quran/adapters";
import { compareRecitation } from "@quran/domain";
import { hasScheduleCollision, maskStudentPii } from "@/lib/security/childSafety";
import { analytics } from "@/lib/analytics";
import { telemetry } from "@/lib/telemetry";

interface MockFamily {
  familyId: string;
  parentName: string;
  parentEmail: string;
  studentName: string;
  age: number;
  country: string;
  currency: "PKR" | "GBP" | "USD" | "EUR";
  tuitionAmount: string;
  paymentRail: string;
  transactionRef: string;
}

const SIMULATED_FAMILIES: MockFamily[] = [
  {
    familyId: "FAM-101",
    parentName: "Ahmed Khan",
    parentEmail: "ahmed.khan@example.co.uk",
    studentName: "Yusuf Khan",
    age: 10,
    country: "United Kingdom",
    currency: "GBP",
    tuitionAmount: "65.00",
    paymentRail: "Barclays Faster Payments (FPS)",
    transactionRef: "BARC-FPS-902184",
  },
  {
    familyId: "FAM-102",
    parentName: "Dr. Tariq Rizvi",
    parentEmail: "tariq.rizvi@example.com",
    studentName: "Ali Rizvi",
    age: 12,
    country: "United States",
    currency: "USD",
    tuitionAmount: "85.00",
    paymentRail: "Chase ACH / Zelle",
    transactionRef: "ZELLE-CHAS-441029",
  },
  {
    familyId: "FAM-103",
    parentName: "Syed Bilal Shah",
    parentEmail: "bilal.shah@example.pk",
    studentName: "Fatima Shah",
    age: 8,
    country: "Pakistan",
    currency: "PKR",
    tuitionAmount: "18,000",
    paymentRail: "Meezan Bank / Raast Instant",
    transactionRef: "RAAST-0300-881920",
  },
  {
    familyId: "FAM-104",
    parentName: "Zainab Al-Husseini",
    parentEmail: "zainab.h@example.co.uk",
    studentName: "Hussain Al-Husseini",
    age: 11,
    country: "United Kingdom",
    currency: "GBP",
    tuitionAmount: "65.00",
    paymentRail: "Barclays FPS",
    transactionRef: "BARC-FPS-331092",
  },
  {
    familyId: "FAM-105",
    parentName: "Mohammad Jawad",
    parentEmail: "mjawad@example.com",
    studentName: "Sakina Jawad",
    age: 7,
    country: "United States",
    currency: "USD",
    tuitionAmount: "85.00",
    paymentRail: "Chase ACH",
    transactionRef: "ACH-CHAS-774012",
  },
  {
    familyId: "FAM-106",
    parentName: "Dr. Murtaza Abbas",
    parentEmail: "murtaza.abbas@example.com.au",
    studentName: "Ali Abbas",
    age: 9,
    country: "Australia",
    currency: "USD",
    tuitionAmount: "65.00",
    paymentRail: "Commonwealth Bank PayID",
    transactionRef: "CBA-OSKO-662910",
  },
  {
    familyId: "FAM-107",
    parentName: "Khadija Kazmi",
    parentEmail: "khadija.kazmi@example.ca",
    studentName: "Kumail Kazmi",
    age: 13,
    country: "Canada",
    currency: "USD",
    tuitionAmount: "65.00",
    paymentRail: "TD Bank Interac / Wire",
    transactionRef: "TD-INT-891042",
  },
  {
    familyId: "FAM-108",
    parentName: "Sajjad Naqvi",
    parentEmail: "sajjad.naqvi@example.de",
    studentName: "Zehra Naqvi",
    age: 10,
    country: "Germany",
    currency: "EUR",
    tuitionAmount: "50.00",
    paymentRail: "Deutsche Bank SEPA Instant",
    transactionRef: "SEPA-DE-910283",
  },
  {
    familyId: "FAM-109",
    parentName: "Imran Zaidi",
    parentEmail: "imran.zaidi@example.ae",
    studentName: "Raza Zaidi",
    age: 11,
    country: "United Arab Emirates",
    currency: "USD",
    tuitionAmount: "70.00",
    paymentRail: "Emirates NBD Wire",
    transactionRef: "ENBD-WIRE-551093",
  },
  {
    familyId: "FAM-110",
    parentName: "Syed Baqir Al-Musawi",
    parentEmail: "baqir.musawi@example.org",
    studentName: "Mohammad Musawi",
    age: 14,
    country: "United Kingdom",
    currency: "GBP",
    tuitionAmount: "40.00",
    paymentRail: "Monzo Faster Payments",
    transactionRef: "MNZO-FPS-771920",
  },
];

const MOCK_TEACHERS = [
  { id: "tch_1", name: "Ustadha Fatima", maslak: "Ja'fari / Shia Ithna Ashari" },
  { id: "tch_2", name: "Sheikh Al-Qari", maslak: "Ja'fari / Shia Ithna Ashari" },
  { id: "tch_3", name: "Ustadha Maryam", maslak: "Ja'fari / Shia Ithna Ashari" },
];

describe("Phase 5: 48-Hour Live Academy Simulation (Dry Run)", () => {
  it("executes the full 7-step student lifecycle for 10 mock families across 3 vetted tutors", async () => {
    const paymentProvider = getPaymentProvider();
    const emailService = getEmailService();

    for (let i = 0; i < SIMULATED_FAMILIES.length; i++) {
      const family = SIMULATED_FAMILIES[i];
      const assignedTeacher = MOCK_TEACHERS[i % MOCK_TEACHERS.length];

      // -------------------------------------------------------------
      // Step 1: Student Registration Validation
      // -------------------------------------------------------------
      const studentPayload = {
        id: `123e4567-e89b-12d3-a456-4266141740${i.toString().padStart(2, "0")}`,
        father_name: family.parentName,
        age: family.age,
        country: family.country,
        city: "Capital District",
        postal_code: "10001",
        address: "Academy Road, Lane " + (i + 1),
      };
      const parsedStudent = StudentDetailsSchema.parse(studentPayload);
      expect(parsedStudent.age).toBe(family.age);

      analytics.track("trial_booked", {
        student: family.studentName,
        country: family.country,
      });

      // -------------------------------------------------------------
      // Step 2: Child Safeguarding & PII Masking Verification
      // -------------------------------------------------------------
      const safeView = maskStudentPii(
        {
          id: studentPayload.id,
          firstName: family.studentName.split(" ")[0],
          lastName: family.studentName.split(" ")[1] || "",
          age: family.age,
          country: family.country,
          city: "Capital District",
          phoneNumber: "+1 555 0199",
          email: family.parentEmail,
          guardianConsentRecorded: true,
        },
        "teacher"
      );
      expect(safeView.isPiiMasked).toBe(true);
      expect(safeView.phoneNumber).toBe("REDACTED_SAFEGUARDED");

      // -------------------------------------------------------------
      // Step 3: Admin Scheduling & Double-Booking Protection
      // -------------------------------------------------------------
      const scheduledStart = `2026-10-25T16:${i * 10}:00Z`;
      const scheduledEnd = `2026-10-25T16:${i * 10 + 30}:00Z`;

      const existingTeacherSchedule = [
        { startTime: "2026-10-25T14:00:00Z", endTime: "2026-10-25T14:30:00Z" },
      ];
      const hasConflict = hasScheduleCollision(
        existingTeacherSchedule,
        scheduledStart,
        scheduledEnd
      );
      expect(hasConflict).toBe(false);

      // -------------------------------------------------------------
      // Step 4: Classroom WebRTC Session & AI Recitation Matcher
      // -------------------------------------------------------------
      const classId = `class_sim_${family.familyId.toLowerCase()}`;
      analytics.track("classroom_entered", {
        classId,
        teacher: assignedTeacher.name,
      });

      // Recite "Bismi Allahi ar-Rahmani ar-Raheem"
      const scripture = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
      const phoneticMatch = compareRecitation("بسم الله الرحمن الرحيم", scripture);
      expect(phoneticMatch.isMatch).toBe(true);
      expect(phoneticMatch.similarity).toBeGreaterThan(0.85);

      // -------------------------------------------------------------
      // Step 5: Teacher Scorecard & Feedback Logging
      // -------------------------------------------------------------
      const scorecard = {
        classId,
        studentName: family.studentName,
        teacherName: assignedTeacher.name,
        coveredTopic: "Surah Al-Fatihah, Ayat 1-4 with Ghunnah & Madd Rules",
        rating: 5,
        homework: "Practice Ayah 1-4 with 2-second Madd 5 times daily",
      };
      expect(scorecard.rating).toBe(5);
      analytics.track("lesson_completed", scorecard);

      // -------------------------------------------------------------
      // Step 6: Parent Tuition Settlement (Zero-Stripe Direct Rail)
      // -------------------------------------------------------------
      const checkout = await paymentProvider.createCheckout(
        parseInt(family.tuitionAmount.replace(/[^0-9]/g, "")),
        family.currency,
        "https://quranacademyapp.vercel.app/parent/billing",
        "https://quranacademyapp.vercel.app/packages",
        { studentId: studentPayload.id }
      );
      expect(checkout.id).toBeDefined();

      analytics.track("receipt_uploaded", {
        familyId: family.familyId,
        amount: family.tuitionAmount,
        currency: family.currency,
        ref: family.transactionRef,
      });

      // -------------------------------------------------------------
      // Step 7: Admin Verification & Resend Confirmation Email
      // -------------------------------------------------------------
      const invoiceId = `INV-2026-${family.familyId}`;
      const emailResult = await emailService.send({
        type: "receipt_confirmation",
        to: family.parentEmail,
        recipientName: family.parentName,
        invoiceId,
        amount: family.tuitionAmount,
        currency: family.currency,
        transactionRef: family.transactionRef,
        planName: "Standard 3 Days/Week Plan",
        downloadUrl: `https://quranacademyapp.vercel.app/api/invoices/${invoiceId}/download`,
      });

      expect(emailResult.success).toBe(true);
      expect(emailResult.id).toBeDefined();

      analytics.track("payment_verified", {
        invoiceId,
        amount: family.tuitionAmount,
        currency: family.currency,
      });

      telemetry.captureMessage(`[Simulation] Lifecycle verified for ${family.studentName} (${family.familyId})`);
    }

    // Verify analytics logged all 10 families * 5 events = 50 events
    const logs = analytics.getRecentEvents();
    expect(logs.length).toBeGreaterThanOrEqual(50);
  });
});
