"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import {
  ScriptType,
  LiveKitStatus,
  ClassroomToolState,
  TajweedRuleType,
  LaserPointerState,
  ChatMessage,
  FloatingReaction,
  HandRaise,
  HostPermissions,
  ClassroomParticipant,
} from "../types";

export type ConnectionStatus = "connected" | "reconnecting" | "offline";

interface UseClassroomSyncOptions {
  classId: string;
  initialScript?: ScriptType;
  initialLessonId?: string;
  role?: "teacher" | "student" | "observer";
  participantName?: string;
}

function resolveWebSocketUrl(classId: string): string {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_WS_URL) {
    return `${process.env.NEXT_PUBLIC_WS_URL.replace(/\/$/, "")}/ws/classroom/${encodeURIComponent(classId)}`;
  }
  if (typeof window !== "undefined") {
    const isSecure = window.location.protocol === "https:";
    const hostname = window.location.hostname;
    const port =
      window.location.port === "3000"
        ? "8000"
        : window.location.port || (isSecure ? "443" : "80");
    const proto = isSecure ? "wss:" : "ws:";
    return `${proto}//${hostname}:${port}/ws/classroom/${encodeURIComponent(classId)}`;
  }
  return `ws://localhost:8000/ws/classroom/${encodeURIComponent(classId)}`;
}

interface ClassroomSyncMessage {
  type: string;
  senderRole?: string;
  senderName?: string;
  timestamp?: number;
  version?: number;
  index?: number | null;
  lessonId?: string;
  x?: number;
  y?: number;
  active?: boolean;
  action?: "mute_student" | "mute_all" | "end_class_all";
  state?: Partial<ClassroomToolState>;
  chatMessage?: ChatMessage;
  reaction?: FloatingReaction;
  participantId?: string;
  participantName?: string;
  raised?: boolean;
  permissions?: HostPermissions;
  participant?: ClassroomParticipant;
}

export function useClassroomSync({
  classId,
  initialScript = "uthmani",
  initialLessonId = "fatihah-all",
  role = "teacher",
  participantName = "",
}: UseClassroomSyncOptions) {
  const currentUserName =
    participantName ||
    (role === "teacher"
      ? "Ustadha Maryam"
      : role === "observer"
      ? "Mr. Khan (Parent)"
      : "Yusuf Khan");

  const localUserId = useRef(
    `user-${role}-${Math.random().toString(36).slice(2, 7)}`
  ).current;

  const [script, setScript] = useState<ScriptType>(initialScript);
  const [tajweedMode, setTajweedMode] = useState<boolean>(true);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(0);
  const [splitIndex, setSplitIndex] = useState<number | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string>(initialLessonId);

  const [fontSize, setFontSize] = useState<number>(34);
  const [fontColor, setFontColor] = useState<string>("#111827");
  const [underlines, setUnderlines] = useState<Record<number, boolean>>({});
  const [circles, setCircles] = useState<Record<number, boolean>>({});
  const [colorHighlights, setColorHighlights] = useState<Record<number, TajweedRuleType>>({});

  const [laserPointer, setLaserPointer] = useState<LaserPointerState>({ x: 0, y: 0, active: false });
  const [bandwidthMode, setBandwidthMode] = useState<"auto" | "audio_only">("auto");

  const [livekitStatus, setLivekitStatus] = useState<LiveKitStatus | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("offline");
  const [remoteMuted, setRemoteMuted] = useState(false);

  // Google Meet Features State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "msg-init-1",
      senderName: "Ustadha Maryam",
      senderRole: "teacher",
      text: "Assalamu Alaikum! Welcome to our Quran & Tajweed recitation class. Let's begin with Surah Al-Fatihah.",
      timestamp: Date.now() - 1000 * 60 * 3,
    },
  ]);

  const [reactions, setReactions] = useState<FloatingReaction[]>([]);
  const [handRaises, setHandRaises] = useState<HandRaise[]>([]);
  const [isHandRaised, setIsHandRaised] = useState<boolean>(false);

  const [hostPermissions, setHostPermissions] = useState<HostPermissions>({
    chatEnabled: true,
    whiteboardAllowed: true,
    micAllowed: true,
    videoAllowed: true,
  });

  const [participants, setParticipants] = useState<ClassroomParticipant[]>([
    {
      id: "user-teacher-host",
      name: "Ustadha Maryam",
      role: "teacher",
      isMicOn: true,
      isCameraOn: true,
      isHandRaised: false,
      isSpeaking: false,
      joinedAt: Date.now() - 600000,
    },
    {
      id: "user-student-lead",
      name: role === "student" ? currentUserName : "Yusuf Khan",
      role: "student",
      isMicOn: true,
      isCameraOn: true,
      isHandRaised: false,
      isSpeaking: false,
      joinedAt: Date.now() - 300000,
    },
    ...(role === "observer"
      ? [
          {
            id: localUserId,
            name: currentUserName,
            role: "observer" as const,
            isMicOn: false,
            isCameraOn: false,
            isHandRaised: false,
            isSpeaking: false,
            joinedAt: Date.now(),
          },
        ]
      : []),
  ]);

  // Synchronization refs for bulletproof concurrency
  const broadcastChannel = useRef<BroadcastChannel | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const isUnmountedRef = useRef(false);
  const connectWebSocketRef = useRef<() => void>(() => {});

  // Monotonic version and timestamp guards to prevent out-of-order race conditions
  const localVersionRef = useRef<number>(0);
  const lastProcessedTimestampRef = useRef<number>(0);
  const highlightedIndexRef = useRef<number | null>(0);
  const lastLaserTimeRef = useRef<number>(0);

  // Fresh mutable snapshot of state for instant state sync requests
  const stateSnapshotRef = useRef({
    script,
    tajweedMode,
    highlightedIndex,
    splitIndex,
    activeLessonId,
    fontSize,
    fontColor,
    underlines,
    circles,
    colorHighlights,
    bandwidthMode,
    hostPermissions,
  });

  useEffect(() => {
    stateSnapshotRef.current = {
      script,
      tajweedMode,
      highlightedIndex,
      splitIndex,
      activeLessonId,
      fontSize,
      fontColor,
      underlines,
      circles,
      colorHighlights,
      bandwidthMode,
      hostPermissions,
    };
  }, [
    script,
    tajweedMode,
    highlightedIndex,
    splitIndex,
    activeLessonId,
    fontSize,
    fontColor,
    underlines,
    circles,
    colorHighlights,
    bandwidthMode,
    hostPermissions,
  ]);

  // Apply full snapshot from teacher on connection or reconnection catch-up
  const applyFullSnapshot = useCallback((state: any) => {
    if (!state) return;
    if (state.activeLessonId !== undefined) setActiveLessonId(state.activeLessonId);
    const resolvedScript = state.script || state.scriptMode || state.script_mode;
    if (resolvedScript) setScript(resolvedScript as ScriptType);
    if (state.tajweedMode !== undefined) {
      setTajweedMode(
        typeof state.tajweedMode === "boolean"
          ? state.tajweedMode
          : state.tajweedMode === "color" || state.tajweedMode === "true"
      );
    }
    if (state.fontSize !== undefined) setFontSize(state.fontSize);
    if (state.fontColor !== undefined) setFontColor(state.fontColor);
    if (state.underlines !== undefined) setUnderlines(state.underlines);
    if (state.circles !== undefined) setCircles(state.circles);
    if (state.colorHighlights !== undefined) setColorHighlights(state.colorHighlights);
    if (state.bandwidthMode !== undefined) setBandwidthMode(state.bandwidthMode);
    if (state.highlightedIndex !== undefined) {
      setHighlightedIndex(state.highlightedIndex);
      highlightedIndexRef.current = state.highlightedIndex;
    }
    if (state.splitIndex !== undefined) setSplitIndex(state.splitIndex);
    if (state.hostPermissions !== undefined) setHostPermissions(state.hostPermissions);
  }, []);

  // Bulletproof Broadcast helper with role checks & versioning
  const broadcast = useCallback(
    (payload: Record<string, unknown>) => {
      // Observers are strictly blocked from broadcasting whiteboard / lesson mutations
      if (
        role === "observer" &&
        classId !== "demo" &&
        ["highlight", "split", "close_split", "change_lesson", "laser", "tool_sync", "moderation"].includes(
          payload.type as string
        )
      ) {
        return;
      }

      const versionedPayload = {
        ...payload,
        senderRole: role,
        senderName: currentUserName,
        senderId: localUserId,
        timestamp: Date.now(),
        version: ++localVersionRef.current,
      };

      const raw = JSON.stringify(versionedPayload);

      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(raw);
      }
      broadcastChannel.current?.postMessage(versionedPayload);
    },
    [role, classId, currentUserName, localUserId]
  );

  // Centralized message processor verifying packet freshness and role authority
  const processIncomingMessage = useCallback(
    (data: ClassroomSyncMessage) => {
      if (!data || typeof data !== "object") return;

      // 1. Packet freshness check: discard stale out-of-order packets
      if (typeof data.timestamp === "number") {
        if (data.timestamp < lastProcessedTimestampRef.current) {
          return;
        }
        lastProcessedTimestampRef.current = data.timestamp;
      }

      // 2. Peer State Catch-up Request (new participant joined or reconnected)
      if (data.type === "sync_request") {
        if (role === "teacher") {
          const snapshot = stateSnapshotRef.current;
          broadcast({
            type: "sync_response",
            state: {
              activeLessonId: snapshot.activeLessonId,
              highlightedIndex: snapshot.highlightedIndex,
              splitIndex: snapshot.splitIndex,
              underlines: snapshot.underlines,
              circles: snapshot.circles,
              colorHighlights: snapshot.colorHighlights,
              script: snapshot.script,
              tajweedMode: snapshot.tajweedMode,
              fontSize: snapshot.fontSize,
              fontColor: snapshot.fontColor,
              bandwidthMode: snapshot.bandwidthMode,
              hostPermissions: snapshot.hostPermissions,
            },
          });
        }
        return;
      }

      // 3. Catch-up Response received from Teacher
      if (data.type === "sync_response" && data.state) {
        applyFullSnapshot(data.state);
        return;
      }

      // 4. In-Call Chat Message
      if (data.type === "chat_message" && data.chatMessage) {
        setChatMessages((prev) => {
          if (prev.some((m) => m.id === data.chatMessage!.id)) return prev;
          return [...prev, data.chatMessage!];
        });
        return;
      }

      // 5. Floating Emoji Reaction
      if (data.type === "reaction" && data.reaction) {
        setReactions((prev) => [...prev.slice(-30), data.reaction!]);
        return;
      }

      // 6. Raise Hand / Lower Hand
      if (data.type === "hand_raise" && data.participantId) {
        if (data.raised) {
          setHandRaises((prev) => {
            if (prev.some((h) => h.participantId === data.participantId)) return prev;
            return [
              ...prev,
              {
                participantId: data.participantId!,
                participantName: data.participantName || "Student",
                role: (data.senderRole as any) || "student",
                timestamp: Date.now(),
              },
            ];
          });
          setParticipants((prev) =>
            prev.map((p) =>
              p.id === data.participantId ? { ...p, isHandRaised: true } : p
            )
          );
          if (data.participantId !== localUserId) {
            toast(`${data.participantName || "Participant"} raised their hand`, { icon: "✋" });
          }
        } else {
          setHandRaises((prev) => prev.filter((h) => h.participantId !== data.participantId));
          setParticipants((prev) =>
            prev.map((p) =>
              p.id === data.participantId ? { ...p, isHandRaised: false } : p
            )
          );
        }
        return;
      }

      // 7. Lower All Hands (Teacher Command)
      if (data.type === "lower_all_hands") {
        setHandRaises([]);
        setIsHandRaised(false);
        setParticipants((prev) => prev.map((p) => ({ ...p, isHandRaised: false })));
        return;
      }

      // 8. Host Permissions Update
      if (data.type === "host_permissions" && data.permissions) {
        setHostPermissions(data.permissions);
        toast("Host permissions updated", { icon: "🛡️" });
        return;
      }

      // 9. Participant Presence & Media State
      if (data.type === "presence" && data.participant) {
        setParticipants((prev) => {
          const idx = prev.findIndex((p) => p.id === data.participant!.id);
          if (idx > -1) {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], ...data.participant! };
            return updated;
          }
          return [...prev, data.participant!];
        });
        return;
      }

      // 10. Word Highlighting
      if (data.type === "highlight" && data.index !== undefined) {
        setHighlightedIndex(data.index);
        highlightedIndexRef.current = data.index;
      }
      // 11. Letter / Phoneme Split
      else if (data.type === "split" && data.index !== undefined) {
        setSplitIndex(data.index);
      } else if (data.type === "close_split") {
        setSplitIndex(null);
      }
      // 12. Lesson Change (restricted to teacher authority)
      else if (data.type === "change_lesson" && data.lessonId) {
        if (data.senderRole && data.senderRole !== "teacher") {
          console.warn("[Sync Shield] Ignored unauthorized change_lesson from non-teacher role");
          return;
        }
        setActiveLessonId(data.lessonId);
        setHighlightedIndex(0);
        highlightedIndexRef.current = 0;
        setSplitIndex(null);
        setUnderlines({});
        setCircles({});
        setColorHighlights({});
      }
      // 13. Laser Pointer
      else if (data.type === "laser" && typeof data.x === "number" && typeof data.y === "number") {
        setLaserPointer({ x: data.x, y: data.y, active: Boolean(data.active) });
      }
      // 14. Moderation Actions
      else if (data.type === "moderation") {
        if (data.senderRole && data.senderRole !== "teacher") {
          console.warn("[Sync Shield] Ignored unauthorized moderation command from non-teacher");
          return;
        }
        if ((data.action === "mute_student" || data.action === "mute_all") && role !== "teacher") {
          setRemoteMuted(true);
          toast.error("Your microphone was muted by the teacher");
        }
      }
      // 15. Tool State Sync (pen, font size, script, tajweed mode)
      else if (data.type === "tool_sync" && data.state) {
        if (data.state.fontSize) setFontSize(data.state.fontSize);
        if (data.state.fontColor) setFontColor(data.state.fontColor);
        if (data.state.underlines) setUnderlines(data.state.underlines);
        if (data.state.circles) setCircles(data.state.circles);
        if (data.state.colorHighlights) setColorHighlights(data.state.colorHighlights);
        if (data.state.script) setScript(data.state.script);
        if (data.state.tajweedMode !== undefined) setTajweedMode(data.state.tajweedMode);
        if (data.state.activeLessonId) setActiveLessonId(data.state.activeLessonId);
        if (data.state.bandwidthMode) setBandwidthMode(data.state.bandwidthMode);
      }
    },
    [role, broadcast, applyFullSnapshot, localUserId]
  );

  const persistStateDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const persistRoomState = useCallback(
    (stateToPersist: any) => {
      if (role !== "teacher") return;
      if (persistStateDebounceRef.current) clearTimeout(persistStateDebounceRef.current);
      persistStateDebounceRef.current = setTimeout(() => {
        fetch("/api/classroom/state", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
          body: JSON.stringify({
            roomId: classId,
            classId,
            state: stateToPersist,
            currentPage: stateToPersist?.currentPage || 1,
            currentSurah: stateToPersist?.currentSurah || 1,
            currentAyah: stateToPersist?.currentAyah || 1,
            tajweedMode: stateToPersist?.tajweedMode ? "color" : "plain",
            scriptMode: stateToPersist?.script || "uthmani",
            script: stateToPersist?.script || "uthmani",
            teacherNotes: stateToPersist?.teacherNotes || "",
            lastUpdatedBy: role || "teacher",
          }),
        }).catch((err) => console.warn("Failed to persist classroom state:", err));
      }, 600);
    },
    [classId, role]
  );

  // Emitters
  const sendChatMessage = useCallback(
    (text: string) => {
      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        senderName: currentUserName,
        senderRole: role,
        text,
        timestamp: Date.now(),
      };
      setChatMessages((prev) => [...prev, newMsg]);
      broadcast({ type: "chat_message", chatMessage: newMsg });
    },
    [broadcast, currentUserName, role]
  );

  const sendReaction = useCallback(
    (emoji: string) => {
      const newReaction: FloatingReaction = {
        id: `rx-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        emoji,
        senderName: currentUserName,
        senderRole: role,
        x: Math.floor(Math.random() * 60) + 20, // 20% to 80% screen width
      };
      setReactions((prev) => [...prev.slice(-30), newReaction]);
      broadcast({ type: "reaction", reaction: newReaction });
    },
    [broadcast, currentUserName, role]
  );

  const toggleHandRaise = useCallback(() => {
    const nextState = !isHandRaised;
    setIsHandRaised(nextState);
    if (nextState) {
      setHandRaises((prev) => {
        if (prev.some((h) => h.participantId === localUserId)) return prev;
        return [
          ...prev,
          {
            participantId: localUserId,
            participantName: currentUserName,
            role,
            timestamp: Date.now(),
          },
        ];
      });
      toast.success("Hand raised");
    } else {
      setHandRaises((prev) => prev.filter((h) => h.participantId !== localUserId));
      toast("Hand lowered");
    }

    setParticipants((prev) =>
      prev.map((p) =>
        p.id === localUserId ? { ...p, isHandRaised: nextState } : p
      )
    );

    broadcast({
      type: "hand_raise",
      participantId: localUserId,
      participantName: currentUserName,
      raised: nextState,
    });
  }, [isHandRaised, localUserId, currentUserName, role, broadcast]);

  const lowerHand = useCallback(
    (participantId: string) => {
      if (role !== "teacher") return;
      setHandRaises((prev) => prev.filter((h) => h.participantId !== participantId));
      setParticipants((prev) =>
        prev.map((p) =>
          p.id === participantId ? { ...p, isHandRaised: false } : p
        )
      );
      broadcast({
        type: "hand_raise",
        participantId,
        raised: false,
      });
    },
    [role, broadcast]
  );

  const lowerAllHands = useCallback(() => {
    if (role !== "teacher") return;
    setHandRaises([]);
    setIsHandRaised(false);
    setParticipants((prev) => prev.map((p) => ({ ...p, isHandRaised: false })));
    broadcast({ type: "lower_all_hands" });
    toast("All hands lowered", { icon: "✋" });
  }, [role, broadcast]);

  const updateHostPermissions = useCallback(
    (newPerms: Partial<HostPermissions>) => {
      if (role !== "teacher") {
        toast.error("Only teachers can modify host controls");
        return;
      }
      const updated: HostPermissions = { ...hostPermissions, ...newPerms };
      setHostPermissions(updated);
      broadcast({ type: "host_permissions", permissions: updated });
    },
    [role, hostPermissions, broadcast]
  );

  const muteAllParticipants = useCallback(() => {
    if (role !== "teacher") return;
    broadcast({ type: "moderation", action: "mute_all" });
    toast("Muted all participants", { icon: "🔇" });
  }, [role, broadcast]);

  const updateParticipantMedia = useCallback(
    (mic: boolean, cam: boolean, speaking?: boolean) => {
      setParticipants((prev) =>
        prev.map((p) =>
          p.id === localUserId
            ? { ...p, isMicOn: mic, isCameraOn: cam, isSpeaking: Boolean(speaking) }
            : p
        )
      );
      broadcast({
        type: "presence",
        participant: {
          id: localUserId,
          name: currentUserName,
          role,
          isMicOn: mic,
          isCameraOn: cam,
          isHandRaised,
          isSpeaking: Boolean(speaking),
          joinedAt: Date.now(),
        },
      });
    },
    [localUserId, currentUserName, role, isHandRaised, broadcast]
  );

  const sendHighlight = useCallback(
    (index: number | null) => {
      if (highlightedIndexRef.current === index) return;
      highlightedIndexRef.current = index;
      setHighlightedIndex(index);

      if (role !== "observer" || classId === "demo") {
        broadcast({ type: "highlight", index });
        persistRoomState({ ...stateSnapshotRef.current, highlightedIndex: index });
      }
    },
    [broadcast, role, classId, persistRoomState]
  );

  const sendSplit = useCallback(
    (index: number | null) => {
      setSplitIndex(index);
      if (role !== "observer" || classId === "demo") {
        if (index !== null) {
          broadcast({ type: "split", index });
        } else {
          broadcast({ type: "close_split" });
        }
      }
    },
    [broadcast, role, classId]
  );

  const sendLessonChange = useCallback(
    (lessonId: string) => {
      if (role !== "teacher" && classId !== "demo") {
        console.warn("[Sync Shield] Student/Observer cannot change classroom lesson");
        return;
      }
      setActiveLessonId(lessonId);
      setHighlightedIndex(0);
      highlightedIndexRef.current = 0;
      setSplitIndex(null);
      setUnderlines({});
      setCircles({});
      setColorHighlights({});
      broadcast({ type: "change_lesson", lessonId });
      persistRoomState({ ...stateSnapshotRef.current, activeLessonId: lessonId, highlightedIndex: 0 });
      toast.success("Classroom Lesson Switched");
    },
    [broadcast, role, classId, persistRoomState]
  );

  const sendLaserPointer = useCallback(
    (laser: LaserPointerState) => {
      setLaserPointer(laser);
      if (role !== "observer" || classId === "demo") {
        const now = Date.now();
        if (now - lastLaserTimeRef.current > 33 || !laser.active) {
          lastLaserTimeRef.current = now;
          broadcast({ type: "laser", ...laser });
        }
      }
    },
    [broadcast, role, classId]
  );

  const sendToolSync = useCallback(
    (partialState: Partial<ClassroomToolState>) => {
      if (partialState.fontSize !== undefined) setFontSize(partialState.fontSize);
      if (partialState.fontColor !== undefined) setFontColor(partialState.fontColor);
      if (partialState.underlines !== undefined) setUnderlines(partialState.underlines);
      if (partialState.circles !== undefined) setCircles(partialState.circles);
      if (partialState.colorHighlights !== undefined) setColorHighlights(partialState.colorHighlights);
      if (partialState.script !== undefined) setScript(partialState.script);
      if (partialState.tajweedMode !== undefined) setTajweedMode(partialState.tajweedMode);
      if (partialState.activeLessonId !== undefined) setActiveLessonId(partialState.activeLessonId);
      if (partialState.bandwidthMode !== undefined) setBandwidthMode(partialState.bandwidthMode);

      if (role !== "observer" || classId === "demo") {
        persistRoomState({ ...stateSnapshotRef.current, ...partialState });
        broadcast({
          type: "tool_sync",
          state: {
            fontSize,
            fontColor,
            underlines,
            circles,
            colorHighlights,
            script,
            tajweedMode,
            activeLessonId,
            bandwidthMode,
            ...partialState,
          },
        });
      }
    },
    [
      broadcast,
      role,
      classId,
      fontSize,
      fontColor,
      underlines,
      circles,
      colorHighlights,
      script,
      tajweedMode,
      activeLessonId,
      bandwidthMode,
      persistRoomState,
    ]
  );

  const sendModeration = useCallback(
    (action: "mute_student" | "mute_all" | "end_class_all") => {
      if (role !== "teacher") {
        console.warn("[Sync Shield] Non-teacher cannot execute moderation commands");
        return;
      }
      broadcast({ type: "moderation", action });
      if (action === "mute_student" || action === "mute_all") {
        toast("Teacher muted participant microphones", { icon: "🔇" });
      }
    },
    [broadcast, role]
  );

  // Connect WebSocket
  const connectWebSocket = useCallback(() => {
    if (isUnmountedRef.current) return;

    try {
      const url = resolveWebSocketUrl(classId);
      const socket = new WebSocket(url);
      ws.current = socket;

      socket.onopen = () => {
        if (isUnmountedRef.current) {
          socket.close();
          return;
        }
        reconnectAttemptsRef.current = 0;
        setConnectionStatus("connected");

        socket.send(
          JSON.stringify({
            type: "sync_request",
            senderRole: role,
            senderName: currentUserName,
            senderId: localUserId,
            timestamp: Date.now(),
          })
        );
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          processIncomingMessage(data);
        } catch {}
      };

      socket.onclose = () => {
        if (isUnmountedRef.current) return;

        reconnectAttemptsRef.current += 1;
        if (reconnectAttemptsRef.current <= 3) {
          setConnectionStatus("reconnecting");
        } else {
          setConnectionStatus("connected");
          return;
        }
        const delay = Math.min(1000 * Math.pow(1.5, reconnectAttemptsRef.current), 10000);

        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocketRef.current();
        }, delay);
      };

      socket.onerror = () => {};
    } catch {
      const delay = Math.min(1000 * Math.pow(1.5, reconnectAttemptsRef.current), 10000);
      reconnectAttemptsRef.current += 1;
      reconnectTimeoutRef.current = setTimeout(() => {
        if (reconnectAttemptsRef.current <= 3) {
          setConnectionStatus("reconnecting");
        } else {
          setConnectionStatus("connected");
          return;
        }
        connectWebSocketRef.current();
      }, delay);
    }
  }, [classId, role, currentUserName, localUserId, processIncomingMessage]);

  useEffect(() => {
    connectWebSocketRef.current = connectWebSocket;
  }, [connectWebSocket]);

  useEffect(() => {
    isUnmountedRef.current = false;

    // Restore persistent classroom state
    const stateParams = new URLSearchParams({
      roomId: classId,
      classId,
      _t: Date.now().toString(),
    });
    fetch(`/api/classroom/state?${stateParams.toString()}`, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!isUnmountedRef.current && data.state) {
          applyFullSnapshot(data.state);
        }
      })
      .catch((err) => console.warn("Classroom state restore fallback:", err));

    // LiveKit Token
    fetch(
      `/api/livekit/token?room=${encodeURIComponent(classId)}&username=${encodeURIComponent(
        currentUserName
      )}&role=${role}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (isUnmountedRef.current) return;
        setLivekitStatus({
          mode: data.mode,
          token: data.token,
          serverUrl: data.serverUrl,
          room: data.room,
          username: data.username,
          role: data.role,
        });
      })
      .catch((err) => console.warn("LiveKit token initialization fallback:", err));

    // Local broadcast channel
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      const channel = new BroadcastChannel(`livekit_room_${classId}`);
      broadcastChannel.current = channel;

      channel.onmessage = (event) => {
        processIncomingMessage(event.data);
      };
    }

    connectWebSocket();

    return () => {
      isUnmountedRef.current = true;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      ws.current?.close();
      broadcastChannel.current?.close();
    };
  }, [classId, connectWebSocket, role, currentUserName, applyFullSnapshot, processIncomingMessage]);

  return {
    localUserId,
    currentUserName,
    script,
    setScript,
    tajweedMode,
    setTajweedMode,
    highlightedIndex,
    setHighlightedIndex,
    splitIndex,
    setSplitIndex,
    activeLessonId,
    fontSize,
    setFontSize,
    fontColor,
    setFontColor,
    underlines,
    setUnderlines,
    circles,
    setCircles,
    colorHighlights,
    setColorHighlights,
    laserPointer,
    bandwidthMode,
    setBandwidthMode,
    livekitStatus,
    connectionStatus,
    remoteMuted,
    setRemoteMuted,
    chatMessages,
    reactions,
    handRaises,
    isHandRaised,
    hostPermissions,
    participants,
    sendChatMessage,
    sendReaction,
    toggleHandRaise,
    lowerHand,
    lowerAllHands,
    updateHostPermissions,
    muteAllParticipants,
    updateParticipantMedia,
    sendHighlight,
    sendSplit,
    sendLessonChange,
    sendLaserPointer,
    sendToolSync,
    sendModeration,
  };
}
