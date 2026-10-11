import { Check } from "lucide-react";

export default function ProgrammesPage() {
  return (
    <main className="w-full max-w-[1280px] mx-auto px-6 py-12 md:py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
          Our Learning Programmes
        </h1>
        <p className="text-emerald-100/85 max-w-2xl mx-auto text-lg leading-relaxed font-sans">
          From absolute beginner to advanced recitation and memorisation, we have a structured path tailored for you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Level 1 */}
        <div className="glass-container rounded-3xl p-8 border border-white/15 shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-amber-300 text-xs font-bold uppercase tracking-widest mb-3 block">
              Level 1
            </span>
            <h2 className="text-2xl font-bold font-serif text-white mb-4">
              Noorani Qaida
            </h2>
            <p className="text-emerald-100/80 mb-6 leading-relaxed text-sm">
              Master the Arabic alphabet and basic pronunciation rules. The foundational step for absolute beginners.
            </p>
          </div>
          <ul className="space-y-3 pt-4 border-t border-white/10">
            <li className="flex items-center gap-2 text-sm text-emerald-100">
              <Check className="w-4 h-4 text-amber-300 flex-shrink-0" /> Arabic Alphabet
            </li>
            <li className="flex items-center gap-2 text-sm text-emerald-100">
              <Check className="w-4 h-4 text-amber-300 flex-shrink-0" /> Vowels & Harakat
            </li>
            <li className="flex items-center gap-2 text-sm text-emerald-100">
              <Check className="w-4 h-4 text-amber-300 flex-shrink-0" /> Connecting Letters
            </li>
          </ul>
        </div>

        {/* Level 2 */}
        <div className="glass-container rounded-3xl p-8 border border-amber-400/30 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 bg-amber-400/20 text-amber-300 text-[10px] font-bold px-3 py-1 rounded-bl-xl border-l border-b border-amber-400/30 uppercase tracking-wider">
            Popular
          </div>
          <div>
            <span className="text-amber-300 text-xs font-bold uppercase tracking-widest mb-3 block">
              Level 2
            </span>
            <h2 className="text-2xl font-bold font-serif text-white mb-4">
              Fluent Recitation
            </h2>
            <p className="text-emerald-100/80 mb-6 leading-relaxed text-sm">
              Transition from Qaida to reading the Quran with proper Tajweed and a steady, beautiful pace.
            </p>
          </div>
          <ul className="space-y-3 pt-4 border-t border-white/10">
            <li className="flex items-center gap-2 text-sm text-emerald-100">
              <Check className="w-4 h-4 text-amber-300 flex-shrink-0" /> Makharij (Articulation)
            </li>
            <li className="flex items-center gap-2 text-sm text-emerald-100">
              <Check className="w-4 h-4 text-amber-300 flex-shrink-0" /> Rules of Noon & Meem
            </li>
            <li className="flex items-center gap-2 text-sm text-emerald-100">
              <Check className="w-4 h-4 text-amber-300 flex-shrink-0" /> Madd (Elongation)
            </li>
          </ul>
        </div>

        {/* Level 3 */}
        <div className="glass-container rounded-3xl p-8 border border-white/15 shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-amber-300 text-xs font-bold uppercase tracking-widest mb-3 block">
              Level 3
            </span>
            <h2 className="text-2xl font-bold font-serif text-white mb-4">
              Hifz (Memorisation)
            </h2>
            <p className="text-emerald-100/80 mb-6 leading-relaxed text-sm">
              A rigorous, proven system to commit the Quran to memory with regular revision (Muraja'ah).
            </p>
          </div>
          <ul className="space-y-3 pt-4 border-t border-white/10">
            <li className="flex items-center gap-2 text-sm text-emerald-100">
              <Check className="w-4 h-4 text-amber-300 flex-shrink-0" /> Sabaq (New Lesson)
            </li>
            <li className="flex items-center gap-2 text-sm text-emerald-100">
              <Check className="w-4 h-4 text-amber-300 flex-shrink-0" /> Sabaqi (Recent Revision)
            </li>
            <li className="flex items-center gap-2 text-sm text-emerald-100">
              <Check className="w-4 h-4 text-amber-300 flex-shrink-0" /> Manzil (Old Revision)
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
