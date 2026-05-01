import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppForm } from "@/components/ui/form/hooks";
import { SelectItem } from "@/components/ui/select";
import { queryUtils } from "@/utils/orpc";

type DidAssignDialogProps = {
  didId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

export function DidAssignDialog({
  didId,
  open,
  onOpenChange,
  onSuccess,
}: DidAssignDialogProps) {
  const { data: orgs } = useSuspenseQuery(
    queryUtils.admin.listOrganizations.queryOptions({
      input: { page: 1, limit: 100 },
    })
  );

  const assignMutation = useMutation(
    queryUtils.admin.dialer.assignDid.mutationOptions({
      onSuccess: () => {
        toast.success("DID assigned to organization");
        onSuccess();
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const form = useAppForm({
    defaultValues: { organizationId: "" },
    onSubmit: async ({ value }) => {
      assignMutation.mutate({ didId, organizationId: value.organizationId });
    },
  });

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign DID to Organization</DialogTitle>
          <DialogDescription>
            Select which organization should own this phone number.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.AppField name="organizationId">
            {(field) => (
              <field.Select
                label="Organization"
                placeholder="Select organization"
              >
                {orgs.map((o) => (
                  <SelectItem key={o.id} value={o.id}>
                    {o.name}
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
            <Button disabled={assignMutation.isPending} type="submit">
              Assign
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
