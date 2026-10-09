import Link from 'next/link'

export default function AdminEnrolments() {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-serif text-[#0C4A3A] mb-8">From trial to recurring classes</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <h3 className="text-sm font-bold text-gray-500 mb-4">Trial requests</h3>
          <div className="text-4xl font-bold text-gray-900 mb-2">18</div>
        </div>
        
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <h3 className="text-sm font-bold text-gray-500 mb-4">Placement reviews</h3>
          <div className="text-4xl font-bold text-gray-900 mb-2">7</div>
        </div>
        
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <h3 className="text-sm font-bold text-gray-500 mb-4">Awaiting payment</h3>
          <div className="text-4xl font-bold text-gray-900 mb-2">5</div>
        </div>
      </div>
      
      <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#D1EBE1] text-[#0C4A3A] text-sm font-bold">
                <th className="p-4">Learner</th>
                <th className="p-4">Programme</th>
                <th className="p-4">Matched teacher</th>
                <th className="p-4">Trial / assessment</th>
                <th className="p-4">Next action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
              <tr className="hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-gray-900">Yusuf Khan</td>
                <td className="p-4">Kids Reading</td>
                <td className="p-4">Maryam Ahmed</td>
                <td className="p-4">Beginner • Qaida 3</td>
                <td className="p-4">
                  <button className="text-[#0C4A3A] font-bold hover:underline">Confirm package</button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-gray-900">Amina Khan</td>
                <td className="p-4">Tajweed</td>
                <td className="p-4">Maryam Ahmed</td>
                <td className="p-4">Intermediate</td>
                <td className="p-4">
                  <button className="text-[#0C4A3A] font-bold hover:underline">Assign weekly slots</button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-gray-900">Omar Ali</td>
                <td className="p-4">Hifz</td>
                <td className="p-4">Bilal Hassan</td>
                <td className="p-4">Revision assessment</td>
                <td className="p-4">
                  <button className="text-[#0C4A3A] font-bold hover:underline">Book trial</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-4 text-center">Teacher choice vs admin assignment is still a client decision. This preview uses admin assignment.</p>
    </div>
  )
}
