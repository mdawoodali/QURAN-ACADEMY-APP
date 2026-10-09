import Link from 'next/link'
import { Search } from 'lucide-react'

export default function TeacherStudents() {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto flex flex-col h-[calc(100vh-4rem)]">
      <div className="mb-8 shrink-0">
        <h1 className="text-2xl md:text-3xl font-serif text-[#0C4A3A] mb-2">Keep notes. Don't lose track of progress.</h1>
        <p className="text-gray-500">View and update records for your assigned students.</p>
      </div>
      
      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        
        {/* Left Sidebar: Student Roster */}
        <div className="w-full lg:w-80 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden shrink-0">
          <div className="p-4 border-b border-gray-100 relative">
            <input 
              type="text" 
              placeholder="Search students..." 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#0C4A3A]"
            />
            <Search size={16} className="absolute left-7 top-7 text-gray-400" />
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <div className="bg-[#D1EBE1] text-[#0C4A3A] font-bold p-3 rounded-xl mb-1 cursor-pointer flex justify-between items-center">
              <span>Yusuf Khan</span>
              <span className="text-[10px] uppercase bg-[#0C4A3A] text-white px-2 py-0.5 rounded-full">Qaida</span>
            </div>
            
            <div className="text-gray-700 font-medium p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition flex justify-between items-center">
              <span>Amina Khan</span>
              <span className="text-[10px] uppercase bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">Tajweed</span>
            </div>
            
            <div className="text-gray-700 font-medium p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition flex justify-between items-center">
              <span>Omar Ali</span>
              <span className="text-[10px] uppercase bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">Hifz</span>
            </div>
          </div>
        </div>
        
        {/* Right Main Content: Student Notes */}
        <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col relative overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Yusuf Khan</h2>
              <p className="text-sm text-gray-500">Quran Reading for Kids • Wed & Fri</p>
            </div>
            <Link href="/classroom/yusuf" className="bg-[#0C4A3A] text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-[#0D5C46] transition">
              Launch classroom
            </Link>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
            <h3 className="text-sm font-bold text-gray-900 mb-6">Lesson History</h3>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
              
              {/* Note 1 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-[#0C4A3A] text-emerald-100 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                  <span className="text-xs font-bold">14 Sep</span>
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-900">Lesson 3: Joined letters</h4>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Excellent</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Yusuf did great today! We covered the first half of the joined letters. He struggled slightly with the 'Ghayn' pronunciation, so I've added that to his homework.
                  </p>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Homework</span>
                    <span className="text-sm font-medium text-gray-800">Practice Qaida page 12, focusing on the throat letters.</span>
                  </div>
                </div>
              </div>

              {/* Note 2 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-white text-gray-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm">
                  <span className="text-xs font-bold">11 Sep</span>
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-gray-100 shadow-sm opacity-70 hover:opacity-100 transition">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-900">Lesson 2: Heavy & Light</h4>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">Good</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Good progress. Remembered last week's letters well. Needs to make the heavy letters sound thicker.
                  </p>
                </div>
              </div>

            </div>
          </div>
          
          <div className="p-4 border-t border-gray-100 shrink-0 bg-white">
            <button className="w-full border-2 border-dashed border-gray-200 text-gray-500 font-bold py-4 rounded-xl hover:border-[#0C4A3A] hover:text-[#0C4A3A] transition">
              + Add new lesson note
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
