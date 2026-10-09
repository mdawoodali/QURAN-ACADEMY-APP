import Link from "next/link";

export default function StudentClasses() {
  return (
    <div className="p-8 h-full bg-[#F8F9FA] text-[#111827]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-[#0C4A3A]">My Classes</h1>
        <Link href="/classroom/123" className="bg-[#0C4A3A] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-[#0D5C46] transition">
          Join Next Class
        </Link>
      </div>
      
      <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Upcoming Schedule</h2>
        
        <div className="space-y-4">
          {[
            { day: "Today", time: "15:00 - 15:30", type: "Tajweed Lesson", teacher: "Ustadha Fatima" },
            { day: "Thursday", time: "15:00 - 15:30", type: "Hifz Review", teacher: "Ustadha Fatima" },
            { day: "Saturday", time: "10:00 - 10:45", type: "Islamic Studies", teacher: "Shaykh Ali" }
          ].map((cls, i) => (
            <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex gap-6 items-center">
                <div className="w-20 text-center">
                  <div className="font-bold text-gray-900">{cls.day}</div>
                  <div className="text-xs text-gray-500">{cls.time}</div>
                </div>
                <div className="w-px h-8 bg-gray-200 hidden md:block"></div>
                <div>
                  <div className="font-bold text-[#0C4A3A]">{cls.type}</div>
                  <div className="text-sm text-gray-500">{cls.teacher}</div>
                </div>
              </div>
              {i === 0 ? (
                <Link href="/classroom/123" className="text-xs font-bold bg-emerald-100 text-emerald-800 px-4 py-2 rounded-lg hover:bg-emerald-200 transition">
                  Join Room
                </Link>
              ) : (
                <button className="text-xs font-bold text-gray-400 bg-gray-100 px-4 py-2 rounded-lg cursor-not-allowed">
                  Waiting
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
