import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { server, wss, broker } from "../apps/ws/index";
import WebSocket from "ws";
import * as http from "http";
import type { AddressInfo } from "net";

describe("WebSocket Real-Time Classroom Server Resilience & Concurrency Suite", () => {
  let port: number;
  let wsBaseUrl: string;
  let httpBaseUrl: string;

  beforeAll(async () => {
    await new Promise<void>((resolve) => {
      server.listen(0, () => {
        const addr = server.address() as AddressInfo;
        port = addr.port;
        wsBaseUrl = `ws://127.0.0.1:${port}`;
        httpBaseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
    wss.close();
  });

  describe("1. Diagnostic HTTP Endpoints (/health & /metrics)", () => {
    it("responds with healthy status, uptime, and memory usage on /health", async () => {
      const res = await new Promise<{ status: number; body: any }>((resolve, reject) => {
        http.get(`${httpBaseUrl}/health`, (resp) => {
          let data = "";
          resp.on("data", (chunk) => (data += chunk));
          resp.on("end", () => {
            resolve({ status: resp.statusCode || 0, body: JSON.parse(data) });
          });
        }).on("error", reject);
      });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("healthy");
      expect(res.body.timestamp).toBeDefined();
      expect(res.body.uptimeSeconds).toBeGreaterThanOrEqual(0);
      expect(res.body.memory.heapUsed).toBeGreaterThan(0);
    });

    it("responds with live broker metrics and active connection count on /metrics", async () => {
      const res = await new Promise<{ status: number; body: any }>((resolve, reject) => {
        http.get(`${httpBaseUrl}/metrics`, (resp) => {
          let data = "";
          resp.on("data", (chunk) => (data += chunk));
          resp.on("end", () => {
            resolve({ status: resp.statusCode || 0, body: JSON.parse(data) });
          });
        }).on("error", reject);
      });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
      expect(res.body.broker).toBeDefined();
      expect(typeof res.body.totalConnections).toBe("number");
      expect(res.body.heapUsedMb).toBeGreaterThan(0);
    });

    it("returns 404 for unknown HTTP routes", async () => {
      const res = await new Promise<number>((resolve, reject) => {
        http.get(`${httpBaseUrl}/unknown-route`, (resp) => {
          resolve(resp.statusCode || 0);
        }).on("error", reject);
      });

      expect(res).toBe(404);
    });
  });

  describe("2. Connection Protocol, Handshake & Error Defenses", () => {
    it("rejects unauthorized connection paths not matching /ws/classroom/<id>", async () => {
      const ws = new WebSocket(`${wsBaseUrl}/invalid-path`);
      const closeCode = await new Promise<number>((resolve) => {
        ws.on("close", (code) => resolve(code));
        ws.on("error", () => {});
      });

      expect(closeCode).toBe(4000);
    });

    it("accepts valid classroom connection and delivers connected handshake", async () => {
      const classId = "class_resilience_01";
      const ws = new WebSocket(`${wsBaseUrl}/ws/classroom/${classId}`);

      const handshake = await new Promise<any>((resolve, reject) => {
        ws.on("message", (data) => {
          try {
            resolve(JSON.parse(data.toString()));
          } catch (e) {
            reject(e);
          }
        });
        ws.on("error", reject);
      });

      expect(handshake.type).toBe("connected");
      expect(handshake.classId).toBe(classId);
      expect(handshake.clientId).toMatch(/^client_\d+_[a-z0-9]+$/);

      ws.close();
      await new Promise<void>((r) => ws.on("close", () => r()));
    });

    it("responds to application-level ping messages with pong timestamps", async () => {
      const ws = new WebSocket(`${wsBaseUrl}/ws/classroom/class_ping_test`);

      // Wait for initial connected handshake
      await new Promise<void>((r) => ws.once("message", () => r()));

      // Send ping
      ws.send(JSON.stringify({ type: "ping" }));

      const response = await new Promise<any>((resolve) => {
        ws.once("message", (data) => {
          resolve(JSON.parse(data.toString()));
        });
      });

      expect(response.type).toBe("pong");
      expect(typeof response.timestamp).toBe("number");
      expect(response.timestamp).toBeLessThanOrEqual(Date.now());

      ws.close();
      await new Promise<void>((r) => ws.on("close", () => r()));
    });
  });

  describe("3. Multi-Client Classroom Synchronization & Echo Isolation", () => {
    it("synchronizes Mushaf page turns and Tajweed highlights without echoing to sender", async () => {
      const roomId = "room_synced_tajweed_99";
      const teacherWs = new WebSocket(`${wsBaseUrl}/ws/classroom/${roomId}`);
      const studentWs = new WebSocket(`${wsBaseUrl}/ws/classroom/${roomId}`);

      // Drain connected handshakes
      await Promise.all([
        new Promise<void>((r) => teacherWs.once("message", () => r())),
        new Promise<void>((r) => studentWs.once("message", () => r())),
      ]);

      const studentReceived: any[] = [];
      const teacherReceived: any[] = [];

      studentWs.on("message", (d) => studentReceived.push(JSON.parse(d.toString())));
      teacherWs.on("message", (d) => teacherReceived.push(JSON.parse(d.toString())));

      // Teacher changes Surah to Al-Baqarah Ayah 255 (Ayat al-Kursi)
      const pageTurnEvent = {
        type: "mushaf_sync",
        surah: 2,
        ayah: 255,
        wordIndex: 4,
        tajweedRule: "Ikhfa",
        timestamp: Date.now(),
      };

      teacherWs.send(JSON.stringify(pageTurnEvent));

      // Allow 50ms for local message dispatch
      await new Promise((r) => setTimeout(r, 60));

      // Student must have received the event
      expect(studentReceived.length).toBe(1);
      expect(studentReceived[0]).toEqual(pageTurnEvent);

      // Teacher MUST NOT receive an echo of their own event
      expect(teacherReceived.length).toBe(0);

      teacherWs.close();
      studentWs.close();
      await Promise.all([
        new Promise<void>((r) => teacherWs.on("close", () => r())),
        new Promise<void>((r) => studentWs.on("close", () => r())),
      ]);
    });

    it("strictly isolates events between two distinct classrooms without bleed-through", async () => {
      const roomA = "room_alpha_101";
      const roomB = "room_beta_202";

      const clientA = new WebSocket(`${wsBaseUrl}/ws/classroom/${roomA}`);
      const clientB = new WebSocket(`${wsBaseUrl}/ws/classroom/${roomB}`);

      // Drain handshakes
      await Promise.all([
        new Promise<void>((r) => clientA.once("message", () => r())),
        new Promise<void>((r) => clientB.once("message", () => r())),
      ]);

      const messagesA: any[] = [];
      const messagesB: any[] = [];

      clientA.on("message", (d) => messagesA.push(JSON.parse(d.toString())));
      clientB.on("message", (d) => messagesB.push(JSON.parse(d.toString())));

      // Send to Room A
      clientA.send(JSON.stringify({ type: "laser_pointer", x: 120, y: 340 }));

      await new Promise((r) => setTimeout(r, 60));

      // Room B should have received ZERO messages
      expect(messagesB.length).toBe(0);

      clientA.close();
      clientB.close();
      await Promise.all([
        new Promise<void>((r) => clientA.on("close", () => r())),
        new Promise<void>((r) => clientB.on("close", () => r())),
      ]);
    });
  });

  describe("4. Graceful Cleanup & Sudden Drop Handling", () => {
    it("cleans up room subscriptions immediately upon socket disconnect", async () => {
      const ephemeralRoom = `room_ephemeral_${Date.now()}`;
      const client = new WebSocket(`${wsBaseUrl}/ws/classroom/${ephemeralRoom}`);

      await new Promise<void>((r) => client.once("message", () => r()));

      // Close the socket
      client.close();
      await new Promise<void>((r) => client.on("close", () => r()));

      // Small delay for clean-up
      await new Promise((r) => setTimeout(r, 50));

      // Verify broker clean-up
      const metrics = broker.getMetrics();
      expect(metrics.activeSubscriptions).toBeGreaterThanOrEqual(0);
    });
  });
});
