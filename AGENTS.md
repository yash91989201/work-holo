# Agent Workflow & Tooling Rules

## 1. File Editing

- **Always use `edit_file`** over `str_replace` or full rewrites.
- Accepts partial snippets — no full file context required.
- Minimizes diffs and reduces unintended side effects.

---

## 2. Codebase Exploration (`warp-grep`)

`warp-grep` is a subagent for fast semantic codebase search.

**Use at the start of any investigation.** Query by intent, not keywords.

| Good queries                  | Avoid                         |
| ----------------------------- | ----------------------------- |
| "Find the XYZ flow"           | Exact keyword searches        |
| "How does XYZ work?"          | Overly narrow/literal queries |
| "Where is `<e>` coming from?" |                               |

---

## 3. Browser Automation (`agent-browser`)

Run `agent-browser --help` for full reference.

```sh
agent-browser open <url>      # Navigate
agent-browser snapshot -i     # List interactive elements (refs: @e1, @e2)
agent-browser click @e1       # Click element
agent-browser fill @e2 "text" # Fill input
```

Re-snapshot after any page change.

---

## 4. Frontend API: oRPC + TanStack Query

All API calls must use the **`queryUtils` + TanStack Query** pattern.

### Rules

| Operation          | Pattern                                         |
| ------------------ | ----------------------------------------------- |
| Reads              | `useSuspenseQuery` (preferred) or `useQuery`    |
| Writes             | `useMutation`                                   |
| Cache invalidation | Inside `onSuccess` only via `invalidateQueries` |

- Always use `queryUtils` — never the raw `client`.
- Never call procedures directly inside components.
- Inputs/outputs are type-safe and inferred from backend schemas.
- Native TanStack options (`staleTime`, `enabled`, `onError`, etc.) are
  valid via `queryOptions` / `mutationOptions`.

### Common Mistakes

- Importing/using the raw `client` directly.
- Calling RPC procedures outside React Query.
- Invalidating queries outside mutation lifecycle.
- Manually constructing query keys.

📖 [API Client Usage Guide](docs/technical/api-client-usage.md)

# context-mode — MANDATORY routing rules

You have context-mode MCP tools available. These rules are NOT optional — they protect your context window from flooding. A single unrouted command can dump 56 KB into context and waste the entire session.

## BLOCKED commands — do NOT attempt these

### curl / wget — BLOCKED
Any shell command containing `curl` or `wget` will be intercepted and blocked by the context-mode plugin. Do NOT retry.
Instead use:
- `context-mode_ctx_fetch_and_index(url, source)` to fetch and index web pages
- `context-mode_ctx_execute(language: "javascript", code: "const r = await fetch(...)")` to run HTTP calls in sandbox

### Inline HTTP — BLOCKED
Any shell command containing `fetch('http`, `requests.get(`, `requests.post(`, `http.get(`, or `http.request(` will be intercepted and blocked. Do NOT retry with shell.
Instead use:
- `context-mode_ctx_execute(language, code)` to run HTTP calls in sandbox — only stdout enters context

### Direct web fetching — BLOCKED
Do NOT use any direct URL fetching tool. Use the sandbox equivalent.
Instead use:
- `context-mode_ctx_fetch_and_index(url, source)` then `context-mode_ctx_search(queries)` to query the indexed content

## REDIRECTED tools — use sandbox equivalents

### Shell (>20 lines output)
Shell is ONLY for: `git`, `mkdir`, `rm`, `mv`, `cd`, `ls`, `npm install`, `pip install`, and other short-output commands.
For everything else, use:
- `context-mode_ctx_batch_execute(commands, queries)` — run multiple commands + search in ONE call
- `context-mode_ctx_execute(language: "shell", code: "...")` — run in sandbox, only stdout enters context

### File reading (for analysis)
If you are reading a file to **edit** it → reading is correct (edit needs content in context).
If you are reading to **analyze, explore, or summarize** → use `context-mode_ctx_execute_file(path, language, code)` instead. Only your printed summary enters context.

### grep / search (large results)
Search results can flood context. Use `context-mode_ctx_execute(language: "shell", code: "grep ...")` to run searches in sandbox. Only your printed summary enters context.

## Tool selection hierarchy

1. **GATHER**: `context-mode_ctx_batch_execute(commands, queries)` — Primary tool. Runs all commands, auto-indexes output, returns search results. ONE call replaces 30+ individual calls.
2. **FOLLOW-UP**: `context-mode_ctx_search(queries: ["q1", "q2", ...])` — Query indexed content. Pass ALL questions as array in ONE call.
3. **PROCESSING**: `context-mode_ctx_execute(language, code)` | `context-mode_ctx_execute_file(path, language, code)` — Sandbox execution. Only stdout enters context.
4. **WEB**: `context-mode_ctx_fetch_and_index(url, source)` then `context-mode_ctx_search(queries)` — Fetch, chunk, index, query. Raw HTML never enters context.
5. **INDEX**: `context-mode_ctx_index(content, source)` — Store content in FTS5 knowledge base for later search.

## Output constraints

- Keep responses under 500 words.
- Write artifacts (code, configs, PRDs) to FILES — never return them as inline text. Return only: file path + 1-line description.
- When indexing content, use descriptive source labels so others can `search(source: "label")` later.

## ctx commands

| Command | Action |
|---------|--------|
| `ctx stats` | Call the `stats` MCP tool and display the full output verbatim |
| `ctx doctor` | Call the `doctor` MCP tool, run the returned shell command, display as checklist |
| `ctx upgrade` | Call the `upgrade` MCP tool, run the returned shell command, display as checklist |
