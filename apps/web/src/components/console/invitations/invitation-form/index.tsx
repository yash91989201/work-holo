import {
  IconPlus,
  IconShieldFilled,
  IconUserFilled,
} from "@tabler/icons-react";
import { useSearch } from "@tanstack/react-router";
import { Button } from "@work-holo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@work-holo/ui/components/dialog";
import { FieldGroup } from "@work-holo/ui/components/field";
import { useAppForm } from "@work-holo/ui/components/form/hooks";
import { SelectItem } from "@work-holo/ui/components/select";
import { Spinner } from "@work-holo/ui/components/spinner";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { InvitationFormSchema } from "@/lib/schemas/member";
import { queryClient, queryUtils } from "@/utils/orpc";
import { inviteFormOpts } from "./form-options";
import { TeamsDropdown } from "./teams-dropdown";

export const InvitationForm = () => {
  const search = useSearch({
    from: "/(authenticated)/org/$slug/console/members/invitations",
    shouldThrow: false,
  });

  const [isOpen, setIsOpen] = useState(search?.inviteMemberForm === "open");

  const form = useAppForm({
    ...inviteFormOpts,
    validators: {
      onSubmit: InvitationFormSchema,
    },
    onSubmit: async ({ value: formData }) => {
      try {
        const { data: _, error } = await authClient.organization.inviteMember({
          email: formData.email,
          role: formData.role,
          ...(formData.role === "member" && { teamId: formData.teamId }),
        });

        if (error !== null) {
          throw new Error(error.message);
        }

        queryClient.invalidateQueries({
          queryKey: queryUtils.org.invitation.list.queryKey({
            input: {},
          }),
        });

        const roleLabel = formData.role === "admin" ? "Admin" : "Member";
        toast.success(`${roleLabel} invitation sent successfully`);
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
      <DialogTrigger
        render={
          <Button>
            <IconPlus className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        }
      />

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite team member</DialogTitle>
          <DialogDescription>
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
              <FieldGroup>
                <form.AppField name="email">
                  {(field) => (
                    <field.Input
                      className="h-11"
                      label="Email Address"
                      placeholder="Enter email address"
                      type="email"
                    />
                  )}
                </form.AppField>

                <form.AppField name="role">
                  {(field) => (
                    <field.Select
                      items={[
                        { value: "admin", label: "Admin" },
                        { value: "member", label: "Member" },
                      ]}
                      label="Role"
                      placeholder="Select a role"
                    >
                      <SelectItem value="admin">
                        <div className="flex items-center gap-2">
                          <IconShieldFilled className="h-4 w-4" />
                          Admin
                        </div>
                      </SelectItem>
                      <SelectItem value="member">
                        <div className="flex items-center gap-2">
                          <IconUserFilled className="h-4 w-4" />
                          Member
                        </div>
                      </SelectItem>
                    </field.Select>
                  )}
                </form.AppField>

                <form.Subscribe selector={(state) => state.values.role}>
                  {(selectedRole) =>
                    selectedRole === "member" && (
                      <Suspense fallback={<TeamsDropdown.Fallback />}>
                        <TeamsDropdown form={form} />
                      </Suspense>
                    )
                  }
                </form.Subscribe>
              </FieldGroup>

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
