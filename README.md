# Quran Academy 📖

A production-quality bilingual (English/Urdu) Quran learning platform built on Next.js, Supabase, and LiveKit. This monorepo powers the public marketing site, four deeply-integrated user portals (Student, Parent, Teacher, Admin), and a flagship real-time synchronized live classroom.

## ✨ Features

- **Live One-to-One Classroom**: A sub-500ms latency synchronised classroom where a teacher's interactions (highlights, underlines, letter splitting) are mirrored perfectly to the student. Built on LiveKit data channels and a custom WebSocket relay.
- **Bilingual & RTL Ready**: Full support for English and Urdu with logical CSS properties ensuring `dir="rtl"` behaves perfectly out of the box.
- **Role-Based Portals**:
  - **Student**: Progress tracking, homework, and live class entry.
  - **Parent**: Multi-child billing, PDF progress reports, and silent classroom observer mode.
  - **Teacher**: Earnings overview, student notes, and applicant onboarding.
  - **Admin**: Complete academy oversight, teacher approval workflows, and revenue dashboards.
- **High-Security Standards**: End-to-end Zod boundary validation, CSP security headers, strict Postgres Row-Level Security (RLS), and specialized abuse-prevention logic for child safety.

## 🏗️ Architecture & Tech Stack

This project is structured as a **Modular Monolith with Vertical Feature Slices** using `pnpm` workspaces.

- **Frontend**: Next.js 16 (App Router), React, Tailwind CSS, Framer Motion, shadcn/ui
- **Backend**: Supabase (Postgres, Auth, Edge Functions)
- **Realtime / Media**: LiveKit (WebRTC) + Custom Node.js WebSocket engine (`apps/ws`)
- **Validation / Types**: Zod + TypeScript (`strict: true`)
- **PDF Generation**: `@react-pdf/renderer`

### Monorepo Structure

```text
/apps/web                 # The main Next.js PWA and portals
/apps/ws                  # Custom WebSocket state relay for the Live Classroom
/packages/domain          # Pure, framework-free business logic & reducers
/packages/contracts       # Zod schemas and inferred types (shared client/server)
/packages/adapters        # Interfaces for third parties (LiveKit, Stripe)
/supabase                 # Database migrations, seed data, and pgTAP tests
```

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 20+
- `pnpm` v9+
- Docker (optional, for local Supabase and LiveKit servers)

### 2. Installation
Clone the repository and install all workspace dependencies:
```bash
git clone https://github.com/your-org/quran-academy.git
cd quran-academy
pnpm install
```

### 3. Environment Setup
Copy the example environment files and fill in your Supabase and LiveKit credentials:
```bash
cp .env.example apps/web/.env.local
```

### 4. Running Locally

The application requires two servers to run simultaneously: the WebSocket backend (for classroom sync) and the Next.js frontend.

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

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔐 Security & Child Safety

Child safety is a first-class requirement. 
- **Consent-Gated Recording:** Live classes are only recorded if the parent/guardian has explicitly granted consent in the database.
- **Strict PII Partitioning:** Teachers cannot view a student's personal phone number or email. All out-of-band communication is restricted.
- **Observer Mode:** Parents can join active classrooms as "silent observers" without disrupting the session.
- **Audit Logs:** Every admin action, teacher approval, and payment modification writes to an append-only `audit_log` table.

For a detailed breakdown of the threat model, refer to `docs/security.md`.

## 🛠️ Commands & Scripts

- `pnpm build`: Build the entire workspace for production.
- `pnpm lint`: Run ESLint checks across all packages.
- `pnpm test`: Execute Vitest unit and integration suites.

## 📄 License
Commercial / Proprietary. All rights reserved by the client organization.
