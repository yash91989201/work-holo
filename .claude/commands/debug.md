---
description: Structured debugging for work-holo. Paste an error and this traces it through the oRPC procedure → permission check → Drizzle query → DB and suggests a fix.
allowed-tools: [Read, Glob, Grep, Bash]
---

You are debugging a work-holo issue. Follow this process exactly.

## Step 1 — Understand the Error

Read the error the user provided. Identify:
- Is this a client-side error (browser/native) or server-side?
- Is it an `ORPCError` code (UNAUTHORIZED, FORBIDDEN, NOT_FOUND, CONFLICT, etc.)?
- Is it a Drizzle/database error?
- Is it a TypeScript type error?
- Is it a runtime React error (Suspense, hydration, etc.)?

State: "This looks like a [type] error at [layer]."

## Step 2 — Locate the Procedure

If the error mentions an oRPC path (e.g., `attendance.clock.punchIn`):
```bash
grep -rn "punchIn\|punchOut\|<procedure name>" packages/api/src/routers/ --include="*.ts"
```

Read the procedure file in full.

## Step 3 — Trace the Call Stack

Read in order:
1. **Procedure base** — which base procedure is used? Does the user/session meet its requirements?
2. **Permission check** — is `permission.check()` called? Is the permission correct?
3. **Input validation** — does the Zod schema match what's being sent?
4. **Database query** — is the query scoped correctly? Missing `isDeleted: false`? Ownership check?
5. **Error throw** — is `ORPCError` thrown with the right code?

## Step 4 — Locate the Client Call

If relevant, find where the client calls this procedure:
```bash
grep -rn "<procedure name>" apps/web/src/ apps/native/ --include="*.tsx" --include="*.ts"
```

Check:
- Is the procedure path in `queryUtils` correct?
- Is the input shape matching the Zod schema?
- Is the error being caught and displayed to the user?

## Step 5 — Diagnose

State clearly:
- **Root cause**: [exact reason the error occurs]
- **Where**: [file:line]
- **Why**: [what invariant or check is failing]

## Step 6 — Fix

Propose the minimal fix. Show the before and after diff. Ask: "Should I apply this fix?"

## Common Error Patterns

| Error | Likely cause |
|---|---|
| `UNAUTHORIZED` | Wrong procedure base, or session not passed in request headers |
| `FORBIDDEN` | Permission check failed — user lacks the permission |
| `NOT_FOUND` | Query returns `undefined` — missing `isDeleted: false`, wrong ownership scope |
| `CONFLICT` | Business rule violated (already punched in, already exists) |
| Suspense crash | `useSuspenseQuery` without `<Suspense>` ancestor |
| Stale data after mutation | Missing `queryClient.invalidateQueries()` after mutation |
| Type error on `queryUtils.x.y` | Procedure path wrong — check `appRouter` nesting |
