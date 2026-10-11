export default function HowItWorksPage() {
  return (
    <main className="w-full max-w-[1280px] mx-auto px-6 py-12 md:py-24">
      <div className="max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-serif text-white mb-6 leading-tight">
          How it works
        </h1>
        <p className="text-emerald-100/85 text-lg mb-10 leading-relaxed font-sans">
          Our platform connects you with certified teachers for a synchronized, interactive learning experience. 
        </p>
        <div className="space-y-8">
          <section className="glass-container p-8 rounded-3xl border border-white/15 shadow-xl">
            <h2 className="text-2xl font-bold font-serif text-white mb-3">
              1. Book a Free Trial
            </h2>
            <p className="text-emerald-100/80 leading-relaxed font-sans">
              Select your timezone, program, and meet your teacher for an initial assessment and walkthrough of the portal.
            </p>
          </section>
          <section className="glass-container p-8 rounded-3xl border border-white/15 shadow-xl">
            <h2 className="text-2xl font-bold font-serif text-white mb-3">
              2. Choose a Package
            </h2>
            <p className="text-emerald-100/80 leading-relaxed font-sans">
              After your trial, choose from one of our flexible pricing plans that fits your schedule and learning goals.
            </p>
          </section>
          <section className="glass-container p-8 rounded-3xl border border-white/15 shadow-xl">
            <h2 className="text-2xl font-bold font-serif text-white mb-3">
              3. Start Learning in the Live Classroom
            </h2>
            <p className="text-emerald-100/80 leading-relaxed font-sans">
              Join your scheduled classes via our state-of-the-art interactive classroom, featuring real-time highlighting and synced Mushaf pages.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
