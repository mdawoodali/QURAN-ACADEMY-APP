import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

const COOKIES_TO_CLEAR = [
  "demo_role",
  "demo_user",
  "selected_ward",
  "selected_wards",
  "pending_oauth_role",
  "pending_oauth_wards",
  "auth_redirect",
];

async function handleSignOut(request: NextRequest, isGet = false) {
  const cookieStore = await cookies();

  // 1. Terminate Supabase Auth session on server
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.warn("[SignOutRoute] Supabase server signOut warning:", err);
  }

  // 2. Clear all server-managed cookies
  const allCookies = cookieStore.getAll();
  for (const c of allCookies) {
    if (COOKIES_TO_CLEAR.includes(c.name) || (c.name.startsWith("sb-") && c.name.includes("auth-token"))) {
      try {
        cookieStore.delete(c.name);
      } catch {}
    }
  }

  try {
    revalidatePath("/", "layout");
  } catch {}

  // 3. Construct response with explicit cookie deletion instructions
  const response = isGet
    ? NextResponse.redirect(new URL("/login", request.url))
    : NextResponse.json({ success: true, signedOut: true });

  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");

  for (const cookieName of COOKIES_TO_CLEAR) {
    response.cookies.set(cookieName, "", {
      path: "/",
      maxAge: 0,
      expires: new Date(0),
      sameSite: "lax",
    });
  }

  // Also purge all Supabase token cookies on response
  for (const c of allCookies) {
    if (c.name.startsWith("sb-") && c.name.includes("auth-token")) {
      response.cookies.set(c.name, "", {
        path: "/",
        maxAge: 0,
        expires: new Date(0),
        sameSite: "lax",
      });
    }
  }

  return response;
}

export async function POST(request: NextRequest) {
  return handleSignOut(request, false);
}

export async function GET(request: NextRequest) {
  return handleSignOut(request, true);
}
