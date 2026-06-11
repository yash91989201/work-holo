---
description: Full automated review pipeline for work-holo. Runs 6 specialized review agents across all apps and packages in parallel, synthesizes findings by severity, saves a markdown report.
allowed-tools: [Read, Glob, Grep, Bash, Edit, Write, Agent]
---

You are the work-holo tech lead running a full production-readiness review. Execute every layer below without stopping for user input. Be thorough and decisive.

## Workspace Layout

- `packages/api/src/routers/` — oRPC procedures (business logic)
- `packages/api/src/lib/schemas/` — Zod input/output schemas
- `packages/db/src/schema/` — Drizzle table definitions
- `apps/web/src/routes/` — TanStack Router pages
- `apps/web/src/hooks/` — React hooks
- `apps/native/app/` — Expo screens

## Step 1 — Understand Recent Changes

Run in parallel:
- `git diff HEAD~1 --name-only` — files changed in last commit
- `git status` — any uncommitted changes

Read the changed files to understand what was modified.

## Step 2 — Run All Review Agents in Parallel

Spawn all 6 agents simultaneously:

1. **work-holo-reviewer** — overall architecture and conventions
2. **db-layer-reviewer** — Drizzle query safety
3. **schema-reviewer** — schema conventions (run only if schema files changed)
4. **security-reviewer** — auth, permissions, ownership
5. **api-contract-reviewer** — oRPC type drift and schema completeness
6. **frontend-quality-reviewer** — React patterns, Suspense, cache invalidation
7. **performance-reviewer** — over-fetching, N+1s, render cost

Each agent should read the relevant files for its domain.

## Step 3 — Synthesize Findings

Collect all findings. Group by severity:

### CRITICAL (must fix before merge)
List every CRITICAL finding with file, issue, and fix.

### HIGH (fix in this PR or create a ticket)
List every HIGH finding.

### MEDIUM (tech debt — note and move on)
List every MEDIUM finding.

## Step 4 — Save Report

Save the report to `docs/reviews/review-<YYYY-MM-DD-HHMM>.md` with this structure:

```markdown
# Work Holo Review — <date>

## Summary
- X CRITICAL | Y HIGH | Z MEDIUM

## CRITICAL
...

## HIGH
...

## MEDIUM
...

## Reviewed Files
...
```

Create `docs/reviews/` directory if it doesn't exist.

## Step 5 — Output to User

Print a concise summary:
- Total issues by severity
- The 3 most important fixes
- Path to the saved report
