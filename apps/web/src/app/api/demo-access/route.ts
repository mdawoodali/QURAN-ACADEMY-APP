import { NextResponse, type NextRequest } from "next/server";

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
      ? "Maryam Ahmed (Teacher)"
      : role === "parent"
      ? "Family Guardian"
      : "Demo Student";

  response.cookies.set("demo_user", userName, {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
