import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-[var(--color-page)] flex flex-col items-center">
      {/* Navigation (simplified for now, layout handles true nav) */}
      
      {/* Hero Section */}
      <main className="w-full max-w-[1280px] mx-auto px-6 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column */}
        <div className="flex flex-col items-start space-y-6">
          <span className="text-[var(--color-muted)] font-bold tracking-widest text-sm uppercase">
            Personal guidance. Every lesson.
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-[var(--color-ink)] leading-tight">
            A lifelong connection with the Quran.
          </h1>
          <p className="text-lg md:text-xl text-[var(--color-muted)] max-w-lg leading-relaxed font-sans">
            Learn with a qualified teacher, a shared Quran classroom and a plan that grows with you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
            <Link 
              href="/trial" 
              className="bg-[var(--color-green-600)] hover:bg-[var(--color-green-900)] text-white font-bold py-4 px-8 rounded-full transition-colors text-center shadow-lg hover:shadow-xl"
            >
              Begin with a free trial
            </Link>
            <Link 
              href="/programmes" 
              className="bg-[var(--color-mint-100)] hover:bg-[#cbe6db] text-[var(--color-green-900)] font-bold py-4 px-8 rounded-full transition-colors text-center"
            >
              Explore programmes
            </Link>
          </div>
        </div>

        {/* Right Column: Mint Panel */}
        <div className="bg-[var(--color-mint-100)] rounded-[2rem] p-8 md:p-12 relative flex justify-center shadow-inner h-full items-center min-h-[400px]">
          {/* White Card */}
          <div className="bg-white rounded-3xl p-8 shadow-xl max-w-sm w-full relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex justify-between items-start mb-6">
              <span className="bg-[#fef3c7] text-[#92400e] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                Your next class
              </span>
              <span className="text-sm font-bold text-[var(--color-muted)]">Today</span>
            </div>
            
            <h3 className="font-bold text-xl text-[var(--color-ink)] mb-4">Tajweed & Fluent Recitation</h3>
            
            <div className="bg-[var(--color-field)] rounded-2xl p-6 mb-6 flex justify-center items-center">
              <span className="font-arabic text-3xl text-[var(--color-ink)] leading-loose">
                الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
              </span>
            </div>

            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-[var(--color-muted)] font-medium">
                <CheckCircle2 className="w-5 h-5 text-[var(--color-green-600)]" />
                Your teacher is ready
              </li>
              <li className="flex items-center gap-3 text-sm text-[var(--color-muted)] font-medium">
                <CheckCircle2 className="w-5 h-5 text-[var(--color-green-600)]" />
                Voice-follow classroom
              </li>
            </ul>
          </div>
        </div>
      </main>

      {/* Trust Cards */}
      <section className="w-full max-w-[1280px] mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel rounded-2xl p-6 shadow-sm">
          <h4 className="font-bold text-[var(--color-ink)] mb-2">Qualified teachers</h4>
          <p className="text-sm text-[var(--color-muted)]">Qari / Qariah &bull; placement-led</p>
        </div>
        <div className="glass-panel rounded-2xl p-6 shadow-sm">
          <h4 className="font-bold text-[var(--color-ink)] mb-2">A clear learning path</h4>
          <p className="text-sm text-[var(--color-muted)]">Qaida &rarr; Tajweed &rarr; Hifz</p>
        </div>
        <div className="glass-panel rounded-2xl p-6 shadow-sm">
          <h4 className="font-bold text-[var(--color-ink)] mb-2">Progress you can see</h4>
          <p className="text-sm text-[var(--color-muted)]">Lesson notes and parent reports</p>
        </div>
      </section>
    </div>
  );
}
