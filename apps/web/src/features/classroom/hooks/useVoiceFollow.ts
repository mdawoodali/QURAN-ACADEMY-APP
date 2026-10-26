"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
  normalizeArabic,
  stripArabicPrefix,
  getWordFallbacks,
  PHONETIC_MAP,
  QURAN_PHONETIC_FALLBACK,
} from "../constants";

interface UseVoiceFollowOptions {
  currentWords: string[];
  onMatchWord: (index: number) => void;
  audioStream?: MediaStream | null;
  currentIndex?: number | null;
  defaultOn?: boolean;
}

export function useVoiceFollow({
  currentWords,
  onMatchWord,
  audioStream,
  currentIndex = 0,
  defaultOn = false,
}: UseVoiceFollowOptions) {
  const [isVoiceFollowOn, setIsVoiceFollowOn] = useState(false);
  const isVoiceFollowOnRef = useRef(false);
  const [lastSpokenText, setLastSpokenText] = useState("");
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [activeSpeechEngine, setActiveSpeechEngine] = useState<string | null>(null);
  const activeSpeechEngineRef = useRef<string | null>(null);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  // Store current words, callback, and current index in refs
  const currentWordsRef = useRef<string[]>(currentWords);
  useEffect(() => {
    currentWordsRef.current = currentWords;
  }, [currentWords]);

  const onMatchWordRef = useRef(onMatchWord);
  useEffect(() => {
    onMatchWordRef.current = onMatchWord;
  }, [onMatchWord]);

  const currentIndexRef = useRef(currentIndex ?? 0);
  useEffect(() => {
    if (currentIndex !== undefined && currentIndex !== null && currentIndex >= 0) {
      currentIndexRef.current = currentIndex;
    }
  }, [currentIndex]);

  const setEngine = (engine: string | null) => {
    activeSpeechEngineRef.current = engine;
    setActiveSpeechEngine(engine);
  };

  const recognitionRef = useRef<{ start: () => void; stop: () => void; abort?: () => void } | null>(null);
  const webSpeechRestartTimerRef = useRef<NodeJS.Timeout | null>(null);
  const deepgramSocketRef = useRef<WebSocket | null>(null);
  const deepgramStreamRef = useRef<MediaStream | null>(null);
  const deepgramRecorderRef = useRef<MediaRecorder | null>(null);
  const keepAliveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isStartingSpeechRef = useRef(false);
  const hasNotifiedVoiceRef = useRef(false);

  // Audio VAD Cadence Tracker refs
  const vadContextRef = useRef<AudioContext | null>(null);
  const vadAnalyserRef = useRef<AnalyserNode | null>(null);
  const vadSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const vadAnimFrameRef = useRef<number | null>(null);
  const consecutiveSpeechMsRef = useRef<number>(0);
  const lastAdvanceTimeRef = useRef<number>(0);
  const lastSpeechEndTimeRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);

  // VAD Cleanup
  const stopVadCadenceTracker = useCallback(() => {
    if (vadAnimFrameRef.current) {
      cancelAnimationFrame(vadAnimFrameRef.current);
      vadAnimFrameRef.current = null;
    }
    if (vadSourceRef.current) {
      try {
        vadSourceRef.current.disconnect();
      } catch {}
      vadSourceRef.current = null;
    }
    if (vadAnalyserRef.current) {
      try {
        vadAnalyserRef.current.disconnect();
      } catch {}
      vadAnalyserRef.current = null;
    }
    if (vadContextRef.current) {
      try {
        if (vadContextRef.current.state !== "closed") {
          vadContextRef.current.close();
        }
      } catch {}
      vadContextRef.current = null;
    }
    setIsVoiceActive(false);
    setAudioLevel(0);
    consecutiveSpeechMsRef.current = 0;
  }, []);

  // VAD Audio Cadence Monitor
  const startVadCadenceTracker = useCallback(
    (stream: MediaStream) => {
      stopVadCadenceTracker();
      if (!stream || !stream.getAudioTracks().some((t) => t.readyState === "live")) return;

      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return;

        const audioCtx = new AudioCtx();
        vadContextRef.current = audioCtx;
        if (audioCtx.state === "suspended") {
          audioCtx.resume().catch(() => {});
        }

        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.3;
        vadAnalyserRef.current = analyser;

        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        vadSourceRef.current = source;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        lastFrameTimeRef.current = performance.now();
        lastAdvanceTimeRef.current = Date.now();

        const monitorLoop = () => {
          if (!isVoiceFollowOnRef.current) return;

          analyser.getByteFrequencyData(dataArray);

          // Focus on human vocal speech band (bins 1 to 24)
          const speechBins = Math.min(24, dataArray.length);
          let speechSum = 0;
          let peak = 0;
          for (let i = 1; i < speechBins; i++) {
            const val = dataArray[i]!;
            speechSum += val;
            if (val > peak) peak = val;
          }
          const speechAvg = speechSum / Math.max(1, speechBins - 1);
          const isSpeakingNow = speechAvg > 6 || peak > 20;

          const normalized = Math.min(100, Math.round((peak / 128) * 100));
          setAudioLevel(normalized);

          const now = performance.now();
          const deltaMs = now - (lastFrameTimeRef.current || now);
          lastFrameTimeRef.current = now;

          if (isSpeakingNow) {
            setIsVoiceActive(true);
            consecutiveSpeechMsRef.current += deltaMs;

            // Voice activity detected; alignment handled purely via speech recognition matching
          } else {
            setIsVoiceActive(false);
            if (consecutiveSpeechMsRef.current > 0) {
              lastSpeechEndTimeRef.current = Date.now();
            }
            consecutiveSpeechMsRef.current = Math.max(0, consecutiveSpeechMsRef.current - deltaMs * 0.5);
          }

          vadAnimFrameRef.current = requestAnimationFrame(monitorLoop);
        };

        vadAnimFrameRef.current = requestAnimationFrame(monitorLoop);
      } catch (err) {
        console.warn("[VAD] Failed to initialize audio cadence monitor:", err);
      }
    },
    [stopVadCadenceTracker]
  );

  const processSpokenTranscript = useCallback((rawText: string) => {
    const clean = rawText.trim();
    if (!clean) return;

    setLastSpokenText(clean);

    const words = currentWordsRef.current;
    if (!words || words.length === 0) return;
    const totalWords = words.length;

    const normWords = words.map((w) => normalizeArabic(w));
    const prefixStrippedWords = normWords.map((w) => stripArabicPrefix(w));

    // Forward-biased candidate search order based on currentIndex
    const getCandidateIndices = (curr: number): number[] => {
      const candidates: number[] = [];
      const visited = new Set<number>();

      const addIdx = (idx: number) => {
        if (idx >= 0 && idx < totalWords && !visited.has(idx)) {
          visited.add(idx);
          candidates.push(idx);
        }
      };

      if (curr >= 0 && curr < totalWords) {
        // 1. Next word (highest expectation in sequential recitation)
        addIdx(curr + 1);

        // 2. Immediate forward window (2-6 words ahead)
        for (let i = 2; i <= 6; i++) {
          addIdx(curr + i);
        }

        // 3. Current word repeated
        addIdx(curr);

        // 4. Further ahead in the lesson
        for (let i = curr + 7; i < totalWords; i++) {
          addIdx(i);
        }

        // 5. Earlier in the lesson: proximity order (re-reciting previous words or restarting)
        for (let i = curr - 1; i >= 0; i--) {
          addIdx(i);
        }
      } else {
        // Natural start: iterate from word 0 to end
        for (let i = 0; i < totalWords; i++) {
          addIdx(i);
        }
      }

      return candidates;
    };

    // 1. Check for Arabic script tokens
    const ARABIC_SCRIPT_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    const arabicTokens = clean
      .split(/\s+/)
      .filter((w) => ARABIC_SCRIPT_REGEX.test(w))
      .map((w) => normalizeArabic(w))
      .filter(Boolean);

    if (arabicTokens.length > 0) {
      for (const token of arabicTokens) {
        const tokenStripped = stripArabicPrefix(token);
        const candidates = getCandidateIndices(currentIndexRef.current);
        let matchedIdx = -1;

        // Tier 1: Exact normalized Arabic match
        for (const idx of candidates) {
          if (normWords[idx] === token) {
            matchedIdx = idx;
            break;
          }
        }

        // Tier 2: Prefix-stripped match
        if (matchedIdx === -1 && tokenStripped.length >= 3) {
          for (const idx of candidates) {
            if (prefixStrippedWords[idx] === tokenStripped) {
              matchedIdx = idx;
              break;
            }
          }
        }

        // Tier 3: Substring / stem containment (requires length >= 3)
        if (matchedIdx === -1 && token.length >= 3) {
          for (const idx of candidates) {
            const w = normWords[idx] || "";
            if (w.length >= 3 && (w.includes(token) || token.includes(w))) {
              matchedIdx = idx;
              break;
            }
          }
        }

        // Tier 4: Phonetic map / letter name fallback
        if (matchedIdx === -1) {
          for (const idx of candidates) {
            const phonetics = (PHONETIC_MAP[idx] || []).map((p) => normalizeArabic(p));
            if (
              phonetics.includes(token) ||
              (tokenStripped.length >= 3 && phonetics.some((p) => stripArabicPrefix(p) === tokenStripped))
            ) {
              matchedIdx = idx;
              break;
            }
          }
        }

        if (matchedIdx !== -1) {
          currentIndexRef.current = matchedIdx;
          lastAdvanceTimeRef.current = Date.now();
          onMatchWordRef.current(matchedIdx);
        }
      }
      return;
    }

    // 2. Transliteration / Phonetic matching for non-Arabic transcription streams
    const lower = clean.toLowerCase().replace(/[^a-z0-9\s'-]/g, " ").trim();
    const tokens = lower.split(/\s+/).filter(Boolean);
    if (tokens.length > 0) {
      for (let tIdx = 0; tIdx < tokens.length; tIdx++) {
        const token = tokens[tIdx];
        const nextToken = tokens[tIdx + 1];
        const pair = nextToken ? `${token} ${nextToken}` : "";
        const pairHyphen = nextToken ? `${token}-${nextToken}` : "";

        const candidates = getCandidateIndices(currentIndexRef.current);
        let matchedIdx = -1;

        // Pass 2A: Compound two-word phrases
        if (pair || pairHyphen) {
          for (const idx of candidates) {
            const fallbacks = [
              ...(QURAN_PHONETIC_FALLBACK[idx] || []),
              ...getWordFallbacks(words[idx] || ""),
            ].map((f) => f.toLowerCase());

            if (fallbacks.some((f) => f === pair || f === pairHyphen)) {
              matchedIdx = idx;
              tIdx++; // consumed pair
              break;
            }
          }
        }

        // Pass 2B: Single token exact match
        if (matchedIdx === -1) {
          for (const idx of candidates) {
            const fallbacks = [
              ...(QURAN_PHONETIC_FALLBACK[idx] || []),
              ...getWordFallbacks(words[idx] || ""),
            ].map((f) => f.toLowerCase());

            if (fallbacks.some((f) => f === token)) {
              matchedIdx = idx;
              break;
            }
          }
        }

        // Pass 2C: Stem / Prefix match for longer tokens (length >= 4)
        if (matchedIdx === -1 && token.length >= 4) {
          for (const idx of candidates) {
            const fallbacks = [
              ...(QURAN_PHONETIC_FALLBACK[idx] || []),
              ...getWordFallbacks(words[idx] || ""),
            ].map((f) => f.toLowerCase());

            if (fallbacks.some((f) => f.startsWith(token) || token.startsWith(f))) {
              matchedIdx = idx;
              break;
            }
          }
        }

        if (matchedIdx !== -1) {
          currentIndexRef.current = matchedIdx;
          lastAdvanceTimeRef.current = Date.now();
          onMatchWordRef.current(matchedIdx);
        }
      }
    }
  }, []);

  const startWebSpeechFallback = useCallback(() => {
    isStartingSpeechRef.current = false;

    interface BrowserSpeechRecognition {
      new (): {
        continuous: boolean;
        interimResults: boolean;
        lang: string;
        onstart: () => void;
        onerror: (e: { error: string }) => void;
        onend: () => void;
        onresult: (e: {
          resultIndex: number;
          results: { [key: number]: { [key: number]: { transcript: string } }; length: number };
        }) => void;
        start: () => void;
        stop: () => void;
        abort?: () => void;
      };
    }
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: BrowserSpeechRecognition; webkitSpeechRecognition?: BrowserSpeechRecognition })
        .SpeechRecognition ||
      (window as unknown as { SpeechRecognition?: BrowserSpeechRecognition; webkitSpeechRecognition?: BrowserSpeechRecognition })
        .webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError("Speech recognition is not supported in this browser. Please use Google Chrome or Edge.");
      toast.error("Speech API not supported in this browser", { id: "voice-follow-status" });
      return;
    }

    try {
      if (webSpeechRestartTimerRef.current) {
        clearTimeout(webSpeechRestartTimerRef.current);
        webSpeechRestartTimerRef.current = null;
      }
      if (recognitionRef.current) {
        try {
          if (recognitionRef.current.abort) {
            recognitionRef.current.abort();
          } else {
            recognitionRef.current.stop();
          }
        } catch {}
        recognitionRef.current = null;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "ar-SA";

      recognition.onstart = () => {
        setVoiceError(null);
        setEngine("Web Speech");
        isStartingSpeechRef.current = false;
        if (!hasNotifiedVoiceRef.current) {
          hasNotifiedVoiceRef.current = true;
          toast.success("AI Arabic Voice Follow active (Web Speech)", { id: "voice-follow-status" });
        }
      };

      recognition.onerror = (e: { error: string }) => {
        isStartingSpeechRef.current = false;
        if (e.error !== "no-speech") {
          console.warn("[Voice Follow] Speech recognition notice:", e.error);
          if (e.error === "not-allowed" || e.error === "service-not-allowed") {
            setVoiceError("Microphone access blocked. Please allow mic permissions in your browser.");
            toast.error("Microphone access blocked. Allow mic in browser settings.", { id: "voice-follow-status" });
          }
        }
      };

      recognition.onend = () => {
        isStartingSpeechRef.current = false;
        if (isVoiceFollowOnRef.current) {
          if (webSpeechRestartTimerRef.current) {
            clearTimeout(webSpeechRestartTimerRef.current);
          }
          webSpeechRestartTimerRef.current = setTimeout(() => {
            if (isVoiceFollowOnRef.current) {
              startWebSpeechFallback();
            }
          }, 250);
        }
      };

      recognition.onresult = (event) => {
        let fullTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          fullTranscript += " " + event.results[i][0].transcript;
        }
        processSpokenTranscript(fullTranscript);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn("[Voice Follow] Failed to initialize Web Speech:", err);
      setVoiceError("Failed to access speech engine.");
      isStartingSpeechRef.current = false;
    }
  }, [processSpokenTranscript]);

  const startVoiceFollow = useCallback(async () => {
    const FALLBACK_KEY = "5d6b86e07b415db4cdd9d41b76e0d5892f0268c9";
    let apiKey = "";
    try {
      const tokenRes = await fetch("/api/speech/deepgram-token");
      if (tokenRes.ok) {
        const tokenData = await tokenRes.json();
        if (tokenData && tokenData.apiKey) {
          apiKey = tokenData.apiKey;
        }
      }
    } catch {}

    if (!apiKey) {
      apiKey = FALLBACK_KEY;
    }

    try {
      let stream = audioStream;
      if (!stream || !stream.getAudioTracks().some((t) => t.readyState === "live")) {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
      }
      deepgramStreamRef.current = stream;
      startVadCadenceTracker(stream);
    } catch (micErr) {
      console.warn("[Voice Follow] Mic acquisition warning:", micErr);
    }

    try {
      if (apiKey) {
        const words = currentWordsRef.current;
        const keyterms = words
          .map((w) => normalizeArabic(w))
          .filter((w) => w.length > 1)
          .slice(0, 50);
        const keytermParams =
          keyterms.length > 0
            ? "&" + keyterms.map((w) => `keyterm=${encodeURIComponent(w)}`).join("&")
            : "";

        const wsUrl = `wss://api.deepgram.com/v1/listen?model=nova-3&language=ar&smart_format=true&interim_results=true${keytermParams}`;
        const socket = new WebSocket(wsUrl, ["token", apiKey]);

        let hasFallenBack = false;
        const triggerFallback = () => {
          if (hasFallenBack || !isVoiceFollowOnRef.current) return;
          hasFallenBack = true;
          try {
            if (deepgramRecorderRef.current && deepgramRecorderRef.current.state !== "inactive") {
              deepgramRecorderRef.current.stop();
            }
          } catch {}
          startWebSpeechFallback();
        };

        socket.onopen = async () => {
          try {
            let stream = deepgramStreamRef.current || audioStream;
            if (!stream || !stream.getAudioTracks().some((t) => t.readyState === "live")) {
              stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                  echoCancellation: true,
                  noiseSuppression: true,
                  autoGainControl: true,
                },
              });
            }
            deepgramStreamRef.current = stream;
            startVadCadenceTracker(stream);

            const mimeType =
              typeof MediaRecorder !== "undefined" &&
              MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
                ? "audio/webm;codecs=opus"
                : typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported("audio/webm")
                ? "audio/webm"
                : typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported("audio/mp4")
                ? "audio/mp4"
                : "";

            const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
            recorder.ondataavailable = (event) => {
              if (event.data && event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
                socket.send(event.data);
              }
            };
            recorder.start(250);
            deepgramRecorderRef.current = recorder;

            if (keepAliveIntervalRef.current) clearInterval(keepAliveIntervalRef.current);
            keepAliveIntervalRef.current = setInterval(() => {
              if (socket.readyState === WebSocket.OPEN) {
                try {
                  socket.send(JSON.stringify({ type: "KeepAlive" }));
                } catch {}
              }
            }, 5000);

            setEngine("Deepgram Nova-3 + VAD");
            setVoiceError(null);
            if (!hasNotifiedVoiceRef.current) {
              hasNotifiedVoiceRef.current = true;
              toast.success("AI Voice Follow active (Deepgram Nova-3 + VAD)", {
                id: "voice-follow-status",
              });
            }
          } catch (micErr) {
            console.warn("[Deepgram] Failed to access microphone, falling back to Web Speech:", micErr);
            triggerFallback();
          }
        };

        socket.onmessage = (msg) => {
          try {
            const parsed = JSON.parse(msg.data);
            const wordsList = parsed.channel?.alternatives?.[0]?.words;
            const transcript = parsed.channel?.alternatives?.[0]?.transcript;
            if (wordsList && Array.isArray(wordsList) && wordsList.length > 0) {
              const joined = wordsList.map((w: any) => w.word).filter(Boolean).join(" ");
              if (joined) processSpokenTranscript(joined);
            } else if (transcript && typeof transcript === "string" && transcript.trim()) {
              processSpokenTranscript(transcript);
            }
          } catch {}
        };

        socket.onerror = (err) => {
          console.warn("[Deepgram] WebSocket error, switching to Web Speech fallback:", err);
          triggerFallback();
        };

        socket.onclose = () => {
          if (keepAliveIntervalRef.current) {
            clearInterval(keepAliveIntervalRef.current);
            keepAliveIntervalRef.current = null;
          }
          if (isVoiceFollowOnRef.current) {
            console.warn("[Deepgram] Disconnected, activating Web Speech engine fallback.");
            triggerFallback();
          }
        };

        deepgramSocketRef.current = socket;
        return;
      }
    } catch (err) {
      console.warn("[Deepgram] Token fetch or initialization failed:", err);
    }

    startWebSpeechFallback();
  }, [audioStream, processSpokenTranscript, startVadCadenceTracker, startWebSpeechFallback]);

  const stopVoiceFollow = useCallback(() => {
    hasNotifiedVoiceRef.current = false;
    isVoiceFollowOnRef.current = false;
    setIsVoiceFollowOn(false);
    setEngine(null);
    isStartingSpeechRef.current = false;

    stopVadCadenceTracker();

    if (webSpeechRestartTimerRef.current) {
      clearTimeout(webSpeechRestartTimerRef.current);
      webSpeechRestartTimerRef.current = null;
    }

    if (keepAliveIntervalRef.current) {
      clearInterval(keepAliveIntervalRef.current);
      keepAliveIntervalRef.current = null;
    }

    if (deepgramRecorderRef.current && deepgramRecorderRef.current.state !== "inactive") {
      try {
        deepgramRecorderRef.current.stop();
      } catch {}
    }
    if (deepgramStreamRef.current && deepgramStreamRef.current !== audioStream) {
      deepgramStreamRef.current.getTracks().forEach((t) => t.stop());
    }
    if (deepgramSocketRef.current) {
      try {
        deepgramSocketRef.current.close();
      } catch {}
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
  }, [audioStream, stopVadCadenceTracker]);

  const toggleVoiceFollow = useCallback(() => {
    if (isVoiceFollowOn) {
      stopVoiceFollow();
      toast("AI Arabic Voice Follow paused", { id: "voice-follow-status" });
    } else {
      hasNotifiedVoiceRef.current = false;
      isVoiceFollowOnRef.current = true;
      setIsVoiceFollowOn(true);
      startVoiceFollow();
    }
  }, [isVoiceFollowOn, startVoiceFollow, stopVoiceFollow]);

  const simulateRecitation = useCallback(
    (wordIdx?: number) => {
      const words = currentWordsRef.current;
      if (!words || words.length === 0) return;
      const targetIdx = wordIdx !== undefined ? wordIdx : 0;
      const spoken = words[targetIdx] || "الحمد";
      processSpokenTranscript(spoken);
    },
    [processSpokenTranscript]
  );



  // Bind audioStream dynamically whenever microphone stream initializes or updates
  useEffect(() => {
    if (audioStream && isVoiceFollowOnRef.current) {
      deepgramStreamRef.current = audioStream;
      startVadCadenceTracker(audioStream);
    }
  }, [audioStream, startVadCadenceTracker]);

  useEffect(() => {
    return () => {
      stopVoiceFollow();
    };
  }, [stopVoiceFollow]);

  return {
    isVoiceFollowOn,
    activeSpeechEngine,
    lastSpokenText,
    voiceError,
    isVoiceActive,
    audioLevel,
    toggleVoiceFollow,
    simulateRecitation,
    processSpokenTranscript,
  };
}
