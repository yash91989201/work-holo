import { ChevronDown, RefreshCw } from "lucide-react";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { useAppForm } from "@/components/ui/form/hooks";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { useListOrgTeams } from "@/hooks/use-list-org-teams";
import { CreateChannelFormSchema } from "@/lib/schemas/memeber/channel";

export type CreateChannelFormType = z.infer<typeof CreateChannelFormSchema>;

interface TeamSelectProps {
  createChannel: (data: CreateChannelFormType) => Promise<void>;
}

export function TeamSelect({ createChannel }: TeamSelectProps) {
  const { teams, refetchTeams, isRefetching } = useListOrgTeams();
  const { user } = useAuthedSession();

  const form = useAppForm({
    defaultValues: {
      name: "",
      type: "team",
      isPublic: false,
      memberIds: [],
      createdBy: user.id,
      description: "",
      teamId: undefined,
    },

    validators: {
      onSubmit: CreateChannelFormSchema,
    },

    onSubmit: async ({ value }) => {
      await createChannel(value);
    },
  });

  const getId = (name: string) => `channel-${name}`;

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      {/* Channel Name */}
      <form.Field name="name">
        {(field) => {
          const id = getId(field.name);
          const error = field.state.meta.errors?.[0];

          return (
            <div className="space-y-1">
              <label className="font-medium text-sm" htmlFor={id}>
                Channel Name
              </label>

              <Input
                id={id}
                onChange={(e) => field.handleChange(e.target.value)}
                value={field.state.value}
              />

              {error && <p className="text-destructive text-xs">{error}</p>}
            </div>
          );
        }}
      </form.Field>

      {/* Team Select */}
      <form.Field name="teamId">
        {(field) => {
          const id = "team-select";

          return (
            <div className="space-y-1">
              {/* Label + Refetch Button */}
              <div className="flex items-center justify-between font-medium text-sm">
                <label className="flex-1" htmlFor={id}>
                  Teams
                </label>

                <Button
                  className="size-6"
                  disabled={isRefetching}
                  onClick={() => refetchTeams()}
                  size="icon"
                  type="button"
                  variant="outline" // ✅ call it here
                >
                  <RefreshCw
                    className={`size-3 ${isRefetching ? "animate-spin" : ""}`}
                  />
                </Button>
              </div>

              {isLoading ? (
                <TeamSelectSkeleton />
              ) : (
                <>
                  <Select
                    onValueChange={(v) => field.handleChange(v || undefined)}
                    value={field.state.value ?? ""}
                  >
                    <SelectTrigger id={id}>
                      {" "}
                      {/* <-- put the id here */}
                      <SelectValue placeholder="Select team" />
                    </SelectTrigger>

                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {field.state.meta.errors?.[0] && (
                    <p className="text-destructive text-xs">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </>
              )}
            </div>
          );
        }}
      </form.Field>

      {/* Submit Button */}
      <Button
        className="w-full"
        disabled={form.state.isSubmitting}
        type="submit"
      >
        {form.state.isSubmitting ? "Creating..." : "Create Channel"}
      </Button>
    </form>
  );
}

// Skeleton component
export function TeamSelectSkeleton() {
  return (
    <FormItem>
      <FormLabel className="flex items-center justify-between">
        <span className="flex-1">Teams</span>
        <Button className="size-6" disabled size="icon" variant="outline">
          <RefreshCw className="size-3 animate-spin" />
        </Button>
      </FormLabel>

      <FormControl className="animate-pulse">
        <div className="flex h-10 cursor-progress items-center justify-between rounded-md border px-3">
          <p className="text-muted-foreground text-sm">Select a team</p>
          <ChevronDown className="size-4 text-muted-foreground" />
        </div>
      </FormControl>
    </FormItem>
  );
}
