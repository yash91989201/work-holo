---
description: Scan packages/api for Drizzle queries missing isDeleted:false filter — the most dangerous soft-delete bug in work-holo.
allowed-tools: [Read, Glob, Grep, Bash]
---

Scan `packages/api/src` for unsafe Drizzle queries on soft-delete tables.

## What to Look For

### 1. Missing soft-delete filter on findFirst/findMany

Tables that require `eq(table.isDeleted, false)` in every read:
- `attendanceTable`
- `messageTable`
- Any table with an `isDeleted` column (grep for it)

Search:
```bash
grep -rn "attendanceTable\|messageTable\|workBlockTable" packages/api/src/routers/ --include="*.ts"
```

For each match involving a read query (`findFirst`, `findMany`, `select`), verify `isDeleted` is in the `where` clause.

### 2. Missing ownership scope

Search for queries that take an ID from user input but don't scope to `userId` or `organizationId`:
```bash
grep -rn "input\.\w*[Ii]d" packages/api/src/routers/ --include="*.ts" -l
```

Read each file and check if the ID is used in a query without user/org scoping.

### 3. Soft-delete tables without the field

Search for tables missing `isDeleted`:
```bash
grep -rn "isDeleted" packages/db/src/schema/ --include="*.ts" -l
```

Cross-reference against all tables that represent user-owned content.

## Output

For each issue found:
- File path and line number
- The unsafe query
- Fixed query with `isDeleted` filter and ownership scope added
