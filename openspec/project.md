# Project Context

This is the Quran Academy PWA, a bilingual (English/Urdu, RTL-ready) Quran learning platform featuring a live one-to-one classroom, scheduling, and comprehensive portal dashboards.

The application follows a strict Modular Monolith architecture within a pnpm workspace:
- `/apps/web`: Next.js App Router application containing thin routes and composed feature views.
- `/packages/domain`: Pure, framework-free business logic, tested extensively.
- `/packages/contracts`: Zod schemas which are the single source of truth for types and validation.
- `/packages/adapters`: Interfaces and implementations for external services (LiveKit, payments, etc.).

See `AGENTS.md` for strict agent rules, the technology stack, security requirements, and scale assumptions.
