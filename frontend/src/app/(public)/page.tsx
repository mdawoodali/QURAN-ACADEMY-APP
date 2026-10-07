"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Check } from "lucide-react";

export default function Home() {
  const [lang, setLang] = useState("EN");

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] text-[#111827]">
      {/* Navigation */}
      <header className="max-w-[1400px] mx-auto py-6 px-8 flex justify-between items-center bg-white rounded-2xl shadow-sm mt-4 border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="bg-[#0C4A3A] p-2 rounded-xl text-white">
            <BookOpen size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight text-[#0C4A3A]">Quran Academy</span>
        </div>
        <nav className="hidden md:flex space-x-8 text-[15px] font-medium text-gray-500">
          <a href="#programmes" className="hover:text-gray-900 transition">Programmes</a>
          <a href="#programmes" className="hover:text-gray-900 transition">How it works</a>
          <a href="#programmes" className="hover:text-gray-900 transition">Packages</a>
          <Link href="/teacher" className="hover:text-gray-900 transition">Teach with us</Link>
        </nav>
        <div className="flex items-center gap-6">
          <Link href="/trial" className="bg-[#0C4A3A] text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-[#0D5C46] transition">
            Book a free trial
          </Link>
          <button onClick={() => setLang(lang === "EN" ? "UR" : "EN")} className="text-sm font-medium text-gray-400 hover:text-gray-900 transition">
            <span className={lang === "EN" ? "text-gray-800" : ""}>EN</span> / <span className={lang === "UR" ? "text-gray-800" : ""}>UR</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-[1400px] mx-auto py-20 px-8 flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 space-y-8">
          <div className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold tracking-widest px-4 py-1.5 rounded-full uppercase">
            Personal guidance. Every lesson.
          </div>
          <h1 className="text-6xl md:text-7xl font-serif text-[#0C4A3A] leading-[1.1] tracking-tight">
            A lifelong connection<br />with the Quran.
          </h1>
          <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
            Learn with a qualified teacher, a shared Quran classroom and a plan that grows with you.
          </p>
          <div className="flex gap-4 pt-4">
            <Link href="/trial" className="bg-[#0C4A3A] text-white px-8 py-3.5 rounded-full font-bold text-lg hover:bg-[#0D5C46] transition shadow-md">
              Begin with a free trial
            </Link>
            <a href="#programmes" className="bg-emerald-50 text-emerald-800 px-8 py-3.5 rounded-full font-bold text-lg hover:bg-emerald-100 transition border border-emerald-100">
              Explore programmes
            </a>
          </div>
        </div>
        
        {/* Right side card */}
        <div className="flex-1 w-full bg-[#E6F3EE] p-8 rounded-[2rem]">
          <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition">
            <div className="inline-block bg-[#D1EBE1] text-[#0C4A3A] text-xs font-bold tracking-widest px-3 py-1 rounded-full uppercase mb-6">
              Your next class
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Tajweed & Fluent Recitation</h3>
            <div className="font-quran text-5xl text-right leading-[2] mb-12 text-[#111827]">
              ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ
            </div>
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <div className="w-10 h-10 bg-[#E6F3EE] text-[#0C4A3A] font-bold flex items-center justify-center rounded-full">
                T
              </div>
              <div>
                <div className="font-bold text-gray-900">Your teacher is ready</div>
                <div className="text-sm text-gray-500">Voice-follow classroom</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature blurbs */}
      <section className="max-w-[1400px] mx-auto px-8 pb-20 grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h4 className="font-bold text-gray-900 mb-1">Qualified teachers</h4>
          <p className="text-sm text-gray-500">Qari / Qariah • placement-led</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h4 className="font-bold text-gray-900 mb-1">A clear learning path</h4>
          <p className="text-sm text-gray-500">Qaida → Tajweed → Hifz</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h4 className="font-bold text-gray-900 mb-1">Progress you can see</h4>
          <p className="text-sm text-gray-500">Lesson notes and parent reports</p>
        </div>
      </section>

      {/* Three Programmes */}
      <section id="programmes" className="max-w-[1400px] mx-auto px-8 py-20 border-t border-gray-200">
        <h2 className="text-4xl font-serif text-[#0C4A3A] mb-12">Three programmes. One connected journey.</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              num: "01",
              title: "Quran Reading for Kids", 
              subtitle: "AGES 4-16 • BEGINNER",
              features: ["Noorani Qaida & letter recognition", "Sounds, joining and basic reading", "Patient, child-friendly tutors", "Qaida milestones every lesson"]
            },
            { 
              num: "02",
              title: "Tajweed & Recitation", 
              subtitle: "ALL AGES • INTERMEDIATE",
              features: ["Full Tajweed rules and application", "Makhaarij & Sifaat of letters", "Qualified, Ijazah-holding teachers", "Class audio recordings for review"]
            },
            { 
              num: "03",
              title: "Hifz & Memorisation", 
              subtitle: "AGES 6+ • ADVANCED",
              features: ["Daily Sabaq: new memorisation", "Sabqi and Manzil revision plan", "Flexible pace with a Hifz tutor", "Regular parent progress reports"]
            },
          ].map((prog) => (
            <div key={prog.num} className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col h-full hover:shadow-md transition">
              <div className="w-10 h-10 bg-amber-50 text-amber-700 font-bold flex items-center justify-center rounded-full mb-6">
                {prog.num}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{prog.title}</h3>
              <p className="text-xs font-bold text-gray-400 tracking-wider mb-8">{prog.subtitle}</p>
              
              <ul className="space-y-4 mb-12 flex-1">
                {prog.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="bg-emerald-100 p-1 rounded-full mt-0.5"><Check size={12} className="text-emerald-700" /></div>
                    <span className="text-gray-700 font-medium">{f}</span>
                  </li>
                ))}
              </ul>
              
              <Link href={`/trial?prog=${prog.num}`} className="w-full text-center bg-[#0C4A3A] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#0D5C46] transition">
                View programme
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
