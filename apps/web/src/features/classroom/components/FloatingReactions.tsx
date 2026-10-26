"use client";

import React, { useEffect, useState } from "react";
import { FloatingReaction } from "../types";

interface FloatingReactionsProps {
  reactions: FloatingReaction[];
  onAnimationEnd?: (id: string) => void;
}

export default function FloatingReactions({
  reactions,
  onAnimationEnd,
}: FloatingReactionsProps) {
  const [activeItems, setActiveItems] = useState<FloatingReaction[]>([]);
  const [recentNotification, setRecentNotification] = useState<{
    senderName: string;
    emoji: string;
  } | null>(null);

  useEffect(() => {
    if (reactions.length > 0) {
      const latest = reactions[reactions.length - 1];
      if (latest) {
        setActiveItems((prev) => [...prev.slice(-25), latest]);
        setRecentNotification({
          senderName: latest.senderName,
          emoji: latest.emoji,
        });

        const timer = setTimeout(() => {
          setRecentNotification((current) =>
            current?.senderName === latest.senderName && current?.emoji === latest.emoji
              ? null
              : current
          );
        }, 3200);

        return () => clearTimeout(timer);
      }
    }
  }, [reactions]);

  const handleAnimationComplete = (id: string) => {
    setActiveItems((prev) => prev.filter((item) => item.id !== id));
    if (onAnimationEnd) onAnimationEnd(id);
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* 1. Subtle Google Meet reaction toast notification at bottom-left */}
      {recentNotification && (
        <div className="absolute bottom-24 left-6 z-50 flex items-center gap-2 bg-[#202124]/90 backdrop-blur-md text-white text-xs font-medium px-3.5 py-1.5 rounded-full border border-white/10 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
          <span className="text-base">{recentNotification.emoji}</span>
          <span className="font-semibold text-emerald-200">{recentNotification.senderName}</span>
        </div>
      )}

      {/* 2. Floating emoji bubbles floating upwards */}
      {activeItems.map((r) => (
        <div
          key={r.id}
          onAnimationEnd={() => handleAnimationComplete(r.id)}
          className="absolute bottom-24 text-3xl sm:text-4xl select-none"
          style={{
            left: `${Math.max(12, Math.min(88, r.x))}%`,
            animation: "meetFloatUp 3.2s cubic-bezier(0.25, 1, 0.5, 1) forwards",
          }}
        >
          <div className="animate-bounce" style={{ animationDuration: "1.4s" }}>
            {r.emoji}
          </div>
        </div>
      ))}

      <style jsx global>{`
        @keyframes meetFloatUp {
          0% {
            opacity: 0;
            transform: translateY(0) scale(0.6) rotate(0deg);
          }
          15% {
            opacity: 1;
            transform: translateY(-40px) scale(1.25) rotate(-6deg);
          }
          50% {
            opacity: 0.95;
            transform: translateY(-220px) scale(1.05) rotate(6deg);
          }
          80% {
            opacity: 0.7;
            transform: translateY(-420px) scale(0.95) rotate(-4deg);
          }
          100% {
            opacity: 0;
            transform: translateY(-560px) scale(0.7) rotate(4deg);
          }
        }
      `}</style>
    </div>
  );
}
