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
