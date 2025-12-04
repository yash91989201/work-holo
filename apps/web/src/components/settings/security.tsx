import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/components/ui/form/hooks";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { ChangePasswordFormSchema } from "@/lib/schemas/settings/security";
import type { ChangePasswordFormType } from "@/lib/types";

export function ChangePasswordForm() {
  const form = useAppForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      revokeOtherSessions: false,
    } satisfies ChangePasswordFormType as ChangePasswordFormType,
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

  const isSubmitting = form.state.isSubmitting;

  return (
    <div className="space-y-3">
      <h3>Change password</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <FieldGroup className="p-6">
            <form.AppField name="currentPassword">
              {(field) => (
                <field.Input
                  autoComplete="current-password"
                  label="Current password"
                  type="password"
                />
              )}
            </form.AppField>

            <form.AppField name="newPassword">
              {(field) => (
                <field.Input
                  autoComplete="new-password"
                  description="Must be at least 8 characters long"
                  label="New password"
                  type="password"
                />
              )}
            </form.AppField>

            <form.AppField name="confirmPassword">
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
              <Button disabled={isSubmitting}>
                {isSubmitting ? "Updating password..." : "Update password"}
              </Button>
            </div>
          </FieldGroup>
        </div>
      </form>
    </div>
  );
}

export function Manage2FA() {
  return (
    <div className="space-y-3">
      <h3>Two-Factor authentication</h3>
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <Item>
          <ItemContent>
            <ItemTitle>Display full names</ItemTitle>
            <ItemDescription>
              Show full names instead of short usernames
            </ItemDescription>
          </ItemContent>
          <ItemActions>action</ItemActions>
        </Item>
        <Separator />
      </div>
    </div>
  );
}

export function ManagePasskeys() {
  return (
    <div className="space-y-3">
      <h3>Passkeys</h3>
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <Item>
          <ItemContent>
            <ItemTitle>Display full names</ItemTitle>
            <ItemDescription>
              Show full names instead of short usernames
            </ItemDescription>
          </ItemContent>
          <ItemActions>action</ItemActions>
        </Item>
        <Separator />
      </div>
    </div>
  );
}
