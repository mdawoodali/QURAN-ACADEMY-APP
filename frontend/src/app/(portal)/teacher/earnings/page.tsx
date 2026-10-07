"use client";

import { useState } from "react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/Animations";
import toast from "react-hot-toast";

export default function TeacherEarnings() {
  const [balance, setBalance] = useState(450.00);
  const [withdrawing, setWithdrawing] = useState(false);
  const [transactions, setTransactions] = useState([
    { id: "TRX-9821", desc: "Completed 10 hours teaching (Oct 1 - Oct 7)", date: "Oct 8, 2026", amount: "+$150.00", status: "Cleared" },
    { id: "TRX-9820", desc: "Withdrawal to Bank Account", date: "Oct 1, 2026", amount: "-$300.00", status: "Processed" },
    { id: "TRX-9819", desc: "Completed 12 hours teaching (Sep 24 - Sep 30)", date: "Oct 1, 2026", amount: "+$180.00", status: "Cleared" },
  ]);

  const handleWithdraw = () => {
    if (balance === 0) {
      toast.error("No funds available to withdraw");
      return;
    }
    
    setWithdrawing(true);
    setTimeout(() => {
      setTransactions([{
        id: `TRX-${Math.floor(Math.random() * 9000) + 1000}`,
        desc: "Withdrawal to Bank Account",
        date: "Today",
        amount: `-$${balance.toFixed(2)}`,
        status: "Processing"
      }, ...transactions]);
      
      setBalance(0);
      setWithdrawing(false);
      toast.success("Withdrawal request sent. Funds will arrive in 2-3 business days.");
    }, 1500);
  };

  return (
    <div className="p-4 md:p-8 h-full bg-[#F8F9FA] text-[#111827]">
      <FadeIn className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-[#0C4A3A]">Earnings & Pay</h1>
        <button 
          onClick={handleWithdraw} 
          disabled={withdrawing || balance === 0}
          className={`px-6 py-2.5 rounded-xl font-bold transition shadow-sm ${withdrawing ? 'bg-gray-400 text-white cursor-wait' : balance === 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#0C4A3A] text-white hover:bg-[#0D5C46] transform hover:scale-105 active:scale-95'}`}
        >
          {withdrawing ? "Processing..." : balance === 0 ? "No Funds Available" : "Withdraw Funds"}
        </button>
      </FadeIn>
      
      <StaggerContainer className="grid md:grid-cols-3 gap-6 mb-8">
        <StaggerItem>
          <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 shadow-sm transition-all">
            <p className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-2">Available Balance</p>
            <p className="text-4xl font-bold text-[#0C4A3A] transition-all duration-500">${balance.toFixed(2)}</p>
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Pending Clearance</p>
            <p className="text-4xl font-bold text-gray-900">$120.00</p>
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Total Earned</p>
            <p className="text-4xl font-bold text-gray-900">$2,450.00</p>
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
                  <div className={`font-bold ${trx.amount.startsWith('+') ? 'text-emerald-600' : 'text-gray-900'}`}>{trx.amount}</div>
                  <div className={`text-xs font-bold inline-block px-2 py-0.5 rounded mt-1 ${trx.status === 'Processing' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>{trx.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
