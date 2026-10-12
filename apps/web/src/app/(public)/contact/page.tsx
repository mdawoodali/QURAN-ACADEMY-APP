"use client";

import { Phone, Mail, MapPin, Send } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <main className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-12 md:py-20 text-white">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-800/80 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-semibold mb-4">
          <Phone size={16} />
          <span>We Are Here to Assist You</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-6 leading-tight">
          {t("contact")} Quran Learn Academy
        </h1>
        <p className="text-emerald-100/85 text-base sm:text-lg leading-relaxed">
          Reach out to our academic coordinators, admissions advisors, or support representatives anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 mb-16">
        {/* Contact Info Card */}
        <div className="glass-container rounded-3xl p-8 sm:p-10 border border-white/15 shadow-2xl flex flex-col justify-between pop-hover">
          <div>
            <h2 className="text-2xl font-serif text-white mb-6 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              {t("getInTouch")}
            </h2>

            <div className="space-y-6 text-sm text-emerald-100/85">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-800/80 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <span className="font-bold text-white block">United Kingdom Support</span>
                  <a href="tel:+442032899880" className="hover:text-amber-300 transition block">
                    Phone: +44 203 289 9880
                  </a>
                  <a href="https://wa.me/+442032899880" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 transition text-xs text-amber-400">
                    WhatsApp: +44 203 289 9880
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-800/80 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <span className="font-bold text-white block">United States Support</span>
                  <a href="tel:+13305975880" className="hover:text-amber-300 transition block">
                    Phone: +1 330 597 5880
                  </a>
                  <a href="https://wa.me/+13305975880" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 transition text-xs text-amber-400">
                    WhatsApp: +1 330 597 5880
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-800/80 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <span className="font-bold text-white block">Pakistan Helpline</span>
                  <span className="block">+92 333 222 2525</span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-800/80 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <span className="font-bold text-white block">Email Inquiries</span>
                  <a href="mailto:info@quranlearnacademy.com" className="hover:text-amber-300 transition">
                    info@quranlearnacademy.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-800/80 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="font-bold text-white block">{t("headOffice")}</span>
                  <span className="text-xs sm:text-sm text-emerald-100/70">
                    {t("headOfficeAddress")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="glass-container rounded-3xl p-8 sm:p-10 border border-white/15 shadow-2xl">
          <h2 className="text-2xl font-serif text-white mb-2">Send Us a Message</h2>
          <p className="text-emerald-100/70 text-sm mb-6">
            Fill out the form below and an academic coordinator will respond within 2-4 hours.
          </p>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              alert("Your message has been received! We will be in touch shortly.");
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold text-emerald-100 mb-1.5">{t("namePlaceholder")}</label>
              <input 
                type="text" 
                required 
                className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 text-sm transition"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-emerald-100 mb-1.5">{t("emailPlaceholder")}</label>
              <input 
                type="email" 
                required 
                className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 text-sm transition"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-emerald-100 mb-1.5">{t("phonePlaceholder")}</label>
              <input 
                type="tel" 
                required 
                className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 text-sm transition"
                placeholder="+1 / +44 ..."
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-emerald-100 mb-1.5">Message / Inquiries</label>
              <textarea 
                rows={4} 
                required 
                className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 text-sm transition"
                placeholder="Tell us about your learning goals or ask any question..."
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold py-3.5 rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer text-base"
            >
              <Send size={18} />
              <span>{t("send")}</span>
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
