"use client";

import React from "react";
import QuranPracticePlayer from "@/components/QuranPracticePlayer";

export default function StudentQuranLibrary() {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto h-full flex flex-col">
      <div className="mb-6 shrink-0">
        <h1 className="text-2xl md:text-3xl font-serif text-[#0C4A3A] mb-1">Quran Library & Sabaq Practice</h1>
        <p className="text-gray-500 text-sm">Interactive word-by-word practice with audio timestamp sync (Approach 3)</p>
      </div>
      
      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        {/* Left Sidebar: Surah Selector */}
        <div className="w-full lg:w-72 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden shrink-0">
          <div className="p-4 border-b border-gray-100">
            <input 
              type="text" 
              placeholder="Search Surah or Ayah..." 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#0C4A3A]"
            />
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <div className="bg-[#D1EBE1] text-[#0C4A3A] font-bold p-3 rounded-xl mb-1 cursor-pointer flex items-center justify-between">
              <span>01 Al-Fatihah</span>
              <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full uppercase">Practice</span>
            </div>
            {['02 Al-Baqarah', '03 Ali Imran', '04 An-Nisa', '05 Al-Ma\'idah', '06 Al-An\'am', '07 Al-A\'raf', '08 Al-Anfal'].map(s => (
              <div key={s} className="text-gray-600 font-medium p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition text-sm flex items-center justify-between">
                <span>{s}</span>
                <span className="text-[10px] text-gray-400">Juz {parseInt(s)}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right Main Content: Interactive Timestamp-Synced Player */}
        <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col p-6 md:p-8 relative overflow-hidden">
          <QuranPracticePlayer />
        </div>
      </div>
      
      {/* Footer Settings */}
      <div className="mt-6 flex flex-wrap gap-4 text-xs font-bold text-gray-400 justify-center">
        <span>Script: Uthmani Hafs</span>
        <span>•</span>
        <span>Audio Sync: Millisecond Precise</span>
        <span>•</span>
        <span>Reciters: Alafasy & Al-Husary</span>
        <span>•</span>
        <span>Features: Click-to-Jump & Loop</span>
      </div>
    </div>
  );
}
