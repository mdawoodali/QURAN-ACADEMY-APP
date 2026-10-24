"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Database, Clock, BookOpen, Star, Video } from "lucide-react";

interface StudentSchedule {
  course: string;
  time: string;
  day: string;
  classroomSlug: string;
}

export default function StudentDashboard() {
  const [schedule, setSchedule] = useState<StudentSchedule>({
    course: "Quran Reading for Kids (Noorani Qaida)",
    time: "17:00–17:30",
    day: "TODAY",
    classroomSlug: "demo",
  });
  const [latestHomework, setLatestHomework] = useState("Qaida Lesson 3 Revision");
  const [latestFeedback, setLatestFeedback] = useState("Good progress on heavy letters this week");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/scheduling").then((r) => r.json()).catch(() => ({ schedules: [] })),
      fetch("/api/progress").then((r) => r.json()).catch(() => ({ notes: [] }))
    ])
      .then(([schedData, progData]) => {
        const schedules = schedData.schedules || [];
        if (schedules.length > 0) {
          const match = schedules[0];
          setSchedule({
            course: match.subject || "Quran Reading for Kids",
            time: `${match.startTimeLocal || "17:00"}–17:30`,
            day: match.dayOfWeek?.toUpperCase() || "TODAY",
            classroomSlug: (match.studentName || "demo").toLowerCase().split(" ")[0],
          });
        }

        const notes = progData.notes || [];
        if (notes.length > 0) {
          const first = notes[0];
          if (first.homework) setLatestHomework(first.homework);
          if (first.feedback) setLatestFeedback(first.feedback);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto text-white">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-3xl md:text-4xl font-serif text-white">Assalamu alaikum, Yusuf</h1>
          <span className="flex items-center gap-1 text-[11px] font-bold bg-emerald-950/80 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full">
            <Database size={12} />
            <span>Database Sync</span>
          </span>
        </div>
        <p className="text-emerald-100/85 text-sm">Your learning day, clearly organised.</p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        {/* Next Class Card */}
        <div className="flex-1 glass-container rounded-3xl p-6 md:p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between border border-amber-400/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-700/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div>
            <div className="bg-amber-400/20 text-amber-300 font-bold text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full inline-block mb-6 border border-amber-400/30">
              NEXT CLASS • {schedule.day}
            </div>
            
            <h2 className="text-3xl md:text-4xl font-serif mb-4 text-white">
              {loading ? "Loading session..." : schedule.course}
            </h2>
            <div className="text-emerald-100/90 flex flex-wrap gap-4 text-sm font-medium mb-8">
              <span className="flex items-center gap-1.5">
                <Clock size={15} className="text-amber-300" />
                {schedule.time}
              </span>
              <span>•</span>
              <span>Asia/Karachi</span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <BookOpen size={15} className="text-amber-300" />
                Live Interactive Classroom
              </span>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Link
              href={`/classroom/${schedule.classroomSlug}`}
              className="bg-amber-400 text-emerald-950 px-8 py-3.5 rounded-xl font-bold hover:bg-amber-300 transition shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <Video size={16} />
              <span>Join Class</span>
            </Link>
          </div>
        </div>
        
        {/* This Week Card */}
        <div className="w-full lg:w-72 glass-container rounded-3xl p-6 border border-white/15 shadow-xl flex flex-col justify-between text-white pop-hover">
          <div>
            <h3 className="text-white font-bold mb-4">This Week</h3>
            <div className="text-4xl font-bold text-amber-300 mb-2">3 lessons</div>
            <p className="text-emerald-100/80 text-sm">You earned a learning star!</p>
          </div>
          <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-amber-300 font-bold">
            <Star size={14} className="fill-amber-300" />
            <span>Attendance 100% on track</span>
          </div>
        </div>
      </div>
      
      {/* Lesson Details Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          href={`/classroom/${schedule.classroomSlug}`}
          className="glass-container rounded-3xl p-6 border border-white/15 shadow-xl block text-white group pop-hover"
        >
          <h3 className="text-xs font-bold text-amber-300 uppercase tracking-widest mb-2">Current Lesson</h3>
          <div className="text-xl font-bold text-white mb-2 group-hover:text-amber-200 transition-colors">
            {schedule.course}
          </div>
          <p className="text-xs text-emerald-100/80">Launch live classroom / continue practice →</p>
        </Link>
        
        <div className="glass-container rounded-3xl p-6 border border-white/15 shadow-xl text-white pop-hover">
          <h3 className="text-xs font-bold text-amber-300 uppercase tracking-widest mb-2">Assigned Homework</h3>
          <div className="text-base font-bold text-white mb-2 truncate">{latestHomework}</div>
          <p className="text-xs text-emerald-100/80">Repeat twice before the next class</p>
        </div>

        <div className="glass-container rounded-3xl p-6 border border-white/15 shadow-xl text-white pop-hover">
          <h3 className="text-xs font-bold text-amber-300 uppercase tracking-widest mb-2">Teacher Note</h3>
          <div className="text-sm font-semibold text-white mb-2 line-clamp-2">{latestFeedback}</div>
          <p className="text-xs text-emerald-100/80">Verified by teacher in classroom session</p>
        </div>
      </div>
    </div>
  );
}
