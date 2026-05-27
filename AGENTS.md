# AGENTS.md

> **Purpose:** This file defines workflow patterns and mandatory tooling rules for AI agents operating in this codebase.
> All rules are non-negotiable unless explicitly stated otherwise.

---

## Table of Contents

1. [Frontend API — oRPC + TanStack Query](#1-frontend-api--orpc--tanstack-query)
2. [UI and Design System](#2-ui-and-design-system)
3. [Schemas and Generated Types](#3-schemas-and-generated-types)
4. [Forms — TanStack Form + Zod](#4-forms--tanstack-form--zod)
5. [Suspense Fallbacks](#5-suspense-fallbacks)
6. [Images](#6-images)
7. [Permission System](#7-permission-system)

---

## 1. Frontend API — oRPC + TanStack Query

All API calls must use `queryUtils` with TanStack Query. Never call procedures directly from components.

| Pattern | Rule |
|---|---|
| Reads | `useSuspenseQuery` preferred; `useQuery` when suspense is inappropriate |
| Writes | `useMutation(queryUtils.*.mutationOptions(...))` |
| Invalidation | Only inside mutation callbacks |
| Query keys | `queryUtils.*.queryKey(...)` — never hand-roll keys |
| Auth | Cookie-backed by default; TanStack options supported |

Docs: [`api-client-usage.md`](docs/guides/api-client-usage.md)

---

## 2. UI and Design System

All frontend UI must use the project theme and shadcn primitives. Use **theme tokens** (colors, spacing, radius, typography) from `packages/ui/src/styles/globals.css` / Tailwind. Reuse shared primitives/components from `packages/ui/src/components` where applicable. No invented hex values, arbitrary pixels, one-off radii, or inline style drift. Extend existing shadcn component tokens/primitives; inspect component code when needed.

Docs: [`ui.md`](docs/conventions/ui.md)

---

## 3. Schemas and Generated Types

| | |
|---|---|
| Schema tool | Zod — defined outside components |
| Frontend location | `apps/web/src/lib/schemas/` |
| Generated types | Import from `@/lib/types`; never manually edit generated files |
| Form naming | `*FormSchema` / `*FormType` |
| Monorepo boundaries | Frontend: `@/lib/*` · Server shared: `@server/lib/*` |

Docs: [`schema.md`](docs/conventions/schema.md), [`form-schema.md`](docs/guides/forms/form-schema.md)

---

## 4. Forms — TanStack Form + Zod

| Step | Rule |
|---|---|
| Setup | Schema/type first → `useAppForm` + `validators.onSubmit` |
| Fields | Use project `field.*` controls for labels, descriptions, errors |
| Submission | `useMutation(queryUtils.*.mutationOptions())` — side effects in callbacks |
| Buttons | Explicit type on non-submit buttons; submit state via `form.Subscribe` |
| Complex forms | Nested paths, `FieldGroup`/`FieldSet`, TanStack array APIs |
| Validation | Async and cross-field validation in Zod refinements |

Docs: [`simple-form.md`](docs/guides/forms/simple-form.md), [`complex-form.md`](docs/guides/forms/complex-form.md), [`form-schema.md`](docs/guides/forms/form-schema.md)

---

## 5. Suspense Fallbacks

Fallbacks must mirror the final UI, skeletonizing only dynamic data. Create `ComponentNameSkeleton` and assign to `ComponentName.Fallback`. Keep wrappers, hierarchy, headers, labels, and icons identical. Replace API-sourced values with sized `<Skeleton />`; keep all static content visible.

Docs: [`suspense-fallback.md`](docs/guides/suspense-fallback.md)

---

## 6. Images

Use `Image` from `@/components/shared/image` for all images.

| Concern | Rule |
|---|---|
| Layout | Reserve space with dimensions/aspect ratio; `layout="fill"` requires a positioned, sized parent |
| Priority | `priority` for above-the-fold only; `unoptimized` only when intentional |
| Accessibility | Use `decorative`, `fallbackSrc`, `fallback`, `blurDataURL` as appropriate |
| URL helpers | `getImageProps`, `buildImageUrl`, `buildSrcSet` — outside render paths |

Docs: [`image-component.md`](docs/guides/image-component.md)

---

## 7. Permission System

| Concern | Rule |
|---|---|
| Backend checks | Prefer DSL permission checks/resource guards over raw role checks |
| Runtime flow | Understand managers, owner bypass, cache, bitset, Casbin fallback |
| Frontend gating | Use `PermissionProvider`, `useCan`, `<Can>`, and realtime sync |
| Caching | Decision, bitset, and permission-map caches are versioned and scope-invalidated |
| Policy compilation | Role grants, overrides, deny precedence, Casbin rules |
| DSL/codegen | Vocabulary is canonical; generated keys/descriptors/bit indexes derive from it |
| Adding permissions | Follow action/sub-resource/resource decision tree, then regenerate code |

Docs: [`README`](docs/guides/permission-system/README.md) · [`backend-integration`](docs/guides/permission-system/backend-integration.md) · [`architecture-runtime-flow`](docs/guides/permission-system/architecture-runtime-flow.md) · [`frontend-integration`](docs/guides/permission-system/frontend-integration.md) · [`frontend-permissions`](docs/guides/permission-system/frontend-permissions.md) · [`caching-consistency`](docs/guides/permission-system/caching-consistency.md) · [`policy-compilation-casbin`](docs/guides/permission-system/policy-compilation-casbin.md) · [`dsl-vocabulary-codegen`](docs/guides/permission-system/dsl-vocabulary-codegen.md) · [`adding-permissions`](docs/guides/permission-system/adding-permissions.md) · [`extension-guide`](docs/guides/permission-system/extension-guide.md) · [`operations-troubleshooting`](docs/guides/permission-system/operations-troubleshooting.md)
