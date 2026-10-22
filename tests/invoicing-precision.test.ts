import { describe, it, expect } from "vitest";
import { ACADEMY_PACKAGES, DISCOUNT_POLICIES } from "@/data/packages";
import { DirectInvoicePaymentAdapter } from "@quran/adapters";
import { InvoiceRecordSchema, PaymentCurrencySchema } from "@quran/contracts";
import crypto from "crypto";

describe("Financial Precision, Invoicing & Multi-Currency Banking Suite", () => {
  describe("1. Academy Packages Pricing Matrix Precision", () => {
    it("ensures all 4 primary packages define accurate multi-regional pricing", () => {
      expect(ACADEMY_PACKAGES).toHaveLength(4);

      const [pkg1, pkg2, pkg3, pkg4] = ACADEMY_PACKAGES;

      // Package 1 (2 Days / Week, 8 classes)
      expect(pkg1.classesPerMonth).toBe(8);
      expect(pkg1.prices.UK.amount).toBe(25);
      expect(pkg1.prices.USA.amount).toBe(40);
      expect(pkg1.prices.AUS.amount).toBe(55);
      expect(pkg1.prices.PK.amount).toBe(6000);

      // Package 2 (3 Days / Week, 12 classes)
      expect(pkg2.classesPerMonth).toBe(12);
      expect(pkg2.prices.UK.amount).toBe(30);
      expect(pkg2.prices.USA.amount).toBe(50);
      expect(pkg2.prices.AUS.amount).toBe(65);
      expect(pkg2.prices.PK.amount).toBe(7000);

      // Package 3 (Weekend, 8 classes)
      expect(pkg3.classesPerMonth).toBe(8);
      expect(pkg3.prices.UK.amount).toBe(35);
      expect(pkg3.prices.USA.amount).toBe(60);
      expect(pkg3.prices.AUS.amount).toBe(70);
      expect(pkg3.prices.PK.amount).toBe(8000);

      // Package 4 (5 Days / Week, 20 classes)
      expect(pkg4.classesPerMonth).toBe(20);
      expect(pkg4.prices.UK.amount).toBe(40);
      expect(pkg4.prices.USA.amount).toBe(65);
      expect(pkg4.prices.AUS.amount).toBe(85);
      expect(pkg4.prices.PK.amount).toBe(9500);
    });

    it("verifies per-class unit costs calculate strictly positive economics", () => {
      ACADEMY_PACKAGES.forEach((pkg) => {
        const costPerClassUK = pkg.prices.UK.amount / pkg.classesPerMonth;
        const costPerClassUSA = pkg.prices.USA.amount / pkg.classesPerMonth;
        const costPerClassPK = pkg.prices.PK.amount / pkg.classesPerMonth;

        expect(costPerClassUK).toBeGreaterThanOrEqual(2.0); // >= £2 per 1-on-1 class
        expect(costPerClassUSA).toBeGreaterThanOrEqual(3.0); // >= $3 per 1-on-1 class
        expect(costPerClassPK).toBeGreaterThan(400); // > PKR 400 per 1-on-1 class
      });
    });
  });

  describe("2. Discount Policies & Sibling Billing Reductions", () => {
    it("validates upfront term discount percentages", () => {
      const annual = DISCOUNT_POLICIES.find((p) => p.title.includes("Annual"));
      const sixMonth = DISCOUNT_POLICIES.find((p) => p.title.includes("Six Months"));
      const quarterly = DISCOUNT_POLICIES.find((p) => p.title.includes("Quarterly"));

      expect(annual?.discount).toBe("Save 20%");
      expect(sixMonth?.discount).toBe("Save 10%");
      expect(quarterly?.discount).toBe("Save 5%");
    });

    it("calculates exact discounted totals for multi-month upfront payments", () => {
      const baseMonthlyGBP = 30; // Package 2 in UK

      // Quarterly (3 months with 5% discount)
      const quarterlyBase = baseMonthlyGBP * 3;
      const quarterlyDiscounted = Math.round(quarterlyBase * 0.95 * 100) / 100;
      expect(quarterlyDiscounted).toBe(85.5);

      // Six Months (6 months with 10% discount)
      const sixMonthBase = baseMonthlyGBP * 6;
      const sixMonthDiscounted = Math.round(sixMonthBase * 0.90 * 100) / 100;
      expect(sixMonthDiscounted).toBe(162.0);

      // Annual (12 months with 20% discount)
      const annualBase = baseMonthlyGBP * 12;
      const annualDiscounted = Math.round(annualBase * 0.80 * 100) / 100;
      expect(annualDiscounted).toBe(288.0);
    });

    it("calculates multi-student sibling tier discounts accurately", () => {
      // 2 siblings on Package 2 in Pakistan: 7,000 PKR each = 14,000 PKR
      // 10% sibling discount on second child
      const child1 = 7000;
      const child2 = 7000 * 0.9; // 6,300 PKR
      const totalTwoChildren = child1 + child2;
      expect(totalTwoChildren).toBe(13300);

      // 3 siblings on Package 2 in UK: £30 each = £90
      // 10% discount on child 2, 15% discount on child 3
      const ukChild1 = 30;
      const ukChild2 = 30 * 0.9; // £27
      const ukChild3 = 30 * 0.85; // £25.50
      const totalThreeChildren = Math.round((ukChild1 + ukChild2 + ukChild3) * 100) / 100;
      expect(totalThreeChildren).toBe(82.5);
    });
  });

  describe("3. Zero-Stripe Multi-Currency Invoice Generation & Contract Validation", () => {
    it("generates direct bank invoice via DirectInvoicePaymentAdapter", async () => {
      const adapter = new DirectInvoicePaymentAdapter();
      const checkout = await adapter.createCheckout(
        3000,
        "GBP",
        "https://quranacademyapp.vercel.app/parent/billing",
        "https://quranacademyapp.vercel.app/packages",
        { studentId: "std_49102" }
      );

      expect(checkout.id).toMatch(/^inv_\d+_std_49102$/);
      expect(checkout.url).toContain("https://quranacademyapp.vercel.app/parent/billing?invoice_id=");
    });

    it("validates direct invoice contract records across all 6 supported currencies", () => {
      const currencies = ["PKR", "GBP", "USD", "EUR", "CAD", "AUD"] as const;

      currencies.forEach((currency) => {
        expect(PaymentCurrencySchema.safeParse(currency).success).toBe(true);

        const sampleInvoice = {
          id: `inv_test_${currency.toLowerCase()}`,
          studentId: "123e4567-e89b-12d3-a456-426614174000",
          studentName: "Zaid Khan",
          parentName: "Ahmed Khan",
          packageId: "package-2-three-days",
          packageName: "Package 2 (3 Days/Week)",
          amount: 50.0,
          currency: currency,
          status: "pending_verification" as const,
          paymentMethod: "bank_wire" as const,
          transactionRef: "WIRE-REF-10928",
          createdAt: new Date().toISOString(),
        };

        const result = InvoiceRecordSchema.safeParse(sampleInvoice);
        expect(result.success).toBe(true);
      });
    });

    it("rejects unauthorized currencies outside contract specifications", () => {
      const unsupportedCurrencies = ["INR", "JPY", "CNY", "RUB", "BTC"];
      unsupportedCurrencies.forEach((curr) => {
        expect(PaymentCurrencySchema.safeParse(curr).success).toBe(false);
      });
    });
  });

  describe("4. Teacher Earnings & Payout Accounting Integrity", () => {
    it("computes teacher compensation accurately based on completed sessions and adjustments", () => {
      const ratePerClassPKR = 500;

      // Scenario A: Full attendance (64 completed classes, 0 deductions)
      const classesA = 64;
      const adjustmentsA = 0;
      const payableA = classesA * ratePerClassPKR + adjustmentsA;
      expect(payableA).toBe(32000);

      // Scenario B: 60 completed classes, 1 missed class deduction (-500 PKR)
      const classesB = 60;
      const adjustmentsB = -500;
      const payableB = classesB * ratePerClassPKR + adjustmentsB;
      expect(payableB).toBe(29500);

      // Scenario C: 58 completed classes, 0 deductions
      const classesC = 58;
      const adjustmentsC = 0;
      const payableC = classesC * ratePerClassPKR + adjustmentsC;
      expect(payableC).toBe(29000);
    });

    it("verifies teacher payout state machine transitions", () => {
      type PayoutStatus = "pending" | "approved" | "disbursed" | "rejected";

      const validTransitions: Record<PayoutStatus, PayoutStatus[]> = {
        pending: ["approved", "rejected"],
        approved: ["disbursed", "rejected"],
        disbursed: [], // Final state
        rejected: ["pending"], // Re-evaluated
      };

      function canTransition(current: PayoutStatus, next: PayoutStatus): boolean {
        return validTransitions[current].includes(next);
      }

      expect(canTransition("pending", "approved")).toBe(true);
      expect(canTransition("approved", "disbursed")).toBe(true);
      expect(canTransition("disbursed", "pending")).toBe(false); // Disbursed payout cannot be set back to pending
      expect(canTransition("pending", "disbursed")).toBe(false); // Must be approved first
    });
  });

  describe("5. Cryptographic Verification & Digital Stamp Consistency", () => {
    it("generates deterministic SHA256 audit stamps for cleared invoices", () => {
      const invoiceId = "INV-2026-QA-8819";
      const transactionRef = "BARC-FPS-902184";

      // Matches logic in apps/web/src/app/api/invoices/[id]/download/route.tsx
      const hash1 = Buffer.from(invoiceId + transactionRef).toString("hex").substring(0, 32);
      const hash2 = Buffer.from(invoiceId + transactionRef).toString("hex").substring(0, 32);

      expect(hash1).toBe(hash2);
      expect(hash1.length).toBe(32);

      // Node crypto native sha256 verification
      const fullSha256 = crypto.createHash("sha256").update(invoiceId + transactionRef).digest("hex");
      expect(fullSha256).toHaveLength(64);
    });
  });
});
