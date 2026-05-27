# UI & Design System Conventions

## 1. Purpose

- Keep all frontend UI aligned with the shared design system.
- Avoid one-off colors, spacing, radius, typography, and inline style drift.
- Always build on project tokens and shadcn primitives.

## 2. Updated Project Structure

UI foundations are now centralized in **`packages/ui`**.

- Shared UI package: `packages/ui`
- Shared components: `packages/ui/src/components`
- Shared theme/styles: `packages/ui/src/styles/globals.css`
- Shared utilities/hooks: `packages/ui/src/lib`, `packages/ui/src/hooks`

Use the shared UI package instead of redefining styles locally in app code.

## 3. Theme & Token Source of Truth

- Theme tokens (colors, spacing, radius, typography) must come from:

```txt
packages/ui/src/styles/globals.css
```

- Use Tailwind utilities that map to these tokens.
- For shadcn-based components, extend existing tokens/primitives instead of introducing ad-hoc values.

## 4. Styling Rules

- **Colors**
  - Use only design-system tokens/Tailwind classes from the shared theme.
  - No custom hex values unless intentionally added to the design system first.

- **Spacing & Sizing**
  - Use the project spacing scale (e.g., `p-4`, `m-6`, `gap-2`).
  - Avoid arbitrary pixel values.

- **Border Radius**
  - Use predefined radius tokens/utilities only (e.g., `rounded`, `rounded-lg`).

- **Typography**
  - Use project font sizes/weights/line-height utilities.

## 5. Component Usage

- Prefer shared components from `packages/ui/src/components`.
- Keep customizations token-driven and minimal.
- If overriding behavior/styles, inspect the base shadcn component first and override at the usage site intentionally.

## 6. Example

```tsx
// ✅ Correct
<Button className="bg-primary text-primary-foreground rounded-lg p-4">Click Me</Button>

// ❌ Incorrect
<Button style={{ backgroundColor: '#ff1234', padding: '11px', borderRadius: '7px' }}>Click Me</Button>
```

## 7. Summary

- Source UI tokens from `packages/ui/src/styles/globals.css`.
- Reuse shared primitives/components from `packages/ui`.
- Avoid ad-hoc styling to preserve consistency and maintainability.
