"use client";
import toast from "react-hot-toast";
import { FadeIn, StaggerContainer, StaggerItem, ScaleIn } from "@/components/Animations";
import { motion } from "framer-motion";

export default function StudentProgress() {
  return (
    <div className="p-4 md:p-8 h-full bg-[#F8F9FA] text-[#111827]">
      <FadeIn className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-[#0C4A3A]">My Progress</h1>
        <button onClick={() => toast('Report downloaded', { icon: '📄' })} className="bg-emerald-50 text-emerald-800 border border-emerald-100 px-6 py-2.5 rounded-full font-bold text-sm hover:bg-emerald-100 transition">
          Download Report
        </button>
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
    </div>
  );
}
