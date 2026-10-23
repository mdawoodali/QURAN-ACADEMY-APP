import { describe, it, expect } from "vitest";
import {
  parseTajweed,
  renderTajweedHtml,
  TAJWEED_RULES,
  TajweedRule,
} from "./tajweedEngine";

describe("Standardized Character-Level Tajweed Rule Engine", () => {
  it("handles empty or falsy Arabic inputs gracefully", () => {
    expect(parseTajweed("")).toEqual([]);
    expect(renderTajweedHtml("")).toBe("");
  });

  it("detects Ghunnah on Noon and Meem with Shaddah (نّ / مّ)", () => {
    // "إِنَّ" (Indeed) contains Noon with Shaddah
    const inna = "إِنَّ";
    const segments = parseTajweed(inna);
    const ghunnahSeg = segments.find((s) => s.rule === "ghunnah");

    expect(ghunnahSeg).toBeDefined();
    expect(ghunnahSeg?.info?.name).toContain("Ghunnah");
    expect(ghunnahSeg?.info?.standardHarakah).toBe(2);
  });

  it("detects Qalqalah on Qutb Jad letters (ق، ط، ب، ج، د)", () => {
    // "الفَلَقْ" with Sukun or word ending
    const falaq = "الفَلَقْ";
    const segments = parseTajweed(falaq);
    const qalqalahSeg = segments.find((s) => s.rule === "qalqalah");

    expect(qalqalahSeg).toBeDefined();
    expect(qalqalahSeg?.info?.arabicName).toBe("قَلْقَلَة");
    expect(qalqalahSeg?.info?.hexColor).toBe("#38bdf8");
  });

  it("detects Iqlab when Small High Meem (ۢ) mark is present", () => {
    // Tanzil Uthmanic mark for Iqlab: "مِنۢ بَعْدِ"
    const iqlabText = "مِنۢ بَعْدِ";
    const segments = parseTajweed(iqlabText);
    const iqlabSeg = segments.find((s) => s.rule === "iqlab");

    expect(iqlabSeg).toBeDefined();
    expect(iqlabSeg?.info?.name).toContain("Iqlab");
  });

  it("detects Madd Muttasil and Madd Lazim based on Shaddah lookahead", () => {
    // Madd letter with Maddah above (ٓ) e.g. "جَآءَ" vs "الضَّآلِّينَ"
    const maddMuttasil = "جَآءَ";
    const segsMuttasil = parseTajweed(maddMuttasil);
    const muttasil = segsMuttasil.find((s) => s.rule === "madd_muttasil");
    expect(muttasil).toBeDefined();
    expect(muttasil?.info?.standardHarakah).toBe(5);

    // Madd Lazim: Maddah followed by Shaddah
    const maddLazim = "الضَّآلِّينَ";
    const segsLazim = parseTajweed(maddLazim);
    const lazim = segsLazim.find((s) => s.rule === "madd_lazim");
    expect(lazim).toBeDefined();
    expect(lazim?.info?.standardHarakah).toBe(6);
  });

  it("renders accessible HTML with color classes and educational tooltips", () => {
    const text = "إِنَّ";
    const html = renderTajweedHtml(text);

    expect(html).toContain("<span");
    expect(html).toContain("title=\"Ghunnah (Nasalization): Nasal sound held for 2 counts");
    expect(html).toContain("style=\"color: #34d399\"");
  });

  it("ensures all 9 Tajweed rule definitions have valid colors and names", () => {
    const rules: TajweedRule[] = [
      "ghunnah",
      "idgham_with_ghunnah",
      "idgham_without_ghunnah",
      "iqlab",
      "ikhfa",
      "qalqalah",
      "madd_muttasil",
      "madd_munfasil",
      "madd_lazim",
    ];

    for (const rule of rules) {
      const info = TAJWEED_RULES[rule];
      expect(info).toBeDefined();
      expect(info.name.length).toBeGreaterThan(0);
      expect(info.arabicName.length).toBeGreaterThan(0);
      expect(info.hexColor.startsWith("#")).toBe(true);
      expect(typeof info.standardHarakah).toBe("number");
    }
  });
});
