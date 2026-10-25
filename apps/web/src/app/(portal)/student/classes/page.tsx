"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Clock, Video, Database } from "lucide-react";
import { getAcademySchedules, RecurringScheduleRecord } from "@/server/schedulingRepository";

export default function StudentClasses() {
  const [schedules, setSchedules] = useState<RecurringScheduleRecord[]>([]);

  useEffect(() => {
    getAcademySchedules().then((res) => {
      // Filter for Yusuf Khan (the logged in demo student)
      const myClasses = res.schedules.filter((s) => s.studentName.toLowerCase().includes("yusuf") || s.studentName.toLowerCase().includes("amina"));
      setSchedules(myClasses);
    });
  }, []);

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto w-full text-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl md:text-4xl font-serif text-white">My Classes</h1>
            <span className="flex items-center gap-1 text-[11px] font-bold bg-emerald-950/80 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full">
              <Database size={12} />
              <span>Database Backed</span>
            </span>
          </div>
          <p className="text-emerald-100/80 text-sm">View upcoming 1-on-1 sessions and schedule changes stored in PostgreSQL.</p>
        </div>
        <Link 
          href="/classroom/demo?role=student" 
          className="bg-amber-400 text-emerald-950 px-6 py-3 rounded-full font-bold text-sm hover:bg-amber-300 transition shadow-lg flex items-center gap-2"
        >
          <Video className="w-4 h-4" />
          <span>Join Live Class</span>
        </Link>
      </div>
      
      <div className="glass-container rounded-3xl p-6 md:p-8 border border-white/15 shadow-2xl">
        <h2 className="text-xl font-bold font-serif text-white mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-amber-300" />
          <span>Persistent Weekly Schedule</span>
        </h2>
        
        <div className="space-y-4">
          {schedules.map((cls, i) => (
            <div 
              key={cls.id || i} 
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 bg-black/35 backdrop-blur-md rounded-2xl border border-white/10 hover:border-amber-400/40 transition-all"
            >
              <div className="flex gap-6 items-center">
                <div className="w-24 text-left sm:text-center shrink-0">
                  <div className="font-bold text-amber-300">{cls.dayOfWeek}</div>
                  <div className="text-xs text-emerald-100/70 flex items-center gap-1 mt-0.5 sm:justify-center">
                    <Clock className="w-3 h-3 text-emerald-300/70" />
                    <span>{cls.startTimeLocal} ({cls.durationMinutes}m)</span>
                  </div>
                </div>
                <div className="w-px h-10 bg-white/15 hidden sm:block"></div>
                <div>
                  <div className="font-bold text-white text-base">{cls.subject}</div>
                  <div className="text-sm text-emerald-100/80">Teacher: {cls.teacherName} • {cls.timezoneAnchor}</div>
                </div>
              </div>
              <div>
                <Link 
                  href="/classroom/demo?role=student" 
                  className="text-xs font-bold bg-amber-400 text-emerald-950 px-5 py-2.5 rounded-xl hover:bg-amber-300 transition shadow-md inline-flex items-center gap-1.5"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Join Room</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
