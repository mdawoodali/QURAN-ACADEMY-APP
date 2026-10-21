export default function ClassroomLoading() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#F8F9FA] text-[#0C4A3A]">
      <div className="w-12 h-12 border-4 border-emerald-200 border-t-[#0C4A3A] rounded-full animate-spin mb-4" />
      <h3 className="text-base font-bold text-gray-800">Initializing Live Interactive Classroom...</h3>
      <p className="text-xs text-gray-400 mt-1">Connecting Mushaf board, audio streams, and real-time synchronization</p>
    </div>
  );
}
