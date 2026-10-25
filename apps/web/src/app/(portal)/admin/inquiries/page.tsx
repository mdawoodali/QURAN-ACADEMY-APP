"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Mail,
  Phone,
  MessageSquare,
  Clock,
  Search,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Trash2,
  Check,
  Send,
  User

} from "lucide-react";
import { ContactInquiryRecord } from "@/app/api/inquiries/route";

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<ContactInquiryRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dataSource, setDataSource] = useState<"database" | "fallback_store">("database");
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchInquiries = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch(`/api/inquiries?status=${statusFilter}&search=${encodeURIComponent(searchQuery)}`, {
        cache: "no-store"
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.inquiries)) {
        setInquiries(data.inquiries);
        setDataSource(data.source === "database" ? "database" : "fallback_store");
      }
    } catch (err) {
      console.error("Failed to load inquiries:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const handleUpdateStatus = async (id: string, newStatus: ContactInquiryRecord["status"]) => {
    try {
      const res = await fetch("/api/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setInquiries((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
        setActionMessage(`Status updated to "${newStatus}"`);
        setTimeout(() => setActionMessage(null), 3000);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this inquiry?")) return;
    try {
      const res = await fetch(`/api/inquiries?id=${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        setInquiries((prev) => prev.filter((item) => item.id !== id));
        setActionMessage("Inquiry removed successfully.");
        setTimeout(() => setActionMessage(null), 3000);
      }
    } catch (err) {
      console.error("Failed to delete inquiry:", err);
    }
  };

  // Metrics
  const counts = useMemo(() => {
    return {
      total: inquiries.length,
      new: inquiries.filter((i) => i.status === "new").length,
      contacted: inquiries.filter((i) => i.status === "contacted").length,
      resolved: inquiries.filter((i) => i.status === "resolved").length
    };
  }, [inquiries]);

  // Clean phone numbers for WhatsApp API links
  const getCleanPhone = (phone: string) => {
    return phone.replace(/[^\d+]/g, "").replace(/^\+/, "");
  };

  const formatTimestamp = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full text-white space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-2">
            <Mail size={13} />
            <span>Admissions &amp; Consultation Desk</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-white mb-1">
            Student Inquiries &amp; Messages
          </h1>
          <p className="text-emerald-100/75 text-sm max-w-2xl">
            Real-time inquiries, consultation requests, and course questions submitted via the website footer and contact channels.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchInquiries}
            disabled={isRefreshing}
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-amber-300 transition cursor-pointer disabled:opacity-50"
            title="Refresh Inquiries"
          >
            <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
          </button>
        </div>
      </header>

      {/* Action Notification Toast */}
      {actionMessage && (
        <div className="bg-emerald-950/90 border border-emerald-400/50 text-emerald-200 px-4 py-3 rounded-2xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-container rounded-2xl p-5 border border-white/10 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-emerald-200/80 uppercase font-bold tracking-wider mb-2">
            <span>Total Inquiries</span>
            <MessageSquare size={16} className="text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{counts.total}</div>
          <div className="text-[11px] text-emerald-100/60 mt-1">All recorded questions</div>
        </div>

        <div className="glass-container rounded-2xl p-5 border border-amber-400/40 shadow-lg bg-amber-950/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-amber-300 uppercase font-bold tracking-wider mb-2">
            <span>New / Pending</span>
            <Clock size={16} className="text-amber-300" />
          </div>
          <div className="text-3xl font-black text-amber-300 font-mono">{counts.new}</div>
          <div className="text-[11px] text-amber-200/70 mt-1">Awaiting coordinator response</div>
        </div>

        <div className="glass-container rounded-2xl p-5 border border-white/10 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-emerald-200/80 uppercase font-bold tracking-wider mb-2">
            <span>Contacted</span>
            <Check size={16} className="text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{counts.contacted}</div>
          <div className="text-[11px] text-emerald-100/60 mt-1">In progress with advisors</div>
        </div>

        <div className="glass-container rounded-2xl p-5 border border-white/10 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-emerald-200/80 uppercase font-bold tracking-wider mb-2">
            <span>Resolved</span>
            <CheckCircle2 size={16} className="text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{counts.resolved}</div>
          <div className="text-[11px] text-emerald-100/60 mt-1">Successfully handled</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-container rounded-2xl p-4 border border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1.5 rounded-xl border border-white/10 overflow-x-auto">
          {[
            { id: "all", label: "All Inquiries" },
            { id: "new", label: "New (Pending)" },
            { id: "contacted", label: "Contacted" },
            { id: "resolved", label: "Resolved" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-amber-400 text-emerald-950 shadow-sm"
                  : "text-emerald-100/70 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone, or question..."
            className="w-full bg-black/40 border border-white/15 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 transition"
          />
        </div>
      </div>

      {/* Inquiries Cards List */}
      {isLoading ? (
        <div className="p-16 text-center text-emerald-200/60 glass-container rounded-3xl border border-white/10 flex flex-col items-center justify-center gap-3">
          <span className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Loading student inquiries...</span>
        </div>
      ) : inquiries.length === 0 ? (
        <div className="p-16 text-center text-emerald-200/70 glass-container rounded-3xl border border-white/10 space-y-3">
          <MessageSquare size={36} className="mx-auto text-amber-400/60" />
          <h3 className="text-lg font-serif font-bold text-white">No Inquiries Found</h3>
          <p className="text-xs text-emerald-100/60 max-w-md mx-auto">
            {searchQuery
              ? `No inquiries match the query "${searchQuery}". Try clearing search keywords.`
              : "No student messages currently in this category. New inquiries submitted from the website footer will appear here instantly."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq) => {
            const isNew = inq.status === "new";
            const cleanPhone = inq.phone ? getCleanPhone(inq.phone) : "";

            return (
              <div
                key={inq.id}
                className={`glass-container rounded-3xl p-5 sm:p-6 border transition-all shadow-xl flex flex-col justify-between ${
                  isNew
                    ? "border-amber-400/50 bg-gradient-to-b from-amber-950/20 via-black/40 to-black/60 shadow-[0_0_20px_rgba(251,191,36,0.1)]"
                    : "border-white/10 bg-black/40"
                }`}
              >
                <div>
                  {/* Card Header: Inquirer details + Status Dropdown */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                          isNew
                            ? "bg-amber-400 text-emerald-950 border-amber-300 shadow-md"
                            : "bg-emerald-900/60 text-emerald-200 border-emerald-500/30"
                        }`}
                      >
                        <User size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base sm:text-lg font-serif font-bold text-white">
                            {inq.name}
                          </h3>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              inq.source === "contact_page"
                                ? "bg-purple-900/60 text-purple-200 border border-purple-500/30"
                                : "bg-emerald-900/60 text-emerald-200 border border-emerald-500/30"
                            }`}
                          >
                            {inq.source === "contact_page" ? "Contact Page" : "Footer Form"}
                          </span>
                        </div>
                        <div className="text-xs text-emerald-200/70 font-mono mt-0.5 flex items-center gap-2">
                          <Clock size={12} className="text-amber-400" />
                          <span>{formatTimestamp(inq.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Pill Badge & Changer */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <select
                        value={inq.status}
                        onChange={(e) =>
                          handleUpdateStatus(inq.id, e.target.value as ContactInquiryRecord["status"])
                        }
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none cursor-pointer transition ${
                          inq.status === "new"
                            ? "bg-amber-400 text-emerald-950 border-amber-300 shadow-xs"
                            : inq.status === "contacted"
                            ? "bg-emerald-900/80 text-emerald-300 border-emerald-500/40"
                            : "bg-sky-900/80 text-sky-200 border-sky-500/40"
                        }`}
                      >
                        <option value="new">● New (Pending)</option>
                        <option value="contacted">✓ Contacted</option>
                        <option value="resolved">✓ Resolved</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>

                  {/* Contact Info Pills */}
                  <div className="flex flex-wrap items-center gap-3 text-xs mb-4">
                    <a
                      href={`mailto:${inq.email}?subject=Regarding Your Inquiry at Quran Learn Academy`}
                      className="inline-flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 text-emerald-200 hover:text-white transition"
                    >
                      <Mail size={13} className="text-amber-400" />
                      <span>{inq.email}</span>
                      <ExternalLink size={11} className="text-white/40" />
                    </a>

                    {inq.phone ? (
                      <a
                        href={`https://wa.me/${cleanPhone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-emerald-950/80 hover:bg-emerald-900 px-3 py-1.5 rounded-xl border border-emerald-500/30 text-emerald-300 font-mono transition"
                      >
                        <Phone size={13} className="text-emerald-400" />
                        <span>{inq.phone}</span>
                        <ExternalLink size={11} className="text-emerald-400/60" />
                      </a>
                    ) : (
                      <span className="text-emerald-100/50 italic text-[11px]">No phone provided</span>
                    )}
                  </div>

                  {/* Message Content Body */}
                  <div className="bg-black/50 border border-white/10 rounded-2xl p-4 sm:p-5 relative">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-300/80 block mb-1">
                      Inquiry Message:
                    </span>
                    <p className="text-sm text-emerald-100/90 leading-relaxed whitespace-pre-wrap">
                      {inq.message}
                    </p>
                  </div>
                </div>

                {/* Card Action Toolbar */}
                <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {/* Direct WhatsApp Reply */}
                    {cleanPhone && (
                      <a
                        href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                          `Salam Alaykum ${inq.name}, thank you for reaching out to Quran Learn Academy regarding your inquiry. How may we assist you today?`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
                      >
                        <Send size={13} className="text-amber-300" />
                        <span>WhatsApp Reply</span>
                      </a>
                    )}

                    {/* Direct Email Reply */}
                    <a
                      href={`mailto:${inq.email}?subject=${encodeURIComponent(
                        "Quran Learn Academy — Inquiry Response"
                      )}&body=${encodeURIComponent(
                        `Salam Alaykum ${inq.name},\n\nThank you for contacting Quran Learn Academy. Regarding your inquiry:\n\n"${inq.message}"\n\n`
                      )}`}
                      className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 border border-white/15 transition"
                    >
                      <Mail size={13} className="text-amber-400" />
                      <span>Email Reply</span>
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    {inq.status === "new" && (
                      <button
                        onClick={() => handleUpdateStatus(inq.id, "contacted")}
                        className="px-3 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-400/30 text-emerald-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <Check size={13} />
                        <span>Mark Contacted</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(inq.id)}
                      className="w-8 h-8 rounded-xl bg-red-950/50 hover:bg-red-900/80 border border-red-500/30 flex items-center justify-center text-red-300 transition cursor-pointer"
                      title="Delete Inquiry"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
