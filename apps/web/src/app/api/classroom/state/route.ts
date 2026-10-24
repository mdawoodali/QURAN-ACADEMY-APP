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
    const roomId = searchParams.get("roomId") || "default";

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
    const {
      roomId = "default",
      currentPage = 1,
      currentSurah = 1,
      currentAyah = 1,
      tajweedMode = "color",
      scriptMode = "uthmani",
      selectedRule = null,
      activeTab = "mushaf",
      whiteboardStrokes = [],
      teacherNotes = "",
      lastUpdatedBy = "instructor",
    } = body;

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
