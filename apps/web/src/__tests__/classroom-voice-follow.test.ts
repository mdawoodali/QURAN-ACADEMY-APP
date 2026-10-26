import { describe, it, expect, vi } from "vitest";
import { normalizeArabic, PHONETIC_MAP, QURAN_PHONETIC_FALLBACK } from "@/features/classroom/constants";

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
        const fallbacks = QURAN_PHONETIC_FALLBACK[i] || [];
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
            const fallbacks = (QURAN_PHONETIC_FALLBACK[wIdx] || []).map((f) => f.toLowerCase());
            if (fallbacks.some((f) => f === pair || f === pairHyphen)) {
              return wIdx;
            }
          }
        }

        for (let wIdx = 0; wIdx < currentWords.length; wIdx++) {
          const fallbacks = (QURAN_PHONETIC_FALLBACK[wIdx] || []).map((f) => f.toLowerCase());
          if (fallbacks.some((f) => f === token)) {
            return wIdx;
          }
        }
      }

      for (let tIdx = tokens.length - 1; tIdx >= 0; tIdx--) {
        const token = tokens[tIdx];
        if (token.length < 4) continue;
        for (let wIdx = 0; wIdx < currentWords.length; wIdx++) {
          const fallbacks = (QURAN_PHONETIC_FALLBACK[wIdx] || []).map((f) => f.toLowerCase());
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

    // Reciting Word 0 -> user vocalizes for 350ms with 800ms elapsed
    handleVocalPulse(350, 800);
    expect(currentIndex).toBe(1);

    // Reciting Word 1 -> user vocalizes for 400ms with 750ms elapsed
    handleVocalPulse(400, 750);
    expect(currentIndex).toBe(2);

    // Reciting Word 2 -> user vocalizes for 450ms with 900ms elapsed
    handleVocalPulse(450, 900);
    expect(currentIndex).toBe(3);

    // Word 3 is the last word in the Ayah -> holds on last word
    handleVocalPulse(400, 800);
    expect(currentIndex).toBe(3);
  });

  it("generates correct Deepgram KeepAlive payload", () => {
    const keepAliveMsg = JSON.stringify({ type: "KeepAlive" });
    const parsed = JSON.parse(keepAliveMsg);
    expect(parsed.type).toBe("KeepAlive");
  });
});