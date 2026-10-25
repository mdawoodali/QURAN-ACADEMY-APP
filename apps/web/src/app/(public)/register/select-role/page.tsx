import { BookOpen, GraduationCap, Users, Award, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { confirmRole } from './actions'

export const instant = false;

export default function SelectRolePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4 py-12">
      <div className="max-w-xl w-full glass-container rounded-3xl p-6 sm:p-10 border border-white/15 shadow-2xl text-white">
        <div className="flex flex-col items-center justify-center mb-6 text-center">
          <div className="bg-emerald-800/90 border border-amber-400/40 p-3 rounded-2xl text-amber-300 shadow-md mb-3">
            <BookOpen size={32} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-white mb-2">Welcome to Quran Academy</h1>
          <p className="text-emerald-100/80 text-sm">
            Please tell us who you are so we can prepare the right dashboard and classroom for you:
          </p>
        </div>

        <form action={confirmRole} className="space-y-4">
          {/* Option 1: Student */}
          <button
            type="submit"
            name="role"
            value="student"
            className="w-full group text-left p-4 sm:p-5 bg-black/40 hover:bg-black/60 border border-white/15 hover:border-amber-400/60 rounded-2xl transition-all duration-200 flex items-center justify-between shadow-md cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-800/80 border border-emerald-500/40 text-amber-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <GraduationCap size={22} />
              </div>
              <div>
                <h3 className="font-serif font-bold text-white text-base">I am a Student / Learner</h3>
                <p className="text-xs text-emerald-100/70">
                  I want to attend Quran lessons, practice Tajweed, and track recitation.
                </p>
              </div>
            </div>
            <ChevronRight size={20} className="text-amber-400 shrink-0 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Option 2: Parent */}
          <button
            type="submit"
            name="role"
            value="parent"
            className="w-full group text-left p-4 sm:p-5 bg-emerald-950/50 hover:bg-emerald-950/70 border-2 border-amber-400/60 rounded-2xl transition-all duration-200 flex items-center justify-between shadow-lg cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-amber-400/20 border border-amber-400/50 text-amber-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Users size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-white text-base">I am a Parent / Guardian</h3>
                  <span className="text-[10px] bg-amber-400 text-emerald-950 font-extrabold uppercase px-2 py-0.5 rounded-full">
                    Recommended
                  </span>
                </div>
                <p className="text-xs text-emerald-100/85">
                  I am enrolling my children, supervising progress, and managing billing.
                </p>
              </div>
            </div>
            <ChevronRight size={20} className="text-amber-400 shrink-0 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Option 3: Teacher */}
          <button
            type="submit"
            name="role"
            value="teacher"
            className="w-full group text-left p-4 sm:p-5 bg-black/40 hover:bg-black/60 border border-white/15 hover:border-amber-400/60 rounded-2xl transition-all duration-200 flex items-center justify-between shadow-md cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-800/80 border border-emerald-500/40 text-amber-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Award size={22} />
              </div>
              <div>
                <h3 className="font-serif font-bold text-white text-base">I am a Teacher / Tutor</h3>
                <p className="text-xs text-emerald-100/70">
                  I am a qualified Quran tutor managing student classrooms and schedules.
                </p>
              </div>
            </div>
            <ChevronRight size={20} className="text-amber-400 shrink-0 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-emerald-100/60">
          You can always manage family members or request role modifications from settings.
        </div>
      </div>
    </div>
  );
}
