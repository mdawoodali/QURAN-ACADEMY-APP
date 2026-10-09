import Link from 'next/link'

export default function TeacherDashboard() {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-serif text-gray-900 mb-2">Assalamu alaikum, Maryam</h1>
        <p className="text-gray-500">Your learning day, clearly organised.</p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        {/* Next Class Card */}
        <div className="flex-1 bg-[#0C4A3A] rounded-3xl p-6 md:p-8 text-white shadow-md relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800 rounded-full blur-3xl opacity-50 -mr-20 -mt-20 pointer-events-none"></div>
          
          <div>
            <div className="bg-white/20 text-white font-bold text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full inline-block mb-6">
              NEXT CLASS • TODAY
            </div>
            
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Quran Reading for Kids</h2>
            <div className="text-emerald-100 flex gap-4 text-sm font-medium mb-8">
              <span>17:00–17:30</span>
              <span>•</span>
              <span>Asia/Karachi</span>
              <span>•</span>
              <span>Qaida lesson 3</span>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Link href="/classroom/teacher" className="bg-white text-[#0C4A3A] px-8 py-3 rounded-xl font-bold hover:bg-emerald-50 transition shadow-sm">
              Start class
            </Link>
          </div>
        </div>
        
        {/* This Week Card */}
        <div className="w-full lg:w-72 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-gray-900 font-bold mb-4">This week</h3>
            <div className="text-4xl font-bold text-[#0C4A3A] mb-2">12 classes</div>
            <p className="text-gray-500 text-sm">2 awaiting notes</p>
          </div>
        </div>
      </div>
      
      {/* Lesson Details Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Current lesson</h3>
          <div className="text-xl font-bold text-gray-900 mb-2">Joined letters</div>
          <p className="text-xs text-gray-500">Prepare lesson / continue practice</p>
        </div>
        
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Homework</h3>
          <div className="text-xl font-bold text-gray-900 mb-2">Qaida 3</div>
          <p className="text-xs text-gray-500">Repeat twice before the next class</p>
        </div>
        
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Progress</h3>
          <div className="text-xl font-bold text-gray-900 mb-2">8 / 12 lessons</div>
          <p className="text-xs text-gray-500">Notes, milestones and monthly report</p>
        </div>
      </div>
      
      <div className="flex gap-6 border-b border-gray-200 pb-2 text-sm font-bold text-gray-400">
        <Link href="/teacher" className="text-[#0C4A3A] border-b-2 border-[#0C4A3A] pb-2 px-1">Today</Link>
        <Link href="/teacher/schedule" className="hover:text-gray-700 px-1">Schedule</Link>
        <Link href="/teacher/students" className="hover:text-gray-700 px-1">My students</Link>
        <Link href="/teacher/students" className="hover:text-gray-700 px-1">Lesson notes</Link>
        <Link href="/teacher/earnings" className="hover:text-gray-700 px-1">Earnings</Link>
        <Link href="/teacher" className="hover:text-gray-700 px-1">Notices</Link>
      </div>
    </div>
  )
}
