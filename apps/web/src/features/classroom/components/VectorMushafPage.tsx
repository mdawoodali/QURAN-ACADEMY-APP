"use client";

import React from "react";
import { parseTajweed, TajweedSegment } from "@quran/domain";

export interface MushafAyah {
  number: number;
  text: string;
  translation?: string;
}

export interface VectorMushafPageProps {
  pageNumber?: number;
  surahNumber: number;
  surahName: string;
  isMakki?: boolean;
  totalAyat?: number;
  ayat: MushafAyah[];
  activeAyahNumber?: number | null;
  onSelectAyah?: (ayahNumber: number) => void;
  tajweedMode?: boolean;
  script?: "uthmani" | "indopak";
  fontSize?: number;
}

export default function VectorMushafPage({
  pageNumber = 1,
  surahNumber,
  surahName,
  isMakki = true,
  totalAyat = 7,
  ayat,
  activeAyahNumber = null,
  onSelectAyah,
  tajweedMode = true,
  script = "uthmani",
  fontSize = 32,
}: VectorMushafPageProps) {
  return (
    <div className="relative w-full max-w-3xl mx-auto my-4 bg-[#FCFAF5] text-stone-900 rounded-3xl shadow-2xl border-4 border-amber-600/30 overflow-hidden select-none transition-all">
      {/* Top Page Header Bar */}
      <div className="flex items-center justify-between px-6 py-2.5 bg-amber-100/60 border-b border-amber-200/80 text-xs font-semibold text-amber-950">
        <span className="tracking-wide">Juz 1</span>
        <span className="font-bold text-amber-900 tracking-wider">
          {surahName} • {isMakki ? "Makki" : "Madani"} ({totalAyat} Ayat)
        </span>
        <span>Page {pageNumber}</span>
      </div>

      {/* Outer Ornamental Frame */}
      <div className="p-4 sm:p-8">
        <div className="border-2 border-amber-400/60 rounded-2xl p-4 sm:p-6 bg-gradient-to-b from-[#FEFCF8] to-[#FBF8F0] shadow-inner relative">
          
          {/* Surah Header Ornamental Banner */}
          <div className="relative my-2 py-3 px-6 rounded-xl bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 text-amber-50 text-center shadow-md border border-amber-400/50 flex flex-col items-center justify-center">
            <div className="absolute inset-x-2 top-1 border-t border-amber-300/40" />
            <span className="text-xs uppercase tracking-widest text-amber-200 font-semibold mb-0.5">
              Surah #{surahNumber}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-wide font-quran">
              سُورَةُ {surahName}
            </h2>
            <span className="text-[11px] text-amber-100/80">
              {isMakki ? "مَكِّيَّةٌ" : "مَدَنِيَّةٌ"} • آيَاتُهَا {totalAyat}
            </span>
            <div className="absolute inset-x-2 bottom-1 border-b border-amber-300/40" />
          </div>

          {/* Bismillah Header (Except Surah At-Tawbah) */}
          {surahNumber !== 9 && (
            <div className="text-center py-4 text-stone-800 font-quran text-xl sm:text-2xl tracking-wide select-none">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
            </div>
          )}

          {/* Flowing Ayat Text Container with Interactive Hitboxes */}
          <div
            className={`leading-[2.8] text-center w-full px-2 sm:px-4 py-2 ${
              script === "indopak" ? "font-urdu" : "font-quran"
            }`}
            style={{ fontSize: `${fontSize}px` }}
            dir="rtl"
          >
            {ayat.map((ayah) => {
              const isActive = activeAyahNumber === ayah.number;
              const segments: TajweedSegment[] = tajweedMode
                ? parseTajweed(ayah.text)
                : [{ text: ayah.text, rule: "normal" }];

              return (
                <span
                  key={ayah.number}
                  onClick={() => onSelectAyah?.(ayah.number)}
                  className={`inline cursor-pointer px-1 py-0.5 rounded-lg transition-all ${
                    isActive
                      ? "bg-amber-200/70 shadow-sm ring-2 ring-amber-400 text-stone-950 font-medium"
                      : "hover:bg-amber-100/50"
                  }`}
                  title={`Ayah ${ayah.number}${ayah.translation ? `: ${ayah.translation}` : ""}`}
                >
                  {/* Ayah Text Segments */}
                  {segments.map((seg, sIdx) => {
                    if (seg.rule === "normal" || !seg.info) {
                      return <span key={sIdx}>{seg.text}</span>;
                    }
                    return (
                      <span
                        key={sIdx}
                        className={seg.info.colorClass}
                        style={{ color: seg.info.hexColor }}
                        title={`${seg.info.name}: ${seg.info.description}`}
                      >
                        {seg.text}
                      </span>
                    );
                  })}

                  {/* Circular Ornamental Ayah End Marker (۝) */}
                  <span className="inline-flex items-center justify-center mx-2 text-amber-700 font-bold select-none align-middle">
                    <span className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-amber-600/60 bg-amber-50 text-[13px] sm:text-sm shadow-xs">
                      <span className="text-amber-900 font-bold leading-none">{ayah.number}</span>
                    </span>
                  </span>
                </span>
              );
            })}
          </div>

          {/* Active Ayah Translation Callout (if active) */}
          {activeAyahNumber !== null && (
            <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-stone-800 text-sm shadow-sm transition-all" dir="ltr">
              {(() => {
                const cur = ayat.find((a) => a.number === activeAyahNumber);
                if (!cur) return null;
                return (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-amber-900 text-xs uppercase tracking-wider">
                        Ayah {cur.number} Translation & Tajweed
                      </span>
                      <span className="text-xs text-stone-500">Tap words to inspect Tajweed rules</span>
                    </div>
                    <p className="text-stone-700 italic">
                      &ldquo;{cur.translation || "Praise be to God, Lord of all realms."}&rdquo;
                    </p>
                  </div>
                );
              })()}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
