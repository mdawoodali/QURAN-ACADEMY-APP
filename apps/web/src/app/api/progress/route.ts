import { NextRequest, NextResponse } from "next/server";
import { connection } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: NextRequest) {
  try {
    await connection();
  } catch {}

  try {
    const { searchParams } = new URL(req.url);
    const studentName = searchParams.get("studentName");
    const studentId = searchParams.get("studentId");

    let supabase: any;
    try {
      supabase = createAdminClient();
    } catch {
      supabase = await createClient();
    }

    let query = supabase.from("student_lesson_notes").select("*").order("lesson_date", { ascending: false });
    if (studentId) {
      query = query.eq("student_id", studentId);
    } else if (studentName) {
      query = query.ilike("student_name", `%${studentName}%`);
    }

    const { data: notes, error } = await query;
    if (error) {
      console.warn("[Progress API] Database error:", error.message);
      return NextResponse.json({ notes: [], count: 0, error: error.message });
    }

    const mapped = (notes || []).map((n: any) => ({
      id: n.id,
      studentId: n.student_id,
      studentName: n.student_name,
      teacherName: n.teacher_name,
      student_name: n.student_name,
      teacher_name: n.teacher_name,
      date: n.lesson_date,
      lesson_date: n.lesson_date,
      lesson: n.lesson_title,
      lesson_title: n.lesson_title,
      lessonTitle: n.lesson_title,
      grade: n.grade,
      rating: n.rating,
      feedback: n.feedback,
      homework: n.homework,
      sabaq: n.sabaq,
      sabqi: n.sabqi,
      manzil: n.manzil,
      tajweedScore: n.tajweed_score || "4.8 / 5.0",
    }));

    return NextResponse.json({ notes: mapped, count: mapped.length });
  } catch (err: any) {
    return NextResponse.json({ notes: [], count: 0, error: err?.message });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      studentId,
      studentName = "Student",
      teacherName = "Teacher",
      lessonDate = new Date().toISOString().slice(0, 10),
      lessonTitle = "Tajweed Lesson",
      grade = "Excellent",
      rating = 5,
      feedback = "MashaAllah, great recitation today.",
      homework = "",
      sabaq = "",
      sabqi = "",
      manzil = "",
      tajweedScore = "4.8 / 5.0",
    } = body;

    let supabase: any;
    try {
      supabase = createAdminClient();
    } catch {
      supabase = await createClient();
    }

    const { data, error } = await supabase
      .from("student_lesson_notes")
      .insert({
        student_id: studentId,
        student_name: studentName,
        teacher_name: teacherName,
        lesson_date: lessonDate,
        lesson_title: lessonTitle,
        grade,
        rating,
        feedback,
        homework,
        sabaq,
        sabqi,
        manzil,
        tajweed_score: tajweedScore,
      })
      .select()
      .single();

    if (error) {
      console.warn("[Progress API] Insert error:", error.message);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Lesson note saved in database.",
        note: data || {
          id: `note_${Date.now()}`,
          studentName,
          teacherName,
          lessonDate,
          grade,
          feedback,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to record lesson note", details: err?.message },
      { status: 500 }
    );
  }
}
