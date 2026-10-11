import TrialFunnel from './TrialFunnel';

export default function FreeTrialPage() {
  return (
    <main className="w-full max-w-[1280px] mx-auto px-6 py-12 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="sticky top-24">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-6 leading-tight">
            Book your free trial class.
          </h1>
          <p className="text-emerald-100/85 text-lg mb-8 leading-relaxed font-sans">
            Experience our interactive classroom and meet your teacher. No credit card required.
          </p>
          <div className="glass-container rounded-3xl p-8 border border-white/15 shadow-xl">
            <h3 className="font-bold text-white mb-4 text-lg">What to expect:</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-emerald-100">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                30-minute one-on-one session
              </li>
              <li className="flex items-center gap-3 text-sm text-emerald-100">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                Initial level assessment
              </li>
              <li className="flex items-center gap-3 text-sm text-emerald-100">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
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
