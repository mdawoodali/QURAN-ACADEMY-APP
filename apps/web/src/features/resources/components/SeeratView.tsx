"use client";

import React, { useState } from "react";
import { BookOpen, Clock, ChevronRight, X, Download, Sparkles } from "lucide-react";
import { SEERAT_CHAPTERS, SeeratChapter } from "@/data/seeratData";
import toast from "react-hot-toast";

export default function SeeratView() {
  const [selectedEra, setSelectedEra] = useState<string>("All");
  const [activeChapter, setActiveChapter] = useState<SeeratChapter | null>(null);

  const filteredChapters = SEERAT_CHAPTERS.filter((ch) => {
    if (selectedEra === "All") return true;
    return ch.era === selectedEra;
  });

  const handleDownload = (ch: SeeratChapter) => {
    const text = `======================================================
QURAN LEARN ACADEMY - SEERAT UN NABI (S.A.W)
Chapter ${ch.chapterNumber}: ${ch.title.toUpperCase()}
Era: ${ch.era} (${ch.periodYears})
======================================================

SUMMARY:
${ch.summary}

KEY HISTORICAL EVENTS:
${ch.keyEvents.map((e, i) => `  [${i + 1}] ${e}`).join("\n")}

SPIRITUAL & MORAL LESSONS:
${ch.lessons.map((l) => `  * ${l}`).join("\n")}

COMPLETE HISTORICAL NARRATIVE:
${ch.fullNarrative}

======================================================
Downloaded from Quran Learn Academy
https://quranlearnacademy.com/resources
======================================================`;

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `seerat-chapter-${ch.chapterNumber}-${ch.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded: Chapter ${ch.chapterNumber}`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Info */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold tracking-widest uppercase">
          <BookOpen className="w-3.5 h-3.5" />
          <span>The Blessed Prophetic Biography</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif text-white font-bold">
          Seerat-un-Nabi (سیرت النبی ﷺ)
        </h2>
        <p className="text-xs sm:text-sm text-emerald-200/80 max-w-2xl mx-auto">
          "Indeed in the Messenger of Allah you have an excellent example." (Surah Al-Ahzab 33:21). A comprehensive chronological study of the blessed life, character, trials, and universal triumphs of the Final Messenger.
        </p>
      </div>

      {/* Era Filter Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {["All", "Makkah", "Madinah", "Universal"].map((era) => (
          <button
            key={era}
            onClick={() => setSelectedEra(era)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              selectedEra === era
                ? "bg-amber-400 text-emerald-950 shadow-md"
                : "bg-black/30 text-emerald-200/80 hover:bg-white/10 border border-white/10"
            }`}
          >
            {era === "All" ? "All Chapters (1–9)" : `${era} Era`}
          </button>
        ))}
      </div>

      {/* Timeline Chapters List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChapters.map((ch) => (
          <div
            key={ch.id}
            className="glass-container rounded-3xl p-6 border border-white/15 shadow-xl flex flex-col justify-between pop-hover group hover:border-amber-400/40 transition-all duration-300"
          >
            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-300 font-bold flex items-center justify-center text-xs shadow-sm">
                  {ch.chapterNumber}
                </span>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-700/40">
                  <Clock size={11} />
                  <span>{ch.periodYears}</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg font-bold text-white mb-1 group-hover:text-amber-200 transition-colors">
                {ch.title}
              </h3>
              <div className="text-xs font-urdu text-amber-300/80 mb-3">
                {ch.urduTitle}
              </div>

              {/* Summary */}
              <p className="text-xs text-emerald-100/80 leading-relaxed mb-4 line-clamp-3">
                {ch.summary}
              </p>

              {/* Key Milestones Preview */}
              <div className="space-y-1.5 mb-5 bg-black/30 p-3 rounded-2xl border border-white/5">
                <span className="text-[10px] uppercase font-bold text-amber-400/90 tracking-wider block">
                  Key Milestones:
                </span>
                {ch.keyEvents.slice(0, 2).map((ev, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-[11px] text-emerald-200/80">
                    <span className="text-amber-400 leading-none mt-0.5">•</span>
                    <span className="line-clamp-1">{ev}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Read Button */}
            <button
              onClick={() => setActiveChapter(ch)}
              className="w-full bg-amber-400 hover:bg-emerald-700 text-emerald-950 hover:text-white border border-transparent hover:border-emerald-500/50 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all duration-300 shadow-md cursor-pointer pop-hover"
            >
              <span>Read Full Chapter</span>
              <ChevronRight size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Reader Modal */}
      {activeChapter && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-300">
          <div className="bg-[#05261d] border border-amber-400/40 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-white/10 flex items-start justify-between bg-emerald-950/80">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-widest bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                    Chapter {activeChapter.chapterNumber} • {activeChapter.era} Era
                  </span>
                  <span className="text-xs text-emerald-200/70">{activeChapter.periodYears}</span>
                </div>
                <h3 className="text-lg sm:text-2xl font-serif font-bold text-white">
                  {activeChapter.title}
                </h3>
                <div className="text-xs sm:text-sm font-urdu text-amber-200">
                  {activeChapter.urduTitle}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(activeChapter)}
                  title="Download Chapter"
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <Download size={16} />
                </button>
                <button
                  onClick={() => setActiveChapter(null)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-8 overflow-y-auto space-y-6 text-emerald-100/90 text-sm sm:text-base leading-relaxed">
              {/* Summary Callout */}
              <div className="bg-black/40 border border-white/10 rounded-2xl p-4 sm:p-5 text-emerald-200/90 italic text-xs sm:text-sm">
                "{activeChapter.summary}"
              </div>

              {/* Complete Narrative */}
              <div className="space-y-4 text-justify">
                <h4 className="text-sm uppercase font-bold text-amber-300 tracking-wider">
                  Historical Narrative
                </h4>
                {activeChapter.fullNarrative.split("\n\n").map((para, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>

              {/* Key Events List */}
              <div className="space-y-2 pt-2">
                <h4 className="text-sm uppercase font-bold text-amber-300 tracking-wider">
                  Key Milestones & Turning Points
                </h4>
                <div className="space-y-1.5 bg-black/30 p-4 rounded-2xl border border-white/5">
                  {activeChapter.keyEvents.map((ev, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs sm:text-sm">
                      <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{ev}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Spiritual Lessons */}
              <div className="space-y-2 pt-2">
                <h4 className="text-sm uppercase font-bold text-amber-300 tracking-wider">
                  Timeless Virtues & Lessons
                </h4>
                <div className="space-y-1.5 bg-emerald-950/60 p-4 rounded-2xl border border-emerald-500/20">
                  {activeChapter.lessons.map((ls, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-emerald-200">
                      <Sparkles size={14} className="text-amber-400 shrink-0 mt-1" />
                      <span>{ls}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 flex items-center justify-between bg-emerald-950/80 text-xs">
              <span className="text-emerald-200/70">Source: Authentic Siyar & Hadith Compilations</span>
              <button
                onClick={() => setActiveChapter(null)}
                className="bg-white/10 hover:bg-white/20 text-white font-bold py-1.5 px-4 rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
