"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { normalizeArabic, PHONETIC_MAP } from "../constants";

interface UseVoiceFollowOptions {
  currentWords: string[];
  onMatchWord: (index: number) => void;
}

export function useVoiceFollow({ currentWords, onMatchWord }: UseVoiceFollowOptions) {
  const [isVoiceFollowOn, setIsVoiceFollowOn] = useState(false);
  const isVoiceFollowOnRef = useRef(false);
  const [lastSpokenText, setLastSpokenText] = useState("");
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [activeSpeechEngine, setActiveSpeechEngine] = useState<"Deepgram AI" | "Web Speech" | null>(null);

  const recognitionRef = useRef<{ start: () => void; stop: () => void } | null>(null);
  const deepgramSocketRef = useRef<WebSocket | null>(null);
  const deepgramStreamRef = useRef<MediaStream | null>(null);
  const deepgramRecorderRef = useRef<MediaRecorder | null>(null);

  const processSpokenTranscript = useCallback((rawText: string) => {
    const clean = rawText.trim();
    if (!clean) return;

    // STRICT ARABIC ENFORCEMENT:
    // Only accept Arabic script input; discard all English / non-Arabic speech.
    const ARABIC_SCRIPT_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    if (!ARABIC_SCRIPT_REGEX.test(clean)) {
      // Input is entirely English or non-Arabic; ignore it completely.
      return;
    }

    // Filter out any incidental non-Arabic tokens so the engine only processes Arabic
    const arabicOnlyWords = clean
      .split(/\s+/)
      .filter((w) => ARABIC_SCRIPT_REGEX.test(w));

    if (arabicOnlyWords.length === 0) return;

    const arabicClean = arabicOnlyWords.join(" ");
    setLastSpokenText(arabicClean);

    // Check spoken Arabic words starting with the latest token
    for (let sIdx = arabicOnlyWords.length - 1; sIdx >= 0; sIdx--) {
      const wordToken = arabicOnlyWords[sIdx] || "";
      const normalizedSpoken = normalizeArabic(wordToken);
      if (!normalizedSpoken) continue;

      let matchIdx = -1;
      for (let i = 0; i < currentWords.length; i++) {
        const normAyahWord = normalizeArabic(currentWords[i] || "");
        if (
          normAyahWord &&
          (normAyahWord.includes(normalizedSpoken) || normalizedSpoken.includes(normAyahWord))
        ) {
          matchIdx = i;
          break;
        }
        const phonetics = PHONETIC_MAP[i] || [];
        if (phonetics.some((p) => normalizeArabic(p) === normalizedSpoken)) {
          matchIdx = i;
          break;
        }
      }

      if (matchIdx !== -1) {
        onMatchWord(matchIdx);
        break;
      }
    }
  }, [currentWords, onMatchWord]);

  const startWebSpeechFallback = useCallback(() => {
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
      setVoiceError("Speech recognition is not supported in this browser. Try Chrome.");
      toast.error("Speech API not supported in this browser");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "ar-SA";

      recognition.onstart = () => {
        setVoiceError(null);
        setActiveSpeechEngine("Web Speech");
        toast.success("AI Arabic Voice Follow active (Web Speech)");
      };

      recognition.onerror = (e: { error: string }) => {
        if (e.error !== "no-speech") {
          console.warn("Speech recognition error:", e.error);
          setVoiceError(`Mic error: ${e.error}`);
        }
      };

      recognition.onend = () => {
        if (isVoiceFollowOnRef.current && activeSpeechEngine === "Web Speech") {
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
    } catch {
      setVoiceError("Failed to access speech engine.");
    }
  }, [activeSpeechEngine, processSpokenTranscript]);

  const startVoiceFollow = useCallback(async () => {
    // 1. Try Deepgram Ultra-Low Latency Streaming
    try {
      const tokenRes = await fetch("/api/speech/deepgram-token");
      const tokenData = await tokenRes.json();
      if (tokenData.configured && tokenData.apiKey) {
        // Deepgram Nova-3 uses `keyterm` for vocabulary boosting (keywords is unsupported in Nova-3)
        const keyterms = currentWords
          .map((w) => normalizeArabic(w))
          .filter((w) => w.length > 1)
          .slice(0, 25);
        const keytermParams = keyterms.length > 0
          ? "&" + keyterms.map((w) => `keyterm=${encodeURIComponent(w)}`).join("&")
          : "";

        const wsUrl = `wss://api.deepgram.com/v1/listen?model=nova-3&language=ar&smart_format=true&interim_results=true${keytermParams}`;
        const socket = new WebSocket(wsUrl, ["token", tokenData.apiKey]);

        socket.onopen = async () => {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
              },
            });
            deepgramStreamRef.current = stream;

            // Cross-browser MediaRecorder MIME type detection (supports Chrome, Safari, Firefox, iOS)
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
              if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
                socket.send(event.data);
              }
            };
            recorder.start(250);
            deepgramRecorderRef.current = recorder;
            setActiveSpeechEngine("Deepgram AI");
            setVoiceError(null);
            toast.success("AI Arabic Voice Follow active (Deepgram Nova-3)");
          } catch {
            setVoiceError("Microphone access denied for Deepgram streaming.");
          }
        };

        socket.onmessage = (msg) => {
          try {
            const parsed = JSON.parse(msg.data);
            const transcript = parsed.channel?.alternatives[0]?.transcript;
            if (transcript) {
              processSpokenTranscript(transcript);
            }
          } catch {}
        };

        socket.onerror = (err) => {
          console.warn("[Deepgram] WebSocket error, switching to Web Speech fallback:", err);
          startWebSpeechFallback();
        };

        socket.onclose = (event) => {
          // If disconnected unexpectedly, fall back to Web Speech
          if (isVoiceFollowOnRef.current && event.code !== 1000 && event.code !== 1005) {
            console.warn(`[Deepgram] Connection closed (${event.code}), falling back to Web Speech.`);
            startWebSpeechFallback();
          }
        };

        deepgramSocketRef.current = socket;
        return;
      }
    } catch (err) {
      console.warn("[Deepgram] Token fetch or initialization failed:", err);
    }

    // 2. Fallback to Web Speech API
    startWebSpeechFallback();
  }, [currentWords, processSpokenTranscript, startWebSpeechFallback]);

  const stopVoiceFollow = useCallback(() => {
    isVoiceFollowOnRef.current = false;
    setIsVoiceFollowOn(false);
    setActiveSpeechEngine(null);

    if (deepgramRecorderRef.current && deepgramRecorderRef.current.state !== "inactive") {
      try {
        deepgramRecorderRef.current.stop();
      } catch {}
    }
    if (deepgramStreamRef.current) {
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
  }, []);

  const toggleVoiceFollow = useCallback(() => {
    if (isVoiceFollowOn) {
      stopVoiceFollow();
      toast("AI Arabic Voice Follow paused");
    } else {
      isVoiceFollowOnRef.current = true;
      setIsVoiceFollowOn(true);
      startVoiceFollow();
    }
  }, [isVoiceFollowOn, startVoiceFollow, stopVoiceFollow]);

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
    toggleVoiceFollow
  };
}
