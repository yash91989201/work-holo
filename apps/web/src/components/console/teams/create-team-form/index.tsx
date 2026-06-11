import { IconPlus } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@work-holo/ui/components/button";
import { Checkbox } from "@work-holo/ui/components/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@work-holo/ui/components/dialog";
import {
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@work-holo/ui/components/field";
import { useAppForm } from "@work-holo/ui/components/form/hooks";
import { Label } from "@work-holo/ui/components/label";
import { Spinner } from "@work-holo/ui/components/spinner";
import type { ReactElement } from "react";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { getAuthQueryKey } from "@/lib/auth/query-keys";
import { authClient } from "@/lib/auth-client";
import { CreateTeamFormSchema } from "@/lib/schemas/team";
import { queryClient, queryUtils } from "@/utils/orpc";
import { baseModules, createTeamFormOpts } from "./form-options";
import { MembersSelect } from "./members-select";

interface CreateTeamFormProps {
  onSuccess?: (team: { id: string; name: string }) => void;
  trigger?: ReactElement;
}

export const CreateTeamForm = ({ trigger, onSuccess }: CreateTeamFormProps) => {
  const [open, setOpen] = useState(false);

  const { mutateAsync: addMembers } = useMutation(
    queryUtils.team.manage.addMember.mutationOptions()
  );

  const form = useAppForm({
    ...createTeamFormOpts,
    validators: {
      onSubmit: CreateTeamFormSchema,
    },
    onSubmit: async ({ value }) => {
      const { data, error } = await authClient.organization.createTeam({
        name: value.name,
      });

      if (error) throw new Error(error.message);
      if (!data) throw new Error("Failed to create team");

      if (value.memberIds.length > 0) {
        await addMembers({ teamId: data.id, userIds: value.memberIds });
      }

      await Promise.all([
        queryClient.refetchQueries({
          queryKey: queryUtils.team.manage.list.queryKey({}),
        }),
        queryClient.invalidateQueries({
          queryKey: getAuthQueryKey.organization.myTeamMemberships(),
        }),
        queryClient.invalidateQueries({
          queryKey: getAuthQueryKey.organization.teams("current"),
        }),
      ]);

      toast.success(`${data.name} team created successfully`);
      form.reset();
      setOpen(false);
      onSuccess?.(data);
    },
  });

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button className="gap-1.5">
              <IconPlus />
              New Team
            </Button>
          )
        }
      />

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
          <DialogDescription>
            Create a new team to organize your members and projects
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
              <form.AppField name="name">
                {(field) => (
                  <field.Input
                    className="h-11"
                    label="Team Name"
                    placeholder="Enter team name"
                  />
                )}
              </form.AppField>

              <Suspense fallback={<MembersSelect.Fallback />}>
                <MembersSelect form={form} />
              </Suspense>

              <form.AppField mode="array" name="modules">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <FieldSet data-invalid={isInvalid}>
                      <FieldLegend variant="label">Base Modules</FieldLegend>
                      <div className="space-y-3" data-slot="checkbox-group">
                        {baseModules.map((module) => {
                          const isChecked = (field.state.value ?? []).includes(
                            module.id
                          );

                          const checkboxId = `module-${module.id}`;

                          return (
                            <div
                              className="flex items-center space-x-3"
                              key={module.id}
                            >
                              <Checkbox
                                checked={isChecked}
                                id={checkboxId}
                                onCheckedChange={(checked) => {
                                  const current = field.state.value ?? [];
                                  const next = checked
                                    ? [...current, module.id]
                                    : current.filter((v) => v !== module.id);
                                  field.handleChange(next);
                                }}
                              />
                              <Label
                                className="font-normal text-sm"
                                htmlFor={checkboxId}
                              >
                                {module.name}
                              </Label>
                            </div>
                          );
                        })}
                      </div>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </FieldSet>
                  );
                }}
              </form.AppField>
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
                  className="h-11 w-full font-medium"
                  disabled={!canSubmit || isValidating || isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? (
                    <>
                      <Spinner />
                      Creating Team...
                    </>
                  ) : (
                    "Create Team"
                  )}
                </Button>
              )}
            </form.Subscribe>
          </form>
        </form.AppForm>
      </DialogContent>
    </Dialog>
  );
};
