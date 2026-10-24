import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

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

async function getSupabase() {
  try {
    return createAdminClient();
  } catch {
    return await createClient();
  }
}

export async function fetchEnrolments(): Promise<EnrolmentRecord[]> {
  const supabase: any = await getSupabase();
  const { data: dbEnrolments, error } = await supabase
    .from("enrolments")
    .select("*")
    .order("created_at", { ascending: false });

  if (!error && dbEnrolments && dbEnrolments.length > 0) {
    return dbEnrolments.map((e: any) => ({
      id: e.id,
      learner: e.learner_name,
      age: e.age || 10,
      programme: e.programme,
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
  }

  return [];
}
