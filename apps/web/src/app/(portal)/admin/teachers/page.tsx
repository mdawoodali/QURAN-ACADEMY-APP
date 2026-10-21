import { createClient } from '@/utils/supabase/server'
import { approveTeacher } from './actions'
import { connection } from 'next/server'
import { UserCheck, ShieldCheck, FileCheck } from 'lucide-react'

export default async function AdminTeachers() {
  await connection();
  const supabase = await createClient()

  // Fetch all teachers with their profiles
  const { data: teachers } = await supabase
    .from('teacher_details')
    .select(`
      *,
      profiles:id (
        first_name,
        last_name,
        email
      )
    `)
    .order('status', { ascending: false }) // Put pending at the top

  const pendingCount = teachers?.filter(t => t.status === 'pending').length || 0;
  const interviewCount = teachers?.filter(t => t.status === 'interview').length || 0;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full text-white">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-3xl md:text-4xl font-serif text-white">Teacher Vetting & Approvals</h1>
          <span className="flex items-center gap-1 text-[11px] font-bold bg-emerald-950/80 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full">
            <ShieldCheck size={12} />
            <span>Audit Trail Protected</span>
          </span>
        </div>
        <p className="text-emerald-100/80 text-sm">
          Strict vetting desk. Verify Quranic qualifications, Tajweed certifications, and conduct safeguarding checks before approving teacher schedules.
        </p>
      </div>
      
      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-container rounded-3xl p-6 border border-amber-400/30 shadow-xl flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">Pending Applications</div>
            <div className="text-4xl font-bold text-white mb-1">{pendingCount}</div>
            <p className="text-xs text-emerald-100/75">Candidate submissions awaiting review</p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-amber-300 font-semibold">
            Action required before matching
          </div>
        </div>
        
        <div className="glass-container rounded-3xl p-6 border border-white/15 shadow-xl flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2">Interview Stage</div>
            <div className="text-4xl font-bold text-white mb-1">{interviewCount}</div>
            <p className="text-xs text-emerald-100/75">Live Tajweed audition scheduled</p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-emerald-300 font-semibold">
            Makharij & pedagogy check
          </div>
        </div>
        
        <div className="glass-container rounded-3xl p-6 border border-white/15 shadow-xl flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-emerald-100/80 uppercase tracking-wider mb-2">Bank Changes to Verify</div>
            <div className="text-4xl font-bold text-amber-300 mb-1">0</div>
            <p className="text-xs text-emerald-100/75">Accounts verification queue</p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-emerald-100/70 font-semibold">
            All bank details reconciled
          </div>
        </div>
      </div>
      
      {/* Teachers Vetting Table */}
      <div className="glass-container rounded-3xl overflow-hidden border border-white/15 shadow-2xl p-6 md:p-8">
        <h2 className="text-xl font-bold font-serif text-white mb-6 flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-amber-300" />
          <span>Teacher Candidate Audit Register</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-amber-300 text-xs uppercase tracking-wider font-bold">
                <th className="pb-3">Applicant Profile</th>
                <th className="pb-3">Qualification</th>
                <th className="pb-3">Review Stage</th>
                <th className="pb-3">Documents</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-sm">
              {teachers?.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-white/5 transition">
                  <td className="py-4">
                    <div className="font-bold text-white">
                      {teacher.profiles?.first_name} {teacher.profiles?.last_name}
                    </div>
                    <div className="text-xs text-emerald-100/70 font-mono">
                      {teacher.profiles?.email}
                    </div>
                  </td>
                  <td className="py-4 text-emerald-100">{teacher.qualification}</td>
                  <td className="py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      teacher.status === 'approved' ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-500/30' :
                      teacher.status === 'pending' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' :
                      teacher.status === 'rejected' ? 'bg-red-950/80 text-red-300 border border-red-500/30' :
                      'bg-blue-950/80 text-blue-300 border border-blue-500/30'
                    }`}>
                      {teacher.status}
                    </span>
                  </td>
                  <td className="py-4 text-xs text-emerald-300 font-semibold">Verified</td>
                  <td className="py-4 text-right">
                    {teacher.status === 'pending' && (
                      <form action={async () => {
                        'use server';
                        await approveTeacher(teacher.id);
                      }}>
                        <button className="bg-amber-400 hover:bg-amber-300 text-emerald-950 px-4 py-1.5 rounded-lg font-bold text-xs transition shadow-sm cursor-pointer">
                          Approve Application
                        </button>
                      </form>
                    )}
                    {teacher.status === 'approved' && (
                      <span className="text-xs text-emerald-400 font-bold inline-flex items-center gap-1">
                        <UserCheck size={14} />
                        Approved
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              
              {(!teachers || teachers.length === 0) && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-emerald-100/60">
                    No teacher applications currently pending.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-emerald-100/60 mt-4 text-center">
        Only approved teachers receive students. Rejection reasons and account status changes are permanently recorded in the audit log.
      </p>
    </div>
  )
}
