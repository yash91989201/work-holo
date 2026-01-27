import { formOptions } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/components/ui/form/hooks";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { LogInFormSchema } from "@/lib/schemas/auth";
import type { LogInFormType } from "@/lib/types";

const formOpts = formOptions({
  defaultValues: {
    email: "",
    password: "",
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

          navigate({
            to: "/org/$slug/attendance",
            params: { slug: org.slug },
          });
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

          <form.AppField name="password">
            {(field) => (
              <field.Input
                label="Password"
                placeholder="Enter your password"
                type="password"
              />
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
