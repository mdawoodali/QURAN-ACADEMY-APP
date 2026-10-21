import { describe, it, expect } from "vitest";
import { calculateQibla, calculatePrayerTimes, formatMinutesToTime, CityGeoLocation } from "./prayerMath";

describe("Astronomical Solar Calculation & Qibla Trigonometry", () => {
  const london: CityGeoLocation = {
    name: "London",
    country: "UK",
    lat: 51.5074,
    lng: -0.1278,
    timezone: 0,
  };

  const karachi: CityGeoLocation = {
    name: "Karachi",
    country: "Pakistan",
    lat: 24.8607,
    lng: 67.0011,
    timezone: 5,
  };

  it("calculates Qibla angle accurately for London (~118-119° East-Southeast)", () => {
    const qibla = calculateQibla(london.lat, london.lng);
    expect(qibla.angle).toBeGreaterThanOrEqual(115);
    expect(qibla.angle).toBeLessThanOrEqual(122);
    expect(qibla.distanceKm).toBeGreaterThan(4500);
    expect(qibla.distanceKm).toBeLessThan(5500);
  });

  it("calculates Qibla angle accurately for Karachi (~266-268° West)", () => {
    const qibla = calculateQibla(karachi.lat, karachi.lng);
    expect(qibla.angle).toBeGreaterThanOrEqual(265);
    expect(qibla.angle).toBeLessThanOrEqual(270);
    expect(qibla.distanceKm).toBeGreaterThan(2500);
    expect(qibla.distanceKm).toBeLessThan(3500);
  });

  it("formats minutes from midnight into 24-hour time string", () => {
    expect(formatMinutesToTime(0)).toBe("00:00");
    expect(formatMinutesToTime(300)).toBe("05:00");
    expect(formatMinutesToTime(735)).toBe("12:15");
    expect(formatMinutesToTime(1439)).toBe("23:59");
    expect(formatMinutesToTime(1440)).toBe("00:00");
  });

  it("computes prayer times in strictly ascending chronological order", () => {
    const testDate = new Date(2026, 9, 21); // Oct 21, 2026
    const times = calculatePrayerTimes(karachi, testDate, "standard");

    expect(times.fajr).toBeDefined();
    expect(times.sunrise).toBeDefined();
    expect(times.dhuhr).toBeDefined();
    expect(times.asr).toBeDefined();
    expect(times.maghrib).toBeDefined();
    expect(times.isha).toBeDefined();

    // Verify Fajr < Sunrise < Dhuhr < Asr < Maghrib < Isha
    const toMinutes = (t: string) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };

    expect(toMinutes(times.fajr)).toBeLessThan(toMinutes(times.sunrise));
    expect(toMinutes(times.sunrise)).toBeLessThan(toMinutes(times.dhuhr));
    expect(toMinutes(times.dhuhr)).toBeLessThan(toMinutes(times.asr));
    expect(toMinutes(times.asr)).toBeLessThan(toMinutes(times.maghrib));
    expect(toMinutes(times.maghrib)).toBeLessThan(toMinutes(times.isha));
  });

  it("calculates Hanafi Asr later than Standard Asr", () => {
    const testDate = new Date(2026, 9, 21);
    const standard = calculatePrayerTimes(karachi, testDate, "standard");
    const hanafi = calculatePrayerTimes(karachi, testDate, "hanafi");

    const toMinutes = (t: string) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };

    // Hanafi Asr (2x shadow length) occurs later in the afternoon than Standard (1x)
    expect(toMinutes(hanafi.asr)).toBeGreaterThan(toMinutes(standard.asr));
  });
});
