"use client";
import toast from "react-hot-toast";

export default function StudentBilling() {
  return (
    <div className="p-4 md:p-8 h-full bg-[#F8F9FA] text-[#111827] max-w-4xl mx-auto w-full">
      <h1 className="text-3xl font-serif text-[#0C4A3A] mb-8">Billing & Subscription</h1>
      
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-[#0C4A3A] rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <h2 className="text-emerald-100 font-bold tracking-widest uppercase text-xs mb-2">Current Plan</h2>
          <div className="text-3xl font-serif mb-6">Standard • $50/mo</div>
          <div className="text-sm text-emerald-50 mb-8">Next billing date: 1st Nov 2026</div>
          <button onClick={() => toast('Redirecting to Stripe portal...', { icon: '💳' })} className="bg-white text-[#0C4A3A] px-6 py-2.5 rounded-full font-bold text-sm hover:bg-emerald-50 transition w-full md:w-auto">
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
          <button onClick={() => toast.success('Update form opened')} className="text-sm font-bold text-emerald-600 hover:text-emerald-800 self-start">
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
    </div>
  );
}
