import { describe, it, expect } from "vitest";
import { 
  UserRoleSchema, 
  TeacherStatusSchema, 
  ClassStatusSchema,
  ProfileSchema,
  StudentDetailsSchema,
  TeacherDetailsSchema,
  TransactionalEmailSchema,
  InvoiceRecordSchema
} from "./index";

describe("Domain Contracts & Runtime Validation Schemas", () => {
  it("validates permissible user roles", () => {
    expect(UserRoleSchema.parse("student")).toBe("student");
    expect(UserRoleSchema.parse("teacher")).toBe("teacher");
    expect(UserRoleSchema.parse("admin")).toBe("admin");
    expect(UserRoleSchema.parse("parent")).toBe("parent");

    expect(() => UserRoleSchema.parse("superuser")).toThrow();
    expect(() => UserRoleSchema.parse("hacker")).toThrow();
  });

  it("validates teacher application statuses", () => {
    expect(TeacherStatusSchema.parse("pending")).toBe("pending");
    expect(TeacherStatusSchema.parse("interview")).toBe("interview");
    expect(TeacherStatusSchema.parse("approved")).toBe("approved");
    expect(TeacherStatusSchema.parse("rejected")).toBe("rejected");

    expect(() => TeacherStatusSchema.parse("unknown")).toThrow();
  });

  it("validates class lifecycle states", () => {
    expect(ClassStatusSchema.parse("scheduled")).toBe("scheduled");
    expect(ClassStatusSchema.parse("completed")).toBe("completed");
    expect(ClassStatusSchema.parse("cancelled")).toBe("cancelled");

    expect(() => ClassStatusSchema.parse("deleted")).toThrow();
  });

  it("validates student details payload", () => {
    const validStudent = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      father_name: "Muhammad Khan",
      age: 10,
      country: "United Kingdom",
      city: "London",
      postal_code: "E1 6AN",
      address: "123 Commercial Road",
    };

    const parsed = StudentDetailsSchema.parse(validStudent);
    expect(parsed.age).toBe(10);
    expect(parsed.country).toBe("United Kingdom");

    // Negative age should fail
    expect(() => StudentDetailsSchema.parse({ ...validStudent, age: -5 })).toThrow();
  });

  it("validates teacher details requirements", () => {
    const validTeacher = {
      id: "123e4567-e89b-12d3-a456-426614174001",
      id_card_number: "NIC123456789",
      phone_number: "+447123456789",
      address: "Oxford Street, London",
      qualification: "Sanad in Hafs an Asim",
      gender: "female" as const,
      age: 28,
      bank_account: "GB29NWBK60161331926819",
      status: "pending" as const,
    };

    const parsed = TeacherDetailsSchema.parse(validTeacher);
    expect(parsed.gender).toBe("female");
    expect(parsed.status).toBe("pending");
  });

  it("validates Phase 3 transactional email payloads (Resend)", () => {
    // 1. Welcome Email
    const welcome = TransactionalEmailSchema.parse({
      type: "welcome",
      to: "parent@example.com",
      studentName: "Yusuf Khan",
      portalUrl: "https://quranacademyapp.vercel.app/student",
    });
    expect(welcome.type).toBe("welcome");

    // 2. Class Reminder
    const reminder = TransactionalEmailSchema.parse({
      type: "class_reminder",
      to: "parent@example.com",
      studentName: "Hana Khan",
      subject: "Noorani Qaida - Lesson 4",
      teacherName: "Ustadha Fatima",
      startTime: "2026-10-22T16:00:00Z",
      classroomUrl: "https://quranacademyapp.vercel.app/classroom/demo",
      reminderWindow: "30m",
    });
    expect(reminder.type).toBe("class_reminder");

    // 3. Receipt Confirmation
    const receipt = TransactionalEmailSchema.parse({
      type: "receipt_confirmation",
      to: "parent@example.com",
      recipientName: "Ahmed Khan",
      invoiceId: "INV-2026-1001",
      amount: "65.00",
      currency: "GBP",
      transactionRef: "BARC-FPS-8921",
      planName: "3 Days/Week Standard Plan",
    });
    expect(receipt.type).toBe("receipt_confirmation");

    // 4. Invalid email should throw
    expect(() =>
      TransactionalEmailSchema.parse({
        type: "welcome",
        to: "not-an-email",
        studentName: "Test",
      })
    ).toThrow();
  });

  it("validates Phase 3 multi-currency invoice records", () => {
    const validInvoice = {
      id: "inv_pkr_01",
      studentId: "student_123",
      studentName: "Yusuf Khan",
      parentName: "Ahmed Khan",
      packageId: "standard_3days",
      packageName: "Standard Plan (3 Days/Week)",
      amount: 18000,
      currency: "PKR" as const,
      status: "paid" as const,
      paymentMethod: "raast" as const,
      transactionRef: "RAAST-90218491",
      createdAt: "2026-10-21T10:00:00Z",
    };

    const parsed = InvoiceRecordSchema.parse(validInvoice);
    expect(parsed.currency).toBe("PKR");
    expect(parsed.paymentMethod).toBe("raast");
    expect(parsed.status).toBe("paid");

    // Negative amount should throw
    expect(() =>
      InvoiceRecordSchema.parse({ ...validInvoice, amount: -100 })
    ).toThrow();
  });
});
