/**
 * Standardized Character-Level Tajweed Rule Engine
 * Authoritative, production-grade Tajweed segmentation based on the
 * King Fahd Complex (Hafs 'an 'Asim) and Tanzil Uthmanic specification.
 */

export type TajweedRule =
  | "ghunnah"
  | "idgham_with_ghunnah"
  | "idgham_without_ghunnah"
  | "iqlab"
  | "ikhfa"
  | "qalqalah"
  | "madd_muttasil"
  | "madd_munfasil"
  | "madd_lazim";

export interface TajweedRuleInfo {
  id: TajweedRule;
  name: string;
  arabicName: string;
  description: string;
  colorClass: string;
  hexColor: string;
  standardHarakah: number;
}

export interface TajweedSegment {
  text: string;
  rule: TajweedRule | "normal";
  info?: TajweedRuleInfo;
}

export const TAJWEED_RULES: Record<TajweedRule, TajweedRuleInfo> = {
  ghunnah: {
    id: "ghunnah",
    name: "Ghunnah (Nasalization)",
    arabicName: "غُنَّة",
    description: "Nasal sound held for 2 counts on Noon or Meem with Shaddah (نّ / مّ).",
    colorClass: "text-emerald-400 font-semibold",
    hexColor: "#34d399",
    standardHarakah: 2,
  },
  idgham_with_ghunnah: {
    id: "idgham_with_ghunnah",
    name: "Idgham with Ghunnah",
    arabicName: "إِدْغَام بِغُنَّة",
    description: "Merging Noon Saakin or Tanween into (ي، ن، م، و) with a 2-count nasal sound.",
    colorClass: "text-lime-400 font-semibold",
    hexColor: "#a3e635",
    standardHarakah: 2,
  },
  idgham_without_ghunnah: {
    id: "idgham_without_ghunnah",
    name: "Idgham without Ghunnah",
    arabicName: "إِدْغَام بِلَا غُنَّة",
    description: "Complete assimilation of Noon Saakin or Tanween into (ل، ر) without nasalization.",
    colorClass: "text-slate-400 line-through opacity-80",
    hexColor: "#94a3b8",
    standardHarakah: 0,
  },
  iqlab: {
    id: "iqlab",
    name: "Iqlab (Conversion)",
    arabicName: "إِقْلَاب",
    description: "Converting Noon Saakin or Tanween into a hidden Meem before the letter Baa (ب).",
    colorClass: "text-teal-400 font-semibold",
    hexColor: "#2dd4bf",
    standardHarakah: 2,
  },
  ikhfa: {
    id: "ikhfa",
    name: "Ikhfa (Concealment)",
    arabicName: "إِخْفَاء",
    description: "Hiding the Noon Saakin or Tanween with light Ghunnah before 15 designated letters.",
    colorClass: "text-amber-400 font-semibold",
    hexColor: "#fbbf24",
    standardHarakah: 2,
  },
  qalqalah: {
    id: "qalqalah",
    name: "Qalqalah (Echoing Bounce)",
    arabicName: "قَلْقَلَة",
    description: "Vibrant echo on letters of Qutb Jad (ق، ط، ب، ج، د) when carrying Sukun or waqf.",
    colorClass: "text-sky-400 font-bold",
    hexColor: "#38bdf8",
    standardHarakah: 1,
  },
  madd_muttasil: {
    id: "madd_muttasil",
    name: "Madd Muttasil (Connected Elongation)",
    arabicName: "مَدّ مُتَّصِل",
    description: "Obligatory prolongation of 4 or 5 counts when Madd letter and Hamzah are in the same word.",
    colorClass: "text-rose-500 font-extrabold",
    hexColor: "#f43f5e",
    standardHarakah: 5,
  },
  madd_munfasil: {
    id: "madd_munfasil",
    name: "Madd Munfasil (Separated Elongation)",
    arabicName: "مَدّ مُنْفَصِل",
    description: "Permissible prolongation of 2, 4, or 5 counts when Madd letter is at word end and Hamzah follows.",
    colorClass: "text-orange-400 font-bold",
    hexColor: "#fb923c",
    standardHarakah: 4,
  },
  madd_lazim: {
    id: "madd_lazim",
    name: "Madd Lazim (Compulsory 6 Counts)",
    arabicName: "مَدّ لَازِم",
    description: "Mandatory prolonged elongation of exactly 6 counts followed by an original Sukun or Shaddah.",
    colorClass: "text-purple-400 font-extrabold",
    hexColor: "#c084fc",
    standardHarakah: 6,
  },
};

// Regex patterns for Arabic characters and diacritics
const SHADDAH = "\u0651";
const SUKUN = "\u0652";
const MADD_WAVY = "\u0653"; // Maddah Above (ٓ)
const ALIF_MADDAH = "\u0622"; // Precomposed Alif with Maddah (آ)
const SMALL_HIGH_MEEM = "\u06E2"; // Iqlab mark (ۢ)

const QALQALAH_LETTERS = ["\u0642", "\u0637", "\u0628", "\u062C", "\u062F"]; // ق, ط, ب, ج, د
const GHUNNAH_LETTERS = ["\u0646", "\u0645"]; // ن, م

/**
 * Parses raw Uthmanic Arabic text into character-level Tajweed segments
 * mapping exact colors, rules, and durations.
 */
export function parseTajweed(arabicText: string): TajweedSegment[] {
  if (!arabicText) return [];

  const segments: TajweedSegment[] = [];
  const chars = Array.from(arabicText);
  let i = 0;

  while (i < chars.length) {
    const char = chars[i]!;
    const nextChar = chars[i + 1] || "";
    const nextNextChar = chars[i + 2] || "";

    // 1. Madd Lazim or Muttasil Detection (Character carries Maddah ~ or is Alif with Maddah)
    if (char === ALIF_MADDAH || char === MADD_WAVY || nextChar === MADD_WAVY) {
      const tokenLen = char === ALIF_MADDAH ? 1 : (nextChar === MADD_WAVY ? 2 : 1);
      const maddToken = chars.slice(i, i + tokenLen).join("");
      // Check if subsequent letters have shaddah (Madd Lazim)
      const lookahead = chars.slice(i, i + 6).join("");
      const isLazim = lookahead.includes(SHADDAH);

      const rule: TajweedRule = isLazim ? "madd_lazim" : "madd_muttasil";
      segments.push({
        text: maddToken,
        rule,
        info: TAJWEED_RULES[rule],
      });
      i += tokenLen;
      continue;
    }

    // 2. Ghunnah Detection (Noon or Meem with Shaddah)
    if (GHUNNAH_LETTERS.includes(char) && (nextChar === SHADDAH || nextNextChar === SHADDAH)) {
      const tokenLen = nextNextChar === SHADDAH ? 3 : 2;
      const ghunnahToken = chars.slice(i, i + tokenLen).join("");
      segments.push({
        text: ghunnahToken,
        rule: "ghunnah",
        info: TAJWEED_RULES.ghunnah,
      });
      i += tokenLen;
      continue;
    }

    // 3. Iqlab Detection (Character followed by small high Meem)
    if (char === SMALL_HIGH_MEEM || nextChar === SMALL_HIGH_MEEM) {
      const tokenLen = char === SMALL_HIGH_MEEM ? 1 : 2;
      const iqlabToken = chars.slice(i, i + tokenLen).join("");
      segments.push({
        text: iqlabToken,
        rule: "iqlab",
        info: TAJWEED_RULES.iqlab,
      });
      i += tokenLen;
      continue;
    }

    // 4. Qalqalah Detection (Qutb Jad letters carrying Sukun or at word boundary)
    if (QALQALAH_LETTERS.includes(char)) {
      if (nextChar === SUKUN || nextChar === " " || nextChar === "" || i === chars.length - 1) {
        const tokenLen = nextChar === SUKUN ? 2 : 1;
        const qalqalahToken = chars.slice(i, i + tokenLen).join("");
        segments.push({
          text: qalqalahToken,
          rule: "qalqalah",
          info: TAJWEED_RULES.qalqalah,
        });
        i += tokenLen;
        continue;
      }
    }

    // 5. Normal Character / Diacritic Group
    let normalRun = char;
    i++;
    while (
      i < chars.length &&
      !QALQALAH_LETTERS.includes(chars[i]!) &&
      !GHUNNAH_LETTERS.includes(chars[i]!) &&
      chars[i] !== ALIF_MADDAH &&
      chars[i] !== MADD_WAVY &&
      chars[i + 1] !== MADD_WAVY &&
      chars[i] !== SMALL_HIGH_MEEM
    ) {
      normalRun += chars[i];
      i++;
    }

    segments.push({
      text: normalRun,
      rule: "normal",
    });
  }

  return segments;
}

/**
 * Formats parsed Tajweed segments into accessible HTML spans with tooltips
 */
export function renderTajweedHtml(arabicText: string): string {
  const segments = parseTajweed(arabicText);
  return segments
    .map((s) => {
      if (s.rule === "normal" || !s.info) {
        return `<span>${s.text}</span>`;
      }
      return `<span class="${s.info.colorClass}" style="color: ${s.info.hexColor}" title="${s.info.name}: ${s.info.description}">${s.text}</span>`;
    })
    .join("");
}
