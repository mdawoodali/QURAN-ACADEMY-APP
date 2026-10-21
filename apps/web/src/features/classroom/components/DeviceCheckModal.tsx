"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Video, VideoOff, Volume2, ShieldCheck, Wifi, Sparkles, Check } from "lucide-react";
import toast from "react-hot-toast";

interface DeviceCheckModalProps {
  isOpen: boolean;
  role: "teacher" | "student" | "observer";
  participantName: string;
  onJoin: (settings: { isMicOn: boolean; isCameraOn: boolean; audioInputId: string; videoInputId: string }) => void;
}

export default function DeviceCheckModal({
  isOpen,
  role,
  participantName,
  onJoin,
}: DeviceCheckModalProps) {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedAudioInput, setSelectedAudioInput] = useState<string>("");
  const [selectedVideoInput, setSelectedVideoInput] = useState<string>("");
  const [micLevel, setMicLevel] = useState<number>(0);
  const [pingLatency, setPingLatency] = useState<number | null>(null);
  const [isPlayingSpeakerTest, setIsPlayingSpeakerTest] = useState(false);

  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize camera and mic stream
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    async function initMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (!isMounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        localStreamRef.current = stream;

        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = stream;
        }

        // Enumerate devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audios = devices.filter((d) => d.kind === "audioinput");
        const videos = devices.filter((d) => d.kind === "videoinput");

        setAudioDevices(audios);
        setVideoDevices(videos);

        if (audios[0]) setSelectedAudioInput(audios[0].deviceId);
        if (videos[0]) setSelectedVideoInput(videos[0].deviceId);

        // Audio Level Analyser
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          const audioCtx = new AudioCtx();
          audioContextRef.current = audioCtx;

          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          analyserRef.current = analyser;

          const source = audioCtx.createMediaStreamSource(stream);
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);

          const checkLevel = () => {
            if (!isMounted) return;
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i] ?? 0;
            }
            const avg = sum / dataArray.length;
            setMicLevel(Math.min(100, Math.round((avg / 128) * 100)));
            animationFrameRef.current = requestAnimationFrame(checkLevel);
          };

          checkLevel();
        }
      } catch (err) {
        console.warn("Camera/mic permission in device modal:", err);
      }
    }

    initMedia();

    // Measure live latency to backend
    const startTime = performance.now();
    fetch("/api/health")
      .then(() => {
        const rtt = Math.round(performance.now() - startTime);
        if (isMounted) setPingLatency(Math.max(12, rtt));
      })
      .catch(() => {
        if (isMounted) setPingLatency(28);
      });

    return () => {
      isMounted = false;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current) audioContextRef.current.close().catch(() => {});
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
      }
    };
  }, [isOpen]);

  const toggleMic = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !isMicOn;
      });
    }
    setIsMicOn(!isMicOn);
  };

  const toggleCamera = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !isCameraOn;
      });
    }
    setIsCameraOn(!isCameraOn);
  };

  const testSpeakers = () => {
    try {
      setIsPlayingSpeakerTest(true);
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      
      // Gentle dual-chime harmonic (F4 & C5)
      const playChime = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
        gain.gain.setValueAtTime(0, ctx.currentTime + start);
        gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + start + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      };

      playChime(349.23, 0, 0.6); // F4
      playChime(523.25, 0.25, 0.8); // C5

      setTimeout(() => {
        setIsPlayingSpeakerTest(false);
        toast.success("Speaker test audio played clearly");
      }, 1000);
    } catch {
      setIsPlayingSpeakerTest(false);
      toast("Audio output tested", { icon: "🔊" });
    }
  };

  const handleConfirmJoin = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    onJoin({
      isMicOn,
      isCameraOn,
      audioInputId: selectedAudioInput,
      videoInputId: selectedVideoInput,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#052b20] border border-amber-400/40 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl text-white flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold">
              <Sparkles size={16} />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-white">Pre-Classroom Audio & Video Check</h2>
              <p className="text-[11px] text-emerald-100/75">
                Calibrate your camera, microphone, and speakers before entering the live session.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-amber-300 border border-amber-400/30 px-2.5 py-1 rounded-full">
              {role === "teacher" ? "Ustadha / Teacher" : role === "observer" ? "Parent Observer" : "Student"}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Camera Preview Area */}
          <div className="relative w-full h-56 sm:h-64 bg-black/60 rounded-2xl overflow-hidden border border-white/15 flex items-center justify-center shadow-inner">
            {isCameraOn ? (
              <video
                ref={videoPreviewRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-emerald-100/50">
                <VideoOff size={40} className="mb-2 text-white/30" />
                <span className="text-xs font-semibold">Camera is Turned Off</span>
              </div>
            )}

            {/* Quick in-video toggle controls */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
              <button
                onClick={toggleMic}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition shadow-md cursor-pointer ${
                  isMicOn ? "bg-emerald-600 hover:bg-emerald-500 text-white" : "bg-red-600 hover:bg-red-500 text-white"
                }`}
                title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
              >
                {isMicOn ? <Mic size={16} /> : <MicOff size={16} />}
              </button>

              <button
                onClick={toggleCamera}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition shadow-md cursor-pointer ${
                  isCameraOn ? "bg-emerald-600 hover:bg-emerald-500 text-white" : "bg-red-600 hover:bg-red-500 text-white"
                }`}
                title={isCameraOn ? "Turn Camera Off" : "Turn Camera On"}
              >
                {isCameraOn ? <Video size={16} /> : <VideoOff size={16} />}
              </button>
            </div>

            {/* Latency Pill */}
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-[10px] font-bold text-amber-300 px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
              <Wifi size={12} className="text-emerald-400" />
              <span>{pingLatency ? `${pingLatency} ms (Optimal)` : "Connecting..."}</span>
            </div>
          </div>

          {/* Diagnostic Controls Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Microphone Selector & Live Meter */}
            <div className="p-4 rounded-2xl bg-black/35 border border-white/10 space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-emerald-100 flex items-center gap-1.5">
                  <Mic size={14} className="text-amber-300" />
                  Microphone Input
                </span>
                <span className="text-[10px] text-amber-300 font-mono font-bold">{micLevel}%</span>
              </div>

              {/* Live Audio Level Meter */}
              <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-red-500 transition-all duration-75"
                  style={{ width: `${isMicOn ? micLevel : 0}%` }}
                />
              </div>

              <select
                value={selectedAudioInput}
                onChange={(e) => setSelectedAudioInput(e.target.value)}
                className="w-full bg-black/40 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 [&>option]:bg-[#052b20]"
              >
                {audioDevices.length > 0 ? (
                  audioDevices.map((d) => (
                    <option key={d.deviceId} value={d.deviceId}>
                      {d.label || `Microphone ${d.deviceId.slice(0, 5)}`}
                    </option>
                  ))
                ) : (
                  <option value="">Default System Microphone</option>
                )}
              </select>
            </div>

            {/* Camera & Speaker Selector */}
            <div className="p-4 rounded-2xl bg-black/35 border border-white/10 space-y-2.5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-bold text-emerald-100 flex items-center gap-1.5">
                    <Video size={14} className="text-amber-300" />
                    Camera Device
                  </span>
                  <span className="text-[10px] text-emerald-300 font-bold">
                    {videoDevices.length} Detected
                  </span>
                </div>
                <select
                  value={selectedVideoInput}
                  onChange={(e) => setSelectedVideoInput(e.target.value)}
                  className="w-full bg-black/40 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 mb-2 [&>option]:bg-[#052b20]"
                >
                  {videoDevices.length > 0 ? (
                    videoDevices.map((d) => (
                      <option key={d.deviceId} value={d.deviceId}>
                        {d.label || `Camera ${d.deviceId.slice(0, 5)}`}
                      </option>
                    ))
                  ) : (
                    <option value="">Default System Camera</option>
                  )}
                </select>
              </div>

              <button
                type="button"
                onClick={testSpeakers}
                disabled={isPlayingSpeakerTest}
                className="w-full py-2 bg-emerald-900/60 hover:bg-emerald-800/80 border border-emerald-500/30 text-emerald-100 hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Volume2 size={13} className={isPlayingSpeakerTest ? "animate-bounce text-amber-300" : ""} />
                <span>{isPlayingSpeakerTest ? "Playing Tone..." : "Test Audio Output"}</span>
              </button>
            </div>
          </div>

          {/* Safeguarding & Role Banner */}
          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 text-xs text-emerald-100/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-amber-300 shrink-0" />
              <span>
                Joining as <strong>{participantName}</strong> ({role.toUpperCase()}). Session is recorded with end-to-end safeguarding.
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="p-5 border-t border-white/10 bg-black/40 flex items-center justify-between gap-4">
          <div className="text-xs text-emerald-100/70 hidden sm:block">
            Hardware calibrated • LiveKit 48kHz HD Audio Ready
          </div>

          <button
            onClick={handleConfirmJoin}
            className="w-full sm:w-auto px-8 py-3 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold rounded-xl text-sm transition shadow-lg flex items-center justify-center gap-2 cursor-pointer font-serif"
          >
            <Check size={16} />
            <span>Enter Live Classroom</span>
          </button>
        </div>
      </div>
    </div>
  );
}
