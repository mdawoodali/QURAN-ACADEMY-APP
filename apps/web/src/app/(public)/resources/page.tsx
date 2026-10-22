"use client";

import { useState, useEffect, useMemo } from "react";
import { Download, BookOpen, FileText, Search, Sparkles, X, Library, Compass, CircleDot, BookMarked, Copy, Check, Shield, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  | "texts"
  | "ahkam"
  | "calendar"
  | "tasbeeh"
  | "prayer-times"
  | "asma-ul-husna"
  | "seerat";

export default function ResourcesPage() {
  const { isSunni, isShia } = useSect();
  const [activeTab, setActiveTab] = useState<ResourceTab>("quran");
  const [shiaInitialTab, setShiaInitialTab] = useState<
    "texts" | "ahkam" | "calendar"
  >("texts");
  const [searchQuery, setSearchQuery] = useState("");

  // Daily guides and Duas Category & Search State
  const [guidesFilter, setGuidesFilter] = useState<string>("all");
  const [guidesSearch, setGuidesSearch] = useState<string>("");

  // In-App Reader Modal states
  const [selectedGuide, setSelectedGuide] = useState<GuideResource | null>(null);
  const [selectedDua, setSelectedDua] = useState<ShiaDua | null>(null);
  const [copiedDuaId, setCopiedDuaId] = useState<string | null>(null);

  // Sync tab with URL query parameters and active sect
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get("tab");
      const subParam = urlParams.get("sub");

      queueMicrotask(() => {
        if (subParam === "texts" || tabParam === "texts") {
          setActiveTab("texts");
          return;
        } else if (subParam === "ahkam" || tabParam === "ahkam") {
          setActiveTab("ahkam");
          return;
        } else if (subParam === "calendar" || tabParam === "calendar") {
          setActiveTab("calendar");
          return;
        } else if (subParam === "duas" || tabParam === "duas") {
          setActiveTab("guides");
          setGuidesFilter("duas");
          return;
        } else if (subParam === "tasbeeh" || tabParam === "tasbeeh") {
          setActiveTab("tasbeeh");
          return;
        }

        if (isShia) {
          if (
            tabParam === "texts" ||
            tabParam === "ahkam" ||
            tabParam === "calendar" ||
            tabParam === "quran" ||
            tabParam === "guides" ||
            tabParam === "tasbeeh" ||
            tabParam === "prayer-times" ||
            tabParam === "asma-ul-husna" ||
            tabParam === "seerat"
          ) {
            setActiveTab(tabParam as ResourceTab);
          } else if (
            tabParam === "shia-library" ||
            tabParam === "shia" ||
            tabParam === "shia-toolkit" ||
            tabParam === "toolkit"
          ) {
            setActiveTab("texts");
          } else if (!tabParam) {
            setActiveTab("quran");
          }
        } else {
          // Sunni mode: strict protection against Shia tab access
          if (
            tabParam &&
            tabParam !== "texts" &&
            tabParam !== "ahkam" &&
            tabParam !== "calendar" &&
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
      });
    } catch {
      // safe fallback
    }
  }, [isShia]);

  // Safety guard: if switched to Sunni while on Shia tab, bounce to Quran
  useEffect(() => {
    if (isSunni && (activeTab === "texts" || activeTab === "ahkam" || activeTab === "calendar")) {
      queueMicrotask(() => setActiveTab("quran"));
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

  // Download Dua helper
  const handleDownloadDua = (dua: ShiaDua) => {
    const content = `======================================================
QURAN LEARN ACADEMY - DAILY GUIDES AND DUAS
${dua.title.toUpperCase()} (${dua.arabicTitle})
Source: ${dua.source}
Occasion: ${dua.occasion}
======================================================

${dua.fullDesc}

======================================================
RECITATION (ARABIC, TRANSLITERATION & TRANSLATION):
======================================================

${dua.paragraphs
  .map(
    (p, i) => `
[${i + 1}]
ARABIC:
${p.arabic}

TRANSLITERATION:
${p.transliteration}

TRANSLATION:
${p.translation}
------------------------------------------------------`
  )
  .join("\n")}

======================================================
Downloaded from Quran Learn Academy Resources
https://quranlearnacademy.com/resources
======================================================`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${dua.slug}-daily-guides-and-duas.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded: ${dua.title}`);
  };

  // Copy Dua helper
  const handleCopyDua = (dua: ShiaDua) => {
    const text = `${dua.title} (${dua.arabicTitle})\nSource: ${dua.source}\nOccasion: ${dua.occasion}\n\n` +
      dua.paragraphs
        .map(
          (p, i) =>
            `[${i + 1}]\nArabic: ${p.arabic}\nTransliteration: ${p.transliteration}\nTranslation: ${p.translation}`
        )
        .join("\n\n");
    navigator.clipboard.writeText(text);
    setCopiedDuaId(dua.id);
    setTimeout(() => setCopiedDuaId(null), 2500);
    toast.success("Recitation copied to clipboard!");
  };

  // Filtered Daily Guides & Duas
  const filteredDailyGuides = useMemo(() => {
    const q = guidesSearch.toLowerCase();
    return DAILY_GUIDES_DATA.filter((g) => {
      const matchesSearch =
        g.title.toLowerCase().includes(q) ||
        g.desc.toLowerCase().includes(q) ||
        g.tag.toLowerCase().includes(q);
      const matchesCategory =
        guidesFilter === "all" ||
        (guidesFilter === "guides" && g.id !== "masnoon-duas") ||
        (guidesFilter === "masnoon" && g.id === "masnoon-duas");
      return matchesSearch && matchesCategory;
    });
  }, [guidesSearch, guidesFilter]);

  const filteredShiaDuas = useMemo(() => {
    if (isSunni) return [];
    const q = guidesSearch.toLowerCase();
    return SHIA_DUAS_ZIYARAT.filter((d) => {
      const matchesSearch =
        d.title.toLowerCase().includes(q) ||
        d.arabicTitle.includes(q) ||
        d.occasion.toLowerCase().includes(q) ||
        d.shortDesc.toLowerCase().includes(q) ||
        d.source.toLowerCase().includes(q);
      const matchesCategory =
        guidesFilter === "all" || guidesFilter === "duas";
      return matchesSearch && matchesCategory;
    });
  }, [guidesSearch, guidesFilter, isSunni]);

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
            ? "Explore the complete 30 Paras of the Noble Quran, daily Tajweed guides, Classical Reference Texts, Ahkam companions, and authentic Islamic tools."
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

          {/* Classical Reference Texts, Ahkam & Calendar Tabs - Directly in Academy Resources */}
          {isShia && (
            <>
              <button
                onClick={() => {
                  setActiveTab("texts");
                  setSearchQuery("");
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "texts"
                    ? "bg-amber-400 text-emerald-950 shadow-md"
                    : "text-emerald-100/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <Library size={16} />
                <span>Classical Reference Texts</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("ahkam");
                  setSearchQuery("");
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "ahkam"
                    ? "bg-amber-400 text-emerald-950 shadow-md"
                    : "text-emerald-100/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <Shield size={16} />
                <span>Wudhu &amp; Salat Ahkam</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("calendar");
                  setSearchQuery("");
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "calendar"
                    ? "bg-amber-400 text-emerald-950 shadow-md"
                    : "text-emerald-100/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <Calendar size={16} />
                <span>14 Infallibles Calendar</span>
              </button>
            </>
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

      {/* TAB 2: DAILY GUIDES AND DUAS (Unified with Duas and Ziyarat) */}
      {activeTab === "guides" && (
        <section className="mb-16">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white mb-2">
              Daily guides and Duas
            </h2>
            <p className="text-sm sm:text-base text-emerald-100/80 leading-relaxed">
              {isSunni
                ? "Essential daily Tajweed guides, beginner Qaida, and daily Masnoon supplications with instant in-app readers and offline downloads."
                : "Complete spiritual companion uniting foundational Tajweed guides, daily Masnoon supplications, and core Duas & Ziyarat from the Holy Prophet (SAWW) and Ahl al-Bayt (AS)."}
            </p>
          </div>

          {/* Filter Pills & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-5xl mx-auto mb-8">
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              {[
                { id: "all", label: "All Resources" },
                { id: "guides", label: "Tajweed & Guides" },
                { id: "masnoon", label: "Daily Masnoon Duas" },
                ...(!isSunni ? [{ id: "duas", label: "Duas & Ziyarat" }] : []),
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setGuidesFilter(cat.id)}
                  className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
                    guidesFilter === cat.id
                      ? "bg-amber-400 text-emerald-950 shadow-sm"
                      : "bg-black/40 text-emerald-100/70 hover:text-white border border-white/10"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="w-full sm:w-72 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-200/50" size={16} />
              <input
                type="text"
                value={guidesSearch}
                onChange={(e) => setGuidesSearch(e.target.value)}
                placeholder="Search guides, duas, or ziyarat..."
                className="w-full bg-black/40 border border-white/20 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 backdrop-blur-md"
              />
              {guidesSearch && (
                <button
                  onClick={() => setGuidesSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-white/10 hover:bg-white/20 px-1.5 py-0.5 rounded text-emerald-200"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Merged Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {/* Render Daily Guides */}
            {filteredDailyGuides.map((guide) => (
              <div
                key={guide.id}
                className="glass-container rounded-3xl p-6 sm:p-8 border border-white/15 shadow-xl flex flex-col justify-between pop-hover"
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

            {/* Render Merged Duas & Ziyarat */}
            {filteredShiaDuas.map((dua) => (
              <div
                key={dua.id}
                className="glass-container rounded-3xl p-6 sm:p-8 border border-white/15 shadow-xl flex flex-col justify-between pop-hover"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-amber-400/20 border border-amber-400/40 rounded-xl flex items-center justify-center text-amber-300 shadow-sm">
                      <BookOpen size={24} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300">
                        {dua.occasion}
                      </span>
                      <span className="font-arabic text-lg text-emerald-300" dir="rtl">
                        {dua.arabicTitle}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-white mb-1.5">{dua.title}</h3>
                  <p className="text-xs text-emerald-200/60 mb-2 font-mono">{dua.source}</p>
                  <p className="text-emerald-100/75 text-sm leading-relaxed mb-6">{dua.shortDesc}</p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                  <span className="text-xs text-amber-300/80 font-semibold">Duas &amp; Ziyarat</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyDua(dua)}
                      className="bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-xl transition cursor-pointer"
                      title="Copy Recitation"
                    >
                      {copiedDuaId === dua.id ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                    </button>
                    <button
                      onClick={() => setSelectedDua(dua)}
                      className="flex items-center gap-1.5 bg-emerald-800/80 hover:bg-emerald-700 text-amber-300 border border-amber-400/30 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                    >
                      <BookOpen size={14} />
                      <span>Read Recitation</span>
                    </button>
                    <button
                      onClick={() => handleDownloadDua(dua)}
                      className="bg-amber-400 hover:bg-amber-300 text-emerald-950 p-2.5 rounded-xl transition shadow-md cursor-pointer"
                      title="Download Offline Text"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredDailyGuides.length === 0 && filteredShiaDuas.length === 0 && (
            <div className="text-center py-12 text-emerald-100/60 text-sm">
              No matching guides or duas found for &quot;{guidesSearch}&quot;.
            </div>
          )}
        </section>
      )}

      {/* TAB: CLASSICAL REFERENCE TEXTS */}
      {activeTab === "texts" && isShia && (
        <section className="mb-16">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-3">
              <Library size={14} />
              <span>Ahl al-Bayt (AS) Theological & Spiritual Heritage</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-3">
              Classical Reference Texts
            </h2>
            <p className="text-sm sm:text-base text-emerald-100/80 max-w-2xl mx-auto">
              Primary classical manuscripts including Nahj al-Balagha, Al-Sahifa al-Sajjadiyya, and Al-Kafi with verified English translations and downloadable texts.
            </p>
          </div>

          <ShiaToolkit initialTab="texts" hideSubNavbar />
        </section>
      )}

      {/* TAB: WUDHU & SALAT AHKAM */}
      {activeTab === "ahkam" && isShia && (
        <section className="mb-16">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-3">
              <Shield size={14} />
              <span>Ja&apos;fari Jurisprudence & Practical Rulings</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-3">
              Wudhu &amp; Salat Ahkam
            </h2>
            <p className="text-sm sm:text-base text-emerald-100/80 max-w-2xl mx-auto">
              Authentic step-by-step guidance on Ja&apos;fari Wudhu, Sajdah upon pure earth (Turbah), and canonical prayer postures with Ayatullah Sistani &amp; classical rulings.
            </p>
          </div>

          <ShiaToolkit initialTab="ahkam" hideSubNavbar />
        </section>
      )}

      {/* TAB: 14 INFALLIBLES CALENDAR */}
      {activeTab === "calendar" && isShia && (
        <section className="mb-16">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-3">
              <Calendar size={14} />
              <span>Chahardah Masoomeen (AS) Historical Timeline</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-3">
              14 Infallibles Calendar
            </h2>
            <p className="text-sm sm:text-base text-emerald-100/80 max-w-2xl mx-auto">
              Chronological commemorations, births, and martyrdoms across the sacred Hijri calendar with shrine locations and historical titles.
            </p>
          </div>

          <ShiaToolkit initialTab="calendar" hideSubNavbar />
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

      {/* IN-APP DUA RECITATION MODAL */}
      <AnimatePresence>
        {selectedDua && (
          <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#021811] border border-amber-400/40 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-black/40">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
                    <span>{selectedDua.occasion}</span>
                    <span>•</span>
                    <span>{selectedDua.source}</span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white flex items-center gap-3">
                    <span>{selectedDua.title}</span>
                    <span className="font-arabic text-amber-300 text-xl font-normal">({selectedDua.arabicTitle})</span>
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyDua(selectedDua)}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                    title="Copy Text"
                  >
                    {copiedDuaId === selectedDua.id ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                  </button>
                  <button
                    onClick={() => handleDownloadDua(selectedDua)}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                    title="Download Offline Text"
                  >
                    <Download size={16} />
                  </button>
                  <button
                    onClick={() => setSelectedDua(null)}
                    className="p-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 transition-all cursor-pointer"
                    title="Close Reader"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-8 flex-1 text-left">
                {/* Introduction */}
                <div className="bg-black/30 border border-white/10 rounded-2xl p-4 text-xs text-emerald-100/90 leading-relaxed">
                  <strong className="text-amber-300 block mb-1">Spiritual Merits & Background:</strong>
                  {selectedDua.fullDesc}
                </div>

                {/* Paragraphs */}
                {selectedDua.paragraphs.map((p, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between text-xs text-amber-400/70 border-b border-white/5 pb-2">
                      <span className="font-mono">Verse {idx + 1} of {selectedDua.paragraphs.length}</span>
                    </div>

                    {/* Arabic Text */}
                    <div className="text-right font-arabic text-2xl sm:text-3xl text-amber-300 leading-[2.2] font-semibold" dir="rtl">
                      {p.arabic}
                    </div>

                    {/* Transliteration */}
                    <div className="text-xs sm:text-sm text-sky-200/90 italic font-sans leading-relaxed border-t border-white/5 pt-2">
                      <strong className="text-white/60 not-italic block text-[11px] uppercase mb-0.5">Transliteration:</strong>
                      {p.transliteration}
                    </div>

                    {/* Translation */}
                    <div className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-sans border-t border-white/5 pt-2">
                      <strong className="text-amber-300 block text-[11px] uppercase mb-0.5">English Translation:</strong>
                      {p.translation}
                    </div>
                  </div>
                ))}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs text-emerald-200/60">
                <span>Quran Learn Academy Sacred Supplications Series</span>
                <button
                  onClick={() => setSelectedDua(null)}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl font-bold transition cursor-pointer"
                >
                  Close Reader
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
