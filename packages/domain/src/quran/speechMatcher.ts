/**
 * Speech Matcher & Arabic Normalizer for Live Quranic Recitation Alignment
 */

export function normalizeArabic(text: string): string {
  if (!text) return "";
  return text
    // Replace dagger alif \u0670 with standard alif
    .replace(/\u0670/g, "ا")
    // Remove Tatweel/Kashida \u0640
    .replace(/\u0640/g, "")
    // Remove Quranic annotation signs & pauses
    .replace(/[\u06D6-\u06ED\u065F\u06E2\u06E3\u06E4\u0600-\u0605]/g, "")
    // Remove all Harakat (diacritics/vowels)
    .replace(/[\u0610-\u061A\u064B-\u065E]/g, "")
    // Normalize all Alif variants
    .replace(/[إأآٱ]/g, "ا")
    // Normalize Yaa / Alif Maqsura
    .replace(/[ىي]/g, "ي")
    // Normalize Taa Marbuta
    .replace(/ة/g, "ه")
    .trim();
}

export const QURAN_PHONETIC_FALLBACK: Record<number, string[]> = {
  0: ["alhamdu", "alhamd", "alhamdulillah", "elhamd", "hamd", "al-hamdu", "الحمد", "حمد"],
  1: ["lillahi", "lillah", "allah", "lellah", "lillāhi", "لله", "الله"],
  2: ["rabbi", "rabb", "rab", "rub", "rab-bi", "رب"],
  3: ["alameen", "alalamin", "al-alameen", "aalamin", "alamin", "al-ʿālamīn", "العالمين", "عالمين"]
};

export function matchSpokenTextToVerse(
  spokenTranscript: string,
  verseWords: string[]
): number | null {
  if (!spokenTranscript || !verseWords.length) return null;

  const clean = spokenTranscript.trim();
  const spokenTokens = clean.split(/\s+/).map(normalizeArabic).filter(Boolean);
  const normWords = verseWords.map(normalizeArabic);

  // 1. Direct Arabic match
  for (let vIdx = 0; vIdx < normWords.length; vIdx++) {
    const vWord = normWords[vIdx];
    if (!vWord) continue;

    const isMatch = spokenTokens.some(tok => 
      tok === vWord || 
      (tok.length >= 3 && vWord.includes(tok)) || 
      (vWord.length >= 3 && tok.includes(vWord))
    );

    if (isMatch) {
      return vIdx;
    }
  }

  // 2. Phonetic / Transliteration match
  const lowerClean = clean.toLowerCase();
  for (let vIdx = 0; vIdx < verseWords.length; vIdx++) {
    const phonetics = QURAN_PHONETIC_FALLBACK[vIdx] || [];
    if (phonetics.some(p => lowerClean.includes(p))) {
      return vIdx;
    }
  }

  return null;
}
