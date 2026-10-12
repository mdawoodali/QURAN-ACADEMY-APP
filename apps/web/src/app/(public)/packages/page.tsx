"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

export default function PackagesPage() {
  const { t } = useLanguage();
  const [daysPerWeek, setDaysPerWeek] = useState<3 | 5>(3);

  return (
    <main className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-10 md:py-20">
      <div className="text-center mb-10 md:mb-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-4 leading-tight">
          {t("pkgTitle")}
        </h1>
        <p className="text-emerald-100/85 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          {t("pkgDesc")}
        </p>
      </div>

      <div className="flex justify-center gap-4 mb-10 md:mb-12">
        <div className="bg-black/35 backdrop-blur-md border border-white/15 rounded-full p-1.5 flex shadow-lg">
          <button 
            onClick={() => setDaysPerWeek(3)}
            className={`rounded-full px-5 sm:px-6 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              daysPerWeek === 3 
                ? "bg-amber-400 text-emerald-950 shadow-sm" 
                : "text-emerald-100/80 hover:text-white"
            }`}
          >
            {t("threeDaysWeek")}
          </button>
          <button 
            onClick={() => setDaysPerWeek(5)}
            className={`rounded-full px-5 sm:px-6 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              daysPerWeek === 5 
                ? "bg-amber-400 text-emerald-950 shadow-sm" 
                : "text-emerald-100/80 hover:text-white"
            }`}
          >
            {t("fiveDaysWeek")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
        {/* Basic Plan */}
        <div className="glass-container rounded-3xl p-6 sm:p-8 border border-white/15 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-white mb-2">
              {t("planBasicTitle")}
            </h2>
            <p className="text-emerald-100/80 mb-6 text-sm">
              {t("planBasicDesc")}
            </p>
            <div className="mb-6 sm:mb-8">
              <span className="text-3xl sm:text-4xl font-bold text-white">
                {daysPerWeek === 3 ? "$45" : "$70"}
              </span>
              <span className="text-emerald-200/80 text-sm"> {t("perMonth")}</span>
            </div>
            <Link 
              href="/trial" 
              className="block w-full text-center border border-amber-400/60 text-amber-300 hover:bg-amber-400 hover:text-emerald-950 font-bold py-3.5 rounded-full transition-all mb-8 shadow-sm text-sm"
            >
              {t("selectPlan")}
            </Link>
          </div>
          <ul className="space-y-3.5 pt-4 border-t border-white/10">
            <li className="flex items-center gap-3 text-sm text-emerald-100">
              <Check className="w-4 h-4 text-amber-300 shrink-0" /> {daysPerWeek === 3 ? t("threeDaysWeek") : t("fiveDaysWeek")}
            </li>
            <li className="flex items-center gap-3 text-sm text-emerald-100">
              <Check className="w-4 h-4 text-amber-300 shrink-0" /> {t("featTeacher")}
            </li>
            <li className="flex items-center gap-3 text-sm text-emerald-100">
              <Check className="w-4 h-4 text-amber-300 shrink-0" /> {t("featVoice")}
            </li>
          </ul>
        </div>

        {/* Pro Plan */}
        <div className="glass-container rounded-3xl p-6 sm:p-8 border border-amber-400/40 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 bg-amber-400/20 text-amber-300 text-[10px] sm:text-xs font-bold px-3.5 py-1 rounded-bl-xl border-l border-b border-amber-400/30 uppercase tracking-wider">
            {t("mostPopular")}
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-white mb-2">
              {t("planProTitle")}
            </h2>
            <p className="text-emerald-100/80 mb-6 text-sm">
              {t("planProDesc")}
            </p>
            <div className="mb-6 sm:mb-8">
              <span className="text-3xl sm:text-4xl font-bold text-white">
                {daysPerWeek === 3 ? "$75" : "$120"}
              </span>
              <span className="text-emerald-200/80 text-sm"> {t("perMonth")}</span>
            </div>
            <Link 
              href="/trial" 
              className="block w-full text-center bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold py-3.5 rounded-full transition-all shadow-lg mb-8 text-sm"
            >
              {t("selectPlan")}
            </Link>
          </div>
          <ul className="space-y-3.5 pt-4 border-t border-white/10">
            <li className="flex items-center gap-3 text-sm text-emerald-100">
              <Check className="w-4 h-4 text-amber-300 shrink-0" /> {daysPerWeek === 3 ? t("threeDaysWeek") : t("fiveDaysWeek")}
            </li>
            <li className="flex items-center gap-3 text-sm text-emerald-100">
              <Check className="w-4 h-4 text-amber-300 shrink-0" /> {t("featTeacher")}
            </li>
            <li className="flex items-center gap-3 text-sm text-emerald-100">
              <Check className="w-4 h-4 text-amber-300 shrink-0" /> {t("featReport")}
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
