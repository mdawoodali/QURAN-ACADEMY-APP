"use client";

import { FadeIn, StaggerContainer, StaggerItem } from "@/components/Animations";
import toast from "react-hot-toast";

export default function AdminScheduling() {
  return (
    <div className="p-4 md:p-8 h-full bg-[#F8F9FA] text-[#111827]">
      <FadeIn className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-[#0C4A3A]">Scheduling Engine</h1>
        <button onClick={() => toast.success('Auto-assign algorithm started')} className="bg-[#0C4A3A] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#0D5C46] transition shadow-sm">
          Run Auto-Scheduler
        </button>
      </FadeIn>
      
      <StaggerContainer className="grid md:grid-cols-2 gap-8 mb-8">
        <StaggerItem>
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col h-full">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Orphaned Classes</h2>
            <div className="flex-1 space-y-4">
              <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex justify-between items-center">
                <div>
                  <div className="font-bold text-red-900">Zayd Ali (Age 8)</div>
                  <div className="text-sm text-red-700">Tajweed • EST Timezone</div>
                </div>
                <button onClick={() => toast('Opening match finder...', { icon: '🔍'})} className="bg-white text-red-700 font-bold px-4 py-2 rounded-lg text-sm shadow-sm hover:bg-gray-50">Find Match</button>
              </div>
            </div>
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col h-full">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Teacher Capacity</h2>
            <div className="flex-1 space-y-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex justify-between items-center">
                <div>
                  <div className="font-bold text-emerald-900">Ustadha Fatima</div>
                  <div className="text-sm text-emerald-700">Available: 14:00 - 18:00 GMT</div>
                </div>
                <div className="text-emerald-800 font-bold bg-white px-3 py-1 rounded-full text-sm">4 slots open</div>
              </div>
            </div>
          </div>
        </StaggerItem>
      </StaggerContainer>
    </div>
  );
}
