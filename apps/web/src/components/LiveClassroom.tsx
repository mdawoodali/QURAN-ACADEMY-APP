"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

function splitArabicWord(word: string) {
  const regex = /[\u0621-\u064A\u0671-\u06D3\u06D5][\u0610-\u061A\u064B-\u065F\u0670]*/g;
  return word.match(regex) || [];
}

export default function LiveClassroom() {
  const params = useParams();
  const router = useRouter();
  const classId = params?.id as string || "demo";
  
  const [verseWords, setVerseWords] = useState<string[]>(["ٱلْحَمْدُ", "لِلَّهِ", "رَبِّ", "ٱلْعَـٰلَمِينَ"]);
  const [surahName, setSurahName] = useState("Al-Fatihah");
  
  useEffect(() => {
    fetch('https://api.alquran.cloud/v1/surah/1')
      .then(res => res.json())
      .then(json => {
        // Just take the first Ayah for demo
        const firstAyah = json.data.ayahs[1].text; // Ayah 2 (Alhamdulillah)
        setVerseWords(firstAyah.split(' '));
        setSurahName(json.data.englishName);
      })
      .catch(err => console.error("Failed to fetch quran", err));
  }, []);
  
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(1);
  const [splitIndex, setSplitIndex] = useState<number | null>(null);
  
  const [fontSize, setFontSize] = useState<number>(48);
  const [fontColor, setFontColor] = useState<string>("#111827");
  const [underlines, setUnderlines] = useState<Record<number, boolean>>({});
  const [circles, setCircles] = useState<Record<number, boolean>>({});
  
  // Camera state
  const [isMicOn, setIsMicOn] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Modal state
  
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(`ws://localhost:8000/ws/classroom/${classId}`);
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "highlight") setHighlightedIndex(data.index);
      else if (data.type === "split") setSplitIndex(data.index);
      else if (data.type === "close_split") setSplitIndex(null);
      else if (data.type === "tool_sync") {
        if (data.state.fontSize) setFontSize(data.state.fontSize);
        if (data.state.fontColor) setFontColor(data.state.fontColor);
        if (data.state.underlines) setUnderlines(data.state.underlines);
        if (data.state.circles) setCircles(data.state.circles);
      }
    };
    return () => {
      ws.current?.close();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [classId]);

  const syncTools = (newState: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: "tool_sync", state: newState }));
    }
  };

  const toggleCamera = async () => {
    if (isCameraOn) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      setIsCameraOn(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraOn(true);
      } catch (err) {
        console.error("Failed to access camera", err);
        toast.error("Camera access denied or not available.");
      }
    }
  };

  const handleTeacherClickWord = (index: number) => {
    setHighlightedIndex(index);
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: "highlight", index }));
    }
  };

  const handleSplitWord = () => {
    if (highlightedIndex === null) return;
    const newSplit = splitIndex === highlightedIndex ? null : highlightedIndex;
    setSplitIndex(newSplit);
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ 
        type: newSplit === null ? "close_split" : "split", 
        index: highlightedIndex 
      }));
    }
  };

  const toggleUnderline = () => {
    if (highlightedIndex === null) return;
    const newUnderlines = { ...underlines, [highlightedIndex]: !underlines[highlightedIndex] };
    setUnderlines(newUnderlines);
    syncTools({ underlines: newUnderlines });
  };

  const toggleCircle = () => {
    if (highlightedIndex === null) return;
    const newCircles = { ...circles, [highlightedIndex]: !circles[highlightedIndex] };
    setCircles(newCircles);
    syncTools({ circles: newCircles });
  };

  const clearAll = () => {
    setUnderlines({});
    setCircles({});
    setHighlightedIndex(null);
    setSplitIndex(null);
    syncTools({ underlines: {}, circles: {} });
  };

  const LetterPracticeTray = ({ wordIndex }: { wordIndex: number | null }) => {
    if (wordIndex === null) return null;
    const word = verseWords[wordIndex];
    const letters = splitArabicWord(word);
    return (
      <div className="mt-6 bg-emerald-50 rounded-2xl p-4 md:p-6 border border-emerald-100 animate-in fade-in shadow-inner w-full max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="text-[10px] md:text-xs font-bold text-emerald-800 tracking-widest uppercase">Letter Practice</div>
          <div className="text-emerald-700 text-sm font-medium">{word}</div>
        </div>
        <div className="flex justify-center gap-2 md:gap-4 flex-row-reverse flex-wrap" dir="rtl">
          {letters.map((letter, i) => (
            <div key={i} className="bg-white border-2 border-emerald-200 rounded-xl w-10 h-12 md:w-14 md:h-16 flex items-center justify-center text-xl md:text-3xl font-quran text-[#0C4A3A] shadow-sm hover:scale-110 transition cursor-pointer">
              {letter}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white text-[#111827] overflow-hidden relative">
      
      {/* Floating Video Bubble */}
      <div className={`absolute top-24 right-4 md:right-8 z-50 transition-all duration-500 shadow-xl rounded-2xl overflow-hidden border-4 border-white ${isCameraOn ? 'w-32 h-24 md:w-48 md:h-36 opacity-100 scale-100' : 'w-0 h-0 opacity-0 scale-50'}`}>
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover bg-gray-900" />
        <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded-md font-bold backdrop-blur-sm">
          Teacher
        </div>
      </div>

      <header className="h-16 border-b border-gray-100 flex items-center justify-between px-4 md:px-8 flex-shrink-0 z-10 bg-white">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="w-8 h-8 bg-[#0C4A3A] rounded-lg flex items-center justify-center text-white">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="4" width="18" height="16" rx="2" stroke="white" strokeWidth="2" />
              <path d="M12 4V20" stroke="white" strokeWidth="2" />
            </svg>
          </div>
          <div>
            <h1 className="text-base md:text-lg font-bold text-gray-900 leading-none">Live classroom</h1>
            <p className="text-[10px] md:text-xs text-gray-500 mt-1 hidden sm:block">{surahName} • Tajweed lesson • One-to-one</p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button onClick={() => toast.success('Voice Follow synced!')} className="bg-[#D1EBE1] text-[#0C4A3A] text-[10px] md:text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full hover:bg-[#bce0d0] transition hidden sm:block">
            Voice Follow On
          </button>
          <div className="bg-red-50 text-red-700 text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            Recording
          </div>
          <button onClick={() => setShowEndModal(true)} className="bg-[#b94a48] text-white px-3 md:px-5 py-1.5 rounded-lg font-bold hover:bg-red-800 transition text-xs md:text-sm">
            End class
          </button>
        </div>
      </header>

      {/* Main Split Area */}
      <main className="flex-1 flex flex-col lg:flex-row bg-[#F8F9FA] p-2 md:p-6 gap-4 md:gap-6 min-h-0 overflow-y-auto lg:overflow-hidden">
        {/* End Class Modal */}
        {showEndModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95">
              <h2 className="text-xl font-bold text-gray-900 mb-2">End Class?</h2>
              <p className="text-gray-500 mb-6 text-sm">Are you sure you want to end this session? The recording will be saved automatically.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowEndModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition">Cancel</button>
                <button onClick={() => router.push('/student')} className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition">End Session</button>
              </div>
            </div>
          </div>
        )}
        
        {/* LEFT PANE: TEACHER */}
        <div className="w-full lg:w-1/2 flex flex-col h-[500px] lg:h-full shrink-0 lg:shrink">
          <div className="text-xs font-bold text-emerald-600 tracking-widest uppercase mb-2 md:mb-3 shrink-0 px-2 md:px-0">
            Teacher • Web / Tablet
          </div>
          <div className="flex-1 bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col p-4 md:p-6 overflow-hidden relative">
            <div className="text-xs md:text-sm text-gray-500 mb-4 md:mb-6 shrink-0">{surahName} / Ayah 2</div>
            
            <div className="flex-1 flex flex-col items-center justify-center min-h-0 overflow-y-auto w-full">
              <div 
                className="font-quran leading-[2.5] text-center w-full max-w-lg mx-auto flex items-center justify-center gap-2 md:gap-4 flex-wrap select-none" 
                style={{ fontSize: `${fontSize}px`, color: fontColor }}
                dir="rtl"
              >
                {verseWords.map((word, i) => (
                  <span 
                    key={i} 
                    onClick={() => handleTeacherClickWord(i)}
                    className={`cursor-pointer transition-all duration-200 px-2 py-1 rounded-xl 
                      ${highlightedIndex === i ? 'bg-[#fef3c7] scale-110 shadow-sm' : 'hover:bg-gray-50'}
                      ${underlines[i] ? 'underline decoration-4 underline-offset-[12px]' : ''}
                      ${circles[i] ? 'border-[3px] border-red-500 rounded-full px-4' : 'border-[3px] border-transparent'}
                    `}
                  >
                    {word}
                  </span>
                ))}
              </div>
              
              <LetterPracticeTray wordIndex={splitIndex} />
              
              <div className="w-full mt-4 md:mt-8 max-w-lg mx-auto shrink-0 hidden md:block">
                <p className="text-sm md:text-base text-gray-700 mb-4 md:mb-6 text-center">All praise belongs to Allah, Lord of all worlds.</p>
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-end h-6 gap-1 opacity-70">
                    {[2,4,3,5,8,12,8,5,3,6,10,7,4,2,3,5,9,14,10,6,3,2].map((h, i) => (
                      <div key={i} className="w-1 md:w-1.5 bg-[#0C4A3A] rounded-full animate-pulse" style={{ height: `${h * 1.5}px`, animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                  <div className="text-[#0C4A3A] font-bold text-[10px] md:text-xs uppercase tracking-wider">Listening</div>
                </div>
              </div>
            </div>
            
            {/* Toolbar */}
            <div className="mt-auto pt-4 md:pt-6 border-t border-gray-100 flex flex-wrap gap-2 shrink-0 pb-2 justify-center items-center">
              <button onClick={() => { setIsMicOn(!isMicOn); toast(isMicOn ? "Mic Muted" : "Mic Unmuted", { icon: "🎙️" }) }} className={`${isMicOn ? 'bg-red-500' : 'bg-[#0C4A3A]'} text-white px-3 md:px-4 py-2 rounded-lg font-bold text-xs transition`}>{isMicOn ? 'Mute' : 'Mic'}</button>
              <button onClick={toggleCamera} className={`${isCameraOn ? 'bg-red-600' : 'bg-[#0C4A3A]'} text-white px-3 md:px-4 py-2 rounded-lg font-bold text-xs transition`}>
                {isCameraOn ? 'Stop Cam' : 'Camera'}
              </button>
              
              <div className="w-px bg-gray-200 mx-1 hidden sm:block h-6" />
              
              {/* Font Sizing */}
              <button onClick={() => { setFontSize(f => Math.min(f + 8, 80)); syncTools({ fontSize: Math.min(fontSize + 8, 80) }); }} className="text-[#0C4A3A] bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-lg font-bold text-xs transition hidden sm:block">A+</button>
              <button onClick={() => { setFontSize(f => Math.max(f - 8, 24)); syncTools({ fontSize: Math.max(fontSize - 8, 24) }); }} className="text-[#0C4A3A] bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-lg font-bold text-xs transition hidden sm:block">A-</button>
              
              {/* Color Picker (Simplified) */}
              <input type="color" value={fontColor} onChange={(e) => { setFontColor(e.target.value); syncTools({ fontColor: e.target.value }); }} className="w-8 h-8 rounded border-none cursor-pointer bg-transparent" />
              
              <div className="w-px bg-gray-200 mx-1 hidden sm:block h-6" />
              
              <button onClick={toggleUnderline} className="text-[#0C4A3A] bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-lg font-bold text-xs transition hidden sm:block">Underline</button>
              <button onClick={toggleCircle} className="text-[#0C4A3A] bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-lg font-bold text-xs transition hidden sm:block">Circle</button>
              
              <button onClick={handleSplitWord} className={`px-3 md:px-4 py-2 rounded-lg font-bold text-xs transition ${splitIndex !== null ? 'bg-[#0C4A3A] text-white' : 'text-[#0C4A3A] bg-emerald-50 hover:bg-emerald-100'}`}>
                Split
              </button>
              
              <div className="w-px bg-gray-200 mx-1 hidden sm:block h-6" />
              
              <button onClick={clearAll} className="text-gray-500 hover:bg-gray-100 px-3 py-2 rounded-lg font-bold text-xs transition hidden sm:block">Clear All</button>
            </div>
          </div>
        </div>

        {/* RIGHT PANE: STUDENT */}
        <div className="w-full lg:w-1/2 flex flex-col h-[400px] lg:h-full shrink-0 lg:shrink">
          <div className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-2 md:mb-3 shrink-0 px-2 md:px-0">
            Student • Phone / Web
          </div>
          <div className="flex-1 bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col p-4 md:p-6 overflow-hidden relative opacity-90">
            <div className="text-xs md:text-sm text-gray-500 mb-4 md:mb-6 shrink-0">Following teacher</div>
            
            <div className={`flex-1 flex flex-col items-center justify-center min-h-0 overflow-y-auto w-full ${!isUnlocked ? 'pointer-events-none' : ''}`}>
              <div 
                className="font-quran leading-[2.5] text-center w-full max-w-lg mx-auto flex items-center justify-center gap-2 md:gap-4 flex-wrap" 
                style={{ fontSize: `${fontSize}px`, color: fontColor }}
                dir="rtl"
              >
                {verseWords.map((word, i) => (
                  <span 
                    key={i} 
                    onClick={() => isUnlocked && handleTeacherClickWord(i)}
                      className={`transition-all duration-300 px-2 py-1 rounded-xl 
                      ${highlightedIndex === i ? 'bg-[#fef3c7] scale-110 shadow-sm' : 'border-2 border-transparent'}
                      ${underlines[i] ? 'underline decoration-4 underline-offset-[12px]' : ''}
                      ${circles[i] ? 'border-[3px] border-red-500 rounded-full px-4' : 'border-[3px] border-transparent'}
                    `}
                  >
                    {word}
                  </span>
                ))}
              </div>
              
              <LetterPracticeTray wordIndex={splitIndex} />
            </div>
            
            <div className="mt-auto pt-4 md:pt-6 border-t border-gray-100 shrink-0">
              <div className="text-xs md:text-sm text-gray-600 mb-2 md:mb-3 text-center md:text-left hidden sm:block">Same word. Same teaching action.</div>
              <div className="flex items-center gap-3 text-xs md:text-sm font-bold text-[#0C4A3A] justify-center md:justify-start">
                <button onClick={() => { setIsUnlocked(false); toast.success('Following teacher sync restored'); }} className={`hover:underline ${!isUnlocked ? 'text-[#0C4A3A]' : 'text-emerald-500'}`}>Follow teacher</button>
                <span className="text-gray-300">|</span>
                <button onClick={() => { setIsUnlocked(true); toast('Student Viewport Unlocked', { icon: '🔓' }); }} className={`${isUnlocked ? 'hidden' : 'text-emerald-500 cursor-pointer pointer-events-auto hover:underline'}`}>Unlock</button>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
