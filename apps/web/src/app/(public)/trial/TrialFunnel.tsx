'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { submitTrialRegistration } from './actions'
import { useLanguage } from '@/components/LanguageContext'

export default function TrialFunnel() {
  const router = useRouter()
  const { language } = useLanguage()
  const isUrdu = language === 'ur'

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    fatherName: '',
    age: '',
    timezone: 'UTC',
    program: 'Noorani Qaida',
    email: '',
    mobile: '',
    password: '',
    country: '',
    city: '',
    address: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const updateForm = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const nextStep = () => setStep(s => Math.min(s + 1, 4))
  const prevStep = () => setStep(s => Math.max(s - 1, 1))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 4) {
      nextStep()
      return
    }

    setLoading(true)
    setError('')
    const result = await submitTrialRegistration(formData)
    
    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push('/student')
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto glass-container rounded-3xl p-5 sm:p-8 border border-white/15 shadow-2xl">
      {/* Wizard Step Indicator */}
      <div className="flex justify-between items-center mb-8 px-2">
        {[1, 2, 3, 4].map(s => (
          <div key={s} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all ${step >= s ? 'bg-amber-400 text-emerald-950 font-serif' : 'bg-black/35 text-emerald-100/40 border border-white/10'}`}>
              {s}
            </div>
            {s < 4 && <div className={`w-8 sm:w-16 md:w-24 h-1 transition-all ${step > s ? 'bg-amber-400' : 'bg-white/15'}`} />}
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-950/60 text-red-200 p-4 rounded-xl text-sm font-bold mb-6 border border-red-500/30">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-white mb-6">
              {isUrdu ? "طالب علم کی معلومات" : "Student Information"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-emerald-100 mb-1">
                  {isUrdu ? "پہلا نام" : "First Name"}
                </label>
                <input required value={formData.firstName} onChange={e => updateForm('firstName', e.target.value)} className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder:text-emerald-200/40 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none text-sm transition" placeholder={isUrdu ? "پہلا نام" : "First name"} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-emerald-100 mb-1">
                  {isUrdu ? "آخری نام" : "Last Name"}
                </label>
                <input required value={formData.lastName} onChange={e => updateForm('lastName', e.target.value)} className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder:text-emerald-200/40 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none text-sm transition" placeholder={isUrdu ? "آخری نام" : "Last name"} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-100 mb-1">
                {isUrdu ? "والد کا نام" : "Father's Name"}
              </label>
              <input required value={formData.fatherName} onChange={e => updateForm('fatherName', e.target.value)} className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder:text-emerald-200/40 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none text-sm transition" placeholder={isUrdu ? "والد کا پورا نام" : "Father's full name"} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-100 mb-1">
                {isUrdu ? "عمر (سال)" : "Age"}
              </label>
              <input required type="number" min="4" max="99" value={formData.age} onChange={e => updateForm('age', e.target.value)} className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder:text-emerald-200/40 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none text-sm transition" placeholder={isUrdu ? "طالب علم کی عمر" : "Student age"} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-white mb-6">
              {isUrdu ? "پروگرام اور ٹائم زون" : "Program & Timing"}
            </h2>
            <div>
              <label className="block text-sm font-semibold text-emerald-100 mb-1">
                {isUrdu ? "پروگرام منتخب کریں" : "Select Program"}
              </label>
              <select required value={formData.program} onChange={e => updateForm('program', e.target.value)} className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none text-sm transition [&>option]:bg-[#052b20] [&>option]:text-white">
                <option value="Noorani Qaida">{isUrdu ? "نورانی قاعدہ" : "Noorani Qaida"}</option>
                <option value="Tajweed & Fluent Recitation">{isUrdu ? "تجوید اور روانی سے تلاوت" : "Tajweed & Fluent Recitation"}</option>
                <option value="Hifz — Quran Memorisation">{isUrdu ? "حفظ قرآن مجید" : "Hifz — Quran Memorisation"}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-100 mb-1">
                {isUrdu ? "آپ کا ٹائم زون" : "Your Time Zone"}
              </label>
              <select required value={formData.timezone} onChange={e => updateForm('timezone', e.target.value)} className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none text-sm transition [&>option]:bg-[#052b20] [&>option]:text-white">
                <option value="UTC">UTC / GMT</option>
                <option value="America/New_York">Eastern Time (US & Canada)</option>
                <option value="America/Chicago">Central Time (US & Canada)</option>
                <option value="America/Denver">Mountain Time (US & Canada)</option>
                <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                <option value="Europe/London">London</option>
                <option value="Asia/Dubai">Dubai</option>
                <option value="Asia/Karachi">Karachi (پاکستان)</option>
                <option value="Australia/Sydney">Sydney</option>
              </select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-white mb-6">
              {isUrdu ? "رہائشی تفصیلات" : "Location Details"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-emerald-100 mb-1">
                  {isUrdu ? "ملک" : "Country"}
                </label>
                <input required value={formData.country} onChange={e => updateForm('country', e.target.value)} className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder:text-emerald-200/40 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none text-sm transition" placeholder={isUrdu ? "ملک" : "Country"} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-emerald-100 mb-1">
                  {isUrdu ? "شہر" : "City"}
                </label>
                <input required value={formData.city} onChange={e => updateForm('city', e.target.value)} className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder:text-emerald-200/40 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none text-sm transition" placeholder={isUrdu ? "شہر" : "City"} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-100 mb-1">
                {isUrdu ? "مکمل پتہ" : "Address"}
              </label>
              <input required value={formData.address} onChange={e => updateForm('address', e.target.value)} className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder:text-emerald-200/40 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none text-sm transition" placeholder={isUrdu ? "رہائشی پتہ" : "Residential address"} />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-white mb-6">
              {isUrdu ? "اکاؤنٹ رجسٹریشن" : "Account Registration"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-emerald-100 mb-1">
                  {isUrdu ? "ای میل ایڈریس" : "Email Address"}
                </label>
                <input required type="email" value={formData.email} onChange={e => updateForm('email', e.target.value)} className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder:text-emerald-200/40 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none text-sm transition" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-emerald-100 mb-1">
                  {isUrdu ? "موبائل فون نمبر" : "Mobile Number"}
                </label>
                <input required type="tel" value={formData.mobile} onChange={e => updateForm('mobile', e.target.value)} className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder:text-emerald-200/40 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none text-sm transition" placeholder="+1 234 567 8900" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-100 mb-1">
                {isUrdu ? "پاس ورڈ بنائیں" : "Create Password"}
              </label>
              <input required type="password" minLength={6} value={formData.password} onChange={e => updateForm('password', e.target.value)} className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder:text-emerald-200/40 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none text-sm transition" placeholder={isUrdu ? "کم از کم ۶ ہندسے" : "Choose a password"} />
            </div>
            <div className="bg-emerald-950/60 border border-white/10 p-4 rounded-xl">
              <p className="text-xs sm:text-sm text-emerald-100/90 font-medium">
                {isUrdu ? "رجسٹریشن مکمل کرنے پر آپ کی مفت ٹرائل کلاس بک ہو جائے گی اور خاندانی اکاؤنٹ بن جائے گا۔" : "By completing registration, you will book your free trial and create your family account."}
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-4 pt-4">
          {step > 1 && (
            <button type="button" onClick={prevStep} className="px-5 sm:px-6 py-3.5 rounded-xl font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition cursor-pointer text-sm">
              {isUrdu ? "پیچھے" : "Back"}
            </button>
          )}
          <button type="submit" disabled={loading} className="flex-1 bg-amber-400 text-emerald-950 py-3.5 rounded-xl font-bold hover:bg-amber-300 transition shadow-lg cursor-pointer text-sm sm:text-base">
            {loading ? (isUrdu ? 'پروسیسنگ...' : 'Processing...') : (step === 4 ? (isUrdu ? 'ٹرائل بک کریں اور اکاؤنٹ بنائیں' : 'Book Trial & Register') : (isUrdu ? 'آگے بڑھیں' : 'Continue'))}
          </button>
        </div>
      </form>
    </div>
  )
}
