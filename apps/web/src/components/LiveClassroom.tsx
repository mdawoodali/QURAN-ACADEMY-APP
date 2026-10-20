"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

function splitArabicWord(word: string) {
  const regex = /[\u0621-\u064A\u0671-\u06D3\u06D5][\u0610-\u061A\u064B-\u065F\u0670]*/g;
  return word.match(regex) || [];
}

function normalizeArabic(text: string) {
  if (!text) return "";
  return text
    .replace(/\u0670/g, "ا")
    .replace(/\u0640/g, "")
    .replace(/[\u06D6-\u06ED\u065F\u06E2\u06E3\u06E4\u0600-\u0605]/g, "")
    .replace(/[\u0610-\u061A\u064B-\u065E]/g, "")
    .replace(/[إأآٱ]/g, "ا")
    .replace(/[ىي]/g, "ي")
    .replace(/ة/g, "ه")
    .trim();
}

const PHONETIC_MAP: Record<number, string[]> = {
  0: ["alhamdu", "alhamd", "alhamdulillah", "elhamd", "hamd", "al-hamdu", "الحمد", "حمد"],
  1: ["lillahi", "lillah", "allah", "lellah", "lillāhi", "لله", "الله"],
  2: ["rabbi", "rabb", "rab", "rub", "rab-bi", "رب"],
  3: ["alameen", "alalamin", "al-alameen", "aalamin", "alamin", "al-ʿālamīn", "العالمين", "عالمين"]
};

const SCRIPT_DATA = {
  uthmani: [
    { word: "ٱلْحَمْدُ", tajweed: "Izhar Qamari", type: "none" },
    { word: "لِلَّهِ", tajweed: "Tarqeeq (Light Lam)", type: "none" },
    { word: "رَبِّ", tajweed: "Tafkheem (Full Ra)", type: "none" },
    { word: "ٱلْعَـٰلَمِينَ", tajweed: "Madd Aaridh (2-4-6)", type: "madd" }
  ],
  indopak: [
    { word: "اَلْحَمْدُ", tajweed: "Izhar Qamari", type: "none" },
    { word: "لِلّٰهِ", tajweed: "Tarqeeq (Light Lam)", type: "none" },
    { word: "رَبِّ", tajweed: "Tafkheem (Full Ra)", type: "none" },
    { word: "الْعٰلَمِیْنَ", tajweed: "Madd Aaridh (2-4-6)", type: "madd" }
  ]
};

export default function LiveClassroom() {
  const params = useParams();
  const router = useRouter();
  const classId = (params?.id as string) || "demo";
  
  const [script, setScript] = useState<"uthmani" | "indopak">("uthmani");
  const [tajweedMode, setTajweedMode] = useState<boolean>(true);
  const [surahName, setSurahName] = useState("Al-Fatihah");
  
  const currentWords = SCRIPT_DATA[script].map(item => item.word);
  
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(0);
  const [splitIndex, setSplitIndex] = useState<number | null>(null);
  
  const [fontSize, setFontSize] = useState<number>(48);
  const [fontColor, setFontColor] = useState<string>("#111827");
  const [underlines, setUnderlines] = useState<Record<number, boolean>>({});
  const [circles, setCircles] = useState<Record<number, boolean>>({});
  
  // Voice Follow (Speech Recognition) state
  const [isVoiceFollowOn, setIsVoiceFollowOn] = useState(false);
  const isVoiceFollowOnRef = useRef(false);
  const [lastSpokenText, setLastSpokenText] = useState("");
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Camera state
  const [isMicOn, setIsMicOn] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    try {
      ws.current = new WebSocket(`ws://localhost:8000/ws/classroom/${classId}`);
      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "highlight") setHighlightedIndex(data.index);
          else if (data.type === "split") setSplitIndex(data.index);
          else if (data.type === "close_split") setSplitIndex(null);
          else if (data.type === "tool_sync") {
            if (data.state.fontSize) setFontSize(data.state.fontSize);
            if (data.state.fontColor) setFontColor(data.state.fontColor);
            if (data.state.underlines) setUnderlines(data.state.underlines);
            if (data.state.circles) setCircles(data.state.circles);
            if (data.state.script) setScript(data.state.script);
            if (data.state.tajweedMode !== undefined) setTajweedMode(data.state.tajweedMode);
          }
        } catch (e) {}
      };
    } catch (e) {}

    return () => {
      ws.current?.close();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
    };
  }, [classId]);

  // Arrow key shortcuts for teacher navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setHighlightedIndex(prev => {
          const next = prev === null ? 0 : Math.min(prev + 1, currentWords.length - 1);
          if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ type: "highlight", index: next }));
          }
          return next;
        });
      } else if (e.key === "ArrowLeft") {
        setHighlightedIndex(prev => {
          const next = prev === null ? 0 : Math.max(prev - 1, 0);
          if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ type: "highlight", index: next }));
          }
          return next;
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentWords.length]);

  // Voice Follow Engine
  const startVoiceFollow = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError("Speech recognition is not supported in this browser. Try Chrome.");
      toast.error("Web Speech API not supported in this browser");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "ar-SA";

      recognition.onstart = () => {
        setVoiceError(null);
        toast.success("Voice Follow active: Recite Ayah in Arabic");
      };

      recognition.onerror = (e: any) => {
        if (e.error !== "no-speech") {
          console.warn("Speech recognition error:", e.error);
          setVoiceError(`Mic error: ${e.error}`);
        }
      };

      recognition.onend = () => {
        if (isVoiceFollowOnRef.current) {
          try { recognition.start(); } catch (err) {}
        }
      };

      recognition.onresult = (event: any) => {
        let fullTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          fullTranscript += " " + event.results[i][0].transcript;
        }
        const clean = fullTranscript.trim();
        setLastSpokenText(clean);

        const wordsSpoken = clean.split(/\s+/);
        const latestSpoken = wordsSpoken[wordsSpoken.length - 1] || "";
        const normalizedSpoken = normalizeArabic(latestSpoken);

        let matchIdx = -1;
        for (let i = 0; i < currentWords.length; i++) {
          const normAyahWord = normalizeArabic(currentWords[i] || "");
          if (normAyahWord && normalizedSpoken && (normAyahWord.includes(normalizedSpoken) || normalizedSpoken.includes(normAyahWord))) {
            matchIdx = i;
            break;
          }
          const phonetics = PHONETIC_MAP[i] || [];
          if (phonetics.some(p => latestSpoken.toLowerCase().includes(p))) {
            matchIdx = i;
            break;
          }
        }

        if (matchIdx !== -1) {
          setHighlightedIndex(matchIdx);
          if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ type: "highlight", index: matchIdx }));
          }
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e: any) {
      setVoiceError("Failed to access speech engine.");
    }
  };

  const toggleVoiceFollow = () => {
    if (isVoiceFollowOn) {
      isVoiceFollowOnRef.current = false;
      setIsVoiceFollowOn(false);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      toast("Voice Follow deactivated");
    } else {
      isVoiceFollowOnRef.current = true;
      setIsVoiceFollowOn(true);
      startVoiceFollow();
    }
  };

  const toggleCamera = async () => {
    if (isCameraOn) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      setIsCameraOn(false);
      toast("Camera stopped");
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraOn(true);
        toast.success("Camera connected");
      } catch (err) {
        console.error("Camera access denied:", err);
        toast.error("Could not access camera. Please allow camera permissions.");
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
    const newIndex = splitIndex === highlightedIndex ? null : highlightedIndex;
    setSplitIndex(newIndex);
    if (ws.current?.readyState === WebSocket.OPEN) {
      if (newIndex !== null) {
        ws.current.send(JSON.stringify({ type: "split", index: newIndex }));
      } else {
        ws.current.send(JSON.stringify({ type: "close_split" }));
      }
    }
  };

  const syncTools = (newState: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: "tool_sync",
        state: { fontSize, fontColor, underlines, circles, script, tajweedMode, ...newState }
      }));
    }
  };

  const handleScriptChange = (newScript: "uthmani" | "indopak") => {
    setScript(newScript);
    syncTools({ script: newScript });
    toast.success(`Classroom Script switched to ${newScript === "uthmani" ? "Uthmani (Madani)" : "IndoPak (Subcontinent)"}`);
  };

  const handleTajweedChange = (enabled: boolean) => {
    setTajweedMode(enabled);
    syncTools({ tajweedMode: enabled });
    toast(enabled ? "Tajweed Color Coding ON" : "Tajweed Colors OFF (Plain)");
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
    if (wordIndex === null || !currentWords[wordIndex]) return null;
    const word = currentWords[wordIndex]!;
    const letters = splitArabicWord(word);
    return (
      <div className="mt-4 bg-emerald-50 rounded-2xl p-3 md:p-4 border border-emerald-100 animate-in fade-in shadow-inner w-full max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-2">
          <div className="text-[10px] md:text-xs font-bold text-emerald-800 tracking-widest uppercase">Letter Practice (Huroof Breakdown)</div>
          <div className="text-emerald-700 text-sm font-bold">{word}</div>
        </div>
        <div className="flex justify-center gap-2 md:gap-3 flex-row-reverse flex-wrap" dir="rtl">
          {letters.map((letter, i) => (
            <div key={i} className="bg-white border-2 border-emerald-200 rounded-xl w-10 h-12 md:w-12 md:h-14 flex items-center justify-center text-xl md:text-2xl font-quran text-[#0C4A3A] shadow-xs hover:scale-110 transition cursor-pointer">
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
      <div className={`absolute top-20 right-4 md:right-8 z-50 transition-all duration-500 shadow-xl rounded-2xl overflow-hidden border-4 border-white ${isCameraOn ? 'w-32 h-24 md:w-48 md:h-36 opacity-100 scale-100' : 'w-0 h-0 opacity-0 scale-50'}`}>
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
            <h1 className="text-base md:text-lg font-bold text-gray-900 leading-none">Live Interactive Classroom</h1>
            <p className="text-[10px] md:text-xs text-gray-500 mt-1 hidden sm:block">{surahName} • Script: {script === "uthmani" ? "Uthmani" : "IndoPak"} • Tajweed Active</p>
          </div>
        </div>

        {/* Script Selection & Dedicated Tajweed Controls */}
        <div className="flex items-center gap-3">
          {/* Top Controls: Script and Tajweed stacked cleanly */}
          <div className="hidden md:flex flex-col items-end gap-1">
            {/* 1. Script options: Uthmani and IndoPak */}
            <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg border border-gray-200">
              <span className="text-[10px] font-bold text-gray-500 px-1.5 uppercase">Script:</span>
              <button
                onClick={() => handleScriptChange("uthmani")}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition ${script === "uthmani" ? "bg-[#0C4A3A] text-white shadow-xs" : "text-gray-600 hover:text-black"}`}
              >
                Uthmani
              </button>
              <button
                onClick={() => handleScriptChange("indopak")}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition ${script === "indopak" ? "bg-[#0C4A3A] text-white shadow-xs" : "text-gray-600 hover:text-black"}`}
              >
                IndoPak
              </button>
            </div>

            {/* 2. Dedicated Tajweed option directly below */}
            <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg border border-gray-200">
              <span className="text-[10px] font-bold text-gray-500 px-1.5 uppercase">Tajweed:</span>
              <button
                onClick={() => handleTajweedChange(true)}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition ${tajweedMode ? "bg-emerald-600 text-white shadow-xs" : "text-gray-600 hover:text-black"}`}
              >
                Color-Coded
              </button>
              <button
                onClick={() => handleTajweedChange(false)}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition ${!tajweedMode ? "bg-gray-700 text-white shadow-xs" : "text-gray-600 hover:text-black"}`}
              >
                Plain
              </button>
            </div>
          </div>

          <button 
            onClick={toggleVoiceFollow} 
            className={`text-[10px] md:text-xs font-bold tracking-wider uppercase px-3.5 py-1.5 rounded-full transition flex items-center gap-1.5 shadow-xs ${
              isVoiceFollowOn 
                ? 'bg-emerald-600 text-white animate-pulse' 
                : 'bg-[#D1EBE1] text-[#0C4A3A] hover:bg-[#bce0d0]'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isVoiceFollowOn ? 'bg-white' : 'bg-emerald-600'}`} />
            {isVoiceFollowOn ? "Voice Follow: ON" : "Voice Follow: OFF"}
          </button>
          
          <div className="bg-red-50 text-red-700 text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            Live
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
              <p className="text-gray-500 mb-6 text-sm">Are you sure you want to end this session? The lesson attendance will be logged automatically.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowEndModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition">Cancel</button>
                <button onClick={() => router.push('/student')} className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition">End Session</button>
              </div>
            </div>
          </div>
        )}
        
        {/* LEFT PANE: TEACHER */}
        <div className="w-full lg:w-1/2 flex flex-col h-[500px] lg:h-full shrink-0 lg:shrink">
          <div className="flex items-center justify-between mb-2 md:mb-3 shrink-0 px-2 md:px-0">
            <span className="text-xs font-bold text-emerald-600 tracking-widest uppercase">Teacher Control • Web / Tablet</span>
            <span className="text-xs text-gray-400 font-medium">Script: <strong className="text-emerald-800 uppercase">{script}</strong></span>
          </div>
          <div className="flex-1 bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col p-4 md:p-6 overflow-hidden relative">
            <div className="text-xs md:text-sm text-gray-500 mb-2 md:mb-4 shrink-0 flex items-center justify-between">
              <span>{surahName} / Ayah 2</span>
              {tajweedMode && (
                <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-2 py-0.5 rounded-full">
                  Tajweed Color-Coding Active
                </span>
              )}
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center min-h-0 overflow-y-auto w-full">
              <div 
                className={`leading-[2.5] text-center w-full max-w-lg mx-auto flex items-center justify-center gap-2 md:gap-4 flex-wrap select-none ${
                  script === "indopak" ? "font-urdu" : "font-quran"
                }`} 
                style={{ fontSize: `${fontSize}px`, color: fontColor }}
                dir="rtl"
              >
                {SCRIPT_DATA[script].map((item, i) => {
                  const isMadd = tajweedMode && item.type === "madd";
                  return (
                    <span 
                      key={i} 
                      onClick={() => handleTeacherClickWord(i)}
                      className={`cursor-pointer transition-all duration-200 px-2 py-1 rounded-xl 
                        ${highlightedIndex === i ? 'bg-[#fef3c7] scale-110 shadow-sm' : 'hover:bg-gray-50'}
                        ${underlines[i] ? 'underline decoration-4 underline-offset-[12px]' : ''}
                        ${circles[i] ? 'border-[3px] border-red-500 rounded-full px-4' : 'border-[3px] border-transparent'}
                        ${isMadd ? 'text-rose-600 font-bold' : ''}
                      `}
                      title={tajweedMode ? item.tajweed : undefined}
                    >
                      {item.word}
                    </span>
                  );
                })}
              </div>
              
              <LetterPracticeTray wordIndex={splitIndex} />
              
              <div className="w-full mt-4 max-w-lg mx-auto shrink-0 hidden md:block">
                <p className="text-sm md:text-base text-gray-700 mb-2 text-center">All praise belongs to Allah, Lord of all worlds.</p>
                <div className="flex flex-col items-center justify-center gap-1">
                  <div className="flex items-center gap-3">
                    <div className={`flex items-end h-4 gap-1 ${isVoiceFollowOn ? 'opacity-100' : 'opacity-30'}`}>
                      {[2,4,3,5,8,12,8,5,3,6,10,7,4,2,3,5,9,14,10,6,3,2].map((h, i) => (
                        <div 
                          key={i} 
                          className={`w-1 rounded-full ${isVoiceFollowOn ? 'bg-emerald-600 animate-pulse' : 'bg-gray-400'}`} 
                          style={{ height: `${h * 1.0}px`, animationDelay: `${i * 0.08}s` }} 
                        />
                      ))}
                    </div>
                    <div className="text-[#0C4A3A] font-bold text-[11px] tracking-wide">
                      {isVoiceFollowOn ? "Listening live (Recite into mic)" : "Voice Follow off"}
                    </div>
                  </div>
                  {voiceError && (
                    <div className="text-[11px] text-red-600 font-medium bg-red-50 border border-red-200 px-3 py-1 rounded-xl max-w-md text-center">
                      ⚠️ {voiceError}
                    </div>
                  )}

                  {lastSpokenText && (
                    <div className="text-[11px] text-gray-600 font-medium bg-emerald-50 border border-emerald-100 px-3 py-0.5 rounded-full max-w-md truncate" dir="rtl">
                      مسموع: "{lastSpokenText}"
                    </div>
                  )}

                  {/* Manual Navigation */}
                  <div className="flex items-center gap-2 mt-1">
                    <button 
                      onClick={() => {
                        setHighlightedIndex(prev => {
                          const next = prev === null ? 0 : Math.max(prev - 1, 0);
                          if (ws.current?.readyState === WebSocket.OPEN) {
                            ws.current.send(JSON.stringify({ type: "highlight", index: next }));
                          }
                          return next;
                        });
                      }}
                      className="text-[10px] font-bold bg-gray-100 hover:bg-gray-200 text-gray-600 px-2.5 py-1 rounded-md transition"
                    >
                      ← Prev
                    </button>
                    <span className="text-[10px] text-gray-400 font-mono">Word {(highlightedIndex ?? 0) + 1} / {currentWords.length}</span>
                    <button 
                      onClick={() => {
                        setHighlightedIndex(prev => {
                          const next = prev === null ? 0 : Math.min(prev + 1, currentWords.length - 1);
                          if (ws.current?.readyState === WebSocket.OPEN) {
                            ws.current.send(JSON.stringify({ type: "highlight", index: next }));
                          }
                          return next;
                        });
                      }}
                      className="text-[10px] font-bold bg-emerald-100 hover:bg-emerald-200 text-emerald-900 px-2.5 py-1 rounded-md transition"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Toolbar */}
            <div className="mt-auto pt-3 border-t border-gray-100 flex flex-wrap gap-2 shrink-0 pb-1 justify-center items-center">
              <button onClick={() => { setIsMicOn(!isMicOn); toast(isMicOn ? "Mic Muted" : "Mic Unmuted", { icon: "🎙️" }) }} className={`${isMicOn ? 'bg-red-500' : 'bg-[#0C4A3A]'} text-white px-3 md:px-4 py-2 rounded-lg font-bold text-xs transition`}>{isMicOn ? 'Mute' : 'Mic'}</button>
              <button onClick={toggleCamera} className={`${isCameraOn ? 'bg-red-600' : 'bg-[#0C4A3A]'} text-white px-3 md:px-4 py-2 rounded-lg font-bold text-xs transition`}>
                {isCameraOn ? 'Stop Cam' : 'Camera'}
              </button>
              
              <div className="w-px bg-gray-200 mx-1 hidden sm:block h-6" />
              
              {/* Font Sizing */}
              <button onClick={() => { setFontSize(f => Math.min(f + 8, 80)); syncTools({ fontSize: Math.min(fontSize + 8, 80) }); }} className="text-[#0C4A3A] bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-lg font-bold text-xs transition hidden sm:block">A+</button>
              <button onClick={() => { setFontSize(f => Math.max(f - 8, 24)); syncTools({ fontSize: Math.max(fontSize - 8, 24) }); }} className="text-[#0C4A3A] bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-lg font-bold text-xs transition hidden sm:block">A-</button>
              
              {/* Color Picker */}
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
          <div className="flex items-center justify-between mb-2 md:mb-3 shrink-0 px-2 md:px-0">
            <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">Student View • Phone / Web</span>
            <span className="text-xs text-gray-400 font-medium">Synced Script: <strong className="text-emerald-700 uppercase">{script}</strong></span>
          </div>
          <div className="flex-1 bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col p-4 md:p-6 overflow-hidden relative opacity-90">
            <div className="text-xs md:text-sm text-gray-500 mb-2 md:mb-4 shrink-0 flex justify-between items-center">
              <span>Following teacher</span>
              {tajweedMode && (
                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  Tajweed Highlights Visible
                </span>
              )}
            </div>
            
            <div className={`flex-1 flex flex-col items-center justify-center min-h-0 overflow-y-auto w-full ${!isUnlocked ? 'pointer-events-none' : ''}`}>
              <div 
                className={`leading-[2.5] text-center w-full max-w-lg mx-auto flex items-center justify-center gap-2 md:gap-4 flex-wrap ${
                  script === "indopak" ? "font-urdu" : "font-quran"
                }`} 
                style={{ fontSize: `${fontSize}px`, color: fontColor }}
                dir="rtl"
              >
                {SCRIPT_DATA[script].map((item, i) => {
                  const isMadd = tajweedMode && item.type === "madd";
                  return (
                    <span 
                      key={i} 
                      onClick={() => isUnlocked && handleTeacherClickWord(i)}
                      className={`transition-all duration-300 px-2 py-1 rounded-xl 
                        ${highlightedIndex === i ? 'bg-[#fef3c7] scale-110 shadow-sm' : 'border-2 border-transparent'}
                        ${underlines[i] ? 'underline decoration-4 underline-offset-[12px]' : ''}
                        ${circles[i] ? 'border-[3px] border-red-500 rounded-full px-4' : 'border-[3px] border-transparent'}
                        ${isMadd ? 'text-rose-600 font-bold' : ''}
                      `}
                    >
                      {item.word}
                    </span>
                  );
                })}
              </div>
              
              <LetterPracticeTray wordIndex={splitIndex} />
            </div>
            
            <div className="mt-auto pt-3 border-t border-gray-100 shrink-0">
              <div className="text-xs md:text-sm text-gray-600 mb-2 text-center md:text-left hidden sm:block">Same word. Same script. Synchronous classroom highlights.</div>
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
