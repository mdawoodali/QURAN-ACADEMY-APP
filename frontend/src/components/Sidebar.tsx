"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, PlaySquare, Book, TrendingUp, CreditCard, User, HelpCircle, BookOpen, X, LogOut } from "lucide-react";
import { createBrowserClient } from '@supabase/ssr'

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
  { href: "/admin/scheduling", label: "Scheduling", icon: PlaySquare },
  { href: "/admin/teachers", label: "Teachers", icon: User },
  { href: "/admin/finance", label: "Finance", icon: CreditCard },
];

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  let links = STUDENT_LINKS;
  let portalName = "STUDENT";

  if (pathname.startsWith("/teacher")) {
    links = TEACHER_LINKS;
    portalName = "TEACHER";
  } else if (pathname.startsWith("/admin")) {
    links = ADMIN_LINKS;
    portalName = "ADMIN";
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="w-64 h-full bg-[#0C4A3A] text-white flex flex-col shadow-xl">
      <div className="p-6 flex items-start justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-xl">
            <BookOpen size={24} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight leading-tight">
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
        <div className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase mb-4">
          {portalName}
        </div>
        <nav className="space-y-1">
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
                    ? "bg-white/10 text-white font-bold"
                    : "text-emerald-100 hover:bg-white/5 hover:text-white font-medium"
                }`}
              >
                <Icon size={18} className={isActive ? "text-emerald-300" : "opacity-80"} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 flex flex-col gap-4 border-t border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm">
            U
          </div>
          <div className="text-sm font-bold text-emerald-100 cursor-pointer hover:text-white transition">Account</div>
        </div>
        <button onClick={handleSignOut} className="text-left text-sm font-bold text-red-300 hover:text-red-400 transition flex items-center gap-2">
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
