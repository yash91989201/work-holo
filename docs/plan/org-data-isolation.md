# Organization Data Isolation (Multi-tenant) — Implementation Plan

## Summary
We will enforce strict multi-tenant isolation using:
- Better Auth Organizations (`member` table for org membership + org-level role)
- Active org scoping via `session.activeOrganizationId`
- Private channels: users only see channels they are members of
- Electric shapes hardened with server-side `where` filters (no client-side security assumptions)

Platform admins (`user.role === "admin"`) can access **platform dashboard routes only** and do **not** bypass org/channel checks in normal app routes.

---

## Goals
- No cross-org access via API or Electric sync.
- No cross-channel access (private channels): only channel members can see/sync channel and channel-scoped rows.
- If `activeOrganizationId` is `null` for an org-scoped procedure => return **401**.
- Org-scoped handlers can assume `ctx.orgId` exists (no repeating orgId checks in each handler).

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
   - Used only for platform dashboard routes.

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

# Verification Checklist

## 9) Manual validation scenarios
1. User belongs to Org A + Org B, with different channels in each:
   - With active org = A:
     - API cannot access Org B resources (even by ID)
     - Electric does not replicate Org B rows
2. Within Org A, user is not a member of Channel X:
   - cannot sync/read Channel X messages via API or Electric
3. Platform admin:
   - can access platform dashboard routes
   - cannot bypass org/channel checks in normal app routes
