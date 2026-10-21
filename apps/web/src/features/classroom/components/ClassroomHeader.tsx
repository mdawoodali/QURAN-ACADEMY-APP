"use client";

import React from "react";
import { ScriptType, LiveKitStatus } from "../types";

interface ClassroomHeaderProps {
  surahName: string;
  script: ScriptType;
  tajweedMode: boolean;
  classId: string;
  livekitStatus: LiveKitStatus | null;
  isVoiceFollowOn: boolean;
  activeSpeechEngine: string | null;
  onScriptChange: (script: ScriptType) => void;
  onTajweedChange: (mode: boolean) => void;
  onToggleVoiceFollow: () => void;
  onEndClass: () => void;
}

export default function ClassroomHeader({
  surahName,
  script,
  tajweedMode,
  classId,
  livekitStatus,
  isVoiceFollowOn,
  activeSpeechEngine,
  onScriptChange,
  onTajweedChange,
  onToggleVoiceFollow,
  onEndClass,
}: ClassroomHeaderProps) {
  return (
    <header className="h-16 border-b border-gray-100 flex items-center justify-between px-4 md:px-8 flex-shrink-0 z-10 bg-white">
      <div className="flex items-center gap-2 md:gap-4">
        <div className="w-8 h-8 bg-[#0C4A3A] rounded-lg flex items-center justify-center text-white">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="16" rx="2" stroke="white" strokeWidth="2" />
            <path d="M12 4V20" stroke="white" strokeWidth="2" />
          </svg>
        </div>
        <div>
          <h1 className="text-base md:text-lg font-bold text-gray-900 leading-none">Live Interactive Classroom</h1>
          <p className="text-[10px] md:text-xs text-gray-500 mt-1 hidden sm:block">
            {surahName} • Script: {script === "uthmani" ? "Uthmani" : "IndoPak"} • Tajweed Active
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Top Controls: Script and Tajweed stacked cleanly */}
        <div className="hidden md:flex flex-col items-end gap-1">
          <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg border border-gray-200">
            <span className="text-[10px] font-bold text-gray-500 px-1.5 uppercase">Script:</span>
            <button
              onClick={() => onScriptChange("uthmani")}
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition ${
                script === "uthmani" ? "bg-[#0C4A3A] text-white shadow-xs" : "text-gray-600 hover:text-black"
              }`}
            >
              Uthmani
            </button>
            <button
              onClick={() => onScriptChange("indopak")}
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition ${
                script === "indopak" ? "bg-[#0C4A3A] text-white shadow-xs" : "text-gray-600 hover:text-black"
              }`}
            >
              IndoPak
            </button>
          </div>

          <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg border border-gray-200">
            <span className="text-[10px] font-bold text-gray-500 px-1.5 uppercase">Tajweed:</span>
            <button
              onClick={() => onTajweedChange(true)}
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition ${
                tajweedMode ? "bg-emerald-600 text-white shadow-xs" : "text-gray-600 hover:text-black"
              }`}
            >
              Color-Coded
            </button>
            <button
              onClick={() => onTajweedChange(false)}
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition ${
                !tajweedMode ? "bg-gray-700 text-white shadow-xs" : "text-gray-600 hover:text-black"
              }`}
            >
              Plain
            </button>
          </div>
        </div>

        {/* LiveKit Server Pairing Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 text-[#0C4A3A] border border-emerald-300 px-3 py-1 rounded-full text-[10px] font-bold shadow-xs">
          <span
            className={`w-2 h-2 rounded-full ${
              livekitStatus?.mode === "live" ? "bg-emerald-600 animate-pulse" : "bg-emerald-500"
            }`}
          />
          <span>{livekitStatus?.mode === "live" ? `LiveKit Cloud: Room ${classId}` : `LiveKit WebRTC: Room ${classId}`}</span>
        </div>

        <button
          onClick={onToggleVoiceFollow}
          className={`text-[10px] md:text-xs font-bold tracking-wider uppercase px-3.5 py-1.5 rounded-full transition flex items-center gap-1.5 shadow-xs ${
            isVoiceFollowOn ? "bg-emerald-600 text-white animate-pulse" : "bg-[#D1EBE1] text-[#0C4A3A] hover:bg-[#bce0d0]"
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isVoiceFollowOn ? "bg-white" : "bg-emerald-600"}`} />
          {isVoiceFollowOn
            ? activeSpeechEngine
              ? `Voice Follow: ON (${activeSpeechEngine})`
              : "Voice Follow: ON"
            : "Voice Follow: OFF"}
        </button>

        <div className="bg-red-50 text-red-700 text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          Live
        </div>

        <button
          onClick={onEndClass}
          className="bg-[#b94a48] text-white px-3 md:px-5 py-1.5 rounded-lg font-bold hover:bg-red-800 transition text-xs md:text-sm"
        >
          End class
        </button>
      </div>
    </header>
  );
}
