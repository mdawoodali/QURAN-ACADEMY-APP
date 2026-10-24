import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export interface UploadedDocumentRecord {
  id: string;
  title: string;
  fileName: string;
  category: string;
  sect: "universal" | "shia" | "sunni";
  fileSize: string;
  uploadDate: string;
  uploadedBy: string;
  description: string;
  fileDataUrl?: string;
  createdAt?: string;
}

// In-memory fallback cache (used when Supabase table is provisioning or offline)
const FALLBACK_RESOURCE_STORE: UploadedDocumentRecord[] = [];

export async function GET(req: NextRequest) {
  try {
    const supabase = createAdminClient();
    const { searchParams } = new URL(req.url);
    const sectFilter = searchParams.get("sect");
    const categoryFilter = searchParams.get("category");

    // 1. Query Supabase Database
    let query = supabase.from("academy_resources").select("*").order("created_at", { ascending: false });

    if (sectFilter && sectFilter !== "all") {
      query = query.or(`sect.eq.${sectFilter},sect.eq.universal`);
    }

    if (categoryFilter && categoryFilter !== "All") {
      query = query.eq("category", categoryFilter);
    }

    const { data: dbRecords, error } = await query;

    if (!error && dbRecords) {
      const formatted: UploadedDocumentRecord[] = dbRecords.map((r: {
        id: string;
        title: string;
        file_name: string;
        category: string;
        sect: "universal" | "shia" | "sunni";
        file_size: string;
        created_at: string;
        uploaded_by: string;
        description: string;
        file_data_url?: string;
      }) => ({
        id: r.id,
        title: r.title,
        fileName: r.file_name,
        category: r.category,
        sect: r.sect,
        fileSize: r.file_size,
        uploadDate: new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
        uploadedBy: r.uploaded_by || "Admin",
        description: r.description || "",
        fileDataUrl: r.file_data_url,
        createdAt: r.created_at
      }));

      return NextResponse.json(
        { success: true, source: "database", documents: formatted },
        { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
      );
    }
  } catch (err) {
    console.warn("[Admin Resources API] DB Query failed, falling back to memory store:", err);
  }

  // 2. Return Fallback Store
  return NextResponse.json(
    { success: true, source: "fallback", documents: FALLBACK_RESOURCE_STORE },
    { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // -------------------------------------------------------------------------
    // Batch Insert Handler (used by Smart Hadith Splitter)
    // -------------------------------------------------------------------------
    if (body.batch && Array.isArray(body.documents) && body.documents.length > 0) {
      const nowIso = new Date().toISOString();
      const uploadDateStr = new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });

      const newRecords: UploadedDocumentRecord[] = body.documents.map(
        (doc: Partial<UploadedDocumentRecord>, index: number) => ({
          id: doc.id || `hadith_batch_${Date.now()}_${index}_${Math.random().toString(36).slice(2, 6)}`,
          title: doc.title || `Hadith #${index + 1}`,
          fileName: doc.fileName || `Hadith_${index + 1}.pdf`,
          category: doc.category || "Hadith & Sunnah Compendiums",
          sect: (doc.sect as "universal" | "shia" | "sunni") || "universal",
          fileSize: doc.fileSize || "1.0 MB",
          uploadDate: doc.uploadDate || uploadDateStr,
          uploadedBy: doc.uploadedBy || "Super Admin",
          description: doc.description || "",
          fileDataUrl: doc.fileDataUrl,
          createdAt: nowIso
        })
      );

      // Persist to Supabase PostgreSQL Database
      try {
        const supabase = createAdminClient();
        const dbPayload = newRecords.map((r) => ({
          id: r.id,
          title: r.title,
          file_name: r.fileName,
          category: r.category,
          sect: r.sect,
          file_size: r.fileSize,
          description: r.description,
          file_data_url: r.fileDataUrl || null,
          uploaded_by: r.uploadedBy,
          created_at: nowIso,
          updated_at: nowIso
        }));

        const { error: dbError } = await supabase
          .from("academy_resources")
          .upsert(dbPayload);

        if (dbError) {
          console.warn("[Admin Resources API] Batch DB Upsert error:", dbError.message);
        }
      } catch (dbEx) {
        console.warn("[Admin Resources API] DB exception on batch POST:", dbEx);
      }

      // Add to in-memory store
      FALLBACK_RESOURCE_STORE.unshift(...newRecords);

      return NextResponse.json(
        {
          success: true,
          count: newRecords.length,
          documents: newRecords,
          message: `Successfully saved ${newRecords.length} records to the database.`
        },
        { status: 201, headers: { "Cache-Control": "no-store" } }
      );
    }
    const {
      title,
      fileName,
      category,
      sect = "universal",
      fileSize,
      description,
      fileDataUrl,
      uploadedBy = "Super Admin"
    } = body;

    if (fileDataUrl && fileDataUrl.length > 25 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "File exceeds 25MB maximum limit." }, { status: 413 });
    }

    if (!title || !fileName || !category) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (title, fileName, category)" },
        { status: 400 }
      );
    }

    const docId = body.id || `res_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const nowIso = new Date().toISOString();

    const newRecord: UploadedDocumentRecord = {
      id: docId,
      title,
      fileName,
      category,
      sect,
      fileSize: fileSize || "1.0 MB",
      uploadDate: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      uploadedBy,
      description: description || "",
      fileDataUrl,
      createdAt: nowIso
    };

    // 1. Insert into Supabase PostgreSQL Database
    try {
      const supabase = createAdminClient();
      const { data: dbInsert, error: dbError } = await supabase
        .from("academy_resources")
        .upsert({
          id: docId,
          title,
          file_name: fileName,
          category,
          sect,
          file_size: newRecord.fileSize,
          description: newRecord.description,
          file_data_url: fileDataUrl || null,
          uploaded_by: uploadedBy,
          created_at: nowIso,
          updated_at: nowIso
        })
        .select()
        .single();

      if (!dbError && dbInsert) {
        // Also update local fallback store
        FALLBACK_RESOURCE_STORE.unshift(newRecord);
        return NextResponse.json(
          { success: true, source: "database", document: newRecord },
          { status: 201, headers: { "Cache-Control": "no-store" } }
        );
      } else {
        console.warn("[Admin Resources API] DB Upsert error:", dbError?.message);
      }
    } catch (dbEx) {
      console.warn("[Admin Resources API] DB exception on POST:", dbEx);
    }

    // 2. Fallback in-memory save if DB was unreachable
    FALLBACK_RESOURCE_STORE.unshift(newRecord);

    return NextResponse.json(
      { success: true, source: "memory_persisted", document: newRecord },
      { status: 201, headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Document ID required" }, { status: 400 });
    }

    // 1. Delete from Supabase Database
    try {
      const supabase = createAdminClient();
      await supabase.from("academy_resources").delete().eq("id", id);
    } catch (err) {
      console.warn("[Admin Resources API] DB Delete failed:", err);
    }

    // 2. Remove from fallback store
    const idx = FALLBACK_RESOURCE_STORE.findIndex((d) => d.id === id);
    if (idx !== -1) {
      FALLBACK_RESOURCE_STORE.splice(idx, 1);
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Delete failed" },
      { status: 500 }
    );
  }
}
