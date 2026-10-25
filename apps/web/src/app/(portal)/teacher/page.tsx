"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Video, Clock, BookOpen, User, Calendar, Plus } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { createClient } from "@/utils/supabase/client";

interface UpcomingClass {
  studentName: string;
  course: string;
  time: string;
  day: string;
  classroomSlug: string;
}

export default function TeacherDashboard() {
  const { t, language } = useLanguage();
  const [teacherName, setTeacherName] = useState<string>("Muhammad Isbah");
  const [upcoming, setUpcoming] = useState<UpcomingClass | null>(null);
  const [scheduledCount, setScheduledCount] = useState(0);
  const [monthlyEarnings, setMonthlyEarnings] = useState("PKR 0");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch current logged-in teacher's actual profile name
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", user.id)
          .single()
          .then(({ data: profile }) => {
            if (profile && (profile.first_name || profile.last_name)) {
              setTeacherName(`${profile.first_name || ""} ${profile.last_name || ""}`.trim());
            } else if (user.user_metadata?.full_name) {
              setTeacherName(user.user_metadata.full_name);
            }
          });
      }
    });

    // 2. Fetch live schedules and earnings without mock fallbacks
    Promise.all([
      fetch(`/api/scheduling?_t=${Date.now()}`, { cache: "no-store", headers: { "Cache-Control": "no-cache" } })
        .then((r) => r.json())
        .catch(() => ({ schedules: [] })),
      fetch(`/api/payouts?_t=${Date.now()}`, { cache: "no-store", headers: { "Cache-Control": "no-cache" } })
        .then((r) => r.json())
        .catch(() => ({ payouts: [] })),
    ])
      .then(([schedData, payoutData]) => {
        const schedules = schedData.schedules || [];
        setScheduledCount(schedules.length);

        if (schedules.length > 0) {
          const first = schedules[0];
          setUpcoming({
            studentName: first.studentName || "Learner",
            course: first.subject || "Noorani Qaida & Tajweed",
            time: `${first.startTimeLocal || "17:00"} (PKT)`,
            day: first.dayOfWeek?.toUpperCase() || "TODAY",
            classroomSlug: (first.studentName || "demo").toLowerCase().split(" ")[0],
          });
        } else {
          setUpcoming(null);
        }

        const payouts = (payoutData.payouts || []).filter((p: any) => {
          if (p.teacherName) return p.teacherName.toLowerCase().includes("isbah");
          return false;
        });
        if (payouts.length > 0) {
          const latest = payouts[0];
          const rawPayable =
            latest.payable_amount ??
            latest.payableAmount ??
            (typeof latest.payable === "string" ? parseFloat(latest.payable.replace(/[^0-9.]/g, "")) : latest.payable) ??
            0;
          setMonthlyEarnings(`PKR ${Number(rawPayable).toLocaleString()}`);
        } else {
          setMonthlyEarnings("PKR 0");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const isUrdu = language === "ur";

  return (
    <div className={`p-4 md:p-8 max-w-6xl mx-auto w-full text-white ${isUrdu ? "font-urdu" : ""}`}>
      {/* Greeting Banner */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-3xl md:text-4xl font-serif text-white">
            {t("greetingAssalamuAlaikum")}, {teacherName}
          </h1>
        </div>
        <p className="text-emerald-100/80 text-sm">
          {t("teachingAgendaDesc")}
        </p>
      </div>

      {/* Main Focus Row: Next Class (Hero) + This Week KPI */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        {/* Next Class Hero Card */}
        <div className="flex-1 glass-container rounded-3xl p-6 md:p-8 border border-amber-400/30 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-700/20 rounded-full blur-3xl pointer-events-none" />

          {upcoming ? (
            <div>
              <div className="bg-amber-400/20 text-amber-300 font-bold text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full inline-block mb-6 border border-amber-400/30">
                {t("nextClassBadge")} • {upcoming.day}
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-white mb-3">
                {upcoming.course}
              </h2>

              <div className="text-emerald-100/90 flex flex-wrap gap-y-2 gap-x-4 text-sm font-medium mb-6">
                <span className="flex items-center gap-1.5">
                  <Clock size={15} className="text-amber-300" />
                  {upcoming.time}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <User size={15} className="text-amber-300" />
                  {upcoming.studentName}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <BookOpen size={15} className="text-amber-300" />
                  {upcoming.course}
                </span>
              </div>

              <div className="flex justify-end pt-4 border-t border-white/10">
                <Link
                  href={`/classroom/${upcoming.classroomSlug}?role=teacher`}
                  className="bg-amber-400 hover:bg-amber-300 text-emerald-950 px-8 py-3.5 rounded-xl font-bold transition shadow-lg flex items-center gap-2 cursor-pointer text-sm"
                >
                  <Video className="w-4 h-4" />
                  <span>{t("launchClassroom")}</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="py-4">
              <div className="bg-emerald-950/80 text-emerald-300 font-bold text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full inline-block mb-4 border border-emerald-500/30">
                {t("nextClassBadge")}
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif text-white mb-2">
                {t("noUpcomingClasses")}
              </h2>
              <p className="text-sm text-emerald-100/70 mb-6 leading-relaxed">
                {t("noUpcomingClassesDesc")}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/teacher/schedule"
                  className="bg-amber-400 hover:bg-amber-300 text-emerald-950 px-6 py-2.5 rounded-xl font-bold transition text-xs flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Plus size={14} />
                  <span>{t("bookNewSlot")}</span>
                </Link>
                <Link
                  href="/teacher/schedule"
                  className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl font-medium transition text-xs flex items-center gap-2 cursor-pointer border border-white/10"
                >
                  <Calendar size={14} />
                  <span>{t("weeklySchedulePreview")}</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Weekly Teaching Stats Card */}
        <div className="w-full lg:w-80 glass-container rounded-3xl p-6 md:p-8 border border-white/15 shadow-xl flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
              {t("thisWeekSessions")}
            </div>
            <div className="text-4xl font-bold text-white mb-1">
              {loading ? "..." : `${scheduledCount}`}
            </div>
            <p className="text-xs text-emerald-100/80 mb-6">
              {(scheduledCount * 0.5).toFixed(1)} {t("hrsPerWeek")} ({scheduledCount} {t("weeklySessionsDesc")})
            </p>

            <div className="space-y-3 border-t border-white/10 pt-4 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-emerald-100/75">{t("bookedLessons")}:</span>
                <span className="font-bold text-white">{scheduledCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-100/75">{t("estMonthlyEarnings")}:</span>
                <span className="font-bold text-amber-300">{monthlyEarnings}</span>
              </div>
            </div>
          </div>

          <Link
            href="/teacher/schedule"
            className="mt-6 w-full text-center py-2.5 rounded-xl bg-black/40 hover:bg-black/60 text-emerald-100 hover:text-white border border-white/10 text-xs font-bold transition"
          >
            {t("scheduleTitle")} →
          </Link>
        </div>
      </div>

      {/* Action / Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          href="/teacher/students"
          className="glass-container rounded-3xl p-6 border border-white/15 shadow-xl block text-white group hover:border-amber-400/40 transition-all"
        >
          <h3 className="text-xs font-bold text-amber-300 uppercase tracking-widest mb-2">
            {t("myStudentsTitle")}
          </h3>
          <div className="text-xl font-bold text-white mb-1 group-hover:text-amber-200 transition-colors">
            {t("navMyStudents")}
          </div>
          <p className="text-xs text-emerald-100/80">{t("myStudentsDesc")} →</p>
        </Link>

        <Link
          href="/teacher/schedule"
          className="glass-container rounded-3xl p-6 border border-white/15 shadow-xl text-white group hover:border-amber-400/40 transition-all"
        >
          <h3 className="text-xs font-bold text-amber-300 uppercase tracking-widest mb-2">
            {t("scheduleTitle")}
          </h3>
          <div className="text-xl font-bold text-white mb-1 group-hover:text-amber-200 transition-colors">
            {t("bookNewSlot")}
          </div>
          <p className="text-xs text-emerald-100/80">{t("scheduleDesc")} →</p>
        </Link>

        <Link
          href="/teacher/earnings"
          className="glass-container rounded-3xl p-6 border border-white/15 shadow-xl text-white group hover:border-amber-400/40 transition-all"
        >
          <h3 className="text-xs font-bold text-amber-300 uppercase tracking-widest mb-2">
            {t("earningsTitle")}
          </h3>
          <div className="text-xl font-bold text-white mb-1 group-hover:text-amber-200 transition-colors">
            {monthlyEarnings}
          </div>
          <p className="text-xs text-emerald-100/80">{t("earningsDesc")} →</p>
        </Link>
      </div>
    </div>
  );
}
