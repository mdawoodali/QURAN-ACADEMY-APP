# Quran Academy Agent Rules

## 1. HOW YOU MUST WORK
1. Plan first. Produce an implementation plan artifact covering all phases in section 20 before writing app code. Then execute without waiting for me. Only stop if you are blocked by something only a human can supply (credentials, licensed content, a business decision). In that case log it in docs/open-questions.md, stub it behind an interface, and continue.
2. Spec-driven, using OpenSpec. Run openspec init. Write the project context in openspec/project.md. For each phase, create a change proposal (/opsx:propose or the slash command your install prints) with requirements and scenarios, implement against it, validate with openspec validate --all, then archive it. Every feature and change must be documented in specs.
3. Write AGENTS.md in Phase 0. Copy sections 1, 2, 5A, 18, 23 and 24 of this prompt into it as persistent rules so they survive across sessions.
4. Phase gates. Do not start a phase until the previous phase's exit commands pass (section 20). When a gate fails, apply the systematic-debugging skill: reproduce, form hypotheses, test one at a time, fix the root cause. Do not retry blindly. If a gate is still failing after three disciplined attempts, record it in the journal, isolate it behind a feature flag, and continue.
5. Verify in a real browser. After every UI phase use the browser agent and the Chrome DevTools MCP to load each route at 375 px, 768 px and 1280 px wide, in light and dark themes, in English and Urdu. Check the console for errors, check the network for failed requests, check layout overflow. Fix what you find. Take screenshots into docs/screens/<phase>/.
6. Design quality tools. Before building UI read and follow: the frontend-design skill, taste-skill, emilkowalski skill, and the apple-design skill. Use the shadcn MCP for primitives. Use the Vercel web-design-guidelines MCP to review every page. Use Magic MCP only for inspiration, never paste a component without adapting it to our tokens. Run npx impeccable detect src/ at the end of every UI phase and fix what it reports. Use Motion (framer-motion) with its skill for micro-interactions.
7. Keep a learning journal. Maintain docs/journal.md. After each phase append an entry with: what you built, why each important decision was made, how it works, alternatives you rejected, gotchas, security notes, and how to verify it. Write it so a junior developer could learn the whole project from it.
8. No invented religious content. You must never write, recall, paraphrase or "fill in" Quran text, translations, transliterations, tafsir, Duas, Ziarat, hadith, or book content from your own knowledge. Quran and religious text enter the system only through the import pipeline from approved source files (section 12). Seed fixtures use clearly marked test strings or a small, openly licensed sample whose licence is recorded.
9. No copying of competitors. The client explicitly worried the product looks like Shia Toolkit and Islam360. Do not mimic their layouts, navigation or visual language. Follow the original design direction in section 6.
10. Honesty. Never write that something works unless you ran it. In your final report separate verified, implemented but unverified, and stubbed.
11. Secrets. Never write real secrets anywhere. Use .env.local (gitignored) and a committed .env.example with placeholders. Run gitleaks before every commit.
12. Small, reviewable commits with conventional messages, one logical change each, one branch per phase.

## 2. SOURCES OF TRUTH AND CONFLICT RULES
The reference material is in docs/reference/ (client feature notes PDF, Rex Technologies PRD PDF, review video and key frames). Priority when sources disagree: (1) client corrections in the video > (2) client feature notes > (3) the PRD > (4) your own judgement. The decisions already made:
- Highlighting: implement the HighlightSource abstraction (section 11): teacher-driven and audio-synced ship; live speech recognition sits behind the flag voice_follow_beta, default off, labelled beta.
- Stack: section 4 is fixed. Do not substitute.
- Teacher assignment: admin assigns by default; add an admin setting teacher_choice_enabled (default false).
- Prices, packages and currencies are illustrative and fully admin-configurable. Seed the video's values, mark them illustrative.
- Slides 46–50 of the review video are unavailable. Log them as an open question and do not invent them.
- Third-party and API costs are billed to the client; keep every external service behind an adapter so it can be swapped.

## 5A. CLEAN CODE, ARCHITECTURE AND SCALE
The academy expects thousands of users, so the codebase must stay readable and the system must scale without a rewrite. These rules override convenience. The tree above is the target structure; every new file goes in the right place from the first commit.
Scale assumptions (record them in docs/assumptions.md and design and test against them; the client has not given numbers): 10,000 registered students, 500 teachers, 1,000 concurrent portal users, 300 simultaneous live lessons, up to ten times growth without architectural change. If the client gives real numbers, those replace these.

Architecture
- Modular monolith with vertical feature slices. Each folder in src/features/ owns one capability end to end (components, hooks, server code, schemas, types, tests) and exposes a small public API through its index.ts. Other code imports a feature only through that file; deep imports into another feature are forbidden.
- Dependency direction is one-way: app (routes) -> features -> shared / server -> packages. packages/domain imports nothing from the app, no framework, no I/O. Features never import from app; shared never imports from features. Enforce this with dependency-cruiser or eslint-plugin-boundaries and fail CI on a violation or a circular import.
- Thin routes. A page.tsx composes feature components and loads data; it contains no business logic and stays under about 60 lines.
- Layered server code in every feature: actions.ts (validate input with Zod, check authorisation, call a service) -> service.ts (business rules, transactions, calls domain functions) -> repository.ts (all database access). Components never touch the database. Server actions never contain business rules.
- Pure domain package. Pricing, discounts, scheduling and conflict rules, classroom message reducer, highlight sources, letter splitting and permission checks live in packages/domain as pure, framework-free, fully unit-tested functions. The UI and the server both call them, so rules exist in exactly one place.
- Adapters for everything external (LiveKit, payments, email, push, SMS, speech recognition, storage) behind interfaces in packages/adapters, each with a sandbox/mock implementation for tests.
- Contracts in one place. Zod schemas in packages/contracts are the single source of truth; TypeScript types are inferred from them; the same schema validates the form, the server action and the database boundary.
- Server Components by default. Add "use client" only at the smallest leaf that needs interactivity. Keep the classroom bundle separate from the rest of the app.
- Stateless application servers. No in-process state that matters, so any instance can serve any request and the app scales horizontally. Shared state lives in Postgres, Redis or LiveKit.

Code standards
- TypeScript strict, no any without a justified comment, no unchecked casts, exhaustive switch on unions, noUncheckedIndexedAccess on.
- Size limits via ESLint: max-lines 250 per file (hard stop 400), max-lines-per-function 40, complexity 10, max-depth 3, max-params 4 (use an options object). Split instead of disabling the rule.
- One component per file, named after the file; presentational components separate from data-loading ones; avoid prop drilling beyond two levels (use composition or context); no components defined inside components.
- Naming: kebab-case files and folders, PascalCase components and types, camelCase functions, SCREAMING_SNAKE_CASE constants, useThing hooks, thing.test.ts beside the code; names say what, not how.
- Errors: typed domain errors and a Result type for expected failures; one central mapper turns errors into user-safe messages and HTTP codes; never swallow an exception; never leak internals or stack traces to users.
- No magic values. Roles, statuses, event types, routes, limits and feature flags are enums or constants in one shared place.
- Comments explain why, not what. Public functions get short JSDoc. No commented-out code, no dead code, no unused exports (use knip or ts-prune in CI).
- DRY without premature abstraction: extract on the third repetition, not the first. Prefer boring, readable code over clever code.
- Validated environment: one env.ts that parses and validates all environment variables with Zod at startup and fails fast; the rest of the code imports typed config, never process.env.
- Formatting and hooks: Prettier, ESLint, type-check and gitleaks on pre-commit (Husky + lint-staged); conventional commits; PR template with a checklist; CONTRIBUTING.md that explains the structure and where each kind of file goes.
- Feature generator: a pnpm gen:feature <name> script that scaffolds a feature slice with the standard folders, an index.ts, a test stub and an OpenSpec capability, so new work stays consistent.

Scalability rules
- Database: index every foreign key and every column used in a filter or sort; add composite indexes for the hot queries (for example lessons by teacher and start time, invoices by account and status, attendance by lesson); check the 15 most important query plans with EXPLAIN and record them. Use keyset (cursor) pagination for every list that can grow; never OFFSET on large tables; never select *; no N+1 queries (batch or join); bound every query with a limit and a timeout.
- Growth tables: partition or archive lesson_events, audit_log, notifications and attendance by month with a retention policy, so they stay fast as history grows.
- Connections: use the connection pooler in transaction mode for serverless/edge handlers and keep transactions short.
- Caching: the Quran text, translations and word data are immutable per version, so serve public Quran pages statically (ISR/CDN) and cache API reads with tags; invalidate precisely on content publish. Never cache per-user or sensitive responses in a shared cache.
- Realtime discipline: subscribe per resource (one lesson, one user's notifications), unsubscribe on unmount, never broadcast whole tables. High-frequency classroom traffic goes over the LiveKit data channel, not through Postgres; only snapshots and the batched event log are written to the database.
- Background jobs: emails, push, PDFs, report generation, series materialisation, renewals and recordings processing run through a durable queue (for example Postgres-backed queues or Supabase cron plus a queue table) with retries, backoff, dead-letter handling and idempotency keys. No long work inside a request.
- Files and media: private storage with CDN-served signed URLs, image optimisation, audio streamed with range requests, recordings processed asynchronously.
- Migrations: forward-only, reviewed, backwards-compatible (expand, then migrate, then contract) so deployments need no downtime; every migration has a test.

## 18. SECURITY REQUIREMENTS (non-negotiable)
Threat | Required control | How to verify
--- | --- | ---
SQL injection | Parameterised queries only (Supabase client / Drizzle); no string-built SQL; any rpc or execute takes parameters; database roles with least privilege | Semgrep rule + tests that send ' OR 1=1 -- style input to every search/filter endpoint
NoSQL / operator injection | Validate every JSON and jsonb filter with Zod; reject objects where scalars are expected ( {"$ne": null} ) | Unit tests on all query-builder inputs
XSS | React escaping by default; no dangerouslySetInnerHTML except through one audited sanitiser (DOMPurify) for admin-authored articles; strict CSP with nonces, no unsafe-inline scripts; Referrer-Policy, X-Content-Type-Options, frame-ancestors 'none' | Playwright test injecting payloads into every text field; CSP checked in Chrome DevTools
CSRF | Cookie sessions SameSite=Lax or Strict, Secure, HttpOnly where possible; Origin/Referer check and CSRF token on every mutating route handler; Next.js server actions keep their origin check | Test that cross-origin POSTs are rejected
File upload attacks | Allowlist types, verify magic bytes not just extension, size limits per kind, random storage names, private buckets, signed URLs, strip image metadata, never serve user files from the app origin, antivirus hook for documents; payment proofs, ID scans and recitation audio get separate buckets and policies | Upload tests with renamed executables, SVG with script, polyglot files, oversized files
Broken object-level authorisation (BOLA/IDOR) | Every query scoped by owner or relationship in RLS and re-checked in server code; never trust ids from the client | Generated test matrix: for every endpoint and role, request another user's object id and expect 403/404
Rate limiting and brute force | Per-IP and per-account limits on login, OTP, password reset, trial form, registration, ticket creation, uploads, search; exponential lockout; Redis/Upstash or Postgres-backed limiter | Test hitting limits returns 429 with Retry-After
JWT and secret handling | Secrets only in environment/secret manager; never NEXT_PUBLIC_ for secrets; no secrets in git (gitleaks in CI and pre-commit); rotate on leak; separate keys per environment; service-role key never reaches the browser | gitleaks, grep for service_role in client bundles
Third-party keys exposed | All provider calls (payments, LiveKit server key, email, SMS, ASR) happen on the server; the browser receives only short-lived scoped tokens | Bundle analysis shows no server keys
Password storage | Delegate to Supabase Auth (bcrypt); if any custom credential exists (child PIN) use Argon2id with per-user salt and lockout | Unit test; PIN brute-force lockout test
Multi-factor authentication | TOTP MFA required for Admin and Teacher accounts, optional for others; recovery codes; step-up re-authentication for sensitive actions (reveal bank details, approve payout, change roles) | E2E test that an admin without MFA cannot reach admin routes
CORS | Explicit origin allowlist per environment; no wildcard with credentials | Test with a foreign Origin
Auth tokens in the browser | No auth tokens in localStorage or sessionStorage. Use cookie-based sessions (@supabase/ssr) and server-side session checks; keep the Supabase client in the browser only for Realtime with a short-lived token | Grep + Playwright check of storage contents after login
Server-side permission enforcement | Row Level Security on every table plus server checks; UI hiding is cosmetic only | pgTAP tests per role; no table without RLS (CI fails if one exists)
Webhook forgery and replay | Verify HMAC/signature, timestamp tolerance, unique event_id, idempotency keys; accept only from provider endpoints | Replay and tampered-signature tests
Replay of one-time tokens | OTPs, magic links, password-reset and join tokens are single-use, short-lived, bound to the user; consumed atomically | Reuse test must fail
SSRF | Any server-side fetch of a user-supplied URL (avatar import, content import, webhooks) goes through one safeFetch: allowlisted hosts or schemes, resolve DNS and block private/link-local/loopback/metadata ranges, no redirects to blocked hosts, short timeouts and size caps | Tests against 127.0.0.1, 169.254.169.254, DNS rebinding
SSTI | No user-controlled template engine (see section 15); fixed placeholder substitution only | Test with {{7*7}}, ${7*7}, <%= 7*7 %> in templates
ReDoS | No unbounded or nested-quantifier regexes on user input; safe-regex lint rule; input length caps before any regex; prefer linear-time patterns (the Arabic letter splitter is linear) | Lint + fuzz tests with long inputs
Large-payload / resource-exhaustion DoS (my reading of "LPdos") | Request body size limits, pagination caps, query timeouts, max upload size, bounded export size, per-room participant caps, limits on stroke and chat message size and rate | Oversized payload tests
Clipboard abuse | Never write to the clipboard without a user gesture; never auto-read the clipboard; strip formatting on paste into rich fields; do not copy sensitive values (full IBAN, ID numbers) to the clipboard programmatically; show masked values | Review + tests on paste handlers
CSV / spreadsheet injection | See section 16 | Export tests with =HYPERLINK(...) cells
Source map exposure | productionBrowserSourceMaps: false; upload maps only to the error tracker if used | Build check that no .map is publicly served
Default credentials | No default admin password anywhere; the first Super Admin is created by a one-time CLI that reads a password from the environment and forces rotation and MFA on first login | Test that seeds refuse to run in production
Sensitive data in logs | Structured logging with redaction (tokens, passwords, ID numbers, IBAN, OTPs, cookies, full emails, payment data); no PII in analytics; request ids instead | Log-capture tests
Data at rest | ID numbers and IBANs encrypted at the application level or with Supabase Vault; masked in UI; reveal is audited | Test that raw columns are not readable by non-Accounts roles
Dependencies | Lockfile committed, pnpm audit in CI failing on high/critical, Renovate or Dependabot, pinned versions, review new packages (no abandoned or typosquatted ones), pnpm approve-scripts for install scripts | CI job
Headers and transport | HSTS, secure cookies, no mixed content, Permissions-Policy (camera and microphone only on classroom routes), X-Frame-Options / frame-ancestors | Security headers test
Child safety | Teacher vetting before assignment; no private messaging outside sessions; teacher contact details hidden; recording only with consent; observer logging; safeguarding reports restricted | E2E scenarios in section 19
Audit | Append-only audit_log for approvals, role changes, bank reveals, payment actions, exports, recording access, schedule changes | Tests that these actions create rows
Automated scanning | Semgrep and gitleaks in CI; run Strix against the local or staging app only (never anyone else's system) before the final report; fix findings or document accepted risks | Reports saved in docs/security/

## 23. HARD RULES — NEVER DO THESE
- Never write or paraphrase Quran text, translations, Duas, Ziarat, hadith or book content yourself.
- Never claim live speech recognition works, or claim any accuracy, unless it is built and measured.
- Never leave placeholder lorem ipsum, fake data in production paths, or UI buttons that do nothing.
- Never hard-code secrets, keys, passwords or real personal data; never commit .env files.
- Never rely on client-side checks for authorisation; never expose the service-role key; never store auth tokens in localStorage.
- Never disable lint, type or test rules to make a gate pass; never skip a failing test without a documented reason.
- Never use any broadly, // @ts-ignore without a comment explaining it, or dangerouslySetInnerHTML outside the single sanitiser.
- Never copy another app's layout, branding or copy; never reproduce the review video's presentation wrapper.
- Never scrape copyrighted books or content.
- Never run security scanners against systems I do not own.
- Never stop to ask unless blocked by something only a human can provide; record it and continue.

## 24. EDGE CASES, FAILURE MODES AND GAPS
Every case below needs one of: an automated test, or a written decision in docs/edge-cases.md (a registry with columns: case, chosen behaviour, where it is implemented, test). Keep the registry current in every phase and review it at the Phase 11 and 12 gates. Where a case needs a business decision the client has not made, build it as an admin setting with a safe default and add the question to docs/open-questions.md.

### 24.1 Time, scheduling and calendars
- Which time zone is the anchor? A weekly "Wednesday 17:00" lesson for a student in London and a teacher in Karachi shifts relative to one of them when the UK changes its clocks. Each series stores an anchor (teacher, student or fixed zone), the default is a setting, and when daylight saving moves a lesson for the non-anchor side both sides are notified. Pakistan itself currently has no daylight saving (verify), but the UK, EU and US do.
- Impossible and ambiguous local times at clock changes (a time that does not exist, or happens twice): resolve by a documented rule and test it with fixed dates.
- Midnight crossings, week boundaries and month boundaries (reports, invoices, earnings) are computed in a stated zone, not the server's.
- Closure days: Eid, Muharram/Ashura and other holidays vary by moon sighting and by region. Provide an academy holiday calendar that admins edit; lessons falling on a holiday are flagged and offered a reschedule, never silently cancelled.
- Teacher leave, deactivation or resignation mid-series: list the affected lessons, offer substitutes, or reassign the whole series; students are never left with orphaned lessons.
- Student pause or freeze, package change mid-cycle, trial no-show, trial rescheduled twice: each has a defined state transition and a notification.
- Make-up credits: monthly limit, expiry, who consumed them, what happens when a package ends with unused credits.
- Late join, early leave, overrun, both parties absent, teacher late: define an attendance threshold (for example a minimum minutes setting) for "completed"; a late teacher never causes a student penalty; overruns do not double-book the next lesson.
- Back-to-back lessons for a teacher, and a user who travels and changes time zone: a change of profile zone updates display only, never stored lesson times.

### 24.2 Live classroom
- Same account in two tabs or devices: one active classroom session per user per lesson; the newer join asks to take over and the older one is closed cleanly. A teacher moving from tablet to phone keeps authority and state.
- Teacher drops while the student stays: the student sees "Teacher reconnecting", keeps the last state, and is never billed or marked absent for the teacher's outage. Define a timeout after which the lesson is marked teacher-missed and a make-up is offered.
- Duplicate, late or out-of-order messages, clock skew: messages carry seq; reducers are idempotent; ignore stale seq; measure and correct clock offset for latency metrics; never trust client clocks for authorisation or billing.
- Permissions denied, missing or switching devices: no microphone, no camera, a denied browser prompt, a Bluetooth headset connecting mid-lesson, autoplay blocked audio. Show a specific, friendly fix per case and let the lesson continue in the best available mode.
- Mobile screen sharing: many mobile browsers cannot share the screen. The PRD wants the student to show a physical Mushaf or homework, so provide a rear-camera "show my Mushaf" mode as the primary mobile path and screen share only where supported (verify per platform).
- Background tabs and sleeping screens: use the Wake Lock API where available; when a tab is throttled or backgrounded, reconcile with a snapshot on return.
- Low bandwidth and older phones: audio-only fallback, lower video resolution and frame rate, no video for observers, and a clear indicator of connection quality. Frequent power cuts and switching between Wi-Fi and mobile data are normal in the target market: support ICE restart and fast rejoin.
- Arabic rendering differences: a font fails to load, a device lacks a glyph, marks overlap at large sizes, words wrap differently on narrow screens. Use fallback fonts, test fixtures on real devices, and anchor everything to wordRef, never to pixel positions. Whiteboard strokes use normalised coordinates with a stored aspect ratio.
- Teacher changes the ayah while a student is unlocked, text size extremes, splitting words that contain ligatures: each has a defined result and a test.
- Consent changes mid-lesson: if recording consent is revoked, stop recording immediately and mark the segment; if an observer joins while consent is off, observation continues but nothing is recorded.
- Child safety in-session: detect phone numbers, emails and links in chat and notes and flag them for admin review (to stop moving students off the platform); the teacher cannot see who reported a concern; reports cannot be deleted by the teacher.
- Provider outage: if LiveKit or the data channel is down, show a banner, queue notifications, offer a documented fallback (rejoin attempt, then reschedule with a make-up), and never lose lesson records.

### 24.3 Quran and content correctness
- Never normalise stored Quran text. Unicode normalisation (NFC vs NFD) can change marks; keep the original untouched and use a separate normalised column for search and matching.
- Numbering and editions differ: whether the Bismillah is counted, page/juz/hizb/ruku boundaries, sajdah markers (which differ by school), Madani versus IndoPak page layouts. Store markers per mushaf edition and per source, make the sajdah display configurable, and declare the chosen conventions in docs/assumptions.md.
- Translations change or are withdrawn: version them; bookmarks, notes and progress key off the stable ayah or word id, never off a translation.
- Missing audio or timing segments for some ayahs or reciters: fall back gracefully and disable audio-timed highlighting for that ayah.
- Mixed right-to-left and left-to-right text (Arabic with English, numbers, ayah markers): use bidi isolation so numbers and punctuation do not jump. Offer Western, Arabic-Indic and Urdu/Persian digit styles by user preference.
- Hijri dates and prayer times: the start of a month differs by country and moon sighting, so keep an admin-adjustable offset per region. At high latitudes (for example the UK in summer) angle-based prayer calculations break down; provide documented fallback rules. If location permission is denied, let the user pick a city. Compass sensors may be missing on desktops: show the bearing instead.
- Content import safety: reject files with broken encoding, duplicate ids, missing sources or licences; make imports resumable and reversible; never overwrite published content in place.

### 24.4 People, identity and families
- Names and forms: many people have a single name or very long names; Urdu and Arabic names need full Unicode support; do not require a last name for adults. Father's name is required for children, not for adult learners.
- Identity documents: adults typically use a national ID (CNIC, 13 digits) and minors a B-Form (confirm with the client); overseas users use passports. Validate known formats, but never hard-reject unknown ones for overseas users. Duplicate national ID or phone at teacher application must be caught and routed to admin review.
- Phone and email: store phone numbers in E.164 format; normalise emails case-insensitively; handle typos with a confirmation step; handle SMS delivery failure with a fallback to email and WhatsApp; detect phone-number recycling and SIM-swap risk before sending sensitive OTPs.
- Children: no email and no phone is normal, so a guardian manages the profile and the child may use a PIN on shared devices. When a child turns 18, run a defined transition (new login, re-collect consent, data ownership). Separated or divorced guardians: allow several guardians with distinct permissions and a documented rule for conflicting requests.
- Teacher matching rules: a stated preference such as "female teacher preferred" is a rule, not a hint: block conflicting assignments unless an admin records a reason and the guardian agrees.
- Teacher lifecycle: resignation, suspension, probation tiers, duplicate or fake documents, re-application after rejection; every state keeps its history.
- Privacy rights: account deletion and data export for adults and for children via a guardian, with legal retention for payment records and anonymisation of the rest. The client must take legal advice on the child-data rules for Pakistan and for each country its students live in (for example the UK and US); build the consent, retention and deletion mechanics configurable, and do not assert legal conclusions in code or copy.
- Support impersonation: support staff may "view as user" only read-only, with a visible banner, a reason, an expiry and an audit entry, and never into recordings or safeguarding reports.

### 24.5 Money
- Payment taken but webhook lost or late: a reconciliation job compares provider records with ours daily and fixes or flags mismatches; checkout sessions expire; a user who closes the browser mid-payment can resume or cancel safely.
- Out-of-order events (refund before payment, duplicate success): process by event time and state machine rules; make every transition idempotent.
- Partial payments, partial refunds, chargebacks and disputes: each has a state and an audit trail; refunds cannot exceed what was paid.
- Currency and rounding: integer minor units, a stored exchange rate at the moment of payment (never recomputed later), documented rounding, and display of both the charged and the home currency.
- Discounts: coupon expiry, per-family limits, stacking rules, abuse detection; when one sibling leaves, recompute the sibling discount for the rest from the next invoice, not retroactively.
- Renewals: retry schedule for failed renewals with reminders; class access during the grace period is a setting; a suspended student's already-scheduled lessons are handled by rule, not silently deleted.
- Bank-transfer proofs: require a unique reference, match amount and date, reject reused references, store the proof privately, and give admins a verification checklist. Screenshots can be edited, so verification is a human step against the bank statement.
- Documents: invoice numbers are gapless, unique and immutable; corrections are credit notes, never edits; tax fields exist but are configurable until the client's accountant decides; teacher payout statements are immutable once paid.

### 24.6 Platform and operations
- Rate limits and shared addresses: many mobile networks and schools share one public IP, so limit by account and device as well as IP, and give a clear message with a retry time instead of a bare error.
- Push and notifications: web push on iPhone works only for an installed home-screen app; always keep email, in-app and optional WhatsApp as fallbacks. Authenticate email properly (SPF, DKIM, DMARC) and monitor bounces.
- Offline sync conflicts: bookmarks and notes edited on two devices merge per item with last-write-wins and a visible conflict log for notes.
- Service worker updates: use versioned caches and an "update available" prompt; never force a reload during a live lesson.
- Deployments during lessons: deploy so that active classroom sessions keep working; schema changes are backwards-compatible; maintenance mode shows a banner and does not kill sessions.
- Admin concurrency: two admins editing the same lesson or invoice: use a version column and reject stale writes with a clear merge message. Bulk actions report partial failures item by item and support undo where possible.
- Forms and uploads on bad networks: autosave drafts of the long teacher application, resumable uploads, double-submit protection with idempotency keys, session-expiry warnings that do not lose work, and sensible back-button behaviour in multi-step flows.
- Backups and recovery: point-in-time recovery enabled, a restore drill documented in the runbook and actually performed once, recordings and documents included.
- Regions and latency: choose the Supabase, hosting and LiveKit regions nearest Pakistan and your students (verify what is available, for example India, Singapore or the Gulf) and measure the audio and highlight targets from Karachi, Lahore and an overseas location.
- Data retention: recordings, chat logs, audit logs, lesson events and notifications each have a configurable retention period and an automated purge or archive job.

### 24.7 Output and accessibility details
- PDF and exports must handle Arabic and Urdu. Libraries that cannot shape Arabic script produce broken names. This overrides the PDF library examples in section 4: generate PDFs by rendering HTML with a headless browser (or another renderer you have verified), embed Arabic and Urdu fonts, and test with Urdu and Arabic names in receipts and reports. CSV and Excel exports use UTF-8 with a byte order mark so spreadsheet apps show Urdu correctly.
- Empty, first-run, loading, error, offline and permission-denied states exist for every list and page; long names and Urdu text never overflow or clip.
- Print styles for the monthly report and receipts. Child-friendly reading level on student screens, large touch targets, and no time-limited interactions that a young learner could fail by being slow.
- Calendars and pickers support Hijri display alongside Gregorian, and numeric input accepts any digit style.
