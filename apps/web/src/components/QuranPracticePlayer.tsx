"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, RotateCcw, Volume2, Sparkles, FastForward } from "lucide-react";
import toast from "react-hot-toast";

interface WordTiming {
  text: string;
  transliteration: string;
  translation: string;
  start: number; // in seconds
  end: number;   // in seconds
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
      { text: "ٱلْحَمْدُ", transliteration: "Al-hamdu", translation: "All praise", start: 0.0, end: 1.1 },
      { text: "لِلَّهِ", transliteration: "lillāhi", translation: "is for Allah", start: 1.1, end: 2.0 },
      { text: "رَبِّ", transliteration: "rabbi", translation: "Lord", start: 2.0, end: 2.75 },
      { text: "ٱلْعَـٰلَمِينَ", transliteration: "al-ʿālamīn", translation: "of all worlds", start: 2.75, end: 5.6 }
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
      { text: "بِسْمِ", transliteration: "Bismi", translation: "In the name", start: 0.0, end: 0.75 },
      { text: "ٱللَّهِ", transliteration: "Allāh", translation: "of Allah", start: 0.75, end: 1.6 },
      { text: "ٱلرَّحْمَـٰنِ", transliteration: "ar-Rahmān", translation: "the Entirely Merciful", start: 1.6, end: 2.85 },
      { text: "ٱلرَّحِيمِ", transliteration: "ar-Rahīm", translation: "the Especially Merciful", start: 2.85, end: 4.8 }
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
      { text: "ٱلرَّحْمَـٰنِ", transliteration: "Ar-Rahmān", translation: "The Entirely Merciful", start: 0.0, end: 1.4 },
      { text: "ٱلرَّحِيمِ", transliteration: "ar-Rahīm", translation: "the Especially Merciful", start: 1.4, end: 3.4 }
    ]
  }
];

export default function QuranPracticePlayer() {
  const [currentAyahIdx, setCurrentAyahIdx] = useState(0);
  const [reciter, setReciter] = useState<"alafasy" | "husary">("alafasy");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [activeWordIdx, setActiveWordIdx] = useState<number | null>(null);
  const [loopWordIdx, setLoopWordIdx] = useState<number | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const verse = PRACTICE_VERSES[currentAyahIdx];

  const currentAudioSrc = reciter === "alafasy" ? verse.audioAlafasy : verse.audioHusary;

  // Sync active word to audio currentTime
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const time = audioRef.current.currentTime;
    setCurrentTime(time);

    // If loop word is enabled
    if (loopWordIdx !== null && verse.words[loopWordIdx]) {
      const targetWord = verse.words[loopWordIdx];
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
    toast(`Playing "${word.text}"`, { icon: "🎧" });
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

      {/* Top Header: Verse Info & Reciter Selection */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-emerald-950/80 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full">
              Approach 3: Audio-Timestamp Sync
            </span>
            <span className="text-xs text-emerald-100/80 font-medium">
              Surah {verse.surahNumber}:{verse.ayahNumber} ({verse.surahName})
            </span>
          </div>
          <h2 className="text-2xl font-serif text-white mt-1 font-bold">Self-Practice & Sabaq Mode</h2>
        </div>

        {/* Reciter Toggle */}
        <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/15">
          <button
            onClick={() => { setReciter("alafasy"); setIsPlaying(false); }}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl transition ${
              reciter === "alafasy"
                ? "bg-amber-400 text-emerald-950 shadow-xs"
                : "text-emerald-100/70 hover:text-white"
            }`}
          >
            Mishary Alafasy
          </button>
          <button
            onClick={() => { setReciter("husary"); setIsPlaying(false); }}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl transition ${
              reciter === "husary"
                ? "bg-amber-400 text-emerald-950 shadow-xs"
                : "text-emerald-100/70 hover:text-white"
            }`}
          >
            Al-Husary (Tajweed)
          </button>
        </div>
      </div>

      {/* Verse Navigation Tabs */}
      <div className="flex gap-2 mb-6">
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

      {/* Central Arabic Canvas with Word-by-Word Synchronized Highlighting */}
      <div className="bg-black/35 border border-white/15 rounded-3xl p-8 md:p-12 my-auto flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
        <div className="text-xs text-amber-300 font-bold uppercase tracking-wider mb-6 bg-emerald-950/70 border border-amber-400/30 px-3.5 py-1 rounded-full">
          Click any word to jump audio directly to it
        </div>

        <div 
          className="font-quran text-5xl md:text-6xl text-white leading-[2.5] text-center w-full max-w-2xl mx-auto flex items-center justify-center gap-3 md:gap-5 flex-wrap select-none" 
          dir="rtl"
        >
          {verse.words.map((word, i) => {
            const isWordActive = activeWordIdx === i;
            const isWordPast = activeWordIdx !== null && i < activeWordIdx;
            const isLooping = loopWordIdx === i;

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
                <span>{word.text}</span>
                
                {/* Word Translation Tooltip */}
                <span className={`text-[11px] font-sans mt-1 opacity-80 group-hover:opacity-100 ${isWordActive ? "text-emerald-950 font-bold" : "text-emerald-100/70 font-medium"}`} dir="ltr">
                  {word.translation}
                </span>

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
            <span>Active Word: <strong className="text-amber-300">{verse.words[activeWordIdx].transliteration}</strong> ({verse.words[activeWordIdx].translation})</span>
            <span className="text-white/30">|</span>
            <span className="font-mono text-emerald-200/70">{verse.words[activeWordIdx].start.toFixed(1)}s - {verse.words[activeWordIdx].end.toFixed(1)}s</span>
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
              } else if (activeWordIdx !== null) {
                setLoopWordIdx(activeWordIdx);
                toast.success(`Looping word "${verse.words[activeWordIdx].text}"`);
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
