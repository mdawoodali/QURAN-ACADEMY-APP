"use client";

import React, { useEffect, useState, useCallback } from "react";
import { APP_VERSION, MIN_SUPPORTED_VERSION, compareSemanticVersions } from "@quran/contracts";
import { AlertTriangle, RefreshCw, ShieldAlert, Sparkles } from "lucide-react";
import { fetchRemoteVersionInfo, purgeCachesAndHardReload } from "@/lib/versionEnforcer";
import { createClient } from "@/utils/supabase/client";

interface ServerVersionData {
  version: string;
  minSupportedVersion: string;
  buildTime?: string;
  commitHash?: string;
}

export default function VersionGuard() {
  const [isBlocked, setIsBlocked] = useState(false);
  const [isSoftUpdateAvailable, setIsSoftUpdateAvailable] = useState(false);
  const [serverVersion, setServerVersion] = useState<string>(APP_VERSION);
  const [isUpdating, setIsUpdating] = useState(false);
  const [dismissedSoftUpdate, setDismissedSoftUpdate] = useState(false);

  // Client's compiled version (or simulated version set by Developer Module for testing)
  const getEffectiveClientVersion = useCallback(() => {
    if (typeof window !== "undefined") {
      const simulated = localStorage.getItem("dev_simulated_version");
      if (simulated) return simulated;
    }
    return APP_VERSION;
  }, []);

  const checkVersion = useCallback(async () => {
    try {
      // 1. Dual-source version check: API endpoint + remote Supabase settings
      const remoteInfo = await fetchRemoteVersionInfo();
      setServerVersion(remoteInfo.latestVersion);

      const clientVer = getEffectiveClientVersion();
      const minSupported = remoteInfo.minRequiredVersion || MIN_SUPPORTED_VERSION;

      // 1. Hard Block: Client version is below the minimum required version
      if (compareSemanticVersions(clientVer, minSupported) < 0) {
        setIsBlocked(true);
        setIsSoftUpdateAvailable(false);
        return;
      }

      // 2. Soft Update: Client version is behind server version, but meets minimum requirement
      if (compareSemanticVersions(clientVer, remoteInfo.latestVersion) < 0) {
        setIsBlocked(false);
        setIsSoftUpdateAvailable(true);
        return;
      }

      // Up to date
      setIsBlocked(false);
      setIsSoftUpdateAvailable(false);
    } catch (e) {
      console.warn("[VersionGuard] Version check failed (offline or network fluctuation):", e);
    }
  }, [getEffectiveClientVersion]);

  useEffect(() => {
    // 1. Initial check on mount
    checkVersion();

    // 2. Realtime listener on Supabase settings table (0ms instant version enforcement like Shaheen Traders POS)
    let versionChannel: any = null;
    try {
      const supabase = createClient();
      versionChannel = supabase
        .channel("version-gate-realtime")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "settings" },
          (payload: any) => {
            const key = payload?.new?.key;
            if (key === "min_required_version" || key === "app_latest_version") {
              checkVersion();
            }
          }
        )
        .subscribe();
    } catch (err) {
      console.warn("[VersionGuard] Realtime channel subscription skipped:", err);
    }

    // 3. Check whenever user refocuses tab / brings PWA from background
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        checkVersion();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // 4. Periodic check every 2 minutes
    const interval = setInterval(checkVersion, 2 * 60 * 1000);

    // 5. Custom developer module event
    const handleDevEvent = () => checkVersion();
    window.addEventListener("dev_version_changed", handleDevEvent);

    return () => {
      if (versionChannel) {
        try {
          const supabase = createClient();
          supabase.removeChannel(versionChannel);
        } catch {}
      }
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("dev_version_changed", handleDevEvent);
      clearInterval(interval);
    };
  }, [checkVersion]);

  // Execute a hard cache wipe & reload
  const handleForceUpdate = async () => {
    setIsUpdating(true);
    try {
      localStorage.removeItem("dev_simulated_version");
      await purgeCachesAndHardReload();
    } catch (err) {
      console.error("[VersionGuard] Cache clearance error, forcing reload:", err);
      window.location.reload();
    }
  };

  // --- 1. HARD BLOCKED STATE: Outdated app is completely unusable ---
  if (isBlocked) {
    return (
      <div className="fixed inset-0 z-[99999] bg-[#021811] flex items-center justify-center p-4 text-white select-none">
        <div className="max-w-md w-full bg-emerald-950/90 border-2 border-red-500/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(239,68,68,0.3)] text-center backdrop-blur-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/40 mx-auto flex items-center justify-center text-red-400 mb-5 animate-pulse">
            <ShieldAlert size={34} />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-widest text-red-400 bg-red-950/80 px-3 py-1 rounded-full border border-red-500/30">
            Mandatory Update Required
          </span>

          <h2 className="text-xl sm:text-2xl font-bold mt-4 font-serif text-amber-100">
            App Version Outdated
          </h2>

          <p className="text-xs sm:text-sm text-stone-300 mt-2.5 leading-relaxed">
            You are using an older version ({getEffectiveClientVersion()}) that is no longer compatible with the live academy systems.
            Please update to <strong className="text-amber-300">v{serverVersion}</strong> to continue live classroom sessions and access your portal.
          </p>

          <div className="mt-6 pt-5 border-t border-white/10 flex flex-col gap-3">
            <button
              onClick={handleForceUpdate}
              disabled={isUpdating}
              className="w-full py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={16} className={isUpdating ? "animate-spin" : ""} />
              <span>{isUpdating ? "Updating Application..." : `Update to v${serverVersion} Now`}</span>
            </button>

            <span className="text-[11px] text-stone-400">
              Your class schedules, progress, and Quran bookmarks remain 100% safe.
            </span>
          </div>
        </div>
      </div>
    );
  }

  // --- 2. SOFT UPDATE STATE: Non-blocking floating pill banner ---
  if (isSoftUpdateAvailable && !dismissedSoftUpdate) {
    return (
      <aside
        aria-label="App update available"
        className="fixed top-3 left-1/2 -translate-x-1/2 z-[9999] max-w-lg w-[92%] sm:w-auto animate-in slide-in-from-top duration-300"
      >
        <div className="bg-[#03231a] border border-amber-400/60 rounded-2xl px-4 py-2.5 shadow-2xl text-white flex items-center justify-between gap-3 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-xs">
            <Sparkles size={15} className="text-amber-400 shrink-0 animate-spin" />
            <span className="text-stone-200">
              New update available: <strong className="text-amber-300 font-semibold">v{serverVersion}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleForceUpdate}
              disabled={isUpdating}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
            >
              <RefreshCw size={12} className={isUpdating ? "animate-spin" : ""} />
              <span>{isUpdating ? "Updating..." : "Reload"}</span>
            </button>

            <button
              onClick={() => setDismissedSoftUpdate(true)}
              className="text-stone-400 hover:text-white text-xs px-1.5 py-1 rounded transition"
              aria-label="Dismiss banner"
            >
              ✕
            </button>
          </div>
        </div>
      </aside>
    );
  }

  return null;
}
