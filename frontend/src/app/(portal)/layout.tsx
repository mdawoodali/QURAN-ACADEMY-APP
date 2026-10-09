import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import PortalLayoutClient from "./PortalLayoutClient";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (!user || authError) {
    redirect("/login");
  }

  // Determine user's full name by checking tables
  let fullName = "Unknown User";
  
  const { data: student } = await supabase.from('student_details').select('full_name').eq('id', user.id).single();
  if (student) {
    fullName = student.full_name;
  } else {
    const { data: teacher } = await supabase.from('teacher_details').select('full_name').eq('id', user.id).single();
    if (teacher) {
      fullName = teacher.full_name;
    }
  }

  return (
    <PortalLayoutClient userName={fullName}>
      {children}
    </PortalLayoutClient>
  );
}
