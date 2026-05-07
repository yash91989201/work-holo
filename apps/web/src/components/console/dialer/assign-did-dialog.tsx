import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "@work-holo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@work-holo/ui/components/dialog";
import { useAppForm } from "@work-holo/ui/components/form/hooks";
import { SelectItem } from "@work-holo/ui/components/select";
import { toast } from "sonner";
import { queryUtils } from "@/utils/orpc";

type AssignDidDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  userId: string;
  userName: string;
  currentAccess: {
    accessId: string;
    canMakeCalls: boolean;
    canReceiveCalls: boolean;
    assignedDidId: string | null;
    isActive: boolean;
  } | null;
};

export function AssignDidDialog({
  open,
  onOpenChange,
  onSuccess,
  userId,
  userName,
  currentAccess,
}: AssignDidDialogProps) {
  const { data: dids } = useSuspenseQuery(
    queryUtils.org.dialer.listOrgDids.queryOptions({})
  );

  const mutation = useMutation(
    queryUtils.org.dialer.upsertAgentAccess.mutationOptions({
      onSuccess: () => {
        toast.success("Dialer access updated");
        onSuccess();
        onOpenChange(false);
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const form = useAppForm({
    defaultValues: {
      assignedDidId: currentAccess?.assignedDidId ?? "",
      canMakeCalls: currentAccess?.canMakeCalls ?? false,
      canReceiveCalls: currentAccess?.canReceiveCalls ?? false,
      isActive: currentAccess?.isActive ?? true,
    },
    onSubmit: async ({ value }) => {
      mutation.mutate({
        userId,
        canMakeCalls: value.canMakeCalls,
        canReceiveCalls: value.canReceiveCalls,
        assignedDidId: value.assignedDidId || null,
        isActive: value.isActive,
      });
    },
  });

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Configure Dialer — {userName}</DialogTitle>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.AppField name="assignedDidId">
            {(field) => (
              <field.Select label="Assign DID" placeholder="No DID assigned">
                <SelectItem value="">No DID</SelectItem>
                {dids.map((did) => (
                  <SelectItem key={did.id} value={did.id}>
                    {did.number}
                    {did.friendlyName ? ` — ${did.friendlyName}` : ""}
                  </SelectItem>
                ))}
              </field.Select>
            )}
          </form.AppField>

          <div className="space-y-2">
            <p className="font-medium text-sm">Permissions</p>
            <div className="space-y-2 pl-1">
              <form.AppField name="canMakeCalls">
                {(field) => <field.Checkbox label="Can make outbound calls" />}
              </form.AppField>
              <form.AppField name="canReceiveCalls">
                {(field) => (
                  <field.Checkbox label="Can receive inbound calls" />
                )}
              </form.AppField>
              <form.AppField name="isActive">
                {(field) => <field.Checkbox label="Access active" />}
              </form.AppField>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              onClick={() => onOpenChange(false)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button disabled={mutation.isPending} type="submit">
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
