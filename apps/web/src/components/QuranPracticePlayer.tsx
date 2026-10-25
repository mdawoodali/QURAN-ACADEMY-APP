"use client";

import React, { useState, useRef } from "react";
import { Play, Pause, RotateCcw, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

interface WordTiming {
  text: string;         // Uthmani
  indopakText: string;  // IndoPak
  tajweedRule?: string; // e.g. "Madd Asli", "Tafkheem", "Idgham"
  ruleType?: "madd" | "ghunnah" | "qalqalah" | "ikhfa" | "none";
  transliteration: string;
  translation: string;
  start: number;
  end: number;
}

interface AyahPracticeData {
  surahNumber: number;
  ayahNumber: number;
  surahName: string;
  translation: string;
  words: WordTiming[];
  audioAlafasy: string;
  audioHusary: string;
}

const PRACTICE_VERSES: AyahPracticeData[] = [
  {
    surahNumber: 1,
    ayahNumber: 2,
    surahName: "Al-Fatihah",
    translation: "All praise belongs to Allah, Lord of all worlds.",
    audioAlafasy: "https://everyayah.com/data/Alafasy_128kbps/001002.mp3",
    audioHusary: "https://everyayah.com/data/Husary_128kbps/001002.mp3",
    words: [
      { text: "ٱلْحَمْدُ", indopakText: "اَلْحَمْدُ", tajweedRule: "Izhar Qamari (Clear Lam)", ruleType: "none", transliteration: "Al-hamdu", translation: "All praise", start: 0.0, end: 1.1 },
      { text: "لِلَّهِ", indopakText: "لِلّٰهِ", tajweedRule: "Tarqeeq (Light Lam)", ruleType: "none", transliteration: "lillāhi", translation: "is for Allah", start: 1.1, end: 2.0 },
      { text: "رَبِّ", indopakText: "رَبِّ", tajweedRule: "Tafkheem (Full-mouth Ra)", ruleType: "none", transliteration: "rabbi", translation: "Lord", start: 2.0, end: 2.75 },
      { text: "ٱلْعَـٰلَمِينَ", indopakText: "الْعٰلَمِیْنَ", tajweedRule: "Madd Aaridh li-Sukun (2-4-6 counts)", ruleType: "madd", transliteration: "al-ʿālamīn", translation: "of all worlds", start: 2.75, end: 5.6 }
    ]
  },
  {
    surahNumber: 1,
    ayahNumber: 1,
    surahName: "Al-Fatihah",
    translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
    audioAlafasy: "https://everyayah.com/data/Alafasy_128kbps/001001.mp3",
    audioHusary: "https://everyayah.com/data/Husary_128kbps/001001.mp3",
    words: [
      { text: "بِسْمِ", indopakText: "بِسْمِ", tajweedRule: "Makhraj Ba / Seen", ruleType: "none", transliteration: "Bismi", translation: "In the name", start: 0.0, end: 0.75 },
      { text: "ٱللَّهِ", indopakText: "اللهِ", tajweedRule: "Tafkheem Lam + Madd Asli", ruleType: "madd", transliteration: "Allāh", translation: "of Allah", start: 0.75, end: 1.6 },
      { text: "ٱلرَّحْمَـٰنِ", indopakText: "الرَّحْمٰنِ", tajweedRule: "Idgham Shamsi + Madd Asli", ruleType: "madd", transliteration: "ar-Rahmān", translation: "the Entirely Merciful", start: 1.6, end: 2.85 },
      { text: "ٱلرَّحِيمِ", indopakText: "الرَّحِيْمِ", tajweedRule: "Madd Aaridh li-Sukun", ruleType: "madd", transliteration: "ar-Rahīm", translation: "the Especially Merciful", start: 2.85, end: 4.8 }
    ]
  },
  {
    surahNumber: 1,
    ayahNumber: 3,
    surahName: "Al-Fatihah",
    translation: "The Entirely Merciful, the Especially Merciful.",
    audioAlafasy: "https://everyayah.com/data/Alafasy_128kbps/001003.mp3",
    audioHusary: "https://everyayah.com/data/Husary_128kbps/001003.mp3",
    words: [
      { text: "ٱلرَّحْمَـٰنِ", indopakText: "الرَّحْمٰنِ", tajweedRule: "Tafkheem Ra + Madd", ruleType: "madd", transliteration: "Ar-Rahmān", translation: "The Entirely Merciful", start: 0.0, end: 1.4 },
      { text: "ٱلرَّحِيمِ", indopakText: "الرَّحِيْمِ", tajweedRule: "Madd Aaridh (2-6 counts)", ruleType: "madd", transliteration: "ar-Rahīm", translation: "the Especially Merciful", start: 1.4, end: 3.4 }
    ]
  }
];

export default function QuranPracticePlayer() {
  const [currentAyahIdx, setCurrentAyahIdx] = useState(0);
  const [script, setScript] = useState<"uthmani" | "indopak">("uthmani");
  const [tajweedEnabled, setTajweedEnabled] = useState<boolean>(true);
  const [reciter, setReciter] = useState<"alafasy" | "husary">("alafasy");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [activeWordIdx, setActiveWordIdx] = useState<number | null>(null);
  const [loopWordIdx, setLoopWordIdx] = useState<number | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const verse = PRACTICE_VERSES[currentAyahIdx] ?? PRACTICE_VERSES[0]!;

  const currentAudioSrc = reciter === "alafasy" ? verse.audioAlafasy : verse.audioHusary;

  // Sync active word to audio currentTime
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const time = audioRef.current.currentTime;
    setCurrentTime(time);

    // If loop word is enabled
    if (loopWordIdx !== null && verse.words[loopWordIdx]) {
      const targetWord = verse.words[loopWordIdx]!;
      if (time >= targetWord.end) {
        audioRef.current.currentTime = targetWord.start;
        return;
      }
    }

    // Find which word matches current timestamp
    const matchedIdx = verse.words.findIndex(w => time >= w.start && time < w.end);
    if (matchedIdx !== -1) {
      setActiveWordIdx(matchedIdx);
    } else if (time >= (verse.words[verse.words.length - 1]?.end || 0)) {
      setActiveWordIdx(null);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch((e) => {
        console.error("Audio playback error:", e);
        toast.error("Could not play audio. Check your internet connection.");
      });
    }
  };

  const jumpToWord = (index: number) => {
    if (!audioRef.current) return;
    const word = verse.words[index];
    if (!word) return;

    audioRef.current.currentTime = word.start;
    setActiveWordIdx(index);
    if (!isPlaying) {
      audioRef.current.play().then(() => setIsPlaying(true));
    }
    const currentWordText = script === "indopak" ? word.indopakText : word.text;
    toast(`Playing "${currentWordText}"`, { icon: "🎧" });
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setActiveWordIdx(null);
    if (loopWordIdx === null) {
      setCurrentTime(0);
    }
  };

  // Helper for tajweed color styling
  const getTajweedClass = (word: WordTiming) => {
    if (!tajweedEnabled) return "";
    switch (word.ruleType) {
      case "madd":
        return "text-rose-300 font-semibold drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]";
      case "ghunnah":
        return "text-emerald-300 font-semibold drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]";
      case "qalqalah":
        return "text-sky-300 font-semibold drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]";
      case "ikhfa":
        return "text-amber-300 font-semibold drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]";
      default:
        return "";
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between h-full">
      {/* Hidden HTML5 Audio Element with word-by-word timestamp listener */}
      <audio
        ref={audioRef}
        src={currentAudioSrc}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        preload="auto"
      />

      {/* Top Header: Verse Info & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-emerald-950/80 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full">
              Word-by-Word Practice
            </span>
            <span className="text-xs text-emerald-100/80 font-medium">
              Surah {verse.surahNumber}:{verse.ayahNumber} ({verse.surahName})
            </span>
          </div>
          <h2 className="text-2xl font-serif text-white mt-1 font-bold">Self-Practice & Sabaq Mode</h2>
        </div>

        {/* Script Selection & Dedicated Tajweed Option (Directly Below) */}
        <div className="flex flex-col gap-2 items-end">
          {/* 1. SCRIPT SELECTOR: Uthmani vs IndoPak */}
          <div className="flex items-center gap-2 bg-black/40 p-1 rounded-2xl border border-white/15">
            <span className="text-[11px] font-bold text-emerald-200/70 px-2 uppercase tracking-wider">Script:</span>
            <button
              onClick={() => { setScript("uthmani"); toast.success("Script: Uthmani (Madani)"); }}
              className={`text-xs font-bold px-3 py-1 rounded-xl transition ${
                script === "uthmani"
                  ? "bg-amber-400 text-emerald-950 shadow-xs"
                  : "text-emerald-100/70 hover:text-white"
              }`}
            >
              Uthmani
            </button>
            <button
              onClick={() => { setScript("indopak"); toast.success("Script: IndoPak (Subcontinent 15/16-Line)"); }}
              className={`text-xs font-bold px-3 py-1 rounded-xl transition ${
                script === "indopak"
                  ? "bg-amber-400 text-emerald-950 shadow-xs"
                  : "text-emerald-100/70 hover:text-white"
              }`}
            >
              IndoPak
            </button>
          </div>

          {/* 2. DEDICATED TAJWEED OPTION: Directly below the Script Selector */}
          <div className="flex items-center gap-2 bg-black/40 p-1 rounded-2xl border border-white/15">
            <span className="text-[11px] font-bold text-emerald-200/70 px-2 uppercase tracking-wider">Tajweed:</span>
            <button
              onClick={() => { setTajweedEnabled(true); toast.success("Color-Coded Tajweed Rules ON"); }}
              className={`text-xs font-bold px-3 py-1 rounded-xl transition flex items-center gap-1.5 ${
                tajweedEnabled
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-emerald-100/70 hover:text-white"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              Color-Coded
            </button>
            <button
              onClick={() => { setTajweedEnabled(false); toast("Tajweed Colors OFF (Plain)"); }}
              className={`text-xs font-bold px-3 py-1 rounded-xl transition ${
                !tajweedEnabled
                  ? "bg-white/20 text-white font-bold"
                  : "text-emerald-100/70 hover:text-white"
              }`}
            >
              Plain Text
            </button>
          </div>
        </div>
      </div>

      {/* Reciter Toggle & Ayah Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        {/* Verse Navigation Tabs */}
        <div className="flex gap-2">
          {PRACTICE_VERSES.map((v, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentAyahIdx(idx);
                setIsPlaying(false);
                setActiveWordIdx(null);
                setLoopWordIdx(null);
              }}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition ${
                currentAyahIdx === idx
                  ? "bg-amber-400 text-emerald-950 shadow-xs"
                  : "bg-white/10 text-emerald-100 hover:bg-white/20"
              }`}
            >
              Ayah {v.ayahNumber}
            </button>
          ))}
        </div>

        {/* Reciter Switcher */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-2xl border border-white/15">
          <span className="text-[10px] text-emerald-200/60 uppercase px-2 font-bold">Reciter:</span>
          <button
            onClick={() => { setReciter("alafasy"); setIsPlaying(false); }}
            className={`text-xs font-bold px-2.5 py-1 rounded-xl transition ${
              reciter === "alafasy"
                ? "bg-emerald-800 text-amber-300 border border-amber-400/40"
                : "text-emerald-100/70 hover:text-white"
            }`}
          >
            Mishary Alafasy
          </button>
          <button
            onClick={() => { setReciter("husary"); setIsPlaying(false); }}
            className={`text-xs font-bold px-2.5 py-1 rounded-xl transition ${
              reciter === "husary"
                ? "bg-emerald-800 text-amber-300 border border-amber-400/40"
                : "text-emerald-100/70 hover:text-white"
            }`}
          >
            Mahmoud Al-Husary
          </button>
        </div>
      </div>

      {/* Tajweed Legend Bar when active */}
      {tajweedEnabled && (
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] mb-4 bg-emerald-950/40 border border-emerald-500/20 py-1.5 px-4 rounded-xl">
          <span className="text-emerald-200/60 font-bold uppercase tracking-wider">Tajweed Rules:</span>
          <span className="flex items-center gap-1.5 text-rose-300 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" /> Madd (Elongation)
          </span>
          <span className="flex items-center gap-1.5 text-emerald-300 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" /> Ghunnah (Nasal)
          </span>
          <span className="flex items-center gap-1.5 text-sky-300 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" /> Qalqalah (Echo)
          </span>
          <span className="flex items-center gap-1.5 text-amber-300 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> Ikhfa / Idgham
          </span>
        </div>
      )}

      {/* Central Arabic Canvas with Word-by-Word Synchronized Highlighting */}
      <div className="bg-black/35 border border-white/15 rounded-3xl p-8 md:p-12 my-auto flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
        <div className="text-xs text-amber-300 font-bold uppercase tracking-wider mb-6 bg-emerald-950/70 border border-amber-400/30 px-3.5 py-1 rounded-full flex items-center gap-2">
          <span>Click any word to jump audio directly to it</span>
          <span className="text-white/40">•</span>
          <span className="text-emerald-200 uppercase">{script} script active</span>
        </div>

        <div 
          className={`leading-[2.5] text-center w-full max-w-2xl mx-auto flex items-center justify-center gap-3 md:gap-5 flex-wrap select-none ${
            script === "indopak" ? "font-urdu text-4xl md:text-5xl" : "font-arabic text-5xl md:text-6xl"
          }`} 
          dir="rtl"
        >
          {verse.words.map((word, i) => {
            const isWordActive = activeWordIdx === i;
            const isWordPast = activeWordIdx !== null && i < activeWordIdx;
            const isLooping = loopWordIdx === i;
            const displayText = script === "indopak" ? word.indopakText : word.text;
            const tajweedClass = getTajweedClass(word);

            return (
              <div
                key={i}
                onClick={() => jumpToWord(i)}
                className={`relative group cursor-pointer transition-all duration-200 px-3 py-2 rounded-2xl flex flex-col items-center ${
                  isWordActive
                    ? "bg-amber-400 text-emerald-950 scale-110 shadow-lg ring-4 ring-amber-300 font-bold"
                    : isWordPast
                    ? "text-amber-200/90 hover:bg-white/10"
                    : "text-white hover:bg-white/10 hover:shadow-xs"
                } ${isLooping ? "ring-2 ring-emerald-400" : ""}`}
              >
                <span className={!isWordActive ? tajweedClass : ""}>{displayText}</span>
                
                {/* Word Translation Tooltip */}
                <span className={`text-[11px] font-sans mt-1 opacity-80 group-hover:opacity-100 ${isWordActive ? "text-emerald-950 font-bold" : "text-emerald-100/70 font-medium"}`} dir="ltr">
                  {word.translation}
                </span>

                {/* Tajweed rule tooltip on hover */}
                {tajweedEnabled && word.tajweedRule && !isWordActive && (
                  <span className="absolute -top-6 right-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none bg-emerald-900/95 text-amber-200 border border-amber-400/30 text-[10px] font-sans font-bold px-2 py-0.5 rounded-lg whitespace-nowrap shadow-lg transition-opacity z-20">
                    {word.tajweedRule}
                  </span>
                )}

                {/* Sub-label for current playing state */}
                {isWordActive && (
                  <span className="absolute -top-3 right-1/2 translate-x-1/2 bg-emerald-950 text-amber-300 border border-amber-400/40 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-widest shadow-xs">
                    Reciting
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Translation Banner */}
        <p className="text-emerald-100/90 text-center text-sm md:text-base mt-8 max-w-xl mx-auto font-sans leading-relaxed">
          "{verse.translation}"
        </p>

        {/* Word Details Indicator */}
        {activeWordIdx !== null && verse.words[activeWordIdx] && (
          <div className="mt-4 flex items-center gap-2 text-xs bg-black/50 px-4 py-1.5 rounded-full border border-white/15 shadow-xs text-emerald-100 font-medium">
            <Sparkles size={14} className="text-amber-300" />
            <span>Active Word: <strong className="text-amber-300">{verse.words[activeWordIdx]?.transliteration}</strong> ({verse.words[activeWordIdx]?.translation})</span>
            {verse.words[activeWordIdx]?.tajweedRule && (
              <>
                <span className="text-white/30">|</span>
                <span className="text-amber-300 font-bold">Rule: {verse.words[activeWordIdx]?.tajweedRule}</span>
              </>
            )}
            <span className="text-white/30">|</span>
            <span className="font-mono text-emerald-200/70">{verse.words[activeWordIdx]?.start.toFixed(1)}s - {verse.words[activeWordIdx]?.end.toFixed(1)}s</span>
          </div>
        )}
      </div>

      {/* Audio Controller Toolbar */}
      <div className="bg-black/40 border border-white/15 rounded-3xl p-4 md:p-6 shadow-xl mt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-white">
        {/* Play/Pause Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 flex items-center justify-center transition shadow-md hover:scale-105 cursor-pointer"
          >
            {isPlaying ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
          </button>

          <button
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = 0;
                setCurrentTime(0);
                setActiveWordIdx(null);
              }
            }}
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            title="Restart Ayah"
          >
            <RotateCcw size={16} />
          </button>

          <div className="flex flex-col">
            <span className="text-xs font-bold text-white">
              {isPlaying ? "Playing Recitation" : "Paused"}
            </span>
            <span className="text-[11px] text-emerald-200/70 font-mono">
              {currentTime.toFixed(1)}s / {verse.words[verse.words.length - 1]?.end.toFixed(1)}s
            </span>
          </div>
        </div>

        {/* Animated Waveform when playing */}
        <div className="hidden lg:flex items-center gap-1 h-6">
          {[3, 6, 9, 14, 8, 12, 16, 11, 7, 4, 10, 15, 8, 13, 9, 5].map((h, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-150 ${
                isPlaying ? "bg-amber-400 animate-pulse" : "bg-white/20"
              }`}
              style={{
                height: isPlaying ? `${h * 1.3}px` : "6px",
                animationDelay: `${i * 0.08}s`
              }}
            />
          ))}
        </div>

        {/* Speed Controls & Loop */}
        <div className="flex items-center gap-3">
          {/* Loop active word */}
          <button
            onClick={() => {
              if (loopWordIdx !== null) {
                setLoopWordIdx(null);
                toast("Single-word loop disabled");
              } else if (activeWordIdx !== null && verse.words[activeWordIdx]) {
                setLoopWordIdx(activeWordIdx);
                const currentText = script === "indopak" ? verse.words[activeWordIdx]!.indopakText : verse.words[activeWordIdx]!.text;
                toast.success(`Looping word "${currentText}"`);
              } else {
                toast("Click a word first to loop it!");
              }
            }}
            className={`text-xs font-bold px-3 py-2 rounded-xl transition cursor-pointer ${
              loopWordIdx !== null
                ? "bg-amber-400 text-emerald-950 border border-amber-300 font-extrabold"
                : "bg-white/10 text-emerald-100 hover:bg-white/20"
            }`}
          >
            {loopWordIdx !== null ? "🔁 Word Looping" : "Loop Word"}
          </button>

          {/* Speed Buttons */}
          <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/15">
            {[0.75, 1.0, 1.25].map(speed => (
              <button
                key={speed}
                onClick={() => handleSpeedChange(speed)}
                className={`text-xs font-bold px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  playbackRate === speed
                    ? "bg-amber-400 text-emerald-950"
                    : "text-emerald-100/70 hover:text-white"
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
