import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import PortalLayoutClient from "./PortalLayoutClient";
import { connection } from "next/server";

export const instant = false;

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  await connection();
  
  let fullName = "Demo Student";

  try {
    const cookieStore = await cookies();
    const demoRole = cookieStore.get("demo_role")?.value;
    const demoUser = cookieStore.get("demo_user")?.value;

    if (demoRole === "admin") {
      fullName = "Super Admin";
    } else if (demoRole === "teacher") {
      fullName = demoUser || "Muhammad Isbah";
    } else if (demoRole === "parent") {
      fullName = "Family Guardian";
    } else if (demoUser) {
      fullName = demoUser;
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (user && !authError) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single();

      if (profile) {
        fullName = `${profile.first_name} ${profile.last_name}`.trim() || user.user_metadata?.full_name || user.email || fullName;
      } else if (user.user_metadata?.full_name) {
        fullName = user.user_metadata.full_name;
      }
    }
  } catch (err) {
    console.warn("Supabase auth check bypassed for demo/preview mode:", err);
  }

  return (
    <PortalLayoutClient userName={fullName}>
      {children}
    </PortalLayoutClient>
  );
}
