"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Mail } from "lucide-react";
import { useLanguage, TranslationKey } from "./LanguageContext";
import { useSect } from "./SectContext";
import { motion, AnimatePresence } from "framer-motion";

export default function PublicNavbar() {
  const { language, setLanguage, t } = useLanguage();
  const { setSect, isSunni, isShia } = useSect();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header dir="ltr" className="w-full sticky top-0 z-50 text-white shadow-xl relative text-left">
      {/* 1. TOP BAR: Contact / WhatsApp Badges & Email & Socials */}
      <div className="w-full bg-[#021811]/95 border-b border-white/10 text-xs text-emerald-100/90 py-3.5 px-4 sm:px-6 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          

          {/* Center: Contact & WhatsApp Badges & Email */}
          <div className="flex-1 flex flex-wrap items-center justify-start lg:justify-center gap-3 sm:gap-5 text-[11px] sm:text-xs">
            <a
              href="https://wa.me/+13305975880"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-amber-300 transition font-semibold whitespace-nowrap"
            >
              <WhatsAppTopIcon className="w-3.5 h-3.5 fill-amber-400 shrink-0" />
              <span dir="ltr" className="font-sans">{t("topBarUsa")}</span>
            </a>

            <span className="text-white/20 hidden sm:inline">|</span>

            <a
              href="https://wa.me/+442032899880"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-amber-300 transition font-semibold whitespace-nowrap"
            >
              <WhatsAppTopIcon className="w-3.5 h-3.5 fill-amber-400 shrink-0" />
              <span dir="ltr" className="font-sans">{t("topBarUk")}</span>
            </a>

            <span className="text-white/20 hidden md:inline">|</span>

            <a
              href="mailto:info@quranlearnacademy.com"
              className="hidden md:flex items-center gap-1.5 hover:text-amber-300 transition whitespace-nowrap"
            >
              <Mail size={13} className="text-amber-400 shrink-0" />
              <span dir="ltr" className="font-sans">{t("topBarEmail")}</span>
            </a>
          </div>

          {/* Right: Social Media & Language Switcher (pushed far right) */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="hidden sm:flex items-center gap-3 text-emerald-100/70">
              <a
                href="https://www.facebook.com/quranlearnacademy/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-amber-300 transition"
              >
                <FacebookTopIcon className="w-3.5 h-3.5 fill-current" />
              </a>
              <a
                href="https://www.instagram.com/quranlearnacademy/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-amber-300 transition"
              >
                <InstagramTopIcon className="w-3.5 h-3.5 fill-current" />
              </a>
              <a
                href="https://www.linkedin.com/company/quran-learn-academy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:text-amber-300 transition"
              >
                <LinkedInTopIcon className="w-3.5 h-3.5 fill-current" />
              </a>
            </div>

            {/* Desktop Sect Switcher: Sunni / Shia */}
            <div className="flex items-center gap-1 text-[11px] font-bold bg-black/40 p-0.5 rounded-full border border-white/15 shadow-sm">
              <button 
                onClick={() => setSect("sunni")}
                title="Sunni Portal & Curriculum"
                className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                  isSunni 
                    ? "bg-amber-400 text-emerald-950 font-bold shadow-xs" 
                    : "text-emerald-100/70 hover:text-white"
                }`}
              >
                Sunni
              </button>
              <button 
                onClick={() => setSect("shia")}
                title="Shia Portal & Classical Library"
                className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                  isShia 
                    ? "bg-amber-400 text-emerald-950 font-bold shadow-xs" 
                    : "text-emerald-100/70 hover:text-white"
                }`}
              >
                Shia
              </button>
            </div>

            {/* Desktop / Global Language Toggle Switcher */}
            <div className="flex items-center gap-1 text-[11px] font-bold bg-black/40 p-0.5 rounded-full border border-white/15">
              <button 
                onClick={() => setLanguage("en")}
                className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                  language === "en" 
                    ? "bg-amber-400 text-emerald-950 font-bold shadow-xs" 
                    : "text-emerald-100/70 hover:text-white"
                }`}
              >
                EN
              </button>
              <button 
                onClick={() => setLanguage("ur")}
                className={`px-2.5 py-0.5 rounded-full transition-all font-urdu text-xs cursor-pointer ${
                  language === "ur" 
                    ? "bg-amber-400 text-emerald-950 font-bold shadow-xs" 
                    : "text-emerald-100/70 hover:text-white"
                }`}
              >
                اردو
              </button>
            </div>
          </div>


        </div>
      </div>

      {/* 2. MAIN NAVIGATION BAR: Just Below Top Bar */}
      <div className="w-full bg-[#052b20]/95 backdrop-blur-md border-b border-white/10 relative">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-20 sm:h-22 flex items-center justify-between gap-4">
          
          {/* Brand Official Logo: Elegantly proportioned and aligned within navbar */}
          <Link 
            href="/" 
            onClick={closeMenu} 
            className="flex items-center shrink-0 group py-1"
            title="Quran Learn Academy"
          >
            <div className="relative w-13 h-13 sm:w-14 sm:h-14 lg:w-16 lg:h-16 shrink-0 drop-shadow-[0_4px_12px_rgba(0,0,0,0.45)] transition-transform duration-200 group-hover:scale-105">
              <Image 
                src="/logo_quran_learn_academy.png" 
                alt="Quran Learn Academy Logo" 
                width={64}
                height={64}
                className="w-full h-full object-contain"
                priority
              />
            </div>
          </Link>

          
          {/* Desktop Navigation Links (Centered horizontally in the main bar, font size 16px with ornamental expanding line hover effect) */}
          <nav className="hidden lg:flex items-center justify-center gap-3.5 xl:gap-5 2xl:gap-6 text-emerald-100/90 font-medium text-base whitespace-nowrap flex-1 px-2">
            {[
              { href: "/", key: "home" },
              { href: "/about-us", key: "aboutUs" },
              { href: "/programmes", key: "ourServices" },
              { href: "/packages", key: "packages" },
              { href: "/payments", key: "payments" },
              { href: "/teach-with-us", key: "careers" },
              { href: "/resources", key: "resources" },
              { href: "/blog", key: "blog" },
              { href: "/contact", key: "contact" },
            ].map(({ href, key }) => (
              <Link
                key={key}
                href={href}
                className="group relative py-2 hover:text-amber-300 transition-colors duration-200 flex flex-col items-center"
              >
                <span>{t(key as TranslationKey)}</span>

                {/* Ornamental expanding line: originates from center and extends left and right with amber bead accent */}
                <span className="absolute bottom-0 left-0 right-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {/* Left extending wing */}
                  <span className="h-[2px] bg-gradient-to-l from-amber-400 to-amber-300/40 w-0 group-hover:w-1/2 transition-all duration-300 ease-out origin-right rounded-full" />
                  
                  {/* Center ornamental golden bead trio matching the reference */}
                  <span className="flex items-center gap-[2px] px-1 scale-0 group-hover:scale-100 transition-transform duration-300 ease-out">
                    <span className="w-1 h-1 rounded-full bg-amber-400/70 shrink-0" />
                    <span className="w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.9)] shrink-0" />
                    <span className="w-1 h-1 rounded-full bg-amber-400/70 shrink-0" />
                  </span>

                  {/* Right extending wing */}
                  <span className="h-[2px] bg-gradient-to-r from-amber-400 to-amber-300/40 w-0 group-hover:w-1/2 transition-all duration-300 ease-out origin-left rounded-full" />
                </span>
              </Link>
            ))}
          </nav>


          {/* Action CTAs: Log in & Book a free trial (Right edge aligned) */}
          <div className="hidden lg:flex items-center gap-5 shrink-0">
            {/* Log in with ornamental expanding line hover effect */}
            <Link
              href="/login"
              className="group relative py-2 text-sm font-bold text-amber-300 hover:text-amber-200 transition-colors flex flex-col items-center"
            >
              <span>{t("login")}</span>
              <span className="absolute bottom-0 left-0 right-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span className="h-[2px] bg-gradient-to-l from-amber-400 to-amber-300/40 w-0 group-hover:w-1/2 transition-all duration-300 ease-out origin-right rounded-full" />
                <span className="flex items-center gap-[2px] px-1 scale-0 group-hover:scale-100 transition-transform duration-300 ease-out">
                  <span className="w-1 h-1 rounded-full bg-amber-400/70 shrink-0" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.9)] shrink-0" />
                  <span className="w-1 h-1 rounded-full bg-amber-400/70 shrink-0" />
                </span>
                <span className="h-[2px] bg-gradient-to-r from-amber-400 to-amber-300/40 w-0 group-hover:w-1/2 transition-all duration-300 ease-out origin-left rounded-full" />
              </span>
            </Link>

            {/* Book a free trial: Yellow box turns green on hover and text turns white */}
            <Link 
              href="/trial" 
              className="bg-amber-400 hover:bg-emerald-700 text-emerald-950 hover:text-white border border-transparent hover:border-emerald-500/50 text-sm font-bold px-5 py-2.5 rounded-full transition-all duration-300 shadow-md whitespace-nowrap pop-hover"
            >
              {t("bookFreeTrial")}
            </Link>
          </div>




          {/* Mobile Actions: Hamburger Menu Toggle Button */}
          <div className="flex lg:hidden items-center gap-3">
            <Link 
              href="/trial" 
              className="bg-amber-400 hover:bg-amber-300 text-emerald-950 text-xs font-bold px-3 py-1.5 rounded-full transition shadow-sm"
            >
              {t("bookFreeTrial")}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white hover:text-amber-300 focus:outline-none transition rounded-xl bg-white/10 border border-white/15"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
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
            className="lg:hidden border-t border-white/10 bg-black/95 backdrop-blur-xl overflow-hidden shadow-2xl max-h-[calc(100vh-6rem)] overflow-y-auto"
          >
            <div className="px-6 py-6 space-y-4">
              <nav className="flex flex-col space-y-2 font-medium text-sm text-emerald-100/90">
                <Link 
                  href="/" 
                  onClick={closeMenu}
                  className="py-2 px-3 rounded-xl hover:bg-white/10 hover:text-amber-300 transition"
                >
                  {t("home")}
                </Link>
                <Link 
                  href="/about-us" 
                  onClick={closeMenu}
                  className="py-2 px-3 rounded-xl hover:bg-white/10 hover:text-amber-300 transition"
                >
                  {t("aboutUs")}
                </Link>
                <Link 
                  href="/programmes" 
                  onClick={closeMenu}
                  className="py-2 px-3 rounded-xl hover:bg-white/10 hover:text-amber-300 transition"
                >
                  {t("ourServices")}
                </Link>
                <Link 
                  href="/packages" 
                  onClick={closeMenu}
                  className="py-2 px-3 rounded-xl hover:bg-white/10 hover:text-amber-300 transition"
                >
                  {t("packages")}
                </Link>
                <Link 
                  href="/payments" 
                  onClick={closeMenu}
                  className="py-2 px-3 rounded-xl hover:bg-white/10 hover:text-amber-300 transition"
                >
                  {t("payments")}
                </Link>
                <Link 
                  href="/teach-with-us" 
                  onClick={closeMenu}
                  className="py-2 px-3 rounded-xl hover:bg-white/10 hover:text-amber-300 transition"
                >
                  {t("careers")}
                </Link>
                <Link 
                  href="/resources" 
                  onClick={closeMenu}
                  className="py-2 px-3 rounded-xl hover:bg-white/10 hover:text-amber-300 transition"
                >
                  {t("resources")}
                </Link>
                <Link 
                  href="/blog" 
                  onClick={closeMenu}
                  className="py-2 px-3 rounded-xl hover:bg-white/10 hover:text-amber-300 transition"
                >
                  {t("blog")}
                </Link>
                <Link 
                  href="/contact" 
                  onClick={closeMenu}
                  className="py-2 px-3 rounded-xl hover:bg-white/10 hover:text-amber-300 transition"
                >
                  {t("contact")}
                </Link>
              </nav>

              {/* Mobile Sect & Language Toggle */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1 text-xs font-bold bg-white/10 p-1 rounded-xl border border-white/15 w-full justify-center">
                  <button 
                    onClick={() => setSect("sunni")}
                    className={`flex-1 py-1.5 rounded-lg text-center transition ${
                      isSunni ? "bg-amber-400 text-emerald-950 font-bold" : "text-emerald-100/75"
                    }`}
                  >
                    Sunni
                  </button>
                  <button 
                    onClick={() => setSect("shia")}
                    className={`flex-1 py-1.5 rounded-lg text-center transition ${
                      isShia ? "bg-amber-400 text-emerald-950 font-bold" : "text-emerald-100/75"
                    }`}
                  >
                    Shia
                  </button>
                </div>
              </div>

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

              {/* Mobile Contact Shortcuts */}
              <div className="pt-4 border-t border-white/10 text-xs text-emerald-100/70 space-y-2">
                <a href="https://wa.me/+13305975880" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-amber-300">
                  <WhatsAppTopIcon className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{t("topBarUsa")}</span>
                </a>
                <a href="https://wa.me/+442032899880" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-amber-300">
                  <WhatsAppTopIcon className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{t("topBarUk")}</span>
                </a>
                <a href="mailto:info@quranlearnacademy.com" className="flex items-center gap-2 hover:text-amber-300">
                  <Mail size={13} className="text-amber-400" />
                  <span>{t("topBarEmail")}</span> • <span className="font-mono text-amber-300">v1.1.0</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// Icons for Top Bar
function WhatsAppTopIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.031 2C6.513 2 2.022 6.49 2.022 12.008c0 1.83.493 3.547 1.348 5.032L2 22l5.12-1.343a9.98 9.98 0 004.911 1.282c5.518 0 10.01-4.49 10.01-10.008C22.041 6.49 17.549 2 12.031 2zm0 18.258a8.21 8.21 0 01-4.187-1.144l-.3-.178-3.111.816.83-3.031-.195-.31a8.214 8.214 0 01-1.272-4.403c0-4.544 3.7-8.243 8.235-8.243 4.536 0 8.236 3.699 8.236 8.243 0 4.545-3.7 8.25-8.236 8.25zm4.516-6.177c-.247-.124-1.464-.722-1.691-.805-.227-.082-.392-.124-.557.124-.165.247-.639.805-.783.97-.145.165-.289.186-.536.062-.248-.124-1.045-.385-1.99-1.229-.737-.656-1.234-1.467-1.379-1.714-.144-.247-.015-.38.109-.504.111-.111.248-.289.371-.433.124-.144.165-.247.247-.412.083-.165.042-.31-.02-.433-.063-.124-.558-1.345-.764-1.841-.201-.484-.405-.418-.557-.426-.144-.008-.31-.01-.475-.01s-.433.062-.66.31c-.227.247-.866.847-.866 2.065 0 1.218.887 2.395 1.011 2.56.124.165 1.745 2.665 4.228 3.738.591.255 1.053.407 1.413.522.594.189 1.134.162 1.562.098.477-.071 1.464-.599 1.67-1.177.206-.578.206-1.074.144-1.177-.062-.103-.227-.165-.474-.289z" />
    </svg>
  );
}

function FacebookTopIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramTopIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function LinkedInTopIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}
