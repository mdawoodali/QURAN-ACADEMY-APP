import { NextRequest, NextResponse } from "next/server";
import { connection } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

export const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  "Pragma": "no-cache",
  "Expires": "0",
  "Surrogate-Control": "no-store",
};

export async function GET(req: NextRequest) {
  try {
    await connection();
  } catch {}

  try {
    let supabase: any;
    try {
      supabase = createAdminClient();
    } catch {
      supabase = await createClient();
    }

    // 1. Total students count
    const { count: studentCount } = await supabase
      .from("student_details")
      .select("*", { count: "exact", head: true });

    // 2. Total approved and pending teachers count
    const { count: teacherCount } = await supabase
      .from("teacher_details")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved");

    const { count: pendingTeacherCount } = await supabase
      .from("teacher_details")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    // 3. Classes count
    const { count: totalClasses } = await supabase
      .from("class_sessions")
      .select("*", { count: "exact", head: true });

    // 4. Pending enrolments count
    const { count: pendingEnrolmentsCount } = await supabase
      .from("enrolments")
      .select("*", { count: "exact", head: true })
      .in("status", ["pending_trial", "pending_slot_match"]);

    // 4. Pending invoices count and total revenue
    const { data: invoices } = await supabase
      .from("invoices")
      .select("amount, currency, status");

    let monthlyRevenuePKR = 0;
    let pendingInvoicesCount = 0;

    if (invoices) {
      invoices.forEach((inv: any) => {
        if (inv.status === "paid") {
          const amt = Number(inv.amount) || 0;
          if (inv.currency === "PKR") monthlyRevenuePKR += amt;
          else if (inv.currency === "GBP") monthlyRevenuePKR += amt * 360;
          else if (inv.currency === "USD") monthlyRevenuePKR += amt * 278;
          else if (inv.currency === "EUR") monthlyRevenuePKR += amt * 300;
        } else if (inv.status === "pending_verification") {
          pendingInvoicesCount++;
        }
      });
    }

    // Format revenue
    const revenueDisplay = monthlyRevenuePKR > 0
      ? `PKR ${(monthlyRevenuePKR / 1000).toFixed(0)}k`
      : "PKR 0";

    return NextResponse.json({
      stats: {
        activeStudents: studentCount || 0,
        approvedTeachers: teacherCount || 0,
        pendingTeachersCount: pendingTeacherCount || 0,
        totalClassesToday: totalClasses || 0,
        monthlyRevenue: revenueDisplay,
        rawRevenuePKR: monthlyRevenuePKR,
        pendingInvoicesCount,
        pendingEnrolmentsCount: pendingEnrolmentsCount || 0,
      },
      source: "supabase_postgresql",
    }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    return NextResponse.json({
      stats: {
        activeStudents: 0,
        approvedTeachers: 0,
        pendingTeachersCount: 0,
        totalClassesToday: 0,
        monthlyRevenue: "PKR 0",
        rawRevenuePKR: 0,
        pendingInvoicesCount: 0,
        pendingEnrolmentsCount: 0,
      },
      source: "fallback",
      error: err?.message,
    }, { headers: NO_CACHE_HEADERS });
  }
}
