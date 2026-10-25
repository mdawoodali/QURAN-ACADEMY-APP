"use client";

import React, { useRef } from "react";
import { ScriptType, TajweedWord, TajweedRuleType, LaserPointerState } from "../types";
import { SCRIPT_DATA, toArabicNumerals } from "../constants";

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

  const updateLaserPosition = (clientX: number, clientY: number) => {
    if (!isLaserModeActive || !onLaserMove || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
    onLaserMove({ x, y, active: true });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    updateLaserPosition(e.clientX, e.clientY);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    updateLaserPosition(e.clientX, e.clientY);
  };

  const handlePointerLeave = () => {
    // Keep laser visible at last position during active laser mode, or mark inactive if turned off
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerLeave={handlePointerLeave}
      style={{ touchAction: isLaserModeActive ? "none" : "auto" }}
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
            <React.Fragment key={i}>
              <span
                onClick={(e) => {
                  if (isLaserModeActive) {
                    e.stopPropagation();
                    updateLaserPosition(e.clientX, e.clientY);
                    return;
                  }
                  if (interactive && onWordClick) {
                    onWordClick(i);
                  }
                }}
                className={`transition-all duration-150 px-2.5 py-1 rounded-2xl relative ${
                  isLaserModeActive
                    ? "cursor-crosshair"
                    : interactive
                    ? "cursor-pointer hover:bg-amber-100/60"
                    : ""
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

              {/* Authentic Quranic Ayah Stopper / Ender Symbol */}
              {item.isAyahEnd && (
                <span
                  className="inline-flex items-center justify-center mx-2.5 my-1 align-middle select-none group/ayah cursor-pointer transition-all hover:scale-110 relative"
                  title={`Ayah ${item.ayahNumber || ""} • Waqf-e-Taam (Complete Stop / End of Ayah)`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (interactive && onWordClick) {
                      onWordClick(i);
                    }
                  }}
                >
                  <span className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-amber-500/80 bg-gradient-to-br from-amber-100 via-amber-50 to-amber-200/90 text-amber-950 shadow-sm font-quran font-bold text-xs sm:text-sm hover:border-amber-600 transition-all">
                    {/* Eight-Pointed Star / Rosette Accents */}
                    <span className="absolute inset-0.5 rounded-full border border-amber-600/30 rotate-45 pointer-events-none" />
                    <span className="relative z-10 font-bold leading-none">
                      {toArabicNumerals(item.ayahNumber || 1, script)}
                    </span>
                  </span>

                  {/* Stopper Waqf rule tooltip on hover */}
                  <span
                    dir="ltr"
                    className="hidden group-hover/ayah:block absolute -top-8 left-1/2 -translate-x-1/2 bg-emerald-950 text-amber-300 text-[10px] font-sans font-bold px-2.5 py-0.5 rounded-full shadow-lg border border-amber-400/40 whitespace-nowrap z-30 pointer-events-none"
                  >
                    Ayah {item.ayahNumber} • Waqf-e-Taam (وقف تام)
                  </span>
                </span>
              )}

              {/* Natural spacing divider after Ayah stopper for multi-ayah clarity */}
              {item.isAyahEnd && <span className="inline-block w-2 sm:w-4" aria-hidden="true" />}
            </React.Fragment>
          );
        })}
      </div>

      {/* Real-Time Laser Pointer Dot & Pulsing Ring */}
      {laserPointer?.active && (
        <div
          className="absolute pointer-events-none z-40 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-75 ease-out"
          style={{
            left: `${laserPointer.x}%`,
            top: `${laserPointer.y}%`
          }}
        >
          {/* Outer Pulsing Aura */}
          <div className="w-10 h-10 rounded-full bg-red-500/35 animate-ping absolute -top-2.5 -left-2.5" />
          {/* Core Glowing Laser Point */}
          <div className="w-5 h-5 rounded-full bg-red-600 border-2 border-white shadow-[0_0_16px_4px_rgba(239,68,68,0.95)] relative flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-200 shadow-xs" />
          </div>
        </div>
      )}
    </div>
  );
}
