import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
  const role = request.nextUrl.searchParams.get("role") || "student";
  const target =
    role === "admin"
      ? "/admin"
      : role === "teacher"
      ? "/teacher"
      : role === "parent"
      ? "/parent"
      : "/student";

  const response = NextResponse.redirect(new URL(target, request.url));

  // Anti-caching header to prevent stale redirects
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");

  // Set demo role cookie to bypass middleware on preview/demo evaluations
  response.cookies.set("demo_role", role, {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });

  const userName =
    role === "admin"
      ? "Super Admin"
      : role === "teacher"
      ? "Demo Teacher"
      : role === "parent"
      ? "Family Guardian"
      : "Demo Student";

  response.cookies.set("demo_user", userName, {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });

  try {
    revalidatePath("/", "layout");
  } catch {}

  return response;
}
