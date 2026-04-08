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

## Add admin mutation workflow

When introducing new role/override mutations, preserve this sequence:

1. write mutation data
2. recompile policies
3. invalidate relevant caches
4. emit permission event for audit/realtime

This sequence is required to keep API checks and frontend state convergent.

## External references for model reasoning

- Casbin RBAC with domains: https://www.casbin.org/docs/rbac-with-domains
- Casbin model syntax: https://www.casbin.org/docs/syntax-for-models
- Casbin enforcers/reload patterns: https://www.casbin.org/docs/enforcers
