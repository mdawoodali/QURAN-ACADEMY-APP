"use client";

import { Check } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

export default function ProgrammesPage() {
  const { t } = useLanguage();

  return (
    <main className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-10 md:py-20">
      <div className="text-center mb-10 md:mb-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-4 leading-tight">
          {t("progTitle")}
        </h1>
        <p className="text-emerald-100/85 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          {t("progDesc")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Level 1 */}
        <div className="glass-container rounded-3xl p-6 md:p-8 border border-white/15 shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-amber-300 text-xs font-bold uppercase tracking-widest mb-3 block">
              {t("level1Badge")}
            </span>
            <h2 className="text-2xl font-bold font-serif text-white mb-4">
              {t("level1Title")}
            </h2>
            <p className="text-emerald-100/80 mb-6 leading-relaxed text-sm">
              {t("level1Desc")}
            </p>
          </div>
          <ul className="space-y-3 pt-4 border-t border-white/10">
            <li className="flex items-center gap-2.5 text-sm text-emerald-100">
              <Check className="w-4 h-4 text-amber-300 shrink-0" /> {t("level1F1")}
            </li>
            <li className="flex items-center gap-2.5 text-sm text-emerald-100">
              <Check className="w-4 h-4 text-amber-300 shrink-0" /> {t("level1F2")}
            </li>
            <li className="flex items-center gap-2.5 text-sm text-emerald-100">
              <Check className="w-4 h-4 text-amber-300 shrink-0" /> {t("level1F3")}
            </li>
          </ul>
        </div>

        {/* Level 2 */}
        <div className="glass-container rounded-3xl p-6 md:p-8 border border-amber-400/30 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 bg-amber-400/20 text-amber-300 text-[10px] font-bold px-3 py-1 rounded-bl-xl border-l border-b border-amber-400/30 uppercase tracking-wider">
            {t("level2Popular")}
          </div>
          <div>
            <span className="text-amber-300 text-xs font-bold uppercase tracking-widest mb-3 block">
              {t("level2Badge")}
            </span>
            <h2 className="text-2xl font-bold font-serif text-white mb-4">
              {t("level2Title")}
            </h2>
            <p className="text-emerald-100/80 mb-6 leading-relaxed text-sm">
              {t("level2Desc")}
            </p>
          </div>
          <ul className="space-y-3 pt-4 border-t border-white/10">
            <li className="flex items-center gap-2.5 text-sm text-emerald-100">
              <Check className="w-4 h-4 text-amber-300 shrink-0" /> {t("level2F1")}
            </li>
            <li className="flex items-center gap-2.5 text-sm text-emerald-100">
              <Check className="w-4 h-4 text-amber-300 shrink-0" /> {t("level2F2")}
            </li>
            <li className="flex items-center gap-2.5 text-sm text-emerald-100">
              <Check className="w-4 h-4 text-amber-300 shrink-0" /> {t("level2F3")}
            </li>
          </ul>
        </div>

        {/* Level 3 */}
        <div className="glass-container rounded-3xl p-6 md:p-8 border border-white/15 shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-amber-300 text-xs font-bold uppercase tracking-widest mb-3 block">
              {t("level3Badge")}
            </span>
            <h2 className="text-2xl font-bold font-serif text-white mb-4">
              {t("level3Title")}
            </h2>
            <p className="text-emerald-100/80 mb-6 leading-relaxed text-sm">
              {t("level3Desc")}
            </p>
          </div>
          <ul className="space-y-3 pt-4 border-t border-white/10">
            <li className="flex items-center gap-2.5 text-sm text-emerald-100">
              <Check className="w-4 h-4 text-amber-300 shrink-0" /> {t("level3F1")}
            </li>
            <li className="flex items-center gap-2.5 text-sm text-emerald-100">
              <Check className="w-4 h-4 text-amber-300 shrink-0" /> {t("level3F2")}
            </li>
            <li className="flex items-center gap-2.5 text-sm text-emerald-100">
              <Check className="w-4 h-4 text-amber-300 shrink-0" /> {t("level3F3")}
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
