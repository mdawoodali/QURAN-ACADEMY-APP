"use client";

import { Plus, CreditCard, PlaySquare, TrendingUp, HelpCircle, Eye } from "lucide-react";
import Link from "next/link";

interface ChildSummary {
  name: string;
  initials: string;
  age: number;
  course: string;
  nextLessonDay: string;
  nextLessonTime: string;
  progressPercent: number;
  classroomSlug: string;
}

const CHILDREN: ChildSummary[] = [
  {
    name: "Yusuf Khan",
    initials: "YK",
    age: 9,
    course: "Quran Reading for Kids (Noorani Qaida)",
    nextLessonDay: "Wednesday",
    nextLessonTime: "17:00 – 17:30",
    progressPercent: 75,
    classroomSlug: "yusuf"
  },
  {
    name: "Hana Khan",
    initials: "HK",
    age: 12,
    course: "Hifz & Tajweed Memorisation",
    nextLessonDay: "Thursday",
    nextLessonTime: "18:00 – 18:45",
    progressPercent: 88,
    classroomSlug: "hana"
  }
];

export default function ParentPortal() {
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 text-white">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif text-white mb-2">Family Learning Hub</h1>
          <p className="text-emerald-100/80 text-sm">
            Manage your family's lessons, track child recitation milestones, and handle tuition securely.
          </p>
        </div>

        <Link
          href="/register/student"
          className="bg-amber-400 hover:bg-amber-300 text-emerald-950 px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} />
          <span>Enrol Another Child</span>
        </Link>
      </header>

      {/* Children Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {CHILDREN.map((child) => (
          <div
            key={child.name}
            className="glass-container rounded-3xl p-6 md:p-8 border border-white/15 shadow-2xl flex flex-col justify-between hover:border-amber-400/30 transition-all"
          >
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-900/80 border border-amber-400/40 text-amber-300 flex items-center justify-center font-bold text-lg shadow-md shrink-0">
                  {child.initials}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{child.name}</h3>
                  <p className="text-xs text-emerald-100/75">{child.age} years • {child.course}</p>
                </div>
              </div>

              {/* Progress and Next Lesson */}
              <div className="mb-6 p-4 rounded-2xl bg-black/35 border border-white/10">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="font-semibold text-amber-300">Next Lesson:</span>
                  <span className="text-emerald-100 font-bold">{child.nextLessonDay}, {child.nextLessonTime}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-emerald-100/70 mb-2">
                  <span>Curriculum Progress</span>
                  <span className="text-amber-300 font-bold">{child.progressPercent}%</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-700"
                    style={{ width: `${child.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link
                href="/parent/progress"
                className="bg-black/40 hover:bg-black/60 text-emerald-100 hover:text-white border border-white/15 py-3 rounded-xl font-bold text-xs transition text-center flex items-center justify-center gap-1.5"
              >
                <TrendingUp size={14} className="text-amber-300" />
                <span>View Progress</span>
              </Link>

              <Link
                href={`/classroom/demo?role=observer&child=${encodeURIComponent(child.name)}`}
                className="bg-amber-400 hover:bg-amber-300 text-emerald-950 py-3 rounded-xl font-bold text-xs transition text-center shadow-md flex items-center justify-center gap-1.5"
              >
                <Eye size={14} />
                <span>Join Observer</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Access Matrix */}
      <div className="glass-container rounded-3xl p-6 md:p-8 border border-white/15 shadow-xl">
        <h2 className="text-lg font-bold font-serif text-white mb-6">Family Management Tools</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/parent/classes"
            className="p-4 rounded-2xl bg-black/35 border border-white/10 hover:border-amber-400/40 transition flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-900/60 border border-emerald-500/30 flex items-center justify-center text-amber-300 shrink-0 group-hover:scale-105 transition-transform">
              <PlaySquare size={18} />
            </div>
            <div>
              <div className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">Class Timetable</div>
              <div className="text-[11px] text-emerald-100/70">Weekly recurring slots</div>
            </div>
          </Link>

          <Link
            href="/parent/progress"
            className="p-4 rounded-2xl bg-black/35 border border-white/10 hover:border-amber-400/40 transition flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-900/60 border border-emerald-500/30 flex items-center justify-center text-amber-300 shrink-0 group-hover:scale-105 transition-transform">
              <TrendingUp size={18} />
            </div>
            <div>
              <div className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">Academic Reports</div>
              <div className="text-[11px] text-emerald-100/70">Monthly PDF certificates</div>
            </div>
          </Link>

          <Link
            href="/parent/billing"
            className="p-4 rounded-2xl bg-black/35 border border-white/10 hover:border-amber-400/40 transition flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-900/60 border border-emerald-500/30 flex items-center justify-center text-amber-300 shrink-0 group-hover:scale-105 transition-transform">
              <CreditCard size={18} />
            </div>
            <div>
              <div className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">Family Tuition</div>
              <div className="text-[11px] text-emerald-100/70">Direct wire & Raast</div>
            </div>
          </Link>

          <Link
            href="/parent/support"
            className="p-4 rounded-2xl bg-black/35 border border-white/10 hover:border-amber-400/40 transition flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-900/60 border border-emerald-500/30 flex items-center justify-center text-amber-300 shrink-0 group-hover:scale-105 transition-transform">
              <HelpCircle size={18} />
            </div>
            <div>
              <div className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">Safeguarding Desk</div>
              <div className="text-[11px] text-emerald-100/70">Assistance & privacy</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
