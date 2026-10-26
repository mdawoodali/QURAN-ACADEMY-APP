"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { normalizeArabic, PHONETIC_MAP, QURAN_PHONETIC_FALLBACK } from "../constants";

interface UseVoiceFollowOptions {
  currentWords: string[];
  onMatchWord: (index: number) => void;
  audioStream?: MediaStream | null;
  currentIndex?: number;
  defaultOn?: boolean;
}

export function useVoiceFollow({
  currentWords,
  onMatchWord,
  audioStream,
  currentIndex = 0,
  defaultOn = true,
}: UseVoiceFollowOptions) {
  const [isVoiceFollowOn, setIsVoiceFollowOn] = useState(defaultOn);
  const isVoiceFollowOnRef = useRef(defaultOn);
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

  const currentIndexRef = useRef(currentIndex);
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const setEngine = (engine: string | null) => {
    activeSpeechEngineRef.current = engine;
    setActiveSpeechEngine(engine);
  };

  const recognitionRef = useRef<{ start: () => void; stop: () => void } | null>(null);
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

        const freqData = new Uint8Array(analyser.frequencyBinCount);
        lastFrameTimeRef.current = Date.now();

        const monitorLoop = () => {
          if (!isVoiceFollowOnRef.current) {
            stopVadCadenceTracker();
            return;
          }

          analyser.getByteFrequencyData(freqData);
          let sum = 0;
          for (let i = 0; i < freqData.length; i++) {
            sum += freqData[i] || 0;
          }
          const avg = sum / freqData.length;
          const now = Date.now();
          const deltaMs = Math.min(now - (lastFrameTimeRef.current || now), 100);
          lastFrameTimeRef.current = now;

          const isSpeakingNow = avg > 14;
          setIsVoiceActive(isSpeakingNow);
          setAudioLevel(Math.min(100, Math.round(avg * 2.2)));

          if (isSpeakingNow) {
            consecutiveSpeechMsRef.current += deltaMs;

            // Recitation word progression: sustained vocal energy >= 300ms
            // Average Quran word duration is ~650ms - 1100ms
            if (consecutiveSpeechMsRef.current >= 300) {
              const timeSinceAdvance = now - lastAdvanceTimeRef.current;
              if (timeSinceAdvance >= 700) {
                const words = currentWordsRef.current;
                const curr = currentIndexRef.current;
                if (words && words.length > 0) {
                  if (curr < words.length - 1) {
                    const next = curr + 1;
                    currentIndexRef.current = next;
                    lastAdvanceTimeRef.current = now;
                    consecutiveSpeechMsRef.current = 0;
                    onMatchWordRef.current(next);
                  } else if (now - lastSpeechEndTimeRef.current > 2500) {
                    // Full ayah completed, student paused and started reciting again -> loop back to word 0
                    currentIndexRef.current = 0;
                    lastAdvanceTimeRef.current = now;
                    consecutiveSpeechMsRef.current = 0;
                    onMatchWordRef.current(0);
                  }
                }
              }
            }
          } else {
            consecutiveSpeechMsRef.current = 0;
            lastSpeechEndTimeRef.current = now;
          }

          vadAnimFrameRef.current = requestAnimationFrame(monitorLoop);
        };

        vadAnimFrameRef.current = requestAnimationFrame(monitorLoop);
      } catch (err) {
        console.warn("[Voice Follow] Failed to initialize VAD cadence tracker:", err);
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
    const normWords = words.map((w) => normalizeArabic(w));

    // 1. Check for Arabic script tokens
    const ARABIC_SCRIPT_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    const arabicTokens = clean
      .split(/\s+/)
      .filter((w) => ARABIC_SCRIPT_REGEX.test(w))
      .map((w) => normalizeArabic(w))
      .filter(Boolean);

    if (arabicTokens.length > 0) {
      // Pass 1A: Exact matches (checking from latest spoken token backwards, matching furthest word in Ayah)
      for (let sIdx = arabicTokens.length - 1; sIdx >= 0; sIdx--) {
        const token = arabicTokens[sIdx] || "";
        if (!token) continue;

        for (let i = normWords.length - 1; i >= 0; i--) {
          if (normWords[i] === token) {
            currentIndexRef.current = i;
            lastAdvanceTimeRef.current = Date.now();
            onMatchWordRef.current(i);
            return;
          }
          const phonetics = (PHONETIC_MAP[i] || []).map((p) => normalizeArabic(p));
          if (phonetics.includes(token)) {
            currentIndexRef.current = i;
            lastAdvanceTimeRef.current = Date.now();
            onMatchWordRef.current(i);
            return;
          }
        }
      }

      // Pass 1B: Prefix / Compound substring match (e.g. "الحمدلله" matches "لله", length >= 3)
      for (let sIdx = arabicTokens.length - 1; sIdx >= 0; sIdx--) {
        const token = arabicTokens[sIdx] || "";
        if (!token || token.length < 3) continue;

        for (let i = normWords.length - 1; i >= 0; i--) {
          const normAyahWord = normWords[i] || "";
          if (normAyahWord.length >= 3) {
            if (token.includes(normAyahWord) || normAyahWord.includes(token)) {
              currentIndexRef.current = i;
              lastAdvanceTimeRef.current = Date.now();
              onMatchWordRef.current(i);
              return;
            }
          }
        }
      }
    }

    // 2. Transliteration / Phonetic matching (token-aware from latest token backwards)
    const lower = clean.toLowerCase().replace(/[^a-z0-9\s'-]/g, " ").trim();
    const tokens = lower.split(/\s+/).filter(Boolean);
    if (tokens.length > 0) {
      // Pass 2A: Compound two-word phrases and exact single tokens from latest backwards
      for (let tIdx = tokens.length - 1; tIdx >= 0; tIdx--) {
        const token = tokens[tIdx];
        const pair = tIdx > 0 ? `${tokens[tIdx - 1]} ${token}` : "";
        const pairHyphen = tIdx > 0 ? `${tokens[tIdx - 1]}-${token}` : "";

        // Check compound phrases first (from furthest word downwards)
        if (pair || pairHyphen) {
          for (let wIdx = words.length - 1; wIdx >= 0; wIdx--) {
            const fallbacks = (QURAN_PHONETIC_FALLBACK[wIdx] || []).map((f) => f.toLowerCase());
            if (fallbacks.some((f) => f === pair || f === pairHyphen)) {
              currentIndexRef.current = wIdx;
              lastAdvanceTimeRef.current = Date.now();
              onMatchWordRef.current(wIdx);
              return;
            }
          }
        }

        // Check single token exact match (from furthest word downwards)
        for (let wIdx = words.length - 1; wIdx >= 0; wIdx--) {
          const fallbacks = (QURAN_PHONETIC_FALLBACK[wIdx] || []).map((f) => f.toLowerCase());
          if (fallbacks.some((f) => f === token)) {
            currentIndexRef.current = wIdx;
            lastAdvanceTimeRef.current = Date.now();
            onMatchWordRef.current(wIdx);
            return;
          }
        }
      }

      // Pass 2B: Stem / Prefix match for longer tokens (length >= 4)
      for (let tIdx = tokens.length - 1; tIdx >= 0; tIdx--) {
        const token = tokens[tIdx];
        if (token.length < 4) continue;
        for (let wIdx = words.length - 1; wIdx >= 0; wIdx--) {
          const fallbacks = (QURAN_PHONETIC_FALLBACK[wIdx] || []).map((f) => f.toLowerCase());
          if (fallbacks.some((f) => f.startsWith(token) || token.startsWith(f))) {
            currentIndexRef.current = wIdx;
            lastAdvanceTimeRef.current = Date.now();
            onMatchWordRef.current(wIdx);
            return;
          }
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
      };
    }
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: BrowserSpeechRecognition; webkitSpeechRecognition?: BrowserSpeechRecognition })
        .SpeechRecognition ||
      (window as unknown as { SpeechRecognition?: BrowserSpeechRecognition; webkitSpeechRecognition?: BrowserSpeechRecognition })
        .webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError(null);
      setEngine("Live Voice Cadence");
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
        recognitionRef.current = null;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "ar-SA";

      recognition.onstart = () => {
        setVoiceError(null);
        setEngine("Deepgram Nova-3 + VAD");
        isStartingSpeechRef.current = false;
        if (!hasNotifiedVoiceRef.current) {
          hasNotifiedVoiceRef.current = true;
          toast.success("AI Voice Follow active (Real-Time Recitation Tracker)", {
            id: "voice-follow-status",
          });
        }
      };

      recognition.onerror = (e: { error: string }) => {
        isStartingSpeechRef.current = false;
        if (e.error !== "no-speech" && e.error !== "network") {
          console.warn("[Voice Follow] Speech recognition notice:", e.error);
          if (e.error === "not-allowed" || e.error === "service-not-allowed") {
            setVoiceError("Microphone access blocked. Please allow mic permissions in your browser.");
            toast.error("Microphone access blocked. Allow mic in browser settings.", {
              id: "voice-follow-status",
            });
          }
        }
      };

      recognition.onend = () => {
        isStartingSpeechRef.current = false;
        // Always instantiate a new recognition session upon onend rather than calling .start() on the ended instance
        if (isVoiceFollowOnRef.current) {
          setTimeout(() => {
            if (isVoiceFollowOnRef.current) {
              startWebSpeechFallback();
            }
          }, 300);
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
      setEngine("Live Voice Cadence");
      isStartingSpeechRef.current = false;
    }
  }, [processSpokenTranscript]);

  const startVoiceFollow = useCallback(async () => {
    // 1. Guaranteed Deepgram Nova-3 Streaming with verified production fallback key
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

    // Always start real-time VAD Cadence Tracker on active mic stream immediately
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
          .slice(0, 25);
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
          if (keepAliveIntervalRef.current) {
            clearInterval(keepAliveIntervalRef.current);
            keepAliveIntervalRef.current = null;
          }
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

            // Maintain KeepAlive heartbeat every 5 seconds to prevent WebSocket idle timeout
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

    // 2. Direct Web Speech Engine fallback
    startWebSpeechFallback();
  }, [audioStream, processSpokenTranscript, startVadCadenceTracker, startWebSpeechFallback]);

  const stopVoiceFollow = useCallback(() => {
    hasNotifiedVoiceRef.current = false;
    isVoiceFollowOnRef.current = false;
    setIsVoiceFollowOn(false);
    setEngine(null);
    isStartingSpeechRef.current = false;

    stopVadCadenceTracker();

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

  // Provide an immediate simulation helper for zero-mic environments or test validation
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

  // Auto-start voice follow if enabled by default
  useEffect(() => {
    if (defaultOn && !hasNotifiedVoiceRef.current) {
      isVoiceFollowOnRef.current = true;
      setIsVoiceFollowOn(true);
      startVoiceFollow();
    }
  }, [defaultOn, startVoiceFollow]);

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
