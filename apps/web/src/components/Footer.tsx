"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import { APP_VERSION } from "@quran/contracts";

export default function Footer() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          source: "footer_inquiry"
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit inquiry.");
      }

      setStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "" });
      setTimeout(() => setStatus("idle"), 8000);
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Network error submitting inquiry.");
    }
  };

  return (
    <footer className="w-full bg-[#031d15]/95 border-t border-white/10 text-white relative z-20 backdrop-blur-md">
      {/* Pre-Footer: Contact & Quick Inquiry Section */}
      <div className="border-b border-white/10 bg-black/40">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl sm:text-3xl font-serif text-white mb-2">
                {t("contactMoreInfo")}
              </h3>
              <p className="text-emerald-100/70 text-sm">
                Get in touch with our academic advisors directly via WhatsApp or quick inquiry.
              </p>
            </div>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://wa.me/+442032899880"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 bg-emerald-900/80 hover:bg-emerald-800 text-amber-300 border border-amber-400/30 px-5 py-3 rounded-xl font-bold text-sm transition shadow-md hover:scale-105"
              >
                <WhatsAppIcon className="w-5 h-5 fill-amber-300" />
                <span>UK +44 203 289 9880</span>
              </a>
              <a
                href="https://wa.me/+13305975880"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 bg-emerald-900/80 hover:bg-emerald-800 text-amber-300 border border-amber-400/30 px-5 py-3 rounded-xl font-bold text-sm transition shadow-md hover:scale-105"
              >
                <WhatsAppIcon className="w-5 h-5 fill-amber-300" />
                <span>USA +1 330 597 5880</span>
              </a>
            </div>
          </div>

          {/* Quick Consultation & Inquiries Form */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <div className="mb-4">
              <h4 className="text-lg font-serif font-bold text-white mb-1">
                {t("messagePlaceholder")}
              </h4>
              <p className="text-xs text-emerald-100/70">
                Have a question regarding courses, class timings, or admissions? Send us an inquiry and our team will get back to you promptly.
              </p>
            </div>

            <form onSubmit={handleSubmitInquiry} className="space-y-4">
              {/* Row 1: Name, Email, Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-emerald-100/80 mb-1">
                    {t("namePlaceholder")} *
                  </label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Your full name"
                    className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 text-sm transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-emerald-100/80 mb-1">
                    {t("emailPlaceholder")} *
                  </label>
                  <input 
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="name@example.com"
                    className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 text-sm transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-emerald-100/80 mb-1">
                    {t("phonePlaceholder")}
                  </label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 / +44 / +92 ..."
                    className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 text-sm transition"
                  />
                </div>
              </div>

              {/* Row 2: Message / Inquiries Textarea */}
              <div>
                <label className="block text-xs font-semibold text-emerald-100/80 mb-1">
                  {t("messagePlaceholder")} *
                </label>
                <textarea 
                  required 
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                  placeholder={t("messagePlaceholderDesc")}
                  className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 text-sm transition resize-none"
                />
              </div>

              {/* Row 3: Submit Button & Status Alerts */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                <div>
                  {status === "success" && (
                    <div className="inline-flex items-center gap-2 text-emerald-300 text-xs font-bold bg-emerald-950/80 border border-emerald-400/40 px-3.5 py-2 rounded-xl">
                      <CheckCircle2 size={16} className="text-emerald-400" />
                      <span>Thank you! Your inquiry has been received. Our team will contact you shortly.</span>
                    </div>
                  )}
                  {status === "error" && (
                    <div className="inline-flex items-center gap-2 text-red-300 text-xs font-bold bg-red-950/80 border border-red-500/40 px-3.5 py-2 rounded-xl">
                      <AlertCircle size={16} className="text-red-400" />
                      <span>{errorMessage || "Failed to submit inquiry. Please try again."}</span>
                    </div>
                  )}
                </div>

                <button 
                  type="submit" 
                  disabled={status === "submitting"}
                  className="w-full sm:w-auto min-w-[180px] bg-amber-400 hover:bg-amber-300 disabled:opacity-60 text-emerald-950 font-bold py-3 px-6 rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  {status === "submitting" ? (
                    <>
                      <span className="w-4 h-4 border-2 border-emerald-950 border-t-transparent rounded-full animate-spin" />
                      <span>Sending Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Send Inquiry</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Main 3-Column Footer */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14">
          
          {/* Column 1: Organization & Head Office */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-11 h-11 shrink-0 drop-shadow-md transition-transform duration-200 group-hover:scale-105">
                <Image 
                  src="/logo_quran_learn_academy.png" 
                  alt="Quran Learn Academy Logo" 
                  width={44}
                  height={44}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-serif font-bold text-xl text-white tracking-tight group-hover:text-amber-300 transition-colors">
                {t("brand")}
              </span>
            </Link>
            
            <p className="text-emerald-100/75 text-sm leading-relaxed">
              {t("footerDesc")}
            </p>

            <div className="pt-2 text-sm text-emerald-100/80 space-y-1.5">
              <div className="flex items-start gap-2.5">
                <MapPin size={18} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block underline decoration-amber-400/60 mb-0.5">
                    {t("headOffice")}
                  </span>
                  <span className="text-emerald-100/70 text-xs sm:text-sm">
                    {t("headOfficeAddress")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-serif font-bold text-lg text-white mb-5 pb-2 border-b border-white/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
              {t("quickLinks")}
            </h4>
            <ul className="grid grid-cols-2 gap-2.5 text-sm text-emerald-100/80 font-medium">
              <li>
                <Link href="/about-us" className="hover:text-amber-300 transition flex items-center gap-1.5">
                  <span className="text-amber-400 text-xs">▸</span> {t("aboutUs")}
                </Link>
              </li>
              <li>
                <Link href="/programmes" className="hover:text-amber-300 transition flex items-center gap-1.5">
                  <span className="text-amber-400 text-xs">▸</span> {t("ourServices")}
                </Link>
              </li>
              <li>
                <Link href="/packages" className="hover:text-amber-300 transition flex items-center gap-1.5">
                  <span className="text-amber-400 text-xs">▸</span> {t("packages")}
                </Link>
              </li>
              <li>
                <Link href="/teach-with-us" className="hover:text-amber-300 transition flex items-center gap-1.5">
                  <span className="text-amber-400 text-xs">▸</span> {t("careers")}
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-amber-300 transition flex items-center gap-1.5">
                  <span className="text-amber-400 text-xs">▸</span> {t("resources")}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-amber-300 transition flex items-center gap-1.5">
                  <span className="text-amber-400 text-xs">▸</span> {t("blog")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-300 transition flex items-center gap-1.5">
                  <span className="text-amber-400 text-xs">▸</span> {t("contact")}
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-amber-300 transition flex items-center gap-1.5">
                  <span className="text-amber-400 text-xs">▸</span> {t("studentPortal")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Get In Touch & Social Icons */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-lg text-white mb-5 pb-2 border-b border-white/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
              {t("getInTouch")}
            </h4>

            <ul className="space-y-2.5 text-sm text-emerald-100/80">
              <li>
                <a href="tel:+442032899880" className="hover:text-amber-300 transition flex items-center gap-2.5">
                  <Phone size={15} className="text-amber-400" />
                  <span>UK +44 203 289 9880</span>
                </a>
              </li>
              <li>
                <a href="tel:+13305975880" className="hover:text-amber-300 transition flex items-center gap-2.5">
                  <Phone size={15} className="text-amber-400" />
                  <span>USA +1 330 597 5880</span>
                </a>
              </li>
              <li>
                <span className="flex items-center gap-2.5 text-emerald-100/70">
                  <Phone size={15} className="text-amber-400" />
                  <span>PK +92 333 222 2525</span>
                </span>
              </li>
              <li>
                <a href="https://wa.me/+442032899880" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 transition flex items-center gap-2.5">
                  <WhatsAppIcon className="w-4 h-4 fill-amber-400" />
                  <span>WhatsApp: +44 203 289 9880</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@quranlearnacademy.com" className="hover:text-amber-300 transition flex items-center gap-2.5">
                  <Mail size={15} className="text-amber-400" />
                  <span>info@quranlearnacademy.com</span>
                </a>
              </li>
            </ul>

            {/* Social Media Links */}
            <div className="pt-2 flex items-center gap-3">
              <a 
                href="https://www.facebook.com/quranlearnacademy/" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-amber-400 hover:text-emerald-950 text-white flex items-center justify-center transition border border-white/15"
              >
                <FacebookIcon className="w-4 h-4 fill-current" />
              </a>
              <a 
                href="https://www.instagram.com/quranlearnacademy/" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-amber-400 hover:text-emerald-950 text-white flex items-center justify-center transition border border-white/15"
              >
                <InstagramIcon className="w-4 h-4 fill-current" />
              </a>
              <a 
                href="https://www.linkedin.com/company/quran-learn-academy" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-amber-400 hover:text-emerald-950 text-white flex items-center justify-center transition border border-white/15"
              >
                <LinkedInIcon className="w-4 h-4 fill-current" />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Footer Bar */}
      <div className="border-t border-white/10 py-6 bg-black/60 text-xs text-emerald-100/60">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-center md:text-left">
            {t("copyright")} • <span className="font-mono text-emerald-400">v{APP_VERSION}</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-emerald-100/70">
            <Link href="/terms-and-conditions" className="hover:text-amber-300 transition">
              {t("termsConditions")}
            </Link>
            <span>|</span>
            <Link href="/privacy-policy" className="hover:text-amber-300 transition">
              {t("privacyPolicy")}
            </Link>
            <span>|</span>
            <Link href="/delivery-refund-policy" className="hover:text-amber-300 transition">
              {t("refundPolicy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Crisp Vector Icons for Social & WhatsApp
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.031 2C6.513 2 2.022 6.49 2.022 12.008c0 1.83.493 3.547 1.348 5.032L2 22l5.12-1.343a9.98 9.98 0 004.911 1.282c5.518 0 10.01-4.49 10.01-10.008C22.041 6.49 17.549 2 12.031 2zm0 18.258a8.21 8.21 0 01-4.187-1.144l-.3-.178-3.111.816.83-3.031-.195-.31a8.214 8.214 0 01-1.272-4.403c0-4.544 3.7-8.243 8.235-8.243 4.536 0 8.236 3.699 8.236 8.243 0 4.545-3.7 8.25-8.236 8.25zm4.516-6.177c-.247-.124-1.464-.722-1.691-.805-.227-.082-.392-.124-.557.124-.165.247-.639.805-.783.97-.145.165-.289.186-.536.062-.248-.124-1.045-.385-1.99-1.229-.737-.656-1.234-1.467-1.379-1.714-.144-.247-.015-.38.109-.504.111-.111.248-.289.371-.433.124-.144.165-.247.247-.412.083-.165.042-.31-.02-.433-.063-.124-.558-1.345-.764-1.841-.201-.484-.405-.418-.557-.426-.144-.008-.31-.01-.475-.01s-.433.062-.66.31c-.227.247-.866.847-.866 2.065 0 1.218.887 2.395 1.011 2.56.124.165 1.745 2.665 4.228 3.738.591.255 1.053.407 1.413.522.594.189 1.134.162 1.562.098.477-.071 1.464-.599 1.67-1.177.206-.578.206-1.074.144-1.177-.062-.103-.227-.165-.474-.289z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}
