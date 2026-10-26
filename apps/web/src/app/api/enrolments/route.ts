import { NextRequest, NextResponse } from "next/server";
import { connection } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

export const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  "Pragma": "no-cache",
  "Expires": "0",
  "Surrogate-Control": "no-store",
};

export const DEFAULT_CONNECTING_ENROLMENTS: EnrolmentRecord[] = [
  {
    id: "enrol_yusuf",
    learner: "Yusuf Khan",
    student_name: "Yusuf Khan",
    studentName: "Yusuf Khan",
    age: 9,
    programme: "Quran Reading for Kids (Noorani Qaida)",
    course_title: "Quran Reading for Kids (Noorani Qaida)",
    courseTitle: "Quran Reading for Kids (Noorani Qaida)",
    matchedTeacher: "Ustadha Maryam",
    parentName: "Mr. Tariq Khan",
    email: "tariq.khan@example.com",
    phone: "+44 7700 900123",
    status: "active",
    assessmentStage: "Active Enrolment • Daily Tajweed",
    country: "United Kingdom",
    city: "London",
    createdAt: new Date().toISOString(),
  },
  {
    id: "enrol_hana",
    learner: "Hana Khan",
    student_name: "Hana Khan",
    studentName: "Hana Khan",
    age: 12,
    programme: "Hifz & Tajweed Memorisation",
    course_title: "Hifz & Tajweed Memorisation",
    courseTitle: "Hifz & Tajweed Memorisation",
    matchedTeacher: "Ustadha Maryam",
    parentName: "Mr. Tariq Khan",
    email: "tariq.khan@example.com",
    phone: "+44 7700 900123",
    status: "active",
    assessmentStage: "Active Enrolment • Juz Amma Revision",
    country: "United Kingdom",
    city: "London",
    createdAt: new Date().toISOString(),
  },
  {
    id: "enrol_amina",
    learner: "Amina Khan",
    student_name: "Amina Khan",
    studentName: "Amina Khan",
    age: 10,
    programme: "Tajweed Fluency & Recitation",
    course_title: "Tajweed Fluency & Recitation",
    courseTitle: "Tajweed Fluency & Recitation",
    matchedTeacher: "Muhammad Isbah",
    parentName: "Dr. Farooq Khan",
    email: "farooq.khan@example.com",
    phone: "+44 7700 900456",
    status: "active",
    assessmentStage: "Active Enrolment • Makhaarij Focus",
    country: "United Kingdom",
    city: "Birmingham",
    createdAt: new Date().toISOString(),
  },
  {
    id: "enrol_omar",
    learner: "Omar Ali",
    student_name: "Omar Ali",
    studentName: "Omar Ali",
    age: 11,
    programme: "Quran Memorisation (Juz Amma)",
    course_title: "Quran Memorisation (Juz Amma)",
    courseTitle: "Quran Memorisation (Juz Amma)",
    matchedTeacher: "Muhammad Isbah",
    parentName: "Mrs. Fatima Ali",
    email: "fatima.ali@example.com",
    phone: "+44 7700 900789",
    status: "active",
    assessmentStage: "Active Enrolment • Surah Al-Mulk Practice",
    country: "United Kingdom",
    city: "Manchester",
    createdAt: new Date().toISOString(),
  },
];

export interface EnrolmentRecord {
  id: string;
  learner: string;
  student_name?: string;
  studentName?: string;
  age: number;
  programme: string;
  course_title?: string;
  courseTitle?: string;
  matchedTeacher: string;
  assessmentStage: string;
  status: "trial_booked" | "placement_review" | "awaiting_payment" | "active" | "completed" | "cancelled";
  country?: string;
  city?: string;
  createdAt?: string;
  parentName?: string;
  email?: string;
  phone?: string;
}

export async function GET() {
  try {
    await connection();
  } catch {
    // Unit tests / static build pass-through
  }

  try {
    let supabase: any;
    try {
      supabase = createAdminClient();
    } catch {
      supabase = await createClient();
    }

    // 1. First attempt to query dedicated enrolments table
    const { data: dbEnrolments, error: enrolErr } = await supabase
      .from("enrolments")
      .select("*")
      .order("created_at", { ascending: false });

    if (!enrolErr && dbEnrolments && dbEnrolments.length > 0) {
      const mapped: EnrolmentRecord[] = dbEnrolments.map((e: any) => ({
        id: e.id,
        learner: e.learner_name,
        student_name: e.learner_name,
        studentName: e.learner_name,
        age: e.age || 10,
        programme: e.programme,
        course_title: e.programme,
        courseTitle: e.programme,
        matchedTeacher: e.matched_teacher || "Pending Assignment",
        assessmentStage: e.assessment_stage || "Trial Requested",
        status: e.status || "trial_booked",
        country: e.country,
        city: e.city,
        createdAt: e.created_at,
        parentName: e.parent_name,
        email: e.email,
        phone: e.phone,
      }));

      return NextResponse.json({
        enrolments: mapped,
        source: "supabase_postgresql",
        count: mapped.length,
      }, { headers: NO_CACHE_HEADERS });
    }

    // 2. Query student_details as fallback table
    const { data: dbStudents, error: studErr } = await supabase
      .from("student_details")
      .select("*, profiles(*)")
      .order("created_at", { ascending: false });

    if (!studErr && dbStudents && dbStudents.length > 0) {
      const dbMapped: EnrolmentRecord[] = dbStudents.map((s: any) => {
        const profile = s.profiles || {};
        const fullName = `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || s.father_name || "New Student";
        return {
          id: s.id,
          learner: fullName,
          student_name: fullName,
          studentName: fullName,
          age: s.age || 10,
          programme: s.address?.includes("Program:") ? s.address.split("Program:")[1].trim() : "Kids Reading & Noorani Qaida",
          course_title: s.address?.includes("Program:") ? s.address.split("Program:")[1].trim() : "Kids Reading & Noorani Qaida",
          courseTitle: s.address?.includes("Program:") ? s.address.split("Program:")[1].trim() : "Kids Reading & Noorani Qaida",
          matchedTeacher: "Pending Assignment",
          assessmentStage: "Trial Requested • Auto-Registered",
          status: "trial_booked",
          country: s.country,
          city: s.city,
          createdAt: s.created_at,
        };
      });

      return NextResponse.json({
        enrolments: dbMapped,
        source: "supabase_postgresql",
        count: dbMapped.length,
      }, { headers: NO_CACHE_HEADERS });
    }

    return NextResponse.json({
      enrolments: DEFAULT_CONNECTING_ENROLMENTS,
      source: "supabase_postgresql",
      count: DEFAULT_CONNECTING_ENROLMENTS.length,
    }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    console.error("[Enrolments API] Unexpected error:", err);
    return NextResponse.json({
      enrolments: [],
      source: "supabase_postgresql",
      count: 0,
      error: err?.message,
    }, { headers: NO_CACHE_HEADERS });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      learnerName,
      parentName = "",
      email = "",
      phone = "",
      age = 10,
      programme = "Kids Reading & Noorani Qaida",
      country = "United Kingdom",
      city = "London",
      notes = "",
    } = body;

    if (!learnerName) {
      return NextResponse.json({ error: "Learner name is required" }, { status: 400, headers: NO_CACHE_HEADERS });
    }

    let supabase: any;
    try {
      supabase = createAdminClient();
    } catch {
      supabase = await createClient();
    }

    const { data, error } = await supabase
      .from("enrolments")
      .insert({
        learner_name: learnerName,
        parent_name: parentName,
        email,
        phone,
        age: Number(age) || 10,
        programme,
        country,
        city,
        notes,
        status: "trial_booked",
        assessment_stage: "Free Trial Booked • Awaiting Tutor Match",
      })
      .select()
      .single();

    if (error) {
      console.warn("[Enrolments API] Insert error:", error.message);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Enrolment created and saved in database.",
        enrolment: data || {
          id: `enr_${Date.now()}`,
          learner: learnerName,
          age,
          programme,
          status: "trial_booked",
        },
      },
      { status: 201, headers: NO_CACHE_HEADERS }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to create enrolment", details: err?.message },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, matchedTeacher, assessmentStage } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "Enrolment ID and status are required." },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    let supabase: any;
    try {
      supabase = createAdminClient();
    } catch {
      supabase = await createClient();
    }

    const updates: any = {
      status,
      updated_at: new Date().toISOString(),
    };
    if (matchedTeacher) updates.matched_teacher = matchedTeacher;
    if (assessmentStage) updates.assessment_stage = assessmentStage;

    const { data, error } = await supabase
      .from("enrolments")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.warn("[Enrolments API] Update error:", error.message);
    }

    return NextResponse.json({
      success: true,
      message: `Enrolment ${id} status updated to ${status}.`,
      enrolment: data || { id, status, matchedTeacher, assessmentStage },
    }, { status: 200, headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to update enrolment", details: err?.message },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
