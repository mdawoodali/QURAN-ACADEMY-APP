import Link from 'next/link'

export default function AdminTeachers() {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-serif text-[#0C4A3A] mb-8">Approve teachers with a clear audit trail</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <h3 className="text-sm font-bold text-gray-500 mb-4">Pending applications</h3>
          <div className="text-4xl font-bold text-gray-900 mb-2">12</div>
        </div>
        
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <h3 className="text-sm font-bold text-gray-500 mb-4">Interviews this week</h3>
          <div className="text-4xl font-bold text-gray-900 mb-2">4</div>
        </div>
        
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <h3 className="text-sm font-bold text-gray-500 mb-4">Bank changes to verify</h3>
          <div className="text-4xl font-bold text-gray-900 mb-2">2</div>
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
              <tr className="hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-gray-900">Maryam Ahmed</td>
                <td className="p-4">Qariah / Ijazah</td>
                <td className="p-4">Interview complete</td>
                <td className="p-4">Verified</td>
                <td className="p-4">
                  <button className="text-[#0C4A3A] font-bold hover:underline">Approve</button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-gray-900">Bilal Hassan</td>
                <td className="p-4">Hafiz</td>
                <td className="p-4">Document review</td>
                <td className="p-4">1 missing</td>
                <td className="p-4">
                  <button className="text-[#0C4A3A] font-bold hover:underline">Request update</button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-gray-900">Zain Ali</td>
                <td className="p-4">Qari</td>
                <td className="p-4">Submitted</td>
                <td className="p-4">Pending</td>
                <td className="p-4">
                  <button className="text-[#0C4A3A] font-bold hover:underline">Review</button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-gray-900">Sara Noor</td>
                <td className="p-4">Alimah</td>
                <td className="p-4">Approved</td>
                <td className="p-4">Verified</td>
                <td className="p-4">
                  <button className="text-[#0C4A3A] font-bold hover:underline">View profile</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-4 text-center">Only approved teachers receive students. Rejection reasons and account status changes are recorded.</p>
    </div>
  )
}
