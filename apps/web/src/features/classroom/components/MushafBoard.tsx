"use client";

import React from "react";
import { ScriptType } from "../types";
import { SCRIPT_DATA } from "../constants";

interface MushafBoardProps {
  script: ScriptType;
  tajweedMode: boolean;
  fontSize: number;
  fontColor: string;
  highlightedIndex: number | null;
  underlines: Record<number, boolean>;
  circles: Record<number, boolean>;
  interactive?: boolean;
  onWordClick?: (index: number) => void;
}

export default function MushafBoard({
  script,
  tajweedMode,
  fontSize,
  fontColor,
  highlightedIndex,
  underlines,
  circles,
  interactive = true,
  onWordClick
}: MushafBoardProps) {
  const words = SCRIPT_DATA[script];

  return (
    <div
      className={`leading-[2.5] text-center w-full max-w-lg mx-auto flex items-center justify-center gap-2 md:gap-4 flex-wrap select-none ${
        script === "indopak" ? "font-urdu" : "font-quran"
      }`}
      style={{ fontSize: `${fontSize}px`, color: fontColor }}
      dir="rtl"
    >
      {words.map((item, i) => {
        const isMadd = tajweedMode && item.type === "madd";
        const isHighlighted = highlightedIndex === i;
        const hasUnderline = underlines[i];
        const hasCircle = circles[i];

        return (
          <span
            key={i}
            onClick={() => {
              if (interactive && onWordClick) {
                onWordClick(i);
              }
            }}
            className={`transition-all duration-200 px-2 py-1 rounded-xl ${
              interactive ? "cursor-pointer hover:bg-gray-50" : ""
            } ${isHighlighted ? "bg-[#fef3c7] scale-110 shadow-sm" : ""} ${
              hasUnderline ? "underline decoration-4 underline-offset-[12px]" : ""
            } ${
              hasCircle
                ? "border-[3px] border-red-500 rounded-full px-4"
                : "border-[3px] border-transparent"
            } ${isMadd ? "text-rose-600 font-bold" : ""}`}
            title={tajweedMode ? item.tajweed : undefined}
          >
            {item.word}
          </span>
        );
      })}
    </div>
  );
}
