"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Copy, 
  ShieldCheck, 
  CheckCircle2, 
  Smartphone, 
  FileCheck2,
  Lock,
  ExternalLink
} from "lucide-react";
import toast from "react-hot-toast";

type CurrencyTab = "PKR" | "GBP" | "USD" | "EUR" | "GLOBAL";

interface PaymentRail {
  id: CurrencyTab;
  flag: string;
  name: string;
  currency: string;
  bankName: string;
  accountTitle: string;
  primaryDetails: { label: string; value: string }[];
  swiftBic?: string;
  iban?: string;
  settlementSpeed: string;
  popularRails: string[];
  notice: string;
}

const PAYMENT_RAILS: Record<CurrencyTab, PaymentRail> = {
  PKR: {
    id: "PKR",
    flag: "🇵🇰",
    name: "Pakistan Instant Rails",
    currency: "PKR",
    bankName: "Meezan Bank (Islamic Banking)",
    accountTitle: "Quran Academy Islamic Education",
    primaryDetails: [
      { label: "Account Number", value: "0102-0105678912" },
      { label: "Raast Instant ID", value: "03001234567" },
      { label: "JazzCash Merchant", value: "03001234567" },
      { label: "EasyPaisa Merchant", value: "03001234567" },
      { label: "IBAN", value: "PK12MEZN0001020105678912" },
    ],
    swiftBic: "MEZNPKKA",
    iban: "PK12MEZN0001020105678912",
    settlementSpeed: "Instant (< 10 seconds via Raast / 1-Link)",
    popularRails: ["Raast Instant QR", "1-Link", "JazzCash", "EasyPaisa", "Meezan Mobile"],
    notice: "Zero transfer fees. When transferring via Raast, use Raast ID 03001234567 for immediate automated clearing.",
  },
  GBP: {
    id: "GBP",
    flag: "🇬🇧",
    name: "United Kingdom Faster Payments",
    currency: "GBP (£)",
    bankName: "Barclays Bank UK",
    accountTitle: "Quran Academy Foundation Ltd",
    primaryDetails: [
      { label: "Sort Code", value: "20-04-15" },
      { label: "Account Number", value: "83920145" },
      { label: "IBAN", value: "GB29BARC20041583920145" },
      { label: "BIC / SWIFT", value: "BARCGB22" },
    ],
    swiftBic: "BARCGB22",
    iban: "GB29BARC20041583920145",
    settlementSpeed: "Instant (Faster Payments Service - FPS)",
    popularRails: ["Faster Payments", "BACS", "CHAPS", "Revolut", "Monzo"],
    notice: "Use your child's student name or Family ID as the payment reference for immediate reconciliation.",
  },
  USD: {
    id: "USD",
    flag: "🇺🇸",
    name: "United States Domestic ACH & Wire",
    currency: "USD ($)",
    bankName: "JPMorgan Chase Bank, N.A.",
    accountTitle: "Quran Academy Educational Services",
    primaryDetails: [
      { label: "ACH Routing Number", value: "021000021" },
      { label: "Wire Routing Number", value: "021000021" },
      { label: "Account Number", value: "9823410521" },
      { label: "Zelle Institutional Payee", value: "billing@quranlearnacademy.com" },
    ],
    swiftBic: "CHASUS33",
    iban: "US64CHAS0210000219823410521",
    settlementSpeed: "Same-Day ACH / Instant via Zelle",
    popularRails: ["Zelle Pay", "ACH Direct Deposit", "Domestic Fedwire"],
    notice: "Zero fee domestic transfers. Send via Zelle to billing@quranlearnacademy.com for instantaneous confirmation.",
  },
  EUR: {
    id: "EUR",
    flag: "🇪🇺",
    name: "Eurozone SEPA Instant",
    currency: "EUR (€)",
    bankName: "Wise Europe SA / Deutsche Bank Partner",
    accountTitle: "Quran Academy Europe",
    primaryDetails: [
      { label: "IBAN", value: "DE125007001009823410" },
      { label: "BIC / SWIFT", value: "DEUTDEDDFXX" },
      { label: "Bank Code (BLZ)", value: "50070010" },
    ],
    swiftBic: "DEUTDEDDFXX",
    iban: "DE125007001009823410",
    settlementSpeed: "Instant (< 10 seconds via SEPA Instant)",
    popularRails: ["SEPA Instant Credit", "Wise Direct", "N26", "Deutsche Bank"],
    notice: "SEPA Instant Credit transfers credit within seconds with zero international interchange deductions.",
  },
  GLOBAL: {
    id: "GLOBAL",
    flag: "🌐",
    name: "Canada, Australia & International",
    currency: "CAD / AUD / Multi",
    bankName: "Wise Direct & International Settlement Desk",
    accountTitle: "Quran Learn Academy Global",
    primaryDetails: [
      { label: "Wise Institutional Tag", value: "@quranacademy" },
      { label: "Payoneer Receiving Email", value: "admissions@quranlearnacademy.com" },
      { label: "PayPal Institutional Desk", value: "https://paypal.me/quranacademy" },
      { label: "Canada Interac e-Transfer", value: "canada@quranlearnacademy.com" },
    ],
    settlementSpeed: "Within 1 - 2 Hours",
    popularRails: ["Wise Direct", "Interac e-Transfer (Canada)", "Payoneer", "PayPal Direct"],
    notice: "For families in Canada, Australia, UAE, or Saudi Arabia, Wise or local e-Transfer provides the lowest currency conversion rates.",
  },
};

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<CurrencyTab>("PKR");

  const rail = PAYMENT_RAILS[activeTab];

  const handleCopy = (val: string, label: string) => {
    navigator.clipboard.writeText(val);
    toast.success(`${label} copied to clipboard!`, { icon: "📋" });
  };

  return (
    <main className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-10 md:py-20 text-white">
      {/* 1. Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-800/80 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-semibold mb-4 shadow-sm">
          <ShieldCheck size={16} />
          <span>Zero-Fee Direct Settlement Rails</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-4 leading-tight">
          Academy <span className="text-amber-300">Payment Hub</span>
        </h1>
        <p className="text-emerald-100/85 text-base sm:text-lg leading-relaxed">
          Transparent, commission-free tuition settlement across the UK, USA, Pakistan, Eurozone, and worldwide. Pay directly via your trusted banking app with instant automated receipt generation.
        </p>
      </div>

      {/* 2. Currency Selector Tabs */}
      <div className="flex flex-col items-center mb-10">
        <span className="text-xs font-bold text-amber-300 uppercase tracking-widest mb-3">
          Select Your Settlement Currency:
        </span>
        <div className="glass-container rounded-2xl p-1.5 border border-white/20 flex flex-wrap justify-center gap-2 shadow-2xl">
          {(Object.keys(PAYMENT_RAILS) as CurrencyTab[]).map((tab) => {
            const item = PAYMENT_RAILS[tab];
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-amber-400 text-emerald-950 shadow-md scale-105"
                    : "text-emerald-100/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <span>{item.flag}</span>
                <span>{item.id}</span>
                <span className="text-[11px] opacity-75 font-mono hidden sm:inline">({item.currency})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Bank Rail Display Card */}
      <div className="glass-container rounded-3xl p-6 sm:p-10 border border-white/20 shadow-2xl mb-14 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-6 mb-8 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{rail.flag}</span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">{rail.bankName}</h2>
            </div>
            <p className="text-emerald-200/80 text-sm">
              Account Title: <span className="font-bold text-white">{rail.accountTitle}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-400" />
              <span>{rail.settlementSpeed}</span>
            </span>
          </div>
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {rail.primaryDetails.map((detail, idx) => (
            <div
              key={idx}
              className="bg-black/35 rounded-2xl p-4 border border-white/10 flex items-center justify-between hover:border-amber-400/40 transition group"
            >
              <div>
                <span className="text-[10px] uppercase tracking-wider text-amber-300 font-bold block mb-1">
                  {detail.label}
                </span>
                <span className="font-mono text-white text-sm sm:text-base font-semibold select-all">
                  {detail.value}
                </span>
              </div>
              <button
                onClick={() => handleCopy(detail.value, detail.label)}
                className="bg-white/10 hover:bg-amber-400 hover:text-emerald-950 text-white p-2.5 rounded-xl transition cursor-pointer shadow"
                title={`Copy ${detail.label}`}
              >
                <Copy size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Popular Methods Badge Bar */}
        <div className="bg-black/25 rounded-2xl p-4 border border-white/10 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-emerald-200">
            <Smartphone size={16} className="text-amber-300 shrink-0" />
            <span className="font-bold text-white">Supported In-App Rails:</span>
            <span className="text-emerald-100/70">{rail.popularRails.join(" • ")}</span>
          </div>
        </div>

        {/* Notice Banner */}
        <div className="bg-emerald-950/60 border border-emerald-500/30 rounded-2xl p-4 text-xs text-emerald-100/90 leading-relaxed mb-6">
          <strong>Settlement Guidance:</strong> {rail.notice}
        </div>

        {/* Action Row */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/10">
          <Link
            href="/parent/billing"
            className="flex-1 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold py-3.5 px-6 rounded-xl transition shadow-lg text-sm text-center flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileCheck2 size={16} />
            <span>Upload Receipt in Parent Portal</span>
          </Link>

          <a
            href="https://wa.me/+442032899880"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold py-3.5 px-6 rounded-xl transition text-sm text-center flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>WhatsApp Accounts Desk</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* 4. Four-Step Simple Settlement Flow */}
      <div className="mb-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-serif text-white mb-2">How Tuition Settlement Works</h2>
          <p className="text-emerald-100/80 text-sm">Four seamless steps from enrolment to cleared class schedule.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Select Package",
              desc: "Choose your weekly lesson frequency (2, 3, 4, or 5 days/week) on our packages portal.",
              link: "/packages",
              linkText: "View Packages →",
            },
            {
              step: "02",
              title: "Direct Transfer",
              desc: "Remit the tuition fee through Raast, Faster Payments, ACH, or SEPA without intermediaries.",
              link: "#",
              linkText: "Select Rail Above ↑",
            },
            {
              step: "03",
              title: "Upload Slip / UTR",
              desc: "Submit your screenshot or bank reference number (RRN/UTR) in the Parent Billing dashboard.",
              link: "/parent/billing",
              linkText: "Parent Dashboard →",
            },
            {
              step: "04",
              title: "Instant Verification",
              desc: "Our accounts desk validates your reference within 2 business hours and generates your PDF invoice.",
              link: "/api/reports/download",
              linkText: "Sample PDF Receipt →",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="glass-container rounded-3xl p-6 border border-white/15 shadow-xl flex flex-col justify-between pop-hover"
            >
              <div>
                <span className="text-3xl font-extrabold text-amber-300/40 block mb-3 font-mono">
                  {item.step}
                </span>
                <h3 className="text-lg font-bold font-serif text-white mb-2">{item.title}</h3>
                <p className="text-emerald-100/75 text-xs leading-relaxed mb-4">{item.desc}</p>
              </div>
              <Link
                href={item.link}
                className="text-amber-300 hover:text-amber-200 text-xs font-bold transition flex items-center gap-1"
              >
                <span>{item.linkText}</span>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Guarantees & Safeguards Banner */}
      <div className="glass-container rounded-3xl p-8 border border-white/15 max-w-4xl mx-auto shadow-2xl text-center pop-hover">
        <div className="w-14 h-14 bg-emerald-800/80 border border-amber-400/40 rounded-2xl flex items-center justify-center text-amber-300 mx-auto mb-4 shadow-md">
          <Lock size={26} />
        </div>
        <h3 className="text-2xl font-serif text-white mb-2">100% Satisfaction &amp; Money-Back Guarantee</h3>
        <p className="text-emerald-100/80 text-sm max-w-2xl mx-auto mb-6 leading-relaxed">
          If for any reason you or your child are not completely delighted with your assigned tutor during your first month, we will provide an alternative teacher immediately or refund your remaining tuition. Zero hassle, zero risk.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-xs font-bold">
          <Link
            href="/packages"
            className="bg-amber-400 hover:bg-amber-300 text-emerald-950 px-6 py-3 rounded-full transition shadow-md"
          >
            Explore Academy Plans
          </Link>
          <Link
            href="/trial"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-full transition"
          >
            Book Free Trial First
          </Link>
        </div>
      </div>
    </main>
  );
}
