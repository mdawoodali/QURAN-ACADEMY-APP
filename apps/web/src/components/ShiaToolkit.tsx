"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, Library, Search, Download, X, Shield, Calendar 
} from "lucide-react";
import toast from "react-hot-toast";
import { SHIA_LIBRARY_BOOKS, ShiaBook, ShiaBookSection } from "@/data/shiaLibrary";
import { 
  SHIA_AHKAM_GUIDES,
  MASOOMEEN_CALENDAR
} from "@/data/shiaToolkitData";

interface ShiaToolkitProps {
  initialTab?: "texts" | "ahkam" | "calendar";
  hideSubNavbar?: boolean;
}

export default function ShiaToolkit({ 
  initialTab = "texts",
  hideSubNavbar = false 
}: ShiaToolkitProps) {
  const [activeSubTab, setActiveSubTab] = useState<"texts" | "ahkam" | "calendar">(
    (initialTab as string) === "duas" || (initialTab as string) === "tasbeeh" ? "texts" : initialTab
  );

  useEffect(() => {
    if (initialTab && (initialTab === "texts" || initialTab === "ahkam" || initialTab === "calendar")) {
      queueMicrotask(() => setActiveSubTab(initialTab));
    }
  }, [initialTab]);
  // -------------------------------------------------------------
  // 0. CLASSICAL REFERENCE TEXTS STATE
  // -------------------------------------------------------------
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [bookSearchQuery, setBookSearchQuery] = useState<string>("");
  const [selectedShiaBook, setSelectedShiaBook] = useState<ShiaBook | null>(null);
  const [selectedShiaSection, setSelectedShiaSection] = useState<ShiaBookSection | null>(null);

  const filteredShiaBooks = useMemo(() => {
    const q = bookSearchQuery.toLowerCase();
    return SHIA_LIBRARY_BOOKS.filter((b) => {
      const matchesSearch =
        b.title.toLowerCase().includes(q) ||
        b.arabicTitle.includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q);
      const matchesCat = selectedCategory === "All" || b.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [bookSearchQuery, selectedCategory]);

  const handleDownloadShiaBook = (book: ShiaBook) => {
    const fileContent = `======================================================
QURAN LEARN ACADEMY - SHIA REFERENCE LIBRARY
${book.title.toUpperCase()} (${book.arabicTitle})
Author: ${book.author}
Compiler: ${book.compiler}
Era: ${book.era}
Licensing: ${book.licensing}
======================================================

OVERVIEW:
${book.description}

TOTAL VOLUMES / SCOPE:
${book.totalSections}

SELECTED EXTRACTS & CORE TRADITIONS:
${book.sections
  .map(
    (s, idx) => `
------------------------------------------------------
[${idx + 1}] ${s.title} (${s.arabicTitle})
Theme: ${s.theme}
Source Citation: ${s.sourceReference}

ARABIC:
${s.arabicText}

ENGLISH TRANSLATION:
${s.englishTranslation}
`
  )
  .join("\n")}

======================================================
Note: Shia Reference Texts in Quran Learn Academy are maintained under educational review and expandable by authorized Academy Administrators.
https://quranlearnacademy.com/resources
======================================================`;

    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = book.downloadFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Exported: ${book.title}`);
  };

  return (
    <div className="w-full">
      {/* UNIFIED 3-ITEM SUB-NAVBAR (Classical Manuscripts & Canonical Guides) */}
      {!hideSubNavbar && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-8 bg-black/40 border border-white/10 p-2 rounded-2xl backdrop-blur-md max-w-4xl mx-auto shadow-xl">
        {[
          { key: "texts", label: "Classical Reference Texts", icon: Library },
          { key: "ahkam", label: "Wudhu & Salat Ahkam", icon: Shield },
          { key: "calendar", label: "14 Infallibles Calendar", icon: Calendar },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveSubTab(key as typeof activeSubTab)}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer text-center ${
              activeSubTab === key
                ? "bg-amber-400 text-emerald-950 shadow-md scale-[1.02]"
                : "text-emerald-100/80 hover:text-white hover:bg-white/10"
            }`}
          >
            <Icon size={16} className="shrink-0" />
            <span className="truncate">{label}</span>
          </button>
        ))}
      </div>
      )}

      {/* ========================================================= */}
      {/* 0. CLASSICAL REFERENCE TEXTS (CANONICAL MANUSCRIPTS)      */}
      {/* ========================================================= */}
      {activeSubTab === "texts" && (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
          {/* Header & Search */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {["All", "Sermons & Letters", "Supplications", "Hadith", "Rites & Ziyarat"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-amber-400 text-emerald-950 shadow-sm"
                      : "bg-black/40 text-emerald-100/70 hover:text-white border border-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="w-full sm:w-72 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-200/50" size={16} />
              <input
                type="text"
                value={bookSearchQuery}
                onChange={(e) => setBookSearchQuery(e.target.value)}
                placeholder="Search Nahj al-Balagha, Al-Kafi..."
                className="w-full bg-black/40 border border-white/20 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Shia Books Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredShiaBooks.map((book) => (
              <div
                key={book.id}
                className="glass-container rounded-3xl p-6 sm:p-8 border border-white/15 shadow-xl flex flex-col justify-between pop-hover group text-left"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300">
                      {book.category}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-200/70 bg-emerald-950/60 px-2.5 py-0.5 rounded-lg border border-emerald-800/40">
                      {book.licensing}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-white group-hover:text-amber-300 transition-colors">
                      {book.title}
                    </h3>
                    <span className="font-arabic text-xl sm:text-2xl text-amber-300/90" dir="rtl">
                      {book.arabicTitle}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-emerald-200/90 mb-1">
                    Attributed: <strong className="text-white">{book.author}</strong> • {book.compiler}
                  </p>
                  <p className="text-xs text-emerald-200/60 mb-3">{book.era}</p>
                  <p className="text-emerald-100/80 text-xs sm:text-sm leading-relaxed mb-5">{book.description}</p>

                  <div className="bg-emerald-950/50 border border-emerald-800/30 rounded-xl p-3 text-xs text-emerald-200/80 mb-5">
                    <strong className="text-amber-300">Scope: </strong>
                    {book.totalSections}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-emerald-200/60 font-medium">In-app Reader & Text Export</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedShiaBook(book);
                        setSelectedShiaSection(book.sections[0] || null);
                      }}
                      className="flex items-center gap-1.5 bg-emerald-800/80 hover:bg-emerald-700 text-amber-300 border border-amber-400/30 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                    >
                      <BookOpen size={14} />
                      <span>Read Now</span>
                    </button>
                    <button
                      onClick={() => handleDownloadShiaBook(book)}
                      className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
                    >
                      <Download size={14} />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Catalog Note */}
          <div className="text-center bg-black/30 border border-white/10 rounded-2xl p-5 max-w-2xl mx-auto">
            <p className="text-xs text-emerald-200/70 leading-relaxed">
              <strong className="text-amber-300">Academy Catalog Note:</strong> The Classical Reference manuscripts are expandable by Academy Administrators through the Admin Portal, supporting digital transcription, translation verification, and downloadable offline bundles.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. SHIA AHKAM COMPANION TAB                               */}
      {/* ========================================================= */}
      {activeSubTab === "ahkam" && (
        <div className="max-w-4xl mx-auto space-y-6">
          {SHIA_AHKAM_GUIDES.map((guide) => (
            <div
              key={guide.id}
              className="bg-gradient-to-b from-[#032219]/90 to-[#021811]/90 border border-white/10 rounded-2xl p-6 sm:p-8 text-left shadow-xl"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full border border-amber-400/30">
                  {guide.category} Guidelines
                </span>
                <span className="font-arabic text-lg text-emerald-300">{guide.arabicTitle}</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mb-2">{guide.title}</h3>
              <p className="text-xs sm:text-sm text-emerald-100/80 mb-6 leading-relaxed bg-black/30 p-3 rounded-xl border border-white/10">
                {guide.rulingSummary}
              </p>

              {/* Step Sequence */}
              <div className="space-y-4">
                {guide.steps.map((st) => (
                  <div key={st.stepNumber} className="flex items-start gap-3.5 bg-white/5 p-4 rounded-xl border border-white/5">
                    <span className="w-7 h-7 rounded-full bg-amber-400 text-emerald-950 font-bold text-xs flex items-center justify-center shrink-0">
                      {st.stepNumber}
                    </span>
                    <div className="flex-1">
                      <div className="text-white font-bold text-sm mb-1">{st.title}</div>
                      <div className="text-xs text-emerald-100/80 leading-relaxed">{st.instruction}</div>
                      {st.fiqhNote && (
                        <div className="mt-2 text-[11px] text-amber-300/90 font-medium bg-amber-400/10 p-2 rounded-lg border border-amber-400/20">
                          <strong>Jurisprudential Note: </strong>{st.fiqhNote}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2 text-[11px] text-emerald-200/60">
                <strong className="text-white">Authentic References: </strong>
                {guide.sources.join(" • ")}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. THE 14 INFALLIBLES (MASOOMEEN AS) CALENDAR             */}
      {/* ========================================================= */}
      {activeSubTab === "calendar" && (
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-serif font-bold text-white mb-2">Sacred Timeline of the 14 Infallibles (Chahardah Masoomeen AS)</h3>
            <p className="text-xs sm:text-sm text-emerald-200/70 max-w-2xl mx-auto">
              From the Noble Messenger (SAWW) and Sayyida Fatima al-Zahra (SA) to the 12 Imams (AS). Key dates for Wiladat (joyful celebrations) and Shahadat (commemorations).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MASOOMEEN_CALENDAR.map((m) => (
              <div
                key={m.number}
                className="bg-gradient-to-b from-[#032219]/90 to-[#021811]/90 border border-white/10 rounded-2xl p-5 text-left shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-amber-300 font-bold mb-2">
                    <span className="bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">#{m.number} of 14</span>
                    <span className="text-emerald-200/70 font-mono text-[11px]">{m.kuniyya}</span>
                  </div>
                  <h4 className="text-base sm:text-lg font-serif font-bold text-white mb-0.5">{m.name}</h4>
                  <p className="text-xs text-amber-300/80 mb-3 font-medium">{m.title}</p>

                  <div className="space-y-1.5 text-xs text-emerald-100/80 border-t border-white/10 pt-3">
                    <div><strong className="text-white">Parents:</strong> {m.father} & {m.mother}</div>
                    <div><strong className="text-white">Birth:</strong> {m.birthHijri} ({m.birthLocation})</div>
                    <div><strong className="text-white">Martyrdom:</strong> {m.martyrdomHijri}</div>
                    <div><strong className="text-white">Shrine:</strong> {m.shrineLocation}</div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 text-[11px] bg-black/30 p-2.5 rounded-xl border border-white/5 text-amber-200/90">
                  <strong className="text-amber-400">Key Commemorations: </strong>{m.keyCommemoration}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* IN-APP READER MODAL FOR SHIA REFERENCE BOOKS              */}
      {/* ========================================================= */}
      <AnimatePresence>
        {selectedShiaBook && (
          <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#031d16] border border-amber-400/40 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Top Bar */}
              <div className="p-6 border-b border-white/15 flex items-center justify-between bg-black/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-800/80 border border-amber-400/40 rounded-xl flex items-center justify-center text-amber-300">
                    <Library size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                      <span>{selectedShiaBook.title}</span>
                      <span className="font-arabic text-lg text-amber-300">({selectedShiaBook.arabicTitle})</span>
                    </h3>
                    <span className="text-xs text-emerald-200/70">{selectedShiaBook.author} • {selectedShiaBook.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadShiaBook(selectedShiaBook)}
                    className="bg-amber-400 text-emerald-950 p-2 rounded-xl hover:bg-amber-300 transition"
                    title="Export Book Content"
                  >
                    <Download size={18} />
                  </button>
                  <button
                    onClick={() => { setSelectedShiaBook(null); setSelectedShiaSection(null); }}
                    className="bg-white/10 text-white p-2 rounded-xl hover:bg-white/20 transition cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Split Reader View */}
              <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
                {/* Left Column: Chapters / Excerpts Index */}
                <div className="w-full md:w-72 bg-black/30 border-b md:border-b-0 md:border-r border-white/10 p-4 overflow-y-auto shrink-0">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300/80 mb-3 px-2">
                    Key Chapters & Discourses
                  </div>
                  <div className="space-y-1.5">
                    {selectedShiaBook.sections.map((sec) => (
                      <button
                        key={sec.id}
                        onClick={() => setSelectedShiaSection(sec)}
                        className={`w-full text-left p-3 rounded-xl transition text-xs flex flex-col gap-1 cursor-pointer ${
                          selectedShiaSection?.id === sec.id
                            ? "bg-amber-400 text-emerald-950 font-bold shadow-sm"
                            : "text-emerald-100/80 hover:bg-white/10"
                        }`}
                      >
                        <span className="line-clamp-1">{sec.title}</span>
                        <span className={`text-[10px] ${selectedShiaSection?.id === sec.id ? "text-emerald-900" : "text-amber-300/70"}`}>
                          {sec.theme}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right Column: Active Reader Pane */}
                <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
                  {selectedShiaSection ? (
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-0.5 rounded-full font-semibold">
                            {selectedShiaSection.theme}
                          </span>
                          <span className="text-xs text-emerald-200/60 font-mono">
                            {selectedShiaSection.sourceReference}
                          </span>
                        </div>
                        <h4 className="text-2xl font-serif font-bold text-white mb-1">
                          {selectedShiaSection.title}
                        </h4>
                        <div className="text-right font-arabic text-xl text-amber-300" dir="rtl">
                          {selectedShiaSection.arabicTitle}
                        </div>
                      </div>

                      {/* Arabic Text Callout */}
                      <div className="bg-emerald-950/70 border border-emerald-500/25 rounded-2xl p-6 text-right font-quran text-2xl sm:text-3xl text-amber-100 leading-[2.4] shadow-inner select-text" dir="rtl">
                        {selectedShiaSection.arabicText}
                      </div>

                      {/* English Translation */}
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <div className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
                          English Translation:
                        </div>
                        <p className="text-sm sm:text-base text-emerald-50 leading-relaxed font-sans select-text">
                          &ldquo;{selectedShiaSection.englishTranslation}&rdquo;
                        </p>
                      </div>

                      {/* Source Citation */}
                      <div className="text-xs text-emerald-200/60 border-t border-white/10 pt-4 flex items-center justify-between">
                        <span>Source: {selectedShiaSection.sourceReference}</span>
                        <span className="text-amber-300/80">Quran Learn Academy Classical Series</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-emerald-100/60">
                      Select a chapter from the left to read.
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-white/10 bg-black/50 flex items-center justify-between text-xs text-emerald-200/60">
                <span>Admin Expandable Classical Shia Corpus</span>
                <button
                  onClick={() => { setSelectedShiaBook(null); setSelectedShiaSection(null); }}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl font-bold transition cursor-pointer"
                >
                  Close Reader
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
