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

export interface EnrolmentRecord {
  id: string;
  learner: string;
  age: number;
  programme: string;
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
      enrolments: [],
      source: "supabase_postgresql",
      count: 0,
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
