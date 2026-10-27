"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  ClassroomHeader,
  ClassroomVideoBubble,
  LetterPracticeTray,
  MushafBoard,
  DeviceCheckModal,
  GoogleMeetBottomDock,
  GoogleMeetSideDrawer,
  GoogleMeetVideoGrid,
  FloatingReactions,
  useClassroomSync,
  useVoiceFollow,
  CURRICULUM_LESSONS,
  ClassroomViewMode,
} from "@/features/classroom";

export default function LiveClassroom() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const classId = (params?.id as string) || "demo";
  const isDemo =
    !classId ||
    classId.toLowerCase() === "demo" ||
    classId.toLowerCase().includes("demo") ||
    (typeof window !== "undefined" && window.location.pathname.toLowerCase().includes("/classroom/demo"));
  const queryRole = searchParams?.get("role") as "teacher" | "student" | "observer" | null;
  const [sessionRole, setSessionRole] = useState<"teacher" | "student" | "observer">("teacher");
  const [sessionUser, setSessionUser] = useState<string>("");

  useEffect(() => {
    if (typeof document !== "undefined") {
      const matchRole = document.cookie.match(/demo_role=([^;]+)/);
      if (matchRole?.[1]) {
        const r = matchRole[1];
        if (isDemo) {
          setSessionRole("teacher");
        } else if (r === "student") {
          setSessionRole("student");
        } else if (r === "parent") {
          setSessionRole("observer");
        } else {
          setSessionRole("teacher");
        }
      }
      const matchUser = document.cookie.match(/demo_user=([^;]+)/);
      if (matchUser?.[1]) {
        setSessionUser(decodeURIComponent(matchUser[1]));
      }
    }
  }, [classId, isDemo]);

  const roleParam: "teacher" | "student" | "observer" = queryRole || sessionRole;
  const childParam =
    searchParams?.get("child") ||
    sessionUser ||
    (roleParam === "student" ? "Yusuf Khan" : roleParam === "observer" ? "Parent of Yusuf" : "Ustadha Maryam");

  // Pre-call Hardware Diagnostic Modal State
  const [showDeviceCheck, setShowDeviceCheck] = useState<boolean>(true);

  // Classroom Google Meet View Mode & Drawer state
  const [viewMode, setViewMode] = useState<ClassroomViewMode>("whiteboard");
  const [activeDrawerTab, setActiveDrawerTab] = useState<"info" | "people" | "chat" | "host" | null>(null);
  const [unreadChatCount, setUnreadChatCount] = useState<number>(0);

  // Normalized Class Code (e.g. qra-yus-101 or qra-demo)
  const classCode = useMemo(() => {
    if (isDemo) return "qra-demo-101";
    if (classId.startsWith("qra-")) return classId;
    return `qra-${classId.slice(0, 3)}-101`;
  }, [classId, isDemo]);

  // Synchronization hook (WebSocket, BroadcastChannel, LiveKit Cloud pairing)
  const {
    localUserId,
    currentUserName,
    script,
    setScript,
    tajweedMode,
    setTajweedMode,
    highlightedIndex,
    splitIndex,
    activeLessonId,
    fontSize,
    fontColor,
    underlines,
    circles,
    colorHighlights,
    laserPointer,
    bandwidthMode,
    setBandwidthMode,
    livekitStatus,
    connectionStatus,
    remoteMuted,
    setRemoteMuted,
    chatMessages,
    reactions,
    handRaises,
    isHandRaised,
    hostPermissions,
    participants,
    sendChatMessage,
    sendReaction,
    toggleHandRaise,
    lowerHand,
    lowerAllHands,
    updateHostPermissions,
    muteAllParticipants,
    updateParticipantMedia,
    sendHighlight,
    sendSplit,
    sendLessonChange,
    sendLaserPointer,
    sendToolSync,
    sendModeration,
  } = useClassroomSync({
    classId,
    initialLessonId: "fatihah-all",
    role: roleParam,
    participantName: childParam,
  });

  // Track unread chat messages
  const lastSeenChatCountRef = useRef(chatMessages.length);
  useEffect(() => {
    if (activeDrawerTab === "chat") {
      setUnreadChatCount(0);
      lastSeenChatCountRef.current = chatMessages.length;
    } else if (chatMessages.length > lastSeenChatCountRef.current) {
      setUnreadChatCount(chatMessages.length - lastSeenChatCountRef.current);
    }
  }, [chatMessages.length, activeDrawerTab]);

  // Current Lesson Data
  const currentLesson = useMemo(() => {
    return (
      CURRICULUM_LESSONS.find((l) => l.id === activeLessonId) ||
      CURRICULUM_LESSONS[0]!
    );
  }, [activeLessonId]);

  const currentWordsList = script === "indopak" ? currentLesson.wordsIndoPak : currentLesson.wordsUthmani;
  const currentWordStrings = currentWordsList.map((item) => item.word);

  // Local media & tool states (Observers default to MUTED)
  const [isMicOn, setIsMicOn] = useState(roleParam !== "observer");
  const [isCameraOn, setIsCameraOn] = useState(roleParam !== "observer");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLaserModeActive, setIsLaserModeActive] = useState(false);
  const [isStudentUnlocked, setIsStudentUnlocked] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [activeMediaStream, setActiveMediaStream] = useState<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Ultra-low latency voice follow hook (enabled by default)
  const {
    isVoiceFollowOn,
    activeSpeechEngine,
    lastSpokenText,
    voiceError,
    toggleVoiceFollow,
    simulateRecitation,
    isVoiceActive: isVoiceFollowActive,
  } = useVoiceFollow({
    currentWords: currentWordStrings,
    onMatchWord: sendHighlight,
    currentIndex: highlightedIndex ?? 0,
    defaultOn: false,
    audioStream: activeMediaStream || streamRef.current,
  });

  // Derived effective mic state (muted if user turned it off, remote-muted, or observer)
  const isEffectiveMicOn = isMicOn && !remoteMuted;

  // Real-time synchronization refs for 60fps audio cadence tracker
  const highlightedIndexRef = useRef(highlightedIndex);
  useEffect(() => {
    highlightedIndexRef.current = highlightedIndex;
  }, [highlightedIndex]);

  const currentWordStringsRef = useRef(currentWordStrings);
  useEffect(() => {
    currentWordStringsRef.current = currentWordStrings;
  }, [currentWordStrings]);

  const isVoiceFollowOnRef = useRef(isVoiceFollowOn);
  useEffect(() => {
    isVoiceFollowOnRef.current = isVoiceFollowOn;
  }, [isVoiceFollowOn]);

  const sendHighlightRef = useRef(sendHighlight);
  useEffect(() => {
    sendHighlightRef.current = sendHighlight;
  }, [sendHighlight]);

  // Scroll container refs for dual viewport synchronization
  const teacherScrollRef = useRef<HTMLDivElement>(null);
  const studentScrollRef = useRef<HTMLDivElement>(null);
  const dualScrollRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScrollRef = useRef(false);

  // Real-time synchronization of Teacher scroll to Student view (when following teacher)
  const handleTeacherScroll = useCallback(() => {
    if (isProgrammaticScrollRef.current) return;
    if (!isStudentUnlocked && teacherScrollRef.current && studentScrollRef.current) {
      studentScrollRef.current.scrollTop = teacherScrollRef.current.scrollTop;
    }
  }, [isStudentUnlocked]);

  // Synchronized smooth auto-scroll to keep active highlighted word in viewport on both sides
  useEffect(() => {
    if (highlightedIndex === null || highlightedIndex === undefined) return;

    const scrollContainerToWord = (container: HTMLElement | null) => {
      if (!container) return;
      const wordEl = container.querySelector(
        `[data-word-index="${highlightedIndex}"]`
      ) as HTMLElement | null;
      if (!wordEl) return;

      const containerRect = container.getBoundingClientRect();
      const wordRect = wordEl.getBoundingClientRect();

      // Only scroll if the word is not comfortably visible within middle 70% of viewport
      const isComfortablyVisible =
        wordRect.top >= containerRect.top + 30 &&
        wordRect.bottom <= containerRect.bottom - 30;

      if (!isComfortablyVisible) {
        isProgrammaticScrollRef.current = true;
        const currentScrollTop = container.scrollTop;
        const wordRelativeTop = wordRect.top - containerRect.top + currentScrollTop;
        const targetScrollTop = Math.max(
          0,
          wordRelativeTop - container.clientHeight / 2 + wordEl.clientHeight / 2
        );

        container.scrollTo({
          top: targetScrollTop,
          behavior: "smooth",
        });

        setTimeout(() => {
          isProgrammaticScrollRef.current = false;
        }, 350);
      }
    };

    scrollContainerToWord(teacherScrollRef.current);
    scrollContainerToWord(studentScrollRef.current);
    scrollContainerToWord(dualScrollRef.current);
  }, [highlightedIndex]);

  // Reset scroll containers to top whenever active lesson changes
  useEffect(() => {
    if (teacherScrollRef.current) teacherScrollRef.current.scrollTop = 0;
    if (studentScrollRef.current) studentScrollRef.current.scrollTop = 0;
    if (dualScrollRef.current) dualScrollRef.current.scrollTop = 0;
  }, [activeLessonId]);

  // Unlock AudioContext on initial user gesture in browser
  useEffect(() => {
    const unlockAudio = () => {
      if (audioContextRef.current && audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume().catch(() => {});
      }
    };
    window.addEventListener("click", unlockAudio, { once: true });
    window.addEventListener("touchstart", unlockAudio, { once: true });
    return () => {
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
    };
  }, []);
  // Real-time microphone audio visualizer and recitation cadence follower
  useEffect(() => {
    const stream = activeMediaStream || streamRef.current;
    if (stream && isEffectiveMicOn) {
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        if (AudioCtx) {
          const audioCtx = new AudioCtx();
          audioContextRef.current = audioCtx;
          if (audioCtx.state === "suspended") {
            audioCtx.resume().catch(() => {});
          }
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          analyser.smoothingTimeConstant = 0.3;
          analyserRef.current = analyser;
          const source = audioCtx.createMediaStreamSource(stream);
          source.connect(analyser);
          const dataArray = new Uint8Array(analyser.frequencyBinCount);

          const checkSpeaking = () => {
            if (!isEffectiveMicOn) {
              setIsSpeaking(false);
              return;
            }
            analyser.getByteFrequencyData(dataArray);

            // Speech band focus: human vocal fundamentals & formants (bins 1 to 24)
            const speechBins = Math.min(24, dataArray.length);
            let speechSum = 0;
            let peak = 0;
            for (let i = 1; i < speechBins; i++) {
              const val = dataArray[i] ?? 0;
              speechSum += val;
              if (val > peak) peak = val;
            }
            const speechAvg = speechSum / Math.max(1, speechBins - 1);
            setIsSpeaking(speechAvg > 6 || peak > 20);

            animFrameRef.current = requestAnimationFrame(checkSpeaking);
          };
          checkSpeaking();
        }
      } catch (err) {
        console.warn("[LiveClassroom] Audio visualizer error:", err);
      }
    } else {
      setIsSpeaking(false);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    }

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        try {
          audioContextRef.current.close();
        } catch {}
      }
    };
  }, [isEffectiveMicOn, activeMediaStream]);

  // Keep participant presence media updated
  useEffect(() => {
    updateParticipantMedia(isEffectiveMicOn, isCameraOn, isSpeaking);
  }, [isEffectiveMicOn, isCameraOn, isSpeaking, updateParticipantMedia]);

  // Handle remote mute track disabling
  useEffect(() => {
    if (remoteMuted && streamRef.current) {
      streamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = false;
      });
    }
  }, [remoteMuted]);

  // Keyboard navigation shortcuts (Arrow keys)
  const handleNextWord = useCallback(() => {
    const next =
      highlightedIndex === null
        ? 0
        : Math.min(highlightedIndex + 1, currentWordStrings.length - 1);
    sendHighlight(next);
  }, [highlightedIndex, currentWordStrings.length, sendHighlight]);

  const handlePrevWord = useCallback(() => {
    const prev = highlightedIndex === null ? 0 : Math.max(highlightedIndex - 1, 0);
    sendHighlight(prev);
  }, [highlightedIndex, sendHighlight]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        handleNextWord();
      } else if (e.key === "ArrowLeft") {
        handlePrevWord();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNextWord, handlePrevWord]);

  // Device calibration confirmation
  const handleDeviceCheckComplete = async (settings: {
    isMicOn: boolean;
    isCameraOn: boolean;
    audioInputId: string;
    videoInputId: string;
  }) => {
    setShowDeviceCheck(false);
    setIsMicOn(settings.isMicOn);
    setIsCameraOn(settings.isCameraOn);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: settings.isCameraOn
          ? {
              deviceId: settings.videoInputId ? { ideal: settings.videoInputId } : undefined,
              width: { ideal: 1280 },
              height: { ideal: 720 },
              facingMode: "user",
            }
          : false,
        audio: settings.isMicOn
          ? {
              deviceId: settings.audioInputId ? { ideal: settings.audioInputId } : undefined,
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            }
          : false,
      });

      streamRef.current = stream;
      setActiveMediaStream(stream);
      if (videoRef.current && settings.isCameraOn) {
        videoRef.current.srcObject = stream;
      }
      toast.success(
        roleParam === "observer"
          ? `Joined as Parent Observer (Muted) for ${childParam}`
          : `Joined classroom as ${childParam}`
      );
    } catch {
      toast("Joined room in web audio preview mode");
    }
  };

  const handleCancelDeviceCheck = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (isDemo) {
      router.push("/");
    } else if (roleParam === "teacher") {
      router.push("/teacher");
    } else if (roleParam === "observer") {
      router.push("/parent");
    } else {
      router.push("/student");
    }
  };

  // Camera stream toggle
  const toggleCamera = async () => {
    if (isCameraOn) {
      if (streamRef.current) {
        streamRef.current.getVideoTracks().forEach((track) => track.stop());
      }
      setIsCameraOn(false);
      toast("Camera Stopped");
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraOn(true);
        toast.success("Camera Connected");
      } catch (err) {
        console.error("Camera access denied:", err);
        toast.error("Could not access camera");
      }
    }
  };

  // Microphone toggle
  const toggleMic = () => {
    if (roleParam === "observer") {
      toast("Parent observers remain muted to prevent recitation interference", {
        icon: "🔇",
      });
      return;
    }

    if (!hostPermissions.micAllowed && roleParam !== "teacher") {
      toast.error("Microphones are currently muted by the teacher");
      return;
    }

    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !isMicOn;
      });
    } else if (!isMicOn && typeof navigator !== "undefined" && navigator.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        })
        .then((stream) => {
          streamRef.current = stream;
          setActiveMediaStream(stream);
        })
        .catch(() => {});
    }
    setIsMicOn(!isMicOn);
    if (remoteMuted) setRemoteMuted(false);
    toast(isMicOn ? "Microphone Muted" : "Microphone Active", {
      icon: isMicOn ? "🔇" : "🎙️",
    });
  };

  // Drawer tab toggle
  const handleToggleDrawerTab = (tab: "info" | "people" | "chat" | "host") => {
    setActiveDrawerTab((prev) => (prev === tab ? null : tab));
  };

  // Word click handler
  const handleWordClick = (index: number) => {
    sendHighlight(index);
  };

  // Split word
  const handleSplitWord = () => {
    if (highlightedIndex === null) return;
    const nextIndex = splitIndex === highlightedIndex ? null : highlightedIndex;
    sendSplit(nextIndex);
  };

  // Clear all annotations
  const clearAll = () => {
    sendToolSync({ underlines: {}, circles: {}, colorHighlights: {} });
    sendHighlight(null);
    sendSplit(null);
    sendLaserPointer({ x: 0, y: 0, active: false });
    setIsLaserModeActive(false);
    toast("Whiteboard annotations cleared", { icon: "🧹" });
  };

  // Toggle bandwidth mode
  const toggleBandwidthMode = () => {
    const nextMode = bandwidthMode === "auto" ? "audio_only" : "auto";
    setBandwidthMode(nextMode);
    sendToolSync({ bandwidthMode: nextMode });
    if (nextMode === "audio_only") {
      toast("Audio-Only Mode Active (Saving Data)", { icon: "⚡" });
    } else {
      toast.success("Adaptive HD Video Mode Restored");
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#111215] text-white overflow-hidden relative select-none">
      {/* 1. Google Meet Floating Reactions Animation Layer */}
      <FloatingReactions reactions={reactions} />

      {/* Network Drop / Reconnection Banner */}
      {connectionStatus === "reconnecting" && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-emerald-950 px-4 py-1.5 rounded-full font-bold text-xs sm:text-sm flex items-center gap-2 shadow-2xl border border-amber-300 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-emerald-950 animate-ping" />
          <span>Connection fluctuating — Reconnecting...</span>
        </div>
      )}

      {/* 2. Pre-Call Hardware Diagnostic Modal */}
      <DeviceCheckModal
        isOpen={showDeviceCheck}
        role={roleParam}
        participantName={childParam}
        onJoin={handleDeviceCheckComplete}
        onCancel={handleCancelDeviceCheck}
      />

      {/* 3. Floating Video Bubble (PiP) when in Whiteboard Mode */}
      {viewMode === "whiteboard" && (
        <ClassroomVideoBubble
          isCameraOn={isCameraOn}
          videoRef={videoRef}
          label={childParam}
          isMuted={!isEffectiveMicOn}
          isAudioOnly={bandwidthMode === "audio_only"}
          role={roleParam}
          position="bottom-right"
        />
      )}

      {/* 4. Classroom Header */}
      <ClassroomHeader
        surahName={currentLesson.title}
        script={script}
        tajweedMode={tajweedMode}
        classId={classCode}
        activeLessonId={activeLessonId}
        lessons={CURRICULUM_LESSONS}
        livekitStatus={livekitStatus}
        connectionStatus={connectionStatus}
        isVoiceFollowOn={isVoiceFollowOn}
        activeSpeechEngine={activeSpeechEngine}
        isTeacher={roleParam === "teacher"}
        role={roleParam}
        participantName={childParam}
        onScriptChange={(s) => {
          setScript(s);
          sendToolSync({ script: s });
        }}
        onTajweedChange={(m) => {
          setTajweedMode(m);
          sendToolSync({ tajweedMode: m });
        }}
        onLessonChange={sendLessonChange}
        onToggleVoiceFollow={toggleVoiceFollow}
        onEndClass={() => setShowEndModal(true)}
      />

      {/* 5. Main Viewport Stage (Adaptive Grid / Whiteboard / Dual View) */}
      <div className="flex-1 flex overflow-hidden relative">
        <main
          className={`flex-1 flex p-2 md:p-5 gap-4 min-h-0 overflow-y-auto lg:overflow-hidden bg-gradient-to-b from-[#031d16] to-[#01140e] ${
            activeDrawerTab ? "mr-0 sm:mr-96 transition-all duration-200" : ""
          }`}
        >
          {/* End Class Confirmation Dialog */}
          {showEndModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in zoom-in-95">
              <div className="bg-[#202124] border border-white/20 rounded-3xl w-full max-w-sm p-6 shadow-2xl text-white">
                <h2 className="text-xl font-bold font-serif text-white mb-2">
                  {isDemo ? "Exit Demo Classroom?" : "Leave Classroom?"}
                </h2>
                <p className="text-white/70 mb-6 text-xs leading-relaxed">
                  {isDemo
                    ? "Are you sure you want to exit the interactive demo? You will be returned to the academy home page."
                    : roleParam === "teacher"
                    ? "Ending this session will conclude live video for all participants and log lesson records in the academy ledger."
                    : "Are you sure you want to exit the classroom? You can re-join anytime while the lesson is active."}
                </p>
                <div className="flex flex-col gap-2.5">
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowEndModal(false)}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl font-bold text-xs transition cursor-pointer"
                    >
                      Stay in Class
                    </button>
                    <button
                      onClick={() => {
                        if (streamRef.current) {
                          streamRef.current.getTracks().forEach((t) => t.stop());
                          streamRef.current = null;
                        }
                        if (isDemo) {
                          router.push("/");
                        } else if (roleParam === "teacher") {
                          sendModeration("end_class_all");
                          router.push("/teacher");
                        } else if (roleParam === "observer") {
                          router.push("/parent");
                        } else {
                          router.push("/student");
                        }
                      }}
                      className="flex-1 bg-[#ea4335] hover:bg-[#d93025] text-white py-2.5 rounded-xl font-bold text-xs transition shadow-md cursor-pointer"
                    >
                      {isDemo ? "Exit to Home" : "Confirm Exit"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW MODE A: GOOGLE MEET FULL VIDEO GRID */}
          {viewMode === "grid" && (
            <div className="w-full h-full flex flex-col min-h-0">
              <GoogleMeetVideoGrid
                participants={participants}
                localStream={streamRef.current}
                localUserId={localUserId}
                isLocalMicOn={isEffectiveMicOn}
                isLocalCameraOn={isCameraOn}
                isLocalSpeaking={isSpeaking}
                onSwitchToWhiteboard={() => setViewMode("whiteboard")}
              />
            </div>
          )}

          {/* VIEW MODE B: DUAL VIEW (Mushaf Whiteboard on left, Video Grid on right) */}
          {viewMode === "dual" && (
            <div className="w-full h-full flex flex-col lg:flex-row gap-4 min-h-0">
              {/* Whiteboard Side */}
              <div className="w-full lg:w-3/5 flex flex-col h-full min-h-0 glass-container rounded-3xl p-4 border border-white/15 overflow-hidden">
                <div className="flex items-center justify-between mb-2 shrink-0">
                  <span className="text-xs font-bold text-amber-300 tracking-wider uppercase">
                    Interactive Whiteboard
                  </span>
                  <button
                    onClick={() => setViewMode("whiteboard")}
                    className="text-[11px] text-emerald-200 hover:text-white underline"
                  >
                    Maximize Whiteboard
                  </button>
                </div>
                <div ref={dualScrollRef} className="flex-1 min-h-0 overflow-y-auto flex flex-col items-center justify-start py-2">
                  <MushafBoard
                    script={script}
                    tajweedMode={tajweedMode}
                    fontSize={fontSize}
                    fontColor={fontColor}
                    highlightedIndex={highlightedIndex}
                    underlines={underlines}
                    circles={circles}
                    colorHighlights={colorHighlights}
                    wordsList={currentWordsList}
                    laserPointer={laserPointer}
                    interactive={roleParam === "teacher" || isStudentUnlocked}
                    onWordClick={handleWordClick}
                    idPrefix="dual"
                  />
                  <LetterPracticeTray wordIndex={splitIndex} words={currentWordStrings} />
                </div>
              </div>

              {/* Meet Video Grid Side */}
              <div className="w-full lg:w-2/5 flex flex-col h-full min-h-0">
                <GoogleMeetVideoGrid
                  participants={participants}
                  localStream={streamRef.current}
                  localUserId={localUserId}
                  isLocalMicOn={isEffectiveMicOn}
                  isLocalCameraOn={isCameraOn}
                  isLocalSpeaking={isSpeaking}
                  onSwitchToWhiteboard={() => setViewMode("whiteboard")}
                  compact={true}
                />
              </div>
            </div>
          )}

          {/* VIEW MODE C: INTERACTIVE QURAN WHITEBOARD (Teacher & Student Panes) */}
          {viewMode === "whiteboard" && (
            <div className="w-full h-full flex flex-col lg:flex-row gap-4 md:gap-6 min-h-0">
              {/* LEFT PANE: TEACHER CONTROL VIEW */}
              <div className="w-full lg:w-1/2 flex flex-col h-[500px] lg:h-full shrink-0 lg:shrink">
                <div className="flex items-center justify-between mb-2 shrink-0 px-2">
                  <span className="text-xs font-bold text-amber-300 tracking-widest uppercase flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                    Teacher Interactive Whiteboard
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-emerald-100/70 font-mono hidden sm:inline">Ayah:</span>
                    <span className="text-amber-300 text-[11px] font-bold bg-black/50 border border-amber-400/30 rounded-lg px-2.5 py-1 max-w-[220px] sm:max-w-[280px] truncate shadow-xs">
                      {currentLesson.title}
                    </span>
                  </div>
                </div>

                <div className="flex-1 glass-container rounded-3xl border border-white/15 shadow-2xl flex flex-col p-4 md:p-6 overflow-hidden relative">
                  <div className="text-xs text-emerald-100/80 mb-3 shrink-0 flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="font-serif italic text-amber-200/90 truncate max-w-[80%]">
                      &ldquo;{currentLesson.translation}&rdquo;
                    </span>
                    {tajweedMode && (
                      <span className="text-[10px] bg-emerald-900/80 text-emerald-300 border border-emerald-500/30 font-bold px-2.5 py-0.5 rounded-full uppercase">
                        Tajweed ON
                      </span>
                    )}
                  </div>

                  {/* Central Mushaf Board */}
                  <div ref={teacherScrollRef} onScroll={handleTeacherScroll} className="flex-1 min-h-0 w-full overflow-y-auto flex flex-col items-center justify-start py-2">
                    <div className="my-auto w-full flex flex-col items-center">
                      <MushafBoard
                        script={script}
                        tajweedMode={tajweedMode}
                        fontSize={fontSize}
                        fontColor={fontColor}
                        highlightedIndex={highlightedIndex}
                        underlines={underlines}
                        circles={circles}
                        colorHighlights={colorHighlights}
                        wordsList={currentWordsList}
                        laserPointer={laserPointer}
                        isLaserModeActive={isLaserModeActive}
                        interactive={true}
                        onWordClick={handleWordClick}
                        onLaserMove={sendLaserPointer}
                        idPrefix="teacher"
                      />

                      <LetterPracticeTray wordIndex={splitIndex} words={currentWordStrings} />
                    </div>
                  </div>

                  {/* Real-Time AI Recitation & Voice Follow Telemetry */}
                  <div className="w-full shrink-0 my-1.5 hidden md:block z-10">
                    <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`flex items-end h-3.5 gap-0.5 ${isVoiceFollowOn ? "opacity-100" : "opacity-30"}`}>
                          {[3, 6, 4, 8, 12, 10, 7, 4, 8, 12, 6, 3].map((h, i) => (
                            <div
                              key={i}
                              className={`w-1 rounded-full transition-all ${
                                isVoiceFollowOn
                                  ? isVoiceFollowActive || isSpeaking
                                    ? "bg-emerald-400 animate-pulse scale-110"
                                    : "bg-amber-400/80 animate-pulse"
                                  : "bg-white/30"
                              }`}
                              style={{ height: `${h * 0.8}px`, animationDelay: `${i * 0.07}s` }}
                            />
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={toggleVoiceFollow}
                          className="text-amber-300 hover:text-amber-200 font-bold text-xs truncate cursor-pointer transition text-left flex items-center gap-1.5"
                          title="Click to toggle AI Voice Follow"
                        >
                          <span>
                            {isVoiceFollowOn
                              ? `AI Listening (${activeSpeechEngine || "Deepgram Nova-3 + VAD"})`
                              : "AI Voice Follow Paused • Click to Start"}
                          </span>

                        </button>
                      </div>

                      {lastSpokenText && (
                        <div
                          className="text-xs text-white font-medium bg-emerald-950/90 border border-emerald-500/30 px-2.5 py-0.5 rounded-full truncate max-w-[160px]"
                          dir="rtl"
                        >
                          &quot;{lastSpokenText}&quot;
                        </div>
                      )}

                      {/* Manual Prev / Next Word Shortcuts */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={handlePrevWord}
                          className="text-[10px] font-bold bg-white/10 hover:bg-white/20 text-emerald-100 px-2 py-0.5 rounded-md transition cursor-pointer"
                        >
                          ← Prev
                        </button>
                        <span className="text-[10px] text-amber-300 font-mono">
                          {(highlightedIndex ?? 0) + 1}/{currentWordStrings.length}
                        </span>
                        <button
                          onClick={handleNextWord}
                          className="text-[10px] font-bold bg-amber-400 hover:bg-amber-300 text-emerald-950 px-2 py-0.5 rounded-md transition cursor-pointer font-bold"
                        >
                          Next →
                        </button>
                      </div>
                    </div>

                    {voiceError && (
                      <div className="mt-1 text-[10px] text-red-300 font-medium bg-red-950/80 border border-red-500/40 px-2 py-0.5 rounded-lg text-center">
                        ⚠️ {voiceError}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT PANE: STUDENT FOLLOWER VIEW */}
              <div className="w-full lg:w-1/2 flex flex-col h-[420px] lg:h-full shrink-0 lg:shrink">
                <div className="flex items-center justify-between mb-2 shrink-0 px-2">
                  <span className="text-xs font-bold text-emerald-200/80 tracking-widest uppercase flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                    Student Synced Viewport
                  </span>
                  <span className="text-xs text-emerald-100/60 font-mono">
                    Script: <strong className="text-amber-300 uppercase">{script}</strong>
                  </span>
                </div>

                <div className="flex-1 glass-container rounded-3xl border border-white/15 shadow-2xl flex flex-col p-4 md:p-6 overflow-hidden relative">
                  <div className="text-xs text-emerald-100/80 mb-3 shrink-0 flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-xs font-semibold text-emerald-300">
                      {isStudentUnlocked ? "Student Mode: Autonomous" : "Following Teacher Live"}
                    </span>
                    <span className="text-[10px] font-mono text-amber-300 bg-black/40 px-2 py-0.5 rounded-full border border-white/10">
                      Live Class
                    </span>
                  </div>

                  {/* Student Mushaf Board */}
                  <div
                    ref={studentScrollRef}
                    className="flex-1 min-h-0 w-full overflow-y-auto flex flex-col items-center justify-start py-2"
                  >
                    <div className="my-auto w-full flex flex-col items-center">
                      <MushafBoard
                        script={script}
                        tajweedMode={tajweedMode}
                        fontSize={fontSize}
                        fontColor={fontColor}
                        highlightedIndex={highlightedIndex}
                        underlines={underlines}
                        circles={circles}
                        colorHighlights={colorHighlights}
                        wordsList={currentWordsList}
                        laserPointer={laserPointer}
                        interactive={isStudentUnlocked}
                        onWordClick={sendHighlight}
                        idPrefix="student"
                      />

                      <LetterPracticeTray wordIndex={splitIndex} words={currentWordStrings} />
                    </div>
                  </div>

                  {/* Student Bottom Navigation Controls */}
                  <div className="mt-auto pt-3 border-t border-white/10 shrink-0 flex items-center justify-between text-xs">
                    <span className="text-emerald-100/70 hidden sm:inline">
                      Synchronous word highlights • Laser cursor • Tajweed markup
                    </span>

                    <div className="flex items-center gap-3 font-bold">
                      <button
                        onClick={() => {
                          setIsStudentUnlocked(false);
                          toast.success("Following teacher sync restored");
                        }}
                        className={`hover:text-amber-300 transition ${
                          !isStudentUnlocked ? "text-amber-300 underline font-bold" : "text-emerald-100/60"
                        }`}
                      >
                        Follow Teacher
                      </button>
                      <span className="text-white/20">|</span>
                      <button
                        onClick={() => {
                          setIsStudentUnlocked(true);
                          toast("Student Viewport Unlocked for Autonomous Practice", { icon: "🔓" });
                        }}
                        className={`hover:text-amber-300 transition ${
                          isStudentUnlocked ? "text-amber-300 underline font-bold" : "text-emerald-100/60"
                        }`}
                      >
                        Unlock Practice
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* 6. Google Meet Side Drawer (Chat, People, Details, Host Management) */}
        <GoogleMeetSideDrawer
          activeTab={activeDrawerTab}
          onClose={() => setActiveDrawerTab(null)}
          role={roleParam}
          currentUserName={childParam}
          classCode={classCode}
          chatMessages={chatMessages}
          participants={participants}
          hostPermissions={hostPermissions}
          handRaises={handRaises}
          onSendChatMessage={sendChatMessage}
          onUpdateHostPermissions={updateHostPermissions}
          onMuteAll={muteAllParticipants}
          onLowerHand={lowerHand}
          onLowerAllHands={lowerAllHands}
          onEndCallAll={() => setShowEndModal(true)}
        />
      </div>

      {/* 7. Google Meet Signature Bottom Control Dock */}
      <GoogleMeetBottomDock
        classCode={classCode}
        role={roleParam}
        isMicOn={isEffectiveMicOn}
        isCameraOn={isCameraOn}
        isHandRaised={isHandRaised}
        isSpeaking={isSpeaking}
        viewMode={viewMode}
        participantCount={participants.length}
        unreadChatCount={unreadChatCount}
        activeDrawerTab={activeDrawerTab}
        bandwidthMode={bandwidthMode}
        isLaserActive={isLaserModeActive}
        onToggleMic={toggleMic}
        onToggleCamera={toggleCamera}
        onToggleHandRaise={toggleHandRaise}
        onSendReaction={sendReaction}
        onChangeViewMode={setViewMode}
        onToggleDrawerTab={handleToggleDrawerTab}
        onToggleBandwidth={toggleBandwidthMode}
        onToggleLaser={() => {
          const next = !isLaserModeActive;
          setIsLaserModeActive(next);
          if (next) {
            sendLaserPointer({ x: 50, y: 50, active: true });
          } else {
            sendLaserPointer({ x: 0, y: 0, active: false });
          }
        }}
        onClearAnnotations={clearAll}
        onEndCall={() => setShowEndModal(true)}
      />
    </div>
  );
}
