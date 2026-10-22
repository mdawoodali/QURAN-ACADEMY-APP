"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Sect = "sunni" | "shia";

interface SectContextType {
  sect: Sect | null;
  setSect: (sect: Sect) => void;
  isSunni: boolean;
  isShia: boolean;
}

const SectContext = createContext<SectContextType | undefined>(undefined);

export function SectProvider({ children }: { children: React.ReactNode }) {
  const [sect, setSectState] = useState<Sect | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("user_sect") as Sect | null;
      const initialSect = (stored === "sunni" || stored === "shia") ? stored : "sunni";
      queueMicrotask(() => setSectState(initialSect));
    } catch {
      queueMicrotask(() => setSectState("sunni"));
    }
  }, []);

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

  return (
    <SectContext.Provider
      value={{
        sect,
        setSect,
        isSunni: sect === "sunni" || sect === null,
        isShia: sect === "shia",
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
