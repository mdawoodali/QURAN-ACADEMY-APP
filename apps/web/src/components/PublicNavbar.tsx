"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Menu, X } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

export default function PublicNavbar() {
  const { language, setLanguage, t, dir } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="w-full bg-[#052b20]/90 backdrop-blur-md sticky top-0 z-50 border-b border-white/10 text-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Brand Crest */}
        <Link href="/" onClick={closeMenu} className="flex items-center gap-3 shrink-0">
          <div className="bg-emerald-800/90 border border-amber-400/40 p-2 rounded-xl text-amber-300 shadow-sm">
            <BookOpen size={22} />
          </div>
          <span className="font-serif font-bold text-lg sm:text-xl text-white tracking-tight">
            {t("brand")}
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7 text-emerald-100/90 font-medium text-sm">
          <Link href="/programmes" className="hover:text-amber-300 transition">
            {t("programmes")}
          </Link>
          <Link href="/how-it-works" className="hover:text-amber-300 transition">
            {t("howItWorks")}
          </Link>
          <Link href="/packages" className="hover:text-amber-300 transition">
            {t("packages")}
          </Link>
          <Link href="/student/progress" className="hover:text-amber-300 transition">
            {t("studentPortal")}
          </Link>
          <Link href="/teach-with-us" className="hover:text-amber-300 transition">
            {t("teachWithUs")}
          </Link>
        </nav>
        
        {/* Desktop Action Buttons */}
        <div className="hidden lg:flex items-center gap-5">
          {/* Active EN / UR Toggle Switcher */}
          <div className="flex items-center gap-1 text-xs font-bold bg-black/40 p-1 rounded-full border border-white/15">
            <button 
              onClick={() => setLanguage("en")}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                language === "en" 
                  ? "bg-amber-400 text-emerald-950 shadow-xs font-bold" 
                  : "text-emerald-100/70 hover:text-white"
              }`}
            >
              EN
            </button>
            <button 
              onClick={() => setLanguage("ur")}
              className={`px-3 py-1 rounded-full transition-all font-urdu text-sm cursor-pointer ${
                language === "ur" 
                  ? "bg-amber-400 text-emerald-950 shadow-xs font-bold" 
                  : "text-emerald-100/70 hover:text-white"
              }`}
            >
              اردو
            </button>
          </div>

          <Link href="/login" className="text-sm font-bold text-amber-300 hover:text-amber-200 transition">
            {t("login")}
          </Link>
          <Link 
            href="/trial" 
            className="bg-amber-400 hover:bg-amber-300 text-emerald-950 text-sm font-bold px-5 py-2.5 rounded-full transition shadow-md"
          >
            {t("bookFreeTrial")}
          </Link>
        </div>

        {/* Mobile Actions: Language Switcher + Hamburger Menu Button */}
        <div className="flex lg:hidden items-center gap-3">
          {/* Quick Language Toggle on Mobile */}
          <div className="flex items-center gap-0.5 text-xs font-bold bg-black/40 p-0.5 rounded-full border border-white/15">
            <button 
              onClick={() => setLanguage("en")}
              className={`px-2 py-0.5 rounded-full text-xs transition-all ${
                language === "en" 
                  ? "bg-amber-400 text-emerald-950 font-bold" 
                  : "text-emerald-100/70"
              }`}
            >
              EN
            </button>
            <button 
              onClick={() => setLanguage("ur")}
              className={`px-2 py-0.5 rounded-full font-urdu text-xs transition-all ${
                language === "ur" 
                  ? "bg-amber-400 text-emerald-950 font-bold" 
                  : "text-emerald-100/70"
              }`}
            >
              اردو
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white hover:text-amber-300 focus:outline-none transition rounded-xl bg-white/10 border border-white/15"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Animated Dropdown Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden border-t border-white/10 bg-black/90 backdrop-blur-xl overflow-hidden shadow-2xl"
          >
            <div className="px-6 py-6 space-y-4">
              <nav className="flex flex-col space-y-3 font-medium text-base text-emerald-100/90">
                <Link 
                  href="/programmes" 
                  onClick={closeMenu}
                  className="py-2 px-3 rounded-xl hover:bg-white/10 hover:text-amber-300 transition"
                >
                  {t("programmes")}
                </Link>
                <Link 
                  href="/how-it-works" 
                  onClick={closeMenu}
                  className="py-2 px-3 rounded-xl hover:bg-white/10 hover:text-amber-300 transition"
                >
                  {t("howItWorks")}
                </Link>
                <Link 
                  href="/packages" 
                  onClick={closeMenu}
                  className="py-2 px-3 rounded-xl hover:bg-white/10 hover:text-amber-300 transition"
                >
                  {t("packages")}
                </Link>
                <Link 
                  href="/student/progress" 
                  onClick={closeMenu}
                  className="py-2 px-3 rounded-xl hover:bg-white/10 hover:text-amber-300 transition"
                >
                  {t("studentPortal")}
                </Link>
                <Link 
                  href="/teach-with-us" 
                  onClick={closeMenu}
                  className="py-2 px-3 rounded-xl hover:bg-white/10 hover:text-amber-300 transition"
                >
                  {t("teachWithUs")}
                </Link>
              </nav>

              <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                <Link 
                  href="/login" 
                  onClick={closeMenu}
                  className="w-full text-center py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/15 transition"
                >
                  {t("login")}
                </Link>
                <Link 
                  href="/trial" 
                  onClick={closeMenu}
                  className="w-full text-center py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-sm shadow-lg transition"
                >
                  {t("bookFreeTrial")}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
