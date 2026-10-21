"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  RotateCcw, Volume2, VolumeX, BookOpen, Clock, Heart, Library, 
  Search, Download, Copy, Check, X, Shield, 
  MapPin, Calendar, Info, Award, Compass, Navigation,
  Crosshair, Bell
} from "lucide-react";
import toast from "react-hot-toast";
import { SHIA_LIBRARY_BOOKS, ShiaBook, ShiaBookSection } from "@/data/shiaLibrary";
import { 
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
  initialTab?: "texts" | "tasbeeh" | "ahkam" | "calendar";
}

export default function ShiaToolkit({ initialTab = "texts" }: ShiaToolkitProps) {
  const [activeSubTab, setActiveSubTab] = useState<"texts" | "tasbeeh" | "ahkam" | "calendar">(
    initialTab === ("duas" as unknown) ? "texts" : initialTab
  );
  // -------------------------------------------------------------
  // 0. CLASSICAL REFERENCE TEXTS STATE
  // -------------------------------------------------------------
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [bookSearchQuery, setBookSearchQuery] = useState<string>("");
  const [selectedShiaBook, setSelectedShiaBook] = useState<ShiaBook | null>(null);
  const [selectedShiaSection, setSelectedShiaSection] = useState<ShiaBookSection | null>(null);

  const filteredShiaBooks = useMemo(() => {
    const q = bookSearchQuery.toLowerCase();
    return SHIA_LIBRARY_BOOKS.filter((b) => {
      const matchesSearch =
        b.title.toLowerCase().includes(q) ||
        b.arabicTitle.includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q);
      const matchesCat = selectedCategory === "All" || b.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [bookSearchQuery, selectedCategory]);

  const handleDownloadShiaBook = (book: ShiaBook) => {
    const fileContent = `======================================================
QURAN LEARN ACADEMY - SHIA REFERENCE LIBRARY
${book.title.toUpperCase()} (${book.arabicTitle})
Author: ${book.author}
Compiler: ${book.compiler}
Era: ${book.era}
Licensing: ${book.licensing}
======================================================

OVERVIEW:
${book.description}

TOTAL VOLUMES / SCOPE:
${book.totalSections}

SELECTED EXTRACTS & CORE TRADITIONS:
${book.sections
  .map(
    (s, idx) => `
------------------------------------------------------
[${idx + 1}] ${s.title} (${s.arabicTitle})
Theme: ${s.theme}
Source Citation: ${s.sourceReference}

ARABIC:
${s.arabicText}

ENGLISH TRANSLATION:
${s.englishTranslation}
`
  )
  .join("\n")}

======================================================
Note: Shia Reference Texts in Quran Learn Academy are maintained under educational review and expandable by authorized Academy Administrators.
https://quranlearnacademy.com/resources
======================================================`;

    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = book.downloadFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Exported: ${book.title}`);
  };


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
      {/* UNIFIED 4-ITEM SUB-NAVBAR (Duas & Ziyarat integrated into Daily guides and Duas) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-8 bg-black/40 border border-white/10 p-2 rounded-2xl backdrop-blur-md max-w-5xl mx-auto shadow-xl">
        {[
          { key: "texts", label: "Classical Reference Texts", icon: Library },
          { key: "tasbeeh", label: "Digital Tasbeeh Zahra (SA)", icon: Heart },
          { key: "ahkam", label: "Wudhu & Salat Ahkam", icon: Shield },
          { key: "calendar", label: "14 Infallibles Calendar", icon: Calendar },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveSubTab(key as typeof activeSubTab)}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer text-center ${
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
      {/* 0. CLASSICAL REFERENCE TEXTS (CANONICAL MANUSCRIPTS)      */}
      {/* ========================================================= */}
      {activeSubTab === "texts" && (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
          {/* Header & Search */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {["All", "Sermons & Letters", "Supplications", "Hadith", "Rites & Ziyarat"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-amber-400 text-emerald-950 shadow-sm"
                      : "bg-black/40 text-emerald-100/70 hover:text-white border border-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="w-full sm:w-72 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-200/50" size={16} />
              <input
                type="text"
                value={bookSearchQuery}
                onChange={(e) => setBookSearchQuery(e.target.value)}
                placeholder="Search Nahj al-Balagha, Al-Kafi..."
                className="w-full bg-black/40 border border-white/20 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Shia Books Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredShiaBooks.map((book) => (
              <div
                key={book.id}
                className="glass-container rounded-3xl p-6 sm:p-8 border border-white/15 shadow-xl flex flex-col justify-between pop-hover group text-left"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300">
                      {book.category}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-200/70 bg-emerald-950/60 px-2.5 py-0.5 rounded-lg border border-emerald-800/40">
                      {book.licensing}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-white group-hover:text-amber-300 transition-colors">
                      {book.title}
                    </h3>
                    <span className="font-arabic text-xl sm:text-2xl text-amber-300/90" dir="rtl">
                      {book.arabicTitle}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-emerald-200/90 mb-1">
                    Attributed: <strong className="text-white">{book.author}</strong> • {book.compiler}
                  </p>
                  <p className="text-xs text-emerald-200/60 mb-3">{book.era}</p>
                  <p className="text-emerald-100/80 text-xs sm:text-sm leading-relaxed mb-5">{book.description}</p>

                  <div className="bg-emerald-950/50 border border-emerald-800/30 rounded-xl p-3 text-xs text-emerald-200/80 mb-5">
                    <strong className="text-amber-300">Scope: </strong>
                    {book.totalSections}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-emerald-200/60 font-medium">In-app Reader & Text Export</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedShiaBook(book);
                        setSelectedShiaSection(book.sections[0] || null);
                      }}
                      className="flex items-center gap-1.5 bg-emerald-800/80 hover:bg-emerald-700 text-amber-300 border border-amber-400/30 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                    >
                      <BookOpen size={14} />
                      <span>Read Now</span>
                    </button>
                    <button
                      onClick={() => handleDownloadShiaBook(book)}
                      className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
                    >
                      <Download size={14} />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Catalog Note */}
          <div className="text-center bg-black/30 border border-white/10 rounded-2xl p-5 max-w-2xl mx-auto">
            <p className="text-xs text-emerald-200/70 leading-relaxed">
              <strong className="text-amber-300">Academy Catalog Note:</strong> The Shia Classical Library manuscripts are expandable by Academy Administrators through the Admin Portal, supporting digital transcription, translation verification, and downloadable offline bundles.
            </p>
          </div>
        </div>
      )}

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
      {/* IN-APP READER MODAL FOR SHIA REFERENCE BOOKS              */}
      {/* ========================================================= */}
      <AnimatePresence>
        {selectedShiaBook && (
          <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#031d16] border border-amber-400/40 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Top Bar */}
              <div className="p-6 border-b border-white/15 flex items-center justify-between bg-black/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-800/80 border border-amber-400/40 rounded-xl flex items-center justify-center text-amber-300">
                    <Library size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                      <span>{selectedShiaBook.title}</span>
                      <span className="font-arabic text-lg text-amber-300">({selectedShiaBook.arabicTitle})</span>
                    </h3>
                    <span className="text-xs text-emerald-200/70">{selectedShiaBook.author} • {selectedShiaBook.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadShiaBook(selectedShiaBook)}
                    className="bg-amber-400 text-emerald-950 p-2 rounded-xl hover:bg-amber-300 transition"
                    title="Export Book Content"
                  >
                    <Download size={18} />
                  </button>
                  <button
                    onClick={() => { setSelectedShiaBook(null); setSelectedShiaSection(null); }}
                    className="bg-white/10 text-white p-2 rounded-xl hover:bg-white/20 transition cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Split Reader View */}
              <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
                {/* Left Column: Chapters / Excerpts Index */}
                <div className="w-full md:w-72 bg-black/30 border-b md:border-b-0 md:border-r border-white/10 p-4 overflow-y-auto shrink-0">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300/80 mb-3 px-2">
                    Key Chapters & Discourses
                  </div>
                  <div className="space-y-1.5">
                    {selectedShiaBook.sections.map((sec) => (
                      <button
                        key={sec.id}
                        onClick={() => setSelectedShiaSection(sec)}
                        className={`w-full text-left p-3 rounded-xl transition text-xs flex flex-col gap-1 cursor-pointer ${
                          selectedShiaSection?.id === sec.id
                            ? "bg-amber-400 text-emerald-950 font-bold shadow-sm"
                            : "text-emerald-100/80 hover:bg-white/10"
                        }`}
                      >
                        <span className="line-clamp-1">{sec.title}</span>
                        <span className={`text-[10px] ${selectedShiaSection?.id === sec.id ? "text-emerald-900" : "text-amber-300/70"}`}>
                          {sec.theme}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right Column: Active Reader Pane */}
                <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
                  {selectedShiaSection ? (
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-0.5 rounded-full font-semibold">
                            {selectedShiaSection.theme}
                          </span>
                          <span className="text-xs text-emerald-200/60 font-mono">
                            {selectedShiaSection.sourceReference}
                          </span>
                        </div>
                        <h4 className="text-2xl font-serif font-bold text-white mb-1">
                          {selectedShiaSection.title}
                        </h4>
                        <div className="text-right font-arabic text-xl text-amber-300" dir="rtl">
                          {selectedShiaSection.arabicTitle}
                        </div>
                      </div>

                      {/* Arabic Text Callout */}
                      <div className="bg-emerald-950/70 border border-emerald-500/25 rounded-2xl p-6 text-right font-quran text-2xl sm:text-3xl text-amber-100 leading-[2.4] shadow-inner select-text" dir="rtl">
                        {selectedShiaSection.arabicText}
                      </div>

                      {/* English Translation */}
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <div className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
                          English Translation:
                        </div>
                        <p className="text-sm sm:text-base text-emerald-50 leading-relaxed font-sans select-text">
                          &ldquo;{selectedShiaSection.englishTranslation}&rdquo;
                        </p>
                      </div>

                      {/* Source Citation */}
                      <div className="text-xs text-emerald-200/60 border-t border-white/10 pt-4 flex items-center justify-between">
                        <span>Source: {selectedShiaSection.sourceReference}</span>
                        <span className="text-amber-300/80">Quran Learn Academy Classical Series</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-emerald-100/60">
                      Select a chapter from the left to read.
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-white/10 bg-black/50 flex items-center justify-between text-xs text-emerald-200/60">
                <span>Admin Expandable Classical Shia Corpus</span>
                <button
                  onClick={() => { setSelectedShiaBook(null); setSelectedShiaSection(null); }}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl font-bold transition cursor-pointer"
                >
                  Close Reader
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
