"use client";

import Link from "next/link";
import { ArrowRight, Calendar, CreditCard, Laptop } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

export default function HowItWorksPage() {
  const { t } = useLanguage();

  return (
    <main className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-8 md:py-12 min-h-[calc(100vh-5rem)] flex flex-col justify-center">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
        <span className="text-amber-300 font-bold tracking-widest text-xs uppercase mb-2 block">
          {t("howItWorksBadge")}
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-3 leading-tight">
          {t("howItWorksTitle")}
        </h1>
        <p className="text-emerald-100/85 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
          {t("howItWorksDesc")}
        </p>
      </div>

      {/* 3 Step Cards Horizontal Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-8 md:mb-10">
        {/* Step 1 */}
        <section className="glass-container p-6 lg:p-8 rounded-3xl border border-white/15 shadow-xl flex flex-col justify-between pop-hover group">
          <div>
            <div className="w-12 h-12 bg-emerald-800/80 border border-amber-400/40 rounded-full flex items-center justify-center mb-5 shadow-md group-hover:scale-105 transition-transform">
              <span className="text-amber-300 font-bold text-lg font-serif">1</span>
            </div>
            <h2 className="text-xl lg:text-2xl font-bold font-serif text-white mb-3">
              {t("step1Title")}
            </h2>
            <p className="text-emerald-100/80 text-sm lg:text-base leading-relaxed">
              {t("step1Desc")}
            </p>
          </div>
          <div className="pt-5 mt-5 border-t border-white/10 flex items-center gap-2 text-xs text-amber-300 font-medium">
            <Calendar className="w-4 h-4 shrink-0" />
            <span>{t("step1Badge")}</span>
          </div>
        </section>

        {/* Step 2 */}
        <section className="glass-container p-6 lg:p-8 rounded-3xl border border-white/15 shadow-xl flex flex-col justify-between pop-hover group">
          <div>
            <div className="w-12 h-12 bg-emerald-800/80 border border-amber-400/40 rounded-full flex items-center justify-center mb-5 shadow-md group-hover:scale-105 transition-transform">
              <span className="text-amber-300 font-bold text-lg font-serif">2</span>
            </div>
            <h2 className="text-xl lg:text-2xl font-bold font-serif text-white mb-3">
              {t("step2Title")}
            </h2>
            <p className="text-emerald-100/80 text-sm lg:text-base leading-relaxed">
              {t("step2Desc")}
            </p>
          </div>
          <div className="pt-5 mt-5 border-t border-white/10 flex items-center gap-2 text-xs text-amber-300 font-medium">
            <CreditCard className="w-4 h-4 shrink-0" />
            <span>{t("step2Badge")}</span>
          </div>
        </section>

        {/* Step 3 */}
        <section className="glass-container p-6 lg:p-8 rounded-3xl border border-white/15 shadow-xl flex flex-col justify-between pop-hover group">
          <div>
            <div className="w-12 h-12 bg-emerald-800/80 border border-amber-400/40 rounded-full flex items-center justify-center mb-5 shadow-md group-hover:scale-105 transition-transform">
              <span className="text-amber-300 font-bold text-lg font-serif">3</span>
            </div>
            <h2 className="text-xl lg:text-2xl font-bold font-serif text-white mb-3">
              {t("step3Title")}
            </h2>
            <p className="text-emerald-100/80 text-sm lg:text-base leading-relaxed">
              {t("step3Desc")}
            </p>
          </div>
          <div className="pt-5 mt-5 border-t border-white/10 flex items-center gap-2 text-xs text-amber-300 font-medium">
            <Laptop className="w-4 h-4 shrink-0" />
            <span>{t("step3Badge")}</span>
          </div>
        </section>
      </div>

      {/* Action CTA */}
      <div className="flex justify-center">
        <Link
          href="/trial"
          className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold py-3.5 px-8 rounded-full transition-all text-sm md:text-base shadow-lg hover:shadow-xl flex items-center gap-2 cursor-pointer"
        >
          <span>{t("beginTrialCta")}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </main>
  );
}
