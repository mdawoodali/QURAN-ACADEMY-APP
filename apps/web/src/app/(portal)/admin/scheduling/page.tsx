import Link from 'next/link'

export default function AdminScheduling() {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-serif text-[#0C4A3A]">Academy calendar</h1>
        <div className="bg-[#D1EBE1] text-[#0C4A3A] font-bold text-xs px-4 py-2 rounded-full hidden sm:block">
          Calendar | List
        </div>
      </div>
      
      <p className="text-gray-500 mb-8">Week of 14 September 2026 • teacher and student local-time display</p>
      
      <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
        <div className="overflow-x-auto min-w-[800px]">
          <div className="grid grid-cols-6 border-b border-gray-100 bg-gray-50">
            <div className="p-4 border-r border-gray-100 text-sm font-bold text-gray-500">Time</div>
            <div className="p-4 border-r border-gray-100 text-sm font-bold text-gray-900 text-center">Mon 14</div>
            <div className="p-4 border-r border-gray-100 text-sm font-bold text-gray-900 text-center">Tue 15</div>
            <div className="p-4 border-r border-gray-100 text-sm font-bold text-gray-900 text-center">Wed 16</div>
            <div className="p-4 border-r border-gray-100 text-sm font-bold text-gray-900 text-center">Thu 17</div>
            <div className="p-4 text-sm font-bold text-gray-900 text-center">Fri 18</div>
          </div>
          
          {/* 16:00 */}
          <div className="grid grid-cols-6 border-b border-gray-100 min-h-[60px]">
            <div className="p-4 border-r border-gray-100 text-xs font-bold text-gray-400">16:00</div>
            <div className="p-2 border-r border-gray-100 relative"></div>
            <div className="p-2 border-r border-gray-100 relative"></div>
            <div className="p-2 border-r border-gray-100 relative"></div>
            <div className="p-2 border-r border-gray-100 relative"></div>
            <div className="p-2 relative"></div>
          </div>

          {/* 16:30 */}
          <div className="grid grid-cols-6 border-b border-gray-100 min-h-[60px]">
            <div className="p-4 border-r border-gray-100 text-xs font-bold text-gray-400">16:30</div>
            <div className="p-2 border-r border-gray-100 relative"></div>
            <div className="p-2 border-r border-gray-100 relative">
              <div className="bg-emerald-100 text-[#0C4A3A] p-2 rounded-lg text-xs absolute inset-1">
                <div className="font-bold">Amina • Maryam</div>
                <div className="text-[#0C4A3A]/70">Tajweed • 30 min</div>
              </div>
            </div>
            <div className="p-2 border-r border-gray-100 relative"></div>
            <div className="p-2 border-r border-gray-100 relative"></div>
            <div className="p-2 relative"></div>
          </div>

          {/* 17:00 */}
          <div className="grid grid-cols-6 border-b border-gray-100 min-h-[60px]">
            <div className="p-4 border-r border-gray-100 text-xs font-bold text-gray-400">17:00</div>
            <div className="p-2 border-r border-gray-100 relative">
              <div className="bg-[#D1EBE1] text-[#0C4A3A] p-2 rounded-lg text-xs absolute inset-1">
                <div className="font-bold">Yusuf • Maryam</div>
                <div className="text-[#0C4A3A]/70">Qaida • 30 min</div>
              </div>
            </div>
            <div className="p-2 border-r border-gray-100 relative"></div>
            <div className="p-2 border-r border-gray-100 relative">
              <div className="bg-[#D1EBE1] text-[#0C4A3A] p-2 rounded-lg text-xs absolute inset-1">
                <div className="font-bold">Yusuf • Maryam</div>
                <div className="text-[#0C4A3A]/70">Qaida • 30 min</div>
              </div>
            </div>
            <div className="p-2 border-r border-gray-100 relative"></div>
            <div className="p-2 relative">
              <div className="bg-[#D1EBE1] text-[#0C4A3A] p-2 rounded-lg text-xs absolute inset-1">
                <div className="font-bold">Yusuf • Maryam</div>
                <div className="text-[#0C4A3A]/70">Qaida • 30 min</div>
              </div>
            </div>
          </div>

          {/* 17:30 */}
          <div className="grid grid-cols-6 border-b border-gray-100 min-h-[60px]">
            <div className="p-4 border-r border-gray-100 text-xs font-bold text-gray-400">17:30</div>
            <div className="p-2 border-r border-gray-100 relative"></div>
            <div className="p-2 border-r border-gray-100 relative"></div>
            <div className="p-2 border-r border-gray-100 relative"></div>
            <div className="p-2 border-r border-gray-100 relative">
              <div className="bg-emerald-50 border border-emerald-200 text-[#0C4A3A] p-2 rounded-lg text-xs absolute inset-1">
                <div className="font-bold">Omar • Bilal</div>
                <div className="text-[#0C4A3A]/70">Hifz • 30 min</div>
              </div>
            </div>
            <div className="p-2 relative"></div>
          </div>
          
          {/* 18:00 */}
          <div className="grid grid-cols-6 border-b border-gray-100 min-h-[60px]">
            <div className="p-4 border-r border-gray-100 text-xs font-bold text-gray-400">18:00</div>
            <div className="p-2 border-r border-gray-100 relative"></div>
            <div className="p-2 border-r border-gray-100 relative"></div>
            <div className="p-2 border-r border-gray-100 relative"></div>
            <div className="p-2 border-r border-gray-100 relative col-span-2">
              <div className="bg-orange-100 text-orange-800 p-2 rounded-lg text-xs absolute inset-1 flex items-center justify-center font-bold">
                Teacher on leave
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-4 text-center">Recurring weekly slots • Leave dates • Conflict detection • Out-of-availability warning • UTC-backed times + daylight saving</p>
    </div>
  )
}
