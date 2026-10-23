"use client";

import { useState, useEffect, useMemo } from "react";
import { Download, BookOpen, FileText, Search, Sparkles, X, Library, Compass, CircleDot, BookMarked, Copy, Check, Shield, Calendar, Bookmark, ArrowRight, Database } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { QURAN_PARAS } from "@/data/quranParas";
import { DAILY_GUIDES_DATA, GuideResource } from "@/data/guidesData";
import { SHIA_DUAS_ZIYARAT, ShiaDua } from "@/data/shiaToolkitData";
import { SHIA_ZIYARAT_DATA, ShiaZiyarat } from "@/data/ziyaratData";
import ShiaToolkit from "@/components/ShiaToolkit";
import DigitalTasbeeh from "@/features/resources/components/DigitalTasbeeh";
import PrayerTimesQibla from "@/features/resources/components/PrayerTimesQibla";
import JafariPrayerSchedule from "@/features/resources/components/JafariPrayerSchedule";
import AsmaUlHusnaView from "@/features/resources/components/AsmaUlHusnaView";
import SeeratView from "@/features/resources/components/SeeratView";
import IslamicCalendarView from "@/features/resources/components/IslamicCalendarView";
import { useSect } from "@/components/SectContext";
import toast from "react-hot-toast";

type ResourceTab =
  | "quran"
  | "hadiths"
  | "duas"
  | "ziaraat"
  | "texts"
  | "ahkam"
  | "calendar"
  | "tasbeeh"
  | "prayer-times"
  | "asma-ul-husna"
  | "seerat"
  | "saved";

export interface SavedItem {
  id: string;
  type: "dua" | "ziarat" | "quran" | "guide" | "text" | "ahkam";
  title: string;
  arabicTitle?: string;
  subtitle?: string;
  category: string;
  dateAdded: string;
}

export default function ResourcesPage() {
  const { isSunni, isShia } = useSect();
  const [activeTab, setActiveTab] = useState<ResourceTab>("quran");
  const [searchQuery, setSearchQuery] = useState("");

  // Search States
  const [duasSearch, setDuasSearch] = useState<string>("");
  const [ziaraatSearch, setZiaraatSearch] = useState<string>("");
  const [hadithsSearch, setHadithsSearch] = useState<string>("");

  // Recitation Modal state for Duas & Ziaraat
  const [activeRecitation, setActiveRecitation] = useState<{
    item: ShiaDua | ShiaZiyarat;
    type: "dua" | "ziarat";
  } | null>(null);

  const [selectedGuide, setSelectedGuide] = useState<GuideResource | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [recitationViewMode, setRecitationViewMode] = useState<"arabic" | "english" | "both">("both");
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [savedFilter, setSavedFilter] = useState<string>("all");
  const [dbResources, setDbResources] = useState<Array<{
    id: string;
    title: string;
    fileName: string;
    category: string;
    sect: string;
    fileSize: string;
    description: string;
    fileDataUrl?: string;
  }>>([]);

  // Load resources directly from Database API
  useEffect(() => {
    async function loadDbResources() {
      try {
        const res = await fetch("/api/admin/resources");
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.documents)) {
            setDbResources(json.documents);
          }
        }
      } catch {}
    }
    loadDbResources();
  }, []);

  // Filter dynamic database documents matching the active tab & sect
  const matchingDbDocs = useMemo(() => {
    return dbResources.filter((doc) => {
      if (isShia && doc.sect === "sunni") return false;
      if (isSunni && (doc.sect === "shia" || doc.category.toLowerCase().includes("ziar"))) return false;
      if (activeTab === "duas") return doc.category.toLowerCase().includes("dua");
      if (activeTab === "hadiths") return doc.category.toLowerCase().includes("hadith");
      if (activeTab === "ziaraat") return doc.category.toLowerCase().includes("ziar");
      if (activeTab === "texts") return doc.category.toLowerCase().includes("classical");
      if (activeTab === "ahkam") return doc.category.toLowerCase().includes("ahkam");
      if (activeTab === "quran") return doc.category.toLowerCase().includes("quran") || doc.category.toLowerCase().includes("tajweed");
      return false;
    });
  }, [dbResources, activeTab, isShia, isSunni]);

  // Load saved items from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("academy_saved_bookmarks");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) queueMicrotask(() => setSavedItems(parsed));
      }
    } catch {}
  }, []);

  const toggleSaveItem = (item: Omit<SavedItem, "dateAdded">) => {
    const exists = savedItems.some((s) => s.id === item.id);
    let updated: SavedItem[];
    if (exists) {
      updated = savedItems.filter((s) => s.id !== item.id);
      toast.success(`Removed "${item.title}" from Saved`);
    } else {
      const newItem: SavedItem = {
        ...item,
        dateAdded: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short" })
      };
      updated = [newItem, ...savedItems];
      toast.success(`Saved "${item.title}" to bookmarks!`);
    }
    setSavedItems(updated);
    try {
      localStorage.setItem("academy_saved_bookmarks", JSON.stringify(updated));
    } catch {}
  };

  const isItemSaved = (id: string) => savedItems.some((s) => s.id === id);

  // Sync tab with URL query parameters
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
        } else if (subParam === "ziaraat" || tabParam === "ziaraat" || tabParam === "ziyarat" || subParam === "ziyarat") {
          setActiveTab("ziaraat");
          return;
        } else if (subParam === "duas" || tabParam === "duas" || subParam === "guides" || tabParam === "guides") {
          setActiveTab("duas");
          return;
        } else if (subParam === "tasbeeh" || tabParam === "tasbeeh") {
          setActiveTab("tasbeeh");
          return;
        } else if (subParam === "saved" || tabParam === "saved") {
          setActiveTab("saved");
          return;
        }

        if (
          tabParam === "quran" ||
          tabParam === "duas" ||
          tabParam === "ziaraat" ||
          tabParam === "texts" ||
          tabParam === "ahkam" ||
          tabParam === "calendar" ||
          tabParam === "tasbeeh" ||
          tabParam === "prayer-times" ||
          tabParam === "asma-ul-husna" ||
          tabParam === "seerat" ||
          tabParam === "saved"
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
      });
    } catch {
      // safe fallback
    }
  }, [isShia]);

  // Safety guard: if switched to Sunni while on specialized Shia tabs, bounce to Quran
  useEffect(() => {
    if (isSunni && (activeTab === "texts" || activeTab === "ahkam" || activeTab === "ziaraat")) {
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

  // Filter 10 Canonical Shia Duas (Only Duas, no beginner guides)
  const filteredDuas = useMemo(() => {
    const q = duasSearch.toLowerCase();
    return SHIA_DUAS_ZIYARAT.filter((d) => {
      return (
        d.title.toLowerCase().includes(q) ||
        d.arabicTitle.includes(q) ||
        d.occasion.toLowerCase().includes(q) ||
        d.shortDesc.toLowerCase().includes(q) ||
        d.source.toLowerCase().includes(q)
      );
    });
  }, [duasSearch]);

  // Filter 10 Canonical Ziaraat
  const filteredZiaraat = useMemo(() => {
    const q = ziaraatSearch.toLowerCase();
    return SHIA_ZIYARAT_DATA.filter((z) => {
      return (
        z.title.toLowerCase().includes(q) ||
        z.arabicTitle.includes(q) ||
        z.occasion.toLowerCase().includes(q) ||
        z.shortDesc.toLowerCase().includes(q) ||
        z.source.toLowerCase().includes(q)
      );
    });
  }, [ziaraatSearch]);

  // Download Recitation helper
  const handleDownloadRecitation = (item: ShiaDua | ShiaZiyarat, typeLabel: string) => {
    const content = `======================================================
QURAN LEARN ACADEMY - ${typeLabel.toUpperCase()}
${item.title.toUpperCase()} (${item.arabicTitle})
Source: ${item.source}
Occasion: ${item.occasion}
======================================================

${item.fullDesc}

======================================================
RECITATION (ARABIC, TRANSLITERATION & TRANSLATION):
======================================================

${item.paragraphs
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
Downloaded from Quran Learn Resources
https://quranlearnacademy.com/resources
======================================================`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${item.slug}-${typeLabel.toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded: ${item.title}`);
  };

  // Copy Recitation helper
  const handleCopyRecitation = (item: ShiaDua | ShiaZiyarat) => {
    let text = `${item.title} (${item.arabicTitle})\nSource: ${item.source}\nOccasion: ${item.occasion}\n\n`;

    if (recitationViewMode === "arabic") {
      text += item.paragraphs.map((p) => p.arabic).join("\n\n");
    } else if (recitationViewMode === "english") {
      text += item.paragraphs.map((p, i) => `[${i + 1}] ${p.translation}`).join("\n\n");
    } else {
      text += item.paragraphs
        .map(
          (p, i) =>
            `[${i + 1}]\nArabic: ${p.arabic}\nTransliteration: ${p.transliteration}\nTranslation: ${p.translation}`
        )
        .join("\n\n");
    }

    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
    toast.success("Recitation copied to clipboard!");
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
          Resources
        </h1>
        <p className="text-emerald-100/85 text-base sm:text-lg leading-relaxed">
          {isShia
            ? "Explore the complete 30 Paras of the Noble Quran, Sacred Duas, Infallible Ziaraat, Classical Reference Texts, Ahkam companions, and authentic Islamic tools."
            : "Explore the complete 30 Paras of the Noble Quran, authentic supplications, and interactive Islamic lifestyle tools with instant in-app readers."}
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

          {/* Duas Tab (formerly Daily guides and Duas) */}
          <button
            onClick={() => {
              setActiveTab("duas");
              setSearchQuery("");
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "duas"
                ? "bg-amber-400 text-emerald-950 shadow-md"
                : "text-emerald-100/80 hover:text-white hover:bg-white/10"
            }`}
          >
            <FileText size={16} />
            <span>Duas</span>
          </button>

          {/* Hadiths Tab (Available in both Sunni & Shia panels) */}
          <button
            onClick={() => {
              setActiveTab("hadiths");
              setSearchQuery("");
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "hadiths"
                ? "bg-amber-400 text-emerald-950 shadow-md"
                : "text-emerald-100/80 hover:text-white hover:bg-white/10"
            }`}
          >
            <Library size={16} />
            <span>Hadiths</span>
          </button>

          {/* Shia-Specific Tabs: Ziaraat, Classical Texts, & Ahkam */}
          {isShia && (
            <>
              {/* Ziaraat Tab (Exclusively for Shia panel) */}
              <button
                onClick={() => {
                  setActiveTab("ziaraat");
                  setSearchQuery("");
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "ziaraat"
                    ? "bg-amber-400 text-emerald-950 shadow-md"
                    : "text-emerald-100/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <BookMarked size={16} />
                <span>Ziaraat</span>
              </button>

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
            </>
          )}

          {/* Islamic Calendar Tab (Available in both Sunni & Shia panels) */}
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
            <span>Islamic Calendar</span>
          </button>

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
            <span>{isShia ? "Salat Timings" : "Prayer Times"}</span>
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

          <button
            onClick={() => {
              setActiveTab("saved");
              setSearchQuery("");
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "saved"
                ? "bg-amber-400 text-emerald-950 shadow-md"
                : "text-emerald-100/80 hover:text-white hover:bg-white/10"
            }`}
          >
            <Bookmark size={16} className={savedItems.length > 0 ? "fill-current" : ""} />
            <span>Saved {savedItems.length > 0 && `(${savedItems.length})`}</span>
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

      {/* TAB 2: DUAS (Authentic Shia Canonical Duas - Exclusively Duas, name-only cards) */}
      {activeTab === "duas" && (
        <section className="mb-16">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-3">
              <FileText size={14} />
              <span>Sacred Supplications of the Ahl al-Bayt (AS)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white mb-2">
              Duas
            </h2>
            <p className="text-sm sm:text-base text-emerald-100/80 leading-relaxed">
              Complete, unabridged canonical supplications in full Arabic script with diacritics (Harakat) and verified English translations.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-200/50" size={16} />
            <input
              type="text"
              value={duasSearch}
              onChange={(e) => setDuasSearch(e.target.value)}
              placeholder="Search Dua by name, Arabic title, or occasion..."
              className="w-full bg-black/40 border border-white/20 rounded-xl pl-10 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 backdrop-blur-md"
            />
            {duasSearch && (
              <button
                onClick={() => setDuasSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-white/10 hover:bg-white/20 px-2 py-1 rounded text-emerald-200 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* 10 Canonical Duas - Clean Name-Only Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 max-w-5xl mx-auto">
            {filteredDuas.map((dua) => (
              <div
                key={dua.id}
                className="glass-container rounded-2xl p-4 sm:p-5 border border-white/15 shadow-md hover:border-amber-400/40 transition-all flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-300 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-serif font-bold text-white text-base sm:text-lg truncate group-hover:text-amber-300 transition-colors">
                        {dua.title}
                      </h3>
                      <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-amber-300 border border-white/10 shrink-0 truncate max-w-[150px]">
                        {dua.occasion}
                      </span>
                    </div>
                    <span className="font-arabic text-emerald-300 text-sm block" dir="rtl">
                      {dua.arabicTitle}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() =>
                      toggleSaveItem({
                        id: dua.id,
                        type: "dua",
                        title: dua.title,
                        arabicTitle: dua.arabicTitle,
                        subtitle: dua.occasion,
                        category: "Duas"
                      })
                    }
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isItemSaved(dua.id)
                        ? "bg-amber-400 text-emerald-950 border-amber-300 shadow-sm"
                        : "bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border-white/10"
                    }`}
                    title={isItemSaved(dua.id) ? "Saved in Bookmarks" : "Save to Bookmarks"}
                  >
                    <Bookmark size={16} className={isItemSaved(dua.id) ? "fill-emerald-950" : ""} />
                  </button>

                  <button
                    onClick={() => {
                      setActiveRecitation({ item: dua, type: "dua" });
                      setRecitationViewMode("both");
                    }}
                    className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 bg-emerald-800/80 hover:bg-emerald-700 text-amber-300 border border-amber-400/30 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    <span>Open Dua</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredDuas.length === 0 && (
            <div className="text-center py-12 text-emerald-100/60 text-sm">
              No matching Duas found for &quot;{duasSearch}&quot;.
            </div>
          )}
        </section>
      )}

      {/* TAB 1.5: HADITHS (Prophetic Sunnah & Hadith Compendiums for Sunni & Shia) */}
      {activeTab === "hadiths" && (
        <section className="mb-16 animate-in fade-in duration-300">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-3">
              <Library size={14} />
              <span>
                {isShia
                  ? "Ahlulbayt (AS) & Prophetic Traditions"
                  : "Prophetic Sunnah & Sihah al-Sittah"}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white mb-2">
              Hadith &amp; Sunnah Compendiums
            </h2>
            <p className="text-sm sm:text-base text-emerald-100/80 leading-relaxed max-w-2xl mx-auto">
              {isShia
                ? "Authentic traditions and narrations of the Holy Prophet Muhammad (SAWW) and the Twelve Infallible Imams (AS). Verified texts from Al-Kafi, Man La Yahduruhu al-Faqih, Tahdhib al-Ahkam, and classical compendiums."
                : "Authentic sayings, actions, and approvals of the Holy Prophet Muhammad (SAWW) across the canonical Sihah al-Sittah works (Sahih al-Bukhari, Sahih Muslim, and the Sunan collections)."}
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-200/50" size={16} />
            <input
              type="text"
              value={hadithsSearch}
              onChange={(e) => setHadithsSearch(e.target.value)}
              placeholder="Search Hadith compendiums by title or narrator..."
              className="w-full bg-black/40 border border-white/20 rounded-xl pl-10 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 backdrop-blur-md"
            />
            {hadithsSearch && (
              <button
                onClick={() => setHadithsSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-white/10 hover:bg-white/20 px-2 py-1 rounded text-emerald-200 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Published Hadiths Grid (from Database / Admin Portal) */}
          {matchingDbDocs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {matchingDbDocs
                .filter(
                  (doc) =>
                    !hadithsSearch ||
                    doc.title.toLowerCase().includes(hadithsSearch.toLowerCase()) ||
                    doc.description.toLowerCase().includes(hadithsSearch.toLowerCase())
                )
                .map((doc) => (
                  <div
                    key={doc.id}
                    className="glass-container rounded-2xl p-5 border border-white/15 hover:border-amber-400/40 transition shadow-xl flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300">
                          {doc.category}
                        </span>
                        <span className="text-emerald-200/60 font-mono text-[11px]">{doc.fileSize}</span>
                      </div>
                      <h3 className="text-base font-serif font-bold text-white mb-2 leading-snug">
                        {doc.title}
                      </h3>
                      <p className="text-xs text-emerald-100/75 line-clamp-3 mb-4 leading-relaxed">
                        {doc.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[11px] text-emerald-200/60 font-mono">{doc.fileName}</span>
                      <button
                        onClick={() => {
                          if (doc.fileDataUrl) {
                            const newTab = window.open();
                            if (newTab) {
                              newTab.location.href = doc.fileDataUrl;
                            }
                          } else {
                            toast(`Reference compendium: ${doc.title}`, { icon: "📖" });
                          }
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-amber-300 text-xs font-bold transition border border-amber-400/30 cursor-pointer"
                      >
                        <BookOpen size={13} />
                        <span>Read Online</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            /* Empty State: Kept empty for the time being, to be filled later through admin portal */
            <div className="max-w-xl mx-auto text-center py-16 px-6 glass-container rounded-3xl border border-white/15 shadow-xl space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-400/15 border border-amber-400/30 text-amber-300 flex items-center justify-center mx-auto">
                <Library size={32} />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-white mb-2">
                  No Hadith Collections Published Yet
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100/70 leading-relaxed max-w-md mx-auto">
                  {isShia
                    ? "Authentic Shia Hadith compendiums and annotated traditions are currently being curated. Once uploaded and published via the Academy Admin Portal, they will appear here instantly."
                    : "Authentic Sunnah collections and verified Hadith compendiums are currently being prepared. Once uploaded and published via the Academy Admin Portal, they will appear here instantly."}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-center gap-2 text-xs text-emerald-200/60 font-mono">
                <Database size={13} className="text-emerald-400" />
                <span>Database Sync Active • Admin Upload Ready</span>
              </div>
            </div>
          )}
        </section>
      )}

      {/* TAB 3: ZIARAAT (10 Canonical Authentic Shia Visitations - Name-only cards, Shia Panel Only) */}
      {activeTab === "ziaraat" && isShia && (
        <section className="mb-16">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-3">
              <BookMarked size={14} />
              <span>Holy Sanctuaries &amp; Infallible Salutations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white mb-2">
              Ziaraat
            </h2>
            <p className="text-sm sm:text-base text-emerald-100/80 leading-relaxed">
              Canonical spiritual visitations to the Holy Prophet (SAWW) and the Twelve Infallible Imams (AS) with unabridged Arabic script, translations, and in-app recitation.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-200/50" size={16} />
            <input
              type="text"
              value={ziaraatSearch}
              onChange={(e) => setZiaraatSearch(e.target.value)}
              placeholder="Search Ziyarat by title, Arabic name, or occasion..."
              className="w-full bg-black/40 border border-white/20 rounded-xl pl-10 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 backdrop-blur-md"
            />
            {ziaraatSearch && (
              <button
                onClick={() => setZiaraatSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-white/10 hover:bg-white/20 px-2 py-1 rounded text-emerald-200 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* 10 Canonical Ziaraat - Clean Name-Only Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 max-w-5xl mx-auto">
            {filteredZiaraat.map((ziarat) => (
              <div
                key={ziarat.id}
                className="glass-container rounded-2xl p-4 sm:p-5 border border-white/15 shadow-md hover:border-amber-400/40 transition-all flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-300 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                    <BookMarked size={20} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-serif font-bold text-white text-base sm:text-lg truncate group-hover:text-amber-300 transition-colors">
                        {ziarat.title}
                      </h3>
                      <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-amber-300 border border-white/10 shrink-0 truncate max-w-[150px]">
                        {ziarat.occasion}
                      </span>
                    </div>
                    <span className="font-arabic text-emerald-300 text-sm block" dir="rtl">
                      {ziarat.arabicTitle}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() =>
                      toggleSaveItem({
                        id: ziarat.id,
                        type: "ziarat",
                        title: ziarat.title,
                        arabicTitle: ziarat.arabicTitle,
                        subtitle: ziarat.occasion,
                        category: "Ziaraat"
                      })
                    }
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isItemSaved(ziarat.id)
                        ? "bg-amber-400 text-emerald-950 border-amber-300 shadow-sm"
                        : "bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border-white/10"
                    }`}
                    title={isItemSaved(ziarat.id) ? "Saved in Bookmarks" : "Save to Bookmarks"}
                  >
                    <Bookmark size={16} className={isItemSaved(ziarat.id) ? "fill-emerald-950" : ""} />
                  </button>

                  <button
                    onClick={() => {
                      setActiveRecitation({ item: ziarat, type: "ziarat" });
                      setRecitationViewMode("both");
                    }}
                    className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 bg-emerald-800/80 hover:bg-emerald-700 text-amber-300 border border-amber-400/30 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    <span>Open Ziarat</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredZiaraat.length === 0 && (
            <div className="text-center py-12 text-emerald-100/60 text-sm">
              No matching Ziaraat found for &quot;{ziaraatSearch}&quot;.
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
              <span>Ahl al-Bayt (AS) Theological &amp; Spiritual Heritage</span>
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
              <span>Ja&apos;fari Jurisprudence &amp; Practical Rulings</span>
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

      {/* TAB: ISLAMIC CALENDAR (Available for both Sunni & Shia) */}
      {activeTab === "calendar" && (
        <section className="mb-16">
          <IslamicCalendarView />
        </section>
      )}

      {/* TAB 4: DIGITAL TASBEEH */}
      {activeTab === "tasbeeh" && (
        <section className="mb-16">
          <DigitalTasbeeh />
        </section>
      )}

      {/* TAB 5: PRAYER TIMES / QIBLA */}
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

      {/* TAB 8: SAVED RESOURCES SECTION */}
      {activeTab === "saved" && (
        <section className="mb-16 animate-in fade-in duration-300">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-3">
              <Bookmark size={14} className="fill-amber-300" />
              <span>Personal Saved Collection</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-3">
              Saved Resources
            </h2>
            <p className="text-sm sm:text-base text-emerald-100/80 max-w-2xl mx-auto">
              {isShia
                ? "Your personalized collection of bookmarked Duas, Ziaraat, and Holy Quran Paras for instant offline and daily recitation."
                : "Your personalized collection of bookmarked Duas and Holy Quran Paras for instant offline and daily recitation."}
            </p>
          </div>

          {/* Saved Category Filter Pills & Clear All */}
          {savedItems.filter((s) => isShia || s.type !== "ziarat").length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 max-w-5xl mx-auto">
              <div className="flex flex-wrap gap-2">
                {[
                  { key: "all", label: `All (${savedItems.filter((s) => isShia || s.type !== "ziarat").length})` },
                  { key: "dua", label: `Duas (${savedItems.filter((s) => s.type === "dua").length})` },
                  ...(isShia
                    ? [{ key: "ziarat", label: `Ziaraat (${savedItems.filter((s) => s.type === "ziarat").length})` }]
                    : []),
                  { key: "quran", label: `Quran Paras (${savedItems.filter((s) => s.type === "quran").length})` }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setSavedFilter(key)}
                    className={`text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer ${
                      savedFilter === key
                        ? "bg-amber-400 text-emerald-950 shadow-md"
                        : "bg-black/40 text-emerald-100/70 hover:text-white border border-white/10"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  if (confirm("Are you sure you want to clear all saved bookmarks?")) {
                    setSavedItems([]);
                    localStorage.removeItem("academy_saved_bookmarks");
                    toast.success("Saved collection cleared.");
                  }
                }}
                className="text-xs text-red-300 hover:text-red-200 transition font-bold px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-950/40 cursor-pointer"
              >
                Clear All Saved
              </button>
            </div>
          )}

          {/* Saved Items Grid */}
          {savedItems.filter((s) => isShia || s.type !== "ziarat").length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {savedItems
                .filter((item) => isShia || item.type !== "ziarat")
                .filter((item) => savedFilter === "all" || item.type === savedFilter)
                .map((item) => (
                  <div
                    key={item.id}
                    className="glass-container rounded-2xl p-5 border border-white/15 shadow-xl flex flex-col justify-between hover:border-amber-400/40 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300">
                          {item.category}
                        </span>
                        <span className="text-[10px] text-emerald-200/60 font-mono">
                          {item.dateAdded}
                        </span>
                      </div>

                      <h3 className="text-lg font-serif font-bold text-white mb-1 leading-tight">
                        {item.title}
                      </h3>

                      {item.arabicTitle && (
                        <p className="font-arabic text-emerald-300 text-sm mb-2" dir="rtl">
                          {item.arabicTitle}
                        </p>
                      )}

                      {item.subtitle && (
                        <p className="text-xs text-emerald-100/70 mb-4 line-clamp-2">
                          {item.subtitle}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          if (item.type === "dua") {
                            const found = SHIA_DUAS_ZIYARAT.find((d) => d.id === item.id);
                            if (found) {
                              setActiveRecitation({ item: found, type: "dua" });
                              setRecitationViewMode("both");
                            }
                          } else if (item.type === "ziarat") {
                            const found = SHIA_ZIYARAT_DATA.find((z) => z.id === item.id);
                            if (found) {
                              setActiveRecitation({ item: found, type: "ziarat" });
                              setRecitationViewMode("both");
                            }
                          } else if (item.type === "guide") {
                            const found = DAILY_GUIDES_DATA.find((g) => g.id === item.id);
                            if (found) setSelectedGuide(found);
                          } else if (item.type === "quran") {
                            setActiveTab("quran");
                          }
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800/80 hover:bg-emerald-700 text-amber-300 border border-amber-400/30 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                      >
                        <BookOpen size={14} />
                        <span>Open &amp; Read</span>
                      </button>

                      <button
                        onClick={() => toggleSaveItem(item)}
                        className="p-1.5 rounded-xl bg-white/10 hover:bg-red-950/60 text-white/70 hover:text-red-300 transition cursor-pointer"
                        title="Remove from Saved"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="max-w-md mx-auto text-center py-16 px-6 glass-container rounded-3xl border border-white/15 shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-amber-400/15 border border-amber-400/30 text-amber-300 flex items-center justify-center mx-auto mb-4">
                <Bookmark size={32} />
              </div>
              <h3 className="text-xl font-serif font-bold text-white mb-2">No Saved Resources Yet</h3>
              <p className="text-xs text-emerald-100/70 mb-6 leading-relaxed">
                {isShia
                  ? "Click the bookmark icon on any of the 10 Canonical Duas, 10 Authentic Ziaraat, or Holy Quran Paras to save them here for quick daily access."
                  : "Click the bookmark icon on any of the Holy Quran Paras or Duas to save them here for quick daily access."}
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  onClick={() => setActiveTab("duas")}
                  className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs transition shadow-md cursor-pointer"
                >
                  Browse Duas
                </button>
                {isShia && (
                  <button
                    onClick={() => setActiveTab("ziaraat")}
                    className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-300 font-bold text-xs transition border border-amber-400/30 cursor-pointer"
                  >
                    Browse Ziaraat
                  </button>
                )}
                <button
                  onClick={() => setActiveTab("quran")}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition border border-white/15 cursor-pointer"
                >
                  Explore Quran Paras
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* IN-APP READER MODAL FOR SAVED GUIDES (IF ANY PREVIOUSLY BOOKMARKED) */}
      {selectedGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-[#04241b] border border-amber-400/30 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
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
                  onClick={() => setSelectedGuide(null)}
                  className="bg-white/10 text-white p-2 rounded-xl hover:bg-white/20 transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

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

      {/* UNIFIED IN-APP RECITATION MODAL FOR DUAS & ZIARAAT */}
      <AnimatePresence>
        {activeRecitation && (
          <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#021811] border border-amber-400/40 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-black/40">
                <div className="min-w-0 pr-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-1 truncate">
                    <span>{activeRecitation.type === "dua" ? "Sacred Dua" : "Sacred Ziarat"}</span>
                    <span>•</span>
                    <span className="truncate">{activeRecitation.item.occasion}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-white flex items-center gap-3 flex-wrap">
                    <span>{activeRecitation.item.title}</span>
                    <span className="font-arabic text-amber-300 text-lg sm:text-xl font-normal" dir="rtl">
                      ({activeRecitation.item.arabicTitle})
                    </span>
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() =>
                      toggleSaveItem({
                        id: activeRecitation.item.id,
                        type: activeRecitation.type,
                        title: activeRecitation.item.title,
                        arabicTitle: activeRecitation.item.arabicTitle,
                        subtitle: activeRecitation.item.occasion,
                        category: activeRecitation.type === "dua" ? "Duas" : "Ziaraat"
                      })
                    }
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isItemSaved(activeRecitation.item.id)
                        ? "bg-amber-400 text-emerald-950 border-amber-300 shadow-sm"
                        : "bg-white/10 hover:bg-white/20 text-white border-white/10"
                    }`}
                    title={isItemSaved(activeRecitation.item.id) ? "Saved" : "Save to Bookmarks"}
                  >
                    <Bookmark size={16} className={isItemSaved(activeRecitation.item.id) ? "fill-emerald-950" : ""} />
                  </button>

                  <button
                    onClick={() => handleCopyRecitation(activeRecitation.item)}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                    title="Copy Text"
                  >
                    {copiedId === activeRecitation.item.id ? (
                      <Check size={16} className="text-emerald-400" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>

                  <button
                    onClick={() =>
                      handleDownloadRecitation(
                        activeRecitation.item,
                        activeRecitation.type === "dua" ? "Dua" : "Ziarat"
                      )
                    }
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                    title="Download Offline Text"
                  >
                    <Download size={16} />
                  </button>

                  <button
                    onClick={() => setActiveRecitation(null)}
                    className="p-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 transition-all cursor-pointer"
                    title="Close Reader"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* View Mode Switcher */}
              <div className="px-6 py-3 border-b border-white/10 bg-black/20 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-emerald-200/70 font-semibold">Display Option:</span>
                <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10">
                  <button
                    onClick={() => setRecitationViewMode("arabic")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      recitationViewMode === "arabic"
                        ? "bg-amber-400 text-emerald-950 shadow-sm"
                        : "text-emerald-100/70 hover:text-white"
                    }`}
                  >
                    Complete Arabic
                  </button>
                  <button
                    onClick={() => setRecitationViewMode("english")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      recitationViewMode === "english"
                        ? "bg-amber-400 text-emerald-950 shadow-sm"
                        : "text-emerald-100/70 hover:text-white"
                    }`}
                  >
                    English Translation
                  </button>
                  <button
                    onClick={() => setRecitationViewMode("both")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      recitationViewMode === "both"
                        ? "bg-amber-400 text-emerald-950 shadow-sm"
                        : "text-emerald-100/70 hover:text-white"
                    }`}
                  >
                    Parallel (Both)
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-left">
                {/* Introduction & Merits */}
                <div className="bg-black/30 border border-white/10 rounded-2xl p-4 text-xs text-emerald-100/90 leading-relaxed">
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-amber-300">Spiritual Merits &amp; Background:</strong>
                    <span className="text-[11px] text-emerald-200/60 font-mono">
                      Source: {activeRecitation.item.source}
                    </span>
                  </div>
                  {activeRecitation.item.fullDesc}
                </div>

                {/* MODE 1: COMPLETE ARABIC */}
                {recitationViewMode === "arabic" && (
                  <div className="bg-[#031d15] border border-amber-400/20 rounded-2xl p-6 sm:p-8 space-y-6" dir="rtl">
                    {activeRecitation.item.paragraphs.map((p, idx) => (
                      <p
                        key={idx}
                        className="font-arabic text-2xl sm:text-3xl text-amber-200 leading-[2.4] font-medium text-right"
                      >
                        {p.arabic}
                      </p>
                    ))}
                  </div>
                )}

                {/* MODE 2: ENGLISH TRANSLATION */}
                {recitationViewMode === "english" && (
                  <div className="bg-black/30 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
                    {activeRecitation.item.paragraphs.map((p, idx) => (
                      <div key={idx} className="space-y-1.5 border-b border-white/5 pb-4 last:border-b-0">
                        <span className="text-[10px] font-mono text-amber-400/70 uppercase">
                          Section {idx + 1} of {activeRecitation.item.paragraphs.length}
                        </span>
                        <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-sans">
                          {p.translation}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* MODE 3: PARALLEL (BOTH) */}
                {recitationViewMode === "both" && (
                  <div className="space-y-6">
                    {activeRecitation.item.paragraphs.map((p, idx) => (
                      <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center justify-between text-xs text-amber-400/70 border-b border-white/5 pb-2">
                          <span className="font-mono">
                            Verse {idx + 1} of {activeRecitation.item.paragraphs.length}
                          </span>
                        </div>

                        {/* Arabic Text */}
                        <div
                          className="text-right font-arabic text-2xl sm:text-3xl text-amber-300 leading-[2.2] font-semibold"
                          dir="rtl"
                        >
                          {p.arabic}
                        </div>

                        {/* Transliteration */}
                        <div className="text-xs sm:text-sm text-sky-200/90 italic font-sans leading-relaxed border-t border-white/5 pt-2">
                          <strong className="text-white/60 not-italic block text-[11px] uppercase mb-0.5">
                            Transliteration:
                          </strong>
                          {p.transliteration}
                        </div>

                        {/* Translation */}
                        <div className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-sans border-t border-white/5 pt-2">
                          <strong className="text-amber-300 block text-[11px] uppercase mb-0.5">
                            English Translation:
                          </strong>
                          {p.translation}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs text-emerald-200/60">
                <span>Quran Learn Academy Sacred Supplications &amp; Visitations Series</span>
                <button
                  onClick={() => setActiveRecitation(null)}
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
