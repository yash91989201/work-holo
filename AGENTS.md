# Agent Workflow & Tooling Rules

## Fast Apply (Critical)

* **Always prefer `edit_file`** over `str_replace` or full file rewrites
* Works with **partial code snippets** — full file context is not required
* Use this approach to minimize diffs and reduce unintended changes

## Warp Grep Usage

**warp-grep** is a subagent designed for fast codebase exploration.

### When to Use

* At the **start of any codebase investigation**
* To quickly locate relevant files, flows, or ownership boundaries

### How to Use

* Use **broad, semantic queries**, not exact keyword matching
* Think in terms of intent and behavior

**Good examples:**

* "Find the XYZ flow"
* "How does XYZ work?"
* "Where is XYZ handled?"
* "Where is <error message> coming from?"

### When *Not* to Use

* Do **not** use warp-grep for pinpoint keyword searches
* Avoid overly narrow or literal queries

Following these rules ensures faster context discovery, safer edits, and more reliable agent-driven changes.

---

# Browser Automation

Use `agent-browser` for web automation. Run `agent-browser --help` for all commands.

Core workflow:

1. `agent-browser open <url>` - Navigate to page
2. `agent-browser snapshot -i` - Get interactive elements with refs (@e1, @e2)
3. `agent-browser click @e1` / `fill @e2 "text"` - Interact using refs
4. Re-snapshot after page changes

---

## ⚠️ Frontend API Consumption (oRPC + TanStack Query)

All frontend API calls **must follow the project’s oRPC + TanStack Query pattern**.

### ✅ Required Rules

* Always use **`queryUtils`** (never the raw `client`).
* **Reads** → `useSuspenseQuery` (preferred) or `useQuery`.
* **Writes** → `useMutation`.
* Never call procedures directly inside components.
* Perform `queryClient.invalidateQueries` **only inside mutation handlers** (`onSuccess`).
* All inputs/outputs are type-safe and inferred from backend schemas.
* All native TanStack Query options (`staleTime`, `enabled`, `onError`, etc.) are allowed via:
  * `queryOptions`
  * `mutationOptions`

### 🚫 Common Mistakes

* Importing and using the raw `client`.
* Calling RPC procedures directly without React Query.
* Invalidating queries outside mutation lifecycle.
* Manually constructing query keys instead of using `queryUtils`.

### 📖 Full Documentation

👉 [API Client Usage Guide](docs/technical/api-client-usage.md)
