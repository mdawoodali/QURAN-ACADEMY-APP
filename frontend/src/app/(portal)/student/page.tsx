"use client";
import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/Animations";

export default function StudentDashboard() {
  const [paymentState, setPaymentState] = useState<"due" | "processing" | "paid">("due");

  const handlePayment = () => {
    setPaymentState("processing");
    setTimeout(() => {
      setPaymentState("paid");
      toast.success("Payment successful! Invoice cleared.");
    }, 1500);
  };

  return (
    <div className="w-full h-full p-4 md:p-8 flex flex-col bg-[#F8F9FA] text-[#111827] overflow-x-hidden">
      <FadeIn className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-[#0C4A3A]">Welcome back, Yusuf</h1>
          <p className="text-sm text-gray-500 mt-1">Ready for your next lesson?</p>
        </div>
      </FadeIn>

      <StaggerContainer className="grid md:grid-cols-3 gap-8 mb-8">
        
        {/* Next Class Hero Card */}
        <StaggerItem className="md:col-span-2">
          <div className="bg-[#0C4A3A] rounded-3xl p-8 text-white relative overflow-hidden shadow-lg h-full transition-transform hover:scale-[1.01]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
            
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex justify-between items-start mb-12">
                <div className="bg-white/20 px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase backdrop-blur-sm">
                  Next Class • Today
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">15:00</div>
                  <div className="text-sm text-emerald-100">30 mins • Voice-follow</div>
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-2">Tajweed & Fluent Recitation</h2>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                    T
                  </div>
                  <span className="text-emerald-50">Ustadha Fatima</span>
                </div>
                
                <Link href="/classroom/123" className="inline-block bg-white text-[#0C4A3A] px-8 py-3 rounded-xl font-bold hover:bg-emerald-50 transition shadow-sm hover:shadow-md transform hover:-translate-y-1">
                  Join Classroom
                </Link>
              </div>
            </div>
          </div>
        </StaggerItem>

        {/* Action Required Card */}
        <StaggerItem>
          {paymentState === "paid" ? (
            <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100 flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <h3 className="text-xl font-bold text-emerald-900 mb-2">All Caught Up!</h3>
              <p className="text-sm text-emerald-700">Your account is in good standing.</p>
            </div>
          ) : (
            <div className="bg-red-50 rounded-3xl p-8 border border-red-100 flex flex-col h-full transition hover:border-red-200">
              <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              </div>
              <h3 className="text-xl font-bold text-red-900 mb-2">Action Required</h3>
              <p className="text-sm text-red-700 mb-8 flex-1">Your monthly tuition invoice for October is due.</p>
              <button 
                onClick={handlePayment} 
                disabled={paymentState === "processing"}
                className={`w-full text-white px-6 py-3 rounded-xl font-bold transition shadow-sm text-center ${paymentState === "processing" ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 transform hover:scale-105 active:scale-95'}`}
              >
                {paymentState === "processing" ? "Processing..." : "Pay $50.00"}
              </button>
            </div>
          )}
        </StaggerItem>

      </StaggerContainer>

      {/* Progress & Goals */}
      <StaggerContainer className="grid md:grid-cols-2 gap-8">
        
        {/* Progress */}
        <StaggerItem>
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm h-full hover:shadow-md transition">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Current Focus</h3>
            <div className="flex items-center gap-6">
              <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 128 128" className="absolute inset-0 w-full h-full -rotate-90">
                  <circle cx="64" cy="64" r="56" fill="transparent" stroke="#d1fae5" strokeWidth="12" />
                  <motion.circle 
                    cx="64" cy="64" r="56" fill="transparent" stroke="#0C4A3A" strokeWidth="12" 
                    strokeDasharray="351.858" initial={{ strokeDashoffset: 351.858 }} animate={{ strokeDashoffset: 351.858 * 0.25 }} 
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }} strokeLinecap="round" 
                  />
                </svg>
                <span className="text-xl font-bold text-[#0C4A3A] relative z-10">75%</span>
              </div>
              <div>
                <div className="font-bold text-gray-900 text-lg">Makhaarij Mastery</div>
                <div className="text-sm text-gray-500">Working on heavy letters (ص, ض, ط, ظ)</div>
              </div>
            </div>
          </div>
        </StaggerItem>

        {/* Assignments */}
        <StaggerItem>
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm h-full hover:shadow-md transition">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Home Practice</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 group">
                <input type="checkbox" onChange={(e) => { if(e.target.checked) toast.success('Task marked as completed!') }} className="w-5 h-5 rounded border border-gray-300 text-emerald-600 focus:ring-emerald-600 cursor-pointer transition" />
                <div>
                  <div className="font-bold text-gray-900 group-hover:text-[#0C4A3A] transition">Revise Surah Al-Fatihah</div>
                  <div className="text-xs text-gray-500">Focus on the Ain (ع) in line 2</div>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <input type="checkbox" onChange={(e) => { if(e.target.checked) toast.success('Task marked as completed!') }} className="w-5 h-5 rounded border border-gray-300 text-emerald-600 focus:ring-emerald-600 cursor-pointer transition" />
                <div>
                  <div className="font-bold text-gray-900 group-hover:text-[#0C4A3A] transition">Listen to Audio Recording</div>
                  <div className="text-xs text-gray-500">10 mins • Sent by Ustadha Fatima</div>
                </div>
              </div>
            </div>
          </div>
        </StaggerItem>

      </StaggerContainer>
    </div>
  );
}
