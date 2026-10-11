"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { useLanguage } from "./LanguageContext";

export default function PublicNavbar() {
  const { language, setLanguage, t, dir } = useLanguage();

  return (
    <header className="w-full bg-[#052b20]/85 backdrop-blur-md sticky top-0 z-50 border-b border-white/10 text-white">
      <div className="max-w-[1280px] mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-emerald-800 p-2 rounded-xl text-amber-300">
            <BookOpen size={24} />
          </div>
          <span className="font-serif font-bold text-xl text-white tracking-tight">
            {t("brand")}
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 text-emerald-100/90 font-medium text-sm">
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
        
        <div className="flex items-center gap-6">
          {/* Active EN / UR Toggle Switcher */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold bg-black/40 p-1 rounded-full border border-white/15">
            <button 
              onClick={() => setLanguage("en")}
              className={`px-2.5 py-1 rounded-full transition-all ${
                language === "en" 
                  ? "bg-amber-400 text-emerald-950 shadow-xs" 
                  : "text-emerald-100/70 hover:text-white"
              }`}
            >
              EN
            </button>
            <button 
              onClick={() => setLanguage("ur")}
              className={`px-2.5 py-1 rounded-full transition-all font-urdu text-sm ${
                language === "ur" 
                  ? "bg-amber-400 text-emerald-950 shadow-xs" 
                  : "text-emerald-100/70 hover:text-white"
              }`}
            >
              اردو
            </button>
          </div>

          <Link href="/login" className="hidden sm:block text-sm font-bold text-amber-300 hover:text-amber-200">
            {t("login")}
          </Link>
          <Link href="/trial" className="bg-amber-400 hover:bg-amber-300 text-emerald-950 text-sm font-bold px-6 py-2.5 rounded-full transition shadow-md">
            {t("bookFreeTrial")}
          </Link>
        </div>
      </div>
    </header>
  );
}
