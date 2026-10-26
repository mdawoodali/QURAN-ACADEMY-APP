import { BookOpen } from 'lucide-react'
import Link from 'next/link'
import { registerStudent } from './actions'
import { loginWithGoogle } from '../../login/actions'

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

                {/* 1. Fast-track Google Sign In */}
        <div className="mb-6">
          <form action={loginWithGoogle}>
            <input type="hidden" name="role" value="student" />
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-stone-100 text-stone-900 py-3.5 px-4 rounded-2xl font-bold transition-all shadow-md hover:shadow-lg border border-stone-200 text-sm sm:text-base cursor-pointer"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Sign in with Google (Student)</span>
            </button>
          </form>

          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-white/15"></div>
            <span className="flex-shrink mx-4 text-xs font-semibold text-emerald-100/60 uppercase tracking-wider">
              or register with email below
            </span>
            <div className="flex-grow border-t border-white/15"></div>
          </div>
        </div>

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
