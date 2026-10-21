export type CountryCode = "UK" | "USA" | "AUS" | "PK";

export interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  isPopular?: boolean;
  schedule: string;
  classesPerMonth: number;
  durationPerClass: string;
  description: string;
  features: string[];
  prices: Record<CountryCode, { currency: string; symbol: string; amount: number; formatted: string }>;
}

export const ACADEMY_PACKAGES: PricingPlan[] = [
  {
    id: "package-1-two-days",
    name: "Package 1",
    badge: "2 Days / Week",
    isPopular: false,
    schedule: "2 Days / Week",
    classesPerMonth: 8,
    durationPerClass: "30 Min / Day",
    description: "Great starting plan for young beginners balancing academic school routines with steady Quran progress.",
    features: [
      "8 Live 1-on-1 Classes / Month",
      "30 Minutes Dedicated Class Time",
      "Quran Reading & Tajweed Rules",
      "Namaz / Salah Learning & Postures",
      "Daily Masnoon Duas & 6 Kalmas",
      "Continuous Tutor Feedback"
    ],
    prices: {
      UK: { currency: "GBP", symbol: "£", amount: 25, formatted: "£25" },
      USA: { currency: "USD", symbol: "$", amount: 40, formatted: "$40" },
      AUS: { currency: "AUD", symbol: "$", amount: 55, formatted: "$55" },
      PK: { currency: "PKR", symbol: "PKR ", amount: 6000, formatted: "PKR 6,000" }
    }
  },
  {
    id: "package-2-three-days",
    name: "Package 2",
    badge: "3 Days / Week",
    isPopular: false,
    schedule: "3 Days / Week",
    classesPerMonth: 12,
    durationPerClass: "30 Min / Day",
    description: "Our most balanced schedule. Perfect for steady progression in Qaida, fluent recitation, and Islamic fundamentals.",
    features: [
      "12 Live 1-on-1 Classes / Month",
      "30 Minutes Dedicated Class Time",
      "Quran Reading & Tajweed Rules",
      "Namaz / Salah Learning & Postures",
      "Daily Masnoon Duas & 6 Kalmas",
      "Fortnightly Revision & Assessment"
    ],
    prices: {
      UK: { currency: "GBP", symbol: "£", amount: 30, formatted: "£30" },
      USA: { currency: "USD", symbol: "$", amount: 50, formatted: "$50" },
      AUS: { currency: "AUD", symbol: "$", amount: 65, formatted: "$65" },
      PK: { currency: "PKR", symbol: "PKR ", amount: 7000, formatted: "PKR 7,000" }
    }
  },
  {
    id: "package-3-weekend",
    name: "Package 3",
    badge: "Weekend Classes",
    isPopular: true,
    schedule: "Saturday & Sunday",
    classesPerMonth: 8,
    durationPerClass: "30 Min / Day",
    description: "Convenient weekend schedule designed for busy weekday schooling and working parents who want focused sessions.",
    features: [
      "8 Weekend Classes / Month (Sat & Sun)",
      "30 Minutes Dedicated Class Time",
      "Quran Reading & Tajweed Rules",
      "Namaz / Salah Learning & Postures",
      "Daily Masnoon Duas & 6 Kalmas",
      "Ideal for Busy Weekday Routines"
    ],
    prices: {
      UK: { currency: "GBP", symbol: "£", amount: 35, formatted: "£35" },
      USA: { currency: "USD", symbol: "$", amount: 60, formatted: "$60" },
      AUS: { currency: "AUD", symbol: "$", amount: 70, formatted: "$70" },
      PK: { currency: "PKR", symbol: "PKR ", amount: 8000, formatted: "PKR 8,000" }
    }
  },
  {
    id: "package-4-five-days",
    name: "Package 4",
    badge: "5 Days / Week",
    isPopular: false,
    schedule: "5 Days / Week",
    classesPerMonth: 20,
    durationPerClass: "30 Min / Day",
    description: "Intensive daily learning track. Recommended for fast-track Quran reading, active Hifz students, and daily consistency.",
    features: [
      "20 Live 1-on-1 Classes / Month",
      "30 Minutes Dedicated Class Time",
      "Quran Reading & Tajweed Rules",
      "Namaz / Salah Learning & Postures",
      "Daily Masnoon Duas & 6 Kalmas",
      "Accelerated Progress & Daily Sabaq"
    ],
    prices: {
      UK: { currency: "GBP", symbol: "£", amount: 40, formatted: "£40" },
      USA: { currency: "USD", symbol: "$", amount: 65, formatted: "$65" },
      AUS: { currency: "AUD", symbol: "$", amount: 85, formatted: "$85" },
      PK: { currency: "PKR", symbol: "PKR ", amount: 9500, formatted: "PKR 9,500" }
    }
  }
];

export const DISCOUNT_POLICIES = [
  {
    title: "Annual Payment",
    discount: "Save 20%",
    desc: "Pay for 12 months upfront and get 2.4 months tuition completely free."
  },
  {
    title: "Six Months Payment",
    discount: "Save 10%",
    desc: "Pay bi-annually and receive an immediate 10% discount on total fees."
  },
  {
    title: "Quarterly Payment",
    discount: "Save 5%",
    desc: "Pay every 3 months and enjoy 5% savings on your family tuition plan."
  }
];
