# Technical & Scale Assumptions

## Scale Assumptions
*These values guide testing and load constraints until the client provides real numbers.*

- **Registered Students**: 10,000
- **Teachers**: 500
- **Concurrent Portal Users**: 1,000
- **Simultaneous Live Lessons**: 300
- **Headroom**: Up to ten times growth without architectural change.

## Architecture Assumptions
- **Stack**: Next.js App Router, React, TypeScript, Tailwind CSS, Supabase, LiveKit.
- **Third-Party Services**: Billed to the client; all external integrations (payments, LiveKit, ASR) are shielded behind sandbox adapters.
- **Live Classroom Latency**: Highlight sync < 500ms p95; audio round-trip < 300ms p95.

## Quran & Content Conventions
- **Data Source**: Tanzil project for Uthmani text and translations, Quran Foundation for word-by-word timing data.
- **Numbering**: Bismillah of Al-Fatihah counted as Ayah 1. Sajdah markers differ by school; configurable display based on source.
- **Offline**: IndexedDB caching for text and audio in the PWA.
- **Data Retention**: Configurable, default to 30 days for recordings.
