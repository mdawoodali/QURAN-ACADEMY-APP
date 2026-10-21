"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Compass,
  MapPin,
  Clock,
  Navigation,
  Crosshair,
  Bell,
  Calendar,
  Info,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  SHIA_CITIES_DATABASE,
  calculateJafariPrayerTimes,
  calculateQibla,
  getLiveHijriDate,
  CityLocation,
  JafariPrayerTimes,
} from "@/lib/prayerMath";
import { SHIA_PRAYER_METHOD_INFO } from "@/data/shiaToolkitData";

export default function JafariPrayerSchedule() {
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
    if (parts.length < 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) {
      return currentTime;
    }
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
      {
        key: "fajr",
        name: "Fajr",
        arabic: "الفَجْر",
        desc: "True Dawn (17.7°)",
        min: prayerTimes.rawMinutes.fajr,
        time: prayerTimes.fajr,
      },
      {
        key: "sunrise",
        name: "Sunrise",
        arabic: "الشُّرُوق",
        desc: "Solar Disk Rising",
        min: prayerTimes.rawMinutes.sunrise,
        time: prayerTimes.sunrise,
      },
      {
        key: "dhuhr",
        name: "Dhuhr",
        arabic: "الظُّهْر",
        desc: "Solar Noon / Zawal",
        min: prayerTimes.rawMinutes.dhuhr,
        time: prayerTimes.dhuhr,
      },
      {
        key: "asr",
        name: "Asr",
        arabic: "العَصْر",
        desc: "Afternoon (Joinable with Dhuhr)",
        min: prayerTimes.rawMinutes.asr,
        time: prayerTimes.asr,
      },
      {
        key: "sunset",
        name: "Sunset",
        arabic: "الغُرُوب",
        desc: "Solar Disk Descent",
        min: prayerTimes.rawMinutes.sunset,
        time: prayerTimes.sunset,
      },
      {
        key: "maghrib",
        name: "Maghrib",
        arabic: "المَغْرِب",
        desc: "Eastern Redness Cleared (4.5°)",
        min: prayerTimes.rawMinutes.maghrib,
        time: prayerTimes.maghrib,
        highlight: true,
      },
      {
        key: "isha",
        name: "Isha",
        arabic: "العِشَاء",
        desc: "Night (Joinable with Maghrib)",
        min: prayerTimes.rawMinutes.isha,
        time: prayerTimes.isha,
      },
      {
        key: "midnight",
        name: "Midnight",
        arabic: "نِصْفُ اللَّيْل",
        desc: "Halfway Sunset to Dawn",
        min: prayerTimes.rawMinutes.midnight,
        time: prayerTimes.midnight,
      },
    ];

    let next = prayers.find((p) => p.min > nowMinutes);
    let diff = 0;
    if (next) {
      diff = next.min - nowMinutes;
    } else {
      next = prayers[0];
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

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Top Live Dashboard: Current Location, Live Clock, Hijri Date, Geolocation & Adhan */}
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
              title="Test Shia Adhan Melody"
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

        {/* Next Prayer Glowing Countdown Strip & Qibla Compass */}
        <div className="relative z-10 mt-6 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

          {/* Shia Sunnah of Jam' al-Salatayn Reminder */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-4 flex items-center justify-between sm:col-span-2 lg:col-span-1 shadow-md">
            <div>
              <div className="text-[11px] uppercase font-bold tracking-wider text-amber-300 mb-0.5">
                Sunnah of Combining
              </div>
              <div className="text-xs text-emerald-100/90 leading-snug">
                Dhuhr &amp; Asr in afternoon, Maghrib &amp; Isha at nightfall may be joined sequentially without distress.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* City Selection Pills */}
      <div className="bg-[#032219]/70 border border-white/10 rounded-2xl p-4 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-3">
          <MapPin size={14} />
          <span>Calibrated Holy Shrines &amp; Global Metropolises:</span>
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
                className={`text-xs px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
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
              <div className="text-3xl sm:text-4xl font-mono font-black text-amber-300 mb-1 drop-shadow-sm">
                {p.time}
              </div>
              <div className="text-[10px] text-emerald-200/70 font-sans line-clamp-1">{p.desc}</div>
            </div>
          );
        })}
      </div>

      {/* Ja'fari Jurisprudential Method Guide */}
      <div className="bg-[#032219]/80 border border-white/10 rounded-2xl p-6 sm:p-7 text-xs text-emerald-100/90 leading-relaxed text-left shadow-lg">
        <h4 className="text-base font-bold text-amber-300 flex items-center gap-2 mb-3">
          <Info size={18} />
          <span>Ja&apos;fari Method &amp; The Sunnah of Joining Prayers (Jam&apos; al-Salatayn)</span>
        </h4>
        <p className="mb-4">
          {SHIA_PRAYER_METHOD_INFO.description}
        </p>
        <div className="bg-black/40 p-4 rounded-2xl border border-white/10 text-xs text-emerald-100/80 leading-relaxed">
          <strong className="text-amber-400 block mb-1 text-sm font-semibold">
            Canonical Documentation &amp; Hadith:
          </strong>
          {SHIA_PRAYER_METHOD_INFO.combiningNotice}
        </div>
      </div>
    </div>
  );
}
