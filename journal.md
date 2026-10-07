# Quran Academy Architecture & Journal

## Why and How
This document tracks the reasoning, architecture decisions, and implementation strategies for the Quran Academy platform.

### Architecture Choice
* **Frontend**: Next.js 14 App Router, React, Tailwind CSS v4. Selected for strong server-side rendering, SEO capabilities for the discovery pages, and robust routing (Route Groups) for the separated portal experiences.
* **Backend Sync Engine**: FastAPI with WebSockets. Selected to decouple the low-latency drawing, pointer, and highlight synchronization logic from the standard HTTP request-response cycle of Next.js.
* **Database**: Prisma ORM with SQLite (to be scaled to PostgreSQL). Used for type-safe schema modeling spanning Users, Classes, and Courses.

### Spec-Driven Workflow Updates
* **Phase 1 (Complete)**: Scaffolding and Visuals. We successfully matched the design language (Deep Green `#0C4A3A`, off-white canvases, specific typography) and built the core page skeletons (`(public)/page.tsx`, `(portal)/student/page.tsx`, `classroom/[id]/page.tsx`).
* **Phase 2 (Current)**: Interactivity and Component Polish. The objective is to make *every* button and flow functional, referencing the full 99-page client PDF.

### Next Steps (Interactivity & Flow)
1. **Discovery to Trial Funnel**: Wire the "Book a free trial" button to a functional multi-step form (capturing learner info, program, time zone, matching preferences, and registration).
2. **Teacher Dashboard Actions**: Ensure buttons like "Log Progress", "Launch Class", and calendar manipulations are highly interactive.
3. **Admin Actions**: Wire up the "Review" and "Assign" buttons for pending teacher audits and trial requests.
4. **Live Classroom Realism**: Activate the teacher toolbar (colors, text sizes, pen sharing) to broadcast state updates correctly.

*Note: We will leverage smooth animations (Framer Motion / Tailwind transitions) and rich UI libraries as needed to match the premium feel requested.*

### Advanced Sync & Interactive Word Splitting (Live Classroom)
**Why:** The PRD explicitly requires "Letter practice / Word Splitting: Clicking any Arabic word and selecting 'Split' visually separates the word into isolated glyphs with vowels intact."
**How:**
1. Built a Unicode-aware regex (`/[\u0621-\u064A\u0671-\u06D3\u06D5][\u0610-\u061A\u064B-\u065F\u0670]*/g`) inside `LiveClassroom.tsx` to safely extract Arabic base letters along with their trailing Harakat (diacritics).
2. Connected the component to `ws://localhost:8000/ws/classroom/{classId}`. 
3. State (e.g. `highlightedIndex` and `splitIndex`) is updated locally for zero-latency UI response, and simultaneously broadcasted to the FastAPI WebSocket server to sync to the Student's pane.

### Security & Threat Mitigation Review
* **SSTI / Injection**: All data passed to the React components is strongly typed and interpolated safely by the React engine to avoid Server-Side Template Injection or XSS.
* **NoSQL/SQL Injection**: The Prisma ORM layer utilizes parameterized queries internally.
* **Replay Attacks**: WebSocket connections and authenticated API routes will require JWT validation (NextAuth) during full production deployment.

### Media & Camera WebRTC Fallback
**Why:** The PRD mentions a WebRTC video layer (Agora/LiveKit). Without those exact credentials present locally, we still need the "Camera" button to vividly illustrate the feature.
**How:**
Implemented a seamless fallback using native browser `navigator.mediaDevices.getUserMedia()`. Clicking the "Camera" button in the Live Classroom now:
1. Prompts the browser for video permissions.
2. Streams the local webcam feed directly into a floating `<video>` PiP bubble overlaying the classroom.
3. Automatically tears down the media tracks `track.stop()` when the camera is toggled off or the component unmounts to prevent memory leaks and protect privacy.

### Styling & Toolbar Resilience
Updated the bottom teacher toolbars to utilize `flex-wrap` and `justify-center`. This resolves the horizontal scroll clipping issue that occurs on smaller tablet screens, maintaining the precise visual hierarchy required by the PDF.
