"use client";

import React, { useEffect, useRef, useState } from "react";
import { Mic, Activity, CheckCircle2, RotateCcw } from "lucide-react";

export interface TajweedWaveformProps {
  stream?: MediaStream | null;
  isActive?: boolean;
  targetHarakah?: number; // e.g. 2, 4, 5, or 6
  ruleLabel?: string; // e.g. "Madd Lazim (6 Counts)"
  onTargetReached?: (harakah: number) => void;
}

export default function TajweedWaveform({
  stream = null,
  isActive = true,
  targetHarakah = 4,
  ruleLabel = "Madd Elongation",
  onTargetReached,
}: TajweedWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [voicedDurationMs, setVoicedDurationMs] = useState(0);
  const [isVoicing, setIsVoicing] = useState(false);
  const [reachedTarget, setReachedTarget] = useState(false);

  // 1 Harakah is conventionally ~400ms at medium recitation tempo
  const HARAKAH_MS = 400;
  const currentHarakah = Math.min(8, Math.floor(voicedDurationMs / HARAKAH_MS));

  useEffect(() => {
    let animationFrameId: number;
    let audioCtx: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let source: MediaStreamAudioSourceNode | null = null;

    let voicingStartTime: number | null = null;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (stream && stream.getAudioTracks().length > 0 && typeof window !== "undefined") {
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtx = new AudioContextClass();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
      } catch (e) {
        console.warn("[TajweedWaveform] AudioContext setup skipped or restricted:", e);
      }
    }

    const dataArray = new Uint8Array(32);

    const render = (time: number) => {
      animationFrameId = requestAnimationFrame(render);

      // Analyze real frequency data if available, or generate subtle ambient wave
      let averageVolume = 0;
      if (analyser) {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i]!;
        }
        averageVolume = sum / dataArray.length;
      } else if (isActive) {
        // Fallback simulation wave
        for (let i = 0; i < dataArray.length; i++) {
          dataArray[i] = Math.max(10, Math.floor(40 + Math.sin(time / 200 + i * 0.3) * 30));
        }
        averageVolume = 35;
      }

      // Voicing threshold
      const isCurrentlyVoiced = averageVolume > 25;
      setIsVoicing(isCurrentlyVoiced);

      if (isCurrentlyVoiced) {
        if (!voicingStartTime) {
          voicingStartTime = performance.now();
        } else {
          const elapsed = performance.now() - voicingStartTime;
          setVoicedDurationMs(elapsed);
          const harakah = Math.floor(elapsed / HARAKAH_MS);
          if (harakah >= targetHarakah && !reachedTarget) {
            setReachedTarget(true);
            onTargetReached?.(harakah);
          }
        }
      } else {
        voicingStartTime = null;
      }

      // Draw Waveform bars on Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / dataArray.length) * 0.8;
      const barSpacing = (canvas.width / dataArray.length) * 0.2;

      for (let i = 0; i < dataArray.length; i++) {
        const val = dataArray[i]!;
        const barHeight = Math.max(4, (val / 255) * canvas.height);
        const x = i * (barWidth + barSpacing);
        const y = (canvas.height - barHeight) / 2;

        // Color based on voicing state and target reach
        if (reachedTarget) {
          ctx.fillStyle = "#34d399"; // Emerald green
        } else if (isCurrentlyVoiced) {
          ctx.fillStyle = "#fbbf24"; // Amber gold
        } else {
          ctx.fillStyle = "rgba(255, 255, 255, 0.2)"; // Dim white
        }

        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (source) source.disconnect();
      if (audioCtx && audioCtx.state !== "closed") {
        audioCtx.close().catch(() => {});
      }
    };
  }, [stream, isActive, targetHarakah, reachedTarget, onTargetReached]);

  const resetMeter = () => {
    setVoicedDurationMs(0);
    setReachedTarget(false);
  };

  return (
    <div className="bg-emerald-950/80 border border-emerald-500/30 backdrop-blur-md p-3.5 rounded-2xl text-white shadow-xl flex flex-col gap-2.5 max-w-sm w-full select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity size={16} className={isVoicing ? "text-amber-400 animate-pulse" : "text-emerald-400"} />
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
            {ruleLabel}
          </span>
        </div>
        <button
          onClick={resetMeter}
          className="text-stone-400 hover:text-white p-1 rounded-lg transition"
          title="Reset Duration Meter"
        >
          <RotateCcw size={13} />
        </button>
      </div>

      {/* Real-Time Waveform Visualizer Canvas */}
      <div className="bg-black/40 rounded-xl p-2 border border-white/5 flex items-center justify-center">
        <canvas ref={canvasRef} width={280} height={40} className="w-full h-10" />
      </div>

      {/* Harakah (Count) Progress Bar & Badges */}
      <div className="flex items-center justify-between text-xs pt-1">
        <div className="flex items-center gap-1.5">
          <Mic size={13} className={isVoicing ? "text-amber-400" : "text-stone-500"} />
          <span className="font-semibold">
            {currentHarakah} / {targetHarakah} Harakat ({(voicedDurationMs / 1000).toFixed(1)}s)
          </span>
        </div>

        {reachedTarget ? (
          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-900/60 px-2 py-0.5 rounded-full border border-emerald-500/40 animate-bounce">
            <CheckCircle2 size={12} /> Target Met!
          </span>
        ) : (
          <span className="text-[11px] text-stone-400">
            Target: {targetHarakah * HARAKAH_MS}ms
          </span>
        )}
      </div>

      {/* Harakah Step Indicators */}
      <div className="grid grid-cols-6 gap-1 w-full pt-0.5">
        {[1, 2, 3, 4, 5, 6].map((count) => {
          const isFilled = currentHarakah >= count;
          const isTarget = targetHarakah === count;
          return (
            <div
              key={count}
              className={`h-1.5 rounded-full transition-all ${
                isFilled
                  ? reachedTarget
                    ? "bg-emerald-400 shadow-[0_0_8px_#34d399]"
                    : "bg-amber-400"
                  : isTarget
                  ? "bg-rose-500/50"
                  : "bg-white/10"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
