import { login } from './actions'
import { BookOpen } from 'lucide-react'
import Link from 'next/link'

export const instant = false

export default async function LoginPage(props: { searchParams: Promise<{ error?: string }> }) {
  const searchParams = await props.searchParams;
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4 py-12">
      <div className="max-w-md w-full glass-container rounded-3xl p-8 border border-white/15 shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="bg-emerald-800 p-3 rounded-2xl text-amber-300 shadow-md">
            <BookOpen size={32} />
          </div>
        </div>
        <h2 className="text-3xl font-serif text-white text-center mb-2">Welcome Back</h2>
        <p className="text-emerald-100/80 text-center text-sm mb-6">Sign in to access your classroom and portal.</p>

        {searchParams?.error && (
          <div className="bg-red-950/60 text-red-200 p-4 rounded-xl text-sm font-bold mb-6 border border-red-500/30">
            {searchParams.error}
          </div>
        )}

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-emerald-100 mb-2" htmlFor="email">Email Address</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition text-sm"
              placeholder="admin@quranacademy.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-emerald-100 mb-2" htmlFor="password">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition text-sm"
              placeholder="••••••••"
            />
          </div>
          
          <div className="pt-4 flex flex-col gap-3">
            <button formAction={login} className="w-full bg-amber-400 hover:bg-amber-300 text-emerald-950 py-3.5 rounded-xl font-bold transition shadow-md cursor-pointer">
              Sign In
            </button>
            <div className="flex gap-2">
              <Link href="/register/student" className="w-1/2 text-center bg-white/10 hover:bg-white/20 text-white border border-white/20 py-3 rounded-xl font-bold transition text-sm">
                Register Student
              </Link>
              <Link href="/register/teacher" className="w-1/2 text-center bg-white/10 hover:bg-white/20 text-white border border-white/20 py-3 rounded-xl font-bold transition text-sm">
                Apply to Teach
              </Link>
            </div>
          </div>
        </form>

        {/* Quick Portal Switcher for Testing / Local Evaluation */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <span className="text-[11px] text-amber-300 font-bold uppercase tracking-wider block mb-3">
            Quick Portal Access (Demo & Evaluation)
          </span>
          <div className="grid grid-cols-3 gap-2 text-xs font-bold">
            <Link
              href="/api/demo-access?role=admin"
              className="py-2.5 px-1 bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-emerald-950 border border-amber-400/40 rounded-xl transition-all shadow-sm text-center"
            >
              Admin
            </Link>
            <Link
              href="/api/demo-access?role=teacher"
              className="py-2.5 px-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl transition-all shadow-sm text-center"
            >
              Teacher
            </Link>
            <Link
              href="/api/demo-access?role=student"
              className="py-2.5 px-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl transition-all shadow-sm text-center"
            >
              Student
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-emerald-100/70">
          <Link href="/" className="hover:text-amber-300 font-bold transition">← Back to homepage</Link>
        </div>
      </div>
    </div>
  )
}
