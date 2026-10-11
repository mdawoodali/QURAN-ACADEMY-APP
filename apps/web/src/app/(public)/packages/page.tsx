import Link from "next/link";
import { Check } from "lucide-react";

export default function PackagesPage() {
  return (
    <main className="w-full max-w-[1280px] mx-auto px-6 py-12 md:py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
          Pricing Packages
        </h1>
        <p className="text-emerald-100/85 max-w-2xl mx-auto text-lg leading-relaxed font-sans">
          Simple, transparent pricing. Choose a plan that fits your schedule.
        </p>
      </div>

      <div className="flex justify-center gap-4 mb-12">
        <div className="bg-black/35 backdrop-blur-md border border-white/15 rounded-full p-1.5 flex shadow-lg">
          <button className="bg-amber-400 text-emerald-950 rounded-full px-6 py-2 shadow-sm font-bold text-sm transition-all">
            3 days/week
          </button>
          <button className="rounded-full px-6 py-2 text-sm text-emerald-100/80 hover:text-white transition font-medium">
            5 days/week
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Basic Plan */}
        <div className="glass-container rounded-3xl p-8 border border-white/15 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold font-serif text-white mb-2">
              30-Minute Classes
            </h2>
            <p className="text-emerald-100/80 mb-6 text-sm">
              Perfect for young children and beginners.
            </p>
            <div className="mb-8">
              <span className="text-4xl font-bold text-white">$45</span>
              <span className="text-emerald-200/80 text-sm"> / month</span>
            </div>
            <Link 
              href="/trial" 
              className="block w-full text-center border border-amber-400/60 text-amber-300 hover:bg-amber-400 hover:text-emerald-950 font-bold py-3.5 rounded-full transition-all mb-8 shadow-sm"
            >
              Select Plan
            </Link>
          </div>
          <ul className="space-y-4 pt-4 border-t border-white/10">
            <li className="flex items-center gap-3 text-sm text-emerald-100">
              <Check className="w-5 h-5 text-amber-300 flex-shrink-0" /> 3 days per week
            </li>
            <li className="flex items-center gap-3 text-sm text-emerald-100">
              <Check className="w-5 h-5 text-amber-300 flex-shrink-0" /> Dedicated 1-on-1 Teacher
            </li>
            <li className="flex items-center gap-3 text-sm text-emerald-100">
              <Check className="w-5 h-5 text-amber-300 flex-shrink-0" /> Live Voice Classroom
            </li>
          </ul>
        </div>

        {/* Pro Plan */}
        <div className="glass-container rounded-3xl p-8 border border-amber-400/40 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 bg-amber-400/20 text-amber-300 text-xs font-bold px-4 py-1 rounded-bl-xl border-l border-b border-amber-400/30 uppercase tracking-wider">
            Most Popular
          </div>
          <div>
            <h2 className="text-2xl font-bold font-serif text-white mb-2">
              60-Minute Classes
            </h2>
            <p className="text-emerald-100/80 mb-6 text-sm">
              Ideal for Hifz students and deep Tajweed study.
            </p>
            <div className="mb-8">
              <span className="text-4xl font-bold text-white">$75</span>
              <span className="text-emerald-200/80 text-sm"> / month</span>
            </div>
            <Link 
              href="/trial" 
              className="block w-full text-center bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold py-3.5 rounded-full transition-all shadow-lg mb-8"
            >
              Select Plan
            </Link>
          </div>
          <ul className="space-y-4 pt-4 border-t border-white/10">
            <li className="flex items-center gap-3 text-sm text-emerald-100">
              <Check className="w-5 h-5 text-amber-300 flex-shrink-0" /> 3 days per week
            </li>
            <li className="flex items-center gap-3 text-sm text-emerald-100">
              <Check className="w-5 h-5 text-amber-300 flex-shrink-0" /> Dedicated 1-on-1 Teacher
            </li>
            <li className="flex items-center gap-3 text-sm text-emerald-100">
              <Check className="w-5 h-5 text-amber-300 flex-shrink-0" /> Advanced progress reports
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
