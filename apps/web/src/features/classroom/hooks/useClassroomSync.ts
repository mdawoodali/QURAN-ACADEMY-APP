"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import {
  ScriptType,
  LiveKitStatus,
  ClassroomToolState,
  TajweedRuleType,
  LaserPointerState,
} from "../types";

export type ConnectionStatus = "connected" | "reconnecting" | "offline";

interface UseClassroomSyncOptions {
  classId: string;
  initialScript?: ScriptType;
  initialLessonId?: string;
  role?: "teacher" | "student" | "observer";
}

function resolveWebSocketUrl(classId: string): string {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_WS_URL) {
    return `${process.env.NEXT_PUBLIC_WS_URL.replace(/\/$/, "")}/ws/classroom/${encodeURIComponent(classId)}`;
  }
  if (typeof window !== "undefined") {
    const isSecure = window.location.protocol === "https:";
    const hostname = window.location.hostname;
    // On local development, if frontend is on port 3000, WS backend is on 8000
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
  timestamp?: number;
  version?: number;
  index?: number | null;
  lessonId?: string;
  x?: number;
  y?: number;
  active?: boolean;
  action?: "mute_student" | "end_class_all";
  state?: Partial<ClassroomToolState>;
}

export function useClassroomSync({
  classId,
  initialScript = "uthmani",
  initialLessonId = "fatihah-2",
  role = "teacher",
}: UseClassroomSyncOptions) {
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
  }, []);

  // Bulletproof Broadcast helper with role checks & versioning
  const broadcast = useCallback(
    (payload: Record<string, unknown>) => {
      // Observers (parents in silent monitoring mode) are strictly blocked from broadcasting mutations outside demo mode
      if (role === "observer" && classId !== "demo") {
        return;
      }

      const versionedPayload = {
        ...payload,
        senderRole: role,
        timestamp: Date.now(),
        version: ++localVersionRef.current,
      };

      const raw = JSON.stringify(versionedPayload);

      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(raw);
      }
      broadcastChannel.current?.postMessage(versionedPayload);
    },
    [role, classId]
  );

  // Centralized message processor verifying packet freshness and role authority
  const processIncomingMessage = useCallback(
    (data: ClassroomSyncMessage) => {
      if (!data || typeof data !== "object") return;

      // 1. Packet freshness check: discard stale out-of-order packets
      if (typeof data.timestamp === "number") {
        if (data.timestamp < lastProcessedTimestampRef.current) {
          // Packet arrived out of order (network jitter) — discard
          return;
        }
        lastProcessedTimestampRef.current = data.timestamp;
      }

      // 2. Peer State Catch-up Request (new participant joined or reconnected)
      if (data.type === "sync_request") {
        if (role === "teacher") {
          // The teacher is the authoritative source of truth. Send full current snapshot.
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

      // 4. Word Highlighting
      if (data.type === "highlight" && data.index !== undefined) {
        setHighlightedIndex(data.index);
        highlightedIndexRef.current = data.index;
      }
      // 5. Letter / Phoneme Split
      else if (data.type === "split" && data.index !== undefined) {
        setSplitIndex(data.index);
      } else if (data.type === "close_split") {
        setSplitIndex(null);
      }
      // 6. Lesson Change (strictly restricted to teacher authority)
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
      // 7. Laser Pointer
      else if (data.type === "laser" && typeof data.x === "number" && typeof data.y === "number") {
        setLaserPointer({ x: data.x, y: data.y, active: Boolean(data.active) });
      }
      // 8. Moderation Actions (strictly restricted to teacher authority)
      else if (data.type === "moderation") {
        if (data.senderRole && data.senderRole !== "teacher") {
          console.warn("[Sync Shield] Ignored unauthorized moderation command from non-teacher");
          return;
        }
        if (data.action === "mute_student" && role === "student") {
          setRemoteMuted(true);
          toast.error("Your microphone was muted by the teacher");
        }
      }
      // 9. Tool State Sync (pen, font size, script, tajweed mode)
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
    [role, broadcast, applyFullSnapshot]
  );

  const persistStateDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const persistRoomState = useCallback((stateToPersist: any) => {
    if (role !== 'teacher') return;
    if (persistStateDebounceRef.current) clearTimeout(persistStateDebounceRef.current);
    persistStateDebounceRef.current = setTimeout(() => {
      fetch('/api/classroom/state', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
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
      }).catch((err) => console.warn('Failed to persist classroom state:', err));
    }, 600);
  }, [classId, role]);

  // Emitters with anti-spam deduplication & throttling
  const sendHighlight = useCallback(
    (index: number | null) => {
      // Thwart button mashing / duplicate highlight spam
      if (highlightedIndexRef.current === index) return;
      highlightedIndexRef.current = index;
      setHighlightedIndex(index);

      // In demo mode or for active participants, broadcast and persist
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
      // Only teachers can change the curriculum lesson (or anyone in interactive demo mode)
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
        // Throttle mouse / touch drag stream to 30fps (33ms) to avoid mobile network saturation
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
    (action: "mute_student" | "end_class_all") => {
      if (role !== "teacher") {
        console.warn("[Sync Shield] Non-teacher cannot execute moderation commands");
        return;
      }
      broadcast({ type: "moderation", action });
      if (action === "mute_student") {
        toast("Teacher muted student microphone", { icon: "🔇" });
      }
    },
    [broadcast, role]
  );

  // Connect WebSocket with resilient backoff and automatic state re-hydration
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

        // Immediately request authoritative state sync upon connecting/reconnecting
        socket.send(
          JSON.stringify({
            type: "sync_request",
            senderRole: role,
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

      socket.onerror = () => {
        // Handled in onclose
      };
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
  }, [classId, role, processIncomingMessage]);

  useEffect(() => {
    connectWebSocketRef.current = connectWebSocket;
  }, [connectWebSocket]);

  useEffect(() => {
    isUnmountedRef.current = false;

    // 0. Restore persistent classroom state from Supabase
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
      .catch((err) => console.warn('Classroom state restore fallback:', err));

    // 1. Fetch LiveKit Token from server
    fetch(
      `/api/livekit/token?room=${encodeURIComponent(classId)}&username=${
        role === "teacher" ? "Teacher" : role === "observer" ? "Parent" : "Student"
      }&role=${role}`
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
        // LiveKit connected silently without technical toast
      })
      .catch((err) => console.warn("LiveKit token initialization fallback:", err));

    // 2. Set up cross-tab / cross-window broadcast channel (local machine fallback)
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      const channel = new BroadcastChannel(`livekit_room_${classId}`);
      broadcastChannel.current = channel;

      channel.onmessage = (event) => {
        processIncomingMessage(event.data);
      };
    }

    // 3. Start resilient WebSocket connection
    connectWebSocket();

    return () => {
      isUnmountedRef.current = true;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      ws.current?.close();
      broadcastChannel.current?.close();
    };
  }, [classId, connectWebSocket, role, processIncomingMessage]);

  return {
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
    sendHighlight,
    sendSplit,
    sendLessonChange,
    sendLaserPointer,
    sendToolSync,
    sendModeration,
  };
}
