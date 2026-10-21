"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Video, CheckCircle2, Ban, User } from "lucide-react";
import toast from "react-hot-toast";

interface TeacherSlot {
  id: string;
  day: string;
  time: string;
  status: "booked" | "available" | "blocked";
  studentName?: string;
  course?: string;
  classroomSlug?: string;
}

const INITIAL_SCHEDULE: TeacherSlot[] = [
  // Monday
  { id: "m1", day: "Mon", time: "16:00", status: "available" },
  { id: "m2", day: "Mon", time: "16:30", status: "booked", studentName: "Yusuf Khan", course: "Noorani Qaida", classroomSlug: "yusuf" },
  { id: "m3", day: "Mon", time: "17:00", status: "booked", studentName: "Amina Khan", course: "Tajweed Fluency", classroomSlug: "amina" },
  { id: "m4", day: "Mon", time: "17:30", status: "available" },
  { id: "m5", day: "Mon", time: "18:00", status: "blocked" },

  // Tuesday
  { id: "t1", day: "Tue", time: "16:00", status: "available" },
  { id: "t2", day: "Tue", time: "16:30", status: "available" },
  { id: "t3", day: "Tue", time: "17:00", status: "booked", studentName: "Omar Ali", course: "Hifz Juz 30", classroomSlug: "omar" },
  { id: "t4", day: "Tue", time: "17:30", status: "available" },
  { id: "t5", day: "Tue", time: "18:00", status: "available" },

  // Wednesday
  { id: "w1", day: "Wed", time: "16:00", status: "blocked" },
  { id: "w2", day: "Wed", time: "16:30", status: "available" },
  { id: "w3", day: "Wed", time: "17:00", status: "booked", studentName: "Yusuf Khan", course: "Noorani Qaida", classroomSlug: "yusuf" },
  { id: "w4", day: "Wed", time: "17:30", status: "booked", studentName: "Zayd Farooq", course: "Beginner Qaida", classroomSlug: "zayd" },
  { id: "w5", day: "Wed", time: "18:00", status: "available" },

  // Thursday
  { id: "th1", day: "Thu", time: "16:00", status: "available" },
  { id: "th2", day: "Thu", time: "16:30", status: "booked", studentName: "Hana Khan", course: "Hifz Amma", classroomSlug: "hana" },
  { id: "th3", day: "Thu", time: "17:00", status: "available" },
  { id: "th4", day: "Thu", time: "17:30", status: "available" },
  { id: "th5", day: "Thu", time: "18:00", status: "blocked" },

  // Friday
  { id: "f1", day: "Fri", time: "16:00", status: "available" },
  { id: "f2", day: "Fri", time: "16:30", status: "available" },
  { id: "f3", day: "Fri", time: "17:00", status: "booked", studentName: "Yusuf Khan", course: "Noorani Qaida", classroomSlug: "yusuf" },
  { id: "f4", day: "Fri", time: "17:30", status: "booked", studentName: "Amina Khan", course: "Tajweed Fluency", classroomSlug: "amina" },
  { id: "f5", day: "Fri", time: "18:00", status: "available" },

  // Saturday
  { id: "s1", day: "Sat", time: "10:00", status: "available" },
  { id: "s2", day: "Sat", time: "10:30", status: "booked", studentName: "Hana Khan", course: "Hifz Amma", classroomSlug: "hana" },
  { id: "s3", day: "Sat", time: "11:00", status: "available" },
  { id: "s4", day: "Sat", time: "11:30", status: "available" },
  { id: "s5", day: "Sat", time: "12:00", status: "blocked" },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TIMES = ["16:00", "16:30", "17:00", "17:30", "18:00"];

export default function TeacherSchedule() {
  const [slots, setSlots] = useState<TeacherSlot[]>(INITIAL_SCHEDULE);

  const toggleSlotAvailability = (slotId: string) => {
    setSlots((prev) =>
      prev.map((s) => {
        if (s.id !== slotId) return s;
        if (s.status === "booked") {
          toast.error("Booked slots cannot be toggled directly. Contact academy admin to reassign.");
          return s;
        }
        const nextStatus = s.status === "available" ? "blocked" : "available";
        toast.success(`Slot (${s.day} ${s.time}) set to ${nextStatus.toUpperCase()}`);
        return { ...s, status: nextStatus };
      })
    );
  };

  const bookedCount = slots.filter((s) => s.status === "booked").length;
  const availableCount = slots.filter((s) => s.status === "available").length;
  const blockedCount = slots.filter((s) => s.status === "blocked").length;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full text-white">
      {/* Sub-Navbar */}
      <div className="flex gap-4 border-b border-white/10 pb-3 text-sm font-bold mb-8 overflow-x-auto">
        <Link href="/teacher" className="text-emerald-100/70 hover:text-white px-2 py-1 transition">
          Today
        </Link>
        <Link
          href="/teacher/schedule"
          className="text-amber-300 border-b-2 border-amber-400 pb-2 px-2 transition font-bold"
        >
          Weekly Schedule
        </Link>
        <Link href="/teacher/students" className="text-emerald-100/70 hover:text-white px-2 py-1 transition">
          My Students & Notes
        </Link>
        <Link href="/teacher/earnings" className="text-emerald-100/70 hover:text-white px-2 py-1 transition">
          Earnings & Bank Payouts
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl md:text-4xl font-serif text-white">Teaching Schedule & Availability</h1>
            <span className="flex items-center gap-1 text-[11px] font-bold bg-emerald-950/80 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full">
              Asia/Karachi
            </span>
          </div>
          <p className="text-emerald-100/80 text-sm">
            Manage your open weekly recurring slots. Click available slots to toggle rest/blocked hours.
          </p>
        </div>

        <Link
          href="/classroom/demo"
          className="bg-amber-400 hover:bg-amber-300 text-emerald-950 px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Video className="w-4 h-4" />
          <span>Launch Classroom</span>
        </Link>
      </div>

      {/* Stats Triad */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass-container rounded-3xl p-5 border border-white/15 shadow-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">Booked Lessons</div>
            <div className="text-3xl font-bold text-white">{bookedCount} sessions</div>
            <p className="text-xs text-emerald-100/70">{(bookedCount * 0.5).toFixed(1)} hrs / week</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center justify-center font-bold">
            <User size={18} />
          </div>
        </div>

        <div className="glass-container rounded-3xl p-5 border border-white/15 shadow-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">Open for Booking</div>
            <div className="text-3xl font-bold text-white">{availableCount} slots</div>
            <p className="text-xs text-emerald-100/70">Ready for trial matching</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-bold">
            <CheckCircle2 size={18} />
          </div>
        </div>

        <div className="glass-container rounded-3xl p-5 border border-white/15 shadow-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-emerald-100/60 uppercase tracking-wider mb-1">Blocked / Rest</div>
            <div className="text-3xl font-bold text-white">{blockedCount} slots</div>
            <p className="text-xs text-emerald-100/70">Unavailable for bookings</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-black/40 text-emerald-100/40 border border-white/10 flex items-center justify-center font-bold">
            <Ban size={18} />
          </div>
        </div>
      </div>

      {/* Interactive Slot Matrix */}
      <div className="glass-container rounded-3xl p-6 md:p-8 border border-white/15 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold font-serif text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-300" />
            <span>Weekly Slot Grid</span>
          </h2>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-400 inline-block" />
              <span>Booked</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-800/80 border border-emerald-500/40 inline-block" />
              <span>Open</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-black/50 border border-white/10 inline-block" />
              <span>Blocked</span>
            </span>
          </div>
        </div>

        <div className="overflow-x-auto min-w-[700px]">
          <div className="grid grid-cols-6 gap-3">
            {DAYS.map((day) => (
              <div key={day} className="flex flex-col gap-2.5">
                <div className="text-center font-bold text-sm text-amber-300 bg-black/40 py-2 rounded-xl border border-white/10">
                  {day}
                </div>

                {TIMES.map((time) => {
                  const slot = slots.find((s) => s.day === day && s.time === time);
                  if (!slot) return null;

                  if (slot.status === "booked") {
                    return (
                      <div
                        key={slot.id}
                        className="p-3 rounded-xl bg-amber-400 text-emerald-950 font-bold shadow-md text-xs relative group cursor-pointer transition-transform hover:scale-[1.02]"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] opacity-80">{slot.time}</span>
                          <Video size={12} className="opacity-90" />
                        </div>
                        <div className="truncate font-extrabold">{slot.studentName}</div>
                        <div className="text-[10px] opacity-75 truncate">{slot.course}</div>
                      </div>
                    );
                  }

                  if (slot.status === "available") {
                    return (
                      <button
                        key={slot.id}
                        onClick={() => toggleSlotAvailability(slot.id)}
                        className="p-3 rounded-xl bg-emerald-900/50 hover:bg-emerald-800/60 border border-emerald-500/40 text-emerald-200 hover:text-white font-medium text-xs text-left transition cursor-pointer"
                        title="Click to mark as blocked"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-emerald-300 font-bold">{slot.time}</span>
                          <CheckCircle2 size={12} className="text-emerald-400" />
                        </div>
                        <div className="text-[11px] font-bold text-emerald-100">Available</div>
                        <div className="text-[9px] text-emerald-300/60">Click to block</div>
                      </button>
                    );
                  }

                  return (
                    <button
                      key={slot.id}
                      onClick={() => toggleSlotAvailability(slot.id)}
                      className="p-3 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-emerald-100/40 hover:text-white font-medium text-xs text-left transition cursor-pointer"
                      title="Click to open slot"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-emerald-100/50">{slot.time}</span>
                        <Ban size={12} className="text-white/30" />
                      </div>
                      <div className="text-[11px] font-semibold text-emerald-100/50">Blocked</div>
                      <div className="text-[9px] text-emerald-100/40">Click to open</div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
