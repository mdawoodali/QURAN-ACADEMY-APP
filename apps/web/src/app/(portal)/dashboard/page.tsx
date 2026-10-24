import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardDispatcher() {
  const cookieStore = await cookies();
  const demoRole = cookieStore.get("demo_role")?.value;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      const role = profile?.role || user.user_metadata?.role || demoRole || "student";
      if (role === "admin") redirect("/admin");
      if (role === "teacher") redirect("/teacher");
      if (role === "parent") redirect("/parent");
      redirect("/student");
    }
  } catch (err) {
    console.warn("[DashboardDispatcher] Auth check error, falling back to role cookie:", err);
  }

  if (demoRole === "admin") redirect("/admin");
  if (demoRole === "teacher") redirect("/teacher");
  if (demoRole === "parent") redirect("/parent");
  if (demoRole === "student") redirect("/student");

  // If no session exists, redirect to login
  redirect("/login");
}
