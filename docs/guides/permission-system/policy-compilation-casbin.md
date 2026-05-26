# Policy Compilation and Casbin Model

## Casbin model used by the package

Model file: `packages/permission/src/lib/model.conf`

Key definitions:

- request: `r = sub, dom, obj, act`
- policy: `p = sub, dom, obj, act, eft`
- role grouping: `g = _, _, _`
- effect: allow when any allow exists and no deny exists

Matcher includes one logical path:

1. role/direct-subject path using `g(...)`, domain equality, object match (`keyMatchColon`), action match (exact equality)

Owner bypass is handled at the application layer in `AuthorizationEngine.authorizeWithOwnerBypass()`, not in the Casbin model. See [Architecture and Runtime Flow](./architecture-runtime-flow.md) for details.

## Custom matcher: `keyMatchColon`

Source: `packages/permission/src/lib/casbin-matchers.ts`

The built-in `keyMatch2` uses `/` as a delimiter (URL-style paths). Our permission objects use `:` as a delimiter (e.g. `channel:member`), and request objects may include a trailing resource ID segment (e.g. `channel:ch_abc123`).

`keyMatchColon` matches when:

1. The request object exactly equals the policy object, OR
2. The request object equals the policy object with exactly one additional `:segment` appended (the resource ID)

Examples:

| Request object | Policy object | Match? |
|---|---|---|
| `channel` | `channel` | yes (exact) |
| `channel:ch_abc123` | `channel` | yes (policy + resourceId) |
| `channel:member` | `channel:member` | yes (exact) |
| `channel:member:ch_abc123` | `channel:member` | yes (policy + resourceId) |
| `team:t1:channel:ch_abc` | `team:t1:channel` | yes (policy + resourceId) |
| `channel:member` | `channel` | no (different structure) |
| `channel:a:b` | `channel` | no (two extra segments) |

The function is registered on the Casbin enforcer during initialization in `PolicyManager.getEnforcer()` via `enforcer.addFunction("keyMatchColon", keyMatchColonFunc)`.

## Compile pipeline in `PolicyManager.compilePolicies`

For each org compile:

1. create next `policyVersion` row (status `compiling`)
2. fetch role assignments, role permissions, active overrides
   - effective system org roles are derived from Better Auth `member.role`
   - only non-system `roleAssignment` rows are treated as assignable/custom role memberships
3. compile grouping policies (`g` rules)
4. compile role permission policies (`p` rules)
5. compile override policies (`p` rules)
6. transactionally delete both `p` rules (where `v1 = domain`) and `g` rules (where `v2 = domain`), then insert new rules
7. mark policy version row `compiled` (or `error` on failure)
8. reload in-memory enforcer policy
9. update Redis `policy_version:{orgId}` (only after successful reload)

## Object and role naming rules

From `PolicyManager` helpers:

- domain: `org:{orgId}`
- org role subject: `role:{roleTemplateId}`
- team role subject: `role:{roleTemplateId}:team:{teamId}`
- object base: `resource[:subResourceSegments][:resourceId]`
- team-scoped object includes `team:{teamId}` prefix

Using `roleTemplate.id` instead of role name prevents identity collisions between system roles and future custom roles that may reuse the same display/name value.

### Team-scoped role policies

- `g` rules use the assigned `teamId` when linking a user to a team role.
- `p` rules for team roles are generated per team assignment so the subject and object carry the same `team:{teamId}` prefix, keeping permissions scoped to the correct team.

## Distributed compilation lock (multi-instance safety)

`PolicyManager` uses a two-level locking strategy:

1. **In-process lock** (`compilationLocks` Map): Prevents concurrent compiles within the same Node process
2. **Redis distributed lock** (`compilation_lock:{orgId}`): Prevents concurrent compiles across multiple server instances

Lock acquisition flow:
- Attempts to acquire Redis lock with 30s TTL using `SET ... NX PX`
- Retries up to 3 times with 1s delay if lock is held by another instance
- If lock cannot be acquired after retries, returns a result with the latest known version and an error message indicating another instance is compiling
- Lock is always released in finally block after compilation completes

This prevents version churn, inconsistent intermediate states, and race conditions in multi-instance deployments.

## Grouping policy cleanup

The transaction in step 6 deletes both:
- `p` (policy) rules where `v1 = domain`
- `g` (grouping/role-assignment) rules where `v2 = domain`

This ensures revoked role memberships are properly removed from Casbin and do not persist as stale `g` rows.

## Compile-time role sourcing rules

`PolicyManager.fetchRoleAssignments(orgId)` now merges two sources:

1. **custom assignments** from `roleAssignment`
   - only non-system templates are included
2. **system assignments** synthesized from Better Auth `member` rows
   - `member.role` is mapped to the matching system org `roleTemplate`

This keeps effective authorization aligned with Better Auth even if persisted system `roleAssignment` rows become stale.

## Concurrency behavior for policy reload

`PolicyManager.reloadPolicies()` uses `reloading` + `pendingReload` flags.

- if reload is already running, it sets `pendingReload = true`
- once running reload completes, one follow-up reload executes

This avoids unbounded concurrent `enforcer.loadPolicy()` calls.

## Error path behavior

If compile fails:

- policy version row is marked `error`
- compile result returns with `error` field
- Redis version is not advanced for failed compile

This prevents stale or broken policy sets from being promoted as current.

If `reloadPolicies()` fails after DB write but before version publication, the error is caught and:
- policy version row is marked `error` with the error message
- Redis version stays at the previous value (unchanged)
- no broken policy state is published to other instances
