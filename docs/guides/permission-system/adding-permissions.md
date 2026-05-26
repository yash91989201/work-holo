# Adding New Permissions

This guide explains how to add new resources and permissions to the permission system. Follow these steps whether you're adding:

- A **new action** to an existing resource (e.g., adding `channel.message.pin` where `message` already exists)
- A **new sub-resource** to an existing resource (e.g., adding `project.task` where `project` exists)
- An **entirely new resource** (e.g., adding `project` when it doesn't exist yet)

---

## Understanding the System

Before making changes, understand how the pieces fit together:

### Vocabulary (`vocabulary.ts`)
The **single source of truth** for all permissions. Every permission is registered here with a unique `bitIndex`. The authorization engine, DSL builders, frontend keys, and seed scripts all derive from this registry.

### DSL Builders (`dsl/*.ts`)
Provide a **fluent API** for constructing permission descriptors on the backend. Used in API routes and authorization checks.

- `createActionTerminal(resource, subResources, action)` — For top-level resources (e.g., `channel.create`)
- `createScopedActionTerminal(resource, subResources, action)` — For scoped resources (e.g., `channel.message.create` with a channel ID)

### Permission Key Accessor (`keys.ts`)
The `permissionKey` object provides **type-safe string literals** for the frontend. It uses TypeScript's `as const` to infer a union of all valid permission keys — no manual type maintenance needed.

### Seed Script (`seed-permissions.ts`)
Defines **default system-role permissions** — which Better Auth base org roles (`owner`, `admin`, `member`) get by default.

These seeded templates are system org roles (`isSystem = true`, `organizationId = null`). Runtime authorization derives the active system role from `member.role`, then maps that to the seeded system `roleTemplate` during compilation.

---

## Quick Decision Tree

Use this to find which steps you need:

| Scenario | Steps Needed |
|----------|-------------|
| Adding a new action to an existing resource | 1, 4, 6, 7 |
| Adding a new sub-resource (e.g., `channel.message.reply`) | 1, 3, 4, 6, 7 |
| Adding a completely new resource (e.g., `project.*`) | 1, 2, 3, 4, 5, 6, 7 |

---

## Step-by-Step Guide

### Step 1: Add to Vocabulary

**File:** `packages/permission/src/lib/vocabulary.ts`

Add a new entry to the `PERMISSIONS_REGISTRY` array. This is **mandatory for every new permission**.

```ts
// packages/permission/src/lib/vocabulary.ts

constISTRY = [
  PERMISSIONS_REG // ... existing entries ...

  // Example: Adding project.task.create
  {
    key: "project.task.create",
    resource: "project",           // Top-level resource name
    subResources: ["task"],        // Hierarchical path (can be empty array)
    action: "create",              // The action being performed
    bitIndex: 64,                 // MUST be unique and sequential
    description: "Create tasks in a project",
  },
];
```

#### Understanding the fields:

| Field | Description | Example |
|-------|-------------|---------|
| `key` | Full permission key (dot-separated) | `"project.task.create"` |
| `resource` | Top-level resource | `"project"` |
| `subResources` | Hierarchical path below resource | `["task"]` or `[]` |
| `action` | The operation | `"create"`, `"read"`, `"list"`, etc. |
| `bitIndex` | Unique integer (0, 1, 2...) | `64` |
| `description` | Human-readable explanation | `"Create tasks..."` |

> **Critical:** `bitIndex` must be unique. Find the current maximum and use `max + 1`. The system uses a bitset — each permission gets one bit.

#### Update TOTAL_PERMISSIONS:

```ts
// At the top of vocabulary.ts
export const TOTAL_PERMISSIONS = 65; // Increment from 64
```

---

### Step 2: Update Types (Only for New Resources)

**File:** `packages/permission/src/lib/types.ts`

If you're adding a **new top-level resource** (like `project`), add it to the `AuthResource` union:

```ts
export type AuthResource = "org" | "team" | "channel" | "attendance" | "project";
```

If you're adding a **new action** that doesn't exist yet, add it to `AuthAction`:

```ts
export type AuthAction =
  | "create" | "read" | "update" | "delete" | "list"
  | "add" | "remove" | "react" | "pin" | "reply"
  | "mention" | "resend" | "assign" | "switch"
  | "enable" | "disable" | "access"
  | "your-new-action";  // Only if truly new
```

> **Note:** Most common actions already exist. You likely don't need to add new ones.

---

### Step 3: Create or Update DSL Builder

**New Resource:** Create `packages/permission/src/lib/dsl/project.ts`

```ts
import { createActionTerminal, createScopedActionTerminal } from "./shared";

/**
 * DSL type for the Project resource.
 * Define the complete shape of what permissions exist under "project".
 */
export type ProjectDSL = {
  /** Top-level project permissions (no sub-resource) */
  create: ReturnType<typeof createActionTerminal>;
  read: ReturnType<typeof createActionTerminal>;
  update: ReturnType<typeof createActionTerminal>;
  delete: ReturnType<typeof createActionTerminal>;
  list: ReturnType<typeof createActionTerminal>;

  /** Nested "task" sub-resource */
  task: {
    create: ReturnType<typeof createScopedActionTerminal>;
    read: ReturnType<typeof createScopedActionTerminal>;
    update: ReturnType<typeof createScopedActionTerminal>;
    delete: ReturnType<typeof createScopedActionTerminal>;
    list: ReturnType<typeof createScopedActionTerminal>;
  };
};

/**
 * Returns a ProjectDSL instance for building permission descriptors.
 * Use in API routes: Channel().task.create("project-123")
 */
export function Project(): ProjectDSL {
  return {
    // Top-level actions (no sub-resource path)
    create: createActionTerminal("project", [], "create"),
    read: createActionTerminal("project", [], "read"),
    update: createActionTerminal("project", [], "update"),
    delete: createActionTerminal("project", [], "delete"),
    list: createActionTerminal("project", [], "list"),

    // Nested "task" sub-resource
    task: {
      create: createScopedActionTerminal("project", ["task"], "create"),
      read: createScopedActionTerminal("project", ["task"], "read"),
      update: createScopedActionTerminal("project", ["task"], "update"),
      delete: createScopedActionTerminal("project", ["task"], "delete"),
      list: createScopedActionTerminal("project", ["task"], "list"),
    },
  };
}
```

**Existing Resource:** Add to the existing DSL file

For example, to add `channel.message.reply` (where `channel.message` already exists), find `packages/permission/src/lib/dsl/channel.ts` and add:

```ts
// In the message: { ... } object, add:
reply: createScopedActionTerminal("channel", ["message"], "reply"),
```

---

### Step 4: Update Permission Key Accessor

**File:** `packages/permission/src/lib/dsl/keys.ts`

Add the new key path to the `permissionKey` object. This enables type-safe permission checking on the frontend.

```ts
export const permissionKey = {
  // ... existing keys ...

  // Add your new resource here
  project: {
    create: "project.create",
    read: "project.read",
    update: "project.update",
    delete: "project.delete",
    list: "project.list",

    // Nested sub-resources
    task: {
      create: "project.task.create",
      read: "project.task.read",
      update: "project.task.update",
      delete: "project.task.delete",
      list: "project.task.list",
    },
  },
} as const;
```

> **Why this matters:** The `as const` assertion makes TypeScript infer `PermissionKeyFromDSL` as a union of all these string literals. This gives you autocomplete and compile-time errors if you use an invalid key.

---

### Step 5: Export the DSL Builder

**File:** `packages/permission/src/index.ts`

Add the export so other packages can use the DSL:

```ts
// Add this line
export { Project, type ProjectDSL } from "./lib/dsl/project";
```

> **Note:** You don't need to export `permissionKey` — it's already exported from `keys.ts`.

---

### Step 6: Update Seed Script

**File:** `packages/permission/scripts/seed-permissions.ts`

Add default role mappings. This determines what permissions each base system org role gets when the database is seeded.

```ts
const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  owner: [
    // ... existing permissions ...
    "project.create",
    "project.read",
    "project.update",
    "project.delete",
    "project.list",
    "project.task.create",
    "project.task.read",
    "project.task.update",
    "project.task.delete",
    "project.task.list",
  ],
  admin: [
    // ... existing permissions ...
    // Usually same as owner for most permissions
    "project.create",
    "project.read",
    "project.list",
    "project.task.create",
    "project.task.read",
    "project.task.update",
    "project.task.list",
  ],
  member: [
    // ... existing permissions ...
    // Minimal permissions — usually just read/list
    "project.read",
    "project.list",
    "project.task.read",
    "project.task.list",
  ],
};
```

#### Guidelines for role permissions:

| Role | Typical Permissions |
|------|-------------------|
| **owner** | Full access — all CRUD actions on all resources |
| **admin** | Most CRUD — can manage others but can't delete org |
| **member** | Read/list + limited create — no management actions |

> These mappings define the permission envelope for the three Better Auth base org roles. They are not a substitute for custom role assignment APIs.

---

### Step 7: Apply and Verify

Run these commands in order:

```bash
# 1. Type-check — should pass with no errors
bun check-types

# 2. Seed the permissions (if database is set up)
bun run --filter @work-holo/permission seed

# 3. If using the database, push any schema changes
bun run db:push
```

#### Why type-check is important:

The `PermissionKeyFromDSL` type is **automatically derived** from the `permissionKey` object in `keys.ts`. If you forget to update any reference to a permission (in DSL, components, etc.), TypeScript will error at compile time. This is your safety net.

---

## Common Scenarios

### Adding a new action to an existing resource

Example: Adding `channel.message.pin`

| Step | What to do |
|------|-----------|
| 1. Vocabulary | Add `"channel.message.pin"` entry with unique `bitIndex` |
| 4. Keys | Add `pin: "channel.message.pin"` under `channel.message` |
| 6. Seed | Add `"channel.message.pin"` to appropriate roles |
| 7. Verify | Run type-check and seed |

### Adding a new sub-resource

Example: Adding `channel.announcement.*` (where `channel` exists)

| Step | What to do |
|------|-----------|
| 1. Vocabulary | Add all `channel.announcement.*` entries |
| 3. DSL | Add `announcement` object to `Channel()` function |
| 4. Keys | Add `announcement` nested object |
| 5. Export | Export updated `Channel` DSL |
| 6. Seed | Add new permissions to roles |
| 7. Verify | Run type-check and seed |

---

## Checklist

Use this checklist when adding permissions:

- [ ] **Vocabulary:** New entry in `vocabulary.ts` with unique `bitIndex`
- [ ] **TOTAL_PERMISSIONS:** Updated count in `vocabulary.ts`
- [ ] **Types:** New resource/action added to `types.ts` (only if truly new)
- [ ] **DSL:** Created new DSL file or updated existing
- [ ] **Keys:** New permission path added to `permissionKey` in `keys.ts`
- [ ] **Export:** New DSL exported from `index.ts` (only for new resource)
- [ ] **Seed:** Default role mappings added in seed script
- [ ] **Type-check:** `bun check-types` passes
- [ ] **Seed run:** Permissions seeded to database

---

## Troubleshooting

### "Type 'X' is not assignable..."

You probably forgot to add the new permission key to `permissionKey` in `keys.ts`. The frontend types derive from that object.

### "Cannot find module './project'"

You created the DSL file but didn't export it from `packages/permission/src/index.ts`.

### "Duplicate bitIndex"

Two permissions have the same `bitIndex`. Check `vocabulary.ts` — each must be unique.

### Permission check returns `false` unexpectedly

Check the correct source of truth:

- for base org access, the relevant system role may not have that permission in the seed script, or the user's `member.role` may not be what you expect
- for custom access, verify the user has the expected non-system role assignment in the correct org/team scope
