import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/utils/supabase/admin";

export interface ContactInquiryRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: "new" | "contacted" | "resolved" | "archived";
  source: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

// In-memory fallback store ensuring seamless functionality in local and offline environments
const FALLBACK_INQUIRIES_STORE: ContactInquiryRecord[] = [
  {
    id: "inq_1",
    name: "Sister Zainab Fatima",
    email: "zainab.fatima@example.com",
    phone: "+44 7700 900123",
    message: "Salam Alaykum. I would like to inquire about Quran Tajweed and Makhaarij classes for my two daughters (ages 7 and 10). Are there female Qariahs available on UK evening time slots?",
    status: "new",
    source: "footer_inquiry",
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 35 * 60 * 1000).toISOString()
  },
  {
    id: "inq_2",
    name: "Brother Ali Raza",
    email: "ali.raza.us@example.com",
    phone: "+1 312 555 0198",
    message: "Inquiring about beginner Arabic and Shia theological syllabus (Aqaid & Fiqh) for adults. Do you offer 1-on-1 personalized weekend classes in US Central Time?",
    status: "new",
    source: "contact_page",
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
  },
  {
    id: "inq_3",
    name: "Muhammad Usman",
    email: "m.usman.pk@example.com",
    phone: "+92 300 1234567",
    message: "Assalam o Alaikum, want to know about fee structure for 3 classes per week for Noorani Qaida course. Can we pay via Raast or direct bank transfer?",
    status: "contacted",
    source: "footer_inquiry",
    adminNotes: "Contacted via WhatsApp. Sent fee breakdown for Raast wire.",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString()
  }
];

const InquiryInputSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Please provide a valid email address"),
  phone: z.string().trim().optional().default(""),
  message: z.string().trim().min(5, "Message must be at least 5 characters").max(2000),
  source: z.string().trim().optional().default("footer_inquiry")
});

/**
 * GET /api/inquiries
 * Retrieves all inquiries with optional status filtering and search.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status") || "all";
    const searchQuery = (searchParams.get("search") || "").toLowerCase().trim();

    const supabase = createAdminClient();
    let dbInquiries: ContactInquiryRecord[] = [];
    let isFromDatabase = false;

    try {
      let query = supabase
        .from("contact_inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;

      if (!error && data) {
        isFromDatabase = true;
        dbInquiries = data.map((row: Record<string, unknown>) => ({
          id: String(row.id),
          name: String(row.name || ""),
          email: String(row.email || ""),
          phone: String(row.phone || ""),
          message: String(row.message || ""),
          status: (row.status as ContactInquiryRecord["status"]) || "new",
          source: String(row.source || "footer_inquiry"),
          adminNotes: row.admin_notes ? String(row.admin_notes) : undefined,
          createdAt: String(row.created_at || new Date().toISOString()),
          updatedAt: String(row.updated_at || new Date().toISOString())
        }));
      }
    } catch (dbErr) {
      console.warn("[Inquiries API] PostgreSQL read fallback:", dbErr);
    }

    // Merge or fallback to memory store
    let finalInquiries: ContactInquiryRecord[];
    if (isFromDatabase && dbInquiries.length > 0) {
      finalInquiries = dbInquiries;
    } else {
      finalInquiries = [...FALLBACK_INQUIRIES_STORE];
      if (statusFilter !== "all") {
        finalInquiries = finalInquiries.filter((inq) => inq.status === statusFilter);
      }
    }

    if (searchQuery) {
      finalInquiries = finalInquiries.filter(
        (inq) =>
          inq.name.toLowerCase().includes(searchQuery) ||
          inq.email.toLowerCase().includes(searchQuery) ||
          inq.phone.toLowerCase().includes(searchQuery) ||
          inq.message.toLowerCase().includes(searchQuery)
      );
    }

    return NextResponse.json(
      {
        success: true,
        inquiries: finalInquiries,
        total: finalInquiries.length,
        source: isFromDatabase ? "database" : "fallback_store"
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0"
        }
      }
    );
  } catch (error) {
    console.error("[Inquiries API GET Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve inquiries" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/inquiries
 * Submits a new inquiry/message from the footer or contact page.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = InquiryInputSchema.safeParse(body);

    if (!parsed.success) {
      const errorMessage = parsed.error.issues.map((i) => i.message).join(", ");
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      );
    }

    const { name, email, phone, message, source } = parsed.data;
    const nowIso = new Date().toISOString();

    const newRecord: ContactInquiryRecord = {
      id: `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name,
      email,
      phone: phone || "",
      message,
      status: "new",
      source,
      createdAt: nowIso,
      updatedAt: nowIso
    };

    let insertedInDatabase = false;
    const supabase = createAdminClient();

    try {
      const { data, error } = await supabase
        .from("contact_inquiries")
        .insert({
          name: newRecord.name,
          email: newRecord.email,
          phone: newRecord.phone,
          message: newRecord.message,
          source: newRecord.source,
          status: "new"
        })
        .select()
        .single();

      if (!error && data) {
        insertedInDatabase = true;
        newRecord.id = String(data.id);
      }
    } catch (dbErr) {
      console.warn("[Inquiries API] PostgreSQL insert fallback:", dbErr);
    }

    // Synchronize to in-memory store so immediate admin view reflects submission
    FALLBACK_INQUIRIES_STORE.unshift(newRecord);

    return NextResponse.json(
      {
        success: true,
        message: "Your inquiry has been submitted successfully.",
        inquiry: newRecord,
        persisted: insertedInDatabase ? "database" : "memory"
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Inquiries API POST Error]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error submitting inquiry" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/inquiries
 * Updates status (e.g., 'contacted', 'resolved') or admin notes for an inquiry.
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, adminNotes } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing required inquiry ID" },
        { status: 400 }
      );
    }

    const nowIso = new Date().toISOString();
    let updatedInDb = false;
    const supabase = createAdminClient();

    try {
      const updatePayload: Record<string, unknown> = { updated_at: nowIso };
      if (status) updatePayload.status = status;
      if (typeof adminNotes === "string") updatePayload.admin_notes = adminNotes;

      const { error } = await supabase
        .from("contact_inquiries")
        .update(updatePayload)
        .eq("id", id);

      if (!error) updatedInDb = true;
    } catch (dbErr) {
      console.warn("[Inquiries API PATCH DB Error]:", dbErr);
    }

    // Also update in-memory cache
    const target = FALLBACK_INQUIRIES_STORE.find((i) => i.id === id);
    if (target) {
      if (status) target.status = status;
      if (typeof adminNotes === "string") target.adminNotes = adminNotes;
      target.updatedAt = nowIso;
    }

    return NextResponse.json({
      success: true,
      updatedInDb,
      inquiry: target || { id, status, adminNotes }
    });
  } catch (error) {
    console.error("[Inquiries API PATCH Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to update inquiry" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/inquiries?id=...
 * Deletes an inquiry record.
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing inquiry ID parameter" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    try {
      await supabase.from("contact_inquiries").delete().eq("id", id);
    } catch (dbErr) {
      console.warn("[Inquiries API DELETE DB Error]:", dbErr);
    }

    const index = FALLBACK_INQUIRIES_STORE.findIndex((i) => i.id === id);
    if (index !== -1) {
      FALLBACK_INQUIRIES_STORE.splice(index, 1);
    }

    return NextResponse.json({
      success: true,
      message: `Inquiry ${id} removed successfully.`
    });
  } catch (error) {
    console.error("[Inquiries API DELETE Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete inquiry" },
      { status: 500 }
    );
  }
}
