"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import { ScriptType, LiveKitStatus, ClassroomToolState, TajweedRuleType, LaserPointerState } from "../types";

export type ConnectionStatus = "connected" | "reconnecting" | "offline";

interface UseClassroomSyncOptions {
  classId: string;
  initialScript?: ScriptType;
  initialLessonId?: string;
  role?: "teacher" | "student" | "observer";
}

export function useClassroomSync({
  classId,
  initialScript = "uthmani",
  initialLessonId = "fatihah-2",
  role = "teacher"
}: UseClassroomSyncOptions) {
  const [script, setScript] = useState<ScriptType>(initialScript);
  const [tajweedMode, setTajweedMode] = useState<boolean>(true);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(0);
  const [splitIndex, setSplitIndex] = useState<number | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string>(initialLessonId);

  const [fontSize, setFontSize] = useState<number>(48);
  const [fontColor, setFontColor] = useState<string>("#111827");
  const [underlines, setUnderlines] = useState<Record<number, boolean>>({});
  const [circles, setCircles] = useState<Record<number, boolean>>({});
  const [colorHighlights, setColorHighlights] = useState<Record<number, TajweedRuleType>>({});

  const [laserPointer, setLaserPointer] = useState<LaserPointerState>({ x: 0, y: 0, active: false });
  const [bandwidthMode, setBandwidthMode] = useState<"auto" | "audio_only">("auto");

  const [livekitStatus, setLivekitStatus] = useState<LiveKitStatus | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("offline");
  const [remoteMuted, setRemoteMuted] = useState(false);

  const broadcastChannel = useRef<BroadcastChannel | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const isUnmountedRef = useRef(false);
  const connectWebSocketRef = useRef<() => void>(() => {});

  // Broadcast helper
  const broadcast = useCallback((payload: Record<string, unknown>) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(payload));
    }
    broadcastChannel.current?.postMessage(payload);
  }, []);

  const sendHighlight = useCallback((index: number | null) => {
    setHighlightedIndex(index);
    broadcast({ type: "highlight", index });
  }, [broadcast]);

  const sendSplit = useCallback((index: number | null) => {
    setSplitIndex(index);
    if (index !== null) {
      broadcast({ type: "split", index });
    } else {
      broadcast({ type: "close_split" });
    }
  }, [broadcast]);

  const sendLessonChange = useCallback((lessonId: string) => {
    setActiveLessonId(lessonId);
    setHighlightedIndex(0);
    setSplitIndex(null);
    setUnderlines({});
    setCircles({});
    setColorHighlights({});
    broadcast({ type: "change_lesson", lessonId });
    toast.success("Classroom Lesson Switched");
  }, [broadcast]);

  const sendLaserPointer = useCallback((laser: LaserPointerState) => {
    setLaserPointer(laser);
    broadcast({ type: "laser", ...laser });
  }, [broadcast]);

  const sendToolSync = useCallback((partialState: Partial<ClassroomToolState>) => {
    if (partialState.fontSize !== undefined) setFontSize(partialState.fontSize);
    if (partialState.fontColor !== undefined) setFontColor(partialState.fontColor);
    if (partialState.underlines !== undefined) setUnderlines(partialState.underlines);
    if (partialState.circles !== undefined) setCircles(partialState.circles);
    if (partialState.colorHighlights !== undefined) setColorHighlights(partialState.colorHighlights);
    if (partialState.script !== undefined) setScript(partialState.script);
    if (partialState.tajweedMode !== undefined) setTajweedMode(partialState.tajweedMode);
    if (partialState.activeLessonId !== undefined) setActiveLessonId(partialState.activeLessonId);
    if (partialState.bandwidthMode !== undefined) setBandwidthMode(partialState.bandwidthMode);

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
        ...partialState
      }
    });
  }, [broadcast, fontSize, fontColor, underlines, circles, colorHighlights, script, tajweedMode, activeLessonId, bandwidthMode]);

  const sendModeration = useCallback((action: "mute_student" | "end_class_all") => {
    broadcast({ type: "moderation", action });
    if (action === "mute_student") {
      toast("Teacher muted student microphone", { icon: "🔇" });
    }
  }, [broadcast]);

  // Connect WebSocket with resilient exponential backoff
  const connectWebSocket = useCallback(() => {
    if (isUnmountedRef.current) return;

    try {
      const socket = new WebSocket(`ws://localhost:8000/ws/classroom/${classId}`);
      ws.current = socket;

      socket.onopen = () => {
        if (isUnmountedRef.current) {
          socket.close();
          return;
        }
        reconnectAttemptsRef.current = 0;
        setConnectionStatus("connected");
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "highlight") setHighlightedIndex(data.index);
          else if (data.type === "split") setSplitIndex(data.index);
          else if (data.type === "close_split") setSplitIndex(null);
          else if (data.type === "change_lesson") {
            setActiveLessonId(data.lessonId);
            setHighlightedIndex(0);
            setSplitIndex(null);
          } else if (data.type === "laser") {
            setLaserPointer({ x: data.x, y: data.y, active: data.active });
          } else if (data.type === "moderation" && data.action === "mute_student") {
            if (role === "student") {
              setRemoteMuted(true);
              toast.error("Your microphone was muted by the teacher");
            }
          } else if (data.type === "tool_sync" && data.state) {
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
        } catch {}
      };

      socket.onclose = () => {
        if (isUnmountedRef.current) return;
        setConnectionStatus("reconnecting");
        const delay = Math.min(1000 * Math.pow(1.5, reconnectAttemptsRef.current), 10000);
        reconnectAttemptsRef.current += 1;
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
        setConnectionStatus("offline");
        connectWebSocketRef.current();
      }, delay);
    }
  }, [classId, role]);

  useEffect(() => {
    connectWebSocketRef.current = connectWebSocket;
  }, [connectWebSocket]);

  useEffect(() => {
    isUnmountedRef.current = false;

    // 1. Fetch LiveKit Token from server
    fetch(`/api/livekit/token?room=${encodeURIComponent(classId)}&username=${role === "teacher" ? "Teacher" : "Student"}&role=${role}`)
      .then((res) => res.json())
      .then((data) => {
        if (isUnmountedRef.current) return;
        setLivekitStatus({ mode: data.mode, token: data.token, serverUrl: data.serverUrl, room: data.room, username: data.username, role: data.role });
        if (data.mode === "live") {
          toast.success(`LiveKit Cloud WebRTC connected: Room ${data.room}`);
        }
      })
      .catch((err) => console.warn("LiveKit token initialization fallback:", err));

    // 2. Set up cross-tab / cross-window broadcast channel
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      const channel = new BroadcastChannel(`livekit_room_${classId}`);
      broadcastChannel.current = channel;

      channel.onmessage = (event) => {
        try {
          const data = event.data;
          if (data.type === "highlight") setHighlightedIndex(data.index);
          else if (data.type === "split") setSplitIndex(data.index);
          else if (data.type === "close_split") setSplitIndex(null);
          else if (data.type === "change_lesson") {
            setActiveLessonId(data.lessonId);
            setHighlightedIndex(0);
            setSplitIndex(null);
          } else if (data.type === "laser") {
            setLaserPointer({ x: data.x, y: data.y, active: data.active });
          } else if (data.type === "moderation" && data.action === "mute_student") {
            if (role === "student") {
              setRemoteMuted(true);
              toast.error("Your microphone was muted by the teacher");
            }
          } else if (data.type === "tool_sync" && data.state) {
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
        } catch {}
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
  }, [classId, connectWebSocket, role]);

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
    sendModeration
  };
}
