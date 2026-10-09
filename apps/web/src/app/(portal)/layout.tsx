import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import PortalLayoutClient from "./PortalLayoutClient";
import { connection } from "next/server";

export const instant = false;

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  await connection();
  
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (!user || authError) {
    redirect("/login");
  }

  // Determine user's full name from profiles table
  let fullName = "Unknown User";
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name')
    .eq('id', user.id)
    .single();

  if (profile) {
    fullName = `${profile.first_name} ${profile.last_name}`.trim() || fullName;
  }

  return (
    <PortalLayoutClient userName={fullName}>
      {children}
    </PortalLayoutClient>
  );
}
