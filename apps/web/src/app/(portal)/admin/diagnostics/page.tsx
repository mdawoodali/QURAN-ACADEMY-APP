"use client";

import React, { useEffect, useState, useRef } from "react";
import { APP_VERSION, MIN_SUPPORTED_VERSION } from "@quran/contracts";
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Trash2,
  Radio,
  Camera,
  Mic,
  ShieldCheck,
  Server,
  Zap,
  Globe,
  Sliders,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";

interface DiagnosticReport {
  timestamp: string;
  totalLatencyMs: number;
  environment: string;
  checks: Record<string, { status: "healthy" | "warning" | "error"; latencyMs?: number; details: string }>;
}

export default function DiagnosticsPage() {
  const [report, setReport] = useState<DiagnosticReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [simulatedVersion, setSimulatedVersion] = useState<string | null>(null);

  // Hardware Diagnostic state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const fetchDiagnostics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/diagnostics?_t=${Date.now()}`, { cache: "no-store" });
      const data = await res.json();
      setReport(data);
    } catch {
      toast.error("Failed to load live diagnostics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnostics();
    const stored = localStorage.getItem("dev_simulated_version");
    setSimulatedVersion(stored);
  }, []);

  // 1. Simulate Outdated Version (To test the forced update blocker)
  const handleSimulateVersion = (ver: string) => {
    localStorage.setItem("dev_simulated_version", ver);
    setSimulatedVersion(ver);
    window.dispatchEvent(new Event("dev_version_changed"));
    toast.success(`Simulating client version: ${ver}`);
  };

  const handleResetSimulatedVersion = () => {
    localStorage.removeItem("dev_simulated_version");
    setSimulatedVersion(null);
    window.dispatchEvent(new Event("dev_version_changed"));
    toast.success(`Restored authentic version (${APP_VERSION})`);
  };

  // 2. Hard Purge All Caches & Service Worker
  const handlePurgeAllCaches = async () => {
    try {
      if ("serviceWorker" in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        for (const reg of regs) {
          reg.active?.postMessage("PURGE_CACHES");
          await reg.unregister();
        }
      }
      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
      sessionStorage.clear();
      localStorage.removeItem("pwa_install_dismissed");
      toast.success("All Service Worker & browser caches purged!");
    } catch {
      toast.error("Error purging caches");
    }
  };

  // 3. Hardware Camera & Audio Live Test
  const toggleHardwareTest = async () => {
    if (isCameraActive) {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
      }
      setIsCameraActive(false);
      setAudioLevel(0);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: { echoCancellation: true, noiseSuppression: true },
        });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraActive(true);

        // Simple audio level analyzer
        const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        const dataArray = new Uint8Array(32);
        const updateAudioMeter = () => {
          if (!mediaStreamRef.current) return;
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) sum += dataArray[i]!;
          setAudioLevel(Math.min(100, Math.floor((sum / dataArray.length / 128) * 100)));
          requestAnimationFrame(updateAudioMeter);
        };
        updateAudioMeter();

        toast.success("Camera & Microphone active");
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Access denied";
        toast.error(`Media access failed: ${msg}`);
      }
    }
  };

  // 4. Send Diagnostic Test Email
  const handleSendTestEmail = async () => {
    try {
      const res = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "classes@quranlearnacademy.com",
          template: "welcome",
          data: {
            studentName: "Developer Diagnostic Test",
            portalUrl: "https://quranacademyapp.vercel.app/login",
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Email dispatched! (ID: ${data.messageId || "sandbox"})`);
      } else {
        toast.error(`Dispatch failed: ${data.error}`);
      }
    } catch {
      toast.error("Failed to connect to email endpoint");
    }
  };

  const getStatusIcon = (status: "healthy" | "warning" | "error") => {
    switch (status) {
      case "healthy":
        return <CheckCircle2 className="text-emerald-400" size={18} />;
      case "warning":
        return <AlertTriangle className="text-amber-400" size={18} />;
      case "error":
        return <XCircle className="text-rose-500" size={18} />;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Activity size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-serif text-white tracking-wide flex items-center gap-2">
                <span>Developer Diagnostics & Health Hub</span>
                <span className="text-xs font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40">
                  v{APP_VERSION}
                </span>
              </h1>
              <p className="text-xs text-stone-300 mt-0.5">
                Real-time verification of Database, LiveKit, Google Auth, PWA versioning, and WebRTC hardware.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchDiagnostics}
            disabled={loading}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span>Re-scan Systems</span>
          </button>
        </div>
      </div>

      {/* 1. Versioning & Stale Client Guard Section */}
      <section className="bg-[#03231a] border border-amber-500/30 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Radio className="text-amber-400" size={20} />
            <h2 className="text-base font-bold text-amber-100">
              Application Versioning & Stale Version Blocker
            </h2>
          </div>
          <span className="text-xs font-mono text-stone-400">
            Channel: <span className="text-emerald-400 font-bold">production</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-black/30 border border-white/5 rounded-2xl p-4">
            <span className="text-xs text-stone-400 block mb-1">Production App Version</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">v{APP_VERSION}</span>
          </div>

          <div className="bg-black/30 border border-white/5 rounded-2xl p-4">
            <span className="text-xs text-stone-400 block mb-1">Minimum Required Version</span>
            <span className="text-xl font-bold text-amber-400 font-mono">v{MIN_SUPPORTED_VERSION}</span>
          </div>

          <div className="bg-black/30 border border-white/5 rounded-2xl p-4">
            <span className="text-xs text-stone-400 block mb-1">Client Active State</span>
            <span className="text-sm font-bold text-white flex items-center gap-1.5 mt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{simulatedVersion ? `Simulating v${simulatedVersion}` : `Up to Date (v${APP_VERSION})`}</span>
            </span>
          </div>
        </div>

        {/* Interactive Version Simulator for Testing */}
        <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Sliders size={15} className="text-amber-400" />
            <span className="text-stone-300">Test Forced Update Blocker:</span>
            <button
              onClick={() => handleSimulateVersion("1.0.0")}
              className="px-2.5 py-1 bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-200 rounded-lg font-mono transition cursor-pointer"
            >
              Simulate Outdated v1.0.0 (Blocks App)
            </button>
            {simulatedVersion && (
              <button
                onClick={handleResetSimulatedVersion}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-stone-200 rounded-lg transition cursor-pointer"
              >
                Reset to v{APP_VERSION}
              </button>
            )}
          </div>

          <button
            onClick={handlePurgeAllCaches}
            className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-200 rounded-xl font-semibold flex items-center gap-1.5 transition cursor-pointer ml-auto"
          >
            <Trash2 size={13} />
            <span>Purge All PWA Caches</span>
          </button>
        </div>
      </section>

      {/* 2. System Components Health Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Database Check */}
        <div className="bg-black/40 border border-white/10 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="text-emerald-400" size={18} />
              <h3 className="text-sm font-bold text-white">Supabase PostgreSQL</h3>
            </div>
            {report?.checks.database && getStatusIcon(report.checks.database.status)}
          </div>
          <p className="text-xs text-stone-300">
            {report?.checks.database?.details || "Checking database connection..."}
          </p>
          {report?.checks.database?.latencyMs && (
            <span className="text-[11px] font-mono text-stone-400 block">
              Round-trip Latency: {report.checks.database.latencyMs}ms
            </span>
          )}
        </div>

        {/* LiveKit WebRTC Check */}
        <div className="bg-black/40 border border-white/10 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="text-amber-400" size={18} />
              <h3 className="text-sm font-bold text-white">LiveKit Cloud WebRTC</h3>
            </div>
            {report?.checks.livekit && getStatusIcon(report.checks.livekit.status)}
          </div>
          <p className="text-xs text-stone-300">
            {report?.checks.livekit?.details || "Validating LiveKit Cloud room token issuance..."}
          </p>
        </div>

        {/* Resend Email Engine */}
        <div className="bg-black/40 border border-white/10 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="text-sky-400" size={18} />
              <h3 className="text-sm font-bold text-white">Resend Email Engine</h3>
            </div>
            {report?.checks.email && getStatusIcon(report.checks.email.status)}
          </div>
          <p className="text-xs text-stone-300">
            {report?.checks.email?.details || "Checking transactional email engine..."}
          </p>
          <button
            onClick={handleSendTestEmail}
            className="text-xs text-amber-300 hover:text-amber-200 underline font-semibold cursor-pointer"
          >
            Send Test Diagnostic Email
          </button>
        </div>

        {/* Google OAuth Readiness */}
        <div className="bg-black/40 border border-white/10 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-emerald-400" size={18} />
              <h3 className="text-sm font-bold text-white">Google OAuth Authentication</h3>
            </div>
            {report?.checks.google_auth && getStatusIcon(report.checks.google_auth.status)}
          </div>
          <p className="text-xs text-stone-300">
            {report?.checks.google_auth?.details || "Checking Google OAuth integration..."}
          </p>
          <span className="text-[11px] text-stone-400 block">
            Callback: <code className="bg-black/40 px-1 py-0.5 rounded text-amber-200">/auth/callback</code>
          </span>
        </div>
      </section>

      {/* 3. Hardware Camera & Audio Live Test Bench */}
      <section className="bg-black/40 border border-white/10 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="text-amber-400" size={18} />
            <h3 className="text-sm font-bold text-white">Live Classroom Hardware Diagnostic</h3>
          </div>
          <button
            onClick={toggleHardwareTest}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              isCameraActive ? "bg-red-600 hover:bg-red-500 text-white" : "bg-emerald-600 hover:bg-emerald-500 text-white"
            }`}
          >
            <Camera size={13} />
            <span>{isCameraActive ? "Stop Hardware Test" : "Test Camera & Mic"}</span>
          </button>
        </div>

        {isCameraActive ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border border-white/10 shadow-lg">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-[10px] text-white px-2 py-0.5 rounded font-mono">
                Live Video Feed (Hardware OK)
              </span>
            </div>

            <div className="bg-black/30 border border-white/5 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-stone-300">
                  <Mic size={14} className={audioLevel > 5 ? "text-emerald-400" : "text-stone-500"} />
                  <span>Microphone Phonation Level</span>
                </span>
                <span className="font-mono text-amber-300 font-bold">{audioLevel}%</span>
              </div>
              <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-amber-400 h-full transition-all duration-75"
                  style={{ width: `${audioLevel}%` }}
                />
              </div>
              <span className="text-[11px] text-stone-400 block leading-relaxed">
                Acoustic Echo Cancellation (AEC), Noise Suppression, and AGC are active. Speak into your microphone to verify live modulation.
              </span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-stone-400">
            Click &ldquo;Test Camera &amp; Mic&rdquo; to test your device&apos;s camera feed, audio modulation, and WebRTC hardware pipeline.
          </p>
        )}
      </section>

      {/* 4. Google OAuth Setup Instructions Modal / Drawer */}
      <section className="bg-black/30 border border-white/10 rounded-2xl p-5 text-xs text-stone-300 space-y-2">
        <h4 className="font-bold text-amber-200 text-sm flex items-center gap-2">
          <span>Google OAuth Integration Configuration</span>
          <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded">Setup Guide</span>
        </h4>
        <p className="leading-relaxed">
          To enable 1-tap Google Login for parents, students, and teachers:
        </p>
        <ol className="list-decimal pl-4 space-y-1 text-stone-400">
          <li>Create an OAuth 2.0 Client ID in the <strong className="text-stone-200">Google Cloud Console</strong>.</li>
          <li>
            Add this Authorized Redirect URI:{" "}
            <code className="text-amber-300 bg-black/60 px-1 py-0.5 rounded">
              https://yqtkgobvfpphwrfwarls.supabase.co/auth/v1/callback
            </code>
          </li>
          <li>In your <strong className="text-stone-200">Supabase Dashboard</strong>, navigate to <em>Authentication &gt; Providers &gt; Google</em>, toggle Enabled, and paste your Client ID and Client Secret.</li>
        </ol>
      </section>
    </div>
  );
}
