"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/components/LanguageContext";
import WelcomeSplash from "@/components/WelcomeSplash";

export default function Home() {
  const { t, language } = useLanguage();
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <WelcomeSplash onGetStarted={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full min-h-screen bg-[var(--color-page)] flex flex-col items-center"
      >
      {/* Hero Section */}
      <main className="w-full max-w-[1280px] mx-auto px-6 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column */}
        <div className="flex flex-col items-start space-y-6">
          <span className="text-amber-300 font-bold tracking-widest text-sm uppercase">
            {t("heroSubtitle")}
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-white leading-tight">
            {t("heroTitle")}
          </h1>
          <p className="text-lg md:text-xl text-emerald-100/85 max-w-lg leading-relaxed font-sans">
            {t("heroDesc")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
            <Link 
              href="/trial" 
              className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold py-4 px-8 rounded-full transition-all text-center shadow-lg hover:shadow-xl"
            >
              {t("beginFreeTrial")}
            </Link>
            <Link 
              href="/programmes" 
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold py-4 px-8 rounded-full transition-all text-center"
            >
              {t("exploreProgrammes")}
            </Link>
          </div>
        </div>

        {/* Right Column: Glassmorphic Panel */}
        <div className="glass-container rounded-[2rem] p-8 md:p-12 relative flex justify-center shadow-2xl h-full items-center min-h-[400px]">
          {/* Frosted Inner Card */}
          <div className="bg-black/35 backdrop-blur-md border border-white/15 rounded-3xl p-8 shadow-xl max-w-sm w-full relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex justify-between items-start mb-6">
              <span className="bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-amber-400/30">
                {t("nextClass")}
              </span>
              <span className="text-sm font-bold text-emerald-100/70">
                {t("today")}
              </span>
            </div>
            
            <h3 className="font-bold text-xl text-white mb-4">
              {t("tajweedCourse")}
            </h3>
            
            <div className="bg-black/40 rounded-2xl p-6 mb-6 flex justify-center items-center border border-white/10">
              <span className="font-arabic text-3xl text-amber-200 leading-loose">
                الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
              </span>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-3 text-sm text-emerald-100/80 font-medium">
                <CheckCircle2 className="w-5 h-5 text-amber-300" />
                {t("teacherReady")}
              </li>
              <li className="flex items-center gap-3 text-sm text-emerald-100/80 font-medium">
                <CheckCircle2 className="w-5 h-5 text-amber-300" />
                {t("voiceFollow")}
              </li>
            </ul>

            <Link 
              href="/classroom/demo" 
              className="block w-full bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold py-3.5 px-4 rounded-xl text-center text-sm transition-all shadow-md"
            >
              {t("enterClassroom")}
            </Link>
          </div>
        </div>
      </main>

      {/* Trust Cards */}
      <section className="w-full max-w-[1280px] mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-container rounded-2xl p-6 shadow-sm text-white">
          <h4 className="font-bold text-amber-300 mb-2">
            {language === "ur" ? "مستند اساتذہ" : "Qualified teachers"}
          </h4>
          <p className="text-sm text-emerald-100/80">
            {language === "ur" ? "قاری / قاریہ • باقاعدہ جانچ" : "Qari / Qariah • placement-led"}
          </p>
        </div>
        <div className="glass-container rounded-2xl p-6 shadow-sm text-white">
          <h4 className="font-bold text-amber-300 mb-2">
            {language === "ur" ? "واضح تعلیمی راستہ" : "A clear learning path"}
          </h4>
          <p className="text-sm text-emerald-100/80">
            {language === "ur" ? "قاعدہ ← تجوید ← حفظ" : "Qaida → Tajweed → Hifz"}
          </p>
        </div>
        <div className="glass-container rounded-2xl p-6 shadow-sm text-white">
          <h4 className="font-bold text-amber-300 mb-2">
            {language === "ur" ? "نمایاں پیش رفت" : "Progress you can see"}
          </h4>
          <p className="text-sm text-emerald-100/80">
            {language === "ur" ? "اسباق کے نوٹس اور ماہانہ رپورٹ" : "Lesson notes and parent reports"}
          </p>
        </div>
      </section>
    </motion.div>
  </>
  );
}
