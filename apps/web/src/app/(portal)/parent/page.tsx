"use client";

import { useState, useEffect } from "react";
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

export default function ParentPortal() {
  const [children, setChildren] = useState<ChildSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/enrolments?_t=${Date.now()}`, { cache: "no-store", headers: { "Cache-Control": "no-cache" } }).then((r) => r.json()).catch(() => ({ enrolments: [] })),
      fetch(`/api/scheduling?_t=${Date.now()}`, { cache: "no-store", headers: { "Cache-Control": "no-cache" } }).then((r) => r.json()).catch(() => ({ schedules: [] }))
    ])
      .then(([enrolData, schedData]) => {
        const enrolments = enrolData.enrolments || [];
        const schedules = schedData.schedules || [];

        let list: ChildSummary[] = [];
        if (enrolments.length > 0) {
          list = enrolments.map((en: any, idx: number) => {
            const name = en.student_name || en.learner || "Learner";
            const initials = name
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            const schedMatch = schedules.find((s: any) => s.studentName === name || s.learner === name);

            return {
              name,
              initials: initials || "LK",
              age: en.student_age || en.age || 10,
              course: en.course_title || en.programme || "Quran Reading & Tajweed",
              nextLessonDay: schedMatch?.dayOfWeek || "Wednesday",
              nextLessonTime: schedMatch ? `${schedMatch.startTimeLocal} – 17:30` : "17:00 – 17:30",
              progressPercent: idx === 0 ? 75 : 88,
              classroomSlug: name.toLowerCase().split(" ")[0] || "demo",
            };
          });
        } else {
          list = [
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
            },
            {
              name: "Amina Khan",
              initials: "AK",
              age: 10,
              course: "Tajweed Fluency & Recitation",
              nextLessonDay: "Wednesday",
              nextLessonTime: "17:00 – 17:30",
              progressPercent: 82,
              classroomSlug: "amina"
            },
            {
              name: "Omar Ali",
              initials: "OA",
              age: 11,
              course: "Quran Memorisation (Juz Amma)",
              nextLessonDay: "Tuesday",
              nextLessonTime: "16:30 – 17:00",
              progressPercent: 70,
              classroomSlug: "omar"
            }
          ];
        }

        // Prioritize parent-selected ward from registration
        const matchWard = typeof document !== "undefined" ? document.cookie.match(/selected_ward=([^;]+)/) : null;
        const selectedWardName = matchWard ? decodeURIComponent(matchWard[1]).trim() : null;
        if (selectedWardName) {
          const existingIdx = list.findIndex(c => c.name.toLowerCase() === selectedWardName.toLowerCase());
          if (existingIdx > -1) {
            const [item] = list.splice(existingIdx, 1);
            list.unshift(item);
          } else {
            list.unshift({
              name: selectedWardName,
              initials: selectedWardName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() || "W",
              age: 9,
              course: "Quran Reading for Kids (Noorani Qaida)",
              nextLessonDay: "Wednesday",
              nextLessonTime: "17:00 – 17:30",
              progressPercent: 80,
              classroomSlug: selectedWardName.toLowerCase().split(" ")[0] || "demo",
            });
          }
        }
        setChildren(list);
      })
      .catch((err) => console.error("Failed to load family dashboard:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 text-white">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl md:text-4xl font-serif text-white">Family Learning Hub</h1>
            
          </div>
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
        {loading ? (
          <div className="col-span-2 py-12 text-center text-xs text-emerald-100/60 glass-container rounded-3xl border border-white/10">
            Loading family profiles from database...
          </div>
        ) : (
          children.map((child) => (
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
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-white">{child.name}</h3>
                      {typeof document !== "undefined" && document.cookie.includes("selected_ward=" + encodeURIComponent(child.name)) && (
                        <span className="text-[10px] bg-amber-400 text-emerald-950 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                          Linked Ward
                        </span>
                      )}
                    </div>
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
                  className="bg-black/40 hover:bg-black/60 text-emerald-100 hover:text-white border border-white/15 py-3 rounded-xl font-bold text-xs transition text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <TrendingUp size={14} className="text-amber-300" />
                  <span>View Progress</span>
                </Link>

                <Link
                  href={`/classroom/${child.classroomSlug}?role=observer&child=${encodeURIComponent(child.name)}`}
                  className="bg-amber-400 hover:bg-amber-300 text-emerald-950 py-3 rounded-xl font-bold text-xs transition text-center shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye size={14} />
                  <span>Join Observer</span>
                </Link>
              </div>
            </div>
          ))
        )}
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
              <div className="text-[11px] text-emerald-100/70">Direct wire &amp; Raast</div>
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
              <div className="text-[11px] text-emerald-100/70">Assistance &amp; privacy</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
