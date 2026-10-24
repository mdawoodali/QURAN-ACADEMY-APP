"use client";

import React, { useState, RefObject } from "react";
import { MicOff, WifiOff, Minimize2, Maximize2, Move } from "lucide-react";

interface ClassroomVideoBubbleProps {
  isCameraOn: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
  label?: string;
  isMuted?: boolean;
  isAudioOnly?: boolean;
  role?: string;
  position?: "top-right" | "bottom-right" | "bottom-left";
}

export default function ClassroomVideoBubble({
  isCameraOn,
  videoRef,
  label = "Teacher",
  isMuted = false,
  isAudioOnly = false,
  role = "teacher",
  position: initialPosition = "bottom-right"
}: ClassroomVideoBubbleProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<"top-right" | "bottom-right" | "bottom-left">(
    initialPosition
  );

  const getPositionClass = () => {
    switch (currentPosition) {
      case "top-right":
        return "top-20 right-3 sm:right-6";
      case "bottom-left":
        return "bottom-20 left-3 sm:left-6";
      case "bottom-right":
      default:
        return "bottom-20 right-3 sm:right-6";
    }
  };

  const cyclePosition = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentPosition === "bottom-right") setCurrentPosition("top-right");
    else if (currentPosition === "top-right") setCurrentPosition("bottom-left");
    else setCurrentPosition("bottom-right");
  };

  return (
    <div
      className={`absolute ${getPositionClass()} z-40 transition-all duration-300 shadow-2xl rounded-2xl overflow-hidden border-2 border-amber-400/40 bg-black/85 backdrop-blur-md ${
        isMinimized ? "w-auto h-auto py-1 px-2.5" : "w-32 h-24 sm:w-40 sm:h-28 flex flex-col justify-between"
      }`}
    >
      {/* Minimized Pill View */}
      {isMinimized ? (
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsMinimized(false)}>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white text-xs font-semibold">{label}</span>
          {isMuted && <MicOff size={11} className="text-red-400" />}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(false);
            }}
            title="Expand Video"
            className="text-amber-300 hover:text-white p-0.5 rounded transition cursor-pointer"
          >
            <Maximize2 size={12} />
          </button>
        </div>
      ) : (
        <>
          {/* Top Controls Overlay: Move & Minimize */}
          <div className="absolute top-1.5 right-1.5 z-20 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-lg px-1 py-0.5 border border-white/10">
            <button
              onClick={cyclePosition}
              title="Change Corner"
              className="text-white/70 hover:text-amber-300 transition p-0.5 cursor-pointer"
            >
              <Move size={11} />
            </button>
            <button
              onClick={() => setIsMinimized(true)}
              title="Minimize Video Tile"
              className="text-white/70 hover:text-amber-300 transition p-0.5 cursor-pointer"
            >
              <Minimize2 size={11} />
            </button>
          </div>

          {/* Video Stream or Avatar */}
          {isCameraOn && !isAudioOnly ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform -scale-x-100"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-gradient-to-b from-emerald-950/90 to-black">
              <div className="w-8 h-8 rounded-full bg-emerald-800/80 border border-amber-400/40 text-amber-300 flex items-center justify-center font-bold text-xs shadow-md mb-0.5">
                {role === "teacher" ? "UM" : "YK"}
              </div>
              <span className="text-[9px] text-emerald-100/70 flex items-center gap-1">
                {isAudioOnly ? (
                  <>
                    <WifiOff size={9} className="text-amber-300" />
                    <span>Audio HD</span>
                  </>
                ) : (
                  <span>Camera Off</span>
                )}
              </span>
            </div>
          )}

          {/* Bottom Overlay Pill with Name & Mic Status */}
          <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between pointer-events-none">
            <span className="bg-black/70 backdrop-blur-md text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md border border-white/10 truncate max-w-[80px]">
              {label}
            </span>

            {isMuted && (
              <span className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md">
                <MicOff size={9} />
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
