export default function TeachWithUsPage() {
  return (
    <main className="w-full max-w-[1280px] mx-auto px-6 py-12 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--color-ink)] mb-6 leading-tight">
            Join our faculty of qualified teachers.
          </h1>
          <p className="text-[var(--color-muted)] text-lg mb-8 leading-relaxed">
            We are looking for dedicated, qualified Qaris and Qariahs who are passionate about teaching the Book of Allah to students worldwide. Enjoy flexible hours and competitive compensation.
          </p>
          <div className="space-y-6 mb-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-[var(--color-mint-100)] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[var(--color-green-900)] font-bold">1</span>
              </div>
              <div>
                <h3 className="font-bold text-[var(--color-ink)] mb-1">Apply Online</h3>
                <p className="text-sm text-[var(--color-muted)]">Submit your details, qualifications, and Ijazah (if applicable).</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-[var(--color-mint-100)] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[var(--color-green-900)] font-bold">2</span>
              </div>
              <div>
                <h3 className="font-bold text-[var(--color-ink)] mb-1">Recitation Test</h3>
                <p className="text-sm text-[var(--color-muted)]">A short live interview to evaluate your Tajweed and Makharij.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-[var(--color-mint-100)] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[var(--color-green-900)] font-bold">3</span>
              </div>
              <div>
                <h3 className="font-bold text-[var(--color-ink)] mb-1">Start Teaching</h3>
                <p className="text-sm text-[var(--color-muted)]">Complete onboarding and start accepting students.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-3xl p-8 border border-[var(--color-line)] shadow-xl">
          <h2 className="text-2xl font-bold text-[var(--color-ink)] mb-6">Teacher Application</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[var(--color-ink)] mb-2">Full Name</label>
              <input type="text" className="w-full bg-[var(--color-field)] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[var(--color-green-600)]" placeholder="Enter your full name" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[var(--color-ink)] mb-2">Email Address</label>
              <input type="email" className="w-full bg-[var(--color-field)] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[var(--color-green-600)]" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[var(--color-ink)] mb-2">Years of Experience</label>
              <select className="w-full bg-[var(--color-field)] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[var(--color-green-600)]">
                <option>Less than 1 year</option>
                <option>1-3 years</option>
                <option>3-5 years</option>
                <option>5+ years</option>
              </select>
            </div>
            <button type="button" className="w-full bg-[var(--color-green-900)] hover:bg-[var(--color-green-600)] text-white font-bold py-4 rounded-xl transition-colors mt-4">
              Submit Application
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
