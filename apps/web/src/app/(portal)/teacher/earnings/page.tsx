"use client";

import Link from "next/link";
import { CheckCircle2, Clock, Building2, Download, ShieldCheck, ArrowDownToLine } from "lucide-react";
import toast from "react-hot-toast";

interface PayoutRecord {
  period: string;
  completedClasses: number;
  hours: string;
  ratePerClass: string;
  adjustments: string;
  payable: string;
  status: "Paid" | "Pending Verification" | "Processing";
  payoutDate: string;
  reference: string;
}

const PAYOUT_HISTORY: PayoutRecord[] = [
  {
    period: "September 2026",
    completedClasses: 64,
    hours: "32.0 hrs",
    ratePerClass: "PKR 500",
    adjustments: "PKR 0",
    payable: "PKR 32,000",
    status: "Processing",
    payoutDate: "01 Nov 2026",
    reference: "PAY-2026-09-T1"
  },
  {
    period: "August 2026",
    completedClasses: 60,
    hours: "30.0 hrs",
    ratePerClass: "PKR 500",
    adjustments: "PKR -500",
    payable: "PKR 29,500",
    status: "Paid",
    payoutDate: "01 Sep 2026",
    reference: "PAY-2026-08-T1"
  },
  {
    period: "July 2026",
    completedClasses: 58,
    hours: "29.0 hrs",
    ratePerClass: "PKR 500",
    adjustments: "PKR 0",
    payable: "PKR 29,000",
    status: "Paid",
    payoutDate: "01 Aug 2026",
    reference: "PAY-2026-07-T1"
  }
];

export default function TeacherEarnings() {
  const handleDownloadStatement = (period: string) => {
    toast.success(`Downloading payout statement for ${period}...`);
    const a = document.createElement("a");
    a.href = "/api/reports/download";
    a.download = `payout-statement-${period.toLowerCase().replace(/\s+/g, "-")}.csv`;
    a.click();
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
        <Link href="/teacher/students" className="text-emerald-100/70 hover:text-white px-2 py-1 transition">
          My Students & Notes
        </Link>
        <Link
          href="/teacher/earnings"
          className="text-amber-300 border-b-2 border-amber-400 pb-2 px-2 transition font-bold"
        >
          Earnings & Bank Payouts
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl md:text-4xl font-serif text-white">Teacher Compensation & Records</h1>
            <span className="flex items-center gap-1 text-[11px] font-bold bg-emerald-950/80 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full">
              <ShieldCheck size={12} />
              <span>Direct Bank Settlement</span>
            </span>
          </div>
          <p className="text-emerald-100/80 text-sm">
            Transparent pay records calculated per completed lesson, disbursed monthly directly into your registered bank account.
          </p>
        </div>

        <button
          onClick={() => handleDownloadStatement("All Periods")}
          className="bg-amber-400 hover:bg-amber-300 text-emerald-950 px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Download size={14} />
          <span>Annual Tax Statement</span>
        </button>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="glass-container rounded-3xl p-6 border border-amber-400/30 shadow-xl flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-amber-300 uppercase tracking-widest mb-2">Current Pay Rate</div>
            <div className="text-3xl font-bold text-white mb-1">PKR 500</div>
            <p className="text-xs text-emerald-100/80">Per 30-minute 1-on-1 completed class (PKR 1,000/hr)</p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-amber-300 font-semibold">
            Standard Quran & Tajweed Tier
          </div>
        </div>

        <div className="glass-container rounded-3xl p-6 border border-white/15 shadow-xl flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-emerald-300 uppercase tracking-widest mb-2">
              Payable This Cycle
            </div>
            <div className="text-3xl font-bold text-amber-300 mb-1">PKR 32,000</div>
            <p className="text-xs text-emerald-100/80">64 classes completed • 0 missed sessions</p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-emerald-200/80 flex items-center gap-1.5">
            <Clock size={12} />
            <span>Disbursement scheduled for 01 Nov 2026</span>
          </div>
        </div>

        <div className="glass-container rounded-3xl p-6 border border-white/15 shadow-xl flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-emerald-100/80 uppercase tracking-widest mb-2">
              Registered Bank Account
            </div>
            <div className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Building2 size={16} className="text-amber-300" />
              <span>Meezan Bank Ltd</span>
            </div>
            <p className="text-xs font-mono text-emerald-100/70">PK82MEZN••••••••4901</p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-emerald-300 flex items-center gap-1.5">
            <CheckCircle2 size={12} />
            <span>Verified by Accounts Desk</span>
          </div>
        </div>
      </div>

      {/* Monthly Settlement Ledger */}
      <div className="glass-container rounded-3xl p-6 md:p-8 border border-white/15 shadow-2xl">
        <h2 className="text-xl font-bold font-serif text-white mb-6">Historical Compensation Ledger</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-amber-300 text-xs uppercase tracking-wider font-bold">
                <th className="pb-3">Period</th>
                <th className="pb-3">Completed Sessions</th>
                <th className="pb-3">Hours</th>
                <th className="pb-3">Rate</th>
                <th className="pb-3">Net Payable</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Statement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-sm">
              {PAYOUT_HISTORY.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition">
                  <td className="py-4 font-bold text-white">{row.period}</td>
                  <td className="py-4 text-emerald-100">{row.completedClasses} classes</td>
                  <td className="py-4 text-emerald-100/80">{row.hours}</td>
                  <td className="py-4 text-emerald-100/80">{row.ratePerClass}</td>
                  <td className="py-4 font-bold text-amber-300">{row.payable}</td>
                  <td className="py-4">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1 ${
                        row.status === "Paid"
                          ? "bg-emerald-900/80 text-emerald-300 border border-emerald-500/30"
                          : "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                      }`}
                    >
                      {row.status === "Paid" ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                      {row.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => handleDownloadStatement(row.period)}
                      className="text-emerald-100/70 hover:text-amber-300 p-2 transition"
                      title="Download Statement"
                    >
                      <ArrowDownToLine size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
