export default function TeachWithUsPage() {
  return (
    <main className="w-full max-w-[1280px] mx-auto px-6 py-12 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Column: Information & Steps */}
        <div>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-6 leading-tight">
            Join our faculty of qualified teachers.
          </h1>
          <p className="text-emerald-100/85 text-lg mb-8 leading-relaxed font-sans">
            We are looking for dedicated, qualified Qaris and Qariahs who are passionate about teaching the Book of Allah to students worldwide. Enjoy flexible hours and competitive compensation.
          </p>
          <div className="space-y-6 mb-8">
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-emerald-800/80 border border-amber-400/40 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                <span className="text-amber-300 font-bold text-lg">1</span>
              </div>
              <div>
                <h3 className="font-bold text-white mb-1 text-lg">Apply Online</h3>
                <p className="text-sm text-emerald-100/80 leading-relaxed">
                  Submit your details, qualifications, and Ijazah (if applicable).
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-emerald-800/80 border border-amber-400/40 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                <span className="text-amber-300 font-bold text-lg">2</span>
              </div>
              <div>
                <h3 className="font-bold text-white mb-1 text-lg">Recitation Test</h3>
                <p className="text-sm text-emerald-100/80 leading-relaxed">
                  A short live interview to evaluate your Tajweed and Makharij.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-emerald-800/80 border border-amber-400/40 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                <span className="text-amber-300 font-bold text-lg">3</span>
              </div>
              <div>
                <h3 className="font-bold text-white mb-1 text-lg">Start Teaching</h3>
                <p className="text-sm text-emerald-100/80 leading-relaxed">
                  Complete onboarding and start accepting students.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column: Glassmorphic Application Form */}
        <div className="glass-container rounded-3xl p-8 border border-white/15 shadow-2xl">
          <h2 className="text-2xl font-bold font-serif text-white mb-6">
            Teacher Application
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-emerald-100 mb-2">
                Full Name
              </label>
              <input 
                type="text" 
                className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-sm" 
                placeholder="Enter your full name" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-100 mb-2">
                Email Address
              </label>
              <input 
                type="email" 
                className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-sm" 
                placeholder="you@example.com" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-100 mb-2">
                Years of Experience
              </label>
              <select className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-sm [&>option]:bg-[#052b20] [&>option]:text-white">
                <option value="<1">Less than 1 year</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5+">5+ years</option>
              </select>
            </div>
            <button 
              type="button" 
              className="w-full bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold py-4 rounded-xl transition-all shadow-lg mt-4 cursor-pointer text-base"
            >
              Submit Application
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
