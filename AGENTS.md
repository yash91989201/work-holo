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
