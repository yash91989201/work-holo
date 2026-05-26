# AGENTS.md

> **Purpose:** This file defines mandatory tooling rules and workflow patterns for AI agents operating in this codebase.
All rules are non-negotiable unless explicitly stated otherwise.

---

## Table of Contents

1. [Communication Style — Caveman Mode](#0-communication-style--caveman-mode)
2. [Browser Automation — `agent-browser`](#1-browser-automation--agent-browser)
3. [Frontend API — oRPC + TanStack Query](#2-frontend-api--orpc--tanstack-query)
4. [Context-Mode — Mandatory Routing Rules](#3-context-mode--mandatory-routing-rules)

---

## 0. Communication Style — Caveman Mode

**Rule:** Always active. No exceptions. No revert after many turns. No filler drift.

- Terse like caveman. Technical substance exact. Only fluff die.
- Drop: articles, filler (`just` / `really` / `basically`), pleasantries, hedging.
- Fragments OK. Short synonyms. Code unchanged.
- Pattern: `[thing] [action] [reason]. [next step].`
- Code / commits / PRs: write normally.
- Off: user says `"stop caveman"` or `"normal mode"`.

---

## 1. Browser Automation — `agent-browser`

Run `agent-browser --help` for the full reference.

### Core Commands

```sh
agent-browser open <url>       # Navigate to a URL
agent-browser snapshot -i      # List interactive elements (refs: @e1, @e2, …)
agent-browser click @e1        # Click an element by ref
agent-browser fill @e2 "text"  # Fill an input by ref
```

> **Important:** Re-snapshot after every page change before interacting with new elements.

---

## 2. Frontend API — oRPC + TanStack Query

All API calls **must** use the `queryUtils` + TanStack Query pattern. Never call procedures directly.

### Operation Patterns

| Operation | Required Pattern |
| --- | --- |
| Reads | `useSuspenseQuery` (preferred) or `useQuery` |
| Writes | `useMutation` |
| Cache invalidation | Inside `onSuccess` only, via `invalidateQueries` |

### Rules

- Always use `queryUtils` — **never** the raw `client`.
- Never call RPC procedures directly inside components.
- Inputs/outputs are type-safe and inferred from backend schemas.
- Native TanStack options (`staleTime`, `enabled`, `onError`, etc.) are valid via `queryOptions` / `mutationOptions`.
- Never manually construct query keys.

### Common Mistakes to Avoid

- Importing or using the raw `client` directly.
- Calling RPC procedures outside React Query.
- Invalidating queries outside the mutation lifecycle.
- Manually constructing query keys.

📖 Reference: [`docs/technical/api-client-usage.md`](docs/technical/api-client-usage.md)

---

## 3. Context-Mode — Mandatory Routing Rules

> **Critical:** These rules are **not optional**. A single unrouted command can dump 56 KB into context and waste the entire session. Follow the routing rules exactly.

---

### 3.1 Blocked Commands

The following commands are **intercepted and blocked** by the context-mode plugin. Do not retry them in any form.

#### `curl` / `wget` — BLOCKED

**Do not use.** Use these instead:

- `context-mode_ctx_fetch_and_index(url, source)` — fetch and index web pages.
- `context-mode_ctx_execute(language: "javascript", code: "const r = await fetch(...)")` — run HTTP calls in sandbox.

#### Inline HTTP calls — BLOCKED

Shell commands containing `fetch('http`, `requests.get(`, `requests.post(`, `http.get(`, or `http.request(` are blocked.

**Use instead:** `context-mode_ctx_execute(language, code)` to run HTTP calls in sandbox.

#### Direct URL fetching — BLOCKED

**Use instead:** `context-mode_ctx_fetch_and_index(url, source)` → then `context-mode_ctx_search(queries)`.

---

### 3.2 Redirected Tools — Use Sandbox Equivalents

#### Shell (output > 20 lines)

Shell is **only** permitted for short-output commands:
`git`, `mkdir`, `rm`, `mv`, `cd`, `ls`, `npm install`, `pip install`

For everything else:

- `context-mode_ctx_batch_execute(commands, queries)` — run multiple commands and search in one call.
- `context-mode_ctx_execute(language: "shell", code: "...")` — only stdout enters context.

#### File Reading

| Intent | Tool |
| --- | --- |
| Reading a file **to edit it** | Read directly (content must be in context) |
| Reading a file **to analyse/summarise** | `context-mode_ctx_execute_file(path, language, code)` — only your printed summary enters context |

#### `grep` / Search (large results)

Search results can flood context.

**Use:** `context-mode_ctx_execute(language: "shell", code: "grep ...")` — only your summary enters context.

---

### 3.3 Tool Selection Hierarchy

Use tools in this priority order:

1. **GATHER** — `context-mode_ctx_batch_execute(commands, queries)`
   Primary tool. Runs all commands, auto-indexes output, returns search results. One call replaces 30+ individual calls.

2. **FOLLOW-UP** — `context-mode_ctx_search(queries: ["q1", "q2", ...])`
   Query indexed content. Pass **all** questions as an array in one call.

3. **PROCESSING** — `context-mode_ctx_execute(language, code)` or `context-mode_ctx_execute_file(path, language, code)`
   Sandbox execution. Only stdout enters context.

4. **WEB** — `context-mode_ctx_fetch_and_index(url, source)` → then `context-mode_ctx_search(queries)`
   Fetch, chunk, index, query. Raw HTML never enters context.

5. **INDEX** — `context-mode_ctx_index(content, source)`
   Store content in FTS5 knowledge base for later search. Use descriptive `source` labels.

---

### 3.4 Output Constraints

- Keep responses **under 500 words**.
- Write all artifacts (code, configs, PRDs) to **files** — never return them as inline text. Return only: file path + one-line description.
- Use descriptive source labels when indexing so content can be retrieved via `search(source: "label")`.

---

### 3.5 `ctx` Utility Commands

| Command | Action |
| --- | --- |
| `ctx stats` | Call the `stats` MCP tool and display full output verbatim |
| `ctx doctor` | Call the `doctor` MCP tool, run returned shell command, display as checklist |
| `ctx upgrade` | Call the `upgrade` MCP tool, run returned shell command, display as checklist |

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **work-holo** (9326 symbols, 17896 relationships, 241 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/work-holo/context` | Codebase overview, check index freshness |
| `gitnexus://repo/work-holo/clusters` | All functional areas |
| `gitnexus://repo/work-holo/processes` | All execution flows |
| `gitnexus://repo/work-holo/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
