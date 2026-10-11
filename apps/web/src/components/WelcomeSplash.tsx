"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, CheckCircle } from "lucide-react";
import { useLanguage } from "./LanguageContext";

interface WelcomeSplashProps {
  onGetStarted: () => void;
}

export default function WelcomeSplash({ onGetStarted }: WelcomeSplashProps) {
  const { language, setLanguage } = useLanguage();
  const [isExiting, setIsExiting] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleStart = () => {
    setIsClicked(true);
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
        backgroundImage: "url('/images/emerald_bg.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      {/* Subtle Ambient Radial Lighting Overlay */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#031d16]/20 to-[#02130e]/60 pointer-events-none" />

      {/* Top Bar: Brand Crest & Bilingual Language Switcher pushed to outer edges */}
      <header className="relative z-20 w-full px-6 sm:px-10 lg:px-14 pt-6 sm:pt-8 flex items-center justify-between">
        <div className="flex items-center gap-2.5 bg-black/35 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
          <div className="bg-emerald-800/80 p-1.5 rounded-full text-amber-300">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="text-white font-serif font-bold text-sm sm:text-base tracking-wide">
            Quran Academy
          </span>
        </div>

        {/* Language Switcher pushed to top-right edge */}
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

      {/* Center Section: Hadith and CTA directly on gradient background */}
      <main className="relative z-20 w-full max-w-4xl mx-auto px-6 py-6 flex flex-col items-center justify-center my-auto text-center">
        {/* Main Heading: Hadith */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-2xl sm:text-4xl md:text-5xl font-serif text-white font-bold leading-snug drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)] max-w-3xl mb-4"
        >
          {language === "ur" 
            ? "”تم میں سے بہترین وہ ہے جو قرآن سیکھے اور سکھائے۔“"
            : "“The best among you is the one who learns the Quran and teaches it.”"}
        </motion.h1>

        {/* Hadith Reference: Sahih Bukhari Hadith 5027 */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-sm sm:text-lg text-emerald-200/90 font-medium tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] mb-8 sm:mb-10"
        >
          {language === "ur"
            ? "— صحیح بخاری، حدیث ۵۰۲۷"
            : "— Sahih Bukhari Hadith 5027"}
        </motion.p>

        {/* "Get Started" CTA Button (Not golden by default; golden ONLY active on click) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="w-full flex flex-col items-center"
        >
          <button
            onClick={handleStart}
            disabled={isExiting}
            className={`welcome-cta-btn w-full max-w-xs sm:max-w-sm py-4 px-8 rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-all ${
              isClicked ? "is-active" : ""
            }`}
          >
            <span className={language === "ur" ? "font-urdu text-xl" : "tracking-wide"}>
              {language === "ur" ? "شروع کریں" : "Get Started"}
            </span>
            <ArrowRight className="w-5 h-5 transition-transform" />
          </button>
        </motion.div>
      </main>

      {/* Bottom Feature Badges positioned towards bottom-left to leave bottom-right Quran artwork unobstructed */}
      <footer className="relative z-20 w-full px-6 sm:px-10 lg:px-14 pb-6 sm:pb-8 flex flex-wrap items-center justify-start gap-3 sm:gap-6 text-xs sm:text-sm text-emerald-100/85 font-medium">
        <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-sm">
          <CheckCircle className="w-4 h-4 text-amber-300" />
          <span>{language === "ur" ? "مستند قاری و قاریہ" : "Qualified Teachers"}</span>
        </div>
        <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-sm">
          <CheckCircle className="w-4 h-4 text-amber-300" />
          <span>{language === "ur" ? "انفرادی کلاسز" : "1-on-1 Live Lessons"}</span>
        </div>
        <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-sm">
          <CheckCircle className="w-4 h-4 text-amber-300" />
          <span>{language === "ur" ? "آسان اور لچکدار اوقات" : "Flexible Scheduling"}</span>
        </div>
      </footer>
    </motion.div>
  );
}
