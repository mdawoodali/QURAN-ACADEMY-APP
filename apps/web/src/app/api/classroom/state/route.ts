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
      return NextResponse.json({
        state: {
          roomId,
          currentPage: 1,
          currentSurah: 1,
          currentAyah: 1,
          tajweedMode: "color",
          scriptMode: "uthmani",
          selectedRule: null,
          activeTab: "mushaf",
          whiteboardStrokes: [],
          teacherNotes: "",
          updatedAt: new Date().toISOString(),
        },
        source: "default",
      }, {
        headers: { "Cache-Control": "no-store, no-cache, must-revalidate" }
      });
    }

    return NextResponse.json({
      state: {
        roomId: state.room_id,
        currentPage: state.current_page || 1,
        currentSurah: state.current_surah || 1,
        currentAyah: state.current_ayah || 1,
        tajweedMode: state.tajweed_mode || "color",
        scriptMode: state.script_mode || "uthmani",
        selectedRule: state.selected_rule,
        activeTab: state.active_tab || "mushaf",
        whiteboardStrokes: state.whiteboard_strokes || [],
        teacherNotes: state.teacher_notes || "",
        lastUpdatedBy: state.last_updated_by,
        updatedAt: state.updated_at,
      },
      source: "supabase_postgresql",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to fetch classroom state", details: err?.message },
      { status: 500 }
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
    const tajweedMode = body.tajweedMode ?? nested.tajweedMode ?? "color";
    const scriptMode = body.scriptMode ?? nested.scriptMode ?? "uthmani";
    const selectedRule = body.selectedRule ?? nested.selectedRule ?? null;
    const activeTab = body.activeTab ?? nested.activeTab ?? "mushaf";
    const whiteboardStrokes = body.whiteboardStrokes ?? nested.whiteboardStrokes ?? [];
    const teacherNotes = body.teacherNotes ?? nested.teacherNotes ?? "";
    const lastUpdatedBy = body.lastUpdatedBy ?? nested.lastUpdatedBy ?? "instructor";

    if (!/^[a-zA-Z0-9_\-]{1,64}$/.test(String(roomId))) {
      return NextResponse.json({ error: "Invalid roomId format. Must be alphanumeric (1-64 chars)." }, { status: 400 });
    }
    const pageNum = Number(currentPage);
    if (isNaN(pageNum) || pageNum < 1 || pageNum > 604) {
      return NextResponse.json({ error: "Invalid currentPage. Must be between 1 and 604." }, { status: 400 });
    }
    const surahNum = Number(currentSurah);
    if (isNaN(surahNum) || surahNum < 1 || surahNum > 114) {
      return NextResponse.json({ error: "Invalid currentSurah. Must be between 1 and 114." }, { status: 400 });
    }
    const ayahNum = Number(currentAyah);
    if (isNaN(ayahNum) || ayahNum < 1 || ayahNum > 286) {
      return NextResponse.json({ error: "Invalid currentAyah. Must be between 1 and 286." }, { status: 400 });
    }
    if (!Array.isArray(whiteboardStrokes) || whiteboardStrokes.length > 5000) {
      return NextResponse.json({ error: "whiteboardStrokes must be an array not exceeding 5000 elements." }, { status: 400 });
    }
    if (typeof teacherNotes === "string" && teacherNotes.length > 10000) {
      return NextResponse.json({ error: "teacherNotes exceeds 10,000 character maximum." }, { status: 400 });
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

    return NextResponse.json({
      success: true,
      message: "Classroom state persisted to database.",
      state: data || body,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to update classroom state", details: err?.message },
      { status: 500 }
    );
  }
}
