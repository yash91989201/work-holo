# AGENTS.md

> **Purpose:** This file defines mandatory tooling rules and workflow patterns for AI agents operating in this codebase.
All rules are non-negotiable unless explicitly stated otherwise.

---

## Table of Contents

1. [Communication Style — Caveman Mode](#0-communication-style--caveman-mode)
2. [File Editing](#1-file-editing)
3. [Codebase Exploration — `warp-grep`](#2-codebase-exploration--warp-grep)
4. [Browser Automation — `agent-browser`](#3-browser-automation--agent-browser)
5. [Frontend API — oRPC + TanStack Query](#4-frontend-api--orpc--tanstack-query)
6. [Context-Mode — Mandatory Routing Rules](#5-context-mode--mandatory-routing-rules)

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

## 1. File Editing

**Rule:** Always use `edit_file`. Never use `str_replace` or full file rewrites.

**Why:** `edit_file` accepts partial snippets, minimises diffs, and reduces unintended side effects.

---

## 2. Codebase Exploration — `warp-grep`

`warp-grep` is a subagent for fast semantic codebase search.

**Rule:** Always run `warp-grep` at the start of any investigation before writing or modifying code.

**Query style — intent over keywords:**

| ✅ Good Queries | ❌ Avoid |
| --- | --- |
| `"Find the XYZ flow"` | Exact keyword searches |
| `"How does XYZ work?"` | Overly narrow or literal queries |
| `"Where is <e> coming from?"` | — |

---

## 3. Browser Automation — `agent-browser`

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

## 4. Frontend API — oRPC + TanStack Query

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

📖 Reference: [`docs/guides/api-client-usage.md`](docs/guides/api-client-usage.md)

---

## 5. Context-Mode — Mandatory Routing Rules

> **Critical:** These rules are **not optional**. A single unrouted command can dump 56 KB into context and waste the entire session. Follow the routing rules exactly.

---

### 5.1 Blocked Commands

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

### 5.2 Redirected Tools — Use Sandbox Equivalents

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

### 5.3 Tool Selection Hierarchy

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

### 5.4 Output Constraints

- Keep responses **under 500 words**.
- Write all artifacts (code, configs, PRDs) to **files** — never return them as inline text. Return only: file path + one-line description.
- Use descriptive source labels when indexing so content can be retrieved via `search(source: "label")`.

---

### 5.5 `ctx` Utility Commands

| Command | Action |
| --- | --- |
| `ctx stats` | Call the `stats` MCP tool and display full output verbatim |
| `ctx doctor` | Call the `doctor` MCP tool, run returned shell command, display as checklist |
| `ctx upgrade` | Call the `upgrade` MCP tool, run returned shell command, display as checklist |

📖 [API Client Usage Guide](docs/technical/api-client-usage.md)
