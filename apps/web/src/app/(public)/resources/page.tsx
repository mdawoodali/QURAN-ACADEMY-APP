"use client";

import { useState, useEffect } from "react";
import { Download, BookOpen, FileText, Search, Sparkles, X, Library, Compass, CircleDot, BookMarked } from "lucide-react";
import { QURAN_PARAS } from "@/data/quranParas";
import { DAILY_GUIDES_DATA, GuideResource } from "@/data/guidesData";
import { SHIA_DUAS_ZIYARAT, ShiaDua } from "@/data/shiaToolkitData";
import ShiaToolkit from "@/components/ShiaToolkit";
import DigitalTasbeeh from "@/features/resources/components/DigitalTasbeeh";
import PrayerTimesQibla from "@/features/resources/components/PrayerTimesQibla";
import JafariPrayerSchedule from "@/features/resources/components/JafariPrayerSchedule";
import AsmaUlHusnaView from "@/features/resources/components/AsmaUlHusnaView";
import SeeratView from "@/features/resources/components/SeeratView";
import { useSect } from "@/components/SectContext";
import toast from "react-hot-toast";

type ResourceTab =
  | "quran"
  | "guides"
  | "shia-library"
  | "tasbeeh"
  | "prayer-times"
  | "asma-ul-husna"
  | "seerat";

export default function ResourcesPage() {
  const { sect, isSunni, isShia } = useSect();
  const [activeTab, setActiveTab] = useState<ResourceTab>("quran");
  const [shiaInitialTab, setShiaInitialTab] = useState<
    "texts" | "tasbeeh" | "duas" | "ahkam" | "calendar"
  >("texts");
  const [searchQuery, setSearchQuery] = useState("");

  // In-App Reader Modal state for Guides
  const [selectedGuide, setSelectedGuide] = useState<GuideResource | null>(null);

  // Sync tab with URL query parameters and active sect
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get("tab");
      const subParam = urlParams.get("sub");

      if (
        subParam === "texts" ||
        subParam === "tasbeeh" ||
        subParam === "duas" ||
        subParam === "ahkam" ||
        subParam === "calendar"
      ) {
        setShiaInitialTab(subParam);
      }

      if (isShia) {
        if (
          tabParam === "shia-library" ||
          tabParam === "shia" ||
          tabParam === "shia-toolkit" ||
          tabParam === "toolkit"
        ) {
          setActiveTab("shia-library");
          if (tabParam === "shia-toolkit" || tabParam === "toolkit") {
            setShiaInitialTab("tasbeeh");
          }
        } else if (tabParam === "guides") {
          setActiveTab("guides");
        } else if (tabParam === "tasbeeh") {
          setActiveTab("tasbeeh");
        } else if (tabParam === "prayer-times") {
          setActiveTab("prayer-times");
        } else if (tabParam === "asma-ul-husna") {
          setActiveTab("asma-ul-husna");
        } else if (tabParam === "seerat") {
          setActiveTab("seerat");
        } else if (!tabParam) {
          // Default to Shia Classical Library when entering in Shia mode
          setActiveTab("shia-library");
        }
      } else {
        // Sunni mode: strict protection against Shia tab access
        if (
          tabParam &&
          tabParam !== "shia-library" &&
          tabParam !== "shia" &&
          tabParam !== "shia-toolkit" &&
          tabParam !== "toolkit"
        ) {
          setActiveTab(tabParam as ResourceTab);
        } else {
          setActiveTab("quran");
        }
      }
    } catch {
      // safe fallback
    }
  }, [isShia]);

  // Safety guard: if switched to Sunni while on Shia tab, bounce to Quran
  useEffect(() => {
    if (isSunni && activeTab === "shia-library") {
      setActiveTab("quran");
    }
  }, [isSunni, activeTab]);

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
${s.subheading ? `Subtitle: ${s.subheading}\n` : ""}${s.arabic ? `Arabic:\n${s.arabic}\n` : ""}${s.transliteration ? `Transliteration:\n${s.transliteration}\n` : ""}${s.translation ? `Translation:\n${s.translation}\n` : ""}${s.explanation ? `Explanation:\n${s.explanation}\n` : ""}${s.bullets ? `Points:\n${s.bullets.map((b) => `  * ${b}`).join("\n")}\n` : ""}`
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

  return (
    <main className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 text-white min-h-screen">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-800/80 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-semibold mb-4 shadow-sm">
          <BookOpen size={16} />
          <span>
            {isShia
              ? "Quranic, Classical Shia & Spiritual Reference Library"
              : "Quranic & Classical Islamic Reference Library"}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-4 leading-tight">
          Academy Resources
        </h1>
        <p className="text-emerald-100/85 text-base sm:text-lg leading-relaxed">
          {isShia
            ? "Explore the complete 30 Paras of the Noble Quran, daily Tajweed guides, and our unified Shia Classical Library uniting primary manuscripts with daily spiritual companions."
            : "Explore the complete 30 Paras of the Noble Quran, foundational daily Tajweed guides & Masnoon Duas, and interactive Islamic lifestyle tools with instant in-app readers."}
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex justify-center mb-10">
        <div className="bg-black/50 border border-white/15 p-1.5 rounded-2xl flex flex-wrap gap-2 backdrop-blur-md shadow-xl justify-center max-w-5xl">
          <button
            onClick={() => {
              setActiveTab("quran");
              setSearchQuery("");
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "quran"
                ? "bg-amber-400 text-emerald-950 shadow-md"
                : "text-emerald-100/80 hover:text-white hover:bg-white/10"
            }`}
          >
            <BookOpen size={16} />
            <span>Holy Quran (30 Paras)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("guides");
              setSearchQuery("");
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "guides"
                ? "bg-amber-400 text-emerald-950 shadow-md"
                : "text-emerald-100/80 hover:text-white hover:bg-white/10"
            }`}
          >
            <FileText size={16} />
            <span>Daily guides and Duas</span>
          </button>

          {/* Unified Shia Classical Library Tab - Exclusively visible in Shia mode */}
          {isShia && (
            <button
              onClick={() => {
                setActiveTab("shia-library");
                setSearchQuery("");
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "shia-library"
                  ? "bg-amber-400 text-emerald-950 shadow-md"
                  : "text-emerald-100/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <Library size={16} />
              <span>Shia Classical Library</span>
            </button>
          )}

          <button
            onClick={() => {
              setActiveTab("tasbeeh");
              setSearchQuery("");
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "tasbeeh"
                ? "bg-amber-400 text-emerald-950 shadow-md"
                : "text-emerald-100/80 hover:text-white hover:bg-white/10"
            }`}
          >
            <CircleDot size={16} />
            <span>Digital Tasbeeh</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("prayer-times");
              setSearchQuery("");
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "prayer-times"
                ? "bg-amber-400 text-emerald-950 shadow-md"
                : "text-emerald-100/80 hover:text-white hover:bg-white/10"
            }`}
          >
            <Compass size={16} />
            <span>{isShia ? "Ja'fari Prayer Schedule" : "Prayer Times / Qibla"}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("asma-ul-husna");
              setSearchQuery("");
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "asma-ul-husna"
                ? "bg-amber-400 text-emerald-950 shadow-md"
                : "text-emerald-100/80 hover:text-white hover:bg-white/10"
            }`}
          >
            <Sparkles size={16} />
            <span>99 Names of Allah</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("seerat");
              setSearchQuery("");
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "seerat"
                ? "bg-amber-400 text-emerald-950 shadow-md"
                : "text-emerald-100/80 hover:text-white hover:bg-white/10"
            }`}
          >
            <BookMarked size={16} />
            <span>Seerat un Nabi (S.A.W)</span>
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
                    <span className="font-arabic text-2xl text-amber-300/90" dir="rtl">
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
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
              Daily guides and Duas
            </h2>
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

      {/* MERGED SHIA CLASSICAL LIBRARY (All 6 Sub-Resources Unified in One Hub) */}
      {activeTab === "shia-library" && isShia && (
        <section className="mb-16">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-3">
              <Library size={14} />
              <span>Ahl al-Bayt (AS) Theological & Spiritual Heritage</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-3">
              Shia Classical Library
            </h2>
            <p className="text-sm sm:text-base text-emerald-100/80 max-w-2xl mx-auto">
              Complete unified repository combining primary classical manuscripts with essential daily spiritual companions: Digital Tasbeeh Zahra (SA), Core Duas &amp; Ziyarat, Ja&apos;fari prayer schedule, and Wudhu &amp; Salat Ahkam.
            </p>
          </div>

          {/* Unified Shia Toolkit containing all 6 resources in its sub-navbar */}
          <ShiaToolkit initialTab={shiaInitialTab} />
        </section>
      )}

      {/* TAB 4: DIGITAL TASBEEH */}
      {activeTab === "tasbeeh" && (
        <section className="mb-16">
          <DigitalTasbeeh />
        </section>
      )}

      {/* TAB 5: PRAYER TIMES / QIBLA (OR JA'FARI PRAYER SCHEDULE FOR SHIA) */}
      {activeTab === "prayer-times" && (
        <section className="mb-16">
          {isShia ? <JafariPrayerSchedule /> : <PrayerTimesQibla />}
        </section>
      )}

      {/* TAB 6: 99 NAMES OF ALLAH (ASMA-UL-HUSNA) */}
      {activeTab === "asma-ul-husna" && (
        <section className="mb-16">
          <AsmaUlHusnaView />
        </section>
      )}

      {/* TAB 7: SEERAT UN NABI (S.A.W) */}
      {activeTab === "seerat" && (
        <section className="mb-16">
          <SeeratView />
        </section>
      )}

      {/* IN-APP READER MODAL FOR DAILY GUIDES & DUAS */}
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
                  <span className="text-xs text-amber-300">
                    {selectedGuide.tag} • In-App Document Reader
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadGuide(selectedGuide)}
                  className="bg-amber-400 text-emerald-950 p-2 rounded-xl hover:bg-amber-300 transition cursor-pointer"
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
                    <div
                      className="bg-emerald-950/60 border border-emerald-500/20 rounded-xl p-5 text-right font-quran text-2xl sm:text-3xl text-amber-100 leading-loose"
                      dir="rtl"
                    >
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
                        <li key={bIdx} className="leading-relaxed">
                          {b}
                        </li>
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
    </main>
  );
}
