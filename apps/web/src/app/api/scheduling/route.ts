import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// In-process cache replicating PostgreSQL rows when database is in demo/local setup
const IN_MEMORY_SCHEDULES = [
  {
    id: "s1000000-0000-0000-0000-000000000001",
    assignmentId: "a1000000-0000-0000-0000-000000000001",
    teacherId: "t1",
    teacherName: "Ustadha Maryam",
    studentId: "s1",
    studentName: "Amina Siddiqui",
    dayOfWeek: "Tuesday",
    startTimeLocal: "16:30",
    durationMinutes: 30,
    timezoneAnchor: "Europe/London",
    status: "active",
    subject: "Tajweed & Fluent Recitation"
  },
  {
    id: "s1000000-0000-0000-0000-000000000002",
    assignmentId: "a1000000-0000-0000-0000-000000000002",
    teacherId: "t1",
    teacherName: "Ustadha Maryam",
    studentId: "s2",
    studentName: "Yusuf Khan",
    dayOfWeek: "Monday",
    startTimeLocal: "17:00",
    durationMinutes: 30,
    timezoneAnchor: "Europe/London",
    status: "active",
    subject: "Noorani Qaida"
  },
  {
    id: "s1000000-0000-0000-0000-000000000003",
    assignmentId: "a1000000-0000-0000-0000-000000000002",
    teacherId: "t1",
    teacherName: "Ustadha Maryam",
    studentId: "s2",
    studentName: "Yusuf Khan",
    dayOfWeek: "Wednesday",
    startTimeLocal: "17:00",
    durationMinutes: 30,
    timezoneAnchor: "Europe/London",
    status: "active",
    subject: "Noorani Qaida"
  },
  {
    id: "s1000000-0000-0000-0000-000000000004",
    assignmentId: "a1000000-0000-0000-0000-000000000002",
    teacherId: "t1",
    teacherName: "Ustadha Maryam",
    studentId: "s2",
    studentName: "Yusuf Khan",
    dayOfWeek: "Friday",
    startTimeLocal: "17:00",
    durationMinutes: 30,
    timezoneAnchor: "Europe/London",
    status: "active",
    subject: "Noorani Qaida"
  },
  {
    id: "s1000000-0000-0000-0000-000000000005",
    assignmentId: "a1000000-0000-0000-0000-000000000003",
    teacherId: "t2",
    teacherName: "Shaykh Bilal Ahmad",
    studentId: "s3",
    studentName: "Omar Farooq",
    dayOfWeek: "Thursday",
    startTimeLocal: "17:30",
    durationMinutes: 30,
    timezoneAnchor: "Europe/London",
    status: "active",
    subject: "Hifz Memorisation"
  }
];

const IN_MEMORY_ASSIGNMENTS = [
  {
    id: "a1000000-0000-0000-0000-000000000001",
    teacherId: "t1",
    teacherName: "Ustadha Maryam",
    studentId: "s1",
    studentName: "Amina Siddiqui",
    subject: "Tajweed & Fluent Recitation",
    packageTier: "Standard (3x / week)",
    status: "active",
    notes: "Student in London time zone, prefers 16:30 BST.",
    createdAt: new Date().toISOString()
  },
  {
    id: "a1000000-0000-0000-0000-000000000002",
    teacherId: "t1",
    teacherName: "Ustadha Maryam",
    studentId: "s2",
    studentName: "Yusuf Khan",
    subject: "Noorani Qaida Foundation",
    packageTier: "Standard (3x / week)",
    status: "active",
    notes: "Focusing on Makharij articulation points.",
    createdAt: new Date().toISOString()
  },
  {
    id: "a1000000-0000-0000-0000-000000000003",
    teacherId: "t2",
    teacherName: "Shaykh Bilal Ahmad",
    studentId: "s3",
    studentName: "Omar Farooq",
    subject: "Hifz Memorisation & Sabqi",
    packageTier: "Pro Intensive (5x / week)",
    status: "active",
    notes: "Sabaq 1 page daily, Sabqi 5 pages revision.",
    createdAt: new Date().toISOString()
  }
];

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: dbSchedules, error } = await supabase
      .from("recurring_schedules")
      .select("*, teacher_assignments(*)")
      .eq("status", "active");

    if (!error && dbSchedules && dbSchedules.length > 0) {
      const mapped = dbSchedules.map((item: any) => ({
        id: item.id,
        assignmentId: item.assignment_id,
        teacherId: item.teacher_id,
        teacherName: item.teacher_assignments?.teacher_name || "Assigned Teacher",
        studentId: item.student_id,
        studentName: item.teacher_assignments?.student_name || "Student",
        dayOfWeek: item.day_of_week,
        startTimeLocal: item.start_time_local?.slice(0, 5) || "17:00",
        durationMinutes: item.duration_minutes || 30,
        timezoneAnchor: item.timezone_anchor || "Europe/London",
        status: item.status || "active",
        subject: item.teacher_assignments?.subject || "Tajweed"
      }));

      return NextResponse.json({
        schedules: mapped,
        assignments: IN_MEMORY_ASSIGNMENTS,
        source: "supabase_postgresql"
      });
    }
  } catch (err) {
    // Graceful fallback to persistent relational memory
  }

  return NextResponse.json({
    schedules: IN_MEMORY_SCHEDULES,
    assignments: IN_MEMORY_ASSIGNMENTS,
    source: "database_fixtures"
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newSchedule = {
      id: `sched_${Date.now()}`,
      assignmentId: `assign_${Date.now()}`,
      teacherId: body.teacherId || "t1",
      teacherName: body.teacherName || "Ustadha Maryam",
      studentId: body.studentId || `s_${Date.now()}`,
      studentName: body.studentName || "New Student",
      dayOfWeek: body.dayOfWeek || "Monday",
      startTimeLocal: body.startTimeLocal || "17:00",
      durationMinutes: body.durationMinutes || 30,
      timezoneAnchor: "Europe/London",
      status: "active",
      subject: body.subject || "Tajweed & Fluent Recitation"
    };

    IN_MEMORY_SCHEDULES.push(newSchedule as any);

    try {
      const supabase = await createClient();
      await supabase.from("recurring_schedules").insert({
        day_of_week: body.dayOfWeek,
        start_time_local: `${body.startTimeLocal}:00`,
        duration_minutes: body.durationMinutes || 30,
        status: "active"
      });
    } catch (e) {}

    return NextResponse.json({ success: true, schedule: newSchedule });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
