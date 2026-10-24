"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import { useSect } from "./SectContext";

interface WelcomeSplashProps {
  onGetStarted: (sect?: "sunni" | "shia") => void;
}

export default function WelcomeSplash({ onGetStarted }: WelcomeSplashProps) {
  const { language, setLanguage } = useLanguage();
  const [isExiting, setIsExiting] = useState(false);
  const [selectedSect, setSelectedSect] = useState<"sunni" | "shia" | null>(null);

  const { setSect } = useSect();

  const handleSelect = (sect: "sunni" | "shia") => {
    setSelectedSect(sect);
    setIsExiting(true);
    setSect(sect);
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("welcome_dismissed", "true");
        localStorage.setItem("welcome_dismissed", "true");
      } catch {}
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
      className="fixed inset-0 z-[100] w-full h-[100dvh] max-h-[100dvh] flex flex-col justify-between items-center text-center overflow-hidden select-none bg-[#052b20] bg-cover bg-no-repeat bg-center"
      style={{
        backgroundImage: "url('/images/emerald_bg.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      {/* Subtle Ambient Radial Lighting Overlay */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#031d16]/20 to-[#02130e]/60 pointer-events-none" />

      {/* Top Bar: Brand Crest & Bilingual Language Switcher */}
      <header className="relative z-20 w-full px-4 sm:px-10 lg:px-14 pt-2.5 sm:pt-5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 bg-black/35 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-full border border-white/10 shadow-lg">
          <div className="bg-emerald-800/80 p-1.5 rounded-full text-amber-300">
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <span className="text-white font-serif font-bold text-xs sm:text-base tracking-wide">
            Quran Learn Academy
          </span>
        </div>

        {/* Language Switcher */}
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

      {/* Center Section: Fitted perfectly without scrolling */}
      <main className="relative z-20 w-full max-w-3xl mx-auto px-4 py-1 sm:py-2 flex flex-col items-center justify-center text-center my-auto shrink">
        {/* Prominent Quran Learn Academy Logo with Ambient Halo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="mb-1.5 sm:mb-3 relative flex items-center justify-center shrink-0"
        >
          {/* Luminous Golden Halo */}
          <div className="absolute w-28 h-28 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full bg-gradient-to-tr from-amber-500/20 via-amber-300/25 to-emerald-400/10 blur-2xl -z-10 pointer-events-none" />

          {/* Logo container */}
          <div className="relative w-20 h-20 sm:w-36 sm:h-36 md:w-44 md:h-44 drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)] hover:scale-105 transition-transform duration-300">
            <Image
              src="/logo_quran_learn_academy.png"
              alt="Quran Learn Academy Logo"
              width={200}
              height={200}
              className="w-full h-full object-contain filter drop-shadow-[0_0_24px_rgba(251,191,36,0.42)] drop-shadow-[0_6px_20px_rgba(0,0,0,0.9)]"
              priority
            />
          </div>
        </motion.div>

        {/* Main Heading: Hadith */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] max-w-3xl mb-1.5 sm:mb-2 text-center"
        >
          {language === "ur" ? (
            <span className="block font-urdu text-lg sm:text-2xl md:text-3xl lg:text-4xl leading-relaxed font-bold italic">
              ”تم میں سے بہترین وہ ہے جو قرآن سیکھے اور سکھائے۔“
            </span>
          ) : (
            <span className="block font-vileade font-bold italic tracking-wide text-base sm:text-2xl md:text-3xl lg:text-4xl leading-tight">
              <span className="block">“The best among you is the one</span>
              <span className="block mt-0.5 sm:mt-1">who learns the Quran and teaches it.”</span>
            </span>
          )}
        </motion.h1>

        {/* Hadith Reference */}
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-[9px] sm:text-xs md:text-sm text-emerald-200/90 font-sans font-medium tracking-widest uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] mb-3 sm:mb-5"
        >
          {language === "ur"
            ? "— صحیح بخاری، حدیث ۵۰۲۷"
            : "— Sahih Bukhari Hadith 5027"}
        </motion.p>

        {/* Two Options: "Sunni" and "Shia" */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="w-full flex flex-col items-center shrink-0"
        >
          <div className="flex flex-row items-center justify-center gap-3 sm:gap-6 w-full max-w-md px-4">
            {/* Sunni Option */}
            <button
              onClick={() => handleSelect("sunni")}
              disabled={isExiting}
              className={`welcome-cta-btn group relative pop-hover overflow-hidden w-40 sm:w-52 py-2.5 sm:py-3.5 px-5 rounded-full font-bold text-xs sm:text-base flex flex-col items-center justify-center transition-all cursor-pointer ${
                selectedSect === "sunni" ? "is-active" : ""
              }`}
            >
              <div className="flex items-center justify-center z-10">
                <span className={language === "ur" ? "font-urdu text-sm sm:text-lg" : "tracking-wide"}>
                  {language === "ur" ? "اہل سنت (Sunni)" : "Sunni"}
                </span>
              </div>

              {/* Ornamental underline */}
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
              className={`welcome-cta-btn group relative pop-hover overflow-hidden w-40 sm:w-52 py-2.5 sm:py-3.5 px-5 rounded-full font-bold text-xs sm:text-base flex flex-col items-center justify-center transition-all cursor-pointer ${
                selectedSect === "shia" ? "is-active" : ""
              }`}
            >
              <div className="flex items-center justify-center z-10">
                <span className={language === "ur" ? "font-urdu text-sm sm:text-lg" : "tracking-wide"}>
                  {language === "ur" ? "اہل تشیع (Shia)" : "Shia"}
                </span>
              </div>

              {/* Ornamental underline */}
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

          {/* Direct Enter / Skip Option */}
          <button
            onClick={() => handleSelect("sunni")}
            className="mt-2 text-[11px] sm:text-xs text-emerald-200/60 hover:text-amber-300 underline underline-offset-4 transition-colors cursor-pointer"
          >
            {language === "ur" ? "براہِ راست ویب سائٹ پر جائیں →" : "Continue to website directly →"}
          </button>
        </motion.div>
      </main>

      {/* Bottom Feature Badges */}
      <footer className="relative z-20 w-full px-4 sm:px-10 lg:px-14 pb-2.5 sm:pb-5 flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 text-[11px] sm:text-xs text-emerald-100/85 font-medium shrink-0">
        <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 shadow-sm">
          <CheckCircle className="w-3.5 h-3.5 text-amber-300" />
          <span>{language === "ur" ? "مستند اساتذہ" : "Qualified Teachers"}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 shadow-sm">
          <CheckCircle className="w-3.5 h-3.5 text-amber-300" />
          <span>{language === "ur" ? "انفرادی کلاسز" : "1-on-1 Lessons"}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 shadow-sm">
          <CheckCircle className="w-3.5 h-3.5 text-amber-300" />
          <span>{language === "ur" ? "لچکدار اوقات" : "Flexible Scheduling"}</span>
        </div>
      </footer>
    </motion.div>
  );
}
