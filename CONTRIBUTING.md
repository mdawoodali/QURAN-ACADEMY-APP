# Contributing to Quran Academy

## Code Quality & Governance Policy

### 🚨 Mandatory `docs/journal.md` Documentation
To maintain institutional clarity, prevent AI drift, and ensure seamless pair-programming across all developers (Isbah, Dawood, etc.) and AI models (Claude, Antigravity, Cursor, Devin):

1. **Every single commit and Pull Request MUST update `docs/journal.md`.**
2. Explain:
   - What was created or fixed.
   - Architectural tradeoffs considered.
   - Security impact and RLS implications.
3. This is strictly enforced by:
   - Local git pre-commit hook (`.githooks/pre-commit`)
   - Local git pre-push hook (`.githooks/pre-push`)
   - GitHub Actions CI workflow (`.github/workflows/ci.yml`)

### Setup Local Git Hooks
Run this once after cloning:
```bash
git config core.hooksPath .githooks
```
*(This is also automatically triggered during `pnpm install` via the `"prepare"` script).*
