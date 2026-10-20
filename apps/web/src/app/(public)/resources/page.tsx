"use client";

import { useState, useEffect } from "react";
import { Download, BookOpen, FileText, Search, ExternalLink, Sparkles, X, ChevronRight, Share2, Printer, Library, Bookmark, Heart } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { QURAN_PARAS, ParaInfo } from "@/data/quranParas";
import { DAILY_GUIDES_DATA, GuideResource } from "@/data/guidesData";
import { SHIA_LIBRARY_BOOKS, ShiaBook, ShiaBookSection } from "@/data/shiaLibrary";
import ShiaToolkit from "@/components/ShiaToolkit";
import toast from "react-hot-toast";

export default function ResourcesPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"quran" | "guides" | "shia-toolkit" | "shia-library">("quran");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedSect = localStorage.getItem("user_sect");
        const urlParams = new URLSearchParams(window.location.search);
        const tabParam = urlParams.get("tab");
        if (tabParam === "shia-toolkit" || tabParam === "toolkit" || tabParam === "shia") {
          setActiveTab("shia-toolkit");
        } else if (tabParam === "shia-library") {
          setActiveTab("shia-library");
        } else if (tabParam === "guides") {
          setActiveTab("guides");
        } else if (savedSect === "shia" && !tabParam) {
          setActiveTab("shia-toolkit");
        }
      } catch (e) {
        // safe fallback
      }
    }
  }, []);

  // In-App Reader Modal states
  const [selectedGuide, setSelectedGuide] = useState<GuideResource | null>(null);
  const [selectedShiaBook, setSelectedShiaBook] = useState<ShiaBook | null>(null);
  const [selectedShiaSection, setSelectedShiaSection] = useState<ShiaBookSection | null>(null);

  // Filter Quran Paras
  const filteredParas = QURAN_PARAS.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.number.toString().includes(q) ||
      p.nameTranslit.toLowerCase().includes(q) ||
      p.nameArabic.includes(q) ||
      p.meaningEnglish.toLowerCase().includes(q) ||
      p.startSurah.toLowerCase().includes(q)
    );
  });

  // Filter Shia Library Books
  const filteredShiaBooks = SHIA_LIBRARY_BOOKS.filter((b) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      b.title.toLowerCase().includes(q) ||
      b.arabicTitle.includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.description.toLowerCase().includes(q);
    const matchesCat = selectedCategory === "All" || b.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Download Guide helper (creates an instant offline readable document download)
  const handleDownloadGuide = (guide: GuideResource) => {
    const content = `======================================================
QURAN LEARN ACADEMY - RESOURCE DOCUMENT
${guide.title.toUpperCase()}
Category: ${guide.tag}
======================================================

${guide.desc}

${guide.sections
  .map(
    (s, idx) => `
[${idx + 1}] ${s.heading}
${s.subheading ? `Subtitle: ${s.subheading}\n` : ""}${s.arabic ? `Arabic:\n${s.arabic}\n` : ""}${s.transliteration ? `Transliteration:\n${s.transliteration}\n` : ""}${s.translation ? `Translation:\n${s.translation}\n` : ""}${s.explanation ? `Explanation:\n${s.explanation}\n` : ""}${s.bullets ? `Points:\n${s.bullets.map(b => `  * ${b}`).join("\n")}\n` : ""}`
  )
  .join("\n------------------------------------------------------\n")}

======================================================
Downloaded from Quran Learn Academy Resources
https://quranlearnacademy.com/resources
======================================================`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${guide.id}-study-guide.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded: ${guide.title}`);
  };

  // Download Shia Book Excerpt helper
  const handleDownloadShiaBook = (book: ShiaBook) => {
    const content = `======================================================
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

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
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
    <main className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 text-white min-h-screen">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-800/80 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-semibold mb-4 shadow-sm">
          <BookOpen size={16} />
          <span>Quranic & Classical Islamic Reference Library</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-4 leading-tight">
          Academy Resources
        </h1>
        <p className="text-emerald-100/85 text-base sm:text-lg leading-relaxed">
          Explore the complete 30 Paras of the Noble Quran, foundational daily Tajweed guides & Duas, and our curated Shia Classical Reference Library with instant in-app readers.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex justify-center mb-10">
        <div className="bg-black/50 border border-white/15 p-1.5 rounded-2xl flex flex-wrap gap-2 backdrop-blur-md shadow-xl justify-center">
          <button
            onClick={() => { setActiveTab("quran"); setSearchQuery(""); }}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm sm:text-base font-bold transition-all cursor-pointer ${
              activeTab === "quran"
                ? "bg-amber-400 text-emerald-950 shadow-md"
                : "text-emerald-100/80 hover:text-white hover:bg-white/10"
            }`}
          >
            <BookOpen size={18} />
            <span>The Holy Quran (30 Paras)</span>
          </button>
          
          <button
            onClick={() => { setActiveTab("guides"); setSearchQuery(""); }}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm sm:text-base font-bold transition-all cursor-pointer ${
              activeTab === "guides"
                ? "bg-amber-400 text-emerald-950 shadow-md"
                : "text-emerald-100/80 hover:text-white hover:bg-white/10"
            }`}
          >
            <FileText size={18} />
            <span>Daily Guides & Duas</span>
          </button>

          <button
            onClick={() => { setActiveTab("shia-toolkit"); setSearchQuery(""); }}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm sm:text-base font-bold transition-all cursor-pointer ${
              activeTab === "shia-toolkit"
                ? "bg-amber-400 text-emerald-950 shadow-md"
                : "text-emerald-100/80 hover:text-white hover:bg-white/10"
            }`}
          >
            <Heart size={18} className={activeTab === "shia-toolkit" ? "text-emerald-950 fill-emerald-950" : "text-amber-400 fill-amber-400"} />
            <span>Shia Tool Kit</span>
          </button>

          <button
            onClick={() => { setActiveTab("shia-library"); setSearchQuery(""); }}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm sm:text-base font-bold transition-all cursor-pointer ${
              activeTab === "shia-library"
                ? "bg-amber-400 text-emerald-950 shadow-md"
                : "text-emerald-100/80 hover:text-white hover:bg-white/10"
            }`}
          >
            <Library size={18} />
            <span>Shia Classical Library</span>
          </button>
        </div>
      </div>

      {/* TAB 1: THE HOLY QURAN (ALL 30 PARAS) */}
      {activeTab === "quran" && (
        <section>
          {/* Search Bar */}
          <div className="max-w-xl mx-auto mb-10 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-200/50" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Para by number, Arabic name, or Surah..."
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

          {/* Paras Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredParas.map((para) => (
              <div
                key={para.number}
                className="glass-container rounded-3xl p-6 border border-white/15 shadow-xl flex flex-col justify-between pop-hover group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-300 font-bold flex items-center justify-center text-sm shadow-sm">
                      {para.number}
                    </span>
                    <span className="text-xs font-semibold text-emerald-200/70 bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-700/40">
                      {para.ayahRange}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="text-xl font-serif font-bold text-white group-hover:text-amber-300 transition-colors">
                      {para.nameTranslit}
                    </h3>
                    <span className="font-arabic text-2xl text-amber-200/90" dir="rtl">
                      {para.nameArabic}
                    </span>
                  </div>

                  <p className="text-xs text-amber-300/80 italic mb-4 font-serif">
                    &ldquo;{para.meaningEnglish}&rdquo;
                  </p>

                  <div className="text-xs text-emerald-100/75 space-y-1 border-t border-white/10 pt-3 mb-6">
                    <p><span className="text-emerald-200/50">Surah Coverage:</span> {para.startSurah}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                  <a
                    href={para.readUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-800/80 hover:bg-emerald-700 text-amber-300 border border-amber-400/30 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm cursor-pointer"
                  >
                    <BookOpen size={15} />
                    <span>Read Now</span>
                  </a>

                  <a
                    href={para.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={`Para-${para.number.toString().padStart(2, "0")}.pdf`}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shadow-md cursor-pointer"
                  >
                    <Download size={15} />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 2: DAILY GUIDES & DUAS */}
      {activeTab === "guides" && (
        <section className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">Essential Daily Guides & Masnoon Duas</h2>
            <p className="text-sm sm:text-base text-emerald-100/80">
              Instant interactive in-app reading without external download delays, plus full offline export.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {DAILY_GUIDES_DATA.map((guide) => (
              <div
                key={guide.id}
                className="glass-container rounded-3xl p-8 border border-white/15 shadow-xl flex flex-col justify-between pop-hover"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-emerald-800/80 border border-amber-400/40 rounded-xl flex items-center justify-center text-amber-300 shadow-sm">
                      <FileText size={24} />
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300">
                      {guide.tag}
                    </span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-white mb-2">{guide.title}</h3>
                  <p className="text-emerald-100/75 text-sm leading-relaxed mb-6">{guide.desc}</p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-emerald-100/60 font-semibold">{guide.format}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedGuide(guide)}
                      className="flex items-center gap-1.5 bg-emerald-800/80 hover:bg-emerald-700 text-amber-300 border border-amber-400/30 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                    >
                      <BookOpen size={14} />
                      <span>Read Now</span>
                    </button>
                    <button
                      onClick={() => handleDownloadGuide(guide)}
                      className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 px-4 py-2 rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
                    >
                      <Download size={14} />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 3: SHIA TOOL KIT */}
      {activeTab === "shia-toolkit" && (
        <section className="mb-16">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-3">
              <Heart size={14} className="fill-amber-400" />
              <span>Dedicated Spiritual & Jurisprudential Companion</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-3">Shia Islamic Tool Kit</h2>
            <p className="text-sm sm:text-base text-emerald-100/80 max-w-2xl mx-auto">
              Comprehensive spiritual tools for students and families: Digital Tasbeeh of Fatima Zahra (SA), Core Ziyarat & Duas with line-by-line translation, Ja'fari prayer times, and step-by-step Wudhu & Salat Ahkam.
            </p>
          </div>

          <ShiaToolkit />
        </section>
      )}

      {/* TAB 4: SHIA CLASSICAL LIBRARY */}
      {activeTab === "shia-library" && (
        <section className="mb-16">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-3">
              <Library size={14} />
              <span>Ahl al-Bayt (AS) Theological & Spiritual Heritage</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">Classical Shia Reference Library</h2>
            <p className="text-sm sm:text-base text-emerald-100/80">
              Primary reference works by the Holy Prophet (PBUH) and the Ahl al-Bayt (AS). Available via built-in interactive reader and offline export, maintained with administrative expandable collections.
            </p>
          </div>

          {/* Category Filter Pills & Search */}
          <div className="flex flex-wrap items-center justify-between gap-4 max-w-4xl mx-auto mb-8">
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

            <div className="w-full sm:w-64 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-200/50" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Shia texts..."
                className="w-full bg-black/40 border border-white/20 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Shia Books Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredShiaBooks.map((book) => (
              <div
                key={book.id}
                className="glass-container rounded-3xl p-8 border border-white/15 shadow-xl flex flex-col justify-between pop-hover group"
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
                    <h3 className="text-2xl font-serif font-bold text-white group-hover:text-amber-300 transition-colors">
                      {book.title}
                    </h3>
                    <span className="font-arabic text-2xl text-amber-300/90" dir="rtl">
                      {book.arabicTitle}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-emerald-200/90 mb-1">
                    Attributed: <strong className="text-white">{book.author}</strong> • {book.compiler}
                  </p>
                  <p className="text-xs text-emerald-200/60 mb-4">{book.era}</p>

                  <p className="text-emerald-100/80 text-sm leading-relaxed mb-6">{book.description}</p>

                  <div className="bg-emerald-950/50 border border-emerald-800/30 rounded-xl p-3 text-xs text-emerald-200/80 mb-6">
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
                      className="flex items-center gap-1.5 bg-emerald-800/80 hover:bg-emerald-700 text-amber-300 border border-amber-400/30 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                    >
                      <BookOpen size={14} />
                      <span>Read Now</span>
                    </button>
                    <button
                      onClick={() => handleDownloadShiaBook(book)}
                      className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 px-4 py-2 rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
                    >
                      <Download size={14} />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Admin Expandability Note */}
          <div className="mt-12 text-center bg-black/30 border border-white/10 rounded-2xl p-6 max-w-2xl mx-auto">
            <p className="text-xs text-emerald-200/70 leading-relaxed">
              <strong className="text-amber-300">Academy Catalog Note:</strong> The Shia Library is dynamically expandable by Academy Administrators through the Admin Portal, supporting digital transcription, translation cross-checks, and downloadable offline bundles where licensing permits.
            </p>
          </div>
        </section>
      )}

      {/* MODAL 1: IN-APP READER FOR DAILY GUIDES & DUAS */}
      {selectedGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-[#04241b] border border-amber-400/30 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-white/15 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-800/80 border border-amber-400/40 rounded-xl flex items-center justify-center text-amber-300">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-white">{selectedGuide.title}</h3>
                  <span className="text-xs text-amber-300">{selectedGuide.tag} • In-App Document Reader</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadGuide(selectedGuide)}
                  className="bg-amber-400 text-emerald-950 p-2 rounded-xl hover:bg-amber-300 transition"
                  title="Download File"
                >
                  <Download size={18} />
                </button>
                <button
                  onClick={() => setSelectedGuide(null)}
                  className="bg-white/10 text-white p-2 rounded-xl hover:bg-white/20 transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Scrollable Document Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
              <p className="text-emerald-100/80 text-sm leading-relaxed border-b border-white/10 pb-4">
                {selectedGuide.desc}
              </p>

              {selectedGuide.sections.map((section, idx) => (
                <div key={idx} className="bg-black/30 border border-white/10 rounded-2xl p-6 space-y-4">
                  <h4 className="text-lg font-bold text-amber-300 font-serif">{section.heading}</h4>
                  {section.subheading && (
                    <p className="text-xs text-emerald-200/70 font-semibold">{section.subheading}</p>
                  )}

                  {section.arabic && (
                    <div className="bg-emerald-950/60 border border-emerald-500/20 rounded-xl p-5 text-right font-quran text-2xl sm:text-3xl text-amber-100 leading-loose" dir="rtl">
                      {section.arabic}
                    </div>
                  )}

                  {section.transliteration && (
                    <p className="text-xs text-amber-200/80 italic font-mono">
                      {section.transliteration}
                    </p>
                  )}

                  {section.translation && (
                    <p className="text-sm text-emerald-100/90 leading-relaxed font-sans bg-white/5 p-3.5 rounded-xl border-l-4 border-amber-400">
                      &ldquo;{section.translation}&rdquo;
                    </p>
                  )}

                  {section.explanation && (
                    <p className="text-xs text-emerald-200/80 leading-relaxed">
                      {section.explanation}
                    </p>
                  )}

                  {section.bullets && (
                    <ul className="space-y-2 text-xs sm:text-sm text-emerald-100/80 list-disc list-inside">
                      {section.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="leading-relaxed">{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs text-emerald-200/60">
              <span>Quran Learn Academy Verified Content</span>
              <button
                onClick={() => setSelectedGuide(null)}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl font-bold transition cursor-pointer"
              >
                Close Reader
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: IN-APP READER FOR SHIA REFERENCE BOOKS */}
      {selectedShiaBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-[#031d16] border border-amber-400/40 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
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
          </div>
        </div>
      )}
    </main>
  );
}
