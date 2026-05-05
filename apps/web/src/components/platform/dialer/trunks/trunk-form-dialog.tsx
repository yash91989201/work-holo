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

type TrunkFormValues = {
  name: string;
  provider: "cloudbharat" | "telnyx" | "twilio" | "custom";
  username: string;
  password: string;
  proxy: string;
  fromDomain: string;
  fromUser: string;
  register: boolean;
  expireSeconds: number;
  pingInterval: number;
  transport: "udp" | "tcp" | "tls";
  isActive: boolean;
};

type TrunkFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  trunkId?: string;
  defaultValues?: Partial<TrunkFormValues>;
};

export function TrunkFormDialog({
  open,
  onOpenChange,
  onSuccess,
  trunkId,
  defaultValues,
}: TrunkFormDialogProps) {
  const isEdit = !!trunkId;

  const createMutation = useMutation(
    queryUtils.admin.dialer.createTrunk.mutationOptions({
      onSuccess: () => {
        toast.success("SIP trunk created");
        onSuccess();
        onOpenChange(false);
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const updateMutation = useMutation(
    queryUtils.admin.dialer.updateTrunk.mutationOptions({
      onSuccess: () => {
        toast.success("SIP trunk updated");
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
      provider: defaultValues?.provider ?? ("cloudbharat" as const),
      username: defaultValues?.username ?? "",
      password: "",
      proxy: defaultValues?.proxy ?? "",
      fromDomain: defaultValues?.fromDomain ?? "",
      fromUser: defaultValues?.fromUser ?? "",
      register: defaultValues?.register ?? true,
      expireSeconds: defaultValues?.expireSeconds ?? 60,
      pingInterval: defaultValues?.pingInterval ?? 25,
      transport: defaultValues?.transport ?? ("udp" as const),
      isActive: defaultValues?.isActive ?? true,
    },
    onSubmit: async ({ value }) => {
      if (isEdit && trunkId) {
        const data: Partial<TrunkFormValues> = {
          name: value.name,
          provider: value.provider,
          username: value.username,
          proxy: value.proxy,
          register: value.register,
          expireSeconds: value.expireSeconds,
          pingInterval: value.pingInterval,
          transport: value.transport,
          isActive: value.isActive,
        };
        if (value.password) data.password = value.password;
        if (value.fromDomain) data.fromDomain = value.fromDomain;
        if (value.fromUser) data.fromUser = value.fromUser;
        updateMutation.mutate({ trunkId, data });
      } else {
        createMutation.mutate({
          ...value,
          fromDomain: value.fromDomain || undefined,
          fromUser: value.fromUser || undefined,
        });
      }
    },
  });

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit SIP Trunk" : "Add SIP Trunk"}
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
              <field.Input label="Trunk Name" placeholder="CloudBharat Main" />
            )}
          </form.AppField>

          <form.AppField name="provider">
            {(field) => (
              <field.Select label="Provider" placeholder="Select provider">
                <SelectItem value="cloudbharat">CloudBharat</SelectItem>
                <SelectItem value="telnyx">Telnyx</SelectItem>
                <SelectItem value="twilio">Twilio</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </field.Select>
            )}
          </form.AppField>

          <div className="grid grid-cols-2 gap-4">
            <form.AppField name="username">
              {(field) => (
                <field.Input
                  label="SIP Username"
                  placeholder="dsip914226628808"
                />
              )}
            </form.AppField>

            <form.AppField name="password">
              {(field) => (
                <field.Input
                  label={
                    isEdit ? "Password (leave blank to keep)" : "SIP Password"
                  }
                  placeholder={isEdit ? "••••••••" : "Enter password"}
                  type="password"
                />
              )}
            </form.AppField>
          </div>

          <form.AppField name="proxy">
            {(field) => (
              <field.Input
                label="Proxy Server"
                placeholder="siptrunk.cloudbharat.in"
              />
            )}
          </form.AppField>

          <div className="grid grid-cols-2 gap-4">
            <form.AppField name="fromDomain">
              {(field) => (
                <field.Input
                  label="From Domain (optional)"
                  placeholder="siptrunk.cloudbharat.in"
                />
              )}
            </form.AppField>

            <form.AppField name="fromUser">
              {(field) => (
                <field.Input
                  label="From User (optional)"
                  placeholder="dsip914226628808"
                />
              )}
            </form.AppField>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <form.AppField name="transport">
              {(field) => (
                <field.Select label="Transport" placeholder="Select">
                  <SelectItem value="udp">UDP</SelectItem>
                  <SelectItem value="tcp">TCP</SelectItem>
                  <SelectItem value="tls">TLS</SelectItem>
                </field.Select>
              )}
            </form.AppField>

            <form.AppField name="expireSeconds">
              {(field) => (
                <field.Input
                  label="Expire (s)"
                  placeholder="60"
                  type="number"
                />
              )}
            </form.AppField>

            <form.AppField name="pingInterval">
              {(field) => (
                <field.Input label="Ping (s)" placeholder="25" type="number" />
              )}
            </form.AppField>
          </div>

          <div className="flex gap-6">
            <form.AppField name="register">
              {(field) => <field.Checkbox label="Register with provider" />}
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
              {isEdit ? "Save Changes" : "Add Trunk"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
