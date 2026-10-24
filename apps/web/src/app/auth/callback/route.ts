import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const cookieStore = await cookies();

  if (code) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error && data?.user) {
        // Retrieve or determine role
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, first_name, last_name")
          .eq("id", data.user.id)
          .single();

        const role = profile?.role || data.user.user_metadata?.role || "student";
        const name =
          `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim() ||
          data.user.user_metadata?.full_name ||
          data.user.email ||
          "Student";

        const targetPath =
          role === "admin"
            ? "/admin"
            : role === "teacher"
            ? "/teacher"
            : role === "parent"
            ? "/parent"
            : "/student";

        cookieStore.set("demo_role", role, { path: "/", maxAge: 60 * 60 * 24 * 7 });
        cookieStore.set("demo_user", name, { path: "/", maxAge: 60 * 60 * 24 * 7 });

        const redirectResponse = NextResponse.redirect(new URL(targetPath, origin));
        redirectResponse.cookies.set("demo_role", role, { path: "/", maxAge: 60 * 60 * 24 * 7 });
        redirectResponse.cookies.set("demo_user", name, { path: "/", maxAge: 60 * 60 * 24 * 7 });
        return redirectResponse;
      }
    } catch (err) {
      console.error("[AuthCallback] OAuth exchange error:", err);
    }
  }

  // URL to redirect to after sign in process completes or fails
  return NextResponse.redirect(new URL("/login?error=Google%20Authentication%20failed", origin));
}
