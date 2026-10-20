"use client";

import React, { useState, useEffect } from "react";
import { Compass, MapPin, Clock, Calendar, Navigation, RefreshCw, Sun, Moon, Sunrise, Sunset } from "lucide-react";
import toast from "react-hot-toast";

interface CityLocation {
  name: string;
  country: string;
  lat: number;
  lng: number;
  timezone: number; // offset in hours
}

const POPULAR_CITIES: CityLocation[] = [
  { name: "Karachi", country: "Pakistan", lat: 24.8607, lng: 67.0011, timezone: 5 },
  { name: "Lahore", country: "Pakistan", lat: 31.5204, lng: 74.3587, timezone: 5 },
  { name: "Islamabad", country: "Pakistan", lat: 33.6844, lng: 73.0479, timezone: 5 },
  { name: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278, timezone: 0 },
  { name: "New York", country: "USA", lat: 40.7128, lng: -74.006, timezone: -5 },
  { name: "Mecca", country: "Saudi Arabia", lat: 21.3891, lng: 39.8579, timezone: 3 },
  { name: "Medina", country: "Saudi Arabia", lat: 24.5247, lng: 39.5692, timezone: 3 },
  { name: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708, timezone: 4 },
  { name: "Toronto", country: "Canada", lat: 43.6532, lng: -79.3832, timezone: -5 },
  { name: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093, timezone: 11 },
];

// Kaaba Coordinates in Makkah
const KAABA_LAT = 21.422487;
const KAABA_LNG = 39.826206;

export default function PrayerTimesQibla() {
  const [selectedCity, setSelectedCity] = useState<CityLocation>(POPULAR_CITIES[0]);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [asrMethod, setAsrMethod] = useState<"hanafi" | "standard">("hanafi");
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);

  // Keep live time updated
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Listen to device orientation if supported on mobile
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

  // Mathematical Qibla Calculation
  const calculateQibla = (lat: number, lng: number) => {
    const phi1 = (lat * Math.PI) / 180;
    const phi2 = (KAABA_LAT * Math.PI) / 180;
    const deltaLambda = ((KAABA_LNG - lng) * Math.PI) / 180;

    const y = Math.sin(deltaLambda);
    const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(deltaLambda);
    let qibla = (Math.atan2(y, x) * 180) / Math.PI;
    qibla = (qibla + 360) % 360;

    // Great circle distance in km
    const R = 6371;
    const dPhi = phi2 - phi1;
    const a =
      Math.sin(dPhi / 2) * Math.sin(dPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = Math.round(R * c);

    return {
      angle: Math.round(qibla),
      distanceKm,
    };
  };

  // Astronomical Solar Calculation for Prayer Times
  const calculatePrayerTimes = (city: CityLocation, date: Date, asrType: "hanafi" | "standard") => {
    // Solar declination approximation for day of year
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    // Approximate Equation of Time and Declination
    const b = (2 * Math.PI * (dayOfYear - 81)) / 365;
    const eot = 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
    const declination = 23.45 * Math.sin(((dayOfYear - 81) * 2 * Math.PI) / 365);

    // Solar noon (Dhuhr)
    const solarNoonMinutes = 720 - 4 * (city.lng - city.timezone * 15) - eot;

    // Time calculations
    const latRad = (city.lat * Math.PI) / 180;
    const decRad = (declination * Math.PI) / 180;

    const calcHourAngle = (altitudeDeg: number) => {
      const altRad = (altitudeDeg * Math.PI) / 180;
      const cosH = (Math.sin(altRad) - Math.sin(latRad) * Math.sin(decRad)) / (Math.cos(latRad) * Math.cos(decRad));
      if (cosH > 1) return 0;
      if (cosH < -1) return 180;
      return (Math.acos(cosH) * 180) / Math.PI;
    };

    // Sunrise & Sunset angle (~ -0.833 degrees)
    const sunAngle = calcHourAngle(-0.833);
    const sunriseMin = solarNoonMinutes - sunAngle * 4;
    const sunsetMin = solarNoonMinutes + sunAngle * 4;

    // Fajr (18 degrees below horizon)
    const fajrAngle = calcHourAngle(-18);
    const fajrMin = solarNoonMinutes - fajrAngle * 4;

    // Isha (18 degrees below horizon)
    const ishaAngle = calcHourAngle(-18);
    const ishaMin = solarNoonMinutes + ishaAngle * 4;

    // Asr angle: shadow factor 1 (Shafi'i) or 2 (Hanafi)
    const shadowFactor = asrType === "hanafi" ? 2 : 1;
    const asrAlt = Math.atan(1 / (shadowFactor + Math.tan(Math.abs(latRad - decRad)))) * (180 / Math.PI);
    const asrAngle = calcHourAngle(asrAlt);
    const asrMin = solarNoonMinutes + asrAngle * 4;

    const formatTime = (minutes: number) => {
      let m = Math.round(minutes);
      if (m < 0) m += 1440;
      if (m >= 1440) m -= 1440;
      const h24 = Math.floor(m / 60);
      const min = m % 60;
      const period = h24 >= 12 ? "PM" : "AM";
      const h12 = h24 % 12 || 12;
      return `${h12}:${min.toString().padStart(2, "0")} ${period}`;
    };

    return [
      { name: "Fajr", time: formatTime(fajrMin), icon: Sunset, label: "Dawn prayer" },
      { name: "Sunrise", time: formatTime(sunriseMin), icon: Sunrise, label: "Sun ascent" },
      { name: "Dhuhr", time: formatTime(solarNoonMinutes + 1), icon: Sun, label: "Midday prayer" },
      { name: "Asr", time: formatTime(asrMin), icon: Sun, label: `${asrType === "hanafi" ? "Hanafi" : "Standard"} afternoon` },
      { name: "Maghrib", time: formatTime(sunsetMin + 2), icon: Sunset, label: "Sunset prayer" },
      { name: "Isha", time: formatTime(ishaMin), icon: Moon, label: "Night prayer" },
    ];
  };

  const qiblaInfo = calculateQibla(selectedCity.lat, selectedCity.lng);
  const prayerSchedule = calculatePrayerTimes(selectedCity, currentTime, asrMethod);

  // Auto-detect geolocation
  const handleDetectLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsDetectingLocation(false);
        const { latitude, longitude } = pos.coords;
        const timezone = -new Date().getTimezoneOffset() / 60;
        setSelectedCity({
          name: "My Current Location",
          country: "GPS",
          lat: latitude,
          lng: longitude,
          timezone,
        });
        toast.success("Location updated successfully!");
      },
      (err) => {
        setIsDetectingLocation(false);
        toast.error("Could not obtain location. Please select a city.");
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Info */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold tracking-widest uppercase">
          <Compass className="w-3.5 h-3.5" />
          <span>Astronomical Calculations & Direction</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif text-white font-bold">
          Prayer Times & Qibla Direction
        </h2>
        <p className="text-xs sm:text-sm text-emerald-200/80 max-w-xl mx-auto">
          Accurate solar prayer times and real-time sacred orientation pointing directly towards the Holy Kaaba in Makkah.
        </p>
      </div>

      {/* City & Setting Selector Bar */}
      <div className="glass-container rounded-2xl p-4 sm:p-5 border border-white/15 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* City Select */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <MapPin className="text-amber-300 shrink-0" size={18} />
          <select
            value={selectedCity.name}
            onChange={(e) => {
              const found = POPULAR_CITIES.find((c) => c.name === e.target.value);
              if (found) setSelectedCity(found);
            }}
            className="bg-black/50 text-white border border-white/20 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-amber-400 cursor-pointer w-full md:w-56"
          >
            {POPULAR_CITIES.map((c) => (
              <option key={c.name} value={c.name} className="bg-emerald-950 text-white">
                {c.name}, {c.country}
              </option>
            ))}
            {selectedCity.country === "GPS" && (
              <option value="My Current Location" className="bg-emerald-950 text-amber-300">
                📍 My Current Location
              </option>
            )}
          </select>

          <button
            onClick={handleDetectLocation}
            disabled={isDetectingLocation}
            title="Auto-detect my current GPS coordinates"
            className="flex items-center gap-1.5 text-xs bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 px-3 py-2 rounded-xl transition-all font-bold cursor-pointer shrink-0"
          >
            <Navigation size={13} className={isDetectingLocation ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Use GPS</span>
          </button>
        </div>

        {/* Asr Juristic Method Toggle */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-emerald-200/70 font-medium">Asr Juristic:</span>
          <div className="flex bg-black/40 p-1 rounded-xl border border-white/15">
            <button
              onClick={() => setAsrMethod("hanafi")}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                asrMethod === "hanafi" ? "bg-amber-400 text-emerald-950" : "text-emerald-200/70 hover:text-white"
              }`}
            >
              Hanafi
            </button>
            <button
              onClick={() => setAsrMethod("standard")}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                asrMethod === "standard" ? "bg-amber-400 text-emerald-950" : "text-emerald-200/70 hover:text-white"
              }`}
            >
              Shafi'i / Standard
            </button>
          </div>
        </div>
      </div>

      {/* Main Two-Column Grid: Left (Prayer Times) & Right (Qibla Compass) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Prayer Times Grid (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2 text-sm text-white font-bold">
              <Clock size={16} className="text-amber-400" />
              <span>Today's Schedule — {selectedCity.name}</span>
            </div>
            <span className="text-xs text-amber-300 font-mono">
              {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {prayerSchedule.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="glass-container rounded-2xl p-4 border border-white/15 flex flex-col justify-between pop-hover relative overflow-hidden group hover:border-amber-400/40"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">{p.name}</span>
                    <Icon size={16} className="text-emerald-300 group-hover:text-amber-300 transition-colors" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight my-1">
                    {p.time}
                  </div>
                  <span className="text-[10px] text-emerald-200/60 capitalize">{p.label}</span>
                </div>
              );
            })}
          </div>

          {/* Location note */}
          <div className="p-3.5 rounded-xl bg-black/30 border border-white/10 text-xs text-emerald-200/70 flex items-center justify-between">
            <span>Coordinates: {selectedCity.lat.toFixed(3)}°N, {selectedCity.lng.toFixed(3)}°E</span>
            <span>Standard Solar Angles (18° Fajr / Isha)</span>
          </div>
        </div>

        {/* Right Column: Qibla Compass Visualizer (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full glass-container rounded-[2.5rem] p-6 sm:p-8 border border-white/20 shadow-2xl relative flex flex-col items-center bg-gradient-to-b from-[#063326]/90 via-[#04241b]/95 to-[#021812]/98">
            <div className="flex items-center justify-between w-full pb-3 border-b border-white/10 text-xs">
              <span className="font-bold text-amber-300 uppercase tracking-wider">Qibla Direction</span>
              <span className="text-emerald-200/80 font-mono">{qiblaInfo.angle}° from North</span>
            </div>

            {/* The Compass Dial */}
            <div className="my-6 relative w-60 h-60 sm:w-64 sm:h-64 flex items-center justify-center">
              {/* Outer Glow */}
              <div className="absolute inset-0 rounded-full bg-amber-400/10 blur-xl pointer-events-none" />

              {/* Compass Rim */}
              <div className="absolute inset-0 rounded-full border-2 border-amber-400/40 shadow-[0_0_20px_rgba(251,191,36,0.2)] flex items-center justify-center">
                {/* Cardinal Points */}
                <span className="absolute top-2 text-xs font-bold text-amber-300">N</span>
                <span className="absolute right-2 text-xs font-bold text-emerald-200/60">E</span>
                <span className="absolute bottom-2 text-xs font-bold text-emerald-200/60">S</span>
                <span className="absolute left-2 text-xs font-bold text-emerald-200/60">W</span>

                {/* Degree tick marks */}
                <div className="absolute inset-4 rounded-full border border-dashed border-white/15" />
              </div>

              {/* Rotating Needle pointing towards Qibla */}
              <div
                className="relative w-full h-full flex items-center justify-center transition-transform duration-700 ease-out"
                style={{
                  transform: `rotate(${qiblaInfo.angle - (deviceHeading || 0)}deg)`,
                }}
              >
                {/* Arrow Needle */}
                <div className="absolute top-7 flex flex-col items-center">
                  <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[24px] border-b-amber-400 filter drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
                  <span className="text-[10px] bg-amber-400 text-emerald-950 font-black px-1.5 py-0.5 rounded shadow-md mt-1">
                    KAABA
                  </span>
                </div>

                {/* Center Pivot Pin */}
                <div className="w-5 h-5 rounded-full bg-amber-300 border-2 border-emerald-950 shadow-md z-10" />

                {/* Opposite Tail */}
                <div className="absolute bottom-10 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[16px] border-t-white/30" />
              </div>
            </div>

            {/* Distance & Info details */}
            <div className="w-full bg-black/40 rounded-2xl p-4 border border-white/10 space-y-2 text-xs text-center">
              <div className="text-white font-semibold">
                Direct Path to Kaaba: <strong className="text-amber-300">{qiblaInfo.distanceKm.toLocaleString()} km</strong>
              </div>
              <p className="text-[11px] text-emerald-200/70">
                Face <span className="text-amber-300 font-bold">{qiblaInfo.angle}°</span> azimuth clockwise from true North for prayer orientation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
