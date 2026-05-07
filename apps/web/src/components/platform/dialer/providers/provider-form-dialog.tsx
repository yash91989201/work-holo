import { useMutation } from "@tanstack/react-query";
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

type ProviderFormValues = {
  name: string;
  slug: string;
  host: string;
  port: number;
  transport: "udp" | "tcp" | "tls";
  requiresRegistration: boolean;
  isActive: boolean;
};

type ProviderFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  providerId?: string;
  defaultValues?: Partial<ProviderFormValues>;
};

export function ProviderFormDialog({
  open,
  onOpenChange,
  onSuccess,
  providerId,
  defaultValues,
}: ProviderFormDialogProps) {
  const isEdit = !!providerId;

  const createMutation = useMutation(
    queryUtils.admin.dialer.createProvider.mutationOptions({
      onSuccess: () => {
        toast.success("Provider created");
        onSuccess();
        onOpenChange(false);
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const updateMutation = useMutation(
    queryUtils.admin.dialer.updateProvider.mutationOptions({
      onSuccess: () => {
        toast.success("Provider updated");
        onSuccess();
        onOpenChange(false);
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const isPending = createMutation.isPending || updateMutation.isPending;

  const form = useAppForm({
    defaultValues: {
      name: defaultValues?.name ?? "",
      slug: defaultValues?.slug ?? "",
      host: defaultValues?.host ?? "",
      port: defaultValues?.port ?? 5060,
      transport: defaultValues?.transport ?? ("tcp" as const),
      requiresRegistration: defaultValues?.requiresRegistration ?? false,
      isActive: defaultValues?.isActive ?? true,
    },
    onSubmit: async ({ value }) => {
      if (isEdit && providerId) {
        updateMutation.mutate({
          providerId,
          data: {
            name: value.name,
            host: value.host,
            port: value.port,
            transport: value.transport,
            requiresRegistration: value.requiresRegistration,
            isActive: value.isActive,
          },
        });
      } else {
        createMutation.mutate(value);
      }
    },
  });

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Provider" : "Add SIP Provider"}
          </DialogTitle>
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
              <field.Input label="Provider Name" placeholder="Frejun" />
            )}
          </form.AppField>

          {!isEdit && (
            <form.AppField name="slug">
              {(field) => (
                <field.Input
                  label="Slug (unique identifier)"
                  placeholder="frejun"
                />
              )}
            </form.AppField>
          )}

          <form.AppField name="host">
            {(field) => (
              <field.Input
                label="SIP Host"
                placeholder="workholo-dialer-testing.sip.frejun.ai"
              />
            )}
          </form.AppField>

          <div className="grid grid-cols-2 gap-4">
            <form.AppField name="port">
              {(field) => (
                <field.Input label="Port" placeholder="5060" type="number" />
              )}
            </form.AppField>

            <form.AppField name="transport">
              {(field) => (
                <field.Select label="Transport" placeholder="Select">
                  <SelectItem value="udp">UDP</SelectItem>
                  <SelectItem value="tcp">TCP</SelectItem>
                  <SelectItem value="tls">TLS</SelectItem>
                </field.Select>
              )}
            </form.AppField>
          </div>

          <div className="flex gap-6">
            <form.AppField name="requiresRegistration">
              {(field) => <field.Checkbox label="Requires SIP registration" />}
            </form.AppField>

            <form.AppField name="isActive">
              {(field) => <field.Checkbox label="Active" />}
            </form.AppField>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              onClick={() => onOpenChange(false)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button disabled={isPending} type="submit">
              {isEdit ? "Save Changes" : "Add Provider"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
