"use client";

import ShiaToolkit from "@/components/ShiaToolkit";
import JafariPrayerSchedule from "@/features/resources/components/JafariPrayerSchedule";

export default function CompanionApp() {
  return (
    <div className="min-h-full p-4 md:p-8 max-w-6xl mx-auto text-white space-y-10">
      <header className="max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-3xl md:text-5xl font-serif text-white mb-2">Daily Shia Companion</h1>
        <p className="text-emerald-100/80 text-sm md:text-base">
          Astronomical Ja&apos;fari prayer timings, Kaaba Qibla compass, Digital Tasbeeh, and authentic Duas &amp; Ziyarat.
        </p>
      </header>

      <JafariPrayerSchedule />

      <ShiaToolkit initialTab="tasbeeh" />
    </div>
  );
}
