import Link from "next/link";
import { BookOpen, Home, GraduationCap, Calendar, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#021811] text-white flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Subtle ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full text-center">
        {/* Brand Crest */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-amber-300 font-medium mb-6">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Quran Academy</span>
        </div>

        {/* 404 Large Display */}
        <h1 className="text-7xl sm:text-8xl font-serif font-bold text-amber-300 tracking-tight mb-2">
          404
        </h1>
        <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-white mb-3">
          Page Not Found
        </h2>
        <p className="text-emerald-100/75 text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto">
          The page you are looking for may have moved, been renamed, or is temporarily unavailable. Let us guide you back on track.
        </p>

        {/* Quick Nav Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-left">
          <Link
            href="/"
            className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/40 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-900/80 text-amber-300 flex items-center justify-center shrink-0">
              <Home className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                Homepage
              </div>
              <div className="text-xs text-emerald-200/60 truncate">
                Return to the main overview
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all" />
          </Link>

          <Link
            href="/programmes"
            className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/40 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-900/80 text-amber-300 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                Programmes
              </div>
              <div className="text-xs text-emerald-200/60 truncate">
                Explore Qaida, Tajweed & Hifz
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all" />
          </Link>

          <Link
            href="/trial"
            className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/40 transition-all group sm:col-span-2"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                Book a Free Evaluation Trial
              </div>
              <div className="text-xs text-emerald-200/60 truncate">
                Schedule a 30-minute 1-on-1 assessment with a certified teacher
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all" />
          </Link>
        </div>

        {/* Support Link */}
        <p className="text-xs text-emerald-200/50">
          Need assistance?{" "}
          <Link href="/contact" className="text-amber-300 hover:underline font-medium">
            Contact our student support team
          </Link>
        </p>
      </div>
    </div>
  );
}
