import TrialFunnel from './TrialFunnel';

export default function FreeTrialPage() {
  return (
    <main className="w-full max-w-[1280px] mx-auto px-6 py-12 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="sticky top-24">
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--color-ink)] mb-6 leading-tight">
            Book your free trial class.
          </h1>
          <p className="text-[var(--color-muted)] text-lg mb-8 leading-relaxed">
            Experience our interactive classroom and meet your teacher. No credit card required.
          </p>
          <div className="bg-[var(--color-mint-100)] rounded-3xl p-8">
            <h3 className="font-bold text-[var(--color-ink)] mb-4">What to expect:</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-[var(--color-ink)]">
                <div className="w-2 h-2 rounded-full bg-[var(--color-green-600)]" />
                30-minute one-on-one session
              </li>
              <li className="flex items-center gap-3 text-sm text-[var(--color-ink)]">
                <div className="w-2 h-2 rounded-full bg-[var(--color-green-600)]" />
                Initial level assessment
              </li>
              <li className="flex items-center gap-3 text-sm text-[var(--color-ink)]">
                <div className="w-2 h-2 rounded-full bg-[var(--color-green-600)]" />
                Walkthrough of the learning portal
              </li>
            </ul>
          </div>
        </div>
        
        <div>
          <TrialFunnel />
        </div>
      </div>
    </main>
  );
}
