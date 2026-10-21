"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Clock, Video, Eye, ShieldCheck, User } from "lucide-react";

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

const FAMILY_CLASSES: ChildClass[] = [
  {
    id: "cls_1",
    childName: "Yusuf Khan",
    childInitials: "YK",
    course: "Quran Reading & Noorani Qaida",
    teacherName: "Ustadha Maryam Ahmed",
    dayOfWeek: "Wednesday",
    time: "17:00 – 17:30",
    duration: "30 mins",
    status: "upcoming",
    lessonTopic: "Lesson 3: Joined Letters & Throat Makhaarij",
    classroomSlug: "yusuf"
  },
  {
    id: "cls_2",
    childName: "Yusuf Khan",
    childInitials: "YK",
    course: "Quran Reading & Noorani Qaida",
    teacherName: "Ustadha Maryam Ahmed",
    dayOfWeek: "Friday",
    time: "17:00 – 17:30",
    duration: "30 mins",
    status: "scheduled",
    lessonTopic: "Lesson 4: Harakaat & Short Vowels",
    classroomSlug: "yusuf"
  },
  {
    id: "cls_3",
    childName: "Hana Khan",
    childInitials: "HK",
    course: "Hifz & Tajweed Memorisation",
    teacherName: "Sheikh Bilal Hassan",
    dayOfWeek: "Thursday",
    time: "18:00 – 18:45",
    duration: "45 mins",
    status: "scheduled",
    lessonTopic: "Surah An-Naba: Verses 1–20 Revision & Sabaq",
    classroomSlug: "hana"
  },
  {
    id: "cls_4",
    childName: "Hana Khan",
    childInitials: "HK",
    course: "Hifz & Tajweed Memorisation",
    teacherName: "Sheikh Bilal Hassan",
    dayOfWeek: "Saturday",
    time: "10:30 – 11:15",
    duration: "45 mins",
    status: "scheduled",
    lessonTopic: "Surah An-Naziat: Verses 1–15 & Tajweed Waqf Rules",
    classroomSlug: "hana"
  }
];

export default function ParentClasses() {
  const [selectedChild, setSelectedChild] = useState<string>("all");

  const filteredClasses = selectedChild === "all" 
    ? FAMILY_CLASSES 
    : FAMILY_CLASSES.filter(c => c.childName === selectedChild);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl md:text-4xl font-serif text-white">Family Class Schedule</h1>
            <span className="flex items-center gap-1 text-[11px] font-bold bg-emerald-950/80 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full">
              <ShieldCheck size={12} />
              <span>Safeguarded Classroom</span>
            </span>
          </div>
          <p className="text-emerald-100/80 text-sm">
            Monitor your children's live lessons, join unannounced as a silent observer, and review weekly timetables.
          </p>
        </div>

        {/* Child Filter Tabs */}
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 text-xs font-bold">
          <button
            onClick={() => setSelectedChild("all")}
            className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
              selectedChild === "all"
                ? "bg-amber-400 text-emerald-950 shadow-md"
                : "text-emerald-100/70 hover:text-white"
            }`}
          >
            All Children ({FAMILY_CLASSES.length})
          </button>
          <button
            onClick={() => setSelectedChild("Yusuf Khan")}
            className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
              selectedChild === "Yusuf Khan"
                ? "bg-amber-400 text-emerald-950 shadow-md"
                : "text-emerald-100/70 hover:text-white"
            }`}
          >
            Yusuf (2)
          </button>
          <button
            onClick={() => setSelectedChild("Hana Khan")}
            className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
              selectedChild === "Hana Khan"
                ? "bg-amber-400 text-emerald-950 shadow-md"
                : "text-emerald-100/70 hover:text-white"
            }`}
          >
            Hana (2)
          </button>
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
          Adjust Timetable & Support →
        </Link>
      </div>

      {/* Classes List */}
      <div className="space-y-4">
        {filteredClasses.map((cls) => (
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
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-emerald-950 animate-pulse">
                      Next Class
                    </span>
                  )}
                </div>

                <div className="text-xs text-emerald-100/80 flex flex-wrap items-center gap-y-1 gap-x-4 mb-2">
                  <span className="flex items-center gap-1.5 font-semibold text-amber-300">
                    <Calendar size={13} />
                    {cls.dayOfWeek}
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock size={13} />
                    {cls.time} ({cls.duration})
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User size={13} />
                    {cls.teacherName}
                  </span>
                </div>

                <div className="text-xs text-emerald-100/90 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10 inline-block">
                  <span className="text-amber-300/80 font-bold mr-1">Current Syllabus:</span>
                  {cls.lessonTopic}
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 w-full lg:w-auto justify-end pt-4 lg:pt-0 border-t lg:border-t-0 border-white/10">
              <Link
                href={`/classroom/demo?role=observer&child=${encodeURIComponent(cls.childName)}`}
                className="bg-emerald-800/80 hover:bg-emerald-700/80 text-emerald-100 hover:text-white border border-emerald-500/40 px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-amber-300" />
                <span>Join as Observer</span>
              </Link>

              <Link
                href={`/classroom/demo?child=${encodeURIComponent(cls.childName)}`}
                className="bg-amber-400 hover:bg-amber-300 text-emerald-950 px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Open Child Room</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center text-xs text-emerald-100/60">
        All session recordings and teacher notes are automatically archived under the{" "}
        <Link href="/parent/progress" className="text-amber-300 hover:underline">
          Progress tab
        </Link>
        . For rescheduling requests, please provide 6 hours notice.
      </div>
    </div>
  );
}
