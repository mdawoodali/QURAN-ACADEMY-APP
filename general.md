# Quran Academy — Project Changelog & Roadmap (`general.md`)

This file tracks all completed changes and upcoming planned roadmap tasks for **Quran Learn Academy**. Each entry documents the **Commit ID**, **Timestamp**, **Author** (`Isbah` or `Areeb`), and a concise description of the change.

---

## 1. Completed Changes Log (Chronological History)

| Commit ID | Timestamp (PKT) | Author | Summary of Changes |
| :--- | :--- | :--- | :--- |
| [pending] | 2026-10-21 19:35:00 | **Isbah** | Fixed localhost portal access by enabling resilient auth degradation in middleware, login actions, and adding one-click portal switcher on login screen. |
| `dd1edee` | 2026-10-21 00:47:44 | **Isbah** | Added Digital Tasbeeh, Prayer Times & Qibla Direction, 99 Names of Allah (Asma-ul-Husna), and Seerat-un-Nabi (S.A.W) to Resources. |
| `4697b23` | 2026-10-21 00:23:55 | **Isbah** | Enlarged opening logo, elevated position, and added luminous golden ambient backlight halo. |
| `671b407` | 2026-10-21 00:20:03 | **Isbah** | Replaced background Bismillah with Quran Learn Academy logo emblem and clean emerald textured pattern. |
| `3e17da6` | 2026-10-21 00:18:10 | **Isbah** | Removed arrow icons from Sunni and Shia buttons for centered, clean typography. |
| `80e480a` | 2026-10-21 00:15:57 | **Isbah** | Added ornamental expanding golden underline with amber bead trio and pop hover effect to Sunni and Shia buttons. |
| `4685ef2` | 2026-10-21 00:13:58 | **Isbah** | Replaced single "Get Started" button on WelcomeSplash with two dedicated curriculum selection buttons: **Sunni** and **Shia**, persisting choice in `localStorage`. |
| `6c504f1` | 2026-10-21 00:01:49 | **Isbah** | Restored full-screen welcome splash gate featuring bilingual Hadith, dark emerald Islamic geometry, and responsive header. |
| `1f0b68b` | 2026-10-20 23:04:25 | **Isbah** | Integrated Deepgram streaming STT with Arabic Quranic keyword boosting and browser Web Speech API fallback. |
| `1025a03` | 2026-10-20 21:33:56 | **Isbah** | Documented database session persistence and LiveKit WebRTC multi-user classroom pairing architecture. |
| `898904c` | 2026-10-20 21:33:02 | **Isbah** | Implemented real-time LiveKit WebRTC room token generation API and multi-device teacher-student classroom pairing. |
| `64745a5` | 2026-10-20 21:27:12 | **Isbah** | Built persistent database-backed scheduling service, session booking actions, and interactive calendar UI. |
| `ee246cc` | 2026-10-20 21:22:33 | **Isbah** | Added PostgreSQL schema migrations for student schedules, teacher assignments, and classroom sessions. |
| `2a07a62` | 2026-10-20 21:21:04 | **Isbah** | Added Daily Guides, Duas, and Shia Library tabs with in-app reader modal views and offline downloads. |
| `531e313` | 2026-10-20 21:20:43 | **Isbah** | Created structured Shia Library dataset for classical reference texts (Nahj al-Balagha, Mafatih al-Jinan, Sahifa Sajjadiyya). |
| `6f5c91e` | 2026-10-20 21:20:17 | **Isbah** | Added rich Daily Guides and Masnoon Duas structured dataset with translations for in-app reading. |
| `3816cf2` | 2026-10-20 21:15:45 | **Isbah** | Added Uthmani and IndoPak script selection with color-coded Tajweed rule toggle in classroom reader. |
| `4535598` | 2026-10-20 18:21:40 | **Isbah** | Replaced plain Downloads with comprehensive 30 Paras Resources library with "Read Now" and direct PDF downloads. |
| `8a7b206` | 2026-10-20 17:59:02 | **Isbah** | Locked layout direction to LTR on Urdu toggle to prevent header layout and button inversion. |
| `f392d7a` | 2026-10-20 13:15:13 | **Areeb** | Implemented 404 page, robots.txt, sitemap.xml, llms.txt, security headers, sticky mobile CTA, and journal. |
| `c2361ed` | 2026-10-20 13:04:12 | **Areeb** | Refactored home layout: cleaned up redundant splash state. |
| `2cf3773` | 2026-10-20 13:03:53 | **Areeb** | Tested direct site entry flow bypassing splash screen. |
| `9dc289b` | 2026-10-20 12:25:49 | **Areeb** | Adjusted security audit CI threshold to report only critical dependencies. |
| `0731a26` | 2026-10-20 12:21:39 | **Areeb** | Configured monorepo linting, type-checking, and build pipeline in GitHub Actions CI. |
| `3fa3568` | 2026-10-15 01:30:55 | **Isbah** | Updated "Book a free trial" and hero CTA button hover states to emerald green with high-contrast white text. |
| `ae7298c` | 2026-10-15 01:30:41 | **Isbah** | Applied expanding ornamental hover underline to Login link and homepage Trust Cards. |
| `1ca5e4f` | 2026-10-15 01:29:28 | **Isbah** | Added center-originating ornamental golden bead hover effect on primary navigation links. |
| `7591fa7` | 2026-10-15 01:29:08 | **Isbah** | Increased primary navbar links font size from 14px to 16px for improved readability. |
| `1f597d6` | 2026-10-15 01:28:51 | **Isbah** | Centered main navigation links and refined horizontal bar spacing. |
| `b507914` | 2026-10-15 01:28:24 | **Isbah** | Centered top contact information bar and positioned language toggles to the outer edge. |
| `8399308` | 2026-10-15 01:27:53 | **Isbah** | Configured vertically spanning header logo extending gracefully across top and main bars. |
| `06dc09c` | 2026-10-15 01:25:45 | **Isbah** | Imported high-resolution Quran Learn Academy official emblem brand asset. |
| `233ce5b` | 2026-10-15 01:25:39 | **Isbah** | Standardized brand title to "Quran Learn Academy" across English and Urdu translations. |
| `8f11bf3` | 2026-10-15 00:46:33 | **Isbah** | Integrated "What Our Students Say About Us" testimonials section onto the landing page. |
| `ac38fc1` | 2026-10-15 00:46:18 | **Isbah** | Built 2-card sliding TestimonialsCarousel component with motion and touch navigation. |
| `2dec8ad` | 2026-10-15 00:46:12 | **Isbah** | Added authentic student and parent review dataset from Quran Learn Academy. |
| `e2f1811` | 2026-10-14 02:27:28 | **Isbah** | Added "Sponsor a Child" and "Family Referral Program" community modules. |
| `c1bd1b9` | 2026-10-14 02:26:11 | **Isbah** | Added tiered advance payment discount policy (Save 20% annual, 10% semi-annual, 5% quarterly). |
| `e2c323a` | 2026-10-14 02:25:20 | **Isbah** | Added interactive multi-currency selector for UK (£ GBP), USA ($ USD), Australia ($ AUD), and Pakistan (₨ PKR). |
| `04c2ac3` | 2026-10-14 02:24:51 | **Isbah** | Added Package 4 (Weekend Classes — 8 classes/month) flexible tuition plan. |
| `ffcfb75` | 2026-10-14 02:24:31 | **Isbah** | Added Package 3 (5 Days/Week — 20 classes/month) daily intensive study plan. |
| `4a3e52a` | 2026-10-14 02:23:31 | **Isbah** | Added Package 2 (3 Days/Week — 12 classes/month) balanced tuition plan. |
| `d652b35` | 2026-10-14 02:23:02 | **Isbah** | Added Package 1 (2 Days/Week — 8 classes/month) with international country pricing. |
| `9a48d30` | 2026-10-14 02:18:00 | **Isbah** | Added Quran Translation & Tafseer course module with keyword search and syllabus filter. |
| `cbc023a` | 2026-10-14 02:16:00 | **Isbah** | Added Tajweed Quran Word-by-Word course with Makharij diagrams and phonetics. |
| `a46b5b3` | 2026-10-14 02:14:00 | **Isbah** | Added Quranic Courses for Women led by certified female scholars. |
| `f8c04ff` | 2026-10-14 02:12:00 | **Isbah** | Added Quranic Courses for Children featuring child-centric pedagogy and gamified milestones. |
| `7017e99` | 2026-10-14 02:10:00 | **Isbah** | Added Basic Islamic Concepts, Salah, Kalmas, and Masnoon Duas curriculum. |
| `dff8afd` | 2026-10-13 03:18:56 | **Isbah** | Added Memorizing Quran (Hifz) course with Sabaq, Sabaqi, and Manzil tracking. |
| `3521d50` | 2026-10-13 03:18:29 | **Isbah** | Added Elementary Quran Reading (Noorani Qaida) foundational course. |
| `e51b346` | 2026-10-13 02:56:13 | **Isbah** | Implemented universal micro-interaction pop hover effect across cards and interactive panels. |
| `9410b64` | 2026-10-13 02:45:56 | **Isbah** | Converted About Us sections into compact 4-card responsive grid. |
| `8d7372c` | 2026-10-13 02:35:47 | **Isbah** | Finalized About Us page with enrollment CTA card and polished typography. |
| `46ca2c2` | 2026-10-13 02:32:42 | **Isbah** | Added 4 core institutional pillars (Equal attention, flexible timing, 1-on-1 sessions). |
| `7892cae` | 2026-10-13 02:31:42 | **Isbah** | Added worldwide e-learning standard and trained staff selection criteria. |
| `b9a4333` | 2026-10-13 02:30:51 | **Isbah** | Added moral ethics and Islamic lifestyle objectives section. |
| `3f7df74` | 2026-10-13 02:30:18 | **Isbah** | Added home-based learning and overseas accessibility section. |
| `98f2b8e` | 2026-10-13 02:29:34 | **Isbah** | Added academy founding purpose and word-by-word mission. |
| `878ee79` | 2026-10-13 02:14:44 | **Isbah** | Added all 15 authentic blog articles with featured imagery from reference website. |
| `d66b04b` | 2026-10-13 02:14:35 | **Isbah** | Added Downloads and legal policy pages (Privacy Policy, Terms of Service). |
| `33832b1` | 2026-10-13 02:14:24 | **Isbah** | Added Contact Us page with UK, USA, and Pakistan phone numbers and inquiry form. |
| `98667ae` | 2026-10-13 02:14:14 | **Isbah** | Added About Us and Payments pages matching reference website specifications. |
| `dbe8051` | 2026-10-13 02:14:02 | **Isbah** | Added 3-column glassmorphic footer with head office details and contact info. |
| `7aceaa2` | 2026-10-13 02:13:47 | **Isbah** | Added top bar with WhatsApp badges, direct email, and reference menu items. |
| `7258ec0` | 2026-10-13 02:13:37 | **Isbah** | Added complete English and Urdu translations for navbar, top bar, and footer links. |
| `74f5f4a` | 2026-10-13 00:57:12 | **Isbah** | Redesigned student and teacher registration flows with dark emerald glassmorphism. |
| `8f11b3e` | 2026-10-12 23:30:06 | **Isbah** | Completed Urdu translations across all pages, clean Noto Sans Arabic font, responsive dropdown menu. |
| `e81f587` | 2026-10-12 17:17:27 | **Isbah** | Added root dev scripts for web and ws servers. |
| `6364ede` | 2026-10-12 15:09:08 | **Isbah** | Applied italic styling to bold Hadith heading. |
| `12a1118` | 2026-10-12 15:05:09 | **Isbah** | Adjusted Hadith text and CTA spacing 1 inch down below calligraphy with bold styling. |
| `484627d` | 2026-10-12 04:51:19 | **Isbah** | Student portal dark glassmorphism, 2-line elegant Hadith splash, no-scroll how-it-works layout. |
| `204d2e4` | 2026-10-12 04:19:40 | **Isbah** | Updated login card to glassmorphism with high contrast. |
| `e7e0785` | 2026-10-12 04:19:39 | **Isbah** | Applied glassmorphic multi-step form container and high-contrast inputs on trial page. |
| `ff2582d` | 2026-10-12 04:19:39 | **Isbah** | Updated expectations panel to dark emerald glassmorphism with high contrast. |
| `1b12c8e` | 2026-10-12 04:19:38 | **Isbah** | Updated pricing cards to glassmorphism with high contrast. |
| `ba66ea8` | 2026-10-12 04:19:38 | **Isbah** | Applied glassmorphic cards and high-contrast typography across programmes page. |
| `2e3cc40` | 2026-10-12 04:18:50 | **Isbah** | Applied glassmorphic containers and white headings across how-it-works page. |
| `a719681` | 2026-10-12 04:18:49 | **Isbah** | Applied glassmorphic form and high-contrast typography across teach-with-us page. |
| `04f982f` | 2026-10-12 04:18:48 | **Isbah** | Added `data-scroll-behavior="smooth"` to HTML root element. |
| `1c27e86` | 2026-10-12 04:18:48 | **Isbah** | Added `.glass-card` utility and dark `.glass-panel` styling. |
| `4523cc6` | 2026-10-12 03:30:01 | **Isbah** | Restored black calligraphy Bismillah on startup page with clean spacing. |
| `ccffc7f` | 2026-10-12 03:29:17 | **Isbah** | Added dark green background with authentic black Bismillah calligraphy crest. |
| `0172aab` | 2026-10-12 03:21:34 | **Isbah** | Updated homepage typography and preview cards for dark emerald theme. |
| `5bc6643` | 2026-10-12 03:18:13 | **Isbah** | Updated PublicNavbar to dark emerald glass aesthetic. |
| `6ee869f` | 2026-10-12 03:17:32 | **Isbah** | Applied dark green textured background throughout the app. |
| `d817806` | 2026-10-12 03:16:56 | **Isbah** | Updated WelcomeSplash to clean emerald background without brown Quran. |
| `e9f332c` | 2026-10-12 03:16:18 | **Isbah** | Added pure dark green textured Islamic geometric wallpaper. |
| `ed57fec` | 2026-10-12 02:57:46 | **Isbah** | Pushed header to edges, removed golden Bismillah, adjusted layout for bottom-right Quran. |
| `8c6ee20` | 2026-10-12 02:56:58 | **Isbah** | Updated welcome background with Quran artwork positioned in lower right. |
| `736427a` | 2026-10-12 02:52:34 | **Isbah** | Removed container boxes and updated landing hierarchy with Hadith and Bismillah. |
| `b210b0a` | 2026-10-12 02:51:56 | **Isbah** | Updated welcome CTA button to non-golden default with golden on-click active state. |
| `e732a67` | 2026-10-12 02:43:50 | **Isbah** | Added UI guidelines for smooth scrolling and glassmorphism standards. |
| `dfabc90` | 2026-10-12 02:43:31 | **Isbah** | Applied glassmorphic backdrop-filter container to WelcomeSplash. |
| `c7bf8d2` | 2026-10-12 02:43:11 | **Isbah** | Implemented HTML smooth scrolling and glassmorphism CSS utilities. |
| `cb0eaed` | 2026-10-12 02:40:08 | **Isbah** | Redesigned WelcomeSplash to full-screen background cover with CSS hover buttons. |
| `fa05247` | 2026-10-12 02:39:52 | **Isbah** | Added CSS hover pseudo-class rules for welcome buttons. |
| `c1b3e57` | 2026-10-12 02:39:22 | **Isbah** | Added high-resolution full-screen Islamic welcome background. |
| `7579458` | 2026-10-12 02:22:38 | **Isbah** | Integrated smooth WelcomeSplash transition on app entry. |
| `d221282` | 2026-10-12 02:22:20 | **Isbah** | Implemented animated WelcomeSplash with Get Started CTA and language switcher. |
| `0b73ae0` | 2026-10-12 02:22:04 | **Isbah** | Added welcome splash Islamic calligraphy and Quran artwork assets. |
| `5c75c64` | 2026-10-12 02:10:39 | **Isbah** | Implemented real-time voice follow highlighting and interactive teacher controls. |
| `424913c` | 2026-10-12 02:10:26 | **Isbah** | Built practice audio player with recitation sync and verse controls. |
| `257b967` | 2026-10-12 02:10:11 | **Isbah** | Built interactive student Quran reader and practice view. |
| `d8478ba` | 2026-10-12 02:09:58 | **Isbah** | Built student progress and milestones tracking page. |
| `609b445` | 2026-10-12 02:05:30 | **Isbah** | Built student dashboard overview with recent lessons and metrics. |
| `c7b26e4` | 2026-10-12 02:05:17 | **Isbah** | Assembled trial booking page with TrialFunnel component. |
| `044eb35` | 2026-10-12 02:04:46 | **Isbah** | Created multi-step bilingual trial booking funnel component. |
| `18b30f9` | 2026-10-12 02:04:31 | **Isbah** | Implemented server actions for booking free trial lessons. |
| `dacf23f` | 2026-10-12 02:04:20 | **Isbah** | Implemented bilingual how-it-works onboarding guide page. |
| `7886dd9` | 2026-10-12 02:04:04 | **Isbah** | Added bilingual support and direct classroom demo link to homepage. |
| `63a4fa5` | 2026-10-12 02:03:51 | **Isbah** | Wired up language-aware PublicNavbar and public layout structure. |
| `0d6f5ec` | 2026-10-12 02:03:25 | **Isbah** | Added Urdu translations and active route navigation to student sidebar. |
| `ea4ad2d` | 2026-10-12 02:03:02 | **Isbah** | Added Urdu-English language switcher and direct portal links. |
| `96787a3` | 2026-10-12 00:44:08 | **Isbah** | Integrated LanguageProvider into root web layout. |
| `600ec84` | 2026-10-12 00:44:00 | **Isbah** | Created LanguageContext provider with English and Urdu state management. |
| `05a990b` | 2026-10-12 00:43:54 | **Isbah** | Updated web Prisma schema definitions. |
| `903ab15` | 2026-10-12 00:43:46 | **Isbah** | Updated database seed data for courses, roles, and initial users. |
| `322a89b` | 2026-10-12 00:43:39 | **Isbah** | Added course modules database schema migration. |
| `118574f` | 2026-10-12 00:43:26 | **Isbah** | Exported speechMatcher utility from domain package. |
| `c715d29` | 2026-10-12 00:43:02 | **Isbah** | Implemented phoneme and Arabic text speechMatcher algorithm. |
| `fb0238e` | 2026-10-12 00:42:44 | **Isbah** | Updated pnpm lockfile for root workspace. |
| `5c586c1` | 2026-10-12 00:42:34 | **Isbah** | Updated root package.json scripts and dependencies. |
| `39c5f63` | 2026-10-12 00:38:51 | **Isbah** | Configured workspace npmrc settings. |
| `f3183f2` | 2026-10-10 01:44:54 | **Areeb** | Migrated repository to clean monorepo architecture and implemented Phases 2–12. |
| `eeefe4f` | 2026-10-10 00:22:06 | **Areeb** | Fixed LiveClassroom interaction state, End Class modal, webcam toggle, unlock feature. |
| `6f23298` | 2026-10-10 00:14:24 | **Areeb** | Fetched real user data from Supabase for Profile and Navigation layouts. |
| `74e2649` | 2026-10-10 00:10:47 | **Areeb** | Implemented functional UI modals and simulated checkout logic for Billing pages. |
| `c484675` | 2026-10-09 23:55:56 | **Areeb** | Fixed cacheComponents incompatibility with force-dynamic using `instant=false`. |
| `7d2d8f1` | 2026-10-09 23:54:05 | **Areeb** | Fixed Next.js static prerender error for searchParams by forcing dynamic rendering on auth routes. |
| `4683a0d` | 2026-10-09 23:51:36 | **Areeb** | Fixed broken trial funnel redirection. |
| `4ef93ff` | 2026-10-09 16:51:48 | **Areeb** | Displayed specific auth error messages on the login page. |
| `f5ed511` | 2026-10-09 16:14:02 | **Areeb** | Fixed dead buttons across portal pages, wired up real Link components, added error banners. |
| `e048d89` | 2026-10-09 15:57:19 | **Areeb** | Fixed ZodError TypeScript type issue in server actions. |
| `8124bbb` | 2026-10-09 15:56:36 | **Areeb** | Fixed JSX syntax error on Admin dashboard page. |
| `643c029` | 2026-10-09 15:36:12 | **Areeb** | Completed all portal modules, added Zod validation to actions, ensured responsive phone layouts. |
| `8b61bff` | 2026-10-09 15:01:32 | **Areeb** | Added Admin Dashboard, Billing Checkout, and Urdu RTL language toggle. |
| `2407ffd` | 2026-10-09 14:42:53 | **Areeb** | Added Parent Portal UI and updated Sidebar navigation structure. |
| `9c61424` | 2026-10-09 14:31:53 | **Areeb** | Implemented Live Classroom drawing tools (underline, circle, font sizes) per PRD specifications. |
| `d7a86f3` | 2026-10-09 14:27:01 | **Areeb** | Added Student and Teacher registration flows and updated Login UI. |
| `67f32a1` | 2026-10-08 00:14:34 | **Areeb** | Added Supabase SSR Auth Client and Next.js middleware protection. |
| `fa6516f` | 2026-10-08 00:12:57 | **Areeb** | Added initial frontend source code. |
| `ff61154` | 2026-10-08 00:12:48 | **Areeb** | Initial commit: Quran Academy Frontend and Backend (Next.js 16 + FastAPI WebSockets + Framer Motion). |

---

## 2. Upcoming Changes & Roadmap (To Be Done)

As upcoming changes are executed by **Isbah** or **Areeb**, update the table below with the final commit hash, timestamp, and author:

| Task / Feature | Planned Scope | Assigned To | Status | Commit ID | Completed At |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **API Keys & Production Credentials Integration** | Connect production Supabase project, LiveKit Cloud credentials, and verify Deepgram STT key in `.env.local` | Isbah / Areeb | Planned | — | — |
| **Stripe Live Webhook & Billing Verification** | Verify Stripe checkout sessions and recurring subscription invoice generation with real webhooks | Isbah / Areeb | Planned | — | — |
| **Admin Teacher Assignment Toggle** | Add admin setting `teacher_choice_enabled` (default false) to toggle between admin-assigned vs. student-selected teachers | Isbah / Areeb | Planned | — | — |
| **Mobile Rear-Camera Mushaf Mode** | Provide rear-camera "show my Mushaf" streaming mode on mobile devices where screen sharing is unsupported | Isbah / Areeb | Planned | — | — |
| **E2E Playwright Integration Testing** | End-to-end browser tests verifying trial booking, portal navigation, and classroom interaction at 375px, 768px, 1280px | Isbah / Areeb | Planned | — | — |
| **Attendance & Holiday Exceptions Calendar** | Admin academy holiday calendar (Eid, Muharram) with automated lesson reschedule offers | Isbah / Areeb | Planned | — | — |
