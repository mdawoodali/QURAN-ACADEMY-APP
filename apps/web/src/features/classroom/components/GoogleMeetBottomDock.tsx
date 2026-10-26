"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Smile,
  Hand,
  LayoutGrid,
  BookOpen,
  Columns2,
  MoreVertical,
  PhoneOff,
  Info,
  Users,
  MessageSquare,
  Shield,
  Sparkles,
  Wifi,
  Crosshair,
  Trash2,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { ClassroomViewMode } from "../types";

interface GoogleMeetBottomDockProps {
  classCode: string;
  role: "teacher" | "student" | "observer";
  isMicOn: boolean;
  isCameraOn: boolean;
  isHandRaised: boolean;
  isSpeaking?: boolean;
  viewMode: ClassroomViewMode;
  participantCount: number;
  unreadChatCount: number;
  activeDrawerTab: "info" | "people" | "chat" | "host" | null;
  bandwidthMode: "auto" | "audio_only";
  isLaserActive?: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onToggleHandRaise: () => void;
  onSendReaction: (emoji: string) => void;
  onChangeViewMode: (mode: ClassroomViewMode) => void;
  onToggleDrawerTab: (tab: "info" | "people" | "chat" | "host") => void;
  onToggleBandwidth: () => void;
  onToggleLaser?: () => void;
  onClearAnnotations?: () => void;
  onEndCall: () => void;
}

const MEET_REACTIONS = [
  { emoji: "💖", label: "Heart" },
  { emoji: "👍", label: "Thumbs Up" },
  { emoji: "👏", label: "Applause" },
  { emoji: "🎉", label: "Celebrate" },
  { emoji: "🤲", label: "Dua" },
  { emoji: "⭐", label: "Star" },
  { emoji: "🔥", label: "Fire" },
  { emoji: "✋", label: "Raise Hand" },
];

export default function GoogleMeetBottomDock({
  classCode,
  role,
  isMicOn,
  isCameraOn,
  isHandRaised,
  isSpeaking = false,
  viewMode,
  participantCount,
  unreadChatCount,
  activeDrawerTab,
  bandwidthMode,
  isLaserActive = false,
  onToggleMic,
  onToggleCamera,
  onToggleHandRaise,
  onSendReaction,
  onChangeViewMode,
  onToggleDrawerTab,
  onToggleBandwidth,
  onToggleLaser,
  onClearAnnotations,
  onEndCall,
}: GoogleMeetBottomDockProps) {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [showReactionPicker, setShowReactionPicker] = useState<boolean>(false);
  const [showMoreMenu, setShowMoreMenu] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const reactionPickerRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000 * 30);
    return () => clearInterval(interval);
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        reactionPickerRef.current &&
        !reactionPickerRef.current.contains(e.target as Node)
      ) {
        setShowReactionPicker(false);
      }
      if (
        moreMenuRef.current &&
        !moreMenuRef.current.contains(e.target as Node)
      ) {
        setShowMoreMenu(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const isObserver = role === "observer";

  return (
    <footer className="h-20 bg-[#202124] text-white px-3 sm:px-6 flex items-center justify-between border-t border-white/10 shrink-0 z-40 select-none relative shadow-2xl">
      {/* LEFT: Meeting Time & Code */}
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-sm font-medium text-white/90 hidden md:inline">
          {currentTime || "10:00 AM"}
        </span>
        <span className="text-white/30 hidden md:inline">|</span>
        <button
          onClick={() => onToggleDrawerTab("info")}
          className="text-xs sm:text-sm font-mono font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 transition flex items-center gap-1.5 cursor-pointer"
          title="View meeting details & code"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
          <span className="truncate">{classCode}</span>
        </button>
      </div>

      {/* CENTER: Google Meet Circular Control Pills */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* 1. Microphone Toggle */}
        <button
          onClick={onToggleMic}
          disabled={isObserver}
          className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition cursor-pointer shadow-md ${
            isObserver
              ? "bg-[#3c4043]/50 text-white/40 cursor-not-allowed"
              : isMicOn
              ? "bg-[#3c4043] hover:bg-[#4a4e52] text-white"
              : "bg-[#ea4335] hover:bg-[#dc3628] text-white"
          }`}
          title={
            isObserver
              ? "Muted as Parent Observer"
              : isMicOn
              ? "Turn off microphone (ctrl + d)"
              : "Turn on microphone (ctrl + d)"
          }
        >
          {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
          {/* Speaking Audio Wave Visualizer */}
          {isMicOn && isSpeaking && (
            <span className="absolute -inset-1 rounded-full border-2 border-emerald-400 animate-ping pointer-events-none" />
          )}
        </button>

        {/* 2. Camera Toggle */}
        <button
          onClick={onToggleCamera}
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition cursor-pointer shadow-md ${
            isCameraOn
              ? "bg-[#3c4043] hover:bg-[#4a4e52] text-white"
              : "bg-[#ea4335] hover:bg-[#dc3628] text-white"
          }`}
          title={
            isCameraOn
              ? "Turn off camera (ctrl + e)"
              : "Turn on camera (ctrl + e)"
          }
        >
          {isCameraOn ? <Video size={20} /> : <VideoOff size={20} />}
        </button>

        {/* 3. Emoji Reactions Trigger */}
        <div className="relative" ref={reactionPickerRef}>
          <button
            onClick={() => setShowReactionPicker(!showReactionPicker)}
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition cursor-pointer shadow-md ${
              showReactionPicker
                ? "bg-amber-400 text-emerald-950 font-bold"
                : "bg-[#3c4043] hover:bg-[#4a4e52] text-white"
            }`}
            title="Send a reaction"
          >
            <Smile size={20} />
          </button>

          {/* Floating Emoji Picker Dock */}
          {showReactionPicker && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-[#202124]/95 backdrop-blur-md border border-white/20 rounded-full px-3 py-2 flex items-center gap-1.5 shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
              {MEET_REACTIONS.map((item) => (
                <button
                  key={item.emoji}
                  onClick={() => {
                    onSendReaction(item.emoji);
                    setShowReactionPicker(false);
                  }}
                  className="w-10 h-10 rounded-full hover:bg-white/15 flex items-center justify-center text-xl transition transform hover:scale-125 active:scale-95 cursor-pointer"
                  title={item.label}
                >
                  {item.emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 4. Raise Hand Button */}
        <button
          onClick={onToggleHandRaise}
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition cursor-pointer shadow-md ${
            isHandRaised
              ? "bg-amber-400 text-emerald-950 ring-2 ring-amber-300 font-bold shadow-[0_0_15px_#fbbf24]"
              : "bg-[#3c4043] hover:bg-[#4a4e52] text-white"
          }`}
          title={isHandRaised ? "Lower hand" : "Raise hand"}
        >
          <Hand size={20} className={isHandRaised ? "animate-bounce" : ""} />
        </button>

        {/* 5. View Mode Switcher (Whiteboard <-> Grid <-> Dual) */}
        <div className="flex items-center bg-[#3c4043] rounded-full p-0.5 border border-white/10">
          <button
            onClick={() => onChangeViewMode("whiteboard")}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition cursor-pointer ${
              viewMode === "whiteboard"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-white/70 hover:text-white"
            }`}
            title="Interactive Whiteboard View"
          >
            <BookOpen size={17} />
          </button>
          <button
            onClick={() => onChangeViewMode("grid")}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition cursor-pointer ${
              viewMode === "grid"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-white/70 hover:text-white"
            }`}
            title="Google Meet Video Grid View"
          >
            <LayoutGrid size={17} />
          </button>
          <button
            onClick={() => onChangeViewMode("dual")}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition cursor-pointer ${
              viewMode === "dual"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-white/70 hover:text-white"
            }`}
            title="Dual Split View (Whiteboard + Video Grid)"
          >
            <Columns2 size={17} />
          </button>
        </div>

        {/* 6. More Options Menu (⋮) */}
        <div className="relative" ref={moreMenuRef}>
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#3c4043] hover:bg-[#4a4e52] text-white flex items-center justify-center transition cursor-pointer shadow-md"
            title="More options"
          >
            <MoreVertical size={20} />
          </button>

          {showMoreMenu && (
            <div className="absolute bottom-16 right-0 w-64 bg-[#282a2d] border border-white/15 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 text-xs">
              <button
                onClick={() => {
                  onToggleBandwidth();
                  setShowMoreMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/10 flex items-center gap-2.5 text-white/90 transition cursor-pointer"
              >
                <Wifi size={15} className="text-emerald-400" />
                <div className="flex-1">
                  <div className="font-semibold">
                    {bandwidthMode === "audio_only" ? "Restore HD Video" : "Audio-Only Saver"}
                  </div>
                  <div className="text-[10px] text-white/50">
                    {bandwidthMode === "audio_only" ? "HD video active" : "Saves mobile data"}
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  toggleFullscreen();
                  setShowMoreMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/10 flex items-center gap-2.5 text-white/90 transition cursor-pointer"
              >
                {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                <span>{isFullscreen ? "Exit Full Screen" : "Full Screen Mode"}</span>
              </button>

              {role === "teacher" && onToggleLaser && (
                <button
                  onClick={() => {
                    onToggleLaser();
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/10 flex items-center gap-2.5 text-white/90 transition cursor-pointer"
                >
                  <Crosshair size={15} className="text-red-400" />
                  <span>{isLaserActive ? "Turn off Laser Pointer" : "Turn on Laser Pointer"}</span>
                </button>
              )}

              {role === "teacher" && onClearAnnotations && (
                <button
                  onClick={() => {
                    onClearAnnotations();
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/10 flex items-center gap-2.5 text-red-300 transition cursor-pointer"
                >
                  <Trash2 size={15} />
                  <span>Clear Whiteboard Markings</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* 7. Leave Call Button (Google Meet signature red pill) */}
        <button
          onClick={onEndCall}
          className="bg-[#ea4335] hover:bg-[#d93025] px-4 sm:px-6 h-11 sm:h-12 rounded-full flex items-center gap-2 text-white font-bold text-xs sm:text-sm transition cursor-pointer shadow-lg active:scale-95"
          title="Leave call"
        >
          <PhoneOff size={18} />
          <span className="hidden sm:inline">End Call</span>
        </button>
      </div>

      {/* RIGHT: Meeting Details, People, Chat, Host Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Info / Details */}
        <button
          onClick={() => onToggleDrawerTab("info")}
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition cursor-pointer ${
            activeDrawerTab === "info"
              ? "bg-white text-[#202124]"
              : "hover:bg-white/10 text-white/80 hover:text-white"
          }`}
          title="Meeting details & shareable link"
        >
          <Info size={19} />
        </button>

        {/* People */}
        <button
          onClick={() => onToggleDrawerTab("people")}
          className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition cursor-pointer ${
            activeDrawerTab === "people"
              ? "bg-white text-[#202124]"
              : "hover:bg-white/10 text-white/80 hover:text-white"
          }`}
          title="People in call"
        >
          <Users size={19} />
          {participantCount > 0 && (
            <span className="absolute top-1 right-1 text-[10px] font-bold bg-emerald-500 text-white px-1.5 py-0.2 rounded-full leading-tight">
              {participantCount}
            </span>
          )}
        </button>

        {/* Chat */}
        <button
          onClick={() => onToggleDrawerTab("chat")}
          className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition cursor-pointer ${
            activeDrawerTab === "chat"
              ? "bg-white text-[#202124]"
              : "hover:bg-white/10 text-white/80 hover:text-white"
          }`}
          title="In-call messages"
        >
          <MessageSquare size={19} />
          {unreadChatCount > 0 && activeDrawerTab !== "chat" && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
          )}
        </button>

        {/* Host Controls */}
        <button
          onClick={() => onToggleDrawerTab("host")}
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition cursor-pointer ${
            activeDrawerTab === "host"
              ? "bg-amber-400 text-emerald-950 font-bold"
              : role === "teacher"
              ? "text-amber-300 hover:bg-white/10"
              : "hover:bg-white/10 text-white/80 hover:text-white"
          }`}
          title="Host management controls"
        >
          <Shield size={19} />
        </button>
      </div>
    </footer>
  );
}
