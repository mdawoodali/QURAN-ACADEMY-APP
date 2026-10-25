import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/security/rateLimit";


function isRoleAuthorizedForPath(role: string, pathname: string): boolean {
  if (role === "admin" || role === "superadmin") {
    return true; // Admins can supervise all portals
  }
  if (pathname.startsWith("/admin")) {
    return false; // Only admin can access /admin
  }
  if (pathname.startsWith("/teacher")) {
    return role === "teacher";
  }
  if (pathname.startsWith("/parent")) {
    return role === "parent";
  }
  if (pathname.startsWith("/student")) {
    return role === "student" || role === "parent" || role === "teacher";
  }
  return true;
}

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // 0. OAuth Auth Code Interception: If Supabase redirects auth code to root /?code=... or any non-callback route,
  // immediately forward to /auth/callback to finalize session exchange and enter the dashboard.
  if (url.searchParams.has("code") && url.pathname !== "/auth/callback") {
    const callbackUrl = new URL("/auth/callback", request.url);
    callbackUrl.search = url.search;
    return NextResponse.redirect(callbackUrl);
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";

  // 1. API Rate Limiting Enforcement (thwarts DDoS, brute-force & token abuse)
  if (url.pathname.startsWith("/api/")) {
    const rateLimit = checkRateLimit(ip, url.pathname);

    if (!rateLimit.allowed) {
      return new NextResponse(
        JSON.stringify({
          error: "Rate limit exceeded. Please wait before retrying.",
          retryAfterSeconds: rateLimit.retryAfterSeconds,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(rateLimit.retryAfterSeconds),
            "X-RateLimit-Limit": String(rateLimit.limit),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(rateLimit.resetTime),
          },
        }
      );
    }
  }

  let response = NextResponse.next({
    request,
  });

  // 2. Attach OWASP Recommended Security & Safeguarding Headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(self), microphone=(self), geolocation=(self)"
  );

  const isAuthRoute =
    url.pathname.startsWith("/login") || url.pathname.startsWith("/register");
  const isProtectedRoute =
    url.pathname.startsWith("/student") ||
    url.pathname.startsWith("/teacher") ||
    url.pathname.startsWith("/admin") ||
    url.pathname.startsWith("/parent");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // In local development or when Supabase keys are placeholders/local, allow direct access so portals can be tested
  const isDummyConfig =
    !supabaseUrl ||
    !supabaseKey ||
    supabaseKey.includes("dummy") ||
    supabaseUrl.includes("127.0.0.1") ||
    supabaseUrl.includes("localhost");

  // Check for authorized role or demo evaluation session cookie
  const demoRole = request.cookies.get("demo_role")?.value;
  const validRoles = ["student", "teacher", "parent", "admin", "superadmin"];

  if (demoRole && validRoles.includes(demoRole)) {
    // Enforce role boundary even for demo roles to prevent cross-portal access
    if (isProtectedRoute && !isRoleAuthorizedForPath(demoRole, url.pathname)) {
      url.pathname = `/${demoRole}`;
      return NextResponse.redirect(url);
    }
    return response;
  }

  if (isDummyConfig) {
    return response;
  }



  // Fast-path for public marketing and content pages (/, /about-us, /resources, etc.)
  // Never block public page rendering on external Supabase auth round-trips
  if (!isAuthRoute && !isProtectedRoute) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  let user = null;
  try {
    const authPromise = supabase.auth.getUser();
    const timeoutPromise = new Promise<{ data: { user: null } }>((resolve) =>
      setTimeout(() => resolve({ data: { user: null } }), 2500)
    );
    const result = await Promise.race([authPromise, timeoutPromise]);
    user = result?.data?.user || null;
  } catch (authErr) {
    console.warn("[Middleware Auth Check Timeout/Error]", authErr);
    user = null;
  }

  if (!user && isProtectedRoute) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && isProtectedRoute) {
    let userRole = (user.user_metadata?.role as string) || (user.app_metadata?.role as string) || "student";
    try {
      const profilePromise = supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      const profileTimeout = new Promise<{ data: null }>((resolve) =>
        setTimeout(() => resolve({ data: null }), 1500)
      );
      const res: any = await Promise.race([profilePromise, profileTimeout]);
      if (res?.data?.role) userRole = res.data.role;
    } catch {
      // Keep userRole fallback
    }

    if (!isRoleAuthorizedForPath(userRole, url.pathname)) {
      url.pathname = `/${userRole}`;
      return NextResponse.redirect(url);
    }
  }

  if (user && isAuthRoute) {
    let profileRole = "student";
    try {
      const profilePromise = supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      const profileTimeout = new Promise<{ data: null }>((resolve) =>
        setTimeout(() => resolve({ data: null }), 1500)
      );
      const res: any = await Promise.race([profilePromise, profileTimeout]);
      if (res?.data?.role) profileRole = res.data.role;
    } catch {
      profileRole = "student";
    }

    url.pathname = `/${profileRole}`;
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
