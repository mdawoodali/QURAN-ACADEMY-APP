export default function TermsPage() {
  return (
    <main className="w-full max-w-[1000px] mx-auto px-4 sm:px-6 py-12 md:py-20 text-white">
      <div className="glass-container rounded-3xl p-8 sm:p-12 border border-white/15 shadow-2xl">
        <h1 className="text-3xl sm:text-4xl font-serif text-white mb-6">Terms and Conditions</h1>
        <div className="space-y-4 text-emerald-100/80 text-sm sm:text-base leading-relaxed">
          <p>Welcome to Quran Learn Academy. By using our website, services, and live classroom portal, you agree to these terms.</p>
          <h2 className="text-xl font-serif text-white pt-4">1. Class Scheduling & Attendance</h2>
          <p>Classes are held at mutually agreed-upon times. We offer makeup classes with prior notice of at least 4 hours before the scheduled lesson.</p>
          <h2 className="text-xl font-serif text-white pt-4">2. Code of Conduct</h2>
          <p>We maintain a respectful, safe, and professional learning environment between tutors and students at all times.</p>
          <h2 className="text-xl font-serif text-white pt-4">3. Subscriptions & Payments</h2>
          <p>Fees are billed on a monthly cycle. You may pause or discontinue your enrollment at any time before the new billing period.</p>
        </div>
      </div>
    </main>
  );
}
