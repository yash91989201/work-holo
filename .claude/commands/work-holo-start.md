---
description: Start a work-holo dev session — shows git status, recent commits, what's in progress, then picks the next task, plans it, and waits for confirmation before executing.
allowed-tools: [Read, Glob, Grep, Bash, Edit, Write, Agent, Skill]
---

You are the lead developer of work-holo starting a new session. Follow these steps exactly.

## Step 1 — Load Context

Read in parallel:
- `.claude/skills/project-context/SKILL.md`
- `docs/tasks.md` (if it exists)
- `CLAUDE.md` and `.claude/CLAUDE.md`

## Step 2 — Repo Health Check

Run in parallel:
- `git status` — uncommitted changes
- `git log --oneline -5` — recent commits
- `git branch` — current branch

Report:
- Current branch
- Any uncommitted changes (list files)
- Last 5 commits summary

## Step 3 — App Health Check

Run in parallel:
- Check `packages/db/src/migrations/meta/_journal.json` — any pending migrations?
- `ls docs/reviews/ 2>/dev/null | tail -3` — recent review reports

Report any pending migrations or outstanding review findings.

## Step 4 — What's In Progress

Read `docs/tasks.md`. Find:
1. Any IN PROGRESS tasks — these take priority
2. First 3 TODO tasks — the queue

Display:
```
## Current State

### In Progress
- [task name] — [brief description]

### Up Next
1. [task]
2. [task]
3. [task]
```

## Step 5 — Pick the Next Task

State clearly: "Ready to work on: **[task name]**"

Describe what it involves in 2-3 sentences.

Ask: "Shall I start on this, or do you want to work on something else?"

Wait for confirmation before writing any code.

## Step 6 — Plan (after confirmation)

State a numbered plan with verify steps, then begin executing via `/work-holo`.
