"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Calendar, Star, Percent, HeartHandshake, Gift, ShieldCheck, ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { ACADEMY_PACKAGES, DISCOUNT_POLICIES, CountryCode } from "@/data/packages";

export default function PackagesPage() {
  const { t } = useLanguage();
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>("UK");

  const countries: { code: CountryCode; label: string; flag: string; currencyLabel: string }[] = [
    { code: "UK", label: "United Kingdom", flag: "🇬🇧", currencyLabel: "GBP (£)" },
    { code: "USA", label: "United States", flag: "🇺🇸", currencyLabel: "USD ($)" },
    { code: "AUS", label: "Australia", flag: "🇦🇺", currencyLabel: "AUD ($)" },
    { code: "PK", label: "Pakistan", flag: "🇵🇰", currencyLabel: "PKR" },
  ];

  return (
    <main className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-10 md:py-20 text-white">
      {/* Header */}
      <div className="text-center mb-10 md:mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-800/80 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-semibold mb-4 shadow-sm">
          <Star size={16} />
          <span>Affordable 1-on-1 Tuition</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-4 leading-tight">
          Academy <span className="text-amber-300">Fee Packages</span>
        </h1>
        <p className="text-emerald-100/85 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          Transparent monthly plans with zero hidden fees. Select your country to view fees in your local currency.
        </p>
      </div>

      {/* Country Currency Selector */}
      <div className="flex flex-col items-center justify-center mb-12">
        <span className="text-xs font-bold text-amber-300 uppercase tracking-widest mb-3">
          Select Your Region & Currency:
        </span>
        <div className="glass-container rounded-2xl p-1.5 border border-white/20 flex flex-wrap justify-center gap-2 shadow-xl">
          {countries.map((c) => (
            <button
              key={c.code}
              onClick={() => setSelectedCountry(c.code)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedCountry === c.code
                  ? "bg-amber-400 text-emerald-950 shadow-md scale-105"
                  : "text-emerald-100/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <span>{c.flag}</span>
              <span>{c.label}</span>
              <span className="text-[11px] opacity-75 font-mono">({c.currencyLabel})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6 mb-16">
        {ACADEMY_PACKAGES.map((pkg) => {
          const priceObj = pkg.prices[selectedCountry];

          return (
            <div
              key={pkg.id}
              className={`glass-container rounded-3xl p-6 sm:p-7 border flex flex-col justify-between pop-hover group relative overflow-hidden ${
                pkg.isPopular
                  ? "border-amber-400/60 shadow-[0_20px_45px_rgba(245,158,11,0.2)]"
                  : "border-white/15 shadow-xl"
              }`}
            >
              {pkg.isPopular && (
                <div className="absolute top-0 right-0 bg-amber-400 text-emerald-950 text-[10px] font-extrabold px-3 py-1 rounded-bl-xl uppercase tracking-wider shadow-md">
                  Most Popular
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-amber-300 text-xs font-bold uppercase tracking-wider">
                    {pkg.badge || pkg.schedule}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-800/80 border border-amber-400/30 flex items-center justify-center text-amber-300">
                    <Calendar size={16} />
                  </div>
                </div>

                <h2 className="text-2xl font-bold font-serif text-white mb-1">
                  {pkg.name}
                </h2>
                <p className="text-amber-200/90 text-sm font-semibold mb-3">
                  {pkg.schedule} ({pkg.classesPerMonth} Classes/Mo)
                </p>

                <p className="text-emerald-100/75 text-xs leading-relaxed mb-6">
                  {pkg.description}
                </p>

                {/* Price Display */}
                <div className="bg-black/40 rounded-2xl p-4 border border-white/10 mb-6 text-center">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white">
                    {priceObj.formatted}
                  </span>
                  <span className="text-emerald-200/80 text-xs font-medium block mt-1">
                    per month • {pkg.durationPerClass}
                  </span>
                </div>

                <Link
                  href="/trial"
                  className={`block w-full text-center py-3 rounded-xl font-bold transition shadow-md text-sm mb-6 cursor-pointer ${
                    pkg.isPopular
                      ? "bg-amber-400 hover:bg-amber-300 text-emerald-950"
                      : "border border-amber-400/60 text-amber-300 hover:bg-amber-400 hover:text-emerald-950"
                  }`}
                >
                  Order Now
                </Link>

                <ul className="space-y-2.5 pt-4 border-t border-white/10 text-xs sm:text-[13px] text-emerald-100/90">
                  {pkg.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 mt-6 border-t border-white/10 text-center text-[11px] text-emerald-200/70">
                100% Satisfaction Guarantee
              </div>
            </div>
          );
        })}
      </div>

      {/* Discount Policy Section */}
      <div className="glass-container rounded-3xl p-8 sm:p-10 border border-white/15 shadow-2xl mb-14 pop-hover">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Percent size={14} />
            <span>Special Long-Term Savings</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-white mb-2">
            Academy Discount Policy
          </h2>
          <p className="text-emerald-100/80 text-sm">
            Save more by choosing advance billing plans for your family.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DISCOUNT_POLICIES.map((disc, dIdx) => (
            <div
              key={dIdx}
              className="bg-black/35 rounded-2xl p-6 border border-white/10 text-center flex flex-col justify-between"
            >
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-300 block mb-2">
                  {disc.discount}
                </span>
                <h4 className="text-lg font-bold font-serif text-white mb-2">
                  {disc.title}
                </h4>
                <p className="text-emerald-100/75 text-xs sm:text-sm leading-relaxed">
                  {disc.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sponsor a Child & Referral Program */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
        {/* Sponsor a Child */}
        <div className="glass-container rounded-3xl p-8 border border-white/15 shadow-2xl flex flex-col justify-between pop-hover group">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-800/80 border border-amber-400/30 flex items-center justify-center text-amber-300 mb-6 group-hover:scale-110 transition-transform">
              <HeartHandshake size={26} />
            </div>
            <h3 className="text-2xl font-serif text-white mb-3">
              Sponsor a Child
            </h3>
            <p className="text-emerald-100/85 text-sm leading-relaxed mb-6">
              Sponsor a deserving child to enlighten someone’s life with the teachings of the Holy Quran. Earn perpetual Sadaqah Jariyah by enabling a young student from an underprivileged family to complete Noorani Qaida, Tajweed, or Hifz.
            </p>
          </div>
          <Link
            href="/contact"
            className="w-full text-center bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold py-3.5 rounded-xl transition shadow-md text-sm cursor-pointer"
          >
            Sponsor a Student Today
          </Link>
        </div>

        {/* Referral Program */}
        <div className="glass-container rounded-3xl p-8 border border-white/15 shadow-2xl flex flex-col justify-between pop-hover group">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-800/80 border border-amber-400/30 flex items-center justify-center text-amber-300 mb-6 group-hover:scale-110 transition-transform">
              <Gift size={26} />
            </div>
            <h3 className="text-2xl font-serif text-white mb-3">
              Family Referral Program
            </h3>
            <p className="text-emerald-100/85 text-sm leading-relaxed mb-6">
              Invite your friends, relatives, or community members to Quran Learn Academy. When a referred student completes their trial and enrolls, both your family and the new family receive complimentary tuition credits and discounts.
            </p>
          </div>
          <Link
            href="/trial"
            className="w-full text-center bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold py-3.5 rounded-xl transition text-sm cursor-pointer"
          >
            Refer a Family & Earn Credits
          </Link>
        </div>
      </div>

      {/* Guarantee Assurance Banner */}
      <div className="glass-container rounded-3xl p-8 text-center border border-white/15 max-w-3xl mx-auto shadow-2xl pop-hover">
        <div className="w-14 h-14 bg-emerald-800/80 border border-amber-400/40 rounded-2xl flex items-center justify-center text-amber-300 mx-auto mb-4 shadow-md">
          <ShieldCheck size={28} />
        </div>
        <h3 className="text-2xl font-serif text-white mb-2">
          100% Satisfaction & Substitute Teacher Guarantee
        </h3>
        <p className="text-emerald-100/80 text-sm max-w-xl mx-auto mb-6">
          Every registration includes our free trial evaluation. If you ever feel your teacher’s schedule or style does not match your child’s needs, we will replace the tutor immediately or refund your fees.
        </p>
        <Link
          href="/trial"
          className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold px-8 py-3.5 rounded-full transition shadow-lg text-base inline-flex items-center gap-2 cursor-pointer"
        >
          <span>{t("bookFreeTrial")}</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </main>
  );
}
