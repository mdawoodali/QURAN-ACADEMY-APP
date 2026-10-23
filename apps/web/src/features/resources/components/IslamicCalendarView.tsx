"use client";

import React, { useState, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Flame,
  Star,
  Moon,
  Info,
  Clock,
  BookOpen,
  X
} from "lucide-react";
import {
  HIJRI_MONTHS,
  ISLAMIC_SHIA_EVENTS,
  IslamicCalendarEvent,
  HijriMonthMeta
} from "@/data/islamicCalendarEvents";
import { MASOOMEEN_CALENDAR } from "@/data/shiaToolkitData";

export default function IslamicCalendarView() {
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(1); // 1 = Muharram
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedEvent, setSelectedEvent] = useState<IslamicCalendarEvent | null>(null);
  const [viewMode, setViewMode] = useState<"calendar" | "timeline" | "masoomeen">("calendar");

  const currentMonthMeta: HijriMonthMeta = useMemo(() => {
    return HIJRI_MONTHS.find((m) => m.monthIndex === selectedMonthIndex) || HIJRI_MONTHS[0]!;
  }, [selectedMonthIndex]);

  // Events belonging to the currently selected month
  const monthEvents = useMemo(() => {
    return ISLAMIC_SHIA_EVENTS.filter((e) => e.hijriMonth === selectedMonthIndex);
  }, [selectedMonthIndex]);

  // Filtered events across the whole year (for timeline)
  const filteredTimelineEvents = useMemo(() => {
    return ISLAMIC_SHIA_EVENTS.filter((e) => {
      if (selectedFilter === "all") return true;
      if (selectedFilter === "major") return e.isMajor;
      return e.category === selectedFilter;
    });
  }, [selectedFilter]);

  // Build grid days for the selected Hijri month
  const monthDays = useMemo(() => {
    const days = [];
    const totalDays = currentMonthMeta.daysCount;
    // Offset for clean day-of-week visualization (cyclically shifts slightly each month)
    const startDayOffset = ((selectedMonthIndex * 2 + 1) % 7);

    // Padding empty cells before month start
    for (let i = 0; i < startDayOffset; i++) {
      days.push(null);
    }

    for (let day = 1; day <= totalDays; day++) {
      const eventOnDay = monthEvents.find((e) => e.hijriDay === day);
      // Approximate English day calculation
      const approxGregDay = ((day + (selectedMonthIndex * 3) - 2) % 30) + 1;
      days.push({
        hijriDay: day,
        approxGregDay,
        approxGregMonth: currentMonthMeta.approxGregorianPeriod.split(" - ")[0] || "Month",
        event: eventOnDay
      });
    }

    return days;
  }, [selectedMonthIndex, currentMonthMeta, monthEvents]);

  const handlePrevMonth = () => {
    setSelectedMonthIndex((prev) => (prev > 1 ? prev - 1 : 12));
  };

  const handleNextMonth = () => {
    setSelectedMonthIndex((prev) => (prev < 12 ? prev + 1 : 1));
  };

  const getCategoryBadge = (category: IslamicCalendarEvent["category"]) => {
    switch (category) {
      case "shahadat":
        return {
          label: "Shahadat",
          bg: "bg-red-950/80 border-red-500/50 text-red-300",
          dot: "bg-red-500",
          icon: <Flame size={12} className="text-red-400" />
        };
      case "wiladat":
        return {
          label: "Wiladat",
          bg: "bg-emerald-950/80 border-emerald-500/50 text-emerald-300",
          dot: "bg-emerald-400",
          icon: <Sparkles size={12} className="text-emerald-400" />
        };
      case "eid":
        return {
          label: "Eid & Victory",
          bg: "bg-amber-950/80 border-amber-400/50 text-amber-300",
          dot: "bg-amber-400",
          icon: <Star size={12} className="text-amber-400" />
        };
      case "night":
        return {
          label: "Sacred Night",
          bg: "bg-purple-950/80 border-purple-500/50 text-purple-300",
          dot: "bg-purple-400",
          icon: <Moon size={12} className="text-purple-400" />
        };
      default:
        return {
          label: "Historical",
          bg: "bg-sky-950/80 border-sky-500/50 text-sky-300",
          dot: "bg-sky-400",
          icon: <Info size={12} className="text-sky-400" />
        };
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 text-white">
      {/* Top Banner / Description */}
      <div className="bg-gradient-to-r from-[#032219] via-[#021811] to-[#01100b] border border-amber-400/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-3">
              <CalendarIcon size={14} />
              <span>Dual Islamic (Hijri) &amp; English (Gregorian) Calendar</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white mb-2">
              Islamic Calendar &amp; Sacred Shia Commemorations
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl leading-relaxed">
              Explore the 12 sacred Hijri months side-by-side with the English calendar. Comprehensive historical commemorations, Wiladat (joyful births), Shahadat (martyrdoms), Laylat al-Qadr, and sacred Eids of the Ahlulbayt (AS).
            </p>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1.5 bg-black/60 p-1.5 rounded-2xl border border-white/10 shrink-0">
            <button
              onClick={() => setViewMode("calendar")}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === "calendar"
                  ? "bg-amber-400 text-emerald-950 shadow-md"
                  : "text-emerald-100/70 hover:text-white"
              }`}
            >
              Month View
            </button>
            <button
              onClick={() => setViewMode("timeline")}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === "timeline"
                  ? "bg-amber-400 text-emerald-950 shadow-md"
                  : "text-emerald-100/70 hover:text-white"
              }`}
            >
              Annual Timeline
            </button>
            <button
              onClick={() => setViewMode("masoomeen")}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === "masoomeen"
                  ? "bg-amber-400 text-emerald-950 shadow-md"
                  : "text-emerald-100/70 hover:text-white"
              }`}
            >
              14 Infallibles
            </button>
          </div>
        </div>

        {/* Legend strip */}
        <div className="relative z-10 mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs font-semibold">
          <span className="text-amber-300 uppercase tracking-wider text-[11px]">Event Key:</span>
          <span className="flex items-center gap-1.5 text-emerald-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
            Wiladat (Joyous Births)
          </span>
          <span className="flex items-center gap-1.5 text-red-300">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
            Shahadat (Martyrdoms)
          </span>
          <span className="flex items-center gap-1.5 text-amber-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
            Major Eids &amp; Victory
          </span>
          <span className="flex items-center gap-1.5 text-purple-300">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block" />
            Sacred Nights (Qadr / Barat)
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. MONTHLY CALENDAR GRID VIEW                             */}
      {/* ========================================================= */}
      {viewMode === "calendar" && (
        <div className="space-y-6">
          {/* Month Navigation & Selector */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-black/40 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevMonth}
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-amber-300 transition cursor-pointer"
                title="Previous Hijri Month"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="text-center px-4">
                <div className="flex items-baseline justify-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                    {currentMonthMeta.name}
                  </h3>
                  <span className="font-arabic text-amber-300 text-lg sm:text-xl font-bold">
                    {currentMonthMeta.arabicName}
                  </span>
                </div>
                <div className="text-xs text-emerald-200/70 font-mono mt-0.5">
                  Approx. {currentMonthMeta.approxGregorianPeriod} • {currentMonthMeta.daysCount} Days ({currentMonthMeta.sacredStatus})
                </div>
              </div>

              <button
                onClick={handleNextMonth}
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-amber-300 transition cursor-pointer"
                title="Next Hijri Month"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Quick 12-Month Pill Dropdown / Selector */}
            <select
              value={selectedMonthIndex}
              onChange={(e) => setSelectedMonthIndex(Number(e.target.value))}
              className="bg-[#032219] border border-amber-400/40 text-amber-300 font-bold text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400/50 cursor-pointer"
            >
              {HIJRI_MONTHS.map((m) => (
                <option key={m.monthIndex} value={m.monthIndex}>
                  {m.monthIndex}. {m.name} ({m.arabicName})
                </option>
              ))}
            </select>
          </div>

          {/* Calendar Days Table */}
          <div className="bg-[#031d16]/90 border border-white/10 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md overflow-x-auto">
            {/* Day of Week Headers */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase tracking-wider text-amber-300 mb-3 min-w-[640px]">
              <div className="py-2 bg-black/40 rounded-xl">Sun (الأحد)</div>
              <div className="py-2 bg-black/40 rounded-xl">Mon (الإثنين)</div>
              <div className="py-2 bg-black/40 rounded-xl">Tue (الثلاثاء)</div>
              <div className="py-2 bg-black/40 rounded-xl">Wed (الأربعاء)</div>
              <div className="py-2 bg-black/40 rounded-xl">Thu (الخميس)</div>
              <div className="py-2 bg-black/40 rounded-xl">Fri (الجمعة)</div>
              <div className="py-2 bg-black/40 rounded-xl">Sat (السبت)</div>
            </div>

            {/* 7-column Day Grid */}
            <div className="grid grid-cols-7 gap-2 min-w-[640px]">
              {monthDays.map((cell, idx) => {
                if (!cell) {
                  return (
                    <div
                      key={`empty-${idx}`}
                      className="min-h-[105px] rounded-2xl bg-black/20 border border-white/5 opacity-40"
                    />
                  );
                }

                const hasEvent = !!cell.event;
                const badge = cell.event ? getCategoryBadge(cell.event.category) : null;

                return (
                  <div
                    key={`day-${cell.hijriDay}`}
                    onClick={() => {
                      if (cell.event) setSelectedEvent(cell.event);
                    }}
                    className={`min-h-[105px] p-2.5 rounded-2xl border transition-all flex flex-col justify-between select-none ${
                      hasEvent
                        ? "bg-gradient-to-b from-black/60 to-black/80 border-amber-400/60 shadow-lg hover:border-amber-300 hover:scale-[1.02] cursor-pointer ring-1 ring-amber-400/30"
                        : "bg-black/30 border-white/10 hover:border-white/20"
                    }`}
                  >
                    {/* Header: Hijri Day (Big) + English Day (Subtle) */}
                    <div className="flex items-start justify-between">
                      <span className="text-xl sm:text-2xl font-mono font-black text-white leading-none">
                        {cell.hijriDay}
                      </span>
                      <span className="text-[10px] text-emerald-200/70 font-mono bg-white/5 px-1.5 py-0.5 rounded-md">
                        {cell.approxGregDay} {cell.approxGregMonth}
                      </span>
                    </div>

                    {/* Event Pill & Name */}
                    {hasEvent && cell.event && badge && (
                      <div className="mt-1.5">
                        <div
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 border mb-1 truncate ${badge.bg}`}
                        >
                          {badge.icon}
                          <span className="truncate">{badge.label}</span>
                        </div>
                        <div className="text-[11px] font-bold text-amber-200 line-clamp-2 leading-tight">
                          {cell.event.title}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Month Events Summary Cards */}
          <div className="mt-8">
            <h4 className="text-lg font-serif font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-amber-400" />
              <span>Sacred Commemorations in {currentMonthMeta.name}</span>
            </h4>

            {monthEvents.length === 0 ? (
              <div className="p-8 text-center text-emerald-200/70 bg-black/30 rounded-2xl border border-white/10">
                No major canonical commemorations listed for this specific month.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {monthEvents.map((evt) => {
                  const badge = getCategoryBadge(evt.category);
                  return (
                    <div
                      key={evt.id}
                      onClick={() => setSelectedEvent(evt)}
                      className="bg-gradient-to-b from-[#032219]/90 to-[#021811]/90 border border-white/10 hover:border-amber-400/50 rounded-2xl p-4 shadow-lg transition-all cursor-pointer hover:scale-[1.01] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="text-amber-300 font-bold font-mono">
                            {evt.hijriDay} {evt.hijriMonthName}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                            {badge.label}
                          </span>
                        </div>

                        <h5 className="text-base font-serif font-bold text-white mb-1">
                          {evt.title}
                        </h5>
                        <p className="text-xs font-arabic text-amber-300/80 mb-2">
                          {evt.arabicTitle}
                        </p>
                        <p className="text-xs text-emerald-100/75 line-clamp-3">
                          {evt.significance}
                        </p>
                      </div>

                      <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-amber-300 font-semibold">
                        <span>Click to view A&apos;amal &amp; details</span>
                        <span>→</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. ANNUAL SACRED TIMELINE VIEW                            */}
      {/* ========================================================= */}
      {viewMode === "timeline" && (
        <div className="space-y-6">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {[
              { key: "all", label: "All Events" },
              { key: "major", label: "Major Islamic Events" },
              { key: "wiladat", label: "Wiladat (Births)" },
              { key: "shahadat", label: "Shahadat (Martyrdoms)" },
              { key: "eid", label: "Eids & Victories" },
              { key: "night", label: "Sacred Nights" }
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setSelectedFilter(f.key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer border ${
                  selectedFilter === f.key
                    ? "bg-amber-400 text-emerald-950 border-amber-400 shadow-sm"
                    : "bg-black/40 text-emerald-100/80 border-white/10 hover:text-white hover:bg-white/10"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Timeline List */}
          <div className="space-y-4">
            {filteredTimelineEvents.map((evt) => {
              const badge = getCategoryBadge(evt.category);
              return (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                  className="bg-gradient-to-r from-[#032219]/90 to-[#021811]/90 border border-white/10 hover:border-amber-400/50 rounded-2xl p-5 shadow-lg transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-black/50 border border-amber-400/30 flex flex-col items-center justify-center shrink-0 text-center font-mono">
                      <span className="text-xs text-amber-300 font-bold uppercase">
                        {evt.hijriMonthName.slice(0, 3)}
                      </span>
                      <span className="text-xl font-black text-white leading-none">
                        {evt.hijriDay}
                      </span>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                          {badge.label}
                        </span>
                        <span className="text-xs text-emerald-200/70 font-mono">
                          Approx. {evt.approxGregorianDay} {evt.approxGregorianMonth}
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-serif font-bold text-white">
                        {evt.title}
                      </h4>
                      <p className="text-xs text-emerald-100/80 mt-1 max-w-2xl">
                        {evt.significance}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs font-bold text-amber-300 flex items-center gap-1 shrink-0 self-end sm:self-center">
                    <span>View A&apos;amal</span>
                    <span>→</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. 14 INFALLIBLES BIOGRAPHIES VIEW                        */}
      {/* ========================================================= */}
      {viewMode === "masoomeen" && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-serif font-bold text-white mb-2">
              Sacred Timeline of the 14 Infallibles (Chahardah Masoomeen AS)
            </h3>
            <p className="text-xs sm:text-sm text-emerald-200/70 max-w-2xl mx-auto">
              From the Noble Messenger (SAWW) and Sayyida Fatima al-Zahra (SA) to the 12 Imams (AS). Key dates for Wiladat (joyful celebrations) and Shahadat (commemorations).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MASOOMEEN_CALENDAR.map((m) => (
              <div
                key={m.number}
                className="bg-gradient-to-b from-[#032219]/90 to-[#021811]/90 border border-white/10 rounded-2xl p-5 text-left shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-amber-300 font-bold mb-2">
                    <span className="bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                      #{m.number} of 14
                    </span>
                    <span className="text-emerald-200/70 font-mono text-[11px]">{m.kuniyya}</span>
                  </div>
                  <h4 className="text-base sm:text-lg font-serif font-bold text-white mb-0.5">
                    {m.name}
                  </h4>
                  <p className="text-xs text-amber-300/80 mb-3 font-medium">{m.title}</p>

                  <div className="space-y-1.5 text-xs text-emerald-100/80 border-t border-white/10 pt-3">
                    <div>
                      <strong className="text-white">Parents:</strong> {m.father} &amp; {m.mother}
                    </div>
                    <div>
                      <strong className="text-white">Birth:</strong> {m.birthHijri} ({m.birthLocation})
                    </div>
                    <div>
                      <strong className="text-white">Martyrdom:</strong> {m.martyrdomHijri}
                    </div>
                    <div>
                      <strong className="text-white">Shrine:</strong> {m.shrineLocation}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 text-[11px] bg-black/30 p-2.5 rounded-xl border border-white/5 text-amber-200/90">
                  <strong className="text-amber-400">Key Commemorations: </strong>
                  {m.keyCommemoration}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. EXPANDED EVENT DETAIL MODAL                            */}
      {/* ========================================================= */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="bg-[#031d16] border border-amber-400/40 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/15 flex items-center justify-between bg-black/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-800/80 border border-amber-400/40 rounded-xl flex items-center justify-center text-amber-300">
                  <CalendarIcon size={20} />
                </div>
                <div>
                  <div className="text-xs text-amber-300 font-mono font-bold">
                    {selectedEvent.hijriDay} {selectedEvent.hijriMonthName} ({selectedEvent.hijriMonthArabic})
                  </div>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-white">
                    {selectedEvent.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedEvent(null)}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-emerald-100/90 text-sm">
              <div className="text-center py-2 border-b border-white/10">
                <span className="font-arabic text-amber-300 text-2xl font-bold">
                  {selectedEvent.arabicTitle}
                </span>
                <div className="text-xs text-emerald-200/70 font-mono mt-1">
                  Approx. English Date: {selectedEvent.approxGregorianDay} {selectedEvent.approxGregorianMonth}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-1.5">
                  Historical &amp; Theological Significance
                </h4>
                <p className="leading-relaxed bg-black/40 p-4 rounded-2xl border border-white/10">
                  {selectedEvent.significance}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-1.5">
                  Event Details
                </h4>
                <p className="leading-relaxed">
                  {selectedEvent.description}
                </p>
              </div>

              {selectedEvent.recommendedAamal && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-1.5 flex items-center gap-1.5">
                    <BookOpen size={14} />
                    <span>Recommended A&apos;amal &amp; Supplications</span>
                  </h4>
                  <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-2xl p-4 text-emerald-200 text-xs sm:text-sm leading-relaxed">
                    {selectedEvent.recommendedAamal}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/15 bg-black/40 flex justify-end">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
