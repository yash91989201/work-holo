# Organization Data Isolation (Multi-tenant) — Implementation Plan

## Summary
We will enforce strict multi-tenant isolation using:
- Better Auth Organizations (`member` table for org membership + org-level role)
- Active org scoping via `session.activeOrganizationId`
- Private channels: users only see channels they are members of (for **both** listing and content)
- Electric shapes hardened with server-side `where` filters (no client-side security assumptions)
- Electric shapes scoped to **active org only** (not all orgs user belongs to)

Platform admins (`user.role === "admin"`) can access **platform dashboard routes only** and do **not** bypass org/channel checks in normal app routes.

---

## Goals
- No cross-org access via API or Electric sync.
- No cross-channel access (private channels): only channel members can see/sync channel and channel-scoped rows.
- If `activeOrganizationId` is `null` for an org-scoped procedure => return **401**.
- Org-scoped handlers can assume `ctx.orgId` exists (no repeating orgId checks in each handler).
- Channel membership is required for **listing channels** and **accessing channel content**.

## Non-goals
- Modifying Better Auth tables in `packages/db/src/schema/auth.ts`.

---

# Backend Changes

## 1) `packages/api`: Procedures + Context

### 1.1 Replace current procedures with org-aware ones
Current file:
- `packages/api/src/index.ts` defines `protectedProcedure` and an unsafe `requireAdmin` (checks membership by `userId` only).

Create these procedures (minimal, no RBAC system):
1. `protectedProcedure`
   - Requires authenticated session.

2. `orgProcedure`
   - Extends `protectedProcedure`.
   - Requires `session.session.activeOrganizationId` exists.
   - If missing => `ORPCError("UNAUTHORIZED")`.
   - Inject `ctx.orgId = activeOrganizationId`.

3. `orgMemberProcedure`
   - Extends `orgProcedure`.
   - Requires membership row exists for `(ctx.orgId, ctx.session.user.id)`.
   - Inject `ctx.orgMembership = { memberId, role }`.

4. `orgAdminProcedure`
   - Extends `orgMemberProcedure`.
   - Requires `ctx.orgMembership.role` in `("admin","owner")`.

5. `platformAdminProcedure`
   - Extends `protectedProcedure`.
   - Requires `ctx.session.user.role === "admin"`.
   - Used **only** for platform dashboard routes.
   - **Cannot access any org data.**

### 1.2 Ensure orgId is always available in handlers
Rule:
- Any org-scoped router must use `orgMemberProcedure` (or `orgAdminProcedure`) so handlers can safely access `ctx.orgId`.

---

## 2) `packages/api`: Remove `orgId` from inputs (org-scoped endpoints)

### 2.1 Presence router
File:
- `packages/api/src/routers/member/presence.ts`

Changes:
- `heartbeat`: remove `orgId` from input; use `ctx.orgId`
- `setManualStatus`: remove `orgId` from input; use `ctx.orgId`
- `getOrgPresence`: remove `orgId` from input; use `ctx.orgId`
- All presence endpoints should be on `orgMemberProcedure` (at minimum).

---

### 2.2 Attendance router
File:
- `packages/api/src/routers/member/attendance.ts`

Changes:
- `getToday`: remove `orgId` from input; use `ctx.orgId`
- Ensure it uses `orgMemberProcedure` so `ctx.orgId` exists and membership is verified.

---

## 3) `packages/api`: Private channels enforcement (API)
Any endpoint that accepts `channelId` / `messageId` (or related IDs) must enforce:

1. Resolve channel (or via join from message -> channel) and confirm:
   - `channel.organizationId === ctx.orgId`
2. Confirm user is a member of that channel:
   - `channelMember` exists for `(channelId, ctx.session.user.id)`
3. Only then allow read/write.

Apply to:
- `packages/api/src/routers/communication/channel.ts`
- `packages/api/src/routers/communication/message.ts`
- Any other routers that touch channel/message-scoped tables.

---

## 4) `packages/api`: Electric shapes hardening

### 4.1 Enable Electric subqueries
Set environment variable (dev):
- `ELECTRIC_FEATURE_FLAGS=allow_subqueries,tagged_subqueries`

### 4.2 Shape endpoints must be org-scoped and channel-scoped
File:
- `packages/api/src/routers/electric/index.ts`

Rules:
- Require auth for all shapes (already present).
- For org-scoped shapes, require `activeOrganizationId` exists; otherwise **401**.
- Every shape must set a server-side `where` filter that enforces:
  - active org (`ctx.orgId`)
  - and private channels (viewer must be a channel member), where applicable.

Canonical "visible channels" subquery:
- `SELECT "channelId" FROM "channelMember" WHERE "userId" = '{userId}'`

Recommended filters:

- `channels`
  - `"organizationId" = '{orgId}' AND id IN (SELECT "channelId" FROM "channelMember" WHERE "userId" = '{userId}')`

- `channel-members`
  - `"channelId" IN (SELECT id FROM channel WHERE "organizationId" = '{orgId}' AND id IN (SELECT "channelId" FROM "channelMember" WHERE "userId" = '{userId}'))`

- `channel-join-requests`
  - same as `channel-members`

- `messages`
  - `"channelId" IN (SELECT id FROM channel WHERE "organizationId" = '{orgId}' AND id IN (SELECT "channelId" FROM "channelMember" WHERE "userId" = '{userId}'))`

- `attachments`, `messageMention`, `messageReaction`
  - `"messageId" IN (
      SELECT id FROM message WHERE "channelId" IN (
        SELECT id FROM channel
        WHERE "organizationId" = '{orgId}'
          AND id IN (SELECT "channelId" FROM "channelMember" WHERE "userId" = '{userId}')
      )
    )`

- `users`
  - `id IN (SELECT "userId" FROM member WHERE "organizationId" = '{orgId}')`

- `attendance`
  - `"userId" = '{userId}' AND "organizationId" = '{orgId}'`

- `notifications`
  - `"userId" = '{userId}'` (and once `organizationId` exists on notifications, also filter by orgId)

Keep existing correct user-scoped filters:
- `accounts`: `"userId" = '{userId}'`
- `sessions`: `"userId" = '{userId}'`
- `verifications`: `"userId" = '{userId}'`
- `organizations`: `id IN (SELECT "organizationId" FROM member WHERE "userId" = '{userId}')`

Also remove any "no server-side filtering" exceptions (e.g. `message-read-summary`, watermark), replacing them with safe filters now that subqueries are enabled.

---

# Database Changes

## 5) `packages/db`: Add `organizationId` to all non-auth domain tables + indexes
Do not touch:
- `packages/db/src/schema/auth.ts`

For all other schema files (attendance, communication, notifications, storage, etc.):
- Add `organizationId` (FK references `organization.id`)
- Add indexes:
  - Always: `(organizationId)`
  - Add composites based on table usage patterns:
    - `(organizationId, userId)`
    - `(organizationId, channelId)`
    - `(organizationId, createdAt)` where timeline queries exist
    - message-heavy tables: `(organizationId, channelId, createdAt)`

---

# Backend — Exact Endpoint Mapping

## `packages/api/src/index.ts`
**Action:** Add new procedures
- `orgProcedure`
- `orgMemberProcedure`
- `orgAdminProcedure`
- `platformAdminProcedure`

---

## `packages/api/src/routers/member/presence.ts`
**Endpoints:**
| Endpoint | Current | Target Procedure | Input Changes |
|----------|---------|------------------|---------------|
| `heartbeat` | `protectedProcedure` | `orgMemberProcedure` | Remove `orgId`; use `ctx.orgId` |
| `setManualStatus` | `protectedProcedure` | `orgMemberProcedure` | Remove `orgId`; use `ctx.orgId` |
| `getOrgPresence` | `protectedProcedure` | `orgMemberProcedure` | Remove `orgId`; use `ctx.orgId` |

---

## `packages/api/src/routers/member/attendance.ts`
**Endpoints:**
| Endpoint | Current | Target Procedure | Input Changes |
|----------|---------|------------------|---------------|
| `punchIn` | `protectedProcedure` | `orgMemberProcedure` | Already uses session; verify `ctx.orgId` |
| `punchOut` | `protectedProcedure` | `orgMemberProcedure` | Already uses session; verify `ctx.orgId` |
| `getStatus` | `protectedProcedure` | `orgMemberProcedure` | Already uses session; verify `ctx.orgId` |
| `addBreakDuration` | `protectedProcedure` | `orgMemberProcedure` | No change |
| `getToday` | `protectedProcedure` | `orgMemberProcedure` | **Remove `orgId` from input**; use `ctx.orgId` |
| `getAnalytics` | `protectedProcedure` | `orgMemberProcedure` | Already uses session; verify `ctx.orgId` |

---

## `packages/api/src/routers/admin/attendance.ts`
**Endpoints:**
| Endpoint | Current | Target Procedure |
|----------|---------|------------------|
| `getAttendanceStats` | `protectedProcedure` | `orgAdminProcedure` |
| `listAttendanceRecords` | `protectedProcedure` | `orgAdminProcedure` |
| `getAttendanceDetail` | `protectedProcedure` | `orgAdminProcedure` |

---

## `packages/api/src/routers/admin/member.ts`
**Endpoints:**
| Endpoint | Current | Target Procedure |
|----------|---------|------------------|
| `listMembers` | `protectedProcedure` | `orgAdminProcedure` |

---

## `packages/api/src/routers/admin/team.ts`
**Endpoints:**
| Endpoint | Current | Target Procedure |
|----------|---------|------------------|
| `listTeams` | `protectedProcedure` | `orgAdminProcedure` |
| `addMember` | `protectedProcedure` | `orgAdminProcedure` |
| `removeMember` | `protectedProcedure` | `orgAdminProcedure` |

---

## `packages/api/src/routers/admin/invitation.ts`
**Endpoints:**
| Endpoint | Current | Target Procedure |
|----------|---------|------------------|
| `listInvitations` | `protectedProcedure` | `orgAdminProcedure` |

---

## `packages/api/src/routers/admin/dashboard.ts`
**Endpoints:**
| Endpoint | Current | Target Procedure | Notes |
|----------|---------|------------------|-------|
| `getMemberCount` | `protectedProcedure` | `platformAdminProcedure` | Platform dashboard only |
| `getTeamCount` | `protectedProcedure` | `platformAdminProcedure` | Platform dashboard only |

---

## `packages/api/src/routers/communication/channel.ts`
**Endpoints:**
| Endpoint | Current | Target Procedure | Additional Enforcement |
|----------|---------|------------------|------------------------|
| `create` | `protectedProcedure` | `orgMemberProcedure` | Set `organizationId = ctx.orgId` |
| `update` | `protectedProcedure` | `orgMemberProcedure` | Verify org + channel membership |
| `get` | `protectedProcedure` | `orgMemberProcedure` | Verify org + channel membership |
| `list` | `protectedProcedure` | `orgMemberProcedure` | **Return only channels user is member of** |
| `listMembers` | `protectedProcedure` | `orgMemberProcedure` | Verify org + channel membership |
| `isMember` | `protectedProcedure` | `orgMemberProcedure` | Verify org match |
| `addMembers` | `protectedProcedure` | `orgAdminProcedure` | Verify org + channel membership |
| `removeMembers` | `protectedProcedure` | `orgAdminProcedure` | Verify org + channel membership |
| `joinRequest` | `protectedProcedure` | `orgMemberProcedure` | Verify org match |
| `listJoinRequests` | `protectedProcedure` | `orgAdminProcedure` | Verify org + channel membership |
| `delete` | `protectedProcedure` | `orgAdminProcedure` | Verify org + channel membership |

---

## `packages/api/src/routers/communication/message.ts`
**All endpoints require:** `orgMemberProcedure` + org match + channel membership

| Endpoint | Additional Notes |
|----------|------------------|
| `searchUsers` | Resolve channel → verify org + membership |
| `create` | Resolve channel → verify org + membership |
| `update` | Resolve message → channel → verify org + membership |
| `getChannelMessages` | Resolve channel → verify org + membership |
| `delete` | Resolve message → channel → verify org + membership |
| `getUnreadCount` | Resolve channel → verify org + membership |
| `search` | Scope to user's channels in active org |
| `get` | Resolve message → channel → verify org + membership |
| `getParent` | Resolve message → channel → verify org + membership |
| `pin` | Resolve message → channel → verify org + membership |
| `unPin` | Resolve message → channel → verify org + membership |
| `getPinnedMessages` | Resolve channel → verify org + membership |
| `getMentionUsers` | Scope to active org |
| `markMentionSeen` | Verify mention belongs to user |
| `markAllMentionsSeen` | Scope to active org |
| `addReaction` | Resolve message → channel → verify org + membership |
| `removeReaction` | Resolve message → channel → verify org + membership |
| `markMessagesAsRead` | Resolve channel → verify org + membership |
| `getAllMessageReaders` | Resolve message → channel → verify org + membership |

---

## `packages/api/src/routers/electric/index.ts`
**Shapes to harden:**

| Shape | Current Filter | Required Filter |
|-------|----------------|-----------------|
| `messages` | **None** | org + channel membership subquery |
| `message-mentions` | **None** | org + channel membership subquery (via message) |
| `message-reactions` | **None** | org + channel membership subquery (via message) |
| `attachments` | **None** | org + channel membership subquery (via message) |
| `users` | **None** | `id IN (SELECT "userId" FROM member WHERE "organizationId" = '{orgId}')` |
| `channel-members` | **None** | org + channel membership subquery |
| `channel-join-requests` | **None** | org + channel membership subquery |
| `channels` | `"organizationId" = '{orgId}'` | Add channel membership check |
| `members` | `"organizationId" = '{orgId}'` | ✅ OK |
| `teams` | `"organizationId" = '{orgId}'` | ✅ OK |
| `team-members` | Subquery via team | ✅ OK |
| `invitations` | `"organizationId" = '{orgId}'` | ✅ OK |
| `attendance` | `"organizationId" = '{orgId}'` | Add `"userId" = '{userId}'` |
| `notifications` | `"userId" = '{userId}'` | ✅ OK (add orgId later) |
| `accounts` | `"userId" = '{userId}'` | ✅ OK |
| `sessions` | `"userId" = '{userId}'` | ✅ OK |
| `verifications` | `"userId" = '{userId}'` | ✅ OK |
| `organizations` | User's orgs subquery | ✅ OK |
| `message-read` | `"userId" = '{userId}'` | ✅ OK |
| `channel-read` | `"userId" = '{userId}'` | ✅ OK |
| `message-read-summary` | **None** | Add org + channel membership subquery |
| `channel-read-processed-watermark` | **None** | Add org + channel membership subquery |
| `push-subscriptions` | `"userId" = '{userId}'` | ✅ OK |

**All shapes must require `activeOrganizationId` for org-scoped data; return 401 if missing.**

---

# Frontend Changes (`apps/web`)

## 6) Remove `orgId` from API calls (presence + any org-scoped calls)
Files found:
- `apps/web/src/hooks/use-presence.ts`
- `apps/web/src/components/sidebar/nav-quick-actions.tsx`

Changes:
- `heartbeat`: stop sending `{ orgId: organization.id, ... }` → send only presence payload
- `getOrgPresence`: stop sending `{ orgId }` input; query should be inputless (enabled still depends on having an active org)
- `setManualStatus`: stop sending `{ orgId, status }` → send `{ status }`
- Update any query keys/refetches that previously included orgId input.

## 7) Electric collections (`apps/web/src/db/collections.ts`)
No structural changes required if server keeps same shape URLs:
- `/electric/shapes/messages`, `/channels`, `/channel-members`, etc.

Expected behavior change after backend hardening:
- collections will contain only org + channel-member-scoped rows
- downstream hooks should continue to work (often with fewer rows and better safety)

## 8) Active org UX handling
Because org-scoped procedures will return **401** when `activeOrganizationId` is missing:
- Ensure UI paths handle `useActiveOrganization()` returning `null` (redirect to org selection/creation)
- Avoid runtime throws in hooks when org is missing (e.g. `useUserChannels` currently throws `"No active organization"`)

---

# Frontend — Exact File Mapping

## `apps/web/src/hooks/use-presence.ts`
**Changes:**
- Remove `orgId` from `heartbeat` mutation input
- Remove `orgId` from `getOrgPresence` query input
- Remove `orgId` from `setManualStatus` mutation input
- Update query keys if they include orgId

## `apps/web/src/components/sidebar/nav-quick-actions.tsx`
**Changes:**
- Remove `orgId` from any presence-related calls

## `apps/web/src/hooks/communications/use-user-channels.ts`
**Changes:**
- Remove hard throw when org is null
- Return empty array or handle gracefully

## `apps/web/src/hooks/use-attendance.ts`
**Changes:**
- Remove `orgId` from `getToday` input if present
- Update query keys

---

# Verification Checklist

## 9) Manual validation scenarios
1. User belongs to Org A + Org B, with different channels in each:
   - With active org = A:
     - API cannot access Org B resources (even by ID)
     - Electric does not replicate Org B rows
2. Within Org A, user is not a member of Channel X:
   - Cannot list Channel X
   - Cannot sync/read Channel X messages via API or Electric
3. Platform admin:
   - Can access platform dashboard routes
   - Cannot bypass org/channel checks in normal app routes
   - Cannot access org data without being a member
4. Active org null:
   - Org-scoped API routes return 401
   - UI redirects to org selection/creation
   - No crashes in hooks

## 10) Automated tests (recommended)
- Unit tests for each procedure middleware (org, member, admin checks)
- Integration tests for Electric shape filters
- E2E tests for cross-org access attempts

---

# Implementation Order

## Phase 1 — Core Auth Context & Procedures
1. `packages/api/src/index.ts` — Add new procedures
2. `packages/api/src/context.ts` — Extend context types

## Phase 2 — Org-Scoped Routers
3. `packages/api/src/routers/member/presence.ts`
4. `packages/api/src/routers/member/attendance.ts`
5. `packages/api/src/routers/admin/attendance.ts`
6. `packages/api/src/routers/admin/member.ts`
7. `packages/api/src/routers/admin/team.ts`
8. `packages/api/src/routers/admin/invitation.ts`
9. `packages/api/src/routers/admin/dashboard.ts`

## Phase 3 — Channel & Message Security
10. `packages/api/src/routers/communication/channel.ts`
11. `packages/api/src/routers/communication/message.ts`

## Phase 4 — Electric Shapes
12. `packages/api/src/routers/electric/index.ts`
13. Environment: `ELECTRIC_FEATURE_FLAGS=allow_subqueries,tagged_subqueries`

## Phase 5 — Database Schema
14. Audit `packages/db/src/schema/*` for missing `organizationId`
15. Add indexes
16. Generate migration / db push

## Phase 6 — Frontend
17. `apps/web/src/hooks/use-presence.ts`
18. `apps/web/src/components/sidebar/nav-quick-actions.tsx`
19. `apps/web/src/hooks/communications/use-user-channels.ts`
20. `apps/web/src/hooks/use-attendance.ts`
21. Handle active org null UX

## Phase 7 — Validation
22. Manual testing per checklist
23. Add automated tests
