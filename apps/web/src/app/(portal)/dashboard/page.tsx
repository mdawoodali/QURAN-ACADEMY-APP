import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardDispatcher() {
  const cookieStore = await cookies();
  const demoRole = cookieStore.get("demo_role")?.value;
  let targetPath: string | null = null;

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
      if (role === "admin" || role === "superadmin") targetPath = "/admin";
      else if (role === "teacher") targetPath = "/teacher";
      else if (role === "parent") targetPath = "/parent";
      else targetPath = "/student";
    }
  } catch (err) {
    console.warn("[DashboardDispatcher] Auth check warning, falling back to role cookie:", err);
  }

  // Perform redirection outside try/catch so Next.js NEXT_REDIRECT is not swallowed
  if (targetPath) {
    redirect(targetPath);
  }

  if (demoRole === "admin" || demoRole === "superadmin") redirect("/admin");
  if (demoRole === "teacher") redirect("/teacher");
  if (demoRole === "parent") redirect("/parent");
  if (demoRole === "student") redirect("/student");

  // If no session exists, redirect to login
  redirect("/login");
}
