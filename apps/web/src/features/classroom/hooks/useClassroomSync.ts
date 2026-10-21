"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import { ScriptType, LiveKitStatus, ClassroomToolState } from "../types";

export type ConnectionStatus = "connected" | "reconnecting" | "offline";

interface UseClassroomSyncOptions {
  classId: string;
  initialScript?: ScriptType;
}

export function useClassroomSync({ classId, initialScript = "uthmani" }: UseClassroomSyncOptions) {
  const [script, setScript] = useState<ScriptType>(initialScript);
  const [tajweedMode, setTajweedMode] = useState<boolean>(true);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(0);
  const [splitIndex, setSplitIndex] = useState<number | null>(null);

  const [fontSize, setFontSize] = useState<number>(48);
  const [fontColor, setFontColor] = useState<string>("#111827");
  const [underlines, setUnderlines] = useState<Record<number, boolean>>({});
  const [circles, setCircles] = useState<Record<number, boolean>>({});

  const [livekitStatus, setLivekitStatus] = useState<LiveKitStatus | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("offline");

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

  const sendToolSync = useCallback((partialState: Partial<ClassroomToolState>) => {
    if (partialState.fontSize !== undefined) setFontSize(partialState.fontSize);
    if (partialState.fontColor !== undefined) setFontColor(partialState.fontColor);
    if (partialState.underlines !== undefined) setUnderlines(partialState.underlines);
    if (partialState.circles !== undefined) setCircles(partialState.circles);
    if (partialState.script !== undefined) setScript(partialState.script);
    if (partialState.tajweedMode !== undefined) setTajweedMode(partialState.tajweedMode);

    broadcast({
      type: "tool_sync",
      state: {
        fontSize,
        fontColor,
        underlines,
        circles,
        script,
        tajweedMode,
        ...partialState
      }
    });
  }, [broadcast, fontSize, fontColor, underlines, circles, script, tajweedMode]);

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
          else if (data.type === "tool_sync" && data.state) {
            if (data.state.fontSize) setFontSize(data.state.fontSize);
            if (data.state.fontColor) setFontColor(data.state.fontColor);
            if (data.state.underlines) setUnderlines(data.state.underlines);
            if (data.state.circles) setCircles(data.state.circles);
            if (data.state.script) setScript(data.state.script);
            if (data.state.tajweedMode !== undefined) setTajweedMode(data.state.tajweedMode);
          }
        } catch {}
      };

      socket.onclose = () => {
        if (isUnmountedRef.current) return;
        setConnectionStatus("reconnecting");
        // Exponential backoff capped at 10 seconds
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
  }, [classId]);

  useEffect(() => {
    connectWebSocketRef.current = connectWebSocket;
  }, [connectWebSocket]);

  useEffect(() => {
    isUnmountedRef.current = false;

    // 1. Fetch LiveKit Token from server
    fetch(`/api/livekit/token?room=${encodeURIComponent(classId)}&username=Teacher&role=teacher`)
      .then((res) => res.json())
      .then((data) => {
        if (isUnmountedRef.current) return;
        setLivekitStatus({ mode: data.mode, token: data.token, serverUrl: data.serverUrl });
        if (data.mode === "live") {
          toast.success(`LiveKit Cloud Connected: Room ${data.room}`);
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
          else if (data.type === "tool_sync" && data.state) {
            if (data.state.fontSize) setFontSize(data.state.fontSize);
            if (data.state.fontColor) setFontColor(data.state.fontColor);
            if (data.state.underlines) setUnderlines(data.state.underlines);
            if (data.state.circles) setCircles(data.state.circles);
            if (data.state.script) setScript(data.state.script);
            if (data.state.tajweedMode !== undefined) setTajweedMode(data.state.tajweedMode);
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
  }, [classId, connectWebSocket]);

  return {
    script,
    setScript,
    tajweedMode,
    setTajweedMode,
    highlightedIndex,
    setHighlightedIndex,
    splitIndex,
    setSplitIndex,
    fontSize,
    setFontSize,
    fontColor,
    setFontColor,
    underlines,
    setUnderlines,
    circles,
    setCircles,
    livekitStatus,
    connectionStatus,
    sendHighlight,
    sendSplit,
    sendToolSync
  };
}
