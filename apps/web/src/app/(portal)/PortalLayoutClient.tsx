"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Menu } from "lucide-react";

export default function PortalLayoutClient({ 
  children,
  userName
}: { 
  children: React.ReactNode,
  userName: string
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Generate initials for avatar
  const initials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'U';

  return (
    <div className="flex h-screen bg-transparent overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar with mobile slide-in */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <Sidebar onClose={() => setMobileMenuOpen(false)} userName={userName} initials={initials} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-black/35 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 md:px-8 shrink-0 relative z-30">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden text-white hover:text-amber-300 transition p-2 -ml-2"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="font-serif font-bold text-white text-base tracking-wide hidden sm:block">Portal Dashboard</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs font-bold text-amber-300 bg-emerald-950/70 border border-amber-400/30 px-3.5 py-1.5 rounded-full hidden sm:block shadow-xs">Asia/Karachi</div>
            <div className="w-9 h-9 rounded-full bg-emerald-800/80 border border-amber-400/40 text-amber-300 flex items-center justify-center font-bold text-sm shadow-md">
              {initials}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
