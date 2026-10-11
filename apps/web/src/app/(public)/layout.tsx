import PublicNavbar from "@/components/PublicNavbar";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-page)] flex flex-col font-sans">
      <PublicNavbar />
      {children}
    </div>
  );
}
