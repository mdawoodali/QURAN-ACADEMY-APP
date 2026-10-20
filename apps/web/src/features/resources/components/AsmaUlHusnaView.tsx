"use client";

import React, { useState } from "react";
import { Search, Sparkles, Copy, Check, Share2, BookOpen } from "lucide-react";
import { ASMA_UL_HUSNA, AllahName } from "@/data/asmaUlHusna";
import toast from "react-hot-toast";

export default function AsmaUlHusnaView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const filteredNames = ASMA_UL_HUSNA.filter((n) => {
    const q = searchQuery.toLowerCase();
    return (
      n.number.toString().includes(q) ||
      n.transliteration.toLowerCase().includes(q) ||
      n.arabic.includes(q) ||
      n.meaningEnglish.toLowerCase().includes(q) ||
      n.meaningUrdu.includes(q) ||
      n.explanation.toLowerCase().includes(q)
    );
  });

  const handleCopy = (name: AllahName) => {
    const text = `${name.number}. ${name.arabic} (${name.transliteration}) - ${name.meaningEnglish} / ${name.meaningUrdu}\n${name.explanation}\nFrom Quran Learn Academy`;
    navigator.clipboard.writeText(text);
    setCopiedId(name.number);
    toast.success(`Copied: ${name.transliteration}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Info */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The 99 Beautiful Divine Names</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif text-white font-bold">
          Asma-ul-Husna (أسماء الله الحسنى)
        </h2>
        <p className="text-xs sm:text-sm text-emerald-200/80 max-w-2xl mx-auto">
          "And to Allah belong the best names, so invoke Him by them." (Surah Al-A'raf 7:180). Explore the divine attributes, English & Urdu translations, and spiritual virtues.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-200/50" size={20} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Name, English meaning, Urdu or number..."
          className="w-full bg-black/40 border border-white/20 rounded-2xl pl-12 pr-4 py-3.5 text-sm sm:text-base text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 backdrop-blur-md shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded-md text-emerald-200"
          >
            Clear
          </button>
        )}
      </div>

      {/* Grid of 99 Names */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {filteredNames.map((name) => (
          <div
            key={name.number}
            className="glass-container rounded-3xl p-5 border border-white/15 shadow-xl flex flex-col justify-between pop-hover group hover:border-amber-400/40 transition-all duration-300 relative overflow-hidden"
          >
            <div>
              {/* Top Row: Number & Actions */}
              <div className="flex items-center justify-between mb-3">
                <span className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-300 font-bold flex items-center justify-center text-xs shadow-sm">
                  {name.number}
                </span>

                <button
                  onClick={() => handleCopy(name)}
                  title="Copy Divine Name"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-emerald-200/70 hover:text-white transition-colors cursor-pointer"
                >
                  {copiedId === name.number ? <Check size={14} className="text-amber-300" /> : <Copy size={14} />}
                </button>
              </div>

              {/* Calligraphy Box */}
              <div className="bg-black/30 rounded-2xl p-4 mb-3.5 border border-white/5 text-center flex items-center justify-center min-h-[75px] group-hover:border-amber-400/20 transition-colors">
                <span className="font-arabic text-2xl sm:text-3xl text-amber-300 drop-shadow-[0_2px_8px_rgba(251,191,36,0.3)]">
                  {name.arabic}
                </span>
              </div>

              {/* Name & Meanings */}
              <div className="space-y-1 text-center">
                <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-200 transition-colors">
                  {name.transliteration}
                </h4>
                <div className="text-xs text-amber-200/90 font-medium">
                  {name.meaningEnglish}
                </div>
                <div className="text-xs font-urdu text-emerald-200/80">
                  {name.meaningUrdu}
                </div>
              </div>
            </div>

            {/* Explanation / Spiritual Virtue */}
            <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-emerald-200/70 leading-relaxed text-center italic">
              "{name.explanation}"
            </div>
          </div>
        ))}
      </div>

      {filteredNames.length === 0 && (
        <div className="text-center py-12 text-emerald-200/70">
          No names found matching "{searchQuery}".
        </div>
      )}
    </div>
  );
}
