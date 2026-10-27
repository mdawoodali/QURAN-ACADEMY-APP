import { describe, it, expect, vi } from "vitest";
import { normalizeArabic, stripArabicPrefix, getWordFallbacks, PHONETIC_MAP, QURAN_PHONETIC_FALLBACK, CURRICULUM_LESSONS } from "@/features/classroom/constants";

describe("Classroom AI Voice Following & Recitation Alignment Suite", () => {
  const currentWords = ["ٱلْحَمْدُ", "لِلَّهِ", "رَبِّ", "ٱلْعَـٰلَمِينَ"];

  it("accurately normalizes Arabic with Uthmani ligatures, dagger alifs, and hamzas", () => {
    expect(normalizeArabic("ٱلْحَمْدُ")).toBe("الحمد");
    expect(normalizeArabic("لِلَّهِ")).toBe("لله");
    expect(normalizeArabic("رَبِّ")).toBe("رب");
    expect(normalizeArabic("ٱلْعَـٰلَمِينَ")).toBe("العالمين");
  });

  it("resolves spoken Arabic tokens to correct word indices", () => {
    const normWords = currentWords.map(normalizeArabic);

    function resolveMatch(spokenText: string): number {
      const tokens = spokenText.trim().split(/\s+/).filter(Boolean);
      for (let sIdx = tokens.length - 1; sIdx >= 0; sIdx--) {
        const normTok = normalizeArabic(tokens[sIdx] || "");
        if (!normTok) continue;

        // Exact match
        for (let i = 0; i < normWords.length; i++) {
          if (normWords[i] === normTok) return i;
          const phonetics = PHONETIC_MAP[i] || [];
          if (phonetics.some((p) => normalizeArabic(p) === normTok)) return i;
        }

        // Substring match
        if (normTok.length >= 3) {
          for (let i = 0; i < normWords.length; i++) {
            const w = normWords[i] || "";
            if (w.length >= 3 && (w.includes(normTok) || normTok.includes(w))) return i;
          }
        }
      }
      return -1;
    }

    expect(resolveMatch("الحمد")).toBe(0);
    expect(resolveMatch("لله")).toBe(1);
    expect(resolveMatch("رب")).toBe(2);
    expect(resolveMatch("العالمين")).toBe(3);
    expect(resolveMatch("الحمد لله رب العالمين")).toBe(3);
  });

  it("handles transliteration fallback for non-Arabic transcription streams", () => {
    function matchTranslit(text: string): number {
      const lower = text.toLowerCase().trim();
      for (let i = 0; i < currentWords.length; i++) {
        const fallbacks = [
          ...(QURAN_PHONETIC_FALLBACK[i] || []),
          ...getWordFallbacks(currentWords[i] || "")
        ];
        if (fallbacks.some((p) => lower.includes(p.toLowerCase()))) return i;
      }
      return -1;
    }

    expect(matchTranslit("alhamdulillah")).toBe(0);
    expect(matchTranslit("alhamdu")).toBe(0);
    expect(matchTranslit("lillah")).toBe(1);
    expect(matchTranslit("rabbi")).toBe(2);
    expect(matchTranslit("alameen")).toBe(3);
  });

  it("allows observer role to advance highlights locally in demo mode without obstruction", () => {
    let highlightedIndex: number | null = 0;
    const broadcastMock = vi.fn();
    const role: "teacher" | "student" | "observer" = "observer";
    const classId = "demo";

    function sendHighlight(index: number | null) {
      highlightedIndex = index;
      if (role !== "observer" || classId === "demo") {
        broadcastMock({ type: "highlight", index });
      }
    }

    // Advance to next word
    sendHighlight(1);
    expect(highlightedIndex).toBe(1);
    expect(broadcastMock).toHaveBeenCalledWith({ type: "highlight", index: 1 });

    // Advance to word 2
    sendHighlight(2);
    expect(highlightedIndex).toBe(2);

    // Advance to word 3
    sendHighlight(3);
    expect(highlightedIndex).toBe(3);
  });

  it("activates laser pointer at center on toggle and synchronizes coordinates", () => {
    let isLaserModeActive = false;
    let laserPointer = { x: 0, y: 0, active: false };
    const broadcastMock = vi.fn();
    const classId = "demo";
    const role = "observer";

    function sendLaserPointer(laser: { x: number; y: number; active: boolean }) {
      laserPointer = laser;
      if (role !== "observer" || classId === "demo") {
        broadcastMock({ type: "laser", ...laser });
      }
    }

    function toggleLaser() {
      const next = !isLaserModeActive;
      isLaserModeActive = next;
      if (next) {
        sendLaserPointer({ x: 50, y: 50, active: true });
      } else {
        sendLaserPointer({ x: 0, y: 0, active: false });
      }
    }

    // 1. Turning on laser initializes immediately at center (50%, 50%)
    toggleLaser();
    expect(isLaserModeActive).toBe(true);
    expect(laserPointer.active).toBe(true);
    expect(laserPointer.x).toBe(50);
    expect(laserPointer.y).toBe(50);
    expect(broadcastMock).toHaveBeenCalledWith({ type: "laser", x: 50, y: 50, active: true });

    // 2. Pointer movement updates coordinates
    sendLaserPointer({ x: 35.5, y: 72.1, active: true });
    expect(laserPointer.x).toBe(35.5);
    expect(laserPointer.y).toBe(72.1);
    expect(laserPointer.active).toBe(true);

    // 3. Turning off laser deactivates cleanly
    toggleLaser();
    expect(isLaserModeActive).toBe(false);
    expect(laserPointer.active).toBe(false);
  });

  it("suppresses repeated voice follow toast notifications across speech recognition restarts", () => {
    let hasNotified = false;
    const toastSuccessMock = vi.fn();

    function onSpeechStart() {
      if (!hasNotified) {
        hasNotified = true;
        toastSuccessMock("AI Arabic Voice Follow active (Web Speech)", { id: "voice-follow-status" });
      }
    }

    // Simulate speech loop restarting 10 times consecutively (e.g. pauses while speaking)
    for (let i = 0; i < 10; i++) {
      onSpeechStart();
    }

    // Must be called exactly once despite 10 restart cycles
    expect(toastSuccessMock).toHaveBeenCalledTimes(1);
    expect(toastSuccessMock).toHaveBeenCalledWith("AI Arabic Voice Follow active (Web Speech)", {
      id: "voice-follow-status",
    });

    // When voice follow is stopped, guard resets
    function stopVoiceFollow() {
      hasNotified = false;
    }
    stopVoiceFollow();
    expect(hasNotified).toBe(false);

    // Starting again triggers exactly one new notification
    onSpeechStart();
    expect(toastSuccessMock).toHaveBeenCalledTimes(2);
  });

  it("handles cancel and exit callback cleanly before entering live demo class", () => {
    const onCancelMock = vi.fn();
    let streamStopped = false;
    const fakeStream = {
      getTracks: () => [
        {
          stop: () => {
            streamStopped = true;
          },
        },
      ],
    };

    function handleCancel() {
      fakeStream.getTracks().forEach((t) => t.stop());
      onCancelMock();
    }

    handleCancel();
    expect(streamStopped).toBe(true);
    expect(onCancelMock).toHaveBeenCalledTimes(1);
  });

  it("strictly routes demo classroom exits to main home page and never to internal portals", () => {
    const routerPushMock = vi.fn();
    const demoIdentifiers = ["demo", "DEMO", "demo/", "room-demo", ""];

    function resolveExitDestination(classId: string, roleParam: "teacher" | "student" | "observer"): string {
      const isDemo =
        !classId ||
        classId.toLowerCase() === "demo" ||
        classId.toLowerCase().includes("demo");

      if (isDemo) {
        return "/";
      } else if (roleParam === "teacher") {
        return "/teacher";
      } else if (roleParam === "observer") {
        return "/parent";
      } else {
        return "/student";
      }
    }

    // All demo variations regardless of role MUST exit to "/"
    for (const demoId of demoIdentifiers) {
      expect(resolveExitDestination(demoId, "teacher")).toBe("/");
      expect(resolveExitDestination(demoId, "student")).toBe("/");
      expect(resolveExitDestination(demoId, "observer")).toBe("/");
    }

    // Only genuine non-demo private sessions route to respective portals
    expect(resolveExitDestination("room-session-42", "teacher")).toBe("/teacher");
    expect(resolveExitDestination("room-session-42", "observer")).toBe("/parent");
    expect(resolveExitDestination("room-session-42", "student")).toBe("/student");
  });
  it("advances cumulative transliteration speech tokens sequentially without locking on word 0", () => {
    function resolveCumulativeTranslit(spokenText: string): number {
      const lower = spokenText.toLowerCase().replace(/[^a-z0-9\s'-]/g, " ").trim();
      const tokens = lower.split(/\s+/).filter(Boolean);
      if (tokens.length === 0) return -1;

      for (let tIdx = tokens.length - 1; tIdx >= 0; tIdx--) {
        const token = tokens[tIdx];
        const pair = tIdx > 0 ? `${tokens[tIdx - 1]} ${token}` : "";
        const pairHyphen = tIdx > 0 ? `${tokens[tIdx - 1]}-${token}` : "";

        if (pair || pairHyphen) {
          for (let wIdx = 0; wIdx < currentWords.length; wIdx++) {
            const fallbacks = [
              ...(QURAN_PHONETIC_FALLBACK[wIdx] || []),
              ...getWordFallbacks(currentWords[wIdx] || "")
            ].map((f) => f.toLowerCase());
            if (fallbacks.some((f) => f === pair || f === pairHyphen)) {
              return wIdx;
            }
          }
        }

        for (let wIdx = 0; wIdx < currentWords.length; wIdx++) {
          const fallbacks = [
            ...(QURAN_PHONETIC_FALLBACK[wIdx] || []),
            ...getWordFallbacks(currentWords[wIdx] || "")
          ].map((f) => f.toLowerCase());
          if (fallbacks.some((f) => f === token)) {
            return wIdx;
          }
        }
      }

      for (let tIdx = tokens.length - 1; tIdx >= 0; tIdx--) {
        const token = tokens[tIdx];
        if (token.length < 4) continue;
        for (let wIdx = 0; wIdx < currentWords.length; wIdx++) {
          const fallbacks = [
            ...(QURAN_PHONETIC_FALLBACK[wIdx] || []),
            ...getWordFallbacks(currentWords[wIdx] || "")
          ].map((f) => f.toLowerCase());
          if (fallbacks.some((f) => f.startsWith(token) || token.startsWith(f))) {
            return wIdx;
          }
        }
      }
      return -1;
    }

    expect(resolveCumulativeTranslit("alhamdu")).toBe(0);
    expect(resolveCumulativeTranslit("alhamdu lillahi")).toBe(1);
    expect(resolveCumulativeTranslit("alhamdu lillahi rabbi")).toBe(2);
    expect(resolveCumulativeTranslit("alhamdu lillahi rabbi alameen")).toBe(3);
  });

  it("advances cumulative Arabic tokens sequentially across all 4 words", () => {
    const normWords = currentWords.map(normalizeArabic);

    function resolveCumulativeArabic(spokenText: string): number {
      const ARABIC_SCRIPT_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
      const tokens = spokenText
        .split(/\s+/)
        .filter((w) => ARABIC_SCRIPT_REGEX.test(w))
        .map(normalizeArabic)
        .filter(Boolean);

      if (tokens.length === 0) return -1;

      for (let sIdx = tokens.length - 1; sIdx >= 0; sIdx--) {
        const token = tokens[sIdx];
        for (let i = 0; i < normWords.length; i++) {
          if (normWords[i] === token) return i;
          const phonetics = (PHONETIC_MAP[i] || []).map(normalizeArabic);
          if (phonetics.includes(token)) return i;
        }
      }

      for (let sIdx = tokens.length - 1; sIdx >= 0; sIdx--) {
        const token = tokens[sIdx];
        if (token.length < 3) continue;
        for (let i = 0; i < normWords.length; i++) {
          const normWord = normWords[i];
          if (normWord.length >= 3 && (normWord.includes(token) || token.includes(normWord))) {
            return i;
          }
        }
      }

      return -1;
    }

    expect(resolveCumulativeArabic("الحمد")).toBe(0);
    expect(resolveCumulativeArabic("الحمد لله")).toBe(1);
    expect(resolveCumulativeArabic("الحمد لله رب")).toBe(2);
    expect(resolveCumulativeArabic("الحمد لله رب العالمين")).toBe(3);
  });

  it("normalizes IndoPak Yeh and Uthmani Alif Khanjareeyah to identical Arabic roots", () => {
    expect(normalizeArabic("الْعٰلَمِیْنَ")).toBe(normalizeArabic("ٱلْعَـٰلَمِينَ"));
  });

it("normalizes IndoPak and Uthmani Lillah to canonical لله preventing dagger-alif corruption", () => {
    expect(normalizeArabic("لِلّٰهِ")).toBe("لله");
    expect(normalizeArabic("لِلَّهِ")).toBe("لله");
    expect(normalizeArabic("اللّٰهِ")).toBe("الله");
    expect(normalizeArabic("ٱللَّهِ")).toBe("الله");
  });

  it("accurately matches all 4 IndoPak script words in Ayah 2 individually and cumulatively", () => {
    const indopakWords = ["اَلْحَمْدُ", "لِلّٰهِ", "رَبِّ", "الْعٰلَمِیْنَ"];
    const normIndoPak = indopakWords.map(normalizeArabic);

    expect(normIndoPak).toEqual(["الحمد", "لله", "رب", "العالمين"]);

    function matchIndoPakWord(spoken: string): number {
      const tokens = spoken.trim().split(/\s+/).map(normalizeArabic).filter(Boolean);
      for (let sIdx = tokens.length - 1; sIdx >= 0; sIdx--) {
        const token = tokens[sIdx];
        for (let i = normIndoPak.length - 1; i >= 0; i--) {
          if (normIndoPak[i] === token) return i;
          const phonetics = (PHONETIC_MAP[i] || []).map(normalizeArabic);
          if (phonetics.includes(token)) return i;

}
      }
      return -1;
    }

    expect(matchIndoPakWord("الحمد")).toBe(0);
    expect(matchIndoPakWord("لله")).toBe(1);
    expect(matchIndoPakWord("رب")).toBe(2);
    expect(matchIndoPakWord("العالمين")).toBe(3);
    expect(matchIndoPakWord("الحمد لله")).toBe(1);
    expect(matchIndoPakWord("الحمد لله رب")).toBe(2);
    expect(matchIndoPakWord("الحمد لله رب العالمين")).toBe(3);
  });

  it("simulates real-time vocal cadence progression across Ayah words", () => {
    let currentIndex = 0;
    const words = ["اَلْحَمْدُ", "لِلّٰهِ", "رَبِّ", "الْعٰلَمِیْنَ"];

    function handleVocalPulse(sustainedMs: number, timeSinceLastAdvanceMs: number) {
      if (sustainedMs >= 300 && timeSinceLastAdvanceMs >= 700) {
        if (currentIndex < words.length - 1) {
          currentIndex += 1;
        }
      }
    }

    handleVocalPulse(350, 800);
    expect(currentIndex).toBe(1);

    handleVocalPulse(400, 750);
    expect(currentIndex).toBe(2);

    handleVocalPulse(450, 900);
    expect(currentIndex).toBe(3);

    handleVocalPulse(400, 800);
    expect(currentIndex).toBe(3);
  });

  it("generates correct Deepgram KeepAlive payload", () => {
    const keepAliveMsg = JSON.stringify({ type: "KeepAlive" });
    const parsed = JSON.parse(keepAliveMsg);
    expect(parsed.type).toBe("KeepAlive");
  });

  it("advances transliteration recitation across all 7 ayahs using dynamic fallbacks", () => {
    const fatihahLesson = CURRICULUM_LESSONS.find((l) => l.id === "fatihah-all")!;
    const words = fatihahLesson.wordsUthmani.map((w) => w.word);
    let lastIndex = -1;

    function matchTranslitWord(token: string): number {
      const t = token.toLowerCase();
      const candidates: number[] = [];
      const visited = new Set<number>();
      const add = (idx: number) => {
        if (idx >= 0 && idx < words.length && !visited.has(idx)) {
          visited.add(idx);
          candidates.push(idx);
        }
      };

      if (lastIndex >= 0) {
        add(lastIndex + 1);
        for (let i = 2; i <= 6; i++) add(lastIndex + i);
        add(lastIndex);
        for (let i = lastIndex + 7; i < words.length; i++) add(i);
        for (let i = 0; i < lastIndex; i++) add(i);
      } else {
        for (let i = 0; i < words.length; i++) add(i);
      }

      for (const idx of candidates) {
        const fallbacks = [
          ...(QURAN_PHONETIC_FALLBACK[idx] || []),
          ...getWordFallbacks(words[idx] || "")
        ].map((f) => f.toLowerCase());

        if (fallbacks.some((f) => f === t || f.startsWith(t) || t.startsWith(f))) {
          lastIndex = idx;
          return idx;
        }
      }
      return -1;
    }

    // Line 1
    expect(matchTranslitWord("bismi")).toBe(0);
    expect(matchTranslitWord("allah")).toBe(1);
    expect(matchTranslitWord("ar-rahman")).toBe(2);
    expect(matchTranslitWord("ar-rahim")).toBe(3);

    // Line 2
    expect(matchTranslitWord("alhamdu")).toBe(4);
    expect(matchTranslitWord("lillahi")).toBe(5);
    expect(matchTranslitWord("rabbi")).toBe(6);
    expect(matchTranslitWord("al-alameen")).toBe(7);

    // Line 3 - MUST advance to 8 and 9!
    expect(matchTranslitWord("ar-rahman")).toBe(8);
    expect(matchTranslitWord("ar-rahim")).toBe(9);

    // Line 4
    expect(matchTranslitWord("maliki")).toBe(10);
    expect(matchTranslitWord("yawm")).toBe(11);
    expect(matchTranslitWord("ad-deen")).toBe(12);

    // Line 5
    expect(matchTranslitWord("iyyaka")).toBe(13);
    expect(matchTranslitWord("na'budu")).toBe(14);
    expect(matchTranslitWord("wa-iyyaka")).toBe(15);
    expect(matchTranslitWord("nasta'een")).toBe(16);

    // Line 6
    expect(matchTranslitWord("ihdina")).toBe(17);
    expect(matchTranslitWord("as-sirat")).toBe(18);
    expect(matchTranslitWord("al-mustaqeem")).toBe(19);

    // Line 7
    expect(matchTranslitWord("sirat")).toBe(20);
    expect(matchTranslitWord("alladhina")).toBe(21);
    expect(matchTranslitWord("an'amta")).toBe(22);
    expect(matchTranslitWord("alayhim")).toBe(23);
    expect(matchTranslitWord("ghayr")).toBe(24);
    expect(matchTranslitWord("al-maghdubi")).toBe(25);
    expect(matchTranslitWord("alayhim")).toBe(26);
    expect(matchTranslitWord("wala")).toBe(27);
    expect(matchTranslitWord("ad-dallin")).toBe(28);
  });

  it("resets back to word 0 if user jumps backward to restart the surah", () => {
    const fatihahLesson = CURRICULUM_LESSONS.find((l) => l.id === "fatihah-all")!;
    const words = fatihahLesson.wordsUthmani.map((w) => w.word);
    const normWords = words.map(normalizeArabic);

    let lastIndex = 20;

    function processToken(token: string) {
      const tokenNorm = normalizeArabic(token);
      const candidates: number[] = [];
      const visited = new Set<number>();
      const add = (idx: number) => {
        if (idx >= 0 && idx < words.length && !visited.has(idx)) {
          visited.add(idx);
          candidates.push(idx);
        }
      };

      add(lastIndex + 1);
      for (let i = 2; i <= 6; i++) add(lastIndex + i);
      add(lastIndex);
      for (let i = lastIndex + 7; i < words.length; i++) add(i);
      for (let i = 0; i < lastIndex; i++) add(i);

      for (const idx of candidates) {
        if (normWords[idx] === tokenNorm) {
          lastIndex = idx;
          return idx;
        }
      }
      return -1;
    }

    expect(processToken("بسم")).toBe(0);
    expect(lastIndex).toBe(0);

    expect(processToken("الله")).toBe(1);
    expect(lastIndex).toBe(1);
  });

  describe("Context-Aware Duplicate Word Disambiguation & Ayah-Gated Progression Suite", () => {
    const fatihahLesson = CURRICULUM_LESSONS.find((l) => l.id === "fatihah-all")!;
    const words = fatihahLesson.wordsUthmani.map((w) => w.word);
    const normWords = words.map(normalizeArabic);
    const prefixStrippedWords = normWords.map(stripArabicPrefix);

    let currentAyah = fatihahLesson.ayahNumber || 1;
    const wordAyahs = fatihahLesson.wordsUthmani.map((w) => {
      const ayah = currentAyah;
      if (w.isAyahEnd) currentAyah = (w.ayahNumber ?? currentAyah) + 1;
      return ayah;
    });

    // Mirror the exact matchTokenToWord and scoreCandidate logic from useVoiceFollow
    function matchToken(token: string, wordIdx: number): boolean {
      if (wordIdx < 0 || wordIdx >= words.length) return false;
      const normTok = normalizeArabic(token);
      if (normTok) {
        if (normWords[wordIdx] === normTok) return true;
        if (
          (normTok === "الرحمن" && (normWords[wordIdx] === "رحمان" || normWords[wordIdx] === "الرحمن")) ||
          (normTok === "رحمان" && (normWords[wordIdx] === "الرحمن" || normWords[wordIdx] === "رحمان")) ||
          (normTok === "مالك" && (normWords[wordIdx] === "ملك" || normWords[wordIdx] === "مالك")) ||
          (normTok === "ملك" && (normWords[wordIdx] === "مالك" || normWords[wordIdx] === "ملك")) ||
          (normTok === "لله" && normWords[wordIdx] === "الله") ||
          (normTok === "الله" && normWords[wordIdx] === "لله")
        ) return true;
        const strippedTok = stripArabicPrefix(normTok);
        if (strippedTok.length >= 3 && prefixStrippedWords[wordIdx] === strippedTok) return true;
        const w = normWords[wordIdx] || "";
        if (normTok.length >= 4 && w.length >= 4 && (w.includes(normTok) || normTok.includes(w))) return true;
        const phonetics = (PHONETIC_MAP[wordIdx] || []).map(normalizeArabic);
        if (phonetics.includes(normTok)) return true;
      }
      const lowTok = token.toLowerCase().replace(/[^a-z0-9'-]/g, "").trim();
      if (lowTok) {
        const fallbacks = [
          ...(QURAN_PHONETIC_FALLBACK[wordIdx] || []),
          ...getWordFallbacks(words[wordIdx] || "")
        ].map((f) => f.toLowerCase().replace(/[^a-z0-9'-]/g, ""));
        if (fallbacks.some((f) => f === lowTok)) return true;
        if (lowTok.length >= 4 && fallbacks.some((f) => f.startsWith(lowTok) || lowTok.startsWith(f))) return true;
      }
      return false;
    }

    function scoreCandidate(cand: number, curr: number, isSurahStartWord: boolean): number {
      if (cand < 0 || cand >= words.length) return -99999;
      const currAyah = wordAyahs[curr] ?? 1;
      const candAyah = wordAyahs[cand] ?? 1;
      const dist = cand - curr;

      if (cand === 0 && isSurahStartWord) return 2000 - Math.abs(dist) * 2;

      let score = 0;
      if (dist === 1) score += 1000;
      else if (dist === 0) score += 600;
      else if (dist === 2) score += 450;
      else if (dist === 3) score += 300;
      else if (dist > 3 && dist <= 6) score += 150 - (dist - 3) * 25;

      if (wordAyahs.length > 0) {
        if (candAyah === currAyah) {
          score += 350;
        } else if (candAyah === currAyah + 1) {
          const nextWordAyah = wordAyahs[curr + 1];
          const isNearAyahEnd = nextWordAyah === undefined || nextWordAyah !== currAyah || dist <= 2;
          if (isNearAyahEnd) score += 350;
          else score -= 200;
        } else if (candAyah > currAyah + 1) {
          score -= 5000; // STRICT ANTI-SKIP GATE
        } else if (candAyah === currAyah - 1) {
          score += 100 - Math.abs(dist) * 15;
        } else if (candAyah < currAyah - 1) {
          score -= 3000;
        }
      }
      if (dist < 0 && candAyah === currAyah) score += 250 - Math.abs(dist) * 20;
      score -= Math.abs(dist) * 5;
      return score;
    }

    function processAlignment(spokenText: string, currentPosition: number): number {
      const clean = spokenText.trim();
      const isArabic = /[\u0600-\u06FF]/.test(clean);
      let tokens: string[] = [];

      if (isArabic) {
        tokens = clean.split(/\s+/).filter((w) => /[\u0600-\u06FF]/.test(w)).map(normalizeArabic).filter(Boolean);
      } else {
        const rawTokens = clean.toLowerCase().replace(/[^a-z0-9\s'-]/g, " ").split(/\s+/).filter(Boolean);
        const merged: string[] = [];
        for (let i = 0; i < rawTokens.length; i++) {
          const cur = rawTokens[i]!;
          const next = rawTokens[i + 1];
          if (next && (cur === "ar" || cur === "al" || cur === "wa" || cur === "bi" || cur === "ad" || cur === "as")) {
            merged.push(`${cur}-${next}`);
            i++;
          } else {
            merged.push(cur);
          }
        }
        tokens = merged;
      }

      let curr = currentPosition;

      // N-Gram Multi-Word Alignment
      if (tokens.length >= 2) {
        const maxN = Math.min(5, tokens.length);
        for (let N = maxN; N >= 2; N--) {
          for (let tStart = 0; tStart <= tokens.length - N; tStart++) {
            const phraseTokens = tokens.slice(tStart, tStart + N);
            const firstTok = phraseTokens[0]!;
            const isSurahStart = firstTok === "بسم" || firstTok === "bismi" || firstTok === "bism" || firstTok === "bismillah" || firstTok === "bismillahir" || firstTok === "bismillahi";

            let bestSpanStart = -1;
            let bestSpanScore = -Infinity;

            for (let wStart = 0; wStart <= words.length - N; wStart++) {
              let allMatch = true;
              for (let k = 0; k < N; k++) {
                if (!matchToken(phraseTokens[k]!, wStart + k)) {
                  allMatch = false;
                  break;
                }
              }
              if (allMatch) {
                const spanScore = scoreCandidate(wStart, curr, isSurahStart) + N * 600;
                if (spanScore > bestSpanScore) {
                  bestSpanScore = spanScore;
                  bestSpanStart = wStart;
                }
              }
            }

            if (bestSpanStart !== -1 && bestSpanScore > 0) {
              return bestSpanStart + N - 1;
            }
          }
        }
      }

      // Single-word Alignment
      for (const token of tokens) {
        const isSurahStart = token === "بسم" || token === "bismi" || token === "bism" || token === "bismillah" || token === "bismillahir" || token === "bismillahi";
        let bestCand = -1;
        let bestScore = -Infinity;

        for (let i = 0; i < words.length; i++) {
          if (matchToken(token, i)) {
            const score = scoreCandidate(i, curr, isSurahStart);
            if (score > bestScore) {
              bestScore = score;
              bestCand = i;
            }
          }
        }

        if (bestCand !== -1 && bestScore > 0) {
          curr = bestCand;
        }
      }
      return curr;
    }

    it("disambiguates Ar-Rahman: matches Ayah 1 (word 2) when at Ayah 1, NEVER skipping to Ayah 3 (word 8)", () => {
      // Reciter is at word 0 (Ayah 1)
      expect(processAlignment("الرحمن", 0)).toBe(2);
      expect(processAlignment("ar-rahman", 0)).toBe(2);

      // Reciter is at word 1 (Ayah 1)
      expect(processAlignment("الرحمن", 1)).toBe(2);
      expect(processAlignment("ar-rahman", 1)).toBe(2);

      // Reciter is at word 3 (end of Ayah 1), repeating Ar-Rahman stays within Ayah 1
      expect(processAlignment("الرحمن", 3)).toBe(2);
      expect(processAlignment("ar-rahman", 3)).toBe(2);
    });

    it("disambiguates Ar-Rahman: matches Ayah 3 (word 8) AFTER Ayah 2 has been reached or read", () => {
      // Reciter is at word 7 (end of Ayah 2), recites Ar-Rahman
      expect(processAlignment("الرحمن", 7)).toBe(8);
      expect(processAlignment("ar-rahman", 7)).toBe(8);

      // Reciter is at word 8 (Ayah 3), repeating Ar-Rahman stays on word 8
      expect(processAlignment("الرحمن", 8)).toBe(8);
      expect(processAlignment("ar-rahman", 8)).toBe(8);
    });

    it("disambiguates Ar-Raheem: matches Ayah 1 (word 3) vs Ayah 3 (word 9) contextually", () => {
      // In Ayah 1 (word 2)
      expect(processAlignment("الرحيم", 2)).toBe(3);
      expect(processAlignment("ar-rahim", 2)).toBe(3);

      // In Ayah 3 (word 8)
      expect(processAlignment("الرحيم", 8)).toBe(9);
      expect(processAlignment("ar-rahim", 8)).toBe(9);
    });

    it("disambiguates compound Ar-Rahman Ar-Raheem phrase: matches Ayah 1 (words 2-3) vs Ayah 3 (words 8-9)", () => {
      // At word 0: matches Ayah 1 ending at word 3
      expect(processAlignment("الرحمن الرحيم", 0)).toBe(3);
      expect(processAlignment("ar-rahman ar-rahim", 0)).toBe(3);

      // At word 7 (Ayah 2 finished): matches Ayah 3 ending at word 9
      expect(processAlignment("الرحمن الرحيم", 7)).toBe(9);
      expect(processAlignment("ar-rahman ar-rahim", 7)).toBe(9);
    });

    it("disambiguates duplicate 'alayhim' in Ayah 7 (word 23 vs word 26)", () => {
      // At word 22 (an'amta), reciting alayhim matches word 23
      expect(processAlignment("عليهم", 22)).toBe(23);
      expect(processAlignment("alayhim", 22)).toBe(23);

      // At word 25 (al-maghdubi), reciting alayhim matches word 26
      expect(processAlignment("عليهم", 25)).toBe(26);
      expect(processAlignment("alayhim", 25)).toBe(26);
    });

    it("disambiguates 'iyyaka' in Ayah 5 (word 13 vs word 15)", () => {
      // At word 12 (ad-deen), iyyaka matches word 13
      expect(processAlignment("اياك", 12)).toBe(13);
      expect(processAlignment("iyyaka", 12)).toBe(13);

      // At word 14 (na'budu), wa-iyyaka matches word 15
      expect(processAlignment("واياك", 14)).toBe(15);
      expect(processAlignment("wa-iyyaka", 14)).toBe(15);
    });

    it("disambiguates 'sirat' (word 18 in Ayah 6 vs word 20 in Ayah 7)", () => {
      // At word 17 (ihdina), sirat matches word 18
      expect(processAlignment("الصراط", 17)).toBe(18);
      expect(processAlignment("as-sirat", 17)).toBe(18);

      // At word 19 (al-mustaqeem), sirat matches word 20
      expect(processAlignment("صراط", 19)).toBe(20);
      expect(processAlignment("sirat", 19)).toBe(20);
    });

    it("seamlessly resets back to word 0 when reciter restarts Surah with Bismillah from anywhere", () => {
      // From Ayah 3 (word 8)
      expect(processAlignment("بسم", 8)).toBe(0);
      expect(processAlignment("bismi", 8)).toBe(0);
      expect(processAlignment("bismillah", 8)).toBe(0);

      // From Ayah 5 (word 15)
      expect(processAlignment("بسم الله الرحمن الرحيم", 15)).toBe(3);

      // From Ayah 7 (word 26)
      expect(processAlignment("bismillahir rahmanir rahim", 26)).toBe(3);
    });
  });
});
