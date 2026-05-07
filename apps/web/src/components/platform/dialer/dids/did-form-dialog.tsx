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

type DidFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

export function DidFormDialog({
  open,
  onOpenChange,
  onSuccess,
}: DidFormDialogProps) {
  const { data: trunks } = useSuspenseQuery(
    queryUtils.admin.dialer.listTrunks.queryOptions({ input: {} })
  );

  const createMutation = useMutation(
    queryUtils.admin.dialer.createDid.mutationOptions({
      onSuccess: () => {
        toast.success("DID added to inventory");
        onSuccess();
        onOpenChange(false);
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const form = useAppForm({
    defaultValues: {
      number: "",
      friendlyName: "",
      sipTrunkId: "",
    },
    onSubmit: async ({ value }) => {
      createMutation.mutate({
        number: value.number,
        friendlyName: value.friendlyName || undefined,
        sipTrunkId: value.sipTrunkId,
      });
    },
  });

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add DID to Inventory</DialogTitle>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.AppField name="number">
            {(field) => (
              <field.Input
                label="Phone Number (E.164)"
                placeholder="+914226628808"
              />
            )}
          </form.AppField>

          <form.AppField name="friendlyName">
            {(field) => (
              <field.Input
                label="Friendly Name (optional)"
                placeholder="Sales Main Line"
              />
            )}
          </form.AppField>

          <form.AppField name="sipTrunkId">
            {(field) => (
              <field.Select label="SIP Trunk" placeholder="Select trunk">
                {trunks.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name} ({t.proxy})
                  </SelectItem>
                ))}
              </field.Select>
            )}
          </form.AppField>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              onClick={() => onOpenChange(false)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button disabled={createMutation.isPending} type="submit">
              Add DID
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
