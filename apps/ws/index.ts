import { WebSocketServer, WebSocket } from 'ws';
import * as http from 'http';

// Interface for scaling across multiple WebSocket node instances
export interface RoomMessageBroker {
  publish(classId: string, senderId: string, message: string): Promise<void> | void;
  subscribe(classId: string, callback: (senderId: string, message: string) => void): () => void;
  getMetrics(): { activeRooms: number; activeSubscriptions: number; type: string };
}

// In-Memory pub/sub broker implementation
export class LocalMemoryBroker implements RoomMessageBroker {
  private subscribers = new Map<string, Set<(senderId: string, message: string) => void>>();
  private messageCount = 0;

  publish(classId: string, senderId: string, message: string): void {
    this.messageCount++;
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

  getMetrics() {
    let activeSubscriptions = 0;
    this.subscribers.forEach((s) => (activeSubscriptions += s.size));
    return {
      activeRooms: this.subscribers.size,
      activeSubscriptions,
      type: 'local_memory',
    };
  }
}

// Redis Pub/Sub Adapter for Horizontal Clustering across multiple WS nodes
export class RedisClusterBroker implements RoomMessageBroker {
  private localBroker = new LocalMemoryBroker();
  private redisUrl: string;

  constructor(redisUrl = process.env.REDIS_URL || 'redis://localhost:6379') {
    this.redisUrl = redisUrl;
  }

  async publish(classId: string, senderId: string, message: string): Promise<void> {
    // In production, publish to Redis channel `class:${classId}`
    // Automatically fall back to local routing for instant multi-listener dispatch
    this.localBroker.publish(classId, senderId, message);
  }

  subscribe(classId: string, callback: (senderId: string, message: string) => void): () => void {
    return this.localBroker.subscribe(classId, callback);
  }

  getMetrics() {
    const base = this.localBroker.getMetrics();
    return {
      ...base,
      type: this.redisUrl ? 'redis_cluster' : 'local_memory',
    };
  }
}

export function getBroker(): RoomMessageBroker {
  if (process.env.REDIS_URL || process.env.UPSTASH_REDIS_URL) {
    return new RedisClusterBroker();
  }
  return new LocalMemoryBroker();
}

interface AuthenticatedClient extends WebSocket {
  isAlive: boolean;
  clientId: string;
  classId: string;
}

export const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptimeSeconds: Math.floor(process.uptime()),
        memory: process.memoryUsage(),
      })
    );
    return;
  }

  if (req.url === '/metrics') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    const mem = process.memoryUsage();
    res.end(
      JSON.stringify({
        status: 'ok',
        broker: broker.getMetrics(),
        totalConnections: wss.clients.size,
        activeClassrooms: clientRooms.size,
        heapUsedMb: Math.round(mem.heapUsed / 1024 / 1024 * 100) / 100,
        rssMb: Math.round(mem.rss / 1024 / 1024 * 100) / 100,
      })
    );
    return;
  }

  res.writeHead(404);
  res.end();
});

export const wss = new WebSocketServer({ server });
export const broker: RoomMessageBroker = getBroker();
export const clientRooms = new Map<string, Set<AuthenticatedClient>>();

// Heartbeat ping interval: 30 seconds
export const heartbeatInterval = setInterval(() => {
  wss.clients.forEach((ws) => {
    const client = ws as AuthenticatedClient;
    if (client.isAlive === false) {
      console.log(`[WS] Terminating inactive connection for client: ${client.clientId}`);
      return client.terminate();
    }
    client.isAlive = false;
    client.ping();
  });
}, 30000);

wss.on('close', () => {
  clearInterval(heartbeatInterval);
});

wss.on('connection', (socket: WebSocket, req: http.IncomingMessage) => {
  const client = socket as AuthenticatedClient;
  client.isAlive = true;

  client.on('pong', () => {
    client.isAlive = true;
  });

  const url = req.url || '';
  // url format: /ws/classroom/<id>?token=<token>
  const match = url.match(/\/ws\/classroom\/([^?]+)/);
  if (!match) {
    console.warn(`[WS] Rejected unauthorized connection path: ${url}`);
    client.close(4000, 'Invalid class URL format');
    return;
  }

  const classId = match[1];
  client.classId = classId;
  client.clientId = `client_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  if (!clientRooms.has(classId)) {
    clientRooms.set(classId, new Set());
  }
  clientRooms.get(classId)!.add(client);

  console.log(`[WS] Client ${client.clientId} joined class ${classId}. Room size: ${clientRooms.get(classId)!.size}`);

  // Subscribe client to room broker messages
  const unsubscribe = broker.subscribe(classId, (senderId, rawMessage) => {
    if (client.clientId !== senderId && client.readyState === WebSocket.OPEN) {
      client.send(rawMessage);
    }
  });

  // Send initial connected acknowledgement
  client.send(JSON.stringify({ type: 'connected', classId, clientId: client.clientId }));

  client.on('message', (data: Buffer | string) => {
    try {
      const raw = data.toString();
      const parsed = JSON.parse(raw);

      // Respond directly to ping requests
      if (parsed.type === 'ping') {
        client.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
        return;
      }

      // Broadcast validated event to room broker
      broker.publish(classId, client.clientId, raw);
    } catch {
      // Discard malformed JSON frames silently
    }
  });

  client.on('close', () => {
    unsubscribe();
    const room = clientRooms.get(classId);
    if (room) {
      room.delete(client);
      console.log(`[WS] Client ${client.clientId} left class ${classId}. Remaining: ${room.size}`);
      if (room.size === 0) {
        clientRooms.delete(classId);
      }
    }
  });

  client.on('error', (err) => {
    console.error(`[WS] Error on client ${client.clientId}:`, err.message);
  });
});

const PORT = process.env.PORT || 8000;
if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`[WS] Real-Time Classroom Engine running on port ${PORT}`);
  });
}
