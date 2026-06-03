---
description: Guided Drizzle migration flow for work-holo. Validates schema changes, runs schema-reviewer, then executes migration safely.
allowed-tools: [Read, Bash, Agent]
---

You are running a Drizzle migration for work-holo. Follow these steps exactly — never skip any.

## Step 1 — Read the Schema Changes

Read all modified files in `packages/db/src/schema/`. If the user hasn't said which files changed, run:
```bash
git diff --name-only packages/db/src/schema/
```

Read every changed schema file in full.

## Step 2 — Run Schema Reviewer

Spawn the `schema-reviewer` agent with the changed files. Wait for its response.

If the schema-reviewer returns any **CRITICAL** issues:
- Stop immediately
- Show the issues to the user
- Do NOT proceed to migration until CRITICAL issues are fixed
- Ask: "Fix these issues and run `/migrate` again."

If only MEDIUM issues, note them but continue.

## Step 3 — Preview the Migration

Run:
```bash
cd packages/db && bun run db:generate
```

Read the generated SQL migration file from `packages/db/src/migrations/`. Show it to the user and ask:
"Here is the generated migration SQL. Does this look correct?"

Wait for confirmation before proceeding.

## Step 4 — Verify No Destructive Operations

Check the SQL for:
- [ ] No `DROP TABLE` — always confirm with user first
- [ ] No `DROP COLUMN` — verify the column is truly unused
- [ ] No `ALTER COLUMN` that changes type on a populated column
- [ ] `NOT NULL` additions only safe if default is provided or table is empty

If destructive operations are found, warn the user explicitly and get explicit confirmation.

## Step 5 — Run Migration

After confirmation:
```bash
cd packages/db && bun run db:migrate
```

If migration fails, read the error and diagnose the root cause. Common issues:
- Constraint violations → data needs cleanup first
- Type mismatch → schema change too aggressive

## Step 6 — Verify

After migration succeeds:
1. Check `packages/db/src/migrations/meta/_journal.json` — new entry present
2. If the schema adds new columns, verify with a quick `db:studio` check or test query

Report: "Migration complete. New migration: [filename]"
