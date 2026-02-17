import { IconPlus } from "@tabler/icons-react";
import React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { useAppForm } from "@/components/ui/form/hooks";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { CreateTeamFormSchema } from "@/lib/schemas/team";
import { queryClient, queryUtils } from "@/utils/orpc";

const baseModules = [
  { id: "communication", name: "Communication" },
  { id: "attendance", name: "Attendance" },
];

export const CreateTeamForm = () => {
  const [open, setOpen] = React.useState(false);

  // Initialize form
  const form = useAppForm({
    defaultValues: {
      name: "",
      modules: baseModules.map((m) => m.id),
    },
    validators: {
      onSubmit: CreateTeamFormSchema,
    },
    onSubmit: async ({ value }) => {
      const { data, error } = await authClient.organization.createTeam({
        name: value.name,
      });

      if (error) throw new Error(error.message);
      if (!data) throw new Error("Failed to create team");

      // Refresh team list
      queryClient.refetchQueries({
        queryKey: queryUtils.admin.team.listTeams.queryKey({}),
      });

      toast.success(`${data.name} team created successfully`);
      form.reset();
      setOpen(false);
    },
  });

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button className="gap-1.5">
          <IconPlus className="h-4 w-4" />
          Create Team
        </Button>
      </DialogTrigger>

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
