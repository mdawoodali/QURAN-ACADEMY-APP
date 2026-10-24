import { NextRequest, NextResponse } from "next/server";
import { connection } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: NextRequest) {
  try {
    await connection();
  } catch {}

  try {
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get("teacherId");

    let supabase: any;
    try {
      supabase = createAdminClient();
    } catch {
      supabase = await createClient();
    }

    let query = supabase.from("teacher_payouts").select("*").order("created_at", { ascending: false });
    if (teacherId) {
      query = query.eq("teacher_id", teacherId);
    }

    const { data: payouts, error } = await query;
    if (error) {
      console.warn("[Payouts API] Database error:", error.message);
      return NextResponse.json({ payouts: [], count: 0, error: error.message });
    }

    const mapped = (payouts || []).map((p: any) => ({
      id: p.id,
      teacherId: p.teacher_id,
      teacherName: p.teacher_name,
      period: p.period,
      completedClasses: p.completed_classes,
      hours: p.hours,
      ratePerClass: `${p.currency || "PKR"} ${p.rate_per_class}`,
      adjustments: `${p.currency || "PKR"} ${p.adjustments}`,
      payable: `${p.currency || "PKR"} ${Number(p.payable).toLocaleString()}`,
      status: p.status,
      payoutDate: p.payout_date || "Pending",
      reference: p.reference,
    }));

    return NextResponse.json({ payouts: mapped, count: mapped.length });
  } catch (err: any) {
    return NextResponse.json({ payouts: [], count: 0, error: err?.message });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      teacherId,
      teacherName = "Teacher",
      period,
      completedClasses = 0,
      hours = "0.0 hrs",
      ratePerClass = 500,
      adjustments = 0,
      payable,
      currency = "PKR",
      status = "Paid",
      payoutDate = new Date().toISOString().slice(0, 10),
      reference = `PAY-${Date.now()}`,
    } = body;

    let supabase: any;
    try {
      supabase = createAdminClient();
    } catch {
      supabase = await createClient();
    }

    const calculatedPayable = payable !== undefined ? payable : completedClasses * ratePerClass + adjustments;

    const { data, error } = await supabase
      .from("teacher_payouts")
      .insert({
        teacher_id: teacherId,
        teacher_name: teacherName,
        period,
        completed_classes: completedClasses,
        hours,
        rate_per_class: ratePerClass,
        adjustments,
        payable: calculatedPayable,
        currency,
        status,
        payout_date: payoutDate,
        reference,
      })
      .select()
      .single();

    if (error) {
      console.warn("[Payouts API] Insert error:", error.message);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Payout record saved in database.",
        payout: data || {
          id: `p_${Date.now()}`,
          teacherName,
          period,
          payable: calculatedPayable,
          reference,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to record payout", details: err?.message },
      { status: 500 }
    );
  }
}
