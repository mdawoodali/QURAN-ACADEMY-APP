import { ScriptType, TajweedWord, ClassroomLesson } from "./types";

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

// Default single-ayah baseline kept for backward compatibility and existing tests
export const SCRIPT_DATA: Record<ScriptType, TajweedWord[]> = {
  uthmani: [
    { word: "ٱلْحَمْدُ", tajweed: "Izhar Qamari", type: "none", rule: "none" },
    { word: "لِلَّهِ", tajweed: "Tarqeeq (Light Lam)", type: "none", rule: "none" },
    { word: "رَبِّ", tajweed: "Tafkheem (Full Ra)", type: "none", rule: "none" },
    { word: "ٱلْعَـٰلَمِينَ", tajweed: "Madd Aaridh (2-4-6)", type: "madd", rule: "madd" }
  ],
  indopak: [
    { word: "اَلْحَمْدُ", tajweed: "Izhar Qamari", type: "none", rule: "none" },
    { word: "لِلّٰهِ", tajweed: "Tarqeeq (Light Lam)", type: "none", rule: "none" },
    { word: "رَبِّ", tajweed: "Tafkheem (Full Ra)", type: "none", rule: "none" },
    { word: "الْعٰلَمِیْنَ", tajweed: "Madd Aaridh (2-4-6)", type: "madd", rule: "madd" }
  ]
};

// Full Multi-Ayah Curriculum Lessons
export const CURRICULUM_LESSONS: ClassroomLesson[] = [
  {
    id: "fatihah-2",
    title: "Surah Al-Fatihah • Ayah 2",
    subtitle: "Praise of Allah (The Opening)",
    category: "quran",
    surahNumber: 1,
    ayahNumber: 2,
    translation: "All praise belongs to Allah, Lord of all the worlds.",
    wordsUthmani: [
      { word: "ٱلْحَمْدُ", tajweed: "Izhar Qamari", type: "none", rule: "none", makhrajHint: "Clear Alif-Lam" },
      { word: "لِلَّهِ", tajweed: "Tarqeeq (Light Lam)", type: "none", rule: "none", makhrajHint: "Light Lam tone" },
      { word: "رَبِّ", tajweed: "Tafkheem (Full Ra)", type: "none", rule: "none", makhrajHint: "Heavy vibrant Ra" },
      { word: "ٱلْعَـٰلَمِينَ", tajweed: "Madd Aaridh (2-4-6 Harakat)", type: "madd", rule: "madd", makhrajHint: "Throat Ayn with elongation" }
    ],
    wordsIndoPak: [
      { word: "اَلْحَمْدُ", tajweed: "Izhar Qamari", type: "none", rule: "none", makhrajHint: "Clear Alif-Lam" },
      { word: "لِلّٰهِ", tajweed: "Tarqeeq (Light Lam)", type: "none", rule: "none", makhrajHint: "Light Lam tone" },
      { word: "رَبِّ", tajweed: "Tafkheem (Full Ra)", type: "none", rule: "none", makhrajHint: "Heavy vibrant Ra" },
      { word: "الْعٰلَمِیْنَ", tajweed: "Madd Aaridh (2-4-6 Harakat)", type: "madd", rule: "madd", makhrajHint: "Throat Ayn with elongation" }
    ]
  },
  {
    id: "fatihah-1",
    title: "Surah Al-Fatihah • Ayah 1 (Basmalah)",
    subtitle: "In the Name of Allah",
    category: "quran",
    surahNumber: 1,
    ayahNumber: 1,
    translation: "In the Name of Allah, the Most Compassionate, the Ever Merciful.",
    wordsUthmani: [
      { word: "بِسْمِ", tajweed: "Tarqeeq", type: "none", rule: "none" },
      { word: "ٱللَّهِ", tajweed: "Tarqeeq", type: "none", rule: "none" },
      { word: "ٱلرَّحْمَـٰنِ", tajweed: "Madd Tabi'i", type: "none", rule: "none" },
      { word: "ٱلرَّحِيمِ", tajweed: "Madd Aaridh", type: "madd", rule: "madd" }
    ],
    wordsIndoPak: [
      { word: "بِسْمِ", tajweed: "Tarqeeq", type: "none", rule: "none" },
      { word: "اللہِ", tajweed: "Tarqeeq", type: "none", rule: "none" },
      { word: "الرَّحْمٰنِ", tajweed: "Madd Tabi'i", type: "none", rule: "none" },
      { word: "الرَّحِیْمِ", tajweed: "Madd Aaridh", type: "madd", rule: "madd" }
    ]
  },
  {
    id: "ikhlas-all",
    title: "Surah Al-Ikhlas • Complete (112:1–4)",
    subtitle: "The Purity of Tawheed",
    category: "quran",
    surahNumber: 112,
    ayahNumber: 1,
    translation: "Say, He is Allah, [who is] One. Allah, the Eternal Refuge. He neither begets nor is born, Nor is there to Him any equivalent.",
    wordsUthmani: [
      { word: "قُلْ", tajweed: "Tafkheem Qaf", type: "none", rule: "throat", makhrajHint: "Deep uvula Qaf" },
      { word: "هُوَ", tajweed: "Light Ha", type: "none", rule: "none" },
      { word: "ٱللَّهُ", tajweed: "Tafkheem Lam", type: "none", rule: "none" },
      { word: "أَحَدٌ", tajweed: "Qalqalah Dal", type: "none", rule: "qalqalah", makhrajHint: "Vibrant echo on Dal" },
      { word: "ٱللَّهُ", tajweed: "Tafkheem Lam", type: "none", rule: "none" },
      { word: "ٱلصَّمَدُ", tajweed: "Qalqalah Dal", type: "none", rule: "qalqalah" },
      { word: "لَمْ", tajweed: "Izhar Shafawi", type: "none", rule: "none" },
      { word: "يَلِدْ", tajweed: "Qalqalah Dal", type: "none", rule: "qalqalah" },
      { word: "وَلَمْ", tajweed: "Izhar Shafawi", type: "none", rule: "none" },
      { word: "يُولَدْ", tajweed: "Qalqalah Dal", type: "none", rule: "qalqalah" },
      { word: "وَلَمْ", tajweed: "Izhar Shafawi", type: "none", rule: "none" },
      { word: "يَكُن", tajweed: "Ikhfa Nun", type: "none", rule: "ikhfa", makhrajHint: "Nasal Ghunnah sound" },
      { word: "لَّهُۥ", tajweed: "Idgham bila Ghunnah", type: "none", rule: "none" },
      { word: "كُفُوًا", tajweed: "Dammah on Fa", type: "none", rule: "none" },
      { word: "أَحَدٌۢ", tajweed: "Qalqalah Kubra", type: "none", rule: "qalqalah" }
    ],
    wordsIndoPak: [
      { word: "قُلْ", tajweed: "Tafkheem Qaf", type: "none", rule: "throat", makhrajHint: "Deep uvula Qaf" },
      { word: "هُوَ", tajweed: "Light Ha", type: "none", rule: "none" },
      { word: "اللہُ", tajweed: "Tafkheem Lam", type: "none", rule: "none" },
      { word: "اَحَدٌ", tajweed: "Qalqalah Dal", type: "none", rule: "qalqalah", makhrajHint: "Vibrant echo on Dal" },
      { word: "اَللہُ", tajweed: "Tafkheem Lam", type: "none", rule: "none" },
      { word: "الصَّمَدُ", tajweed: "Qalqalah Dal", type: "none", rule: "qalqalah" },
      { word: "لَمْ", tajweed: "Izhar Shafawi", type: "none", rule: "none" },
      { word: "یَلِدْ", tajweed: "Qalqalah Dal", type: "none", rule: "qalqalah" },
      { word: "وَلَمْ", tajweed: "Izhar Shafawi", type: "none", rule: "none" },
      { word: "یُوْلَدْ", tajweed: "Qalqalah Dal", type: "none", rule: "qalqalah" },
      { word: "وَلَمْ", tajweed: "Izhar Shafawi", type: "none", rule: "none" },
      { word: "یَکُنْ", tajweed: "Ikhfa Nun", type: "none", rule: "ikhfa", makhrajHint: "Nasal Ghunnah sound" },
      { word: "لَّہٗ", tajweed: "Idgham bila Ghunnah", type: "none", rule: "none" },
      { word: "کُفُوًا", tajweed: "Dammah on Fa", type: "none", rule: "none" },
      { word: "اَحَدٌ", tajweed: "Qalqalah Kubra", type: "none", rule: "qalqalah" }
    ]
  },
  {
    id: "qaida-mufradaat",
    title: "Noorani Qaida • Lesson 1 (Huruf Mufradaat)",
    subtitle: "Isolated Arabic Alphabet",
    category: "qaida",
    translation: "Master individual letter articulation points (Makhaarij).",
    wordsUthmani: [
      { word: "اَ", tajweed: "Alif (Throat)", type: "none", rule: "throat" },
      { word: "بَ", tajweed: "Baa (Lips)", type: "none", rule: "none" },
      { word: "تَ", tajweed: "Taa (Teeth/Tongue)", type: "none", rule: "none" },
      { word: "ثَ", tajweed: "Thaa (Soft tip)", type: "none", rule: "none" },
      { word: "جَ", tajweed: "Jeem (Mid-tongue)", type: "none", rule: "qalqalah" },
      { word: "حَ", tajweed: "Haa (Mid-throat)", type: "none", rule: "throat", makhrajHint: "Clean friction in mid-throat" },
      { word: "خَ", tajweed: "Khaa (Upper throat)", type: "none", rule: "throat", makhrajHint: "Heavy scraping sound" }
    ],
    wordsIndoPak: [
      { word: "اَ", tajweed: "Alif (Throat)", type: "none", rule: "throat" },
      { word: "بَ", tajweed: "Baa (Lips)", type: "none", rule: "none" },
      { word: "تَ", tajweed: "Taa (Teeth/Tongue)", type: "none", rule: "none" },
      { word: "ثَ", tajweed: "Thaa (Soft tip)", type: "none", rule: "none" },
      { word: "جَ", tajweed: "Jeem (Mid-tongue)", type: "none", rule: "qalqalah" },
      { word: "حَ", tajweed: "Haa (Mid-throat)", type: "none", rule: "throat", makhrajHint: "Clean friction in mid-throat" },
      { word: "خَ", tajweed: "Khaa (Upper throat)", type: "none", rule: "throat", makhrajHint: "Heavy scraping sound" }
    ]
  }
];
