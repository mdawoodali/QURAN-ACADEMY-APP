import { createClient } from "@/utils/supabase/client";

export interface OfflineAction {
  id: string;
  type: "INSERT" | "UPDATE" | "UPSERT";
  table: string;
  payload: any;
  filter?: { column: string; value: any };
  timestamp: number;
}

const OFFLINE_QUEUE_KEY = "quran_academy_offline_sync_queue";
const SYNC_CHANNEL_NAME = "quran_academy_sync_channel";

// Inter-tab broadcast channel for 0ms synchronized UI across open tabs
let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== "undefined" && "BroadcastChannel" in window) {
  try {
    broadcastChannel = new BroadcastChannel(SYNC_CHANNEL_NAME);
  } catch (e) {
    console.warn("[SafeSync] BroadcastChannel not supported in this environment:", e);
  }
}

/**
 * Broadcast an event to all open browser tabs and native webviews
 */
export function broadcastSyncEvent(eventType: string, payload: any) {
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({ type: eventType, payload, timestamp: Date.now() });
    } catch (e) {
      console.warn("[SafeSync] Broadcast error:", e);
    }
  }
}

/**
 * Listen for inter-tab sync events
 */
export function onSyncBroadcast(callback: (event: { type: string; payload: any; timestamp: number }) => void) {
  if (!broadcastChannel) return () => {};
  const handler = (e: MessageEvent) => {
    if (e.data && e.data.type) {
      callback(e.data);
    }
  };
  broadcastChannel.addEventListener("message", handler);
  return () => broadcastChannel?.removeEventListener("message", handler);
}

/**
 * Safely updates a row in Supabase with automatic schema self-healing.
 * If a column is missing from remote table, dynamically strips it and retries.
 */
export async function safeSupabaseUpdate(
  table: string,
  filter: { column: string; value: any },
  payload: any
): Promise<{ data: any; error: any }> {
  const supabase = createClient();
  const currentPayload = { ...payload };
  let attempts = 0;

  while (attempts < 5) {
    try {
      const { data, error } = await supabase
        .from(table)
        .update(currentPayload)
        .eq(filter.column, filter.value)
        .select();

      if (error) {
        const errMsg = error.message || "";
        const match = errMsg.match(/Could not find the '([^']+)' column/i);
        if (match && match[1]) {
          const badCol = match[1];
          console.warn(`[SafeSync] Removing unknown column '${badCol}' from ${table} and retrying...`);
          delete currentPayload[badCol];
          attempts++;
          continue;
        }
        return { data: null, error };
      }

      broadcastSyncEvent(`${table}_updated`, { filter, currentPayload });
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err };
    }
  }

  return { data: null, error: new Error("Exceeded max schema retry attempts") };
}

/**
 * Safely inserts a row or multiple rows into Supabase with automatic schema self-healing.
 */
export async function safeSupabaseInsert(
  table: string,
  payload: any
): Promise<{ data: any; error: any }> {
  const supabase = createClient();
  let currentPayload = Array.isArray(payload) ? [...payload.map((p) => ({ ...p }))] : { ...payload };
  let attempts = 0;

  while (attempts < 5) {
    try {
      const { data, error } = await supabase.from(table).insert(currentPayload as any).select();

      if (error) {
        const errMsg = error.message || "";
        const match = errMsg.match(/Could not find the '([^']+)' column/i);
        if (match && match[1]) {
          const badCol = match[1];
          console.warn(`[SafeSync] Removing unknown column '${badCol}' from ${table} and retrying...`);
          if (Array.isArray(currentPayload)) {
            currentPayload = currentPayload.map((p) => {
              const newP = { ...p };
              delete newP[badCol];
              return newP;
            });
          } else {
            delete (currentPayload as any)[badCol];
          }
          attempts++;
          continue;
        }
        return { data: null, error };
      }

      broadcastSyncEvent(`${table}_inserted`, { payload: currentPayload });
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err };
    }
  }

  return { data: null, error: new Error("Exceeded max schema retry attempts") };
}

/**
 * Safely upserts row(s) into Supabase with automatic schema self-healing.
 */
export async function safeSupabaseUpsert(
  table: string,
  payload: any,
  options?: { onConflict?: string }
): Promise<{ data: any; error: any }> {
  const supabase = createClient();
  let currentPayload = Array.isArray(payload) ? [...payload.map((p) => ({ ...p }))] : { ...payload };
  let attempts = 0;

  while (attempts < 5) {
    try {
      const { data, error } = await supabase.from(table).upsert(currentPayload as any, options).select();

      if (error) {
        const errMsg = error.message || "";
        const match = errMsg.match(/Could not find the '([^']+)' column/i);
        if (match && match[1]) {
          const badCol = match[1];
          console.warn(`[SafeSync] Removing unknown column '${badCol}' from ${table} and retrying...`);
          if (Array.isArray(currentPayload)) {
            currentPayload = currentPayload.map((p) => {
              const newP = { ...p };
              delete newP[badCol];
              return newP;
            });
          } else {
            delete (currentPayload as any)[badCol];
          }
          attempts++;
          continue;
        }
        return { data: null, error };
      }

      broadcastSyncEvent(`${table}_upserted`, { payload: currentPayload });
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err };
    }
  }

  return { data: null, error: new Error("Exceeded max schema retry attempts") };
}

function getStorage(): Storage | null {
  if (typeof window !== "undefined" && window.localStorage) {
    return window.localStorage;
  }
  if (typeof globalThis !== "undefined" && (globalThis as any).localStorage) {
    return (globalThis as any).localStorage;
  }
  return null;
}

/**
 * Enqueue an offline mutation action into persistent storage.
 */
export function enqueueOfflineAction(action: Omit<OfflineAction, "id" | "timestamp">): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    const raw = storage.getItem(OFFLINE_QUEUE_KEY);
    const queue: OfflineAction[] = raw ? JSON.parse(raw) : [];
    const item: OfflineAction = {
      ...action,
      id: `sync_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
    };
    queue.push(item);
    storage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
    console.log(`[SafeSync] Enqueued offline action for ${action.table}. Queue size: ${queue.length}`);
  } catch (err) {
    console.warn("[SafeSync] Failed to enqueue offline action:", err);
  }
}

/**
 * Get the current number of pending offline actions.
 */
export function getOfflineQueueSize(): number {
  const storage = getStorage();
  if (!storage) return 0;
  try {
    const raw = storage.getItem(OFFLINE_QUEUE_KEY);
    if (!raw) return 0;
    const queue: OfflineAction[] = JSON.parse(raw);
    return queue.length;
  } catch {
    return 0;
  }
}

/**
 * Flushes all queued offline actions to Supabase once network is restored.
 */
export async function flushOfflineQueue(): Promise<{ processed: number; remaining: number }> {
  const storage = getStorage();
  if (!storage) return { processed: 0, remaining: 0 };
  let queue: OfflineAction[] = [];
  try {
    const raw = storage.getItem(OFFLINE_QUEUE_KEY);
    if (!raw) return { processed: 0, remaining: 0 };
    queue = JSON.parse(raw);
  } catch {
    return { processed: 0, remaining: 0 };
  }

  if (queue.length === 0) return { processed: 0, remaining: 0 };

  console.log(`[SafeSync] Flushing ${queue.length} offline queued actions to database...`);
  const failedItems: OfflineAction[] = [];
  let processedCount = 0;

  for (const item of queue) {
    try {
      if (item.type === "INSERT") {
        const { error } = await safeSupabaseInsert(item.table, item.payload);
        if (error) throw error;
        processedCount++;
      } else if (item.type === "UPDATE" && item.filter) {
        const { error } = await safeSupabaseUpdate(item.table, item.filter, item.payload);
        if (error) throw error;
        processedCount++;
      } else if (item.type === "UPSERT") {
        const { error } = await safeSupabaseUpsert(item.table, item.payload);
        if (error) throw error;
        processedCount++;
      }
    } catch (e) {
      console.warn(`[SafeSync] Action failed for ${item.table}:`, e);
      failedItems.push(item);
    }
  }

  try {
    storage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(failedItems));
  } catch {}

  console.log(`[SafeSync] Flush complete. Processed: ${processedCount}, Remaining: ${failedItems.length}`);
  return { processed: processedCount, remaining: failedItems.length };
}

/**
 * Initializes automatic network sync listeners (online/offline)
 */
export function initNetworkSyncListeners(onStatusChange?: (online: boolean) => void) {
  if (typeof window === "undefined") return () => {};

  const handleOnline = () => {
    console.log("[SafeSync] Network reconnected. Flushing offline queue...");
    flushOfflineQueue();
    if (onStatusChange) onStatusChange(true);
  };

  const handleOffline = () => {
    console.log("[SafeSync] Network disconnected. Operating in offline-safe mode.");
    if (onStatusChange) onStatusChange(false);
  };

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  // Initial check: if already online, flush any leftover queue from prior session
  if (navigator.onLine) {
    flushOfflineQueue();
  }

  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
}

/**
 * Subscribes to Supabase Realtime table changes
 */
export function subscribeToTable<T = any>(
  table: string,
  onPayload: (payload: { eventType: "INSERT" | "UPDATE" | "DELETE"; new: T; old: T }) => void
) {
  const supabase = createClient();
  const channel = supabase
    .channel(`realtime:${table}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table },
      (payload: any) => {
        onPayload({
          eventType: payload.eventType,
          new: payload.new,
          old: payload.old,
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
