import { describe, it, expect } from "vitest";
import { 
  UserRoleSchema, 
  TeacherStatusSchema, 
  ClassStatusSchema,
  ProfileSchema,
  StudentDetailsSchema,
  TeacherDetailsSchema
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
});
