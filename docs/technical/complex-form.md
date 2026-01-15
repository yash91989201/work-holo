# Complex / Nested Form Implementation Instructions

This document explains how to implement **nested or multi-section forms** using **TanStack Form**, **Zod**, **formOptions**, and **shadcn/ui**.

---

## 📂 Project Structure

- **Schemas** → `src/lib/schemas/`
- **Types** → `src/lib/types/` (inferred with `z.infer`)
- **Form Options** → `form-options.ts` in the form component folder
- **Subcomponents** → each section in its own file (e.g., `ExamDetailsCard`, `ExamQuestionsSection`)
- **Form Hooks** → `src/components/ui/form/hooks.tsx` (exports `useAppForm` and `withForm`)

---

## 🧩 Schema & Types

- Define schemas in `src/lib/schemas/`.
- Always suffix with `FormSchema` (e.g., `CreateExamFormSchema`).
- Export inferred types in `src/lib/types` (auto-generated from schemas):

```ts
export type CreateExamFormSchemaType = z.infer<typeof CreateExamFormSchema>;
```

---

## 🎨 Form Options Pattern (Recommended for Complex Forms)

For complex forms with multiple subcomponents, create a **form-options.ts** file to define shared form configuration:

**`form-options.ts`**
```ts
import { formOptions } from "@tanstack/react-form";

export const examFormOpts = formOptions({
  defaultValues: {
    certification: "",
    questions: [] as Array<{ text: string; options: string[] }>,
  },
});
```

This provides:
- Type inference for all subcomponents
- Single source of truth for default values
- Easy to share across parent and child components

---

## 🛠 Setup with useAppForm & withForm

### Parent Component (Form Root)

```ts
import { useAppForm } from "@/components/ui/form/hooks";
import { examFormOpts } from "./form-options";

const form = useAppForm({
  ...examFormOpts,
  validators: {
    onSubmit: (value) => CreateExamFormSchema.parse(value),
  },
  onSubmit: async ({ value }) => {
    await createExam(value);
  },
});
```

### Child Components (Form Sections)

Use `withForm` HOC to access form context in subcomponents:

```ts
import { withForm } from "@/components/ui/form/hooks";
import { examFormOpts } from "./form-options";

export const ExamDetailsCard = withForm({
  ...examFormOpts,
  render({ form }) {
    return (
      <form.AppField name="certification">
        {(field) => (
          <field.Input label="Certification" placeholder="Enter certification" />
        )}
      </form.AppField>
    );
  },
});
```

**Why use `withForm`?**
- Automatic type inference from `formOptions`
- Access to the form instance via `form` prop
- No prop drilling required
- Type-safe field access

---

## 🧱 Dynamic Fields (Arrays)

For lists of items (e.g., questions, options), use standard array manipulation with field subscriptions:

```tsx
export const QuestionsSection = withForm({
  ...examFormOpts,
  render({ form }) {
    const questions = useStore(
      form.store,
      (state) => state.values.questions
    );

    const addQuestion = () => {
      const current = form.getFieldValue("questions") || [];
      form.setFieldValue("questions", [
        ...current,
        { text: "", options: [] },
      ]);
    };

    const removeQuestion = (index: number) => {
      const current = form.getFieldValue("questions") || [];
      form.setFieldValue(
        "questions",
        current.filter((_, i) => i !== index)
      );
    };

    return (
      <Card className="p-4 space-y-4">
        {questions.map((_, index) => (
          <div key={index} className="space-y-4">
            <form.AppField name={`questions[${index}].text`}>
              {(field) => (
                <field.Input
                  label={`Question ${index + 1}`}
                  placeholder="Enter question"
                />
              )}
            </form.AppField>
            <Button
              type="button"
              variant="destructive"
              onClick={() => removeQuestion(index)}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button type="button" onClick={addQuestion}>
          Add Question
        </Button>
      </Card>
    );
  },
});
```

---

## 🔄 Reactive State with useStore

For components that need to react to form value changes:

```ts
import { useStore } from "@tanstack/react-store";

export const ConditionalSection = withForm({
  ...examFormOpts,
  render({ form }) {
    // Subscribe to specific field changes
    const examType = useStore(
      form.store,
      (state) => state.values.examType
    );

    // Conditional rendering based on form state
    if (examType === "advanced") {
      return <AdvancedOptions />;
    }

    return <BasicOptions />;
  },
});
```

---

## 🔄 Mutations & Submissions

- Use `useMutation(queryUtils.*.mutationOptions())`.
- Transform form data in `onSubmit` if necessary (e.g., generating IDs, aggregating totals).

---

## 🔒 UX Rules

1. **Buttons**
   - Default is submit → omit `type` when intended for form submission.
   - Use `type="button"` for add/remove actions.
   - Use `type="reset"` for resets.
2. **Subcomponents** → use `withForm` HOC for type-safe form access.
3. **Cards** → use `<Card>` to structure large sections.
4. **Validation & Messages** → always show errors using `field.state.meta.errors`.

---

## 📝 Complete Example (Complex Form)

### `form-options.ts`
```ts
import { formOptions } from "@tanstack/react-form";

export const examFormOpts = formOptions({
  defaultValues: {
    title: "",
    items: [] as Array<{ name: string; quantity: number }>,
  },
});
```

### Parent Component
```tsx
"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/components/ui/form/hooks";
import { ExampleNestedFormSchema } from "@/lib/schemas/example-nested";
import type { ExampleNestedFormType } from "@/lib/types";
import { queryUtils } from "@/utils/orpc";
import { examFormOpts } from "./form-options";
import { ItemsSection } from "./items-section";

export function ExampleNestedForm() {
  const { mutateAsync: createExample } = useMutation(
    queryUtils.example.createNested.mutationOptions({
      onSuccess: () => toast.success("Form submitted successfully"),
      onError: (err) => toast.error(err.message),
    })
  );

  const form = useAppForm({
    ...examFormOpts,
    validators: {
      onSubmit: (value) => ExampleNestedFormSchema.parse(value),
    },
    onSubmit: async ({ value }) => {
      await createExample(value);
    },
  });

  return (
    <form.AppForm>
      <form onSubmit={form.handleSubmit} className="space-y-6">
        <form.AppField name="title">
          {(field) => (
            <field.Input label="Title" placeholder="Enter title" />
          )}
        </form.AppField>
        
        <ItemsSection />
        
        <Button disabled={form.state.isSubmitting}>
          {form.state.isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </form.AppForm>
  );
}
```

### Child Component (`items-section.tsx`)
```tsx
import { useStore } from "@tanstack/react-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { withForm } from "@/components/ui/form/hooks";
import { examFormOpts } from "./form-options";

export const ItemsSection = withForm({
  ...examFormOpts,
  render({ form }) {
    const items = useStore(form.store, (state) => state.values.items);

    const addItem = () => {
      const current = form.getFieldValue("items") || [];
      form.setFieldValue("items", [...current, { name: "", quantity: 1 }]);
    };

    const removeItem = (index: number) => {
      const current = form.getFieldValue("items") || [];
      form.setFieldValue(
        "items",
        current.filter((_, i) => i !== index)
      );
    };

    return (
      <Card className="p-4 space-y-4">
        {items.map((_, index) => (
          <div key={index} className="flex gap-4 items-end">
            <form.AppField name={`items[${index}].name`}>
              {(field) => (
                <field.Input label="Item Name" placeholder="Enter item name" />
              )}
            </form.AppField>
            
            <form.AppField name={`items[${index}].quantity`}>
              {(field) => (
                <div className="space-y-2">
                  <label className="font-medium text-sm">Quantity</label>
                  <input
                    type="number"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    className="border rounded px-3 py-2"
                  />
                </div>
              )}
            </form.AppField>
            
            <Button
              type="button"
              variant="destructive"
              onClick={() => removeItem(index)}
            >
              Remove
            </Button>
          </div>
        ))}
        
        <Button type="button" onClick={addItem}>
          Add Item
        </Button>
      </Card>
    );
  },
});
```

---

## 🎯 Key Patterns for Complex Forms

### 1. Form Options (Type Sharing)
```ts
// form-options.ts - Single source of truth
export const myFormOpts = formOptions({
  defaultValues: { /* ... */ },
});

// Parent uses spreading
const form = useAppForm({
  ...myFormOpts,
  validators: { /* ... */ },
});

// Children use withForm HOC
export const Child = withForm({
  ...myFormOpts,
  render({ form }) { /* ... */ },
});
```

### 2. Reactive Subscriptions
```ts
// Subscribe to specific fields
const fieldValue = useStore(
  form.store,
  (state) => state.values.fieldName
);

// Subscribe to entire form state
const formValues = useStore(
  form.store,
  (state) => state.values
);
```

### 3. Array Field Management
```ts
// Get current array
const current = form.getFieldValue("items") || [];

// Add item
form.setFieldValue("items", [...current, newItem]);

// Remove item
form.setFieldValue("items", current.filter((_, i) => i !== index));

// Update item
const updated = [...current];
updated[index] = newValue;
form.setFieldValue("items", updated);
```

### 4. Conditional Rendering
```tsx
const showAdvanced = useStore(
  form.store,
  (state) => state.values.type === "advanced"
);

return (
  <>
    <BasicFields />
    {showAdvanced && <AdvancedFields />}
  </>
);
```

---

## 🚀 Best Practices

1. **Always use `formOptions`** for complex forms - it provides type inference
2. **Use `withForm` HOC** for child components - no prop drilling needed
3. **Subscribe only to needed fields** - use specific selectors in `useStore`
4. **Keep array operations immutable** - always create new arrays when updating
5. **Validate at submission** - use `onSubmit` validator with Zod schema
6. **Handle loading states** - check `form.state.isSubmitting` for UI feedback
