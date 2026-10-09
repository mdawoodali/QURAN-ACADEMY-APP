import Link from 'next/link'

export default function StudentQuranLibrary() {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto h-full flex flex-col">
      <div className="mb-8 shrink-0">
        <h1 className="text-2xl md:text-3xl font-serif text-[#0C4A3A] mb-2">Quran library</h1>
        <p className="text-gray-500">114 Surahs • 30 Juz • Page, Hizb, Ruku and Sajdah markers</p>
      </div>
      
      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        
        {/* Left Sidebar: Surah List */}
        <div className="w-full lg:w-80 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden shrink-0">
          <div className="p-4 border-b border-gray-100">
            <input 
              type="text" 
              placeholder="Search Arabic or translation" 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#0C4A3A]"
            />
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <div className="bg-[#D1EBE1] text-[#0C4A3A] font-bold p-3 rounded-xl mb-1 cursor-pointer">
              01 Al-Fatihah
            </div>
            {['02 Al-Baqarah', '03 Ali Imran', '04 An-Nisa', '05 Al-Ma\'idah', '06 Al-An\'am', '07 Al-A\'raf', '08 Al-Anfal'].map(s => (
              <div key={s} className="text-gray-700 font-medium p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition">
                {s}
              </div>
            ))}
          </div>
        </div>
        
        {/* Right Main Content: Surah View */}
        <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col p-6 relative overflow-hidden">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-xl font-bold text-gray-900">Al-Fatihah</h2>
            <div className="bg-[#D1EBE1] text-[#0C4A3A] font-bold text-xs px-4 py-2 rounded-full">
              Study | Mushaf
            </div>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center mb-12 min-h-[200px]">
            <div className="font-quran text-5xl md:text-6xl text-[#111827] leading-[2.5] text-center w-full max-w-xl mx-auto flex items-center justify-center gap-4 flex-wrap mb-10" dir="rtl">
              <span>ٱلْحَمْدُ</span>
              <span>لِلَّهِ</span>
              <span>رَبِّ</span>
              <span>ٱلْعَـٰلَمِينَ</span>
            </div>
            
            <p className="text-gray-600 text-center">All praise belongs to Allah, Lord of all worlds.</p>
          </div>
          
          <div className="flex justify-center gap-6 text-sm font-bold text-[#0C4A3A] mt-auto pb-4">
            <span className="text-gray-500">Surah 1 • Ayah 2</span>
            <button className="hover:underline">Bookmark</button>
            <button className="hover:underline">Note</button>
            <button className="hover:underline">Resume reading</button>
          </div>
          
        </div>
      </div>
      
      {/* Footer Settings */}
      <div className="mt-6 flex flex-wrap gap-4 text-xs font-bold text-gray-400 justify-center">
        <span>Script: Uthmani / IndoPak</span>
        <span>•</span>
        <span>Translation: Urdu / English</span>
        <span>•</span>
        <span>Theme: light / dark / sepia</span>
        <span>•</span>
        <span>Font size: A-  A+</span>
      </div>
    </div>
  )
}
