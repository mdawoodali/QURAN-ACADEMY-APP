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

export interface CreateInvoiceInput {
  familyName?: string;
  studentName?: string;
  amount: number;
  currency?: string;
  paymentMethod?: string;
  transactionRef: string;
  packageTier?: string;
  receiptUrl?: string;
}

async function getSupabase() {
  try {
    return createAdminClient();
  } catch {
    return await createClient();
  }
}

export async function fetchInvoices(): Promise<InvoiceRecord[]> {
  const supabase: any = await getSupabase();
  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((inv: any) => ({
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
}

export async function createInvoiceRecord(input: CreateInvoiceInput): Promise<InvoiceRecord | null> {
  const supabase: any = await getSupabase();
  const newId = `rec_${Date.now()}`;
  const currency = (input.currency || "PKR").toUpperCase();

  const record: InvoiceRecord = {
    id: newId,
    familyName: input.familyName || "Learner Family",
    studentName: input.studentName || "Student",
    packageTier: input.packageTier || "Standard Plan",
    amount: Number(input.amount),
    currency,
    paymentMethod: input.paymentMethod || "Direct Bank Wire / Raast",
    transactionRef: input.transactionRef,
    submittedAt: new Date().toISOString(),
    status: "pending_verification",
    receiptUrl: input.receiptUrl,
  };

  const { error } = await supabase.from("invoices").insert({
    id: newId,
    family_name: record.familyName,
    package_id: "pkg_custom",
    package_name: record.packageTier,
    amount: record.amount,
    currency: record.currency,
    status: "pending_verification",
    payment_method: record.paymentMethod,
    transaction_ref: record.transactionRef,
    receipt_url: record.receiptUrl,
    metadata: {
      familyName: record.familyName,
      studentName: record.studentName,
      packageTier: record.packageTier,
    },
  });

  if (error) {
    console.warn("[InvoicesRepo] Insert warning:", error.message);
  }

  return record;
}
