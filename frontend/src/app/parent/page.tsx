import { BookOpen, Plus, Shield, CreditCard, ChevronRight } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Link from 'next/link'

export default function ParentPortal() {
  return (
    <div className="flex h-screen bg-[#F8F9FA] text-[#111827]">
      <Sidebar role="parent" />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-2xl md:text-3xl font-serif text-[#0C4A3A]">Your family</h1>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-500">Asia/Karachi</span>
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#0C4A3A] flex items-center justify-center font-bold text-sm">
                P
              </div>
            </div>
          </header>
          
          <p className="text-gray-500 mb-8">Manage learning, fees and permissions in one place.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            
            {/* Child Card 1 */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#0C4A3A] flex items-center justify-center font-bold text-lg">
                  YK
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Yusuf Khan</h3>
                  <p className="text-sm text-gray-500">9 years • Quran Reading for Kids</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-sm font-bold text-gray-700 mb-2">Next lesson: Wednesday, 17:00</p>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0C4A3A] w-1/3 rounded-full"></div>
                </div>
              </div>
              
              <div className="mt-auto flex gap-3">
                <Link href="/student" className="flex-1 bg-[#0C4A3A] text-white py-2.5 rounded-xl font-bold text-sm hover:bg-[#0D5C46] transition text-center">
                  Open child profile
                </Link>
                <Link href="/classroom/yusuf" className="flex-1 bg-emerald-50 text-[#0C4A3A] py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-100 transition text-center">
                  Join as observer
                </Link>
              </div>
            </div>

            {/* Child Card 2 */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#0C4A3A] flex items-center justify-center font-bold text-lg">
                  HK
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Hana Khan</h3>
                  <p className="text-sm text-gray-500">12 years • Hifz & Memorisation</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-sm font-bold text-gray-700 mb-2">Next lesson: Wednesday, 17:00</p>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0C4A3A] w-2/3 rounded-full"></div>
                </div>
              </div>
              
              <div className="mt-auto flex gap-3">
                <Link href="/student" className="flex-1 bg-[#0C4A3A] text-white py-2.5 rounded-xl font-bold text-sm hover:bg-[#0D5C46] transition text-center">
                  Open child profile
                </Link>
                <Link href="/classroom/hana" className="flex-1 bg-emerald-50 text-[#0C4A3A] py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-100 transition text-center">
                  Join as observer
                </Link>
              </div>
            </div>
            
          </div>
          
          {/* Bottom Features List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm font-bold text-gray-700 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 cursor-pointer hover:text-[#0C4A3A] transition p-2 rounded-lg hover:bg-gray-50">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#0C4A3A] flex items-center justify-center"><Plus size={14} /></div>
              Add another child
            </div>
            <div className="flex items-center gap-3 cursor-pointer hover:text-[#0C4A3A] transition p-2 rounded-lg hover:bg-gray-50">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#0C4A3A] flex items-center justify-center"><Shield size={14} /></div>
              Child PIN login on shared devices
            </div>
            <div className="flex items-center gap-3 cursor-pointer hover:text-[#0C4A3A] transition p-2 rounded-lg hover:bg-gray-50">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#0C4A3A] flex items-center justify-center"><Shield size={14} /></div>
              Recording consent per child
            </div>
            <div className="flex items-center gap-3 cursor-pointer hover:text-[#0C4A3A] transition p-2 rounded-lg hover:bg-gray-50">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#0C4A3A] flex items-center justify-center"><CreditCard size={14} /></div>
              One family billing account
            </div>
          </div>
          
        </div>
      </main>
    </div>
  )
}
