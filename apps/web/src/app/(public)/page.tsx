"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import WelcomeSplash from "@/components/WelcomeSplash";
import HomeView from "@/components/HomeView";

export default function Home() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    try {
      localStorage.removeItem("welcome_dismissed");

      const searchParams = new URLSearchParams(window.location.search);
      const forceSplash = searchParams.get("welcome") === "true" || searchParams.get("splash") === "true";
      const dismissed = sessionStorage.getItem("welcome_dismissed") === "true";

      if (forceSplash || !dismissed) {
        queueMicrotask(() => setShowSplash(true));
      }
    } catch {
      queueMicrotask(() => setShowSplash(false));
    }
  }, []);

  const handleDismiss = (sect?: "sunni" | "shia") => {
    setShowSplash(false);
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("welcome_dismissed", "true");
      } catch {
        // safe fallback
      }
    }
    if (sect === "shia") {
      router.push("/shia/home");
    } else if (sect === "sunni") {
      router.push("/sunni/home");
    }
  };

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <WelcomeSplash onGetStarted={handleDismiss} />
        )}
      </AnimatePresence>

      <HomeView />
    </>
  );
}
