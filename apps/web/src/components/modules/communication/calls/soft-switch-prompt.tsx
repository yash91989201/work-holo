import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@work-holo/ui/components/alert-dialog";
import { useCall } from "@/hooks/communications/use-call";
import { useCallStore, useSoftSwitchPending } from "@/stores/call-store";

export function SoftSwitchPrompt() {
  const pending = useSoftSwitchPending();
  const clearSoftSwitch = useCallStore((s) => s.clearSoftSwitch);
  const { accept, end } = useCall();

  if (!pending) {
    return null;
  }

  const handleConfirm = async () => {
    const { activeCall } = useCallStore.getState();
    if (activeCall) {
      await end(activeCall.callId);
    }
    clearSoftSwitch();
    await accept(pending.callId, pending.type);
  };

  return (
    <AlertDialog onOpenChange={(open) => !open && clearSoftSwitch()} open>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Leave your current call?</AlertDialogTitle>
          <AlertDialogDescription>
            You're already in a call. Joining {pending.callerName}'s call will
            disconnect you from the current one.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={clearSoftSwitch}>Stay</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            Leave and join
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
