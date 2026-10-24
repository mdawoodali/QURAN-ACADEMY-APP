import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

export interface UploadedResourceRecord {
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

async function getSupabase() {
  try {
    return createAdminClient();
  } catch {
    return await createClient();
  }
}

export async function fetchAcademyResources(filters?: { sect?: string; category?: string }): Promise<UploadedResourceRecord[]> {
  const supabase: any = await getSupabase();
  let query = supabase.from("academy_resources").select("*").order("created_at", { ascending: false });

  if (filters?.sect && filters.sect !== "all") {
    query = query.or(`sect.eq.${filters.sect},sect.eq.universal`);
  }
  if (filters?.category && filters.category !== "All") {
    query = query.eq("category", filters.category);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  return data.map((r: any) => ({
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
    createdAt: r.created_at,
  }));
}
