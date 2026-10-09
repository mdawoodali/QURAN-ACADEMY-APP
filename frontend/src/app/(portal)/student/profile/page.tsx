import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";

export default async function StudentProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch student details from the database
  const { data: studentDetails } = await supabase
    .from("student_details")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const initialData = {
    fullName: studentDetails?.full_name || user.user_metadata?.full_name || "Unknown User",
    email: user.email || "",
    timezone: "Asia/Karachi", // Default for now
    notifications: true,
  };

  return (
    <div className="p-4 md:p-8 h-full bg-[#F8F9FA] text-[#111827] max-w-4xl mx-auto w-full">
      <h1 className="text-3xl font-serif text-[#0C4A3A] mb-8">Profile Settings</h1>
      
      <ProfileForm initialData={initialData} />
    </div>
  );
}
