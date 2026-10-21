import { connection } from "next/server";
import { createClient } from "@/utils/supabase/server";
import ProfileForm from "./ProfileForm";

export default async function StudentProfile() {
  await connection();

  let initialData = {
    fullName: "Yusuf Khan",
    email: "yusuf.student@quranacademy.com",
    timezone: "Asia/Karachi",
    notifications: true,
  };

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: studentDetails } = await supabase
        .from("student_details")
        .select("full_name")
        .eq("id", user.id)
        .single();

      initialData = {
        fullName: studentDetails?.full_name || user.user_metadata?.full_name || "Yusuf Khan",
        email: user.email || "yusuf.student@quranacademy.com",
        timezone: "Asia/Karachi",
        notifications: true,
      };
    }
  } catch (err) {
    console.warn("Using demo student profile:", err);
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto w-full text-white">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif text-white mb-2">Profile Settings</h1>
        <p className="text-emerald-100/80 text-sm">Update your contact details, time zone, and notification preferences.</p>
      </div>
      
      <ProfileForm initialData={initialData} />
    </div>
  );
}
