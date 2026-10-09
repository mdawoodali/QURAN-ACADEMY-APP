import Link from "next/link";
import { Check } from "lucide-react";

export default function PackagesPage() {
  return (
    <main className="w-full max-w-[1280px] mx-auto px-6 py-12 md:py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif text-[var(--color-ink)] mb-4">Pricing Packages</h1>
        <p className="text-[var(--color-muted)] max-w-2xl mx-auto text-lg">
          Simple, transparent pricing. Choose a plan that fits your schedule.
        </p>
      </div>

      {/* Package Selector logic to be implemented here */}
      <div className="flex justify-center gap-4 mb-12">
        <div className="bg-[var(--color-field)] rounded-full p-1 flex">
          <button className="bg-white rounded-full px-6 py-2 shadow-sm font-bold text-sm text-[var(--color-ink)]">3 days/week</button>
          <button className="rounded-full px-6 py-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)] transition">5 days/week</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Basic Plan */}
        <div className="bg-white rounded-3xl p-8 border border-[var(--color-line)] shadow-sm">
          <h2 className="text-2xl font-bold text-[var(--color-ink)] mb-2">30-Minute Classes</h2>
          <p className="text-[var(--color-muted)] mb-6">Perfect for young children and beginners.</p>
          <div className="mb-8">
            <span className="text-4xl font-bold text-[var(--color-ink)]">$45</span>
            <span className="text-[var(--color-muted)]"> / month</span>
          </div>
          <Link href="/register" className="block w-full text-center border-2 border-[var(--color-green-900)] text-[var(--color-green-900)] hover:bg-[var(--color-green-900)] hover:text-white font-bold py-3 rounded-full transition mb-8">
            Select Plan
          </Link>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-sm text-[var(--color-ink)]">
              <Check className="w-5 h-5 text-[var(--color-green-600)]" /> 3 days per week
            </li>
            <li className="flex items-center gap-3 text-sm text-[var(--color-ink)]">
              <Check className="w-5 h-5 text-[var(--color-green-600)]" /> Dedicated 1-on-1 Teacher
            </li>
            <li className="flex items-center gap-3 text-sm text-[var(--color-ink)]">
              <Check className="w-5 h-5 text-[var(--color-green-600)]" /> Live Voice Classroom
            </li>
          </ul>
        </div>

        {/* Pro Plan */}
        <div className="bg-[var(--color-ink)] rounded-3xl p-8 shadow-xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[var(--color-highlight-bg)] text-[#92400e] text-xs font-bold px-4 py-1 rounded-bl-xl border-l border-b border-[var(--color-highlight-border)]">
            MOST POPULAR
          </div>
          <h2 className="text-2xl font-bold mb-2">60-Minute Classes</h2>
          <p className="text-[#a1b3af] mb-6">Ideal for Hifz students and deep Tajweed study.</p>
          <div className="mb-8">
            <span className="text-4xl font-bold">$75</span>
            <span className="text-[#a1b3af]"> / month</span>
          </div>
          <Link href="/register" className="block w-full text-center bg-[var(--color-green-600)] hover:bg-[var(--color-green-900)] text-white font-bold py-3 rounded-full transition shadow-lg mb-8">
            Select Plan
          </Link>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-sm">
              <Check className="w-5 h-5 text-[var(--color-mint-100)]" /> 3 days per week
            </li>
            <li className="flex items-center gap-3 text-sm">
              <Check className="w-5 h-5 text-[var(--color-mint-100)]" /> Dedicated 1-on-1 Teacher
            </li>
            <li className="flex items-center gap-3 text-sm">
              <Check className="w-5 h-5 text-[var(--color-mint-100)]" /> Advanced progress reports
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
