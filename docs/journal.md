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
