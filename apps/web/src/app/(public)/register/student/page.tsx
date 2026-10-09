import { BookOpen } from 'lucide-react'
import Link from 'next/link'
import { registerStudent } from './actions'

export const instant = false

export default async function StudentRegistrationPage(props: { searchParams: Promise<{ error?: string }> }) {
  const searchParams = await props.searchParams;
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] px-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
        <div className="flex justify-center mb-6">
          <div className="bg-[#0C4A3A] p-3 rounded-2xl text-white">
            <BookOpen size={32} />
          </div>
        </div>
        <h2 className="text-3xl font-serif text-[#0C4A3A] text-center mb-2">Student Registration</h2>
        <p className="text-gray-500 text-center text-sm mb-6">Capture the required student details to create your family account.</p>

        {searchParams?.error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold mb-6 border border-red-100">
            {searchParams.error}
          </div>
        )}

        <form action={registerStudent} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">First / Last name</label>
              <input name="fullName" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0C4A3A]" placeholder="Yusuf Khan" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Father's name</label>
              <input name="fatherName" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0C4A3A]" placeholder="Ahmed Khan" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Age</label>
              <input name="age" type="number" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0C4A3A]" placeholder="9" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Country / City</label>
              <input name="location" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0C4A3A]" placeholder="Pakistan, Karachi" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">Postal code / Address</label>
              <input name="address" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0C4A3A]" placeholder="75000 • Example address" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email or mobile</label>
              <input name="email" type="email" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0C4A3A]" placeholder="parent@example.com" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
              <input name="password" type="password" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0C4A3A]" placeholder="••••••••" />
            </div>
          </div>
          
          <div className="pt-6">
            <button type="submit" className="w-full bg-[#0C4A3A] text-white py-4 rounded-xl font-bold hover:bg-[#0D5C46] transition shadow-sm text-lg">
              Verify & continue
            </button>
            <p className="text-center text-xs text-gray-500 mt-4">Sign in by email/mobile + password • Reset by email/OTP • Google/Apple sign-in: optional</p>
          </div>
        </form>

        <div className="mt-8 text-center text-sm font-bold">
          <Link href="/login" className="text-gray-500 hover:text-[#0C4A3A] transition">Already have an account? Sign in</Link>
        </div>
      </div>
    </div>
  )
}
