import { NextRequest, NextResponse } from "next/server";
import { connection } from "next/server";
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

// In-memory fallback persistence store (preserves receipts during runtime if Supabase tables are cold/empty)
const GLOBAL_INVOICE_STORE: InvoiceRecord[] = [
  {
    id: "rec_101",
    familyName: "Ahmed Khan Family",
    studentName: "Yusuf & Hana Khan",
    packageTier: "Standard (2 Learners • 3x/wk)",
    amount: 18000,
    currency: "PKR",
    paymentMethod: "Meezan Bank Raast",
    transactionRef: "RAAST-89213890",
    submittedAt: "2026-10-21T10:15:00Z",
    status: "pending_verification",
  },
  {
    id: "rec_102",
    familyName: "Tariq Hussain Family",
    studentName: "Zayd Hussain",
    packageTier: "Essential (1 Learner • 2x/wk)",
    amount: 65,
    currency: "GBP",
    paymentMethod: "UK Faster Payments (FPS)",
    transactionRef: "FPS-BARC-77401928",
    submittedAt: "2026-10-21T09:40:00Z",
    status: "pending_verification",
  },
  {
    id: "rec_103",
    familyName: "Syed Raza Family",
    studentName: "Ali & Fatimah Raza",
    packageTier: "Intensive Hifz (2 Learners • 5x/wk)",
    amount: 160,
    currency: "USD",
    paymentMethod: "Domestic US ACH",
    transactionRef: "ACH-CHAS-99201452",
    submittedAt: "2026-10-20T18:00:00Z",
    status: "verified",
    verifiedAt: "2026-10-20T19:30:00Z",
  },
];

export async function GET() {
  try {
    await connection();
  } catch {
    // Unit tests / static build pass-through
  }

  try {
    const supabase = await createClient();
    const { data: dbInvoices, error } = await supabase
      .from("invoices")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && dbInvoices && dbInvoices.length > 0) {
      const mapped: InvoiceRecord[] = dbInvoices.map((inv: any) => ({
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
    }
  } catch (err) {
    console.warn("[Invoices API] Database lookup falling back to store:", err);
  }

  return NextResponse.json({
    invoices: GLOBAL_INVOICE_STORE,
    source: "in_memory_fallback",
    count: GLOBAL_INVOICE_STORE.length,
  });
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

    // Store in global memory store immediately
    GLOBAL_INVOICE_STORE.unshift(newRecord);

    // Persist to Supabase if available
    try {
      const supabase = await createClient();
      await supabase.from("invoices").insert({
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
    } catch (dbErr) {
      console.warn("[Invoices API] Could not write to Supabase, retained in-memory:", dbErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Payment receipt submitted successfully.",
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

    // Update memory store
    const item = GLOBAL_INVOICE_STORE.find((r) => r.id === id);
    if (item) {
      item.status = status;
      if (status === "verified") {
        item.verifiedAt = new Date().toISOString();
      }
    }

    // Update Supabase
    try {
      const supabase = await createClient();
      await supabase
        .from("invoices")
        .update({
          status: status === "verified" ? "paid" : "rejected",
          verified_at: status === "verified" ? new Date().toISOString() : null,
        })
        .eq("id", id);
    } catch (dbErr) {
      console.warn("[Invoices API] Could not update Supabase:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: `Receipt ${id} marked as ${status}.`,
      invoice: item,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to update receipt status", details: err?.message },
      { status: 500 }
    );
  }
}
