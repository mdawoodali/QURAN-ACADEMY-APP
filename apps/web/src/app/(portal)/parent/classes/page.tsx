"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Clock, Video, Eye, ShieldCheck, User, Database } from "lucide-react";

interface ChildClass {
  id: string;
  childName: string;
  childInitials: string;
  course: string;
  teacherName: string;
  dayOfWeek: string;
  time: string;
  duration: string;
  status: "upcoming" | "in_progress" | "scheduled";
  lessonTopic: string;
  classroomSlug: string;
}

export default function ParentClasses() {
  const [classes, setClasses] = useState<ChildClass[]>([]);
  const [selectedChild, setSelectedChild] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/scheduling")
      .then((res) => res.json())
      .then((data) => {
        const schedules = data.schedules || [];
        if (schedules.length > 0) {
          const mapped: ChildClass[] = schedules.map((s: any, idx: number) => {
            const name = s.studentName || "Learner";
            const initials = name
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return {
              id: s.id || `cls_${idx}`,
              childName: name,
              childInitials: initials || "LK",
              course: s.subject || "Quran & Tajweed Recitation",
              teacherName: s.teacherName || "Ustadha Maryam",
              dayOfWeek: s.dayOfWeek || "Monday",
              time: `${s.startTimeLocal || "17:00"} – 17:30`,
              duration: `${s.durationMinutes || 30} mins`,
              status: idx === 0 ? "upcoming" : "scheduled",
              lessonTopic: "Quran Reading & Tajweed Fluency",
              classroomSlug: name.toLowerCase().split(" ")[0] || "demo",
            };
          });
          setClasses(mapped);
        } else {
          // Clean default family timetable if no schedules logged yet
          setClasses([
            {
              id: "cls_1",
              childName: "Yusuf Khan",
              childInitials: "YK",
              course: "Quran Reading & Noorani Qaida",
              teacherName: "Ustadha Maryam",
              dayOfWeek: "Wednesday",
              time: "17:00 – 17:30",
              duration: "30 mins",
              status: "upcoming",
              lessonTopic: "Lesson 3: Joined Letters & Throat Makhaarij",
              classroomSlug: "yusuf"
            },
            {
              id: "cls_2",
              childName: "Hana Khan",
              childInitials: "HK",
              course: "Hifz & Tajweed Memorisation",
              teacherName: "Sheikh Bilal",
              dayOfWeek: "Thursday",
              time: "18:00 – 18:45",
              duration: "45 mins",
              status: "scheduled",
              lessonTopic: "Surah An-Naba: Verses 1–20 Revision & Sabaq",
              classroomSlug: "hana"
            }
          ]);
        }
      })
      .catch((err) => console.error("Failed to load family classes:", err))
      .finally(() => setLoading(false));
  }, []);

  const uniqueChildren = Array.from(new Set(classes.map((c) => c.childName)));

  const filteredClasses = selectedChild === "all" 
    ? classes 
    : classes.filter((c) => c.childName === selectedChild);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl md:text-4xl font-serif text-white">Family Class Schedule</h1>
            <span className="flex items-center gap-1 text-[11px] font-bold bg-emerald-950/80 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full">
              <Database size={12} />
              <span>Database Backed</span>
            </span>
          </div>
          <p className="text-emerald-100/80 text-sm">
            Monitor your children's live lessons, join unannounced as a silent observer, and review weekly timetables.
          </p>
        </div>

        {/* Child Filter Tabs */}
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 text-xs font-bold flex-wrap">
          <button
            onClick={() => setSelectedChild("all")}
            className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
              selectedChild === "all"
                ? "bg-amber-400 text-emerald-950 shadow-md font-bold"
                : "text-emerald-100/70 hover:text-white"
            }`}
          >
            All Children ({classes.length})
          </button>
          {uniqueChildren.map((name) => (
            <button
              key={name}
              onClick={() => setSelectedChild(name)}
              className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
                selectedChild === name
                  ? "bg-amber-400 text-emerald-950 shadow-md font-bold"
                  : "text-emerald-100/70 hover:text-white"
              }`}
            >
              {name.split(" ")[0]} ({classes.filter((c) => c.childName === name).length})
            </button>
          ))}
        </div>
      </div>

      {/* Safeguarding Notice Banner */}
      <div className="glass-container rounded-2xl p-4 sm:p-5 mb-8 border border-amber-400/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-white text-sm flex items-center gap-2">
              <span>Parent Observer Mode Enabled</span>
              <span className="text-[10px] bg-emerald-900/80 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                100% Anonymous
              </span>
            </div>
            <p className="text-xs text-emerald-100/75 mt-0.5">
              Parents can enter live classes at any moment as silent observers without disturbing the student's recitation focus.
            </p>
          </div>
        </div>
        <Link
          href="/parent/support"
          className="text-xs font-bold text-amber-300 hover:text-amber-200 transition underline underline-offset-4 shrink-0"
        >
          Adjust Timetable &amp; Support →
        </Link>
      </div>

      {/* Classes List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-12 text-center text-xs text-emerald-100/60 glass-container rounded-3xl border border-white/10">
            Loading family timetable from database...
          </div>
        ) : filteredClasses.length === 0 ? (
          <div className="py-12 text-center text-xs text-emerald-100/60 glass-container rounded-3xl border border-white/10">
            No classes scheduled for this filter.
          </div>
        ) : (
          filteredClasses.map((cls) => (
            <div
              key={cls.id}
              className="glass-container rounded-3xl p-6 border border-white/15 shadow-xl hover:border-amber-400/30 transition-all flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
            >
              {/* Left: Child & Schedule Info */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-900/80 border border-amber-400/40 text-amber-300 flex items-center justify-center font-bold text-sm shrink-0 shadow-md">
                  {cls.childInitials}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-lg font-bold text-white">{cls.childName}</h3>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950/70 text-emerald-200 border border-emerald-500/30">
                      {cls.course}
                    </span>
                    {cls.status === "upcoming" && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-emerald-950 animate-pulse">
                        Next Up
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-emerald-100/80 mb-2">
                    Instructor: <strong className="text-white">{cls.teacherName}</strong> &bull; Topic: {cls.lessonTopic}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-emerald-200/90 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-amber-300" />
                      <span>{cls.dayOfWeek}</span>
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} className="text-amber-300" />
                      <span>{cls.time} ({cls.duration})</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
                <Link
                  href={`/classroom/${cls.classroomSlug}?role=observer`}
                  className="bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border border-emerald-500/30 px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                  title="Silent Parent Observation Mode"
                >
                  <Eye size={14} />
                  <span>Observe Silently</span>
                </Link>

                <Link
                  href={`/classroom/${cls.classroomSlug}`}
                  className="bg-amber-400 hover:bg-amber-300 text-emerald-950 px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Video size={14} />
                  <span>Join Classroom</span>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
