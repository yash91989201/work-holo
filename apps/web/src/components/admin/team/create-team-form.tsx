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

  // Initialize form
  const form = useAppForm({
    defaultValues: {
      name: "",
      modules: baseModules.map((m) => m.id),
    },
    onSubmit: async ({ value }) => {
      try {
        // Parse value with Zod schema to validate
        const parsed = CreateTeamFormSchema.parse({
          name: value.name ?? "",
          modules: Array.isArray(value.modules) ? value.modules : [],
        });

        // Call API to create team
        const { data, error } = await authClient.organization.createTeam({
          name: parsed.name,

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
      } catch (err: any) {
        // Handle Zod validation errors
        if (err?.errors) {
          err.errors.forEach((e: any) => {
            toast.error(e.message);
          });
        } else {
          toast.error(err instanceof Error ? err.message : "Something went wrong");
        }
      }
    },
  });

  // Prevent page reload
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.handleSubmit(e);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1.5">
          <Plus className="h-4 w-4" />
          Create Team
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="font-bold text-2xl">Create New Team</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Create a new team to organize your members and projects
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Team Name */}
          <form.AppField name="name">
            {(field) => (
              <div>
                <field.Input
                  label="Team Name"
                  placeholder="Enter team name"
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="h-11"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-destructive text-xs">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </form.AppField>

          {/* Base Modules */}
          <form.AppField name="modules">
            {(field) => (
              <div className="space-y-2">
                <label className="font-medium text-sm">Base Modules</label>
                <div className="space-y-3">
                  {baseModules.map((module) => (
                    <div key={module.id} className="flex items-center space-x-3">
                      <Checkbox
                        checked={(field.state.value ?? []).includes(module.id)}
                        onCheckedChange={(checked) => {
                          const current = field.state.value ?? [];
                          const next = checked
                            ? [...current, module.id]
                            : current.filter((v) => v !== module.id);
                          field.handleChange(next);
                        }}
                      />
                      <span className="text-sm">{module.name}</span>
                    </div>
                  ))}
                </div>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-destructive text-xs">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </form.AppField>

          {/* Submit */}
          <Button
            type="submit"
            className="h-11 w-full font-medium"
            disabled={form.state.isSubmitting}
          >
            {form.state.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Team...
              </>
            ) : (
              "Create Team"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
