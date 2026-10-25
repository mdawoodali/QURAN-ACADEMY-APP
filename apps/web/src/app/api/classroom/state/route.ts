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
    const { searchParams } = new URL(req.url);
    const rawRoom = searchParams.get("roomId") || searchParams.get("classId") || "default";
    const roomId = /^[a-zA-Z0-9_\-]{1,64}$/.test(rawRoom) ? rawRoom : "default";

    let supabase: any;
    try {
      supabase = createAdminClient();
    } catch {
      supabase = await createClient();
    }

    const { data: state, error } = await supabase
      .from("classroom_states")
      .select("*")
      .eq("room_id", roomId)
      .maybeSingle();

    if (error || !state) {
      return NextResponse.json(
        {
          state: {
            roomId,
            classId: roomId,
            currentPage: 1,
            currentSurah: 1,
            currentAyah: 1,
            tajweedMode: "color",
            scriptMode: "uthmani",
            script: "uthmani",
            selectedRule: null,
            activeTab: "mushaf",
            whiteboardStrokes: [],
            teacherNotes: "",
            updatedAt: new Date().toISOString(),
          },
          source: "default",
        },
        { headers: NO_CACHE_HEADERS }
      );
    }

    return NextResponse.json(
      {
        state: {
          roomId: state.room_id,
          classId: state.room_id,
          currentPage: state.current_page || 1,
          currentSurah: state.current_surah || 1,
          currentAyah: state.current_ayah || 1,
          tajweedMode: state.tajweed_mode || "color",
          scriptMode: state.script_mode || "uthmani",
          script: state.script_mode || "uthmani",
          selectedRule: state.selected_rule,
          activeTab: state.active_tab || "mushaf",
          whiteboardStrokes: state.whiteboard_strokes || [],
          teacherNotes: state.teacher_notes || "",
          lastUpdatedBy: state.last_updated_by,
          updatedAt: state.updated_at,
        },
        source: "supabase_postgresql",
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to fetch classroom state", details: err?.message },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const nested = (body.state && typeof body.state === "object") ? body.state : {};
    const rawRoom = body.roomId || body.classId || nested.roomId || nested.classId || "default";
    const roomId = String(rawRoom);
    const currentPage = body.currentPage ?? nested.currentPage ?? 1;
    const currentSurah = body.currentSurah ?? nested.currentSurah ?? 1;
    const currentAyah = body.currentAyah ?? nested.currentAyah ?? 1;

    const rawTajweed = body.tajweedMode ?? nested.tajweedMode ?? "color";
    const tajweedMode = typeof rawTajweed === "boolean" ? (rawTajweed ? "color" : "plain") : String(rawTajweed);
    const scriptMode = String(body.scriptMode ?? body.script ?? nested.scriptMode ?? nested.script ?? "uthmani");
    const selectedRule = body.selectedRule ?? nested.selectedRule ?? null;
    const activeTab = body.activeTab ?? nested.activeTab ?? "mushaf";
    const whiteboardStrokes = body.whiteboardStrokes ?? nested.whiteboardStrokes ?? [];
    const teacherNotes = body.teacherNotes ?? nested.teacherNotes ?? "";
    const lastUpdatedBy = body.lastUpdatedBy ?? nested.lastUpdatedBy ?? "instructor";

    if (!/^[a-zA-Z0-9_\-]{1,64}$/.test(String(roomId))) {
      return NextResponse.json(
        { error: "Invalid roomId format. Must be alphanumeric (1-64 chars)." },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }
    const pageNum = Number(currentPage);
    if (isNaN(pageNum) || pageNum < 1 || pageNum > 604) {
      return NextResponse.json(
        { error: "Invalid currentPage. Must be between 1 and 604." },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }
    const surahNum = Number(currentSurah);
    if (isNaN(surahNum) || surahNum < 1 || surahNum > 114) {
      return NextResponse.json(
        { error: "Invalid currentSurah. Must be between 1 and 114." },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }
    const ayahNum = Number(currentAyah);
    if (isNaN(ayahNum) || ayahNum < 1 || ayahNum > 286) {
      return NextResponse.json(
        { error: "Invalid currentAyah. Must be between 1 and 286." },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }
    if (!Array.isArray(whiteboardStrokes) || whiteboardStrokes.length > 5000) {
      return NextResponse.json(
        { error: "whiteboardStrokes must be an array not exceeding 5000 elements." },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }
    if (typeof teacherNotes === "string" && teacherNotes.length > 10000) {
      return NextResponse.json(
        { error: "teacherNotes exceeds 10,000 character maximum." },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    let supabase: any;
    try {
      supabase = createAdminClient();
    } catch {
      supabase = await createClient();
    }

    const { data, error } = await supabase
      .from("classroom_states")
      .upsert(
        {
          room_id: roomId,
          current_page: currentPage,
          current_surah: currentSurah,
          current_ayah: currentAyah,
          tajweed_mode: tajweedMode,
          script_mode: scriptMode,
          selected_rule: selectedRule,
          active_tab: activeTab,
          whiteboard_strokes: whiteboardStrokes,
          teacher_notes: teacherNotes,
          last_updated_by: lastUpdatedBy,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "room_id" }
      )
      .select()
      .single();

    if (error) {
      console.warn("[Classroom State API] Upsert error:", error.message);
    }

    const responseState = data
      ? { ...data, roomId: data.room_id, classId: data.room_id }
      : { ...body, roomId, classId: roomId };

    return NextResponse.json(
      {
        success: true,
        message: "Classroom state persisted to database.",
        state: responseState,
      },
      { status: 200, headers: NO_CACHE_HEADERS }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to update classroom state", details: err?.message },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
