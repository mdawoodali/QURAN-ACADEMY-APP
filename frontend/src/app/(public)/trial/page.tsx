"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ArrowRight, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

function TrialFormContent() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    level: "Beginner (Noorani Qaida)",
    goal: ""
  });

  const nextStep = () => {
    if (step === 1 && !formData.name) {
      toast.error("Please enter your name");
      return;
    }
    setStep(step + 1);
  };
  
  const prevStep = () => setStep(step - 1);

  const handleSubmit = () => {
    toast.success("Trial booked! Redirecting to dashboard...", { duration: 3000 });
    setTimeout(() => {
      router.push('/student');
    }, 1500);
  };

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] text-[#111827] flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100 relative overflow-hidden">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100">
          <div 
            className="h-full bg-[#0C4A3A] transition-all duration-500 ease-in-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Header */}
        <div className="mb-10 mt-4 text-center">
          <div className="inline-block bg-[#D1EBE1] text-[#0C4A3A] text-xs font-bold tracking-widest px-3 py-1 rounded-full uppercase mb-4">
            Step {step} of 3
          </div>
          <h1 className="text-3xl font-serif text-[#0C4A3A]">
            {step === 1 && "Who is learning?"}
            {step === 2 && "Where are you starting?"}
            {step === 3 && "Set your goals"}
          </h1>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Student&apos;s Name</label>
              <input 
                type="text" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0C4A3A] focus:bg-white transition"
                placeholder="e.g. Yusuf Ali"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Age</label>
              <select 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0C4A3A] focus:bg-white transition"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
              >
                <option value="">Select age range</option>
                <option value="4-7">4 - 7 years</option>
                <option value="8-12">8 - 12 years</option>
                <option value="13-17">13 - 17 years</option>
                <option value="18+">Adult (18+)</option>
              </select>
            </div>
            <button onClick={nextStep} className="w-full bg-[#0C4A3A] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#0D5C46] transition mt-8 shadow-sm">
              Continue <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* Step 2: Level Selection */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-300">
            {[
              { id: 'beg', title: 'Beginner (Noorani Qaida)', desc: 'Learning the alphabet and sounds' },
              { id: 'int', title: 'Intermediate (Tajweed)', desc: 'Can read, but needs rule correction' },
              { id: 'adv', title: 'Advanced (Hifz)', desc: 'Memorisation and fluent recitation' }
            ].map((level) => (
              <div 
                key={level.id}
                onClick={() => setFormData({...formData, level: level.title})}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition ${formData.level === level.title ? 'border-[#0C4A3A] bg-emerald-50' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900">{level.title}</h3>
                    <p className="text-sm text-gray-500">{level.desc}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.level === level.title ? 'border-[#0C4A3A] bg-[#0C4A3A]' : 'border-gray-300'}`}>
                    {formData.level === level.title && <Check size={14} className="text-white" />}
                  </div>
                </div>
              </div>
            ))}
            
            <div className="flex gap-4 mt-8 pt-4">
              <button onClick={prevStep} className="px-6 py-4 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition">
                <ArrowLeft size={18} />
              </button>
              <button onClick={nextStep} className="flex-1 bg-[#0C4A3A] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#0D5C46] transition shadow-sm">
                Continue <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Goals */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">What is your primary goal?</label>
              <textarea 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-[#0C4A3A] focus:bg-white transition"
                placeholder="E.g. I want to memorise Surah Yaseen, or I want to improve my Tajweed pronunciation..."
                value={formData.goal}
                onChange={(e) => setFormData({...formData, goal: e.target.value})}
              />
            </div>
            
            <div className="bg-[#E6F3EE] p-6 rounded-2xl">
              <h4 className="font-bold text-[#0C4A3A] mb-2 flex items-center gap-2">
                <Check size={16} /> Summary
              </h4>
              <p className="text-sm text-emerald-800">
                You are setting up a <strong>{formData.level}</strong> trial for <strong>{formData.name || 'a student'}</strong>. Our placement team will match you with the perfect teacher.
              </p>
            </div>

            <div className="flex gap-4 mt-8">
              <button onClick={prevStep} className="px-6 py-4 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition">
                <ArrowLeft size={18} />
              </button>
              <button onClick={handleSubmit} className="flex-1 bg-[#0C4A3A] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#0D5C46] transition shadow-sm">
                Save & Enter Portal
              </button>
            </div>
          </div>
        )}
        
      </div>
      
      <div className="mt-8">
        <Link href="/" className="text-sm font-bold text-gray-400 hover:text-gray-900 transition">
          Return to home
        </Link>
      </div>
    </div>
  );
}

export default function TrialFlow() {
  return (
    <Suspense fallback={<div className="p-8">Loading form...</div>}>
      <TrialFormContent />
    </Suspense>
  );
}
