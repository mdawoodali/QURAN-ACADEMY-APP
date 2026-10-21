import { describe, it, expect } from "vitest";
import { splitArabicWord, normalizeArabic, SCRIPT_DATA } from "@/features/classroom/constants";

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

  it("handles edge cases gracefully: empty strings, whitespace, and non-Arabic symbols", () => {
    expect(normalizeArabic("")).toBe("");
    expect(splitArabicWord("")).toEqual([]);
    expect(normalizeArabic("   ")).toBe("");
    // Mixed Arabic and numbers / special characters
    expect(normalizeArabic("123 الحمد 456")).toContain("الحمد");
  });
});
