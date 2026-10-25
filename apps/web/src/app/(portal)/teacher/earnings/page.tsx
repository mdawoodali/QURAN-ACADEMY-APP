"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, Building2, Download, ShieldCheck, ArrowDownToLine, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useLanguage } from "@/components/LanguageContext";
import { createClient } from "@/utils/supabase/client";

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

export default function TeacherEarnings() {
  const { t, language } = useLanguage();
  const [payouts, setPayouts] = useState<PayoutRecord[]>([]);
  const [bankInfo, setBankInfo] = useState<{ bankName?: string; iban?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch teacher bank profile if present
    const supabase = createClient();
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from("teacher_details")
            .select("bank_account")
            .eq("id", user.id)
            .single();
          if (data?.bank_account && !data.bank_account.includes("PK00TEST")) {
            setBankInfo({
              bankName: "Registered Bank",
              iban: data.bank_account,
            });
          } else {
            setBankInfo(null);
          }
        }
      } catch {
        setBankInfo(null);
      }
    })();

    // 2. Fetch live payouts without mock fallbacks
    fetch(`/api/payouts?_t=${Date.now()}`, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" },
    })
      .then((res) => res.json())
      .then((data) => {
        const records = (data.payouts || []).map((p: any) => ({
          period: p.period || "Current Month",
          completedClasses: Number(p.completed_classes || p.completedClasses || 0),
          hours: `${(Number(p.completed_classes || p.completedClasses || 0) * 0.5).toFixed(1)} hrs`,
          ratePerClass: `PKR ${p.rate_per_class || p.ratePerClass || 500}`,
          adjustments: `PKR ${p.adjustments || 0}`,
          payable: `PKR ${(Number(p.payable_amount || p.payableAmount || 0)).toLocaleString()}`,
          status: (p.status === "paid" ? "Paid" : p.status === "processing" ? "Processing" : "Pending Verification") as PayoutRecord["status"],
          payoutDate: p.payout_date || p.payoutDate || "Pending",
          reference: p.reference || `PAY-${Date.now()}`
        }));
        setPayouts(records);
      })
      .catch((err) => {
        console.error("Failed to load payouts:", err);
        setPayouts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDownloadStatement = (period: string) => {
    toast.success(`Downloading payout statement for ${period}...`);
    const a = document.createElement("a");
    a.href = "/api/reports/download";
    a.download = `payout-statement-${period.toLowerCase().replace(/\s+/g, "-")}.csv`;
    a.click();
  };

  const totalHistoricalEarnings = payouts
    .filter((p) => p.status === "Paid")
    .reduce((sum, p) => sum + parseInt(p.payable.replace(/[^0-9]/g, "") || "0", 10), 0);

  const totalPayableCycle = payouts
    .filter((p) => p.status === "Processing" || p.status === "Pending Verification")
    .reduce((sum, p) => sum + parseInt(p.payable.replace(/[^0-9]/g, "") || "0", 10), 0);

  const totalClassesThisCycle = payouts
    .filter((p) => p.status === "Processing" || p.status === "Pending Verification")
    .reduce((sum, p) => sum + p.completedClasses, 0);

  const isUrdu = language === "ur";

  return (
    <div className={`p-4 md:p-8 max-w-6xl mx-auto w-full text-white ${isUrdu ? "font-urdu" : ""}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif text-white">
            {t("earningsTitle")}
          </h1>
          <p className="text-emerald-100/80 text-sm">
            {t("earningsDesc")}
          </p>
        </div>

        {payouts.length > 0 && (
          <button
            onClick={() => handleDownloadStatement("All Periods")}
            className="bg-amber-400 hover:bg-amber-300 text-emerald-950 px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-md flex items-center gap-2 cursor-pointer font-serif"
          >
            <Download size={14} />
            <span>{t("downloadStatement")}</span>
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-container rounded-3xl p-6 border border-white/15 shadow-xl flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-amber-300 uppercase tracking-widest mb-2">
              Total Settled Earnings
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {loading ? "..." : `PKR ${totalHistoricalEarnings.toLocaleString()}`}
            </div>
            <p className="text-xs text-emerald-100/80">Lifetime cleared payouts</p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-emerald-300 flex items-center gap-1.5">
            <ShieldCheck size={12} />
            <span>Direct electronic transfer</span>
          </div>
        </div>

        <div className="glass-container rounded-3xl p-6 border border-white/15 shadow-xl flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-emerald-300 uppercase tracking-widest mb-2">
              {t("payableThisCycle")}
            </div>
            <div className="text-3xl font-bold text-amber-300 mb-1">
              {loading ? "..." : `PKR ${totalPayableCycle.toLocaleString()}`}
            </div>
            <p className="text-xs text-emerald-100/80">
              {totalClassesThisCycle} {t("classesPendingSettlement")}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-emerald-200/80 flex items-center gap-1.5">
            <Clock size={12} />
            <span>Disbursement scheduled at end of monthly billing cycle</span>
          </div>
        </div>

        <div className="glass-container rounded-3xl p-6 border border-white/15 shadow-xl flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-emerald-100/80 uppercase tracking-widest mb-2">
              {t("registeredBankAccount")}
            </div>
            {bankInfo ? (
              <>
                <div className="text-base font-bold text-white mb-1 flex items-center gap-2">
                  <Building2 size={16} className="text-amber-300" />
                  <span>{bankInfo.bankName}</span>
                </div>
                <p className="text-xs font-mono text-emerald-100/70">{bankInfo.iban}</p>
              </>
            ) : (
              <>
                <div className="text-sm font-semibold text-amber-300/90 mb-1 flex items-center gap-2">
                  <AlertCircle size={15} />
                  <span>{t("noBankConfigured")}</span>
                </div>
                <p className="text-xs text-emerald-100/60 leading-relaxed">
                  {t("contactAccountsDesk")}
                </p>
              </>
            )}
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-emerald-300 flex items-center gap-1.5">
            <CheckCircle2 size={12} />
            <span>Verified by Accounts Desk</span>
          </div>
        </div>
      </div>

      {/* Monthly Settlement Ledger */}
      <div className="glass-container rounded-3xl p-6 md:p-8 border border-white/15 shadow-2xl">
        <h2 className="text-xl font-bold font-serif text-white mb-6">
          {t("historicalCompensationLedger")}
        </h2>

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
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-emerald-100/60">
                    Loading payout ledger from database...
                  </td>
                </tr>
              ) : payouts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-emerald-100/60">
                    <p className="mb-2 text-sm text-emerald-100/80 font-medium">{t("noPayoutsYet")}</p>
                    <p className="text-[11px] text-emerald-100/50">
                      When lessons are concluded and approved by the academy administration, your settlement ledger will populate automatically.
                    </p>
                  </td>
                </tr>
              ) : (
                payouts.map((row, idx) => (
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
                        className="text-emerald-100/70 hover:text-amber-300 p-2 transition cursor-pointer"
                        title="Download Statement"
                      >
                        <ArrowDownToLine size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
