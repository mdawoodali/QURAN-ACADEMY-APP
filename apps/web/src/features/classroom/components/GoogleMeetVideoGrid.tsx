"use client";

import React, { useState } from "react";
import {
  Mic,
  MicOff,
  VideoOff,
  Hand,
  Pin,
  Maximize2,
  BookOpen,
  Volume2,
} from "lucide-react";
import { ClassroomParticipant, ClassroomViewMode } from "../types";

interface GoogleMeetVideoGridProps {
  participants: ClassroomParticipant[];
  localStream: MediaStream | null;
  localUserId: string;
  isLocalMicOn: boolean;
  isLocalCameraOn: boolean;
  isLocalSpeaking?: boolean;
  onSwitchToWhiteboard: () => void;
  compact?: boolean;
}

export default function GoogleMeetVideoGrid({
  participants,
  localStream,
  localUserId,
  isLocalMicOn,
  isLocalCameraOn,
  isLocalSpeaking = false,
  onSwitchToWhiteboard,
  compact = false,
}: GoogleMeetVideoGridProps) {
  const [pinnedParticipantId, setPinnedParticipantId] = useState<string | null>(
    null
  );

  const localVideoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (localVideoRef.current && localStream && isLocalCameraOn) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, isLocalCameraOn]);

  const pinnedParticipant = participants.find(
    (p) => p.id === pinnedParticipantId
  );
  const otherParticipants = participants.filter(
    (p) => p.id !== pinnedParticipantId
  );

  // Compute grid layout CSS
  const getGridCols = (count: number) => {
    if (count <= 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-1 md:grid-cols-2";
    if (count <= 4) return "grid-cols-1 sm:grid-cols-2";
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  };

  return (
    <div className="w-full h-full flex flex-col relative select-none p-2 sm:p-4 bg-gradient-to-b from-[#1e1f22] to-[#121316] rounded-3xl overflow-hidden">
      {/* Top Bar Floating Control (Switch to Whiteboard) */}
      {!compact && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-[#202124]/90 backdrop-blur-md px-4 py-2 rounded-full border border-white/15 shadow-2xl">
          <button
            onClick={onSwitchToWhiteboard}
            className="flex items-center gap-2 text-xs font-bold text-amber-300 hover:text-amber-200 transition cursor-pointer"
          >
            <BookOpen size={16} />
            <span>Open Interactive Mushaf Whiteboard</span>
          </button>
        </div>
      )}

      {/* Spotlight / Pinned Mode */}
      {pinnedParticipant ? (
        <div className="flex-1 flex flex-col md:flex-row gap-3 min-h-0">
          {/* Main Stage Spotlight */}
          <div className="flex-1 relative rounded-2xl overflow-hidden bg-[#3c4043] border border-white/10 flex items-center justify-center">
            <RenderParticipantTile
              participant={pinnedParticipant}
              isSelf={pinnedParticipant.id === localUserId}
              localVideoRef={localVideoRef}
              isLocalCameraOn={isLocalCameraOn}
              isLocalMicOn={isLocalMicOn}
              isSpeaking={
                pinnedParticipant.id === localUserId
                  ? isLocalSpeaking
                  : pinnedParticipant.isSpeaking
              }
              onPin={() => setPinnedParticipantId(null)}
              isPinned={true}
            />
          </div>

          {/* Side Column for others */}
          <div className="w-full md:w-64 flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto shrink-0">
            {otherParticipants.map((p) => (
              <div
                key={p.id}
                className="h-32 md:h-36 w-48 md:w-full relative rounded-2xl overflow-hidden bg-[#3c4043] border border-white/10 shrink-0"
              >
                <RenderParticipantTile
                  participant={p}
                  isSelf={p.id === localUserId}
                  localVideoRef={localVideoRef}
                  isLocalCameraOn={isLocalCameraOn}
                  isLocalMicOn={isLocalMicOn}
                  isSpeaking={
                    p.id === localUserId ? isLocalSpeaking : p.isSpeaking
                  }
                  onPin={() => setPinnedParticipantId(p.id)}
                  isPinned={false}
                  compact
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Standard Google Meet Grid */
        <div
          className={`flex-1 grid ${getGridCols(
            participants.length
          )} gap-3 min-h-0 place-items-stretch`}
        >
          {participants.map((p) => {
            const isSelf = p.id === localUserId;
            const speaking = isSelf ? isLocalSpeaking : p.isSpeaking;

            return (
              <div
                key={p.id}
                className={`relative rounded-3xl overflow-hidden bg-[#3c4043] border transition-all duration-300 flex items-center justify-center shadow-lg min-h-[180px] ${
                  speaking
                    ? "border-emerald-400 ring-4 ring-emerald-400/40"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <RenderParticipantTile
                  participant={p}
                  isSelf={isSelf}
                  localVideoRef={localVideoRef}
                  isLocalCameraOn={isLocalCameraOn}
                  isLocalMicOn={isLocalMicOn}
                  isSpeaking={speaking}
                  onPin={() => setPinnedParticipantId(p.id)}
                  isPinned={false}
                  compact={compact}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface TileProps {
  participant: ClassroomParticipant;
  isSelf: boolean;
  localVideoRef: React.RefObject<HTMLVideoElement | null>;
  isLocalCameraOn: boolean;
  isLocalMicOn: boolean;
  isSpeaking?: boolean;
  onPin: () => void;
  isPinned: boolean;
  compact?: boolean;
}

function RenderParticipantTile({
  participant,
  isSelf,
  localVideoRef,
  isLocalCameraOn,
  isLocalMicOn,
  isSpeaking = false,
  onPin,
  isPinned,
  compact = false,
}: TileProps) {
  const cameraActive = isSelf ? isLocalCameraOn : participant.isCameraOn;
  const micActive = isSelf ? isLocalMicOn : participant.isMicOn;

  const initials = participant.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="w-full h-full relative flex items-center justify-center bg-[#3c4043] select-none group">
      {/* 1. Video Element (if Camera On) */}
      {cameraActive ? (
        isSelf ? (
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover -scale-x-100"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#282a2d] text-white">
            <span className="text-xs text-white/50">Remote video connected</span>
          </div>
        )
      ) : (
        /* 2. Fallback Avatar Circle (if Camera Off) */
        <div className="flex flex-col items-center justify-center gap-2">
          <div
            className={`rounded-full flex items-center justify-center font-bold text-white shadow-xl transition-transform ${
              compact ? "w-14 h-14 text-base" : "w-24 h-24 text-3xl"
            } ${
              participant.role === "teacher"
                ? "bg-emerald-800 border-2 border-emerald-400/50"
                : participant.role === "observer"
                ? "bg-purple-900 border-2 border-purple-400/50"
                : "bg-blue-800 border-2 border-blue-400/50"
            }`}
          >
            {initials}
          </div>
          {participant.role === "observer" && (
            <span className="text-[10px] text-purple-300 font-bold bg-purple-950/80 px-2 py-0.5 rounded-full border border-purple-500/30">
              Silent Observer
            </span>
          )}
        </div>
      )}

      {/* 3. Top-Right Badges & Pin button */}
      <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
        {participant.isHandRaised && (
          <div className="bg-amber-400 text-emerald-950 font-bold p-1.5 rounded-full shadow-lg animate-bounce">
            <Hand size={14} />
          </div>
        )}
        <button
          onClick={onPin}
          className="w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 text-white/70 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer backdrop-blur-sm"
          title={isPinned ? "Unpin tile" : "Pin tile to spotlight"}
        >
          <Pin size={13} className={isPinned ? "text-amber-400 fill-amber-400" : ""} />
        </button>
      </div>

      {/* 4. Bottom-Left Name Pill & Mic Status */}
      <div className="absolute bottom-3 left-3 flex items-center gap-2 z-10 max-w-[85%]">
        <div className="bg-black/70 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2 text-white border border-white/10 shadow-md">
          {/* Mic icon */}
          {micActive ? (
            <div className="relative flex items-center">
              <Mic size={13} className="text-emerald-400" />
              {isSpeaking && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping absolute -top-0.5 -right-0.5" />
              )}
            </div>
          ) : (
            <div className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center">
              <MicOff size={10} className="text-white" />
            </div>
          )}

          {/* Name */}
          <span className="text-xs font-semibold truncate max-w-[140px]">
            {participant.name} {isSelf && "(You)"}
          </span>

          {/* Role badge */}
          {participant.role === "teacher" && (
            <span className="text-[9px] bg-emerald-900/90 text-emerald-300 px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider">
              Host
            </span>
          )}
          {participant.role === "observer" && (
            <span className="text-[9px] bg-purple-900/90 text-purple-300 px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider">
              Observer
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
