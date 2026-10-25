"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export type Sect = "sunni" | "shia";

interface SectContextType {
  sect: Sect | null;
  setSect: (sect: Sect) => void;
  isSunni: boolean;
  isShia: boolean;
}

const SectContext = createContext<SectContextType | undefined>(undefined);

export function SectProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sect, setSectState] = useState<Sect | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (pathname?.startsWith("/shia")) {
        setSectState("shia");
        localStorage.setItem("user_sect", "shia");
        document.cookie = `user_sect=shia; path=/; max-age=31536000; SameSite=Lax`;
        return;
      }
      if (pathname?.startsWith("/sunni")) {
        setSectState("sunni");
        localStorage.setItem("user_sect", "sunni");
        document.cookie = `user_sect=sunni; path=/; max-age=31536000; SameSite=Lax`;
        return;
      }
      const stored = localStorage.getItem("user_sect") as Sect | null;
      const initialSect = (stored === "sunni" || stored === "shia") ? stored : "sunni";
      queueMicrotask(() => setSectState(initialSect));
    } catch {
      queueMicrotask(() => setSectState("sunni"));
    }
  }, [pathname]);

  const setSect = (newSect: Sect) => {
    setSectState(newSect);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("user_sect", newSect);
        document.cookie = `user_sect=${newSect}; path=/; max-age=31536000; SameSite=Lax`;
      } catch {
        // safe fallback
      }
    }
  };

  const isExplicitShia = pathname?.startsWith("/shia") || sect === "shia";
  const isExplicitSunni = pathname?.startsWith("/sunni") || (!isExplicitShia);

  return (
    <SectContext.Provider
      value={{
        sect: isExplicitShia ? "shia" : "sunni",
        setSect,
        isSunni: isExplicitSunni,
        isShia: isExplicitShia,
      }}
    >
      {children}
    </SectContext.Provider>
  );
}

export function useSect() {
  const context = useContext(SectContext);
  if (!context) {
    return {
      sect: "sunni" as Sect,
      setSect: () => {},
      isSunni: true,
      isShia: false,
    };
  }
  return context;
}
