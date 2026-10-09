import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-page)] flex flex-col font-sans">
      <header className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-[var(--color-line)]">
        <div className="max-w-[1280px] mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-[var(--color-green-900)] p-2 rounded-xl text-white">
              <BookOpen size={24} />
            </div>
            <span className="font-serif font-bold text-xl text-[var(--color-green-900)] tracking-tight">Quran Academy</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 text-[var(--color-ink)] font-medium text-sm">
            <Link href="/programmes" className="hover:text-[var(--color-green-600)] transition">Programmes</Link>
            <Link href="/how-it-works" className="hover:text-[var(--color-green-600)] transition">How it works</Link>
            <Link href="/packages" className="hover:text-[var(--color-green-600)] transition">Packages</Link>
            <Link href="/teach-with-us" className="hover:text-[var(--color-green-600)] transition">Teach with us</Link>
          </nav>
          
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 text-sm font-bold text-[var(--color-muted)]">
              <button className="text-[var(--color-ink)]">EN</button>
              <span className="opacity-50">|</span>
              <button className="hover:text-[var(--color-ink)]">UR</button>
            </div>
            <Link href="/login" className="hidden sm:block text-sm font-bold text-[var(--color-green-600)] hover:text-[var(--color-green-900)]">Log in</Link>
            <Link href="/trial" className="bg-[var(--color-green-600)] hover:bg-[var(--color-green-900)] text-white text-sm font-bold px-6 py-2.5 rounded-full transition shadow-sm">
              Book a free trial
            </Link>
          </div>
        </div>
      </header>
      
      {children}
    </div>
  );
}
