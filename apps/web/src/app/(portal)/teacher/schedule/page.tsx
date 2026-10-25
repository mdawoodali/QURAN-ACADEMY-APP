"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Calendar, Video, CheckCircle2, Ban, User, MessageSquare, Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import { useLanguage } from "@/components/LanguageContext";
import { createClient } from "@/utils/supabase/client";

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
const TIMES = ["16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00"];

export default function TeacherSchedule() {
  const { t, language } = useLanguage();
  const [slots, setSlots] = useState<TeacherSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [teacherName, setTeacherName] = useState<string>("Muhammad Isbah");

  // Book Slot Modal State
  const [showBookModal, setShowBookModal] = useState(false);
  const [bookDay, setBookDay] = useState("Monday");
  const [bookTime, setBookTime] = useState("17:00");
  const [bookStudent, setBookStudent] = useState("");
  const [bookSubject, setBookSubject] = useState("Quran Reading & Tajweed");
  const [bookDuration, setBookDuration] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load teacher identity
  useEffect(() => {
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
  }, []);

  const loadSchedules = useCallback(async () => {
    try {
      const res = await fetch(`/api/scheduling?_t=${Date.now()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" },
      });
      const data = await res.json();
      const schedules = data.schedules || [];

      const builtSlots: TeacherSlot[] = [];
      DAYS.forEach((day) => {
        TIMES.forEach((time) => {
          const slotId = `${day.toLowerCase()}_${time.replace(":", "")}`;
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
    } catch (err) {
      console.error("Failed to fetch schedules:", err);
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
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

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

  const handleOpenBookSlot = (dayShort?: string, time?: string) => {
    if (dayShort) {
      const dayMap: Record<string, string> = {
        Mon: "Monday",
        Tue: "Tuesday",
        Wed: "Wednesday",
        Thu: "Thursday",
        Fri: "Friday",
        Sat: "Saturday",
      };
      setBookDay(dayMap[dayShort] || "Monday");
    }
    if (time) setBookTime(time);
    setShowBookModal(true);
  };

  const handleCreateSlotBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookStudent.trim()) {
      toast.error("Please enter a student name or ID");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/scheduling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherName,
          studentName: bookStudent.trim(),
          dayOfWeek: bookDay,
          startTimeLocal: bookTime,
          subject: bookSubject,
          durationMinutes: Number(bookDuration) || 30,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save slot booking");
      }

      toast.success(`Class scheduled for ${bookStudent} on ${bookDay} at ${bookTime}`);
      setShowBookModal(false);
      setBookStudent("");
      await loadSchedules();
    } catch (err: any) {
      toast.error(err?.message || "Failed to book slot");
    } finally {
      setIsSubmitting(false);
    }
  };

  const bookedCount = slots.filter((s) => s.status === "booked").length;
  const availableCount = slots.filter((s) => s.status === "available").length;
  const isUrdu = language === "ur";

  return (
    <div className={`p-4 md:p-8 max-w-6xl mx-auto w-full text-white ${isUrdu ? "font-urdu" : ""}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl md:text-4xl font-serif text-white">
              {t("scheduleTitle")}
            </h1>
            <span className="flex items-center gap-1 text-[11px] font-bold bg-emerald-950/80 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full">
              Asia/Karachi
            </span>
          </div>
          <p className="text-emerald-100/80 text-sm">
            {t("scheduleDesc")}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => handleOpenBookSlot()}
            className="bg-amber-400 hover:bg-amber-300 text-emerald-950 px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-md flex items-center gap-2 cursor-pointer font-serif flex-1 sm:flex-initial justify-center"
          >
            <Plus size={15} />
            <span>{t("bookNewSlot")}</span>
          </button>

          <Link
            href="/classroom/demo?role=teacher"
            className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition border border-white/15 flex items-center gap-2 cursor-pointer flex-1 sm:flex-initial justify-center"
          >
            <Video className="w-4 h-4 text-amber-300" />
            <span>{t("launchClassroom")}</span>
          </Link>
        </div>
      </div>

      {/* Stats Triad */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass-container rounded-3xl p-5 border border-white/15 shadow-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
              {t("bookedLessons")}
            </div>
            <div className="text-3xl font-bold text-white">{loading ? "..." : `${bookedCount}`}</div>
            <p className="text-xs text-emerald-100/70">
              {(bookedCount * 0.5).toFixed(1)} {t("hrsPerWeek")}
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center justify-center font-bold">
            <User size={18} />
          </div>
        </div>

        <div className="glass-container rounded-3xl p-5 border border-white/15 shadow-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">
              {t("openForBooking")}
            </div>
            <div className="text-3xl font-bold text-white">{loading ? "..." : `${availableCount}`}</div>
            <p className="text-xs text-emerald-100/70">Click slot to schedule learner</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 flex items-center justify-center font-bold">
            <Calendar size={18} />
          </div>
        </div>

        <div className="glass-container rounded-3xl p-5 border border-white/15 shadow-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">Teaching Status</div>
            <div className="text-xl font-bold text-emerald-300">Live &amp; Active</div>
            <p className="text-xs text-emerald-100/70">Timezone anchor verified</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-950 text-amber-300 border border-amber-400/40 flex items-center justify-center font-bold">
            <CheckCircle2 size={18} />
          </div>
        </div>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="glass-container rounded-3xl p-6 md:p-8 border border-white/15 shadow-2xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-bold font-serif text-white">
            {t("weeklySchedulePreview")}
          </h2>

          <div className="flex items-center gap-4 text-xs font-medium text-emerald-100/80">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-400 inline-block" />
              <span>{t("bookedLessons")}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-800/80 border border-emerald-500/40 inline-block" />
              <span>{t("openForBooking")}</span>
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
                              href={`https://wa.me/?text=${encodeURIComponent(
                                `Assalamu Alaikum! Reminder for ${slot.studentName}'s Quran class today at ${slot.time} PKT. Join room: https://quranacademyapp.vercel.app/classroom/${slot.classroomSlug}`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Send WhatsApp Reminder to Parent"
                              className="text-emerald-950 hover:text-emerald-800 bg-white/40 hover:bg-white/60 p-1 rounded-md transition"
                            >
                              <MessageSquare size={11} />
                            </a>
                            <Link
                              href={`/classroom/${slot.classroomSlug}?role=teacher`}
                              title="Enter Live Classroom"
                              className="bg-emerald-950 text-amber-300 p-1 rounded-md hover:bg-emerald-900 transition"
                            >
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
                      <div key={slot.id} className="flex flex-col gap-1">
                        <button
                          onClick={() => handleOpenBookSlot(slot.day, slot.time)}
                          className="p-3 rounded-xl bg-emerald-900/50 hover:bg-emerald-800/60 border border-emerald-500/40 text-emerald-200 hover:text-white font-medium text-xs text-left transition cursor-pointer"
                          title="Click to Book Student Slot"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] text-emerald-300 font-bold">{slot.time}</span>
                            <Plus size={12} className="text-amber-300" />
                          </div>
                          <div className="text-[11px] font-bold text-emerald-100">Available</div>
                          <div className="text-[9px] text-amber-300/80 font-bold">Click to Book</div>
                        </button>
                        <button
                          onClick={() => toggleSlotAvailability(slot.id)}
                          className="text-[9px] text-emerald-100/40 hover:text-amber-300 py-0.5 text-center transition cursor-pointer"
                          title="Block this slot from availability"
                        >
                          (Block slot)
                        </button>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={slot.id}
                      onClick={() => toggleSlotAvailability(slot.id)}
                      className="p-3 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-emerald-100/40 hover:text-white font-medium text-xs text-left transition cursor-pointer"
                      title="Click to unblock slot"
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

      {/* Book Slot Modal */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="bg-[#052b20] border border-amber-400/40 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl text-white">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold">
                  <Plus size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-serif text-white">{t("bookNewSlot")}</h3>
                  <p className="text-xs text-emerald-100/70">Schedule a lesson slot for an enrolled student.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBookModal(false)}
                className="p-1.5 text-emerald-200/70 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSlotBooking} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-emerald-100 uppercase tracking-wider mb-1.5">
                  {t("studentNameLabel")} *
                </label>
                <input
                  type="text"
                  required
                  value={bookStudent}
                  onChange={(e) => setBookStudent(e.target.value)}
                  placeholder="e.g. Abdullah Khan"
                  className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-emerald-100/30 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-emerald-100 uppercase tracking-wider mb-1.5">
                    {t("dayOfWeekLabel")}
                  </label>
                  <select
                    value={bookDay}
                    onChange={(e) => setBookDay(e.target.value)}
                    className="w-full bg-black/40 border border-white/20 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 [&>option]:bg-[#052b20]"
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-100 uppercase tracking-wider mb-1.5">
                    {t("timeSlotLabel")}
                  </label>
                  <select
                    value={bookTime}
                    onChange={(e) => setBookTime(e.target.value)}
                    className="w-full bg-black/40 border border-white/20 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 [&>option]:bg-[#052b20]"
                  >
                    {TIMES.map((time) => (
                      <option key={time} value={time}>
                        {time} PKT
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-100 uppercase tracking-wider mb-1.5">
                  {t("subjectCourseLabel")}
                </label>
                <select
                  value={bookSubject}
                  onChange={(e) => setBookSubject(e.target.value)}
                  className="w-full bg-black/40 border border-white/20 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 [&>option]:bg-[#052b20]"
                >
                  <option value="Quran Reading & Tajweed">Quran Reading & Tajweed</option>
                  <option value="Noorani Qaida for Beginners">Noorani Qaida for Beginners</option>
                  <option value="Hifz Quran Memorisation">Hifz Quran Memorisation</option>
                  <option value="Islamic Studies & Duas">Islamic Studies & Duas</option>
                  <option value="Quran Translation & Tafseer">Quran Translation & Tafseer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-100 uppercase tracking-wider mb-1.5">
                  {t("durationLabel")}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[30, 45, 60].map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setBookDuration(dur)}
                      className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        bookDuration === dur
                          ? "bg-amber-400 text-emerald-950 border-amber-300"
                          : "bg-black/30 text-emerald-100 border-white/10 hover:border-white/30"
                      }`}
                    >
                      {dur} mins
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium text-xs transition cursor-pointer"
                >
                  {t("cancelBtn")}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold rounded-xl text-xs transition shadow-lg flex items-center gap-2 cursor-pointer font-serif disabled:opacity-50"
                >
                  <Plus size={14} />
                  <span>{isSubmitting ? "Saving..." : t("confirmBookingBtn")}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
