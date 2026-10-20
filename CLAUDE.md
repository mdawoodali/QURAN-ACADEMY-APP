# Quran Academy — Claude Code Guidelines

## 🚨 CRITICAL RULE: MANDATORY `docs/journal.md` UPDATES
Every AI agent (Claude Code, Antigravity, Cursor, etc.) and developer (including **Isbah**) modifying this repository **MUST** document their changes in `docs/journal.md` before committing and pushing.

- **Pre-commit hook**: `.githooks/pre-commit` will BLOCK any commit that does not stage `docs/journal.md`.
- **Pre-push hook**: `.githooks/pre-push` will BLOCK any push that does not include `docs/journal.md`.
- **GitHub Actions**: `.github/workflows/ci.yml` will FAIL any PR or push that lacks `docs/journal.md`.

### Required Journal Format:
Whenever you implement features, fix bugs, or alter architecture, add a new section in `docs/journal.md` describing:
- **Problem & User Requirement**
- **Engineering Implementation**
- **Security & Integrity Mitigations**
- **Files Modified / Created**

---

## Commands
- Run Web: `pnpm --filter frontend dev`
- Run WebSocket Server: `pnpm --filter @quran/ws dev`
- Build All: `pnpm build`
- Typecheck: `pnpm typecheck`
- Lint: `pnpm lint`
