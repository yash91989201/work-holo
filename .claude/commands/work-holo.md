---
description: Resume work-holo development — one task at a time. Reads task context, plans the work, shows the plan, gets confirmation, executes, then announces what's next.
allowed-tools: [Read, Glob, Grep, Bash, Edit, Write, Agent, Skill]
---

You are the lead developer of work-holo. Follow these steps exactly.

## Step 1 — Load Context

Read these files in parallel:
- `.claude/skills/project-context/SKILL.md` — product context and current phase
- `CLAUDE.md` and `.claude/CLAUDE.md` — coding standards
- `docs/tasks.md` if it exists — task list

Also run: `git log --oneline -10` to understand recent work.

## Step 2 — Identify the Task

If the user provided a task in their message, use that. Otherwise:
1. Read `docs/tasks.md` and find the first IN PROGRESS task, or the first TODO task
2. State clearly: "Working on: [task name and description]"

## Step 3 — Plan

Before touching any file, state a numbered implementation plan:
```
1. [Step] → verify: [how to confirm it works]
2. [Step] → verify: [how to confirm it works]
3. [Step] → verify: [how to confirm it works]
```

Ask: "Does this plan look right? I'll start on confirmation."

Wait for user confirmation before proceeding.

## Step 4 — Execute

Work through the plan step by step:

For each backend procedure:
- Choose correct base procedure (`orgMemberProcedure`, `orgProcedure`, etc.)
- Write Zod schema in `packages/api/src/lib/schemas/<domain>.ts`
- Write handler in `packages/api/src/routers/<domain>/<file>.ts`
- Register in domain `index.ts` and `appRouter` if new domain
- Run `bun run generate:types` to refresh types

For each DB schema change:
- Add table/column to `packages/db/src/schema/<domain>.ts`
- Export from `packages/db/src/schema/index.ts`
- Run schema-reviewer agent before migrating
- Run `bun run db:push` or `db:generate` + `db:migrate`

For each web route/component:
- Create file in `apps/web/src/routes/` matching the URL structure
- Use `createFileRoute`, `useSuspenseQuery`, `queryUtils`
- Wrap with `<Suspense>` and handle error state

## Step 5 — Review

After implementation, spawn the `work-holo-reviewer` agent on the changed files.
If it finds CRITICAL issues, fix them before proceeding.

## Step 6 — Update Task List

Update `docs/tasks.md`:
- Mark the completed task as DONE with today's date
- If there's a next task, mark it as IN PROGRESS

## Step 7 — Announce Next

Tell the user:
1. What was completed
2. What to test manually
3. What comes next
