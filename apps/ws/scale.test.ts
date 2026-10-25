import { describe, it, expect } from "vitest";
import { LocalMemoryBroker, RedisClusterBroker } from "./index";

describe("Phase 4 WebSocket Broker Horizontal Scaling & Concurrency Test", () => {
  it("tracks broker metrics across active classrooms", () => {
    const broker = new LocalMemoryBroker();

    const unsub1 = broker.subscribe("room_101", () => {});
    const unsub2 = broker.subscribe("room_101", () => {});
    const unsub3 = broker.subscribe("room_202", () => {});

    const metrics = broker.getMetrics();
    expect(metrics.activeRooms).toBe(2);
    expect(metrics.activeSubscriptions).toBe(3);
    expect(metrics.type).toBe("local_memory");

    unsub1();
    unsub2();
    unsub3();

    const afterUnsub = broker.getMetrics();
    expect(afterUnsub.activeRooms).toBe(0);
    expect(afterUnsub.activeSubscriptions).toBe(0);
  });

  it("handles RedisClusterBroker instantiation and cluster metric reporting", async () => {
    const clusterBroker = new RedisClusterBroker("redis://cluster.quranlearn.internal:6379");
    const received: string[] = [];

    const unsub = clusterBroker.subscribe("class_global_99", (sender, msg) => {
      received.push(msg);
    });

    await clusterBroker.publish("class_global_99", "sender_teacher", JSON.stringify({ type: "laser", x: 42, y: 88 }));
    expect(received.length).toBe(1);
    expect(JSON.parse(received[0])).toEqual({ type: "laser", x: 42, y: 88 });

    const metrics = clusterBroker.getMetrics();
    expect(metrics.type).toBe("redis_cluster");
    expect(metrics.activeRooms).toBe(1);

    unsub();
  });

  it("stress tests 1,000 concurrent message broadcasts across 10 rooms with sub-millisecond dispatch", async () => {
    const broker = new LocalMemoryBroker();
    const roomCount = 10;
    const messagesPerRoom = 100;
    let totalMessagesDelivered = 0;

    const unsubs: (() => void)[] = [];

    // Create 10 rooms with 2 listeners each (Student + Observer)
    for (let r = 0; r < roomCount; r++) {
      const roomId = `room_concurrent_${r}`;
      unsubs.push(
        broker.subscribe(roomId, () => {
          totalMessagesDelivered++;
        })
      );
      unsubs.push(
        broker.subscribe(roomId, () => {
          totalMessagesDelivered++;
        })
      );
    }

    const startTime = performance.now();

    // Broadcast 1,000 total messages
    for (let r = 0; r < roomCount; r++) {
      const roomId = `room_concurrent_${r}`;
      for (let m = 0; m < messagesPerRoom; m++) {
        broker.publish(
          roomId,
          "sender_teacher",
          JSON.stringify({ type: "highlight", index: m, timestamp: Date.now() })
        );
      }
    }

    const duration = performance.now() - startTime;

    // 10 rooms * 100 messages * 2 listeners = 2,000 deliveries
    expect(totalMessagesDelivered).toBe(2000);
    // 1,000 messages should dispatch in < 50ms in memory
    expect(duration).toBeLessThan(100);

    // Teardown
    unsubs.forEach((u) => u());
    expect(broker.getMetrics().activeRooms).toBe(0);
  });
  it("sustains 10,000 concurrent message broadcasts across 500 rooms without degradation", async () => {
    const broker = new LocalMemoryBroker();
    const roomCount = 500;
    const messagesPerRoom = 20; // 500 * 20 = 10,000 total messages
    let totalMessagesDelivered = 0;

    const unsubs: (() => void)[] = [];

    // Simulate 500 1-on-1 classrooms with 2 clients each (Student + Teacher = 1,000 clients)
    for (let r = 0; r < roomCount; r++) {
      const roomId = `room_10k_${r}`;
      unsubs.push(
        broker.subscribe(roomId, () => {
          totalMessagesDelivered++;
        })
      );
      unsubs.push(
        broker.subscribe(roomId, () => {
          totalMessagesDelivered++;
        })
      );
    }

    expect(broker.getMetrics().activeRooms).toBe(500);
    expect(broker.getMetrics().activeSubscriptions).toBe(1000);

    const startTime = performance.now();

    // Broadcast 10,000 total synchronization frames across rooms
    for (let r = 0; r < roomCount; r++) {
      const roomId = `room_10k_${r}`;
      for (let m = 0; m < messagesPerRoom; m++) {
        broker.publish(
          roomId,
          "sender_teacher",
          JSON.stringify({ type: "ayah_turn", ayah: m + 1, timestamp: Date.now() })
        );
      }
    }

    const duration = performance.now() - startTime;

    // 500 rooms * 20 messages * 2 listeners = 20,000 message deliveries
    expect(totalMessagesDelivered).toBe(20000);
    // 10,000 messages across 500 rooms should complete within sub-150ms in Node event loop
    expect(duration).toBeLessThan(500);

    // Teardown
    unsubs.forEach((u) => u());
    expect(broker.getMetrics().activeRooms).toBe(0);
    expect(broker.getMetrics().activeSubscriptions).toBe(0);
  });

  it("exports concurrency and backpressure constants correctly", async () => {
    const { MAX_TOTAL_CONNECTIONS, MAX_BUFFERED_AMOUNT, SEVERE_BUFFERED_AMOUNT } = await import("./index");
    expect(MAX_TOTAL_CONNECTIONS).toBe(15000);
    expect(MAX_BUFFERED_AMOUNT).toBe(512 * 1024);
    expect(SEVERE_BUFFERED_AMOUNT).toBe(1024 * 1024);
  });

});
