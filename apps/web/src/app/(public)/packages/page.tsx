"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Calendar, Star } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { ACADEMY_PACKAGES, CountryCode } from "@/data/packages";

export default function PackagesPage() {
  const { t } = useLanguage();
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>("UK");

  const countries: { code: CountryCode; label: string; flag: string }[] = [
    { code: "UK", label: "United Kingdom", flag: "🇬🇧" },
    { code: "USA", label: "United States", flag: "🇺🇸" },
    { code: "AUS", label: "Australia", flag: "🇦🇺" },
    { code: "PK", label: "Pakistan", flag: "🇵🇰" },
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
          Transparent monthly plans with zero hidden fees. Choose your country and preferred weekly schedule.
        </p>
      </div>

      {/* Country Currency Selector */}
      <div className="flex justify-center mb-12">
        <div className="glass-container rounded-2xl p-1.5 border border-white/20 flex flex-wrap gap-1.5 shadow-xl">
          {countries.map((c) => (
            <button
              key={c.code}
              onClick={() => setSelectedCountry(c.code)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedCountry === c.code
                  ? "bg-amber-400 text-emerald-950 shadow-md"
                  : "text-emerald-100/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <span>{c.flag}</span>
              <span>{c.label}</span>
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
    </main>
  );
}
