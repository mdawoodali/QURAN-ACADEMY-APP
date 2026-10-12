"use client";

import Link from "next/link";
import { BookOpen, Users, Clock, Award, CheckCircle2, HeartHandshake, Globe2, ShieldCheck, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

export default function AboutUsPage() {
  const { t } = useLanguage();

  return (
    <main className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-12 md:py-20 text-white">
      {/* 1. Page Header & Introduction */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-800/80 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-semibold mb-4 shadow-sm">
          <BookOpen size={16} />
          <span>About Quran Learn Academy</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-6 leading-tight">
          About <span className="text-amber-300">Quran Learn Academy</span>
        </h1>
        <p className="text-emerald-100/90 text-base sm:text-lg leading-relaxed">
          An independent entity managed by a small group of dedicated professionals, welcoming all Muslims worldwide to master the holy Quran with proper Tajweed.
        </p>
      </div>

      {/* 2. Founding Mission & Word-by-Word Tajweed Core (From Reference URL) */}
      <div className="glass-container rounded-3xl p-8 sm:p-12 border border-white/15 shadow-2xl mb-12">
        <div className="max-w-4xl mx-auto">
          <span className="text-amber-400 font-bold text-xs sm:text-sm uppercase tracking-wider block mb-3">
            Our Purpose & Vision
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-white mb-6 leading-snug">
            Equal Attention & Comprehensive Word-by-Word Learning
          </h2>
          <div className="space-y-4 text-emerald-100/85 text-sm sm:text-base leading-relaxed">
            <p>
              Quran Learn Academy is an independent entity managed by a small group of dedicated professionals. We welcome everyone to learn the teachings of the holy Quran and the commandments of Islam irrespective of their race, colour, or cast. We aim to make every Muslim understand and follow the basic principles of our religion so as to ensure we can become a better Ummah as well as make this world a better place for everyone to live in.
            </p>
            <p>
              Our easy to understand Quran teaching process is a well thought out course with the objective of making our students learn tajweed Quran word by word in a comprehensive way. We give each and every one of our students equal attention to make sure everyone has a fair chance of learning the holy Quran irrespective of their learning speed.
            </p>
          </div>
        </div>
      </div>

      {/* Temporary bottom placeholder to be enhanced in subsequent commits */}
      <div className="glass-container rounded-3xl p-8 text-center border border-white/15 max-w-3xl mx-auto shadow-xl">
        <h3 className="text-xl sm:text-2xl font-serif text-white mb-4">
          Ready to Begin Your Quranic Journey?
        </h3>
        <Link
          href="/trial"
          className="inline-block bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold px-8 py-3.5 rounded-full transition shadow-lg text-sm sm:text-base"
        >
          {t("bookFreeTrial")}
        </Link>
      </div>
    </main>
  );
}
