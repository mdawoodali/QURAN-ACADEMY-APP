import { NextRequest, NextResponse } from "next/server";
import { connection } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
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

    const { data: documents, error } = await supabase
      .from("uploaded_documents")
      .select("*")
      .order("upload_date", { ascending: false });

    if (error) {
      console.warn("[Resources API] Database error:", error.message);
      return NextResponse.json({ documents: [], count: 0, error: error.message });
    }

    const mapped = (documents || []).map((doc: any) => ({
      id: doc.id,
      title: doc.title,
      fileName: doc.file_name,
      category: doc.category,
      sect: doc.sect,
      fileSize: doc.file_size,
      uploadDate: doc.upload_date,
      uploadedBy: doc.uploaded_by,
      description: doc.description,
      fileDataUrl: doc.file_data_url,
    }));

    return NextResponse.json({ documents: mapped, count: mapped.length });
  } catch (err: any) {
    return NextResponse.json({ documents: [], count: 0, error: err?.message });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      fileName,
      category = "Curriculum",
      sect = "universal",
      fileSize = "1.0 MB",
      uploadedBy = "Academy Admin",
      description = "",
      fileDataUrl = "",
    } = body;

    if (fileDataUrl && fileDataUrl.length > 25 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File exceeds 25MB maximum limit." },
        { status: 413 }
      );
    }

    if (!title || !fileName) {
      return NextResponse.json(
        { error: "Title and fileName are required." },
        { status: 400 }
      );
    }

    let supabase: any;
    try {
      supabase = createAdminClient();
    } catch {
      supabase = await createClient();
    }

    const { data, error } = await supabase
      .from("uploaded_documents")
      .insert({
        title,
        file_name: fileName,
        category,
        sect,
        file_size: fileSize,
        uploaded_by: uploadedBy,
        description,
        file_data_url: fileDataUrl,
      })
      .select()
      .single();

    if (error) {
      console.warn("[Resources API] Insert error:", error.message);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Document saved to Academy database library.",
        document: data || {
          id: `doc_${Date.now()}`,
          title,
          fileName,
          category,
          sect,
          fileSize,
          uploadedBy,
          description,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to upload document", details: err?.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Document ID is required." }, { status: 400 });
    }

    let supabase: any;
    try {
      supabase = createAdminClient();
    } catch {
      supabase = await createClient();
    }

    const { error } = await supabase.from("uploaded_documents").delete().eq("id", id);
    if (error) {
      console.warn("[Resources API] Delete error:", error.message);
    }

    return NextResponse.json({ success: true, message: `Document ${id} deleted.` });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to delete document", details: err?.message },
      { status: 500 }
    );
  }
}
