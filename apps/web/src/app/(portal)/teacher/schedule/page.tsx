"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Video, CheckCircle2, Ban, User, MessageSquare } from "lucide-react";
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

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TIMES = ["16:00", "16:30", "17:00", "17:30", "18:00"];

export default function TeacherSchedule() {
  const [slots, setSlots] = useState<TeacherSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/scheduling?_t=${Date.now()}`, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" },
    })
      .then((res) => res.json())
      .then((data) => {
        const schedules = data.schedules || [];
        // Build complete grid from days and times
        const builtSlots: TeacherSlot[] = [];
        DAYS.forEach((day) => {
          TIMES.forEach((time) => {
            const slotId = `${day.toLowerCase()}_${time.replace(":", "")}`;
            // Match if any recurring schedule falls on this day & time
            const dayFull =
              day === "Mon" ? "Monday" :
              day === "Tue" ? "Tuesday" :
              day === "Wed" ? "Wednesday" :
              day === "Thu" ? "Thursday" :
              day === "Fri" ? "Friday" : "Saturday";

            const match = schedules.find(
              (s: any) => s.dayOfWeek === dayFull && s.startTimeLocal === time
            );

            if (match) {
              builtSlots.push({
                id: match.id || slotId,
                day,
                time,
                status: "booked",
                studentName: match.studentName,
                course: match.subject || "Quran Recitation",
                classroomSlug: (match.studentName || "demo").toLowerCase().split(" ")[0],
              });
            } else {
              builtSlots.push({
                id: slotId,
                day,
                time,
                status: "available",
              });
            }
          });
        });
        setSlots(builtSlots);
      })
      .catch((err) => {
        console.error("Failed to fetch schedules:", err);
        // Fallback default grid
        const defaultSlots: TeacherSlot[] = [];
        DAYS.forEach((day) => {
          TIMES.forEach((time) => {
            defaultSlots.push({
              id: `${day.toLowerCase()}_${time.replace(":", "")}`,
              day,
              time,
              status: "available",
            });
          });
        });
        setSlots(defaultSlots);
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleSlotAvailability = async (slotId: string) => {
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
          My Students &amp; Notes
        </Link>
        <Link href="/teacher/earnings" className="text-emerald-100/70 hover:text-white px-2 py-1 transition">
          Earnings &amp; Bank Payouts
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl md:text-4xl font-serif text-white">Teaching Schedule &amp; Availability</h1>
            <span className="flex items-center gap-1 text-[11px] font-bold bg-emerald-950/80 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full">
              Asia/Karachi
            </span>
          </div>
          <p className="text-emerald-100/80 text-sm">
            Live database weekly recurring slots. Click available slots to toggle rest/blocked hours.
          </p>
        </div>

        <Link
          href="/classroom/demo?role=teacher"
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
            <div className="text-3xl font-bold text-white">{loading ? "..." : `${bookedCount} sessions`}</div>
            <p className="text-xs text-emerald-100/70">{(bookedCount * 0.5).toFixed(1)} hrs / week</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center justify-center font-bold">
            <User size={18} />
          </div>
        </div>

        <div className="glass-container rounded-3xl p-5 border border-white/15 shadow-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">Open for Booking</div>
            <div className="text-3xl font-bold text-white">{loading ? "..." : `${availableCount} slots`}</div>
            <p className="text-xs text-emerald-100/70">Ready for trial matching</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-bold">
            <CheckCircle2 size={18} />
          </div>
        </div>

        <div className="glass-container rounded-3xl p-5 border border-white/15 shadow-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-emerald-100/60 uppercase tracking-wider mb-1">Blocked / Rest</div>
            <div className="text-3xl font-bold text-white">{loading ? "..." : `${blockedCount} slots`}</div>
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
                        className="p-3 rounded-xl bg-amber-400 text-emerald-950 font-bold shadow-md text-xs relative group transition-transform hover:scale-[1.02]"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] opacity-80">{slot.time}</span>
                          <div className="flex items-center gap-1.5">
                            <a
                              href={`https://wa.me/?text=${encodeURIComponent(`Assalamu Alaikum! Reminder for ${slot.studentName}'s Quran class today at ${slot.time} PKT. Join room: https://quranacademyapp.vercel.app/classroom/${slot.classroomSlug}`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Send WhatsApp Reminder to Parent"
                              className="text-emerald-950 hover:text-emerald-800 bg-white/40 hover:bg-white/60 p-1 rounded-md transition"
                            >
                              <MessageSquare size={11} />
                            </a>
                            <Link href={`/classroom/${slot.classroomSlug}?role=teacher`} title="Enter Live Classroom" className="bg-emerald-950 text-amber-300 p-1 rounded-md hover:bg-emerald-900 transition">
                              <Video size={11} />
                            </Link>
                          </div>
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
