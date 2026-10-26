import { ScriptType, TajweedWord, ClassroomLesson } from "./types";

export function splitArabicWord(word: string): string[] {
  const regex = /[\u0621-\u064A\u0671-\u06D3\u06D5][\u0610-\u061A\u064B-\u065F\u0670]*/g;
  return word.match(regex) || [];
}

export function toArabicNumerals(num: number, script: ScriptType = "uthmani"): string {
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  const indopakDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const digits = script === "indopak" ? indopakDigits : arabicDigits;
  return String(num)
    .split("")
    .map((d) => digits[parseInt(d, 10)] ?? d)
    .join("");
}

export function normalizeArabic(text: string): string {
  if (!text) return "";
  return text
    // Normalize forms of Allah / Lillah before diacritics removal to prevent dagger-alif corruption
    .replace(/لِلَّهِ|لِلّٰهِ|لِلَّـهِ|لِلّٰـهِ/g, "لله")
    .replace(/ٱللَّهِ|ٱللّٰهِ|اللَّهِ|اللّٰهِ/g, "الله")
    .replace(/\u0670/g, "ا")
    .replace(/\u0640/g, "")
    .replace(/[\u06D6-\u06ED\u065F\u06E2\u06E3\u06E4\u0600-\u0605\u06DD]/g, "")
    .replace(/[\u0610-\u061A\u064B-\u065E\u0653\u0654\u0655]/g, "")
    .replace(/[إأآٱ]/g, "ا")
    .replace(/[ىيیئ]/g, "ي")
    .replace(/[كک]/g, "ك")
    .replace(/[ؤ]/g, "و")
    .replace(/ة/g, "ه")
    .replace(/للاه/g, "لله")
    .replace(/[\u200B-\u200F\u202A-\u202E\uFE80-\uFEFC]/g, "")
    .replace(/[.,\/#!$%\^&\*;:{}=\-_~`()?"'۝]/g, "")
    .replace(/رحمان/g, "رحمن")
    .trim();
}

export function stripArabicPrefix(text: string): string {
  const norm = normalizeArabic(text);
  if (!norm) return "";
  let s = norm;
  if (s.startsWith("و") && s.length >= 4) {
    s = s.slice(1);
  }
  if (s.startsWith("ال") && s.length >= 4) {
    s = s.slice(2);
  }
  return s;
}

export const ARABIC_TO_TRANSLITERATION_MAP: Record<string, string[]> = {
  // Surah Al-Fatihah words
  بسم: ["bismi", "bism", "bismillah"],
  الله: ["allahi", "allah", "lillah", "lillahi"],
  لله: ["lillahi", "lillah", "allah", "lellah"],
  الرحمن: ["ar-rahmani", "ar-rahman", "rahman", "al-rahman"],
  رحمان: ["ar-rahmani", "ar-rahman", "rahman", "al-rahman"],
  الرحيم: ["ar-rahimi", "ar-rahim", "rahim", "al-rahim"],
  الحمد: ["alhamdu", "alhamd", "elhamd", "hamd", "alhamdulillah"],
  رب: ["rabbi", "rabb", "rab", "rub"],
  العالمين: ["al-alameen", "al-alamin", "alameen", "alamin", "aalamin"],
  مالك: ["maliki", "maalik", "malik"],
  يوم: ["yawmi", "yawm", "yom"],
  الدين: ["ad-deeni", "ad-deen", "deen", "ad-din", "din"],
  اياك: ["iyyaka", "eyyaka", "iyaka"],
  نعبد: ["na'budu", "nabudu", "naabudu"],
  واياك: ["wa-iyyaka", "waiyyaka", "wa-eyyaka", "waeyyaka", "iyyaka"],
  نستعين: ["nasta'een", "nastaeen", "nasta'in", "nastain"],
  اهدنا: ["ihdina", "ehdina"],
  الصراط: ["as-sirat", "assirat", "sirat", "as-sirata", "sirata"],
  صراط: ["sirat", "sirata", "as-sirat"],
  المستقيم: ["al-mustaqeem", "almustaqeem", "mustaqeem", "mustaqim", "al-mustaqim"],
  الذين: ["alladhina", "allazina", "allatheena", "allazeena"],
  انعمت: ["an'amta", "anamta", "an-amta"],
  عليهم: ["alayhim", "alaihim"],
  غير: ["ghayr", "ghair", "ghayri", "ghairi", "ghayril", "ghairil"],
  المغضوب: ["al-maghdubi", "almaghdubi", "maghdub", "maghdubi", "al-maghdub"],
  ولا: ["wa-la", "wala"],
  الضالين: ["ad-dallin", "dallin", "zaalleen", "dhaalleen", "daalleen", "al-dallin"],

  // Surah Al-Ikhlas words
  قل: ["qul"],
  هو: ["huwa"],
  احد: ["ahad", "ahadun"],
  الصمد: ["as-samad", "samad"],
  لم: ["lam"],
  يلد: ["yalid"],
  ولم: ["wa-lam", "walam", "lam"],
  يولد: ["yulad"],
  يكن: ["yakun"],
  له: ["lahu"],
  كفوا: ["kufuwan", "kufuwa"],

  // Surah Al-Falaq words
  اعوذ: ["a'udhu", "audhu"],
  برب: ["bi-rabbi", "birabbi", "rabbi"],
  الفلق: ["al-falaq", "alfalaq", "falaq"],
  من: ["min"],
  شر: ["sharri", "sharr", "shar"],
  ما: ["ma"],
  خلق: ["khalaq", "khalaqa"],
  ومن: ["wa-min", "wamin", "min"],
  غاسق: ["ghasiqin", "ghasiq"],
  اذا: ["idha", "iza"],
  وقب: ["waqab", "waqaba"],
  النفاثات: ["an-naffathat", "annaffathat", "naffathat"],
  في: ["fee", "fi"],
  العقد: ["al-'uqad", "al-uqad", "uqad"],
  حاسد: ["hasidin", "hasid"],
  حسد: ["hasad", "hasada"],

  // Surah An-Nas words
  الناس: ["an-nas", "annas", "nas"],
  ملك: ["malik", "maliki"],
  اله: ["ilahi", "ilah"],
  الاه: ["ilahi", "ilah"],
  الوسواس: ["al-waswas", "alwaswas", "waswas"],
  الخناس: ["al-khannas", "alkhannas", "khannas"],
  الذي: ["alladhi", "allazi"],
  يوسوس: ["yuwaswisu", "yuwaswis"],
  صدور: ["suduri", "sudur"],
  الجنة: ["al-jinnati", "aljinnah", "jinnah"],
  والناس: ["wan-nas", "wannas", "an-nas", "annas", "nas"],

  // Qaida Mufradaat letter names
  ا: ["alif", "الف"],
  ب: ["baa", "ba", "با", "باء"],
  ت: ["taa", "ta", "تا", "تاء"],
  ث: ["thaa", "tha", "ثا", "ثاء"],
  ج: ["jeem", "jim", "جيم"],
  ح: ["haa", "ha", "حا", "حاء"],
  خ: ["khaa", "kha", "خا", "خاء"],
  د: ["dal", "دال"],
  ذ: ["dhal", "zal", "ذال"],
  ر: ["raa", "ra", "را", "راء"],
  ز: ["zay", "za", "زا", "زاي"],
  س: ["seen", "sin", "سين"],
  ش: ["sheen", "shin", "شين"],
  ص: ["saad", "sad", "صاد"],
  ض: ["daad", "dhad", "dad", "ضاد"],
  ط: ["taa", "taw", "طا", "طاء"],
  ظ: ["zaa", "zzaw", "zhaa", "ظا", "ظاء"],
  ع: ["ayn", "ain", "عين"],
  غ: ["ghayn", "ghain", "غين"],
  ف: ["faa", "fa", "فا", "فاء"],
  ق: ["qaaf", "qaf", "قاف"],
  ك: ["kaaf", "kaf", "كاف"],
  ل: ["laam", "lam", "لام"],
  م: ["meem", "mim", "ميم"],
  ن: ["noon", "nun", "نون"],
  و: ["waw", "واو"],
  ه: ["haa", "ha", "ها", "هاء"],
  ء: ["hamzah", "hamza", "همزة"],
  ي: ["yaa", "ya", "يا", "ياء"],
};

export function getWordFallbacks(word: string): string[] {
  const norm = normalizeArabic(word);
  const stripped = stripArabicPrefix(norm);
  const result = new Set<string>();

  if (ARABIC_TO_TRANSLITERATION_MAP[norm]) {
    ARABIC_TO_TRANSLITERATION_MAP[norm].forEach((f) => result.add(f.toLowerCase()));
  }
  if (ARABIC_TO_TRANSLITERATION_MAP[stripped]) {
    ARABIC_TO_TRANSLITERATION_MAP[stripped].forEach((f) => result.add(f.toLowerCase()));
  }

  return Array.from(result);
}

export const PHONETIC_MAP: Record<number, string[]> = {
  0: ["الحمد", "حمد", "الحمْدُ", "أَلْحَمْدُ", "بسم", "بِسْمِ"],
  1: ["لله", "الله", "لِلَّهِ", "لِلّٰهِ"],
  2: ["رب", "رَبِّ", "رَبِّ", "الرحمن", "الرَّحْمٰنِ"],
  3: ["العالمين", "عالمين", "الْعَالَمِينَ", "الْعٰلَمِیْنَ", "الرحيم", "الرَّحِیْمِ"],
  4: ["الرحمن", "الرَّحْمٰنِ", "مالك", "مَـٰلِكِ"],
  5: ["الرحيم", "الرَّحِیْمِ", "يوم", "يَوْمِ"],
  6: ["مالك", "مَـٰلِكِ", "الدين", "ٱلدِّينِ"],
  7: ["يوم", "يَوْمِ", "اياك", "إِيَّاكَ"],
  8: ["الدين", "ٱلدِّينِ", "نعبد", "نَعْبُدُ"],
  9: ["اياك", "إِيَّاكَ", "واياك", "وَإِيَّاكَ"],
  10: ["نعبد", "نَعْبُدُ", "نستعين", "نَسْتَعِينُ"],
  11: ["واياك", "وَإِيَّاكَ", "اهدنا", "ٱهْدِنَا"],
  12: ["نستعين", "نَسْتَعِينُ", "الصراط", "ٱلصِّرَٰطَ"],
  13: ["اهدنا", "ٱهْدِنَا", "المستقيم", "ٱلْمُسْتَقِيمَ"],
  14: ["الصراط", "ٱلصِّرَٰطَ", "صراط", "صِرَٰطَ"],
  15: ["المستقيم", "ٱلْمُسْتَقِيمَ", "الذين", "ٱلَّذِينَ"],
  16: ["صراط", "صِرَٰطَ", "انعمت", "أَنْعَمْتَ"],
  17: ["الذين", "ٱلَّذِينَ", "عليهم", "عَلَيْهِمْ"],
  18: ["انعمت", "أَنْعَمْتَ", "غير", "غَيْرِ"],
  19: ["عليهم", "عَلَيْهِمْ", "المغضوب", "ٱلْمَغْضُوبِ"],
  20: ["غير", "غَيْرِ", "عليهم", "عَلَيْهِمْ"],
  21: ["المغضوب", "ٱلْمَغْضُوبِ", "ولا", "وَلَا"],
  22: ["عليهم", "عَلَيْهِمْ", "الضالين", "ٱلضَّآلِّينَ"],
  23: ["ولا", "وَلَا"],
  24: ["الضالين", "ٱلضَّآلِّينَ"]
};

export const QURAN_PHONETIC_FALLBACK: Record<number, string[]> = {
  0: ["bismi", "bism", "bismillah", "alhamdu", "alhamd", "alhamdulillah"],
  1: ["allah", "allahi", "lillah", "lillahi"],
  2: ["ar-rahman", "rahman", "ar-rahmani", "al-rahman", "rabbi", "rabb"],
  3: ["ar-rahim", "rahim", "ar-rahimi", "al-rahim", "alameen", "al-alameen"],
  4: ["alhamdu", "alhamd", "alhamdulillah", "elhamd", "hamd"],
  5: ["lillahi", "lillah", "allah", "lellah"],
  6: ["rabbi", "rabb", "rab", "rub"],
  7: ["alameen", "alalamin", "al-alameen", "aalamin", "alamin"],
  8: ["ar-rahman", "rahman", "ar-rahmani", "al-rahman"],
  9: ["ar-rahim", "rahim", "ar-rahimi", "al-rahim"],
  10: ["maliki", "maalik", "malik"],
  11: ["yawm", "yawmi", "yom"],
  12: ["ad-deen", "deen", "ad-din", "din"],
  13: ["iyyaka", "eyyaka", "iyaka"],
  14: ["na'budu", "nabudu", "naabudu"],
  15: ["wa-iyyaka", "waiyyaka", "wa-eyyaka", "waeyyaka", "iyyaka"],
  16: ["nasta'een", "nastaeen", "nasta'in", "nastain"],
  17: ["ihdina", "ehdina"],
  18: ["as-sirat", "assirat", "sirat", "as-sirata"],
  19: ["al-mustaqeem", "almustaqeem", "mustaqeem", "mustaqim"],
  20: ["sirat", "sirata", "as-sirat"],
  21: ["alladhina", "allazina", "allatheena", "allazeena"],
  22: ["an'amta", "anamta", "an-amta"],
  23: ["alayhim", "alaihim"],
  24: ["ghayr", "ghair", "ghayri", "ghairi", "ghayril"],
  25: ["al-maghdubi", "almaghdubi", "maghdub", "maghdubi"],
  26: ["alayhim", "alaihim"],
  27: ["wa-la", "wala"],
  28: ["ad-dallin", "dallin", "zaalleen", "dhaalleen", "daalleen", "al-dallin"]
};

export const SCRIPT_DATA: Record<ScriptType, TajweedWord[]> = {
  uthmani: [
    { word: "ٱلْحَمْدُ", tajweed: "Makhraj: Throat Haa (ح) & Izhar Qamari", type: "throat", rule: "throat" },
    { word: "لِلَّهِ", tajweed: "Tarqeeq (Light Lam of Majesty)", type: "none", rule: "none" },
    { word: "رَبِّ", tajweed: "Tafkheem (Full/Heavy Ra)", type: "none", rule: "none" },
    { word: "ٱلْعَـٰلَمِينَ", tajweed: "Madd Aaridh Li-s-Sukoon (2-4-6 counts)", type: "madd", rule: "madd", isAyahEnd: true, ayahNumber: 2 }
  ],
  indopak: [
    { word: "اَلْحَمْدُ", tajweed: "Makhraj: Throat Haa (ح) & Izhar Qamari", type: "throat", rule: "throat" },
    { word: "لِلّٰهِ", tajweed: "Tarqeeq (Light Lam of Majesty)", type: "none", rule: "none" },
    { word: "رَبِّ", tajweed: "Tafkheem (Full/Heavy Ra)", type: "none", rule: "none" },
    { word: "الْعٰلَمِیْنَ", tajweed: "Madd Aaridh Li-s-Sukoon (2-4-6 counts)", type: "madd", rule: "madd", isAyahEnd: true, ayahNumber: 2 }
  ]
};

// Full Multi-Ayah Curriculum Lessons with Proper Integrated Tajweed Rules
export const CURRICULUM_LESSONS: ClassroomLesson[] = [
  {
    id: "fatihah-all",
    title: "Surah Al-Fatihah • Complete (1:1–7)",
    subtitle: "The Opening • Umm al-Kitab",
    category: "quran",
    surahNumber: 1,
    ayahNumber: 1,
    translation: "In the Name of Allah, the Most Compassionate, the Ever Merciful. All praise belongs to Allah, Lord of all worlds.",
    wordsUthmani: [
      { word: "بِسْمِ", tajweed: "Tarqeeq on Baa & Seen", type: "none", rule: "none" },
      { word: "ٱللَّهِ", tajweed: "Tarqeeq (Light Lam of Majesty)", type: "none", rule: "none" },
      { word: "ٱلرَّحْمَـٰنِ", tajweed: "Makhraj: Throat Haa (ح) & Madd Tabi'i", type: "throat", rule: "throat", makhrajHint: "Clean friction in mid-throat" },
      { word: "ٱلرَّحِيمِ", tajweed: "Madd Aaridh Li-s-Sukoon (2-4-6 counts)", type: "madd", rule: "madd", makhrajHint: "Prolonged elongation before Waqf", isAyahEnd: true, ayahNumber: 1 },
      { word: "ٱلْحَمْدُ", tajweed: "Makhraj: Throat Haa (ح) & Izhar Qamari", type: "throat", rule: "throat", makhrajHint: "Mid-throat Haa with clear Lam" },
      { word: "لِلَّهِ", tajweed: "Tarqeeq (Light Lam)", type: "none", rule: "none" },
      { word: "رَبِّ", tajweed: "Tafkheem (Full vibrant Ra)", type: "none", rule: "none" },
      { word: "ٱلْعَـٰلَمِينَ", tajweed: "Makhraj: Throat Ayn (ع) & Madd Aaridh", type: "madd", rule: "madd", makhrajHint: "Deep mid-throat Ayn with Madd", isAyahEnd: true, ayahNumber: 2 },
      { word: "ٱلرَّحْمَـٰنِ", tajweed: "Makhraj: Throat Haa (ح) & Madd Tabi'i", type: "throat", rule: "throat" },
      { word: "ٱلرَّحِيمِ", tajweed: "Madd Aaridh Li-s-Sukoon", type: "madd", rule: "madd", isAyahEnd: true, ayahNumber: 3 },
      { word: "مَـٰلِكِ", tajweed: "Madd Tabi'i (2 counts elongation)", type: "madd", rule: "madd" },
      { word: "يَوْمِ", tajweed: "Harf Leen (Soft Waw)", type: "none", rule: "none" },
      { word: "ٱلدِّينِ", tajweed: "Madd Aaridh Li-s-Sukoon", type: "madd", rule: "madd", isAyahEnd: true, ayahNumber: 4 },
      { word: "إِيَّاكَ", tajweed: "Shaddah Nabrah on Yaa", type: "none", rule: "none" },
      { word: "نَعْبُدُ", tajweed: "Makhraj: Middle-Throat Ayn (ع)", type: "throat", rule: "throat", makhrajHint: "Mid-throat constriction" },
      { word: "وَإِيَّاكَ", tajweed: "Shaddah Nabrah on Yaa", type: "none", rule: "none" },
      { word: "نَسْتَعِينُ", tajweed: "Makhraj: Throat Ayn & Madd Aaridh", type: "madd", rule: "madd", isAyahEnd: true, ayahNumber: 5 },
      { word: "ٱهْدِنَا", tajweed: "Makhraj: Deep Lower-Throat Haa (ه)", type: "throat", rule: "throat", makhrajHint: "Deep chest-throat vocalization" },
      { word: "ٱلصِّرَٰطَ", tajweed: "Tafkheem (Heavy Sad & Taa) & Madd", type: "throat", rule: "throat" },
      { word: "ٱلْمُسْتَقِيمَ", tajweed: "Madd Aaridh Li-s-Sukoon", type: "madd", rule: "madd", isAyahEnd: true, ayahNumber: 6 },
      { word: "صِرَٰطَ", tajweed: "Tafkheem (Heavy Sad & Taa)", type: "throat", rule: "throat" },
      { word: "ٱلَّذِينَ", tajweed: "Makhraj: Soft-tip Dhal (ذ)", type: "none", rule: "none" },
      { word: "أَنْعَمْتَ", tajweed: "Izhar Halqi / Ghunnah on Noon", type: "ikhfa", rule: "ikhfa", makhrajHint: "Clear Noon followed by Throat Ayn" },
      { word: "عَلَيْهِمْ", tajweed: "Makhraj: Throat Ayn (ع) & Izhar Shafawi", type: "throat", rule: "throat" },
      { word: "غَيْرِ", tajweed: "Makhraj: Upper-Throat Ghayn (غ)", type: "throat", rule: "throat", makhrajHint: "Upper throat gargle sound" },
      { word: "ٱلْمَغْضُوبِ", tajweed: "Makhraj: Upper-Throat Ghayn (غ) & Dhad", type: "throat", rule: "throat" },
      { word: "عَلَيْهِمْ", tajweed: "Makhraj: Throat Ayn & Izhar Shafawi", type: "throat", rule: "throat" },
      { word: "وَلَا", tajweed: "Madd Tabi'i (2 counts)", type: "madd", rule: "madd" },
      { word: "ٱلضَّآلِّينَ", tajweed: "Madd Lazim Kalimi Muthaqqal (6 counts compulsory)", type: "madd", rule: "madd", makhrajHint: "Compulsory 6-count Madd with Shaddah", isAyahEnd: true, ayahNumber: 7 }
    ],
    wordsIndoPak: [
      { word: "بِسْمِ", tajweed: "Tarqeeq on Baa & Seen", type: "none", rule: "none" },
      { word: "اللہِ", tajweed: "Tarqeeq (Light Lam of Majesty)", type: "none", rule: "none" },
      { word: "الرَّحْمٰنِ", tajweed: "Makhraj: Throat Haa (ح) & Madd Tabi'i", type: "throat", rule: "throat" },
      { word: "الرَّحِیْمِ", tajweed: "Madd Aaridh Li-s-Sukoon (2-4-6 counts)", type: "madd", rule: "madd", isAyahEnd: true, ayahNumber: 1 },
      { word: "اَلْحَمْدُ", tajweed: "Makhraj: Throat Haa (ح) & Izhar Qamari", type: "throat", rule: "throat" },
      { word: "لِلّٰهِ", tajweed: "Tarqeeq (Light Lam)", type: "none", rule: "none" },
      { word: "رَبِّ", tajweed: "Tafkheem (Full vibrant Ra)", type: "none", rule: "none" },
      { word: "الْعٰلَمِیْنَ", tajweed: "Makhraj: Throat Ayn (ع) & Madd Aaridh", type: "madd", rule: "madd", isAyahEnd: true, ayahNumber: 2 },
      { word: "الرَّحْمٰنِ", tajweed: "Makhraj: Throat Haa (ح) & Madd Tabi'i", type: "throat", rule: "throat" },
      { word: "الرَّحِیْمِ", tajweed: "Madd Aaridh Li-s-Sukoon", type: "madd", rule: "madd", isAyahEnd: true, ayahNumber: 3 },
      { word: "مٰلِكِ", tajweed: "Madd Tabi'i (2 counts)", type: "madd", rule: "madd" },
      { word: "یَوْمِ", tajweed: "Harf Leen (Soft Waw)", type: "none", rule: "none" },
      { word: "الدِّیْنِ", tajweed: "Madd Aaridh Li-s-Sukoon", type: "madd", rule: "madd", isAyahEnd: true, ayahNumber: 4 },
      { word: "اِیَّاكَ", tajweed: "Shaddah Nabrah on Yaa", type: "none", rule: "none" },
      { word: "نَعْبُدُ", tajweed: "Makhraj: Middle-Throat Ayn (ع)", type: "throat", rule: "throat" },
      { word: "وَاِیَّاكَ", tajweed: "Shaddah Nabrah on Yaa", type: "none", rule: "none" },
      { word: "نَسْتَعِیْنُ", tajweed: "Makhraj: Throat Ayn & Madd Aaridh", type: "madd", rule: "madd", isAyahEnd: true, ayahNumber: 5 },
      { word: "اِهْدِنَا", tajweed: "Makhraj: Deep Lower-Throat Haa (ه)", type: "throat", rule: "throat" },
      { word: "الصِّرَاطَ", tajweed: "Tafkheem (Heavy Sad & Taa)", type: "throat", rule: "throat" },
      { word: "الْمُسْتَقِیْمَ", tajweed: "Madd Aaridh Li-s-Sukoon", type: "madd", rule: "madd", isAyahEnd: true, ayahNumber: 6 },
      { word: "صِرَاطَ", tajweed: "Tafkheem (Heavy Sad & Taa)", type: "throat", rule: "throat" },
      { word: "الَّذِیْنَ", tajweed: "Makhraj: Soft-tip Dhal (ذ)", type: "none", rule: "none" },
      { word: "اَنْعَمْتَ", tajweed: "Izhar Halqi / Ghunnah on Noon", type: "ikhfa", rule: "ikhfa" },
      { word: "عَلَیْهِمْ", tajweed: "Makhraj: Throat Ayn (ع) & Izhar Shafawi", type: "throat", rule: "throat" },
      { word: "غَیْرِ", tajweed: "Makhraj: Upper-Throat Ghayn (غ)", type: "throat", rule: "throat" },
      { word: "الْمَغْضُوْبِ", tajweed: "Makhraj: Upper-Throat Ghayn (غ) & Dhad", type: "throat", rule: "throat" },
      { word: "عَلَیْهِمْ", tajweed: "Makhraj: Throat Ayn & Izhar Shafawi", type: "throat", rule: "throat" },
      { word: "وَلَا", tajweed: "Madd Tabi'i (2 counts)", type: "madd", rule: "madd" },
      { word: "الضَّآلِّیْنَ", tajweed: "Madd Lazim Kalimi Muthaqqal (6 counts compulsory)", type: "madd", rule: "madd", isAyahEnd: true, ayahNumber: 7 }
    ]
  },
  {
    id: "fatihah-2",
    title: "Surah Al-Fatihah • Ayah 2",
    subtitle: "Praise of Allah (The Opening)",
    category: "quran",
    surahNumber: 1,
    ayahNumber: 2,
    translation: "All praise belongs to Allah, Lord of all the worlds.",
    wordsUthmani: [
      { word: "ٱلْحَمْدُ", tajweed: "Makhraj: Throat Haa (ح) & Izhar Qamari", type: "throat", rule: "throat", makhrajHint: "Clean friction in mid-throat" },
      { word: "لِلَّهِ", tajweed: "Tarqeeq (Light Lam)", type: "none", rule: "none", makhrajHint: "Light Lam tone" },
      { word: "رَبِّ", tajweed: "Tafkheem (Full Ra)", type: "none", rule: "none", makhrajHint: "Heavy vibrant Ra" },
      { word: "ٱلْعَـٰلَمِينَ", tajweed: "Madd Aaridh (2-4-6 Harakat)", type: "madd", rule: "madd", makhrajHint: "Throat Ayn with elongation", isAyahEnd: true, ayahNumber: 2 }
    ],
    wordsIndoPak: [
      { word: "اَلْحَمْدُ", tajweed: "Makhraj: Throat Haa (ح) & Izhar Qamari", type: "throat", rule: "throat", makhrajHint: "Clean friction in mid-throat" },
      { word: "لِلّٰهِ", tajweed: "Tarqeeq (Light Lam)", type: "none", rule: "none", makhrajHint: "Light Lam tone" },
      { word: "رَبِّ", tajweed: "Tafkheem (Full Ra)", type: "none", rule: "none", makhrajHint: "Heavy vibrant Ra" },
      { word: "الْعٰلَمِیْنَ", tajweed: "Madd Aaridh (2-4-6 Harakat)", type: "madd", rule: "madd", makhrajHint: "Throat Ayn with elongation", isAyahEnd: true, ayahNumber: 2 }
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
      { word: "بِسْمِ", tajweed: "Tarqeeq on Baa & Seen", type: "none", rule: "none" },
      { word: "ٱللَّهِ", tajweed: "Tarqeeq (Light Lam of Majesty)", type: "none", rule: "none" },
      { word: "ٱلرَّحْمَـٰنِ", tajweed: "Makhraj: Throat Haa (ح) & Madd Tabi'i", type: "throat", rule: "throat", makhrajHint: "Clean friction in mid-throat" },
      { word: "ٱلرَّحِيمِ", tajweed: "Madd Aaridh Li-s-Sukoon (2-4-6 counts)", type: "madd", rule: "madd", makhrajHint: "Prolonged elongation", isAyahEnd: true, ayahNumber: 1 }
    ],
    wordsIndoPak: [
      { word: "بِسْمِ", tajweed: "Tarqeeq on Baa & Seen", type: "none", rule: "none" },
      { word: "اللہِ", tajweed: "Tarqeeq (Light Lam of Majesty)", type: "none", rule: "none" },
      { word: "الرَّحْمٰنِ", tajweed: "Makhraj: Throat Haa (ح) & Madd Tabi'i", type: "throat", rule: "throat" },
      { word: "الرَّحِیْمِ", tajweed: "Madd Aaridh Li-s-Sukoon", type: "madd", rule: "madd", isAyahEnd: true, ayahNumber: 1 }
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
      { word: "قُلْ", tajweed: "Makhraj: Deep Uvula Qaf (ق)", type: "throat", rule: "throat", makhrajHint: "Deep uvula Qaf" },
      { word: "هُوَ", tajweed: "Makhraj: Deep Lower-Throat Haa (ه)", type: "throat", rule: "throat" },
      { word: "ٱللَّهُ", tajweed: "Tafkheem Lam (Heavy)", type: "none", rule: "none" },
      { word: "أَحَدٌ", tajweed: "Qalqalah Kubra on Dal (د)", type: "qalqalah", rule: "qalqalah", makhrajHint: "Vibrant echo on Dal", isAyahEnd: true, ayahNumber: 1 },
      { word: "ٱللَّهُ", tajweed: "Tafkheem Lam (Heavy)", type: "none", rule: "none" },
      { word: "ٱلصَّمَدُ", tajweed: "Qalqalah Kubra on Dal (د)", type: "qalqalah", rule: "qalqalah", makhrajHint: "Vibrant echo on Dal", isAyahEnd: true, ayahNumber: 2 },
      { word: "لَمْ", tajweed: "Izhar Shafawi on Meem", type: "none", rule: "none" },
      { word: "يَلِدْ", tajweed: "Qalqalah Sughra on Dal (د)", type: "qalqalah", rule: "qalqalah", makhrajHint: "Light echo on Sukun" },
      { word: "وَلَمْ", tajweed: "Izhar Shafawi", type: "none", rule: "none" },
      { word: "يُولَدْ", tajweed: "Qalqalah Kubra on Dal (د)", type: "qalqalah", rule: "qalqalah", makhrajHint: "Vibrant echo on Dal", isAyahEnd: true, ayahNumber: 3 },
      { word: "وَلَمْ", tajweed: "Izhar Shafawi", type: "none", rule: "none" },
      { word: "يَكُن", tajweed: "Ikhfa / Ghunnah (Nasalization)", type: "ikhfa", rule: "ikhfa", makhrajHint: "Nasal Ghunnah sound" },
      { word: "لَّهُۥ", tajweed: "Idgham bila Ghunnah", type: "none", rule: "none" },
      { word: "كُفُوًا", tajweed: "Dammah on Fa (كُفُوًا)", type: "none", rule: "none" },
      { word: "أَحَدٌۢ", tajweed: "Qalqalah Kubra with Iqlab Meem (ۢ)", type: "qalqalah", rule: "qalqalah", makhrajHint: "Qalqalah on Dal with Iqlab", isAyahEnd: true, ayahNumber: 4 }
    ],
    wordsIndoPak: [
      { word: "قُلْ", tajweed: "Makhraj: Deep Uvula Qaf (ق)", type: "throat", rule: "throat", makhrajHint: "Deep uvula Qaf" },
      { word: "هُوَ", tajweed: "Makhraj: Deep Lower-Throat Haa (ه)", type: "throat", rule: "throat" },
      { word: "اللہُ", tajweed: "Tafkheem Lam (Heavy)", type: "none", rule: "none" },
      { word: "اَحَدٌ", tajweed: "Qalqalah Kubra on Dal (د)", type: "qalqalah", rule: "qalqalah", makhrajHint: "Vibrant echo on Dal", isAyahEnd: true, ayahNumber: 1 },
      { word: "اَللہُ", tajweed: "Tafkheem Lam (Heavy)", type: "none", rule: "none" },
      { word: "الصَّمَدُ", tajweed: "Qalqalah Kubra on Dal (د)", type: "qalqalah", rule: "qalqalah", isAyahEnd: true, ayahNumber: 2 },
      { word: "لَمْ", tajweed: "Izhar Shafawi", type: "none", rule: "none" },
      { word: "یَلِدْ", tajweed: "Qalqalah Sughra on Dal (د)", type: "qalqalah", rule: "qalqalah" },
      { word: "وَلَمْ", tajweed: "Izhar Shafawi", type: "none", rule: "none" },
      { word: "یُوْلَدْ", tajweed: "Qalqalah Kubra on Dal (د)", type: "qalqalah", rule: "qalqalah", isAyahEnd: true, ayahNumber: 3 },
      { word: "وَلَمْ", tajweed: "Izhar Shafawi", type: "none", rule: "none" },
      { word: "یَکُنْ", tajweed: "Ikhfa / Ghunnah (Nasalization)", type: "ikhfa", rule: "ikhfa", makhrajHint: "Nasal Ghunnah sound" },
      { word: "لَّہٗ", tajweed: "Idgham bila Ghunnah", type: "none", rule: "none" },
      { word: "کُفُوًا", tajweed: "Dammah on Fa", type: "none", rule: "none" },
      { word: "اَحَدٌ", tajweed: "Qalqalah Kubra with Iqlab", type: "qalqalah", rule: "qalqalah", isAyahEnd: true, ayahNumber: 4 }
    ]
  },
  {
    id: "falaq-all",
    title: "Surah Al-Falaq • Complete (113:1–5)",
    subtitle: "The Daybreak (Mastering Qalqalah)",
    category: "quran",
    surahNumber: 113,
    ayahNumber: 1,
    translation: "Say, I seek refuge in the Lord of daybreak From the evil of that which He created...",
    wordsUthmani: [
      { word: "قُلْ", tajweed: "Makhraj: Deep Uvula Qaf (ق)", type: "throat", rule: "throat" },
      { word: "أَعُوذُ", tajweed: "Makhraj: Middle-Throat Ayn (ع)", type: "throat", rule: "throat" },
      { word: "بِرَبِّ", tajweed: "Tarqeeq on Ra with Kasrah", type: "none", rule: "none" },
      { word: "ٱلْفَلَقِ", tajweed: "Qalqalah Kubra on Qaf (ق)", type: "qalqalah", rule: "qalqalah", makhrajHint: "Strong bounce on Qaf", isAyahEnd: true, ayahNumber: 1 },
      { word: "مِن", tajweed: "Ikhfa Haqiqi (Hiding Noon before Shin)", type: "ikhfa", rule: "ikhfa" },
      { word: "شَرِّ", tajweed: "Tarqeeq on Ra with Kasrah", type: "none", rule: "none" },
      { word: "مَا", tajweed: "Madd Tabi'i (2 counts)", type: "madd", rule: "madd" },
      { word: "خَلَقَ", tajweed: "Upper Throat Khaa & Qalqalah on Qaf", type: "qalqalah", rule: "qalqalah", makhrajHint: "Strong bounce on Qaf", isAyahEnd: true, ayahNumber: 2 },
      { word: "وَمِن", tajweed: "Ikhfa Haqiqi (Hiding Noon)", type: "ikhfa", rule: "ikhfa" },
      { word: "شَرِّ", tajweed: "Tarqeeq on Ra", type: "none", rule: "none" },
      { word: "غَاسِقٍ", tajweed: "Makhraj: Upper Throat Ghayn (غ)", type: "throat", rule: "throat" },
      { word: "إِذَا", tajweed: "Madd Tabi'i on Alif", type: "madd", rule: "madd" },
      { word: "وَقَبَ", tajweed: "Qalqalah Kubra on Baa (ب)", type: "qalqalah", rule: "qalqalah", makhrajHint: "Strong bounce on Baa", isAyahEnd: true, ayahNumber: 3 },
      { word: "وَمِن", tajweed: "Ikhfa Haqiqi", type: "ikhfa", rule: "ikhfa" },
      { word: "شَرِّ", tajweed: "Tarqeeq on Ra", type: "none", rule: "none" },
      { word: "ٱلنَّفَّـٰثَـٰتِ", tajweed: "Ghunnah Mushaddadah on Noon (نّ) & Madd", type: "ikhfa", rule: "ikhfa" },
      { word: "فِي", tajweed: "Madd Tabi'i (2 counts)", type: "madd", rule: "madd" },
      { word: "ٱلْعُقَدِ", tajweed: "Makhraj: Throat Ayn & Qalqalah on Dal", type: "qalqalah", rule: "qalqalah", makhrajHint: "Strong bounce on Dal", isAyahEnd: true, ayahNumber: 4 },
      { word: "وَمِن", tajweed: "Ikhfa Haqiqi", type: "ikhfa", rule: "ikhfa" },
      { word: "شَرِّ", tajweed: "Tarqeeq on Ra", type: "none", rule: "none" },
      { word: "حَاسِدٍ", tajweed: "Makhraj: Middle Throat Haa (ح) & Madd", type: "throat", rule: "throat" },
      { word: "إِذَا", tajweed: "Madd Tabi'i on Alif", type: "madd", rule: "madd" },
      { word: "حَسَدَ", tajweed: "Makhraj: Throat Haa & Qalqalah on Dal (د)", type: "qalqalah", rule: "qalqalah", makhrajHint: "Strong bounce on Dal", isAyahEnd: true, ayahNumber: 5 }
    ],
    wordsIndoPak: [
      { word: "قُلْ", tajweed: "Makhraj: Deep Uvula Qaf (ق)", type: "throat", rule: "throat" },
      { word: "اَعُوْذُ", tajweed: "Makhraj: Middle-Throat Ayn (ع)", type: "throat", rule: "throat" },
      { word: "بِرَبِّ", tajweed: "Tarqeeq on Ra", type: "none", rule: "none" },
      { word: "الْفَلَقِ", tajweed: "Qalqalah Kubra on Qaf (ق)", type: "qalqalah", rule: "qalqalah", isAyahEnd: true, ayahNumber: 1 },
      { word: "مِنْ", tajweed: "Ikhfa Haqiqi", type: "ikhfa", rule: "ikhfa" },
      { word: "شَرِّ", tajweed: "Tarqeeq on Ra", type: "none", rule: "none" },
      { word: "مَا", tajweed: "Madd Tabi'i", type: "madd", rule: "madd" },
      { word: "خَلَقَ", tajweed: "Upper Throat Khaa & Qalqalah on Qaf", type: "qalqalah", rule: "qalqalah", isAyahEnd: true, ayahNumber: 2 },
      { word: "وَمِنْ", tajweed: "Ikhfa Haqiqi", type: "ikhfa", rule: "ikhfa" },
      { word: "شَرِّ", tajweed: "Tarqeeq on Ra", type: "none", rule: "none" },
      { word: "غَاسِقٍ", tajweed: "Makhraj: Upper Throat Ghayn (غ)", type: "throat", rule: "throat" },
      { word: "اِذَا", tajweed: "Madd Tabi'i", type: "madd", rule: "madd" },
      { word: "وَقَبَ", tajweed: "Qalqalah Kubra on Baa (ب)", type: "qalqalah", rule: "qalqalah", isAyahEnd: true, ayahNumber: 3 },
      { word: "وَمِنْ", tajweed: "Ikhfa Haqiqi", type: "ikhfa", rule: "ikhfa" },
      { word: "شَرِّ", tajweed: "Tarqeeq on Ra", type: "none", rule: "none" },
      { word: "النَّفّٰثٰتِ", tajweed: "Ghunnah Mushaddadah on Noon (نّ) & Madd", type: "ikhfa", rule: "ikhfa" },
      { word: "فِی", tajweed: "Madd Tabi'i", type: "madd", rule: "madd" },
      { word: "الْعُقَدِ", tajweed: "Makhraj: Throat Ayn & Qalqalah on Dal", type: "qalqalah", rule: "qalqalah", isAyahEnd: true, ayahNumber: 4 },
      { word: "وَمِنْ", tajweed: "Ikhfa Haqiqi", type: "ikhfa", rule: "ikhfa" },
      { word: "شَرِّ", tajweed: "Tarqeeq on Ra", type: "none", rule: "none" },
      { word: "حَاسِدٍ", tajweed: "Makhraj: Middle Throat Haa (ح)", type: "throat", rule: "throat" },
      { word: "اِذَا", tajweed: "Madd Tabi'i", type: "madd", rule: "madd" },
      { word: "حَسَدَ", tajweed: "Makhraj: Throat Haa & Qalqalah on Dal", type: "qalqalah", rule: "qalqalah", isAyahEnd: true, ayahNumber: 5 }
    ]
  },
  {
    id: "nas-all",
    title: "Surah An-Nas • Complete (114:1–6)",
    subtitle: "Mankind (Mastering Ghunnah & Ikhfa)",
    category: "quran",
    surahNumber: 114,
    ayahNumber: 1,
    translation: "Say, I seek refuge in the Lord of mankind, The Sovereign of mankind, The God of mankind...",
    wordsUthmani: [
      { word: "قُلْ", tajweed: "Makhraj: Deep Uvula Qaf (ق)", type: "throat", rule: "throat" },
      { word: "أَعُوذُ", tajweed: "Makhraj: Middle-Throat Ayn (ع)", type: "throat", rule: "throat" },
      { word: "بِرَبِّ", tajweed: "Tarqeeq on Ra", type: "none", rule: "none" },
      { word: "ٱلنَّاسِ", tajweed: "Ghunnah Mushaddadah (2 counts on نّ) & Madd", type: "ikhfa", rule: "ikhfa", makhrajHint: "Nasal sound held 2 counts", isAyahEnd: true, ayahNumber: 1 },
      { word: "مَلِكِ", tajweed: "Short vowels without elongation", type: "none", rule: "none" },
      { word: "ٱلنَّاسِ", tajweed: "Ghunnah Mushaddadah on Noon (نّ)", type: "ikhfa", rule: "ikhfa", isAyahEnd: true, ayahNumber: 2 },
      { word: "إِلَـٰهِ", tajweed: "Madd Tabi'i & Throat Haa (ه)", type: "throat", rule: "throat" },
      { word: "ٱلنَّاسِ", tajweed: "Ghunnah Mushaddadah on Noon (نّ)", type: "ikhfa", rule: "ikhfa", isAyahEnd: true, ayahNumber: 3 },
      { word: "مِن", tajweed: "Ikhfa Haqiqi (Hiding Noon before Shin)", type: "ikhfa", rule: "ikhfa" },
      { word: "شَرِّ", tajweed: "Tarqeeq on Ra", type: "none", rule: "none" },
      { word: "ٱلْوَسْوَاسِ", tajweed: "Izhar Qamari & Madd Tabi'i", type: "madd", rule: "madd" },
      { word: "ٱلْخَنَّاسِ", tajweed: "Throat Khaa (خ) & Ghunnah on Noon (نّ)", type: "ikhfa", rule: "ikhfa", isAyahEnd: true, ayahNumber: 4 },
      { word: "ٱلَّذِي", tajweed: "Madd Tabi'i on Yaa", type: "madd", rule: "madd" },
      { word: "يُوَسْوِسُ", tajweed: "Hams on Seen (س)", type: "none", rule: "none" },
      { word: "فِي", tajweed: "Madd Tabi'i (2 counts)", type: "madd", rule: "madd" },
      { word: "صُدُورِ", tajweed: "Tafkheem (Heavy Sad) & Tarqeeq on Ra", type: "throat", rule: "throat" },
      { word: "ٱلنَّاسِ", tajweed: "Ghunnah Mushaddadah on Noon (نّ)", type: "ikhfa", rule: "ikhfa", isAyahEnd: true, ayahNumber: 5 },
      { word: "مِنَ", tajweed: "Short vowel transition", type: "none", rule: "none" },
      { word: "ٱلْجِنَّةِ", tajweed: "Ghunnah Mushaddadah on Noon (نّ)", type: "ikhfa", rule: "ikhfa" },
      { word: "وَٱلنَّاسِ", tajweed: "Ghunnah Mushaddadah on Noon (نّ)", type: "ikhfa", rule: "ikhfa", isAyahEnd: true, ayahNumber: 6 }
    ],
    wordsIndoPak: [
      { word: "قُلْ", tajweed: "Makhraj: Deep Uvula Qaf (ق)", type: "throat", rule: "throat" },
      { word: "اَعُوْذُ", tajweed: "Makhraj: Middle-Throat Ayn (ع)", type: "throat", rule: "throat" },
      { word: "بِرَبِّ", tajweed: "Tarqeeq on Ra", type: "none", rule: "none" },
      { word: "النَّاسِ", tajweed: "Ghunnah Mushaddadah (2 counts on نّ)", type: "ikhfa", rule: "ikhfa", isAyahEnd: true, ayahNumber: 1 },
      { word: "مَلِكِ", tajweed: "Short vowels without elongation", type: "none", rule: "none" },
      { word: "النَّاسِ", tajweed: "Ghunnah Mushaddadah on Noon (نّ)", type: "ikhfa", rule: "ikhfa", isAyahEnd: true, ayahNumber: 2 },
      { word: "اِلٰهِ", tajweed: "Madd Tabi'i & Throat Haa (ه)", type: "throat", rule: "throat" },
      { word: "النَّاسِ", tajweed: "Ghunnah Mushaddadah on Noon (نّ)", type: "ikhfa", rule: "ikhfa", isAyahEnd: true, ayahNumber: 3 },
      { word: "مِنْ", tajweed: "Ikhfa Haqiqi", type: "ikhfa", rule: "ikhfa" },
      { word: "شَرِّ", tajweed: "Tarqeeq on Ra", type: "none", rule: "none" },
      { word: "الْوَسْوَاسِ", tajweed: "Izhar Qamari & Madd Tabi'i", type: "madd", rule: "madd" },
      { word: "الْخَنَّاسِ", tajweed: "Throat Khaa (خ) & Ghunnah on Noon (نّ)", type: "ikhfa", rule: "ikhfa", isAyahEnd: true, ayahNumber: 4 },
      { word: "الَّذِیْ", tajweed: "Madd Tabi'i on Yaa", type: "madd", rule: "madd" },
      { word: "یُوَسْوِسُ", tajweed: "Hams on Seen (س)", type: "none", rule: "none" },
      { word: "فِیْ", tajweed: "Madd Tabi'i (2 counts)", type: "madd", rule: "madd" },
      { word: "صُدُوْرِ", tajweed: "Tafkheem (Heavy Sad)", type: "throat", rule: "throat" },
      { word: "النَّاسِ", tajweed: "Ghunnah Mushaddadah on Noon (نّ)", type: "ikhfa", rule: "ikhfa", isAyahEnd: true, ayahNumber: 5 },
      { word: "مِنَ", tajweed: "Short vowel transition", type: "none", rule: "none" },
      { word: "الْجِنَّةِ", tajweed: "Ghunnah Mushaddadah on Noon (نّ)", type: "ikhfa", rule: "ikhfa" },
      { word: "وَالنَّاسِ", tajweed: "Ghunnah Mushaddadah on Noon (نّ)", type: "ikhfa", rule: "ikhfa", isAyahEnd: true, ayahNumber: 6 }
    ]
  },
  {
    id: "qaida-mufradaat",
    title: "Noorani Qaida • Lesson 1 (Huruf Mufradaat)",
    subtitle: "Isolated Arabic Alphabet & Articulation Points",
    category: "qaida",
    translation: "Master individual letter articulation points (Makhaarij).",
    wordsUthmani: [
      { word: "اَ", tajweed: "Alif (Deep Throat)", type: "throat", rule: "throat", makhrajHint: "Deep vocal cords" },
      { word: "بَ", tajweed: "Baa (Shafawi / Lips)", type: "none", rule: "none", makhrajHint: "Both lips together" },
      { word: "تَ", tajweed: "Taa (Upper Incisors)", type: "none", rule: "none", makhrajHint: "Tongue tip at base of upper teeth" },
      { word: "ثَ", tajweed: "Thaa (Soft Tongue Tip)", type: "none", rule: "none", makhrajHint: "Tongue tip protruded slightly" },
      { word: "جَ", tajweed: "Jeem (Mid-tongue & Qalqalah)", type: "qalqalah", rule: "qalqalah", makhrajHint: "Center of tongue against roof" },
      { word: "حَ", tajweed: "Haa (Mid-throat friction)", type: "throat", rule: "throat", makhrajHint: "Clean friction in mid-throat" },
      { word: "خَ", tajweed: "Khaa (Upper throat)", type: "throat", rule: "throat", makhrajHint: "Heavy scraping upper throat sound" },
      { word: "دَ", tajweed: "Dal (Upper Incisors & Qalqalah)", type: "qalqalah", rule: "qalqalah" },
      { word: "ذَ", tajweed: "Dhal (Soft Tongue Tip)", type: "none", rule: "none" },
      { word: "رَ", tajweed: "Ra (Tafkheem / Vibrant)", type: "none", rule: "none" },
      { word: "زَ", tajweed: "Zay (Whistling Sfeer)", type: "none", rule: "none" },
      { word: "سَ", tajweed: "Seen (Whistling Sfeer)", type: "none", rule: "none" },
      { word: "شَ", tajweed: "Sheen (Mid-tongue Tafash-shi)", type: "none", rule: "none" },
      { word: "صَ", tajweed: "Sad (Heavy Isti'la)", type: "throat", rule: "throat" },
      { word: "ضَ", tajweed: "Dhad (Lateral Tongue / Istitalah)", type: "throat", rule: "throat" },
      { word: "طَ", tajweed: "Taa (Heavy & Qalqalah)", type: "qalqalah", rule: "qalqalah" },
      { word: "ظَ", tajweed: "Zhaa (Heavy Itbaq)", type: "throat", rule: "throat" },
      { word: "عَ", tajweed: "Ayn (Middle Throat)", type: "throat", rule: "throat" },
      { word: "غَ", tajweed: "Ghayn (Upper Throat)", type: "throat", rule: "throat" },
      { word: "فَ", tajweed: "Faa (Lower Lip with Incisors)", type: "none", rule: "none" },
      { word: "قَ", tajweed: "Qaf (Deep Uvula & Qalqalah)", type: "qalqalah", rule: "qalqalah" },
      { word: "كَ", tajweed: "Kaf (Tongue Root Hams)", type: "none", rule: "none" },
      { word: "لَ", tajweed: "Lam (Tarqeeq)", type: "none", rule: "none" },
      { word: "مَ", tajweed: "Meem (Lips & Ghunnah)", type: "ikhfa", rule: "ikhfa" },
      { word: "نَ", tajweed: "Noon (Nasal Cavity & Ghunnah)", type: "ikhfa", rule: "ikhfa" },
      { word: "وَ", tajweed: "Waw (Rounding Lips)", type: "none", rule: "none" },
      { word: "هَ", tajweed: "Haa (Deep Lower Throat)", type: "throat", rule: "throat" },
      { word: "ءَ", tajweed: "Hamzah (Deep Throat)", type: "throat", rule: "throat" },
      { word: "يَ", tajweed: "Yaa (Center Tongue)", type: "none", rule: "none" }
    ],
    wordsIndoPak: [
      { word: "اَ", tajweed: "Alif (Deep Throat)", type: "throat", rule: "throat", makhrajHint: "Deep vocal cords" },
      { word: "بَ", tajweed: "Baa (Shafawi / Lips)", type: "none", rule: "none" },
      { word: "تَ", tajweed: "Taa (Upper Incisors)", type: "none", rule: "none" },
      { word: "ثَ", tajweed: "Thaa (Soft Tongue Tip)", type: "none", rule: "none" },
      { word: "جَ", tajweed: "Jeem (Mid-tongue & Qalqalah)", type: "qalqalah", rule: "qalqalah" },
      { word: "حَ", tajweed: "Haa (Mid-throat friction)", type: "throat", rule: "throat", makhrajHint: "Clean friction in mid-throat" },
      { word: "خَ", tajweed: "Khaa (Upper throat)", type: "throat", rule: "throat", makhrajHint: "Heavy scraping upper throat sound" },
      { word: "دَ", tajweed: "Dal (Upper Incisors & Qalqalah)", type: "qalqalah", rule: "qalqalah" },
      { word: "ذَ", tajweed: "Dhal (Soft Tongue Tip)", type: "none", rule: "none" },
      { word: "رَ", tajweed: "Ra (Tafkheem / Vibrant)", type: "none", rule: "none" },
      { word: "زَ", tajweed: "Zay (Whistling Sfeer)", type: "none", rule: "none" },
      { word: "سَ", tajweed: "Seen (Whistling Sfeer)", type: "none", rule: "none" },
      { word: "شَ", tajweed: "Sheen (Mid-tongue Tafash-shi)", type: "none", rule: "none" },
      { word: "صَ", tajweed: "Sad (Heavy Isti'la)", type: "throat", rule: "throat" },
      { word: "ضَ", tajweed: "Dhad (Lateral Tongue / Istitalah)", type: "throat", rule: "throat" },
      { word: "طَ", tajweed: "Taa (Heavy & Qalqalah)", type: "qalqalah", rule: "qalqalah" },
      { word: "ظَ", tajweed: "Zhaa (Heavy Itbaq)", type: "throat", rule: "throat" },
      { word: "عَ", tajweed: "Ayn (Middle Throat)", type: "throat", rule: "throat" },
      { word: "غَ", tajweed: "Ghayn (Upper Throat)", type: "throat", rule: "throat" },
      { word: "فَ", tajweed: "Faa (Lower Lip with Incisors)", type: "none", rule: "none" },
      { word: "قَ", tajweed: "Qaf (Deep Uvula & Qalqalah)", type: "qalqalah", rule: "qalqalah" },
      { word: "كَ", tajweed: "Kaf (Tongue Root Hams)", type: "none", rule: "none" },
      { word: "لَ", tajweed: "Lam (Tarqeeq)", type: "none", rule: "none" },
      { word: "مَ", tajweed: "Meem (Lips & Ghunnah)", type: "ikhfa", rule: "ikhfa" },
      { word: "نَ", tajweed: "Noon (Nasal Cavity & Ghunnah)", type: "ikhfa", rule: "ikhfa" },
      { word: "وَ", tajweed: "Waw (Rounding Lips)", type: "none", rule: "none" },
      { word: "هَ", tajweed: "Haa (Deep Lower Throat)", type: "throat", rule: "throat" },
      { word: "ءَ", tajweed: "Hamzah (Deep Throat)", type: "throat", rule: "throat" },
      { word: "يَ", tajweed: "Yaa (Center Tongue)", type: "none", rule: "none" }
    ]
  }
];
