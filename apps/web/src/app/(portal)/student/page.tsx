import Link from 'next/link'

export default function StudentDashboard() {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif text-white mb-2">Assalamu alaikum, Yusuf</h1>
        <p className="text-emerald-100/85">Your learning day, clearly organised.</p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        {/* Next Class Card */}
        <div className="flex-1 glass-container rounded-3xl p-6 md:p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between border border-amber-400/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-700/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div>
            <div className="bg-amber-400/20 text-amber-300 font-bold text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full inline-block mb-6 border border-amber-400/30">
              NEXT CLASS • TODAY
            </div>
            
            <h2 className="text-3xl md:text-4xl font-serif mb-4 text-white">Quran Reading for Kids</h2>
            <div className="text-emerald-100/90 flex gap-4 text-sm font-medium mb-8">
              <span>17:00–17:30</span>
              <span>•</span>
              <span>Asia/Karachi</span>
              <span>•</span>
              <span>Qaida lesson 3</span>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Link href="/classroom/demo" className="bg-amber-400 text-emerald-950 px-8 py-3.5 rounded-xl font-bold hover:bg-amber-300 transition shadow-lg">
              Join class
            </Link>
          </div>
        </div>
        
        {/* This Week Card */}
        <div className="w-full lg:w-72 glass-container rounded-3xl p-6 border border-white/15 shadow-xl flex flex-col justify-between text-white">
          <div>
            <h3 className="text-white font-bold mb-4">This week</h3>
            <div className="text-4xl font-bold text-amber-300 mb-2">3 lessons</div>
            <p className="text-emerald-100/80 text-sm">You earned a learning star!</p>
          </div>
        </div>
      </div>
      
      {/* Lesson Details Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link href="/classroom/demo" className="glass-container rounded-3xl p-6 border border-white/15 shadow-xl hover:border-amber-400/50 transition-all block text-white group">
          <h3 className="text-xs font-bold text-amber-300 uppercase tracking-widest mb-2">Current lesson</h3>
          <div className="text-xl font-bold text-white mb-2 group-hover:text-amber-200 transition-colors">Joined letters</div>
          <p className="text-xs text-emerald-100/80">Launch live classroom / continue practice →</p>
        </Link>
        
        <div className="glass-container rounded-3xl p-6 border border-white/15 shadow-xl text-white">
          <h3 className="text-xs font-bold text-amber-300 uppercase tracking-widest mb-2">Homework</h3>
          <div className="text-xl font-bold text-white mb-2">Qaida 3</div>
          <p className="text-xs text-emerald-100/80">Repeat twice before the next class</p>
        </div>

        <div className="glass-container rounded-3xl p-6 border border-white/15 shadow-xl text-white">
          <h3 className="text-xs font-bold text-amber-300 uppercase tracking-widest mb-2">Teacher note</h3>
          <div className="text-xl font-bold text-white mb-2">Makharij focus</div>
          <p className="text-xs text-emerald-100/80">Good progress on heavy letters this week</p>
        </div>
      </div>
    </div>
  )
}
