import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { formOptions } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@work-holo/ui/components/button";
import { FieldGroup } from "@work-holo/ui/components/field";
import { useAppForm } from "@work-holo/ui/components/form/hooks";
import {
  InputGroupAddon,
  InputGroupButton,
} from "@work-holo/ui/components/input-group";
import { Spinner } from "@work-holo/ui/components/spinner";
import { authClient } from "@/lib/auth-client";
import { LogInFormSchema } from "@/lib/schemas/auth";
import type { LogInFormType } from "@/lib/types";
import { getOrgRouteByRole } from "@/utils";

const formOpts = formOptions({
  defaultValues: {
    identifier: "",
    password: "",
    formState: {
      showPassword: false,
    },
  } satisfies LogInFormType as LogInFormType,
});

export function LogInForm() {
  const navigate = useNavigate();

  const form = useAppForm({
    ...formOpts,
    validators: {
      onSubmit: LogInFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const isEmail = value.identifier.includes("@");
        const loginResult = isEmail
          ? await authClient.signIn.email({
              email: value.identifier,
              password: value.password,
            })
          : await authClient.signIn.username({
              username: value.identifier,
              password: value.password,
            });

        if (loginResult?.error) {
          throw new Error(loginResult.error.message);
        }

        const userRole = loginResult?.data?.user?.role as string | undefined;
        const adminRoles = ["admin", "super_admin", "support"];
        if (userRole && adminRoles.includes(userRole)) {
          navigate({ to: "/platform/dashboard" });
          return;
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

          const { data: userTeams } =
            await authClient.organization.listUserTeams();

          if (userTeams && userTeams.length > 0) {
            await authClient.organization.setActiveTeam({
              teamId: userTeams[0].id,
            });
          }

          const { data: memberData } =
            await authClient.organization.getActiveMemberRole();
          navigate(getOrgRouteByRole(memberData?.role ?? "member", org.slug));
          return;
        }

        navigate({ to: "/org/new" });
      } catch (err) {
        form.setFieldMeta("identifier", (prev) => ({
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
          <form.AppField name="identifier">
            {(field) => (
              <field.Input
                autoComplete="username"
                label="Email or Username"
                placeholder="Enter your email or username"
                type="text"
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
