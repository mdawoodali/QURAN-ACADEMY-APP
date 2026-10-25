import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { sanitizeRedirectPath } from "@/lib/security/redirect";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const cookieStore = await cookies();

  const nextParam =
    requestUrl.searchParams.get("next") ||
    requestUrl.searchParams.get("redirect") ||
    cookieStore.get("auth_redirect")?.value;

  if (cookieStore.has("auth_redirect")) {
    cookieStore.delete("auth_redirect");
  }
  const safeRedirect = sanitizeRedirectPath(nextParam);

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
          .maybeSingle();

        const pendingRole = cookieStore.get("pending_oauth_role")?.value;
        if (cookieStore.has("pending_oauth_role")) {
          cookieStore.delete("pending_oauth_role");
        }

        const role = profile?.role || pendingRole || (data.user.user_metadata?.role as string | undefined);
        const name =
          `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim() ||
          data.user.user_metadata?.full_name ||
          data.user.email?.split("@")[0] ||
          "Student";

        // If the user has NO assigned role (e.g. brand new user who signed in without choosing a role),
        // redirect them to the role selection page so they are explicitly asked what they are signing up as!
        if (!role) {
          cookieStore.set("demo_user", name, { path: "/", maxAge: 60 * 60 * 24 * 7 });
          const roleSelectResponse = NextResponse.redirect(new URL("/register/select-role", origin));
          roleSelectResponse.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
          cookieStore.getAll().forEach((cookie) => {
            roleSelectResponse.cookies.set(cookie.name, cookie.value, {
              path: "/",
              sameSite: "lax",
              secure: process.env.NODE_ENV === "production",
            });
          });
          return roleSelectResponse;
        }

        // Upsert role into profiles table if not present
        if (!profile?.role && role) {
          try {
            await supabase.from("profiles").upsert({
              id: data.user.id,
              role,
              email: data.user.email,
              first_name: name.split(" ")[0] || "User",
              last_name: name.split(" ").slice(1).join(" ") || "",
            });
          } catch (upsertErr) {
            console.warn("[AuthCallback] Profiles upsert error:", upsertErr);
          }
        }

        const targetPath =
          safeRedirect ||
          (role === "admin"
            ? "/admin"
            : role === "teacher"
            ? "/teacher"
            : role === "parent"
            ? "/parent"
            : "/student");

        cookieStore.set("demo_role", role, { path: "/", maxAge: 60 * 60 * 24 * 7 });
        cookieStore.set("demo_user", name, { path: "/", maxAge: 60 * 60 * 24 * 7 });

        try {
          revalidatePath("/", "layout");
        } catch {}

        const redirectResponse = NextResponse.redirect(new URL(targetPath, origin));
        redirectResponse.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");

        // Transfer all cookies from cookieStore (including Supabase auth tokens) to redirect response
        cookieStore.getAll().forEach((cookie) => {
          redirectResponse.cookies.set(cookie.name, cookie.value, {
            path: "/",
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
          });
        });
        redirectResponse.cookies.set("demo_role", role, { path: "/", maxAge: 60 * 60 * 24 * 7 });
        redirectResponse.cookies.set("demo_user", name, { path: "/", maxAge: 60 * 60 * 24 * 7 });
        return redirectResponse;
      }
    } catch (err) {
      console.error("[AuthCallback] OAuth exchange error:", err);
    }
  }

  // URL to redirect to after sign in process completes or fails
  const errorRedirect = NextResponse.redirect(new URL("/login?error=Google%20Authentication%20failed", origin));
  errorRedirect.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  return errorRedirect;
}
