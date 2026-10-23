import { z } from "zod";

export const UserRoleSchema = z.enum(["student", "teacher", "admin", "parent"]);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const TeacherStatusSchema = z.enum(["pending", "interview", "approved", "rejected"]);
export type TeacherStatus = z.infer<typeof TeacherStatusSchema>;

export const ClassStatusSchema = z.enum(["scheduled", "completed", "cancelled"]);
export type ClassStatus = z.infer<typeof ClassStatusSchema>;

export const ProfileSchema = z.object({
  id: z.string().uuid(),
  role: UserRoleSchema,
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});
export type Profile = z.infer<typeof ProfileSchema>;

export const StudentDetailsSchema = z.object({
  id: z.string().uuid(),
  father_name: z.string().min(1),
  age: z.number().int().positive(),
  country: z.string().min(2),
  city: z.string().min(2),
  postal_code: z.string().min(3),
  address: z.string().min(5),
  parent_id: z.string().uuid().nullable().optional(),
});
export type StudentDetails = z.infer<typeof StudentDetailsSchema>;

export const TeacherDetailsSchema = z.object({
  id: z.string().uuid(),
  id_card_number: z.string().min(5),
  phone_number: z.string().min(8),
  address: z.string().min(5),
  qualification: z.string().min(2),
  maslak: z.string().nullable().optional(),
  fiqh: z.string().nullable().optional(),
  gender: z.enum(["male", "female", "other"]),
  age: z.number().int().positive(),
  bank_account: z.string().min(5),
  status: TeacherStatusSchema.default("pending"),
  admin_notes: z.string().nullable().optional(),
});
export type TeacherDetails = z.infer<typeof TeacherDetailsSchema>;

export const ClassSchema = z.object({
  id: z.string().uuid(),
  teacher_id: z.string().uuid(),
  student_id: z.string().uuid(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  subject: z.string().min(2),
  status: ClassStatusSchema.default("scheduled"),
  zoom_or_meet_link: z.string().url().nullable().optional(),
  created_at: z.string().datetime().optional(),
});
export type Class = z.infer<typeof ClassSchema>;

export const LessonNoteSchema = z.object({
  id: z.string().uuid(),
  class_id: z.string().uuid(),
  teacher_id: z.string().uuid(),
  student_id: z.string().uuid(),
  covered_topic: z.string().min(2),
  performance_rating: z.number().int().min(1).max(5).nullable().optional(),
  homework: z.string().nullable().optional(),
  teacher_remarks: z.string().nullable().optional(),
  created_at: z.string().datetime().optional(),
});
export type LessonNote = z.infer<typeof LessonNoteSchema>;

/**
 * Real-Time Synchronized Classroom Event Contracts
 */
export const ClassroomEventSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("highlight"),
    index: z.number().nullable(),
  }),
  z.object({
    type: z.literal("split"),
    index: z.number(),
  }),
  z.object({
    type: z.literal("close_split"),
  }),
  z.object({
    type: z.literal("tool_sync"),
    state: z.record(z.string(), z.unknown()),
  }),
  z.object({
    type: z.literal("ping"),
  }),
  z.object({
    type: z.literal("pong"),
  }),
]);
export type ClassroomEvent = z.infer<typeof ClassroomEventSchema>;

/**
 * Phase 3 Transactional Email & Messaging Contracts (Resend)
 */
export const SafeUrlSchema = z
  .string()
  .url()
  .refine((val) => /^https?:\/\//i.test(val), {
    message: "URL must use http or https protocol",
  });

export const WelcomeEmailSchema = z.object({
  type: z.literal("welcome"),
  to: z.string().email(),
  studentName: z.string().min(1),
  portalUrl: SafeUrlSchema.default("https://quranacademyapp.vercel.app/student"),
  temporaryPassword: z.string().optional(),
});
export type WelcomeEmailPayload = z.infer<typeof WelcomeEmailSchema>;

export const ClassReminderSchema = z.object({
  type: z.literal("class_reminder"),
  to: z.string().email(),
  studentName: z.string().min(1),
  subject: z.string().min(1),
  teacherName: z.string().min(1),
  startTime: z.string(),
  classroomUrl: SafeUrlSchema,
  reminderWindow: z.enum(["24h", "30m"]),
});
export type ClassReminderPayload = z.infer<typeof ClassReminderSchema>;

export const ReceiptConfirmationSchema = z.object({
  type: z.literal("receipt_confirmation"),
  to: z.string().email(),
  recipientName: z.string().min(1),
  invoiceId: z.string().min(1),
  amount: z.string().min(1),
  currency: z.string().min(1),
  transactionRef: z.string().min(1),
  planName: z.string().min(1),
  downloadUrl: SafeUrlSchema.optional(),
});
export type ReceiptConfirmationPayload = z.infer<typeof ReceiptConfirmationSchema>;

export const ClassMissedSchema = z.object({
  type: z.literal("class_missed"),
  to: z.string().email(),
  parentName: z.string().min(1),
  studentName: z.string().min(1),
  subject: z.string().min(1),
  scheduledTime: z.string(),
  rescheduleUrl: SafeUrlSchema,
});
export type ClassMissedPayload = z.infer<typeof ClassMissedSchema>;

export const TransactionalEmailSchema = z.discriminatedUnion("type", [
  WelcomeEmailSchema,
  ClassReminderSchema,
  ReceiptConfirmationSchema,
  ClassMissedSchema,
]);
export type TransactionalEmail = z.infer<typeof TransactionalEmailSchema>;

/**
 * Phase 3 Invoice & Multi-Currency Settlement Contracts
 */
export const PaymentCurrencySchema = z.enum(["PKR", "GBP", "USD", "EUR", "CAD", "AUD"]);
export type PaymentCurrency = z.infer<typeof PaymentCurrencySchema>;

export const PaymentMethodTypeSchema = z.enum([
  "raast",
  "bank_wire",
  "faster_payments",
  "sepa",
  "jazzcash",
  "easypaisa",
  "wise",
  "paypal",
  "payoneer",
]);
export type PaymentMethodType = z.infer<typeof PaymentMethodTypeSchema>;

export const InvoiceStatusSchema = z.enum(["pending_verification", "paid", "refunded"]);
export type InvoiceStatus = z.infer<typeof InvoiceStatusSchema>;

export const InvoiceRecordSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  studentName: z.string(),
  parentName: z.string(),
  packageId: z.string(),
  packageName: z.string(),
  amount: z.number().positive(),
  currency: PaymentCurrencySchema,
  status: InvoiceStatusSchema,
  paymentMethod: PaymentMethodTypeSchema,
  transactionRef: z.string().min(2),
  createdAt: z.string(),
});
export type InvoiceRecord = z.infer<typeof InvoiceRecordSchema>;

export * from './version';


