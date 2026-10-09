import { login, signup } from './actions'
import { BookOpen } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <div className="flex justify-center mb-6">
          <div className="bg-[#0C4A3A] p-3 rounded-2xl text-white">
            <BookOpen size={32} />
          </div>
        </div>
        <h2 className="text-3xl font-serif text-[#0C4A3A] text-center mb-2">Welcome Back</h2>
        <p className="text-gray-500 text-center text-sm mb-8">Sign in to access your classroom and portal.</p>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1" htmlFor="email">Email Address</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0C4A3A] transition"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1" htmlFor="password">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0C4A3A] transition"
              placeholder="••••••••"
            />
          </div>
          
          <div className="pt-4 flex flex-col gap-3">
            <button formAction={login} className="w-full bg-[#0C4A3A] text-white py-3 rounded-xl font-bold hover:bg-[#0D5C46] transition transform hover:-translate-y-0.5 shadow-sm">
              Sign In
            </button>
            <div className="flex gap-2">
              <Link href="/register/student" className="w-1/2 text-center bg-white text-[#0C4A3A] border border-[#0C4A3A]/20 py-3 rounded-xl font-bold hover:bg-emerald-50 transition">
                Register Student
              </Link>
              <Link href="/register/teacher" className="w-1/2 text-center bg-white text-[#0C4A3A] border border-[#0C4A3A]/20 py-3 rounded-xl font-bold hover:bg-emerald-50 transition">
                Apply to Teach
              </Link>
            </div>
          </div>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          <Link href="/" className="hover:text-[#0C4A3A] font-bold transition">← Back to homepage</Link>
        </div>
      </div>
    </div>
  )
}
