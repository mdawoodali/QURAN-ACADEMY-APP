"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, BookOpen, CheckCircle } from "lucide-react";
import { useLanguage } from "./LanguageContext";

interface WelcomeSplashProps {
  onGetStarted: () => void;
}

export default function WelcomeSplash({ onGetStarted }: WelcomeSplashProps) {
  const { language, setLanguage } = useLanguage();
  const [isExiting, setIsExiting] = useState(false);

  const handleStart = () => {
    setIsExiting(true);
    // Smooth delay before triggering parent unmount to let animation play
    setTimeout(() => {
      onGetStarted();
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        scale: 1.05, 
        filter: "blur(8px)",
        transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } 
      }}
      className="fixed inset-0 z-[100] w-full min-h-screen flex flex-col justify-between items-center text-center overflow-hidden select-none bg-[#052b20] bg-cover bg-no-repeat bg-center"
      style={{
        backgroundImage: "url('/images/quran_welcome_bg.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      {/* Subtle Ambient Radial Lighting Overlay */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#031d16]/20 to-[#02130e]/60 pointer-events-none" />

      {/* Top Bar: Brand Crest & Bilingual Language Switcher */}
      <header className="relative z-20 w-full max-w-[1280px] mx-auto px-6 pt-6 sm:pt-8 flex items-center justify-between">
        <div className="flex items-center gap-2.5 bg-black/35 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
          <div className="bg-emerald-800/80 p-1.5 rounded-full text-amber-300">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="text-white font-serif font-bold text-sm sm:text-base tracking-wide">
            Quran Academy
          </span>
        </div>

        {/* Language Switcher using CSS :hover pseudo-class */}
        <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md p-1 rounded-full border border-white/15 shadow-lg text-xs font-semibold">
          <button
            onClick={() => setLanguage("en")}
            className={`welcome-lang-btn px-3 py-1 rounded-full font-bold transition-all ${
              language === "en" 
                ? "bg-amber-400 text-emerald-950 shadow-xs" 
                : "text-emerald-100/75"
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage("ur")}
            className={`welcome-lang-btn px-3 py-1 rounded-full font-urdu text-sm transition-all ${
              language === "ur" 
                ? "bg-amber-400 text-emerald-950 shadow-xs" 
                : "text-emerald-100/75"
            }`}
          >
            اردو
          </button>
        </div>
      </header>

      {/* Center Hero Glassmorphic Container over background image */}
      <main className="glass-container relative z-20 w-full max-w-2xl mx-auto px-6 sm:px-10 py-8 sm:py-12 my-auto rounded-[2rem] flex flex-col items-center justify-center">
        {/* Subtle Arabic Sub-badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 bg-emerald-950/60 backdrop-blur-md border border-amber-400/30 px-5 py-1.5 rounded-full mb-5 shadow-lg"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span className="font-arabic text-amber-200 text-sm tracking-wider">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl sm:text-5xl md:text-6xl font-serif text-white font-bold leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)] mb-4"
        >
          {language === "ur" 
            ? "قرآن مجید کے ساتھ ایک دائمی تعلق"
            : "A Lifelong Connection with the Quran"}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-base sm:text-xl text-emerald-100/90 font-sans max-w-xl leading-relaxed mb-8 drop-shadow-md"
        >
          {language === "ur"
            ? "مستند اساتذہ، براہ راست لائیو اسباق اور تجوید و فہم قرآن کا مکمل نصاب"
            : "Learn with certified teachers, live one-on-one lessons, and real-time guidance."}
        </motion.p>

        {/* "Get Started" CTA Button using CSS :hover pseudo-class */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full flex flex-col items-center"
        >
          <button
            onClick={handleStart}
            disabled={isExiting}
            className="welcome-cta-btn w-full max-w-xs sm:max-w-sm py-4 px-8 rounded-full font-bold text-lg flex items-center justify-center gap-3 border border-amber-300/40"
          >
            <span className={language === "ur" ? "font-urdu text-xl" : "tracking-wide"}>
              {language === "ur" ? "شروع کریں" : "Get Started"}
            </span>
            <ArrowRight className="w-5 h-5 text-[#062b20] stroke-[2.5]" />
          </button>
        </motion.div>
      </main>

      {/* Bottom Feature Badges / Highlights */}
      <footer className="relative z-20 w-full max-w-[1280px] mx-auto px-6 pb-6 sm:pb-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-emerald-100/85 font-medium">
        <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
          <CheckCircle className="w-4 h-4 text-amber-300" />
          <span>{language === "ur" ? "مستند قاری و قاریہ" : "Qualified Teachers"}</span>
        </div>
        <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
          <CheckCircle className="w-4 h-4 text-amber-300" />
          <span>{language === "ur" ? "انفرادی کلاسز" : "1-on-1 Live Lessons"}</span>
        </div>
        <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
          <CheckCircle className="w-4 h-4 text-amber-300" />
          <span>{language === "ur" ? "آسان اور لچکدار اوقات" : "Flexible Scheduling"}</span>
        </div>
      </footer>
    </motion.div>
  );
}
