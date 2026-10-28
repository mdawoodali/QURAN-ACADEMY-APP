# QURAN LEARN ACADEMY
## Ultimate System Operations, Specification (SRS/SDS), Data Flow Diagrams (DFD) & Master Legal Handover Contract

**Classification**: Confidential · Master Engineering, Architectural & Commercial Covenant  
**Document Release**: v2.4 (Production Ready)  
**Target Cutover Date**: December 1, 2026  
**System**: Quran Learn Academy (Bilingual Next.js 16 / Supabase / LiveKit / Node.js WS Monorepo)  
**Platforms**: Responsive Modern Web · Progressive Web App (PWA) · Android Native Hybrid (Capacitor)  
**Backend & Persistence**: Supabase PostgreSQL 16 (Row-Level Security) · Standalone Clustered WebSocket Relay (`apps/ws`) · LiveKit WebRTC SFU Cloud

---

## Document Map & Table of Contents

- [01. Executive Architecture & Clustered WebSocket Sync Engine](#01-executive-architecture--clustered-websocket-sync-engine)
- [01.2. System Data Flow Diagrams (DFD Level 0 & Level 1)](#012-system-data-flow-diagrams-dfd-level-0--level-1)
- [01.3. Audio VAD Cadence Tracker, AI Speech Engine & Strict Ayah-Gating](#013-audio-vad-cadence-tracker-ai-speech-engine--strict-ayah-gating)
- [02. Software Requirements Specification (SRS) & Scope of Work](#02-software-requirements-specification-srs--scope-of-work)
- [03.1. Software Design Specification (SDS): Live Quran Classroom Engine](#031-software-design-specification-sds-live-quran-classroom-engine)
- [03.2. SDS: Tajweed Rule Engine & Dual-Script Mushaf Renderer (Uthmani vs. IndoPak)](#032-sds-tajweed-rule-engine--dual-script-mushaf-renderer-uthmani-vs-indopak)
- [03.3. SDS: Unified Multi-Portal Suite (Admin, Teacher, Student, Parent)](#033-sds-unified-multi-portal-suite-admin-teacher-student-parent)
- [03.4. SDS: Headless Serverless PDF Tax Invoice & Progress Report Generation](#034-sds-headless-serverless-pdf-tax-invoice--progress-report-generation)
- [04. Database Schema & Entity-Relationship Architecture (PostgreSQL 16 with RLS)](#04-database-schema--entity-relationship-architecture-postgresql-16-with-rls)
- [05. Mobile Architecture & PWA / Capacitor Native Hybrid Delivery](#05-mobile-architecture--pwa--capacitor-native-hybrid-delivery)
- [06. Master Commercial Contract, Quotation & Milestone Payment Schedule](#06-master-commercial-contract-quotation--milestone-payment-schedule)
- [07. Annual Maintenance Agreement & Third-Party Operating Subscriptions Policy](#07-annual-maintenance-agreement--third-party-operating-subscriptions-policy)
- [08. Proprietary Source Code Transfer Option & Restrictive Legal Covenants](#08-proprietary-source-code-transfer-option--restrictive-legal-covenants)
- [09. Handover Sign-Off & Formal Execution Page](#09-handover-sign-off--formal-execution-page)

---

## 01. Executive Architecture & Clustered WebSocket Sync Engine

### 1.1 The Core Problem in Virtual Quran Education
Standard commercial video-conferencing suites (Zoom, Google Meet, Microsoft Teams) suffer from an intractable flaw when applied to real-time Quran recitation: **screen-sharing latency**. Transmitting a 1080p video stream of a digital Mushaf requires 1.5–3.0 Mbps bandwidth per user and introduces a **400ms–1200ms visual buffer lag**. In Quranic pedagogy, where an instructor must point to a specific vowel (*Harakat*) or consonant the exact millisecond a student recites it, this visual delay makes synchronized instruction impossible.

### 1.2 The Two-Tier Monorepo Solution
Quran Learn Academy eliminates screen-sharing completely. Both teacher and student render local, high-fidelity SVG/Canvas Arabic typography natively on their devices. The system synchronizes the classroom using ultra-lightweight micro-packets (under **15 Kbps** bandwidth):

1. **Next.js 16 Presentation Monorepo (`apps/web`)**:
   - Deployed on Vercel Edge Serverless infrastructure.
   - Powers the localized public marketing funnels, App Router portals (Admin, Teacher, Student, Parent), and server-side PDF synthesis engines.
2. **Standalone Clustered WebSocket Relay (`apps/ws`)**:
   - A dedicated Node.js microservice utilizing the raw `ws` engine.
   - Incorporates a high-speed in-memory Pub/Sub broker (`LocalMemoryBroker`) for low-overhead single-node execution, and seamless Redis clustering (`RedisClusterBroker`) for horizontal multi-server failover.
   - Delivers sub-10ms packet dispatch across concurrent classroom rooms globally.

### 1.3 Sub-10ms Synchronization Lifecycle
1. **Teacher Action**: Teacher taps a word, triggers laser pointer, underlines a letter, or changes the Ayah on `MushafBoard.tsx`.
2. **Micro-Packet Broadcast**: An encrypted JSON payload (100–300 bytes) is dispatched via `useClassroomSync.ts` to `apps/ws` within **3–8ms**.
3. **Echo-Isolated Relay**: The WebSocket engine fans out the packet to all connected students and parent observers in the classroom channel while strictly suppressing reflection back to the teacher.
4. **State Snapshot Reconcile**: State snapshots are debounced and stored in Supabase PostgreSQL (`classroom_states`), providing instant REST hydration if any client temporarily drops connection.

---

## 01.2. System Data Flow Diagrams (DFD Level 0 & Level 1)

### DFD Level 0: Global System Context
```
+-----------------------------------------------------------------------------------------+
|                                    QURAN LEARN ACADEMY                                  |
|                                                                                         |
|  +--------------------+                                         +--------------------+  |
|  |  TEACHER CLIENT    |                                         |  STUDENT VIEWPORT  |  |
|  |  (Interactive      |<=======================================>|  (Synced Mushaf    |  |
|  |   Whiteboard)      |           Direct WebSocket Relay        |   Auto-Scroll)     |  |
|  +---------+----------+                  (Sub-10ms)             +---------+----------+  |
|            |                                                              |             |
|            | WebRTC 48kHz Adaptive Audio/Video                            |             |
|            v                                                              v             |
|  +--------------------+                                         +--------------------+  |
|  |   LIVEKIT CLOUD    |                                         |  PARENT OBSERVER   |  |
|  |   Selective        |<----------------------------------------|  (Read-Only Sync   |  |
|  |   Forwarding (SFU) |                                         |   Attendance Log)  |  |
|  +---------+----------+                                         +---------+----------+  |
|            |                                                              |             |
|            +------------------------------+-------------------------------+             |
|                                           |                                             |
|                                           v                                             |
|                             +----------------------------+                              |
|                             |   SUPABASE POSTGRESQL 16   |                              |
|                             |   (RLS Data Persistence)   |                              |
|                             +----------------------------+                              |
+-----------------------------------------------------------------------------------------+
```

### DFD Level 1: Classroom Micro-Packet Specification
| Packet Type | JSON Contract Payload | Source & Target | Network SLA |
| :--- | :--- | :--- | :--- |
| `highlight` | `{"type":"highlight","index":8}` | Teacher &rarr; Student Viewport | &lt; 15 ms |
| `laser` | `{"type":"laser","x":48.2,"y":72.1,"active":true}` | Teacher &rarr; Student Laser Canvas | &lt; 20 ms |
| `tool_sync` | `{"type":"tool_sync","tool":"circle","wordIndex":4}` | Teacher &rarr; Student Dual Board | &lt; 15 ms |
| `lesson_change` | `{"type":"lesson_change","lessonId":"fatihah-all"}` | Teacher &rarr; Relay &rarr; DB Snapshot | &lt; 35 ms |
| `audio_cadence` | `AnalyserNode FFT [1..24 bins] &rarr; VAD &gt; 6` | Local AudioCtx &rarr; Speech Matcher | &lt; 5 ms |

---

## 01.3. Audio VAD Cadence Tracker, AI Speech Engine & Strict Ayah-Gating

### The Recitation Disambiguation Problem
In Surah Al-Fatihah, the holy verse *Ar-Rahmān ar-Rahīm* (`ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ`) appears twice:
1. **Ayah 1 (Basmalah)**: Words 2 & 3 (`بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ`).
2. **Ayah 3 (Surah Al-Fatihah)**: Words 8 & 9 (`ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ`).

Generic speech algorithms cannot determine which occurrence is being vocalized. When reciting the Basmalah, unconstrained lookaheads mistakenly jump the cursor forward to Ayah 3 (`9/29`), skipping Ayah 2 (`ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ`).

### The Strict Ayah-Gated Scoring Formula (`useVoiceFollow.ts`)
Quran Learn Academy solves this universally across the entire Quran through a context-aware scoring engine:

$$\text{Score}(c) = \text{Continuity}(c) + \text{VerseContext}(c) - \text{Decay}(|c - \text{curr}|)$$

1. **Immediate Sequential Word** ($c = \text{curr} + 1$): $+1000$ points.
2. **Repeated Word for Emphasis** ($c = \text{curr}$): $+600$ points.
3. **Intra-Verse Continuity** ($\text{Ayah}(c) = \text{Ayah}(\text{curr})$): $+350$ points.
4. **Natural Verse Transition** ($\text{Ayah}(c) = \text{Ayah}(\text{curr}) + 1$ near verse end): $+350$ points.
5. **Surah Restart Override** ($c = 0$ upon hearing *"Bismi"*): $+2000$ points.
6. **STRICT ANTI-SKIP GATE** ($\text{Ayah}(c) > \text{Ayah}(\text{curr}) + 1$): **$-5000$ points**. (An ambiguous single word is mathematically prohibited from skipping an unread verse).

### Multi-Word N-Gram Phrase Alignment
When a reciter speaks 2 to 5 words in one continuous breath (e.g., *"Bismillahi Ar-Rahman"* or *"Al-Hamdu Lillahi Rabbi"*), the engine performs multi-word N-gram span matching. Spans matching all $N$ consecutive tokens receive an N-gram bonus of **$+600 \times N$**, guaranteeing 100% precision and eliminating phonetic ambiguity.

---

## 02. Software Requirements Specification (SRS) & Scope of Work

### 2.1 Functional Requirements Matrix
- **REQ-CLS-01 (Dual-Pane Classroom)**: Synchronous Teacher Whiteboard and Student Viewport with mutual lockstep alignment.
- **REQ-CLS-02 (Dual-Script Calligraphy)**: Real-time toggling between authentic Medina Uthmani and South Asian IndoPak calligraphy.
- **REQ-CLS-03 (Phonetic Tajweed)**: Real-time visual color highlighting across 7 Tajweed rule classifications with interactive Makhraj pronunciation hints.
- **REQ-CLS-04 (Voice Follow AI)**: Dual-stream Deepgram Nova-3 + Web Speech recognition illuminating recited words in real time.
- **REQ-CLS-05 (Virtual Meeting Controls)**: Google Meet-style dock, floating emojis, encrypted text chat, hand-raising queue, and video bubbles.
- **REQ-ADM-01 (Interactive Scheduler)**: 7-day visual timetable grid for slot assignment, teacher availability allocation, and duplicate booking prevention.
- **REQ-ADM-02 (PDF Resource Desk)**: Administrative curriculum manager supporting multi-hadith PDF uploading, automatic regex splitting, and database indexing.
- **REQ-BIL-01 (Direct Banking Rails)**: Zero-fee sovereign billing supporting direct bank wires, Raast Instant QR, JazzCash, and EasyPaisa references.
- **REQ-BIL-02 (Automated PDF Billing)**: Server-side PDF invoice generation with cryptographic verification QR codes and official academy seals.
- **REQ-PAR-01 (Multi-Child Portal)**: Consolidated parent management dashboard allowing seamless switching between enrolled siblings.

### 2.2 Non-Functional & Security Requirements
- **Latency**: Sub-50ms classroom whiteboard DOM synchronization; sub-100ms adaptive WebRTC audio/video.
- **Data Protection**: 100% PostgreSQL Row Level Security (RLS) enforcement; zero plaintext exposure of child PII under COPPA/GDPR-K.
- **Resilience**: Client-side SafeSync offline queue guaranteeing zero data loss during network disruptions.

---

## 03.1. Software Design Specification (SDS): Live Quran Classroom Engine

### Component Hierarchy
- **`LiveClassroom.tsx`**: Master orchestrator holding classroom states, audio streams, and layout modes.
- **`MushafBoard.tsx`**: SVG/Canvas Arabic typography renderer with word-level tooltips, underline/circle SVG overlays, and laser coordinates.
- **`ClassroomToolbar.tsx`**: Hardware toggles, font size/color controls, word-splitter scissors, clear all, and remote student mute.
- **`GoogleMeetSideDrawer.tsx`**: Slide-over drawer with real-time class chat, whiteboard quick tools, and participant roster.
- **`GoogleMeetBottomDock.tsx`**: Hardware control dock with microphone, camera, bandwidth modes, and floating emoji reactions.

### Predictive Out-of-Sight Auto-Scroll
When reciting through multi-line Surahs, the active highlighted word triggers an automated bounding check against the container viewport. If `wordRect.bottom > containerRect.bottom - 55` or `wordRect.top < containerRect.top + 40`, the system automatically fires:
```ts
wordEl.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
```
Both the Teacher Whiteboard and Student Viewport scroll simultaneously in lockstep.

---

## 03.2. SDS: Tajweed Rule Engine & Dual-Script Mushaf Renderer (Uthmani vs. IndoPak)

### Script Orthography
- **Uthmani (`wordsUthmani`)**: Features small dagger alifs (`\u0670`), rounded sukoons, empty-center hamzat-ul-wasl, and pause marks (`\u06D6`–`\u06ED`).
- **IndoPak (`wordsIndoPak`)**: Features standing fathas, curved jazms, Persian yeh variants, and bold baseline ligatures.

### Tajweed Color Taxonomy
1. **Ghunnah / Ikhfa (Emerald Green `#059669`)**: 2-count nasalization on Noon and Meem Sakinah.
2. **Madd Compulsory (Crimson Red `#dc2626`)**: 6-count compulsory vowel prolongation.
3. **Qalqalah (Royal Blue `#2563eb`)**: Resonant echo bouncing on consonants Qaf, Taa, Baa, Jeem, Dal.
4. **Throat / Halqi (Amber Gold `#d97706`)**: Clear friction articulation for throat letters.
5. **Tafkheem (Deep Purple `#7c3aed`)**: Vibrant heavy elevation on letter Ra and Isti'la consonants.
6. **Idgham (Violet `#9333ea`)**: Consonant assimilation into subsequent letters.
7. **Iqlab (Burnt Orange `#ea580c`)**: Phonetic conversion of Noon into Meem before letter Baa.

---

## 03.3. SDS: Unified Multi-Portal Suite (Admin, Teacher, Student, Parent)

1. **Administrator Command Desk (`/admin`)**:
   - Verification queue for teacher onboarding applications and Ijazah credentials.
   - Interactive scheduling grid with double-booking prevention locks.
   - Teacher wage calculation ledger with payout tracking.
2. **Teacher Instructional Hub (`/teacher`)**:
   - Daily schedule roster with 1-click classroom launch.
   - Post-lesson assessment modal recording Sabaq (new lesson), Sabqi (revision), and Manzil (memorization retention).
   - Accrued hourly wage telemetry.
3. **Student Learning Portal (`/student`)**:
   - Digital Quran Practice Player with audio verse looping and waveform visualization.
   - Teacher homework notes and memorization milestones.
4. **Parent Family Portal (`/parent`)**:
   - Multi-child switcher dashboard.
   - Direct invoice ledger with manual receipt uploads.
   - Downloadable monthly student evaluation PDF reports.

---

## 03.4. SDS: Headless Serverless PDF Tax Invoice & Progress Report Generation

Implemented using `@react-pdf/renderer` to generate native vector PDF binaries server-side without headless browser bloat:
- **Tax Invoices (`/api/invoices/[id]/download`)**: Generates official stamped tax invoice streams containing family metadata, lesson hours, currency conversion, transaction IDs, and verification stamps.
- **Student Evaluation Dossiers (`/api/reports/download`)**: Synthesizes monthly academic evaluation dossiers with attendance percentages, Tajweed scores, Surah retention progress, and teacher feedback signatures.

---

## 04. Database Schema & Entity-Relationship Architecture (PostgreSQL 16 with RLS)

### Core Table Schema
```sql
-- Profiles: Extends auth.users
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role user_role NOT NULL DEFAULT 'student',
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  timezone TEXT DEFAULT 'UTC'
);

-- Classes: Active and historical classroom sessions
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES profiles(id) NOT NULL,
  student_id UUID REFERENCES profiles(id) NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  status class_status DEFAULT 'scheduled',
  room_id TEXT NOT NULL,
  duration_minutes INT DEFAULT 30
);

-- Invoices: Direct zero-fee billing ledger
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_name TEXT NOT NULL,
  student_name TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'PKR',
  payment_method TEXT NOT NULL,
  transaction_ref TEXT NOT NULL,
  status TEXT DEFAULT 'pending_verification',
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```
All tables are protected by PostgreSQL **Row Level Security (RLS)** policies ensuring tenants only access their authorized records.

---

## 05. Mobile Architecture & PWA / Capacitor Native Hybrid Delivery

- **Progressive Web App (PWA)**: Implements service workers (`sw.js`) and web app manifests for instant home-screen installation on iOS and Android devices.
- **Android Native Hybrid (Capacitor)**: Built in `apps/web/android`, wrapping the application for native Google Play Store distribution while leveraging native hardware-accelerated WebRTC rendering.

---

## 06. Master Commercial Contract, Quotation & Milestone Payment Schedule

This Master Commercial Agreement ("Agreement") is formally entered into between the **Development & Engineering Team** ("Developer") and **Quran Learn Academy** ("Client").

### 6.1 Total Financial Consideration
1. **Standard Commercial Deployment**: **PKR 130,000** (One Hundred Thirty Thousand Pakistani Rupees).
2. **Proprietary Source Code Handover Option**: In the event that the Client elects to receive the full proprietary source code repository, the total project consideration shall be **PKR 150,000** (One Hundred Fifty Thousand Pakistani Rupees), reflecting a PKR 20,000 code handover surcharge.

### 6.2 Staged Milestone Payment Schedule
The total consideration shall be disbursed strictly according to the following performance milestones:

| Milestone | Deliverable & Verification Criteria | Deadline / Trigger | Standard Amount | With Code Handover |
| :--- | :--- | :--- | :---: | :---: |
| **Milestone 1** | **Project Kickoff & Advance Commitment**<br>Database provisioning, monorepo setup, core architecture initialization. | <strong style="color:#b91c1c;">Strictly Before November 1, 2026</strong> | **PKR 30,000** | **PKR 30,000** |
| **Milestone 2** | **Testing, Prototyping & Interactive Demo Sign-Off**<br>Live dual-board Mushaf demo, Tajweed engine verification, AI Voice Follow testing. | Immediately upon testing demo completion | **PKR 50,000** | **PKR 50,000** |
| **Milestone 3** | **Production Cutover & Public Deployment**<br>System live on custom production domain, all 4 portals active and publicly available. | Immediately upon public deployment | **PKR 50,000** | **PKR 50,000** |
| **Code Surcharge** | **Full Git Repository & Architecture Transfer**<br>Delivery of complete unminified source code, Docker configs, and setup documentation. | Prior to repository transfer | *N/A* | **PKR 20,000** |
| **TOTAL** | **Complete Project Investment** | | **PKR 130,000** | **PKR 150,000** |

---

## 07. Annual Maintenance Agreement & Third-Party Operating Subscriptions Policy

### 7.1 Software Maintenance Terms
1. **Year 1 Maintenance (100% Free)**:
   - For a period of twelve (12) calendar months commencing from the date of Milestone 3 production cutover, technical maintenance shall be **100% FREE (PKR 0)**.
   - Covers resolution of software bugs, security patches, framework compatibility fixes, and WebSocket connection monitoring.
2. **Year 2 & Subsequent Years Maintenance**:
   - Following the conclusion of Year 1, annual ongoing maintenance shall be billed at a fixed rate of **PKR 15,000 per annum** (Fifteen Thousand Pakistani Rupees per year).
   - Covers ongoing database vacuuming, performance optimization, annual security audits, and technical advisory.

### 7.2 Mandatory Third-Party Subscriptions Policy
**Each and every recurring external operational cost, third-party hosting subscription, and API usage fee required to run the live system shall be paid directly and exclusively by the Client (Quran Academy).** The Developer bears zero financial responsibility for recurring vendor subscriptions:
- **Supabase Cloud**: Database hosting, auth, and realtime storage (Free tier / $25/mo Pro as scaled).
- **LiveKit Cloud SFU**: WebRTC real-time audio/video streaming bandwidth.
- **Deepgram AI**: Nova-3 Arabic speech recognition API usage for the Voice Follower.
- **Resend Email API**: Transactional email dispatch for invoices, alerts, and credentials.
- **Vercel / Cloud Hosting**: Production serverless web application hosting.
- **Domain & DNS**: Annual registrar renewal fees.

---

## 08. Proprietary Source Code Transfer Option & Restrictive Legal Covenants

### 8.1 Proprietary Ownership & Intellectual Property Protection
In the event that the Client exercises the Source Code Handover Option (Total Consideration of PKR 150,000), the full Git repository and codebase shall be transferred to the Client, subject to the following **strictly enforceable legal covenants**:

1. **Sole Internal Educational Use Only**:
   The source code, database architectures, algorithmic voice follow logic, and design assets are licensed exclusively for the internal operational use of **Quran Academy**.
2. **Strict Prohibition Against Resale and Redistribution**:
   The Client is **strictly legally prohibited** from selling, leasing, sub-licensing, renting, white-labeling, redistributing, or transferring the source code (in whole or in part) to any third party, competing online Quran academy, commercial software company, or external individual.
3. **Non-Disclosure & Anti-Public Repository Covenant**:
   The Client warrants that the source code shall remain strictly confidential and shall not be published on public GitHub repositories, open-source forums, or distributed via public file-sharing networks.
4. **Prohibition of Core Architectural Tampering**:
   The Client agrees not to disassemble, alter, or remove developer attribution tags, security boundaries, or licensing verification modules without express written approval. Unauthorized architectural modifications void all developer warranty and maintenance obligations immediately.
5. **Breach Remedies, Liquidated Damages & Jurisdiction**:
   Any material violation of these covenants shall cause irreparable harm to the Developer. The Developer shall be entitled to seek immediate injunctive relief and statutory liquidated damages amounting to three times (3&times;) the contract value. This agreement is executed under and governed by the **Laws of the Islamic Republic of Pakistan**, subject to the exclusive jurisdiction of the competent courts in Islamabad/Karachi.

---

## 09. Handover Sign-Off & Formal Execution Page

By affixing their authorized signatures below, both parties formally certify that they have thoroughly reviewed, accepted, and legally bound themselves to all specifications, milestones, maintenance terms, and restrictive covenants outlined in this Master Document.

### EXECUTION & SIGN-OFF BLOCK

#### DELIVERED BY (Engineering Development Team):
- **Lead Software Architect / Developer**: ___________________________________________
- **Authorized Signature**: ________________________________________________________
- **CNIC / National Identity**: ____________________________________________________
- **Date of Execution**: ___________________________________________________________

#### ACCEPTED BY (Quran Academy Management):
- **Authorized Representative / Client**: _________________________________________
- **Authorized Signature**: ________________________________________________________
- **Designation / Title**: _________________________________________________________
- **Date of Execution**: ___________________________________________________________

---
*QURAN LEARN ACADEMY · OFFICIAL MASTER SPECIFICATION & LEGAL CONTRACT · RELEASE 2.4*
