# Frontend Permission API

This guide covers everything you need to use the permission system in the web frontend (`apps/web/`).

---

## How It Works

The permission system uses a **client-side evaluation** model:

1. **On app load**, `PermissionProvider` fetches a complete permission map (`Record<string, boolean>`) from the API via an oRPC suspense query
2. **In components**, use hooks (`useCan`) or components (`<Can>`) to check permissions against this map
3. **For real-time**, `usePermissionSync` subscribes to Pusher events and invalidates the cache when permissions change

### Why Client-Side Evaluation?

- **Fast**: The permission map is fetched once and cached. Permission checks are just object lookups.
- **No latency**: No API calls on every permission check — instant UI updates.
- **Simple**: No complex authorization logic in components — just check a boolean.

The heavy authorization logic (RBAC, policy overrides, ownership checks) happens on the **server**. The frontend only mirrors the final permission state.

---

## Quick Start

### 1. Wrap Your App with PermissionProvider

```tsx
// apps/web/src/main.tsx or root layout
import { PermissionProvider } from "@/lib/permission/permission-context";
import { Suspense } from "react";

function App() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <PermissionProvider>
        <AuthenticatedApp />
      </PermissionProvider>
    </Suspense>
  );
}
```

### 2. Add Real-Time Sync (Optional but Recommended)

```tsx
// In your authenticated layout component
import { usePermissionSync } from "@/hooks/use-permission-sync";

function AuthenticatedLayout() {
  usePermissionSync(); // Subscribes to Pusher, invalidates on permission changes
  return <Outlet />;
}
```

### 3. Use Permission Checks

```tsx
import { Can } from "@/lib/permission/components";

function ChannelPage() {
  return (
    <div>
      <Can permission={p => p.channel.message.create}>
        <ComposeMessage />
      </Can>
      {/* ... */}
    </div>
  );
}
```

---

## Hooks

### `useCan(input)`

Evaluates a permission and returns `true` or `false`.

**When to use:** Inside components where you need the boolean result for logic (not just rendering).

```tsx
import { useCan } from "@/lib/permission/permission-context";

// DSL accessor (recommended — type-safe autocomplete)
const canCreate = useCan(p => p.channel.message.create);

// String literal (also type-safe, less verbose)
const canCreate = useCan("channel.message.create");

// With combinators
const canManage = useCan((p, { and }) =>
  and(p.channel.update, p.channel.delete)
);
```

#### How the Input Works

| Input Type | Example | Best For |
|-----------|---------|----------|
| DSL accessor | `p => p.channel.create` | IDE autocomplete, refactoring |
| String literal | `"channel.create"` | Quick, less code |
| Combinator | `(p, { and }) => and(...)` | Complex logic |

The **DSL accessor** gives you autocomplete for all 64 permission keys. TypeScript will error if you use an invalid key.

---

### `usePermissions()`

Returns the raw permission map: `Record<string, boolean>`.

**When to use:** When you need to check many permissions at once, or need the raw data.

```tsx
import { usePermissions } from "@/lib/permission/permission-context";

function ChannelList() {
  const permissions = usePermissions();

  // Check multiple permissions
  const canDoAnything = permissions["channel.create"] &&
    permissions["channel.update"] &&
    permissions["channel.delete"];

  // Access by dynamic key
  const canAccess = permissions[dynamicPermissionKey];

  return <div>{/* ... */}</div>;
}
```

> **Tip:** For most cases, use `useCan` instead. It's cleaner and handles the expression evaluation for you.

---

## Components

### `<Can>`

Conditionally renders children based on a permission check.

**When to use:** For UI gating — show/hide components based on permissions.

```tsx
import { Can } from "@/lib/permission/components";
```

#### Basic Gate

Renders children only when permission is granted:

```tsx
<Can permission={p => p.channel.create}>
  <CreateChannelButton />
</Can>
```

#### With Fallback

Renders fallback when permission is denied:

```tsx
<Can permission={p => p.channel.create} fallback={<DisabledButton />}>
  <CreateChannelButton />
</Can>
```

Or with a message:

```tsx
<Can
  permission={p => p.channel.create}
  fallback={<p>You don't have permission to create channels</p>}
>
  <CreateChannelButton />
</Can>
```

#### Render Prop Pattern

Children receive the `allowed` boolean — useful for styling or complex logic:

```tsx
<Can permission={p => p.channel.message.create}>
  {(allowed) => (
    <Editor
      disabled={!allowed}
      placeholder={allowed ? "Type a message..." : "No permission"}
    />
  )}
</Can>
```

#### With Combinators

Combine multiple permissions:

```tsx
// OR: User can manage roles in org OR team
<Can permission={(p, { or }) => or(p.org.role.assign, p.team.role.assign)}>
  <RoleManager />
</Can>

// AND: User must have both permissions
<Can permission={(p, { and }) => and(p.channel.read, p.channel.message.list)}>
  <ChannelView />
</Can>

// NOT: Invert a permission
<Can permission={(p, { not }) => not(p.channel.delete)}>
  <ReadOnlyView />
</Can>
```

---

### `withPermission(Component, permission, Fallback?)`

Higher-order component (HOC) that wraps a component with a permission gate.

**When to use:** When you want to protect an entire component at the definition level.

```tsx
import { withPermission } from "@/lib/permission/components";

// Create a protected version
const ProtectedSettings = withPermission(
  OrgSettings,           // Component to wrap
  p => p.org.update,    // Permission check
  Unauthorized           // Optional fallback component
);

// Use like a normal component
function SettingsPage() {
  return <ProtectedSettings orgId="123" />;
}
```

#### Why Use This?

- **Declarative**: Permissions are defined once at the component level
- **Reusable**: Create protected variants and use them anywhere
- **Auto-named**: Sets `displayName` for React DevTools

```tsx
// Before: Permission check inside component
function Settings() {
  const canEdit = useCan(p => p.org.update);
  if (!canEdit) return <NoAccess />;
  return <SettingsContent />;
}

// After: Permission check at definition
const ProtectedSettings = withPermission(SettingsContent, p => p.org.update);

function Settings() {
  return <ProtectedSettings />;
}
```

---

## DSL Accessor Pattern

The **callback pattern** is the recommended way to reference permissions. It provides:

- **Type safety**: Autocomplete for all 64 permission keys
- **Refactoring safety**: Rename keys and TypeScript updates all references
- **Readability**: Clear intent — `p.channel.message.create` reads naturally

### How It Works

The callback receives two arguments:

1. `p` — The `permissionKey` object with all 64 permission paths
2. `{ and, or, not }` — Combinator functions for complex logic

### Examples

```tsx
// Single permission
useCan(p => p.channel.message.create)

// Nested path (sub-resources)
useCan(p => p.channel.message.mention.user)

// Access array item
useCan(p => p.org.invite.list)

// AND — all must be true
useCan((p, { and }) => and(
  p.channel.read,
  p.channel.message.list
))

// OR — at least one must be true
useCan((p, { or }) => or(
  p.org.role.assign,
  p.team.role.assign
))

// NOT — negation
useCan((p, { not }) => not(p.channel.delete))

// Complex nesting
useCan((p, { and, or }) => and(
  p.channel.read,
  or(
    p.channel.message.create,
    p.channel.message.reply
  )
))
```

### Available Permission Keys

```
attendance.record.{create,read,update,delete,list}

channel.{create,read,update,delete,list}
channel.member.{add,remove,read,list}
channel.message.{create,read,update,delete,list,react,pin,reply}
channel.message.mention.{user,channel}
channel.message.reader.list

org.{create,read,update,delete,list}
org.active.{read,switch}
org.invite.{create,read,update,delete,list,resend}
org.role.{create,read,update,delete,list,assign,remove}

team.{create,read,update,delete,list}
team.member.{add,remove,read,list}
team.role.{create,read,update,delete,list,assign,remove}
team.module.{enable,disable,access}
```

---

## Type Safety

The permission system is fully type-safe. Invalid permission keys will cause TypeScript errors at compile time.

### PermissionInput Type

Accepts two forms:

```ts
import type { PermissionInput } from "@work-holo/permission";

// Form 1: String literal (autocomplete works here too)
const input1: PermissionInput = "channel.create";

// Form 2: Selector callback
const input2: PermissionInput = (p) => p.channel.create;
```

### PermissionKeyFromDSL Type

The union of all 64 valid permission keys:

```ts
import type { PermissionKeyFromDSL } from "@work-holo/permission";

// Autocomplete works in your IDE
type Key = PermissionKeyFromDSL;
// → "attendance.record.create" | "attendance.record.read" | ...
```

---

## Common Patterns

### Pattern 1: Button Gating

```tsx
<Can permission={p => p.channel.create}>
  <Button onClick={createChannel}>Create Channel</Button>
</Can>
```

### Pattern 2: Page Section

```tsx
function SettingsPage() {
  return (
    <div>
      <GeneralSettings />
      <Can permission={p => p.org.update}>
        <OrgSettings />
      </Can>
      <Can permission={p => p.org.role.assign}>
        <RoleManagement />
      </Can>
    </div>
  );
}
```

### Pattern 3: Tab Navigation

```tsx
function SettingsTabs() {
  const tabs = [
    { id: 'general', label: 'General', permission: p => p.org.read },
    { id: 'members', label: 'Members', permission: p => p.team.member.list },
    { id: 'roles', label: 'Roles', permission: p => p.org.role.assign },
  ];

  return (
    <Tabs>
      {tabs.map(tab => (
        <Can key={tab.id} permission={tab.permission}>
          <Tab id={tab.id}>{tab.label}</Tab>
        </Can>
      ))}
    </Tabs>
  );
}
```

### Pattern 4: Form Fields

```tsx
function ChannelForm() {
  return (
    <Form>
      <Input name="name" />
      <Can permission={(p, { not }) => not(p.channel.delete)}>
        <Input name="description" />
      </Can>
      <Can permission={p => p.channel.message.create}>
        <Checkbox name="allowMessages" />
      </Can>
    </Form>
  );
}
```

### Pattern 5: Conditional Actions

```tsx
function MessageActions({ message }) {
  const canReact = useCan(p => p.channel.message.react);
  const canPin = useCan(p => p.channel.message.pin);
  const canDelete = useCan(p => p.channel.message.delete);

  return (
    <div>
      {canReact && <ReactionPicker />}
      {canPin && <PinButton message={message} />}
      {canDelete && <DeleteButton message={message} />}
    </div>
  );
}
```

---

## Real-Time Updates

### usePermissionSync

Subscribes to Pusher events for live permission changes.

```tsx
import { usePermissionSync } from "@/hooks/use-permission-sync";

function AuthenticatedLayout() {
  usePermissionSync();
  return <Outlet />;
}
```

**What it does:**

1. Subscribes to `private-user-{userId}` channel
2. Listens for `permission:update` events
3. Invalidates the permission query cache when received
4. React Query re-fetches the fresh permission map automatically

**When to use:** In the root authenticated layout (once).

**What happens:** When an admin changes a user's role or permissions, the UI updates automatically without page refresh.

---

## Summary

| API | Type | Use When |
|-----|------|----------|
| `useCan(input)` | Hook | Need boolean for component logic |
| `usePermissions()` | Hook | Need raw map for bulk checks |
| `<Can>` | Component | UI gating (show/hide) |
| `withPermission()` | HOC | Protect entire component |
| `usePermissionSync()` | Hook | Real-time updates |

### Quick Decision Guide

| Scenario | Recommended API |
|----------|-----------------|
| Hide a button | `<Can>` |
| Disable a form field | `<Can>` with render prop |
| Conditional rendering | `<Can>` |
| Different UI based on permission | `<Can>` with render prop |
| Complex logic with the boolean | `useCan` |
| Loop through many permissions | `usePermissions` |
| Protect a whole page component | `withPermission` |
| Want live updates when roles change | `usePermissionSync` |
