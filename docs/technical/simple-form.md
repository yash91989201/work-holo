# Simple Form Implementation Instructions

This document explains how to implement **simple forms** (single component forms) using **TanStack Form**, **Zod**, and **shadcn/ui**.

---

## 📂 Project Structure

- **Schemas** → `src/lib/schemas/`
- **Types** → `src/lib/types/` (inferred with `z.infer`)
- **Form Components** → co-located in feature folders
- **Form Hooks** → `src/components/ui/form/hooks.tsx` (exports `useAppForm`)

---

## 🧩 Schema & Types

- Define schemas in `src/lib/schemas/`.
- Always suffix with `FormSchema` (e.g., `LogInFormSchema`, `CreateFeedbackFormSchema`).
- Export inferred types in `src/lib/types` (auto-generated from schemas):

```ts
export type LogInFormType = z.infer<typeof LogInFormSchema>;
```

---

## 🛠 Setup with useAppForm

Import the custom hook from your form utilities:

```ts
import { useAppForm } from "@/components/ui/form/hooks";
```

Initialize the form with default values and validators:

```ts
const form = useAppForm({
  defaultValues: {
    email: "",
    password: "",
  },
  validators: {
    onSubmit: (value) => LogInFormSchema.parse(value),
  },
  onSubmit: async ({ value }) => {
    // Handle submission
    await createExample(value);
  },
});
```

Render the form using `form.AppForm` and `form.AppField`:

```tsx
<form.AppForm>
  <form onSubmit={form.handleSubmit} className="space-y-4">
    <form.AppField name="email">
      {(field) => (
        <div className="space-y-2">
          <label className="font-medium text-sm">Email</label>
          <input
            type="email"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="Enter your email"
          />
          {field.state.meta.errors.length > 0 ? (
            <p className="text-destructive text-xs">
              {String(field.state.meta.errors[0])}
            </p>
          ) : null}
        </div>
      )}
    </form.AppField>
  </form>
</form.AppForm>
```

---

## 🎨 Using Field Components

TanStack Form provides built-in field components for common inputs:

```tsx
<form.AppField name="email">
  {(field) => (
    <field.Input
      label="Email"
      placeholder="Enter your email"
      type="email"
    />
  )}
</form.AppField>
```

Available field components:
- `field.Input` - Text inputs
- `field.Textarea` - Textarea
- `field.Select` - Select dropdown
- `field.Checkbox` - Checkbox
- `field.FileInput` - File upload

---

## 🔄 Mutations & Submissions

- Always use `useMutation` with `queryUtils.*.mutationOptions()`.
- Handle side effects (`toast`, `invalidateQueries`, `navigate`) in `mutationOptions` or `onSubmit`.

```ts
const { mutateAsync: createExample, isPending } = useMutation(
  queryUtils.example.create.mutationOptions({
    onSuccess: () => toast.success("Form submitted successfully"),
    onError: (err) => toast.error(err.message),
  })
);
```

---

## 🔒 UX Rules

1. **Buttons**
   - `<button>` defaults to `type="submit"`.
   - Use `type="button"` for non-submit actions.
   - Use `type="reset"` for reset actions.
   - Omit `type` when the button should submit the form.
2. **Validation** → always show field errors using `field.state.meta.errors`.
3. **Loading state** → disable submit button when submitting:
   ```tsx
   <Button disabled={isPending || form.state.isSubmitting}>
     {form.state.isSubmitting ? "Submitting..." : "Submit"}
   </Button>
   ```
4. **Reset** → call `form.reset()` after successful submission if needed.

---

## 📝 Complete Example (Simple Form)

```tsx
"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/components/ui/form/hooks";
import { ExampleFormSchema } from "@/lib/schemas/example";
import type { ExampleFormType } from "@/lib/types";
import { queryUtils } from "@/utils/orpc";

export function ExampleForm() {
  const { mutateAsync: createExample, isPending } = useMutation(
    queryUtils.example.create.mutationOptions({
      onSuccess: () => toast.success("Form submitted successfully"),
      onError: (err) => toast.error(err.message),
    })
  );

  const form = useAppForm({
    defaultValues: {
      name: "",
      email: "",
    },
    validators: {
      onSubmit: (value) => ExampleFormSchema.parse(value),
    },
    onSubmit: async ({ value }) => {
      await createExample(value);
      form.reset();
    },
  });

  return (
    <form.AppForm>
      <form onSubmit={form.handleSubmit} className="space-y-4">
        <form.AppField name="name">
          {(field) => (
            <field.Input
              label="Name"
              placeholder="Enter name"
            />
          )}
        </form.AppField>

        <form.AppField name="email">
          {(field) => (
            <field.Input
              label="Email"
              placeholder="Enter email"
              type="email"
            />
          )}
        </form.AppField>

        <Button disabled={isPending || form.state.isSubmitting}>
          {isPending || form.state.isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </form.AppForm>
  );
}
```

---

## 🎯 Key TanStack Form Patterns

### Accessing Field State
```tsx
<form.AppField name="fieldName">
  {(field) => (
    <div>
      {/* Current value */}
      <input value={field.state.value} />
      
      {/* Handle changes */}
      <input onChange={(e) => field.handleChange(e.target.value)} />
      
      {/* Display errors */}
      {field.state.meta.errors.length > 0 ? (
        <p className="text-destructive text-xs">
          {String(field.state.meta.errors[0])}
        </p>
      ) : null}
    </div>
  )}
</form.AppField>
```

### Form State
```tsx
// Check if form is submitting
form.state.isSubmitting

// Check if form is valid
form.state.isValid

// Check if fields are validating
form.state.isFieldsValidating

// Reset form to initial values
form.reset()

// Set specific field value
form.setFieldValue("email", "user@example.com")
```

---

## 🔧 Custom Validation

For custom validation beyond Zod schemas:

```tsx
const form = useAppForm({
  defaultValues: { /* ... */ },
  validators: {
    // Validate on submit
    onSubmit: (value) => MyFormSchema.parse(value),
    
    // Validate on change
    onChange: (value) => {
      // Custom validation logic
      if (value.password !== value.confirmPassword) {
        return "Passwords must match";
      }
    },
  },
});
```
