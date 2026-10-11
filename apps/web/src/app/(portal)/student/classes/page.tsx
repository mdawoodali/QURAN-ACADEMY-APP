import Link from "next/link";
import { Calendar, Clock, Video } from "lucide-react";

export default function StudentClasses() {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto w-full text-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif text-white mb-1">My Classes</h1>
          <p className="text-emerald-100/80 text-sm">View upcoming 1-on-1 sessions and schedule changes.</p>
        </div>
        <Link 
          href="/classroom/demo" 
          className="bg-amber-400 text-emerald-950 px-6 py-3 rounded-full font-bold text-sm hover:bg-amber-300 transition shadow-lg flex items-center gap-2"
        >
          <Video className="w-4 h-4" />
          <span>Join Next Class</span>
        </Link>
      </div>
      
      <div className="glass-container rounded-3xl p-6 md:p-8 border border-white/15 shadow-2xl">
        <h2 className="text-xl font-bold font-serif text-white mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-amber-300" />
          <span>Upcoming Schedule</span>
        </h2>
        
        <div className="space-y-4">
          {[
            { day: "Today", time: "17:00 - 17:30", type: "Quran Reading for Kids", teacher: "Ustadha Fatima", active: true },
            { day: "Thursday", time: "17:00 - 17:30", type: "Tajweed & Makharij", teacher: "Ustadha Fatima", active: false },
            { day: "Saturday", time: "11:00 - 11:45", type: "Qaida Lesson 4", teacher: "Shaykh Ali", active: false }
          ].map((cls, i) => (
            <div 
              key={i} 
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 bg-black/35 backdrop-blur-md rounded-2xl border border-white/10 hover:border-amber-400/40 transition-all"
            >
              <div className="flex gap-6 items-center">
                <div className="w-24 text-left sm:text-center shrink-0">
                  <div className={`font-bold ${cls.active ? "text-amber-300" : "text-white"}`}>{cls.day}</div>
                  <div className="text-xs text-emerald-100/70 flex items-center gap-1 mt-0.5 sm:justify-center">
                    <Clock className="w-3 h-3 text-emerald-300/70" />
                    <span>{cls.time}</span>
                  </div>
                </div>
                <div className="w-px h-10 bg-white/15 hidden sm:block"></div>
                <div>
                  <div className="font-bold text-white text-base">{cls.type}</div>
                  <div className="text-sm text-emerald-100/80">{cls.teacher}</div>
                </div>
              </div>
              <div>
                {cls.active ? (
                  <Link 
                    href="/classroom/demo" 
                    className="text-xs font-bold bg-amber-400 text-emerald-950 px-5 py-2.5 rounded-xl hover:bg-amber-300 transition shadow-md inline-flex items-center gap-1.5"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Room</span>
                  </Link>
                ) : (
                  <button className="text-xs font-semibold text-emerald-200/50 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl cursor-not-allowed">
                    Scheduled
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
