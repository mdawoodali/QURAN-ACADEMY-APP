import type { Metadata } from "next";
import { Source_Serif_4, Figtree, Amiri_Quran, Noto_Sans_Arabic, Vidaloka, Cinzel } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { LanguageProvider } from "@/components/LanguageContext";
import "./globals.css";

const sourceSerif = Source_Serif_4({ subsets: ["latin"], variable: "--font-hero" });
const figtree = Figtree({ subsets: ["latin"], variable: "--font-ui" });
const amiriQuran = Amiri_Quran({ weight: "400", subsets: ["arabic"], variable: "--font-arabic" });
const notoSansArabic = Noto_Sans_Arabic({ weight: ["400", "500", "600", "700"], subsets: ["arabic"], variable: "--font-urdu-clean" });
const vidaloka = Vidaloka({ weight: "400", subsets: ["latin"], variable: "--font-vidaloka" });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" });

export const metadata: Metadata = {
  title: "Quran Academy",
  description: "A lifelong connection with the Quran.",
  manifest: "/manifest.json"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={`${sourceSerif.variable} ${figtree.variable} ${amiriQuran.variable} ${notoSansArabic.variable} ${vidaloka.variable} ${cinzel.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
