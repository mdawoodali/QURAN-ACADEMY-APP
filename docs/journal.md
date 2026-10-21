# Quran Academy — Architectural & Security Learning Journal

This journal documents the engineering decisions, security defenses, UX design philosophy, and threat mitigation strategies implemented across Quran Academy.

---

## 1. Architectural Foundation & Spec-Driven Workflow

### The Modular Monolith Pattern
- **Workspace Architecture**: Organized via `pnpm` workspace into vertical slices:
  - `apps/web`: Next.js 16 (App Router + Turbopack) presentation layer, server actions, and localized public pages.
  - `apps/ws`: Standalone Node.js WebSocket engine handling sub-500ms real-time classroom sync (mushaf highlights, ayah selection, voice-following cursor).
  - `packages/domain`: Pure TypeScript business logic, Quran speech matcher, course progress calculations, and pricing rules.
  - `packages/contracts`: Zod schemas and TypeScript types defining runtime boundary contracts.
  - `packages/adapters`: Infrastructure adapters for WebRTC (LiveKit), Payments (Stripe/Sandbox), and Al-Quran cloud services.
- **Spec-Driven Development (OpenSpec)**: All feature additions and domain changes adhere to formal contracts and documented interfaces before code generation, preventing scope creep and architectural drift.

---

## 2. Comprehensive Security Defense & Vulnerability Mitigation

| Attack Vector | Vulnerability Category | Mitigation Strategy Implemented |
| :--- | :--- | :--- |
| **SQL Injection** | Injection (A03:2021) | All database operations use Supabase PostgREST client with parameterized queries and Prisma ORM. No raw concatenated SQL strings. Strict PostgreSQL Row-Level Security (RLS) policies enforce database-level access boundaries. |
| **BOLA / IDOR** | Broken Access Control (A01:2021) | Object-level authorization is enforced strictly on the server. Next.js middleware and server actions verify user identity via cryptographic Supabase JWT tokens. Endpoints never trust client-supplied user IDs; records must match `auth.uid()`. |
| **Cross-Site Scripting (XSS)** | Injection (A03:2021) | React JSX provides automated context-aware string escaping. Security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`) restrict unauthorized script interpretation and clickjacking. |
| **CSRF Attacks** | Broken Authentication | Supabase SSR authentication uses encrypted, `SameSite=Lax` / `SameSite=Strict` HttpOnly cookies for session management. State-mutating actions utilize Next.js Server Actions with built-in origin verification. |
| **Auth Token Storage (LocalStorage)** | Credential Theft | Auth tokens are never stored in browser `localStorage` or `sessionStorage` where malicious third-party scripts could extract them. Tokens are handled via secure server cookies. |
| **Secret Key Leakage** | Security Misconfiguration | Production build disables browser source maps (`productionBrowserSourceMaps: false`). Sensitive API keys (Stripe Secret Key, Supabase Service Role Key, LiveKit API Secret) are restricted to server execution environments and omitted from `NEXT_PUBLIC_` namespaces. |
| **ReDoS / LPdos** | Denial of Service | Regex patterns used in verse transliteration and speech matching avoid nested quantifiers and catastrophic backtracking. Text matching operates via linear word-index comparison algorithms. |
| **SSTI (Server-Side Template Injection)** | Remote Code Execution | PDF reports and dynamic certificates are generated using `@react-pdf/renderer` with strict component primitives rather than evaluated HTML/string template engines. |
| **Webhook Spoofing & Replay Attacks** | Integrity Failure | Payment webhooks (Stripe) verify cryptographic HMAC SHA-256 signatures (`stripe-signature`) and enforce timestamp tolerance windows to neutralize replay attacks. |
| **SSRF (Server-Side Request Forgery)** | Server Security | Remote image loading in Next.js is locked down via explicit `images.remotePatterns` in `next.config.ts`. Cloud media requests are bounded to verified hostnames. |
| **Child Safety & Guardian Privacy (COPPA / GDPR-K)** | Privacy & Compliance | Child accounts cannot initiate unmonitored video sessions. Session recordings require explicit two-way teacher/guardian consent. PII (phone numbers, billing addresses) is strictly restricted to Guardian profiles and hidden from instructors. |

---

## 3. Web Quality, SEO & Production Hardening (20-Point Checklist)

1. **Custom 404 Page (`/not-found`)**: Handcrafted, accessible error page offering immediate navigational recovery (Homepage, Programmes, Free Trial, and Student Support).
2. **`robots.txt` (`/robots.ts`)**: Structured indexing directives allowing search engines to index public funnels while blocking portal interiors (`/admin`, `/student`, `/teacher`, `/parent`, `/classroom`).
3. **`sitemap.xml` (`/sitemap.ts`)**: Auto-generated dynamic sitemap indexing all public courses, pricing tiers, legal policies, and blog articles with update frequencies and priority scores.
4. **`llms.txt` (`/llms.txt`)**: Clean, authoritative markdown documentation optimized for AI crawlers, Perplexity, Gemini, and LLM search agents.
5. **OpenGraph & Twitter Card Metadata**: Enriched OpenGraph tags, title templates (`%s | Quran Academy`), meta descriptions, and localized metadata.
6. **JSON-LD Structured Data Schema**: `EducationalOrganization` and `Course` schemas embedded in `RootLayout` for Google Rich Search snippets.
7. **Mobile Sticky Action Bar (`MobileStickyCTA`)**: Unobtrusive bottom dock on mobile screens providing high-conversion quick taps for "Book Free Trial" and "WhatsApp Teacher".
8. **Security Headers**: Configured in `next.config.ts`:
   - `X-Frame-Options: SAMEORIGIN`
   - `X-Content-Type-Options: nosniff`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Permissions-Policy: camera=(self), microphone=(self), geolocation=()`
   - Disabled `x-powered-by` header to prevent server fingerprinting.
9. **Elimination of "AI Slop" Aesthetics**:
   - Replaced full-screen blocking splash overlays with direct, accessible software interfaces.
   - Refined typography utilizing Source Serif 4, Figtree, and authentic Amiri Quran Arabic fonts.
   - Micro-interactions built with spring physics and high-contrast, accessible touch targets.
10. **Legal & Compliance Infrastructure**: Complete public terms, privacy policies, delivery & refund guidelines, and cookie consent foundations.


---

## 4. Phase 13 Extensions: Script Selectors, Classical Shia Library, Database Session Persistence & LiveKit WebRTC

### 4.1 Script & Tajweed Control Architecture
- **Problem**: Tajweed rules were previously coupled with reciter selection or shown only in Uthmani script, making it unclear whether IndoPak Subcontinent readers could access Tajweed color highlights.
- **Implementation**:
  - Implemented decoupled **Script Selector** (`Uthmani (Madani)` vs `IndoPak (Subcontinent 15/16 Line)`) in both the Live Classroom (`LiveClassroom.tsx`) and Quran Self-Practice Reader (`QuranPracticePlayer.tsx`).
  - Added a dedicated **Tajweed Control** directly beneath the script selector (`Color-Coded Tajweed` vs `Plain Text`), rendering color-coded phonetic categories (Madd in Rose, Ghunnah in Emerald, Qalqalah in Sky, Ikhfa in Amber) with interactive hover tooltips explaining the rule.
  - Changes made in `LiveClassroom.tsx` are synchronously broadcast to the student's viewport across WebSockets and WebRTC channels.

### 4.2 Academy Resources & Classical Shia Library
- **Renamed Tab**: Updated tab navigation from *"Downloadable Guides & Duas"* to **"Daily Guides & Duas"**.
- **Embedded In-App Reader**: Eliminated external PDF failure/timeout issues by creating `apps/web/src/data/guidesData.ts` with complete structured contents (Noorani Qaida, Daily Masnoon Duas, Tajweed Reference Chart, Juz Amma Practice Reader) rendered directly in a responsive, modal in-app reader with instant offline text exports.
- **Shia Reference Library**: Introduced a 3rd dedicated tab in `/resources` backed by `apps/web/src/data/shiaLibrary.ts`. Houses key classical Shia reference works:
  - *Nahjul Balagha* (Sermons, Letters, Sayings of Imam Ali AS)
  - *Al-Sahifa al-Sajjadiyya* (Supplications of Imam Zayn al-Abidin AS)
  - *Al-Kafi / Usool-e-Kafi* (Hadith compendium by Shaykh al-Kulayni)
  - *Mafatih al-Jinan* (Supplications & Ziyarat by Shaykh Abbas Qummi)
  - Expandable by Academy Administrators through the Admin Portal with categorized filters and offline text export.

### 4.3 Database-Backed Session Persistence Architecture
- **Problem**: Schedules and assignments were formerly demonstrated via static client arrays, lacking PostgreSQL persistence.
- **Database Schema**: Created migration `supabase/migrations/20261020000000_session_persistence.sql` establishing:
  - `teacher_assignments`: Admin-governed or student-selected teacher-student relationships.
  - `recurring_schedules`: Day of the week (`Monday` to `Sunday`), local time, duration, timezone anchor (`Europe/London`, `Asia/Karachi`).
  - `class_sessions`: Materialized individual lessons with live LiveKit room identifiers and status.
  - `session_attendance_logs`: Duration, student/teacher join timestamps, surah/ayah covered, and teacher rating.
  - Full Row-Level Security (RLS) policies per user role and foreign-key indexing for queries across 10,000+ users.
- **Server Route & Client Repository**: Implemented `/api/scheduling` and `apps/web/src/server/schedulingRepository.ts`, providing seamless persistence with graceful relational fallback for offline development.
- **Admin & Student Portals**: Connected `/admin/scheduling` with a "Persist New Class Schedule" modal and live calendar visualization, and connected `/student/classes` with dynamic schedule retrieval.

### 4.4 Real-Time LiveKit WebRTC Server Pairing
- **Problem**: Multi-user room connections between two distinct browser sessions required cloud credentials, preventing testing across separate browser windows.
- **Implementation**:
  - Implemented `/api/livekit/token/route.ts` using official `livekit-server-sdk`. Generates cryptographically signed JWT `AccessToken` tokens granting room join, media publish/subscribe, and data channel permissions for digital mushaf synchronization.
  - Integrated zero-config dual-mode pairing: If cloud credentials (`LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`) are provided in `.env.local`, connects to LiveKit Cloud WebRTC servers. If in development/sandbox mode, synchronizes teacher and student browser windows simultaneously via `BroadcastChannel` and WebSocket data channels.
  - Updated `LiveClassroom.tsx` to automatically query the token API upon room entry and render a real-time LiveKit server pairing indicator.


---

## 5. Phase 14 Extensions: Privileged Admin Client, Dedicated Shia Tool Kit & Mandatory Journal Enforcement

### 5.1 Environment Security & Privileged Admin Supabase Client
- **Problem**: Privileged backend procedures (student-teacher pairings, automated attendance verification, class scheduling overrides) require bypassing user-level PostgreSQL Row-Level Security (RLS) from secure server contexts without exposing private keys.
- **Implementation**:
  - Populated `SUPABASE_SERVICE_ROLE_KEY` in `apps/web/.env.local` and root `.env` securely.
  - Hardened `.gitignore` to strictly exclude `.env`, `.env*.local`, and `.env.*` to guarantee private service role keys are never committed to version control.
  - Built `apps/web/src/utils/supabase/admin.ts` exposing `createAdminClient()`. The function instantiates a dedicated Supabase client using `@supabase/supabase-js` with `persistSession: false` and `autoRefreshToken: false`.
  - Added architectural safeguards and docstring warnings prohibiting invocation from client components (`"use client"`), restricting execution strictly to Server Actions and API Route Handlers.

### 5.2 Dedicated Shia Islamic Tool Kit Suite
- **Problem**: While classical texts were introduced in the Shia Library in Phase 13, everyday Shia students, teachers, and families lacked interactive spiritual utilities for daily worship, prayer timings, and jurisprudential guidance.
- **Data Source Architecture**: Created `apps/web/src/data/shiaToolkitData.ts` providing structured data across five spiritual domains:
  - **Tasbih of Sayyida Fatima al-Zahra (SA)**: Complete 34-33-33 sequence with prophetic hadiths and custom dhikr presets (Salawat, Istighfar, Tasbihat al-Arba'ah, Dhikr Yunus).
  - **Core Shia Duas & Ziyarat**: Comprehensive Arabic diacritics, transliteration, English translation, and context for *Ziyarat Ashura*, *Ziyarat Waritha*, *Dua Kumayl*, *Dua Tawassul*, *Dua Ahad*, *Hadith al-Kisa*, and *Dua al-Faraj*.
  - **Ja'fari Prayer Timing Standards**: Astronomical twilight calibrations according to the Leva Institute / University of Tehran method (Maghrib at the departure of eastern redness ~4° below horizon; Midnight halfway between sunset and dawn), coupled with canonical evidence from Sahih Muslim and Al-Kafi on the Sunnah of combining Dhuhr/Asr and Maghrib/Isha.
  - **Ahkam & Daily Fiqh**: Step-by-step guidance on Ja'fari Wudhu (wiping of head and feet from toes to ankle without water tap washing; washing arms from elbow downwards) and the obligation of prostrating on pure earth / Turbah Karbala.
  - **The 14 Infallibles (Chahardah Masoomeen AS) Timeline**: Key biographical dates, shrines, and commemorations across the Hijri calendar.
- **Interactive Component**: Implemented `apps/web/src/components/ShiaToolkit.tsx`:
  - **Digital Tasbeeh Widget**: Interactive tap counter with Web Audio synthesizer click feedback, haptic vibration (`navigator.vibrate`), circular progress indicator, phase transitions (Allahu Akbar 34 -> Alhamdulillah 33 -> SubhanAllah 33), lap counter, and reset.
  - **Duas In-App Modal Reader**: Responsive modal viewer with line-by-line Arabic, transliteration, English translation, one-click clipboard copy, and instant offline `.txt` export.
  - **Ja'fari City Prayer Calculator**: Multi-city switcher (Karachi, Islamabad, Lahore, Najaf, Karbala, London, New York, Toronto, Dubai) with live prayer cards.
  - **Ahkam Guide Cards**: Card-based breakdown of Wudhu, Sajdah upon Turbah, and prayer postures.
- **Portal & Resources Integration**:
  - Added the **"Shia Tool Kit"** tab to `/resources` (`apps/web/src/app/(public)/resources/page.tsx`).
  - Integrated automatic tab selection: When a user selects *"Shia Curriculum"* on the `WelcomeSplash` screen (`user_sect === "shia"`), the resources page automatically activates the Shia Tool Kit tab by default.

### 5.3 Automated Multi-Tier `docs/journal.md` Enforcement System
- **Requirement**: Guarantee that developer **Isbah** and any AI model (Claude, Antigravity, Cursor, Devin, Copilot, etc.) reading code from GitHub and attempting to commit or push is strictly forced to update `docs/journal.md`.
- **Enforcement Architecture**:
  1. **Git Pre-Commit Hook (`.githooks/pre-commit`)**:
     - Automatically inspects `git diff --cached --name-only`.
     - If `docs/journal.md` is absent from staged changes, the commit command aborts immediately with an actionable error.
  2. **Git Pre-Push Hook (`.githooks/pre-push`)**:
     - Inspects outgoing commits (`@{u}..HEAD`).
     - If `docs/journal.md` was not updated across the commits being pushed to remote, the push is blocked.
  3. **Repository Initialization Script (`package.json`)**:
     - Configured `"prepare": "git config core.hooksPath .githooks"` in root `package.json` so every `pnpm install` automatically binds the hooks.
  4. **GitHub Actions CI Job (`.github/workflows/ci.yml`)**:
     - Added an independent, blocking job `enforce-journal` that executes on every push to any branch and every Pull Request.
     - Runs `git diff --name-only` against `origin/main` (for PRs) or `HEAD~1` (for pushes).
     - Fails the CI pipeline with a GitHub annotation if `docs/journal.md` was not modified, preventing merging of non-compliant code.
  5. **Cross-AI Rules & Directives**:
     - Added explicit, top-priority governance instructions in `AGENTS.md`, `CLAUDE.md`, `.cursorrules`, `.github/copilot-instructions.md`, and `CONTRIBUTING.md`.


### 5.4 Brand Consistency: Proportional Navbar Logo & Browser Tab Favicon
- **Problems Identified**:
  1. The navbar brand crest was previously rendered with negative absolute positioning (`lg:absolute lg:top-[-42px]`) and scaled to `144px × 144px`, causing it to protrude awkwardly into both the top contact bar and the green hero section, accompanied by artificial 250px dead spacer divs.
  2. The browser tab rendered the default Next.js black-and-white "N" icon because `metadata.icons` was unconfigured and `src/app/favicon.ico` was a leftover starter asset.
- **Implementation & Fixes**:
  - **Proportional Navbar Logo**: Refactored `apps/web/src/components/PublicNavbar.tsx`:
    - Removed `lg:absolute lg:top-[-42px]` and all artificial 250px dead spacer divs.
    - Sized the brand crest proportionally to `w-13 h-13 sm:w-14 sm:h-14 lg:w-16 lg:h-16` (56px–64px), seated naturally within a balanced `h-20 sm:h-22` navigation bar.
    - Restored natural flex alignment so contact badges, navigation links, and login/trial action buttons are centered and balanced without visual crowding.
  - **Browser Tab Favicon & PWA Icons**:
    - Replaced `apps/web/src/app/favicon.ico` and `apps/web/public/favicon.ico` with authentic Quran Learn Academy icons built from `/logo_quran_learn_academy.png`.
    - Generated `apps/web/src/app/icon.png`, `apps/web/src/app/apple-icon.png`, and `apps/web/public/icon.png`.
    - Explicitly defined `icons` metadata in `apps/web/src/app/layout.tsx` alongside direct `<link rel="icon">` and `<link rel="apple-touch-icon">` tags in `<head>`.
    - Updated `apps/web/public/manifest.json` with multi-resolution PWA icons (512x512, 192x192, 48x48).
  - **Footer Branding**: Updated `apps/web/src/components/Footer.tsx` column 1 to display the golden official crest alongside the brand title.

---

## 6. Resources Expansion: Digital Tasbeeh, Prayer Times, Qibla, 99 Names, and Seerat un Nabi

### 6.1 Digital Tasbeeh (Misbaha)
- **Component**: `apps/web/src/features/resources/components/DigitalTasbeeh.tsx`
- **Capabilities**:
  - Tactile electronic counter with big glowing emerald button and circular progress gauge.
  - Preset Adhkar: *SubhanAllah* (33x), *Alhamdulillah* (33x), *Allahu Akbar* (34x), *Astaghfirullah* (100x), *La ilaha illallah* (100x), *Durood Sharif* (100x), and *Hawqala* (100x).
  - Target goals: 33, 99, 100, or Unlimited (Free count).
  - Web Audio API synthesizer generating subtle physical click sounds on tap without external MP3 asset dependency.
  - Hardware haptic vibration support (`navigator.vibrate(30)` on tap and `[60, 50, 100]` on lap completion).
  - Real-time completed laps and daily session counters.

### 6.2 Prayer Times & Qibla Direction
- **Component**: `apps/web/src/features/resources/components/PrayerTimesQibla.tsx`
- **Capabilities**:
  - Solar astronomical prayer calculation algorithms for Fajr, Sunrise, Dhuhr, Asr, Maghrib, and Isha.
  - Asr juristic toggle between **Hanafi** (double shadow length) and **Shafi'i / Standard** (single shadow length).
  - Multi-city presets (Karachi, Lahore, Islamabad, London, New York, Mecca, Medina, Dubai, Toronto, Sydney) plus HTML5 Geolocation API auto-detection.
  - Great-circle mathematical Qibla angle calculation relative to true North pointing towards the Holy Kaaba (`21.4225° N, 39.8262° E`).
  - Interactive visual compass ring with rotating Kaaba indicator needle and live device orientation support on mobile devices (`DeviceOrientationEvent`).

### 6.3 Asma-ul-Husna (99 Names of Allah)
- **Data Source**: `apps/web/src/data/asmaUlHusna.ts`
- **Component**: `apps/web/src/features/resources/components/AsmaUlHusnaView.tsx`
- **Capabilities**:
  - Complete, authentic digitization of all 99 Divine Names in Arabic calligraphy with numbered badges (1–99).
  - English and Urdu translations along with spiritual virtues and contemplative explanations.
  - Real-time multilingual keyword search across names, transliterations, numbers, and meanings.
  - One-click formatted clipboard export with toast notification.

### 6.4 Seerat-un-Nabi (S.A.W)
- **Data Source**: `apps/web/src/data/seeratData.ts`
- **Component**: `apps/web/src/features/resources/components/SeeratView.tsx`
- **Capabilities**:
  - Chronological 9-chapter timeline from blessed birth (570 CE) to the Farewell Pilgrimage (Hajjat-ul-Wida) and passing (11 AH).
  - Filterable by era: **All**, **Makkah**, **Madinah**, and **Universal**.
  - In-app interactive reader modal with full historical narrative, turning points, and moral virtues.
  - One-click formatted `.txt` study guide download for offline reading.

---

## 7. CI/CD Pipeline Green-Light Verification & ESLint Rectification

### 7.1 Issue Diagnosis
- **Symptom**: GitHub Actions CI workflow runs (`.github/workflows/ci.yml`) failed at the `validate` job during the `pnpm lint` step with error code 1 (`✖ 106 problems (1 error, 105 warnings)`).
- **Root Cause**:
  - In `apps/web/src/app/api/scheduling/route.ts:5:5`:
    `let IN_MEMORY_SCHEDULES = [...]` was flagged by ESLint rule `prefer-const` because the variable reference was never reassigned (mutations were made in-place via `.push()`).

### 7.2 Resolution & Verification
- **Code Fix**:
  - Refactored `apps/web/src/app/api/scheduling/route.ts` to `const IN_MEMORY_SCHEDULES = [...]`.
- **Pre-Flight Validation**:
  - `pnpm lint`: Exited with code 0 (0 errors, 105 warnings).
  - `pnpm build`: Exited with code 0; all 49 static and dynamic routes compiled and generated successfully with Turbopack.
  - `pnpm audit --prod --audit-level critical`: 0 known vulnerabilities.
  - Policy enforcement: `docs/journal.md` updated as required by repository pre-commit/pre-push hooks and the `enforce-journal` CI job.


---

## 8. Enterprise 10/10 Hardening: Zero-Warning Hygiene, Vitest Suite, WS Broker & DB Unification

### 8.1 Zero-Warning Codebase Hygiene (Cleanliness Benchmark: 10/10)
- **Problem**: 105 non-fatal ESLint warnings were present across 32 files in `apps/web`, including unused imports, loose `any` types, unescaped characters, missing hook dependencies, and inline component declarations inside render loops.
- **Architectural Rectification**:
  - **Static Component Lifting**: Extracted `LetterPracticeTray` in `LiveClassroom.tsx` to module level, eliminating `react-hooks/static-components` re-instantiation warnings.
  - **Hook Dependency Integrity**: Stabilized `TestimonialsCarousel.tsx` with `useCallback` for `handleNext` and `handlePrev`, resolving `react-hooks/immutability` and missing dependency array issues.
  - **Type-Safe Keying**: Replaced ambiguous `as any` casts in `(public)/page.tsx` and `PublicNavbar.tsx` with strict `TranslationKey` typings exported from `LanguageContext`.
  - **Image Optimization**: Migrated raw `<img>` tags in `Footer.tsx`, `PublicNavbar.tsx`, and `WelcomeSplash.tsx` to Next.js `<Image />` with optimal width, height, and responsive fill attributes.
  - **Defensive Error Handling**: Replaced loose `catch (e: any)` and unused exception parameters with modern type-safe `catch (error: unknown)` and concise `catch {}` blocks across API route handlers.
- **Result**: `pnpm lint` now terminates with **0 errors and 0 warnings** across the entire repository.

### 8.2 Automated Testing Infrastructure (Vitest & Regression Safety: 10/10)
- **Framework Setup**: Configured `vitest` with native ESM module support (`vitest.config.mjs`) and monorepo path aliases (`@quran/domain`, `@quran/contracts`, `@quran/adapters`, `@`).
- **Test Suites Implemented (20 Tests across 4 Spec Files)**:
  1. `packages/domain/src/quran/speechMatcher.test.ts`: Validates Arabic text normalization (harakat removal, Alif unification, tatweel stripping) and fuzzy/phonetic speech-to-verse alignment.
  2. `packages/domain/src/quran/prayerMath.test.ts`: Validates astronomical solar equations of time, spherical trigonometric Qibla bearing/distance calculations (London ~118°, Karachi ~267°), and Hanafi vs Standard Asr shadow differentials.
  3. `packages/contracts/src/contracts.test.ts`: Enforces strict runtime validation on User roles, teacher application statuses, scheduling lifecycles, and student onboarding payloads.
  4. `apps/ws/broker.test.ts`: Validates real-time pub/sub event broadcasting, cross-room message isolation, and connection teardown.
- **CI Integration**: Wired `pnpm test` directly into `.github/workflows/ci.yml` before typecheck and production build.

### 8.3 Real-Time Classroom Engine Architecture (`apps/ws`: 10/10)
- **Heartbeat & Zombie Connection Pruning**: 30-second ping/pong cycles automatically terminate unacknowledged ghost WebSocket connections, preventing memory leaks on high-volume traffic.
- **Horizontal Scalability Broker (`RoomMessageBroker`)**: Introduced an adapter pattern isolating room broadcasting from Node.js process state, enabling seamless drop-in support for Redis Pub/Sub clusters.
- **Contract-Backed Event Typing**: Added `ClassroomEventSchema` to `packages/contracts` for type-safe cursor highlight, huroof split, and whiteboard tool synchronization.

### 8.4 Database & Persistence Layer Unification (`prisma` & `supabase`: 10/10)
- **Discrepancy Elimination**: Migrated `apps/web/prisma/schema.prisma` from local SQLite (`dev.db`) to PostgreSQL with `env("DATABASE_URL")`, establishing single-source-of-truth parity with Supabase migrations (`profiles`, `student_details`, `teacher_details`, `classes`, `courses`).
- **Resilient API Fallbacks**: Hardened `api/scheduling/route.ts` with typed database queries querying live PostgreSQL tables with fallback handling for local offline testing.


---

## 9. Apple/Google-Grade Engineering Overhaul: Modular Classroom, Performance Indexes, Audit Trail & Health Probe

### 9.1 LiveClassroom Complete Modular Decomposition (`apps/web/src/features/classroom`)
- **Problem**: `LiveClassroom.tsx` was a monolithic 795-line component coupling video streaming, WebSocket messaging, speech recognition, DOM state, drawing tools, and UI rendering in a single file.
- **Architectural Decomposition**:
  - Re-architected into a clean domain module under `apps/web/src/features/classroom/`:
    - `components/MushafBoard.tsx`: Stateless, highly optimized word-by-word interactive Quran canvas with Tajweed styling and cursor highlights.
    - `components/ClassroomToolbar.tsx`: Static tool palette isolating drawing modes, color picker, and font sizing controls.
    - `components/LetterPracticeTray.tsx`: Morphological breakdown component for phonics and Tajweed practice.
    - `components/ClassroomVideoBubble.tsx`: Picture-in-picture floating camera bubble with hardware acceleration.
    - `components/ClassroomHeader.tsx`: Responsive navigation bar displaying session metadata, script mode toggles, and live connection status.
    - `hooks/useClassroomSync.ts`: Custom hook isolating WebSocket connection lifecycle, cross-tab `BroadcastChannel`, and tool synchronization.
    - `hooks/useVoiceFollow.ts`: Custom hook managing microphone capture, Deepgram Nova-2 streaming WebSocket, Web Speech fallback, and cleanup.
  - Reduced `apps/web/src/components/LiveClassroom.tsx` from **795 lines down to 267 lines** of pure high-level orchestrator logic.

### 9.2 High-Concurrency Database Indexes & Immutable Audit Trail (`supabase` & `prisma`)
- **Migration**: Created `supabase/migrations/20261021000000_performance_indexes_and_audit.sql`:
  - **High-Concurrency Composite Indexes**:
    - `idx_class_sessions_perf_lookup` on `class_sessions(status, start_time, teacher_id, student_id)` for instantaneous calendar and active room queries.
    - `idx_recurring_schedules_day_status` on `recurring_schedules(day_of_week, status)` for fast scheduling lookups.
    - `idx_session_attendance_student_created` and `idx_session_attendance_teacher_created` on `session_attendance_logs`.
  - **Immutable Audit Trail (`audit_logs`)**:
    - Established tamper-proof table tracking administrative role changes, teacher assignments, scheduling changes, and billing exports.
    - Installed PostgreSQL trigger `enforce_audit_log_immutability()` strictly preventing `UPDATE` and `DELETE` operations.
    - Configured Row Level Security (RLS) restricting reads to verified administrators.
  - **Prisma Schema Synchronization**: Added `AuditLog` model and composite index to `apps/web/prisma/schema.prisma`.

### 9.3 WebSocket Concurrency & Latency Stress Test Harness (`scripts/load-test-ws.js`)
- Developed a high-concurrency Node.js benchmark tool capable of simulating 100–500 virtual clients.
- Measures throughput (msg/s), connection success rate, and round-trip latency percentiles (p50, p90, p95, p99, max).
- Built-in dry-run diagnostic handling when server is offline, with clear setup guidance.

### 9.4 Production Health & Kubernetes Readiness Probe (`apps/web/src/app/api/health/route.ts`)
- Added `/api/health` dynamic route returning runtime uptime, Node.js version, memory consumption (heapUsed, heapTotal, rss in MB), and configuration statuses for Supabase, LiveKit, and Deepgram.
- Integrated automated Vitest test in `apps/web/src/app/api/health/health.test.ts`.

### 9.5 Formal Architectural Decision Record (ADR)
- Published `docs/adr/001-distributed-realtime-classroom-architecture.md` specifying media/data plane decoupling, SFU offload, horizontal WebSocket clustering, and dual-engine speech-to-text design.

### 9.6 Multi-Tier Automated Test Suite Expansion (24 Tests, 100% Green)
- Added `apps/web/src/features/classroom/classroom.test.ts` verifying grapheme decomposition, Unicode normalization, and script data integrity.
- Added `apps/web/src/app/api/health/health.test.ts` verifying health diagnostic payloads.
- Vitest suite now runs **24 automated tests across 6 spec files in <750ms** with 100% pass rate.


### 9.7 Edge-Case Hardening & Reconnection Resilience (Shaheen Traders POS Standard)
- **Automatic Reconnection Loop**: Re-engineered `useClassroomSync.ts` with an exponential backoff auto-reconnect strategy (starting at 1s, scaling to 10s maximum) to withstand real-world mobile 4G/5G connection drops. Added `connectionStatus` (`connected` | `reconnecting` | `offline`) with real-time UI indicator badges in `ClassroomHeader.tsx`.
- **Fault-Tolerant React Error Boundary**: Created `apps/web/src/app/classroom/[id]/error.tsx` providing an automated recovery mechanism and safe diagnostic logging, preventing unhandled WebRTC/MediaStream errors from crashing the page.
- **Branded Suspense Skeleton**: Added `apps/web/src/app/classroom/[id]/loading.tsx` ensuring zero layout shift while the Mushaf board initializes.
- **Double-Booking Database Exclusion**: Added unique partial index `idx_prevent_teacher_double_booking` on `class_sessions (teacher_id, start_time) WHERE status IN ('scheduled', 'live')`, preventing race conditions and overlapping booking collisions at the database level.
- **Comprehensive Edge Case Testing**: Added test cases in `apps/web/src/features/classroom/classroom.test.ts` for empty strings, nullish inputs, non-Arabic punctuation, and complex diacritics. Suite now runs 25 automated tests with 100% green pass rate.


### 9.8 Production Cloud Build Alignment (Vercel Build Gate Rectification)
- **Elimination of App-Directory Test Pollution**: Relocated test files out of `apps/web/src/app/api/health/` and `apps/web/src/features/classroom/` into dedicated root `tests/` directory (`tests/classroom.test.ts`, `tests/health.test.ts`), preventing Next.js App Router route discovery collisions during cloud production bundling.
- **Client Boundary Enforcement**: Injected `"use client";` into `apps/web/src/features/classroom/index.ts` barrel export to prevent SSR/CSR boundary chunking regressions.
- **Standardized Prisma Schema Index Syntax**: Replaced non-standard `(sort: Desc)` modifier with universal standard `@@index([actorId, createdAt])` and `@@index([action, createdAt])` in `apps/web/prisma/schema.prisma` to eliminate schema engine parse errors across diverse cloud environments.
- **Next.js TypeScript Isolation**: Configured `apps/web/tsconfig.json` to explicitly exclude all test files (`**/*.test.ts`, `**/*.spec.ts`, `tests`) from Next.js bundle generation while maintaining full test coverage in Vitest. Added `vitest` dependency in `apps/web/package.json` for isolated subproject builds.
- **Verification**: 25 tests passing in Vitest, 0 ESLint warnings, 0 errors, and clean Next.js 50-route production build.
- **Lockfile Synchronization**: Synchronized `pnpm-lock.yaml` across all workspace projects for strict CI and cloud platform `--frozen-lockfile` verification.
