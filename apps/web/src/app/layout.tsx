import type { Metadata } from "next";
import { Source_Serif_4, Figtree, Amiri_Quran, Noto_Nastaliq_Urdu } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const sourceSerif = Source_Serif_4({ subsets: ["latin"], variable: "--font-hero" });
const figtree = Figtree({ subsets: ["latin"], variable: "--font-ui" });
const amiriQuran = Amiri_Quran({ weight: "400", subsets: ["arabic"], variable: "--font-arabic" });
const notoNastaliq = Noto_Nastaliq_Urdu({ weight: "400", subsets: ["arabic"], variable: "--font-urdu" });

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sourceSerif.variable} ${figtree.variable} ${amiriQuran.variable} ${notoNastaliq.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
