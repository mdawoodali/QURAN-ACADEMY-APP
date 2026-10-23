import { describe, it, expect } from "vitest";
import { splitArabicWord, normalizeArabic, SCRIPT_DATA, CURRICULUM_LESSONS } from "@/features/classroom/constants";

describe("Classroom Arabic Parsing & Normalization Engine", () => {
  it("correctly decomposes Arabic words with harakat into distinct letter graphemes", () => {
    const letters = splitArabicWord("ٱلْحَمْدُ");
    expect(letters.length).toBeGreaterThan(0);
    expect(letters.join("")).toBe("ٱلْحَمْدُ");
  });

  it("normalizes diverse Arabic diacritics, alef forms, and taa marbuta consistently", () => {
    const uthmaniHamd = normalizeArabic("ٱلْحَمْدُ");
    const plainHamd = normalizeArabic("الحمد");
    expect(uthmaniHamd).toBe(plainHamd);

    expect(normalizeArabic("إِيَّاكَ")).toBe(normalizeArabic("اياك"));
  });

  it("provides valid and non-empty script data for both Uthmani and IndoPak", () => {
    expect(SCRIPT_DATA.uthmani.length).toBe(4);
    expect(SCRIPT_DATA.indopak.length).toBe(4);

    expect(SCRIPT_DATA.uthmani[0].word).toBeTruthy();
    expect(SCRIPT_DATA.indopak[0].word).toBeTruthy();
    expect(SCRIPT_DATA.uthmani[3].type).toBe("madd");
  });

  it("provides complete curriculum lessons with both Uthmani and IndoPak scripts", () => {
    expect(CURRICULUM_LESSONS.length).toBeGreaterThanOrEqual(4);
    
    // Check Surah Al-Ikhlas
    const ikhlas = CURRICULUM_LESSONS.find(l => l.id === "ikhlas-all");
    expect(ikhlas).toBeDefined();
    expect(ikhlas?.wordsUthmani.length).toBe(15);
    expect(ikhlas?.wordsIndoPak.length).toBe(15);
    expect(ikhlas?.wordsUthmani[3].rule).toBe("qalqalah");

    // Check Noorani Qaida Lesson
    const qaida = CURRICULUM_LESSONS.find(l => l.id === "qaida-mufradaat");
    expect(qaida).toBeDefined();
    expect(qaida?.category).toBe("qaida");
    expect(qaida?.wordsUthmani.length).toBeGreaterThanOrEqual(7);
  });

  it("handles edge cases gracefully: empty strings, whitespace, and non-Arabic symbols", () => {
    expect(normalizeArabic("")).toBe("");
    expect(splitArabicWord("")).toEqual([]);
    expect(normalizeArabic("   ")).toBe("");
    expect(normalizeArabic("123 الحمد 456")).toContain("الحمد");
  });
});
