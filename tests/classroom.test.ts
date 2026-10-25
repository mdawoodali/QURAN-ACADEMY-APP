import { describe, it, expect } from "vitest";
import { splitArabicWord, normalizeArabic, SCRIPT_DATA, CURRICULUM_LESSONS, toArabicNumerals } from "@/features/classroom/constants";

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

  it("accurately converts numerals to authentic Uthmani and IndoPak Arabic digits", () => {
    expect(toArabicNumerals(1, "uthmani")).toBe("١");
    expect(toArabicNumerals(7, "uthmani")).toBe("٧");
    expect(toArabicNumerals(1, "indopak")).toBe("۱");
    expect(toArabicNumerals(7, "indopak")).toBe("۷");
  });

  it("verifies authentic Ayah stoppers and enders in complete Surah Al-Fatihah", () => {
    const fatihah = CURRICULUM_LESSONS.find((l) => l.id === "fatihah-all");
    expect(fatihah).toBeDefined();

    const ayahEndersUthmani = fatihah?.wordsUthmani.filter((w) => w.isAyahEnd);
    expect(ayahEndersUthmani?.length).toBe(7);
    expect(ayahEndersUthmani?.map((w) => w.ayahNumber)).toEqual([1, 2, 3, 4, 5, 6, 7]);

    const ayahEndersIndoPak = fatihah?.wordsIndoPak.filter((w) => w.isAyahEnd);
    expect(ayahEndersIndoPak?.length).toBe(7);
    expect(ayahEndersIndoPak?.map((w) => w.ayahNumber)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });
});
