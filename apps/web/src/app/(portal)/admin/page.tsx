"use client";

import Link from "next/link";
import { Users, GraduationCap, Video, CreditCard, AlertCircle, ArrowUpRight, CheckCircle2 } from "lucide-react";

export default function AdminOverview() {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full text-white">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif text-white mb-1">Academy Operations Cockpit</h1>
          <p className="text-emerald-100/80 text-sm">
            Live supervisory monitor, enrolment pipelines, teacher capacity, and direct wire reconciliations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-bold text-amber-300 bg-emerald-950/80 border border-amber-400/30 px-3.5 py-1.5 rounded-full shadow-sm">
            Asia/Karachi • Live
          </div>
        </div>
      </header>

      {/* Top 4 KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="glass-container rounded-3xl p-6 border border-white/15 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Active Students</span>
            <Users className="w-5 h-5 text-amber-300" />
          </div>
          <div className="text-4xl font-bold text-white mb-1">248</div>
          <p className="text-xs text-emerald-100/75">+14 new enrolments this month</p>
        </div>

        <div className="glass-container rounded-3xl p-6 border border-white/15 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Approved Teachers</span>
            <GraduationCap className="w-5 h-5 text-emerald-300" />
          </div>
          <div className="text-4xl font-bold text-white mb-1">24</div>
          <p className="text-xs text-emerald-100/75">88% weekly slot utilization</p>
        </div>

        <div className="glass-container rounded-3xl p-6 border border-white/15 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Classes Today</span>
            <Video className="w-5 h-5 text-amber-300" />
          </div>
          <div className="text-4xl font-bold text-white mb-1">86</div>
          <p className="text-xs text-emerald-100/75">78 completed • 8 upcoming</p>
        </div>

        <div className="glass-container rounded-3xl p-6 border border-white/15 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Monthly Revenue</span>
            <CreditCard className="w-5 h-5 text-emerald-300" />
          </div>
          <div className="text-4xl font-bold text-amber-300 mb-1">PKR 840k</div>
          <p className="text-xs text-emerald-100/75">Direct bank wires & Raast</p>
        </div>
      </div>

      {/* Main Charts & Notifications Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Volume Chart (8 cols) */}
        <div className="lg:col-span-8 glass-container rounded-3xl p-6 md:p-8 border border-white/15 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold font-serif text-white">Weekly Class Volume Distribution</h3>
              <span className="text-xs text-emerald-100/70 font-mono">Total: 412 Sessions</span>
            </div>

            <div className="flex items-end justify-around h-48 mb-4 border-b border-white/10 pb-3">
              {[
                { day: "Mon", count: 72, h: "h-36", color: "bg-amber-400" },
                { day: "Tue", count: 68, h: "h-32", color: "bg-amber-400" },
                { day: "Wed", count: 76, h: "h-40", color: "bg-amber-400" },
                { day: "Thu", count: 70, h: "h-34", color: "bg-amber-400" },
                { day: "Fri", count: 64, h: "h-28", color: "bg-amber-400" },
                { day: "Sat", count: 34, h: "h-16", color: "bg-emerald-500/60" },
                { day: "Sun", count: 28, h: "h-12", color: "bg-emerald-500/60" }
              ].map((item) => (
                <div key={item.day} className="flex flex-col items-center gap-2 group">
                  <span className="text-[10px] text-amber-300 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.count}
                  </span>
                  <div className={`w-10 sm:w-12 ${item.color} rounded-t-xl ${item.h} shadow-md transition-all group-hover:brightness-110`} />
                  <span className="text-xs font-bold text-emerald-100/75">{item.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 text-xs font-bold text-emerald-200/80 mt-4 flex-wrap pt-3 border-t border-white/10">
            <Link href="/admin/resources" className="hover:text-amber-300 transition flex items-center gap-1">
              <span>PDF &amp; Content Desk</span>
              <ArrowUpRight size={12} />
            </Link>
            <span>•</span>
            <Link href="/admin/scheduling" className="hover:text-amber-300 transition flex items-center gap-1">
              <span>Master Calendar</span>
              <ArrowUpRight size={12} />
            </Link>
            <span>•</span>
            <Link href="/admin/enrolments" className="hover:text-amber-300 transition flex items-center gap-1">
              <span>Trial Funnel & Enrolments</span>
              <ArrowUpRight size={12} />
            </Link>
            <span>•</span>
            <Link href="/admin/teachers" className="hover:text-amber-300 transition flex items-center gap-1">
              <span>Teacher Review Desk</span>
              <ArrowUpRight size={12} />
            </Link>
            <span>•</span>
            <Link href="/admin/finance" className="hover:text-amber-300 transition flex items-center gap-1">
              <span>Direct Wire Reconciliations</span>
              <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>

        {/* Needs Attention Queue (4 cols) */}
        <div className="lg:col-span-4 glass-container rounded-3xl p-6 md:p-8 border border-white/15 shadow-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold font-serif text-white mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-300" />
              <span>Pending Action Queue</span>
            </h3>

            <div className="space-y-3">
              <Link
                href="/admin/teachers"
                className="p-3.5 rounded-2xl bg-black/35 border border-white/10 hover:border-amber-400/40 transition block group"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xs text-white group-hover:text-amber-300 transition-colors">
                    Teacher Applications
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-emerald-950">
                    2 Pending
                  </span>
                </div>
                <p className="text-[11px] text-emerald-100/70">
                  Ustadha Fatima & Sheikh Zeeshan awaiting credential review
                </p>
              </Link>

              <Link
                href="/admin/finance"
                className="p-3.5 rounded-2xl bg-black/35 border border-white/10 hover:border-amber-400/40 transition block group"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xs text-white group-hover:text-amber-300 transition-colors">
                    Bank Receipts to Verify
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-emerald-950">
                    3 Uploaded
                  </span>
                </div>
                <p className="text-[11px] text-emerald-100/70">
                  Raast & UK Faster Payments proofs awaiting clearance
                </p>
              </Link>

              <Link
                href="/admin/enrolments"
                className="p-3.5 rounded-2xl bg-black/35 border border-white/10 hover:border-amber-400/40 transition block group"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xs text-white group-hover:text-amber-300 transition-colors">
                    Trial Assessments
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-900/80 text-emerald-300 border border-emerald-500/30">
                    4 Requests
                  </span>
                </div>
                <p className="text-[11px] text-emerald-100/70">
                  Beginner Qaida & Tajweed trials needing slot assignment
                </p>
              </Link>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 text-xs text-emerald-100/70 flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span>Classrooms, recording and RLS security active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
