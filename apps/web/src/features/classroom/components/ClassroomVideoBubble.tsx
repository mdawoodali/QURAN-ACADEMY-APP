"use client";

import React, { RefObject } from "react";
import { MicOff, WifiOff } from "lucide-react";

interface ClassroomVideoBubbleProps {
  isCameraOn: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
  label?: string;
  isMuted?: boolean;
  isAudioOnly?: boolean;
  role?: string;
  position?: "top-right" | "bottom-right";
}

export default function ClassroomVideoBubble({
  isCameraOn,
  videoRef,
  label = "Teacher",
  isMuted = false,
  isAudioOnly = false,
  role = "teacher",
  position = "top-right"
}: ClassroomVideoBubbleProps) {
  const positionClass = position === "top-right" 
    ? "top-20 right-4 md:right-8" 
    : "bottom-24 right-4 md:right-8";

  return (
    <div
      className={`absolute ${positionClass} z-40 transition-all duration-300 shadow-2xl rounded-2xl overflow-hidden border-2 border-amber-400/40 bg-black/80 backdrop-blur-md w-36 h-28 sm:w-48 sm:h-36 flex flex-col justify-between`}
    >
      {/* Video or Audio-Only Avatar */}
      {isCameraOn && !isAudioOnly ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover transform -scale-x-100"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-gradient-to-b from-emerald-950/80 to-black">
          <div className="w-12 h-12 rounded-full bg-emerald-800/80 border border-amber-400/40 text-amber-300 flex items-center justify-center font-bold text-base shadow-md mb-1">
            {role === "teacher" ? "UM" : "YK"}
          </div>
          <span className="text-[10px] text-emerald-100/70 flex items-center gap-1">
            {isAudioOnly ? (
              <>
                <WifiOff size={10} className="text-amber-300" />
                <span>Audio-Only HD</span>
              </>
            ) : (
              <span>Camera Off</span>
            )}
          </span>
        </div>
      )}

      {/* Overlay Pill with Name & Mic Status */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
        <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/10 truncate max-w-[90px]">
          {label}
        </span>

        {isMuted && (
          <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md">
            <MicOff size={10} />
          </span>
        )}
      </div>
    </div>
  );
}
