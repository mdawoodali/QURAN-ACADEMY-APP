"use client";

import { useState } from "react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/Animations";
import toast from "react-hot-toast";

export default function AdminFinance() {
  const [pendingPayouts, setPendingPayouts] = useState(3200.00);
  const [processing, setProcessing] = useState(false);
  const [transactions, setTransactions] = useState([
    { id: "INV-1092", desc: "Student Subscription - Zayd Ali", date: "Oct 8, 2026", amount: "+$50.00", status: "Paid" },
    { id: "PAY-882", desc: "Teacher Payout - Ustadha Fatima", date: "Oct 1, 2026", amount: "-$300.00", status: "Processed" },
    { id: "INV-1091", desc: "Student Subscription - Musa Ibrahim", date: "Oct 1, 2026", amount: "+$50.00", status: "Failed" },
  ]);

  const handleProcessPayouts = () => {
    if (pendingPayouts === 0) return;
    setProcessing(true);
    setTimeout(() => {
      setTransactions([{
        id: `PAY-${Math.floor(Math.random() * 900) + 100}`,
        desc: "Batch Teacher Payouts (42 Teachers)",
        date: "Today",
        amount: `-$${pendingPayouts.toFixed(2)}`,
        status: "Processed"
      }, ...transactions]);
      setPendingPayouts(0);
      setProcessing(false);
      toast.success("Successfully processed 42 teacher payouts via Stripe Connect.");
    }, 2000);
  };

  return (
    <div className="p-4 md:p-8 h-full bg-[#F8F9FA] text-[#111827]">
      <FadeIn className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-[#0C4A3A]">Finance & Billing</h1>
        <div className="flex gap-4">
          <button onClick={() => toast.success('Exporting CSV...')} className="bg-white text-emerald-800 border border-emerald-100 px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-50 transition shadow-sm">
            Export Report
          </button>
        </div>
      </FadeIn>
      
      <StaggerContainer className="grid md:grid-cols-3 gap-6 mb-8">
        <StaggerItem>
          <div className="bg-[#0C4A3A] p-6 rounded-3xl border border-transparent shadow-lg text-white">
            <p className="text-sm font-bold text-emerald-200 uppercase tracking-wider mb-2">Monthly Revenue (MRR)</p>
            <p className="text-4xl font-bold">$12,450.00</p>
            <p className="text-xs text-emerald-100 mt-2">↑ 12% vs last month</p>
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm transition-all">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Pending Teacher Payouts</p>
            <p className="text-4xl font-bold text-gray-900 transition-all duration-500">${pendingPayouts.toFixed(2)}</p>
            {pendingPayouts > 0 ? (
              <button 
                onClick={handleProcessPayouts} 
                disabled={processing}
                className={`mt-4 text-xs font-bold px-3 py-1.5 rounded-lg transition ${processing ? 'bg-gray-100 text-gray-400 cursor-wait' : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'}`}
              >
                {processing ? "Processing..." : "Process Payouts"}
              </button>
            ) : (
              <div className="mt-4 text-xs font-bold text-gray-400 px-3 py-1.5 rounded-lg bg-gray-50 inline-block">All Paid</div>
            )}
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="bg-red-50 p-6 rounded-3xl border border-red-100 shadow-sm">
            <p className="text-sm font-bold text-red-800 uppercase tracking-wider mb-2">Failed Student Payments</p>
            <p className="text-4xl font-bold text-red-900">4</p>
            <button onClick={() => toast('Reminders sent')} className="mt-4 text-xs font-bold text-white bg-red-600 px-3 py-1.5 rounded-lg hover:bg-red-700">Send Reminders</button>
          </div>
        </StaggerItem>
      </StaggerContainer>

      <FadeIn delay={0.3}>
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Transactions</h2>
          <div className="space-y-4">
            {transactions.map((trx, i) => (
              <div key={trx.id} className="flex justify-between items-center p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition rounded-xl animate-in fade-in slide-in-from-top-4 duration-500">
                <div>
                  <div className="font-bold text-gray-900">{trx.desc}</div>
                  <div className="text-xs text-gray-500 mt-1">{trx.id} • {trx.date}</div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${trx.amount.startsWith('-') ? 'text-gray-900' : 'text-emerald-600'}`}>{trx.amount}</div>
                  <div className={`text-xs font-bold inline-block px-2 py-0.5 rounded mt-1 ${trx.status === 'Failed' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>{trx.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
