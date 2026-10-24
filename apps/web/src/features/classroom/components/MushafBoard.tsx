"use client";

import React, { useRef } from "react";
import { ScriptType, TajweedWord, TajweedRuleType, LaserPointerState } from "../types";
import { SCRIPT_DATA } from "../constants";

interface MushafBoardProps {
  script: ScriptType;
  tajweedMode: boolean;
  fontSize: number;
  fontColor: string;
  highlightedIndex: number | null;
  underlines: Record<number, boolean>;
  circles: Record<number, boolean>;
  colorHighlights?: Record<number, TajweedRuleType>;
  wordsList?: TajweedWord[];
  laserPointer?: LaserPointerState;
  isLaserModeActive?: boolean;
  interactive?: boolean;
  onWordClick?: (index: number) => void;
  onLaserMove?: (laser: LaserPointerState) => void;
}

export default function MushafBoard({
  script,
  tajweedMode,
  fontSize,
  fontColor,
  highlightedIndex,
  underlines,
  circles,
  colorHighlights = {},
  wordsList,
  laserPointer,
  isLaserModeActive = false,
  interactive = true,
  onWordClick,
  onLaserMove
}: MushafBoardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const words = wordsList || SCRIPT_DATA[script];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isLaserModeActive || !onLaserMove || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    onLaserMove({ x, y, active: true });
  };

  const handleMouseLeave = () => {
    if (isLaserModeActive && onLaserMove) {
      onLaserMove({ x: 0, y: 0, active: false });
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full max-w-2xl mx-auto pt-8 sm:pt-9 pb-6 px-4 sm:px-6 md:px-8 rounded-2xl sm:rounded-3xl bg-[#FCFAF5] border-2 border-amber-300/40 shadow-xl select-none min-h-[140px] flex items-center justify-center transition-all ${
        isLaserModeActive ? "cursor-crosshair" : ""
      }`}
    >
      {/* Quranic Words Flow */}
      <div
        className={`leading-[2.2] text-center w-full flex items-center justify-center gap-2.5 sm:gap-4 flex-wrap ${
          script === "indopak" ? "font-urdu" : "font-quran"
        }`}
        style={{ fontSize: `${fontSize}px`, color: fontColor }}
        dir="rtl"
      >
        {words.map((item, i) => {
          const isHighlighted = highlightedIndex === i;
          const hasUnderline = underlines[i];
          const hasCircle = circles[i];
          const customRule = colorHighlights[i];

          // Compute Tajweed Styling
          let ruleClass = "";
          let effectiveRule = customRule || item.rule || item.type;

          if (tajweedMode) {
            // Intelligent fallback detection if not explicitly set
            if (!effectiveRule || effectiveRule === "none") {
              if (item.word.includes("ٓ") || item.word.includes("آ")) {
                effectiveRule = "madd";
              } else if (item.word.includes("نّ") || item.word.includes("مّ") || item.word.includes("ۢ")) {
                effectiveRule = "ikhfa";
              } else if (/[قطبجد][\u0652]/.test(item.word) || /[قطبجد]$/.test(item.word)) {
                effectiveRule = "qalqalah";
              } else if (/[ءهعحغخ]/.test(item.word)) {
                effectiveRule = "throat";
              }
            }

            if (effectiveRule === "madd") {
              ruleClass = "text-red-600 font-bold drop-shadow-xs";
            } else if (effectiveRule === "ikhfa") {
              ruleClass = "text-emerald-600 font-bold";
            } else if (effectiveRule === "qalqalah") {
              ruleClass = "text-sky-600 font-bold";
            } else if (effectiveRule === "throat") {
              ruleClass = "text-amber-600 font-bold";
            }
          }

          return (
            <span
              key={i}
              onClick={() => {
                if (interactive && onWordClick) {
                  onWordClick(i);
                }
              }}
              className={`transition-all duration-150 px-2.5 py-1 rounded-2xl relative ${
                interactive ? "cursor-pointer hover:bg-amber-100/60" : ""
              } ${
                isHighlighted
                  ? "bg-amber-200/80 ring-2 ring-amber-400/80 scale-105 shadow-md"
                  : ""
              } ${
                hasUnderline ? "underline decoration-4 underline-offset-[14px] decoration-amber-500" : ""
              } ${
                hasCircle
                  ? "border-[3px] border-red-500 rounded-full px-4"
                  : "border-[3px] border-transparent"
              } ${ruleClass}`}
              title={
                tajweedMode
                  ? item.tajweed || (effectiveRule && effectiveRule !== "none" ? `Rule: ${effectiveRule.toUpperCase()}` : undefined)
                  : undefined
              }
            >
              {item.word}

              {/* Tajweed rule micro-badge on hover or click */}
              {isHighlighted && tajweedMode && (item.tajweed || (effectiveRule && effectiveRule !== "none")) && (
                <span
                  dir="ltr"
                  className="absolute -top-7 left-1/2 -translate-x-1/2 bg-emerald-950 text-amber-300 text-[10px] font-sans font-bold px-2 py-0.5 rounded-full shadow-lg border border-amber-400/30 whitespace-nowrap z-20 pointer-events-none animate-in fade-in zoom-in-95"
                >
                  {item.tajweed || `Tajweed: ${effectiveRule?.toUpperCase()}`}
                </span>
              )}
            </span>
          );
        })}
      </div>

      {/* Real-Time Laser Pointer Dot & Pulsing Ring */}
      {laserPointer?.active && (
        <div
          className="absolute pointer-events-none z-30 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out"
          style={{
            left: `${laserPointer.x}%`,
            top: `${laserPointer.y}%`
          }}
        >
          {/* Outer Pulsing Aura */}
          <div className="w-8 h-8 rounded-full bg-red-500/30 animate-ping absolute inset-0 -m-1" />
          {/* Core Glowing Laser Point */}
          <div className="w-5 h-5 rounded-full bg-red-600 border-2 border-white shadow-[0_0_12px_#ff0000] relative flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-200" />
          </div>
        </div>
      )}
    </div>
  );
}
