"use client";

import { Download, BookOpen, FileText } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

export default function DownloadsPage() {
  const { t } = useLanguage();

  const resources = [
    {
      title: "Noorani Qaida (Color Coded Tajweed)",
      desc: "Complete digital beginner guide for learning Arabic alphabets, vowels, and pronunciation rules.",
      format: "PDF (18 MB)",
      tag: "Foundational",
    },
    {
      title: "Daily Masnoon Duas & Supplications",
      desc: "Essential daily morning, evening, and situational prayers with Arabic text and English translation.",
      format: "PDF (6 MB)",
      tag: "Essential",
    },
    {
      title: "Tajweed Rules Quick Reference Chart",
      desc: "Single-page visual summary of Makharij, Noon Sakinah, Meem Sakinah, and Madd rules.",
      format: "PDF (4 MB)",
      tag: "Reference",
    },
    {
      title: "30th Juz (Amma) Practice Reader",
      desc: "Short surahs with large clear Uthmani script and word-by-word markers for young reciters.",
      format: "PDF (12 MB)",
      tag: "Practice",
    },
  ];

  return (
    <main className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-12 md:py-20 text-white">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-800/80 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-semibold mb-4">
          <Download size={16} />
          <span>Curated Learning Materials</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-6 leading-tight">
          {t("downloads")} & Resources
        </h1>
        <p className="text-emerald-100/85 text-base sm:text-lg leading-relaxed">
          Complimentary learning resources, practice guides, and reading materials for our students and families.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {resources.map((item, idx) => (
          <div key={idx} className="glass-container rounded-3xl p-8 border border-white/15 shadow-xl flex flex-col justify-between">
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
              <button 
                onClick={() => alert("Downloading resource...")}
                className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 px-4 py-2 rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
              >
                <Download size={14} />
                <span>Download Free</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
