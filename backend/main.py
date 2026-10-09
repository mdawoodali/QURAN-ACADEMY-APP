from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI(title="Quran Academy Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []
        self.board_state = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        await websocket.send_json({"type": "init_state", "state": self.board_state})

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            await connection.send_json(message)

manager = ConnectionManager()

@app.get("/")
def read_root():
    return {"status": "Quran Academy Backend is running"}

@app.websocket("/ws/classroom/{class_id}")
async def websocket_endpoint(websocket: WebSocket, class_id: str):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            event = json.loads(data)
            if event.get("type") in ["draw", "clear", "highlight"]:
                if event.get("type") == "clear":
                    manager.board_state = []
                else:
                    manager.board_state.append(event)
                await manager.broadcast(event)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
