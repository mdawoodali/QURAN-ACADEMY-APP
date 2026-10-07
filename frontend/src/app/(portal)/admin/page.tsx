"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/Animations";

export default function AdminDashboard() {
  const [pendingTeachers, setPendingTeachers] = useState([
    { id: 1, name: "Ahmed Yasin", date: "Applied 2 days ago" },
    { id: 2, name: "Fatima Noor", date: "Applied 3 days ago" }
  ]);

  const [pendingClasses, setPendingClasses] = useState([
    { id: 1, student: "Zayd Ali", prog: "Hifz", tz: "EST" },
    { id: 2, student: "Aisha M.", prog: "Qaida", tz: "GMT" }
  ]);

  const handleReview = (id: number) => {
    toast.success("Opened teacher profile for review");
    setPendingTeachers(prev => prev.filter(t => t.id !== id));
  };

  const handleAssign = (id: number) => {
    toast.success("Class successfully assigned to teacher");
    setPendingClasses(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="w-full h-full p-4 md:p-8 flex flex-col bg-[#F8F9FA] text-[#111827] overflow-x-hidden">
      <FadeIn>
        <h1 className="text-3xl font-serif text-[#0C4A3A] mb-8">Admin Overview</h1>
      </FadeIn>
      
      <StaggerContainer className="grid md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Active Teachers", value: "42" },
          { label: "Total Students", value: "815" },
          { label: "Classes Today", value: "112" },
          { label: "Pending Reviews", value: pendingTeachers.length.toString() }
        ].map((stat, i) => (
          <StaggerItem key={i}>
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">{stat.label}</p>
              <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Teachers Pending */}
        <FadeIn delay={0.2} className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Teachers pending review</h2>
            <Link href="#" className="text-sm font-bold text-emerald-600 hover:text-emerald-800">View all</Link>
          </div>
          <div className="space-y-4 flex-1">
            {pendingTeachers.length === 0 ? (
              <p className="text-gray-500 text-sm">All caught up!</p>
            ) : (
              pendingTeachers.map((teacher) => (
                <div key={teacher.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-emerald-100 transition">
                  <div>
                    <div className="font-bold text-gray-900">{teacher.name}</div>
                    <div className="text-xs text-gray-500">{teacher.date}</div>
                  </div>
                  <button onClick={() => handleReview(teacher.id)} className="text-xs font-bold bg-[#0C4A3A] text-white px-4 py-2 rounded-lg hover:bg-[#0D5C46] transition transform hover:scale-105 active:scale-95 shadow-sm">
                    Review
                  </button>
                </div>
              ))
            )}
          </div>
        </FadeIn>

        {/* Scheduling Queue */}
        <FadeIn delay={0.3} className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Classes to schedule</h2>
            <Link href="#" className="text-sm font-bold text-emerald-600 hover:text-emerald-800">View queue</Link>
          </div>
          <div className="space-y-4 flex-1">
            {pendingClasses.length === 0 ? (
              <p className="text-gray-500 text-sm">No pending classes.</p>
            ) : (
              pendingClasses.map((cls) => (
                <div key={cls.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-emerald-100 transition">
                  <div>
                    <div className="font-bold text-gray-900">{cls.student} <span className="text-gray-400 font-normal">({cls.tz})</span></div>
                    <div className="text-xs text-gray-500">{cls.prog}</div>
                  </div>
                  <button onClick={() => handleAssign(cls.id)} className="text-xs font-bold bg-emerald-100 text-emerald-800 px-4 py-2 rounded-lg hover:bg-emerald-200 transition transform hover:scale-105 active:scale-95">
                    Assign
                  </button>
                </div>
              ))
            )}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
