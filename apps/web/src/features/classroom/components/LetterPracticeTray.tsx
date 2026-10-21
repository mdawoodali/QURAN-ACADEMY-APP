"use client";

import React from "react";
import { splitArabicWord } from "../constants";

interface LetterPracticeTrayProps {
  wordIndex: number | null;
  words: string[];
}

export default function LetterPracticeTray({ wordIndex, words }: LetterPracticeTrayProps) {
  if (wordIndex === null || !words[wordIndex]) return null;
  const word = words[wordIndex]!;
  const letters = splitArabicWord(word);

  return (
    <div className="mt-4 bg-emerald-50 rounded-2xl p-3 md:p-4 border border-emerald-100 animate-in fade-in shadow-inner w-full max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-2">
        <div className="text-[10px] md:text-xs font-bold text-emerald-800 tracking-widest uppercase">
          Letter Practice (Huroof Breakdown)
        </div>
        <div className="text-emerald-700 text-sm font-bold">{word}</div>
      </div>
      <div className="flex justify-center gap-2 md:gap-3 flex-row-reverse flex-wrap" dir="rtl">
        {letters.map((letter, i) => (
          <div
            key={i}
            className="bg-white border-2 border-emerald-200 rounded-xl w-10 h-12 md:w-12 md:h-14 flex items-center justify-center text-xl md:text-2xl font-quran text-[#0C4A3A] shadow-xs hover:scale-110 transition cursor-pointer"
          >
            {letter}
          </div>
        ))}
      </div>
    </div>
  );
}
