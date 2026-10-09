import Link from 'next/link'

export default function TeacherEarnings() {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-serif text-[#0C4A3A] mb-8">Teacher earnings with transparent records</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-3xl p-6 border-2 border-[#0C4A3A] shadow-sm flex flex-col justify-between">
          <h3 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Pay model to confirm</h3>
          <div className="text-2xl font-bold text-gray-900">Per class / hour</div>
        </div>
        
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between opacity-70">
          <h3 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Alternative models</h3>
          <div className="text-2xl font-bold text-gray-900">Per student / fixed</div>
        </div>
        
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <h3 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Bank transfer outside app</h3>
          <div className="text-2xl font-bold text-gray-900">Statement + reference</div>
        </div>
      </div>
      
      <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#D1EBE1] text-[#0C4A3A] text-sm font-bold">
                <th className="p-4">Period</th>
                <th className="p-4">Completed classes</th>
                <th className="p-4">Adjustments</th>
                <th className="p-4">Payable</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
              <tr className="hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-gray-900">September 2026</td>
                <td className="p-4">64</td>
                <td className="p-4">PKR 0</td>
                <td className="p-4 font-bold">PKR 32,000</td>
                <td className="p-4">
                  <span className="text-[#0C4A3A] font-bold">Pending</span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-gray-900">August 2026</td>
                <td className="p-4">60</td>
                <td className="p-4">PKR -500</td>
                <td className="p-4 font-bold">PKR 29,500</td>
                <td className="p-4">
                  <span className="text-[#0C4A3A] font-bold">Paid</span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-gray-900">July 2026</td>
                <td className="p-4">58</td>
                <td className="p-4">PKR 0</td>
                <td className="p-4 font-bold">PKR 29,000</td>
                <td className="p-4">
                  <span className="text-[#0C4A3A] font-bold">Paid</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-4 text-center">Missed-class deductions and manual adjustments need reasons. Bank changes return to Accounts for verification.</p>
    </div>
  )
}
