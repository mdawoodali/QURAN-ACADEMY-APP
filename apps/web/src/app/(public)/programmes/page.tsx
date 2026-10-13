"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  BookOpen,
  Sparkles,
  HeartHandshake,
  Users,
  GraduationCap,
  Clock,
  Award,
  ArrowRight,
  ShieldCheck,
  Search,
} from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { ACADEMY_SERVICES } from "@/data/services";

function getServiceIcon(iconName: string) {
  switch (iconName) {
    case "BookOpen":
      return <BookOpen size={22} />;
    case "Sparkles":
      return <Sparkles size={22} />;
    case "HeartHandshake":
      return <HeartHandshake size={22} />;
    case "Users":
      return <Users size={22} />;
    case "GraduationCap":
      return <GraduationCap size={22} />;
    case "Award":
      return <Award size={22} />;
    case "Clock":
    default:
      return <Clock size={22} />;
  }
}

export default function ProgrammesPage() {
  const { t } = useLanguage();
  const [filterQuery, setFilterQuery] = useState("");

  const filteredServices = ACADEMY_SERVICES.filter(
    (srv) =>
      srv.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      srv.description.toLowerCase().includes(filterQuery.toLowerCase()) ||
      srv.badge.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <main className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-10 md:py-20 text-white">
      {/* Page Header */}
      <div className="text-center mb-10 md:mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-800/80 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-semibold mb-4 shadow-sm">
          <GraduationCap size={16} />
          <span>Our Curated Quranic Curriculum</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-4 leading-tight">
          Our <span className="text-amber-300">Services & Courses</span>
        </h1>
        <p className="text-emerald-100/85 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          Explore all 7 specialized 1-on-1 online Quran courses designed for kids, sisters, and brothers worldwide with certified native tutors.
        </p>
      </div>

      {/* Quick Search Bar */}
      <div className="max-w-md mx-auto mb-12">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-300/60" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Search by course name or topic..."
            className="w-full bg-black/40 border border-white/20 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 transition"
          />
        </div>
      </div>

      {/* Services Grid (All 7 Courses) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
        {filteredServices.map((srv) => (
          <div
            key={srv.id}
            className="glass-container rounded-3xl p-6 sm:p-7 border border-white/15 shadow-xl flex flex-col justify-between pop-hover group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-amber-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30">
                  {srv.badge}
                </span>
                <div className="w-11 h-11 rounded-xl bg-emerald-800/80 border border-amber-400/30 flex items-center justify-center text-amber-300 group-hover:scale-110 group-hover:border-amber-400 transition-all duration-300 shrink-0">
                  {getServiceIcon(srv.iconName)}
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold font-serif text-white mb-2 leading-snug group-hover:text-amber-300 transition-colors">
                {srv.title}
              </h2>
              <p className="text-amber-200/90 text-xs font-semibold mb-3">
                {srv.subtitle}
              </p>

              <p className="text-emerald-100/80 text-sm leading-relaxed mb-5">
                {srv.description}
              </p>

              <div className="space-y-2 pt-3 border-t border-white/10 mb-5">
                <span className="text-xs uppercase tracking-wider text-amber-400/90 font-bold block mb-1.5">
                  Curriculum Highlights:
                </span>
                {srv.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-2 text-xs sm:text-[13px] text-emerald-100/90">
                    <Check className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
              <span className="text-xs text-emerald-200/80 font-medium">
                {srv.duration}
              </span>
              <Link
                href="/trial"
                className="bg-amber-400 hover:bg-amber-300 text-emerald-950 px-4 py-2 rounded-xl text-xs font-bold transition shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <span>Free Trial</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Course Assurance Banner */}
      <div className="glass-container rounded-3xl p-8 border border-white/15 max-w-4xl mx-auto shadow-2xl flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left pop-hover">
        <div className="w-16 h-16 rounded-2xl bg-emerald-800/90 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0 shadow-lg">
          <ShieldCheck size={32} />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-serif font-bold text-white mb-1">
            Not sure which course fits best?
          </h3>
          <p className="text-emerald-100/80 text-sm leading-relaxed">
            Our academic coordinator assesses each student’s current recitation level during the 1-on-1 free trial class and tailors the course roadmap accordingly.
          </p>
        </div>
        <Link
          href="/trial"
          className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold px-6 py-3 rounded-full transition shadow-md text-sm whitespace-nowrap cursor-pointer"
        >
          {t("bookFreeTrial")}
        </Link>
      </div>
    </main>
  );
}
