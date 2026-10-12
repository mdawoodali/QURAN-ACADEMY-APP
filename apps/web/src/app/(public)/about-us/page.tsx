"use client";

import Link from "next/link";
import { BookOpen, Globe2, Home, Clock, HeartHandshake, Sparkles, MessageSquare, Laptop, UserCheck, ShieldCheck, UserCheck2, CalendarRange, GraduationCap, ArrowRight, CheckCircle2 } from "lucide-react";
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
      <div className="glass-container rounded-3xl p-8 sm:p-12 border border-white/15 shadow-2xl mb-10">
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

      {/* 3. Global Accessibility & Comfort of Home (From Reference URL) */}
      <div className="glass-container rounded-3xl p-8 sm:p-12 border border-white/15 shadow-2xl mb-10 bg-gradient-to-br from-black/50 via-emerald-950/40 to-black/50">
        <div className="max-w-4xl mx-auto">
          <span className="text-amber-400 font-bold text-xs sm:text-sm uppercase tracking-wider block mb-3">
            Solving Modern Challenges
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-white mb-6 leading-snug">
            Flexible Timings for Global Families & Diverse Routines
          </h2>
          <div className="space-y-4 text-emerald-100/85 text-sm sm:text-base leading-relaxed">
            <p>
              We at Quran Learn Academy understand that it can become difficult for a Muslim to attend regular Quranic classes in mosques or other Islamic centers in a country where Islam is not the religion of majority of the population. In addition to this, everybody has a different way of life depending upon their routine for work, study, or family setup.
            </p>
            <p>
              Keeping these things in mind, we have put in special efforts into creating our online Quranic classes so that everyone can take part in them at a time that suits them best. You can start your online Quran course from the comfort of your home, pick a timetable that suits you best, and begin this journey of learning the holy Quran right from the basics.
            </p>
            <p className="font-semibold text-amber-200/90 pt-1">
              It doesn’t matter whether you pick things quickly or are a slow learner, we aim to teach you tajweed Quran word by word as long as it takes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 mt-8 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-800/80 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
                <Globe2 size={20} />
              </div>
              <span className="text-sm font-semibold text-emerald-100">Overseas Friendly</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-800/80 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
                <Home size={20} />
              </div>
              <span className="text-sm font-semibold text-emerald-100">Comfort of Your Home</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-800/80 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
                <Clock size={20} />
              </div>
              <span className="text-sm font-semibold text-emerald-100">Personalized Schedules</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Moral Ethics & Islamic Way of Life (From Reference URL) */}
      <div className="glass-container rounded-3xl p-8 sm:p-12 border border-white/15 shadow-2xl mb-10">
        <div className="max-w-4xl mx-auto">
          <span className="text-amber-400 font-bold text-xs sm:text-sm uppercase tracking-wider block mb-3">
            Holistic Character Building
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-white mb-6 leading-snug">
            Building Moral Ethics & Teaching the Islamic Way of Life
          </h2>
          <div className="space-y-4 text-emerald-100/85 text-sm sm:text-base leading-relaxed">
            <p>
              As mentioned before, Quran Learn Academy is an independent organization which aims to help everyone who has a desire to learn Quran. In addition to this, our objectives also include building moral ethics of our students and teaching them about the Islamic way of life.
            </p>
            <p>
              With innovative one on one sessions from our expert Quran teachers, you will be learning how you can become a better Muslim and make your life exactly according to the commandments of Islam. With fluency in the English language, our teachers make the best use of one on one online sessions and teach you at a pace that matches exactly your learning ability.
            </p>
            <p>
              In the end, Quran Learn Academy aims to make everyone understand the teachings of the holy Quran through online Quranic sessions, with the comfort of their home, at a time that suits them best.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 mt-8 border-t border-white/10">
            <div className="glass-container rounded-2xl p-5 border border-white/10 text-center">
              <HeartHandshake size={28} className="mx-auto text-amber-300 mb-2" />
              <h4 className="font-serif font-bold text-white text-sm mb-1">Moral Ethics</h4>
              <p className="text-xs text-emerald-100/70">Nurturing Akhlaaq, honesty, and Islamic adab</p>
            </div>
            <div className="glass-container rounded-2xl p-5 border border-white/10 text-center">
              <Sparkles size={28} className="mx-auto text-amber-300 mb-2" />
              <h4 className="font-serif font-bold text-white text-sm mb-1">Islamic Lifestyle</h4>
              <p className="text-xs text-emerald-100/70">Living according to the Sunnah and Quran</p>
            </div>
            <div className="glass-container rounded-2xl p-5 border border-white/10 text-center">
              <MessageSquare size={28} className="mx-auto text-amber-300 mb-2" />
              <h4 className="font-serif font-bold text-white text-sm mb-1">English Fluency</h4>
              <p className="text-xs text-emerald-100/70">Clear bilingual communication for western learners</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Modern E-Learning Standard & Rigorous Staff Selection (From Reference URL) */}
      <div className="glass-container rounded-3xl p-8 sm:p-12 border border-white/15 shadow-2xl mb-10 bg-gradient-to-br from-black/50 via-emerald-950/40 to-black/50">
        <div className="max-w-4xl mx-auto">
          <span className="text-amber-400 font-bold text-xs sm:text-sm uppercase tracking-wider block mb-3">
            Teaching Excellence
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-white mb-6 leading-snug">
            Worldwide E-Learning Quality & Expert Staff Training
          </h2>
          <div className="space-y-4 text-emerald-100/85 text-sm sm:text-base leading-relaxed">
            <p>
              E learning is now need of the time and being accepted worldwide. Success of online training depends on the proficiency of the teacher to keep his/her student engaged and focused. We hire trained and qualified staff who are expert in their domain and have online teaching experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 mt-8 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-800/80 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
                <Laptop size={20} />
              </div>
              <span className="text-sm font-semibold text-emerald-100">Modern Digital Pedagogy</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-800/80 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
                <UserCheck size={20} />
              </div>
              <span className="text-sm font-semibold text-emerald-100">Experienced Tutors Only</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-800/80 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
                <ShieldCheck size={20} />
              </div>
              <span className="text-sm font-semibold text-emerald-100">Focused & Engaging Sessions</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Four Foundational Pillars (Exact Bullet List from Reference URL) */}
      <div className="glass-container rounded-3xl p-8 sm:p-12 border border-white/15 shadow-2xl mb-12">
        <div className="max-w-4xl mx-auto">
          <span className="text-amber-400 font-bold text-xs sm:text-sm uppercase tracking-wider block mb-3">
            Core Academy Pillars
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-white mb-8 leading-snug">
            Why Our Quran Teaching Model Succeeds
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="glass-container rounded-2xl p-6 border border-white/10 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-800/80 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
                <GraduationCap size={24} />
              </div>
              <div>
                <h4 className="font-serif font-bold text-lg text-white mb-1">Easy to Understand Process</h4>
                <p className="text-xs sm:text-sm text-emerald-100/75 leading-relaxed">
                  A step-by-step curriculum taking beginners from Qaida to fluent Quran Tajweed with zero confusion.
                </p>
              </div>
            </div>

            <div className="glass-container rounded-2xl p-6 border border-white/10 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-800/80 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
                <UserCheck2 size={24} />
              </div>
              <div>
                <h4 className="font-serif font-bold text-lg text-white mb-1">Equal Attention to Every Student</h4>
                <p className="text-xs sm:text-sm text-emerald-100/75 leading-relaxed">
                  Every child and adult receives devoted, individual focus irrespective of their learning speed.
                </p>
              </div>
            </div>

            <div className="glass-container rounded-2xl p-6 border border-white/10 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-800/80 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
                <CalendarRange size={24} />
              </div>
              <div>
                <h4 className="font-serif font-bold text-lg text-white mb-1">Timing That Suits Everyone</h4>
                <p className="text-xs sm:text-sm text-emerald-100/75 leading-relaxed">
                  Flexible time slots accommodating working parents, busy professionals, and school schedules.
                </p>
              </div>
            </div>

            <div className="glass-container rounded-2xl p-6 border border-white/10 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-800/80 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
                <Users size={24} />
              </div>
              <div>
                <h4 className="font-serif font-bold text-lg text-white mb-1">One to One Sessions</h4>
                <p className="text-xs sm:text-sm text-emerald-100/75 leading-relaxed">
                  Direct personal instruction with verified teachers for maximum focus, feedback, and retention.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Action CTA Card */}
      <div className="glass-container rounded-3xl p-8 sm:p-12 text-center border border-white/15 max-w-3xl mx-auto shadow-2xl">
        <h3 className="text-2xl sm:text-3xl font-serif text-white mb-4">
          Begin Learning Quran with Confidence
        </h3>
        <p className="text-emerald-100/80 text-sm sm:text-base mb-8 max-w-xl mx-auto">
          Experience our interactive 1-on-1 classes, meet your qualified teacher, and assess your level with a completely free trial.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/trial"
            className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold px-8 py-3.5 rounded-full transition shadow-lg text-base flex items-center gap-2 cursor-pointer"
          >
            <span>{t("bookFreeTrial")}</span>
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/programmes"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-8 py-3.5 rounded-full transition text-base cursor-pointer"
          >
            {t("ourServices")}
          </Link>
        </div>
      </div>
    </main>
  );
}
