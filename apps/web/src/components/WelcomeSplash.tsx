"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle } from "lucide-react";
import { useLanguage } from "./LanguageContext";

interface WelcomeSplashProps {
  onGetStarted: (sect?: "sunni" | "shia") => void;
}

export default function WelcomeSplash({ onGetStarted }: WelcomeSplashProps) {
  const { language, setLanguage } = useLanguage();
  const [isExiting, setIsExiting] = useState(false);
  const [selectedSect, setSelectedSect] = useState<"sunni" | "shia" | null>(null);

  const handleSelect = (sect: "sunni" | "shia") => {
    setSelectedSect(sect);
    setIsExiting(true);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("user_sect", sect);
      } catch (e) {
        // safe fallback
      }
    }
    // Smooth delay before triggering parent unmount to let animation play
    setTimeout(() => {
      onGetStarted(sect);
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
      <header className="relative z-20 w-full px-4 sm:px-10 lg:px-14 pt-4 sm:pt-8 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-2.5 bg-black/35 backdrop-blur-md px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/10 shadow-lg">
          <div className="bg-emerald-800/80 p-1.5 rounded-full text-amber-300">
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <span className="text-white font-serif font-bold text-xs sm:text-base tracking-wide">
            Quran Learn Academy
          </span>
        </div>

        {/* Language Switcher pushed to top-right edge */}
        <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md p-1 rounded-full border border-white/15 shadow-lg text-xs font-semibold">
          <button
            onClick={() => setLanguage("en")}
            className={`welcome-lang-btn px-2.5 sm:px-3 py-1 rounded-full font-bold transition-all text-xs ${
              language === "en" 
                ? "bg-amber-400 text-emerald-950 shadow-xs" 
                : "text-emerald-100/75"
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage("ur")}
            className={`welcome-lang-btn px-2.5 sm:px-3 py-1 rounded-full font-urdu text-xs sm:text-sm transition-all ${
              language === "ur" 
                ? "bg-amber-400 text-emerald-950 shadow-xs" 
                : "text-emerald-100/75"
            }`}
          >
            اردو
          </button>
        </div>
      </header>

      {/* Center Section: Quran Learn Academy Logo, Hadith, and 2 Options (Sunni / Shia) */}
      <main className="relative z-20 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 my-auto flex flex-col items-center justify-center text-center">
        {/* Quran Learn Academy Logo replacing the previous Bismillah */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: -12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-5 sm:mb-7 flex items-center justify-center"
        >
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 drop-shadow-[0_12px_28px_rgba(0,0,0,0.75)] hover:scale-105 transition-transform duration-300">
            <img
              src="/logo_quran_learn_academy.png"
              alt="Quran Learn Academy Logo"
              className="w-full h-full object-contain filter drop-shadow-[0_4px_20px_rgba(251,191,36,0.3)]"
            />
          </div>
        </motion.div>

        {/* Main Heading: Hadith */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] max-w-4xl mb-3 sm:mb-4 text-center"
        >
          {language === "ur" ? (
            <span className="block font-urdu text-2xl sm:text-4xl md:text-5xl leading-relaxed font-bold italic">
              ”تم میں سے بہترین وہ ہے جو قرآن سیکھے اور سکھائے۔“
            </span>
          ) : (
            <span className="block font-vileade font-bold italic tracking-wide text-xl sm:text-4xl md:text-5xl leading-tight">
              <span className="block">“The best among you is the one</span>
              <span className="block mt-1 sm:mt-2">who learns the Quran and teaches it.”</span>
            </span>
          )}
        </motion.h1>

        {/* Hadith Reference: Sahih Bukhari Hadith 5027 */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-[11px] sm:text-sm md:text-base text-emerald-200/90 font-sans font-medium tracking-widest uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] mb-6 sm:mb-8"
        >
          {language === "ur"
            ? "— صحیح بخاری، حدیث ۵۰۲۷"
            : "— Sahih Bukhari Hadith 5027"}
        </motion.p>

        {/* Two Options: "Sunni" and "Shia" with golden pop effect and ornamental underline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="w-full flex flex-col items-center"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-6 w-full max-w-lg px-4">
            {/* Sunni Option */}
            <button
              onClick={() => handleSelect("sunni")}
              disabled={isExiting}
              className={`welcome-cta-btn group relative pop-hover overflow-hidden w-full sm:w-56 py-4 px-6 rounded-full font-bold text-base sm:text-lg flex flex-col items-center justify-center transition-all ${
                selectedSect === "sunni" ? "is-active" : ""
              }`}
            >
              <div className="flex items-center justify-center z-10">
                <span className={language === "ur" ? "font-urdu text-lg sm:text-xl" : "tracking-wide"}>
                  {language === "ur" ? "اہل سنت (Sunni)" : "Sunni"}
                </span>
              </div>

              {/* Ornamental expanding golden underline with amber bead trio */}
              <span className="absolute bottom-1.5 left-4 right-4 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="h-[2px] bg-gradient-to-l from-amber-400 to-transparent w-0 group-hover:w-1/2 transition-all duration-300 ease-out origin-right rounded-full" />
                <span className="flex items-center gap-[2px] px-1 scale-0 group-hover:scale-100 transition-transform duration-300 ease-out">
                  <span className="w-1 h-1 rounded-full bg-amber-400/80 shrink-0" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.9)] shrink-0" />
                  <span className="w-1 h-1 rounded-full bg-amber-400/80 shrink-0" />
                </span>
                <span className="h-[2px] bg-gradient-to-r from-amber-400 to-transparent w-0 group-hover:w-1/2 transition-all duration-300 ease-out origin-left rounded-full" />
              </span>
            </button>

            {/* Shia Option */}
            <button
              onClick={() => handleSelect("shia")}
              disabled={isExiting}
              className={`welcome-cta-btn group relative pop-hover overflow-hidden w-full sm:w-56 py-4 px-6 rounded-full font-bold text-base sm:text-lg flex flex-col items-center justify-center transition-all ${
                selectedSect === "shia" ? "is-active" : ""
              }`}
            >
              <div className="flex items-center justify-center z-10">
                <span className={language === "ur" ? "font-urdu text-lg sm:text-xl" : "tracking-wide"}>
                  {language === "ur" ? "اہل تشیع (Shia)" : "Shia"}
                </span>
              </div>

              {/* Ornamental expanding golden underline with amber bead trio */}
              <span className="absolute bottom-1.5 left-4 right-4 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="h-[2px] bg-gradient-to-l from-amber-400 to-transparent w-0 group-hover:w-1/2 transition-all duration-300 ease-out origin-right rounded-full" />
                <span className="flex items-center gap-[2px] px-1 scale-0 group-hover:scale-100 transition-transform duration-300 ease-out">
                  <span className="w-1 h-1 rounded-full bg-amber-400/80 shrink-0" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.9)] shrink-0" />
                  <span className="w-1 h-1 rounded-full bg-amber-400/80 shrink-0" />
                </span>
                <span className="h-[2px] bg-gradient-to-r from-amber-400 to-transparent w-0 group-hover:w-1/2 transition-all duration-300 ease-out origin-left rounded-full" />
              </span>
            </button>
          </div>
        </motion.div>
      </main>

      {/* Bottom Feature Badges */}
      <footer className="relative z-20 w-full px-4 sm:px-10 lg:px-14 pb-4 sm:pb-8 flex flex-wrap items-center justify-start gap-2 sm:gap-6 text-xs sm:text-sm text-emerald-100/85 font-medium">
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
