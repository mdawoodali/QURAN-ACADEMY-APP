"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  GraduationCap, 
  Users, 
  Award, 
  Search, 
  CheckCircle2, 
  ChevronRight, 
  X, 
  Eye, 
  EyeOff, 
  UserCheck, 
  Sparkles,
  PlusCircle
} from "lucide-react";
import { registerUnifiedUser } from "./actions";
import { loginWithGoogle } from "../login/actions";

export interface WardRecord {
  id: string;
  name: string;
  age: number;
  course: string;
  teacher?: string;
  studentId?: string;
}

const PRESET_WARDS: WardRecord[] = [
  {
    id: "ward_yusuf",
    name: "Yusuf Khan",
    age: 9,
    course: "Quran Reading for Kids (Noorani Qaida)",
    teacher: "Ustadha Maryam Ahmed",
    studentId: "STU-2026-001"
  },
  {
    id: "ward_hana",
    name: "Hana Khan",
    age: 12,
    course: "Hifz & Tajweed Memorisation",
    teacher: "Sheikh Tariq Mehmood",
    studentId: "STU-2026-002"
  },
  {
    id: "ward_amina",
    name: "Amina Khan",
    age: 10,
    course: "Tajweed Fluency & Recitation",
    teacher: "Ustadha Maryam Ahmed",
    studentId: "STU-2026-003"
  },
  {
    id: "ward_omar",
    name: "Omar Ali",
    age: 11,
    course: "Quran Memorisation (Juz Amma)",
    teacher: "Sheikh Tariq Mehmood",
    studentId: "STU-2026-004"
  },
  {
    id: "ward_zayd",
    name: "Zayd Farooq",
    age: 8,
    course: "Kids Reading & Noorani Qaida",
    teacher: "Qari Bilal",
    studentId: "STU-2026-005"
  },
  {
    id: "ward_bilal",
    name: "Bilal Ahmed",
    age: 13,
    course: "Advanced Tajweed & Tarteel",
    teacher: "Sheikh Tariq Mehmood",
    studentId: "STU-2026-006"
  },
  {
    id: "ward_fatima",
    name: "Fatima Zahra",
    age: 10,
    course: "Islamic Studies & Daily Duas",
    teacher: "Ustadha Fatima",
    studentId: "STU-2026-007"
  }
];

export default function RegisterClient({ initialError }: { initialError?: string }) {
  const [selectedRole, setSelectedRole] = useState<"student" | "parent" | "teacher">("parent");
  const [showPassword, setShowPassword] = useState(false);

  // Ward search states for Parent role
  const [availableWards, setAvailableWards] = useState<WardRecord[]>(PRESET_WARDS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedWard, setSelectedWard] = useState<WardRecord | null>(null);
  const [isAddingNewWard, setIsAddingNewWard] = useState(false);
  const [newWardName, setNewWardName] = useState("");
  const [newWardAge, setNewWardAge] = useState(8);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch live enrolments to merge into searchable list
  useEffect(() => {
    fetch("/api/enrolments?_t=" + Date.now())
      .then((r) => r.json())
      .then((data) => {
        if (data.enrolments && data.enrolments.length > 0) {
          const fetchedWards: WardRecord[] = data.enrolments.map((e: any) => ({
            id: e.id,
            name: e.learner || e.student_name || "Enrolled Student",
            age: e.age || 10,
            course: e.programme || e.course_title || "Quran Reading & Tajweed",
            teacher: e.matchedTeacher,
            studentId: e.id.slice(0, 8).toUpperCase(),
          }));

          // Deduplicate by name
          setAvailableWards((prev) => {
            const combined = [...fetchedWards, ...prev];
            const seen = new Set<string>();
            return combined.filter((item) => {
              const lower = item.name.toLowerCase();
              if (seen.has(lower)) return false;
              seen.add(lower);
              return true;
            });
          });
        }
      })
      .catch(() => {});
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Filtered wards
  const filteredWards = availableWards.filter((w) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      w.name.toLowerCase().includes(q) ||
      w.course.toLowerCase().includes(q) ||
      (w.studentId && w.studentId.toLowerCase().includes(q))
    );
  });

  const handleSelectWard = (ward: WardRecord) => {
    setSelectedWard(ward);
    setIsAddingNewWard(false);
    setIsDropdownOpen(false);
    setSearchQuery("");
  };

  const handleClearSelectedWard = () => {
    setSelectedWard(null);
    setIsAddingNewWard(false);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4 py-8 sm:py-12">
      <div className="max-w-2xl w-full glass-container rounded-3xl p-6 sm:p-10 border border-white/15 shadow-2xl text-white">
        
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-3 group mb-3" title="Back to Quran Learn Academy">
            <div className="bg-emerald-800/90 border border-amber-400/40 p-2.5 rounded-2xl text-amber-300 shadow-md group-hover:scale-105 transition-transform">
              <BookOpen size={28} />
            </div>
            <div className="text-left">
              <span className="font-serif font-bold text-lg tracking-tight leading-tight text-white block">
                Quran Learn Academy
              </span>
            </div>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-serif text-white font-bold">Create Your Account</h1>
          <p className="text-emerald-100/80 text-xs sm:text-sm mt-1 max-w-md">
            Select what you are registering as and get instant access to your customized dashboard and live classroom.
          </p>
        </div>

        {initialError && (
          <div className="bg-red-950/70 text-red-200 p-3.5 rounded-xl text-xs sm:text-sm font-semibold mb-6 border border-red-500/40 flex items-center gap-2">
            <span>⚠️</span>
            <span>{initialError}</span>
          </div>
        )}

        {/* 1. ROLE SELECTOR TABS (Front & Center) */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-2 text-center">
            I am Registering As:
          </label>
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-black/50 rounded-2xl border border-white/15 backdrop-blur-md">
            
            {/* Student Tab */}
            <button
              type="button"
              onClick={() => setSelectedRole("student")}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedRole === "student"
                  ? "bg-gradient-to-r from-amber-400 to-amber-500 text-emerald-950 shadow-md ring-2 ring-amber-300/40"
                  : "text-emerald-100/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <GraduationCap size={16} />
              <span>Student</span>
            </button>

            {/* Parent Tab */}
            <button
              type="button"
              onClick={() => setSelectedRole("parent")}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer relative ${
                selectedRole === "parent"
                  ? "bg-gradient-to-r from-amber-400 to-amber-500 text-emerald-950 shadow-md ring-2 ring-amber-300/40"
                  : "text-emerald-100/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <Users size={16} />
              <span>Parent / Guardian</span>
              <span className="absolute -top-2 right-1 bg-emerald-700 text-amber-300 text-[9px] px-1.5 py-0.2 rounded-full border border-amber-400/40 hidden sm:inline">
                Family
              </span>
            </button>

            {/* Teacher Tab */}
            <button
              type="button"
              onClick={() => setSelectedRole("teacher")}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedRole === "teacher"
                  ? "bg-gradient-to-r from-amber-400 to-amber-500 text-emerald-950 shadow-md ring-2 ring-amber-300/40"
                  : "text-emerald-100/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <Award size={16} />
              <span>Teacher / Tutor</span>
            </button>
          </div>
        </div>

        {/* 1B. PROMINENT 1-CLICK GOOGLE SIGN IN & REGISTRATION */}
        <div className="mb-6">
          <form action={loginWithGoogle}>
            <input type="hidden" name="role" value={selectedRole} />
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-stone-100 text-stone-900 py-3.5 px-4 rounded-2xl font-bold transition-all shadow-md hover:shadow-lg border border-stone-200 text-sm sm:text-base cursor-pointer group"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>
                Sign in with Google ({selectedRole === "parent" ? "Parent" : selectedRole === "teacher" ? "Teacher" : "Student"})
              </span>
            </button>
          </form>

          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-white/15"></div>
            <span className="flex-shrink mx-4 text-xs font-semibold text-emerald-100/60 uppercase tracking-wider">
              or register with email below
            </span>
            <div className="flex-grow border-t border-white/15"></div>
          </div>
        </div>

        {/* 2. MAIN REGISTRATION FORM */}
        <form action={registerUnifiedUser} className="space-y-4 sm:space-y-5">
          {/* Hidden Role Input */}
          <input type="hidden" name="role" value={selectedRole} />

          {/* Hidden Ward Linkage Inputs (Populated when role === 'parent') */}
          {selectedRole === "parent" && (
            <>
              <input
                type="hidden"
                name="wardName"
                value={isAddingNewWard ? newWardName : (selectedWard?.name || "")}
              />
              <input
                type="hidden"
                name="wardAge"
                value={isAddingNewWard ? newWardAge : (selectedWard?.age || 10)}
              />
              <input
                type="hidden"
                name="wardCourse"
                value={selectedWard?.course || "Quran Reading for Kids (Noorani Qaida)"}
              />
              <input
                type="hidden"
                name="wardId"
                value={selectedWard?.studentId || selectedWard?.id || ""}
              />
            </>
          )}

          {/* PARENT SPECIFIC: SEARCHABLE WARD SELECTOR FACILITY */}
          {selectedRole === "parent" && (
            <div className="bg-[#022319]/90 border border-amber-400/40 rounded-2xl p-4 sm:p-5 shadow-lg animate-in fade-in-50">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <UserCheck className="text-amber-400 shrink-0" size={18} />
                  <span className="text-xs sm:text-sm font-bold text-amber-300">
                    Search & Select Your Ward (Child)
                  </span>
                </div>
                <span className="text-[10px] text-emerald-200/70 uppercase tracking-wider font-semibold">
                  Required for Family Data
                </span>
              </div>
              <p className="text-xs text-emerald-100/80 mb-3 leading-relaxed">
                Search our academy records to link your child. This allows your parent portal to display your ward&apos;s live lesson schedules, teacher notes, and recitation milestones.
              </p>

              {/* Display if already selected */}
              {selectedWard && !isAddingNewWard ? (
                <div className="bg-emerald-950/90 border border-amber-400/60 rounded-xl p-3 sm:p-4 flex items-center justify-between gap-3 shadow-md">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-amber-400 text-emerald-950 font-bold flex items-center justify-center shrink-0 text-xs">
                      {selectedWard.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white truncate">{selectedWard.name}</span>
                        <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                          Age {selectedWard.age}
                        </span>
                      </div>
                      <p className="text-xs text-emerald-200/80 truncate">{selectedWard.course}</p>
                      {selectedWard.teacher && (
                        <p className="text-[11px] text-amber-300/80 truncate">Tutor: {selectedWard.teacher}</p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearSelectedWard}
                    className="text-xs bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 rounded-lg font-semibold transition shrink-0 cursor-pointer"
                  >
                    Change Ward
                  </button>
                </div>
              ) : isAddingNewWard ? (
                /* Manual ward enrollment fields */
                <div className="bg-black/40 border border-white/15 rounded-xl p-3.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300">Enroll a New Child</span>
                    <button
                      type="button"
                      onClick={() => setIsAddingNewWard(false)}
                      className="text-[11px] text-emerald-200/80 hover:text-white underline cursor-pointer"
                    >
                      ← Back to Search
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-emerald-100 mb-1">Child Full Name</label>
                      <input
                        type="text"
                        value={newWardName}
                        onChange={(e) => setNewWardName(e.target.value)}
                        required={isAddingNewWard}
                        placeholder="e.g. Ibrahim Khan"
                        className="w-full px-3 py-2 bg-black/60 border border-white/20 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-emerald-100 mb-1">Child Age</label>
                      <input
                        type="number"
                        min="4"
                        max="20"
                        value={newWardAge}
                        onChange={(e) => setNewWardAge(Number(e.target.value))}
                        required={isAddingNewWard}
                        className="w-full px-3 py-2 bg-black/60 border border-white/20 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* Search facility dropdown */
                <div className="relative" ref={dropdownRef}>
                  <div className="relative flex items-center">
                    <Search size={16} className="absolute left-3.5 text-amber-400/90 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsDropdownOpen(true);
                      }}
                      onFocus={() => setIsDropdownOpen(true)}
                      placeholder="Search ward by name (e.g. Yusuf, Hana, Amina) or course..."
                      className="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-amber-400/50 rounded-xl text-white placeholder:text-emerald-200/40 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-amber-400"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 text-emerald-300 hover:text-white"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* Dropdown Results */}
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 max-h-56 overflow-y-auto bg-[#04241b] border border-amber-400/40 rounded-xl shadow-2xl z-30 divide-y divide-white/10 animate-in fade-in-50">
                      {filteredWards.length > 0 ? (
                        filteredWards.map((ward) => (
                          <div
                            key={ward.id}
                            onClick={() => handleSelectWard(ward)}
                            className="p-3 hover:bg-emerald-800/50 cursor-pointer transition flex items-center justify-between gap-3 text-left"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-300 font-bold flex items-center justify-center shrink-0 text-[11px] border border-amber-400/30">
                                {ward.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-xs text-white truncate">{ward.name}</span>
                                  <span className="text-[10px] text-amber-300 font-mono">({ward.age} yrs)</span>
                                </div>
                                <p className="text-[11px] text-emerald-200/70 truncate">{ward.course}</p>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold text-amber-300 bg-black/40 border border-amber-400/20 px-2 py-0.5 rounded-md shrink-0">
                              Select Ward
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-xs text-emerald-200/70">
                          No student matching &quot;{searchQuery}&quot; found in academy records.
                        </div>
                      )}

                      {/* Fallback to add new ward */}
                      <div
                        onClick={() => {
                          setIsAddingNewWard(true);
                          setIsDropdownOpen(false);
                          if (searchQuery.trim()) {
                            setNewWardName(searchQuery.trim());
                          }
                        }}
                        className="p-3 bg-black/40 hover:bg-amber-400 hover:text-emerald-950 text-amber-300 text-xs font-bold cursor-pointer transition flex items-center justify-center gap-1.5"
                      >
                        <PlusCircle size={14} />
                        <span>My child is not listed yet — Register a New Child</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* CORE FIELDS: Name, Email, Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-emerald-100 mb-1.5">
                {selectedRole === "parent" ? "Parent / Guardian Full Name" : "Full Name"}
              </label>
              <input
                name="fullName"
                required
                placeholder={selectedRole === "parent" ? "e.g. Tariq Mehmood" : "e.g. Yusuf Khan"}
                className="w-full px-3.5 py-2.5 bg-black/40 border border-white/20 rounded-xl text-white placeholder:text-emerald-200/40 text-xs sm:text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-100 mb-1.5">Email Address</label>
              <input
                name="email"
                type="email"
                required
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 bg-black/40 border border-white/20 rounded-xl text-white placeholder:text-emerald-200/40 text-xs sm:text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-100 mb-1.5">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/20 rounded-xl text-white placeholder:text-emerald-200/40 text-xs sm:text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-300 hover:text-white"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-100 mb-1.5">WhatsApp / Mobile Number</label>
              <input
                name="mobile"
                required
                placeholder="+44 7123 456789 / +92 300 1234567"
                className="w-full px-3.5 py-2.5 bg-black/40 border border-white/20 rounded-xl text-white placeholder:text-emerald-200/40 text-xs sm:text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-100 mb-1.5">Country & City</label>
              <input
                name="location"
                required
                placeholder="United Kingdom, London"
                className="w-full px-3.5 py-2.5 bg-black/40 border border-white/20 rounded-xl text-white placeholder:text-emerald-200/40 text-xs sm:text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>

            {/* DYNAMIC FIELD: Student Age or Teacher Qualification */}
            {selectedRole === "student" && (
              <div>
                <label className="block text-xs font-semibold text-emerald-100 mb-1.5">Student Age</label>
                <input
                  name="age"
                  type="number"
                  min="4"
                  max="99"
                  required
                  placeholder="e.g. 10"
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/20 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>
            )}

            {selectedRole === "teacher" && (
              <div>
                <label className="block text-xs font-semibold text-emerald-100 mb-1.5">Quranic Qualification / Ijazah</label>
                <input
                  name="qualification"
                  required
                  placeholder="e.g. Hafiz-ul-Quran / Tajweed Sanad"
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/20 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>
            )}

            {selectedRole === "parent" && (
              <div>
                <label className="block text-xs font-semibold text-emerald-100 mb-1.5">Primary Language at Home</label>
                <select
                  name="language"
                  className="w-full px-3.5 py-2.5 bg-black/60 border border-white/20 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 cursor-pointer"
                >
                  <option value="English">English</option>
                  <option value="Urdu">Urdu (اردو)</option>
                  <option value="Arabic">Arabic (العربية)</option>
                  <option value="Bilingual">English + Urdu</option>
                </select>
              </div>
            )}
          </div>

          {/* DYNAMIC: Program track for student */}
          {selectedRole === "student" && (
            <div>
              <label className="block text-xs font-semibold text-emerald-100 mb-1.5">Program Track</label>
              <select
                name="program"
                className="w-full px-3.5 py-2.5 bg-black/60 border border-white/20 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 cursor-pointer"
              >
                <option value="Kids Reading & Noorani Qaida">Noorani Qaida & Basic Arabic Letters</option>
                <option value="Quran Reading with Tajweed">Quran Recitation with Tajweed Rules</option>
                <option value="Hifz (Quran Memorization)">Hifz & Memorization of the Holy Quran</option>
                <option value="Islamic Studies & Daily Duas">Islamic Studies, Fiqh & Daily Duas</option>
              </select>
            </div>
          )}

          {/* DYNAMIC: Maslak for teacher */}
          {selectedRole === "teacher" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-emerald-100 mb-1.5">Teaching Experience (Years)</label>
                <input
                  name="experience"
                  type="number"
                  min="0"
                  placeholder="e.g. 5"
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/20 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-emerald-100 mb-1.5">Sect / Tradition</label>
                <select
                  name="maslak"
                  className="w-full px-3.5 py-2.5 bg-black/60 border border-white/20 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 cursor-pointer"
                >
                  <option value="Sunni">Sunni</option>
                  <option value="Shia">Shia</option>
                  <option value="Non-denominational">Non-denominational</option>
                </select>
              </div>
            </div>
          )}

          {/* 3. PRIMARY SUBMIT BUTTON */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 py-3 sm:py-3.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-amber-400/20 text-sm cursor-pointer mt-2"
          >
            <span>
              {selectedRole === "parent"
                ? "Register as Parent & Link Ward"
                : selectedRole === "teacher"
                ? "Register as Teacher"
                : "Register as Student"}
            </span>
            <ChevronRight size={17} />
          </button>
        </form>

        {/* 4. FAST TRACK GOOGLE SIGN-IN (BOTTOM SECONDARY) */}
        <div className="mt-5 pt-5 border-t border-white/10">
          <form action={loginWithGoogle}>
            <input type="hidden" name="role" value={selectedRole} />
            <button
              type="submit"
              className="w-full py-3 px-4 bg-white hover:bg-stone-100 border border-stone-200 rounded-xl text-xs sm:text-sm font-bold text-stone-900 transition flex items-center justify-center gap-2.5 cursor-pointer shadow-md"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>
                Sign in with Google ({selectedRole === "parent" ? "Parent" : selectedRole === "teacher" ? "Teacher" : "Student"})
              </span>
            </button>
          </form>
        </div>

        {/* 5. FOOTER: Sign In Link */}
        <div className="mt-5 text-center text-xs text-emerald-100/70">
          Already have an account?{" "}
          <Link href="/login" className="text-amber-300 hover:text-amber-200 font-bold underline">
            Sign In to your portal
          </Link>
        </div>

      </div>
    </div>
  );
}
