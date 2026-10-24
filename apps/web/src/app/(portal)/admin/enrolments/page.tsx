"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, BookOpen, Search, RefreshCw, UserPlus } from "lucide-react";
import toast from "react-hot-toast";

interface EnrolmentItem {
  id: string;
  learner: string;
  age: number;
  programme: string;
  matchedTeacher: string;
  assessmentStage: string;
  status: "trial_booked" | "placement_review" | "awaiting_payment" | "active" | "completed" | "cancelled";
}

export default function AdminEnrolments() {
  const [enrolments, setEnrolments] = useState<EnrolmentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loadEnrolments = () => {
    setIsLoading(true);
    fetch(`/api/enrolments?_t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.enrolments) {
          setEnrolments(data.enrolments);
        }
      })
      .catch((err) => console.warn("Could not load enrolments:", err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadEnrolments();
  }, []);

  const handleAction = async (id: string, actionName: string, nextStatus: EnrolmentItem["status"] = "active") => {
    toast.success(`Action "${actionName}" executed.`);
    setEnrolments((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: nextStatus } : e))
    );

    // Persist status change to API/DB
    try {
      await fetch("/api/enrolments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus }),
      });
    } catch (err) {
      console.warn("Could not patch enrolment:", err);
    }
  };

  const filtered = enrolments.filter(
    (e) =>
      e.learner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.programme.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.matchedTeacher.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const trialRequestsCount = enrolments.filter((e) => e.status === "trial_booked").length;
  const placementReviewsCount = enrolments.filter((e) => e.status === "placement_review").length;
  const awaitingPaymentCount = enrolments.filter((e) => e.status === "awaiting_payment").length;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif text-white mb-1">Enrolment & Trial Pipeline</h1>
          <p className="text-emerald-100/80 text-sm">
            Transition students seamlessly from free trial assessments to recurring 1-on-1 weekly classes.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={loadEnrolments}
            disabled={isLoading}
            className="p-2.5 bg-black/40 hover:bg-black/60 rounded-xl border border-white/15 text-emerald-100 transition cursor-pointer"
            title="Refresh database records"
          >
            <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} />
          </button>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-2.5 text-emerald-200/50" size={16} />
            <input
              type="text"
              placeholder="Search enrolments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/15 rounded-xl text-white placeholder:text-emerald-200/40 text-xs focus:border-amber-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Top Triad Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="glass-container rounded-3xl p-6 border border-white/15 shadow-xl flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">Trial Requests</div>
            <div className="text-4xl font-bold text-white mb-1">{trialRequestsCount}</div>
            <p className="text-xs text-emerald-100/75">Active parent submissions in database</p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-amber-300 font-semibold">
            Ready for teacher slot matching
          </div>
        </div>

        <div className="glass-container rounded-3xl p-6 border border-white/15 shadow-xl flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2">Placement Reviews</div>
            <div className="text-4xl font-bold text-white mb-1">{placementReviewsCount}</div>
            <p className="text-xs text-emerald-100/75">Assessments pending coordinator review</p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-emerald-300 font-semibold">
            Tajweed & level calibration
          </div>
        </div>

        <div className="glass-container rounded-3xl p-6 border border-white/15 shadow-xl flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-emerald-100/80 uppercase tracking-wider mb-2">Awaiting Payment</div>
            <div className="text-4xl font-bold text-amber-300 mb-1">{awaitingPaymentCount}</div>
            <p className="text-xs text-emerald-100/75">Direct bank transfer verification pending</p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-emerald-100/70 font-semibold">
            Receipts in Accounts queue
          </div>
        </div>
      </div>

      {/* Enrolments Table */}
      <div className="glass-container rounded-3xl p-6 md:p-8 border border-white/15 shadow-2xl">
        <h2 className="text-xl font-bold font-serif text-white mb-6 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-300" />
          <span>Active Pipeline Roster</span>
        </h2>

        {filtered.length === 0 ? (
          <div className="text-center py-12 text-emerald-100/70">
            <UserPlus size={40} className="mx-auto text-amber-300/60 mb-3" />
            <h3 className="font-bold text-white text-base mb-1">No Active Enrolments Found</h3>
            <p className="text-xs max-w-sm mx-auto">
              New trial bookings submitted through the public portal will appear here in real time.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-amber-300 text-xs uppercase tracking-wider font-bold">
                  <th className="pb-3">Learner</th>
                  <th className="pb-3">Programme</th>
                  <th className="pb-3">Matched Teacher</th>
                  <th className="pb-3">Trial / Assessment</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-sm">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition">
                    <td className="py-4">
                      <div className="font-bold text-white">{item.learner}</div>
                      <div className="text-xs text-emerald-100/70">{item.age} years old</div>
                    </td>
                    <td className="py-4 text-emerald-100">{item.programme}</td>
                    <td className="py-4 text-emerald-100/90 font-medium">{item.matchedTeacher}</td>
                    <td className="py-4 text-xs text-emerald-100/80">{item.assessmentStage}</td>
                    <td className="py-4">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          item.status === "active"
                            ? "bg-emerald-900/80 text-emerald-300 border border-emerald-500/30"
                            : item.status === "awaiting_payment"
                            ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                            : "bg-black/40 text-emerald-100/80 border border-white/15"
                        }`}
                      >
                        {item.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      {item.status === "awaiting_payment" ? (
                        <button
                          onClick={() => handleAction(item.id, "Confirm Wire & Activate", "active")}
                          className="text-xs font-bold bg-amber-400 hover:bg-amber-300 text-emerald-950 px-3.5 py-1.5 rounded-lg transition shadow-sm cursor-pointer"
                        >
                          Confirm Payment
                        </button>
                      ) : item.status === "placement_review" ? (
                        <button
                          onClick={() => handleAction(item.id, "Assign Weekly Slots", "awaiting_payment")}
                          className="text-xs font-bold bg-emerald-800/80 hover:bg-emerald-700 text-white border border-emerald-500/30 px-3.5 py-1.5 rounded-lg transition cursor-pointer"
                        >
                          Assign Slots
                        </button>
                      ) : item.status === "trial_booked" ? (
                        <button
                          onClick={() => handleAction(item.id, "Confirm Teacher Match", "placement_review")}
                          className="text-xs font-bold bg-emerald-800/80 hover:bg-emerald-700 text-white border border-emerald-500/30 px-3.5 py-1.5 rounded-lg transition cursor-pointer"
                        >
                          Confirm Match
                        </button>
                      ) : (
                        <span className="text-xs text-emerald-400 font-bold inline-flex items-center gap-1">
                          <CheckCircle2 size={13} />
                          Enrolled
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
