'use client'

import { useState } from 'react'
import { submitTrialRegistration } from './actions'

export default function TrialFunnel() {
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
      // Redirect handled by action or handle it here
      window.location.href = '/student'
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-[var(--color-line)] shadow-xl">
      <div className="flex justify-between items-center mb-8">
        {[1, 2, 3, 4].map(s => (
          <div key={s} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= s ? 'bg-[var(--color-green-600)] text-white' : 'bg-gray-100 text-gray-400'}`}>
              {s}
            </div>
            {s < 4 && <div className={`w-12 md:w-24 h-1 ${step > s ? 'bg-[var(--color-green-600)]' : 'bg-gray-100'}`} />}
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold mb-6 border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-2xl font-bold text-[var(--color-ink)] mb-6">Student Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">First Name</label>
                <input required value={formData.firstName} onChange={e => updateForm('firstName', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[var(--color-green-600)] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Last Name</label>
                <input required value={formData.lastName} onChange={e => updateForm('lastName', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[var(--color-green-600)] outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Father's Name</label>
              <input required value={formData.fatherName} onChange={e => updateForm('fatherName', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[var(--color-green-600)] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Age</label>
              <input required type="number" min="4" max="99" value={formData.age} onChange={e => updateForm('age', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[var(--color-green-600)] outline-none" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-2xl font-bold text-[var(--color-ink)] mb-6">Program & Timing</h2>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Select Program</label>
              <select required value={formData.program} onChange={e => updateForm('program', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[var(--color-green-600)] outline-none">
                <option>Noorani Qaida</option>
                <option>Tajweed & Fluent Recitation</option>
                <option>Hifz — Quran Memorisation</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Your Time Zone</label>
              <select required value={formData.timezone} onChange={e => updateForm('timezone', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[var(--color-green-600)] outline-none">
                <option value="UTC">UTC / GMT</option>
                <option value="America/New_York">Eastern Time (US & Canada)</option>
                <option value="America/Chicago">Central Time (US & Canada)</option>
                <option value="America/Denver">Mountain Time (US & Canada)</option>
                <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                <option value="Europe/London">London</option>
                <option value="Asia/Dubai">Dubai</option>
                <option value="Asia/Karachi">Karachi</option>
                <option value="Australia/Sydney">Sydney</option>
              </select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-2xl font-bold text-[var(--color-ink)] mb-6">Location Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Country</label>
                <input required value={formData.country} onChange={e => updateForm('country', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[var(--color-green-600)] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">City</label>
                <input required value={formData.city} onChange={e => updateForm('city', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[var(--color-green-600)] outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Address</label>
              <input required value={formData.address} onChange={e => updateForm('address', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[var(--color-green-600)] outline-none" />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-2xl font-bold text-[var(--color-ink)] mb-6">Account Registration</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                <input required type="email" value={formData.email} onChange={e => updateForm('email', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[var(--color-green-600)] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Mobile Number</label>
                <input required type="tel" value={formData.mobile} onChange={e => updateForm('mobile', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[var(--color-green-600)] outline-none" placeholder="+1 234 567 8900" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Create Password</label>
              <input required type="password" minLength={6} value={formData.password} onChange={e => updateForm('password', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[var(--color-green-600)] outline-none" />
            </div>
            <div className="bg-[var(--color-mint-100)] p-4 rounded-xl">
              <p className="text-sm text-[var(--color-ink)] font-medium">By completing registration, you will book your free trial and create your family account.</p>
            </div>
          </div>
        )}

        <div className="flex gap-4 pt-6">
          {step > 1 && (
            <button type="button" onClick={prevStep} className="px-6 py-4 rounded-xl font-bold text-[var(--color-ink)] bg-gray-100 hover:bg-gray-200 transition">
              Back
            </button>
          )}
          <button type="submit" disabled={loading} className="flex-1 bg-[var(--color-green-600)] text-white py-4 rounded-xl font-bold hover:bg-[var(--color-green-900)] transition shadow-sm">
            {loading ? 'Processing...' : (step === 4 ? 'Book Trial & Register' : 'Continue')}
          </button>
        </div>
      </form>
    </div>
  )
}
