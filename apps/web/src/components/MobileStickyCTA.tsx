"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, MessageCircle } from "lucide-react";

export default function MobileStickyCTA() {
  const pathname = usePathname();

  // Hide in portal (dashboard) and live classroom pages where full screen is needed
  if (
    pathname.startsWith("/student") ||
    pathname.startsWith("/teacher") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/parent") ||
    pathname.startsWith("/classroom") ||
    pathname === "/trial"
  ) {
    return null;
  }

  return (
    <aside aria-label="Mobile actions" className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-[#021811]/95 border-t border-white/10 backdrop-blur-lg px-4 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] shadow-2xl flex items-center gap-2.5">
      <a
        href="https://wa.me/+13305975880"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-amber-300 border border-amber-400/30 text-xs font-bold transition shrink-0"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-4 h-4 fill-amber-300 text-emerald-950" />
        <span>WhatsApp</span>
      </a>

      <Link
        href="/trial"
        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 text-xs font-bold shadow-md transition text-center"
      >
        <Calendar className="w-4 h-4" />
        <span>Book Free Trial</span>
      </Link>
    </aside>
  );
}
