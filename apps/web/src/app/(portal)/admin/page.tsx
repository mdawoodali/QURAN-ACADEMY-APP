import Link from 'next/link'

export default function AdminOverview() {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-serif text-[#0C4A3A]">Academy overview</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-gray-500">Asia/Karachi</span>
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#0C4A3A] flex items-center justify-center font-bold text-sm">
            A
          </div>
        </div>
      </header>
      
      <p className="text-gray-500 mb-8">Sample operating dashboard • September 2026</p>
          
          {/* Top KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-8">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
              <h3 className="text-sm font-bold text-gray-500 mb-4">Active students</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">248</div>
              <p className="text-xs text-gray-500">Enrolment by teacher</p>
            </div>
            
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
              <h3 className="text-sm font-bold text-gray-500 mb-4">Approved teachers</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">24</div>
              <p className="text-xs text-gray-500">Availability and workload</p>
            </div>
            
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
              <h3 className="text-sm font-bold text-gray-500 mb-4">Classes today</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">86</div>
              <p className="text-xs text-gray-500">Live, completed and missed</p>
            </div>
            
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
              <h3 className="text-sm font-bold text-gray-500 mb-4">Revenue this month</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">PKR 840k</div>
              <p className="text-xs text-gray-500">Illustrative dashboard data</p>
            </div>
          </div>
          
          {/* Main Charts & Notifications Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Bar Chart (Classes this week) */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-8">Classes this week</h3>
              <div className="flex items-end justify-around h-48 mb-4 border-b border-gray-100 pb-2">
                {/* Fake Bar Chart */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 bg-[#0C4A3A] rounded-t-lg h-24"></div>
                  <span className="text-xs font-bold text-gray-500">M</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 bg-[#0C4A3A] rounded-t-lg h-32"></div>
                  <span className="text-xs font-bold text-gray-500">T</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 bg-[#0C4A3A] rounded-t-lg h-28"></div>
                  <span className="text-xs font-bold text-gray-500">W</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 bg-[#0C4A3A] rounded-t-lg h-40"></div>
                  <span className="text-xs font-bold text-gray-500">T</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 bg-[#0C4A3A] rounded-t-lg h-36"></div>
                  <span className="text-xs font-bold text-gray-500">F</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 bg-[#D1EBE1] rounded-t-lg h-12"></div>
                  <span className="text-xs font-bold text-gray-500">S</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 bg-[#D1EBE1] rounded-t-lg h-10"></div>
                  <span className="text-xs font-bold text-gray-500">S</span>
                </div>
              </div>
              <div className="flex gap-4 text-xs font-bold text-gray-400 mt-6 flex-wrap">
                <Link href="/admin/scheduling" className="hover:text-[#0C4A3A] transition">Live class monitor</Link>
                <span>•</span>
                <Link href="/admin/teachers" className="hover:text-[#0C4A3A] transition">Teachers and students</Link>
                <span>•</span>
                <Link href="/admin/finance" className="hover:text-[#0C4A3A] transition">Revenue and overdue fees</Link>
                <span>•</span>
                <Link href="/admin/finance" className="hover:text-[#0C4A3A] transition">Reports</Link>
                <span>•</span>
                <Link href="/admin" className="hover:text-[#0C4A3A] transition">Content</Link>
                <span>•</span>
                <Link href="/admin" className="hover:text-[#0C4A3A] transition">Policies and settings</Link>
              </div>
            </div>
            
            {/* Needs Attention */}
            <div className="bg-[#F8F9FA] rounded-3xl p-6 border border-emerald-100 shadow-inner">
              <h3 className="text-xl font-bold text-[#0C4A3A] mb-6">Needs attention</h3>
              <ul className="space-y-4 text-sm text-gray-700">
                <Link href="/admin/teachers" className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:border-[#0C4A3A] transition block">
                  <span className="font-medium">12 teacher applications</span>
                  <span className="text-[#0C4A3A] font-bold">&rarr;</span>
                </Link>
                <Link href="/admin/enrolments" className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:border-[#0C4A3A] transition block">
                  <span className="font-medium">18 trial requests</span>
                  <span className="text-[#0C4A3A] font-bold">&rarr;</span>
                </Link>
                <Link href="/admin/finance" className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:border-[#0C4A3A] transition block">
                  <span className="font-medium">7 overdue payments</span>
                  <span className="text-[#0C4A3A] font-bold">&rarr;</span>
                </Link>
                <Link href="/admin/scheduling" className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:border-[#0C4A3A] transition block">
                  <span className="font-medium text-red-600">3 classes need substitutes</span>
                  <span className="text-red-600 font-bold">&rarr;</span>
                </Link>
              </ul>
            </div>
            
      </div>
    </div>
  )
}
