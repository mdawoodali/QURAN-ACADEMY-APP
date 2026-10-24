"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { compressReceiptImage } from "@/lib/imageCompressor";
import { 
  Building2, 
  Copy, 
  Upload, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ShieldCheck, 
  ArrowDownToLine,
  Database
} from "lucide-react";

interface BankDetails {
  currency: "PKR" | "GBP" | "USD" | "EUR";
  title: string;
  bankName: string;
  accountNumber: string;
  routingOrSort: string;
  iban: string;
  swiftBic: string;
  extraNotice: string;
}

const BANK_CHANNELS: Record<string, BankDetails> = {
  PKR: {
    currency: "PKR",
    title: "Quran Academy Islamic Education",
    bankName: "Meezan Bank (Islamic Banking)",
    accountNumber: "0102-0105678912",
    routingOrSort: "Raast ID: 03001234567",
    iban: "PK12MEZN0001020105678912",
    swiftBic: "MEZNPKKA",
    extraNotice: "Zero transfer fees via Raast Instant QR or 1-Link 24/7."
  },
  GBP: {
    currency: "GBP",
    title: "Quran Academy Foundation Ltd",
    bankName: "Barclays Bank UK",
    accountNumber: "83920145",
    routingOrSort: "Sort Code: 20-04-15",
    iban: "GB29BARC20041583920145",
    swiftBic: "BARCGB22",
    extraNotice: "Instant settlement via UK Faster Payments Service (FPS)."
  },
  USD: {
    currency: "USD",
    title: "Quran Academy Educational Services",
    bankName: "JPMorgan Chase Bank, N.A.",
    accountNumber: "9823410521",
    routingOrSort: "ACH Routing: 021000021 (Wire: 021000021)",
    iban: "US64CHAS0210000219823410521",
    swiftBic: "CHASUS33",
    extraNotice: "Zero wire fee via domestic US ACH or Zelle institutional payee."
  },
  EUR: {
    currency: "EUR",
    title: "Quran Academy Europe",
    bankName: "Wise Europe SA / Deutsche Bank Partner",
    accountNumber: "DE125007001009823410",
    routingOrSort: "BLZ: 50070010",
    iban: "DE125007001009823410",
    swiftBic: "DEUTDEDDFXX",
    extraNotice: "SEPA Instant Credit Transfer settles within 10 seconds."
  }
};

export default function ParentBilling() {
  const [selectedCurrency, setSelectedCurrency] = useState<"PKR" | "GBP" | "USD" | "EUR">("PKR");
  const [isUploading, setIsUploading] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [transactionRef, setTransactionRef] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [receiptSuccess, setReceiptSuccess] = useState(false);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState(true);

  const fetchInvoices = () => {
    fetch("/api/invoices")
      .then((res) => res.json())
      .then((data) => {
        setInvoices(data.invoices || []);
      })
      .catch((err) => console.error("Failed to load invoices:", err))
      .finally(() => setLoadingInvoices(false));
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const bank = BANK_CHANNELS[selectedCurrency];

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const handleReceiptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionRef.trim()) {
      toast.error("Please enter your transaction reference or UTR number");
      return;
    }

    setIsUploading(true);
    toast.loading("Compressing slip & saving to Accounts desk...", { id: "receipt" });

    try {
      let receiptDataUrl = "";
      if (receiptFile) {
        try {
          const compressed = await compressReceiptImage(receiptFile);
          receiptDataUrl = compressed.dataUrl;
        } catch {
          // continue with submission even if compression fails
        }
      }

      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          familyName: "Khan Family",
          studentName: "Yusuf & Hana Khan",
          packageTier: "Standard Plan (2 Learners)",
          amount: Number(amountPaid) || (selectedCurrency === "PKR" ? 18000 : selectedCurrency === "GBP" ? 65 : 100),
          currency: selectedCurrency,
          paymentMethod: bank.bankName,
          transactionRef: transactionRef.trim(),
          receiptUrl: receiptDataUrl,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save receipt record");
      }

      setIsUploading(false);
      setReceiptSuccess(true);
      fetchInvoices();
      toast.success("Receipt submitted and persisted to Academy Accounts! Verification usually within 2 business hours.", { id: "receipt" });
    } catch {
      setIsUploading(false);
      toast.error("Could not record receipt. Please check your network and try again.", { id: "receipt" });
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full text-white">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-3xl md:text-4xl font-serif text-white">Family Tuition &amp; Billing</h1>
          <span className="flex items-center gap-1 text-[11px] font-bold bg-emerald-950/80 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full">
            <Database size={12} />
            <span>Direct Multi-Currency Rail</span>
          </span>
        </div>
        <p className="text-emerald-100/80 text-sm">
          Pay tuition directly via official academy bank wires or Raast with zero intermediary card processing surcharges.
        </p>
      </div>

      {/* Main Grid: Bank Details (Left) + Receipt Upload (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        
        {/* Left: Official Bank Transfer Details */}
        <div className="lg:col-span-7 glass-container rounded-3xl p-6 md:p-8 border border-white/15 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
              <h2 className="text-xl font-bold font-serif text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-300" />
                <span>Official Remittance Details</span>
              </h2>

              {/* Currency Selector */}
              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-bold">
                {(["PKR", "GBP", "USD", "EUR"] as const).map((curr) => (
                  <button
                    key={curr}
                    onClick={() => setSelectedCurrency(curr)}
                    className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                      selectedCurrency === curr
                        ? "bg-amber-400 text-emerald-950 shadow-md font-extrabold"
                        : "text-emerald-100/70 hover:text-white"
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            </div>

            {/* Bank Card Info */}
            <div className="p-5 rounded-2xl bg-black/35 border border-white/10 mb-6 space-y-4">
              <div>
                <div className="text-[10px] uppercase font-bold text-emerald-300/80">Account Title</div>
                <div className="text-base font-bold text-white flex items-center justify-between">
                  <span>{bank.title}</span>
                  <button
                    onClick={() => handleCopy(bank.title, "Account Title")}
                    className="text-amber-300 hover:text-amber-200 transition p-1"
                    title="Copy"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-300/80">Bank Name</div>
                  <div className="text-sm font-semibold text-white">{bank.bankName}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-300/80">Sort / Routing / Raast</div>
                  <div className="text-sm font-semibold text-amber-300 flex items-center justify-between">
                    <span>{bank.routingOrSort}</span>
                    <button
                      onClick={() => handleCopy(bank.routingOrSort, "Routing info")}
                      className="text-amber-300 hover:text-amber-200 transition p-1"
                    >
                      <Copy size={13} />
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase font-bold text-emerald-300/80">IBAN / Account Number</div>
                <div className="text-sm font-mono font-bold text-white bg-black/40 p-2.5 rounded-xl border border-white/10 flex items-center justify-between break-all">
                  <span>{bank.iban}</span>
                  <button
                    onClick={() => handleCopy(bank.iban, "IBAN")}
                    className="text-amber-300 hover:text-amber-200 transition p-1 ml-2 shrink-0"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-emerald-100/75 pt-1">
                <span>SWIFT / BIC: <strong>{bank.swiftBic}</strong></span>
                <span className="text-[11px] text-amber-300 font-medium">{bank.extraNotice}</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-emerald-100/70 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20 flex items-center gap-2">
            <ShieldCheck size={16} className="text-amber-300 shrink-0" />
            <span>Always include your <strong>Student / Family ID (e.g. FAM-7821)</strong> in the wire reference.</span>
          </div>
        </div>

        {/* Right: Digital Receipt Upload Form */}
        <div className="lg:col-span-5 glass-container rounded-3xl p-6 md:p-8 border border-white/15 shadow-2xl flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold font-serif text-white mb-2 flex items-center gap-2">
              <Upload className="w-5 h-5 text-amber-300" />
              <span>Submit Payment Proof</span>
            </h2>
            <p className="text-xs text-emerald-100/75 mb-6">
              Upload your bank transfer screenshot or transaction receipt for instant admin clearance.
            </p>

            {receiptSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-center animate-in zoom-in-95">
                <CheckCircle2 size={40} className="text-amber-300 mx-auto mb-3" />
                <h3 className="font-bold text-white text-base mb-1">Receipt Submitted!</h3>
                <p className="text-xs text-emerald-100/80 mb-4">
                  Reference: <strong>{transactionRef}</strong>. Our finance desk is reviewing your submission.
                </p>
                <button
                  onClick={() => {
                    setReceiptSuccess(false);
                    setTransactionRef("");
                    setAmountPaid("");
                    setReceiptFile(null);
                  }}
                  className="text-xs font-bold text-amber-300 hover:underline"
                >
                  Submit another payment receipt
                </button>
              </div>
            ) : (
              <form onSubmit={handleReceiptSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-emerald-100 uppercase tracking-wider mb-1.5">
                    Transaction Reference / UTR
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RAAST-98234812 or WIRE-4401"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/20 rounded-xl text-white placeholder:text-emerald-200/40 text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-emerald-100 uppercase tracking-wider mb-1.5">
                      Amount Paid
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 18,000"
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(e.target.value)}
                      className="w-full px-4 py-2.5 bg-black/40 border border-white/20 rounded-xl text-white placeholder:text-emerald-200/40 text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-emerald-100 uppercase tracking-wider mb-1.5">
                      Currency
                    </label>
                    <div className="w-full px-4 py-2.5 bg-black/40 border border-white/20 rounded-xl text-white text-sm font-bold flex items-center justify-between">
                      <span>{selectedCurrency}</span>
                      <span className="text-[10px] text-amber-300">Selected</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-100 uppercase tracking-wider mb-1.5">
                    Receipt Screenshot (Optional)
                  </label>
                  <div className="border border-dashed border-white/20 hover:border-amber-400/60 transition p-4 rounded-xl text-center bg-black/20 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => {
                        if (e.target.files?.[0]) setReceiptFile(e.target.files[0]);
                      }}
                      className="hidden"
                      id="receipt-file-input"
                    />
                    <label htmlFor="receipt-file-input" className="cursor-pointer block">
                      <Upload size={20} className="text-amber-300 mx-auto mb-1.5" />
                      <div className="text-xs font-semibold text-white">
                        {receiptFile ? receiptFile.name : "Choose receipt screenshot or PDF"}
                      </div>
                      <div className="text-[10px] text-emerald-100/60 mt-0.5">Max size: 5MB</div>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold rounded-xl text-xs transition shadow-md cursor-pointer disabled:opacity-50 mt-2"
                >
                  {isUploading ? "Verifying..." : "Upload & Notify Accounts Desk"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Family Invoices Ledger */}
      <div className="glass-container rounded-3xl p-6 md:p-8 border border-white/15 shadow-2xl">
        <h2 className="text-xl font-bold font-serif text-white mb-6 flex items-center gap-2">
          <FileText className="w-5 h-5 text-amber-300" />
          <span>Family Invoice History</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-amber-300 text-xs uppercase tracking-wider font-bold">
                <th className="pb-3">Invoice</th>
                <th className="pb-3">Description</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-sm">
              {loadingInvoices ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-emerald-100/60">
                    Loading invoices from database...
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-emerald-100/60">
                    No invoices recorded yet. Upload a receipt above to record your tuition remittance.
                  </td>
                </tr>
              ) : (
                invoices.map((inv: any) => {
                  const invId = inv.invoice_number || inv.id || "QA-2026";
                  const dateStr = inv.created_at
                    ? new Date(inv.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                    : "October 2026";
                  const isPaid = inv.status === "paid";
                  const isPending = inv.status === "pending_verification";

                  return (
                    <tr key={invId} className="hover:bg-white/5 transition">
                      <td className="py-4 font-mono font-bold text-white">#{invId}</td>
                      <td className="py-4 text-emerald-100">{inv.package_tier || inv.packageTier || "Tuition Fee"}</td>
                      <td className="py-4 font-bold text-amber-300">{inv.currency} {Number(inv.amount).toLocaleString()}</td>
                      <td className="py-4 text-emerald-100/75 text-xs">{dateStr}</td>
                      <td className="py-4">
                        {isPaid ? (
                          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-900/60 border border-emerald-500/30 px-2.5 py-1 rounded-full w-fit">
                            <CheckCircle2 size={12} />
                            <span>Paid &amp; Verified</span>
                          </span>
                        ) : isPending ? (
                          <span className="flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-400/20 border border-amber-400/30 px-2.5 py-1 rounded-full w-fit">
                            <Clock size={12} />
                            <span>Under Admin Verification</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-100/70 bg-black/40 border border-white/10 px-2.5 py-1 rounded-full w-fit">
                            <span>Pending</span>
                          </span>
                        )}
                      </td>
                      <td className="py-4 text-right">
                        <a
                          href={`/api/invoices/${invId}/download?amount=${inv.amount}&currency=${inv.currency}&student=Yusuf+and+Hana&parent=Ahmed+Khan&ref=${inv.transaction_ref || inv.transactionRef || "BANK-WIRE"}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-100/70 hover:text-amber-300 p-2 transition inline-block cursor-pointer"
                          title="Download PDF"
                        >
                          <ArrowDownToLine size={16} />
                        </a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
