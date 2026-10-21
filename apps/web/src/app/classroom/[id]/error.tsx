"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ClassroomErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ClassroomError({ error, reset }: ClassroomErrorProps) {
  useEffect(() => {
    // Log unexpected classroom errors safely for monitoring
    console.error("Classroom error boundary caught an exception:", error);
  }, [error]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-gray-100 animate-in zoom-in-95">
        <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
          ⚠️
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Classroom Session Disrupted</h2>
        <p className="text-sm text-gray-500 mb-6">
          The interactive classroom encountered a temporary device or network interruption. You can restore your session immediately.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="w-full bg-[#0C4A3A] hover:bg-[#09382c] text-white py-3 rounded-xl font-bold transition shadow-xs"
          >
            Reconnect & Resume Session
          </button>
          <Link
            href="/student"
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-bold transition text-sm flex items-center justify-center"
          >
            Return to Student Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
