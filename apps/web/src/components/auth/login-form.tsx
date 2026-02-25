import { formOptions } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/components/ui/form/hooks";
import { InputGroupAddon, InputGroupButton } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { LogInFormSchema } from "@/lib/schemas/auth";
import type { LogInFormType } from "@/lib/types";
import { getOrgRouteByRole } from "@/utils";

const formOpts = formOptions({
  defaultValues: {
    email: "",
    password: "",
    formState: {
      showPassword: false,
    },
  } satisfies LogInFormType as LogInFormType,
});

export function LogInForm() {
  const navigate = useNavigate();

  const { mutateAsync: login } = useMutation({
    mutationKey: ["login"],
    mutationFn: (values: LogInFormType) => {
      return authClient.signIn.email(values);
    },
  });

  const form = useAppForm({
    ...formOpts,
    validators: {
      onSubmit: LogInFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const loginResult = await login(value);

        if (loginResult?.error) {
          throw new Error(loginResult.error.message);
        }

        const { data: orgs, error } = await authClient.organization.list();

        if (error) {
          throw new Error(error.message);
        }

        if (orgs && orgs.length > 0) {
          const org = orgs[0];

          await authClient.organization.setActive({
            organizationId: org.id,
            organizationSlug: org.slug,
          });

          const { data: memberData } =
            await authClient.organization.getActiveMemberRole();
          navigate(getOrgRouteByRole(memberData?.role ?? "member", org.slug));
          return;
        }

        navigate({ to: "/org/new" });
      } catch (err) {
        form.setFieldMeta("email", (prev) => ({
          ...prev,
          errorMap: {
            onSubmit: err instanceof Error ? err.message : "Login failed",
          },
        }));
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
          <form.AppField name="email">
            {(field) => (
              <field.Input
                label="Email"
                placeholder="Enter your email"
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
                      placeholder="Enter your password"
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
                    Logging in...
                  </>
                ) : (
                  "Log in"
                )}
              </Button>
            )}
          </form.Subscribe>
        </FieldGroup>
      </form>
    </form.AppForm>
  );
}
