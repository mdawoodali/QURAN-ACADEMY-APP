"use client";
import { FadeIn, StaggerContainer, StaggerItem, ScaleIn } from "@/components/Animations";
import { motion } from "framer-motion";

export default function StudentProgress() {
  return (
    <div className="p-4 md:p-8 h-full bg-transparent text-white">
      <FadeIn className="flex justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-serif text-white">My Progress</h1>
        <a href="/api/reports/download" className="bg-amber-400 hover:bg-amber-300 text-emerald-950 px-6 py-2.5 rounded-full font-bold text-sm transition shadow-md inline-block">
          Download Report
        </a>
      </FadeIn>
      
      <StaggerContainer className="grid md:grid-cols-2 gap-8 mb-8">
        <StaggerItem className="glass-container rounded-3xl p-8 border border-white/15 shadow-xl flex flex-col items-center justify-center text-center">
          <ScaleIn delay={0.2} className="relative w-32 h-32 flex items-center justify-center mb-4">
            <svg viewBox="0 0 128 128" className="absolute inset-0 w-full h-full -rotate-90">
              <circle 
                cx="64" cy="64" r="56" 
                fill="transparent" 
                stroke="rgba(255, 255, 255, 0.15)" 
                strokeWidth="8" 
              />
              <motion.circle 
                cx="64" cy="64" r="56" 
                fill="transparent" 
                stroke="#F4D03F" 
                strokeWidth="8" 
                strokeDasharray="351.858" 
                initial={{ strokeDashoffset: 351.858 }}
                animate={{ strokeDashoffset: 351.858 * 0.25 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                strokeLinecap="round" 
              />
            </svg>
            <div className="text-3xl font-bold text-amber-300">75%</div>
          </ScaleIn>
          <h2 className="text-xl font-bold font-serif text-white mb-1">Tajweed Mastery</h2>
          <p className="text-sm text-emerald-100/80">You are doing excellent with your Makhaarij.</p>
        </StaggerItem>

        <StaggerItem className="glass-container rounded-3xl p-8 border border-white/15 shadow-xl">
          <h2 className="text-xl font-bold font-serif text-white mb-6">Recent Teacher Notes</h2>
          <StaggerContainer className="space-y-4">
            <StaggerItem className="p-4 bg-black/35 rounded-2xl border border-white/10">
              <div className="text-xs text-amber-300 font-bold mb-2">12 Oct 2026 • Ustadha Fatima</div>
              <p className="text-sm text-emerald-100/90 leading-relaxed">Excellent recitation of Surah Al-Mulk today. Keep practicing the Ghunnah rules on the letter Noon.</p>
            </StaggerItem>
            <StaggerItem className="p-4 bg-black/25 rounded-2xl border border-white/10">
              <div className="text-xs text-emerald-200/70 font-bold mb-2">10 Oct 2026 • Ustadha Fatima</div>
              <p className="text-sm text-emerald-100/80 leading-relaxed">Good effort. We will revise the previous lesson again on Thursday to ensure fluency.</p>
            </StaggerItem>
          </StaggerContainer>
        </StaggerItem>
      </StaggerContainer>

      {/* Course Modules & Sabaq Syllabus Breakdown */}
      <div className="glass-container rounded-3xl p-6 md:p-8 border border-white/15 shadow-2xl mt-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-serif text-white">Curriculum & Sabaq Plans</h2>
            <p className="text-sm text-emerald-100/80">Structured roadmaps for Noorani Qaida, Tajweed Mastery, and Hifz Memorisation.</p>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1.5 rounded-full w-fit">
            3 Active Syllabi
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* 1. Noorani Qaida Foundations */}
          <div className="p-5 rounded-2xl border border-white/10 bg-black/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-800/80 text-emerald-100 px-2.5 py-1 rounded-md">
                Level 1 · Beginner
              </span>
              <span className="text-xs font-bold text-amber-300">60% Complete</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Noorani Qaida Foundations</h3>
            <p className="text-xs text-emerald-100/75 mb-4">Letter recognition, Harakat, Tanween, and Sukoon.</p>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 bg-black/40 rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">1. Huruf Mufradaat</div>
                  <div className="text-emerald-200/60 text-[10px]">Isolated alphabet & shapes</div>
                </div>
                <span className="text-amber-300 font-bold">✓ Mastered</span>
              </div>
              <div className="p-2.5 bg-black/40 rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">2. Huruf Murakkabaat</div>
                  <div className="text-emerald-200/60 text-[10px]">Joined letter forms</div>
                </div>
                <span className="text-amber-300 font-bold">✓ Mastered</span>
              </div>
              <div className="p-2.5 bg-black/40 rounded-xl border border-amber-400/30 flex items-center justify-between shadow-xs">
                <div>
                  <div className="font-bold text-amber-200">3. Huruf Muqatta'at</div>
                  <div className="text-emerald-200/60 text-[10px]">Opening Surah letters</div>
                </div>
                <span className="text-amber-400 font-bold">In Progress</span>
              </div>
              <div className="p-2.5 bg-black/20 rounded-xl border border-white/5 text-emerald-100/40">
                <div className="font-medium">4. Harakat & Tanween</div>
                <div className="text-[10px]">Next lesson</div>
              </div>
            </div>
          </div>

          {/* 2. Tajweed Rules */}
          <div className="p-5 rounded-2xl border border-white/10 bg-black/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-800/80 text-emerald-100 px-2.5 py-1 rounded-md">
                Level 2 · Tajweed Rules
              </span>
              <span className="text-xs font-bold text-amber-300">75% Complete</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Tajweed & Fluent Recitation</h3>
            <p className="text-xs text-emerald-100/75 mb-4">Makhaarij, Sifaat, Noon/Meem Sakinah, and Madd.</p>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 bg-black/40 rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">1. Throat Letters (Halqi)</div>
                  <div className="text-emerald-200/60 text-[10px]">Izhaar Halqi rules</div>
                </div>
                <span className="text-amber-300 font-bold">✓ Mastered</span>
              </div>
              <div className="p-2.5 bg-black/40 rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">2. Idghaam with Ghunnah</div>
                  <div className="text-emerald-200/60 text-[10px]">Yanmoo letters assimilation</div>
                </div>
                <span className="text-amber-300 font-bold">✓ Mastered</span>
              </div>
              <div className="p-2.5 bg-black/40 rounded-xl border border-amber-400/30 flex items-center justify-between shadow-xs">
                <div>
                  <div className="font-bold text-amber-200">3. Ikhfa Haqiqi (15 Letters)</div>
                  <div className="text-emerald-200/60 text-[10px]">2-count nasal concealment</div>
                </div>
                <span className="text-amber-400 font-bold">In Progress</span>
              </div>
              <div className="p-2.5 bg-black/20 rounded-xl border border-white/5 text-emerald-100/40">
                <div className="font-medium">4. Ahkaam al-Madd & Waqf</div>
                <div className="text-[10px]">Next module</div>
              </div>
            </div>
          </div>

          {/* 3. Daily Sabaq Hifz System */}
          <div className="p-5 rounded-2xl border border-white/10 bg-black/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 px-2.5 py-1 rounded-md border border-amber-400/30">
                Level 3 · 3-Pillar Hifz
              </span>
              <span className="text-xs font-bold text-amber-300">Daily Plan</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Daily Sabaq System (Hifz)</h3>
            <p className="text-xs text-emerald-100/75 mb-4">Structured 3-pillar method for permanent retention.</p>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 bg-black/40 rounded-xl border border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white">Pillar 1: Sabaq</span>
                  <span className="text-amber-300 font-bold">Daily 1/2 Page</span>
                </div>
                <div className="text-[10px] text-emerald-100/70">20x repetition drill with consecutive Ayah linking. Verified by teacher.</div>
              </div>
              <div className="p-2.5 bg-black/40 rounded-xl border border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white">Pillar 2: Sabqi / Dhor</span>
                  <span className="text-amber-300 font-bold">Last 10 Pages</span>
                </div>
                <div className="text-[10px] text-emerald-100/70">Rolling review of recent memorisation to consolidate short-term memory.</div>
              </div>
              <div className="p-2.5 bg-black/40 rounded-xl border border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white">Pillar 3: Manzil</span>
                  <span className="text-amber-300 font-bold">1 Full Juz Daily</span>
                </div>
                <div className="text-[10px] text-emerald-100/70">30-day cumulative cycle of all older Ajzaa to ensure zero attrition.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
