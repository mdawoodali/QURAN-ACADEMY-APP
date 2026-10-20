import { Suspense } from "react";
import PublicNavbar from "@/components/PublicNavbar";
import Footer from "@/components/Footer";
import MobileStickyCTA from "@/components/MobileStickyCTA";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-page)] flex flex-col font-sans">
      <PublicNavbar />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
      <Suspense fallback={null}>
        <MobileStickyCTA />
      </Suspense>
    </div>
  );
}
