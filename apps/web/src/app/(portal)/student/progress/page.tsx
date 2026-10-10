"use client";
import toast from "react-hot-toast";
import { FadeIn, StaggerContainer, StaggerItem, ScaleIn } from "@/components/Animations";
import { motion } from "framer-motion";

export default function StudentProgress() {
  return (
    <div className="p-4 md:p-8 h-full bg-[#F8F9FA] text-[#111827]">
      <FadeIn className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-[#0C4A3A]">My Progress</h1>
        <a href="/api/reports/download" className="bg-emerald-50 text-emerald-800 border border-emerald-100 px-6 py-2.5 rounded-full font-bold text-sm hover:bg-emerald-100 transition inline-block">
          Download Report
        </a>
      </FadeIn>
      
      <StaggerContainer className="grid md:grid-cols-2 gap-8 mb-8">
        <StaggerItem className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
          <ScaleIn delay={0.2} className="relative w-32 h-32 flex items-center justify-center mb-4">
            <svg viewBox="0 0 128 128" className="absolute inset-0 w-full h-full -rotate-90">
              <circle 
                cx="64" cy="64" r="56" 
                fill="transparent" 
                stroke="#d1fae5" /* emerald-100 */
                strokeWidth="8" 
              />
              <motion.circle 
                cx="64" cy="64" r="56" 
                fill="transparent" 
                stroke="#0C4A3A" 
                strokeWidth="8" 
                strokeDasharray="351.858" /* 2 * PI * 56 = 351.858 */
                initial={{ strokeDashoffset: 351.858 }}
                animate={{ strokeDashoffset: 351.858 * 0.25 }} // 100% - 75% = 25% remaining
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                strokeLinecap="round" 
              />
            </svg>
            <div className="text-3xl font-bold text-[#0C4A3A]">75%</div>
          </ScaleIn>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Tajweed Mastery</h2>
          <p className="text-sm text-gray-500">You are doing excellent with your Makhaarij.</p>
        </StaggerItem>

        <StaggerItem className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Teacher Notes</h2>
          <StaggerContainer className="space-y-4">
            <StaggerItem className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <div className="text-xs text-emerald-600 font-bold mb-2">12 Oct 2026 • Ustadha Fatima</div>
              <p className="text-sm text-gray-800">Excellent recitation of Surah Al-Mulk today. Keep practicing the Ghunnah rules on the letter Noon.</p>
            </StaggerItem>
            <StaggerItem className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="text-xs text-gray-500 font-bold mb-2">10 Oct 2026 • Ustadha Fatima</div>
              <p className="text-sm text-gray-800">Good effort. We will revise the previous lesson again on Thursday to ensure fluency.</p>
            </StaggerItem>
          </StaggerContainer>
        </StaggerItem>
      </StaggerContainer>

      {/* Course Modules & Sabaq Syllabus Breakdown */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm mt-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-serif text-[#0C4A3A]">Curriculum & Sabaq Plans</h2>
            <p className="text-sm text-gray-500">Structured roadmaps for Noorani Qaida, Tajweed Mastery, and Hifz Memorisation.</p>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full w-fit">
            3 Active Syllabi
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* 1. Noorani Qaida Foundations */}
          <div className="p-5 rounded-2xl border border-emerald-100 bg-emerald-50/40">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-200/70 text-emerald-900 px-2.5 py-1 rounded-md">
                Level 1 · Beginner
              </span>
              <span className="text-xs font-bold text-emerald-700">60% Complete</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Noorani Qaida Foundations</h3>
            <p className="text-xs text-gray-600 mb-4">Letter recognition, Harakat, Tanween, and Sukoon.</p>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 bg-white rounded-xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-gray-900">1. Huruf Mufradaat</div>
                  <div className="text-gray-500 text-[10px]">Isolated alphabet & shapes</div>
                </div>
                <span className="text-emerald-600 font-bold">✓ Mastered</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-gray-900">2. Huruf Murakkabaat</div>
                  <div className="text-gray-500 text-[10px]">Joined letter forms</div>
                </div>
                <span className="text-emerald-600 font-bold">✓ Mastered</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-emerald-200 flex items-center justify-between shadow-xs">
                <div>
                  <div className="font-bold text-[#0C4A3A]">3. Huruf Muqatta'at</div>
                  <div className="text-gray-500 text-[10px]">Opening Surah letters</div>
                </div>
                <span className="text-amber-600 font-bold">In Progress</span>
              </div>
              <div className="p-2.5 bg-gray-50/70 rounded-xl border border-gray-100 text-gray-400">
                <div className="font-medium">4. Harakat & Tanween</div>
                <div className="text-[10px]">Next lesson</div>
              </div>
            </div>
          </div>

          {/* 2. Tajweed Rules */}
          <div className="p-5 rounded-2xl border border-teal-100 bg-teal-50/40">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-teal-200/70 text-teal-900 px-2.5 py-1 rounded-md">
                Level 2 · Tajweed Rules
              </span>
              <span className="text-xs font-bold text-teal-700">75% Complete</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Tajweed & Fluent Recitation</h3>
            <p className="text-xs text-gray-600 mb-4">Makhaarij, Sifaat, Noon/Meem Sakinah, and Madd.</p>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 bg-white rounded-xl border border-teal-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-gray-900">1. Throat Letters (Halqi)</div>
                  <div className="text-gray-500 text-[10px]">Izhaar Halqi rules</div>
                </div>
                <span className="text-teal-600 font-bold">✓ Mastered</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-teal-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-gray-900">2. Idghaam with Ghunnah</div>
                  <div className="text-gray-500 text-[10px]">Yanmoo letters assimilation</div>
                </div>
                <span className="text-teal-600 font-bold">✓ Mastered</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-teal-200 flex items-center justify-between shadow-xs">
                <div>
                  <div className="font-bold text-[#0C4A3A]">3. Ikhfa Haqiqi (15 Letters)</div>
                  <div className="text-gray-500 text-[10px]">2-count nasal concealment</div>
                </div>
                <span className="text-amber-600 font-bold">In Progress</span>
              </div>
              <div className="p-2.5 bg-gray-50/70 rounded-xl border border-gray-100 text-gray-400">
                <div className="font-medium">4. Ahkaam al-Madd & Waqf</div>
                <div className="text-[10px]">Next module</div>
              </div>
            </div>
          </div>

          {/* 3. Daily Sabaq Hifz System */}
          <div className="p-5 rounded-2xl border border-amber-100 bg-amber-50/40">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-amber-200/70 text-amber-900 px-2.5 py-1 rounded-md">
                Level 3 · 3-Pillar Hifz
              </span>
              <span className="text-xs font-bold text-amber-800">Daily Plan</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Daily Sabaq System (Hifz)</h3>
            <p className="text-xs text-gray-600 mb-4">Structured 3-pillar method for permanent retention.</p>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 bg-white rounded-xl border border-amber-200/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-gray-900">Pillar 1: Sabaq (New Lesson)</span>
                  <span className="text-amber-700 font-bold">Daily 1/2 Page</span>
                </div>
                <div className="text-[10px] text-gray-600">20x repetition drill with consecutive Ayah linking. Verified by teacher.</div>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-amber-200/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-gray-900">Pillar 2: Sabqi / Dhor</span>
                  <span className="text-amber-700 font-bold">Last 10 Pages</span>
                </div>
                <div className="text-[10px] text-gray-600">Rolling review of recent memorisation to consolidate short-term memory.</div>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-amber-200/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-gray-900">Pillar 3: Manzil (Permanent)</span>
                  <span className="text-amber-700 font-bold">1 Full Juz Daily</span>
                </div>
                <div className="text-[10px] text-gray-600">30-day cumulative cycle of all older Ajzaa to ensure zero attrition.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
