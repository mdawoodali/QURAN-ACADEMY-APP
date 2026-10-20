"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  RotateCcw, Volume2, VolumeX, Sparkles, BookOpen, Clock, Heart, 
  Search, Download, Share2, Copy, Check, ChevronRight, X, Shield, 
  MapPin, Calendar, Compass, Info, Award
} from "lucide-react";
import toast from "react-hot-toast";
import { 
  SHIA_DUAS_ZIYARAT, ShiaDua, 
  SHIA_AHKAM_GUIDES, AhkamGuide,
  MASOOMEEN_CALENDAR, MasoomeenDate,
  SHIA_PRAYER_METHOD_INFO
} from "@/data/shiaToolkitData";

interface ShiaToolkitProps {
  initialTab?: "tasbeeh" | "duas" | "prayer-times" | "ahkam" | "calendar";
}

export default function ShiaToolkit({ initialTab = "tasbeeh" }: ShiaToolkitProps) {
  const [activeSubTab, setActiveSubTab] = useState<"tasbeeh" | "duas" | "prayer-times" | "ahkam" | "calendar">(initialTab);

  // -------------------------------------------------------------
  // 1. DIGITAL TASBEEH OF SAYYIDA FATIMA ZAHRA (SA) STATE
  // -------------------------------------------------------------
  type TasbeehMode = "fatima-zahra" | "salawat" | "istighfar" | "arbaah" | "yunusiya" | "free";
  const [mode, setMode] = useState<TasbeehMode>("fatima-zahra");
  const [counter, setCounter] = useState(0);
  const [fatimaPhase, setFatimaPhase] = useState<0 | 1 | 2>(0); // 0: Allahu Akbar (34), 1: Alhamdulillah (33), 2: SubhanAllah (33)
  const [totalCycles, setTotalCycles] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fatimaPhases = useMemo(() => [
    { name: "Allahu Akbar", arabic: "اللهُ أَكْبَرُ", meaning: "Allah is the Greatest", limit: 34, color: "text-amber-400" },
    { name: "Alhamdulillah", arabic: "الْحَمْدُ لِلَّهِ", meaning: "All praise belongs to Allah", limit: 33, color: "text-emerald-300" },
    { name: "SubhanAllah", arabic: "سُبْحَانَ اللَّهِ", meaning: "Glory be to Allah", limit: 33, color: "text-sky-300" }
  ], []);

  // Web Audio click synth
  const playClickSound = () => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
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
      const limit = mode === "yunusiya" ? 40 : 100;
      if (mode !== "free" && counter + 1 >= limit) {
        setCounter(0);
        setTotalCycles(c => c + 1);
        toast.success(`Completed cycle of 100!`, { icon: "🎉" });
      } else {
        setCounter(c => c + 1);
      }
    }
  };

  const resetCounter = () => {
    setCounter(0);
    setFatimaPhase(0);
  };

  // -------------------------------------------------------------
  // 2. DUAS & ZIYARAT READER MODAL STATE
  // -------------------------------------------------------------
  const [selectedDua, setSelectedDua] = useState<ShiaDua | null>(null);
  const [duaSearch, setDuaSearch] = useState("");

  const filteredDuas = useMemo(() => {
    const q = duaSearch.toLowerCase();
    return SHIA_DUAS_ZIYARAT.filter(d => 
      d.title.toLowerCase().includes(q) ||
      d.arabicTitle.includes(q) ||
      d.shortDesc.toLowerCase().includes(q) ||
      d.occasion.toLowerCase().includes(q)
    );
  }, [duaSearch]);

  const handleCopyDua = (dua: ShiaDua) => {
    const text = `${dua.title} (${dua.arabicTitle})\nSource: ${dua.source}\n\n` +
      dua.paragraphs.map((p, i) => `[${i+1}]\nArabic: ${p.arabic}\nTransliteration: ${p.transliteration}\nTranslation: ${p.translation}`).join("\n\n");
    navigator.clipboard.writeText(text);
    setCopiedId(dua.id);
    setTimeout(() => setCopiedId(null), 2500);
    toast.success("Copied to clipboard!");
  };

  const handleDownloadDua = (dua: ShiaDua) => {
    const content = `======================================================
QURAN LEARN ACADEMY — SHIA TOOLKIT
${dua.title.toUpperCase()} (${dua.arabicTitle})
Source: ${dua.source}
Occasion: ${dua.occasion}
======================================================

${dua.fullDesc}

======================================================
RECITATION (ARABIC, TRANSLITERATION & TRANSLATION):
======================================================

${dua.paragraphs.map((p, i) => `
[${i + 1}]
ARABIC:
${p.arabic}

TRANSLITERATION:
${p.transliteration}

TRANSLATION:
${p.translation}
------------------------------------------------------`).join("\n")}

======================================================
Downloaded from Quran Learn Academy Shia Toolkit
https://quranlearnacademy.com/resources
======================================================`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${dua.slug}-shia-toolkit.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${dua.title}`);
  };

  // -------------------------------------------------------------
  // 3. SHIA JA'FARI PRAYER TIMES
  // -------------------------------------------------------------
  const [selectedCity, setSelectedCity] = useState("Karachi");
  const CITIES_PRAYER_DATA: Record<string, {
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    sunset: string;
    maghrib: string;
    isha: string;
    midnight: string;
    timezone: string;
  }> = {
    "Karachi": { fajr: "05:14", sunrise: "06:31", dhuhr: "12:18", asr: "15:42", sunset: "18:04", maghrib: "18:22", isha: "19:26", midnight: "23:48", timezone: "PKT (UTC+5)" },
    "Islamabad": { fajr: "05:04", sunrise: "06:26", dhuhr: "12:08", asr: "15:28", sunset: "17:49", maghrib: "18:08", isha: "19:16", midnight: "23:36", timezone: "PKT (UTC+5)" },
    "Lahore": { fajr: "04:58", sunrise: "06:19", dhuhr: "12:04", asr: "15:25", sunset: "17:48", maghrib: "18:07", isha: "19:14", midnight: "23:33", timezone: "PKT (UTC+5)" },
    "Najaf": { fajr: "04:55", sunrise: "06:15", dhuhr: "12:05", asr: "15:29", sunset: "17:53", maghrib: "18:11", isha: "19:17", midnight: "23:33", timezone: "AST (UTC+3)" },
    "Karbala": { fajr: "04:56", sunrise: "06:16", dhuhr: "12:06", asr: "15:30", sunset: "17:54", maghrib: "18:12", isha: "19:18", midnight: "23:34", timezone: "AST (UTC+3)" },
    "London": { fajr: "05:32", sunrise: "07:35", dhuhr: "12:54", asr: "15:38", sunset: "18:12", maghrib: "18:31", isha: "19:50", midnight: "00:01", timezone: "BST (UTC+1)" },
    "New York": { fajr: "05:46", sunrise: "07:12", dhuhr: "12:47", asr: "15:52", sunset: "18:21", maghrib: "18:39", isha: "19:53", midnight: "00:03", timezone: "EDT (UTC-4)" },
    "Toronto": { fajr: "05:58", sunrise: "07:26", dhuhr: "13:08", asr: "16:16", sunset: "18:49", maghrib: "19:07", isha: "20:21", midnight: "00:23", timezone: "EDT (UTC-4)" },
    "Dubai": { fajr: "05:02", sunrise: "06:20", dhuhr: "12:15", asr: "15:37", sunset: "18:08", maghrib: "18:25", isha: "19:28", midnight: "23:45", timezone: "GST (UTC+4)" }
  };

  const currentTimes = CITIES_PRAYER_DATA[selectedCity] || CITIES_PRAYER_DATA["Karachi"];

  // -------------------------------------------------------------
  // 4. SHIA AHKAM MODAL STATE
  // -------------------------------------------------------------
  const [selectedAhkam, setSelectedAhkam] = useState<AhkamGuide | null>(null);

  return (
    <div className="w-full">
      {/* TOOLKIT SUB-NAVBAR */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8 bg-black/40 border border-white/10 p-2 rounded-2xl backdrop-blur-md max-w-4xl mx-auto">
        {[
          { key: "tasbeeh", label: "Digital Tasbeeh Zahra (SA)", icon: Heart },
          { key: "duas", label: "Duas & Ziyarat", icon: BookOpen },
          { key: "prayer-times", label: "Ja'fari Prayer Schedule", icon: Clock },
          { key: "ahkam", label: "Wudhu & Salat Ahkam", icon: Shield },
          { key: "calendar", label: "14 Infallibles Calendar", icon: Calendar },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveSubTab(key as any)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSubTab === key
                ? "bg-amber-400 text-emerald-950 shadow-md scale-105"
                : "text-emerald-100/80 hover:text-white hover:bg-white/10"
            }`}
          >
            <Icon size={16} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* ========================================================= */}
      {/* 1. DIGITAL TASBEEH OF SAYYIDA FATIMA AL-ZAHRA (SA)        */}
      {/* ========================================================= */}
      {activeSubTab === "tasbeeh" && (
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
                  resetCounter();
                }}
                className={`text-[11px] sm:text-xs px-3 py-1.5 rounded-full font-bold transition-all ${
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
          <div className="relative z-10 my-4 min-h-[90px] flex flex-col items-center justify-center">
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
                  "{fatimaPhases[fatimaPhase].meaning}"
                </div>
              </motion.div>
            ) : mode === "salawat" ? (
              <div>
                <div className="text-2xl sm:text-3xl font-arabic font-bold text-amber-300 mb-1">
                  اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَآلِ مُحَمَّد
                </div>
                <div className="text-white text-sm font-semibold">Allahumma Salli 'Ala Muhammadin wa Aali Muhammad</div>
              </div>
            ) : mode === "istighfar" ? (
              <div>
                <div className="text-2xl sm:text-3xl font-arabic font-bold text-emerald-300 mb-1">
                  أَسْتَغْفِرُ اللَّهَ رَبِّي وَأَتُوبُ إِلَيْه
                </div>
                <div className="text-white text-sm font-semibold">Astaghfirullaha Rabbi wa Atubu Ilayh</div>
              </div>
            ) : mode === "arbaah" ? (
              <div>
                <div className="text-xl sm:text-2xl font-arabic font-bold text-sky-300 mb-1">
                  سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَر
                </div>
                <div className="text-white text-xs font-semibold">SubhanAllahi wal-Hamdu Lillahi wa La Ilaha Illallah Wallahu Akbar</div>
              </div>
            ) : (
              <div>
                <div className="text-xl sm:text-2xl font-arabic font-bold text-amber-300 mb-1">
                  لَّا إِلَهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ
                </div>
                <div className="text-white text-xs font-semibold">La Ilaha Illa Anta Subhanaka Inni Kuntu Minaz-Zalimeen</div>
              </div>
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
                {mode === "fatima-zahra" ? `/ ${fatimaPhases[fatimaPhase].limit}` : mode === "free" ? "Count" : `/ 100`}
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
              className="flex items-center gap-1.5 hover:text-white transition p-2 rounded-lg hover:bg-white/5"
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
              className="flex items-center gap-1.5 hover:text-white transition p-2 rounded-lg hover:bg-white/5"
              title="Reset Counter"
            >
              <RotateCcw size={16} className="text-amber-400" />
              <span>Reset</span>
            </button>
          </div>

          {/* Historical / Hadith Note */}
          <div className="mt-6 text-left bg-emerald-950/60 border border-emerald-500/20 rounded-2xl p-4 text-xs text-emerald-100/80 leading-relaxed">
            <strong className="text-amber-300 block mb-1">Authentic Hadith of the Holy Prophet (SAWW):</strong>
            "The Prophet (SAWW) bestowed this remembrance upon his daughter Sayyida Fatima al-Zahra (SA) as superior to any worldly possession. Imam Ja'far al-Sadiq (AS) affirmed: 'Reciting Tasbih Fatima Zahra after every obligatory prayer is more beloved to me than offering a thousand units of optional prayer daily.'"
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. DUAS & ZIYARAT TAB                                     */}
      {/* ========================================================= */}
      {activeSubTab === "duas" && (
        <div>
          {/* Search Bar */}
          <div className="max-w-xl mx-auto mb-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-200/50" size={18} />
            <input
              type="text"
              value={duaSearch}
              onChange={(e) => setDuaSearch(e.target.value)}
              placeholder="Search Ziyarat Ashura, Dua Kumayl, Tawassul, Ahad..."
              className="w-full bg-black/40 border border-white/20 rounded-2xl pl-12 pr-4 py-3 text-sm text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 backdrop-blur-md"
            />
          </div>

          {/* Duas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDuas.map((dua) => (
              <motion.div
                key={dua.id}
                whileHover={{ y: -4 }}
                className="bg-gradient-to-b from-[#032219]/90 to-[#021811]/90 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-amber-400/40 transition-all shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-amber-300 font-bold mb-3">
                    <span className="bg-amber-400/10 px-2.5 py-1 rounded-md border border-amber-400/20">{dua.occasion}</span>
                    <span className="font-arabic text-lg">{dua.arabicTitle}</span>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-white mb-1.5">{dua.title}</h3>
                  <p className="text-xs text-emerald-200/60 mb-3">{dua.source}</p>
                  <p className="text-xs text-emerald-100/80 leading-relaxed mb-6 font-light">{dua.shortDesc}</p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedDua(dua)}
                    className="flex-1 bg-amber-400 hover:bg-amber-300 text-emerald-950 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <BookOpen size={14} />
                    <span>Read Recitation</span>
                  </button>
                  <button
                    onClick={() => handleDownloadDua(dua)}
                    className="bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-xl transition-all"
                    title="Download Offline Text"
                  >
                    <Download size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. JA'FARI PRAYER TIMES & LIVE CLOCK                      */}
      {/* ========================================================= */}
      {activeSubTab === "prayer-times" && (
        <div className="max-w-4xl mx-auto">
          {/* City Selector */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            <span className="text-xs text-emerald-200/70 font-semibold mr-2 flex items-center gap-1">
              <MapPin size={14} className="text-amber-400" /> Select City:
            </span>
            {Object.keys(CITIES_PRAYER_DATA).map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-bold transition-all ${
                  selectedCity === city
                    ? "bg-amber-400 text-emerald-950 shadow-md"
                    : "bg-black/30 text-emerald-200/70 hover:bg-white/10 hover:text-white border border-white/10"
                }`}
              >
                {city}
              </button>
            ))}
          </div>

          {/* Prayer Time Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { name: "Fajr", arabic: "الفَجْر", time: currentTimes.fajr, desc: "True Dawn (17.7°)" },
              { name: "Sunrise", arabic: "الشُّرُوق", time: currentTimes.sunrise, desc: "Solar Disk Rising" },
              { name: "Dhuhr", arabic: "الظُّهْر", time: currentTimes.dhuhr, desc: "Solar Noon / Zawal" },
              { name: "Asr", arabic: "العَصْر", time: currentTimes.asr, desc: "Afternoon (Joinable with Dhuhr)" },
              { name: "Sunset", arabic: "الغُرُوب", time: currentTimes.sunset, desc: "Solar Disk Descent" },
              { name: "Maghrib", arabic: "المَغْرِب", time: currentTimes.maghrib, desc: "Disappearance of Eastern Redness", highlight: true },
              { name: "Isha", arabic: "العِشَاء", time: currentTimes.isha, desc: "Night (Joinable with Maghrib)" },
              { name: "Midnight", arabic: "نِصْفُ اللَّيْل", time: currentTimes.midnight, desc: "Halfway Sunset to Dawn" },
            ].map((p, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border text-center transition-all ${
                  p.highlight
                    ? "bg-gradient-to-b from-amber-500/20 to-amber-500/5 border-amber-400/50 shadow-lg"
                    : "bg-black/40 border-white/10 hover:border-white/20"
                }`}
              >
                <div className="text-[11px] font-bold text-amber-300 font-arabic mb-0.5">{p.arabic}</div>
                <div className="text-xs uppercase font-bold text-white/90 mb-1">{p.name}</div>
                <div className="text-2xl sm:text-3xl font-mono font-black text-amber-300 mb-1">{p.time}</div>
                <div className="text-[10px] text-emerald-200/60 leading-tight">{p.desc}</div>
              </div>
            ))}
          </div>

          {/* Jurisprudence Explanation Notice */}
          <div className="bg-[#032219]/90 border border-white/15 rounded-2xl p-6 text-left text-xs text-emerald-100/90 leading-relaxed shadow-xl">
            <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2 mb-2">
              <Info size={16} />
              <span>Ja'fari Method & The Sunnah of Joining Prayers (Jam' al-Salatayn)</span>
            </h4>
            <p className="mb-3">
              {SHIA_PRAYER_METHOD_INFO.description}
            </p>
            <p className="bg-black/30 p-3 rounded-xl border border-white/10 text-emerald-100/80">
              <strong className="text-amber-400">Canonical Documentation: </strong>
              {SHIA_PRAYER_METHOD_INFO.combiningNotice}
            </p>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. SHIA AHKAM COMPANION TAB                               */}
      {/* ========================================================= */}
      {activeSubTab === "ahkam" && (
        <div className="max-w-4xl mx-auto space-y-6">
          {SHIA_AHKAM_GUIDES.map((guide) => (
            <div
              key={guide.id}
              className="bg-gradient-to-b from-[#032219]/90 to-[#021811]/90 border border-white/10 rounded-2xl p-6 sm:p-8 text-left shadow-xl"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full border border-amber-400/30">
                  {guide.category} Guidelines
                </span>
                <span className="font-arabic text-lg text-emerald-300">{guide.arabicTitle}</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mb-2">{guide.title}</h3>
              <p className="text-xs sm:text-sm text-emerald-100/80 mb-6 leading-relaxed bg-black/30 p-3 rounded-xl border border-white/10">
                {guide.rulingSummary}
              </p>

              {/* Step Sequence */}
              <div className="space-y-4">
                {guide.steps.map((st) => (
                  <div key={st.stepNumber} className="flex items-start gap-3.5 bg-white/5 p-4 rounded-xl border border-white/5">
                    <span className="w-7 h-7 rounded-full bg-amber-400 text-emerald-950 font-bold text-xs flex items-center justify-center shrink-0">
                      {st.stepNumber}
                    </span>
                    <div className="flex-1">
                      <div className="text-white font-bold text-sm mb-1">{st.title}</div>
                      <div className="text-xs text-emerald-100/80 leading-relaxed">{st.instruction}</div>
                      {st.fiqhNote && (
                        <div className="mt-2 text-[11px] text-amber-300/90 font-medium bg-amber-400/10 p-2 rounded-lg border border-amber-400/20">
                          <strong>Jurisprudential Note: </strong>{st.fiqhNote}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2 text-[11px] text-emerald-200/60">
                <strong className="text-white">Authentic References: </strong>
                {guide.sources.join(" • ")}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. THE 14 INFALLIBLES (MASOOMEEN AS) CALENDAR             */}
      {/* ========================================================= */}
      {activeSubTab === "calendar" && (
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-serif font-bold text-white mb-2">Sacred Timeline of the 14 Infallibles (Chahardah Masoomeen AS)</h3>
            <p className="text-xs sm:text-sm text-emerald-200/70 max-w-2xl mx-auto">
              From the Noble Messenger (SAWW) and Sayyida Fatima al-Zahra (SA) to the 12 Imams (AS). Key dates for Wiladat (joyful celebrations) and Shahadat (commemorations).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MASOOMEEN_CALENDAR.map((m) => (
              <div
                key={m.number}
                className="bg-gradient-to-b from-[#032219]/90 to-[#021811]/90 border border-white/10 rounded-2xl p-5 text-left shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-amber-300 font-bold mb-2">
                    <span className="bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">#{m.number} of 14</span>
                    <span className="text-emerald-200/70 font-mono text-[11px]">{m.kuniyya}</span>
                  </div>
                  <h4 className="text-base sm:text-lg font-serif font-bold text-white mb-0.5">{m.name}</h4>
                  <p className="text-xs text-amber-300/80 mb-3 font-medium">{m.title}</p>

                  <div className="space-y-1.5 text-xs text-emerald-100/80 border-t border-white/10 pt-3">
                    <div><strong className="text-white">Parents:</strong> {m.father} & {m.mother}</div>
                    <div><strong className="text-white">Birth:</strong> {m.birthHijri} ({m.birthLocation})</div>
                    <div><strong className="text-white">Martyrdom:</strong> {m.martyrdomHijri}</div>
                    <div><strong className="text-white">Shrine:</strong> {m.shrineLocation}</div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 text-[11px] bg-black/30 p-2.5 rounded-xl border border-white/5 text-amber-200/90">
                  <strong className="text-amber-400">Key Commemorations: </strong>{m.keyCommemoration}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* IN-APP DUA RECITATION MODAL                               */}
      {/* ========================================================= */}
      <AnimatePresence>
        {selectedDua && (
          <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#021811] border border-amber-400/40 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-black/40">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
                    <span>{selectedDua.occasion}</span>
                    <span>•</span>
                    <span>{selectedDua.source}</span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white flex items-center gap-3">
                    <span>{selectedDua.title}</span>
                    <span className="font-arabic text-amber-300 text-xl font-normal">({selectedDua.arabicTitle})</span>
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyDua(selectedDua)}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
                    title="Copy Text"
                  >
                    {copiedId === selectedDua.id ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                  </button>
                  <button
                    onClick={() => handleDownloadDua(selectedDua)}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
                    title="Download Offline Text"
                  >
                    <Download size={16} />
                  </button>
                  <button
                    onClick={() => setSelectedDua(null)}
                    className="p-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 transition-all cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-8 flex-1 text-left">
                {/* Introduction */}
                <div className="bg-black/30 border border-white/10 rounded-2xl p-4 text-xs text-emerald-100/90 leading-relaxed">
                  <strong className="text-amber-300 block mb-1">Spiritual Merits & Background:</strong>
                  {selectedDua.fullDesc}
                </div>

                {/* Paragraphs */}
                {selectedDua.paragraphs.map((p, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between text-xs text-amber-400/70 border-b border-white/5 pb-2">
                      <span className="font-mono">Verse {idx + 1} of {selectedDua.paragraphs.length}</span>
                    </div>

                    {/* Arabic Text */}
                    <div className="text-right font-arabic text-2xl sm:text-3xl text-amber-300 leading-[2.2] font-semibold" dir="rtl">
                      {p.arabic}
                    </div>

                    {/* Transliteration */}
                    <div className="text-xs sm:text-sm text-sky-200/90 italic font-sans leading-relaxed border-t border-white/5 pt-2">
                      <strong className="text-white/60 not-italic block text-[11px] uppercase mb-0.5">Transliteration:</strong>
                      {p.transliteration}
                    </div>

                    {/* Translation */}
                    <div className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-sans border-t border-white/5 pt-2">
                      <strong className="text-amber-300 block text-[11px] uppercase mb-0.5">English Translation:</strong>
                      {p.translation}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
