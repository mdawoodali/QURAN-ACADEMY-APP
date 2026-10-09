"use client";
import { useState } from "react";
import { Compass, Clock, Activity } from "lucide-react";

export default function CompanionApp() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F8F9FA] p-8">
      <header className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-serif text-[#0C4A3A]">Daily Companion</h1>
        <p className="text-gray-500 mt-2">Prayer timings, Qibla, and Tasbeeh</p>
      </header>

      <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
        {/* Tasbeeh */}
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6">
            <Activity size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-6">Tasbeeh</h2>
          <div className="text-6xl font-bold text-[#0C4A3A] mb-8 font-mono">{count}</div>
          <button 
            onClick={() => setCount(c => c + 1)}
            className="w-32 h-32 rounded-full bg-[#0C4A3A] text-white shadow-xl shadow-emerald-900/20 active:scale-95 active:shadow-sm transition-all"
          ></button>
          <button 
            onClick={() => setCount(0)}
            className="mt-6 text-sm text-gray-500 hover:text-gray-900"
          >
            Reset Counter
          </button>
        </div>

        {/* Prayer Timings */}
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <Clock size={24} />
            </div>
            <h2 className="text-xl font-bold">Prayer Timings</h2>
          </div>
          <div className="space-y-4">
            {[
              { name: "Fajr", time: "05:12 AM" },
              { name: "Dhuhr", time: "12:45 PM" },
              { name: "Asr", time: "04:15 PM" },
              { name: "Maghrib", time: "06:30 PM", active: true },
              { name: "Isha", time: "08:00 PM" },
            ].map(prayer => (
              <div key={prayer.name} className={`flex justify-between items-center p-3 rounded-lg ${prayer.active ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-50 text-gray-700'}`}>
                <span className="font-medium">{prayer.name}</span>
                <span className="font-mono">{prayer.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Qibla Compass */}
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm text-center flex flex-col items-center">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
            <Compass size={24} />
          </div>
          <h2 className="text-xl font-bold mb-8">Qibla Direction</h2>
          <div className="relative w-48 h-48 rounded-full border-8 border-gray-100 flex items-center justify-center mb-6">
            <div className="absolute top-2 text-red-500 font-bold">N</div>
            <Compass size={64} className="text-[#0C4A3A] transform rotate-45" strokeWidth={1} />
          </div>
          <p className="text-sm text-gray-500">258° West from your location</p>
        </div>
      </div>
    </div>
  );
}
