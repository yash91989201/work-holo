import { formOptions } from "@tanstack/react-form";
import { Button } from "@work-holo/ui/components/button";
import { FieldGroup } from "@work-holo/ui/components/field";
import { useAppForm } from "@work-holo/ui/components/form/hooks";
import { Spinner } from "@work-holo/ui/components/spinner";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { ChangePasswordFormSchema } from "@/lib/schemas/settings/security";
import type { ChangePasswordFormType } from "@/lib/types";

const formOpts = formOptions({
  defaultValues: {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    revokeOtherSessions: false,
  } satisfies ChangePasswordFormType as ChangePasswordFormType,
});

export function ChangePasswordForm() {
  const form = useAppForm({
    ...formOpts,
    validators: {
      onSubmit: ChangePasswordFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const { error } = await authClient.changePassword({
          currentPassword: value.currentPassword,
          newPassword: value.newPassword,
          revokeOtherSessions: value.revokeOtherSessions,
        });

        if (error) {
          toast.error(error.message || "Failed to change password");
          return;
        }

        toast.success("Password changed successfully");

        form.reset();
      } catch {
        toast.error("An unexpected error occurred");
      }
    },
  });

  return (
    <div className="space-y-3">
      <h3>Change password</h3>
      <form.AppForm>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
            <form.AppField
              name="currentPassword"
              validators={{
                onChange: ({ value }) => {
                  if (!value) return "Current password is required";
                  return;
                },
              }}
            >
              {(field) => (
                <field.Input
                  autoComplete="current-password"
                  label="Current password"
                  type="password"
                />
              )}
            </form.AppField>

            <form.AppField
              name="newPassword"
              validators={{
                onChange: ({ value }) => {
                  if (!value) return "New password is required";
                  if (value.length < 8)
                    return "Password must be at least 8 characters long";
                  return;
                },
              }}
            >
              {(field) => (
                <field.Input
                  autoComplete="new-password"
                  description="Must be at least 8 characters long"
                  label="New password"
                  type="password"
                />
              )}
            </form.AppField>

            <form.AppField
              name="confirmPassword"
              validators={{
                onChangeListenTo: ["newPassword"],
                onChange: ({ value, fieldApi }) => {
                  if (!value) return "Please confirm your new password";
                  const newPassword =
                    fieldApi.form.getFieldValue("newPassword");
                  if (value !== newPassword) return "Passwords do not match";
                  return;
                },
              }}
            >
              {(field) => (
                <field.Input
                  autoComplete="new-password"
                  label="Confirm New password"
                  type="password"
                />
              )}
            </form.AppField>

            <form.AppField name="revokeOtherSessions">
              {(field) => <field.Checkbox label="Logout from other devices" />}
            </form.AppField>

            <div className="flex justify-end">
              <form.Subscribe
                selector={(state) => [
                  state.canSubmit,
                  state.isValidating,
                  state.isSubmitting,
                ]}
              >
                {([canSubmit, isValidating, isSubmitting]) => (
                  <Button
                    disabled={!canSubmit || isValidating || isSubmitting}
                    type="submit"
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner />
                        Updating password...
                      </>
                    ) : (
                      "Update password"
                    )}
                  </Button>
                )}
              </form.Subscribe>
            </div>
          </FieldGroup>
        </form>
      </form.AppForm>
    </div>
  );
}
