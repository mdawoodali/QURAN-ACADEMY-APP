import type { Metadata, Viewport } from "next";
import { Source_Serif_4, Figtree, Amiri_Quran, Noto_Sans_Arabic, Vidaloka, Cinzel } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { LanguageProvider } from "@/components/LanguageContext";
import { SectProvider } from "@/components/SectContext";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import "./globals.css";

const sourceSerif = Source_Serif_4({ subsets: ["latin"], variable: "--font-hero" });
const figtree = Figtree({ subsets: ["latin"], variable: "--font-ui" });
const amiriQuran = Amiri_Quran({ weight: "400", subsets: ["arabic"], variable: "--font-arabic" });
const notoSansArabic = Noto_Sans_Arabic({ weight: ["400", "500", "600", "700"], subsets: ["arabic"], variable: "--font-urdu-clean" });
const vidaloka = Vidaloka({ weight: "400", subsets: ["latin"], variable: "--font-vidaloka" });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" });

export const viewport: Viewport = {
  themeColor: "#021811",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://quranacademyapp.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/logo_quran_learn_academy.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },
  title: {
    template: "%s | Quran Academy",
    default: "Quran Academy — One-on-One Live Quran & Tajweed Learning",
  },
  description: "Learn Quran recitation, Tajweed, and Hifz with certified male and female Qaris online. 1-on-1 live interactive sessions for kids and adults worldwide.",
  keywords: [
    "Quran Academy",
    "learn Quran online",
    "online Quran tutor",
    "Tajweed classes online",
    "Quran memorization online",
    "Hifz program online",
    "Noorani Qaida for kids",
    "female Quran teacher online",
  ],
  authors: [{ name: "Quran Academy Team", url: baseUrl }],
  creator: "Quran Academy",
  publisher: "Quran Academy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Quran Academy — One-on-One Live Quran & Tajweed Learning",
    description: "Personalized online Quran learning with certified teachers, interactive live classrooms, and flexible scheduling.",
    url: baseUrl,
    siteName: "Quran Academy",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quran Academy — One-on-One Live Quran & Tajweed Learning",
    description: "Personalized online Quran learning with certified teachers, interactive live classrooms, and flexible scheduling.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": `${baseUrl}/#organization`,
      name: "Quran Academy",
      url: baseUrl,
      logo: `${baseUrl}/logo_quran_learn_academy.png`,
      description: "Premier online Quran learning institution providing 1-on-1 personalized lessons with certified teachers.",
      sameAs: [
        "https://wa.me/+13305975880",
        "https://wa.me/+442032899880",
      ],
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+1-330-597-5880",
          contactType: "customer service",
          areaServed: ["US", "CA", "Worldwide"],
          availableLanguage: ["English", "Urdu", "Arabic"],
        },
        {
          "@type": "ContactPoint",
          telephone: "+44-20-3289-9880",
          contactType: "customer service",
          areaServed: ["GB", "EU"],
          availableLanguage: ["English", "Urdu", "Arabic"],
        },
      ],
    },
    {
      "@type": "Course",
      "@id": `${baseUrl}/#tajweed-course`,
      name: "Tajweed & Fluent Quran Recitation",
      description: "Master the rules of Tajweed, Makharij articulation, and correct pronunciation with personalized 1-on-1 instruction.",
      provider: {
        "@id": `${baseUrl}/#organization`,
      },
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "Online",
        courseWorkload: "PT30M",
      },
    },
    {
      "@type": "Course",
      "@id": `${baseUrl}/#qaida-course`,
      name: "Noorani & Madani Qaida Foundation",
      description: "Beginner level course for children and adults to learn Arabic alphabet phonetics and letter joining.",
      provider: {
        "@id": `${baseUrl}/#organization`,
      },
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "Online",
        courseWorkload: "PT30M",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo_quran_learn_academy.png" type="image/png" />
        <link rel="shortcut icon" href="/logo_quran_learn_academy.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo_quran_learn_academy.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${sourceSerif.variable} ${figtree.variable} ${amiriQuran.variable} ${notoSansArabic.variable} ${vidaloka.variable} ${cinzel.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <SectProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </SectProvider>
        <Toaster position="bottom-right" />
        <PWAInstallPrompt />
      </body>
    </html>
  );
}
