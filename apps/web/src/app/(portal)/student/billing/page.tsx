"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { 
  Building2, 
  X, 
  Check, 
  ArrowDownToLine, 
  ShieldCheck, 
  CheckCircle2,
  ExternalLink,
  Receipt,
  Database
} from "lucide-react";

interface StudentInvoice {
  id: string;
  date: string;
  amount: string;
  currency: string;
  status: "Paid" | "Pending";
  ref: string;
  plan: string;
}

export default function StudentBilling() {
  const [invoices, setInvoices] = useState<StudentInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [currentPlan, setCurrentPlan] = useState("Standard Plan • £65/mo (3 Days/Wk)");

  useEffect(() => {
    fetch(`/api/invoices?_t=${Date.now()}`, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" },
    })
      .then((res) => res.json())
      .then((data) => {
        const raw = data.invoices || [];
        const formatted: StudentInvoice[] = raw.map((inv: any) => ({
          id: inv.invoice_number || inv.id || "INV-2026",
          date: (inv.submittedAt || inv.created_at) ? new Date(inv.submittedAt || inv.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "Recent",
          amount: String(inv.amount || "65.00"),
          currency: inv.currency || "GBP",
          status: (inv.status === "paid" || inv.status === "verified") ? "Paid" : "Pending",
          ref: inv.transaction_ref || inv.transactionRef || "DIRECT-RAIL",
          plan: inv.package_tier || inv.packageTier || "Standard Plan (3 Days/Week)"
        }));
        setInvoices(formatted);
      })
      .catch((err) => console.error("Failed to load invoices:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdatePlan = (newPlan: string) => {
    setCurrentPlan(newPlan);
    setShowPlanModal(false);
    toast.success("Subscription plan updated! Your tuition ledger reflects the change.");
  };

  const handleDownloadInvoice = (inv: StudentInvoice) => {
    toast.loading(`Generating official PDF receipt for ${inv.id}...`, { id: "download" });
    const url = `/api/invoices/${inv.id}/download?amount=${inv.amount}&currency=${inv.currency}&student=Yusuf+Khan&parent=Ahmed+Khan&ref=${inv.ref}&plan=${encodeURIComponent(inv.plan)}`;
    
    setTimeout(() => {
      window.open(url, "_blank");
      toast.success(`Invoice ${inv.id} downloaded!`, { id: "download" });
    }, 600);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto w-full relative text-white">
      {/* 1. Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-3xl md:text-4xl font-serif text-white">Billing &amp; Tuition Ledger</h1>
          
        </div>
        <p className="text-emerald-100/80 text-sm">
          Manage your enrolled package, inspect cleared bank transfers, and download official stamped tax invoices.
        </p>
      </div>
      
      {/* 2. Top Summary Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Active Plan Card */}
        <div className="glass-container rounded-3xl p-6 md:p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between border border-amber-400/30">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
          <div>
            <div className="bg-amber-400/20 text-amber-300 font-bold text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full inline-block mb-4 border border-amber-400/30">
              Active Enrolment
            </div>
            <div className="text-2xl sm:text-3xl font-serif text-white mb-2">{currentPlan}</div>
            <div className="text-xs text-emerald-200/80 mb-6">
              Assigned Tutor: <strong className="text-white">Ustadha Maryam</strong> &bull; 12 Classes / Month
            </div>
            <div className="text-xs text-emerald-100/70 mb-6">
              Next scheduled billing cycle: <strong className="text-amber-300">1st of upcoming month</strong>
            </div>
          </div>
          <button 
            onClick={() => setShowPlanModal(true)} 
            className="bg-amber-400 text-emerald-950 px-6 py-3 rounded-full font-bold text-sm hover:bg-amber-300 transition w-full sm:w-auto self-start shadow-md cursor-pointer"
          >
            Switch Package
          </button>
        </div>

        {/* Payment Rail Status Card */}
        <div className="glass-container rounded-3xl p-6 md:p-8 border border-white/15 shadow-xl flex flex-col justify-between text-white">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold font-serif text-white">Clearing Channel</h2>
              <span className="flex items-center gap-1 text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                <CheckCircle2 size={11} />
                <span>ACTIVE &bull; VERIFIED</span>
              </span>
            </div>
            
            <div className="p-4 border border-white/10 rounded-2xl bg-black/30 backdrop-blur-md mb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-800/80 border border-amber-400/30 flex items-center justify-center text-amber-300">
                  <Building2 size={18} />
                </div>
                <div>
                  <div className="font-bold text-white text-sm">Barclays UK Faster Payments / Meezan Raast</div>
                  <div className="text-xs text-emerald-100/70">Multi-Currency Bank Remittance Rail</div>
                </div>
              </div>
              <div className="text-xs text-emerald-100/80 font-mono mt-2 pt-2 border-t border-white/10 flex justify-between">
                <span>Total Invoices Recorded:</span>
                <span className="text-amber-300 font-bold">{loading ? "..." : invoices.length}</span>
              </div>
            </div>
          </div>

          <Link 
            href="/payments"
            className="text-xs font-bold text-amber-300 hover:text-amber-200 transition self-start flex items-center gap-1.5"
          >
            <span>View All Academy Bank Details &amp; Rails</span>
            <ExternalLink size={13} />
          </Link>
        </div>
      </div>

      {/* 3. Official Stamped Tax Invoices Table */}
      <div className="glass-container rounded-3xl p-6 md:p-8 border border-white/15 shadow-xl text-white mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
          <div>
            <h2 className="text-xl font-bold font-serif text-white">Official Tax Invoices &amp; Receipts</h2>
            <p className="text-xs text-emerald-100/70">
              Tax-exempt educational services receipts generated via the Academy Accounts Directorate.
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-300 bg-black/40 px-3 py-1 rounded-full border border-white/10">
            VAT/GST 0% Exempt (Sec 13-1)
          </span>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="py-8 text-center text-xs text-emerald-100/60">Loading invoices from database...</div>
          ) : invoices.length === 0 ? (
            <div className="py-8 text-center text-xs text-emerald-100/60">No invoices logged yet. Invoices appear automatically upon monthly renewal or wire upload.</div>
          ) : (
            invoices.map((inv) => (
              <div 
                key={inv.id} 
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-black/25 rounded-2xl border border-white/10 hover:border-amber-400/30 transition gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-white/15 flex items-center justify-center text-amber-300 shrink-0">
                    <Receipt size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm font-mono">{inv.id}</span>
                      <span className="text-[10px] text-emerald-300 font-bold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        {inv.status}
                      </span>
                    </div>
                    <div className="text-xs text-emerald-100/70 mt-0.5">
                      {inv.date} &bull; Ref: <span className="font-mono text-white/80">{inv.ref}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <span className="font-bold text-amber-300 text-base">{inv.currency} {inv.amount}</span>
                    <span className="text-[10px] text-emerald-200/70 block">Cleared</span>
                  </div>
                  <button 
                    onClick={() => handleDownloadInvoice(inv)} 
                    className="bg-white/10 hover:bg-amber-400 hover:text-emerald-950 text-white p-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow"
                    title="Download Stamped PDF Invoice"
                  >
                    <ArrowDownToLine size={15} />
                    <span className="hidden sm:inline">PDF</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 4. Package Selection Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in zoom-in-95">
          <div className="bg-[#052b20] border border-white/20 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl text-white">
            <div className="p-6 border-b border-white/15 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-serif text-white">Select Academy Package</h2>
                <p className="text-xs text-emerald-100/70">Changes take effect on your next 1st of the month cycle.</p>
              </div>
              <button 
                onClick={() => setShowPlanModal(false)} 
                className="text-white/70 hover:text-white transition p-1"
              >
                <X size={22}/>
              </button>
            </div>
            
            <div className="p-6 grid md:grid-cols-2 gap-4">
              <div 
                onClick={() => handleUpdatePlan("Basic Plan • £45/mo (2 Days/Wk)")} 
                className="border border-white/15 hover:border-amber-400 rounded-2xl p-6 cursor-pointer transition flex flex-col bg-black/30 hover:bg-black/50"
              >
                <h3 className="font-bold text-lg mb-1 text-white">Basic Plan</h3>
                <div className="text-2xl font-serif text-amber-300 mb-4">£45<span className="text-sm text-emerald-100/70 font-sans">/mo</span></div>
                <ul className="text-xs text-emerald-100/80 space-y-2 mb-6 flex-1">
                  <li className="flex gap-2 items-center"><Check size={14} className="text-amber-300"/> 2 Classes a week (8 / month)</li>
                  <li className="flex gap-2 items-center"><Check size={14} className="text-amber-300"/> 30 mins 1-on-1 session</li>
                  <li className="flex gap-2 items-center"><Check size={14} className="text-amber-300"/> Tajweed &amp; Qaida basics</li>
                </ul>
                <button className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs transition">
                  Select Basic
                </button>
              </div>

              <div 
                onClick={() => handleUpdatePlan("Standard Plan • £65/mo (3 Days/Wk)")} 
                className="border-2 border-amber-400/60 rounded-2xl p-6 cursor-pointer transition flex flex-col bg-black/40 relative shadow-lg"
              >
                <div className="absolute top-0 right-0 bg-amber-400 text-emerald-950 text-[10px] font-extrabold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                  Recommended
                </div>
                <h3 className="font-bold text-lg mb-1 text-white">Standard Plan</h3>
                <div className="text-2xl font-serif text-amber-300 mb-4">£65<span className="text-sm text-emerald-100/70 font-sans">/mo</span></div>
                <ul className="text-xs text-emerald-100/80 space-y-2 mb-6 flex-1">
                  <li className="flex gap-2 items-center"><Check size={14} className="text-amber-300"/> 3 Classes a week (12 / month)</li>
                  <li className="flex gap-2 items-center"><Check size={14} className="text-amber-300"/> 30 mins personalized session</li>
                  <li className="flex gap-2 items-center"><Check size={14} className="text-amber-300"/> Complete Tajweed, Hifz &amp; Qaida</li>
                  <li className="flex gap-2 items-center"><Check size={14} className="text-amber-300"/> Monthly AI recitation assessment</li>
                </ul>
                <button className="w-full py-2.5 bg-amber-400 text-emerald-950 rounded-xl font-bold text-xs hover:bg-amber-300 transition">
                  Select Standard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
