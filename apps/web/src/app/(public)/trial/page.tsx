"use client";

import TrialFunnel from './TrialFunnel';
import { useLanguage } from '@/components/LanguageContext';

export default function FreeTrialPage() {
  const { t } = useLanguage();

  return (
    <main className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-10 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        <div className="lg:sticky lg:top-28">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-5 leading-tight">
            {t("trialTitle")}
          </h1>
          <p className="text-emerald-100/85 text-base sm:text-lg mb-8 leading-relaxed">
            {t("trialDesc")}
          </p>
          <div className="glass-container rounded-3xl p-6 sm:p-8 border border-white/15 shadow-xl">
            <h3 className="font-bold text-white mb-4 text-base sm:text-lg">{t("whatToExpect")}</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-emerald-100">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                <span>{t("trialPoint1")}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-emerald-100">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                <span>{t("trialPoint2")}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-emerald-100">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                <span>{t("trialPoint3")}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div>
          <TrialFunnel />
        </div>
      </div>
    </main>
  );
}
