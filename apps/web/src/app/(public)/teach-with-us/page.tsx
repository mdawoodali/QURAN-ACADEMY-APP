"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

export default function TeachWithUsPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    experience: "<1",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: "",
          message: `Teacher Application — Experience: ${formData.experience} years`,
          source: "teach_with_us",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit application.");
      }

      setStatus("success");
      setFormData({ name: "", email: "", experience: "<1" });
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Error submitting application.");
    }
  };

  return (
    <main className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-10 md:py-20 text-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Left Column: Information & Steps */}
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-5 leading-tight">
            {t("teachTitle")}
          </h1>
          <p className="text-emerald-100/85 text-base sm:text-lg mb-8 leading-relaxed">
            {t("teachDesc")}
          </p>
          <div className="space-y-6 mb-8">
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-emerald-800/80 border border-amber-400/40 rounded-full flex items-center justify-center shrink-0 shadow-md">
                <span className="text-amber-300 font-bold text-lg font-serif">1</span>
              </div>
              <div>
                <h3 className="font-bold text-white mb-1 text-base sm:text-lg">{t("teachStep1Title")}</h3>
                <p className="text-sm text-emerald-100/80 leading-relaxed">
                  {t("teachStep1Desc")}
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-emerald-800/80 border border-amber-400/40 rounded-full flex items-center justify-center shrink-0 shadow-md">
                <span className="text-amber-300 font-bold text-lg font-serif">2</span>
              </div>
              <div>
                <h3 className="font-bold text-white mb-1 text-base sm:text-lg">{t("teachStep2Title")}</h3>
                <p className="text-sm text-emerald-100/80 leading-relaxed">
                  {t("teachStep2Desc")}
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-emerald-800/80 border border-amber-400/40 rounded-full flex items-center justify-center shrink-0 shadow-md">
                <span className="text-amber-300 font-bold text-lg font-serif">3</span>
              </div>
              <div>
                <h3 className="font-bold text-white mb-1 text-base sm:text-lg">{t("teachStep3Title")}</h3>
                <p className="text-sm text-emerald-100/80 leading-relaxed">
                  {t("teachStep3Desc")}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Direct Link to Self Registration */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-4">
            <div className="text-xs text-emerald-100/80">
              Ready to submit complete credentials and create your tutor account?
            </div>
            <Link
              href="/register/teacher"
              className="bg-amber-400 hover:bg-amber-300 text-emerald-950 px-4 py-2 rounded-xl text-xs font-bold transition shadow-md whitespace-nowrap flex items-center gap-1.5"
            >
              <span>Teacher Register</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
        
        {/* Right Column: Glassmorphic Application Form */}
        <div className="glass-container rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl">
          <h2 className="text-2xl font-bold font-serif text-white mb-6">
            {t("appFormTitle")}
          </h2>

          {status === "success" && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-900/80 border border-emerald-400/40 text-emerald-100 text-sm flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white mb-1">Application Submitted Successfully!</p>
                <p className="text-xs text-emerald-100/90 mb-3">Our academic dean will review your qualifications and contact you promptly.</p>
                <Link
                  href="/register/teacher"
                  className="inline-flex items-center gap-1.5 bg-amber-400 text-emerald-950 font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-sm hover:bg-amber-300 transition"
                >
                  <span>Proceed to Full Teacher Registration →</span>
                </Link>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/70 border border-red-500/30 text-red-200 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-emerald-100 mb-2">
                {t("fullNameLabel")}
              </label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-sm" 
                placeholder={t("fullNamePlaceholder")}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-100 mb-2">
                {t("emailLabel")}
              </label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-sm" 
                placeholder="you@example.com" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-100 mb-2">
                {t("expLabel")}
              </label>
              <select 
                value={formData.experience}
                onChange={(e) => setFormData(p => ({ ...p, experience: e.target.value }))}
                className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-sm [&>option]:bg-[#052b20] [&>option]:text-white"
              >
                <option value="<1">{t("expLess1")}</option>
                <option value="1-3">{t("exp1to3")}</option>
                <option value="3-5">{t("exp3to5")}</option>
                <option value="5+">{t("exp5plus")}</option>
              </select>
            </div>
            <button 
              type="submit" 
              disabled={status === "submitting"}
              className="w-full bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold py-4 rounded-xl transition-all shadow-lg mt-4 cursor-pointer text-base disabled:opacity-50"
            >
              {status === "submitting" ? "Submitting Application..." : t("submitApp")}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
