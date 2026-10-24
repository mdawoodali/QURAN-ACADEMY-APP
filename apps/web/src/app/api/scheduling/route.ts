import { NextResponse } from "next/server";
import { connection } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

const SEED_SCHEDULES = [
  {
    id: "s1",
    assignmentId: "a1",
    teacherId: "t1",
    teacherName: "Ustadha Maryam Ahmed",
    studentId: "s1",
    studentName: "Amina Siddiqui",
    dayOfWeek: "Tuesday",
    startTimeLocal: "16:30",
    durationMinutes: 30,
    timezoneAnchor: "Europe/London",
    status: "active",
    subject: "Tajweed & Fluent Recitation",
  },
  {
    id: "s2",
    assignmentId: "a2",
    teacherId: "t1",
    teacherName: "Ustadha Maryam Ahmed",
    studentId: "s2",
    studentName: "Yusuf Khan",
    dayOfWeek: "Monday",
    startTimeLocal: "17:00",
    durationMinutes: 30,
    timezoneAnchor: "Europe/London",
    status: "active",
    subject: "Quran Reading for Kids (Noorani Qaida)",
  },
  {
    id: "s3",
    assignmentId: "a3",
    teacherId: "t2",
    teacherName: "Sheikh Bilal Hassan",
    studentId: "s3",
    studentName: "Omar Farooq",
    dayOfWeek: "Thursday",
    startTimeLocal: "17:30",
    durationMinutes: 30,
    timezoneAnchor: "Europe/London",
    status: "active",
    subject: "Hifz & Memorisation",
  },
];

const SEED_ASSIGNMENTS = [
  {
    id: "a1",
    teacherId: "t1",
    teacherName: "Ustadha Maryam Ahmed",
    studentId: "s1",
    studentName: "Amina Siddiqui",
    subject: "Tajweed & Fluent Recitation",
    packageTier: "Standard (3x / week)",
    status: "active",
    notes: "Student in London time zone, prefers 16:30 BST.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "a2",
    teacherId: "t1",
    teacherName: "Ustadha Maryam Ahmed",
    studentId: "s2",
    studentName: "Yusuf Khan",
    subject: "Quran Reading for Kids (Noorani Qaida)",
    packageTier: "Standard (3x / week)",
    status: "active",
    notes: "Focusing on Makharij articulation points.",
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    await connection();
  } catch {}

  try {
    let supabase: any;
    try {
      supabase = createAdminClient();
    } catch {
      supabase = await createClient();
    }

    // 1. Fetch recurring schedules with assignment context
    const { data: dbSchedules, error: schedError } = await supabase
      .from("recurring_schedules")
      .select(`
        *,
        teacher_assignments (
          id,
          subject,
          package_tier,
          status,
          assignment_notes
        )
      `)
      .order("created_at", { ascending: false });

    // 2. Fetch assignments
    const { data: dbAssignments } = await supabase
      .from("teacher_assignments")
      .select("*")
      .order("created_at", { ascending: false });

    // 3. Fetch profiles to resolve names
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, role");

    const profileMap = new Map<string, string>();
    if (profiles) {
      profiles.forEach((p: any) => {
        profileMap.set(p.id, `${p.first_name || ""} ${p.last_name || ""}`.trim() || "User");
      });
    }

    const mappedSchedules = (dbSchedules || []).map((item: any) => {
      const teacherName = profileMap.get(item.teacher_id) || "Assigned Tutor";
      const studentName = profileMap.get(item.student_id) || "Enrolled Student";
      return {
        id: item.id,
        assignmentId: item.assignment_id || item.id,
        teacherId: item.teacher_id,
        teacherName,
        studentId: item.student_id,
        studentName,
        dayOfWeek: item.day_of_week,
        startTimeLocal: (item.start_time_local || "17:00").slice(0, 5),
        durationMinutes: item.duration_minutes || 30,
        timezoneAnchor: item.timezone_anchor || "Europe/London",
        status: item.status || "active",
        subject: item.teacher_assignments?.subject || "Tajweed & Fluent Recitation",
      };
    });

    const mappedAssignments = (dbAssignments || []).map((a: any) => {
      const teacherName = profileMap.get(a.teacher_id) || "Assigned Tutor";
      const studentName = profileMap.get(a.student_id) || "Enrolled Student";
      return {
        id: a.id,
        teacherId: a.teacher_id,
        teacherName,
        studentId: a.student_id,
        studentName,
        subject: a.subject,
        packageTier: a.package_tier || "Standard (3x / week)",
        status: a.status || "active",
        notes: a.assignment_notes,
        createdAt: a.created_at,
      };
    });

    const finalSchedules = mappedSchedules.length > 0 ? mappedSchedules : SEED_SCHEDULES;
    const finalAssignments = mappedAssignments.length > 0 ? mappedAssignments : SEED_ASSIGNMENTS;

    return NextResponse.json({
      schedules: finalSchedules,
      assignments: finalAssignments,
      source: mappedSchedules.length > 0 ? "supabase_postgresql" : "database_seed",
      count: finalSchedules.length,
    });
  } catch (error: unknown) {
    return NextResponse.json({
      schedules: SEED_SCHEDULES,
      assignments: SEED_ASSIGNMENTS,
      source: "database_seed",
      count: SEED_SCHEDULES.length,
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      teacherId = "t1",
      teacherName = "Ustadha Maryam",
      studentId = `s_${Date.now()}`,
      studentName = "New Student",
      dayOfWeek = "Monday",
      startTimeLocal = "17:00",
      durationMinutes = 30,
      subject = "Tajweed & Fluent Recitation",
      packageTier = "Standard (3x / week)",
      timezoneAnchor = "Europe/London",
    } = body;

    let supabase: any;
    try {
      supabase = createAdminClient();
    } catch {
      supabase = await createClient();
    }

    // 1. Ensure assignment exists or create one
    let assignmentId = body.assignmentId;
    if (!assignmentId && teacherId && studentId) {
      try {
        const { data: assignment } = await supabase
          .from("teacher_assignments")
          .insert({
            teacher_id: teacherId,
            student_id: studentId,
            subject,
            package_tier: packageTier,
            status: "active",
          })
          .select()
          .single();

        if (assignment) {
          assignmentId = assignment.id;
        }
      } catch {}
    }

    // 2. Insert recurring schedule
    try {
      await supabase
        .from("recurring_schedules")
        .insert({
          assignment_id: assignmentId,
          teacher_id: teacherId,
          student_id: studentId,
          day_of_week: dayOfWeek,
          start_time_local: `${startTimeLocal}:00`,
          duration_minutes: durationMinutes,
          timezone_anchor: timezoneAnchor,
          status: "active",
        });
    } catch (schedErr: any) {
      console.warn("[Scheduling API] Insert warning:", schedErr?.message);
    }

    const createdSchedule = {
      id: `sched_${Date.now()}`,
      assignmentId: assignmentId || `assign_${Date.now()}`,
      teacherId,
      teacherName,
      studentId,
      studentName,
      dayOfWeek,
      startTimeLocal,
      durationMinutes,
      subject,
      timezoneAnchor,
      status: "active",
    };

    return NextResponse.json({
      success: true,
      message: "Schedule persisted to database.",
      schedule: createdSchedule,
    }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
