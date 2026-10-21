"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  RotateCcw, Volume2, VolumeX, Sparkles, Award
} from "lucide-react";
import toast from "react-hot-toast";

type TasbeehMode = "fatima-zahra" | "salawat" | "istighfar" | "arbaah" | "yunusiya" | "free";

export default function DigitalTasbeeh() {
  const [mode, setMode] = useState<TasbeehMode>("fatima-zahra");
  const [counter, setCounter] = useState(0);
  const [fatimaPhase, setFatimaPhase] = useState<0 | 1 | 2>(0); // 0: Allahu Akbar (34), 1: Alhamdulillah (33), 2: SubhanAllah (33)
  const [totalCycles, setTotalCycles] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const fatimaPhases = useMemo(() => [
    { name: "Allahu Akbar", arabic: "اللهُ أَكْبَرُ", meaning: "Allah is the Greatest", limit: 34, color: "text-amber-400" },
    { name: "Alhamdulillah", arabic: "الْحَمْدُ لِلَّهِ", meaning: "All praise belongs to Allah", limit: 33, color: "text-emerald-300" },
    { name: "SubhanAllah", arabic: "سُبْحَانَ اللَّهِ", meaning: "Glory be to Allah", limit: 33, color: "text-sky-300" }
  ], []);

  const TASBEEH_CONFIG: Record<
    Exclude<TasbeehMode, "fatima-zahra">,
    {
      title: string;
      arabic: string;
      transliteration: string;
      meaning: string;
      limit: number | null;
      color: string;
      hadithSource: string;
      hadithText: string;
    }
  > = useMemo(() => ({
    salawat: {
      title: "Salawat 'Ala Muhammad wa Aali Muhammad",
      arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَآلِ مُحَمَّد",
      transliteration: "Allahumma Salli 'Ala Muhammadin wa Aali Muhammad",
      meaning: "O Allah, bless Muhammad and the Family of Muhammad",
      limit: 100,
      color: "text-amber-300",
      hadithSource: "Sunnah of the Holy Prophet (SAWW)",
      hadithText: "Abundant recitation of Salawat brings profound peace, divine mercy, and elevation of spiritual status.",
    },
    istighfar: {
      title: "Astaghfirullah (Repentance)",
      arabic: "أَسْتَغْفِرُ اللَّهَ رَبِّي وَأَتُوبُ إِلَيْه",
      transliteration: "Astaghfirullaha Rabbi wa Atubu Ilayh",
      meaning: "I seek forgiveness of Allah, my Lord, and to Him I turn in repentance",
      limit: 100,
      color: "text-emerald-300",
      hadithSource: "Prophetic Sunnah & Classical Traditions",
      hadithText: "The Holy Prophet (SAWW) said: 'Whoever continuously seeks forgiveness, Allah will make for him from every distress a way out, and from every anxiety relief.'",
    },
    arbaah: {
      title: "Tasbihat al-Arba'ah",
      arabic: "سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَر",
      transliteration: "SubhanAllahi wal-Hamdu Lillahi wa La Ilaha Illallah Wallahu Akbar",
      meaning: "Glory be to Allah, all praise is for Allah, there is no god but Allah, and Allah is the Greatest",
      limit: 100,
      color: "text-sky-300",
      hadithSource: "Essential Daily Tasbihat",
      hadithText: "The enduring good deeds (Al-Baqiyat al-Salihat) that erase misdeeds and establish light in the heart of the believer.",
    },
    yunusiya: {
      title: "Dhikr Yunus (Ayah al-Yunusiya)",
      arabic: "لَّا إِلَهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ",
      transliteration: "La Ilaha Illa Anta Subhanaka Inni Kuntu Minaz-Zalimeen",
      meaning: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers. (Surah Al-Anbiya 21:87)",
      limit: 40,
      color: "text-amber-300",
      hadithSource: "Holy Quran (21:87) & Authentic Prophetic Hadith",
      hadithText: "The supplication of Prophet Yunus (AS) in the belly of the whale. The Prophet (SAWW) stated: 'No Muslim supplicates with it for any matter except that Allah answers their prayer.'",
    },
    free: {
      title: "Free Counter (Wird-e-Khas / Any Dhikr)",
      arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      transliteration: "Bismillahir-Rahmanir-Rahim",
      meaning: "In the Name of Allah, the Most Gracious, the Most Merciful • Count Without Limit",
      limit: null,
      color: "text-amber-200",
      hadithSource: "Holy Quran — Surah Al-Ahzab (33:41)",
      hadithText: "'O you who have believed, remember Allah with much remembrance.' Tap freely for any personal wird, wazifa, or post-prayer dhikr.",
    },
  }), []);

  // Web Audio click synth
  const playClickSound = () => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(640, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch {
      // AudioContext unavailable or blocked
    }
  };

  const handleTap = () => {
    playClickSound();
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try { navigator.vibrate(25); } catch {}
    }

    if (mode === "fatima-zahra") {
      const currentTarget = fatimaPhases[fatimaPhase].limit;
      if (counter + 1 < currentTarget) {
        setCounter(c => c + 1);
      } else {
        // Phase transition
        if (fatimaPhase < 2) {
          setFatimaPhase((p) => (p + 1) as 1 | 2);
          setCounter(0);
          toast.success(`Completed ${fatimaPhases[fatimaPhase].name}! Now: ${fatimaPhases[fatimaPhase + 1].name}`, { icon: "✨" });
        } else {
          // Completed entire Tasbeeh Zahra!
          setFatimaPhase(0);
          setCounter(0);
          setTotalCycles(c => c + 1);
          toast.success("Masha'Allah! Completed 1 Full Tasbeeh of Sayyida Fatima (SA)!", { 
            icon: "🌸", 
            duration: 4000 
          });
        }
      }
    } else {
      const config = TASBEEH_CONFIG[mode];
      if (config.limit !== null && counter + 1 >= config.limit) {
        setCounter(0);
        setTotalCycles(c => c + 1);
        toast.success(`Masha'Allah! Completed cycle of ${config.limit} for ${config.title}!`, { icon: "🎉" });
      } else {
        setCounter(c => c + 1);
      }
    }
  };

  const resetCounter = () => {
    setCounter(0);
    setFatimaPhase(0);
    toast("Tasbeeh counter reset", { icon: "🔄" });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Info */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Electronic Misbaha &amp; Dhikr Companion</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif text-white font-bold">
          Digital Tasbeeh
        </h2>
        <p className="text-emerald-100/70 text-xs sm:text-sm max-w-xl mx-auto">
          Featuring the authentic Tasbih of Sayyida Fatima al-Zahra (SA) and universal Sunnah dhikr with automatic phase advancement, Web Audio click synthesis, and lap tracking.
        </p>
      </div>

      {/* Main Tasbeeh Card */}
      <div className="max-w-2xl mx-auto bg-gradient-to-b from-[#032219]/95 via-[#021811]/95 to-[#01100b]/95 border border-white/15 rounded-3xl p-6 sm:p-10 text-center shadow-2xl relative overflow-hidden backdrop-blur-xl">
        {/* Ambient Golden Glow in background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-amber-400/10 blur-3xl pointer-events-none -z-0" />

        {/* Mode Selector */}
        <div className="relative z-10 flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-6">
          {[
            { id: "fatima-zahra", label: "Tasbih Fatima Zahra (SA)" },
            { id: "salawat", label: "Salawat (100)" },
            { id: "istighfar", label: "Astaghfirullah (100)" },
            { id: "arbaah", label: "Tasbihat Arba'ah (100)" },
            { id: "yunusiya", label: "Dhikr Yunus (40)" },
            { id: "free", label: "Free Counter" },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setMode(m.id as TasbeehMode);
                setCounter(0);
                setFatimaPhase(0);
              }}
              className={`text-[11px] sm:text-xs px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                mode === m.id
                  ? "bg-amber-400 text-emerald-950 shadow-xs"
                  : "bg-white/5 text-emerald-200/70 hover:bg-white/10 hover:text-white border border-white/5"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Current Dhikr Display */}
        <div className="relative z-10 my-4 min-h-[110px] flex flex-col items-center justify-center">
          {mode === "fatima-zahra" ? (
            <motion.div
              key={fatimaPhase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center"
            >
              <div className="text-xs uppercase tracking-widest text-amber-300 font-bold mb-1">
                Step {fatimaPhase + 1} of 3 • Recite {fatimaPhases[fatimaPhase].limit} Times
              </div>
              <div className={`text-3xl sm:text-4xl md:text-5xl font-arabic font-bold ${fatimaPhases[fatimaPhase].color} mb-1 drop-shadow-md`}>
                {fatimaPhases[fatimaPhase].arabic}
              </div>
              <div className="text-white text-base sm:text-lg font-semibold">
                {fatimaPhases[fatimaPhase].name}
              </div>
              <div className="text-emerald-200/60 text-xs italic">
                &ldquo;{fatimaPhases[fatimaPhase].meaning}&rdquo;
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center px-4"
            >
              <div className={`text-2xl sm:text-3xl md:text-4xl font-arabic font-bold ${TASBEEH_CONFIG[mode].color} mb-2 drop-shadow-md text-center leading-relaxed`}>
                {TASBEEH_CONFIG[mode].arabic}
              </div>
              <div className="text-white text-sm sm:text-base font-semibold text-center mb-1">
                {TASBEEH_CONFIG[mode].transliteration}
              </div>
              <div className="text-emerald-200/70 text-xs italic text-center max-w-lg">
                &ldquo;{TASBEEH_CONFIG[mode].meaning}&rdquo;
              </div>
            </motion.div>
          )}
        </div>

        {/* BIG INTERACTIVE CIRCULAR TAP AREA */}
        <div className="relative z-10 flex flex-col items-center justify-center my-6">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={handleTap}
            className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-emerald-950 via-[#0a382a] to-emerald-900 border-4 border-amber-400/60 shadow-[0_0_50px_rgba(251,191,36,0.25)] flex flex-col items-center justify-center group cursor-pointer transition-all hover:border-amber-400 hover:shadow-[0_0_65px_rgba(251,191,36,0.4)]"
          >
            {/* Outer Decorative Dashed Ring */}
            <div className="absolute inset-1.5 rounded-full border border-dashed border-amber-300/30 animate-spin-slow pointer-events-none" />

            <span className="text-5xl sm:text-6xl font-mono font-black text-amber-300 group-hover:scale-105 transition-transform drop-shadow-lg">
              {counter}
            </span>
            <span className="text-xs uppercase tracking-wider text-emerald-200/70 mt-1 font-bold">
              {mode === "fatima-zahra"
                ? `/ ${fatimaPhases[fatimaPhase].limit}`
                : TASBEEH_CONFIG[mode].limit !== null
                ? `/ ${TASBEEH_CONFIG[mode].limit}`
                : "Free Count (∞)"}
            </span>
            <span className="text-[11px] text-amber-300/75 mt-2 bg-black/40 px-3 py-0.5 rounded-full border border-amber-400/20">
              Tap to Count
            </span>
          </motion.button>
        </div>

        {/* Bottom Bar: Sound Toggle, Cycles Completed, Reset */}
        <div className="relative z-10 flex items-center justify-between pt-6 border-t border-white/10 text-xs text-emerald-200/70">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-1.5 hover:text-white transition p-2 rounded-lg hover:bg-white/5 cursor-pointer"
          >
            {soundEnabled ? <Volume2 size={16} className="text-amber-400" /> : <VolumeX size={16} className="text-red-400" />}
            <span>{soundEnabled ? "Audio Click On" : "Audio Muted"}</span>
          </button>

          <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
            <Award size={14} className="text-amber-400" />
            <span>Laps Completed: <strong className="text-white">{totalCycles}</strong></span>
          </div>

          <button
            onClick={resetCounter}
            className="flex items-center gap-1.5 hover:text-white transition p-2 rounded-lg hover:bg-white/5 cursor-pointer"
            title="Reset Counter"
          >
            <RotateCcw size={16} className="text-amber-400" />
            <span>Reset</span>
          </button>
        </div>

        {/* Historical / Hadith Note */}
        <div className="mt-6 text-left bg-emerald-950/60 border border-emerald-500/20 rounded-2xl p-4 text-xs text-emerald-100/80 leading-relaxed">
          <strong className="text-amber-300 block mb-1">
            {mode === "fatima-zahra"
              ? "Authentic Hadith of the Holy Prophet (SAWW):"
              : `${TASBEEH_CONFIG[mode].hadithSource}:`}
          </strong>
          {mode === "fatima-zahra"
            ? "The Messenger of Allah (SAWW) bestowed this remembrance upon his daughter Sayyida Fatima al-Zahra (SA) as superior to any worldly possession (Sahih Bukhari & Sahih Muslim). Imam Ja'far al-Sadiq (AS) affirmed: 'Reciting Tasbih Fatima Zahra after every obligatory prayer is more beloved to me than offering a thousand units of optional prayer daily.'"
            : TASBEEH_CONFIG[mode].hadithText}
        </div>
      </div>
    </div>
  );
}
