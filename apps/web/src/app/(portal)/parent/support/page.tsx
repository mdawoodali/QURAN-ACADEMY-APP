import Link from 'next/link'

export default function SupportPage() {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-serif text-[#0C4A3A] mb-8">Help and safeguarding are easy to reach</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between cursor-pointer hover:border-[#0C4A3A] transition">
          <h3 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">In-app / WhatsApp</h3>
          <div className="text-2xl font-bold text-gray-900">Contact academy</div>
        </div>
        
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between cursor-pointer hover:border-[#0C4A3A] transition">
          <h3 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Silent classroom access</h3>
          <div className="text-2xl font-bold text-gray-900">Parent observer</div>
        </div>
        
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <h3 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Contact details restricted</h3>
          <div className="text-2xl font-bold text-gray-900">Privacy by role</div>
        </div>
      </div>
      
      <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#D1EBE1] text-[#0C4A3A] text-sm font-bold">
                <th className="p-4">Request</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4">Last update</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
              <tr className="hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-gray-900">Lesson time query</td>
                <td className="p-4">Scheduling</td>
                <td className="p-4 font-bold text-gray-900">Open</td>
                <td className="p-4">Today</td>
                <td className="p-4">
                  <button className="text-[#0C4A3A] font-bold hover:underline">View ticket</button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-gray-900">Audio issue</td>
                <td className="p-4">Classroom</td>
                <td className="p-4 text-gray-500">Resolved</td>
                <td className="p-4">Yesterday</td>
                <td className="p-4">
                  <button className="text-[#0C4A3A] font-bold hover:underline">View reply</button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-gray-900">Report a concern</td>
                <td className="p-4">Safeguarding</td>
                <td className="p-4 text-gray-500">Private channel</td>
                <td className="p-4">Academy team</td>
                <td className="p-4">
                  <button className="text-[#0C4A3A] font-bold hover:underline">Open form</button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-gray-900">Teacher feedback</td>
                <td className="p-4">Lesson quality</td>
                <td className="p-4 text-gray-500">Ready to submit</td>
                <td className="p-4">After class</td>
                <td className="p-4">
                  <button className="text-[#0C4A3A] font-bold hover:underline">Rate lesson</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-4 text-center">Proposed: teacher contact stays inside the platform; student/parent phone, email and address are hidden.</p>
    </div>
  )
}
