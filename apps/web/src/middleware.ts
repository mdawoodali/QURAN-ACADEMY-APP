import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/security/rateLimit";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
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
    "camera=(self), microphone=(self), geolocation=()"
  );

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // In local development or when Supabase keys are placeholders/local, allow direct access so portals can be tested
  const isDummyConfig =
    !supabaseUrl ||
    !supabaseKey ||
    supabaseKey.includes("dummy") ||
    supabaseUrl.includes("127.0.0.1") ||
    supabaseUrl.includes("localhost");

  // Check for local demo session cookie
  const demoRole = request.cookies.get("demo_role")?.value;

  if (isDummyConfig || demoRole) {
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthRoute =
    url.pathname.startsWith("/login") || url.pathname.startsWith("/register");
  const isProtectedRoute =
    url.pathname.startsWith("/student") ||
    url.pathname.startsWith("/teacher") ||
    url.pathname.startsWith("/admin") ||
    url.pathname.startsWith("/parent");

  if (!user && isProtectedRoute) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && isAuthRoute) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    url.pathname = profile ? `/${profile.role}` : "/student";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
