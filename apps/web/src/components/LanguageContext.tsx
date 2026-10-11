"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "ur";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
  dir: "ltr" | "rtl";
}

export const translations = {
  en: {
    brand: "Quran Academy",
    programmes: "Programmes",
    howItWorks: "How it works",
    packages: "Packages",
    studentPortal: "Student Portal",
    teacherPortal: "Teacher Portal",
    teachWithUs: "Teach with us",
    login: "Log in",
    bookFreeTrial: "Book a free trial",
    heroSubtitle: "Personal guidance. Every lesson.",
    heroTitle: "A lifelong connection with the Quran.",
    heroDesc: "Learn with a qualified teacher, a shared Quran classroom and a plan that grows with you.",
    beginFreeTrial: "Begin with a free trial",
    exploreProgrammes: "Explore programmes",
    nextClass: "Your next class",
    today: "Today",
    teacherReady: "Your teacher is ready",
    voiceFollow: "Voice-follow classroom",
    enterClassroom: "Enter Live Classroom Demo →",
    home: "Home",
    classes: "Classes",
    quranDuas: "Quran & Duas",
    progress: "Progress",
    billing: "Billing",
    profile: "Profile",
    support: "Support",
    signOut: "Sign Out",
    tajweedCourse: "Tajweed & Fluent Recitation"
  },
  ur: {
    brand: "قرآن اکیڈمی",
    programmes: "پروگرامز",
    howItWorks: "طریقہ کار",
    packages: "پیکجز",
    studentPortal: "طلباء پورٹل",
    teacherPortal: "اساتذہ پورٹل",
    teachWithUs: "ہمارے ساتھ پڑھائیں",
    login: "لاگ ان",
    bookFreeTrial: "مفت ٹرائل بک کریں",
    heroSubtitle: "ذاتی رہنمائی۔ ہر سبق۔",
    heroTitle: "قرآن مجید سے زندگی بھر کا تعلق۔",
    heroDesc: "مستند اساتذہ، لائیو کلاس روم اور آپ کے لیے مخصوص تعلیمی منصوبے کے ساتھ سیکھیں۔",
    beginFreeTrial: "مفت ٹرائل سے آغاز کریں",
    exploreProgrammes: "پروگرامز دیکھیں",
    nextClass: "آپ کی اگلی کلاس",
    today: "آج",
    teacherReady: "آپ کے استاد تیار ہیں",
    voiceFollow: "وائس فالو کلاس روم",
    enterClassroom: "لائیو کلاس روم ڈیمو میں داخل ہوں ←",
    home: "ہوم",
    classes: "کلاسز",
    quranDuas: "قرآن و دعائیں",
    progress: "پیش رفت",
    billing: "فیس و بلنگ",
    profile: "پروفائل",
    support: "مدد",
    signOut: "سائن آؤٹ",
    tajweedCourse: "تجوید اور روانی سے تلاوت"
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key) => translations.en[key] || (key as string),
  dir: "ltr",
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("qa_language") as Language;
    if (saved === "en" || saved === "ur") {
      setLanguageState(saved);
      document.documentElement.dir = saved === "ur" ? "rtl" : "ltr";
      document.documentElement.lang = saved;
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("qa_language", lang);
    document.documentElement.dir = lang === "ur" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  };

  const t = (key: keyof typeof translations.en): string => {
    return translations[language][key] || translations.en[key] || (key as string);
  };

  const dir = language === "ur" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      <div dir={dir} className={language === "ur" ? "font-urdu" : "font-sans"}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
