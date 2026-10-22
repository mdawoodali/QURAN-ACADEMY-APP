"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Compass,
  MapPin,
  Navigation,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Crosshair,
  Bell,
  Calendar,
  Info,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  STANDARD_CITIES_DATABASE,
  calculateStandardPrayerTimes,
  calculateQibla,
  getLiveHijriDate,
  CityLocation,
  StandardPrayerTimes,
} from "@/lib/prayerMath";

export default function PrayerTimesQibla() {
  const [selectedCityKey, setSelectedCityKey] = useState<string>("Karachi");
  const [customCity, setCustomCity] = useState<CityLocation | null>(null);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [asrMethod, setAsrMethod] = useState<"hanafi" | "standard">("hanafi");
  const [selectedDateStr, setSelectedDateStr] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [isPlayingAdhan, setIsPlayingAdhan] = useState(false);

  // Live real-time ticking clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Listen to mobile device orientation compass sensors if available
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null) {
        setDeviceHeading(Math.round(e.alpha));
      }
    };
    if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
      window.addEventListener("deviceorientation", handleOrientation);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("deviceorientation", handleOrientation);
      }
    };
  }, []);

  const activeLocation: CityLocation = useMemo(() => {
    if (customCity) return customCity;
    return STANDARD_CITIES_DATABASE[selectedCityKey] || STANDARD_CITIES_DATABASE["Karachi"];
  }, [customCity, selectedCityKey]);

  const activeDate = useMemo(() => {
    if (!selectedDateStr) return currentTime;
    const parts = selectedDateStr.split("-").map(Number);
    if (parts.length < 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) {
      return currentTime;
    }
    return new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
  }, [selectedDateStr, currentTime]);

  const prayerTimes: StandardPrayerTimes = useMemo(() => {
    return calculateStandardPrayerTimes(
      activeLocation.lat,
      activeLocation.lng,
      activeLocation.timezone,
      activeDate,
      asrMethod
    );
  }, [activeLocation, activeDate, asrMethod]);

  const qiblaInfo = useMemo(() => {
    return calculateQibla(activeLocation.lat, activeLocation.lng);
  }, [activeLocation]);

  const hijriDate = useMemo(() => {
    return getLiveHijriDate(activeDate);
  }, [activeDate]);

  // Live countdown to next prayer calculation
  const countdownData = useMemo(() => {
    const utc = currentTime.getTime() + currentTime.getTimezoneOffset() * 60000;
    const cityNow = new Date(utc + 3600000 * activeLocation.timezone);
    const nowMinutes = cityNow.getHours() * 60 + cityNow.getMinutes() + cityNow.getSeconds() / 60;

    const prayers = [
      {
        key: "fajr",
        name: "Fajr",
        arabic: "الفَجْر",
        desc: "True Dawn (18.0° Astronomical)",
        min: prayerTimes.rawMinutes.fajr,
        time: prayerTimes.fajr,
        icon: Sunset,
        isObligatory: true,
      },
      {
        key: "sunrise",
        name: "Sunrise",
        arabic: "الشُّرُوق",
        desc: "Solar Disk Rising (Ishraq)",
        min: prayerTimes.rawMinutes.sunrise,
        time: prayerTimes.sunrise,
        icon: Sunrise,
        isObligatory: false,
      },
      {
        key: "dhuhr",
        name: "Dhuhr",
        arabic: "الظُّهْر",
        desc: "Midday Solar Noon + 1 min",
        min: prayerTimes.rawMinutes.dhuhr,
        time: prayerTimes.dhuhr,
        icon: Sun,
        isObligatory: true,
      },
      {
        key: "asr",
        name: "Asr",
        arabic: "العَصْر",
        desc: asrMethod === "hanafi" ? "Hanafi (Double Shadow)" : "Standard / Shafi'i (Single Shadow)",
        min: prayerTimes.rawMinutes.asr,
        time: prayerTimes.asr,
        icon: Sun,
        isObligatory: true,
      },
      {
        key: "sunset",
        name: "Sunset",
        arabic: "الغُرُوب",
        desc: "Solar Disk Descent",
        min: prayerTimes.rawMinutes.sunset,
        time: prayerTimes.sunset,
        icon: Sunset,
        isObligatory: false,
      },
      {
        key: "maghrib",
        name: "Maghrib",
        arabic: "المَغْرِب",
        desc: "Sunset + 2 min (Iftar Call)",
        min: prayerTimes.rawMinutes.maghrib,
        time: prayerTimes.maghrib,
        icon: Sunset,
        highlight: true,
        isObligatory: true,
      },
      {
        key: "isha",
        name: "Isha",
        arabic: "العِشَاء",
        desc: "Nightfall (18.0° Astronomical)",
        min: prayerTimes.rawMinutes.isha,
        time: prayerTimes.isha,
        icon: Moon,
        isObligatory: true,
      },
      {
        key: "midnight",
        name: "Qiyam / Midnight",
        arabic: "نِصْفُ اللَّيْل",
        desc: "Halfway Sunset to Dawn (Tahajjud)",
        min: prayerTimes.rawMinutes.midnight,
        time: prayerTimes.midnight,
        icon: Moon,
        isObligatory: false,
      },
    ];

    let next = prayers.find((p) => p.min > nowMinutes && p.isObligatory);
    if (!next) {
      next = prayers.find((p) => p.isObligatory) || prayers[0];
    }

    let diff = 0;
    if (next.min > nowMinutes) {
      diff = next.min - nowMinutes;
    } else {
      diff = 1440 - nowMinutes + next.min;
    }

    const h = Math.floor(diff / 60);
    const m = Math.floor(diff % 60);
    const s = Math.floor((diff * 60) % 60);
    const pad = (v: number) => v.toString().padStart(2, "0");

    return {
      timeFormatted: cityNow.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }),
      nextPrayer: next,
      countdown: `${pad(h)}:${pad(m)}:${pad(s)}`,
      prayers,
    };
  }, [currentTime, activeLocation, prayerTimes, asrMethod]);

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
          timezoneName: `Local Device (UTC${tz >= 0 ? "+" : ""}${tz})`,
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
      const ctx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const notes = [
        { f: 440, d: 0.7 },
        { f: 554.37, d: 0.6 },
        { f: 659.25, d: 0.9 },
        { f: 587.33, d: 0.6 },
        { f: 554.37, d: 0.8 },
        { f: 493.88, d: 0.7 },
        { f: 440, d: 1.4 },
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
      toast.success("Playing Adhan melody cadence", { icon: "🔔" });
      setTimeout(() => setIsPlayingAdhan(false), (t - ctx.currentTime) * 1000);
    } catch {
      setIsPlayingAdhan(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* 1. TOP LIVE DASHBOARD: Location, Live Clock, Hijri Date, Geolocation & Adhan */}
      <div className="bg-gradient-to-r from-[#032219] via-[#021811] to-[#01100b] border border-amber-400/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
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
              title="Test Adhan Melodic Cadence"
            >
              <Bell size={15} className={isPlayingAdhan ? "animate-bounce text-amber-400" : "text-amber-400"} />
              <span>{isPlayingAdhan ? "Playing..." : "Test Adhan"}</span>
            </button>

            <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white shadow-inner">
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

        {/* 2. NEXT PRAYER GLOWING COUNTDOWN STRIP & QIBLA DIRECTION */}
        <div className="relative z-10 mt-6 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Next Prayer Call Card */}
          <div className="bg-black/40 border border-amber-400/40 rounded-2xl p-4 flex items-center justify-between shadow-md">
            <div>
              <div className="text-[11px] uppercase font-bold tracking-wider text-amber-300 mb-0.5">
                Next Prayer Call
              </div>
              <div className="text-lg font-bold text-white flex items-center gap-2">
                <span>{countdownData.nextPrayer.name}</span>
                <span className="font-arabic text-amber-300 font-normal">
                  ({countdownData.nextPrayer.arabic})
                </span>
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
          <div className="bg-black/40 border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-md">
            <div>
              <div className="text-[11px] uppercase font-bold tracking-wider text-emerald-200/70 mb-0.5 flex items-center gap-1">
                <Compass size={13} className="text-amber-400" />
                <span>Qibla Heading</span>
              </div>
              <div className="text-lg font-bold text-white flex items-center gap-2">
                <span>
                  {qiblaInfo.angle}° {qiblaInfo.compassDir}
                </span>
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

          {/* Asr Juristic Method Toggle Card */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-4 flex flex-col justify-between sm:col-span-2 lg:col-span-1 shadow-md">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] uppercase font-bold tracking-wider text-amber-300">
                Asr Juristic Method
              </span>
              <span className="text-[10px] text-emerald-200/60 font-mono">
                {asrMethod === "hanafi" ? "2x Shadow" : "1x Shadow"}
              </span>
            </div>
            <div className="flex bg-black/60 p-1 rounded-xl border border-white/15">
              <button
                onClick={() => setAsrMethod("hanafi")}
                className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  asrMethod === "hanafi"
                    ? "bg-amber-400 text-emerald-950 shadow-sm"
                    : "text-emerald-200/70 hover:text-white"
                }`}
              >
                Hanafi
              </button>
              <button
                onClick={() => setAsrMethod("standard")}
                className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  asrMethod === "standard"
                    ? "bg-amber-400 text-emerald-950 shadow-sm"
                    : "text-emerald-200/70 hover:text-white"
                }`}
              >
                Shafi&apos;i / Standard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. CITY SELECTION PILLS */}
      <div className="bg-[#032219]/70 border border-white/10 rounded-2xl p-4 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-3">
          <MapPin size={14} />
          <span>Calibrated Islamic Capitals & Global Metropolises:</span>
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
          {Object.keys(STANDARD_CITIES_DATABASE).map((key) => {
            const c = STANDARD_CITIES_DATABASE[key];
            const isActive = !customCity && selectedCityKey === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setCustomCity(null);
                  setSelectedCityKey(key);
                }}
                className={`text-xs px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
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

      {/* 4. 8 PRAYER TIME CARDS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {countdownData.prayers.map((p, idx) => {
          const isNext = countdownData.nextPrayer.key === p.key;
          const Icon = p.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl border text-center transition-all relative overflow-hidden group ${
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
              <div className="text-xs uppercase font-bold text-white/90 mb-1 flex items-center justify-center gap-1.5">
                <Icon size={14} className={isNext ? "text-amber-300" : "text-emerald-300"} />
                <span>{p.name}</span>
                {isNext && <span className="text-[10px] text-amber-300 font-mono font-bold">(Next)</span>}
              </div>
              <div className="text-3xl sm:text-4xl font-mono font-black text-amber-300 mb-1 drop-shadow-sm">
                {p.time}
              </div>
              <div className="text-[10px] text-emerald-200/70 font-sans line-clamp-1">{p.desc}</div>
            </div>
          );
        })}
      </div>

      {/* 5. SPLIT SECTION: INTERACTIVE QIBLA COMPASS VISUALIZER & JURISTIC GUIDANCE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Detailed Juristic Guidance Note (7 Cols) */}
        <div className="lg:col-span-7 bg-[#032219]/80 border border-white/10 rounded-3xl p-6 sm:p-7 space-y-4 text-xs text-emerald-100/90 leading-relaxed flex flex-col justify-between">
          <div>
            <h4 className="text-base font-bold text-amber-300 flex items-center gap-2 mb-3">
              <Info size={18} />
              <span>Astronomical Conventions & Juristic Standards</span>
            </h4>
            <p className="mb-3">
              Prayer times are calculated using spherical trigonometry algorithms adhering to standard Islamic astronomical solar angles (University of Islamic Sciences, Karachi and Muslim World League standards: 18.0° solar depression for Fajr and Isha).
            </p>
            <div className="space-y-2.5 bg-black/40 p-4 rounded-2xl border border-white/10">
              <div className="flex items-start gap-2">
                <strong className="text-amber-400 shrink-0">• Asr Calculation:</strong>
                <span>
                  <strong>Hanafi:</strong> Asr begins when the shadow of an object becomes twice its height plus its noontime minimum. <strong>Shafi&apos;i / Maliki / Hanbali:</strong> Asr begins when the shadow equals the object&apos;s height plus its noontime minimum.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <strong className="text-amber-400 shrink-0">• Qiyam / Tahajjud:</strong>
                <span>
                  The Islamic Midnight (Nisf al-Layl) marks the midpoint between Sunset and True Dawn (Fajr). The blessed last third of the night begins two-thirds through this span.
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/10 text-[11px] text-emerald-200/60 font-mono">
            <span>Coordinates: {activeLocation.lat.toFixed(3)}°N, {activeLocation.lng.toFixed(3)}°E</span>
            <span>Standard Twilight: 18° / 18°</span>
          </div>
        </div>

        {/* Right: Interactive 360° Rotating Qibla Compass (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full glass-container rounded-3xl p-6 border border-white/20 shadow-2xl relative flex flex-col items-center bg-gradient-to-b from-[#063326]/90 via-[#04241b]/95 to-[#021812]/98 h-full justify-between">
            <div className="flex items-center justify-between w-full pb-3 border-b border-white/10 text-xs">
              <span className="font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Compass size={14} />
                <span>Qibla Dial</span>
              </span>
              <span className="text-emerald-200/80 font-mono">{qiblaInfo.angle}° from True North</span>
            </div>

            {/* Compass Rim & Rotating Needle */}
            <div className="my-4 relative w-52 h-52 sm:w-56 sm:h-56 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-amber-400/10 blur-xl pointer-events-none" />
              <div className="absolute inset-0 rounded-full border-2 border-amber-400/40 shadow-[0_0_20px_rgba(251,191,36,0.2)] flex items-center justify-center">
                <span className="absolute top-2 text-xs font-bold text-amber-300">N</span>
                <span className="absolute right-2 text-xs font-bold text-emerald-200/60">E</span>
                <span className="absolute bottom-2 text-xs font-bold text-emerald-200/60">S</span>
                <span className="absolute left-2 text-xs font-bold text-emerald-200/60">W</span>
                <div className="absolute inset-3 rounded-full border border-dashed border-white/15" />
              </div>

              {/* Rotating Pointer */}
              <div
                className="relative w-full h-full flex items-center justify-center transition-transform duration-700 ease-out"
                style={{
                  transform: `rotate(${qiblaInfo.angle - (deviceHeading || 0)}deg)`,
                }}
              >
                <div className="absolute top-6 flex flex-col items-center">
                  <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[24px] border-b-amber-400 filter drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
                  <span className="text-[10px] bg-amber-400 text-emerald-950 font-black px-1.5 py-0.5 rounded shadow-md mt-1">
                    KAABA
                  </span>
                </div>
                <div className="w-5 h-5 rounded-full bg-amber-300 border-2 border-emerald-950 shadow-md z-10" />
                <div className="absolute bottom-8 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[16px] border-t-white/30" />
              </div>
            </div>

            {/* Distance summary */}
            <div className="w-full bg-black/40 rounded-2xl p-3 border border-white/10 text-center text-xs">
              <span className="text-white font-semibold">
                Direct Path: <strong className="text-amber-300">{qiblaInfo.distanceKm.toLocaleString()} km</strong> to Makkah
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
