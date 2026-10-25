"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  ClassroomHeader,
  ClassroomVideoBubble,
  LetterPracticeTray,
  MushafBoard,
  ClassroomToolbar,
  DeviceCheckModal,
  useClassroomSync,
  useVoiceFollow,
  CURRICULUM_LESSONS
} from "@/features/classroom";

export default function LiveClassroom() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const classId = (params?.id as string) || "demo";
  const queryRole = searchParams?.get("role") as "teacher" | "student" | "observer" | null;
  const [sessionRole, setSessionRole] = useState<"teacher" | "student" | "observer">("teacher");
  const [sessionUser, setSessionUser] = useState<string>("");

  useEffect(() => {
    if (typeof document !== "undefined") {
      const matchRole = document.cookie.match(/demo_role=([^;]+)/);
      if (matchRole?.[1]) {
        const r = matchRole[1];
        if (r === "student") setSessionRole("student");
        else if (r === "parent") setSessionRole("observer");
        else setSessionRole("teacher");
      }
      const matchUser = document.cookie.match(/demo_user=([^;]+)/);
      if (matchUser?.[1]) {
        setSessionUser(decodeURIComponent(matchUser[1]));
      }
    }
  }, []);

  const roleParam: "teacher" | "student" | "observer" = queryRole || sessionRole;
  const childParam =
    searchParams?.get("child") ||
    sessionUser ||
    (roleParam === "student" ? "Yusuf Khan" : "Ustadha Maryam");

  // Pre-call Hardware Diagnostic Modal State
  const [showDeviceCheck, setShowDeviceCheck] = useState<boolean>(true);

  // Synchronization hook (WebSocket, BroadcastChannel, LiveKit Cloud pairing)
  const {
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
    sendHighlight,
    sendSplit,
    sendLessonChange,
    sendLaserPointer,
    sendToolSync,
    sendModeration
  } = useClassroomSync({
    classId,
    initialLessonId: "fatihah-2",
    role: roleParam
  });

  // Current Lesson Data
  const currentLesson = useMemo(() => {
    return (
      CURRICULUM_LESSONS.find((l) => l.id === activeLessonId) ||
      CURRICULUM_LESSONS[0]!
    );
  }, [activeLessonId]);

  const currentWordsList = script === "indopak" ? currentLesson.wordsIndoPak : currentLesson.wordsUthmani;
  const currentWordStrings = currentWordsList.map((item) => item.word);

  // Ultra-low latency voice follow hook
  const {
    isVoiceFollowOn,
    activeSpeechEngine,
    lastSpokenText,
    voiceError,
    toggleVoiceFollow
  } = useVoiceFollow({
    currentWords: currentWordStrings,
    onMatchWord: sendHighlight
  });

  // Local media & tool states
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isLaserModeActive, setIsLaserModeActive] = useState(false);
  const [isStudentUnlocked, setIsStudentUnlocked] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Derived effective mic state (muted if user turned it off or remote-muted by teacher)
  const isEffectiveMicOn = isMicOn && !remoteMuted;

  // Handle remote mute track disabling without triggering cascading re-renders
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
      if (videoRef.current && settings.isCameraOn) {
        videoRef.current.srcObject = stream;
      }
      toast.success(`Joined classroom as ${childParam}`);
    } catch {
      toast("Joined room in web audio preview mode");
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
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !isMicOn;
      });
    }
    setIsMicOn(!isMicOn);
    toast(isMicOn ? "Microphone Muted" : "Microphone Active", { icon: isMicOn ? "🔇" : "🎙️" });
  };

  // Word click handler (highlights word for focus practice)
  const handleWordClick = (index: number) => {
    sendHighlight(index);
  };

  // Split word into component phonemes
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
      toast("Audio-Only Low Bandwidth Mode Active (Saving Data)", { icon: "⚡" });
    } else {
      toast.success("Adaptive HD Video Mode Restored");
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#031d16] text-white overflow-hidden relative select-none">
      {/* Network Drop / Reconnection Banner */}
      {connectionStatus === "reconnecting" && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-emerald-950 px-4 py-1.5 rounded-full font-bold text-xs sm:text-sm flex items-center gap-2 shadow-2xl border border-amber-300 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-emerald-950 animate-ping" />
          <span>Connection fluctuating — Re-establishing classroom sync...</span>
        </div>
      )}

      {/* 1. Pre-Call Hardware Diagnostic Modal */}
      <DeviceCheckModal
        isOpen={showDeviceCheck}
        role={roleParam}
        participantName={childParam}
        onJoin={handleDeviceCheckComplete}
      />

      {/* 2. Floating Video Bubble (PiP) */}
      <ClassroomVideoBubble
        isCameraOn={isCameraOn}
        videoRef={videoRef}
        label={childParam}
        isMuted={!isEffectiveMicOn}
        isAudioOnly={bandwidthMode === "audio_only"}
        role={roleParam}
        position="bottom-right"
      />

      {/* 3. Classroom Header */}
      <ClassroomHeader
        surahName={currentLesson.title}
        script={script}
        tajweedMode={tajweedMode}
        classId={classId}
        activeLessonId={activeLessonId}
        lessons={CURRICULUM_LESSONS}
        livekitStatus={livekitStatus}
        connectionStatus={connectionStatus}
        isVoiceFollowOn={isVoiceFollowOn}
        activeSpeechEngine={activeSpeechEngine}
        isTeacher={roleParam === "teacher"}
        role={roleParam}
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

      {/* 4. Main Dual-Viewport Classroom Stage */}
      <main className="flex-1 flex flex-col lg:flex-row p-2 md:p-6 gap-4 md:gap-6 min-h-0 overflow-y-auto lg:overflow-hidden bg-gradient-to-b from-[#031d16] to-[#01140e]">
        {/* End Class Confirmation Dialog */}
        {showEndModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in zoom-in-95">
            <div className="bg-[#052b20] border border-white/20 rounded-3xl w-full max-w-sm p-6 shadow-2xl text-white">
              <h2 className="text-xl font-bold font-serif text-white mb-2">Leave Classroom?</h2>
              <p className="text-emerald-100/75 mb-6 text-xs leading-relaxed">
                {roleParam === "teacher"
                  ? "Ending this session will conclude live video for all participants and log lesson records in the academy ledger."
                  : "Are you sure you want to exit the classroom? You can re-join anytime while the lesson is active."}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowEndModal(false)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl font-bold text-xs transition"
                >
                  Stay in Class
                </button>
                <button
                  onClick={() => {
                    if (streamRef.current) {
                      streamRef.current.getTracks().forEach((t) => t.stop());
                    }
                    if (roleParam === "teacher") {
                      sendModeration("end_class_all");
                      router.push("/teacher");
                    } else if (roleParam === "observer") {
                      router.push("/parent");
                    } else {
                      router.push("/student");
                    }
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-xl font-bold text-xs transition shadow-md"
                >
                  Confirm Exit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LEFT PANE: TEACHER CONTROL VIEW */}
        <div className="w-full lg:w-1/2 flex flex-col h-[520px] lg:h-full shrink-0 lg:shrink">
          <div className="flex items-center justify-between mb-2 shrink-0 px-2">
            <span className="text-xs font-bold text-amber-300 tracking-widest uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
              Teacher Interactive Whiteboard
            </span>
            <span className="text-xs text-emerald-100/60 font-mono">
              Lesson: <strong className="text-white uppercase">{currentLesson.title}</strong>
            </span>
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
            <div className="flex-1 min-h-0 w-full overflow-y-auto flex flex-col items-center justify-start py-2">
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
                />

                {/* Letter Splitting Tray */}
                <LetterPracticeTray wordIndex={splitIndex} words={currentWordStrings} />
              </div>
            </div>

            {/* Real-Time AI Recitation & Voice Follow Telemetry (Docked Above Toolbar) */}
            <div className="w-full shrink-0 my-1.5 hidden md:block z-10">
              <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`flex items-end h-3.5 gap-0.5 ${isVoiceFollowOn ? "opacity-100" : "opacity-30"}`}>
                    {[3, 6, 4, 8, 12, 10, 7, 4, 8, 12, 6, 3].map((h, i) => (
                      <div
                        key={i}
                        className={`w-1 rounded-full ${
                          isVoiceFollowOn ? "bg-amber-400 animate-pulse" : "bg-white/30"
                        }`}
                        style={{ height: `${h * 0.8}px`, animationDelay: `${i * 0.07}s` }}
                      />
                    ))}
                  </div>
                  <span className="text-amber-300 font-bold text-xs truncate">
                    {isVoiceFollowOn ? "AI Listening (Arabic Only)" : "AI Voice Follow Paused"}
                  </span>
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

            {/* Comprehensive Toolbar */}
            <ClassroomToolbar
              isMicOn={isEffectiveMicOn}
              onToggleMic={toggleMic}
              isCameraOn={isCameraOn}
              onToggleCamera={toggleCamera}
              fontSize={fontSize}
              fontColor={fontColor}
              onFontSizeChange={(size) => sendToolSync({ fontSize: size })}
              onFontColorChange={(color) => sendToolSync({ fontColor: color })}
              onToggleUnderline={() => {
                if (highlightedIndex === null) return;
                const nextUnderlines = { ...underlines, [highlightedIndex]: !underlines[highlightedIndex] };
                sendToolSync({ underlines: nextUnderlines });
              }}
              onToggleCircle={() => {
                if (highlightedIndex === null) return;
                const nextCircles = { ...circles, [highlightedIndex]: !circles[highlightedIndex] };
                sendToolSync({ circles: nextCircles });
              }}
              isSplitActive={splitIndex !== null}
              onSplitWord={handleSplitWord}
              onClearAll={clearAll}
              isLaserModeActive={isLaserModeActive}
              onToggleLaserMode={() => {
                const next = !isLaserModeActive;
                setIsLaserModeActive(next);
                if (!next) sendLaserPointer({ x: 0, y: 0, active: false });
                toast(next ? "Laser Pointer Active (Tracks to Student)" : "Laser Pointer Off", {
                  icon: next ? "🔴" : "⚪"
                });
              }}
              isTeacher={roleParam === "teacher"}
              onRemoteMuteStudent={() => sendModeration("mute_student")}
              bandwidthMode={bandwidthMode}
              onToggleBandwidthMode={toggleBandwidthMode}
            />
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
                {isStudentUnlocked ? "Student Mode: Autonomous" : "Following Teacher Live (<50ms Sync)"}
              </span>
              <span className="text-[10px] font-mono text-amber-300 bg-black/40 px-2 py-0.5 rounded-full border border-white/10">
                {livekitStatus?.mode === "live" ? "LiveKit WebRTC" : "WebRTC Direct"}
              </span>
            </div>

            {/* Student Mushaf Board */}
            <div
              className={`flex-1 min-h-0 w-full overflow-y-auto flex flex-col items-center justify-start py-2 ${
                !isStudentUnlocked ? "pointer-events-none" : ""
              }`}
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
      </main>
    </div>
  );
}
