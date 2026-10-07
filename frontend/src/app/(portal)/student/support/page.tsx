"use client";
import { useState } from "react";
import toast from "react-hot-toast";

export default function StudentSupport() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "agent", text: "Hello Yusuf! I'm Ahmed from Support. How can I assist you today?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages([...messages, { sender: "user", text: input }]);
    setInput("");
    
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: "agent", text: "I've received your message. Let me look into that for you right away." }]);
    }, 1000);
  };

  return (
    <div className="p-4 md:p-8 h-full bg-[#F8F9FA] text-[#111827] max-w-4xl mx-auto w-full relative">
      <h1 className="text-3xl font-serif text-[#0C4A3A] mb-8">Support Center</h1>
      
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm relative overflow-hidden transition-all">
          {!chatOpen ? (
            <>
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Chat with us</h2>
              <p className="text-sm text-gray-500 mb-6">Our support team is available 24/7 to help you with scheduling, billing, or technical issues.</p>
              <button onClick={() => setChatOpen(true)} className="w-full bg-[#0C4A3A] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#0D5C46] transition transform hover:scale-105 active:scale-95 shadow-sm">
                Start Live Chat
              </button>
            </>
          ) : (
            <div className="h-64 flex flex-col animate-in fade-in zoom-in-95 duration-300">
              <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="font-bold text-gray-900 text-sm">Live Support</span>
                </div>
                <button onClick={() => setChatOpen(false)} className="text-gray-400 hover:text-gray-900">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 text-sm flex flex-col mb-4">
                {messages.map((m, i) => (
                  <div key={i} className={`p-3 rounded-2xl max-w-[85%] ${m.sender === 'agent' ? 'bg-gray-100 text-gray-800 self-start rounded-tl-sm' : 'bg-[#0C4A3A] text-white self-end rounded-tr-sm'}`}>
                    {m.text}
                  </div>
                ))}
              </div>
              <form onSubmit={handleSend} className="flex gap-2">
                <input 
                  type="text" 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)} 
                  placeholder="Type a message..." 
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#0C4A3A]"
                />
                <button type="submit" className="bg-[#0C4A3A] text-white p-2 rounded-xl hover:bg-[#0D5C46]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
          <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Email Support</h2>
          <p className="text-sm text-gray-500 mb-6">Prefer email? Send us a message and we'll get back to you within 24 hours.</p>
          <button onClick={() => toast.success('Copied support@quranacademy.com to clipboard')} className="w-full bg-blue-50 text-blue-800 px-6 py-3 rounded-xl font-bold hover:bg-blue-100 transition border border-blue-100">
            Copy Email Address
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: "How do I reschedule a class?", a: "You can reschedule up to 24 hours before your class begins via the Classes tab." },
            { q: "What happens if my teacher is absent?", a: "We provide a substitute teacher or automatically credit a makeup class to your account." },
            { q: "How does the Voice Follow work?", a: "Our proprietary classroom highlights the Arabic text exactly as your teacher reads it." }
          ].map((faq, i) => (
            <div key={i} className="p-4 border border-gray-100 rounded-2xl">
              <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
              <p className="text-sm text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
