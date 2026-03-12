import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { formOptions } from "@tanstack/react-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/components/ui/form/hooks";
import { InputGroupAddon, InputGroupButton } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { SignUpFormSchema } from "@/lib/schemas/auth";
import type { SignUpFormType } from "@/lib/types";

const formOpts = formOptions({
  defaultValues: {
    name: "",
    displayUsername: "",
    email: "",
    password: "",
    confirmPassword: "",
    formState: {
      showPassword: false,
      showConfirmPassword: false,
    },
  } satisfies SignUpFormType as SignUpFormType,
});

export function SignUpForm() {
  const form = useAppForm({
    ...formOpts,
    validators: {
      onSubmitAsync: SignUpFormSchema,
    },
    onSubmit: () => {
      toast.success("Workholo is launching soon... ");
    },
  });

  return (
    <form.AppForm>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.AppField name="name">
            {(field) => <field.Input label="Name" placeholder="Full name" />}
          </form.AppField>

          <form.AppField name="displayUsername">
            {(field) => (
              <field.Input
                label="Display Username"
                placeholder="Enter display username"
              />
            )}
          </form.AppField>

          <form.AppField name="email">
            {(field) => (
              <field.Input
                label="Email"
                placeholder="Enter email address"
                type="email"
              />
            )}
          </form.AppField>

          <form.AppField name="formState.showPassword">
            {(showPasswordField) => (
              <form.AppField name="password">
                {(field) => (
                  <field.InputGroup label="Password">
                    <field.InputGroupInput
                      placeholder="Enter password"
                      type={showPasswordField.state.value ? "text" : "password"}
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        aria-label={
                          showPasswordField.state.value
                            ? "Hide password"
                            : "Show password"
                        }
                        onClick={() =>
                          showPasswordField.handleChange(
                            !showPasswordField.state.value
                          )
                        }
                      >
                        {showPasswordField.state.value ? (
                          <IconEyeOff className="size-4" />
                        ) : (
                          <IconEye className="size-4" />
                        )}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </field.InputGroup>
                )}
              </form.AppField>
            )}
          </form.AppField>

          <form.AppField name="formState.showConfirmPassword">
            {(showConfirmPasswordField) => (
              <form.AppField name="confirmPassword">
                {(field) => (
                  <field.InputGroup label="Confirm Password">
                    <field.InputGroupInput
                      placeholder="Confirm password"
                      type={
                        showConfirmPasswordField.state.value
                          ? "text"
                          : "password"
                      }
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        aria-label={
                          showConfirmPasswordField.state.value
                            ? "Hide password"
                            : "Show password"
                        }
                        onClick={() =>
                          showConfirmPasswordField.handleChange(
                            !showConfirmPasswordField.state.value
                          )
                        }
                      >
                        {showConfirmPasswordField.state.value ? (
                          <IconEyeOff className="size-4" />
                        ) : (
                          <IconEye className="size-4" />
                        )}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </field.InputGroup>
                )}
              </form.AppField>
            )}
          </form.AppField>

          <form.Subscribe
            selector={(state) => [
              state.canSubmit,
              state.isValidating,
              state.isSubmitting,
            ]}
          >
            {([canSubmit, isValidating, isSubmitting]) => (
              <Button
                className="w-full gap-1.5"
                disabled={!canSubmit || isValidating || isSubmitting}
                type="submit"
              >
                {isSubmitting ? (
                  <>
                    <Spinner />
                    Signing up...
                  </>
                ) : (
                  "Sign up"
                )}
              </Button>
            )}
          </form.Subscribe>
        </FieldGroup>
      </form>
    </form.AppForm>
  );
}
