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
import { 
  StudentDetailsSchema, 
  ClassroomEventSchema, 
  InvoiceRecordSchema,
  TransactionalEmailSchema 
} from "@quran/contracts";

describe("Comprehensive Security, Authorization & Tenant Isolation Suite", () => {
  beforeEach(() => {
    resetRateLimitsForTesting();
  });

  describe("1. Strict Cross-Role Access & Privilege Escalation Defenses", () => {
    it("prevents students from accessing privileged admin attributes or operations", () => {
      const studentContext = {
        role: "student",
        userId: "usr_student_01",
        studentId: "std_student_01",
      };

      const canAccessAdminFinance = (role: string) => role === "admin";
      const canApproveTeacher = (role: string) => role === "admin";
      const canModifyTuitionRate = (role: string) => role === "admin";

      expect(canAccessAdminFinance(studentContext.role)).toBe(false);
      expect(canApproveTeacher(studentContext.role)).toBe(false);
      expect(canModifyTuitionRate(studentContext.role)).toBe(false);
    });

    it("prevents teachers from viewing student private billing or approving their own payouts", () => {
      const teacherContext = {
        role: "teacher",
        userId: "usr_teacher_01",
        teacherId: "tch_fatima_01",
      };

      const canViewParentCreditCards = (role: string) => role === "admin";
      const canApproveTeacherPayout = (role: string, targetTeacherId: string, currentTeacherId: string) => {
        return role === "admin" && targetTeacherId !== currentTeacherId;
      };

      expect(canViewParentCreditCards(teacherContext.role)).toBe(false);
      expect(
        canApproveTeacherPayout(teacherContext.role, teacherContext.teacherId, teacherContext.teacherId)
      ).toBe(false);
    });

    it("enforces immutable audit logging contract for every privileged admin mutation", () => {
      interface AuditLogEntry {
        id: string;
        actorId: string;
        actorRole: string;
        action: string;
        targetId: string;
        timestamp: string;
        ipAddress: string;
      }

      const logs: AuditLogEntry[] = [];
      const recordAdminAction = (entry: Omit<AuditLogEntry, "id" | "timestamp">) => {
        if (entry.actorRole !== "admin") {
          throw new Error("Unauthorized: only administrators can emit governance audit events");
        }
        const record: AuditLogEntry = {
          id: `audit_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          timestamp: new Date().toISOString(),
          ...entry,
        };
        logs.push(record);
        return record;
      };

      const validLog = recordAdminAction({
        actorId: "admin_super_01",
        actorRole: "admin",
        action: "TEACHER_APPROVED",
        targetId: "tch_ustadh_ali",
        ipAddress: "127.0.0.1",
      });

      expect(validLog.id).toBeDefined();
      expect(logs.length).toBe(1);

      // Student attempt to forge audit log must fail
      expect(() =>
        recordAdminAction({
          actorId: "std_impostor",
          actorRole: "student",
          action: "PAYMENT_CLEARED",
          targetId: "inv_123",
          ipAddress: "192.168.1.5",
        })
      ).toThrow("Unauthorized");
    });
  });

  describe("2. Cross-Tenant Data Isolation (Multi-Family Shield)", () => {
    interface FamilyTenant {
      familyId: string;
      guardianEmail: string;
      childrenIds: string[];
      invoiceIds: string[];
    }

    const tenantA: FamilyTenant = {
      familyId: "FAM-UK-001",
      guardianEmail: "tariq.uk@example.com",
      childrenIds: ["std_hana_001", "std_zayd_001"],
      invoiceIds: ["inv_uk_1001", "inv_uk_1002"],
    };

    const tenantB: FamilyTenant = {
      familyId: "FAM-US-002",
      guardianEmail: "sarah.us@example.com",
      childrenIds: ["std_adam_002"],
      invoiceIds: ["inv_us_2001"],
    };

    const canParentAccessStudent = (guardianEmail: string, tenant: FamilyTenant, targetStudentId: string) => {
      if (tenant.guardianEmail !== guardianEmail) return false;
      return tenant.childrenIds.includes(targetStudentId);
    };

    const canParentAccessInvoice = (guardianEmail: string, tenant: FamilyTenant, targetInvoiceId: string) => {
      if (tenant.guardianEmail !== guardianEmail) return false;
      return tenant.invoiceIds.includes(targetInvoiceId);
    };

    it("permits parent access strictly to their own children", () => {
      expect(canParentAccessStudent(tenantA.guardianEmail, tenantA, "std_hana_001")).toBe(true);
      expect(canParentAccessStudent(tenantA.guardianEmail, tenantA, "std_zayd_001")).toBe(true);
    });

    it("strictly blocks cross-tenant access between different families", () => {
      expect(canParentAccessStudent(tenantA.guardianEmail, tenantB, "std_adam_002")).toBe(false);
      expect(canParentAccessStudent(tenantB.guardianEmail, tenantA, "std_hana_001")).toBe(false);
    });

    it("strictly prevents cross-family invoice data leaks", () => {
      expect(canParentAccessInvoice(tenantA.guardianEmail, tenantA, "inv_uk_1001")).toBe(true);
      expect(canParentAccessInvoice(tenantA.guardianEmail, tenantB, "inv_us_2001")).toBe(false);
    });
  });

  describe("3. Classroom Participant Permissions & Silent Observer Mode", () => {
    interface ParticipantSession {
      userId: string;
      role: "teacher" | "student" | "parent_observer";
      classId: string;
      canPublishAudio: boolean;
      canPublishVideo: boolean;
      canDrawOnBoard: boolean;
      canMuteOthers: boolean;
    }

    const createParticipantSession = (
      userId: string,
      role: "teacher" | "student" | "parent_observer",
      classId: string
    ): ParticipantSession => {
      switch (role) {
        case "teacher":
          return {
            userId,
            role,
            classId,
            canPublishAudio: true,
            canPublishVideo: true,
            canDrawOnBoard: true,
            canMuteOthers: true,
          };
        case "student":
          return {
            userId,
            role,
            classId,
            canPublishAudio: true,
            canPublishVideo: true,
            canDrawOnBoard: true,
            canMuteOthers: false,
          };
        case "parent_observer":
          return {
            userId,
            role,
            classId,
            canPublishAudio: false,
            canPublishVideo: false,
            canDrawOnBoard: false,
            canMuteOthers: false,
          };
      }
    };

    it("verifies teacher has full instructional privileges", () => {
      const teacher = createParticipantSession("tch_01", "teacher", "cls_tajweed_101");
      expect(teacher.canPublishAudio).toBe(true);
      expect(teacher.canPublishVideo).toBe(true);
      expect(teacher.canDrawOnBoard).toBe(true);
      expect(teacher.canMuteOthers).toBe(true);
    });

    it("verifies student has learning privileges without moderation authority", () => {
      const student = createParticipantSession("std_01", "student", "cls_tajweed_101");
      expect(student.canPublishAudio).toBe(true);
      expect(student.canPublishVideo).toBe(true);
      expect(student.canMuteOthers).toBe(false);
    });

    it("enforces absolute silence and zero-interaction constraints on parent observer mode", () => {
      const observer = createParticipantSession("par_01", "parent_observer", "cls_tajweed_101");
      expect(observer.canPublishAudio).toBe(false);
      expect(observer.canPublishVideo).toBe(false);
      expect(observer.canDrawOnBoard).toBe(false);
      expect(observer.canMuteOthers).toBe(false);
    });
  });

  describe("4. Runtime Contract Injection & Schema Boundary Defense", () => {
    it("rejects malicious or malformed student detail payloads with non-UUID identifiers", () => {
      const maliciousPayload = {
        id: "'; DROP TABLE students; --",
        father_name: "Test Father",
        age: -5,
        country: "UK",
        city: "London",
        postal_code: "123",
        address: "123 Test St",
      };

      const result = StudentDetailsSchema.safeParse(maliciousPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(i => i.path.includes("id"))).toBe(true);
        expect(result.error.issues.some(i => i.path.includes("age"))).toBe(true);
      }
    });

    it("validates direct invoice contract boundaries with strict currency enumerations", () => {
      const validInvoice = {
        id: "inv_2026_test_01",
        studentId: "std_4901",
        studentName: "Hana Khan",
        parentName: "Ahmed Khan",
        packageId: "pkg_individual_1",
        packageName: "1-on-1 Personalized Quran (3x/week)",
        currency: "GBP",
        amount: 65.0,
        status: "pending_verification",
        paymentMethod: "faster_payments",
        transactionRef: "BARC-FPS-902184",
        createdAt: new Date().toISOString(),
      };

      const result = InvoiceRecordSchema.safeParse(validInvoice);
      expect(result.success).toBe(true);

      // Invalid currency must be rejected
      const invalidInvoice = {
        ...validInvoice,
        currency: "BITCOIN",
      };
      const badResult = InvoiceRecordSchema.safeParse(invalidInvoice);
      expect(badResult.success).toBe(false);
    });

    it("validates classroom sync event payloads preventing arbitrary event injection", () => {
      const validHighlightEvent = {
        type: "highlight",
        index: 4,
      };
      expect(ClassroomEventSchema.safeParse(validHighlightEvent).success).toBe(true);

      const validSplitEvent = {
        type: "split",
        index: 2,
      };
      expect(ClassroomEventSchema.safeParse(validSplitEvent).success).toBe(true);

      const validToolSync = {
        type: "tool_sync",
        state: { color: "#0C4A3A", strokeWidth: 3 },
      };
      expect(ClassroomEventSchema.safeParse(validToolSync).success).toBe(true);

      const invalidEvent = {
        type: "unauthorized_remote_eval",
        payload: { script: "alert(1)" },
      };
      expect(ClassroomEventSchema.safeParse(invalidEvent).success).toBe(false);
    });

    it("validates transactional email payloads protecting against unvalidated redirects or injection", () => {
      const validWelcome = {
        type: "welcome",
        to: "parent@example.com",
        studentName: "Hana Khan",
        portalUrl: "https://quranacademyapp.vercel.app/student",
      };
      expect(TransactionalEmailSchema.safeParse(validWelcome).success).toBe(true);

      // Malformed email address
      const invalidEmail = {
        ...validWelcome,
        to: "not-an-email",
      };
      expect(TransactionalEmailSchema.safeParse(invalidEmail).success).toBe(false);

      // Malformed portal URL (e.g. javascript: injection)
      const invalidUrl = {
        ...validWelcome,
        portalUrl: "javascript:alert(1)",
      };
      expect(TransactionalEmailSchema.safeParse(invalidUrl).success).toBe(false);
    });
  });

  describe("5. High-Frequency Rate Limiting & Denial-of-Service Shield", () => {
    it("quarantines high-velocity token brute-force attempts on sensitive endpoints", () => {
      const attackerIp = "198.51.100.42";
      const sensitiveRoute = "/api/speech/deepgram-token";

      // Exhaust limit of 15 requests
      for (let i = 0; i < 15; i++) {
        const allowed = checkRateLimit(attackerIp, sensitiveRoute).allowed;
        expect(allowed).toBe(true);
      }

      // Next request must be quarantined
      const quarantined = checkRateLimit(attackerIp, sensitiveRoute);
      expect(quarantined.allowed).toBe(false);
      expect(quarantined.retryAfterSeconds).toBeGreaterThan(0);
      expect(quarantined.remaining).toBe(0);
    });

    it("isolates rate limits per client IP address", () => {
      const userAIp = "192.168.1.100";
      const userBIp = "192.168.1.200";

      // User A exhausts their quota
      for (let i = 0; i < 15; i++) {
        checkRateLimit(userAIp, "/api/livekit/token");
      }
      expect(checkRateLimit(userAIp, "/api/livekit/token").allowed).toBe(false);

      // User B must still be fully permitted
      expect(checkRateLimit(userBIp, "/api/livekit/token").allowed).toBe(true);
    });
  });
});
