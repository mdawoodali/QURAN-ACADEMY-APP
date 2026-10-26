"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { normalizeArabic, PHONETIC_MAP, QURAN_PHONETIC_FALLBACK } from "../constants";

interface UseVoiceFollowOptions {
  currentWords: string[];
  onMatchWord: (index: number) => void;
  audioStream?: MediaStream | null;
}

export function useVoiceFollow({ currentWords, onMatchWord, audioStream }: UseVoiceFollowOptions) {
  const [isVoiceFollowOn, setIsVoiceFollowOn] = useState(false);
  const isVoiceFollowOnRef = useRef(false);
  const [lastSpokenText, setLastSpokenText] = useState("");
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [activeSpeechEngine, setActiveSpeechEngine] = useState<"Deepgram AI" | "Web Speech" | null>(null);
  const activeSpeechEngineRef = useRef<"Deepgram AI" | "Web Speech" | null>(null);

  // Store current words and callback in refs to avoid tearing down audio listeners on re-render
  const currentWordsRef = useRef<string[]>(currentWords);
  useEffect(() => {
    currentWordsRef.current = currentWords;
  }, [currentWords]);

  const onMatchWordRef = useRef(onMatchWord);
  useEffect(() => {
    onMatchWordRef.current = onMatchWord;
  }, [onMatchWord]);

  const setEngine = (engine: "Deepgram AI" | "Web Speech" | null) => {
    activeSpeechEngineRef.current = engine;
    setActiveSpeechEngine(engine);
  };

  const recognitionRef = useRef<{ start: () => void; stop: () => void } | null>(null);
  const deepgramSocketRef = useRef<WebSocket | null>(null);
  const deepgramStreamRef = useRef<MediaStream | null>(null);
  const deepgramRecorderRef = useRef<MediaRecorder | null>(null);
  const isStartingSpeechRef = useRef(false);
  const hasNotifiedVoiceRef = useRef(false);

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
      // Pass 1: Exact matches (checking from latest spoken token backwards)
      for (let sIdx = arabicTokens.length - 1; sIdx >= 0; sIdx--) {
        const token = arabicTokens[sIdx] || "";
        if (!token) continue;

        for (let i = 0; i < normWords.length; i++) {
          if (normWords[i] === token) {
            onMatchWordRef.current(i);
            return;
          }
          const phonetics = (PHONETIC_MAP[i] || []).map((p) => normalizeArabic(p));
          if (phonetics.includes(token)) {
            onMatchWordRef.current(i);
            return;
          }
        }
      }

      // Pass 2: Prefix / Substring match (requires length >= 3)
      for (let sIdx = arabicTokens.length - 1; sIdx >= 0; sIdx--) {
        const token = arabicTokens[sIdx] || "";
        if (!token || token.length < 3) continue;

        for (let i = 0; i < normWords.length; i++) {
          const normAyahWord = normWords[i] || "";
          if (normAyahWord.length >= 3) {
            if (normAyahWord.includes(token) || token.includes(normAyahWord)) {
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

        // Check compound phrases first
        if (pair || pairHyphen) {
          for (let wIdx = 0; wIdx < words.length; wIdx++) {
            const fallbacks = (QURAN_PHONETIC_FALLBACK[wIdx] || []).map((f) => f.toLowerCase());
            if (fallbacks.some((f) => f === pair || f === pairHyphen)) {
              onMatchWordRef.current(wIdx);
              return;
            }
          }
        }

        // Check single token exact match
        for (let wIdx = 0; wIdx < words.length; wIdx++) {
          const fallbacks = (QURAN_PHONETIC_FALLBACK[wIdx] || []).map((f) => f.toLowerCase());
          if (fallbacks.some((f) => f === token)) {
            onMatchWordRef.current(wIdx);
            return;
          }
        }
      }

      // Pass 2B: Stem / Prefix match for longer tokens (length >= 4)
      for (let tIdx = tokens.length - 1; tIdx >= 0; tIdx--) {
        const token = tokens[tIdx];
        if (token.length < 4) continue;
        for (let wIdx = 0; wIdx < words.length; wIdx++) {
          const fallbacks = (QURAN_PHONETIC_FALLBACK[wIdx] || []).map((f) => f.toLowerCase());
          if (fallbacks.some((f) => f.startsWith(token) || token.startsWith(f))) {
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
      setVoiceError("Speech recognition is not supported in this browser. Please use Google Chrome or Edge.");
      toast.error("Speech API not supported in this browser", { id: "voice-follow-status" });
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
        // Automatically restart speech loop while voice follow remains toggled on
        if (isVoiceFollowOnRef.current) {
          try {
            recognition.start();
          } catch {}
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
    // 1. Try Deepgram Nova-3 Streaming if key is configured
    try {
      const tokenRes = await fetch("/api/speech/deepgram-token");
      const tokenData = await tokenRes.json();
      if (tokenData.configured && tokenData.apiKey) {
        const words = currentWordsRef.current;
        const keyterms = words
          .map((w) => normalizeArabic(w))
          .filter((w) => w.length > 1)
          .slice(0, 25);
        const keytermParams = keyterms.length > 0
          ? "&" + keyterms.map((w) => `keyterm=${encodeURIComponent(w)}`).join("&")
          : "";

        const wsUrl = `wss://api.deepgram.com/v1/listen?model=nova-3&language=ar&smart_format=true&interim_results=true${keytermParams}`;
        const socket = new WebSocket(wsUrl, ["token", tokenData.apiKey]);

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

            const mimeType =
              typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
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
            setEngine("Deepgram AI");
            setVoiceError(null);
            if (!hasNotifiedVoiceRef.current) {
              hasNotifiedVoiceRef.current = true;
              toast.success("AI Voice Follow active", { id: "voice-follow-status" });
            }
          } catch (micErr) {
            console.warn("[Deepgram] Failed to access microphone, falling back to Web Speech:", micErr);
            triggerFallback();
          }
        };

        socket.onmessage = (msg) => {
          try {
            const parsed = JSON.parse(msg.data);
            const transcript = parsed.channel?.alternatives?.[0]?.transcript;
            if (transcript) {
              processSpokenTranscript(transcript);
            }
          } catch {}
        };

        socket.onerror = (err) => {
          console.warn("[Deepgram] WebSocket error, switching to Web Speech fallback:", err);
          triggerFallback();
        };

        socket.onclose = () => {
          // If Deepgram closes for ANY reason while voice follow is toggled on, immediately fall back to Web Speech
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
  }, [audioStream, processSpokenTranscript, startWebSpeechFallback]);

  const stopVoiceFollow = useCallback(() => {
    hasNotifiedVoiceRef.current = false;
    isVoiceFollowOnRef.current = false;
    setIsVoiceFollowOn(false);
    setEngine(null);
    isStartingSpeechRef.current = false;

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
  }, [audioStream]);

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
  const simulateRecitation = useCallback((wordIdx?: number) => {
    const words = currentWordsRef.current;
    if (!words || words.length === 0) return;
    const targetIdx = wordIdx !== undefined ? wordIdx : 0;
    const spoken = words[targetIdx] || "الحمد";
    processSpokenTranscript(spoken);
  }, [processSpokenTranscript]);

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
    toggleVoiceFollow,
    simulateRecitation,
    processSpokenTranscript,
  };
}
