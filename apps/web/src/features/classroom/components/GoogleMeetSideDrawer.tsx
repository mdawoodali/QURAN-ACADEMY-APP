"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  Users,
  MessageSquare,
  Info,
  Shield,
  Copy,
  Check,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Hand,
  VolumeX,
  Share2,
  ExternalLink,
  Lock,
  Unlock,
  AlertCircle,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  ChatMessage,
  ClassroomParticipant,
  HostPermissions,
  HandRaise,
} from "../types";

interface GoogleMeetSideDrawerProps {
  activeTab: "info" | "people" | "chat" | "host" | null;
  onClose: () => void;
  role: "teacher" | "student" | "observer";
  currentUserName: string;
  classCode: string;
  chatMessages: ChatMessage[];
  participants: ClassroomParticipant[];
  hostPermissions: HostPermissions;
  handRaises: HandRaise[];
  onSendChatMessage: (text: string) => void;
  onUpdateHostPermissions: (newPermissions: Partial<HostPermissions>) => void;
  onMuteAll: () => void;
  onLowerHand: (participantId: string) => void;
  onLowerAllHands: () => void;
  onEndCallAll: () => void;
}

export default function GoogleMeetSideDrawer({
  activeTab,
  onClose,
  role,
  currentUserName,
  classCode,
  chatMessages,
  participants,
  hostPermissions,
  handRaises,
  onSendChatMessage,
  onUpdateHostPermissions,
  onMuteAll,
  onLowerHand,
  onLowerAllHands,
  onEndCallAll,
}: GoogleMeetSideDrawerProps) {
  const [chatInput, setChatInput] = useState<string>("");
  const [peopleSearch, setPeopleSearch] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedParentLink, setCopiedParentLink] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (activeTab === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, activeTab]);

  if (!activeTab) return null;

  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://quranacademyapp.vercel.app";
  const shareableClassLink = `${origin}/classroom/${classCode}`;
  const parentObserverLink = `${origin}/classroom/${classCode}?role=observer&child=${encodeURIComponent(
    participants.find((p) => p.role === "student")?.name || "Student"
  )}`;

  const handleCopyLink = () => {
    const textToCopy = `Quran Learn Academy Live Classroom\nJoin Class: ${shareableClassLink}\nClass Code: ${classCode}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedLink(true);
      toast.success("Joining info copied to clipboard");
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const handleCopyParentLink = () => {
    const textToCopy = `Quran Learn Academy - Parent Observer Invitation\nJoin Ward's Live Class (Muted): ${parentObserverLink}\nClass Code: ${classCode}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedParentLink(true);
      toast.success("Parent observer link copied");
      setTimeout(() => setCopiedParentLink(false), 2500);
    });
  };

  const handleShareWhatsApp = () => {
    const msg = encodeURIComponent(
      `Assalamu Alaikum! Here is the live Quran classroom joining link:\n${shareableClassLink}\nMeeting Code: ${classCode}`
    );
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    if (!hostPermissions.chatEnabled && role !== "teacher") {
      toast.error("Chat has been disabled by the teacher");
      return;
    }

    onSendChatMessage(chatInput.trim());
    setChatInput("");
  };

  const filteredParticipants = participants.filter((p) =>
    p.name.toLowerCase().includes(peopleSearch.toLowerCase())
  );

  return (
    <aside className="fixed right-0 top-16 bottom-20 w-full sm:w-96 bg-[#202124] border-l border-white/10 shadow-2xl z-40 flex flex-col text-white animate-in slide-in-from-right duration-250">
      {/* Header with Title and Close Button */}
      <div className="h-14 px-5 border-b border-white/10 flex items-center justify-between shrink-0">
        <h2 className="text-base font-semibold text-white/95 flex items-center gap-2">
          {activeTab === "chat" && (
            <>
              <MessageSquare size={18} className="text-amber-400" />
              <span>In-call messages</span>
            </>
          )}
          {activeTab === "people" && (
            <>
              <Users size={18} className="text-emerald-400" />
              <span>People ({participants.length})</span>
            </>
          )}
          {activeTab === "info" && (
            <>
              <Info size={18} className="text-blue-400" />
              <span>Meeting details</span>
            </>
          )}
          {activeTab === "host" && (
            <>
              <Shield size={18} className="text-amber-400" />
              <span>Host controls</span>
            </>
          )}
        </h2>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition cursor-pointer"
          title="Close panel"
        >
          <X size={18} />
        </button>
      </div>

      {/* TAB 1: IN-CALL CHAT */}
      {activeTab === "chat" && (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Banner */}
          <div className="p-3.5 bg-black/30 border-b border-white/5 text-[11px] text-white/60 leading-relaxed">
            Messages can only be seen by people in the call and are deleted when
            the call ends.
          </div>

          {/* Teacher Host Control: Chat permission */}
          {role === "teacher" && (
            <div className="p-3 bg-white/5 border-b border-white/10 flex items-center justify-between text-xs">
              <span className="text-emerald-200 font-medium">
                Let participants send messages
              </span>
              <button
                onClick={() =>
                  onUpdateHostPermissions({
                    chatEnabled: !hostPermissions.chatEnabled,
                  })
                }
                className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                  hostPermissions.chatEnabled ? "bg-emerald-500" : "bg-white/20"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                    hostPermissions.chatEnabled
                      ? "left-5"
                      : "left-1"
                  }`}
                />
              </button>
            </div>
          )}

          {/* Messages List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-0">
            {chatMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-white/40 text-xs py-10">
                <MessageSquare size={32} className="mb-2 opacity-30" />
                <p>No messages yet.</p>
                <p className="text-[10px] text-white/30 mt-1">
                  Say Salam to your teacher and classmates!
                </p>
              </div>
            ) : (
              chatMessages.map((msg) => (
                <div key={msg.id} className="flex flex-col gap-1 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-white/90">
                      {msg.senderName}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                        msg.senderRole === "teacher"
                          ? "bg-emerald-900 text-emerald-300 border border-emerald-500/30"
                          : msg.senderRole === "observer"
                          ? "bg-purple-900 text-purple-300 border border-purple-500/30"
                          : "bg-blue-900 text-blue-300 border border-blue-500/30"
                      }`}
                    >
                      {msg.senderRole === "observer" ? "Parent" : msg.senderRole}
                    </span>
                    <span className="text-[10px] text-white/40 ml-auto font-mono">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="bg-[#2d3033] rounded-2xl rounded-tl-sm px-3.5 py-2 text-white/90 text-xs leading-relaxed break-words border border-white/5">
                    {msg.text}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-3 border-t border-white/10 bg-[#202124]">
            {!hostPermissions.chatEnabled && role !== "teacher" ? (
              <div className="p-2.5 rounded-xl bg-white/5 text-center text-xs text-white/50 border border-white/5 flex items-center justify-center gap-1.5">
                <Lock size={13} />
                <span>Chat is disabled by the teacher</span>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Send a message to everyone"
                  className="flex-1 bg-[#2d3033] hover:bg-[#35383c] focus:bg-[#35383c] border border-white/10 rounded-full px-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white flex items-center justify-center transition cursor-pointer shrink-0 shadow-sm"
                  title="Send message"
                >
                  <Send size={14} />
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PEOPLE / PARTICIPANTS */}
      {activeTab === "people" && (
        <div className="flex-1 flex flex-col min-h-0 p-4">
          {/* Host Mute All Action */}
          {role === "teacher" && (
            <div className="mb-4">
              <button
                onClick={onMuteAll}
                className="w-full bg-white/10 hover:bg-white/15 text-white/90 text-xs font-semibold py-2 px-3 rounded-xl border border-white/10 flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
              >
                <VolumeX size={15} className="text-red-400" />
                <span>Mute All Participants</span>
              </button>
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-3">
            <input
              type="text"
              value={peopleSearch}
              onChange={(e) => setPeopleSearch(e.target.value)}
              placeholder="Search for people"
              className="w-full bg-[#2d3033] border border-white/10 rounded-xl px-3.5 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-emerald-400"
            />
          </div>

          {/* Hand Raises Section if any */}
          {handRaises.length > 0 && (
            <div className="mb-4 p-3 rounded-2xl bg-amber-950/60 border border-amber-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Hand size={14} className="animate-bounce" />
                  <span>Hands Raised ({handRaises.length})</span>
                </span>
                {role === "teacher" && (
                  <button
                    onClick={onLowerAllHands}
                    className="text-[10px] text-amber-200/80 hover:text-white underline cursor-pointer"
                  >
                    Lower All
                  </button>
                )}
              </div>
              <div className="space-y-1.5">
                {handRaises.map((hr) => (
                  <div
                    key={hr.participantId}
                    className="flex items-center justify-between text-xs bg-black/40 px-2.5 py-1.5 rounded-lg"
                  >
                    <span className="text-white font-medium">{hr.participantName}</span>
                    {role === "teacher" && (
                      <button
                        onClick={() => onLowerHand(hr.participantId)}
                        className="text-[10px] bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded cursor-pointer"
                      >
                        Lower Hand
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* In-Call List */}
          <div className="text-[11px] font-bold uppercase tracking-wider text-white/50 mb-2">
            In Call ({filteredParticipants.length})
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 min-h-0 pr-1">
            {filteredParticipants.map((p) => {
              const isSelf = p.name === currentUserName;
              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-[#282a2d] border border-white/5 hover:border-white/15 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-emerald-900 border border-amber-400/40 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
                      {p.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-white truncate">
                          {p.name} {isSelf && "(You)"}
                        </span>
                        {p.role === "teacher" && (
                          <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded-full font-bold">
                            Host
                          </span>
                        )}
                        {p.role === "observer" && (
                          <span className="text-[9px] bg-purple-950 text-purple-300 border border-purple-500/40 px-1.5 py-0.2 rounded-full font-bold">
                            Observer
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-white/50 truncate">
                        {p.role === "observer" ? "Parent (Silent Listening)" : p.role}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 text-white/70">
                    {p.isHandRaised && (
                      <span className="text-amber-400 animate-pulse" title="Hand raised">
                        <Hand size={14} />
                      </span>
                    )}
                    {p.isMicOn ? (
                      <span className="text-emerald-400" title="Microphone is on">
                        <Mic size={15} />
                      </span>
                    ) : (
                      <span className="text-red-400" title="Microphone is off">
                        <MicOff size={15} />
                      </span>
                    )}
                    {p.isCameraOn ? (
                      <span className="text-white/80" title="Camera is on">
                        <Video size={15} />
                      </span>
                    ) : (
                      <span className="text-white/30" title="Camera is off">
                        <VideoOff size={15} />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: MEETING DETAILS & SHARABLE LINKS */}
      {activeTab === "info" && (
        <div className="flex-1 flex flex-col p-5 overflow-y-auto min-h-0 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-white mb-1">
              Joining information
            </h3>
            <p className="text-xs text-white/60 mb-4 leading-relaxed">
              Share this link and class code with your student or parent to meet
              live with zero latency.
            </p>

            {/* Class Code Pill */}
            <div className="p-3 rounded-2xl bg-[#282a2d] border border-white/10 mb-3 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold text-amber-300/80">
                  Meeting Code
                </div>
                <div className="font-mono text-sm font-bold text-white tracking-wide">
                  {classCode}
                </div>
              </div>
              <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                Active
              </span>
            </div>

            {/* Shareable Link Box */}
            <div className="p-3 rounded-2xl bg-[#282a2d] border border-white/10 mb-4">
              <div className="text-[10px] uppercase font-bold text-white/50 mb-1">
                Classroom Web Link
              </div>
              <div className="text-xs font-mono text-emerald-200 truncate mb-3 select-all">
                {shareableClassLink}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedLink ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copiedLink ? "Copied Info!" : "Copy joining info"}</span>
                </button>

                <button
                  onClick={handleShareWhatsApp}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  title="Share directly via WhatsApp"
                >
                  <Share2 size={14} />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          </div>

          {/* Parent Observer Invitation Box */}
          <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30">
            <div className="flex items-center gap-2 mb-2 text-purple-300 font-bold text-xs">
              <Eye size={15} />
              <span>Parent Observer Link</span>
            </div>
            <p className="text-[11px] text-purple-100/70 mb-3 leading-relaxed">
              Parents join in silent observation mode (microphone muted by default)
              so they can follow recitation milestones without feedback or noise.
            </p>
            <button
              onClick={handleCopyParentLink}
              className="w-full bg-purple-900/60 hover:bg-purple-800/80 text-purple-200 border border-purple-400/40 text-xs font-bold py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copiedParentLink ? <Check size={14} className="text-emerald-300" /> : <Copy size={14} />}
              <span>{copiedParentLink ? "Copied Parent Link!" : "Copy Parent Observer Link"}</span>
            </button>
          </div>

          {/* Safety & Protocol Notice */}
          <div className="p-3 rounded-2xl bg-black/30 border border-white/5 text-[11px] text-white/50 leading-relaxed flex items-start gap-2">
            <Shield size={16} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              Classes are encrypted in transit and compliant with academy safeguarding
              regulations.
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: HOST CONTROLS (Google Meet Host Management) */}
      {activeTab === "host" && (
        <div className="flex-1 flex flex-col p-5 overflow-y-auto min-h-0 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-white mb-1">
              Host management
            </h3>
            <p className="text-xs text-white/60 mb-4 leading-relaxed">
              Control permissions and participant capabilities during the live class.
            </p>

            {role !== "teacher" ? (
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 leading-relaxed flex items-start gap-2.5">
                <AlertCircle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  Only the assigned teacher (host) can modify room permissions.
                  You are currently joined as a participant.
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-white/50">
                  Let participants:
                </div>

                {/* 1. Share Whiteboard / Screen */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#282a2d] border border-white/5">
                  <div>
                    <div className="text-xs font-semibold text-white">
                      Interact with Whiteboard
                    </div>
                    <div className="text-[10px] text-white/50">
                      Allow student autonomous drawing & practice
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      onUpdateHostPermissions({
                        whiteboardAllowed: !hostPermissions.whiteboardAllowed,
                      })
                    }
                    className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                      hostPermissions.whiteboardAllowed ? "bg-emerald-500" : "bg-white/20"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                        hostPermissions.whiteboardAllowed ? "left-5" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                {/* 2. Send Chat Messages */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#282a2d] border border-white/5">
                  <div>
                    <div className="text-xs font-semibold text-white">
                      Send chat messages
                    </div>
                    <div className="text-[10px] text-white/50">
                      Allow in-call chat messaging
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      onUpdateHostPermissions({
                        chatEnabled: !hostPermissions.chatEnabled,
                      })
                    }
                    className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                      hostPermissions.chatEnabled ? "bg-emerald-500" : "bg-white/20"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                        hostPermissions.chatEnabled ? "left-5" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                {/* 3. Turn on Microphone */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#282a2d] border border-white/5">
                  <div>
                    <div className="text-xs font-semibold text-white">
                      Turn on microphone
                    </div>
                    <div className="text-[10px] text-white/50">
                      Allow students to unmute themselves
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      onUpdateHostPermissions({
                        micAllowed: !hostPermissions.micAllowed,
                      })
                    }
                    className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                      hostPermissions.micAllowed ? "bg-emerald-500" : "bg-white/20"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                        hostPermissions.micAllowed ? "left-5" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                {/* 4. Turn on Video */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#282a2d] border border-white/5">
                  <div>
                    <div className="text-xs font-semibold text-white">
                      Turn on video
                    </div>
                    <div className="text-[10px] text-white/50">
                      Allow participants to transmit webcam
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      onUpdateHostPermissions({
                        videoAllowed: !hostPermissions.videoAllowed,
                      })
                    }
                    className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                      hostPermissions.videoAllowed ? "bg-emerald-500" : "bg-white/20"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                        hostPermissions.videoAllowed ? "left-5" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Quick Moderation Actions */}
                <div className="pt-4 border-t border-white/10 space-y-2">
                  <button
                    onClick={onMuteAll}
                    className="w-full bg-red-950/60 hover:bg-red-900/80 text-red-200 border border-red-500/30 text-xs font-bold py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <VolumeX size={15} />
                    <span>Mute All Participants Now</span>
                  </button>

                  <button
                    onClick={onEndCallAll}
                    className="w-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>End Meeting for Everyone</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
