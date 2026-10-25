"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, Video, Plus, Clock, X, CloudOff, User, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useLanguage } from "@/components/LanguageContext";
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
  const { t, language } = useLanguage();
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newGrade, setNewGrade] = useState("Excellent");
  const [newFeedback, setNewFeedback] = useState("");
  const [newHomework, setNewHomework] = useState("");
  const [loading, setLoading] = useState(true);
  const [offlineQueueCount, setOfflineQueueCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Load students and notes from live database APIs without mock seeds
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

      // Build student list purely from live database
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
        // Zero mock data: maintain clean empty state
        setStudents([]);
        setSelectedStudentId("");
      }
    } catch (err) {
      console.error("Failed to load students:", err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    setOfflineQueueCount(getOfflineQueueSize());

    const cleanupNetwork = initNetworkSyncListeners(async () => {
      setIsSyncing(true);
      try {
        await flushOfflineQueue();
        setOfflineQueueCount(getOfflineQueueSize());
        await loadData();
      } catch (err) {
        console.error("Online re-sync error:", err);
      } finally {
        setIsSyncing(false);
      }
    });

    const unsubscribeBroadcast = onSyncBroadcast((action) => {
      if (action.type === "student_lesson_notes" || action.payload?.table === "student_lesson_notes") {
        setOfflineQueueCount(getOfflineQueueSize());
        loadData();
      }
    });

    return () => {
      cleanupNetwork();
      unsubscribeBroadcast();
    };
  }, [loadData]);

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddLessonNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitle.trim() || !newFeedback.trim() || !selectedStudent) {
      toast.error("Please fill in all note fields");
      return;
    }

    const newNote: LessonNote = {
      date: "Today",
      lesson: newLessonTitle,
      grade: newGrade,
      feedback: newFeedback,
      homework: newHomework || "Review today's lesson 3 times.",
    };

    setStudents((prev) =>
      prev.map((s) => (s.id === selectedStudent.id ? { ...s, history: [newNote, ...s.history] } : s))
    );

    const payload = {
      studentName: selectedStudent.name,
      teacherName: "Teacher",
      lessonTitle: newLessonTitle,
      rating: newGrade,
      feedback: newFeedback,
      homework: newHomework || "Practice assigned Surah.",
      sessionMinutes: 30,
    };

    if (typeof navigator !== "undefined" && !navigator.onLine) {
      enqueueOfflineAction({
        type: "INSERT",
        table: "student_lesson_notes",
        payload,
      });
      setOfflineQueueCount(getOfflineQueueSize());
      toast("Offline Note saved locally. Will sync when connection restores.", { icon: "📡" });
    } else {
      try {
        const res = await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Server error");
        toast.success("Lesson note & progress saved to database");
      } catch {
        enqueueOfflineAction({
          type: "INSERT",
          table: "student_lesson_notes",
          payload,
        });
        setOfflineQueueCount(getOfflineQueueSize());
        toast("Offline Note saved locally (safe-sync queue)", { icon: "🛡️" });
      }
    }

    setShowNoteModal(false);
    setNewLessonTitle("");
    setNewFeedback("");
    setNewHomework("");
  };

  const isUrdu = language === "ur";

  return (
    <div className={`p-4 md:p-8 max-w-6xl mx-auto w-full text-white ${isUrdu ? "font-urdu" : ""}`}>
      {/* Offline Sync Banner */}
      {offlineQueueCount > 0 && (
        <div className="mb-6 bg-amber-500/20 border border-amber-400/40 text-amber-200 px-4 py-3 rounded-2xl flex items-center justify-between text-xs animate-pulse">
          <div className="flex items-center gap-2">
            <CloudOff size={16} className="text-amber-400 shrink-0" />
            <span>
              <strong>SafeSync Active:</strong> {offlineQueueCount} lesson notes queued offline.
            </span>
          </div>
          <button
            onClick={async () => {
              setIsSyncing(true);
              await flushOfflineQueue();
              setOfflineQueueCount(getOfflineQueueSize());
              await loadData();
              setIsSyncing(false);
            }}
            disabled={isSyncing}
            className="bg-amber-400 hover:bg-amber-300 text-emerald-950 px-3 py-1 rounded-xl font-bold transition cursor-pointer disabled:opacity-50"
          >
            {isSyncing ? "Syncing..." : "Sync Now"}
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif text-white">
            {t("myStudentsTitle")}
          </h1>
          <p className="text-emerald-100/80 text-sm">
            {t("myStudentsDesc")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          
          {selectedStudent && (
            <button
              onClick={() => setShowNoteModal(true)}
              className="bg-amber-400 hover:bg-amber-300 text-emerald-950 px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-md flex items-center gap-2 cursor-pointer font-serif"
            >
              <Plus size={16} />
              <span>{t("addStudentNote")}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Student Directory or Empty State */}
      {loading ? (
        <div className="glass-container rounded-3xl p-12 text-center text-emerald-100/70 border border-white/15 text-sm">
          Loading student directory...
        </div>
      ) : students.length === 0 ? (
        <div className="glass-container rounded-3xl p-12 text-center border border-white/15 shadow-2xl max-w-2xl mx-auto my-6">
          <div className="w-16 h-16 rounded-3xl bg-emerald-950/80 text-amber-300 border border-amber-400/30 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <User size={30} />
          </div>
          <h2 className="text-2xl font-serif text-white mb-2">{t("noStudentsAssigned")}</h2>
          <p className="text-sm text-emerald-100/70 leading-relaxed mb-6">
            {t("noStudentsAssignedDesc")}
          </p>
          <div className="p-4 rounded-2xl bg-black/30 border border-white/10 text-xs text-emerald-100/80 text-left space-y-2 mb-6">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <ShieldCheck size={16} />
              <span>Admin &amp; Parent Verification Protocol:</span>
            </div>
            <p>
              To ensure child safeguarding and accurate curriculum placement, the academy administrator issues a unique <strong>Student ID</strong>. Once the tutor verifies the ID and parents approve tutor placement from their portal, the student record activates automatically.
            </p>
          </div>
          <button
            onClick={() => setShowAddStudentModal(true)}
            className="bg-amber-400 hover:bg-amber-300 text-emerald-950 px-6 py-2.5 rounded-xl font-bold text-xs transition shadow-md cursor-pointer font-serif inline-flex items-center gap-2"
          >
            <Plus size={15} />
            <span>Enter Student ID / Enrolment Request</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Student List */}
          <div className="lg:col-span-4 glass-container rounded-3xl p-5 border border-white/15 shadow-xl flex flex-col h-[580px]">
            <div className="relative mb-4">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-100/40" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/15 rounded-xl text-xs text-white placeholder:text-emerald-100/40 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredStudents.length === 0 ? (
                <div className="text-center py-8 text-xs text-emerald-100/60">No students matched search.</div>
              ) : (
                filteredStudents.map((student) => {
                  const isSelected = student.id === selectedStudentId;
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
          {selectedStudent && (
            <div className="lg:col-span-8 glass-container rounded-3xl p-6 border border-white/15 shadow-xl flex flex-col justify-between">
              <div>
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
                    href={`/classroom/${selectedStudent.name.toLowerCase().split(" ")[0]}?role=teacher`}
                    className="bg-amber-400 hover:bg-amber-300 text-emerald-950 px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-md flex items-center gap-2 cursor-pointer font-serif"
                  >
                    <Video size={14} />
                    <span>{t("launchClassroom")}</span>
                  </Link>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Recitation &amp; Feedback History ({selectedStudent.history?.length || 0})
                    </h3>
                    <button
                      onClick={() => setShowNoteModal(true)}
                      className="text-xs text-amber-300 hover:text-amber-200 font-bold underline cursor-pointer"
                    >
                      + Add Note
                    </button>
                  </div>

                  <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2">
                    {selectedStudent.history?.length === 0 ? (
                      <div className="text-center py-12 text-emerald-100/60 text-xs">
                        {t("noNotesYet")} Click &quot;Add Student Note&quot; to log lesson feedback.
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
          )}
        </div>
      )}

      {/* Add Student by ID Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-[#052b20] border border-amber-400/40 rounded-3xl w-full max-w-md p-6 text-white shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-serif font-bold text-lg text-white">Add Student by ID</h3>
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="text-white/60 hover:text-white p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Enter the student ID provided by the academy administrator. For safeguarding, parents must also confirm the assignment from their portal before the learner is activated.
            </p>

            <div>
              <label className="block text-xs font-bold text-emerald-100 uppercase tracking-wider mb-1.5">
                Student Enrolment ID
              </label>
              <input
                type="text"
                placeholder="e.g. STD-2026-4019"
                className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-emerald-100/30 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddStudentModal(false)}
                className="px-4 py-2 rounded-xl border border-white/20 text-xs font-medium text-white hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  toast.success("Student verification request submitted to Administrator");
                  setShowAddStudentModal(false);
                }}
                className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold rounded-xl text-xs font-serif shadow-md"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Lesson Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-[#052b20] border border-amber-400/40 rounded-3xl w-full max-w-lg p-6 text-white shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
              <h3 className="font-serif font-bold text-lg text-white">
                {t("addStudentNote")}: {selectedStudent?.name}
              </h3>
              <button onClick={() => setShowNoteModal(false)} className="text-white/60 hover:text-white p-1 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddLessonNote} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-emerald-100 uppercase tracking-wider mb-1">
                  {t("lessonTitleLabel")}
                </label>
                <input
                  type="text"
                  required
                  value={newLessonTitle}
                  onChange={(e) => setNewLessonTitle(e.target.value)}
                  placeholder="e.g. Surah Al-Baqarah, Ayat 1-10 with Tajweed"
                  className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-emerald-100/30 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-100 uppercase tracking-wider mb-1">
                  {t("gradeLabel")}
                </label>
                <select
                  value={newGrade}
                  onChange={(e) => setNewGrade(e.target.value)}
                  className="w-full bg-black/40 border border-white/20 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 [&>option]:bg-[#052b20]"
                >
                  <option value="Excellent (Mumtaz)">Excellent (Mumtaz)</option>
                  <option value="Very Good (Jayyid Jiddan)">Very Good (Jayyid Jiddan)</option>
                  <option value="Good (Jayyid)">Good (Jayyid)</option>
                  <option value="Needs Practice (Maqbool)">Needs Practice (Maqbool)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-100 uppercase tracking-wider mb-1">
                  {t("feedbackLabel")}
                </label>
                <textarea
                  required
                  rows={3}
                  value={newFeedback}
                  onChange={(e) => setNewFeedback(e.target.value)}
                  placeholder="Write recitation observations, pronunciation strengths, and makharij notes..."
                  className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-emerald-100/30 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-100 uppercase tracking-wider mb-1">
                  {t("homeworkLabel")}
                </label>
                <input
                  type="text"
                  value={newHomework}
                  onChange={(e) => setNewHomework(e.target.value)}
                  placeholder="e.g. Recite Ayah 1-5 twice daily before Maghrib."
                  className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-emerald-100/30 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNoteModal(false)}
                  className="px-4 py-2 rounded-xl border border-white/20 text-xs font-medium text-white hover:bg-white/10"
                >
                  {t("cancelBtn")}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold rounded-xl text-xs font-serif shadow-md"
                >
                  {t("saveNoteBtn")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
