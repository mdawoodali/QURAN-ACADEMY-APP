import Link from 'next/link'

export default function AdminReports() {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-serif text-[#0C4A3A] mb-8">Turn activity into usable reports</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <h3 className="text-sm font-bold text-gray-500 mb-2">Disclosed observer access: 5</h3>
          <div className="text-2xl font-bold text-gray-900">Live class monitor</div>
        </div>
        
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <h3 className="text-sm font-bold text-gray-500 mb-2">Proposed success measure</h3>
          <div className="text-2xl font-bold text-gray-900">Trial &rarr; paid</div>
        </div>
        
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <h3 className="text-sm font-bold text-gray-500 mb-2">Proposed success measures</h3>
          <div className="text-2xl font-bold text-gray-900">Payments / onboarding</div>
        </div>
      </div>
      
      <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#D1EBE1] text-[#0C4A3A] text-sm font-bold">
                <th className="p-4">Report</th>
                <th className="p-4">Period / filter</th>
                <th className="p-4">Measure</th>
                <th className="p-4">Format</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
              <tr className="hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-gray-900">Enrolment</td>
                <td className="p-4">Programme / teacher / country</td>
                <td className="p-4">Students per teacher</td>
                <td className="p-4">Excel / CSV</td>
                <td className="p-4">
                  <button className="text-[#0C4A3A] font-bold hover:underline">Export</button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-gray-900">Attendance</td>
                <td className="p-4">Scheduled / live / completed</td>
                <td className="p-4">Missed by student / teacher</td>
                <td className="p-4">Excel / CSV</td>
                <td className="p-4">
                  <button className="text-[#0C4A3A] font-bold hover:underline">Export</button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-gray-900">Revenue</td>
                <td className="p-4">Currency / payment status</td>
                <td className="p-4">Collected / overdue</td>
                <td className="p-4">Excel / CSV</td>
                <td className="p-4">
                  <button className="text-[#0C4A3A] font-bold hover:underline">Export</button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-gray-900">Teacher performance</td>
                <td className="p-4">Teaching load / ratings</td>
                <td className="p-4">Attendance / progress</td>
                <td className="p-4">Excel / CSV</td>
                <td className="p-4">
                  <button className="text-[#0C4A3A] font-bold hover:underline">Export</button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-gray-900">Retention</td>
                <td className="p-4">Cohort / three months</td>
                <td className="p-4">Active / retained learners</td>
                <td className="p-4">Excel / CSV</td>
                <td className="p-4">
                  <button className="text-[#0C4A3A] font-bold hover:underline">Export</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-4 text-center">Actual performance, conversion and retention must be measured after launch; sample screens show no proven results.</p>
    </div>
  )
}
