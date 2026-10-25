"use client";

import React from "react";
import QuranPracticePlayer from "@/components/QuranPracticePlayer";

export default function StudentQuranLibrary() {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto h-full flex flex-col text-white">
      <div className="mb-6 shrink-0">
        <h1 className="text-2xl md:text-3xl font-serif text-white mb-1">Quran Library & Sabaq Practice</h1>
        <p className="text-emerald-100/80 text-sm">Interactive word-by-word practice with Uthmani & IndoPak scripts, Tajweed coloring, and clear recitation audio</p>
      </div>
      
      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        {/* Left Sidebar: Surah Selector */}
        <div className="w-full lg:w-72 glass-container rounded-3xl border border-white/15 shadow-xl flex flex-col overflow-hidden shrink-0">
          <div className="p-4 border-b border-white/10">
            <input 
              type="text" 
              placeholder="Search Surah or Ayah..." 
              className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-2 text-sm text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400"
            />
          </div>
          <div className="flex-1 overflow-y-auto p-2 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="bg-emerald-800/70 border border-amber-400/40 text-amber-300 font-bold p-3 rounded-xl mb-1 cursor-pointer flex items-center justify-between shadow-xs">
              <span>01 Al-Fatihah</span>
              <span className="text-[10px] bg-amber-400 text-emerald-950 px-2 py-0.5 rounded-full uppercase font-bold">Practice</span>
            </div>
            {['02 Al-Baqarah', '03 Ali Imran', '04 An-Nisa', '05 Al-Ma\'idah', '06 Al-An\'am', '07 Al-A\'raf', '08 Al-Anfal'].map(s => (
              <div key={s} className="text-emerald-100/80 font-medium p-3 rounded-xl hover:bg-white/10 cursor-pointer transition text-sm flex items-center justify-between">
                <span>{s}</span>
                <span className="text-[10px] text-emerald-200/50">Juz {parseInt(s)}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right Main Content: Interactive Timestamp-Synced Player */}
        <div className="flex-1 glass-container rounded-3xl border border-white/15 shadow-xl flex flex-col p-6 md:p-8 relative overflow-hidden">
          <QuranPracticePlayer />
        </div>
      </div>
      
      {/* Footer Settings */}
      <div className="mt-6 flex flex-wrap gap-4 text-xs font-bold text-emerald-100/60 justify-center">
        <span>Scripts: Uthmani & IndoPak</span>
        <span>•</span>
        <span>Tajweed: Color-Coded Makharij & Rules</span>
        <span>•</span>
        <span>Recitation: Word-by-Word Audio</span>
        <span>•</span>
        <span>Reciters: Alafasy & Al-Husary</span>
        <span>•</span>
        <span>Features: Click-to-Jump & Loop</span>
      </div>
    </div>
  );
}
