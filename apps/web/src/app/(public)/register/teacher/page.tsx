import { BookOpen } from 'lucide-react'
import Link from 'next/link'
import { registerTeacher } from './actions'

export const instant = false

export default async function TeacherRegistrationPage(props: { searchParams: Promise<{ error?: string }> }) {
  const searchParams = await props.searchParams;
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4 py-12">
      <div className="max-w-3xl w-full glass-container rounded-3xl p-6 sm:p-10 border border-white/15 shadow-2xl text-white">
        <div className="flex justify-center mb-6">
          <div className="bg-emerald-800/80 border border-amber-400/40 p-3.5 rounded-2xl text-amber-300 shadow-md">
            <BookOpen size={32} />
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif text-white text-center mb-2">Teacher Self-Registration</h2>
        <p className="text-emerald-100/80 text-center text-sm mb-6">Review before confirming. Bank and ID values stay masked; the application is reviewed before submission.</p>

        {searchParams?.error && (
          <div className="bg-red-950/60 text-red-200 p-4 rounded-xl text-sm font-bold mb-6 border border-red-500/30">
            {searchParams.error}
          </div>
        )}

        <form action={registerTeacher} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <div>
              <label className="block text-sm font-semibold text-emerald-100 mb-2">Full name</label>
              <input 
                name="fullName" 
                required 
                className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-sm" 
                placeholder="Maryam Ahmed" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-100 mb-2">National ID / Passport</label>
              <input 
                name="idCard" 
                required 
                className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-sm" 
                placeholder="••••••••••••••" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-100 mb-2">Phone / Email</label>
              <input 
                name="email" 
                type="email" 
                required 
                className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-sm" 
                placeholder="teacher@example.com" 
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
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-emerald-100 mb-2">Complete address</label>
              <input 
                name="address" 
                required 
                className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-sm" 
                placeholder="OTP verified • address entered" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-100 mb-2">Gender / Age</label>
              <div className="flex gap-3">
                <select 
                  name="gender" 
                  className="w-1/2 px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-sm [&>option]:bg-[#052b20] [&>option]:text-white"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
                <input 
                  name="age" 
                  type="number" 
                  required 
                  className="w-1/2 px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-sm" 
                  placeholder="Age" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-100 mb-2">Quranic qualification</label>
              <input 
                name="qualification" 
                required 
                className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-sm" 
                placeholder="Qariah / Ijazah" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-100 mb-2">Maslak / Fiqh</label>
              <input 
                name="maslak" 
                required 
                className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-sm" 
                placeholder="Applicant selection" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-100 mb-2">Bank / account title / IBAN</label>
              <input 
                name="bank" 
                required 
                className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-sm" 
                placeholder="Bank selected • •••• 4821" 
              />
            </div>
          </div>
          
          <div className="pt-4">
            <button 
              type="submit" 
              className="w-full bg-amber-400 hover:bg-amber-300 text-emerald-950 py-3.5 sm:py-4 rounded-xl font-bold transition-all shadow-lg text-base cursor-pointer"
            >
              Continue application
            </button>
            <p className="text-center text-xs text-emerald-100/60 mt-4">
              Bank and ID values stay masked; the application can be reviewed before submission.
            </p>
          </div>
        </form>

        <div className="mt-8 text-center text-sm font-bold">
          <Link href="/login" className="text-emerald-100/70 hover:text-amber-300 transition">
            Already registered? Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
