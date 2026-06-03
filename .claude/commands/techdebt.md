---
description: Scan all work-holo apps and packages for tech debt — any types, console.log, hardcoded values, unused imports, and convention violations.
allowed-tools: [Read, Glob, Grep, Bash]
---

Scan all work-holo apps and packages for tech debt. Run all searches in parallel.

## Scan 1 — packages/api/src/routers/

```bash
grep -rn "any" packages/api/src/routers/ --include="*.ts" | grep -v "// " | grep ": any\|as any\|<any>"
grep -rn "console\." packages/api/src/routers/ --include="*.ts"
grep -rn "throw new Error(" packages/api/src/routers/ --include="*.ts"
grep -rn "TODO\|FIXME\|HACK\|XXX" packages/api/src/routers/ --include="*.ts"
```

Flag:
- `any` types — should be replaced with proper types or `unknown`
- `console.log/error` — should be removed or replaced with proper error handling
- `throw new Error(` — should be `throw new ORPCError(`
- TODO/FIXME comments — enumerate them

## Scan 2 — packages/db/src/schema/

```bash
grep -rn "serial\|uuid()" packages/db/src/schema/ --include="*.ts"
grep -rn "TODO\|FIXME" packages/db/src/schema/ --include="*.ts"
```

Flag:
- `serial()` or `uuid()` for primary keys — should be `cuid2().defaultRandom().primaryKey()`
- Tables missing `isDeleted` that logically should have it

## Scan 3 — apps/web/src/

```bash
grep -rn "console\." apps/web/src/ --include="*.tsx" --include="*.ts" | grep -v "// "
grep -rn ": any\|as any\|<any>" apps/web/src/ --include="*.tsx" --include="*.ts"
grep -rn "TODO\|FIXME\|HACK" apps/web/src/ --include="*.tsx" --include="*.ts"
grep -rn "useEffect.*fetch\|fetch(" apps/web/src/ --include="*.tsx" | grep -v "upload\|pusher\|service-worker"
```

Flag:
- `console.log` in components
- `any` types
- `useEffect` used for data fetching (should be `useSuspenseQuery`/`useQuery`)
- TODOs

## Scan 4 — apps/native/

```bash
grep -rn "console\." apps/native/ --include="*.tsx" --include="*.ts" | grep -v "// "
grep -rn "TODO\|FIXME" apps/native/ --include="*.tsx" --include="*.ts"
```

## Scan 5 — Dead Exports

```bash
grep -rn "export" packages/api/src/lib/schemas/ --include="*.ts" | grep -o "export.*" | head -20
```

Check if any exported schemas are never imported (rough scan — look for obvious orphans).

## Output Format

Organize output as:

```
## Tech Debt Report

### CRITICAL (breaks conventions)
- file:line — issue

### HIGH (should fix this sprint)
- file:line — issue

### MEDIUM (tech debt backlog)
- file:line — issue

### TODOs/FIXMEs
- file:line — comment text

Total: X items across Y files
```
