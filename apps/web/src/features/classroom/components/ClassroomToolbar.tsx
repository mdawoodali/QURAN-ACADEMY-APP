"use client";

import React from "react";

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
  onClearAll
}: ClassroomToolbarProps) {
  return (
    <div className="mt-auto pt-3 border-t border-gray-100 flex flex-wrap gap-2 shrink-0 pb-1 justify-center items-center">
      <button
        onClick={onToggleMic}
        className={`${
          isMicOn ? "bg-red-500" : "bg-[#0C4A3A]"
        } text-white px-3 md:px-4 py-2 rounded-lg font-bold text-xs transition`}
      >
        {isMicOn ? "Mute" : "Mic"}
      </button>

      <button
        onClick={onToggleCamera}
        className={`${
          isCameraOn ? "bg-red-600" : "bg-[#0C4A3A]"
        } text-white px-3 md:px-4 py-2 rounded-lg font-bold text-xs transition`}
      >
        {isCameraOn ? "Stop Cam" : "Camera"}
      </button>

      <div className="w-px bg-gray-200 mx-1 hidden sm:block h-6" />

      {/* Font Sizing */}
      <button
        onClick={() => onFontSizeChange(Math.min(fontSize + 8, 80))}
        className="text-[#0C4A3A] bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-lg font-bold text-xs transition hidden sm:block"
      >
        A+
      </button>
      <button
        onClick={() => onFontSizeChange(Math.max(fontSize - 8, 24))}
        className="text-[#0C4A3A] bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-lg font-bold text-xs transition hidden sm:block"
      >
        A-
      </button>

      {/* Color Picker */}
      <input
        type="color"
        value={fontColor}
        onChange={(e) => onFontColorChange(e.target.value)}
        className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
        aria-label="Classroom font color picker"
      />

      <div className="w-px bg-gray-200 mx-1 hidden sm:block h-6" />

      <button
        onClick={onToggleUnderline}
        className="text-[#0C4A3A] bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-lg font-bold text-xs transition hidden sm:block"
      >
        Underline
      </button>
      <button
        onClick={onToggleCircle}
        className="text-[#0C4A3A] bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-lg font-bold text-xs transition hidden sm:block"
      >
        Circle
      </button>

      <button
        onClick={onSplitWord}
        className={`px-3 md:px-4 py-2 rounded-lg font-bold text-xs transition ${
          isSplitActive
            ? "bg-[#0C4A3A] text-white"
            : "text-[#0C4A3A] bg-emerald-50 hover:bg-emerald-100"
        }`}
      >
        Split
      </button>

      <div className="w-px bg-gray-200 mx-1 hidden sm:block h-6" />

      <button
        onClick={onClearAll}
        className="text-gray-500 hover:bg-gray-100 px-3 py-2 rounded-lg font-bold text-xs transition hidden sm:block"
      >
        Clear All
      </button>
    </div>
  );
}
