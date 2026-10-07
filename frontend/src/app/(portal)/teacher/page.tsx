"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { FadeIn, StaggerContainer, StaggerItem, ScaleIn } from "@/components/Animations";

export default function TeacherDashboard() {
  const [shiftActive, setShiftActive] = useState(false);

  const toggleShift = () => {
    if (shiftActive) {
      toast("Shift ended", { icon: "🛑" });
      setShiftActive(false);
    } else {
      toast.success("Shift started! You are now visible to students.");
      setShiftActive(true);
    }
  };

  return (
    <div className="w-full h-full p-4 md:p-8 flex flex-col bg-[#F8F9FA] text-[#111827] overflow-x-hidden">
      <FadeIn className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-[#0C4A3A]">Today&apos;s Schedule</h1>
        <button onClick={toggleShift} className={`px-6 py-2 rounded-full font-bold text-sm transition transform hover:scale-105 active:scale-95 ${shiftActive ? 'bg-red-100 text-red-700 hover:bg-red-200 shadow-sm' : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 shadow-sm'}`}>
          {shiftActive ? 'End Shift' : 'Start Shift'}
        </button>
      </FadeIn>
      
      <StaggerContainer className="grid md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Completed", value: "3" },
          { label: "Remaining", value: "2" },
          { label: "Hours Logged", value: "1.5h" }
        ].map((stat, i) => (
          <StaggerItem key={i}>
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">{stat.label}</p>
              <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <FadeIn delay={0.3} className="flex-1 bg-white p-4 md:p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col relative overflow-hidden">
        {/* Timeline Line */}
        <div className="absolute left-[8.5rem] top-8 bottom-8 w-px bg-gray-100 hidden md:block"></div>

        <StaggerContainer className="space-y-8 relative z-10">
          
          {/* Class 1 - Next */}
          <StaggerItem>
            <div className="flex flex-col md:flex-row gap-6 items-start group">
              <div className="w-24 text-right shrink-0 pt-2 hidden md:block">
                <div className="font-bold text-lg text-[#0C4A3A]">15:00</div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">30 mins</div>
              </div>
              <ScaleIn delay={0.5} className="w-4 h-4 rounded-full bg-[#0C4A3A] border-4 border-white shadow-sm mt-2.5 shrink-0 hidden md:block relative z-10" />
              <div className="flex-1 w-full bg-emerald-50 rounded-3xl p-6 border border-emerald-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition group-hover:shadow-md hover:-translate-y-1">
                <div>
                  <div className="md:hidden flex gap-2 mb-2">
                    <span className="font-bold text-[#0C4A3A] bg-emerald-100 px-2 rounded">15:00</span>
                    <span className="text-emerald-700 text-sm">30 mins</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Tajweed & Fluent Recitation</h3>
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <div className="w-6 h-6 bg-emerald-200 rounded-full flex items-center justify-center text-xs font-bold text-emerald-800">Y</div>
                    Student: Yusuf Ali (Age 10)
                  </div>
                </div>
                <Link href="/classroom/123" className="shrink-0 bg-[#0C4A3A] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#0D5C46] transition shadow-sm w-full md:w-auto text-center transform hover:scale-105 active:scale-95">
                  Launch class
                </Link>
              </div>
            </div>
          </StaggerItem>

          {/* Class 2 - Later */}
          <StaggerItem>
            <div className="flex flex-col md:flex-row gap-6 items-start opacity-80 hover:opacity-100 transition">
              <div className="w-24 text-right shrink-0 pt-2 hidden md:block">
                <div className="font-bold text-lg text-gray-900">16:00</div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">45 mins</div>
              </div>
              <ScaleIn delay={0.6} className="w-4 h-4 rounded-full bg-gray-200 border-4 border-white shadow-sm mt-2.5 shrink-0 hidden md:block relative z-10" />
              <div className="flex-1 w-full bg-white rounded-3xl p-6 border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group-hover:border-gray-200 hover:-translate-y-1 transition">
                <div>
                  <div className="md:hidden flex gap-2 mb-2">
                    <span className="font-bold text-gray-700 bg-gray-100 px-2 rounded">16:00</span>
                    <span className="text-gray-500 text-sm">45 mins</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Hifz Revision</h3>
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">M</div>
                    Student: Musa Ibrahim (Age 14)
                  </div>
                </div>
                <button onClick={() => toast('It is not time for this class yet.', { icon: '⏳' })} className="shrink-0 bg-gray-100 text-gray-400 px-6 py-3 rounded-xl font-bold cursor-not-allowed w-full md:w-auto">
                  Waiting
                </button>
              </div>
            </div>
          </StaggerItem>

        </StaggerContainer>
      </FadeIn>
    </div>
  );
}
