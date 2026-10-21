/**
 * Astronomical Solar Calculation Algorithms & Spherical Trigonometry
 * Tailored for Ithna Ashari / Shia Ja'fari Jurisprudence
 * Standard: University of Tehran / Leva Institute (Fajr: 17.7°, Maghrib: 4.5° Eastern Redness, Isha: 14°)
 */

export const KAABA_LAT = 21.4225;
export const KAABA_LNG = 39.8262;

export interface CityLocation {
  name: string;
  country: string;
  lat: number;
  lng: number;
  timezone: number; // offset in hours from UTC
  timezoneName: string;
}

export const SHIA_CITIES_DATABASE: Record<string, CityLocation> = {
  "Najaf": { name: "Najaf al-Ashraf", country: "Iraq", lat: 31.9959, lng: 44.3148, timezone: 3, timezoneName: "AST (UTC+3)" },
  "Karbala": { name: "Karbala al-Muqaddasa", country: "Iraq", lat: 32.6160, lng: 44.0249, timezone: 3, timezoneName: "AST (UTC+3)" },
  "Mashhad": { name: "Mashhad", country: "Iran", lat: 36.2972, lng: 59.6067, timezone: 3.5, timezoneName: "IRST (UTC+3:30)" },
  "Qom": { name: "Qom al-Muqaddasa", country: "Iran", lat: 34.6401, lng: 50.8764, timezone: 3.5, timezoneName: "IRST (UTC+3:30)" },
  "Madinah": { name: "Madinah al-Munawwarah", country: "Saudi Arabia", lat: 24.5247, lng: 39.5692, timezone: 3, timezoneName: "AST (UTC+3)" },
  "Makkah": { name: "Makkah al-Mukarramah", country: "Saudi Arabia", lat: 21.3891, lng: 39.8579, timezone: 3, timezoneName: "AST (UTC+3)" },
  "Karachi": { name: "Karachi", country: "Pakistan", lat: 24.8607, lng: 67.0011, timezone: 5, timezoneName: "PKT (UTC+5)" },
  "Lahore": { name: "Lahore", country: "Pakistan", lat: 31.5204, lng: 74.3587, timezone: 5, timezoneName: "PKT (UTC+5)" },
  "Islamabad": { name: "Islamabad", country: "Pakistan", lat: 33.6844, lng: 73.0479, timezone: 5, timezoneName: "PKT (UTC+5)" },
  "Lucknow": { name: "Lucknow", country: "India", lat: 26.8467, lng: 80.9462, timezone: 5.5, timezoneName: "IST (UTC+5:30)" },
  "Mumbai": { name: "Mumbai", country: "India", lat: 19.0760, lng: 72.8777, timezone: 5.5, timezoneName: "IST (UTC+5:30)" },
  "London": { name: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278, timezone: 1, timezoneName: "BST (UTC+1)" },
  "Birmingham": { name: "Birmingham", country: "United Kingdom", lat: 52.4862, lng: -1.8904, timezone: 1, timezoneName: "BST (UTC+1)" },
  "Dearborn": { name: "Dearborn / Detroit", country: "United States", lat: 42.3223, lng: -83.1763, timezone: -4, timezoneName: "EDT (UTC-4)" },
  "New York": { name: "New York", country: "United States", lat: 40.7128, lng: -74.0060, timezone: -4, timezoneName: "EDT (UTC-4)" },
  "Toronto": { name: "Toronto", country: "Canada", lat: 43.6532, lng: -79.3832, timezone: -4, timezoneName: "EDT (UTC-4)" },
  "Sydney": { name: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093, timezone: 11, timezoneName: "AEST (UTC+11)" },
  "Dubai": { name: "Dubai", country: "United Arab Emirates", lat: 25.2048, lng: 55.2708, timezone: 4, timezoneName: "GST (UTC+4)" }
};

export interface JafariPrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  sunset: string;
  maghrib: string;
  isha: string;
  midnight: string;
  // Raw minutes from midnight for countdown arithmetic
  rawMinutes: {
    fajr: number;
    sunrise: number;
    dhuhr: number;
    asr: number;
    sunset: number;
    maghrib: number;
    isha: number;
    midnight: number;
  };
}

export function formatMinutesToTime(totalMinutes: number): string {
  const norm = (totalMinutes + 1440) % 1440;
  const h = Math.floor(norm / 60);
  const m = Math.floor(norm % 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

function calcHourAngle(latDeg: number, declinationDeg: number, altitudeDeg: number): number {
  const latRad = (latDeg * Math.PI) / 180;
  const decRad = (declinationDeg * Math.PI) / 180;
  const altRad = (altitudeDeg * Math.PI) / 180;
  const cosH = (Math.sin(altRad) - Math.sin(latRad) * Math.sin(decRad)) / (Math.cos(latRad) * Math.cos(decRad));
  if (cosH > 1) return 0;
  if (cosH < -1) return 180;
  return (Math.acos(cosH) * 180) / Math.PI;
}

/**
 * Calculates authentic astronomical Shia Ja'fari prayer times for any geographic coordinate.
 */
export function calculateJafariPrayerTimes(
  lat: number,
  lng: number,
  timezoneOffset: number,
  date: Date = new Date()
): JafariPrayerTimes {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  // Equation of Time and Solar Declination
  const b = (2 * Math.PI * (dayOfYear - 81)) / 365;
  const eot = 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
  const declination = 23.45 * Math.sin(((dayOfYear - 81) * 2 * Math.PI) / 365);

  // Solar Noon (Zawal / Dhuhr start)
  const solarNoonMin = 720 - 4 * (lng - timezoneOffset * 15) - eot;

  // Sunrise and Sunset (approx -0.833° for atmospheric refraction)
  const sunAngle = calcHourAngle(lat, declination, -0.833);
  const sunriseMin = solarNoonMin - sunAngle * 4;
  const sunsetMin = solarNoonMin + sunAngle * 4;

  // Ja'fari Fajr: 17.7° depression angle
  const fajrAngle = calcHourAngle(lat, declination, -17.7);
  const fajrMin = solarNoonMin - fajrAngle * 4;

  // Ja'fari Maghrib: Disappearance of Eastern Redness (~4.5° depression angle)
  const maghribAngle = calcHourAngle(lat, declination, -4.5);
  const maghribMin = solarNoonMin + maghribAngle * 4;

  // Ja'fari Isha: 14.0° depression angle
  const ishaAngle = calcHourAngle(lat, declination, -14.0);
  const ishaMin = solarNoonMin + ishaAngle * 4;

  // Asr: Standard shadow ratio (shadow length = object height + noontime shadow)
  const latRad = (lat * Math.PI) / 180;
  const decRad = (declination * Math.PI) / 180;
  const asrAltRad = Math.atan(1 / (1 + Math.tan(Math.abs(latRad - decRad))));
  const asrAltDeg = (asrAltRad * 180) / Math.PI;
  const asrAngle = calcHourAngle(lat, declination, asrAltDeg);
  const asrMin = solarNoonMin + asrAngle * 4;

  // Ja'fari Midnight (Nisf al-Layl): Halfway between Sunset and next day Fajr
  // (sunsetMin + (fajrMin + 1440)) / 2
  const midnightMin = (sunsetMin + (fajrMin + 1440)) / 2 % 1440;

  return {
    fajr: formatMinutesToTime(fajrMin),
    sunrise: formatMinutesToTime(sunriseMin),
    dhuhr: formatMinutesToTime(solarNoonMin),
    asr: formatMinutesToTime(asrMin),
    sunset: formatMinutesToTime(sunsetMin),
    maghrib: formatMinutesToTime(maghribMin),
    isha: formatMinutesToTime(ishaMin),
    midnight: formatMinutesToTime(midnightMin),
    rawMinutes: {
      fajr: Math.round(fajrMin),
      sunrise: Math.round(sunriseMin),
      dhuhr: Math.round(solarNoonMin),
      asr: Math.round(asrMin),
      sunset: Math.round(sunsetMin),
      maghrib: Math.round(maghribMin),
      isha: Math.round(ishaMin),
      midnight: Math.round(midnightMin),
    }
  };
}

export interface QiblaInfo {
  angle: number;
  distanceKm: number;
  compassDir: string;
}

/**
 * Calculates spherical Qibla direction and distance from Kaaba.
 */
export function calculateQibla(lat: number, lng: number): QiblaInfo {
  const phi1 = (lat * Math.PI) / 180;
  const phi2 = (KAABA_LAT * Math.PI) / 180;
  const deltaLambda = ((KAABA_LNG - lng) * Math.PI) / 180;

  const y = Math.sin(deltaLambda);
  const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(deltaLambda);
  let qibla = (Math.atan2(y, x) * 180) / Math.PI;
  qibla = (qibla + 360) % 360;

  const R = 6371;
  const dPhi = phi2 - phi1;
  const a =
    Math.sin(dPhi / 2) ** 2 +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const compassDir = dirs[Math.round(qibla / 22.5) % 16];

  return {
    angle: Math.round(qibla),
    distanceKm: Math.round(R * c),
    compassDir
  };
}

/**
 * Gets live dynamic Hijri date for display
 */
export function getLiveHijriDate(date: Date = new Date()): { english: string; arabic: string } {
  try {
    const english = new Intl.DateTimeFormat("en-US-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(date);

    const arabic = new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(date);

    return { english, arabic };
  } catch {
    return { english: "Jumada al-Ula 1448 AH", arabic: "جمادى الأولى ١٤٤٨ هـ" };
  }
}
