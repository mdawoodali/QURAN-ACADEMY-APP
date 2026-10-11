"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "./LanguageContext";

interface WelcomeSplashProps {
  onGetStarted: () => void;
}

export default function WelcomeSplash({ onGetStarted }: WelcomeSplashProps) {
  const { language, setLanguage, t } = useLanguage();
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
        scale: 1.06, 
        filter: "blur(8px)",
        transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } 
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#03150F] overflow-hidden select-none"
    >
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-emerald-600/20 via-teal-500/15 to-transparent rounded-full blur-[120px]" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-800/20 rounded-full blur-[100px]" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-800/20 rounded-full blur-[100px]" />
      </div>

      {/* Main Showcase Canvas (Phone Form Factor on Desktop, Fullscreen on Mobile) */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full h-full sm:h-[86vh] sm:max-h-[780px] sm:w-[390px] sm:rounded-[2.75rem] overflow-hidden shadow-2xl sm:shadow-emerald-950/80 sm:border sm:border-emerald-500/30 flex flex-col justify-between"
        style={{
          background: "linear-gradient(180deg, #105940 0%, #156E4F 35%, #186F51 65%, #0B3E2D 100%)",
        }}
      >
        {/* Subtle decorative glowing corner borders */}
        <div className="absolute inset-0 pointer-events-none border border-white/10 sm:rounded-[2.75rem]" />

        {/* Top Header: Language Switcher & Academy Tag */}
        <div className="relative z-20 flex items-center justify-between px-6 pt-7 sm:pt-6">
          <div className="flex items-center gap-1.5 text-emerald-100/80 text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Quran Academy</span>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-black/25 backdrop-blur-md p-1 rounded-full border border-white/10 text-xs">
            <button
              onClick={() => setLanguage("en")}
              className={`px-2.5 py-0.5 rounded-full transition-all font-bold ${
                language === "en" 
                  ? "bg-amber-400 text-emerald-950 shadow-xs" 
                  : "text-emerald-100/70 hover:text-white"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("ur")}
              className={`px-2.5 py-0.5 rounded-full transition-all font-urdu ${
                language === "ur" 
                  ? "bg-amber-400 text-emerald-950 shadow-xs" 
                  : "text-emerald-100/70 hover:text-white"
              }`}
            >
              اردو
            </button>
          </div>
        </div>

        {/* Center Artwork Canvas: High Fidelity Islamic Artwork */}
        <div className="relative flex-1 flex flex-col items-center justify-center px-6 -mt-2">
          {/* Main Visual Image matching the uploaded design */}
          <motion.div 
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="relative w-[85%] max-w-[270px] aspect-[9/15] rounded-3xl overflow-hidden shadow-2xl border border-emerald-300/20"
          >
            <Image
              src="/images/splash.png"
              alt="Quran Academy Welcome"
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 320px"
            />
            {/* Subtle Gradient Vignette to seamlessly blend with background */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B3E2D]/50 via-transparent to-[#105940]/30 pointer-events-none" />
          </motion.div>
        </div>

        {/* Bottom Section: Welcome Text & Get Started Button */}
        <div className="relative z-20 px-6 pb-9 sm:pb-8 flex flex-col items-center text-center">
          <p className="text-emerald-100/90 text-sm font-medium mb-5 max-w-[280px]">
            {language === "ur" 
              ? "قرآن کریم کی تلاوت اور تجوید کا جدید اور آسان پلیٹ فارم"
              : "Live Quran lessons with qualified teachers & real-time guidance."}
          </p>

          {/* Prominent "Get Started" CTA Button */}
          <motion.button
            onClick={handleStart}
            disabled={isExiting}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full max-w-[310px] py-4 px-6 rounded-full font-bold text-base flex items-center justify-center gap-3 text-emerald-950 shadow-xl transition-all duration-300 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #F9E79F 0%, #F4D03F 45%, #D4AC0D 100%)",
              boxShadow: "0 10px 25px -5px rgba(244, 208, 63, 0.45), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
            }}
          >
            <span className={language === "ur" ? "font-urdu text-lg" : "font-sans tracking-wide"}>
              {language === "ur" ? "شروع کریں" : "Get Started"}
            </span>
            <ArrowRight className="w-5 h-5 text-emerald-950 stroke-[2.5]" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
