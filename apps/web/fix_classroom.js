const fs = require('fs');
let content = fs.readFileSync('src/components/LiveClassroom.tsx', 'utf8');

// 1. Add new state variables
content = content.replace(
  'const [isCameraOn, setIsCameraOn] = useState(false);',
  'const [isMicOn, setIsMicOn] = useState(false);\n  const [isUnlocked, setIsUnlocked] = useState(false);\n  const [showEndModal, setShowEndModal] = useState(false);\n  const [isCameraOn, setIsCameraOn] = useState(false);'
);

// 2. Add End Class Modal inside <main>
content = content.replace(
  /<main className="[^"]+">/,
  `$&
        {/* End Class Modal */}
        {showEndModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95">
              <h2 className="text-xl font-bold text-gray-900 mb-2">End Class?</h2>
              <p className="text-gray-500 mb-6 text-sm">Are you sure you want to end this session? The recording will be saved automatically.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowEndModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition">Cancel</button>
                <button onClick={() => router.push('/student')} className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition">End Session</button>
              </div>
            </div>
          </div>
        )}`
);

// 3. Update End Class Button
content = content.replace(
  `<button onClick={() => router.push('/student')} className="bg-[#b94a48] text-white px-3 md:px-5 py-1.5 rounded-lg font-bold hover:bg-red-800 transition text-xs md:text-sm">`,
  `<button onClick={() => setShowEndModal(true)} className="bg-[#b94a48] text-white px-3 md:px-5 py-1.5 rounded-lg font-bold hover:bg-red-800 transition text-xs md:text-sm">`
);

// 4. Update Mic Button
content = content.replace(
  `<button onClick={() => toast("Mic toggled", { icon: "🎙️" })} className="bg-[#0C4A3A] text-white px-3 md:px-4 py-2 rounded-lg font-bold text-xs">Mic</button>`,
  `<button onClick={() => { setIsMicOn(!isMicOn); toast(isMicOn ? "Mic Muted" : "Mic Unmuted", { icon: "🎙️" }) }} className={\`\${isMicOn ? 'bg-red-500' : 'bg-[#0C4A3A]'} text-white px-3 md:px-4 py-2 rounded-lg font-bold text-xs transition\`}>{isMicOn ? 'Mute' : 'Mic'}</button>`
);

// 5. Update Unlock button and Student Pane pointer events
content = content.replace(
  `<div className="flex-1 flex flex-col items-center justify-center pointer-events-none min-h-0 overflow-y-auto w-full">`,
  `<div className={\`flex-1 flex flex-col items-center justify-center min-h-0 overflow-y-auto w-full \${!isUnlocked ? 'pointer-events-none' : ''}\`}>`
);

content = content.replace(
  `<button onClick={() => toast('Viewport unlocked', { icon: '🔓' })} className="text-emerald-500 cursor-pointer pointer-events-auto hover:underline">Unlock</button>`,
  `<button onClick={() => { setIsUnlocked(true); toast('Student Viewport Unlocked', { icon: '🔓' }); }} className={\`\${isUnlocked ? 'hidden' : 'text-emerald-500 cursor-pointer pointer-events-auto hover:underline'}\`}>Unlock</button>`
);

content = content.replace(
  `<button onClick={() => toast.success('Following teacher sync restored')} className="hover:underline">Follow teacher</button>`,
  `<button onClick={() => { setIsUnlocked(false); toast.success('Following teacher sync restored'); }} className={\`hover:underline \${!isUnlocked ? 'text-[#0C4A3A]' : 'text-emerald-500'}\`}>Follow teacher</button>`
);

// 6. Add student clicking capability to highlight word!
content = content.replace(
  /className=\{`transition-all duration-300 px-2 py-1 rounded-xl /g,
  `onClick={() => isUnlocked && handleTeacherClickWord(i)}\n                      className={\`transition-all duration-300 px-2 py-1 rounded-xl `
);

fs.writeFileSync('src/components/LiveClassroom.tsx', content);
console.log("Fixed LiveClassroom.tsx");
