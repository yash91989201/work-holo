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

## Legacy docs moved

- `docs/technical/adding-permissions.md` -> `docs/technical/permission-system/adding-permissions.md`
- `docs/technical/frontend-permissions.md` -> `docs/technical/permission-system/frontend-permissions.md`
