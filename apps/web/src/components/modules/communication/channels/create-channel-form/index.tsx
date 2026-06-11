import { IconPlus } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@work-holo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@work-holo/ui/components/dialog";
import { FieldGroup } from "@work-holo/ui/components/field";
import { useAppForm } from "@work-holo/ui/components/form/hooks";
import { SelectItem } from "@work-holo/ui/components/select";
import { Spinner } from "@work-holo/ui/components/spinner";
import type { ReactElement } from "react";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { CreateChannelFormSchema } from "@/lib/schemas/communication/channel";
import { queryClient, queryUtils } from "@/utils/orpc";
import { channelFormOpts } from "./form-options";
import { MembersSelect } from "./members-select";
import { TeamSelect } from "./team-select";

interface CreateChannelFormProps {
  trigger?: ReactElement;
}

export const CreateChannelForm = ({ trigger }: CreateChannelFormProps) => {
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

  return (
    <Dialog onOpenChange={setDialogOpen} open={dialogOpen}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button aria-label="Create channel" size="icon" variant="link">
              <IconPlus />
            </Button>
          )
        }
      />

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
                  <field.Select
                    items={[
                      { label: "Team", value: "team" },
                      { label: "Group", value: "group" },
                    ]}
                    label="Channel Type"
                  >
                    <SelectItem value="team">Team</SelectItem>
                    <SelectItem value="group">Group</SelectItem>
                  </field.Select>
                )}
              </form.AppField>

              <form.Subscribe selector={(state) => state.values.type}>
                {(channelType) =>
                  channelType === "team" ? (
                    <Suspense fallback={<TeamSelect.Fallback />}>
                      <TeamSelect form={form} />
                    </Suspense>
                  ) : (
                    <Suspense fallback={<MembersSelect.Fallback />}>
                      <MembersSelect form={form} />
                    </Suspense>
                  )
                }
              </form.Subscribe>
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
