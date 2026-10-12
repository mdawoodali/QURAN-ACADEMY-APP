"use client";

import Link from "next/link";
import { BookOpen, Users, Clock, Award, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

export default function AboutUsPage() {
  const { t } = useLanguage();

  return (
    <main className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-12 md:py-20 text-white">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-800/80 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-semibold mb-4">
          <BookOpen size={16} />
          <span>Quran Learn Academy</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-6 leading-tight">
          {t("aboutUs")}
        </h1>
        <p className="text-emerald-100/85 text-base sm:text-lg leading-relaxed">
          {t("footerDesc")}
        </p>
      </div>

      {/* Main Glassmorphic Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center mb-16">
        <div className="glass-container rounded-3xl p-8 sm:p-10 border border-white/15 shadow-2xl">
          <span className="text-amber-400 font-bold text-sm uppercase tracking-wider block mb-2">Our Mission</span>
          <h2 className="text-2xl sm:text-3xl font-serif text-white mb-5">
            Spreading the Light of the Holy Quran Globally
          </h2>
          <p className="text-emerald-100/80 leading-relaxed text-sm sm:text-base mb-6">
            We welcome everyone to learn the teachings of the holy Quran and the commandments of Islam irrespective of race, colour, or background. We aim to make every student understand and follow the basic principles of our faith to nurture a stronger Ummah and a better world.
          </p>
          <div className="space-y-3.5">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={18} className="text-amber-400 shrink-0" />
              <span className="text-emerald-100 text-sm font-medium">Easy to understand learning process</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 size={18} className="text-amber-400 shrink-0" />
              <span className="text-emerald-100 text-sm font-medium">Equal attention to every single student</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 size={18} className="text-amber-400 shrink-0" />
              <span className="text-emerald-100 text-sm font-medium">Timings and schedules that suit you</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 size={18} className="text-amber-400 shrink-0" />
              <span className="text-emerald-100 text-sm font-medium">Dedicated one-to-one interactive sessions</span>
            </div>
          </div>
        </div>

        {/* 4 Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="glass-container rounded-2xl p-6 border border-white/15 shadow-lg">
            <div className="w-12 h-12 bg-emerald-800/80 border border-amber-400/40 rounded-xl flex items-center justify-center text-amber-300 mb-4 shadow-sm">
              <Users size={24} />
            </div>
            <h3 className="font-serif font-bold text-lg text-white mb-2">Certified Tutors</h3>
            <p className="text-xs sm:text-sm text-emerald-100/70 leading-relaxed">
              Native Arabic and bilingual certified tutors with Ijazah and years of dedicated teaching experience.
            </p>
          </div>

          <div className="glass-container rounded-2xl p-6 border border-white/15 shadow-lg">
            <div className="w-12 h-12 bg-emerald-800/80 border border-amber-400/40 rounded-xl flex items-center justify-center text-amber-300 mb-4 shadow-sm">
              <Clock size={24} />
            </div>
            <h3 className="font-serif font-bold text-lg text-white mb-2">24/7 Scheduling</h3>
            <p className="text-xs sm:text-sm text-emerald-100/70 leading-relaxed">
              Classes available around the clock to accommodate students across US, UK, Europe, and Asia timezones.
            </p>
          </div>

          <div className="glass-container rounded-2xl p-6 border border-white/15 shadow-lg">
            <div className="w-12 h-12 bg-emerald-800/80 border border-amber-400/40 rounded-xl flex items-center justify-center text-amber-300 mb-4 shadow-sm">
              <Award size={24} />
            </div>
            <h3 className="font-serif font-bold text-lg text-white mb-2">Tajweed Mastery</h3>
            <p className="text-xs sm:text-sm text-emerald-100/70 leading-relaxed">
              Comprehensive word-by-word pronunciation, Makharij training, and recitation rules.
            </p>
          </div>

          <div className="glass-container rounded-2xl p-6 border border-white/15 shadow-lg">
            <div className="w-12 h-12 bg-emerald-800/80 border border-amber-400/40 rounded-xl flex items-center justify-center text-amber-300 mb-4 shadow-sm">
              <BookOpen size={24} />
            </div>
            <h3 className="font-serif font-bold text-lg text-white mb-2">Modern Classroom</h3>
            <p className="text-xs sm:text-sm text-emerald-100/70 leading-relaxed">
              Synchronized digital Mushaf, real-time voice follow highlighting, and teacher whiteboard tools.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="glass-container rounded-3xl p-8 sm:p-12 text-center border border-white/15 max-w-3xl mx-auto shadow-2xl">
        <h3 className="text-2xl sm:text-3xl font-serif text-white mb-4">
          Ready to Begin Your Quranic Journey?
        </h3>
        <p className="text-emerald-100/80 text-sm sm:text-base mb-8">
          Join thousands of students learning Quran with Tajweed online. Start with a zero-commitment free trial class.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/trial"
            className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold px-8 py-3.5 rounded-full transition shadow-lg text-base"
          >
            {t("bookFreeTrial")}
          </Link>
          <Link
            href="/programmes"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-8 py-3.5 rounded-full transition text-base"
          >
            {t("ourServices")}
          </Link>
        </div>
      </div>
    </main>
  );
}
