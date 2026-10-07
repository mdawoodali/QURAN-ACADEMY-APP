"use client";
import toast from "react-hot-toast";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/Animations";

export default function StudentQuran() {
  return (
    <div className="p-4 md:p-8 h-full bg-[#F8F9FA] text-[#111827]">
      <FadeIn>
        <h1 className="text-3xl font-serif text-[#0C4A3A] mb-8">Quran & Duas Library</h1>
      </FadeIn>
      
      <StaggerContainer className="grid md:grid-cols-3 gap-6">
        {[
          { title: "Surah Al-Fatihah", type: "Makki", ayahs: 7 },
          { title: "Surah Al-Baqarah", type: "Madani", ayahs: 286 },
          { title: "Surah Aal-E-Imran", type: "Madani", ayahs: 200 },
          { title: "Surah Al-Kahf", type: "Makki", ayahs: 110 },
          { title: "Surah Yaseen", type: "Makki", ayahs: 83 },
          { title: "Surah Al-Mulk", type: "Makki", ayahs: 30 },
        ].map((surah, i) => (
          <StaggerItem key={i}>
            <div 
              onClick={() => toast.success(`Opened ${surah.title} in practice mode`)} 
              className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer flex justify-between items-center group hover:-translate-y-1 hover:border-emerald-200"
            >
              <div>
                <div className="text-xs font-bold text-emerald-600 mb-1">{surah.type} • {surah.ayahs} Ayahs</div>
                <h2 className="text-lg font-bold text-gray-900 group-hover:text-[#0C4A3A] transition">{surah.title}</h2>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center font-bold text-gray-400 group-hover:bg-[#0C4A3A] group-hover:text-white transition transform group-hover:rotate-12">
                {i + 1}
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}
