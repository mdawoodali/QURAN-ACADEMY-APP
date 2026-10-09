export default function ProgrammesPage() {
  return (
    <main className="w-full max-w-[1280px] mx-auto px-6 py-12 md:py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif text-[var(--color-ink)] mb-4">Our Learning Programmes</h1>
        <p className="text-[var(--color-muted)] max-w-2xl mx-auto text-lg">
          From absolute beginner to advanced recitation and memorisation, we have a structured path tailored for you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-3xl p-8 border border-[var(--color-line)] shadow-sm">
          <span className="text-[var(--color-green-600)] text-sm font-bold uppercase tracking-wider mb-2 block">Level 1</span>
          <h2 className="text-2xl font-bold text-[var(--color-ink)] mb-4">Noorani Qaida</h2>
          <p className="text-[var(--color-muted)] mb-6">Master the Arabic alphabet and basic pronunciation rules. The foundational step for absolute beginners.</p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-2 text-sm text-[var(--color-ink)]">Arabic Alphabet</li>
            <li className="flex items-center gap-2 text-sm text-[var(--color-ink)]">Vowels & Harakat</li>
            <li className="flex items-center gap-2 text-sm text-[var(--color-ink)]">Connecting Letters</li>
          </ul>
        </div>

        <div className="bg-[var(--color-mint-100)] rounded-3xl p-8 shadow-sm">
          <span className="text-[var(--color-green-600)] text-sm font-bold uppercase tracking-wider mb-2 block">Level 2</span>
          <h2 className="text-2xl font-bold text-[var(--color-ink)] mb-4">Fluent Recitation</h2>
          <p className="text-[var(--color-muted)] mb-6">Transition from Qaida to reading the Quran with proper Tajweed and a steady, beautiful pace.</p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-2 text-sm text-[var(--color-ink)]">Makharij (Articulation)</li>
            <li className="flex items-center gap-2 text-sm text-[var(--color-ink)]">Rules of Noon & Meem</li>
            <li className="flex items-center gap-2 text-sm text-[var(--color-ink)]">Madd (Elongation)</li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-[var(--color-line)] shadow-sm">
          <span className="text-[var(--color-green-600)] text-sm font-bold uppercase tracking-wider mb-2 block">Level 3</span>
          <h2 className="text-2xl font-bold text-[var(--color-ink)] mb-4">Hifz (Memorisation)</h2>
          <p className="text-[var(--color-muted)] mb-6">A rigorous, proven system to commit the Quran to memory with regular revision (Muraja'ah).</p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-2 text-sm text-[var(--color-ink)]">Sabaq (New Lesson)</li>
            <li className="flex items-center gap-2 text-sm text-[var(--color-ink)]">Sabaqi (Recent Revision)</li>
            <li className="flex items-center gap-2 text-sm text-[var(--color-ink)]">Manzil (Old Revision)</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
