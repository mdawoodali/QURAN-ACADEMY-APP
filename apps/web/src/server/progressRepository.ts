import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

export interface StudentLessonNoteRecord {
  id: string;
  studentId: string;
  studentName: string;
  teacherName: string;
  date: string;
  lesson: string;
  grade: string;
  rating: number;
  feedback: string;
  homework?: string;
  sabaq?: string;
  sabqi?: string;
  manzil?: string;
  tajweedScore: string;
}

async function getSupabase() {
  try {
    return createAdminClient();
  } catch {
    return await createClient();
  }
}

export async function fetchStudentProgress(studentId?: string, studentName?: string): Promise<StudentLessonNoteRecord[]> {
  const supabase: any = await getSupabase();
  let query = supabase.from("student_lesson_notes").select("*").order("lesson_date", { ascending: false });

  if (studentId) {
    query = query.eq("student_id", studentId);
  } else if (studentName) {
    query = query.ilike("student_name", `%${studentName}%`);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  return data.map((n: any) => ({
    id: n.id,
    studentId: n.student_id,
    studentName: n.student_name,
    teacherName: n.teacher_name,
    date: n.lesson_date,
    lesson: n.lesson_title,
    grade: n.grade,
    rating: n.rating,
    feedback: n.feedback,
    homework: n.homework,
    sabaq: n.sabaq,
    sabqi: n.sabqi,
    manzil: n.manzil,
    tajweedScore: n.tajweed_score || "4.8 / 5.0",
  }));
}
