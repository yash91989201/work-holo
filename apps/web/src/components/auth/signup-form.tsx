import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { formOptions } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@work-holo/ui/components/button";
import { FieldGroup } from "@work-holo/ui/components/field";
import { useAppForm } from "@work-holo/ui/components/form/hooks";
import {
  InputGroupAddon,
  InputGroupButton,
} from "@work-holo/ui/components/input-group";
import { Spinner } from "@work-holo/ui/components/spinner";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { SignUpFormSchema } from "@/lib/schemas/auth";
import type { SignUpFormType } from "@/lib/types";

const formOpts = formOptions({
  defaultValues: {
    name: "",
    username: "",
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
  const navigate = useNavigate();

  const { mutateAsync: signup } = useMutation({
    mutationKey: ["signup"],
    mutationFn: async (values: SignUpFormType) =>
      await authClient.signUp.email(values),
  });

  const form = useAppForm({
    ...formOpts,
    validators: {
      onSubmitAsync: SignUpFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const signupRes = await signup(value);
        if (signupRes.error) {
          throw new Error(signupRes.error.message);
        }

        navigate({ to: "/org/new" });
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Signup failed");
      }
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

          <form.AppField
            name="username"
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: async ({ value }) => {
                const result =
                  await SignUpFormSchema.shape.username.safeParseAsync(value);

                return result.success
                  ? undefined
                  : result.error.issues[0]?.message;
              },
            }}
          >
            {(field) => (
              <field.InputGroup label="Username">
                <field.InputGroupInput placeholder="Enter unique username" />
                <field.InputGroupSpinner />
              </field.InputGroup>
            )}
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
