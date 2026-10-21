"use client";

import { useState } from "react";
import { Download, Award, CheckCircle, BookOpen, Star, FileText } from "lucide-react";
import toast from "react-hot-toast";

interface ChildProgressData {
  name: string;
  age: number;
  course: string;
  teacher: string;
  progressPercent: number;
  totalClasses: number;
  attendanceRate: string;
  tajweedScore: string;
  currentMilestone: string;
  sabaq: string;
  sabqi: string;
  manzil: string;
  notes: Array<{
    date: string;
    teacher: string;
    lesson: string;
    rating: string;
    feedback: string;
    homework: string;
  }>;
}

const CHILDREN_DATA: Record<string, ChildProgressData> = {
  yusuf: {
    name: "Yusuf Khan",
    age: 9,
    course: "Quran Reading & Noorani Qaida",
    teacher: "Ustadha Maryam Ahmed",
    progressPercent: 75,
    totalClasses: 18,
    attendanceRate: "100%",
    tajweedScore: "4.8 / 5.0",
    currentMilestone: "Noorani Qaida - Lesson 3: Joined Letters",
    sabaq: "Joined letters with throat sounds (Ghayn, Khaa, Ayn, Haa)",
    sabqi: "Huruf Mufradaat (Isolated alphabet fluency)",
    manzil: "Surah Al-Fatiha & Ayat al-Kursi recitation",
    notes: [
      {
        date: "14 Oct 2026",
        teacher: "Ustadha Maryam Ahmed",
        lesson: "Lesson 3: Joined Letters",
        rating: "Excellent",
        feedback: "Yusuf showed remarkable focus today. His recognition of middle-word joined letters has improved noticeably.",
        homework: "Revise Qaida page 12 twice before Friday lesson."
      },
      {
        date: "11 Oct 2026",
        teacher: "Ustadha Maryam Ahmed",
        lesson: "Lesson 2: Heavy & Light Letters",
        rating: "Very Good",
        feedback: "Clear distinction between Saad and Seen. Working on throat heaviness for letter Qaf.",
        homework: "Listen to audio recording and repeat 5 times."
      }
    ]
  },
  hana: {
    name: "Hana Khan",
    age: 12,
    course: "Hifz & Tajweed Memorisation",
    teacher: "Sheikh Bilal Hassan",
    progressPercent: 88,
    totalClasses: 36,
    attendanceRate: "98%",
    tajweedScore: "4.9 / 5.0",
    currentMilestone: "Juz 30 (Amma) - Surah An-Naba Verses 1–25",
    sabaq: "Surah An-Naba (Verses 1 to 20 with proper Ghunnah and Madd)",
    sabqi: "Surah An-Naziat & Surah Abasa (Full revision)",
    manzil: "Juz 29 (Surah Al-Mulk to Surah Al-Qalam)",
    notes: [
      {
        date: "15 Oct 2026",
        teacher: "Sheikh Bilal Hassan",
        lesson: "Surah An-Naba (1–20)",
        rating: "Mastered",
        feedback: "Flawless memorisation with exact stop (Waqf) rules. Hana's recitation tone and pacing are exemplary.",
        homework: "Memorise verses 21 to 30 for next Thursday."
      },
      {
        date: "12 Oct 2026",
        teacher: "Sheikh Bilal Hassan",
        lesson: "Surah Al-Mursalat Revision",
        rating: "Excellent",
        feedback: "Retained the entire surah without any stumbles. Recommended for monthly academy recitation honors.",
        homework: "Review Juz 30 quarter 1."
      }
    ]
  }
};

export default function ParentProgress() {
  const [activeChildKey, setActiveChildKey] = useState<"yusuf" | "hana">("yusuf");
  const child = CHILDREN_DATA[activeChildKey];

  const handleDownloadReport = () => {
    toast.success(`Generating official PDF progress report for ${child.name}...`);
    const a = document.createElement("a");
    a.href = "/api/reports/download";
    a.download = `progress-report-${child.name.toLowerCase().replace(/\s+/g, "-")}.pdf`;
    a.click();
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif text-white mb-1">Academic Progress & Hifz Tracking</h1>
          <p className="text-emerald-100/80 text-sm">
            Detailed learning logs, Tajweed mastery ratings, and monthly progress evaluations.
          </p>
        </div>

        {/* Child Selector Tabs & Report Action */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 text-xs font-bold">
            <button
              onClick={() => setActiveChildKey("yusuf")}
              className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
                activeChildKey === "yusuf"
                  ? "bg-amber-400 text-emerald-950 shadow-md"
                  : "text-emerald-100/70 hover:text-white"
              }`}
            >
              Yusuf Khan (9)
            </button>
            <button
              onClick={() => setActiveChildKey("hana")}
              className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
                activeChildKey === "hana"
                  ? "bg-amber-400 text-emerald-950 shadow-md"
                  : "text-emerald-100/70 hover:text-white"
              }`}
            >
              Hana Khan (12)
            </button>
          </div>

          <button
            onClick={handleDownloadReport}
            className="bg-amber-400 hover:bg-amber-300 text-emerald-950 px-4 py-2 rounded-xl font-bold text-xs transition shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={14} />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="glass-container rounded-3xl p-5 border border-white/15 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Overall Mastery</span>
            <Award className="w-5 h-5 text-amber-300" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{child.progressPercent}%</div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-1000"
              style={{ width: `${child.progressPercent}%` }}
            />
          </div>
        </div>

        <div className="glass-container rounded-3xl p-5 border border-white/15 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Classes Completed</span>
            <CheckCircle className="w-5 h-5 text-emerald-300" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{child.totalClasses}</div>
          <p className="text-xs text-emerald-100/75">Attendance: {child.attendanceRate}</p>
        </div>

        <div className="glass-container rounded-3xl p-5 border border-white/15 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Tajweed Score</span>
            <Star className="w-5 h-5 text-amber-300" />
          </div>
          <div className="text-3xl font-bold text-amber-300 mb-1">{child.tajweedScore}</div>
          <p className="text-xs text-emerald-100/75">Verified Makhaarij accuracy</p>
        </div>

        <div className="glass-container rounded-3xl p-5 border border-white/15 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Teacher</span>
            <BookOpen className="w-5 h-5 text-emerald-300" />
          </div>
          <div className="text-lg font-bold text-white mb-1 truncate">{child.teacher}</div>
          <p className="text-xs text-emerald-100/75">{child.course}</p>
        </div>
      </div>

      {/* Sabaq, Sabqi & Manzil Triad */}
      <div className="glass-container rounded-3xl p-6 md:p-8 border border-white/15 shadow-2xl mb-8">
        <h2 className="text-xl font-bold font-serif text-white mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-amber-300" />
          <span>Daily Quranic Triad Breakdown</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-black/35 border border-amber-400/30">
            <div className="text-xs font-bold uppercase tracking-widest text-amber-300 mb-1">
              Sabaq (New Lesson)
            </div>
            <div className="text-sm font-semibold text-white mb-2">{child.sabaq}</div>
            <p className="text-xs text-emerald-100/70">
              Evaluated in each live session. Focuses on newly introduced rules and accuracy.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-black/35 border border-white/10">
            <div className="text-xs font-bold uppercase tracking-widest text-emerald-300 mb-1">
              Sabqi (Recent Revision)
            </div>
            <div className="text-sm font-semibold text-white mb-2">{child.sabqi}</div>
            <p className="text-xs text-emerald-100/70">
              Covers the last 5 pages or previous 2 surahs to ensure recent memory retention.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-black/35 border border-white/10">
            <div className="text-xs font-bold uppercase tracking-widest text-emerald-300 mb-1">
              Manzil (Distant Revision)
            </div>
            <div className="text-sm font-semibold text-white mb-2">{child.manzil}</div>
            <p className="text-xs text-emerald-100/70">
              Long-term retention cycle ensuring previously completed chapters are never forgotten.
            </p>
          </div>
        </div>
      </div>

      {/* Teacher Notes Timeline */}
      <div className="glass-container rounded-3xl p-6 md:p-8 border border-white/15 shadow-2xl">
        <h2 className="text-xl font-bold font-serif text-white mb-6">Recent Teacher Lesson Notes</h2>

        <div className="space-y-4">
          {child.notes.map((note, index) => (
            <div
              key={index}
              className="p-5 rounded-2xl bg-black/35 border border-white/10 hover:border-amber-400/30 transition-all"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-amber-300 bg-amber-400/20 border border-amber-400/30 px-2.5 py-1 rounded-lg">
                    {note.date}
                  </span>
                  <span className="text-sm font-bold text-white">{note.lesson}</span>
                </div>
                <span className="text-xs font-bold bg-emerald-900/80 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full uppercase">
                  {note.rating}
                </span>
              </div>

              <p className="text-sm text-emerald-100/90 leading-relaxed mb-3">{note.feedback}</p>

              <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs">
                <span className="font-bold text-amber-300 mr-1.5 uppercase tracking-wider text-[10px]">
                  Assigned Homework:
                </span>
                <span className="text-emerald-100/80">{note.homework}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
