import { Loader2, Plus } from "lucide-react";
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
import { useAppForm } from "@/components/ui/form/hooks";
import { authClient } from "@/lib/auth-client";
import { CreateTeamFormSchema } from "@/lib/schemas/admin/team";
import { queryClient, queryUtils } from "@/utils/orpc";

const baseModules = [
  { id: "communication", name: "Communication" },
  { id: "attendance", name: "Attendance" },
];

export const CreateTeamForm = () => {
  const [open, setOpen] = React.useState(false);

  const form = useAppForm({
    defaultValues: {
      name: "",
      modules: [...baseModules.map((module) => module.id)],
    },
    validators: {
      onSubmit: (value) => CreateTeamFormSchema.parse(value),
    },
    onSubmit: async ({ value: formData }) => {
      try {
        const { data, error } = await authClient.organization.createTeam({
          name: formData.name,
        });

        if (error !== null) {
          throw new Error(error.message);
        }

        if (data === null) {
          throw new Error("Failed to create team");
        }

        queryClient.refetchQueries({
          queryKey: queryUtils.admin.team.listTeams.queryKey({}),
        });

        toast.success(`${data.name} team created successfully`);
        form.reset();
        setOpen(false);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
      }
    },
  });

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger>
        <Button className="gap-1.5">
          <Plus className="h-4 w-4" />
          Create Team
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="font-bold text-2xl">
            Create New Team
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Create a new team to organize your members and projects
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <form className="space-y-4" onSubmit={form.handleSubmit}>
            <form.AppField name="name">
              {(field) => (
                <field.Input
                  className="h-11"
                  label="Team Name"
                  placeholder="Enter team name (e.g., Development, Design)"
                />
              )}
            </form.AppField>

            <form.AppField name="modules">
              {(field) => (
                <div className="space-y-2">
                  <label className="font-medium text-sm">Base Modules</label>
                  <div className="space-y-3">
                    {baseModules.map((module) => (
                      <div
                        className="flex flex-row items-start space-x-3 space-y-0"
                        key={module.id}
                      >
                        <Checkbox
                          checked={(field.state.value || []).includes(
                            module.id
                          )}
                          disabled
                          onCheckedChange={(checked) => {
                            const currentValues = field.state.value || [];
                            const newValue = checked
                              ? [...currentValues, module.id]
                              : currentValues.filter(
                                  (value) => value !== module.id
                                );
                            field.handleChange(newValue);
                          }}
                        />
                        <label className="font-normal text-sm">
                          {module.name}
                        </label>
                      </div>
                    ))}
                  </div>
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-destructive text-xs">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.AppField>

            <Button
              className="h-11 w-full font-medium"
              disabled={form.state.isSubmitting}
              type="submit"
            >
              {form.state.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Creating Team...</span>
                </>
              ) : (
                <span>Create Team</span>
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
