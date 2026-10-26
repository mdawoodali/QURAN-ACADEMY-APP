import { Users, ShieldCheck, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { registerParent } from './actions'
import { loginWithGoogle } from '../../login/actions'

export const instant = false;

export default async function ParentRegistrationPage(props: { searchParams: Promise<{ error?: string }> }) {
  const searchParams = await props.searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4 py-12">
      <div className="max-w-2xl w-full glass-container rounded-3xl p-6 sm:p-10 border border-white/15 shadow-2xl text-white">
        <div className="flex justify-center mb-6">
          <div className="bg-emerald-800/80 border border-amber-400/40 p-3.5 rounded-2xl text-amber-300 shadow-md">
            <Users size={32} />
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif text-white text-center mb-2">Parent & Family Registration</h2>
        <p className="text-emerald-100/80 text-center text-sm mb-6">
          Create your parent portal account to enroll your children, track recitation progress, and manage lessons.
        </p>

        {searchParams?.error && (
          <div className="bg-red-950/60 text-red-200 p-4 rounded-xl text-sm font-bold mb-6 border border-red-500/30">
            {searchParams.error}
          </div>
        )}

                {/* 1. Fast-track Google Sign In */}
        <div className="mb-6">
          <form action={loginWithGoogle}>
            <input type="hidden" name="role" value="parent" />
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
              <span>Sign in with Google (Parent)</span>
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

        <form action={registerParent} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <div>
              <label className="block text-sm font-semibold text-emerald-100 mb-2">Parent / Guardian Full Name</label>
              <input
                name="fullName"
                required
                className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-sm"
                placeholder="e.g. Tariq Mehmood"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-100 mb-2">Email Address</label>
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
                placeholder="••••••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-100 mb-2">Contact Mobile / WhatsApp</label>
              <input
                name="mobile"
                required
                className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-sm"
                placeholder="+44 7123 456789"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-100 mb-2">Country / City</label>
              <input
                name="location"
                required
                className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-sm"
                placeholder="United Kingdom, London"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-100 mb-2">Preferred Program Track</label>
              <select
                name="program"
                className="w-full px-4 py-3 bg-black/60 border border-white/20 rounded-xl text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-sm"
              >
                <option value="Noorani Qaida & Basic Tajweed">Noorani Qaida & Basic Tajweed</option>
                <option value="Quran Reading with Tajweed">Quran Reading with Tajweed</option>
                <option value="Hifz (Quran Memorization)">Hifz (Quran Memorization)</option>
                <option value="Islamic Studies & Daily Duas">Islamic Studies & Daily Duas</option>
              </select>
            </div>
          </div>

          {/* Child Details Section */}
          <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="text-amber-400" size={18} />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Child / Learner Information (Optional)
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-emerald-100/80 mb-1">First Child's Name</label>
                <input
                  name="childName"
                  className="w-full px-3.5 py-2.5 bg-black/30 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
                  placeholder="e.g. Ibrahim Khan"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-emerald-100/80 mb-1">Child's Age</label>
                <input
                  name="childAge"
                  type="number"
                  min="4"
                  max="20"
                  className="w-full px-3.5 py-2.5 bg-black/30 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
                  placeholder="8"
                />
              </div>
            </div>
            <p className="text-[11px] text-emerald-200/60 mt-2">
              You can enroll more children and manage individual schedules from your parent dashboard anytime.
            </p>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 py-3.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-amber-400/20 text-sm cursor-pointer"
          >
            <span>Complete Parent Registration</span>
            <ChevronRight size={18} />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-100/70">
          <Link href="/register" className="hover:text-amber-300 transition font-medium">
            ← Choose a different account type
          </Link>
          <div className="flex gap-4">
            <Link href="/register/student" className="hover:text-amber-300 transition">
              Student Sign Up
            </Link>
            <span>•</span>
            <Link href="/login" className="hover:text-amber-300 transition">
              Already have an account? Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
