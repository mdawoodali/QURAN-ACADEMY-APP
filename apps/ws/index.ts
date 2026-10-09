import { WebSocketServer, WebSocket } from 'ws';
import * as http from 'http';

const server = http.createServer();
const wss = new WebSocketServer({ server });

const rooms = new Map<string, Set<WebSocket>>();

wss.on('connection', (ws, req) => {
  const url = req.url || '';
  // url format: /ws/classroom/<id>
  const match = url.match(/\/ws\/classroom\/(.+)/);
  if (!match) {
    ws.close();
    return;
  }
  
  const classId = match[1];
  if (!rooms.has(classId)) {
    rooms.set(classId, new Set());
  }
  rooms.get(classId)!.add(ws);

  console.log(`Client joined class: ${classId}. Total in room: ${rooms.get(classId)!.size}`);

  ws.on('message', (message, isBinary) => {
    // Broadcast message to everyone in the room except the sender
    const room = rooms.get(classId);
    if (room) {
      room.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message, { binary: isBinary });
        }
      });
    }
  });

  ws.on('close', () => {
    const room = rooms.get(classId);
    if (room) {
      room.delete(ws);
      console.log(`Client left class: ${classId}. Total in room: ${room.size}`);
      if (room.size === 0) {
        rooms.delete(classId);
      }
    }
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});
