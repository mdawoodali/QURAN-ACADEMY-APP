"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  RotateCcw, Volume2, VolumeX, BookOpen, Clock, Heart, 
  Search, Download, Copy, Check, X, Shield, 
  MapPin, Calendar, Info, Award, Compass, Navigation,
  Crosshair, Bell
} from "lucide-react";
import toast from "react-hot-toast";
import { 
  SHIA_DUAS_ZIYARAT, ShiaDua, 
  SHIA_AHKAM_GUIDES,
  MASOOMEEN_CALENDAR,
  SHIA_PRAYER_METHOD_INFO
} from "@/data/shiaToolkitData";
import {
  SHIA_CITIES_DATABASE,
  calculateJafariPrayerTimes,
  calculateQibla,
  getLiveHijriDate,
  CityLocation,
  JafariPrayerTimes
} from "@/lib/prayerMath";

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
      hadithSource: "Imam Ali al-Rida (AS) — Wasail al-Shia",
      hadithText: "Whoever is unable to perform expiation for sins should recite abundant Salawat upon Muhammad and his pure Ahlulbayt, for verily it obliterates sins entirely.",
    },
    istighfar: {
      title: "Astaghfirullah (Repentance)",
      arabic: "أَسْتَغْفِرُ اللَّهَ رَبِّي وَأَتُوبُ إِلَيْه",
      transliteration: "Astaghfirullaha Rabbi wa Atubu Ilayh",
      meaning: "I seek forgiveness of Allah, my Lord, and to Him I turn in repentance",
      limit: 100,
      color: "text-emerald-300",
      hadithSource: "Imam Ali (AS) — Nahj al-Balagha",
      hadithText: "Perfume yourselves with the fragrance of seeking forgiveness (Istighfar), so that the stains of errors do not disfigure your spiritual dignity.",
    },
    arbaah: {
      title: "Tasbihat al-Arba'ah",
      arabic: "سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَر",
      transliteration: "SubhanAllahi wal-Hamdu Lillahi wa La Ilaha Illallah Wallahu Akbar",
      meaning: "Glory be to Allah, all praise is for Allah, there is no god but Allah, and Allah is the Greatest",
      limit: 100,
      color: "text-sky-300",
      hadithSource: "Imam Ja'far al-Sadiq (AS) — Al-Kafi",
      hadithText: "Tasbihat al-Arba'ah is the quintessential praise recited in the 3rd and 4th rak'ahs of daily prayers; it brings protection from tribulations in this world and the hereafter.",
    },
    yunusiya: {
      title: "Dhikr Yunus (Ayah al-Yunusiya)",
      arabic: "لَّا إِلَهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ",
      transliteration: "La Ilaha Illa Anta Subhanaka Inni Kuntu Minaz-Zalimeen",
      meaning: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers. (Surah Al-Anbiya 21:87)",
      limit: 40,
      color: "text-amber-300",
      hadithSource: "Holy Quran (21:87) & Hadith of the Holy Prophet (SAWW)",
      hadithText: "The supplication of Prophet Yunus (AS) in the depths of darkness. The Prophet (SAWW) declared: 'No afflicted believer recites this prayer except that Allah removes their distress.' Ahlulbayt scholars recommend reciting it 40 times in Sujud for relief and spiritual opening.",
    },
    free: {
      title: "Free Counter (Wird-e-Khas / Any Dhikr)",
      arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      transliteration: "Bismillahir-Rahmanir-Rahim",
      meaning: "In the Name of Allah, the Most Gracious, the Most Merciful • Count Without Limit",
      limit: null,
      color: "text-amber-200",
      hadithSource: "Holy Quran — Surah Al-Ahzab (33:41)",
      hadithText: "يَا أَيُّهَا الَّذِينَ آمَنُوا اذْكُرُوا اللَّهَ ذِكْرًا كَثِيرًا • 'O you who believe! Remember Allah with abundant remembrance, and glorify Him morning and afternoon.' Tap freely for any personal wird, nawafl, or prayer.",
    },
  }), []);

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
  // 3. ASTRONOMICAL SHIA JA'FARI PRAYER TIMES ENGINE
  // -------------------------------------------------------------
  const [selectedCityKey, setSelectedCityKey] = useState<string>("Karachi");
  const [customCity, setCustomCity] = useState<CityLocation | null>(null);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [selectedDateStr, setSelectedDateStr] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isPlayingAdhan, setIsPlayingAdhan] = useState(false);

  // Live real-time ticking clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeLocation: CityLocation = useMemo(() => {
    if (customCity) return customCity;
    return SHIA_CITIES_DATABASE[selectedCityKey] || SHIA_CITIES_DATABASE["Karachi"];
  }, [customCity, selectedCityKey]);

  const activeDate = useMemo(() => {
    if (!selectedDateStr) return currentTime;
    const parts = selectedDateStr.split("-").map(Number);
    if (parts.length < 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) return currentTime;
    return new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
  }, [selectedDateStr, currentTime]);

  const prayerTimes: JafariPrayerTimes = useMemo(() => {
    return calculateJafariPrayerTimes(
      activeLocation.lat,
      activeLocation.lng,
      activeLocation.timezone,
      activeDate
    );
  }, [activeLocation, activeDate]);

  const qiblaInfo = useMemo(() => {
    return calculateQibla(activeLocation.lat, activeLocation.lng);
  }, [activeLocation]);

  const hijriDate = useMemo(() => {
    return getLiveHijriDate(activeDate);
  }, [activeDate]);

  // Live countdown to next prayer
  const countdownData = useMemo(() => {
    const utc = currentTime.getTime() + currentTime.getTimezoneOffset() * 60000;
    const cityNow = new Date(utc + 3600000 * activeLocation.timezone);
    const nowMinutes = cityNow.getHours() * 60 + cityNow.getMinutes() + cityNow.getSeconds() / 60;

    const prayers = [
      { key: "fajr", name: "Fajr", arabic: "الفَجْر", desc: "True Dawn (17.7°)", min: prayerTimes.rawMinutes.fajr, time: prayerTimes.fajr },
      { key: "sunrise", name: "Sunrise", arabic: "الشُّرُوق", desc: "Solar Disk Rising", min: prayerTimes.rawMinutes.sunrise, time: prayerTimes.sunrise },
      { key: "dhuhr", name: "Dhuhr", arabic: "الظُّهْر", desc: "Solar Noon / Zawal", min: prayerTimes.rawMinutes.dhuhr, time: prayerTimes.dhuhr },
      { key: "asr", name: "Asr", arabic: "العَصْر", desc: "Afternoon (Joinable with Dhuhr)", min: prayerTimes.rawMinutes.asr, time: prayerTimes.asr },
      { key: "sunset", name: "Sunset", arabic: "الغُرُوب", desc: "Solar Disk Descent", min: prayerTimes.rawMinutes.sunset, time: prayerTimes.sunset },
      { key: "maghrib", name: "Maghrib", arabic: "المَغْرِب", desc: "Eastern Redness Cleared (4.5°)", min: prayerTimes.rawMinutes.maghrib, time: prayerTimes.maghrib, highlight: true },
      { key: "isha", name: "Isha", arabic: "العِشَاء", desc: "Night (Joinable with Maghrib)", min: prayerTimes.rawMinutes.isha, time: prayerTimes.isha },
      { key: "midnight", name: "Midnight", arabic: "نِصْفُ اللَّيْل", desc: "Halfway Sunset to Dawn", min: prayerTimes.rawMinutes.midnight, time: prayerTimes.midnight },
    ];

    let next = prayers.find(p => p.min > nowMinutes);
    let diff = 0;
    if (next) {
      diff = next.min - nowMinutes;
    } else {
      next = prayers[0];
      diff = (1440 - nowMinutes) + next.min;
    }

    const h = Math.floor(diff / 60);
    const m = Math.floor(diff % 60);
    const s = Math.floor((diff * 60) % 60);
    const pad = (v: number) => v.toString().padStart(2, "0");

    return {
      timeFormatted: cityNow.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }),
      nextPrayer: next,
      countdown: `${pad(h)}:${pad(m)}:${pad(s)}`,
      prayers
    };
  }, [currentTime, activeLocation, prayerTimes]);

  const handleDetectLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const tz = -new Date().getTimezoneOffset() / 60;
        setCustomCity({
          name: "My GPS Location",
          country: "Detected Device",
          lat,
          lng,
          timezone: tz,
          timezoneName: `Local Device (UTC${tz >= 0 ? "+" : ""}${tz})`
        });
        setDetectingLocation(false);
        toast.success(`Calibrated: ${lat.toFixed(2)}°N, ${lng.toFixed(2)}°E`, { icon: "📍" });
      },
      (err) => {
        setDetectingLocation(false);
        toast.error(`Could not detect location: ${err.message}`);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const playAdhanChime = () => {
    if (typeof window === "undefined") return;
    try {
      setIsPlayingAdhan(true);
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const notes = [
        { f: 440, d: 0.6 },
        { f: 554.37, d: 0.5 },
        { f: 659.25, d: 0.8 },
        { f: 587.33, d: 0.5 },
        { f: 554.37, d: 0.7 },
        { f: 493.88, d: 0.6 },
        { f: 440, d: 1.2 },
      ];
      let t = ctx.currentTime;
      notes.forEach(({ f, d }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(f, t);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.12, t + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, t + d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + d);
        t += d * 0.9;
      });
      toast.success("Playing Shia Adhan melody cadence", { icon: "🔔" });
      setTimeout(() => setIsPlayingAdhan(false), (t - ctx.currentTime) * 1000);
    } catch {
      setIsPlayingAdhan(false);
    }
  };

  // -------------------------------------------------------------
  // 4. SHIA AHKAM MODAL STATE
  // -------------------------------------------------------------

  return (
    <div className="w-full">
      {/* TOOLKIT SUB-NAVBAR — Symmetrical 5-Item Grid (No Awkward 2nd-line Drop) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-8 bg-black/40 border border-white/10 p-2 rounded-2xl backdrop-blur-md max-w-5xl mx-auto">
        {[
          { key: "tasbeeh", label: "Digital Tasbeeh Zahra (SA)", icon: Heart },
          { key: "duas", label: "Duas & Ziyarat", icon: BookOpen },
          { key: "prayer-times", label: "Ja'fari Prayer Schedule", icon: Clock },
          { key: "ahkam", label: "Wudhu & Salat Ahkam", icon: Shield },
          { key: "calendar", label: "14 Infallibles Calendar", icon: Calendar },
        ].map(({ key, label, icon: Icon }, idx) => (
          <button
            key={key}
            onClick={() => setActiveSubTab(key as typeof activeSubTab)}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer text-center ${
              idx === 4 ? "col-span-2 sm:col-span-1" : ""
            } ${
              activeSubTab === key
                ? "bg-amber-400 text-emerald-950 shadow-md scale-[1.02]"
                : "text-emerald-100/80 hover:text-white hover:bg-white/10"
            }`}
          >
            <Icon size={16} className="shrink-0" />
            <span className="truncate">{label}</span>
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
                  "{fatimaPhases[fatimaPhase].meaning}"
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
                  "{TASBEEH_CONFIG[mode].meaning}"
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
            <strong className="text-amber-300 block mb-1">
              {mode === "fatima-zahra"
                ? "Authentic Hadith of the Holy Prophet (SAWW) & Imam al-Sadiq (AS):"
                : `${TASBEEH_CONFIG[mode].hadithSource}:`}
            </strong>
            {mode === "fatima-zahra"
              ? "The Prophet (SAWW) bestowed this remembrance upon his daughter Sayyida Fatima al-Zahra (SA) as superior to any worldly possession. Imam Ja'far al-Sadiq (AS) affirmed: 'Reciting Tasbih Fatima Zahra after every obligatory prayer is more beloved to me than offering a thousand units of optional prayer daily.'"
              : TASBEEH_CONFIG[mode].hadithText}
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
      {/* 3. ASTRONOMICAL SHIA JA'FARI PRAYER TIMES & LIVE CLOCK    */}
      {/* ========================================================= */}
      {activeSubTab === "prayer-times" && (
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Top Live Dashboard: Current Location, Live Clock, Hijri Date, Geolocation & Adhan */}
          <div className="bg-gradient-to-r from-[#032219] via-[#021811] to-[#01100b] border border-amber-400/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <MapPin size={13} className="text-amber-400" />
                    {activeLocation.name}, {activeLocation.country}
                  </span>
                  <span className="text-xs text-emerald-200/70 font-mono">
                    {activeLocation.timezoneName}
                  </span>
                </div>

                <div className="flex items-baseline gap-3">
                  <h3 className="text-4xl sm:text-5xl font-mono font-black text-white tracking-tight drop-shadow-md">
                    {countdownData.timeFormatted}
                  </h3>
                  <span className="text-xs font-semibold text-emerald-300 uppercase tracking-widest">
                    Live Clock
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-emerald-100/80">
                  <span className="font-arabic text-amber-300 font-bold text-sm">
                    {hijriDate.arabic}
                  </span>
                  <span>•</span>
                  <span>{hijriDate.english}</span>
                </div>
              </div>

              {/* Action Buttons: Geolocation, Adhan Chime & Date */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={handleDetectLocation}
                  disabled={detectingLocation}
                  className="bg-amber-400 hover:bg-amber-300 disabled:opacity-60 text-emerald-950 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Crosshair size={15} className={detectingLocation ? "animate-spin" : ""} />
                  <span>{detectingLocation ? "Calibrating..." : "Detect My Location"}</span>
                </button>

                <button
                  onClick={playAdhanChime}
                  disabled={isPlayingAdhan}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 border border-white/15 transition-all cursor-pointer"
                  title="Test Shia Adhan Melody"
                >
                  <Bell size={15} className={isPlayingAdhan ? "animate-bounce text-amber-400" : "text-amber-400"} />
                  <span>{isPlayingAdhan ? "Playing..." : "Test Adhan"}</span>
                </button>

                <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white">
                  <Calendar size={14} className="text-amber-400 shrink-0" />
                  <input
                    type="date"
                    value={selectedDateStr}
                    onChange={(e) => setSelectedDateStr(e.target.value)}
                    className="bg-transparent text-white text-xs focus:outline-none cursor-pointer"
                  />
                  {selectedDateStr && (
                    <button
                      onClick={() => setSelectedDateStr("")}
                      className="text-xs text-amber-300 hover:text-white ml-1 font-bold"
                      title="Reset to Today"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Next Prayer Glowing Countdown Strip & Qibla Compass */}
            <div className="relative z-10 mt-6 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-black/40 border border-amber-400/40 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-[11px] uppercase font-bold tracking-wider text-amber-300 mb-0.5">
                    Next Prayer Call
                  </div>
                  <div className="text-lg font-bold text-white flex items-center gap-2">
                    <span>{countdownData.nextPrayer.name}</span>
                    <span className="font-arabic text-amber-300 font-normal">({countdownData.nextPrayer.arabic})</span>
                  </div>
                  <div className="text-xs text-emerald-200/60 font-mono mt-0.5">
                    Scheduled at {countdownData.nextPrayer.time}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-mono font-black text-amber-400 drop-shadow-sm">
                    {countdownData.countdown}
                  </div>
                  <div className="text-[10px] text-emerald-200/60 uppercase tracking-widest font-bold">
                    Remaining
                  </div>
                </div>
              </div>

              {/* Qibla Direction Card */}
              <div className="bg-black/40 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-[11px] uppercase font-bold tracking-wider text-emerald-200/70 mb-0.5 flex items-center gap-1">
                    <Compass size={13} className="text-amber-400" />
                    <span>Qibla Heading</span>
                  </div>
                  <div className="text-lg font-bold text-white flex items-center gap-2">
                    <span>{qiblaInfo.angle}° {qiblaInfo.compassDir}</span>
                  </div>
                  <div className="text-xs text-emerald-200/60 mt-0.5">
                    {qiblaInfo.distanceKm.toLocaleString()} km to Holy Kaaba
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-amber-400/40 bg-white/5 flex items-center justify-center relative">
                  <Navigation
                    size={22}
                    className="text-amber-400 transition-transform duration-500"
                    style={{ transform: `rotate(${qiblaInfo.angle}deg)` }}
                  />
                </div>
              </div>

              {/* Shia Sunnah of Jam' al-Salatayn Reminder */}
              <div className="bg-black/40 border border-white/10 rounded-2xl p-4 flex items-center justify-between sm:col-span-2 lg:col-span-1">
                <div>
                  <div className="text-[11px] uppercase font-bold tracking-wider text-amber-300 mb-0.5">
                    Sunnah of Combining
                  </div>
                  <div className="text-xs text-emerald-100/90 leading-snug">
                    Dhuhr & Asr in afternoon, Maghrib & Isha at nightfall may be joined sequentially without distress.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* City Selection Pills */}
          <div className="bg-[#032219]/70 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-3">
              <MapPin size={14} />
              <span>Calibrated Holy Shrines & Global Metropolises:</span>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {customCity && (
                <button
                  onClick={() => setCustomCity(customCity)}
                  className="text-xs px-3.5 py-1.5 rounded-full font-bold transition-all bg-amber-400 text-emerald-950 shadow-md flex items-center gap-1.5"
                >
                  <Crosshair size={13} />
                  <span>GPS: {customCity.name}</span>
                </button>
              )}
              {Object.keys(SHIA_CITIES_DATABASE).map((key) => {
                const c = SHIA_CITIES_DATABASE[key];
                const isActive = !customCity && selectedCityKey === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setCustomCity(null);
                      setSelectedCityKey(key);
                    }}
                    className={`text-xs px-3 py-1.5 rounded-full font-bold transition-all ${
                      isActive
                        ? "bg-amber-400 text-emerald-950 shadow-md scale-105"
                        : "bg-black/40 text-emerald-200/80 hover:bg-white/10 hover:text-white border border-white/10"
                    }`}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 8 Prayer Time Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {countdownData.prayers.map((p, idx) => {
              const isNext = countdownData.nextPrayer.key === p.key;
              return (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border text-center transition-all relative overflow-hidden ${
                    isNext
                      ? "bg-gradient-to-b from-amber-500/25 via-[#0c4030] to-emerald-950/90 border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.3)] ring-2 ring-amber-400/60 scale-[1.02]"
                      : p.highlight
                      ? "bg-gradient-to-b from-amber-500/15 to-amber-500/5 border-amber-400/40 shadow-lg"
                      : "bg-black/40 border-white/10 hover:border-white/20"
                  }`}
                >
                  {isNext && (
                    <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                    </span>
                  )}
                  <div className="text-xs font-bold text-amber-300 font-arabic mb-1">{p.arabic}</div>
                  <div className="text-xs uppercase font-bold text-white/90 mb-1 flex items-center justify-center gap-1">
                    <span>{p.name}</span>
                    {isNext && <span className="text-[10px] text-amber-300 font-mono font-bold">(Next)</span>}
                  </div>
                  <div className="text-3xl sm:text-4xl font-mono font-black text-amber-300 mb-1 drop-shadow-sm">{p.time}</div>
                  <div className="text-[10px] text-emerald-200/70 leading-tight font-medium">{p.desc}</div>
                </div>
              );
            })}
          </div>

          {/* Jurisprudence Explanation Notice */}
          <div className="bg-[#032219]/90 border border-white/15 rounded-3xl p-6 sm:p-8 text-left text-xs sm:text-sm text-emerald-100/90 leading-relaxed shadow-xl">
            <h4 className="text-base font-bold text-amber-300 flex items-center gap-2 mb-3">
              <Info size={18} />
              <span>Ja'fari Method & The Sunnah of Joining Prayers (Jam' al-Salatayn)</span>
            </h4>
            <p className="mb-4">
              {SHIA_PRAYER_METHOD_INFO.description}
            </p>
            <div className="bg-black/40 p-4 rounded-2xl border border-white/10 text-xs text-emerald-100/80 leading-relaxed">
              <strong className="text-amber-400 block mb-1 text-sm font-semibold">Canonical Documentation & Hadith:</strong>
              {SHIA_PRAYER_METHOD_INFO.combiningNotice}
            </div>
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
