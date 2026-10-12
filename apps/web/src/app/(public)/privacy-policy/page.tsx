export default function PrivacyPolicyPage() {
  return (
    <main className="w-full max-w-[1000px] mx-auto px-4 sm:px-6 py-12 md:py-20 text-white">
      <div className="glass-container rounded-3xl p-8 sm:p-12 border border-white/15 shadow-2xl">
        <h1 className="text-3xl sm:text-4xl font-serif text-white mb-6">Privacy Policy</h1>
        <div className="space-y-4 text-emerald-100/80 text-sm sm:text-base leading-relaxed">
          <p>At Quran Learn Academy, student privacy and child safety are our highest priorities.</p>
          <h2 className="text-xl font-serif text-white pt-4">1. Information Collection</h2>
          <p>We only collect essential contact details (name, email, phone) required to deliver lessons and coordinate schedules.</p>
          <h2 className="text-xl font-serif text-white pt-4">2. Non-Disclosure</h2>
          <p>We never sell, rent, or share personal contact information with third parties for marketing purposes.</p>
          <h2 className="text-xl font-serif text-white pt-4">3. Data Security</h2>
          <p>All sensitive information and communications are protected with industry-standard 256-bit encryption.</p>
        </div>
      </div>
    </main>
  );
}
