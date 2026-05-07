# Permission System Guide

This guide documents the real implementation in `packages/permission` and how it is consumed by `packages/api`, `apps/server`, and `apps/web`.

## Who this is for

- Backend engineers adding or debugging authorization checks
- Frontend engineers building permission-gated UI
- Maintainers operating cache, policy compilation, and realtime sync

## Guide map

1. [Architecture and Runtime Flow](./architecture-runtime-flow.md)
2. [Backend Integration](./backend-integration.md)
3. [Frontend Integration](./frontend-integration.md)
4. [Caching and Consistency](./caching-consistency.md)
5. [Policy Compilation and Casbin Model](./policy-compilation-casbin.md)
6. [DSL, Vocabulary, and Code Generation](./dsl-vocabulary-codegen.md)
7. [Operations and Troubleshooting](./operations-troubleshooting.md)
8. [Extension Guide](./extension-guide.md)
9. [Adding New Permissions](./adding-permissions.md)
10. [Frontend Permission API](./frontend-permissions.md)

## Source of truth

- Runtime package: `packages/permission/src`
- API usage: `packages/api/src`
- Service bootstrapping: `apps/server/src/index.ts`
- Web usage: `apps/web/src/lib/permission` and `apps/web/src/hooks/use-permission-sync.ts`

## Role model and source of truth

The system now distinguishes between **base organization roles** and **custom assignable roles**:

- **Base org roles**: `owner`, `admin`, `member`
  - stored in Better Auth on `member.role`
  - treated as the source of truth for organization-level system access
  - represented in the permission system by system `roleTemplate` rows during policy compilation
- **Custom roles**:
  - stored as non-system `roleTemplate` rows
  - intended to be assigned through `roleAssignment`
  - team-specific custom access should use `scope = "team"` plus `roleAssignment.teamId`

Important constraints:

- do **not** treat `roleAssignment` as the source of truth for Better Auth system roles
- do **not** hardcode backend authorization from raw role strings when a permission check exists
- system roles and custom roles can share human-readable names in the future, so runtime identity uses stable `roleTemplate.id`

## Legacy docs moved

- `docs/technical/adding-permissions.md` -> `docs/technical/permission-system/adding-permissions.md`
- `docs/technical/frontend-permissions.md` -> `docs/technical/permission-system/frontend-permissions.md`
