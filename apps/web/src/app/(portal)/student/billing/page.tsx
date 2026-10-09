"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { CreditCard, X, Check } from "lucide-react";

export default function StudentBilling() {
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [currentPlan, setCurrentPlan] = useState("Standard • $50/mo");

  const handleUpdatePlan = (newPlan: string) => {
    setCurrentPlan(newPlan);
    setShowPlanModal(false);
    toast.success("Subscription plan updated!");
  };

  const handleUpdateCard = (e: React.FormEvent) => {
    e.preventDefault();
    setShowCardModal(false);
    toast.success("Payment method updated successfully!");
  };

  return (
    <div className="p-4 md:p-8 h-full bg-[#F8F9FA] text-[#111827] max-w-4xl mx-auto w-full relative">
      <h1 className="text-3xl font-serif text-[#0C4A3A] mb-8">Billing & Subscription</h1>
      
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-[#0C4A3A] rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <h2 className="text-emerald-100 font-bold tracking-widest uppercase text-xs mb-2">Current Plan</h2>
          <div className="text-3xl font-serif mb-6">{currentPlan}</div>
          <div className="text-sm text-emerald-50 mb-8">Next billing date: 1st Nov 2026</div>
          <button onClick={() => setShowPlanModal(true)} className="bg-white text-[#0C4A3A] px-6 py-2.5 rounded-full font-bold text-sm hover:bg-emerald-50 transition w-full md:w-auto">
            Manage Subscription
          </button>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col justify-center">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Payment Method</h2>
          <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl bg-gray-50 mb-4">
            <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-500">VISA</div>
            <div>
              <div className="font-bold text-gray-900">•••• •••• •••• 4242</div>
              <div className="text-xs text-gray-500">Expires 12/28</div>
            </div>
          </div>
          <button onClick={() => setShowCardModal(true)} className="text-sm font-bold text-emerald-600 hover:text-emerald-800 self-start">
            Update Payment Method
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Invoices</h2>
        <div className="space-y-4">
          {[
            { date: "Oct 1, 2026", amount: "$50.00", status: "Paid" },
            { date: "Sep 1, 2026", amount: "$50.00", status: "Paid" },
            { date: "Aug 1, 2026", amount: "$50.00", status: "Paid" }
          ].map((inv, i) => (
            <div key={i} className="flex justify-between items-center p-4 border-b border-gray-100 last:border-0">
              <div>
                <div className="font-bold text-gray-900">{inv.date}</div>
                <div className="text-xs text-emerald-600 font-bold bg-emerald-50 inline-block px-2 py-0.5 rounded mt-1">{inv.status}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="font-bold text-gray-900">{inv.amount}</div>
                <button onClick={() => toast('Downloading PDF...', { icon: '⬇️' })} className="text-gray-400 hover:text-[#0C4A3A] transition">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-2xl font-serif text-[#0C4A3A]">Choose a Package</h2>
              <button onClick={() => setShowPlanModal(false)} className="text-gray-400 hover:text-gray-900 transition"><X size={24}/></button>
            </div>
            <div className="p-6 grid md:grid-cols-2 gap-4">
              <div onClick={() => handleUpdatePlan("Basic • $30/mo")} className="border-2 border-gray-100 hover:border-[#0C4A3A] rounded-2xl p-6 cursor-pointer transition flex flex-col bg-gray-50 hover:bg-white">
                <h3 className="font-bold text-lg mb-1">Basic</h3>
                <div className="text-2xl font-serif text-[#0C4A3A] mb-4">$30<span className="text-sm text-gray-500 font-sans">/mo</span></div>
                <ul className="text-sm text-gray-600 space-y-2 mb-6 flex-1">
                  <li className="flex gap-2 items-center"><Check size={14} className="text-emerald-600"/> 2 Classes a week</li>
                  <li className="flex gap-2 items-center"><Check size={14} className="text-emerald-600"/> 30 mins each</li>
                </ul>
                <button className="w-full py-2 bg-gray-900 text-white rounded-xl font-bold text-sm">Select Plan</button>
              </div>
              <div onClick={() => handleUpdatePlan("Standard • $50/mo")} className="border-2 border-[#0C4A3A] rounded-2xl p-6 cursor-pointer transition flex flex-col bg-emerald-50/30 relative">
                <div className="absolute top-0 right-0 bg-[#0C4A3A] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl uppercase tracking-wider">Popular</div>
                <h3 className="font-bold text-lg mb-1">Standard</h3>
                <div className="text-2xl font-serif text-[#0C4A3A] mb-4">$50<span className="text-sm text-gray-500 font-sans">/mo</span></div>
                <ul className="text-sm text-gray-600 space-y-2 mb-6 flex-1">
                  <li className="flex gap-2 items-center"><Check size={14} className="text-emerald-600"/> 3 Classes a week</li>
                  <li className="flex gap-2 items-center"><Check size={14} className="text-emerald-600"/> 45 mins each</li>
                  <li className="flex gap-2 items-center"><Check size={14} className="text-emerald-600"/> Monthly progress report</li>
                </ul>
                <button className="w-full py-2 bg-[#0C4A3A] text-white rounded-xl font-bold text-sm">Select Plan</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Card Modal */}
      {showCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Update Payment Method</h2>
              <button onClick={() => setShowCardModal(false)} className="text-gray-400 hover:text-gray-900 transition"><X size={20}/></button>
            </div>
            <form onSubmit={handleUpdateCard} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Card Number</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input type="text" required placeholder="0000 0000 0000 0000" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0C4A3A] transition" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Expiry</label>
                  <input type="text" required placeholder="MM/YY" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0C4A3A] transition" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">CVC</label>
                  <input type="text" required placeholder="123" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0C4A3A] transition" />
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-[#0C4A3A] text-white rounded-xl font-bold mt-4 hover:bg-[#0D5C46] transition">
                Save Card Details
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
