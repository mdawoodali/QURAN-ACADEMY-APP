import { createClient } from "@/utils/supabase/server";
import PortalLayoutClient from "./PortalLayoutClient";
import { connection } from "next/server";

export const instant = false;

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  await connection();
  
  let fullName = "Demo Student";

  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (user && !authError) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single();

      if (profile) {
        fullName = `${profile.first_name} ${profile.last_name}`.trim() || user.email || fullName;
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
