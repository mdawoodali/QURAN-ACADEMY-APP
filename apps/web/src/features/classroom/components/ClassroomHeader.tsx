"use client";

import React from "react";
import { BookOpen, Mic, Wifi, PhoneOff, Radio } from "lucide-react";
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
  activeLessonId = "fatihah-2",
  lessons = CURRICULUM_LESSONS,
  livekitStatus,
  connectionStatus = "connected",
  isVoiceFollowOn,
  activeSpeechEngine,
  isTeacher = true,
  role = "teacher",
  onScriptChange,
  onTajweedChange,
  onLessonChange,
  onToggleVoiceFollow,
  onEndClass,
}: ClassroomHeaderProps) {
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
              {role === "teacher" ? "Teacher Control" : role === "observer" ? "Silent Observer" : "Student View"} • {classId}
            </span>
          </div>

          {/* Lesson Selector Dropdown */}
          <div className="flex items-center gap-1.5 mt-0.5">
            {isTeacher && onLessonChange ? (
              <select
                value={activeLessonId}
                onChange={(e) => onLessonChange(e.target.value)}
                className="bg-black/50 border border-white/20 text-amber-300 text-[11px] font-bold rounded-lg px-2 py-0.5 focus:outline-none focus:border-amber-400 max-w-[200px] sm:max-w-[260px] truncate cursor-pointer [&>option]:bg-[#052b20] [&>option]:text-white"
              >
                {lessons.map((les) => (
                  <option key={les.id} value={les.id}>
                    {les.title}
                  </option>
                ))}
              </select>
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
          className="bg-red-600/90 hover:bg-red-500 text-white px-3.5 py-1.5 rounded-xl font-bold text-xs transition shadow-md flex items-center gap-1.5 cursor-pointer"
        >
          <PhoneOff size={13} />
          <span className="hidden sm:inline">{isTeacher ? "End Class" : "Leave Room"}</span>
        </button>
      </div>
    </header>
  );
}
