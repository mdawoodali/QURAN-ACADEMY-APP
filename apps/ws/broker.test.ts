import { describe, it, expect } from "vitest";

// Local in-memory pub-sub verification
describe("Classroom Message Broker", () => {
  class TestBroker {
    private subscribers = new Map<string, Set<(senderId: string, message: string) => void>>();

    publish(classId: string, senderId: string, message: string): void {
      const subs = this.subscribers.get(classId);
      if (subs) {
        subs.forEach((cb) => cb(senderId, message));
      }
    }

    subscribe(classId: string, callback: (senderId: string, message: string) => void): () => void {
      if (!this.subscribers.has(classId)) {
        this.subscribers.set(classId, new Set());
      }
      const set = this.subscribers.get(classId)!;
      set.add(callback);
      return () => {
        set.delete(callback);
        if (set.size === 0) {
          this.subscribers.delete(classId);
        }
      };
    }
  }

  it("broadcasts messages to subscribers of the same room", () => {
    const broker = new TestBroker();
    const received: string[] = [];

    const unsubscribe = broker.subscribe("class_101", (sender, msg) => {
      received.push(msg);
    });

    broker.publish("class_101", "sender_1", JSON.stringify({ type: "highlight", index: 2 }));
    expect(received.length).toBe(1);
    expect(JSON.parse(received[0])).toEqual({ type: "highlight", index: 2 });

    unsubscribe();
  });

  it("does not leak messages across different rooms", () => {
    const broker = new TestBroker();
    const roomA: string[] = [];
    const roomB: string[] = [];

    broker.subscribe("room_A", (_, msg) => roomA.push(msg));
    broker.subscribe("room_B", (_, msg) => roomB.push(msg));

    broker.publish("room_A", "sender_1", "message_for_A");
    expect(roomA).toEqual(["message_for_A"]);
    expect(roomB).toEqual([]);
  });

  it("unsubscribes cleanly without leaving ghost listeners", () => {
    const broker = new TestBroker();
    let count = 0;

    const unsub = broker.subscribe("room_C", () => {
      count++;
    });

    broker.publish("room_C", "s1", "first");
    expect(count).toBe(1);

    unsub();
    broker.publish("room_C", "s1", "second");
    expect(count).toBe(1); // count didn't increase
  });
});
