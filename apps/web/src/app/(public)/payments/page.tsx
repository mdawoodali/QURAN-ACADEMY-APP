"use client";

import Link from "next/link";
import { CreditCard, ShieldCheck, CheckCircle2, Lock } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

export default function PaymentsPage() {
  const { t } = useLanguage();

  return (
    <main className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-12 md:py-20 text-white">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-800/80 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-semibold mb-4">
          <CreditCard size={16} />
          <span>Secure Transactions</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-6 leading-tight">
          {t("payments")} & Billing
        </h1>
        <p className="text-emerald-100/85 text-base sm:text-lg leading-relaxed">
          Simple, safe, and flexible payment methods for students and families worldwide.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {/* Card 1: Direct Card / Stripe */}
        <div className="glass-container rounded-3xl p-8 border border-white/15 shadow-xl flex flex-col justify-between pop-hover">
          <div>
            <div className="w-14 h-14 bg-emerald-800/80 border border-amber-400/40 rounded-2xl flex items-center justify-center text-amber-300 mb-6 shadow-md">
              <CreditCard size={28} />
            </div>
            <h3 className="text-2xl font-serif text-white mb-3">Credit & Debit Cards</h3>
            <p className="text-emerald-100/75 text-sm leading-relaxed mb-6">
              We accept all major international Visa, Mastercard, American Express, and Discover cards via 256-bit SSL encrypted channels.
            </p>
            <ul className="space-y-3 text-sm text-emerald-100/90 mb-8">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
                <span>Instant automated receipt</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
                <span>Zero hidden bank fees</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
                <span>Monthly flexible cancelation</span>
              </li>
            </ul>
          </div>
          <Link
            href="/packages"
            className="w-full text-center bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold py-3.5 rounded-xl transition shadow-md text-sm"
          >
            View Pricing Plans
          </Link>
        </div>

        {/* Card 2: Bank Transfer & Local Remittance */}
        <div className="glass-container rounded-3xl p-8 border border-white/15 shadow-xl flex flex-col justify-between pop-hover">
          <div>
            <div className="w-14 h-14 bg-emerald-800/80 border border-amber-400/40 rounded-2xl flex items-center justify-center text-amber-300 mb-6 shadow-md">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-2xl font-serif text-white mb-3">Bank & Wire Transfer</h3>
            <p className="text-emerald-100/75 text-sm leading-relaxed mb-6">
              Direct local and international bank transfers supported for UK, USA, Canada, Australia, and Pakistan.
            </p>
            <ul className="space-y-3 text-sm text-emerald-100/90 mb-8">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
                <span>IBAN & Swift transfer</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
                <span>Family bundle discounts</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
                <span>Manual invoice generation</span>
              </li>
            </ul>
          </div>
          <a
            href="https://wa.me/+442032899880"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold py-3.5 rounded-xl transition text-sm"
          >
            Request Bank Details
          </a>
        </div>

        {/* Card 3: Security & Guarantees */}
        <div className="glass-container rounded-3xl p-8 border border-white/15 shadow-xl flex flex-col justify-between pop-hover">
          <div>
            <div className="w-14 h-14 bg-emerald-800/80 border border-amber-400/40 rounded-2xl flex items-center justify-center text-amber-300 mb-6 shadow-md">
              <Lock size={28} />
            </div>
            <h3 className="text-2xl font-serif text-white mb-3">Money-Back Policy</h3>
            <p className="text-emerald-100/75 text-sm leading-relaxed mb-6">
              Full satisfaction guarantee. If you are not satisfied with your teacher during the first month, we offer a substitute or refund.
            </p>
            <ul className="space-y-3 text-sm text-emerald-100/90 mb-8">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
                <span>100% money-back guarantee</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
                <span>Teacher replacement at no cost</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
                <span>Pause subscription anytime</span>
              </li>
            </ul>
          </div>
          <Link
            href="/contact"
            className="w-full text-center bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold py-3.5 rounded-xl transition text-sm"
          >
            Talk to Accounts
          </Link>
        </div>
      </div>
    </main>
  );
}
