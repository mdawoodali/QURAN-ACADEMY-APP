"use client";

import React, { useState } from "react";
import { RotateCcw, Volume2, VolumeX, Sparkles, Trophy, Check } from "lucide-react";
import toast from "react-hot-toast";

interface DhikrPreset {
  id: string;
  arabic: string;
  transliteration: string;
  meaning: string;
  target: number;
}

const PRESETS: DhikrPreset[] = [
  {
    id: "subhanallah",
    arabic: "سُبْحَانَ اللَّهِ",
    transliteration: "SubhanAllah",
    meaning: "Glory be to Allah",
    target: 33,
  },
  {
    id: "alhamdulillah",
    arabic: "الْحَمْدُ لِلَّهِ",
    transliteration: "Alhamdulillah",
    meaning: "All praise is due to Allah",
    target: 33,
  },
  {
    id: "allahuakbar",
    arabic: "اللَّهُ أَكْبَرُ",
    transliteration: "Allahu Akbar",
    meaning: "Allah is the Greatest",
    target: 34,
  },
  {
    id: "astaghfirullah",
    arabic: "أَسْتَغْفِرُ اللَّهَ",
    transliteration: "Astaghfirullah",
    meaning: "I seek forgiveness from Allah",
    target: 100,
  },
  {
    id: "lailahaillallah",
    arabic: "لَا إِلٰهَ إِلَّا اللَّهُ",
    transliteration: "La ilaha illallah",
    meaning: "There is no deity worthy of worship except Allah",
    target: 100,
  },
  {
    id: "durood",
    arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَآلِ مُحَمَّدٍ",
    transliteration: "Allahumma Salli Ala Muhammadin wa Aali Muhammad",
    meaning: "O Allah, send blessings upon Muhammad and the Family of Muhammad",
    target: 100,
  },
  {
    id: "hawqala",
    arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ",
    transliteration: "La hawla wa la quwwata illa billah",
    meaning: "There is no power nor might except with Allah, the Most High, the Supreme",
    target: 100,
  },
];

export default function DigitalTasbeeh() {
  const [selectedPreset, setSelectedPreset] = useState<DhikrPreset>(PRESETS[0]);
  const [count, setCount] = useState<number>(0);
  const [totalToday, setTotalToday] = useState<number>(0);
  const [completedLaps, setCompletedLaps] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [vibrateEnabled, setVibrateEnabled] = useState<boolean>(true);
  const [targetLimit, setTargetLimit] = useState<number>(33);
  const [isPressing, setIsPressing] = useState<boolean>(false);

  // Play subtle synthesis click sound
  const playClickSound = () => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // AudioContext fallback
    }
  };

  const handleTap = () => {
    setIsPressing(true);
    setTimeout(() => setIsPressing(false), 120);

    // Haptic feedback
    if (vibrateEnabled && typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(30);
    }

    playClickSound();

    const newCount = count + 1;
    setTotalToday((prev) => prev + 1);

    if (targetLimit > 0 && newCount >= targetLimit) {
      setCount(0);
      setCompletedLaps((prev) => prev + 1);
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate([60, 50, 100]);
      }
      toast.success(`Alhamdulillah! Completed lap of ${targetLimit} ${selectedPreset.transliteration}`, {
        icon: "✨",
      });
    } else {
      setCount(newCount);
    }
  };

  const handleReset = () => {
    if (count > 0) {
      setCount(0);
      toast("Tasbeeh counter reset", { icon: "🔄" });
    }
  };

  const selectPreset = (preset: DhikrPreset) => {
    setSelectedPreset(preset);
    setTargetLimit(preset.target);
    setCount(0);
  };

  const progressPercent = targetLimit > 0 ? Math.min(100, Math.round((count / targetLimit) * 100)) : 0;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Info */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Electronic Misbaha & Dhikr Counter</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif text-white font-bold">
          Digital Tasbeeh Counter
        </h2>
        <p className="text-xs sm:text-sm text-emerald-200/80 max-w-lg mx-auto">
          Keep your tongue moist with the remembrance of Allah through mindful counting, haptic beats, and daily goals.
        </p>
      </div>

      {/* Main Interactive Counter Shell */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Preset Adhkar Selector */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300/90 px-1">
            Select Dhikr
          </h3>
          <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
            {PRESETS.map((preset) => {
              const isSelected = selectedPreset.id === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => selectPreset(preset)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? "bg-amber-400/20 border-amber-400 text-white shadow-lg shadow-amber-400/10"
                      : "bg-black/30 border-white/10 text-emerald-100/80 hover:bg-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{preset.transliteration}</span>
                      <span className="text-[10px] bg-emerald-950/80 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30 font-semibold">
                        {preset.target}x
                      </span>
                    </div>
                    <div className="text-xs text-amber-200/90 font-arabic text-right dir-rtl">
                      {preset.arabic}
                    </div>
                    <div className="text-[11px] text-emerald-200/60 line-clamp-1">
                      {preset.meaning}
                    </div>
                  </div>
                  {isSelected && <Check className="w-5 h-5 text-amber-400 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: The Interactive Digital Tasbeeh Device */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full max-w-sm glass-container rounded-[2.5rem] p-6 sm:p-8 border border-white/20 shadow-2xl relative flex flex-col items-center bg-gradient-to-b from-[#063326]/90 via-[#04241b]/95 to-[#021812]/98">
            {/* Top Device Controls: Sound / Vibrate / Target */}
            <div className="w-full flex items-center justify-between pb-4 border-b border-white/10 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  title={soundEnabled ? "Mute audio" : "Enable click sound"}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                    soundEnabled
                      ? "bg-amber-400/20 border-amber-400/50 text-amber-300"
                      : "bg-black/30 border-white/10 text-emerald-200/50"
                  }`}
                >
                  {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>

                <button
                  onClick={() => setVibrateEnabled(!vibrateEnabled)}
                  title={vibrateEnabled ? "Disable vibration" : "Enable haptic vibration"}
                  className={`px-2.5 py-1.5 rounded-xl border font-bold text-[11px] transition-colors cursor-pointer ${
                    vibrateEnabled
                      ? "bg-amber-400/20 border-amber-400/50 text-amber-300"
                      : "bg-black/30 border-white/10 text-emerald-200/50"
                  }`}
                >
                  Vibrate
                </button>
              </div>

              {/* Target Limit Selector */}
              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-[11px] font-bold">
                {[33, 99, 100, 0].map((tVal) => (
                  <button
                    key={tVal}
                    onClick={() => {
                      setTargetLimit(tVal);
                      setCount(0);
                    }}
                    className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                      targetLimit === tVal
                        ? "bg-amber-400 text-emerald-950 font-black shadow-xs"
                        : "text-emerald-200/70 hover:text-white"
                    }`}
                  >
                    {tVal === 0 ? "∞" : tVal}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Active Dhikr Display */}
            <div className="my-5 text-center space-y-1.5">
              <span className="text-xl sm:text-2xl font-arabic font-bold text-amber-300 drop-shadow-[0_2px_8px_rgba(251,191,36,0.3)] block">
                {selectedPreset.arabic}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-white/90 block">
                {selectedPreset.transliteration}
              </span>
              <span className="text-[11px] text-emerald-200/70 block italic">
                "{selectedPreset.meaning}"
              </span>
            </div>

            {/* LCD Digital Display Screen */}
            <div className="w-full bg-black/60 rounded-2xl p-4 border border-emerald-500/30 shadow-inner flex flex-col items-center justify-center my-2">
              <div className="text-[10px] uppercase font-mono tracking-widest text-emerald-400/70 flex items-center justify-between w-full px-2 mb-1">
                <span>LAPS: {completedLaps}</span>
                <span>{targetLimit > 0 ? `GOAL: ${targetLimit}` : "FREE"}</span>
              </div>
              <div className="font-mono text-5xl sm:text-6xl font-black text-amber-300 tracking-wider drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">
                {String(count).padStart(3, "0")}
              </div>
              {targetLimit > 0 && (
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-200"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              )}
            </div>

            {/* The Main Round Tap Button */}
            <div className="my-6 relative flex items-center justify-center">
              {/* Pulsing Backlight Ring */}
              <div className="absolute w-44 h-44 rounded-full bg-amber-400/10 blur-xl pointer-events-none" />

              <button
                onClick={handleTap}
                className={`relative w-36 h-36 sm:w-40 sm:h-40 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-150 select-none shadow-2xl cursor-pointer ${
                  isPressing
                    ? "scale-95 bg-gradient-to-br from-amber-400 to-amber-600 border-amber-200 shadow-[0_0_35px_rgba(251,191,36,0.8)]"
                    : "bg-gradient-to-br from-emerald-800/90 via-emerald-900 to-[#04241b] border-amber-400/60 hover:border-amber-400 hover:shadow-[0_0_25px_rgba(251,191,36,0.35)]"
                }`}
              >
                <span className={`text-xs uppercase font-bold tracking-widest transition-colors ${
                  isPressing ? "text-emerald-950 font-black" : "text-amber-300/80"
                }`}>
                  TAP DHIKR
                </span>
                <span className={`text-2xl font-bold font-mono transition-colors ${
                  isPressing ? "text-emerald-950 font-black" : "text-white"
                }`}>
                  +1
                </span>
              </button>
            </div>

            {/* Bottom Actions: Reset Counter */}
            <div className="w-full flex items-center justify-between pt-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs text-emerald-200/70 hover:text-amber-300 transition-colors px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>

              <div className="flex items-center gap-1.5 text-xs text-emerald-200/70">
                <Trophy size={14} className="text-amber-400" />
                <span>Session Total: <strong className="text-white">{totalToday}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
