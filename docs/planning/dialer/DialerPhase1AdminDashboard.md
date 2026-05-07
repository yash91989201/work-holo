# Admin Dashboard for FreeSWITCH Management

## Context

Currently, all FreeSWITCH configuration (SIP trunks, DIDs, agent extensions, dialplan routing) is done by SSH into the VPS (`135.181.31.20`) and manually editing XML files. This is error-prone, not scalable, and requires technical expertise.

**Goal:** Build a Platform Admin Dashboard that manages all FreeSWITCH infrastructure through the web UI, so the admin can configure SIP trunks, DIDs, agent extensions, and monitor server status — all without touching SSH.

**Config Sync approach:** API-driven via ESL. For now, save everything to DB and mark as "pending deployment". The SIP Worker (Phase 2) will handle actual ESL communication with FreeSWITCH. The dashboard is the management layer.

---

## Scope — 5 Features

1. **SIP Trunk Management** — CRUD SIP trunk providers (CloudBharat, Telnyx, etc.)
2. **DID Inventory & Assignment** — Add/import phone numbers, assign to orgs
3. **Agent Extension Management** — Create/edit SIP user extensions
4. **FreeSWITCH Server Status** — Read-only monitoring dashboard
5. **Audit Trail** — Track who changed what and when (lightweight, built into all above)

---

## Implementation Plan

### Step 1: Database Schema (`packages/db/src/schema/dialer.ts`)

New tables, following existing Drizzle patterns (text IDs, timestamps, org scoping):

```
sipTrunks
├── id (text, PK, cuid2)
├── name (text, unique) — "CloudBharat Main"
├── provider (text) — "cloudbharat" | "telnyx" | "twilio" | "custom"
├── username (text)
├── password (text) — encrypted at app layer
├── proxy (text) — "siptrunk.cloudbharat.in"
├── fromDomain (text, nullable)
├── register (boolean, default true)
├── expireSeconds (integer, default 60)
├── pingInterval (integer, default 25)
├── transport (text, default "udp")
├── isActive (boolean, default true)
├── deploymentStatus (text) — "pending" | "deployed" | "failed" | "undeployed"
├── deployedAt (timestamp, nullable)
├── createdAt (timestamp)
├── updatedAt (timestamp)
├── createdBy (text, FK → user.id)

didInventory
├── id (text, PK, cuid2)
├── number (text, unique) — "+914226628808"
├── friendlyName (text, nullable) — "Sales Main Line"
├── sipTrunkId (text, FK → sipTrunks.id)
├── organizationId (text, FK → organization.id, nullable) — null = unassigned
├── status (text) — "available" | "assigned" | "retired" | "blocked"
├── destinationType (text, nullable) — "agent" | "queue" | "hangup"
├── destinationTarget (text, nullable) — agent extension or queue ID
├── recordingEnabled (boolean, default true)
├── stickyAgentEnabled (boolean, default false)
├── isActive (boolean, default false)
├── deploymentStatus (text) — "pending" | "deployed" | "failed" | "undeployed"
├── deployedAt (timestamp, nullable)
├── assignedAt (timestamp, nullable)
├── createdAt (timestamp)
├── updatedAt (timestamp)
├── createdBy (text, FK → user.id)

agentExtensions
├── id (text, PK, cuid2)
├── extension (text, unique) — "1001"
├── password (text) — SIP registration password
├── callerIdName (text) — "Agent 1"
├── callerIdNumber (text) — "914226628808"
├── organizationId (text, FK → organization.id, nullable)
├── userId (text, FK → user.id, nullable) — link to Work Holo user
├── context (text, default "default")
├── tollAllow (text, default "domestic,international,local")
├── isActive (boolean, default true)
├── deploymentStatus (text) — "pending" | "deployed" | "failed" | "undeployed"
├── deployedAt (timestamp, nullable)
├── createdAt (timestamp)
├── updatedAt (timestamp)
├── createdBy (text, FK → user.id)

dialerAuditLog
├── id (text, PK, cuid2)
├── entityType (text) — "sip_trunk" | "did" | "agent_extension"
├── entityId (text)
├── action (text) — "created" | "updated" | "deleted" | "deployed" | "assigned"
├── changes (text, JSON) — diff of what changed
├── performedBy (text, FK → user.id)
├── createdAt (timestamp)
```

**Files to modify:**
- Create: `packages/db/src/schema/dialer.ts`
- Edit: `packages/db/src/schema/index.ts` — add `export * from "./dialer"`

---

### Step 2: Admin API Router (`packages/api/src/routers/admin/dialer.ts`)

New dialer admin router using `adminProcedure` (requires admin or super_admin role).

**SIP Trunk procedures:**
- `dialer.listTrunks` — list all trunks with status
- `dialer.getTrunk` — get single trunk details
- `dialer.createTrunk` — create trunk (validate unique name, proxy format)
- `dialer.updateTrunk` — update trunk
- `dialer.deleteTrunk` — delete (block if DIDs depend on it)

**DID Inventory procedures:**
- `dialer.listDids` — list all DIDs with filters (status, trunk, org)
- `dialer.getDid` — get single DID details
- `dialer.createDid` — add single DID
- `dialer.bulkCreateDids` — bulk import DIDs
- `dialer.assignDid` — assign DID to org
- `dialer.unassignDid` — unassign DID from org
- `dialer.updateDid` — update DID config (routing, recording, etc.)
- `dialer.retireDid` — retire a DID

**Agent Extension procedures:**
- `dialer.listExtensions` — list all extensions
- `dialer.getExtension` — get single extension
- `dialer.createExtension` — create extension
- `dialer.updateExtension` — update extension
- `dialer.deleteExtension` — delete extension

**Server Status procedures:**
- `dialer.getServerStatus` — FreeSWITCH connection info (placeholder until ESL is wired)

**Audit:**
- `dialer.getAuditLog` — list audit entries with filters

**Files to modify:**
- Create: `packages/api/src/routers/admin/dialer.ts`
- Edit: `packages/api/src/routers/admin/index.ts` — merge dialer router into admin router
- OR: `packages/api/src/routers/index.ts` — add as `appRouter.dialer` top-level

---

### Step 3: Frontend — Sidebar Navigation

Add "Dialer" section to platform admin sidebar with 4 nav items.

**File:** `apps/web/src/components/platform/sidebar/nav-main.tsx`

Add items:
```
─ Dialer (section label)
  ├── SIP Trunks       → /platform/dashboard/dialer/trunks
  ├── DID Inventory     → /platform/dashboard/dialer/dids
  ├── Agent Extensions  → /platform/dashboard/dialer/extensions
  └── Server Status     → /platform/dashboard/dialer/status
```

---

### Step 4: Frontend — Route Files

Create route files following existing pattern (TanStack Router file-based routing):

```
apps/web/src/routes/(authenticated)/platform/dashboard/dialer/
├── trunks/
│   └── index.tsx          — SIP Trunks list page
├── dids/
│   └── index.tsx          — DID Inventory page
├── extensions/
│   └── index.tsx          — Agent Extensions page
└── status/
    └── index.tsx          — Server Status page
```

Each route follows the existing pattern:
- `createFileRoute(...)` with search params
- `<Suspense fallback={<Fallback />}>` wrapper
- Delegates to component

---

### Step 5: Frontend — Components

```
apps/web/src/components/platform/dialer/
├── trunks/
│   ├── trunks-table.tsx           — List table with status badges, actions
│   └── trunk-form-dialog.tsx      — Create/Edit dialog with form
├── dids/
│   ├── dids-table.tsx             — List with filters (status, trunk, org)
│   ├── did-form-dialog.tsx        — Add single DID dialog
│   ├── did-bulk-import-dialog.tsx — CSV bulk import dialog
│   └── did-assign-dialog.tsx      — Assign to org dialog
├── extensions/
│   ├── extensions-table.tsx       — List with org assignment
│   └── extension-form-dialog.tsx  — Create/Edit dialog
└── status/
    └── server-status-card.tsx     — FreeSWITCH status display
```

**UI patterns (matching existing codebase):**
- `useSuspenseQuery` + `queryUtils.admin.dialer.*` for data fetching
- `useMutation` for mutations with `onSuccess: () => refetch()`
- `Dialog` from shadcn/ui for create/edit forms
- `useAppForm` (TanStack Form) for form state with Zod validation
- `Table` components for list views
- `Badge` for status indicators
- `toast` (sonner) for success/error feedback
- Search/filter with debounced navigation

---

### Step 6: Server Status Page (Placeholder)

For now, display:
- VPS IP: `135.181.31.20`
- Connection status: "Pending ESL integration"
- List of configured trunks with deployment status from DB
- List of configured extensions with deployment status from DB
- Note: "Live status monitoring will be available after SIP Worker integration (Phase 2)"

This becomes functional once the SIP Worker with ESL is implemented.

---

## Execution Order

1. **DB Schema** — `dialer.ts` + export + generate migration
2. **API Router** — SIP Trunk CRUD first (smallest surface, validates pattern)
3. **Frontend Sidebar** — Add nav items
4. **Frontend SIP Trunks** — Route + table + form dialog (end-to-end for one feature)
5. **API + Frontend DID Inventory** — Build on trunk pattern
6. **API + Frontend Agent Extensions** — Build on same pattern
7. **Server Status page** — Placeholder UI
8. **Audit Log** — Woven into each mutation, viewable page last

---

## Key Existing Patterns to Reuse

| What | Where |
|------|-------|
| Admin procedure guard | `packages/api/src/index.ts` → `adminProcedure` |
| Router structure | `packages/api/src/routers/admin/index.ts` |
| Route context (adminRole) | `Route.useRouteContext()` |
| Data fetching | `useSuspenseQuery(queryUtils.admin.*.queryOptions({...}))` |
| Mutations | `useMutation(queryUtils.admin.*.mutationOptions({...}))` |
| Form system | `useAppForm` from `@/components/ui/form/hooks` |
| Table components | `@/components/ui/table` |
| Dialog | `@/components/ui/dialog` |
| Badges | `@/components/ui/badge` |
| Empty states | `@/components/ui/empty` |
| Search input | `@/components/ui/input-group` |
| Toasts | `sonner` → `toast` |
| DB client | `@work-holo/db` → `db` |
| ID generation | `@paralleldrive/cuid2` → `createId()` |
| Icons | `@tabler/icons-react` |

---

## Verification

1. **Schema:** Run `bun run db:generate` + `bun run db:push` — tables created
2. **API:** Start dev server, verify admin endpoints return data via curl/browser
3. **UI:** Navigate to `/platform/dashboard/dialer/trunks` — see empty state
4. **CRUD:** Create a SIP trunk → appears in table → edit → delete
5. **DIDs:** Add DID → assign to org → verify in table
6. **Extensions:** Create extension → verify in table
7. **Audit:** All mutations create audit log entries
