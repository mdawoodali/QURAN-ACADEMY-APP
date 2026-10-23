"use client";

import React, { useEffect, useState } from "react";
import { Download, Bell, X, ShieldCheck } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [notificationsGranted, setNotificationsGranted] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Register Service Worker
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("[PWA] Service Worker registered with scope:", reg.scope);
        })
        .catch((err) => {
          console.warn("[PWA] Service Worker registration failed:", err);
        });
    }

    // Check Notification Permission
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationsGranted(Notification.permission === "granted");
    }

    // Listen for BeforeInstallPromptEvent
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Check if user dismissed recently
      const dismissed = localStorage.getItem("pwa_install_dismissed");
      if (!dismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleEnableNotifications = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setNotificationsGranted(true);
        new Notification("Quran Learn Academy Alerts Active", {
          body: "You will now receive 15-minute reminders before each scheduled live class.",
          icon: "/logo_quran_learn_academy.png",
        });
      }
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setShowPrompt(false);
    localStorage.setItem("pwa_install_dismissed", "true");
  };

  if (isDismissed || (!showPrompt && notificationsGranted)) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 animate-in slide-in-from-bottom duration-300">
      <div className="bg-[#03231a] border border-amber-500/40 rounded-2xl p-4 shadow-2xl text-white backdrop-blur-xl">
        <div className="flex items-start justify-between gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0 text-amber-300">
            <ShieldCheck size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-amber-100 flex items-center gap-1.5">
              <span>Quran Learn Academy App</span>
              <span className="text-[10px] bg-emerald-800/80 text-emerald-200 px-1.5 py-0.2 rounded font-semibold">
                Fast & Offline
              </span>
            </h4>
            <p className="text-xs text-stone-300 mt-1 leading-relaxed">
              Install to home screen for 1-tap live classroom entry & class reminders.
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-stone-400 hover:text-white p-1 rounded-lg transition"
            aria-label="Dismiss"
          >
            <X size={15} />
          </button>
        </div>

        <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-end gap-2">
          {!notificationsGranted && (
            <button
              onClick={handleEnableNotifications}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-stone-200 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Bell size={13} className="text-amber-400" />
              <span>Reminders</span>
            </button>
          )}

          {deferredPrompt && (
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition cursor-pointer"
            >
              <Download size={13} />
              <span>Install App</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
