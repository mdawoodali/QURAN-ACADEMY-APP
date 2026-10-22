"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, PlaySquare, Book, TrendingUp, CreditCard, User, HelpCircle, BookOpen, X, LogOut } from "lucide-react";
import { createBrowserClient } from '@supabase/ssr'
import { useLanguage } from './LanguageContext';

const STUDENT_LINKS = [
  { href: "/student", label: "Home", icon: Home },
  { href: "/student/classes", label: "Classes", icon: PlaySquare },
  { href: "/student/quran", label: "Quran & Duas", icon: Book },
  { href: "/student/progress", label: "Progress", icon: TrendingUp },
  { href: "/student/billing", label: "Billing", icon: CreditCard },
  { href: "/student/profile", label: "Profile", icon: User },
  { href: "/student/support", label: "Support", icon: HelpCircle },
];

const TEACHER_LINKS = [
  { href: "/teacher", label: "Schedule", icon: Home },
  { href: "/teacher/students", label: "My Students", icon: User },
  { href: "/teacher/earnings", label: "Earnings", icon: CreditCard },
];

const ADMIN_LINKS = [
  { href: "/admin", label: "Overview", icon: Home },
  { href: "/admin/enrolments", label: "Enrolments", icon: Book },
  { href: "/admin/scheduling", label: "Scheduling", icon: PlaySquare },
  { href: "/admin/teachers", label: "Teachers", icon: User },
  { href: "/admin/finance", label: "Finance", icon: CreditCard },
];

const PARENT_LINKS = [
  { href: "/parent", label: "Family", icon: Home },
  { href: "/parent/classes", label: "Classes", icon: PlaySquare },
  { href: "/parent/progress", label: "Progress", icon: TrendingUp },
  { href: "/parent/billing", label: "Billing", icon: CreditCard },
  { href: "/parent/support", label: "Support", icon: HelpCircle },
];

export default function Sidebar({ onClose, role, userName, initials }: { onClose?: () => void; role?: string; userName?: string; initials?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy'
  );

  let links = STUDENT_LINKS;
  let portalName = "STUDENT";

  if (pathname.startsWith("/teacher") || role === "teacher") {
    links = TEACHER_LINKS;
    portalName = "TEACHER";
  } else if (pathname.startsWith("/admin") || role === "admin") {
    links = ADMIN_LINKS;
    portalName = "ADMIN";
  } else if (pathname.startsWith("/parent") || role === "parent") {
    links = PARENT_LINKS;
    portalName = "PARENT";
  }

  const handleSignOut = async () => {
    document.cookie = "demo_role=; path=/; max-age=0";
    document.cookie = "demo_user=; path=/; max-age=0";
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="w-64 h-full bg-black/45 backdrop-blur-xl border-r border-white/10 text-white flex flex-col shadow-2xl">
      <div className="p-6 flex items-start justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-emerald-800/80 border border-amber-400/40 p-2 rounded-xl text-amber-300 shadow-sm">
            <BookOpen size={24} />
          </div>
          <span className="font-serif font-bold text-lg tracking-tight leading-tight text-white">
            Quran<br />Academy
          </span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="md:hidden text-white/70 hover:text-white p-1 -mr-2">
            <X size={24} />
          </button>
        )}
      </div>

      <div className="px-6 py-4">
        <div className="text-[10px] font-bold text-amber-300 tracking-widest uppercase mb-4">
          {portalName}
        </div>
        <nav className="space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  isActive
                    ? "bg-white/15 text-amber-300 font-bold border border-white/10 shadow-xs"
                    : "text-emerald-100/80 hover:bg-white/10 hover:text-white font-medium"
                }`}
              >
                <Icon size={18} className={isActive ? "text-amber-300" : "opacity-75"} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 flex flex-col gap-4 border-t border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm">
            {initials || 'U'}
          </div>
          <div className="text-sm font-bold text-emerald-100 cursor-pointer hover:text-white transition line-clamp-1">
            {userName || 'Account'}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <button onClick={handleSignOut} className="text-left text-sm font-bold text-red-300 hover:text-red-400 transition flex items-center gap-2">
            <LogOut size={16} />
            Sign Out
          </button>
          
          <button 
            onClick={() => setLanguage(language === "en" ? "ur" : "en")} 
            className="text-xs font-bold bg-emerald-900/60 text-emerald-100 hover:text-white px-2.5 py-1.5 rounded-lg border border-emerald-700/50 transition flex items-center gap-1.5 cursor-pointer" 
            dir="ltr"
          >
            <span className={language === "en" ? "text-white font-extrabold" : "text-emerald-300"}>EN</span>
            <span className="opacity-40">/</span>
            <span dir="rtl" className={`font-urdu text-sm ${language === "ur" ? "text-white font-extrabold" : "text-emerald-300"}`}>اردو</span>
          </button>
        </div>
      </div>
    </div>
  );
}
