"use client";

import { useState } from "react";
import { Download, BookOpen, FileText, Search, ExternalLink, Sparkles, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { QURAN_PARAS, ParaInfo } from "@/data/quranParas";

export default function ResourcesPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"quran" | "materials">("quran");
  const [searchQuery, setSearchQuery] = useState("");

  const downloadMaterials = [
    {
      title: "Noorani Qaida (Color Coded Tajweed)",
      desc: "Complete digital beginner guide for learning Arabic alphabets, vowels, and pronunciation rules.",
      format: "PDF (18 MB)",
      tag: "Foundational",
      url: "https://ia800305.us.archive.org/34/items/NooraniQaidaColorCoded/Noorani-Qaida-Color-Coded.pdf",
    },
    {
      title: "Daily Masnoon Duas & Supplications",
      desc: "Essential daily morning, evening, and situational prayers with Arabic text and English translation.",
      format: "PDF (6 MB)",
      tag: "Essential",
      url: "https://ia800305.us.archive.org/34/items/DailyMasnoonDuas/Daily-Masnoon-Duas.pdf",
    },
    {
      title: "Tajweed Rules Quick Reference Chart",
      desc: "Single-page visual summary of Makharij, Noon Sakinah, Meem Sakinah, and Madd rules.",
      format: "PDF (4 MB)",
      tag: "Reference",
      url: "https://ia800305.us.archive.org/34/items/TajweedRulesSummary/Tajweed-Rules.pdf",
    },
    {
      title: "30th Juz (Amma) Practice Reader",
      desc: "Short surahs with large clear Uthmani script and word-by-word markers for young reciters.",
      format: "PDF (12 MB)",
      tag: "Practice",
      url: "https://ia800305.us.archive.org/34/items/Quran-Para-01-to-30-Color-Coded/Para-30.pdf",
    },
  ];

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

  return (
    <main className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 text-white min-h-screen">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-800/80 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-semibold mb-4 shadow-sm">
          <BookOpen size={16} />
          <span>Quranic Library & Learning Materials</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-4 leading-tight">
          Academy Resources
        </h1>
        <p className="text-emerald-100/85 text-base sm:text-lg leading-relaxed">
          Access the complete Noble Quran across all 30 Paras (Juz) with free instant reading and color-coded PDF downloads, alongside foundational Tajweed materials.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex justify-center mb-10">
        <div className="bg-black/50 border border-white/15 p-1.5 rounded-2xl flex gap-2 backdrop-blur-md shadow-xl">
          <button
            onClick={() => setActiveTab("quran")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm sm:text-base font-bold transition-all cursor-pointer ${
              activeTab === "quran"
                ? "bg-amber-400 text-emerald-950 shadow-md"
                : "text-emerald-100/80 hover:text-white hover:bg-white/10"
            }`}
          >
            <BookOpen size={18} />
            <span>The Holy Quran (30 Paras)</span>
          </button>
          <button
            onClick={() => setActiveTab("materials")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm sm:text-base font-bold transition-all cursor-pointer ${
              activeTab === "materials"
                ? "bg-amber-400 text-emerald-950 shadow-md"
                : "text-emerald-100/80 hover:text-white hover:bg-white/10"
            }`}
          >
            <Download size={18} />
            <span>Downloadable Guides & Duas</span>
          </button>
        </div>
      </div>

      {/* TAB 1: THE HOLY QURAN (ALL 30 PARAS) */}
      {activeTab === "quran" && (
        <section>
          {/* Search Bar for Paras */}
          <div className="max-w-md mx-auto mb-10 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-300/70 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Para name, number (1-30) or Surah..."
              className="w-full bg-black/40 border border-white/20 rounded-2xl pl-12 pr-4 py-3.5 text-sm sm:text-base text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 backdrop-blur-md shadow-inner transition"
            />
          </div>

          {/* 30 Paras Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredParas.map((para) => (
              <div
                key={para.number}
                className="group glass-container rounded-3xl p-6 sm:p-7 border border-white/10 hover:border-amber-400/40 transition-all duration-300 shadow-xl flex flex-col justify-between pop-hover relative overflow-hidden"
              >
                <div>
                  {/* Para Number Badge & Arabic Title */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 rounded-2xl bg-amber-400/15 border border-amber-400/30 text-amber-300 flex items-center justify-center font-bold text-sm">
                      {para.number}
                    </span>
                    <span className="font-arabic text-2xl sm:text-3xl text-amber-300 leading-tight">
                      {para.nameArabic}
                    </span>
                  </div>

                  {/* Transliteration & Meaning */}
                  <h3 className="text-xl font-bold font-serif text-white group-hover:text-amber-200 transition-colors mb-1">
                    Para {para.number}: {para.nameTranslit}
                  </h3>
                  <p className="text-xs text-amber-300/80 italic mb-4">
                    &ldquo;{para.meaningEnglish}&rdquo;
                  </p>

                  {/* Surah and Ayah details */}
                  <div className="bg-black/30 rounded-2xl p-3 border border-white/5 space-y-1 mb-6 text-xs text-emerald-100/75">
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-200/50">Surahs:</span>
                      <span className="font-semibold text-white text-right">{para.startSurah}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-200/50">Extent:</span>
                      <span className="font-semibold text-amber-300">{para.ayahRange}</span>
                    </div>
                  </div>
                </div>

                {/* Read Now & Download Actions */}
                <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-3">
                  <a
                    href={para.readUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 bg-emerald-800/80 hover:bg-emerald-700 text-amber-300 border border-amber-400/30 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer"
                  >
                    <BookOpen size={15} />
                    <span>Read Now</span>
                  </a>

                  <a
                    href={para.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer"
                  >
                    <Download size={15} />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {filteredParas.length === 0 && (
            <div className="text-center py-12 text-emerald-100/60">
              No Paras found matching &ldquo;{searchQuery}&rdquo;. Try another name or number.
            </div>
          )}
        </section>
      )}

      {/* TAB 2: DOWNLOADABLE GUIDES & DUAS */}
      {activeTab === "materials" && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {downloadMaterials.map((item, idx) => (
            <div
              key={idx}
              className="glass-container rounded-3xl p-8 border border-white/15 shadow-xl flex flex-col justify-between pop-hover"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-emerald-800/80 border border-amber-400/40 rounded-xl flex items-center justify-center text-amber-300 shadow-sm">
                    <FileText size={24} />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300">
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-xl font-serif font-bold text-white mb-2">{item.title}</h3>
                <p className="text-emerald-100/75 text-sm leading-relaxed mb-6">{item.desc}</p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-emerald-100/60 font-semibold">{item.format}</span>
                <div className="flex gap-2">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-emerald-800/80 hover:bg-emerald-700 text-amber-300 border border-amber-400/30 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    <BookOpen size={14} />
                    <span>Read Now</span>
                  </a>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 px-4 py-2 rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
                  >
                    <Download size={14} />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
