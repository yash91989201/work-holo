# AGENTS.md

> **Purpose:** Behavioral guidelines, project-specific tooling rules, and code intelligence for AI agents in this codebase. All rules are non-negotiable unless explicitly stated otherwise.

---

## Agent Behavior

### Think Before Coding

Don't assume. Don't hide confusion. Surface tradeoffs.

- State assumptions explicitly; if uncertain, ask.
- Present multiple interpretations rather than picking silently.
- If a simpler approach exists, say so and push back.
- If something is unclear, stop — name what's confusing, then ask.

### Simplicity First

Minimum code that solves the problem. Nothing speculative.

- No features, abstractions, or flexibility beyond what was asked.
- No error handling for impossible scenarios.
- If 200 lines could be 50, rewrite it.

Ask: *Would a senior engineer say this is overcomplicated?* If yes, simplify.

### Surgical Changes

Touch only what you must. Clean up only your own mess.

- Don't improve adjacent code, comments, or formatting.
- Don't refactor things that aren't broken; match existing style.
- Mention unrelated dead code — don't delete it.
- Remove imports/variables/functions that *your* changes made unused.

Every changed line must trace directly to the user's request.

### Goal-Driven Execution

Define success criteria. Loop until verified.

- Transform vague tasks: "Fix the bug" → write a reproducing test, then make it pass.
- For multi-step tasks, state a brief plan with a verify check per step.

---

## Project Rules Overview

**Note:** This is just an overview . Always read the linked docs files for full implementation details when required.

### API — oRPC + TanStack Query

All API calls via `queryUtils`. Never call procedures directly from components.

| Pattern | Rule |
|---|---|
| Reads | `useSuspenseQuery` preferred; `useQuery` when suspense is inappropriate |
| Writes | `useMutation(queryUtils.*.mutationOptions(...))` |
| Invalidation | Only inside mutation callbacks |
| Query keys | `queryUtils.*.queryKey(...)` — never hand-roll |
| Auth | Cookie-backed by default |

Docs: [`api-client-usage.md`](docs/guides/api-client-usage.md)

### UI and Design System

Use **theme tokens** from `packages/ui/src/styles/globals.css` / Tailwind and shadcn primitives from `packages/ui/src/components`. No invented hex values, arbitrary pixels, one-off radii, or inline style drift.

Docs: [`ui.md`](docs/conventions/ui.md)

### Schemas and Types

| | |
|---|---|
| Schema tool | Zod — defined outside components |
| Frontend location | `apps/web/src/lib/schemas/` |
| Generated types | Import from `@/lib/types`; never manually edit |
| Form naming | `*FormSchema` / `*FormType` |
| Monorepo boundaries | Frontend: `@/lib/*` · Server shared: `@server/lib/*` |

Docs: [`schema.md`](docs/conventions/schema.md), [`form-schema.md`](docs/guides/forms/form-schema.md)

### Forms — TanStack Form + Zod

| Step | Rule |
|---|---|
| Setup | Schema/type first → `useAppForm` + `validators.onSubmit` |
| Fields | Use project `field.*` controls for labels, descriptions, errors |
| Submission | `useMutation(queryUtils.*.mutationOptions())` — side effects in callbacks |
| Buttons | Explicit type on non-submit buttons; submit state via `form.Subscribe` |
| Complex forms | Nested paths, `FieldGroup`/`FieldSet`, TanStack array APIs |
| Validation | Async and cross-field in Zod refinements |

Docs: [`simple-form.md`](docs/guides/forms/simple-form.md), [`complex-form.md`](docs/guides/forms/complex-form.md), [`form-schema.md`](docs/guides/forms/form-schema.md)

### Suspense Fallbacks

Create `ComponentNameSkeleton`, assign to `ComponentName.Fallback`. Mirror final UI exactly — same wrappers, hierarchy, headers, labels, icons. Replace API-sourced values with sized `<Skeleton />`; keep static content visible.

Docs: [`suspense-fallback.md`](docs/guides/suspense-fallback.md)

### Images

Use `Image` from `@/components/shared/image` for all images.

| Concern | Rule |
|---|---|
| Layout | Reserve space with dimensions/aspect ratio; `layout="fill"` requires a positioned, sized parent |
| Priority | `priority` for above-the-fold only; `unoptimized` only when intentional |
| Accessibility | Use `decorative`, `fallbackSrc`, `fallback`, `blurDataURL` as appropriate |
| URL helpers | `getImageProps`, `buildImageUrl`, `buildSrcSet` — outside render paths |

Docs: [`image-component.md`](docs/guides/image-component.md)

### Permission System

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

---

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **work-holo** (6142 symbols, 14777 relationships, 240 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> Index stale? Run `node .gitnexus/run.cjs analyze` from the project root — it auto-selects an available runner. No `.gitnexus/run.cjs` yet? `npx gitnexus analyze` (npm 11 crash → `npm i -g gitnexus`; #1939).

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows. For regression review, compare against the default branch: `detect_changes({scope: "compare", base_ref: "main"})`.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `context({name: "symbolName"})`.

## Never Do

- NEVER edit a function, class, or method without first running `impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `rename` which understands the call graph.
- NEVER commit changes without running `detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/work-holo/context` | Codebase overview, check index freshness |
| `gitnexus://repo/work-holo/clusters` | All functional areas |
| `gitnexus://repo/work-holo/processes` | All execution flows |
| `gitnexus://repo/work-holo/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
- NEVER rename symbols with find-and-replace — use `rename` which understands the call graph.
- NEVER commit changes without running `detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/work-holo/context` | Codebase overview, check index freshness |
| `gitnexus://repo/work-holo/clusters` | All functional areas |
| `gitnexus://repo/work-holo/processes` | All execution flows |
| `gitnexus://repo/work-holo/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
