"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, Video, Plus, Clock, X, CloudOff } from "lucide-react";
import toast from "react-hot-toast";
import {
  enqueueOfflineAction,
  flushOfflineQueue,
  getOfflineQueueSize,
  initNetworkSyncListeners,
  onSyncBroadcast,
} from "@/lib/safeSync";

interface LessonNote {
  date: string;
  lesson: string;
  grade: string;
  feedback: string;
  homework: string;
}

interface StudentRecord {
  id: string;
  name: string;
  age: number;
  course: string;
  levelBadge: string;
  scheduleSummary: string;
  history: LessonNote[];
}

export default function TeacherStudents() {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newGrade, setNewGrade] = useState("Excellent");
  const [newFeedback, setNewFeedback] = useState("");
  const [newHomework, setNewHomework] = useState("");
  const [loading, setLoading] = useState(true);
  const [offlineQueueCount, setOfflineQueueCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Load students and notes from live database APIs with cache-busting
  const loadData = useCallback(async () => {
    try {
      const [enrolRes, progRes] = await Promise.all([
        fetch(`/api/enrolments?_t=${Date.now()}`, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" },
        })
          .then((r) => r.json())
          .catch(() => ({ enrolments: [] })),
        fetch(`/api/progress?_t=${Date.now()}`, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" },
        })
          .then((r) => r.json())
          .catch(() => ({ notes: [] })),
      ]);

      const enrolments = enrolRes.enrolments || [];
      const rawNotes = progRes.notes || [];

      // Build student list
      const list: StudentRecord[] = enrolments.map((en: any) => {
        const sName = en.student_name || en.learner || en.studentName || "Learner";
        const studentNotes = rawNotes
          .filter((n: any) => (n.student_name || n.studentName) === sName)
          .map((n: any) => ({
            date: n.lesson_date || n.date || n.lessonDate || new Date(n.created_at || Date.now()).toLocaleDateString(),
            lesson: n.lesson_title || n.lesson || n.lessonTitle || "Quran Recitation Session",
            grade: n.rating || n.grade || "Mastered",
            feedback: n.feedback || "Good recitation progress.",
            homework: n.homework || "Daily practice required.",
          }));

        return {
          id: en.id || `st_${sName}`,
          name: sName,
          age: en.student_age || 10,
          course: en.course_title || en.programme || "Quran & Tajweed Studies",
          levelBadge: en.status === "active" ? "Active Enrolment" : "Trial Learner",
          scheduleSummary: `${en.preferred_time || "17:00"} (${en.timezone || "Asia/Karachi"})`,
          history: studentNotes,
        };
      });

      if (list.length > 0) {
        setStudents(list);
        setSelectedStudentId((prev) => (prev && list.some((s) => s.id === prev) ? prev : list[0].id));
      } else {
        // If no enrolments exist yet, seed a live reference learner
        const initialLearner: StudentRecord = {
          id: "s_default_yusuf",
          name: "Yusuf Khan",
          age: 9,
          course: "Quran Reading for Kids (Noorani Qaida)",
          levelBadge: "Qaida Lesson 3",
          scheduleSummary: "Mon, Wed & Fri • 17:00",
          history: rawNotes.map((n: any) => ({
            date: n.lesson_date || "Today",
            lesson: n.lesson_title || "Lesson 3: Joined Letters & Throats",
            grade: n.rating || "Excellent",
            feedback: n.feedback || "Yusuf did great today with joined letter recognition.",
            homework: n.homework || "Practice Qaida page 12.",
          })),
        };
        setStudents([initialLearner]);
        setSelectedStudentId(initialLearner.id);
      }
    } catch (err) {
      console.error("Failed to load students:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    setOfflineQueueCount(getOfflineQueueSize());

    const cleanupListeners = initNetworkSyncListeners(async (online) => {
      if (online && getOfflineQueueSize() > 0) {
        setIsSyncing(true);
        toast.loading("Network restored. Syncing offline lesson notes...", { id: "offline-sync" });
        const { processed } = await flushOfflineQueue();
        setIsSyncing(false);
        setOfflineQueueCount(getOfflineQueueSize());
        if (processed > 0) {
          toast.success(`Synced ${processed} lesson note${processed > 1 ? "s" : ""} to cloud!`, { id: "offline-sync" });
          loadData();
        } else {
          toast.dismiss("offline-sync");
        }
      }
    });

    const cleanupBroadcast = onSyncBroadcast((event) => {
      if (event.type.includes("student_lesson_notes")) {
        loadData();
      }
    });

    return () => {
      cleanupListeners();
      cleanupBroadcast();
    };
  }, [loadData]);

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedStudent =
    students.find((s) => s.id === selectedStudentId) || students[0] || {
      id: "none",
      name: "No Student Selected",
      age: 0,
      course: "General",
      levelBadge: "N/A",
      scheduleSummary: "N/A",
      history: [],
    };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitle.trim() || !newFeedback.trim()) {
      toast.error("Please fill in lesson title and feedback");
      return;
    }

    const newNoteItem: LessonNote = {
      date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      lesson: newLessonTitle.trim(),
      grade: newGrade,
      feedback: newFeedback.trim(),
      homework: newHomework.trim() || "Continue daily recitation",
    };

    // Optimistically update UI
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === selectedStudent.id) {
          return {
            ...s,
            history: [newNoteItem, ...s.history],
          };
        }
        return s;
      })
    );

    setShowNoteModal(false);

    const offlinePayload = {
      student_id: selectedStudent.id,
      student_name: selectedStudent.name,
      teacher_name: "Ustadha Maryam",
      lesson_date: new Date().toISOString().slice(0, 10),
      lesson_title: newLessonTitle.trim(),
      grade: newGrade,
      rating: newGrade === "Excellent" ? 5 : newGrade === "Very Good" ? 4 : 3,
      feedback: newFeedback.trim(),
      homework: newHomework.trim() || "Continue daily recitation",
      tajweed_score: "4.8 / 5.0",
    };

    // Check offline status immediately
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      enqueueOfflineAction({
        type: "INSERT",
        table: "student_lesson_notes",
        payload: offlinePayload,
      });
      setOfflineQueueCount(getOfflineQueueSize());
      toast.success("Saved offline to SafeSync queue. Will sync automatically when reconnected.", { id: "save-note" });
      setNewLessonTitle("");
      setNewFeedback("");
      setNewHomework("");
      return;
    }

    toast.loading("Persisting lesson note to database...", { id: "save-note" });

    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify(offlinePayload),
      });

      if (!res.ok) {
        throw new Error("Failed to persist note");
      }

      toast.success("Lesson note saved successfully!", { id: "save-note" });
      setNewLessonTitle("");
      setNewFeedback("");
      setNewHomework("");
    } catch {
      enqueueOfflineAction({
        type: "INSERT",
        table: "student_lesson_notes",
        payload: offlinePayload,
      });
      setOfflineQueueCount(getOfflineQueueSize());
      toast.success("Saved offline to SafeSync queue. Will sync when reconnected.", { id: "save-note" });
      setNewLessonTitle("");
      setNewFeedback("");
      setNewHomework("");
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full text-white">
      {/* Sub-Navbar */}
      <div className="flex gap-4 border-b border-white/10 pb-3 text-sm font-bold mb-8 overflow-x-auto">
        <Link href="/teacher" className="text-emerald-100/70 hover:text-white px-2 py-1 transition">
          Today
        </Link>
        <Link href="/teacher/schedule" className="text-emerald-100/70 hover:text-white px-2 py-1 transition">
          Weekly Schedule
        </Link>
        <Link
          href="/teacher/students"
          className="text-amber-300 border-b-2 border-amber-400 pb-2 px-2 transition font-bold"
        >
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
            <h1 className="text-3xl md:text-4xl font-serif text-white">Student Roster &amp; Lesson Notes</h1>
          </div>
          <p className="text-emerald-100/80 text-sm">
            Maintain daily Sabaq/Sabqi progress records and provide feedback for parents.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {offlineQueueCount > 0 && (
            <button
              onClick={async () => {
                setIsSyncing(true);
                toast.loading("Flushing offline queue...", { id: "manual-sync" });
                const { processed } = await flushOfflineQueue();
                setIsSyncing(false);
                setOfflineQueueCount(getOfflineQueueSize());
                if (processed > 0) {
                  toast.success(`Synced ${processed} offline note${processed > 1 ? "s" : ""}!`, { id: "manual-sync" });
                  loadData();
                } else {
                  toast.error("Network still unavailable or items could not be synced.", { id: "manual-sync" });
                }
              }}
              className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-amber-500/30 transition cursor-pointer"
            >
              <CloudOff size={15} className={isSyncing ? "animate-spin" : ""} />
              <span>{offlineQueueCount} Offline Note{offlineQueueCount > 1 ? "s" : ""} Pending Sync</span>
            </button>
          )}

          <button
            onClick={() => setShowNoteModal(true)}
            className="bg-amber-400 hover:bg-amber-300 text-emerald-950 px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Lesson Note</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Students Roster List */}
        <div className="lg:col-span-4 glass-container rounded-3xl p-4 md:p-5 border border-white/15 shadow-xl flex flex-col">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3.5 top-3 text-emerald-200/50" size={16} />
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white placeholder:text-emerald-200/40 text-xs focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[500px] pr-1">
            {loading ? (
              <div className="text-center py-8 text-xs text-emerald-100/60">Loading live student roster...</div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-8 text-xs text-emerald-100/60">No students found</div>
            ) : (
              filteredStudents.map((student) => {
                const isSelected = student.id === selectedStudent.id;
                const initials = student.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <div
                    key={student.id}
                    onClick={() => setSelectedStudentId(student.id)}
                    className={`p-3.5 rounded-2xl cursor-pointer transition border ${
                      isSelected
                        ? "bg-emerald-800/40 border-amber-400/50 shadow-md"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-emerald-950 font-bold flex items-center justify-center text-xs shrink-0 shadow">
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-white truncate">{student.name}</h4>
                          <span className="text-[10px] text-amber-300 font-semibold">{student.age} yrs</span>
                        </div>
                        <p className="text-xs text-emerald-100/70 truncate mt-0.5">{student.course}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Selected Student Details & Lesson Note History */}
        <div className="lg:col-span-8 glass-container rounded-3xl p-6 border border-white/15 shadow-xl flex flex-col justify-between">
          <div>
            {/* Header info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-serif text-white">{selectedStudent.name}</h2>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                    {selectedStudent.levelBadge}
                  </span>
                </div>
                <p className="text-emerald-100/80 text-xs mt-1">
                  Enrolled Course: <span className="font-semibold text-white">{selectedStudent.course}</span>
                </p>
                <div className="flex items-center gap-1.5 text-xs text-amber-200/90 mt-1">
                  <Clock size={13} />
                  <span>{selectedStudent.scheduleSummary}</span>
                </div>
              </div>

              <Link
                href={`/classroom/${selectedStudent.name.toLowerCase().split(" ")[0]}`}
                className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/30 px-4 py-2 rounded-xl font-bold text-xs transition flex items-center gap-2"
              >
                <Video size={14} />
                <span>Launch Classroom</span>
              </Link>
            </div>

            {/* Note History List */}
            <div className="mt-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                Recitation &amp; Feedback History ({selectedStudent.history?.length || 0})
              </h3>

              <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2">
                {selectedStudent.history?.length === 0 ? (
                  <div className="text-center py-12 text-emerald-100/60 text-xs">
                    No lesson notes recorded yet. Click &quot;Add Lesson Note&quot; to submit feedback.
                  </div>
                ) : (
                  selectedStudent.history?.map((note, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-2 hover:border-white/20 transition"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white">{note.lesson}</span>
                        <div className="flex items-center gap-2">
                          <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            {note.grade}
                          </span>
                          <span className="text-xs text-emerald-100/50">{note.date}</span>
                        </div>
                      </div>

                      <p className="text-xs text-emerald-100/90 italic bg-white/5 p-2.5 rounded-xl border border-white/5">
                        &quot;{note.feedback}&quot;
                      </p>

                      <div className="flex items-center gap-2 text-xs text-amber-200/80 pt-1">
                        <span className="font-bold">Assigned Homework:</span>
                        <span>{note.homework}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Lesson Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-container max-w-lg w-full rounded-3xl p-6 border border-white/20 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowNoteModal(false)}
              className="absolute top-5 right-5 text-emerald-100/60 hover:text-white"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-serif text-white mb-1">Record Lesson Note</h3>
            <p className="text-xs text-emerald-100/80 mb-5">
              Enter recitation milestones for <strong className="text-amber-300">{selectedStudent.name}</strong>.
            </p>

            <form onSubmit={handleAddNote} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-emerald-100/80 uppercase tracking-wider mb-1.5">
                  Lesson Title / Sabaq
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Surah Al-Baqarah Ayah 1-5 / Qaida Lesson 4"
                  value={newLessonTitle}
                  onChange={(e) => setNewLessonTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-100/80 uppercase tracking-wider mb-1.5">
                  Proficiency Rating
                </label>
                <select
                  value={newGrade}
                  onChange={(e) => setNewGrade(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black/60 border border-white/15 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none"
                >
                  <option value="Excellent">Excellent • Flawless Tajweed</option>
                  <option value="Very Good">Very Good • Minor Makhraj Correction</option>
                  <option value="Good">Good • Needs Repetition</option>
                  <option value="Needs Practice">Needs Practice • Heavy Revision Required</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-100/80 uppercase tracking-wider mb-1.5">
                  Detailed Teacher Feedback
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Notes on Makharij, Ghunnah, Qalqalah, or fluency..."
                  value={newFeedback}
                  onChange={(e) => setNewFeedback(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-100/80 uppercase tracking-wider mb-1.5">
                  Home Practice / Homework Assignment
                </label>
                <input
                  type="text"
                  placeholder="e.g. Repeat Ayah 3-5 five times with Tarteel"
                  value={newHomework}
                  onChange={(e) => setNewHomework(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNoteModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-emerald-100/70 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-400 hover:bg-amber-300 text-emerald-950 px-5 py-2 rounded-xl text-xs font-bold transition shadow"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
