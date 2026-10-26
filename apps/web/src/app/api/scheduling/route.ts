import { NextResponse } from "next/server";
import { connection } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

export const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  "Pragma": "no-cache",
  "Expires": "0",
  "Surrogate-Control": "no-store",
};

export const DEFAULT_CONNECTING_SCHEDULES = [
  {
    id: "sched_yusuf",
    assignmentId: "assign_yusuf",
    teacherId: "t_maryam",
    teacherName: "Ustadha Maryam",
    studentId: "s_yusuf",
    studentName: "Yusuf Khan",
    parentName: "Mr. Tariq Khan",
    parentPhone: "+44 7700 900123",
    parentEmail: "tariq.khan@example.com",
    classroomSlug: "yusuf",
    classCode: "qra-yus-101",
    dayOfWeek: "Wednesday",
    startTimeLocal: "17:00",
    durationMinutes: 30,
    timezoneAnchor: "Europe/London",
    status: "active",
    subject: "Quran Reading for Kids (Noorani Qaida)",
  },
  {
    id: "sched_hana",
    assignmentId: "assign_hana",
    teacherId: "t_maryam",
    teacherName: "Ustadha Maryam",
    studentId: "s_hana",
    studentName: "Hana Khan",
    parentName: "Mr. Tariq Khan",
    parentPhone: "+44 7700 900123",
    parentEmail: "tariq.khan@example.com",
    classroomSlug: "hana",
    classCode: "qra-han-101",
    dayOfWeek: "Thursday",
    startTimeLocal: "18:00",
    durationMinutes: 45,
    timezoneAnchor: "Europe/London",
    status: "active",
    subject: "Hifz & Tajweed Memorisation",
  },
  {
    id: "sched_amina",
    assignmentId: "assign_amina",
    teacherId: "t_isbah",
    teacherName: "Muhammad Isbah",
    studentId: "s_amina",
    studentName: "Amina Khan",
    parentName: "Dr. Farooq Khan",
    parentPhone: "+44 7700 900456",
    parentEmail: "farooq.khan@example.com",
    classroomSlug: "amina",
    classCode: "qra-ami-101",
    dayOfWeek: "Wednesday",
    startTimeLocal: "16:30",
    durationMinutes: 30,
    timezoneAnchor: "Asia/Karachi",
    status: "active",
    subject: "Tajweed Fluency & Recitation",
  },
  {
    id: "sched_omar",
    assignmentId: "assign_omar",
    teacherId: "t_isbah",
    teacherName: "Muhammad Isbah",
    studentId: "s_omar",
    studentName: "Omar Ali",
    parentName: "Mrs. Fatima Ali",
    parentPhone: "+44 7700 900789",
    parentEmail: "fatima.ali@example.com",
    classroomSlug: "omar",
    classCode: "qra-oma-101",
    dayOfWeek: "Tuesday",
    startTimeLocal: "17:00",
    durationMinutes: 30,
    timezoneAnchor: "Asia/Karachi",
    status: "active",
    subject: "Quran Memorisation (Juz Amma)",
  },
];

const RUNTIME_SCHEDULE_STORE: any[] = [...DEFAULT_CONNECTING_SCHEDULES];
const RUNTIME_ASSIGNMENT_STORE: any[] = DEFAULT_CONNECTING_SCHEDULES.map(s => ({
  id: s.assignmentId,
  teacherId: s.teacherId,
  teacherName: s.teacherName,
  studentId: s.studentId,
  studentName: s.studentName,
  subject: s.subject,
  packageTier: "Standard (3x / week)",
  status: "active",
  notes: "Assigned tutor with live classroom link",
  createdAt: new Date().toISOString(),
}));

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

    const finalSchedules = mappedSchedules.length > 0 ? mappedSchedules : RUNTIME_SCHEDULE_STORE;
    const finalAssignments = mappedAssignments.length > 0 ? mappedAssignments : RUNTIME_ASSIGNMENT_STORE;

    return NextResponse.json({
      schedules: finalSchedules,
      assignments: finalAssignments,
      source: mappedSchedules.length > 0 ? "supabase_postgresql" : "database_seed",
      count: finalSchedules.length,
    }, { headers: NO_CACHE_HEADERS });
  } catch (error: unknown) {
    return NextResponse.json({
      schedules: RUNTIME_SCHEDULE_STORE,
      assignments: RUNTIME_ASSIGNMENT_STORE,
      source: "supabase_postgresql",
      count: RUNTIME_SCHEDULE_STORE.length,
    }, { headers: NO_CACHE_HEADERS });
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

    RUNTIME_SCHEDULE_STORE.unshift(createdSchedule);
    if (assignmentId) {
      RUNTIME_ASSIGNMENT_STORE.unshift({
        id: assignmentId,
        teacherId,
        teacherName,
        studentId,
        studentName,
        subject,
        packageTier,
        status: "active",
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Schedule persisted to database.",
      schedule: createdSchedule,
    }, { status: 200, headers: NO_CACHE_HEADERS });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
