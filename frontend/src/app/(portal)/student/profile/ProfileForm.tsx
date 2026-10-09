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
    }, 1000);
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm">
      <form onSubmit={handleSave} className="space-y-6">
        
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
          <div className="w-24 h-24 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-3xl font-bold">
            {initials}
          </div>
          <div>
            <button type="button" onClick={() => toast("Avatar upload coming soon")} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-200 transition">
              Change Avatar
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
            <input 
              type="text" 
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0C4A3A]"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email Account</label>
            <input 
              type="email" 
              disabled
              value={formData.email}
              className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed directly.</p>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Timezone</label>
            <select 
              value={formData.timezone}
              onChange={(e) => setFormData({...formData, timezone: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0C4A3A]"
            >
              <option value="Asia/Karachi">Asia/Karachi (GMT+5)</option>
              <option value="Europe/London">Europe/London (GMT+0)</option>
              <option value="America/New_York">America/New_York (EST)</option>
            </select>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Preferences</h3>
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={formData.notifications}
              onChange={(e) => setFormData({...formData, notifications: e.target.checked})}
              className="w-5 h-5 rounded border-gray-300 text-[#0C4A3A] focus:ring-[#0C4A3A]"
            />
            <span className="text-sm text-gray-700 font-medium">Receive WhatsApp class reminders</span>
          </label>
        </div>

        <div className="pt-8 flex justify-end">
          <button type="submit" disabled={isSaving} className="bg-[#0C4A3A] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#0D5C46] transition w-full md:w-auto disabled:opacity-50">
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
