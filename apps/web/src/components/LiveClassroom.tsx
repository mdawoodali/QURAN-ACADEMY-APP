"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  SCRIPT_DATA,
  ScriptType,
  ClassroomHeader,
  ClassroomVideoBubble,
  LetterPracticeTray,
  MushafBoard,
  ClassroomToolbar,
  useClassroomSync,
  useVoiceFollow
} from "@/features/classroom";

export default function LiveClassroom() {
  const params = useParams();
  const router = useRouter();
  const classId = (params?.id as string) || "demo";
  const surahName = "Al-Fatihah";

  // Synchronization hook (WebSocket, BroadcastChannel, shared tools)
  const {
    script,
    tajweedMode,
    highlightedIndex,
    splitIndex,
    fontSize,
    fontColor,
    underlines,
    circles,
    livekitStatus,
    sendHighlight,
    sendSplit,
    sendToolSync
  } = useClassroomSync({ classId });

  const currentWords = SCRIPT_DATA[script].map((item) => item.word);

  // Ultra-low latency voice follow hook
  const {
    isVoiceFollowOn,
    activeSpeechEngine,
    lastSpokenText,
    voiceError,
    toggleVoiceFollow
  } = useVoiceFollow({
    currentWords,
    onMatchWord: sendHighlight
  });

  // Local media & view states
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Keyboard navigation shortcuts
  const handleNextWord = useCallback(() => {
    const next = highlightedIndex === null ? 0 : Math.min(highlightedIndex + 1, currentWords.length - 1);
    sendHighlight(next);
  }, [highlightedIndex, currentWords.length, sendHighlight]);

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

  // Camera stream management
  const toggleCamera = async () => {
    if (isCameraOn) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setIsCameraOn(false);
      toast("Camera stopped");
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraOn(true);
        toast.success("Camera connected");
      } catch (err) {
        console.error("Camera access denied:", err);
        toast.error("Could not access camera. Please allow camera permissions.");
      }
    }
  };

  // Tool actions
  const handleScriptChange = (newScript: ScriptType) => {
    sendToolSync({ script: newScript });
    toast.success(
      `Classroom Script switched to ${newScript === "uthmani" ? "Uthmani (Madani)" : "IndoPak (Subcontinent)"}`
    );
  };

  const handleTajweedChange = (enabled: boolean) => {
    sendToolSync({ tajweedMode: enabled });
    toast(enabled ? "Tajweed Color Coding ON" : "Tajweed Colors OFF (Plain)");
  };

  const toggleUnderline = () => {
    if (highlightedIndex === null) return;
    const nextUnderlines = { ...underlines, [highlightedIndex]: !underlines[highlightedIndex] };
    sendToolSync({ underlines: nextUnderlines });
  };

  const toggleCircle = () => {
    if (highlightedIndex === null) return;
    const nextCircles = { ...circles, [highlightedIndex]: !circles[highlightedIndex] };
    sendToolSync({ circles: nextCircles });
  };

  const handleSplitWord = () => {
    if (highlightedIndex === null) return;
    const nextIndex = splitIndex === highlightedIndex ? null : highlightedIndex;
    sendSplit(nextIndex);
  };

  const clearAll = () => {
    sendToolSync({ underlines: {}, circles: {} });
    sendHighlight(null);
    sendSplit(null);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white text-[#111827] overflow-hidden relative">
      {/* Floating Video Overlay */}
      <ClassroomVideoBubble isCameraOn={isCameraOn} videoRef={videoRef} label="Teacher" />

      {/* Classroom Header */}
      <ClassroomHeader
        surahName={surahName}
        script={script}
        tajweedMode={tajweedMode}
        classId={classId}
        livekitStatus={livekitStatus}
        isVoiceFollowOn={isVoiceFollowOn}
        activeSpeechEngine={activeSpeechEngine}
        onScriptChange={handleScriptChange}
        onTajweedChange={handleTajweedChange}
        onToggleVoiceFollow={toggleVoiceFollow}
        onEndClass={() => setShowEndModal(true)}
      />

      {/* Main Split Classroom Area */}
      <main className="flex-1 flex flex-col lg:flex-row bg-[#F8F9FA] p-2 md:p-6 gap-4 md:gap-6 min-h-0 overflow-y-auto lg:overflow-hidden">
        {/* End Class Confirmation Dialog */}
        {showEndModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95">
              <h2 className="text-xl font-bold text-gray-900 mb-2">End Class?</h2>
              <p className="text-gray-500 mb-6 text-sm">
                Are you sure you want to end this session? The lesson attendance will be logged automatically.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowEndModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => router.push("/student")}
                  className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition"
                >
                  End Session
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LEFT PANE: TEACHER CONTROL VIEW */}
        <div className="w-full lg:w-1/2 flex flex-col h-[500px] lg:h-full shrink-0 lg:shrink">
          <div className="flex items-center justify-between mb-2 md:mb-3 shrink-0 px-2 md:px-0">
            <span className="text-xs font-bold text-emerald-600 tracking-widest uppercase">
              Teacher Control • Web / Tablet
            </span>
            <span className="text-xs text-gray-400 font-medium">
              Script: <strong className="text-emerald-800 uppercase">{script}</strong>
            </span>
          </div>

          <div className="flex-1 bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col p-4 md:p-6 overflow-hidden relative">
            <div className="text-xs md:text-sm text-gray-500 mb-2 md:mb-4 shrink-0 flex items-center justify-between">
              <span>{surahName} / Ayah 2</span>
              {tajweedMode && (
                <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-2 py-0.5 rounded-full">
                  Tajweed Color-Coding Active
                </span>
              )}
            </div>

            <div className="flex-1 flex flex-col items-center justify-center min-h-0 overflow-y-auto w-full">
              <MushafBoard
                script={script}
                tajweedMode={tajweedMode}
                fontSize={fontSize}
                fontColor={fontColor}
                highlightedIndex={highlightedIndex}
                underlines={underlines}
                circles={circles}
                interactive={true}
                onWordClick={sendHighlight}
              />

              <LetterPracticeTray wordIndex={splitIndex} words={currentWords} />

              <div className="w-full mt-4 max-w-lg mx-auto shrink-0 hidden md:block">
                <p className="text-sm md:text-base text-gray-700 mb-2 text-center">
                  All praise belongs to Allah, Lord of all worlds.
                </p>
                <div className="flex flex-col items-center justify-center gap-1">
                  <div className="flex items-center gap-3">
                    <div className={`flex items-end h-4 gap-1 ${isVoiceFollowOn ? "opacity-100" : "opacity-30"}`}>
                      {[2, 4, 3, 5, 8, 12, 8, 5, 3, 6, 10, 7, 4, 2, 3, 5, 9, 14, 10, 6, 3, 2].map((h, i) => (
                        <div
                          key={i}
                          className={`w-1 rounded-full ${isVoiceFollowOn ? "bg-emerald-600 animate-pulse" : "bg-gray-400"}`}
                          style={{ height: `${h * 1.0}px`, animationDelay: `${i * 0.08}s` }}
                        />
                      ))}
                    </div>
                    <div className="text-[#0C4A3A] font-bold text-[11px] tracking-wide">
                      {isVoiceFollowOn ? "Listening live (Recite into mic)" : "Voice Follow off"}
                    </div>
                  </div>

                  {voiceError && (
                    <div className="text-[11px] text-red-600 font-medium bg-red-50 border border-red-200 px-3 py-1 rounded-xl max-w-md text-center">
                      ⚠️ {voiceError}
                    </div>
                  )}

                  {lastSpokenText && (
                    <div
                      className="text-[11px] text-gray-600 font-medium bg-emerald-50 border border-emerald-100 px-3 py-0.5 rounded-full max-w-md truncate"
                      dir="rtl"
                    >
                      مسموع: &quot;{lastSpokenText}&quot;
                    </div>
                  )}

                  {/* Manual Prev/Next Navigation */}
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={handlePrevWord}
                      className="text-[10px] font-bold bg-gray-100 hover:bg-gray-200 text-gray-600 px-2.5 py-1 rounded-md transition"
                    >
                      ← Prev
                    </button>
                    <span className="text-[10px] text-gray-400 font-mono">
                      Word {(highlightedIndex ?? 0) + 1} / {currentWords.length}
                    </span>
                    <button
                      onClick={handleNextWord}
                      className="text-[10px] font-bold bg-emerald-100 hover:bg-emerald-200 text-emerald-900 px-2.5 py-1 rounded-md transition"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Toolbar */}
            <ClassroomToolbar
              isMicOn={isMicOn}
              onToggleMic={() => {
                setIsMicOn(!isMicOn);
                toast(isMicOn ? "Mic Muted" : "Mic Unmuted", { icon: "🎙️" });
              }}
              isCameraOn={isCameraOn}
              onToggleCamera={toggleCamera}
              fontSize={fontSize}
              fontColor={fontColor}
              onFontSizeChange={(size) => sendToolSync({ fontSize: size })}
              onFontColorChange={(color) => sendToolSync({ fontColor: color })}
              onToggleUnderline={toggleUnderline}
              onToggleCircle={toggleCircle}
              isSplitActive={splitIndex !== null}
              onSplitWord={handleSplitWord}
              onClearAll={clearAll}
            />
          </div>
        </div>

        {/* RIGHT PANE: STUDENT FOLLOWER VIEW */}
        <div className="w-full lg:w-1/2 flex flex-col h-[400px] lg:h-full shrink-0 lg:shrink">
          <div className="flex items-center justify-between mb-2 md:mb-3 shrink-0 px-2 md:px-0">
            <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">
              Student View • Phone / Web
            </span>
            <span className="text-xs text-gray-400 font-medium">
              Synced Script: <strong className="text-emerald-700 uppercase">{script}</strong>
            </span>
          </div>

          <div className="flex-1 bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col p-4 md:p-6 overflow-hidden relative opacity-90">
            <div className="text-xs md:text-sm text-gray-500 mb-2 md:mb-4 shrink-0 flex justify-between items-center">
              <span>Following teacher</span>
              {tajweedMode && (
                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  Tajweed Highlights Visible
                </span>
              )}
            </div>

            <div
              className={`flex-1 flex flex-col items-center justify-center min-h-0 overflow-y-auto w-full ${
                !isUnlocked ? "pointer-events-none" : ""
              }`}
            >
              <MushafBoard
                script={script}
                tajweedMode={tajweedMode}
                fontSize={fontSize}
                fontColor={fontColor}
                highlightedIndex={highlightedIndex}
                underlines={underlines}
                circles={circles}
                interactive={isUnlocked}
                onWordClick={sendHighlight}
              />

              <LetterPracticeTray wordIndex={splitIndex} words={currentWords} />
            </div>

            <div className="mt-auto pt-3 border-t border-gray-100 shrink-0">
              <div className="text-xs md:text-sm text-gray-600 mb-2 text-center md:text-left hidden sm:block">
                Same word. Same script. Synchronous classroom highlights.
              </div>
              <div className="flex items-center gap-3 text-xs md:text-sm font-bold text-[#0C4A3A] justify-center md:justify-start">
                <button
                  onClick={() => {
                    setIsUnlocked(false);
                    toast.success("Following teacher sync restored");
                  }}
                  className={`hover:underline ${!isUnlocked ? "text-[#0C4A3A]" : "text-emerald-500"}`}
                >
                  Follow teacher
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={() => {
                    setIsUnlocked(true);
                    toast("Student Viewport Unlocked", { icon: "🔓" });
                  }}
                  className={`${isUnlocked ? "hidden" : "text-emerald-500 cursor-pointer pointer-events-auto hover:underline"}`}
                >
                  Unlock
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
