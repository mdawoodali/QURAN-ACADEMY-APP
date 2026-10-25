import { Users, ShieldCheck, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { registerParent } from './actions'

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
