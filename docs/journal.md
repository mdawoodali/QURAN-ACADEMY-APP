# Quran Academy Learning Journal

## Phase 0: Foundations
**What was built**: 
Migrated existing standalone Next.js prototype to a `pnpm` workspace to adhere to the Modular Monolith vertical feature slice architecture constraint. Established `apps/web`, `packages/domain`, `packages/contracts`, and `packages/adapters`. Scaffolded OpenSpec, local Supabase, and quality gate tools (ESLint, Prettier). 

**Why**: 
The prompt explicitly mandated a `pnpm` workspace with a layered server architecture and one-way dependency rules to support scale to 10k users and 300 simultaneous lessons without a rewrite. 

**How it works**:
Next.js resides in `apps/web/`. Pure business logic, pricing, and scheduling rules belong in `packages/domain`. Zod schemas and types are housed in `packages/contracts`. Providers and mock services live in `packages/adapters`. We rely on `dependency-cruiser` (to be fully integrated) to prevent cross-feature imports and reverse dependencies.

**Alternatives rejected**:
- Keeping the simple Next.js frontend structure. Rejected because it violates section 5A.
- Using Flutter. Rejected because the prototype was built in web tech and section 4 specifies Next.js/React.

**Gotchas**:
- `openspec` needed to be installed globally and initialized with the `--tools antigravity` flag.
- The `frontend/` codebase was actively being developed; its contents were recursively copied to `apps/web/` so nothing was lost in the restructure.

**Security Notes**:
- Added `.env.example` to document environment variables without leaking secrets.
- `AGENTS.md` explicitly lists security policies regarding SQL injection, XSS, CSRF, and BOLA/IDOR.

**Verification**:
- `openspec validate --all` will be run as features are added.
- The repository successfully runs in a local environment.
