import { BookOpen, GraduationCap, Users, Award, ChevronRight, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { loginWithGoogle } from '../login/actions'

export const instant = false;

export default async function RegisterHubPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4 py-12">
      <div className="max-w-4xl w-full glass-container rounded-3xl p-6 sm:p-10 border border-white/15 shadow-2xl text-white">
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-3 group mb-4" title="Back to Quran Learn Academy">
            <div className="bg-emerald-800/90 border border-amber-400/40 p-3 rounded-2xl text-amber-300 shadow-md group-hover:scale-105 transition-transform">
              <BookOpen size={32} />
            </div>
            <div className="text-left">
              <span className="font-serif font-bold text-xl tracking-tight leading-tight text-white block">
                Quran Learn<br />Academy
              </span>
            </div>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-serif text-white mb-2">Create Your Account</h1>
          <p className="text-emerald-100/80 text-sm sm:text-base max-w-lg mx-auto">
            Please choose what you are signing up as so we can customize your classroom and dashboard experience.
          </p>
        </div>

        {/* 3 Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {/* Card 1: Student */}
          <div className="group relative bg-black/40 hover:bg-black/60 border border-white/15 hover:border-amber-400/60 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 shadow-lg hover:shadow-amber-400/10 hover:-translate-y-1">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-800/80 border border-emerald-500/40 text-amber-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <GraduationCap size={24} />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300/90 block mb-1">
                Individual Learner
              </span>
              <h2 className="text-xl font-serif font-bold text-white mb-2">Student</h2>
              <p className="text-xs text-emerald-100/75 leading-relaxed mb-4">
                I am signing up to learn Quran recitation, Noorani Qaida, Tajweed rules, and Islamic studies with a certified tutor.
              </p>
              <ul className="space-y-1.5 text-[11px] text-emerald-200/70 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-amber-400 shrink-0" />
                  <span>Interactive Mushaf classroom</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-amber-400 shrink-0" />
                  <span>Personal homework tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-amber-400 shrink-0" />
                  <span>Speech recitation assessment</span>
                </li>
              </ul>
            </div>
            <Link
              href="/register/student"
              className="w-full py-3 px-4 bg-white/10 hover:bg-amber-400 text-white hover:text-emerald-950 font-bold text-xs rounded-xl transition-all duration-200 flex items-center justify-center gap-2 border border-white/15 hover:border-amber-400 shadow-sm"
            >
              <span>Sign Up as Student</span>
              <ChevronRight size={15} />
            </Link>
          </div>

          {/* Card 2: Parent (Featured) */}
          <div className="group relative bg-emerald-950/50 hover:bg-emerald-950/70 border-2 border-amber-400/60 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 shadow-xl hover:shadow-amber-400/20 hover:-translate-y-1">
            <div className="absolute -top-3 right-4 bg-amber-400 text-emerald-950 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow-md">
              Most Popular
            </div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-400/20 border border-amber-400/50 text-amber-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users size={24} />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block mb-1">
                Family & Children
              </span>
              <h2 className="text-xl font-serif font-bold text-white mb-2">Parent / Guardian</h2>
              <p className="text-xs text-emerald-100/85 leading-relaxed mb-4">
                I am signing up to enroll my children, supervise teacher schedules, track attendance, and manage family tuition billing.
              </p>
              <ul className="space-y-1.5 text-[11px] text-emerald-200/80 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-amber-400 shrink-0" />
                  <span>Manage multiple children</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-amber-400 shrink-0" />
                  <span>Real-time lesson reports</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-amber-400 shrink-0" />
                  <span>Unified family billing invoices</span>
                </li>
              </ul>
            </div>
            <Link
              href="/register/parent"
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-bold text-xs rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-amber-400/30"
            >
              <span>Sign Up as Parent</span>
              <ChevronRight size={15} />
            </Link>
          </div>

          {/* Card 3: Teacher */}
          <div className="group relative bg-black/40 hover:bg-black/60 border border-white/15 hover:border-amber-400/60 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 shadow-lg hover:shadow-amber-400/10 hover:-translate-y-1">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-800/80 border border-emerald-500/40 text-amber-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Award size={24} />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300/90 block mb-1">
                Quran Instructor
              </span>
              <h2 className="text-xl font-serif font-bold text-white mb-2">Teacher / Tutor</h2>
              <p className="text-xs text-emerald-100/75 leading-relaxed mb-4">
                I am a qualified Hafiz or Islamic scholar applying to teach students 1-on-1 worldwide and manage my teaching schedule.
              </p>
              <ul className="space-y-1.5 text-[11px] text-emerald-200/70 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-amber-400 shrink-0" />
                  <span>Flexible international schedule</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-amber-400 shrink-0" />
                  <span>Direct monthly payouts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-amber-400 shrink-0" />
                  <span>Live audio/video teaching suite</span>
                </li>
              </ul>
            </div>
            <Link
              href="/register/teacher"
              className="w-full py-3 px-4 bg-white/10 hover:bg-amber-400 text-white hover:text-emerald-950 font-bold text-xs rounded-xl transition-all duration-200 flex items-center justify-center gap-2 border border-white/15 hover:border-amber-400 shadow-sm"
            >
              <span>Apply to Teach</span>
              <ChevronRight size={15} />
            </Link>
          </div>
        </div>

        {/* 1-Tap Google Sign-Up by Role */}
        <div className="bg-black/30 border border-white/10 rounded-2xl p-5 mb-6 text-center">
          <span className="text-xs font-semibold text-emerald-100/80 block mb-3">
            Or fast-track signup with Google:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <form action={loginWithGoogle}>
              <input type="hidden" name="role" value="student" />
              <button
                type="submit"
                className="w-full py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Google (as Student)</span>
              </button>
            </form>
            <form action={loginWithGoogle}>
              <input type="hidden" name="role" value="parent" />
              <button
                type="submit"
                className="w-full py-2.5 px-3 bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-emerald-950 border border-amber-400/40 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Google (as Parent)</span>
              </button>
            </form>
            <form action={loginWithGoogle}>
              <input type="hidden" name="role" value="teacher" />
              <button
                type="submit"
                className="w-full py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Google (as Teacher)</span>
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="border-t border-white/10 pt-6 text-center text-sm text-emerald-100/80">
          Already have an account?{' '}
          <Link href="/login" className="text-amber-300 hover:text-amber-200 font-bold underline underline-offset-4 ml-1 transition">
            Sign In to your portal
          </Link>
        </div>
      </div>
    </div>
  );
}
