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
  source: "supabase_postgresql";
}> {
  try {
    const res = await fetch(`/api/scheduling?_t=${Date.now()}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      return {
        schedules: data.schedules || [],
        assignments: data.assignments || [],
        source: "supabase_postgresql",
      };
    }
  } catch (err) {
    console.warn("[SchedulingRepo] Could not fetch from /api/scheduling:", err);
  }

  return {
    schedules: [],
    assignments: [],
    source: "supabase_postgresql",
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
}): Promise<RecurringScheduleRecord | null> {
  try {
    const res = await fetch("/api/scheduling", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const json = await res.json();
      return json.schedule;
    }
  } catch (err) {
    console.error("[SchedulingRepo] Failed to post schedule:", err);
  }
  return null;
}
