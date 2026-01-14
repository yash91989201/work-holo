import { useStore } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Loader, Plus } from "lucide-react";
import { Suspense, useState } from "react";
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
import { useAppForm } from "@/components/ui/form/hooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { CreateChannelFormSchema } from "@/lib/schemas/memeber/channel";
import type { CreateChannelFormType } from "@/lib/types";
import { queryClient, queryUtils } from "@/utils/orpc";
import { MembersSelect, MembersSelectSkeleton } from "./members-select";
import { TeamSelect, TeamSelectSkeleton } from "./team-select";

export const CreateChannelForm = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useAuthedSession();

<<<<<<< HEAD
  // Mutation to create a channel
=======
>>>>>>> 2975589fb2bd0978c9dc51bdba58eaed20ef03e0
  const { mutateAsync: createChannel, isPending } = useMutation(
    queryUtils.communication.channel.create.mutationOptions({
      onSuccess: () => {
        // Refetch channels list
        queryClient.refetchQueries({
          queryKey: queryUtils.communication.channel.list.queryKey({
            input: {},
          }),
        });

        toast.success("Channel created successfully");
        setDialogOpen(false);
        form.reset();
      },
      onError: (error) => {
        toast.message("Failed to create channel", {
          description:
            error instanceof Error ? error.message : "Unknown error occurred",
        });
      },
    })
  );

<<<<<<< HEAD

=======
>>>>>>> 2975589fb2bd0978c9dc51bdba58eaed20ef03e0
  const form = useAppForm({
    defaultValues: {
      name: "",
      description: "",
      isPublic: true,
      type: "team",
      teamId: undefined,
      memberIds: [],
      createdBy: user.id,
    } satisfies CreateChannelFormType as CreateChannelFormType,
    validators: {
      onSubmit: CreateChannelFormSchema,
    },
    onSubmit: async ({ value }) => {
      await createChannel(value);
    },
  });

  const channelType = useStore(form.store, (state) => state.values.type);

  const onReset = () => {
    form.reset();
  };

  return (
    <Dialog onOpenChange={setDialogOpen} open={dialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-1" />
          New channel
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Channel</DialogTitle>
          <DialogDescription>
            Create a new channel for your team to communicate and collaborate.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.AppField name="name">
            {(field) => (
              <field.Input
                label="Channel Name"
                placeholder="Enter channel name"
              />
            )}
          </form.AppField>

          <form.AppField name="description">
            {(field) => <field.Input label="Enter Channel Description" />}
          </form.AppField>

          <form.AppField name="type">
            {(field) => (
              <field.Select label="Channel Type">
                <Select
                  onValueChange={field.handleChange}
                  value={field.state.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select channel type" />
                  </SelectTrigger>
<<<<<<< HEAD
=======

>>>>>>> 2975589fb2bd0978c9dc51bdba58eaed20ef03e0
                  <SelectContent>
                    <SelectItem value="team">Team</SelectItem>
                    <SelectItem value="group">Group</SelectItem>
                  </SelectContent>
<<<<<<< HEAD
                  s
=======
>>>>>>> 2975589fb2bd0978c9dc51bdba58eaed20ef03e0
                </Select>
              </field.Select>
            )}
          </form.AppField>

          {channelType === "team" ? (
            <Suspense fallback={<TeamSelectSkeleton />}>
<<<<<<< HEAD
              <TeamSelect createChannel={createChannel} />
            </Suspense>
          ) : (
            <Suspense fallback={<MembersSelectSkeleton />}>
              <MembersSelect createChannel={createChannel} />
            </Suspense>



=======
              <TeamSelect />
            </Suspense>
          ) : (
            <Suspense fallback={<MembersSelectSkeleton />}>
              <MembersSelect />
            </Suspense>
>>>>>>> 2975589fb2bd0978c9dc51bdba58eaed20ef03e0
          )}

          <DialogFooter className="flex gap-2">
            <Button onClick={onReset} type="button" variant="outline">
              Reset
            </Button>

            <Button disabled={isPending} type="submit">
              {isPending ? (
                <>
                  <Loader className="mr-1.5 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Channel"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
