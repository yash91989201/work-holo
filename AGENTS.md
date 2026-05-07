# AGENTS.md

> Mandatory tooling rules and workflow patterns. All rules non-negotiable unless stated otherwise.

---

## 0. Communication Style — Caveman Mode

**Always active. No exceptions.**

- Terse. Technical. No filler (`just`, `really`, `basically`), no pleasantries, no hedging.
- Fragments OK. Short synonyms. Pattern: `[thing] [action] [reason]. [next step].`
- Code / commits / PRs: write normally.
- Disable: user says `"stop caveman"` or `"normal mode"`.

---

## 1. Browser Automation — `agent-browser`

```sh
agent-browser open <url>       # Navigate to URL
agent-browser snapshot -i      # List interactive elements (refs: @e1, @e2, …)
agent-browser click @e1        # Click element
agent-browser fill @e2 "text"  # Fill input
```

> Re-snapshot after every page change before interacting with new elements.

---

## 2. Frontend API — oRPC + TanStack Query

**Never call procedures directly. Always use `queryUtils` + TanStack Query.**

| Operation | Pattern |
|-----------|---------|
| Reads | `useSuspenseQuery` (preferred) or `useQuery` |
| Writes | `useMutation` |
| Cache invalidation | `invalidateQueries` inside `onSuccess` only |

**Never:**
- Import or use raw `client` directly
- Call RPC procedures outside React Query
- Invalidate queries outside mutation lifecycle
- Manually construct query keys

📖 Ref: [`docs/guides/api-client-usage.md`](docs/guides/api-client-usage.md)

---

## 3. Context-Mode — Mandatory Routing Rules

> **Critical:** One unrouted command can dump 56 KB into context. Follow exactly.

### 3.1 Blocked Commands

| Blocked | Use Instead |
|---------|-------------|
| `curl` / `wget` | `context-mode_ctx_fetch_and_index(url, source)` or `context-mode_ctx_execute(language: "javascript", code: "const r = await fetch(...)")` |
| Inline HTTP (`fetch('http`, `requests.get(`, `requests.post(`, `http.get(`, `http.request(`) | `context-mode_ctx_execute(language, code)` |
| Direct URL fetching | `context-mode_ctx_fetch_and_index(url, source)` → `context-mode_ctx_search(queries)` |

### 3.2 Redirected Tools

**Shell** — only permitted for short-output commands: `git`, `mkdir`, `rm`, `mv`, `cd`, `ls`, `npm install`, `pip install`
- Multi-command / long output → `context-mode_ctx_batch_execute(commands, queries)`
- Single sandbox run → `context-mode_ctx_execute(language: "shell", code: "...")`

**File Reading:**
| Intent | Tool |
|--------|------|
| Edit (content needed in context) | Read directly |
| Analyse / summarise | `context-mode_ctx_execute_file(path, language, code)` |

**grep / Search (large results):** `context-mode_ctx_execute(language: "shell", code: "grep ...")`

### 3.3 Tool Selection Hierarchy

1. **GATHER** — `context-mode_ctx_batch_execute(commands, queries)` — primary tool; replaces 30+ individual calls
2. **FOLLOW-UP** — `context-mode_ctx_search(queries: ["q1", "q2", ...])` — query indexed content; all questions in one call
3. **PROCESS** — `context-mode_ctx_execute(language, code)` or `context-mode_ctx_execute_file(path, language, code)`
4. **WEB** — `context-mode_ctx_fetch_and_index(url, source)` → `context-mode_ctx_search(queries)`
5. **INDEX** — `context-mode_ctx_index(content, source)` — use descriptive `source` labels

### 3.4 Output Constraints

- Responses: **≤ 500 words**
- Artifacts (code, configs, PRDs): write to **files only** — return file path + one-line description, never inline text
- Use descriptive source labels when indexing

### 3.5 `ctx` Utility Commands

| Command | Action |
|---------|--------|
| `ctx stats` | Call `stats` MCP tool; display output verbatim |
| `ctx doctor` | Call `doctor` MCP tool; run returned shell command; display as checklist |
| `ctx upgrade` | Call `upgrade` MCP tool; run returned shell command; display as checklist |

---

## 4. GitNexus — Code Intelligence

Project indexed as **work-holo** (9215 symbols, 15461 relationships, 300 execution flows).

> If index is stale: run `npx gitnexus analyze` first.

### Always Do

- **Before editing any symbol:** run `gitnexus_impact({target: "symbolName", direction: "upstream"})` → report blast radius (direct callers, affected processes, risk level)
- **Before committing:** run `gitnexus_detect_changes()` → verify only expected symbols/flows changed
- **If impact returns HIGH or CRITICAL:** warn user before proceeding
- Exploring unfamiliar code → `gitnexus_query({query: "concept"})` (not grep)
- Full symbol context → `gitnexus_context({name: "symbolName"})`

### Never Do

- Edit any symbol without running `gitnexus_impact` first
- Ignore HIGH or CRITICAL risk warnings
- Rename symbols with find-and-replace — use `gitnexus_rename`
- Commit without running `gitnexus_detect_changes()`

### Resources

| Resource | Use For |
|----------|---------|
| `gitnexus://repo/work-holo/context` | Codebase overview, index freshness |
| `gitnexus://repo/work-holo/clusters` | All functional areas |
| `gitnexus://repo/work-holo/processes` | All execution flows |
| `gitnexus://repo/work-holo/process/{name}` | Step-by-step execution trace |

### Skill Files

| Task | Skill File |
|------|-----------|
| Architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |
