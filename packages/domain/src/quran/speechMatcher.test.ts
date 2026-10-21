import { describe, it, expect } from "vitest";
import { normalizeArabic, matchSpokenTextToVerse } from "./speechMatcher";

describe("SpeechMatcher & Arabic Normalizer", () => {
  it("normalizes Arabic text by removing harakat (tashkeel)", () => {
    const withVowels = "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ";
    const normalized = normalizeArabic(withVowels);
    expect(normalized).toBe("الحمد لله رب العالمين");
  });

  it("normalizes various Alif glyphs to bare Alif", () => {
    expect(normalizeArabic("إِيَّاكَ")).toBe("اياك");
    expect(normalizeArabic("أَنْعَمْتَ")).toBe("انعمت");
    expect(normalizeArabic("ٱلصِّرَاطَ")).toBe("الصراط");
    expect(normalizeArabic("آمِينَ")).toBe("امين");
  });

  it("removes tatweel/kashida characters", () => {
    expect(normalizeArabic("كـــتـــاب")).toBe("كتاب");
  });

  it("normalizes Taa Marbuta and Alif Maqsura", () => {
    expect(normalizeArabic("رَحْمَة")).toBe("رحمه");
    expect(normalizeArabic("هُدَى")).toBe("هدي");
  });

  it("matches spoken Arabic words to verse positions", () => {
    const verseWords = ["ٱلْحَمْدُ", "لِلَّهِ", "رَبِّ", "ٱلْعَـٰلَمِينَ"];
    
    // Exact word match
    expect(matchSpokenTextToVerse("الحمد", verseWords)).toBe(0);
    expect(matchSpokenTextToVerse("لله", verseWords)).toBe(1);
    expect(matchSpokenTextToVerse("رب", verseWords)).toBe(2);
    expect(matchSpokenTextToVerse("العالمين", verseWords)).toBe(3);
  });

  it("matches phonetic English transliteration", () => {
    const verseWords = ["ٱلْحَمْدُ", "لِلَّهِ", "رَبِّ", "ٱلْعَـٰلَمِينَ"];
    
    expect(matchSpokenTextToVerse("alhamdulillah", verseWords)).toBe(0);
    expect(matchSpokenTextToVerse("rabbi", verseWords)).toBe(2);
    expect(matchSpokenTextToVerse("alameen", verseWords)).toBe(3);
  });

  it("returns null for empty or non-matching input", () => {
    const verseWords = ["ٱلْحَمْدُ", "لِلَّهِ"];
    expect(matchSpokenTextToVerse("", verseWords)).toBeNull();
    expect(matchSpokenTextToVerse("completely unrelated phrase", verseWords)).toBeNull();
  });
});
