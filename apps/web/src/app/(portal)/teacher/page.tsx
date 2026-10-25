"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Video, Clock, BookOpen, User } from "lucide-react";

interface UpcomingClass {
  studentName: string;
  course: string;
  time: string;
  day: string;
  classroomSlug: string;
}

export default function TeacherDashboard() {
  const [upcoming, setUpcoming] = useState<UpcomingClass>({
    studentName: "Enrolled Student",
    course: "Quran Reading & Tajweed",
    time: "17:00 – 17:30 (PKT)",
    day: "TODAY",
    classroomSlug: "demo",
  });
  const [scheduledCount, setScheduledCount] = useState(0);
  const [monthlyEarnings, setMonthlyEarnings] = useState("PKR 0");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/scheduling?_t=${Date.now()}`, { cache: "no-store", headers: { "Cache-Control": "no-cache" } }).then((r) => r.json()).catch(() => ({ schedules: [] })),
      fetch(`/api/payouts?_t=${Date.now()}`, { cache: "no-store", headers: { "Cache-Control": "no-cache" } }).then((r) => r.json()).catch(() => ({ payouts: [] }))
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
        }

        const payouts = payoutData.payouts || [];
        if (payouts.length > 0) {
          const latest = payouts[0];
          const rawPayable = latest.payable_amount ?? latest.payableAmount ?? (typeof latest.payable === "string" ? parseFloat(latest.payable.replace(/[^0-9.]/g, "")) : latest.payable) ?? 0;
          setMonthlyEarnings(`PKR ${Number(rawPayable).toLocaleString()}`);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full text-white">
      {/* Sub-Navbar */}
      <div className="flex gap-4 border-b border-white/10 pb-3 text-sm font-bold mb-8 overflow-x-auto">
        <Link
          href="/teacher"
          className="text-amber-300 border-b-2 border-amber-400 pb-2 px-2 transition font-bold"
        >
          Today
        </Link>
        <Link href="/teacher/schedule" className="text-emerald-100/70 hover:text-white px-2 py-1 transition">
          Weekly Schedule
        </Link>
        <Link href="/teacher/students" className="text-emerald-100/70 hover:text-white px-2 py-1 transition">
          My Students &amp; Notes
        </Link>
        <Link href="/teacher/earnings" className="text-emerald-100/70 hover:text-white px-2 py-1 transition">
          Earnings &amp; Bank Payouts
        </Link>
      </div>

      {/* Greeting */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-3xl md:text-4xl font-serif text-white">Assalamu alaikum, Demo Teacher</h1>
          
        </div>
        <p className="text-emerald-100/80 text-sm">Your teaching agenda, lesson notes, and student progress in one unified cockpit.</p>
      </div>

      {/* Main Focus Row: Next Class (Hero) + This Week KPI */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        {/* Next Class Hero Card */}
        <div className="flex-1 glass-container rounded-3xl p-6 md:p-8 border border-amber-400/30 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-700/20 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="bg-amber-400/20 text-amber-300 font-bold text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full inline-block mb-6 border border-amber-400/30">
              NEXT CLASS • {upcoming.day}
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
                Qaida &amp; Recitation
              </span>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-white/10">
            <Link
              href={`/classroom/${upcoming.classroomSlug}?role=teacher`}
              className="bg-amber-400 hover:bg-amber-300 text-emerald-950 px-8 py-3.5 rounded-xl font-bold transition shadow-lg flex items-center gap-2 cursor-pointer text-sm"
            >
              <Video className="w-4 h-4" />
              <span>Start Live Class</span>
            </Link>
          </div>
        </div>

        {/* Weekly Teaching Stats Card */}
        <div className="w-full lg:w-80 glass-container rounded-3xl p-6 md:p-8 border border-white/15 shadow-xl flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">Teaching Volume</div>
            <div className="text-4xl font-bold text-white mb-1">
              {loading ? "..." : `${scheduledCount} Classes`}
            </div>
            <p className="text-xs text-emerald-100/80 mb-6">
              {(scheduledCount * 0.5).toFixed(1)} teaching hours scheduled this week
            </p>

            <div className="space-y-3 border-t border-white/10 pt-4 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-emerald-100/75">Active slots:</span>
                <span className="font-bold text-white">{scheduledCount} registered</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-100/75">Curriculum:</span>
                <span className="font-bold text-emerald-300">Up to Date</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-100/75">Notes awaiting:</span>
                <span className="font-bold text-emerald-300">Synchronized</span>
              </div>
            </div>
          </div>

          <Link
            href="/teacher/schedule"
            className="mt-6 w-full text-center py-2.5 rounded-xl bg-black/40 hover:bg-black/60 text-emerald-100 hover:text-white border border-white/10 text-xs font-bold transition"
          >
            Manage Weekly Availability →
          </Link>
        </div>
      </div>

      {/* Lesson Details Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          href="/teacher/students"
          className="glass-container rounded-3xl p-6 border border-white/15 shadow-xl block text-white group hover:border-amber-400/40 transition-all"
        >
          <h3 className="text-xs font-bold text-amber-300 uppercase tracking-widest mb-2">Active Syllabus</h3>
          <div className="text-xl font-bold text-white mb-1 group-hover:text-amber-200 transition-colors">
            {upcoming.course}
          </div>
          <p className="text-xs text-emerald-100/80">{upcoming.studentName} • Interactive Mushaf Board →</p>
        </Link>

        <div className="glass-container rounded-3xl p-6 border border-white/15 shadow-xl text-white">
          <h3 className="text-xs font-bold text-amber-300 uppercase tracking-widest mb-2">Classroom Status</h3>
          <div className="text-xl font-bold text-white mb-1">Interactive Classroom</div>
          <p className="text-xs text-emerald-100/80">Digital Mushaf &amp; Tajweed tools ready</p>
        </div>

        <Link
          href="/teacher/earnings"
          className="glass-container rounded-3xl p-6 border border-white/15 shadow-xl text-white group hover:border-amber-400/40 transition-all"
        >
          <h3 className="text-xs font-bold text-amber-300 uppercase tracking-widest mb-2">Monthly Payable</h3>
          <div className="text-xl font-bold text-white mb-1 group-hover:text-amber-200 transition-colors">
            {monthlyEarnings}
          </div>
          <p className="text-xs text-emerald-100/80">Direct bank settlement ledger →</p>
        </Link>
      </div>
    </div>
  );
}
