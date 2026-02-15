# Policy Compilation and Casbin Model

## Casbin model used by the package

Model file: `packages/permission/src/lib/model.conf`

Key definitions:

- request: `r = sub, dom, obj, act`
- policy: `p = sub, dom, obj, act, eft`
- role grouping: `g = _, _, _`
- effect: allow when any allow exists and no deny exists

Matcher includes one logical path:

1. role/direct-subject path using `g(...)`, domain equality, object match (`keyMatchColon`), action match (`regexMatch`)

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
3. compile grouping policies (`g` rules)
4. compile role permission policies (`p` rules)
5. compile override policies (`p` rules)
6. transactionally replace `casbin_rule` rows for org domain
7. mark policy version row `compiled` (or `error` on failure)
8. update Redis `policy_version:{orgId}`
9. reload in-memory enforcer policy

## Object and role naming rules

From `PolicyManager` helpers:

- domain: `org:{orgId}`
- org role: `role:{roleName}`
- team role: `role:{roleName}:team:{teamId}`
- object base: `resource[:subResourceSegments][:resourceId]`
- team-scoped object includes `team:{teamId}` prefix

### Team-scoped role policies

- `g` rules use the assigned `teamId` when linking a user to a team role.
- `p` rules for team roles are generated per team assignment so the subject and object carry the same `team:{teamId}` prefix, keeping permissions scoped to the correct team.

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
