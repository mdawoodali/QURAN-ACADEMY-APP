# ADR 001: Distributed Real-Time Classroom & Voice Synchronization Architecture

## Status
**Accepted** (2026-10-21)

## Context & Problem Statement
Quran Academy's live interactive classroom connects thousands of students and teachers across global timezones (UK, North America, Middle East, Pakistan). To deliver an **Apple/Google-grade learning experience**, the system requires:
1. **Sub-50ms interactive synchronization**: When a teacher highlights a word, circles an Ayah, or triggers a letter breakdown, the student's screen must reflect the change synchronously without noticeable lag.
2. **Bandwidth & CPU resilience**: Real-time video/audio streams must not congest or block lightweight classroom metadata and speech events.
3. **High concurrency & horizontal scalability**: The architecture must scale effortlessly to 10,000+ active students across thousands of concurrent classroom sessions without memory leaks or zombie socket accumulation.
4. **Resilient voice tracking**: Ultra-low latency voice-following for Arabic recitation must operate reliably across diverse browser environments.

---

## Architectural Decision

We adopt a **Decoupled Three-Tier Real-Time Architecture**:

```
                       ┌───────────────────────────────┐
                       │   LiveKit SFU Cloud Cluster   │
                       │   (Adaptive WebRTC A/V Track) │
                       └──────────────┬────────────────┘
                                      │ Audio/Video
       ┌──────────────────────────────┼──────────────────────────────┐
       ▼                              │                              ▼
┌──────────────┐                      │                      ┌──────────────┐
│ Teacher Node │                      │                      │ Student Node │
│ (Web/Tablet) │                      │                      │ (Phone/Web)  │
└──────┬───────┘                      │                      └──────▲───────┘
       │                              │                             │
       │ JSON Classroom Sync          │                             │ JSON Classroom Sync
       ▼                              │                             │
┌─────────────────────────────────────┴─────────────────────────────┴┐
│             Horizontal WebSocket Sync Cluster (apps/ws)           │
│                                                                   │
│   ┌─────────────────────┐                 ┌────────────────────┐  │
│   │ WS Connection Node 1│                 │WS Connection Node 2│  │
│   └──────────┬──────────┘                 └──────────┬─────────┘  │
│              └───────────────┬───────────────────────┘            │
│                              ▼                                    │
│             RoomMessageBroker (Redis Pub/Sub Adapter)             │
└───────────────────────────────────────────────────────────────────┘
```

### 1. Separation of Concerns (Media vs. Data Plane)
- **Audio/Video Stream Offload**: Heavy audiovisual payloads are completely isolated to the LiveKit SFU (Selective Forwarding Unit) cloud infrastructure.
- **Microsecond Synchronization Data Plane**: Classroom state (word highlight index, underlines, circles, font scale, script preference) is transmitted via lightweight JSON frames over dedicated WebSocket workers.

### 2. Scalable WebSocket Broker Architecture (`apps/ws`)
- **Adapter Interface Pattern**: The WebSocket server decouples socket lifecycle management from message distribution via `RoomMessageBroker`.
- **In-Memory & Distributed Modes**: Supports zero-infrastructure `LocalMemoryRoomBroker` for development and single-instance deployments, seamlessly swappable with `RedisRoomBroker` for multi-node Kubernetes/container scaling.
- **Heartbeat & Zombie Pruning**: 30-second bidirectional ping/pong protocol automatically terminates and garbage-collects abandoned or orphaned TCP sockets.

### 3. Dual-Engine Speech-to-Text Pipeline (`useVoiceFollow`)
- **Primary (Tier 1)**: Direct WebSocket streaming to Deepgram Nova-2 Arabic acoustic model (`wss://api.deepgram.com/v1/listen?model=nova-2&language=ar`), utilizing custom Quranic keyword boosting (`keywords=...:3`) for sub-300ms recitation word tracking.
- **Fallback (Tier 2)**: Browser-native Web Speech API (`webkitSpeechRecognition`) in continuous Arabic (`ar-SA`) mode if external API credentials or networks are unavailable.
- **Phonetic & Diacritic Tolerant Matcher**: Arabic text normalization strips non-essential tashkeel, standardizes alef variants (`إ`, `أ`, `آ`, `ٱ` $\to$ `ا`), and matches English transliterations via phonetic mapping.

### 4. Client-Side Modularization (`apps/web/src/features/classroom`)
- The monolithic 795-line component was decomposed into single-responsibility units:
  - `MushafBoard.tsx`: Stateless, high-performance word canvas with zero render regressions.
  - `ClassroomToolbar.tsx`: Static tool palette with isolated event handlers.
  - `LetterPracticeTray.tsx`: Morphological breakdown for phonics practice.
  - `useClassroomSync.ts`: Custom hook encapsulating dual WebSocket + BroadcastChannel synchronization.
  - `useVoiceFollow.ts`: Custom hook isolating microphone capture, audio chunking, and speech engine lifecycle.
  - `LiveClassroom.tsx`: Thin 260-line composition orchestrator.

---

## Consequences & Mitigations

| Consequence | Severity | Mitigation |
|---|---|---|
| **Multi-node message ordering** | Low | Room sync frames are idempotent state snapshots; state synchronization replaces monotonic deltas. |
| **Zombie WebSocket connections** | Medium | Built-in 30s ping/pong sweep automatically closes disconnected clients and removes dead rooms from memory. |
| **Microphone permission denial** | Medium | Graceful error banners and manual keyboard controls (ArrowLeft/ArrowRight) allow teachers to navigate without audio. |
| **Database query contention at peak times** | Low | Composite indexes on `class_sessions(status, start_time, teacher_id, student_id)` and immutable append-only `audit_logs` prevent row locking. |
