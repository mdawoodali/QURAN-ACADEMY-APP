"use client";

import React, { RefObject } from "react";

interface ClassroomVideoBubbleProps {
  isCameraOn: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
  label?: string;
}

export default function ClassroomVideoBubble({
  isCameraOn,
  videoRef,
  label = "Teacher"
}: ClassroomVideoBubbleProps) {
  return (
    <div
      className={`absolute top-20 right-4 md:right-8 z-50 transition-all duration-500 shadow-xl rounded-2xl overflow-hidden border-4 border-white ${
        isCameraOn ? "w-32 h-24 md:w-48 md:h-36 opacity-100 scale-100" : "w-0 h-0 opacity-0 scale-50"
      }`}
    >
      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover bg-gray-900" />
      <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded-md font-bold backdrop-blur-sm">
        {label}
      </div>
    </div>
  );
}
