"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "ur";

export const translations = {
  en: {
    // Navigation
    brand: "Quran Learn Academy",
    home: "Home",
    aboutUs: "About Us",
    ourServices: "Our Services",
    programmes: "Programmes",
    howItWorks: "How it works",
    packages: "Packages",
    payments: "Payments",
    careers: "Careers",
    downloads: "Downloads",
    blog: "Blog",
    contact: "Contact",
    studentPortal: "Student Portal",
    teacherPortal: "Teacher Portal",
    teachWithUs: "Teach with us",
    login: "Log in",
    bookFreeTrial: "Book a free trial",
    menu: "Menu",
    close: "Close",

    // Top Bar & Contact Badges
    topBarUsa: "USA +1 330 597 5880",
    topBarUk: "UK +44 203 289 9880",
    topBarPk: "PK +92 333 222 2525",
    topBarEmail: "info@quranlearnacademy.com",

    // Footer
    footerDesc: "Quran Learn Academy is an independent entity managed by a small group of dedicated professionals.",
    headOffice: "Headoffice",
    headOfficeAddress: "H#202, Block J3, Wapda Town, Lahore-54770, Pakistan",
    quickLinks: "Quick Links",
    getInTouch: "Get In Touch",
    contactMoreInfo: "Contact Us For More Information",
    namePlaceholder: "Name",
    emailPlaceholder: "Email",
    phonePlaceholder: "Phone (with country code)",
    send: "Send",
    termsConditions: "Terms and Conditions",
    privacyPolicy: "Privacy Policy",
    refundPolicy: "Delivery & Refund Policy",
    copyright: "Copyright © 2026 Quran Learn Academy. All Rights Reserved | A Project by Teletek Solutions",

    // Home Hero
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
    classes: "Classes",
    quranDuas: "Quran & Duas",
    progress: "Progress",
    billing: "Billing",
    profile: "Profile",
    support: "Support",
    signOut: "Sign Out",
    tajweedCourse: "Tajweed & Fluent Recitation",
    trust1Title: "Qualified teachers",
    trust1Desc: "Qari / Qariah • placement-led",
    trust2Title: "A clear learning path",
    trust2Desc: "Qaida → Tajweed → Hifz",
    trust3Title: "Progress you can see",
    trust3Desc: "Lesson notes and parent reports",

    // How It Works
    howItWorksBadge: "Simple 3-Step Journey",
    howItWorksTitle: "How it works",
    howItWorksDesc: "Our platform connects you with certified teachers for a synchronized, interactive learning experience.",
    step1Title: "Book a Free Trial",
    step1Desc: "Select your timezone, program, and meet your teacher for an initial assessment and walkthrough of the portal.",
    step1Badge: "Zero commitment trial",
    step2Title: "Choose a Package",
    step2Desc: "After your trial, choose from one of our flexible pricing plans that fits your schedule and learning goals.",
    step2Badge: "Monthly flexible billing",
    step3Title: "Start in Classroom",
    step3Desc: "Join your scheduled classes via our state-of-the-art interactive classroom with real-time word highlighting.",
    step3Badge: "Synced digital Mushaf",
    beginTrialCta: "Begin Your Free Trial",

    // Programmes
    progTitle: "Our Learning Programmes",
    progDesc: "From absolute beginner to advanced recitation and memorisation, we have a structured path tailored for you.",
    level1Badge: "Level 1",
    level1Title: "Noorani Qaida",
    level1Desc: "Master the Arabic alphabet and basic pronunciation rules. The foundational step for absolute beginners.",
    level1F1: "Arabic Alphabet",
    level1F2: "Vowels & Harakat",
    level1F3: "Connecting Letters",
    level2Badge: "Level 2",
    level2Popular: "Popular",
    level2Title: "Fluent Recitation",
    level2Desc: "Transition from Qaida to reading the Quran with proper Tajweed and a steady, beautiful pace.",
    level2F1: "Makharij (Articulation)",
    level2F2: "Rules of Noon & Meem",
    level2F3: "Madd (Elongation)",
    level3Badge: "Level 3",
    level3Title: "Hifz (Memorisation)",
    level3Desc: "A rigorous, proven system to commit the Quran to memory with regular revision (Muraja'ah).",
    level3F1: "Sabaq (New Lesson)",
    level3F2: "Sabaqi (Recent Revision)",
    level3F3: "Manzil (Old Revision)",

    // Packages
    pkgTitle: "Pricing Packages",
    pkgDesc: "Simple, transparent pricing. Choose a plan that fits your schedule.",
    threeDaysWeek: "3 days/week",
    fiveDaysWeek: "5 days/week",
    planBasicTitle: "30-Minute Classes",
    planBasicDesc: "Perfect for young children and beginners.",
    planProTitle: "60-Minute Classes",
    planProDesc: "Ideal for Hifz students and deep Tajweed study.",
    perMonth: "/ month",
    selectPlan: "Select Plan",
    mostPopular: "Most Popular",
    featTeacher: "Dedicated 1-on-1 Teacher",
    featVoice: "Live Voice Classroom",
    featReport: "Advanced progress reports",

    // Teach With Us
    teachTitle: "Join our faculty of qualified teachers.",
    teachDesc: "We are looking for dedicated, qualified Qaris and Qariahs who are passionate about teaching the Book of Allah to students worldwide. Enjoy flexible hours and competitive compensation.",
    teachStep1Title: "Apply Online",
    teachStep1Desc: "Submit your details, qualifications, and Ijazah (if applicable).",
    teachStep2Title: "Recitation Test",
    teachStep2Desc: "A short live interview to evaluate your Tajweed and Makharij.",
    teachStep3Title: "Start Teaching",
    teachStep3Desc: "Complete onboarding and start accepting students.",
    appFormTitle: "Teacher Application",
    fullNameLabel: "Full Name",
    fullNamePlaceholder: "Enter your full name",
    emailLabel: "Email Address",
    expLabel: "Years of Experience",
    expLess1: "Less than 1 year",
    exp1to3: "1-3 years",
    exp3to5: "3-5 years",
    exp5plus: "5+ years",
    submitApp: "Submit Application",

    // Free Trial
    trialTitle: "Book your free trial class.",
    trialDesc: "Experience our interactive classroom and meet your teacher. No credit card required.",
    whatToExpect: "What to expect:",
    trialPoint1: "30-minute one-on-one session",
    trialPoint2: "Initial level assessment",
    trialPoint3: "Walkthrough of the learning portal",
  },
  ur: {
    // Navigation
    brand: "قرآن اکیڈمی",
    home: "ہوم",
    aboutUs: "ہمارے بارے میں",
    ourServices: "ہماری خدمات",
    programmes: "پروگرامز",
    howItWorks: "طریقہ کار",
    packages: "پیکجز",
    payments: "فیس و ادائیگی",
    careers: "ملازمتیں",
    downloads: "ڈاؤن لوڈز",
    blog: "بلاگ",
    contact: "رابطہ کریں",
    studentPortal: "طلباء پورٹل",
    teacherPortal: "اساتذہ پورٹل",
    teachWithUs: "ہمارے ساتھ پڑھائیں",
    login: "لاگ ان",
    bookFreeTrial: "مفت ٹرائل لیں",
    menu: "مینو",
    close: "بند کریں",

    // Top Bar & Contact Badges
    topBarUsa: "امریکہ +1 330 597 5880",
    topBarUk: "برطانیہ +44 203 289 9880",
    topBarPk: "پاکستان +92 333 222 2525",
    topBarEmail: "info@quranlearnacademy.com",

    // Footer
    footerDesc: "قرآن لرن اکیڈمی ایک آزاد ادارہ ہے جسے باصلاحیت اور مخلص پیشہ ور افراد چلاتے ہیں۔",
    headOffice: "مرکزی دفتر",
    headOfficeAddress: "مکان ۲۰۲، بلاک جے ۳، واپڈا ٹاؤن، لاہور-54770، پاکستان",
    quickLinks: "فوری لنکس",
    getInTouch: "رابطہ کی معلومات",
    contactMoreInfo: "مزید معلومات کے لیے ہم سے رابطہ کریں",
    namePlaceholder: "نام",
    emailPlaceholder: "ای میل",
    phonePlaceholder: "فون نمبر (ملکی کوڈ کے ساتھ)",
    send: "ارسال کریں",
    termsConditions: "شرائط و ضوابط",
    privacyPolicy: "پرائیویسی پالیسی",
    refundPolicy: "ڈلیوری و ریفنڈ پالیسی",
    copyright: "جملہ حقوق بحق قرآن لرن اکیڈمی ۲۰۲۶ محفوظ ہیں | پراجیکٹ برائے ٹیلی ٹیک سلوشنز",

    // Home Hero
    heroSubtitle: "انفرادی رہنمائی۔ ہر سبق۔",
    heroTitle: "قرآن مجید سے زندگی بھر کا تعلق۔",
    heroDesc: "مستند اساتذہ، ڈیجیٹل لائیو کلاس روم اور آپ کے لیے مخصوص تعلیمی منصوبے کے ساتھ سیکھیں۔",
    beginFreeTrial: "مفت ٹرائل سے آغاز کریں",
    exploreProgrammes: "پروگرامز دیکھیں",
    nextClass: "آپ کی اگلی کلاس",
    today: "آج",
    teacherReady: "آپ کے استاد تیار ہیں",
    voiceFollow: "وائس فالو کلاس روم",
    enterClassroom: "لائیو کلاس روم ڈیمو دیکھیں ←",
    classes: "کلاسز",
    quranDuas: "قرآن و دعائیں",
    progress: "پیش رفت",
    billing: "فیس و بلنگ",
    profile: "پروفائل",
    support: "مدد",
    signOut: "سائن آؤٹ",
    tajweedCourse: "تجوید اور روانی سے تلاوت",
    trust1Title: "مستند اساتذہ",
    trust1Desc: "مستند قاری و قاریہ • باقاعدہ جانچ",
    trust2Title: "واضح تعلیمی راستہ",
    trust2Desc: "قاعدہ ← تجوید ← حفظ",
    trust3Title: "نمایاں پیش رفت",
    trust3Desc: "اسباق کے نوٹس اور ماہانہ رپورٹ",

    // How It Works
    howItWorksBadge: "آسان ۳ مرحلہ وار طریقہ",
    howItWorksTitle: "سیکھنے کا طریقہ کار",
    howItWorksDesc: "ہمارا پلیٹ فارم آپ کو مستند اساتذہ سے جوڑتا ہے تاکہ آپ براہِ راست اور انٹرایکٹو انداز میں سیکھ سکیں۔",
    step1Title: "مفت ٹرائل بک کریں",
    step1Desc: "اپنا ٹائم زون اور پروگرام منتخب کریں اور ابتدائی جائزے اور پورٹل کے تعارف کے لیے استاد سے ملیں۔",
    step1Badge: "بغیر کسی پیشگی فیس کے ٹرائل",
    step2Title: "پیکج کا انتخاب کریں",
    step2Desc: "اپنے ٹرائل کے بعد، اپنے شیڈول اور تعلیمی اہداف کے مطابق ہمارے آسان پیکجز میں سے انتخاب کریں۔",
    step2Badge: "ماہانہ آسان ادائیگی",
    step3Title: "کلاس روم میں آغاز کریں",
    step3Desc: "ہمارے جدید انٹرایکٹو کلاس روم کے ذریعے کلاسز میں شامل ہوں جہاں تلاوت کے ساتھ الفاظ خودکار نمایاں ہوتے ہیں۔",
    step3Badge: "ہم آہنگ ڈیجیٹل مصحف",
    beginTrialCta: "مفت ٹرائل کا آغاز کریں",

    // Programmes
    progTitle: "ہمارے تعلیمی پروگرامز",
    progDesc: "ابتدائی حروف سے لے کر تجوید اور حفظ تک، ہمارے پاس آپ کے لیے منظم تعلیمی راستہ موجود ہے۔",
    level1Badge: "درجہ ۱",
    level1Title: "نورانی قاعدہ",
    level1Desc: "عربی حروف تہجی اور تلفظ کے بنیادی اصول سیکھیں۔ نئے طلباء کے لیے بنیادی سنگ میل۔",
    level1F1: "عربی حروف تہجی",
    level1F2: "حرکات و سکنات",
    level1F3: "مرکب حروف کا ملاپ",
    level2Badge: "درجہ ۲",
    level2Popular: "مقبول",
    level2Title: "روانی سے تلاوت",
    level2Desc: "قاعدے سے قرآن مجید کی درست تجوید اور خوبصورت لب و لہجے کے ساتھ روانی سے پڑھنے کی طرف پیش رفت۔",
    level2F1: "مخارج الحروف",
    level2F2: "نون و میم ساکن کے احکام",
    level2F3: "مد کے احکام و درجات",
    level3Badge: "درجہ ۳",
    level3Title: "حفظ قرآن مجید",
    level3Desc: "باقاعدہ دہرائی (مرجعہ) کے ساتھ کلام الٰہی کو سینے میں محفوظ کرنے کا موثر اور آزمودہ نظام۔",
    level3F1: "سبق (نیا سبق)",
    level3F2: "سبقی (حالیہ دہرائی)",
    level3F3: "منزل (پرانا دور)",

    // Packages
    pkgTitle: "تعلیمی پیکجز و فیس",
    pkgDesc: "شفاف اور آسان فیس۔ اپنے شیڈول کے مطابق پیکج کا انتخاب کریں۔",
    threeDaysWeek: "۳ دن فی ہفتہ",
    fiveDaysWeek: "۵ دن فی ہفتہ",
    planBasicTitle: "۳۰ منٹ کی کلاسز",
    planBasicDesc: "چھوٹے بچوں اور ابتدائی طلباء کے لیے موزوں۔",
    planProTitle: "۶۰ منٹ کی کلاسز",
    planProDesc: "حفظ اور تفصیلی تجوید کے طلباء کے لیے بہترین۔",
    perMonth: "/ ماہانہ",
    selectPlan: "پیکج منتخب کریں",
    mostPopular: "سب سے زیادہ مقبول",
    featTeacher: "مخصوص ذاتی استاد (۱ بر ۱)",
    featVoice: "لائیو وائس کلاس روم",
    featReport: "ماہانہ تعلیمی رپورٹ",

    // Teach With Us
    teachTitle: "ہمارے اساتذہ کی ٹیم میں شامل ہوں۔",
    teachDesc: "ہم دنیا بھر کے طلباء کو قرآن مجید سکھانے کے لیے باصلاحیت اور مستند قاری و قاریہ کی تلاش میں ہیں۔ لچکدار اوقات اور مناسب معاوضہ۔",
    teachStep1Title: "آن لائن درخواست دیں",
    teachStep1Desc: "اپنی معلومات، اسناد اور اجازت نامہ جمع کروائیں۔",
    teachStep2Title: "تلاوت و تجوید کا ٹیسٹ",
    teachStep2Desc: "آپ کے مخارج اور تجوید کی جانچ کے لیے مختصر انٹرویو۔",
    teachStep3Title: "تدریس کا آغاز کریں",
    teachStep3Desc: "تربیت مکمل کریں اور طلباء کو پڑھانا شروع کریں۔",
    appFormTitle: "درخواست برائے استاد",
    fullNameLabel: "پورا نام",
    fullNamePlaceholder: "اپنا پورا نام درج کریں",
    emailLabel: "ای میل ایڈریس",
    expLabel: "تدریسی تجربہ (سال)",
    expLess1: "۱ سال سے کم",
    exp1to3: "۱ سے ۳ سال",
    exp3to5: "۳ سے ۵ سال",
    exp5plus: "۵ سال سے زائد",
    submitApp: "درخواست جمع کروائیں",

    // Free Trial
    trialTitle: "اپنی مفت ٹرائل کلاس بک کریں۔",
    trialDesc: "ہمارے انٹرایکٹو کلاس روم کا تجربہ کریں اور اپنے استاد سے ملیں۔ کریڈٹ کارڈ کی ضرورت نہیں۔",
    whatToExpect: "ٹرائل کلاس میں کیا ہوگا:",
    trialPoint1: "۳۰ منٹ کی انفرادی کلاس",
    trialPoint2: "ابتدائی تعلیمی سطح کا جائزہ",
    trialPoint3: "پورٹل کے فیچرز کا عملی تعارف",
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
  dir: "ltr" | "rtl";
}

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
