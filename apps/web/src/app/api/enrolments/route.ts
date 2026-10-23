import { NextRequest, NextResponse } from "next/server";
import { connection } from "next/server";
import { createClient } from "@/utils/supabase/server";

export interface EnrolmentRecord {
  id: string;
  learner: string;
  age: number;
  programme: string;
  matchedTeacher: string;
  assessmentStage: string;
  status: "trial_booked" | "placement_review" | "awaiting_payment" | "active";
  country?: string;
  city?: string;
  createdAt?: string;
}

const GLOBAL_ENROLMENT_STORE: EnrolmentRecord[] = [
  {
    id: "e1",
    learner: "Yusuf Khan",
    age: 9,
    programme: "Kids Reading & Noorani Qaida",
    matchedTeacher: "Ustadha Maryam Ahmed",
    assessmentStage: "Beginner • Qaida Lesson 3",
    status: "active",
    country: "Pakistan",
    city: "Lahore",
  },
  {
    id: "e2",
    learner: "Amina Khan",
    age: 11,
    programme: "Tajweed Fluency",
    matchedTeacher: "Ustadha Maryam Ahmed",
    assessmentStage: "Intermediate • Makhaarij Evaluated",
    status: "active",
    country: "United Kingdom",
    city: "London",
  },
  {
    id: "e3",
    learner: "Omar Ali",
    age: 14,
    programme: "Hifz & Memorisation",
    matchedTeacher: "Sheikh Bilal Hassan",
    assessmentStage: "Revision Assessment (Juz 30)",
    status: "placement_review",
    country: "United States",
    city: "Dallas",
  },
  {
    id: "e4",
    learner: "Zayd Farooq",
    age: 8,
    programme: "Kids Reading & Noorani Qaida",
    matchedTeacher: "Ustadha Fatima Zahra",
    assessmentStage: "Free Trial Complete • Highly Recommended",
    status: "awaiting_payment",
    country: "Canada",
    city: "Toronto",
  },
  {
    id: "e5",
    learner: "Maryam Rizvi",
    age: 10,
    programme: "Tajweed & Islamic Studies",
    matchedTeacher: "Sheikh Bilal Hassan",
    assessmentStage: "Trial Requested • Timezone UTC+1",
    status: "trial_booked",
    country: "United Kingdom",
    city: "Birmingham",
  },
];

export async function GET() {
  try {
    await connection();
  } catch {
    // Unit tests / static build pass-through
  }

  try {
    const supabase = await createClient();
    const { data: dbStudents, error } = await supabase
      .from("student_details")
      .select("*, profiles(*)")
      .order("created_at", { ascending: false });

    if (!error && dbStudents && dbStudents.length > 0) {
      const dbMapped: EnrolmentRecord[] = dbStudents.map((s: any) => {
        const profile = s.profiles || {};
        const fullName = `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || s.father_name || "New Student";
        return {
          id: s.id,
          learner: fullName,
          age: s.age || 10,
          programme: s.address?.includes("Program:") ? s.address.split("Program:")[1].trim() : "Tajweed Fluency",
          matchedTeacher: "Pending Assignment",
          assessmentStage: "Trial Requested • Auto-Registered",
          status: "trial_booked",
          country: s.country,
          city: s.city,
          createdAt: s.created_at,
        };
      });

      // Combine real database enrolments with initial fixtures
      const combined = [...dbMapped, ...GLOBAL_ENROLMENT_STORE.filter((g) => !dbMapped.some((d) => d.id === g.id))];

      return NextResponse.json({
        enrolments: combined,
        source: "supabase_postgresql",
        count: combined.length,
      });
    }
  } catch (err) {
    console.warn("[Enrolments API] Database lookup falling back to store:", err);
  }

  return NextResponse.json({
    enrolments: GLOBAL_ENROLMENT_STORE,
    source: "in_memory_fallback",
    count: GLOBAL_ENROLMENT_STORE.length,
  });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, matchedTeacher, assessmentStage } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "Enrolment ID and status are required." },
        { status: 400 }
      );
    }

    const item = GLOBAL_ENROLMENT_STORE.find((e) => e.id === id);
    if (item) {
      item.status = status;
      if (matchedTeacher) item.matchedTeacher = matchedTeacher;
      if (assessmentStage) item.assessmentStage = assessmentStage;
    }

    return NextResponse.json({
      success: true,
      message: `Enrolment ${id} status updated to ${status}.`,
      enrolment: item,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to update enrolment", details: err?.message },
      { status: 500 }
    );
  }
}
