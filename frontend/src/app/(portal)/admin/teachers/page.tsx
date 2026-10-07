"use client";

import { FadeIn, StaggerContainer, StaggerItem } from "@/components/Animations";
import toast from "react-hot-toast";

export default function AdminTeachers() {
  return (
    <div className="p-4 md:p-8 h-full bg-[#F8F9FA] text-[#111827]">
      <FadeIn className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-[#0C4A3A]">Teacher Roster</h1>
        <button onClick={() => toast.success('Invite link copied to clipboard')} className="bg-[#0C4A3A] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#0D5C46] transition shadow-sm">
          Onboard New Teacher
        </button>
      </FadeIn>
      
      <StaggerContainer className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="pb-4 font-bold">Teacher Name</th>
                <th className="pb-4 font-bold">Specialty</th>
                <th className="pb-4 font-bold">Active Students</th>
                <th className="pb-4 font-bold">Rating</th>
                <th className="pb-4 font-bold">Status</th>
                <th className="pb-4"></th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Ustadha Fatima", spec: "Tajweed / Qiraat", students: 12, rating: "4.9/5", status: "Active" },
                { name: "Shaykh Ali", spec: "Hifz", students: 8, rating: "5.0/5", status: "Active" },
                { name: "Ahmed Yasin", spec: "Noorani Qaida", students: 0, rating: "N/A", status: "Pending" },
              ].map((t, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition group">
                  <td className="py-4 font-bold text-gray-900">{t.name}</td>
                  <td className="py-4 text-gray-600 text-sm">{t.spec}</td>
                  <td className="py-4 text-gray-900 font-bold">{t.students}</td>
                  <td className="py-4 text-amber-500 font-bold">{t.rating}</td>
                  <td className="py-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${t.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button onClick={() => toast('Opening profile...', { icon: '📂' })} className="text-sm font-bold text-emerald-600 hover:text-emerald-800 opacity-0 group-hover:opacity-100 transition">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </StaggerContainer>
    </div>
  );
}
