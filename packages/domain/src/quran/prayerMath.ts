/**
 * Astronomical Solar Calculation Algorithms & Spherical Trigonometry for Qibla
 */

export const KAABA_LAT = 21.4225;
export const KAABA_LNG = 39.8262;

export interface CityGeoLocation {
  name: string;
  country: string;
  lat: number;
  lng: number;
  timezone: number; // offset in hours from UTC
}

export interface QiblaResult {
  angle: number;
  distanceKm: number;
}

export interface PrayerTimesResult {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

/**
 * Calculates great-circle Qibla heading relative to True North and distance in kilometers.
 */
export function calculateQibla(lat: number, lng: number): QiblaResult {
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
}

/**
 * Formats minutes from midnight into 24h format (HH:MM)
 */
export function formatMinutesToTime(totalMinutes: number): string {
  const norm = (totalMinutes + 1440) % 1440;
  const h = Math.floor(norm / 60);
  const m = Math.floor(norm % 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

/**
 * Calculates solar prayer times using solar declination and equation of time.
 */
export function calculatePrayerTimes(
  city: CityGeoLocation,
  date: Date,
  asrType: "hanafi" | "standard" = "standard"
): PrayerTimesResult {
  // Day of year calculation
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

  // Latitude and declination in radians
  const latRad = (city.lat * Math.PI) / 180;
  const decRad = (declination * Math.PI) / 180;

  const calcHourAngle = (altitudeDeg: number): number => {
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

  // Fajr angle (-18 degrees) & Isha angle (-17.5 degrees)
  const fajrAngle = calcHourAngle(-18);
  const fajrMin = solarNoonMinutes - fajrAngle * 4;

  const ishaAngle = calcHourAngle(-17.5);
  const ishaMin = solarNoonMinutes + ishaAngle * 4;

  // Asr calculation (shadow length: 1x standard, 2x hanafi)
  const shadowFactor = asrType === "hanafi" ? 2 : 1;
  const asrAltRad = Math.atan(1 / (shadowFactor + Math.tan(Math.abs(latRad - decRad))));
  const asrAltDeg = (asrAltRad * 180) / Math.PI;
  const asrAngle = calcHourAngle(asrAltDeg);
  const asrMin = solarNoonMinutes + asrAngle * 4;

  return {
    fajr: formatMinutesToTime(fajrMin),
    sunrise: formatMinutesToTime(sunriseMin),
    dhuhr: formatMinutesToTime(solarNoonMinutes),
    asr: formatMinutesToTime(asrMin),
    maghrib: formatMinutesToTime(sunsetMin + 2),
    isha: formatMinutesToTime(ishaMin),
  };
}
