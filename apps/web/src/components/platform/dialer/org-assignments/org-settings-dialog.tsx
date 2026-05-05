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

type OrgSettingsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  organizationId: string;
  organizationName: string;
  defaultValues?: {
    isEnabled: boolean | null;
    canMakeOutboundCalls: boolean | null;
    canReceiveInboundCalls: boolean | null;
    maxConcurrentCalls: number | null;
    recordAllCalls: boolean | null;
    defaultOutboundTrunkId: string | null;
  };
};

export function OrgSettingsDialog({
  open,
  onOpenChange,
  onSuccess,
  organizationId,
  organizationName,
  defaultValues,
}: OrgSettingsDialogProps) {
  const { data: trunks } = useSuspenseQuery(
    queryUtils.admin.dialer.listTrunks.queryOptions({ input: {} })
  );

  const mutation = useMutation(
    queryUtils.admin.dialer.upsertOrgDialerSettings.mutationOptions({
      onSuccess: () => {
        toast.success("Dialer settings saved");
        onSuccess();
        onOpenChange(false);
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const form = useAppForm({
    defaultValues: {
      isEnabled: defaultValues?.isEnabled ?? false,
      canMakeOutboundCalls: defaultValues?.canMakeOutboundCalls ?? false,
      canReceiveInboundCalls: defaultValues?.canReceiveInboundCalls ?? false,
      maxConcurrentCalls: defaultValues?.maxConcurrentCalls ?? 5,
      recordAllCalls: defaultValues?.recordAllCalls ?? false,
      defaultOutboundTrunkId: defaultValues?.defaultOutboundTrunkId ?? "",
    },
    onSubmit: async ({ value }) => {
      mutation.mutate({
        organizationId,
        isEnabled: value.isEnabled,
        canMakeOutboundCalls: value.canMakeOutboundCalls,
        canReceiveInboundCalls: value.canReceiveInboundCalls,
        maxConcurrentCalls: value.maxConcurrentCalls,
        recordAllCalls: value.recordAllCalls,
        defaultOutboundTrunkId: value.defaultOutboundTrunkId || null,
      });
    },
  });

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Dialer Settings — {organizationName}</DialogTitle>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className="space-y-3">
            <p className="font-medium text-sm">Access</p>
            <div className="space-y-2 pl-1">
              <form.AppField name="isEnabled">
                {(field) => (
                  <field.Checkbox label="Enable dialer for this org" />
                )}
              </form.AppField>
              <form.AppField name="canMakeOutboundCalls">
                {(field) => <field.Checkbox label="Can make outbound calls" />}
              </form.AppField>
              <form.AppField name="canReceiveInboundCalls">
                {(field) => (
                  <field.Checkbox label="Can receive inbound calls" />
                )}
              </form.AppField>
              <form.AppField name="recordAllCalls">
                {(field) => <field.Checkbox label="Record all calls" />}
              </form.AppField>
            </div>
          </div>

          <form.AppField name="maxConcurrentCalls">
            {(field) => (
              <field.Input
                label="Max concurrent calls"
                placeholder="5"
                type="number"
              />
            )}
          </form.AppField>

          <form.AppField name="defaultOutboundTrunkId">
            {(field) => (
              <field.Select
                label="Default outbound trunk (optional)"
                placeholder="Select trunk"
              >
                <SelectItem value="">None</SelectItem>
                {trunks.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
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
            <Button disabled={mutation.isPending} type="submit">
              Save Settings
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
