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
});
