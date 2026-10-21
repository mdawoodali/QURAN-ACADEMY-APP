# Production Launch & Operations Runbook

**System**: Quran Learn Academy (Bilingual Next.js / Supabase / LiveKit Monorepo)  
**Target Cutover Date**: December 1, 2026  
**Status**: Production Ready (Phase 5 Complete)  
**Classification**: Operational Standard Operating Procedure (SOP)

---

## 1. System Overview & Pre-Flight Checklist

This runbook defines the operational procedures for production deployment, zero-downtime cutover, DNS routing, disaster recovery, and SEV-1 incident triage for the Quran Learn Academy platform.

### Monorepo Components
- **`apps/web`**: Next.js 16 App Router on Vercel Edge/Serverless.
- **`apps/ws`**: Clustered Node.js / Redis WebSocket relay for sub-500ms real-time classroom state synchronization.
- **`packages/*`**: `@quran/domain` (Arabic speech normalization & prayer math), `@quran/contracts` (Zod schemas), `@quran/adapters` (LiveKit WebRTC, Resend Transactional Email, Zero-Stripe Direct Multi-Currency Billing).
- **`supabase/`**: Postgres 16 database with Row Level Security (RLS), Supabase Transaction Pooler (Port 6543), COPPA-compliant student PII protection, and double-booking prevention indexes.

### Pre-Flight Verification Gate
Before initiating public traffic cutover, confirm every gate:
- [x] All 52 Vitest unit, contract, and dry-run integration tests passing (`pnpm test`).
- [x] Zero ESLint warnings across workspace (`pnpm lint`).
- [x] Zero TypeScript compilation errors (`pnpm typecheck`).
- [x] Turbopack production build succeeds with all 54 routes compiled (`pnpm build`).
- [x] Deep health checks report `status: "healthy"` and `productionReady: true` on `/api/health`.
- [x] Zero Stripe dependencies in lockfile or codebase; 100% direct bank wire / instant local rails.

---

## 2. DNS & Domain Routing Runbook

### 2.1 Vercel Production Web Application
Configure the following records on the authoritative DNS nameserver (Cloudflare / Route53):

| Type | Name / Host | Target / Value | TTL | Proxy / Notes |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `@` (apex) | `76.76.21.21` | Auto / 300s | Vercel Anycast Edge IP |
| **CNAME** | `www` | `cname.vercel-dns.com.` | Auto / 300s | Apex redirect or canonical |
| **CNAME** | `app` | `cname.vercel-dns.com.` | Auto / 300s | Dedicated portal entry |
| **CNAME** | `ws` | `ws-relay-prod.fly.dev.` | 300s | WebSocket clustering relay |

### 2.2 Resend Transactional Email Authentication
To ensure 99.9% inbox deliverability for enrollment confirmations, trial booking notices, and invoice PDF receipts:

| Type | Name / Host | Target / Value | Priority | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **TXT** | `resend._domainkey` | `k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQ...` | - | DKIM Signature |
| **TXT** | `@` | `v=spf1 include:amazonses.com include:_spf.resend.com ~all` | - | SPF Sender Validation |
| **TXT** | `_dmarc` | `v=DMARC1; p=reject; pct=100; rua=mailto:dmarc@quranacademy.com` | - | DMARC Anti-Spoofing Policy |
| **MX** | `mail` | `feedback-smtp.us-east-1.amazonses.com` | 10 | Return-Path / Bounces |

---

## 3. Zero-Stripe Multi-Currency Payment Rail Operations

Quran Learn Academy operates exclusively on direct, zero-fee sovereign banking rails. No third-party card processors or Stripe tokens exist.

### 3.1 Settlement Rails Configuration
1. **PKR (Pakistan)**:
   - Rail: State Bank of Pakistan **Raast Instant P2P / P2M** & Meezan Bank IBAN Direct Transfer.
   - Verification: Parents upload IBAN transaction reference or 6-digit Raast RRN.
   - Auto-Clearance: Admin portal matches incoming bank statement CSV or manual clearance in `/admin`.
2. **GBP (United Kingdom & Ireland)**:
   - Rail: **Barclays Bank UK** via Faster Payments Service (FPS) / BACS.
   - Verification: 6-digit sort code + 8-digit account number match with unique invoice token.
3. **USD (United States & Canada)**:
   - Rail: **JPMorgan Chase** ACH Direct Credit & Zelle Business transfer.
   - Verification: Wire reference or Zelle confirmation code.
4. **EUR (European Union)**:
   - Rail: **Wise Europe SEPA Instant Credit Transfer**.
   - Verification: SEPA End-to-End Reference match.
5. **International Wire / SWIFT**:
   - Rail: Standard SWIFT BIC/IBAN wire instructions rendered dynamically on the `/payments` hub.

### 3.2 Invoice & Receipt Workflow
1. Tuition invoice generated automatically at `/api/invoices/[id]/download` using `@react-pdf/renderer`.
2. Customer completes bank wire using unique reference ID (`INV-YYYY-XXXX`).
3. Parent uploads payment screenshot or transaction reference via `/parent/billing`.
4. Admin reviews proof in `/admin/finances` and clicks **"Verify & Approve"**.
5. System triggers Resend email dispatch (`packages/adapters/src/email.ts`) delivering PDF receipt and unlocks student classroom portal.

---

## 4. LiveKit WebRTC & WebSocket Cluster Runbook

### 4.1 LiveKit Cloud / Self-Hosted SFU
- **Codec Profile**: Audio-only high-fidelity voice optimized for Tajweed phonetics (OPUS 48kHz stereo, 64kbps, forward error correction enabled).
- **Latency Budget**: Sub-500ms global glass-to-glass latency.
- **Pre-Call Diagnostics**: `apps/web/src/features/classroom/DeviceCheckModal.tsx` tests microphone, camera, and network latency before students or teachers enter a room.

### 4.2 WebSocket Dual-Cursor Relay (`apps/ws`)
- **Horizontal Scaling**: Multi-node deployment on Fly.io / ECS behind Redis Pub/Sub cluster broker (`RedisClusterBroker`).
- **Heartbeat & Reconnection**: 15-second ping/pong keepalive. Auto-reconnect with exponential backoff on client side.
- **Health & Metrics Endpoint**: `http://localhost:3001/metrics` or `https://ws.quranacademy.com/metrics`.

---

## 5. Security, COPPA Compliance & Child Safety SOP

1. **Strict Student PII Partitioning**:
   - Teachers and unauthenticated callers can NEVER query or view a minor student's phone number, email address, physical location, or parent contact details.
   - Enforced in `apps/web/src/lib/security/childSafety.ts` via `maskStudentPii()`.
2. **Double-Booking & Schedule Collision Prevention**:
   - Enforced by database exclusion / partial index `idx_teacher_no_double_booking` and application logic `hasScheduleCollision()`.
3. **Consent-Gated Classroom Recording**:
   - WebRTC session recording is strictly prohibited unless `parental_consent_recording = true` in Supabase `student_profiles`.
4. **Rate Limiting & Abuse Prevention**:
   - In-memory sliding-window rate limiter protects sensitive endpoints (`/api/health`, `/api/email/send`, `/api/livekit/token`).
   - Requests exceeding 120 req/min return `HTTP 429 Too Many Requests` with `Retry-After` header.

---

## 6. Incident Management & SEV-1 Triaging Matrix

| Severity | Definition | Target MTTR | Escalation Lead | Immediate Action |
| :--- | :--- | :--- | :--- | :--- |
| **SEV-0** | Complete platform outage, database corruption, or data leak | < 15 mins | Lead Architect & CTO | Rollback to last stable Vercel deployment; isolate DB connections; activate maintenance banner. |
| **SEV-1** | Live classroom audio failure or WebSocket state sync desync | < 30 mins | Realtime Media Engineer | Check `/metrics` on WebSocket cluster; reboot degraded WS pods; verify LiveKit SFU status. |
| **SEV-2** | Payment confirmation delays or transactional email queuing | < 2 hours | Operations / FinTech Lead | Check Resend API status; verify SMTP sandbox/live credentials; queue manual email receipts. |
| **SEV-3** | Minor UI layout glitch or non-critical localization typo | < 24 hours | Frontend Engineer | Standard PR review and Vercel preview deployment. |

### Rollback Procedure (Vercel & Supabase)
1. **Frontend Instant Rollback**: In Vercel Dashboard, select previous green deployment and click **"Promote to Production"** (< 30 seconds).
2. **Database Migration Rollback**: Execute targeted rollback migration script in `supabase/migrations/rollback/`. Do NOT drop customer tables without verified point-in-time recovery backup.

---

## 7. Monitoring, APM & Observability

- **Central Diagnostics**: [`/api/health`](file:///apps/web/src/app/api/health/route.ts) provides JSON telemetry for Supabase pooler, LiveKit SFU, Deepgram STT, Resend dispatch, and WebSocket brokers.
- **APM Error Tracking**: [`apps/web/src/lib/telemetry.ts`](file:///apps/web/src/lib/telemetry.ts) captures unhandled exceptions with sanitized context and performance span timers.
- **Conversion Funnel Analytics**: [`apps/web/src/lib/analytics.ts`](file:///apps/web/src/lib/analytics.ts) streams critical conversion metrics:
  - `trial_booked`
  - `classroom_entered`
  - `lesson_completed`
  - `receipt_uploaded`
  - `payment_verified`
