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
            <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
              Approach 3: Audio-Timestamp Sync
            </span>
            <span className="text-xs text-gray-500 font-medium">
              Surah {verse.surahNumber}:{verse.ayahNumber} ({verse.surahName})
            </span>
          </div>
          <h2 className="text-2xl font-serif text-[#0C4A3A] mt-1 font-bold">Self-Practice & Sabaq Mode</h2>
        </div>

        {/* Reciter Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-2xl border border-gray-200">
          <button
            onClick={() => { setReciter("alafasy"); setIsPlaying(false); }}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl transition ${
              reciter === "alafasy"
                ? "bg-[#0C4A3A] text-white shadow-xs"
                : "text-gray-600 hover:text-black"
            }`}
          >
            Mishary Alafasy
          </button>
          <button
            onClick={() => { setReciter("husary"); setIsPlaying(false); }}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl transition ${
              reciter === "husary"
                ? "bg-[#0C4A3A] text-white shadow-xs"
                : "text-gray-600 hover:text-black"
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
                ? "bg-emerald-700 text-white shadow-xs"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Ayah {v.ayahNumber}
          </button>
        ))}
      </div>

      {/* Central Arabic Canvas with Word-by-Word Synchronized Highlighting */}
      <div className="bg-emerald-50/40 border border-emerald-100/80 rounded-3xl p-8 md:p-12 my-auto flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
        <div className="text-xs text-emerald-800 font-bold uppercase tracking-wider mb-6 bg-white/80 border border-emerald-200 px-3 py-1 rounded-full">
          Click any word to jump audio directly to it
        </div>

        <div 
          className="font-quran text-5xl md:text-6xl text-[#111827] leading-[2.5] text-center w-full max-w-2xl mx-auto flex items-center justify-center gap-3 md:gap-5 flex-wrap select-none" 
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
                    ? "bg-[#fef3c7] text-[#92400e] scale-110 shadow-lg ring-3 ring-amber-400"
                    : isWordPast
                    ? "text-emerald-950 hover:bg-emerald-100/60"
                    : "text-gray-800 hover:bg-white hover:shadow-xs"
                } ${isLooping ? "ring-2 ring-emerald-600" : ""}`}
              >
                <span>{word.text}</span>
                
                {/* Word Translation Tooltip */}
                <span className="text-[11px] font-sans text-gray-500 font-medium mt-1 opacity-80 group-hover:opacity-100" dir="ltr">
                  {word.translation}
                </span>

                {/* Sub-label for current playing state */}
                {isWordActive && (
                  <span className="absolute -top-3 right-1/2 translate-x-1/2 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-widest shadow-xs">
                    Reciting
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Translation Banner */}
        <p className="text-gray-600 text-center text-sm md:text-base mt-8 max-w-xl mx-auto font-sans leading-relaxed">
          "{verse.translation}"
        </p>

        {/* Word Details Indicator */}
        {activeWordIdx !== null && verse.words[activeWordIdx] && (
          <div className="mt-4 flex items-center gap-2 text-xs bg-white px-4 py-1.5 rounded-full border border-emerald-200 shadow-xs text-emerald-900 font-medium">
            <Sparkles size={14} className="text-amber-500" />
            <span>Active Word: <strong>{verse.words[activeWordIdx].transliteration}</strong> ({verse.words[activeWordIdx].translation})</span>
            <span className="text-gray-400">|</span>
            <span className="font-mono text-gray-500">{verse.words[activeWordIdx].start.toFixed(1)}s - {verse.words[activeWordIdx].end.toFixed(1)}s</span>
          </div>
        )}
      </div>

      {/* Audio Controller Toolbar */}
      <div className="bg-white border border-gray-200 rounded-3xl p-4 md:p-6 shadow-sm mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Play/Pause Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-2xl bg-[#0C4A3A] hover:bg-emerald-900 text-white flex items-center justify-center transition shadow-md hover:scale-105"
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
            className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition"
            title="Restart Ayah"
          >
            <RotateCcw size={16} />
          </button>

          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-900">
              {isPlaying ? "Playing Recitation" : "Paused"}
            </span>
            <span className="text-[11px] text-gray-500 font-mono">
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
                isPlaying ? "bg-emerald-600 animate-pulse" : "bg-gray-200"
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
            className={`text-xs font-bold px-3 py-2 rounded-xl transition ${
              loopWordIdx !== null
                ? "bg-amber-100 text-amber-900 border border-amber-300 font-extrabold"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {loopWordIdx !== null ? "🔁 Word Looping" : "Loop Word"}
          </button>

          {/* Speed Buttons */}
          <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
            {[0.75, 1.0, 1.25].map(speed => (
              <button
                key={speed}
                onClick={() => handleSpeedChange(speed)}
                className={`text-xs font-bold px-2.5 py-1 rounded-lg transition ${
                  playbackRate === speed
                    ? "bg-[#0C4A3A] text-white"
                    : "text-gray-600 hover:text-black"
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
