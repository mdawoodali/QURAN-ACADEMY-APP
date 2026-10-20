"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/LanguageContext";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";

export default function Home() {
  const { t } = useLanguage();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="w-full min-h-screen bg-[var(--color-page)] flex flex-col items-center"
    >
      {/* Hero Section */}
      <main className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-8 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Column */}
        <div className="flex flex-col items-start space-y-5 sm:space-y-6">
          <span className="text-amber-300 font-bold tracking-widest text-xs sm:text-sm uppercase">
            {t("heroSubtitle")}
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-white leading-tight">
            {t("heroTitle")}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-emerald-100/85 max-w-lg leading-relaxed">
            {t("heroDesc")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3.5 pt-3 w-full sm:w-auto">
            <Link 
              href="/trial" 
              className="group relative bg-amber-400 hover:bg-emerald-700 text-emerald-950 hover:text-white border border-transparent hover:border-emerald-500/50 font-bold py-3.5 sm:py-4 px-8 rounded-full transition-all duration-300 text-center shadow-lg hover:shadow-xl text-sm sm:text-base cursor-pointer pop-hover"
            >
              {t("beginFreeTrial")}
            </Link>
            <Link 
              href="/programmes" 
              className="group relative bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-amber-400/50 font-bold py-3.5 sm:py-4 px-8 rounded-full transition-all text-center text-sm sm:text-base cursor-pointer pop-hover"
            >
              {t("exploreProgrammes")}
            </Link>
          </div>
        </div>

        {/* Right Column: Glassmorphic Panel */}
        <div className="glass-container rounded-3xl sm:rounded-[2rem] p-6 sm:p-8 md:p-12 relative flex justify-center shadow-2xl h-full items-center min-h-[360px]">
          {/* Frosted Inner Card */}
          <div className="bg-black/35 backdrop-blur-md border border-white/15 rounded-3xl p-6 sm:p-8 shadow-xl max-w-sm w-full relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 pop-hover">
            <div className="flex justify-between items-start mb-6">
              <span className="bg-amber-400/20 text-amber-300 text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-amber-400/30">
                {t("nextClass")}
              </span>
              <span className="text-xs sm:text-sm font-bold text-emerald-100/70">
                {t("today")}
              </span>
            </div>
            
            <h3 className="font-bold text-lg sm:text-xl text-white mb-4">
              {t("tajweedCourse")}
            </h3>
            
            <div className="bg-black/40 rounded-2xl p-5 sm:p-6 mb-6 flex justify-center items-center border border-white/10">
              <span className="font-arabic text-2xl sm:text-3xl text-amber-200 leading-loose">
                الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
              </span>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-3 text-xs sm:text-sm text-emerald-100/80 font-medium">
                <CheckCircle2 className="w-4 sm:w-5 h-4 sm:h-5 text-amber-300 shrink-0" />
                {t("teacherReady")}
              </li>
              <li className="flex items-center gap-3 text-xs sm:text-sm text-emerald-100/80 font-medium">
                <CheckCircle2 className="w-4 sm:w-5 h-4 sm:h-5 text-amber-300 shrink-0" />
                {t("voiceFollow")}
              </li>
            </ul>

            <Link 
              href="/classroom/demo" 
              className="block w-full bg-amber-400 hover:bg-emerald-700 text-emerald-950 hover:text-white border border-transparent hover:border-emerald-500/50 font-bold py-3.5 px-4 rounded-xl text-center text-xs sm:text-sm transition-all duration-300 shadow-md cursor-pointer pop-hover"
            >
              {t("enterClassroom")}
            </Link>
          </div>
        </div>
      </main>

      {/* Trust Cards with Ornamental Expanding Line Effect on Hover */}
      <section className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 pb-8 sm:pb-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
        {[
          { titleKey: "trust1Title", descKey: "trust1Desc", colSpan: "" },
          { titleKey: "trust2Title", descKey: "trust2Desc", colSpan: "" },
          { titleKey: "trust3Title", descKey: "trust3Desc", colSpan: "sm:col-span-2 md:col-span-1" },
        ].map(({ titleKey, descKey, colSpan }, i) => (
          <div 
            key={i} 
            className={`group glass-container rounded-2xl p-6 shadow-sm text-white pop-hover relative overflow-hidden flex flex-col justify-between border border-white/10 hover:border-amber-400/30 transition-all duration-300 ${colSpan}`}
          >
            <div>
              <h4 className="font-bold text-amber-300 mb-2 text-base group-hover:text-amber-200 transition-colors">
                {t(titleKey as any)}
              </h4>
              <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
                {t(descKey as any)}
              </p>
            </div>

            {/* Ornamental expanding line at the bottom of the card on hover */}
            <div className="pt-4 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="h-[2px] bg-gradient-to-l from-amber-400 to-transparent w-0 group-hover:w-1/2 transition-all duration-300 ease-out origin-right rounded-full" />
              <span className="flex items-center gap-[2px] px-1 scale-0 group-hover:scale-100 transition-transform duration-300 ease-out">
                <span className="w-1 h-1 rounded-full bg-amber-400/70 shrink-0" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.9)] shrink-0" />
                <span className="w-1 h-1 rounded-full bg-amber-400/70 shrink-0" />
              </span>
              <span className="h-[2px] bg-gradient-to-r from-amber-400 to-transparent w-0 group-hover:w-1/2 transition-all duration-300 ease-out origin-left rounded-full" />
            </div>
          </div>
        ))}
      </section>

      {/* What Our Students Say About Us (Swipe Carousel) */}
      <TestimonialsCarousel />
    </motion.div>
  );
}
