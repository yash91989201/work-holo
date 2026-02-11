# @work-holo/permission — Deep Architecture Reference

This document describes every layer, data structure, file, flow, and relationship in the `@work-holo/permission` package. It is designed to be consumed by an AI or human to produce interactive architecture diagrams.

---

## 1. Package Purpose

`@work-holo/permission` is a **multi-layered RBAC authorization system** for a multi-tenant SaaS application. It provides:

- A **type-safe DSL** for constructing permission descriptors
- A **three-tier authorization pipeline**: Redis decision cache -> hex bitset pre-filter -> Casbin policy engine
- **Policy compilation** from DB role/override state into Casbin rules
- **Permission map introspection** for frontend hydration
- **Audit logging and real-time notifications** via EventEmitter + Pusher
- **Redis-backed cross-process policy versioning**

The system is domain-aware (multi-org, multi-team) and supports owner-bypass semantics.

---

## 2. High-Level Architecture Overview

### 2.1 The Two Main Flows

There are exactly **two major runtime flows**:

**Flow A: Authorization Check (read path)**
```
API Handler
  -> PermissionService.check() / can() / checkByKey() / canByKey()
    -> authorizeDescriptor()
      -> authorizeWithOwnerBypass()  [if ownerId provided]
        -> owner check (userId === ownerId? -> immediate allow)
      -> authorize()
        -> [Layer 1] getCachedDecision() from Redis
        -> [Layer 2] getOrCompileBitset() + checkBit()
        -> [Layer 3] Casbin enforcer.enforce()
        -> setCachedDecision() to Redis
    -> if denied && enforceMode -> throw FORBIDDEN
```

**Flow B: Policy Mutation (write path)**
```
Admin Operation (assignRole / revokeRole / createPolicyOverride / removePolicyOverride)
  -> Write change to DB (role_assignment / policy_override tables)
  -> compilePolicies(orgId)
    -> Fetch role assignments, role permissions (batched), policy overrides
    -> Compile into Casbin p-rules (policies) and g-rules (grouping)
    -> Within a single DB transaction:
      -> Delete all existing Casbin rules for this org domain
      -> Insert all new rules
    -> Increment policy version in Redis (policy_version:<orgId>)
    -> Reload Casbin enforcer from DB
  -> Invalidate caches for affected user:
    -> invalidateUserCache (decision cache)
    -> invalidateBitset
    -> invalidatePermissionMap
  -> Emit PermissionEvent to bus
    -> writeAuditLog to permission_audit_log table
    -> broadcastToOrg via Pusher (private-org-<orgId>)
    -> notifyUser via Pusher (private-user-<userId>)
```

### 2.2 System Components Map

```
+-------------------------------------------------------------------+
|                     @work-holo/permission                         |
+-------------------------------------------------------------------+
|                                                                   |
|  src/                                                             |
|  +-- types.ts               Core TypeScript types & constants     |
|  +-- bitset.ts              checkBit() utility (frontend-safe)    |
|  +-- index.ts               Public barrel (frontend-safe exports) |
|  |                                                                |
|  +-- dsl/                   Permission Descriptor Builders        |
|  |   +-- vocabulary.ts      Master permission registry (59 perms) |
|  |   +-- org.ts             Org-scoped DSL factory                |
|  |   +-- team.ts            Team-scoped DSL factory               |
|  |   +-- channel.ts         Channel DSL factory                   |
|  |   +-- message.ts         Message DSL factory                   |
|  |   +-- attendance.ts      Attendance DSL factory                |
|  |   +-- module.ts          Module DSL factory                    |
|  |                                                                |
|  +-- server/                Server-only runtime                   |
|      +-- index.ts           Server barrel export                  |
|      +-- config.ts          Runtime config (db, redis, pusher)    |
|      +-- model.conf         Casbin RBAC model definition          |
|      +-- enforcer.ts        Casbin enforcer singleton + versions  |
|      +-- authorize.ts       Core 3-layer decision engine          |
|      +-- decisionCache.ts   Redis per-decision cache              |
|      +-- bitsetCompiler.ts  Per-user hex bitset compiler + cache  |
|      +-- policyCompiler.ts  DB -> Casbin rule compiler            |
|      +-- introspection.ts   Full permission map builder           |
|      +-- permission.service.ts  Main API class for app code       |
|      +-- sync/                                                    |
|          +-- bus.ts          Typed EventEmitter singleton          |
|          +-- emitter.ts      Audit log + Pusher side effects      |
+-------------------------------------------------------------------+
```

---

## 3. Data Model (Database Tables)

All authorization tables are defined in `packages/db/src/schema/authorization.ts`.

### 3.1 Entity Relationship Diagram Data

```
permission_node (59 rows — one per vocabulary entry)
  - id: cuid2 PK
  - key: text UNIQUE          e.g. "channel.member.add"
  - resource: text             e.g. "channel"
  - subResource: text          e.g. "member"
  - action: text               e.g. "add"
  - description: text
  - bitIndex: integer UNIQUE   e.g. 49 (stable, append-only)
  Relations: -> many role_permission, many policy_override

role_template (5 system rows + custom per-org)
  - id: cuid2 PK
  - name: text                 e.g. "org_owner", "team_member"
  - displayName: text          e.g. "Organization Owner"
  - description: text
  - scope: enum("org","team")
  - isSystem: boolean          true for the 5 built-in roles
  - organizationId: text FK -> organization (null for system roles)
  Relations: -> many role_permission, many role_assignment

role_permission (join table: which permissions each role template has)
  - id: cuid2 PK
  - roleTemplateId: text FK -> role_template
  - permissionNodeId: text FK -> permission_node
  - effect: text               "allow" or "deny"
  - conditions: text           reserved for future ABAC conditions
  UNIQUE(roleTemplateId, permissionNodeId)
  Relations: -> one role_template, one permission_node

role_assignment (which users have which roles, scoped to org+team)
  - id: cuid2 PK
  - userId: text FK -> user
  - roleTemplateId: text FK -> role_template
  - organizationId: text FK -> organization
  - teamId: text FK -> team (nullable, for team-scoped roles)
  - assignedBy: text FK -> user
  - assignedAt: timestamp
  UNIQUE(userId, roleTemplateId, organizationId, teamId)
  Relations: -> one user, one role_template, one organization, one team

policy_override (per-user permission exceptions)
  - id: cuid2 PK
  - userId: text FK -> user
  - permissionNodeId: text FK -> permission_node
  - organizationId: text FK -> organization
  - teamId: text FK -> team (nullable)
  - resourceId: text (nullable, for resource-specific overrides)
  - effect: text               "allow" or "deny"
  - reason: text
  - expiresAt: timestamp (nullable, for time-limited overrides)
  - createdBy: text FK -> user
  Relations: -> one user, one permission_node, one organization, one team

policy_version (tracks compilation history per org)
  - id: cuid2 PK
  - organizationId: text FK -> organization
  - version: integer           monotonically increasing per org
  - compiledAt: timestamp
  - compiledBy: text
  - status: text               "pending" | "compiling" | "compiled" | "error"
  - errorMessage: text
  UNIQUE(organizationId, version)
  Relations: -> one organization, many permission_snapshot

permission_snapshot (cached permission maps per user per org)
  - id: cuid2 PK
  - userId: text FK -> user
  - organizationId: text FK -> organization
  - policyVersionId: text FK -> policy_version
  - bitset: text               hex-encoded bitset string
  - permissionMap: text        JSON string of PermissionMap
  - computedAt: timestamp
  UNIQUE(userId, organizationId)

permission_audit_log (immutable audit trail)
  - id: cuid2 PK
  - organizationId: text FK -> organization
  - actorId: text
  - action: text               event type string
  - targetUserId: text
  - targetRoleId: text
  - targetPermissionId: text
  - details: text              JSON payload
  - createdAt: timestamp

casbin_rule (Casbin adapter table — compiled policy rules)
  - id: integer PK auto-increment
  - ptype: text                "p" (policy) or "g" (grouping)
  - v0: text                   sub (userId or role name)
  - v1: text                   dom (e.g. "org:<orgId>") or role (for g-rules)
  - v2: text                   obj (e.g. "channel:member") or domain (for g-rules)
  - v3: text                   act (permission key) or empty
  - v4: text                   eft ("allow"/"deny") or empty
  - v5: text                   reserved

team_module_config (which modules are enabled per team)
  - id: cuid2 PK
  - teamId: text FK -> team
  - module: text
  - enabled: boolean
```

### 3.2 Table Relationship Summary

```
user ──1:N──> role_assignment ──N:1──> role_template ──1:N──> role_permission ──N:1──> permission_node
user ──1:N──> policy_override ──N:1──> permission_node
organization ──1:N──> role_assignment
organization ──1:N──> policy_override
organization ──1:N──> policy_version ──1:N──> permission_snapshot
organization ──1:N──> permission_audit_log
organization ──1:N──> role_template (custom roles)
team ──1:N──> role_assignment (team-scoped)
team ──1:N──> policy_override (team-scoped)
```

---

## 4. Permission Vocabulary (59 Entries)

The vocabulary is the **single source of truth** for all permission keys. Defined in `src/dsl/vocabulary.ts`.

### 4.1 Structure of a Vocabulary Entry

```ts
type VocabularyEntry = {
  key: PermissionKey;        // e.g. "channel.member.add"
  resource: AuthResource;    // e.g. "channel"
  subResource: string;       // e.g. "member" (empty string if none)
  action: string;            // e.g. "add"
  bitIndex: number;          // stable integer, append-only, never reorder
  description?: string;
};
```

### 4.2 Complete Permission Table

| bitIndex | key | resource | subResource | action |
|----------|-----|----------|-------------|--------|
| 0 | attendance.record.create | attendance | record | create |
| 1 | attendance.record.delete | attendance | record | delete |
| 2 | attendance.record.list | attendance | record | list |
| 3 | attendance.record.update | attendance | record | update |
| 4 | attendance.record.view | attendance | record | view |
| 5 | channel.create | channel | | create |
| 6 | channel.delete | channel | | delete |
| 49 | channel.member.add | channel | member | add |
| 50 | channel.member.list | channel | member | list |
| 51 | channel.member.remove | channel | member | remove |
| 52 | channel.member.search | channel | member | search |
| 7 | channel.update | channel | | update |
| 8 | channel.view | channel | | view |
| 9 | message.create | message | | create |
| 10 | message.delete | message | | delete |
| 53 | message.list | message | | list |
| 11 | message.mention.channel | message | mention | mention.channel |
| 12 | message.mention.user | message | mention | mention.user |
| 13 | message.pin | message | | pin |
| 54 | message.pin.list | message | pin | list |
| 14 | message.react | message | | react |
| 55 | message.read | message | | read |
| 56 | message.readers.list | message | readers | list |
| 57 | message.search | message | | search |
| 58 | message.unread_count | message | | unread_count |
| 15 | message.update | message | | update |
| 16 | message.view | message | | view |
| 17 | module.access | module | | access |
| 18 | org.context.switch | org | context | switch |
| 19 | org.context.view | org | context | view |
| 20 | org.create | org | | create |
| 21 | org.delete | org | | delete |
| 22 | org.invite.create | org | invite | create |
| 23 | org.invite.delete | org | invite | delete |
| 24 | org.invite.list | org | invite | list |
| 25 | org.invite.resend | org | invite | resend |
| 26 | org.invite.update | org | invite | update |
| 27 | org.invite.view | org | invite | view |
| 28 | org.list | org | | list |
| 29 | org.role.create | org | role | create |
| 30 | org.role.delete | org | role | delete |
| 31 | org.role.list | org | role | list |
| 32 | org.role.update | org | role | update |
| 33 | org.role.view | org | role | view |
| 34 | org.update | org | | update |
| 35 | org.view | org | | view |
| 36 | team.create | team | | create |
| 37 | team.delete | team | | delete |
| 38 | team.member.add | team | member | add |
| 39 | team.member.remove | team | member | remove |
| 40 | team.member.view | team | member | view |
| 41 | team.module.disable | team | module | disable |
| 42 | team.module.enable | team | module | enable |
| 43 | team.role.assign | team | role | assign |
| 44 | team.role.create | team | role | create |
| 45 | team.role.delete | team | role | delete |
| 46 | team.role.update | team | role | update |
| 47 | team.update | team | | update |
| 48 | team.view | team | | view |

**Bitset index stability**: Indices 0-48 are the original permissions. Indices 49-58 are new additions. The next available index is **59**. Indices must never be reordered or reused.

### 4.3 Permissions Grouped by Resource

- **attendance** (5): record.create, record.delete, record.list, record.update, record.view
- **channel** (8): create, delete, update, view, member.add, member.list, member.remove, member.search
- **message** (15): create, delete, list, update, view, react, pin, pin.list, read, search, unread_count, mention.user, mention.channel, readers.list
- **module** (1): access
- **org** (18): create, delete, update, view, list, invite.{create,delete,list,resend,update,view}, role.{create,delete,list,update,view}, context.{view,switch}
- **team** (13): create, delete, update, view, member.{add,remove,view}, role.{assign,create,delete,update}, module.{enable,disable}

---

## 5. DSL Layer — Permission Descriptor Builders

The DSL layer turns vocabulary keys into typed `PermissionDescriptor` objects. Each DSL factory produces a nested object where leaf nodes are functions `(resourceId?) => PermissionDescriptor`.

### 5.1 DSL Factory Types

There are **two categories** of DSL factories:

**Scoped factories** (take a scope ID, prepend it to the `obj` field):
- `Org(orgId)` — prepends `org:<orgId>:` to obj. Used for org-level operations.
- `Team(teamId)` — prepends `team:<teamId>:` to obj. Used for team-level operations.

**Unscoped factories** (no scope prefix on `obj`):
- `Channel()` — for channel operations
- `Message()` — for message operations
- `Attendance()` — for attendance operations
- `Module()` — for module operations

### 5.2 How a Descriptor is Built

Given vocabulary entry `{ key: "channel.member.add", resource: "channel", subResource: "member", action: "add", bitIndex: 49 }`:

Calling `Channel().member.add("ch_123")` produces:
```ts
{
  obj: "channel:member:ch_123",    // resource:subResource:resourceId
  act: "channel.member.add",       // the permission key itself
  permissionKey: "channel.member.add",
  bitIndex: 49
}
```

Calling `Org("org_456").invite.create()` produces:
```ts
{
  obj: "org:org_456:org:invite",   // scope:scopeId:resource:subResource
  act: "org.invite.create",
  permissionKey: "org.invite.create",
  bitIndex: 22
}
```

### 5.3 DSL Tree Structure

```
PermissionService
  .org (OrgDSL, scoped to service.orgId)
  |  .create()  .view()  .update()  .delete()  .list()
  |  .invite.{create, view, update, delete, resend, list}()
  |  .role.{create, view, update, delete, list}()
  |  .context.{view, switch}()
  |
  .team(teamId) (TeamDSL, scoped to teamId)
  |  .create()  .view()  .update()  .delete()
  |  .member.{add, remove, view}()
  |  .role.{create, assign, update, delete}()
  |  .module.{enable, disable}()
  |
  .channel (ChannelDSL, unscoped)
  |  .create()  .view()  .update()  .delete()
  |  .member.{list, add, remove, search}()
  |
  .message (MessageDSL, unscoped)
  |  .create()  .view()  .update()  .delete()
  |  .list()  .search()  .read()  .unread_count()
  |  .react()  .pin()  .pinList()  .readersList()
  |  .mention.{user, channel}()
  |
  .attendance (AttendanceDSL, unscoped)
  |  .record.{create, view, update, delete, list}()
  |
  .module (ModuleDSL, unscoped)
     .access()
```

---

## 6. Authorization Pipeline — The Three-Layer Decision Engine

File: `src/server/authorize.ts`

### 6.1 Detailed Flow with Data Shapes

```
INPUT: AuthorizationRequest {
  userId: string,
  orgId: string,
  teamId?: string,
  permission: PermissionDescriptor {
    obj: string,        // e.g. "channel:member:ch_123"
    act: string,        // e.g. "channel.member.add"
    permissionKey: string,
    bitIndex: number,
    attrs?: { ownerId?: string }
  }
}

STEP 0: Owner Bypass Check
  - If attrs.ownerId is set AND userId === ownerId:
    -> Return { allowed: true, decidedBy: "owner", durationMs: 0 }
  - Otherwise continue to Layer 1

STEP 1: Decision Cache (Redis)
  - Key: "perm:<userId>:<orgId>:<permissionKey>"
  - Read from Redis
  - If found:
    - Compare cached.policyVersion with current policy version from Redis
    - If versions match: return { allowed: cached.allowed, decidedBy: "cache" }
    - If stale: DEL the key, continue to Layer 2
  - If not found: continue to Layer 2

STEP 2: Bitset Pre-filter
  - Get or compile bitset for (userId, orgId):
    a. Check Redis cache "bitset:<userId>:<orgId>"
    b. If stale/miss: compile from DB
       - Fetch all role assignments for user
       - For each role: fetch role_permission rows (allow adds key, deny removes key)
       - Apply policy overrides (allow adds, deny removes, respects expiry)
       - Result: Set<string> of allowed permission keys
       - Convert to Uint8Array bitset using PERMISSION_BY_KEY.bitIndex
       - Encode as hex string
       - Cache in Redis with TTL 600s and current policyVersion
    c. Validate policyVersion matches, evict if stale
  - Call checkBit(hexBitset, permission.bitIndex):
    - byteIndex = floor(bitIndex / 8)
    - bitPosition = bitIndex % 8
    - Parse 2 hex chars at offset byteIndex*2 into byte
    - Check if (byte & (1 << bitPosition)) !== 0
  - If bit is OFF: permission definitely not granted
    -> setCachedDecision(false), return { allowed: false, decidedBy: "bitset" }
  - If bit is ON: permission might be granted, continue to Layer 3

STEP 3: Casbin Policy Engine
  - Get enforcer singleton (lazy init from model.conf + DrizzleAdapter)
  - domain = "org:<orgId>"
  - Call enforcer.enforce(userId, domain, { name: permission.obj, ownerId: attrs.ownerId ?? "" }, permission.act)
  - Casbin model matcher evaluates:
    (r.sub == p.sub || g(r.sub, p.sub, r.dom))   // user match or role match
    && r.dom == p.dom                              // same org domain
    && keyMatch2(r.obj.name, p.obj)                // object path match
    && regexMatch(r.act, p.act)                    // action match
    || r.obj.ownerId == r.sub                      // owner bypass
  - Policy effect: allow if any allow AND no deny
  - setCachedDecision(allowed), return { allowed, decidedBy: "casbin" }

OUTPUT: AuthorizationResult {
  allowed: boolean,
  decidedBy: "owner" | "cache" | "bitset" | "casbin",
  durationMs: number,
  permissionKey: string
}
```

### 6.2 Why Three Layers?

```
Layer       | Speed    | Accuracy  | Purpose
------------|----------|-----------|----------------------------------
Cache       | ~1ms     | Exact     | Avoid recomputation for repeated checks
Bitset      | ~2-5ms   | Over-approx| Fast reject: if bit is off, definitely denied
Casbin      | ~10-50ms | Exact     | Full RBAC evaluation with roles, domains, patterns
```

The bitset is an **over-approximation**: a bit being ON means "might be allowed" (needs Casbin confirmation). A bit being OFF means "definitely denied" (no Casbin call needed). This eliminates expensive Casbin calls for most denial cases.

---

## 7. Casbin Model — RBAC with Domain and Owner Bypass

File: `src/server/model.conf`

### 7.1 Model Definition

```ini
[request_definition]
r = sub, dom, obj, act

[policy_definition]
p = sub, dom, obj, act, eft

[role_definition]
g = _, _, _                    # domain-aware role grouping

[policy_effect]
e = some(where (p.eft == allow)) && !some(where (p.eft == deny))

[matchers]
m = (r.sub == p.sub || g(r.sub, p.sub, r.dom))
    && r.dom == p.dom
    && keyMatch2(r.obj.name, p.obj)
    && regexMatch(r.act, p.act)
    || (r.obj.ownerId == r.sub)
```

### 7.2 Matcher Explanation

The matcher has two branches joined by OR:

**Branch 1 (RBAC check):**
- `r.sub == p.sub` — direct user-to-policy match
- `g(r.sub, p.sub, r.dom)` — role inheritance within the domain
- `r.dom == p.dom` — same organization domain
- `keyMatch2(r.obj.name, p.obj)` — object path pattern matching (supports `:*` wildcards)
- `regexMatch(r.act, p.act)` — action regex matching

**Branch 2 (Owner bypass):**
- `r.obj.ownerId == r.sub` — if the requester IS the owner of the resource, auto-allow

### 7.3 Policy Effect

`some(where (p.eft == allow)) && !some(where (p.eft == deny))`

This means: allow if at least one matching policy says "allow" AND no matching policy says "deny". Deny takes precedence over allow.

### 7.4 Example Casbin Rules (casbin_rule table)

**Policy rules (ptype = "p"):**
```
p, role:org_member, org:org_123, channel, channel.create, allow
p, role:org_member, org:org_123, channel:member, channel.member.list, allow
p, role:team_admin, org:org_123, team:member, team.member.add, allow
p, user_789, org:org_123, message, message.delete, deny    # override: user can't delete messages
```

**Grouping rules (ptype = "g"):**
```
g, user_456, role:org_member, org:org_123         # user_456 has org_member role in org_123
g, user_456, role:team_admin:team:team_789, org:org_123  # user_456 has team_admin role for team_789
```

---

## 8. Policy Compilation — DB State to Casbin Rules

File: `src/server/policyCompiler.ts`

### 8.1 Compilation Pipeline

```
compilePolicies(orgId, compiledBy?)
  |
  +-- getOrCreatePolicyVersion(orgId)
  |     -> INSERT into policy_version with status "compiling"
  |     -> Returns { id, version (monotonic) }
  |
  +-- Parallel fetch:
  |   +-- fetchRoleAssignments(orgId)
  |   |     -> role_assignment JOIN role_template WHERE org = orgId
  |   |     -> Returns: [{ userId, roleTemplateId, organizationId, teamId, roleTemplate: { name, scope } }]
  |   |
  |   +-- fetchRolePermissions(orgId)
  |   |     -> role_template WHERE org = orgId OR (isSystem AND org IS NULL)
  |   |     -> role_permission WHERE roleTemplateId IN (...templateIds)  [single batched query]
  |   |     -> Returns: [{ roleTemplateId, effect, permissionNode: { key, resource, subResource }, roleTemplate: { name, scope } }]
  |   |
  |   +-- fetchPolicyOverrides(orgId)
  |         -> policy_override WHERE org = orgId AND (expiresAt IS NULL OR expiresAt > now)
  |         -> Returns: [{ userId, organizationId, teamId, resourceId, effect, expiresAt, permissionNode: {...} }]
  |
  +-- Compile rules:
  |   +-- compileGroupingPolicies(assignments)
  |   |     -> For each assignment:
  |   |        ptype: "g"
  |   |        user: userId
  |   |        role: "role:<roleName>" or "role:<roleName>:team:<teamId>"
  |   |        domain: "org:<orgId>"
  |   |
  |   +-- compileRolePolicies(permissions, orgId)
  |   |     -> For each role permission:
  |   |        ptype: "p"
  |   |        sub: "role:<roleName>"
  |   |        dom: "org:<orgId>"
  |   |        obj: "<resource>" or "<resource>:<subResource>" or "team:<teamId>:<resource>:<subResource>"
  |   |        act: permission key
  |   |        eft: "allow" or "deny"
  |   |
  |   +-- compileOverridePolicies(overrides)
  |         -> For each non-expired override:
  |            ptype: "p"
  |            sub: userId (direct, not role)
  |            dom: "org:<orgId>"
  |            obj: (includes team scope + resourceId if present)
  |            act: permission key
  |            eft: "allow" or "deny"
  |
  +-- DB Transaction:
  |   +-- DELETE FROM casbin_rule WHERE v1 = "org:<orgId>"  (clear domain)
  |   +-- INSERT all compiled rules
  |
  +-- markVersionComplete(versionId)
  +-- setPolicyVersion(orgId, version) -> writes to Redis "policy_version:<orgId>"
  +-- reloadPolicies() -> enforcer.loadPolicy() from DB
  |
  +-- Return CompilationResult { policies, groupingPolicies, version, compiledAt }
```

### 8.2 Object Path Construction

The `obj` field in Casbin rules uses colon-separated paths:

```
Scope    | Object Path Format                          | Example
---------|---------------------------------------------|---------------------------
org      | <resource>                                  | "channel"
org      | <resource>:<subResource>                    | "channel:member"
team     | team:<teamId>:<resource>:<subResource>      | "team:tm_1:team:member"
override | <resource>:<subResource>:<resourceId>       | "channel:member:ch_123"
```

### 8.3 Role Name Construction

```
Scope | Format                              | Example
------|-------------------------------------|----------------------------
org   | role:<roleName>                     | "role:org_admin"
team  | role:<roleName>:team:<teamId>       | "role:team_admin:team:tm_1"
```

---

## 9. Caching Architecture

### 9.1 Cache Topology

```
+----------------------------+
|         Redis              |
+----------------------------+
| policy_version:<orgId>     |  <- integer, no TTL, source of truth for version
| perm:<user>:<org>:<key>    |  <- CachedDecision JSON, TTL 300s
| bitset:<user>:<org>        |  <- BitsetData JSON, TTL 600s
| perm_map:<user>:<org>      |  <- PermissionMap JSON, TTL 600s
+----------------------------+

+----------------------------+
|    In-Memory (per process) |
+----------------------------+
| localVersionCache Map      |  <- orgId -> version, fast local read
| enforcerPromise            |  <- singleton Casbin enforcer
+----------------------------+

+----------------------------+
|     PostgreSQL             |
+----------------------------+
| permission_snapshot        |  <- persistent permission map backup
| policy_version             |  <- version history with status tracking
+----------------------------+
```

### 9.2 Staleness Detection

Every cached value includes a `policyVersion` field. On read, the current version is fetched from Redis (`policy_version:<orgId>`). If versions don't match, the cached value is evicted and recomputed.

```
Read cached decision:
  1. GET perm:<user>:<org>:<key> from Redis
  2. GET policy_version:<orgId> from Redis
  3. if cached.policyVersion !== currentVersion -> DEL key, return miss
  4. else -> return hit
```

### 9.3 Invalidation Matrix

```
Event                    | Caches Invalidated
-------------------------|--------------------------------------------
Role assigned/revoked    | decision cache (user), bitset (user), permission map (user), then recompile
Policy override changed  | decision cache (user), bitset (user), permission map (user), then recompile
Full recompilation       | decision cache (org-wide), policy version bumped (invalidates all implicitly)
```

---

## 10. Bitset Compiler

File: `src/server/bitsetCompiler.ts`

### 10.1 Compilation Process

```
getUserPermissionKeys(userId, orgId)
  -> Fetch role assignments for user (any org)
  -> For each role template:
     -> Fetch role_permission rows
     -> effect "allow" -> add key to Set
     -> effect "deny" -> remove key from Set
  -> Fetch policy overrides for (userId, orgId), non-expired
  -> effect "allow" -> add key to Set
  -> effect "deny" -> remove key from Set
  -> Return Set<string> of allowed permission keys

compileBitset(userId, orgId)
  -> Get Set<string> of allowed keys
  -> Create Uint8Array of size ceil(TOTAL_PERMISSIONS / 8)
  -> For each allowed key:
     -> Look up bitIndex from PERMISSION_BY_KEY
     -> setBit: bitset[floor(bitIndex/8)] |= (1 << (bitIndex % 8))
  -> Encode as hex string: each byte -> 2 hex chars
  -> Cache in Redis with policyVersion and TTL 600s
  -> Return BitsetData { bitset: hexString, policyVersion, compiledAt }
```

### 10.2 Bitset Layout Example

With 59 permissions, the bitset is `ceil(59/8) = 8 bytes = 16 hex chars`.

```
Byte 0 (bits 0-7):   attendance.record.* (indices 0-4), channel.create(5), channel.delete(6), channel.update(7)
Byte 1 (bits 8-15):  channel.view(8), message.create(9), message.delete(10), message.mention.channel(11), message.mention.user(12), message.pin(13), message.react(14), message.update(15)
Byte 2 (bits 16-23): message.view(16), module.access(17), org.context.switch(18), org.context.view(19), org.create(20), org.delete(21), org.invite.create(22), org.invite.delete(23)
...
Byte 6 (bits 48-55): team.view(48), channel.member.add(49), channel.member.list(50), channel.member.remove(51), channel.member.search(52), message.list(53), message.pin.list(54), message.read(55)
Byte 7 (bits 56-58): message.readers.list(56), message.search(57), message.unread_count(58), [unused 59-63]
```

---

## 11. Permission Map Introspection

File: `src/server/introspection.ts`

### 11.1 Three-Tier Read Strategy

```
buildPermissionMap(userId, orgId)
  |
  +-- [Tier 1] Redis cache: GET perm_map:<user>:<org>
  |   - If found AND policyVersion matches -> return
  |   - If stale -> DEL key
  |
  +-- [Tier 2] DB snapshot: SELECT FROM permission_snapshot WHERE user+org
  |   - If found AND policyVersion matches -> cache in Redis, return
  |
  +-- [Tier 3] Full recompute from Casbin:
      - For each of 59 PERMISSIONS:
        - Build obj = resource[:subResource]
        - enforcer.enforce(userId, "org:<orgId>", { name: obj, ownerId: "" }, key)
      - Build PermissionMap { userId, orgId, policyVersion, permissions: Record<key, boolean>, computedAt }
      - Save to both Redis and DB snapshot
      - Return
```

### 11.2 PermissionMap Shape

```ts
{
  userId: "user_123",
  orgId: "org_456",
  policyVersion: 7,
  permissions: {
    "channel.create": true,
    "channel.delete": false,
    "channel.member.add": true,
    "channel.member.list": true,
    "channel.view": true,
    "message.create": true,
    "message.delete": false,
    // ... all 59 keys
  },
  computedAt: 1707634800000
}
```

---

## 12. PermissionService — The Main API Class

File: `src/server/permission.service.ts`

### 12.1 Class Structure

```
PermissionService
  Constructor: { userId, orgId, db }
  Private state: enforceMode (from CASBIN_ENFORCE env var)

  DSL Accessors (getters):
    .org          -> Org(this.orgId)        : OrgDSL
    .team(id)     -> Team(teamId)           : TeamDSL
    .channel      -> Channel()              : ChannelDSL
    .message      -> Message()              : MessageDSL
    .attendance   -> Attendance()           : AttendanceDSL
    .module       -> Module()               : ModuleDSL

  Authorization Methods:
    .authorizeDescriptor(descriptor, options?)  -> AuthorizationResult
    .check(descriptor, options?)                -> void (throws FORBIDDEN if denied + enforceMode)
    .checkByKey(key, options?)                  -> void
    .can(descriptor, options?)                  -> boolean
    .canByKey(key, options?)                    -> boolean

  Resource Guards:
    .requireChannelAccess(channelId, action)    -> void
      1. Fetch channel from DB, verify org ownership
      2. Verify user is channel member (channelMemberTable)
      3. Build descriptor from action (PermissionAction function or string key)
      4. Run check() with ownerId = channel.createdBy

    .requireMessageAccess(messageId, action)    -> void
      1. Fetch message from DB
      2. requireChannelAccess(message.channelId, action)
      3. Build descriptor from action
      4. Run check() with ownerId = message.senderId

  Introspection:
    .getPermissionMap()                         -> PermissionMap

  Admin Operations:
    .assignRole(targetUserId, roleTemplateId, options?)
    .revokeRole(targetUserId, roleTemplateId, options?)
    .createPolicyOverride(targetUserId, permissionNodeId, effect, options?)
    .removePolicyOverride(overrideId, targetUserId)
    .recompilePolicies()

  Private Helpers:
    .buildDescriptorFromKey(key, options?)       -> PermissionDescriptor
    .recompileAndInvalidate(targetUserId)        -> compilePolicies + invalidate caches
    .emitEvent(event)                            -> emitPermissionEvent()
```

### 12.2 Check vs Can

```
check(descriptor):
  result = authorizeDescriptor(descriptor)
  if !result.allowed && enforceMode:
    throw ORPCError("FORBIDDEN", "Not allowed: <key>")
  // does nothing if allowed, or if enforceMode is off

can(descriptor):
  result = authorizeDescriptor(descriptor)
  return result.allowed    // never throws
```

---

## 13. Event System — Audit & Real-time Notifications

### 13.1 Event Flow

```
PermissionService.emitEvent(event)
  -> emitPermissionEvent(event)                    [sync/emitter.ts]
    -> permissionBus.emit("permission_change", event)  [sync/bus.ts]
      -> handlePermissionChange(event)              [listener registered by initPermissionEmitter()]
        -> writeAuditLog(event)     // INSERT into permission_audit_log (fire-and-forget)
        -> broadcastToOrg(event)    // Pusher: private-org-<orgId> / "permission:change"
        -> notifyUser(event)        // Pusher: private-user-<userId> / "permission:update" (if userId present)
```

### 13.2 Event Types

```ts
type PermissionEventType =
  | "role_assigned"               // triggered by assignRole()
  | "role_revoked"                // triggered by revokeRole()
  | "policy_override_created"     // triggered by createPolicyOverride()
  | "policy_override_removed"     // triggered by removePolicyOverride()
  | "policy_compiled"             // triggered by recompilePolicies()
  | "permission_snapshot_updated" // reserved for future use
```

### 13.3 Event Shape

```ts
type PermissionEvent = {
  type: PermissionEventType;
  orgId: string;
  teamId?: string;
  userId?: string;       // target user (not actor)
  actorId: string;       // who performed the action
  payload: Record<string, unknown>;  // event-specific data
  timestamp: number;     // Date.now()
}
```

---

## 14. System Roles & Default Permissions

### 14.1 The 5 System Roles

```
Role          | Scope | Description
--------------|-------|---------------------------------------------------
org_owner     | org   | ALL 59 permissions
org_admin     | org   | All except org.create and org.delete (57 permissions)
org_member    | org   | Communication + attendance(view/list/create) + basic org/team view
team_admin    | team  | Communication + all attendance + team management + module config
team_member   | team  | Communication + attendance(view/list/create) + basic team view
```

### 14.2 Permission Distribution

```
                        org_owner  org_admin  org_member  team_admin  team_member
attendance.record.*     ALL        ALL        view/list/  ALL         view/list/
                                              create                  create
channel.*               ALL        ALL        ALL         ALL         ALL
message.*               ALL        ALL        ALL         ALL         ALL
module.access           YES        YES        YES         YES         YES
org.*                   ALL        ALL(-2)    view only   -           -
org.context.*           ALL        ALL        YES         -           -
team.*                  ALL        ALL        view only   manage      view only
team.member.*           ALL        ALL        view only   ALL         view only
team.role.*             ALL        ALL        -           -           -
team.module.*           ALL        ALL        -           YES         -
org.invite.*            ALL        ALL        -           -           -
org.role.*              ALL        ALL        -           -           -
```

---

## 15. Initialization & Startup Sequence

```
Application Boot
  |
  +-- initPermission({ db, getRedisClient, pusher? })
  |     Sets global config singleton used by all server modules.
  |     MUST be called before any authorization check.
  |
  +-- initPermissionEmitter()
  |     Registers permission_change listener on the EventEmitter bus.
  |     Enables audit logging and Pusher notifications.
  |     Call once. Idempotent (has initialized guard).
  |
  +-- [Lazy] First authorization check triggers:
        getCasbinEnforcer()
          -> Creates DrizzleAdapter from casbin_rule table
          -> newEnforcer(model.conf, adapter)
          -> enforcer.loadPolicy()
          -> Cached as singleton promise
```

---

## 16. Cross-Process Synchronization

### 16.1 The Problem

In multi-process deployments (e.g., multiple server instances behind a load balancer), each process has its own in-memory Casbin enforcer and local caches. When Process A compiles new policies, Process B doesn't know about the version change.

### 16.2 The Solution

Policy version is stored in Redis (`policy_version:<orgId>`), making it the cross-process source of truth. Every cache read validates against this Redis key. If the local cache's version doesn't match Redis, it's evicted.

```
Process A (writes):
  compilePolicies() -> setPolicyVersion(orgId, 7) -> Redis SET policy_version:org_123 = 7

Process B (reads):
  getCachedDecision() -> cached.policyVersion = 6
  getPolicyVersion(orgId) -> Redis GET policy_version:org_123 = 7
  6 !== 7 -> evict cache, recompute
```

Each process also keeps a `localVersionCache` Map as a fast local cache to avoid Redis reads on every check. This local cache is updated whenever Redis is read.

---

## 17. File Dependency Graph

```
types.ts ───────────────────────────────────────────────────┐
  ^                                                         |
  |                                                         |
bitset.ts                                                   |
  ^                                                         |
  |                                                         |
dsl/vocabulary.ts ─────────────────────────────────────┐    |
  ^  ^  ^  ^  ^  ^                                     |    |
  |  |  |  |  |  |                                     |    |
  |  |  |  |  |  dsl/module.ts                         |    |
  |  |  |  |  dsl/attendance.ts                        |    |
  |  |  |  dsl/message.ts                              |    |
  |  |  dsl/channel.ts                                 |    |
  |  dsl/team.ts                                       |    |
  dsl/org.ts                                           |    |
                                                       |    |
server/config.ts ─────────────────────────────────────┐|    |
  ^  ^  ^  ^  ^                                       ||    |
  |  |  |  |  |                                       ||    |
  |  |  |  |  server/enforcer.ts ────────────────┐    ||    |
  |  |  |  |    ^  ^  ^                          |    ||    |
  |  |  |  |    |  |  |                          |    ||    |
  |  |  |  server/decisionCache.ts               |    ||    |
  |  |  |       ^                                |    ||    |
  |  |  server/bitsetCompiler.ts ────────────────+────+|    |
  |  |       ^                                   |    ||    |
  |  server/introspection.ts ────────────────────+────+|    |
  |       ^                                      |    ||    |
  server/policyCompiler.ts ─────────────────────-+────+|    |
  |    ^                                         |    ||    |
  |    |                                         |    ||    |
  server/authorize.ts ──────────────────────────-+    ||    |
  |    ^                                              ||    |
  |    |                                              ||    |
  server/sync/bus.ts                                  ||    |
  |    ^                                              ||    |
  server/sync/emitter.ts ────────────────────────────-+|    |
  |    ^                                              ||    |
  |    |                                              ||    |
  server/permission.service.ts ──> ALL SERVER MODULES  |    |
       ^                                              ||    |
       |                                              ||    |
  server/index.ts (barrel) ──────────────────────────-++    |
                                                       |    |
  index.ts (public barrel) ────────────────────────────+────+
```

---

## 18. Environment Variables

| Variable | Used By | Description |
|----------|---------|-------------|
| `CASBIN_ENFORCE` | PermissionService | `"true"` to throw on denied, `"false"` to log-only |

---

## 19. Seed Script

File: `packages/db/src/scripts/seed-permissions.ts`

The seed script imports `PERMISSIONS` and `SYSTEM_ROLES` directly from `@work-holo/permission` to ensure the DB always matches the runtime vocabulary. It:

1. Upserts all 59 permission nodes (using `resource` + `subResource` columns, NOT `module`)
2. Upserts the 5 system role templates (org_owner, org_admin, org_member, team_admin, team_member)
3. Creates role_permission join rows mapping each role to its allowed permission nodes

Run with: `cd packages/db && bun src/scripts/seed-permissions.ts`
