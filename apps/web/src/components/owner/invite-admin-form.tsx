import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/components/ui/form/hooks";
import { Spinner } from "@/components/ui/spinner";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { getAuthQueryKey } from "@/lib/auth/query-keys";
import { authClient } from "@/lib/auth-client";
import { InviteAdminFormSchema } from "@/lib/schemas/owner";
import type { InviteAdminFormType } from "@/lib/types";
import { queryClient } from "@/utils/orpc";

export const InviteAdminForm = () => {
  const [open, onOpenChange] = useState(false);
  const { session } = useAuthedSession();
  const orgId = session.activeOrganizationId ?? "";

  const form = useAppForm({
    defaultValues: {
      email: "",
    } satisfies InviteAdminFormType as InviteAdminFormType,
    validators: {
      onSubmit: InviteAdminFormSchema,
    },
    onSubmit: async ({ value: formData }) => {
      try {
        const { data: _, error } = await authClient.organization.inviteMember({
          email: formData.email,
          role: "admin",
        });

        if (error != null) {
          throw new Error(error.message);
        }

        queryClient.invalidateQueries({
          queryKey: getAuthQueryKey.organization.invitations(orgId),
        });

        toast.success("Admin invitation sent successfully");
        form.reset();
        onOpenChange(false);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
      }
    },
  });

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogTrigger asChild>{<Button>Invite Admin</Button>}</DialogTrigger>
      <DialogContent className="sm:max-w-105">
        <DialogHeader>
          <DialogTitle>Invite Admin</DialogTitle>
          <DialogDescription>
            Send an invitation to a new admin member
          </DialogDescription>
        </DialogHeader>
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
                    placeholder="admin@example.com"
                    type="email"
                  />
                )}
              </form.AppField>
            </FieldGroup>
            <DialogFooter>
              <Button
                onClick={() => onOpenChange(false)}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
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
                        Sending Invitation...
                      </>
                    ) : (
                      "Send Invitation"
                    )}
                  </Button>
                )}
              </form.Subscribe>
            </DialogFooter>
          </form>
        </form.AppForm>
      </DialogContent>
    </Dialog>
  );
};
