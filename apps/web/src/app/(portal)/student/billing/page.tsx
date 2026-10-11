"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { CreditCard, X, Check, ArrowDownToLine } from "lucide-react";

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
    <div className="p-4 md:p-8 max-w-5xl mx-auto w-full relative text-white">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif text-white mb-2">Billing & Subscription</h1>
        <p className="text-emerald-100/80 text-sm">Manage your academy plan, card on file, and download invoices.</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Current Plan Card */}
        <div className="glass-container rounded-3xl p-6 md:p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between border border-amber-400/30">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
          <div>
            <div className="bg-amber-400/20 text-amber-300 font-bold text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full inline-block mb-4 border border-amber-400/30">
              Current Plan
            </div>
            <div className="text-3xl font-serif text-white mb-4">{currentPlan}</div>
            <div className="text-sm text-emerald-100/80 mb-8">Next billing date: 1st Nov 2026</div>
          </div>
          <button 
            onClick={() => setShowPlanModal(true)} 
            className="bg-amber-400 text-emerald-950 px-6 py-3 rounded-full font-bold text-sm hover:bg-amber-300 transition w-full sm:w-auto self-start shadow-md cursor-pointer"
          >
            Change Package
          </button>
        </div>

        {/* Payment Method Card */}
        <div className="glass-container rounded-3xl p-6 md:p-8 border border-white/15 shadow-xl flex flex-col justify-between text-white">
          <div>
            <h2 className="text-lg font-bold font-serif text-white mb-4">Payment Method</h2>
            <div className="flex items-center gap-4 p-4 border border-white/10 rounded-2xl bg-black/30 backdrop-blur-md mb-4">
              <div className="w-12 h-8 bg-emerald-900/80 border border-amber-400/40 rounded flex items-center justify-center text-xs font-bold text-amber-300">
                VISA
              </div>
              <div>
                <div className="font-bold text-white">•••• •••• •••• 4242</div>
                <div className="text-xs text-emerald-100/70">Expires 12/28</div>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setShowCardModal(true)} 
            className="text-sm font-bold text-amber-300 hover:text-amber-200 transition self-start cursor-pointer flex items-center gap-1.5"
          >
            <CreditCard className="w-4 h-4" />
            <span>Update Card Details</span>
          </button>
        </div>
      </div>

      {/* Invoices */}
      <div className="glass-container rounded-3xl p-6 md:p-8 border border-white/15 shadow-xl text-white">
        <h2 className="text-xl font-bold font-serif text-white mb-6">Recent Invoices</h2>
        <div className="space-y-3">
          {[
            { date: "Oct 1, 2026", amount: "$50.00", status: "Paid" },
            { date: "Sep 1, 2026", amount: "$50.00", status: "Paid" },
            { date: "Aug 1, 2026", amount: "$50.00", status: "Paid" }
          ].map((inv, i) => (
            <div key={i} className="flex justify-between items-center p-4 bg-black/25 rounded-2xl border border-white/10 hover:border-white/20 transition">
              <div>
                <div className="font-bold text-white text-sm">{inv.date}</div>
                <div className="text-[10px] text-emerald-300 font-bold bg-emerald-950/60 border border-emerald-500/30 inline-block px-2.5 py-0.5 rounded-full mt-1">
                  {inv.status}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="font-bold text-amber-300">{inv.amount}</div>
                <button 
                  onClick={() => toast('Downloading invoice PDF...', { icon: '⬇️' })} 
                  className="text-emerald-100/70 hover:text-amber-300 transition p-2 rounded-lg hover:bg-white/10"
                  title="Download PDF"
                >
                  <ArrowDownToLine className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-[#052b20] border border-white/20 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 text-white">
            <div className="p-6 border-b border-white/15 flex justify-between items-center">
              <h2 className="text-2xl font-serif text-white">Choose a Package</h2>
              <button onClick={() => setShowPlanModal(false)} className="text-white/70 hover:text-white transition">
                <X size={24}/>
              </button>
            </div>
            <div className="p-6 grid md:grid-cols-2 gap-4">
              <div 
                onClick={() => handleUpdatePlan("Basic • $30/mo")} 
                className="border border-white/15 hover:border-amber-400 rounded-2xl p-6 cursor-pointer transition flex flex-col bg-black/30 hover:bg-black/50"
              >
                <h3 className="font-bold text-lg mb-1 text-white">Basic</h3>
                <div className="text-2xl font-serif text-amber-300 mb-4">$30<span className="text-sm text-emerald-100/70 font-sans">/mo</span></div>
                <ul className="text-sm text-emerald-100/80 space-y-2 mb-6 flex-1">
                  <li className="flex gap-2 items-center"><Check size={14} className="text-amber-300"/> 2 Classes a week</li>
                  <li className="flex gap-2 items-center"><Check size={14} className="text-amber-300"/> 30 mins each</li>
                </ul>
                <button className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm transition">
                  Select Plan
                </button>
              </div>
              <div 
                onClick={() => handleUpdatePlan("Standard • $50/mo")} 
                className="border-2 border-amber-400/60 rounded-2xl p-6 cursor-pointer transition flex flex-col bg-black/40 relative"
              >
                <div className="absolute top-0 right-0 bg-amber-400 text-emerald-950 text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl uppercase tracking-wider">
                  Popular
                </div>
                <h3 className="font-bold text-lg mb-1 text-white">Standard</h3>
                <div className="text-2xl font-serif text-amber-300 mb-4">$50<span className="text-sm text-emerald-100/70 font-sans">/mo</span></div>
                <ul className="text-sm text-emerald-100/80 space-y-2 mb-6 flex-1">
                  <li className="flex gap-2 items-center"><Check size={14} className="text-amber-300"/> 3 Classes a week</li>
                  <li className="flex gap-2 items-center"><Check size={14} className="text-amber-300"/> 45 mins each</li>
                  <li className="flex gap-2 items-center"><Check size={14} className="text-amber-300"/> Monthly progress report</li>
                </ul>
                <button className="w-full py-2.5 bg-amber-400 text-emerald-950 rounded-xl font-bold text-sm hover:bg-amber-300 transition">
                  Select Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Card Modal */}
      {showCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-[#052b20] border border-white/20 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 text-white">
            <div className="p-6 border-b border-white/15 flex justify-between items-center">
              <h2 className="text-xl font-bold font-serif text-white">Update Payment Method</h2>
              <button onClick={() => setShowCardModal(false)} className="text-white/70 hover:text-white transition">
                <X size={20}/>
              </button>
            </div>
            <form onSubmit={handleUpdateCard} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-emerald-100 mb-1">Card Number</label>
                <div className="relative">
                  <CreditCard className="absolute left-3.5 top-3.5 text-emerald-300/70" size={18} />
                  <input 
                    type="text" 
                    required 
                    placeholder="0000 0000 0000 0000" 
                    className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 transition text-sm" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-emerald-100 mb-1">Expiry</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="MM/YY" 
                    className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 transition text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-emerald-100 mb-1">CVC</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="123" 
                    className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 transition text-sm" 
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 rounded-xl font-bold mt-4 transition shadow-lg cursor-pointer text-sm"
              >
                Save Card Details
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
