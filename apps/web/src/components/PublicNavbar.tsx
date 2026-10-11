"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { useLanguage } from "./LanguageContext";

export default function PublicNavbar() {
  const { language, setLanguage, t, dir } = useLanguage();

  return (
    <header className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-[var(--color-line)]">
      <div className="max-w-[1280px] mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-[var(--color-green-900)] p-2 rounded-xl text-white">
            <BookOpen size={24} />
          </div>
          <span className="font-serif font-bold text-xl text-[var(--color-green-900)] tracking-tight">
            {t("brand")}
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 text-[var(--color-ink)] font-medium text-sm">
          <Link href="/programmes" className="hover:text-[var(--color-green-600)] transition">
            {t("programmes")}
          </Link>
          <Link href="/how-it-works" className="hover:text-[var(--color-green-600)] transition">
            {t("howItWorks")}
          </Link>
          <Link href="/packages" className="hover:text-[var(--color-green-600)] transition">
            {t("packages")}
          </Link>
          <Link href="/student/progress" className="hover:text-[var(--color-green-600)] transition">
            {t("studentPortal")}
          </Link>
          <Link href="/teach-with-us" className="hover:text-[var(--color-green-600)] transition">
            {t("teachWithUs")}
          </Link>
        </nav>
        
        <div className="flex items-center gap-6">
          {/* Active EN / UR Toggle Switcher */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold bg-gray-100 p-1 rounded-full border border-gray-200">
            <button 
              onClick={() => setLanguage("en")}
              className={`px-2.5 py-1 rounded-full transition-all ${
                language === "en" 
                  ? "bg-[#0C4A3A] text-white shadow-xs" 
                  : "text-gray-600 hover:text-black"
              }`}
            >
              EN
            </button>
            <button 
              onClick={() => setLanguage("ur")}
              className={`px-2.5 py-1 rounded-full transition-all font-urdu text-sm ${
                language === "ur" 
                  ? "bg-[#0C4A3A] text-white shadow-xs" 
                  : "text-gray-600 hover:text-black"
              }`}
            >
              اردو
            </button>
          </div>

          <Link href="/login" className="hidden sm:block text-sm font-bold text-[var(--color-green-600)] hover:text-[var(--color-green-900)]">
            {t("login")}
          </Link>
          <Link href="/trial" className="bg-[var(--color-green-600)] hover:bg-[var(--color-green-900)] text-white text-sm font-bold px-6 py-2.5 rounded-full transition shadow-sm">
            {t("bookFreeTrial")}
          </Link>
        </div>
      </div>
    </header>
  );
}
