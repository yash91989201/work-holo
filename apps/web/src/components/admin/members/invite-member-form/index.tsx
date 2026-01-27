import { PlusIcon } from "lucide-react";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAppForm } from "@/components/ui/form/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { InviteMemberFormSchema } from "@/lib/schemas/admin/member";
import { queryClient, queryUtils } from "@/utils/orpc";
import { inviteFormOpts } from "./form-options";
import { TeamsDropdown } from "./teams-dropdown";

export const InviteMemberForm = () => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useAppForm({
    ...inviteFormOpts,
    validators: {
      onSubmit: InviteMemberFormSchema,
    },
    onSubmit: async ({ value: formData }) => {
      try {
        const { data: _, error } = await authClient.organization.inviteMember({
          ...formData,
          role: "member",
        });

        if (error !== null) {
          throw new Error(error.message);
        }

        queryClient.invalidateQueries({
          queryKey: queryUtils.admin.invitation.listInvitations.queryKey({
            input: {},
          }),
        });

        toast.success("Member invitation sent successfully");
        form.reset();
        setIsOpen(false);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
      }
    },
  });

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="font-bold text-2xl">
            Invite Team Member
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Send an invitation email to add a new member to your organization
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <form.AppForm>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              <form.AppField name="email">
                {(field) => (
                  <field.Input
                    className="h-11"
                    label="Email Address"
                    placeholder="Enter member's email address"
                    type="email"
                  />
                )}
              </form.AppField>

              <Suspense fallback={<Skeleton className="h-9 w-full" />}>
                <TeamsDropdown form={form} />
              </Suspense>

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
            </form>
          </form.AppForm>
        </div>
      </DialogContent>
    </Dialog>
  );
};
