import { IconUserMinus } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@work-holo/ui/components/alert-dialog";
import { Button } from "@work-holo/ui/components/button";
import { toast } from "sonner";
import { queryClient, queryUtils } from "@/utils/orpc";

interface RemoveMemberDialogProps {
  channelId: string;
  memberId: string;
  memberName: string;
}

export function RemoveMemberDialog({
  channelId,
  memberId,
  memberName,
}: RemoveMemberDialogProps) {
  const { mutate: removeMembers, isPending } = useMutation(
    queryUtils.communication.channel.removeMembers.mutationOptions({
      onSuccess: () => {
        toast.success(`${memberName} removed from channel`);
        queryClient.invalidateQueries({
          queryKey: queryUtils.communication.channel.listMembers.queryKey({
            input: { channelId },
          }),
        });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            aria-label={`Remove ${memberName}`}
            className="opacity-0 transition-opacity group-hover/item:opacity-100"
            size="icon"
            variant="ghost"
          >
            <IconUserMinus />
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove member</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove{" "}
            <span className="font-medium text-foreground">{memberName}</span>{" "}
            from this channel? They will lose access to all messages.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={() => removeMembers({ channelId, memberIds: [memberId] })}
            variant="destructive"
          >
            {isPending ? "Removing…" : "Remove"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
