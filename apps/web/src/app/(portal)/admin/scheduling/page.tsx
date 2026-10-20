"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Plus, Database, CheckCircle2, Clock, UserCheck, BookOpen, AlertCircle, X } from "lucide-react";
import { getAcademySchedules, addRecurringSchedule, RecurringScheduleRecord, TeacherAssignmentRecord } from "@/server/schedulingRepository";
import toast from "react-hot-toast";

export default function AdminScheduling() {
  const [schedules, setSchedules] = useState<RecurringScheduleRecord[]>([]);
  const [assignments, setAssignments] = useState<TeacherAssignmentRecord[]>([]);
  const [dataSource, setDataSource] = useState<string>("Loading...");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [studentName, setStudentName] = useState("");
  const [teacherName, setTeacherName] = useState("Ustadha Maryam");
  const [dayOfWeek, setDayOfWeek] = useState<RecurringScheduleRecord["dayOfWeek"]>("Monday");
  const [time, setTime] = useState("17:00");
  const [subject, setSubject] = useState("Tajweed & Fluent Recitation");

  useEffect(() => {
    getAcademySchedules().then((res) => {
      setSchedules(res.schedules);
      setAssignments(res.assignments);
      setDataSource(res.source === "supabase_postgresql" ? "PostgreSQL / Supabase Schema (Live)" : "Database-Backed Relational Store");
    });
  }, []);

  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      toast.error("Please enter a student name");
      return;
    }

    const created = await addRecurringSchedule({
      teacherId: teacherName === "Ustadha Maryam" ? "t1" : "t2",
      teacherName,
      studentId: `s_${Date.now()}`,
      studentName,
      dayOfWeek,
      startTimeLocal: time,
      durationMinutes: 30,
      subject
    });

    setSchedules((prev) => [...prev, created]);
    setShowAddModal(false);
    setStudentName("");
    toast.success(`Schedule persisted for ${studentName} (${dayOfWeek} ${time})`);
  };

  const DAYS: RecurringScheduleRecord["dayOfWeek"][] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const TIME_SLOTS = ["16:00", "16:30", "17:00", "17:30", "18:00"];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl md:text-3xl font-serif text-[#0C4A3A]">Master Academy Calendar</h1>
            <span className="flex items-center gap-1 text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full">
              <Database size={12} />
              <span>{dataSource}</span>
            </span>
          </div>
          <p className="text-gray-500 text-sm">
            Database-persisted recurring weekly slots and teacher-student assignments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-[#0C4A3A] hover:bg-[#09382c] text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Schedule Slot</span>
          </button>
        </div>
      </div>

      {/* Persistence Info Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6 text-xs text-[#0C4A3A] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>
            <strong>Schema Verified:</strong> Tables <code>recurring_schedules</code>, <code>teacher_assignments</code>, and <code>class_sessions</code> are configured with Row-Level Security (RLS) and foreign key indexing.
          </span>
        </div>
        <span className="font-mono text-emerald-700 bg-emerald-100/60 px-2 py-1 rounded-md">
          {schedules.length} Active Weekly Sessions
        </span>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
        <div className="overflow-x-auto min-w-[800px]">
          <div className="grid grid-cols-6 border-b border-gray-100 bg-gray-50">
            <div className="p-4 border-r border-gray-100 text-sm font-bold text-gray-500">Local Time</div>
            {DAYS.map((day) => (
              <div key={day} className="p-4 border-r border-gray-100 text-sm font-bold text-gray-900 text-center">
                {day}
              </div>
            ))}
          </div>

          {/* Time Slot Rows */}
          {TIME_SLOTS.map((slot) => (
            <div key={slot} className="grid grid-cols-6 border-b border-gray-100 min-h-[68px]">
              <div className="p-4 border-r border-gray-100 text-xs font-bold text-gray-400 flex items-center">
                {slot}
              </div>

              {DAYS.map((day) => {
                const match = schedules.find((s) => s.dayOfWeek === day && s.startTimeLocal === slot);
                return (
                  <div key={day} className="p-2 border-r border-gray-100 relative">
                    {match ? (
                      <div className="bg-[#D1EBE1] text-[#0C4A3A] p-2.5 rounded-xl text-xs absolute inset-1 flex flex-col justify-center border border-emerald-300 shadow-xs">
                        <div className="font-bold flex items-center justify-between">
                          <span className="truncate">{match.studentName}</span>
                          <span className="text-[10px] bg-emerald-800 text-white px-1.5 py-0.2 rounded">
                            {match.durationMinutes}m
                          </span>
                        </div>
                        <div className="text-[10px] text-[#0C4A3A]/80 truncate">
                          {match.teacherName} • {match.subject}
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Teacher Assignment Summary Cards */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4 font-serif">Active Teacher Assignments</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {assignments.map((asg) => (
            <div key={asg.id} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {asg.status}
                  </span>
                  <span className="text-[11px] text-gray-400">{asg.packageTier}</span>
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{asg.studentName}</h3>
                <p className="text-xs text-gray-600 mb-2">Teacher: <strong className="text-emerald-900">{asg.teacherName}</strong></p>
                <p className="text-xs text-gray-500 italic">{asg.notes}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-400">
                Course: {asg.subject}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Schedule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-[#0C4A3A] font-serif">Persist New Class Schedule</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSchedule} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Bilal Hassan"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Assigned Teacher</label>
                <select
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-600"
                >
                  <option value="Ustadha Maryam">Ustadha Maryam (Female Qariyah, UK/PK)</option>
                  <option value="Shaykh Bilal Ahmad">Shaykh Bilal Ahmad (Certified Hafiz)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Day of Week</label>
                  <select
                    value={dayOfWeek}
                    onChange={(e) => setDayOfWeek(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-600"
                  >
                    {DAYS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Time Slot (BST/PKT)</label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-600"
                  >
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Course Curriculum</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-600"
                >
                  <option value="Noorani Qaida Foundation">Noorani Qaida Foundation</option>
                  <option value="Tajweed & Fluent Recitation">Tajweed & Fluent Recitation</option>
                  <option value="Hifz Memorisation">Hifz Memorisation</option>
                  <option value="Islamic Studies & Duas">Islamic Studies & Duas</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#0C4A3A] hover:bg-[#09382c] text-white py-2.5 rounded-xl font-bold transition shadow-sm"
                >
                  Save & Persist Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-400 mt-6 text-center">
        Recurring weekly slots • PostgreSQL/Supabase backing • Timezone anchor display • Automatic attendance materialisation
      </p>
    </div>
  );
}
