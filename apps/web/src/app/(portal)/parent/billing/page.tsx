"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { 
  Building2, 
  Copy, 
  Upload, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ShieldCheck, 
  ArrowDownToLine
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

  const bank = BANK_CHANNELS[selectedCurrency];

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const handleReceiptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionRef.trim()) {
      toast.error("Please enter your transaction reference or UTR number");
      return;
    }

    setIsUploading(true);
    toast.loading("Submitting payment receipt to Accounts desk...", { id: "receipt" });

    setTimeout(() => {
      setIsUploading(false);
      setReceiptSuccess(true);
      toast.success("Receipt submitted successfully! Admin will verify within 2 business hours.", { id: "receipt" });
    }, 1200);
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full text-white">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-3xl md:text-4xl font-serif text-white">Family Tuition & Billing</h1>
          <span className="flex items-center gap-1 text-[11px] font-bold bg-emerald-950/80 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full">
            <ShieldCheck size={12} />
            <span>Direct Multi-Currency Settlement</span>
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
              <tr className="hover:bg-white/5 transition">
                <td className="py-4 font-mono font-bold text-white">#QA-2026-10</td>
                <td className="py-4 text-emerald-100">November 2026 Tuition (Yusuf & Hana)</td>
                <td className="py-4 font-bold text-amber-300">PKR 18,000</td>
                <td className="py-4 text-emerald-100/75 text-xs">20 Oct 2026</td>
                <td className="py-4">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-400/20 border border-amber-400/30 px-2.5 py-1 rounded-full w-fit">
                    <Clock size={12} />
                    <span>Under Admin Verification</span>
                  </span>
                </td>
                <td className="py-4 text-right">
                  <button
                    onClick={() => toast("Downloading invoice PDF...", { icon: "📄" })}
                    className="text-emerald-100/70 hover:text-amber-300 p-2 transition"
                    title="Download"
                  >
                    <ArrowDownToLine size={16} />
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-white/5 transition">
                <td className="py-4 font-mono font-bold text-white">#QA-2026-09</td>
                <td className="py-4 text-emerald-100">October 2026 Tuition (Yusuf & Hana)</td>
                <td className="py-4 font-bold text-amber-300">PKR 18,000</td>
                <td className="py-4 text-emerald-100/75 text-xs">01 Oct 2026</td>
                <td className="py-4">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-900/60 border border-emerald-500/30 px-2.5 py-1 rounded-full w-fit">
                    <CheckCircle2 size={12} />
                    <span>Paid & Verified</span>
                  </span>
                </td>
                <td className="py-4 text-right">
                  <button
                    onClick={() => toast("Downloading invoice PDF...", { icon: "📄" })}
                    className="text-emerald-100/70 hover:text-amber-300 p-2 transition"
                    title="Download"
                  >
                    <ArrowDownToLine size={16} />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
