import { XIcon } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { useAppForm } from "@/components/ui/form/hooks";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SelectItem } from "@/components/ui/select";

export const PROJECT_STATUSES = ["draft", "active", "finished"] as const;

export const ProjectFormSchema = z.object({
  name: z.string().min(1),
  status: z.enum(PROJECT_STATUSES),
  description: z.string().transform((v) => v || undefined),
  notifications: z.object({
    email: z.boolean(),
    sms: z.boolean(),
    push: z.boolean(),
  }),
  users: z
    .array(z.object({ email: z.email() }))
    .min(1)
    .max(5),
});

type ProjectFormType = z.infer<typeof ProjectFormSchema>;

export default function HomePage() {
  const form = useAppForm({
    defaultValues: {
      name: "",
      description: "",
      users: [{ email: "" }],
      status: "draft",
      notifications: {
        email: false,
        sms: false,
        push: false,
      },
    } satisfies ProjectFormType as ProjectFormType,
    validators: {
      onSubmit: ProjectFormSchema,
    },
    onSubmit: async ({ value }) => {
      // TODO: implement actual submit logic
    },
  });

  return (
    <div className="container mx-auto my-6 px-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.AppField name="name">
            {(field) => <field.Input label="Name" />}
          </form.AppField>

          <form.AppField name="status">
            {(field) => (
              <field.Select label="Status">
                {PROJECT_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </field.Select>
            )}
          </form.AppField>

          <form.AppField name="description">
            {(field) => (
              <field.Textarea
                description="Be as detailed as possible"
                label="Description"
              />
            )}
          </form.AppField>

          <FieldSet>
            <FieldContent>
              <FieldLegend>Notifications</FieldLegend>
              <FieldDescription>
                Select how you would like to receive notifications.
              </FieldDescription>
            </FieldContent>
            <FieldGroup data-slot="checkbox-group">
              <form.AppField name="notifications.email">
                {(field) => <field.Checkbox label="Email" />}
              </form.AppField>
              <form.AppField name="notifications.sms">
                {(field) => <field.Checkbox label="Text" />}
              </form.AppField>
              <form.AppField name="notifications.push">
                {(field) => <field.Checkbox label="In App" />}
              </form.AppField>
            </FieldGroup>
          </FieldSet>

          <FieldSeparator />

          <form.Field mode="array" name="users">
            {(field) => (
              <FieldSet>
                <div className="flex items-center justify-between gap-2">
                  <FieldContent>
                    <FieldLegend className="mb-0" variant="label">
                      User Email Addresses
                    </FieldLegend>
                    <FieldDescription>
                      Add up to 5 users to this project (including yourself).
                    </FieldDescription>
                    {field.state.meta.errors && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </FieldContent>
                  <Button
                    onClick={() => field.pushValue({ email: "" })}
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    Add User
                  </Button>
                </div>
                <FieldGroup>
                  {field.state.value.map((_, index) => (
                    <form.Field
                      key={index.toString()}
                      name={`users[${index}].email`}
                    >
                      {(innerField) => {
                        const isInvalid =
                          innerField.state.meta.isTouched &&
                          !innerField.state.meta.isValid;
                        return (
                          <Field
                            data-invalid={isInvalid}
                            orientation="horizontal"
                          >
                            <FieldContent>
                              <InputGroup>
                                <InputGroupInput
                                  aria-invalid={isInvalid}
                                  aria-label={`User ${index + 1} email`}
                                  id={innerField.name}
                                  onBlur={innerField.handleBlur}
                                  onChange={(e) =>
                                    innerField.handleChange(e.target.value)
                                  }
                                  type="email"
                                  value={innerField.state.value}
                                />
                                {field.state.value.length > 1 && (
                                  <InputGroupAddon align="inline-end">
                                    <InputGroupButton
                                      aria-label={`Remove User ${index + 1}`}
                                      onClick={() => field.removeValue(index)}
                                      size="icon-xs"
                                      type="button"
                                      variant="ghost"
                                    >
                                      <XIcon />
                                    </InputGroupButton>
                                  </InputGroupAddon>
                                )}
                              </InputGroup>
                              {isInvalid && (
                                <FieldError
                                  errors={innerField.state.meta.errors}
                                />
                              )}
                            </FieldContent>
                          </Field>
                        );
                      }}
                    </form.Field>
                  ))}
                </FieldGroup>
              </FieldSet>
            )}
          </form.Field>

          <Button type="submit">Create</Button>
        </FieldGroup>
      </form>
    </div>
  );
}
