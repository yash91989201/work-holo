# DSL, Vocabulary, and Code Generation

## Vocabulary as canonical registry

File: `packages/permission/src/lib/vocabulary.ts`

Each permission entry defines:

- `key` (for example `channel.message.update`)
- `resource`
- `subResources`
- `action`
- `bitIndex`

Derived exports:

- `PERMISSIONS`
- `PERMISSION_BY_KEY`
- `PERMISSION_BY_BIT_INDEX`
- `TOTAL_PERMISSIONS`

Current total is 64 permissions.

## Descriptor building

`packages/permission/src/lib/dsl/shared.ts` builds `PermissionDescriptor` objects.

- `buildDescriptor(permissionKey, resourceId?, scope?)`
- `createActionTerminal(permissionKey)`
- `createScopedActionTerminal(scopeType, scopeId, permissionKey)`

Descriptor fields:

- `obj`: object path consumed by Casbin matcher
- `act`: action string (permission key)
- `permissionKey`: normalized key
- `bitIndex`: bitset index for prefilter

## Generated DSL files

Generated from vocabulary by script:

- `packages/permission/scripts/generate-permission-code.ts`

Outputs:

- `src/lib/dsl/keys.ts` (permission key tree and expression utilities)
- `src/lib/dsl/org.ts`
- `src/lib/dsl/team.ts`
- `src/lib/dsl/channel.ts`
- `src/lib/dsl/attendance.ts`

Do not manually edit generated files.

## Expression support (frontend + shared logic)

`src/lib/dsl/keys.ts` exposes:

- `permissionKey`
- `and`, `or`, `not`
- `resolvePermission(input)`
- `evaluateExpression(expr, permissions)`

This allows typed key selection and composable runtime checks on permission maps.

## Resolver utilities

`src/lib/permission-resolver.ts` provides:

- `resolvePermissionKey(permissionKey)`
- `resolvePermissionBitIndex(permissionKey)`

Used by checker/engine compilation and key-based checks.

## Bitset utilities

`src/lib/bitset.ts` provides:

- `checkBit(hexBitset, index)`
- `createEmptyBitset(totalPermissions)`
- `setBit(bitset, index)`
- `bitsetToHex(bitset)`

This is the prefilter representation used before Casbin enforcement.
