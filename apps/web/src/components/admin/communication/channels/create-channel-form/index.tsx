import { useMutation } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import { Plus } from "lucide-react";
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
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/components/ui/form/hooks";
import { SelectItem } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { CreateChannelFormSchema } from "@/lib/schemas/memeber/channel";
import { queryClient, queryUtils } from "@/utils/orpc";
import { channelFormOpts } from "./form-options";
import { MembersSelect, MembersSelectSkeleton } from "./members-select";
import { TeamSelect, TeamSelectSkeleton } from "./team-select";

export const CreateChannelForm = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { user } = useAuthedSession();

  const { mutateAsync: createChannel } = useMutation(
    queryUtils.communication.channel.create.mutationOptions({
      onSuccess: () => {
        queryClient.refetchQueries({
          queryKey: queryUtils.communication.channel.list.queryKey({
            input: {},
          }),
        });

        toast.success("Channel created successfully");
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

  const form = useAppForm({
    ...channelFormOpts,
    defaultValues: {
      ...channelFormOpts.defaultValues,
      createdBy: user.id,
    },
    validators: {
      onSubmit: CreateChannelFormSchema,
    },
    onSubmit: async ({ value: formData }) => {
      await createChannel(formData);
      setDialogOpen(false);
    },
  });

  const channelType = useStore(form.store, (state) => state.values.type);

  return (
    <Dialog onOpenChange={setDialogOpen} open={dialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          <span>New channel</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-106">
        <DialogHeader>
          <DialogTitle>Create New Channel</DialogTitle>
          <DialogDescription>
            Create a new channel for your team to communicate and collaborate.
          </DialogDescription>
        </DialogHeader>
        <form.AppForm>
          <form
            className="space-y-4"
            onReset={(e) => {
              e.preventDefault();
              form.reset({
                ...channelFormOpts.defaultValues,
                createdBy: user.id,
              });
            }}
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.AppField name="name">
                {(field) => (
                  <field.Input
                    label="Channel Name"
                    placeholder="Enter channel name"
                  />
                )}
              </form.AppField>

              <form.AppField name="description">
                {(field) => (
                  <field.Textarea
                    className="resize-none"
                    label="Description"
                    placeholder="Enter channel description"
                    rows={3}
                  />
                )}
              </form.AppField>

              <form.AppField name="type">
                {(field) => (
                  <field.Select label="Channel Type">
                    <SelectItem value="team">Team</SelectItem>
                    <SelectItem value="group">Group</SelectItem>
                  </field.Select>
                )}
              </form.AppField>

              {channelType === "team" ? (
                <Suspense fallback={<TeamSelectSkeleton />}>
                  <TeamSelect form={form} />
                </Suspense>
              ) : (
                <Suspense fallback={<MembersSelectSkeleton />}>
                  <MembersSelect form={form} />
                </Suspense>
              )}
            </FieldGroup>

            <DialogFooter className="flex-row">
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
              >
                {([canSubmit, isSubmitting]) => (
                  <>
                    <Button type="reset" variant="outline">
                      Reset
                    </Button>

                    <Button disabled={isSubmitting || !canSubmit} type="submit">
                      {isSubmitting ? (
                        <>
                          <Spinner />
                          <span>Creating ...</span>
                        </>
                      ) : (
                        <span>Create Channel</span>
                      )}
                    </Button>
                  </>
                )}
              </form.Subscribe>
            </DialogFooter>
          </form>
        </form.AppForm>
      </DialogContent>
    </Dialog>
  );
};
