import { describe, it, expect } from "vitest";
import { splitArabicWord, normalizeArabic, SCRIPT_DATA } from "./constants";

describe("Classroom Arabic Parsing & Normalization Engine", () => {
  it("correctly decomposes Arabic words with harakat into distinct letter graphemes", () => {
    const letters = splitArabicWord("ٱلْحَمْدُ");
    expect(letters.length).toBeGreaterThan(0);
    // The letters re-joined should match original word
    expect(letters.join("")).toBe("ٱلْحَمْدُ");
  });

  it("normalizes diverse Arabic diacritics, alef forms, and taa marbuta consistently", () => {
    // Both forms of Al-Hamd
    const uthmaniHamd = normalizeArabic("ٱلْحَمْدُ");
    const plainHamd = normalizeArabic("الحمد");
    expect(uthmaniHamd).toBe(plainHamd);

    // Alef wasla / hamza normalization
    expect(normalizeArabic("إِيَّاكَ")).toBe(normalizeArabic("اياك"));
  });

  it("provides valid and non-empty script data for both Uthmani and IndoPak", () => {
    expect(SCRIPT_DATA.uthmani.length).toBe(4);
    expect(SCRIPT_DATA.indopak.length).toBe(4);

    expect(SCRIPT_DATA.uthmani[0].word).toBeTruthy();
    expect(SCRIPT_DATA.indopak[0].word).toBeTruthy();
    expect(SCRIPT_DATA.uthmani[3].type).toBe("madd");
  });
});
