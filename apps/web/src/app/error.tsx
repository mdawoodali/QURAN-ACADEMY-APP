"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home, MessageSquare } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log exception to local telemetry console
    console.error("[Academy Application Error Boundary Caught]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#021811] text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#052b20]/90 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-center flex flex-col items-center">
        {/* Luminous Warning Icon */}
        <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-5 shadow-lg shadow-amber-500/5">
          <AlertCircle className="w-8 h-8" />
        </div>

        <span className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-1">
          Temporary Session Interruption
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif text-white font-bold mb-3">
          Something interrupted this page
        </h1>
        <p className="text-sm text-emerald-100/75 leading-relaxed mb-6">
          A client component or network request encountered a temporary issue. Your progress, enrollments, and account details remain safe in the system.
        </p>

        {error.digest && (
          <div className="bg-black/30 border border-white/10 rounded-xl px-3 py-1.5 mb-6 text-[11px] font-mono text-emerald-300/80">
            Reference Token: {error.digest}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={() => reset()}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-bold py-3 px-4 rounded-xl shadow-lg transition-all active:scale-[0.98] cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold py-3 px-4 rounded-xl transition-all cursor-pointer"
          >
            <Home className="w-4 h-4 text-emerald-300" />
            <span>Go to Home</span>
          </Link>
        </div>

        {/* WhatsApp Emergency Hotline */}
        <div className="mt-6 pt-5 border-t border-white/10 w-full flex items-center justify-center gap-2 text-xs text-emerald-200/70">
          <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
          <span>Need urgent assistance? </span>
          <a
            href="https://wa.me/+442032899880"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-300 font-semibold underline hover:text-amber-200"
          >
            WhatsApp Support
          </a>
        </div>
      </div>
    </div>
  );
}
