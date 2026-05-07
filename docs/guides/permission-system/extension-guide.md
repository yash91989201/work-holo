# Extension Guide

This section focuses on extending the existing permission system safely.

## Add a new permission key

1. Add entry in `packages/permission/src/lib/vocabulary.ts`
   - include unique `bitIndex`
   - keep key/resource/subResources/action aligned
2. Regenerate DSL files in permission package
3. Ensure role templates seed data includes intended grants/denies
4. Recompile policies for impacted orgs
5. Validate frontend map contains key and UI checks can evaluate it

For deeper procedural steps, also see `docs/technical/permission-system/adding-permissions.md`.

## Add a new backend check

Use one of these styles:

- direct descriptor checks (`permission.check(permission.org.read())`)
- key-based checks (`permission.checkByKey(key)`)
- resource guards for communication resources

Guidelines:

- perform checks as early as possible in handler
- prefer DSL descriptors over raw string keys for type safety
- only use owner bypass where ownership semantics are correct

## Add a new frontend gated feature

1. ensure feature route is under `PermissionProvider`
2. gate with `useCan`, `Can`, or `withPermission`
3. if feature depends on realtime permission changes, ensure `usePermissionSync` is mounted in layout

## Role-extension rules

When extending the role model, preserve these invariants:

- keep Better Auth base org roles as `owner | admin | member` on `member.role`
- do not introduce alternate sources of truth for system org roles in `roleAssignment`
- treat custom assignable roles as non-system `roleTemplate` rows
- for team-specific custom access, use `scope = "team"` with `roleAssignment.teamId`
- do not rely on raw role-name identity in Casbin or policy compilation; use stable template IDs
- do not add backend `owner/admin/member` string checks when a permission key can express the capability
- preserve database uniqueness invariants:
  - system role template names are unique globally (`organizationId IS NULL`)
  - custom role template names are unique per organization
  - org-scoped assignments are unique per `(userId, roleTemplateId, organizationId)`
  - team-scoped assignments are unique per `(userId, roleTemplateId, organizationId, teamId)`

## Add admin mutation workflow

When introducing new role/override mutations, preserve this sequence:

1. write mutation data
2. recompile policies
3. invalidate relevant caches
4. emit permission event for audit/realtime

This sequence is required to keep API checks and frontend state convergent.

For role mutations specifically:

- `PermissionAdmin` should only operate on non-system role templates
- validate organization ownership of the template
- validate `teamId` based on template scope
- validate that the referenced team belongs to the current organization

## External references for model reasoning

- Casbin RBAC with domains: https://www.casbin.org/docs/rbac-with-domains
- Casbin model syntax: https://www.casbin.org/docs/syntax-for-models
- Casbin enforcers/reload patterns: https://www.casbin.org/docs/enforcers
