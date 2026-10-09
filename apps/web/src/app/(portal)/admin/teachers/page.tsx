import { createClient } from '@/utils/supabase/server'
import { approveTeacher, rejectTeacher } from './actions'
import { connection } from 'next/server'

export default async function AdminTeachers() {
  await connection();
  const supabase = await createClient()

  // Fetch all teachers with their profiles
  const { data: teachers, error } = await supabase
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
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-serif text-[#0C4A3A] mb-8">Approve teachers with a clear audit trail</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <h3 className="text-sm font-bold text-gray-500 mb-4">Pending applications</h3>
          <div className="text-4xl font-bold text-gray-900 mb-2">{pendingCount}</div>
        </div>
        
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <h3 className="text-sm font-bold text-gray-500 mb-4">Interviews</h3>
          <div className="text-4xl font-bold text-gray-900 mb-2">{interviewCount}</div>
        </div>
        
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <h3 className="text-sm font-bold text-gray-500 mb-4">Bank changes to verify</h3>
          <div className="text-4xl font-bold text-gray-900 mb-2">0</div>
        </div>
      </div>
      
      <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#D1EBE1] text-[#0C4A3A] text-sm font-bold">
                <th className="p-4">Applicant</th>
                <th className="p-4">Qualification</th>
                <th className="p-4">Review stage</th>
                <th className="p-4">Documents</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
              {teachers?.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-gray-900">
                    {teacher.profiles?.first_name} {teacher.profiles?.last_name}<br/>
                    <span className="text-xs text-gray-500 font-normal">{teacher.profiles?.email}</span>
                  </td>
                  <td className="p-4">{teacher.qualification}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      teacher.status === 'approved' ? 'bg-green-100 text-green-800' :
                      teacher.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      teacher.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {teacher.status}
                    </span>
                  </td>
                  <td className="p-4">Verified</td>
                  <td className="p-4">
                    {teacher.status === 'pending' && (
                      <form action={async () => {
                        'use server';
                        await approveTeacher(teacher.id);
                      }}>
                        <button className="text-[#0C4A3A] font-bold hover:underline">Approve</button>
                      </form>
                    )}
                    {teacher.status === 'approved' && (
                      <button className="text-gray-400 font-bold" disabled>Approved</button>
                    )}
                  </td>
                </tr>
              ))}
              
              {(!teachers || teachers.length === 0) && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">No teachers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-4 text-center">Only approved teachers receive students. Rejection reasons and account status changes are recorded.</p>
    </div>
  )
}
