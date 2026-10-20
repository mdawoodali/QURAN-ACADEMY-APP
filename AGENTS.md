# Quran Academy — Autonomous Agent & AI Guidelines

## 🚨 MANDATORY GOVERNANCE RULE: `docs/journal.md` ENFORCEMENT
Whenever any AI agent (Antigravity, Claude, OpenAI Operator, Devin, Cursor, Windsurf, Copilot, etc.) or developer (including **Isbah**) works on this repository:

1. **YOU ARE FORCED TO UPDATE `docs/journal.md` BEFORE EVERY COMMIT & PUSH.**
2. Under no circumstances may a commit be made or pushed to GitHub without appending or updating `docs/journal.md` with:
   - Specific features implemented or modified.
   - Architectural and security decisions made.
   - Any API or contract changes.
3. This policy is enforced automatically via:
   - Local git pre-commit hook (`.githooks/pre-commit`)
   - Local git pre-push hook (`.githooks/pre-push`)
   - GitHub Actions CI workflow (`.github/workflows/ci.yml`)
4. Any attempt to commit or push without modifying `docs/journal.md` will fail and be rejected.

---

## Technical Stack & Architecture
- **Framework**: Next.js 16 (App Router + Turbopack) in `apps/web`
- **Package Manager**: `pnpm` workspace monorepo
- **Database & Auth**: Supabase (PostgreSQL + PostgREST + SSR cookie auth)
- **Real-Time WebRTC**: LiveKit Cloud / Self-hosted WebRTC (`/api/livekit/token`)
- **Speech-to-Text**: Deepgram WebSocket Streaming (`/api/speech/deepgram-token`)
- **UI & Styling**: Tailwind CSS v4, Lucide Icons, Framer Motion
- **Fonts**: Amiri Quran (authentic Arabic diacritics), Figtree, Source Serif 4, Noto Nastaliq Urdu
