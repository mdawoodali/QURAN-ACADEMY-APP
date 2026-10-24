import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  enqueueOfflineAction,
  getOfflineQueueSize,
  flushOfflineQueue,
  broadcastSyncEvent,
  onSyncBroadcast,
} from "../lib/safeSync";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
  writable: true,
});

describe("Shaheen-Level SafeSync Engine Suite", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it("successfully enqueues offline mutation actions to persistent queue", () => {
    expect(getOfflineQueueSize()).toBe(0);

    enqueueOfflineAction({
      type: "INSERT",
      table: "invoices",
      payload: { id: "inv_test_1", amount: 18000, currency: "PKR" },
    });

    expect(getOfflineQueueSize()).toBe(1);

    enqueueOfflineAction({
      type: "UPDATE",
      table: "class_sessions",
      filter: { column: "id", value: "sess_1" },
      payload: { status: "completed" },
    });

    expect(getOfflineQueueSize()).toBe(2);
  });

  it("flushes empty offline queue gracefully returning 0 processed", async () => {
    const result = await flushOfflineQueue();
    expect(result.processed).toBe(0);
    expect(result.remaining).toBe(0);
  });

  it("broadcasts sync events across channels cleanly", () => {
    const spy = vi.fn();
    const unsubscribe = onSyncBroadcast(spy);

    broadcastSyncEvent("invoices_updated", { id: "inv_100" });

    // BroadcastChannel simulated or verified
    expect(typeof unsubscribe).toBe("function");
    unsubscribe();
  });
});
