"use client";

import { useLanguage } from "@/components/LanguageContext";

export default function TeachWithUsPage() {
  const { t } = useLanguage();

  return (
    <main className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-10 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Left Column: Information & Steps */}
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-5 leading-tight">
            {t("teachTitle")}
          </h1>
          <p className="text-emerald-100/85 text-base sm:text-lg mb-8 leading-relaxed">
            {t("teachDesc")}
          </p>
          <div className="space-y-6 mb-8">
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-emerald-800/80 border border-amber-400/40 rounded-full flex items-center justify-center shrink-0 shadow-md">
                <span className="text-amber-300 font-bold text-lg font-serif">1</span>
              </div>
              <div>
                <h3 className="font-bold text-white mb-1 text-base sm:text-lg">{t("teachStep1Title")}</h3>
                <p className="text-sm text-emerald-100/80 leading-relaxed">
                  {t("teachStep1Desc")}
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-emerald-800/80 border border-amber-400/40 rounded-full flex items-center justify-center shrink-0 shadow-md">
                <span className="text-amber-300 font-bold text-lg font-serif">2</span>
              </div>
              <div>
                <h3 className="font-bold text-white mb-1 text-base sm:text-lg">{t("teachStep2Title")}</h3>
                <p className="text-sm text-emerald-100/80 leading-relaxed">
                  {t("teachStep2Desc")}
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-emerald-800/80 border border-amber-400/40 rounded-full flex items-center justify-center shrink-0 shadow-md">
                <span className="text-amber-300 font-bold text-lg font-serif">3</span>
              </div>
              <div>
                <h3 className="font-bold text-white mb-1 text-base sm:text-lg">{t("teachStep3Title")}</h3>
                <p className="text-sm text-emerald-100/80 leading-relaxed">
                  {t("teachStep3Desc")}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column: Glassmorphic Application Form */}
        <div className="glass-container rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl">
          <h2 className="text-2xl font-bold font-serif text-white mb-6">
            {t("appFormTitle")}
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-emerald-100 mb-2">
                {t("fullNameLabel")}
              </label>
              <input 
                type="text" 
                className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-sm" 
                placeholder={t("fullNamePlaceholder")}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-100 mb-2">
                {t("emailLabel")}
              </label>
              <input 
                type="email" 
                className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-sm" 
                placeholder="you@example.com" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-100 mb-2">
                {t("expLabel")}
              </label>
              <select className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-sm [&>option]:bg-[#052b20] [&>option]:text-white">
                <option value="<1">{t("expLess1")}</option>
                <option value="1-3">{t("exp1to3")}</option>
                <option value="3-5">{t("exp3to5")}</option>
                <option value="5+">{t("exp5plus")}</option>
              </select>
            </div>
            <button 
              type="button" 
              className="w-full bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold py-4 rounded-xl transition-all shadow-lg mt-4 cursor-pointer text-base"
            >
              {t("submitApp")}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
