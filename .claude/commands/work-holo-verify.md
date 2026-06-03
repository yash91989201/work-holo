---
description: Verification pass after /work-holo-review. Re-runs all review agents, cross-references against the most recent review report, gives a final verdict — fixed, still broken, new regressions.
allowed-tools: [Read, Glob, Grep, Bash, Edit, Write, Agent]
---

You are the work-holo tech lead running a post-fix verification pass. Confirm that the previous `/work-holo-review` fixed what it said, and nothing new broke.

## Step 1 — Find Previous Report

Run: `ls docs/reviews/ | sort | tail -1`

Read the most recent review report completely. Extract all CRITICAL and HIGH issues with their file references.

## Step 2 — Re-run All Review Agents in Parallel

Spawn the same 6 agents as `/work-holo-review`:
1. work-holo-reviewer
2. db-layer-reviewer
3. security-reviewer
4. api-contract-reviewer
5. frontend-quality-reviewer
6. performance-reviewer

Each agent should focus on the files mentioned in the previous report, plus any new files changed since then (run `git diff <prev-commit> --name-only` to find them).

## Step 3 — Cross-Reference

For each CRITICAL/HIGH issue in the previous report:
- **FIXED** ✓ — issue no longer present
- **STILL OPEN** ✗ — issue still present, show current state
- **PARTIALLY FIXED** ~ — improved but not fully resolved

Also list any **NEW ISSUES** found that weren't in the previous report.

## Step 4 — Verdict

```
## Verification Verdict

### Fixed (X of Y critical/high)
...

### Still Open
...

### New Issues Found
...

### Overall: PASS / FAIL / PARTIAL
```

PASS = all CRITICAL fixed, no new CRITICAL introduced
PARTIAL = all CRITICAL fixed but HIGH remain, or 1 new CRITICAL
FAIL = CRITICAL remain open or multiple new CRITICAL introduced

## Step 5 — Save Updated Report

Save to `docs/reviews/verify-<YYYY-MM-DD-HHMM>.md`
