import { BookOpen } from 'lucide-react'
import Link from 'next/link'
import { registerTeacher } from './actions'

export default function TeacherRegistrationPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] px-4 py-12">
      <div className="max-w-3xl w-full bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
        <div className="flex justify-center mb-6">
          <div className="bg-[#0C4A3A] p-3 rounded-2xl text-white">
            <BookOpen size={32} />
          </div>
        </div>
        <h2 className="text-3xl font-serif text-[#0C4A3A] text-center mb-2">Teacher self-registration</h2>
        <p className="text-gray-500 text-center text-sm mb-10">Review before confirming. Bank and ID values stay masked; the application is reviewed before submission.</p>

        <form action={registerTeacher} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Full name</label>
              <input name="fullName" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0C4A3A]" placeholder="Maryam Ahmed" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">National ID / Passport</label>
              <input name="idCard" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0C4A3A]" placeholder="••••••••••••••" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Phone / Email</label>
              <input name="email" type="email" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0C4A3A]" placeholder="teacher@example.com" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
              <input name="password" type="password" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0C4A3A]" placeholder="••••••••" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">Complete address</label>
              <input name="address" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0C4A3A]" placeholder="OTP verified • address entered" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Gender / Age</label>
              <div className="flex gap-2">
                <select name="gender" className="w-1/2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0C4A3A]">
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
                <input name="age" type="number" required className="w-1/2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0C4A3A]" placeholder="Age" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Quranic qualification</label>
              <input name="qualification" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0C4A3A]" placeholder="Qariah / Ijazah" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Maslak / Fiqh</label>
              <input name="maslak" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0C4A3A]" placeholder="Applicant selection" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Bank / account title / IBAN</label>
              <input name="bank" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0C4A3A]" placeholder="Bank selected • •••• 4821" />
            </div>
          </div>
          
          <div className="pt-6">
            <button type="submit" className="w-full bg-[#0C4A3A] text-white py-4 rounded-xl font-bold hover:bg-[#0D5C46] transition shadow-sm text-lg">
              Continue application
            </button>
            <p className="text-center text-xs text-gray-500 mt-4">Bank and ID values stay masked; the application can be reviewed before submission.</p>
          </div>
        </form>

        <div className="mt-8 text-center text-sm font-bold">
          <Link href="/login" className="text-gray-500 hover:text-[#0C4A3A] transition">Already registered? Sign in</Link>
        </div>
      </div>
    </div>
  )
}
