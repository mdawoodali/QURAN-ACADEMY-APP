import { login, loginWithGoogle } from './actions'
import { BookOpen } from 'lucide-react'
import Link from 'next/link'

export const instant = false

export default async function LoginPage(props: {
  searchParams: Promise<{ error?: string; redirect?: string }>
}) {
  const searchParams = await props.searchParams
  const error = searchParams?.error
  const redirectPath = searchParams?.redirect

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4 py-12">
      <div className="max-w-md w-full glass-container rounded-3xl p-8 border border-white/15 shadow-2xl">
        <div className="flex flex-col items-center justify-center mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-3 group mb-3" title="Back to Quran Learn Academy">
            <div className="bg-emerald-800/90 border border-amber-400/40 p-3 rounded-2xl text-amber-300 shadow-md group-hover:scale-105 transition-transform">
              <BookOpen size={30} />
            </div>
            <div className="text-left">
              <span className="font-serif font-bold text-xl tracking-tight leading-tight text-white block">
                Quran Learn<br />Academy
              </span>
            </div>
          </Link>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif text-white text-center mb-1">Welcome Back</h2>
        <p className="text-emerald-100/80 text-center text-sm mb-6">Sign in to access your classroom and portal.</p>

        {error && (
          <div className="bg-red-950/60 text-red-200 p-4 rounded-xl text-sm font-bold mb-6 border border-red-500/30">
            {error}
          </div>
        )}

        {/* 1. Google OAuth 1-Tap Sign In */}
        <form action={loginWithGoogle} className="mb-5">
          {redirectPath && <input type="hidden" name="redirect" value={redirectPath} />}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-stone-100 text-stone-900 py-3.5 rounded-xl font-bold transition shadow-md cursor-pointer border border-stone-200 text-sm"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>
        </form>

        <div className="relative flex py-2 items-center mb-5">
          <div className="flex-grow border-t border-white/15"></div>
          <span className="flex-shrink mx-4 text-xs font-semibold text-emerald-100/60 uppercase tracking-wider">
            or with email
          </span>
          <div className="flex-grow border-t border-white/15"></div>
        </div>

        {/* 2. Email & Password Sign In */}
        <form className="space-y-4">
          {redirectPath && <input type="hidden" name="redirect" value={redirectPath} />}
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
          
          <div className="pt-2">
            <button formAction={login} className="w-full bg-amber-400 hover:bg-amber-300 text-emerald-950 py-3.5 rounded-xl font-bold transition shadow-md cursor-pointer text-sm">
              Sign In
            </button>
          </div>
        </form>

        {/* 3. Clean Account Registration Link */}
        <div className="mt-6 pt-6 border-t border-white/10 text-center text-sm text-emerald-100/70">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-amber-300 hover:text-amber-200 font-bold underline transition">
            Create an account
          </Link>
        </div>

        <div className="mt-4 text-center text-xs text-emerald-100/50">
          <Link href="/" className="hover:text-amber-300 transition">← Back to homepage</Link>
        </div>
      </div>
    </div>
  )
}
