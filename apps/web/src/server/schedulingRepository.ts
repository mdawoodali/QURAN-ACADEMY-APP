export interface TeacherAssignmentRecord {
  id: string;
  teacherId: string;
  teacherName: string;
  studentId: string;
  studentName: string;
  subject: string;
  packageTier: string;
  status: "active" | "paused" | "reassigned";
  notes?: string;
  createdAt: string;
}

export interface RecurringScheduleRecord {
  id: string;
  assignmentId: string;
  teacherId: string;
  teacherName: string;
  studentId: string;
  studentName: string;
  dayOfWeek: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  startTimeLocal: string;
  durationMinutes: number;
  timezoneAnchor: string;
  status: "active" | "paused";
  subject: string;
}

export interface ClassSessionRecord {
  id: string;
  scheduleId?: string;
  teacherId: string;
  teacherName: string;
  studentId: string;
  studentName: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  subject: string;
  status: "scheduled" | "live" | "completed" | "student_missed" | "cancelled";
  livekitRoomName: string;
}

// Client-safe fetchers that communicate with the server-side PostgreSQL route
export async function getAcademySchedules(): Promise<{
  schedules: RecurringScheduleRecord[];
  assignments: TeacherAssignmentRecord[];
  source: "supabase_postgresql" | "database_fixtures";
}> {
  try {
    const res = await fetch("/api/scheduling", { cache: "no-store" });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Could not fetch from /api/scheduling, using fallback", err);
  }

  return {
    schedules: [
      {
        id: "s1",
        assignmentId: "a1",
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
        id: "s2",
        assignmentId: "a2",
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
        id: "s3",
        assignmentId: "a2",
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
        id: "s4",
        assignmentId: "a2",
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
        id: "s5",
        assignmentId: "a3",
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
    ],
    assignments: [
      {
        id: "a1",
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
        id: "a2",
        teacherId: "t1",
        teacherName: "Ustadha Maryam",
        studentId: "s2",
        studentName: "Yusuf Khan",
        subject: "Noorani Qaida Foundation",
        packageTier: "Standard (3x / week)",
        status: "active",
        notes: "Focusing on Makharij articulation points.",
        createdAt: new Date().toISOString()
      }
    ],
    source: "database_fixtures"
  };
}

export async function addRecurringSchedule(data: {
  teacherId: string;
  teacherName: string;
  studentId: string;
  studentName: string;
  dayOfWeek: RecurringScheduleRecord["dayOfWeek"];
  startTimeLocal: string;
  durationMinutes: number;
  subject: string;
}): Promise<RecurringScheduleRecord> {
  try {
    const res = await fetch("/api/scheduling", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      const json = await res.json();
      return json.schedule;
    }
  } catch (err) {
    console.error("Failed to post schedule", err);
  }

  return {
    id: `sched_${Date.now()}`,
    assignmentId: `assign_${Date.now()}`,
    teacherId: data.teacherId,
    teacherName: data.teacherName,
    studentId: data.studentId,
    studentName: data.studentName,
    dayOfWeek: data.dayOfWeek,
    startTimeLocal: data.startTimeLocal,
    durationMinutes: data.durationMinutes,
    timezoneAnchor: "Europe/London",
    status: "active",
    subject: data.subject
  };
}
