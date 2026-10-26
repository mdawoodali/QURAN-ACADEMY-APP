"use client";

import React from "react";
import { BookOpen, Mic, Wifi, PhoneOff, Radio, ChevronDown } from "lucide-react";
import { ScriptType, LiveKitStatus, ClassroomLesson } from "../types";
import { CURRICULUM_LESSONS } from "../constants";

interface ClassroomHeaderProps {
  surahName: string;
  script: ScriptType;
  tajweedMode: boolean;
  classId: string;
  activeLessonId?: string;
  lessons?: ClassroomLesson[];
  livekitStatus: LiveKitStatus | null;
  connectionStatus?: "connected" | "reconnecting" | "offline";
  isVoiceFollowOn: boolean;
  activeSpeechEngine: string | null;
  isTeacher?: boolean;
  role?: string;
  participantName?: string;
  onScriptChange: (script: ScriptType) => void;
  onTajweedChange: (mode: boolean) => void;
  onLessonChange?: (lessonId: string) => void;
  onToggleVoiceFollow: () => void;
  onEndClass: () => void;
}

export default function ClassroomHeader({
  surahName,
  script,
  tajweedMode,
  classId,
  activeLessonId = "fatihah-all",
  lessons = CURRICULUM_LESSONS,
  livekitStatus,
  connectionStatus = "connected",
  isVoiceFollowOn,
  activeSpeechEngine,
  isTeacher = true,
  role = "teacher",
  participantName,
  onScriptChange,
  onTajweedChange,
  onLessonChange,
  onToggleVoiceFollow,
  onEndClass,
}: ClassroomHeaderProps) {
  const isDemo = !classId || classId.toLowerCase() === "demo" || classId.toLowerCase().includes("demo");

  return (
    <header className="h-16 border-b border-white/10 flex items-center justify-between px-3 md:px-6 flex-shrink-0 z-20 bg-black/50 backdrop-blur-md text-white">
      {/* Left: Branding & Lesson Selector */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <div className="w-9 h-9 bg-emerald-800/80 border border-amber-400/40 rounded-xl flex items-center justify-center text-amber-300 shadow-sm shrink-0">
          <BookOpen size={18} />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-serif font-bold text-white truncate">
              Live Quran Classroom
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-950/80 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full hidden sm:inline-block">
              {isDemo ? "Interactive Demo Classroom" : role === "teacher" ? `Teacher Control (${participantName || "Ustadha Maryam"})` : role === "observer" ? `Parent Observer (${participantName || "Ward"})` : `Student View (${participantName || "Learner"})`} • {classId}
            </span>
          </div>

          {/* Lesson / Ayah Selector Dropdown */}
          <div className="flex items-center gap-1.5 mt-0.5">
            {(isTeacher || isDemo) && onLessonChange ? (
              <div className="relative flex items-center">
                <span className="text-[10px] uppercase font-bold text-amber-300/80 mr-1 hidden sm:inline">
                  Ayah:
                </span>
                <select
                  value={activeLessonId}
                  onChange={(e) => onLessonChange(e.target.value)}
                  className="appearance-none bg-black/60 hover:bg-black/80 border border-amber-400/40 hover:border-amber-400 text-amber-300 text-[11px] font-bold rounded-lg pl-2 pr-6 py-0.5 focus:outline-none focus:ring-1 focus:ring-amber-400 max-w-[210px] sm:max-w-[280px] truncate cursor-pointer [&>option]:bg-[#052b20] [&>option]:text-white shadow-xs"
                  aria-label="Select Surah and Ayah"
                >
                  {lessons.map((les) => (
                    <option key={les.id} value={les.id}>
                      {les.title}
                    </option>
                  ))}
                </select>
                <ChevronDown size={12} className="absolute right-1.5 text-amber-400/80 pointer-events-none" />
              </div>
            ) : (
              <span className="text-[11px] text-emerald-100/80 font-medium truncate">
                {surahName}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Middle & Right: Sync Toggles, Engine Pill & Exit */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Script & Tajweed Switchers (Desktop) */}
        <div className="hidden lg:flex items-center gap-2 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
          {/* Script */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onScriptChange("uthmani")}
              className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition cursor-pointer ${
                script === "uthmani"
                  ? "bg-amber-400 text-emerald-950 shadow-xs font-extrabold"
                  : "text-emerald-100/70 hover:text-white"
              }`}
            >
              Uthmani
            </button>
            <button
              onClick={() => onScriptChange("indopak")}
              className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition cursor-pointer ${
                script === "indopak"
                  ? "bg-amber-400 text-emerald-950 shadow-xs font-extrabold"
                  : "text-emerald-100/70 hover:text-white"
              }`}
            >
              IndoPak
            </button>
          </div>

          <div className="w-px h-4 bg-white/20" />

          {/* Tajweed */}
          <button
            onClick={() => onTajweedChange(!tajweedMode)}
            className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition cursor-pointer ${
              tajweedMode
                ? "bg-emerald-900/80 text-emerald-300 border border-emerald-500/30"
                : "bg-white/10 text-emerald-100/60"
            }`}
          >
            {tajweedMode ? "Tajweed: Colors ON" : "Tajweed: Plain"}
          </button>
        </div>

        {/* AI Recitation Follow Button */}
        <button
          onClick={onToggleVoiceFollow}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm ${
            isVoiceFollowOn
              ? "bg-emerald-600 hover:bg-emerald-500 text-white ring-2 ring-amber-300"
              : "bg-black/40 hover:bg-black/60 border border-white/15 text-emerald-100"
          }`}
          title="Toggle Real-Time AI Speech Recognition & Voice-Following Highlights"
        >
          <Mic size={14} className={isVoiceFollowOn ? "animate-pulse text-amber-300" : ""} />
          <span className="hidden sm:inline">
            {isVoiceFollowOn ? "AI Voice Following" : "AI Voice Follow"}
          </span>
        </button>

        {/* Connection Status Pill */}
        {connectionStatus === "reconnecting" ? (
          <div className="flex items-center gap-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2.5 py-1 rounded-xl text-[10px] font-bold animate-pulse">
            <Radio size={12} className="animate-spin" />
            <span className="hidden sm:inline">Reconnecting...</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-xl text-[10px] font-bold">
            <Wifi size={12} className="text-emerald-400" />
            <span className="hidden md:inline">
              Connected
            </span>
          </div>
        )}

        {/* End / Leave Session Button */}
        <button
          onClick={onEndClass}
          aria-label={isDemo ? "Cancel & Exit Demo Class" : isTeacher ? "End Class" : "Leave Room"}
          title={isDemo ? "Cancel & Exit Demo Class" : isTeacher ? "End Session" : "Leave Session"}
          className="bg-red-600/90 hover:bg-red-500 text-white px-3 sm:px-3.5 py-1.5 rounded-xl font-bold text-xs transition shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <PhoneOff size={13} />
          <span>{isDemo ? "Exit Demo" : isTeacher ? "End Class" : "Leave Room"}</span>
        </button>
      </div>
    </header>
  );
}
