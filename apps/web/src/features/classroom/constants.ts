import { ScriptType, TajweedWord } from "./types";

export function splitArabicWord(word: string): string[] {
  const regex = /[\u0621-\u064A\u0671-\u06D3\u06D5][\u0610-\u061A\u064B-\u065F\u0670]*/g;
  return word.match(regex) || [];
}

export function normalizeArabic(text: string): string {
  if (!text) return "";
  return text
    .replace(/\u0670/g, "ا")
    .replace(/\u0640/g, "")
    .replace(/[\u06D6-\u06ED\u065F\u06E2\u06E3\u06E4\u0600-\u0605]/g, "")
    .replace(/[\u0610-\u061A\u064B-\u065E]/g, "")
    .replace(/[إأآٱ]/g, "ا")
    .replace(/[ىي]/g, "ي")
    .replace(/ة/g, "ه")
    .trim();
}

export const PHONETIC_MAP: Record<number, string[]> = {
  0: ["alhamdu", "alhamd", "alhamdulillah", "elhamd", "hamd", "al-hamdu", "الحمد", "حمد"],
  1: ["lillahi", "lillah", "allah", "lellah", "lillāhi", "لله", "الله"],
  2: ["rabbi", "rabb", "rab", "rub", "rab-bi", "رب"],
  3: ["alameen", "alalamin", "al-alameen", "aalamin", "alamin", "al-ʿālamīn", "العالمين", "عالمين"]
};

export const SCRIPT_DATA: Record<ScriptType, TajweedWord[]> = {
  uthmani: [
    { word: "ٱلْحَمْدُ", tajweed: "Izhar Qamari", type: "none" },
    { word: "لِلَّهِ", tajweed: "Tarqeeq (Light Lam)", type: "none" },
    { word: "رَبِّ", tajweed: "Tafkheem (Full Ra)", type: "none" },
    { word: "ٱلْعَـٰلَمِينَ", tajweed: "Madd Aaridh (2-4-6)", type: "madd" }
  ],
  indopak: [
    { word: "اَلْحَمْدُ", tajweed: "Izhar Qamari", type: "none" },
    { word: "لِلّٰهِ", tajweed: "Tarqeeq (Light Lam)", type: "none" },
    { word: "رَبِّ", tajweed: "Tafkheem (Full Ra)", type: "none" },
    { word: "الْعٰلَمِیْنَ", tajweed: "Madd Aaridh (2-4-6)", type: "madd" }
  ]
};
