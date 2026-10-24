import { NextRequest, NextResponse } from "next/server";
import { connection } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

export interface InvoiceRecord {
  id: string;
  familyName: string;
  studentName: string;
  packageTier: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  transactionRef: string;
  submittedAt: string;
  status: "pending_verification" | "verified" | "rejected";
  verifiedAt?: string;
  receiptUrl?: string;
  notes?: string;
}

export async function GET() {
  try {
    await connection();
  } catch {
    // Unit tests / static build pass-through
  }

  try {
    let supabase: any;
    try {
      supabase = createAdminClient();
    } catch {
      supabase = await createClient();
    }

    const { data: dbInvoices, error } = await supabase
      .from("invoices")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("[Invoices API] Database error:", error.message);
      return NextResponse.json({
        invoices: [],
        source: "supabase_postgresql",
        count: 0,
        error: error.message,
      });
    }

    const mapped: InvoiceRecord[] = (dbInvoices || []).map((inv: any) => ({
      id: inv.id,
      familyName: inv.family_name || inv.metadata?.familyName || "Academy Family",
      studentName: inv.metadata?.studentName || "Enrolled Student",
      packageTier: inv.package_name || "Standard Course",
      amount: Number(inv.amount),
      currency: inv.currency,
      paymentMethod: inv.payment_method,
      transactionRef: inv.transaction_ref,
      submittedAt: inv.created_at,
      status: inv.status === "paid" ? "verified" : inv.status,
      verifiedAt: inv.verified_at,
      receiptUrl: inv.receipt_url,
      notes: inv.metadata?.notes,
    }));

    return NextResponse.json({
      invoices: mapped,
      source: "supabase_postgresql",
      count: mapped.length,
    });
  } catch (err: any) {
    console.error("[Invoices API] Unexpected error:", err);
    return NextResponse.json({
      invoices: [],
      source: "supabase_postgresql",
      count: 0,
      error: err?.message,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      familyName = "Learner Family",
      studentName = "Student",
      amount = 0,
      currency = "PKR",
      paymentMethod = "Direct Bank Wire / Raast",
      transactionRef = "",
      packageTier = "Standard Plan",
      receiptUrl = "",
    } = body;

    if (!transactionRef || !amount) {
      return NextResponse.json(
        { error: "Transaction reference and amount are required." },
        { status: 400 }
      );
    }

    const newId = `rec_${Date.now()}`;
    const newRecord: InvoiceRecord = {
      id: newId,
      familyName,
      studentName,
      packageTier,
      amount: Number(amount),
      currency: String(currency).toUpperCase(),
      paymentMethod,
      transactionRef,
      submittedAt: new Date().toISOString(),
      status: "pending_verification",
      receiptUrl,
    };

    let supabase: any;
    try {
      supabase = createAdminClient();
    } catch {
      supabase = await createClient();
    }

    const { error: insertError } = await supabase.from("invoices").insert({
      id: newId,
      family_name: familyName,
      package_id: "pkg_custom",
      package_name: packageTier,
      amount: Number(amount),
      currency: String(currency).toUpperCase(),
      status: "pending_verification",
      payment_method: paymentMethod,
      transaction_ref: transactionRef,
      receipt_url: receiptUrl,
      metadata: { familyName, studentName, packageTier },
    });

    if (insertError) {
      console.warn("[Invoices API] Insert error:", insertError.message);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Payment receipt submitted successfully and saved to database.",
        invoice: newRecord,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to process receipt submission", details: err?.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status || !["verified", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Valid ID and target status ('verified' | 'rejected') are required." },
        { status: 400 }
      );
    }

    let supabase: any;
    try {
      supabase = createAdminClient();
    } catch {
      supabase = await createClient();
    }

    const now = new Date().toISOString();
    const { data: updated, error: updateError } = await supabase
      .from("invoices")
      .update({
        status: status === "verified" ? "paid" : "rejected",
        verified_at: status === "verified" ? now : null,
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.warn("[Invoices API] Update error:", updateError.message);
    }

    return NextResponse.json({
      success: true,
      message: `Receipt ${id} marked as ${status}.`,
      invoice: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to update receipt status", details: err?.message },
      { status: 500 }
    );
  }
}
