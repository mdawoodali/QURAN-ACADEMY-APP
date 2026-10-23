"use client";

import React from "react";
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Crosshair, 
  Underline, 
  Circle, 
  Scissors, 
  RotateCcw, 
  Sparkles, 
  VolumeX, 
  Wifi, 
  WifiOff 
} from "lucide-react";
import { TajweedRuleType } from "../types";

interface ClassroomToolbarProps {
  isMicOn: boolean;
  onToggleMic: () => void;
  isCameraOn: boolean;
  onToggleCamera: () => void;
  fontSize: number;
  fontColor: string;
  onFontSizeChange: (newSize: number) => void;
  onFontColorChange: (newColor: string) => void;
  onToggleUnderline: () => void;
  onToggleCircle: () => void;
  isSplitActive: boolean;
  onSplitWord: () => void;
  onClearAll: () => void;
  isLaserModeActive: boolean;
  onToggleLaserMode: () => void;
  activePenRule?: TajweedRuleType;
  onSelectPenRule?: (rule: TajweedRuleType) => void;
  isTeacher?: boolean;
  onRemoteMuteStudent?: () => void;
  bandwidthMode: "auto" | "audio_only";
  onToggleBandwidthMode: () => void;
}

export default function ClassroomToolbar({
  isMicOn,
  onToggleMic,
  isCameraOn,
  onToggleCamera,
  fontSize,
  fontColor,
  onFontSizeChange,
  onFontColorChange,
  onToggleUnderline,
  onToggleCircle,
  isSplitActive,
  onSplitWord,
  onClearAll,
  isLaserModeActive,
  onToggleLaserMode,
  isTeacher = true,
  onRemoteMuteStudent,
  bandwidthMode,
  onToggleBandwidthMode,
}: ClassroomToolbarProps) {
  return (
    <div className="mt-auto pt-3 border-t border-white/10 flex flex-wrap gap-2 shrink-0 pb-1 justify-center items-center bg-black/40 backdrop-blur-md p-2 rounded-2xl border border-white/10 shadow-lg">
      {/* 1. Media Buttons */}
      <button
        onClick={onToggleMic}
        className={`px-3 py-2 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer ${
          isMicOn ? "bg-emerald-600 hover:bg-emerald-500 text-white" : "bg-red-600 hover:bg-red-500 text-white"
        }`}
        title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
      >
        {isMicOn ? <Mic size={14} /> : <MicOff size={14} />}
        <span>{isMicOn ? "Mic On" : "Muted"}</span>
      </button>

      <button
        onClick={onToggleCamera}
        className={`px-3 py-2 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer ${
          isCameraOn ? "bg-emerald-600 hover:bg-emerald-500 text-white" : "bg-red-600 hover:bg-red-500 text-white"
        }`}
        title={isCameraOn ? "Stop Camera" : "Start Camera"}
      >
        {isCameraOn ? <Video size={14} /> : <VideoOff size={14} />}
        <span>{isCameraOn ? "Camera" : "Cam Off"}</span>
      </button>

      <div className="w-px bg-white/20 mx-1 hidden sm:block h-6" />

      {/* 2. Laser Pointer Tool */}
      <button
        onClick={onToggleLaserMode}
        className={`px-3 py-2 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer ${
          isLaserModeActive
            ? "bg-red-600 text-white shadow-[0_0_12px_#ff0000] ring-2 ring-amber-300"
            : "bg-white/10 hover:bg-white/20 text-emerald-100"
        }`}
        title="Laser Pointer Cursor (Synchronized to Student in <30ms)"
      >
        <Crosshair size={14} className={isLaserModeActive ? "animate-spin" : ""} />
        <span>Laser</span>
      </button>

      {/* 3. Tajweed Color Key (Informational Legend — Pen selection removed) */}
      <div
        className="hidden md:flex items-center gap-1.5 bg-black/50 px-2.5 py-1.5 rounded-xl border border-white/10 select-none shadow-inner"
        title="Tajweed Color Key: Integrated authentically in Quranic verses"
      >
        <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1 mr-0.5">
          <Sparkles size={11} className="text-amber-400" />
          Tajweed Key:
        </span>
        <div
          className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-red-950/60 border border-red-500/40 text-[10px] font-bold text-red-300"
          title="Madd (Elongation - Red): Prolonged 2, 4, 5, or 6 counts"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <span>Madd</span>
        </div>
        <div
          className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-500/40 text-[10px] font-bold text-emerald-300"
          title="Ikhfa & Ghunnah (Nasalization - Green): 2 counts nasal vibration"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Ikhfa</span>
        </div>
        <div
          className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-sky-950/60 border border-sky-500/40 text-[10px] font-bold text-sky-300"
          title="Qalqalah (Echoing - Blue): Echoing bounce on letters of Qutb Jad (ق، ط، ب، ج، د)"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
          <span>Qalqalah</span>
        </div>
        <div
          className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-950/60 border border-amber-500/40 text-[10px] font-bold text-amber-300"
          title="Makhraj (Throat & Articulation - Amber): Throat letters (ح، خ، ع، غ، ء، ه)"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>Makhraj</span>
        </div>
      </div>

      <div className="w-px bg-white/20 mx-1 hidden sm:block h-6" />

      {/* 4. Annotations: Underline & Circle */}
      <button
        onClick={onToggleUnderline}
        className="text-emerald-100 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-xl font-bold text-xs transition hidden sm:flex items-center justify-center cursor-pointer"
        title="Underline Highlighted Word"
      >
        <Underline size={14} />
      </button>

      <button
        onClick={onToggleCircle}
        className="text-emerald-100 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-xl font-bold text-xs transition hidden sm:flex items-center justify-center cursor-pointer"
        title="Circle Highlighted Word"
      >
        <Circle size={14} />
      </button>

      {/* 5. Split Word Practice */}
      <button
        onClick={onSplitWord}
        className={`px-3 py-2 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer ${
          isSplitActive
            ? "bg-amber-400 text-emerald-950 shadow-md"
            : "bg-white/10 hover:bg-white/20 text-emerald-100"
        }`}
        title="Split Word into Individual Letter Articulations"
      >
        <Scissors size={14} />
        <span className="hidden sm:inline">Split Letters</span>
      </button>

      {/* 6. Font Sizing & Color */}
      <div className="hidden lg:flex items-center gap-1">
        <button
          onClick={() => onFontSizeChange(Math.min(fontSize + 6, 72))}
          className="bg-white/10 hover:bg-white/20 text-amber-300 px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
          title="Increase Quran Font Size"
        >
          A+
        </button>
        <button
          onClick={() => onFontSizeChange(Math.max(fontSize - 6, 28))}
          className="bg-white/10 hover:bg-white/20 text-amber-300 px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
          title="Decrease Quran Font Size"
        >
          A-
        </button>
        <input
          type="color"
          value={fontColor}
          onChange={(e) => onFontColorChange(e.target.value)}
          className="w-7 h-7 rounded-lg border border-white/20 cursor-pointer bg-transparent"
          aria-label="Classroom font color"
          title="Change Text Color"
        />
      </div>

      <div className="w-px bg-white/20 mx-1 hidden sm:block h-6" />

      {/* 7. Teacher Moderation Controls */}
      {isTeacher && onRemoteMuteStudent && (
        <button
          onClick={onRemoteMuteStudent}
          className="px-3 py-2 bg-black/40 hover:bg-red-900/60 border border-white/10 hover:border-red-500/30 text-emerald-100 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          title="Mute Student Microphone (Teacher Moderation)"
        >
          <VolumeX size={14} className="text-red-400" />
          <span className="hidden sm:inline">Mute Student</span>
        </button>
      )}

      {/* 8. Adaptive Bandwidth Switch */}
      <button
        onClick={onToggleBandwidthMode}
        className={`px-2.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
          bandwidthMode === "audio_only"
            ? "bg-amber-400 text-emerald-950 font-extrabold shadow-sm"
            : "bg-white/10 hover:bg-white/20 text-emerald-100"
        }`}
        title="Toggle Adaptive Audio-Only Mode for Slow Connections"
      >
        {bandwidthMode === "audio_only" ? <WifiOff size={13} /> : <Wifi size={13} />}
        <span className="text-[11px]">{bandwidthMode === "audio_only" ? "Low-Bandwidth" : "HD Video"}</span>
      </button>

      {/* 9. Clear All */}
      <button
        onClick={onClearAll}
        className="px-2.5 py-2 bg-white/10 hover:bg-red-950/60 text-emerald-100 hover:text-red-300 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ml-auto"
        title="Clear All Annotations"
      >
        <RotateCcw size={13} />
        <span className="hidden sm:inline">Reset</span>
      </button>
    </div>
  );
}
