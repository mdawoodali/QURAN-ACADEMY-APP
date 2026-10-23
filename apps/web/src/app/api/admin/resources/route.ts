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
const FALLBACK_RESOURCE_STORE: UploadedDocumentRecord[] = [
  {
    id: "doc_1",
    title: "Mafatih al-Jinan — Complete Classical Duas Compendium",
    fileName: "Mafatih_al_Jinan_Full_Reader.pdf",
    category: "Duas & Supplications",
    sect: "shia",
    fileSize: "14.2 MB",
    uploadDate: "22 Oct 2026",
    uploadedBy: "Super Admin",
    description: "Standard verified Arabic diacritics and parallel English translation for major canonical supplications."
  },
  {
    id: "doc_2",
    title: "Noorani Qaida — Color-Coded Makhaarij Guide",
    fileName: "Noorani_Qaida_Standard_Edition.pdf",
    category: "Tajweed & Noorani Qaida",
    sect: "universal",
    fileSize: "8.5 MB",
    uploadDate: "20 Oct 2026",
    uploadedBy: "Super Admin",
    description: "Foundational phonetics and letter-articulation reference used across beginner classrooms."
  },
  {
    id: "doc_3",
    title: "Al-Sahifa al-Sajjadiyya — The Psalms of Islam",
    fileName: "Sahifa_Sajjadiyya_Manuscript.pdf",
    category: "Classical Reference Texts",
    sect: "shia",
    fileSize: "18.7 MB",
    uploadDate: "18 Oct 2026",
    uploadedBy: "Super Admin",
    description: "Complete 54 supplications of Imam Ali Zayn al-Abidin (AS) with academic annotations."
  },
  {
    id: "doc_4",
    title: "Riyad al-Salihin — Gardens of the Righteous",
    fileName: "Riyad_al_Salihin_Imam_Nawawi.pdf",
    category: "Hadith & Sunnah Compendiums",
    sect: "sunni",
    fileSize: "12.4 MB",
    uploadDate: "17 Oct 2026",
    uploadedBy: "Super Admin",
    description: "Classical Hadith compendium by Imam an-Nawawi covering ethics, worship, and manners."
  },
  {
    id: "doc_5",
    title: "Practical Ahkam & Daily Salat Manual",
    fileName: "Practical_Ahkam_Salat_Handbook.pdf",
    category: "Wudhu & Salat Ahkam",
    sect: "universal",
    fileSize: "4.1 MB",
    uploadDate: "15 Oct 2026",
    uploadedBy: "Super Admin",
    description: "Essential rulings on Wudhu, Tayammum, invalidating factors, and prayer posture standards."
  }
];

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

    if (!error && dbRecords && dbRecords.length > 0) {
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
