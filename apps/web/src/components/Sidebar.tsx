"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, PlaySquare, Book, TrendingUp, CreditCard, User, HelpCircle, BookOpen, X, LogOut, FileUp, Activity, Mail } from "lucide-react";
import { createClient } from '@/utils/supabase/client'
import { useLanguage } from './LanguageContext';
import { APP_VERSION } from '@quran/contracts';

export default function Sidebar({ onClose, role, userName, initials }: { onClose?: () => void; role?: string; userName?: string; initials?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  
  const supabase = createClient();

  const isTeacher = pathname.startsWith("/teacher") || role === "teacher";
  const isAdmin = pathname.startsWith("/admin") || role === "admin";
  const isParent = pathname.startsWith("/parent") || role === "parent";

  // Role-appropriate display name
  let effectiveName = userName || "Demo Student";
  if (isTeacher && (effectiveName === "Demo Student" || !effectiveName || effectiveName.includes("Maryam Ahmed"))) {
    effectiveName = "Demo Teacher";
  } else if (isAdmin && (effectiveName === "Demo Student" || !effectiveName)) {
    effectiveName = "Super Admin";
  } else if (isParent && (effectiveName === "Demo Student" || !effectiveName)) {
    effectiveName = "Family Guardian";
  }

  // Localized user name
  const localizedUserName =
    effectiveName === "Demo Teacher"
      ? t("demoTeacher")
      : effectiveName === "Demo Student"
      ? t("demoStudent")
      : effectiveName === "Super Admin"
      ? t("superAdmin")
      : effectiveName === "Family Guardian"
      ? t("familyGuardian")
      : effectiveName;

  // Localized Initials
  const effectiveInitials =
    effectiveName === "Demo Teacher"
      ? "DT"
      : effectiveName === "Demo Student"
      ? "DS"
      : effectiveName === "Super Admin"
      ? "SA"
      : initials || (effectiveName.slice(0, 2).toUpperCase() || "U");

  let links = [
    { href: "/student", label: t("navHome"), icon: Home },
    { href: "/student/classes", label: t("navClasses"), icon: PlaySquare },
    { href: "/student/quran", label: t("navQuranDuas"), icon: Book },
    { href: "/student/progress", label: t("navProgress"), icon: TrendingUp },
    { href: "/student/billing", label: t("navBilling"), icon: CreditCard },
    { href: "/student/profile", label: t("navProfile"), icon: User },
    { href: "/student/support", label: t("navSupport"), icon: HelpCircle },
  ];
  let portalName = t("studentPortal").toUpperCase();

  if (isTeacher) {
    links = [
      { href: "/teacher", label: t("navSchedule"), icon: Home },
      { href: "/teacher/students", label: t("navMyStudents"), icon: User },
      { href: "/teacher/earnings", label: t("navEarnings"), icon: CreditCard },
    ];
    portalName = t("teacherPortal").toUpperCase();
  } else if (isAdmin) {
    links = [
      { href: "/admin", label: t("navOverview"), icon: Home },
      { href: "/admin/inquiries", label: t("navInquiries"), icon: Mail },
      { href: "/admin/resources", label: t("navPdfContent"), icon: FileUp },
      { href: "/admin/enrolments", label: t("navEnrolments"), icon: Book },
      { href: "/admin/scheduling", label: t("navScheduling"), icon: PlaySquare },
      { href: "/admin/teachers", label: t("navTeachers"), icon: User },
      { href: "/admin/finance", label: t("navFinance"), icon: CreditCard },
      { href: "/admin/diagnostics", label: t("navDiagnostics"), icon: Activity },
    ];
    portalName = t("adminPortal").toUpperCase();
  } else if (isParent) {
    links = [
      { href: "/parent", label: t("navFamily"), icon: Home },
      { href: "/parent/classes", label: t("navClasses"), icon: PlaySquare },
      { href: "/parent/progress", label: t("navProgress"), icon: TrendingUp },
      { href: "/parent/billing", label: t("navBilling"), icon: CreditCard },
      { href: "/parent/support", label: t("navSupport"), icon: HelpCircle },
    ];
    portalName = t("parentPortal").toUpperCase();
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
      <div className="p-5 sm:p-6 flex items-start justify-between shrink-0">
        <Link 
          href="/" 
          onClick={() => {
            if (typeof window !== "undefined") {
              try {
                sessionStorage.setItem("welcome_dismissed", "true");
              } catch {}
            }
          }}
          className="flex items-center gap-3"
        >
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

      <div className="px-4 sm:px-6 py-2 sm:py-3 flex-1 overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="text-[10px] font-bold text-amber-300 tracking-widest uppercase mb-3 px-1">
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
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition text-sm ${
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

      <div className="mt-auto p-4 sm:p-5 flex flex-col gap-2.5 border-t border-white/10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-emerald-800/80 border border-amber-400/30 text-amber-300 flex items-center justify-center font-bold text-xs shadow-xs">
            {effectiveInitials}
          </div>
          <div className="text-sm font-bold text-emerald-100 cursor-pointer hover:text-white transition line-clamp-1">
            {localizedUserName}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-1">
          <button onClick={handleSignOut} className="text-left text-sm font-bold text-red-300 hover:text-red-400 transition flex items-center gap-2 cursor-pointer">
            <LogOut size={16} />
            {t("signOutLabel")}
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

        {/* Live Version Badge */}
        <div className="flex items-center justify-between text-[11px] text-emerald-300/70 pt-2.5 mt-1 border-t border-emerald-800/40 font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>v{APP_VERSION}</span>
          </span>
          <span className="text-[10px] bg-emerald-950/80 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-700/40">
            {t("liveStatusBadge")}
          </span>
        </div>
      </div>
    </div>
  );
}
