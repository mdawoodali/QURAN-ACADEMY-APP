"use client";

import { FadeIn, StaggerContainer, StaggerItem } from "@/components/Animations";
import Link from "next/link";

export default function TeacherStudents() {
  const students = [
    { id: 1, name: "Yusuf Ali", age: 10, prog: "Tajweed & Recitation", lvl: "Intermediate", nextClass: "Today, 15:00", attendance: "95%" },
    { id: 2, name: "Musa Ibrahim", age: 14, prog: "Hifz Revision", lvl: "Advanced", nextClass: "Today, 16:00", attendance: "98%" },
    { id: 3, name: "Sarah Ahmed", age: 8, prog: "Noorani Qaida", lvl: "Beginner", nextClass: "Tomorrow, 14:00", attendance: "100%" },
  ];

  return (
    <div className="p-4 md:p-8 h-full bg-[#F8F9FA] text-[#111827]">
      <FadeIn className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-[#0C4A3A]">My Students</h1>
        <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-500">
          Total Active: {students.length}
        </div>
      </FadeIn>
      
      <StaggerContainer className="space-y-4">
        {students.map((student, i) => (
          <StaggerItem key={student.id}>
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-md transition">
              
              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl shrink-0">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{student.name} <span className="text-sm font-normal text-gray-500 ml-2">Age {student.age}</span></h2>
                  <div className="text-sm text-gray-600 mt-1">
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mr-2">{student.prog}</span>
                    • {student.lvl}
                  </div>
                </div>
              </div>

              <div className="flex gap-8 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
                <div className="text-left md:text-right">
                  <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Next Class</div>
                  <div className="font-bold text-gray-900">{student.nextClass}</div>
                </div>
                <div className="text-left md:text-right">
                  <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Attendance</div>
                  <div className="font-bold text-emerald-600">{student.attendance}</div>
                </div>
                <Link href={`/classroom/${student.id}`} className="bg-[#0C4A3A] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#0D5C46] transition h-fit self-center">
                  Classroom
                </Link>
              </div>

            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}
