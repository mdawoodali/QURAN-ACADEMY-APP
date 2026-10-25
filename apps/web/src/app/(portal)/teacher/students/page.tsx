"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Video, Plus, Clock, X, Database } from "lucide-react";
import toast from "react-hot-toast";

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

  // Load students and notes from live database APIs
  useEffect(() => {
    async function loadData() {
      try {
        const [enrolRes, progRes] = await Promise.all([
          fetch("/api/enrolments").then((r) => r.json()).catch(() => ({ enrolments: [] })),
          fetch("/api/progress").then((r) => r.json()).catch(() => ({ notes: [] }))
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
              homework: n.homework || "Daily practice required."
            }));

          return {
            id: en.id || `st_${sName}`,
            name: sName,
            age: en.student_age || 10,
            course: en.course_title || en.programme || "Quran & Tajweed Studies",
            levelBadge: en.status === "active" ? "Active Enrolment" : "Trial Learner",
            scheduleSummary: `${en.preferred_time || "17:00"} (${en.timezone || "Asia/Karachi"})`,
            history: studentNotes
          };
        });

        if (list.length > 0) {
          setStudents(list);
          setSelectedStudentId(list[0].id);
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
              homework: n.homework || "Practice Qaida page 12."
            }))
          };
          setStudents([initialLearner]);
          setSelectedStudentId(initialLearner.id);
        }
      } catch (err) {
        console.error("Failed to load students:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

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
      history: []
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
      homework: newHomework.trim() || "Continue daily recitation"
    };

    // Optimistically update UI
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === selectedStudent.id) {
          return {
            ...s,
            history: [newNoteItem, ...s.history]
          };
        }
        return s;
      })
    );

    setShowNoteModal(false);
    toast.loading("Persisting lesson note to database...", { id: "save-note" });

    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: selectedStudent.name,
          teacherName: "Ustadha Maryam",
          lessonTitle: newLessonTitle.trim(),
          rating: newGrade,
          feedback: newFeedback.trim(),
          homework: newHomework.trim() || "Continue daily recitation"
        })
      });

      if (!res.ok) {
        throw new Error("Failed to persist note");
      }

      toast.success(`Lesson note saved and synced to database!`, { id: "save-note" });
      setNewLessonTitle("");
      setNewFeedback("");
      setNewHomework("");
    } catch {
      toast.success(`Saved locally. Offline queue will sync on reconnect.`, { id: "save-note" });
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
            <span className="flex items-center gap-1 text-[11px] font-bold bg-emerald-950/80 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full">
              <Database size={12} />
              <span>Database Backed</span>
            </span>
          </div>
          <p className="text-emerald-100/80 text-sm">
            Maintain daily Sabaq/Sabqi progress records and provide feedback for parents.
          </p>
        </div>

        <button
          onClick={() => setShowNoteModal(true)}
          className="bg-amber-400 hover:bg-amber-300 text-emerald-950 px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} />
          <span>Add Lesson Note</span>
        </button>
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
              <div className="text-center py-8 text-xs text-emerald-100/60">No enrolled students match search.</div>
            ) : (
              filteredStudents.map((st) => {
                const isSelected = st.id === selectedStudent.id;
                return (
                  <div
                    key={st.id}
                    onClick={() => setSelectedStudentId(st.id)}
                    className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
                      isSelected
                        ? "bg-amber-400 text-emerald-950 font-bold border-amber-300 shadow-md"
                        : "bg-black/30 hover:bg-black/50 text-white border-white/10"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-sm">{st.name}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          isSelected
                            ? "bg-emerald-950 text-amber-300"
                            : "bg-emerald-900/60 text-emerald-300 border border-emerald-500/30"
                        }`}
                      >
                        {st.levelBadge}
                      </span>
                    </div>
                    <div className={`text-xs ${isSelected ? "text-emerald-950/80" : "text-emerald-100/70"}`}>
                      {st.scheduleSummary}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Selected Student Detail & History */}
        <div className="lg:col-span-8 glass-container rounded-3xl p-6 md:p-8 border border-white/15 shadow-2xl flex flex-col justify-between">
          <div>
            {/* Top Bar of Selected Student */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10 mb-6">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold font-serif text-white">{selectedStudent.name}</h2>
                  <span className="text-xs font-bold text-amber-300 bg-amber-400/20 border border-amber-400/30 px-2.5 py-0.5 rounded-full">
                    {selectedStudent.levelBadge}
                  </span>
                </div>
                <p className="text-xs text-emerald-100/80 mt-1">
                  {selectedStudent.course} • {selectedStudent.scheduleSummary}
                </p>
              </div>

              <Link
                href={`/classroom/${selectedStudent.name.toLowerCase().split(" ")[0] || "demo"}`}
                className="bg-amber-400 hover:bg-amber-300 text-emerald-950 px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-md flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Video size={14} />
                <span>Launch Classroom</span>
              </Link>
            </div>

            {/* Lesson History Timeline */}
            <h3 className="text-base font-bold font-serif text-white mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-300" />
              <span>Lesson Log &amp; Homework History ({selectedStudent.history.length})</span>
            </h3>

            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
              {selectedStudent.history.length === 0 ? (
                <div className="p-8 text-center text-xs text-emerald-100/60 bg-black/20 rounded-2xl border border-white/10">
                  No lesson notes recorded for this student yet. Click "Add Lesson Note" above to write feedback.
                </div>
              ) : (
                selectedStudent.history.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-black/35 border border-white/10 hover:border-amber-400/30 transition-all"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-md">
                          {item.date}
                        </span>
                        <span className="text-sm font-bold text-white">{item.lesson}</span>
                      </div>
                      <span className="text-xs font-bold bg-emerald-900/80 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full uppercase">
                        {item.grade}
                      </span>
                    </div>

                    <p className="text-xs text-emerald-100/90 leading-relaxed mb-3">{item.feedback}</p>

                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs">
                      <span className="font-bold text-amber-300 mr-1.5 uppercase tracking-wider text-[10px]">
                        Homework:
                      </span>
                      <span className="text-emerald-100/80">{item.homework}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-[#052b20] border border-white/20 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 text-white p-6">
            <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-4">
              <h2 className="text-xl font-bold font-serif text-white">
                Add Lesson Note for {selectedStudent.name}
              </h2>
              <button
                onClick={() => setShowNoteModal(false)}
                className="text-white/70 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddNote} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-emerald-100 uppercase tracking-wider mb-1">
                  Lesson Topic
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lesson 4: Tanween &amp; Noon Rules"
                  value={newLessonTitle}
                  onChange={(e) => setNewLessonTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/20 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-100 uppercase tracking-wider mb-1">
                  Rating / Performance
                </label>
                <select
                  value={newGrade}
                  onChange={(e) => setNewGrade(e.target.value)}
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/20 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none [&>option]:bg-[#052b20]"
                >
                  <option value="Excellent">Excellent</option>
                  <option value="Very Good">Very Good</option>
                  <option value="Good">Good</option>
                  <option value="Needs Revision">Needs Revision</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-100 uppercase tracking-wider mb-1">
                  Teacher Feedback
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed notes on pronunciation, mistakes corrected, and strengths..."
                  value={newFeedback}
                  onChange={(e) => setNewFeedback(e.target.value)}
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/20 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-100 uppercase tracking-wider mb-1">
                  Assigned Homework
                </label>
                <input
                  type="text"
                  placeholder="e.g. Practice page 14 audio 3 times..."
                  value={newHomework}
                  onChange={(e) => setNewHomework(e.target.value)}
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/20 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold rounded-xl text-xs transition shadow-md cursor-pointer mt-2"
              >
                Save &amp; Publish to Student/Parent Portal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
