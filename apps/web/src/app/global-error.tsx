"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Academy Critical Global Crash Caught]", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#021811] text-white flex items-center justify-center p-4 font-sans antialiased m-0">
        <div className="max-w-md w-full bg-[#052b20] border border-amber-500/30 rounded-3xl p-8 shadow-2xl text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 mb-5 shadow-lg">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-serif text-white font-bold mb-2">
            Quran Academy Connection Recovered
          </h1>
          <p className="text-sm text-emerald-100/75 leading-relaxed mb-6">
            An unexpected render boundary was tripped on this device. Click below to re-initialize your session smoothly.
          </p>

          <button
            onClick={() => reset()}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-bold py-3.5 px-4 rounded-xl shadow-lg transition active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Application</span>
          </button>
        </div>
      </body>
    </html>
  );
}
