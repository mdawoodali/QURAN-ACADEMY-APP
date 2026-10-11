import Link from 'next/link';
import { MessageSquare, ShieldCheck, Lock, ArrowUpRight } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto text-white">
      <div className="mb-8">
        <h1 className="text-2xl md:text-4xl font-serif text-white mb-2">Help & Safeguarding Support</h1>
        <p className="text-emerald-100/80 text-sm">Dedicated assistance for lesson scheduling, classroom audio/video, and child safeguarding.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-container rounded-3xl p-6 border border-white/15 shadow-xl flex flex-col justify-between cursor-pointer hover:border-amber-400/40 transition-all group">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-800/80 border border-amber-400/40 flex items-center justify-center text-amber-300 mb-4 shadow-sm group-hover:scale-105 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-amber-300 mb-1 uppercase tracking-widest">In-app / WhatsApp</h3>
            <div className="text-xl font-bold text-white">Contact Academy Desk</div>
          </div>
          <p className="text-xs text-emerald-100/70 mt-4">Average response within 15 mins</p>
        </div>
        
        <div className="glass-container rounded-3xl p-6 border border-white/15 shadow-xl flex flex-col justify-between cursor-pointer hover:border-amber-400/40 transition-all group">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-800/80 border border-amber-400/40 flex items-center justify-center text-amber-300 mb-4 shadow-sm group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-amber-300 mb-1 uppercase tracking-widest">Silent Classroom Access</h3>
            <div className="text-xl font-bold text-white">Parent Observer Mode</div>
          </div>
          <p className="text-xs text-emerald-100/70 mt-4">Observe live lessons unannounced</p>
        </div>
        
        <div className="glass-container rounded-3xl p-6 border border-white/15 shadow-xl flex flex-col justify-between group">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-800/80 border border-amber-400/40 flex items-center justify-center text-amber-300 mb-4 shadow-sm">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-amber-300 mb-1 uppercase tracking-widest">Child Privacy Protection</h3>
            <div className="text-xl font-bold text-white">Privacy by Role</div>
          </div>
          <p className="text-xs text-emerald-100/70 mt-4">Teacher & student personal numbers masked</p>
        </div>
      </div>
      
      <div className="glass-container rounded-3xl overflow-hidden border border-white/15 shadow-xl">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-lg font-bold font-serif text-white">Support Tickets & Inquiries</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/40 text-amber-300 text-xs font-bold uppercase tracking-wider border-b border-white/10">
                <th className="p-4">Request</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4">Last update</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-white/10">
              <tr className="hover:bg-white/5 transition">
                <td className="p-4 font-semibold text-white">Lesson time adjustment</td>
                <td className="p-4 text-emerald-100/80">Scheduling</td>
                <td className="p-4">
                  <span className="text-[10px] bg-amber-400 text-emerald-950 font-bold px-2.5 py-0.5 rounded-full uppercase">
                    Open
                  </span>
                </td>
                <td className="p-4 text-emerald-100/70 text-xs">Today</td>
                <td className="p-4">
                  <button className="text-amber-300 font-bold hover:text-amber-200 transition text-xs flex items-center gap-1 cursor-pointer">
                    <span>View ticket</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-white/5 transition">
                <td className="p-4 font-semibold text-white">Audio mic permission help</td>
                <td className="p-4 text-emerald-100/80">Classroom</td>
                <td className="p-4">
                  <span className="text-[10px] bg-emerald-900/80 text-emerald-300 border border-emerald-500/30 font-bold px-2.5 py-0.5 rounded-full uppercase">
                    Resolved
                  </span>
                </td>
                <td className="p-4 text-emerald-100/70 text-xs">Yesterday</td>
                <td className="p-4">
                  <button className="text-amber-300 font-bold hover:text-amber-200 transition text-xs flex items-center gap-1 cursor-pointer">
                    <span>View reply</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-white/5 transition">
                <td className="p-4 font-semibold text-white">Safeguarding report</td>
                <td className="p-4 text-emerald-100/80">Safeguarding</td>
                <td className="p-4">
                  <span className="text-[10px] bg-emerald-900/80 text-emerald-300 border border-emerald-500/30 font-bold px-2.5 py-0.5 rounded-full uppercase">
                    Private
                  </span>
                </td>
                <td className="p-4 text-emerald-100/70 text-xs">Academy team</td>
                <td className="p-4">
                  <button className="text-amber-300 font-bold hover:text-amber-200 transition text-xs flex items-center gap-1 cursor-pointer">
                    <span>Open form</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-emerald-100/60 mt-4 text-center">All teacher communications remain inside the secure platform. Contact numbers and personal emails are protected.</p>
    </div>
  );
}
