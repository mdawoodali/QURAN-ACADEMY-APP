export default function HowItWorksPage() {
  return (
    <main className="w-full max-w-[1280px] mx-auto px-6 py-12 md:py-24">
      <div className="max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-serif text-[var(--color-ink)] mb-6 leading-tight">
          How it works
        </h1>
        <p className="text-[var(--color-muted)] text-lg mb-8 leading-relaxed">
          Our platform connects you with certified teachers for a synchronized, interactive learning experience. 
        </p>
        <div className="space-y-8">
          <section className="bg-white p-8 rounded-3xl border border-[var(--color-line)] shadow-sm">
            <h2 className="text-2xl font-bold text-[var(--color-ink)] mb-4">1. Book a Free Trial</h2>
            <p className="text-[var(--color-muted)]">Select your timezone, program, and meet your teacher for an initial assessment and walkthrough of the portal.</p>
          </section>
          <section className="bg-white p-8 rounded-3xl border border-[var(--color-line)] shadow-sm">
            <h2 className="text-2xl font-bold text-[var(--color-ink)] mb-4">2. Choose a Package</h2>
            <p className="text-[var(--color-muted)]">After your trial, choose from one of our flexible pricing plans that fits your schedule and learning goals.</p>
          </section>
          <section className="bg-white p-8 rounded-3xl border border-[var(--color-line)] shadow-sm">
            <h2 className="text-2xl font-bold text-[var(--color-ink)] mb-4">3. Start Learning in the Live Classroom</h2>
            <p className="text-[var(--color-muted)]">Join your scheduled classes via our state-of-the-art interactive classroom, featuring real-time highlighting and synced Mushaf pages.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
