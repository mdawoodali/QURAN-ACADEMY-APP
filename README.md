<div align="center">
  <img src="./logo.png" alt="Quran Learn Academy Logo" width="160" height="160" style="border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); margin-bottom: 16px;" />

  # Quran Academy 📖

  <p align="center">
    <strong>A production-grade, bilingual (English/Urdu) Islamic education platform engineered for 1-on-1 personalized Quran and Tajweed pedagogy.</strong>
  </p>

  <p align="center">
    <a href="https://quranacademyapp.vercel.app"><img src="https://img.shields.io/badge/Production-Live%20on%20Vercel-052b20?style=for-the-badge&logo=vercel&logoColor=34d399" alt="Production Live on Vercel" /></a>
    <a href="https://github.com/mdawoodali/QURAN-ACADEMY-APP/actions"><img src="https://img.shields.io/badge/CI-100%25%20Passing-10b981?style=for-the-badge&logo=githubactions&logoColor=white" alt="CI Status" /></a>
    <img src="https://img.shields.io/badge/Next.js-16.4%20Turbopack-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 16" />
    <img src="https://img.shields.io/badge/TypeScript-Strict%205.0-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/WebRTC-LiveKit%20Cloud-ff5722?style=for-the-badge&logo=webrtc&logoColor=white" alt="LiveKit Cloud" />
    <img src="https://img.shields.io/badge/Backend-Supabase-3ecf8e?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  </p>

  <p align="center">
    <a href="https://quranacademyapp.vercel.app"><strong>Explore Live Platform »</strong></a> ·
    <a href="https://quranacademyapp.vercel.app/classroom/demo"><strong>Launch Classroom Demo »</strong></a> ·
    <a href="https://quranacademyapp.vercel.app/companion"><strong>Shia Companion Toolkit »</strong></a>
  </p>
</div>

---

A production-quality bilingual (English/Urdu) Quran learning platform built on Next.js, Supabase, and LiveKit. This monorepo powers the public marketing site, four deeply-integrated user portals (Student, Parent, Teacher, Admin), and a flagship real-time synchronized live classroom.

## ✨ Features

- **Live One-to-One Classroom**: A sub-50ms latency synchronized classroom where a teacher's interactions (dual-cursor laser pointer, word highlights, underlines, and isolated letter splitting) are mirrored in real time to the student. Built on LiveKit WebRTC data channels and an ultra-lightweight WebSocket state relay.
- **Pre-Call Hardware Diagnostics**: Built-in interactive pre-flight modal with real-time video preview, Web Audio `AnalyserNode` live microphone decibel visualizer, synthesized dual harmonic speaker chime ($\text{F}_4$ / $\text{C}_5$), and live network latency ping check.
- **Bilingual & RTL Ready**: Full native support for English and Urdu with logical CSS properties ensuring `dir="rtl"` behaves perfectly out of the box with zero layout shift.
- **Role-Based Portals**:
  - **Student**: Progress tracking, homework ledger, interactive Mushaf, and 1-click live classroom entry.
  - **Parent**: Multi-child family switcher, tuition billing, official downloadable PDF progress reports, and silent classroom observer mode.
  - **Teacher**: Earnings ledger calculated per completed 30-min session, student lesson notes, availability schedule matrix, and applicant onboarding desk.
  - **Admin**: Master academy cockpit, teacher vetting workflow, direct wire receipt clearance queue, and immutable audit logs.
- **Zero-Stripe Multi-Currency Payment Engine**: Direct bank settlement rails across the UK (Barclays Faster Payments), US (Chase ACH/Wire/Zelle), Eurozone (Wise SEPA Instant), Pakistan (Meezan Bank, Raast Instant ID, JazzCash, EasyPaisa), and international handles.
- **Automated Tax Invoicing & PDF Receipts**: On-demand vector PDF generation via `@react-pdf/renderer` with Academy legal registration (NTN: PK-8291048-Q, UK Registry: 849201) and Section 13(1) educational tax exemptions.
- **Transactional Messaging via Resend**: Responsive Islamic-branded HTML email notifications for student welcomes, 24h/30m class reminders, cleared payment receipts, and missed class rescheduling alerts.
- **High-Security Standards**: End-to-end Zod boundary validation, CSP security headers, strict Postgres Row-Level Security (RLS), and specialized abuse-prevention logic for child safety.

## 🏗️ Architecture & Tech Stack

This project is structured as a **Modular Monolith with Vertical Feature Slices** using `pnpm` workspaces.

- **Frontend**: Next.js 16 (App Router + Turbopack), React 19, Tailwind CSS, Framer Motion, Lucide Icons
- **Backend & Auth**: Supabase (Postgres, Auth, Row-Level Security, Edge Functions)
- **Realtime / Media**: LiveKit Cloud (WebRTC 48kHz OPUS audio/video) + Custom Node.js WebSocket engine (`apps/ws`)
- **Speech Recognition**: Deepgram Nova-2 Arabic STT + Web Speech API fallback with Levenshtein phonetic distance matcher
- **Validation / Types**: Zod + TypeScript (`strict: true`)
- **PDF Generation**: `@react-pdf/renderer`
- **Transactional Messaging**: Resend API Engine with sandbox fallback

### Monorepo Structure

```text
├── apps/
│   ├── web/                  # Next.js 16 PWA, public site, and 4 role portals
│   └── ws/                   # Lightweight WebSocket state relay for classroom sync
├── packages/
│   ├── domain/               # Pure, framework-free business logic, prayer math & speech matchers
│   ├── contracts/            # Zod schemas and inferred TypeScript types (shared client/server)
│   └── adapters/             # External integration adapters (LiveKit, Direct Wire, Resend)
├── supabase/                 # Database migrations, seed data, RLS security policies & pgTAP tests
├── tests/                    # Vitest integration test suites (Classroom, Payments, Health)
└── docs/                     # Engineering journal, launch roadmap, and architecture docs
```

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 20+
- `pnpm` v9+
- Git

### 2. Installation
Clone the repository and install all workspace dependencies:
```bash
git clone https://github.com/mdawoodali/QURAN-ACADEMY-APP.git
cd QURAN-ACADEMY-APP
pnpm install
```

### 3. Environment Setup
Copy the example environment files and configure your credentials:
```bash
cp .env.example apps/web/.env.local
```

Key environment variables:
```ini
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
LIVEKIT_API_KEY=your_livekit_key
LIVEKIT_API_SECRET=your_livekit_secret
NEXT_PUBLIC_LIVEKIT_URL=wss://your-livekit.livekit.cloud
DEEPGRAM_API_KEY=your_deepgram_key
RESEND_API_KEY=re_your_resend_key
```
*(Note: If API keys are omitted in development, the platform automatically falls back to offline sandbox pairing and mock dispatchers with zero crashes).*

### 4. Running Locally

The application requires two components for full real-time classroom functionality: the WebSocket relay and the Next.js frontend.

**Start the WebSocket Sync Server:**
```bash
cd apps/ws
npm run dev
```

**Start the Next.js Web App:**
In a separate terminal, from the project root:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Security & Child Safety

Child safety is a first-class requirement across all layers of the architecture:
- **Consent-Gated Recording**: Live classes are only recorded if the parent/guardian has explicitly granted consent in the database.
- **Strict PII Partitioning**: Teachers cannot view a student's personal phone number or email. All communication is strictly mediated through the academy ledger.
- **Silent Observer Mode**: Parents can join active classrooms anonymously as silent observers with camera/mic disabled.
- **Audit Logs**: Every administrative action, teacher approval, and payment modification writes to an append-only `audit_log` table.

For a detailed breakdown of the threat model, refer to `docs/security.md`.

## 🛠️ Commands & Scripts

- `pnpm dev`: Start Next.js development server with Turbopack.
- `pnpm build`: Compile and build the entire workspace for production.
- `pnpm lint`: Run ESLint checks across all packages (zero-warning policy).
- `pnpm typecheck`: Execute TypeScript compiler verification (`tsc --noEmit`).
- `pnpm test`: Execute Vitest unit and integration suites (39/39 passing).

## 📄 License
Commercial / Proprietary. All rights reserved by Quran Learn Academy Global.
