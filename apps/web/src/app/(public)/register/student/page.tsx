import { BookOpen } from 'lucide-react'
import Link from 'next/link'
import { registerStudent } from './actions'

export const instant = false

export default async function StudentRegistrationPage(props: { searchParams: Promise<{ error?: string }> }) {
  const searchParams = await props.searchParams;
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4 py-12">
      <div className="max-w-2xl w-full glass-container rounded-3xl p-6 sm:p-10 border border-white/15 shadow-2xl text-white">
        <div className="flex justify-center mb-6">
          <div className="bg-emerald-800/80 border border-amber-400/40 p-3.5 rounded-2xl text-amber-300 shadow-md">
            <BookOpen size={32} />
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif text-white text-center mb-2">Student Registration</h2>
        <p className="text-emerald-100/80 text-center text-sm mb-6">Capture the required student details to create your family account.</p>

        {searchParams?.error && (
          <div className="bg-red-950/60 text-red-200 p-4 rounded-xl text-sm font-bold mb-6 border border-red-500/30">
            {searchParams.error}
          </div>
        )}

        <form action={registerStudent} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <div>
              <label className="block text-sm font-semibold text-emerald-100 mb-2">First / Last name</label>
              <input 
                name="fullName" 
                required 
                className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-sm" 
                placeholder="Yusuf Khan" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-100 mb-2">Father's name</label>
              <input 
                name="fatherName" 
                required 
                className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-sm" 
                placeholder="Ahmed Khan" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-100 mb-2">Age</label>
              <input 
                name="age" 
                type="number" 
                required 
                className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-sm" 
                placeholder="9" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-100 mb-2">Country / City</label>
              <input 
                name="location" 
                required 
                className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-sm" 
                placeholder="Pakistan, Karachi" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-emerald-100 mb-2">Postal code / Address</label>
              <input 
                name="address" 
                required 
                className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-sm" 
                placeholder="75000 • Example address" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-100 mb-2">Email or mobile</label>
              <input 
                name="email" 
                type="email" 
                required 
                className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-sm" 
                placeholder="parent@example.com" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-100 mb-2">Password</label>
              <input 
                name="password" 
                type="password" 
                required 
                className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-sm" 
                placeholder="••••••••" 
              />
            </div>
          </div>
          
          <div className="pt-4">
            <button 
              type="submit" 
              className="w-full bg-amber-400 hover:bg-amber-300 text-emerald-950 py-3.5 sm:py-4 rounded-xl font-bold transition-all shadow-lg text-base cursor-pointer"
            >
              Verify & continue
            </button>
            <p className="text-center text-xs text-emerald-100/60 mt-4">
              Sign in by email/mobile + password • Reset by email/OTP • Google/Apple sign-in: optional
            </p>
          </div>
        </form>

        <div className="mt-8 text-center text-sm font-bold">
          <Link href="/login" className="text-emerald-100/70 hover:text-amber-300 transition">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
