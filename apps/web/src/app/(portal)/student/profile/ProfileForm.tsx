"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ProfileForm({ 
  initialData 
}: { 
  initialData: { fullName: string, email: string, timezone: string, notifications: boolean } 
}) {
  const router = useRouter();
  const [formData, setFormData] = useState(initialData);
  const [isSaving, setIsSaving] = useState(false);

  // Generate initials
  const initials = formData.fullName
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'QA';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    toast.loading("Saving profile...", { id: "profile" });
    
    // Simulate API call for now (since we don't have an update endpoint yet)
    setTimeout(() => {
      toast.success("Profile settings saved successfully", { id: "profile" });
      setIsSaving(false);
      router.refresh(); // Refresh the server component state
    }, 800);
  };

  return (
    <div className="glass-container rounded-3xl p-6 md:p-8 border border-white/15 shadow-2xl text-white">
      <form onSubmit={handleSave} className="space-y-6">
        
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/10">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-800/80 border-2 border-amber-400/40 text-amber-300 flex items-center justify-center text-2xl sm:text-3xl font-serif font-bold shadow-lg">
            {initials}
          </div>
          <div>
            <button 
              type="button" 
              onClick={() => toast("Avatar upload coming soon", { icon: "📸" })} 
              className="bg-white/10 hover:bg-white/20 text-white border border-white/15 px-4 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer"
            >
              Change Avatar
            </button>
            <p className="text-xs text-emerald-100/60 mt-2">JPG or PNG under 2MB recommended.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-emerald-100 mb-2">Full Name</label>
            <input 
              type="text" 
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-emerald-200/40 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-emerald-100 mb-2">Email Account</label>
            <input 
              type="email" 
              disabled
              value={formData.email}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-emerald-100/50 cursor-not-allowed text-sm"
            />
            <p className="text-xs text-emerald-100/50 mt-1">Bound to your account authentication.</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-emerald-100 mb-2">Timezone</label>
            <select 
              value={formData.timezone}
              onChange={(e) => setFormData({...formData, timezone: e.target.value})}
              className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400 transition text-sm [&>option]:bg-[#052b20] [&>option]:text-white"
            >
              <option value="Asia/Karachi">Asia/Karachi (GMT+5)</option>
              <option value="Europe/London">Europe/London (GMT+0)</option>
              <option value="America/New_York">America/New_York (EST)</option>
              <option value="Asia/Dubai">Asia/Dubai (GST)</option>
            </select>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10">
          <h3 className="font-bold text-white mb-4 text-base">Preferences</h3>
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={formData.notifications}
              onChange={(e) => setFormData({...formData, notifications: e.target.checked})}
              className="w-5 h-5 rounded border-white/20 bg-black/40 text-amber-400 accent-amber-400 focus:ring-amber-400"
            />
            <span className="text-sm text-emerald-100/90 font-medium">Receive WhatsApp class reminders 15 minutes before session</span>
          </label>
        </div>

        <div className="pt-8 flex justify-end">
          <button 
            type="submit" 
            disabled={isSaving} 
            className="bg-amber-400 hover:bg-amber-300 text-emerald-950 px-8 py-3.5 rounded-xl font-bold transition w-full md:w-auto disabled:opacity-50 shadow-lg cursor-pointer text-sm"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
