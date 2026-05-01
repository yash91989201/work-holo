import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppForm } from "@/components/ui/form/hooks";
import { SelectItem } from "@/components/ui/select";
import { queryUtils } from "@/utils/orpc";

type ExtensionFormValues = {
  extension: string;
  password: string;
  callerIdName: string;
  callerIdNumber: string;
  organizationId: string;
  context: string;
  tollAllow: string;
  isActive: boolean;
};

type ExtensionFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  extensionId?: string;
  defaultValues?: Partial<ExtensionFormValues> & {
    organizationId?: string | null;
    userId?: string | null;
  };
};

export function ExtensionFormDialog({
  open,
  onOpenChange,
  onSuccess,
  extensionId,
  defaultValues,
}: ExtensionFormDialogProps) {
  const isEdit = !!extensionId;

  const { data: orgs } = useSuspenseQuery(
    queryUtils.admin.listOrganizations.queryOptions({
      input: { page: 1, limit: 100 },
    })
  );

  const createMutation = useMutation(
    queryUtils.admin.dialer.createExtension.mutationOptions({
      onSuccess: () => {
        toast.success("Extension created");
        onSuccess();
        onOpenChange(false);
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const updateMutation = useMutation(
    queryUtils.admin.dialer.updateExtension.mutationOptions({
      onSuccess: () => {
        toast.success("Extension updated");
        onSuccess();
        onOpenChange(false);
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const isPending = createMutation.isPending || updateMutation.isPending;

  const form = useAppForm({
    defaultValues: {
      extension: defaultValues?.extension ?? "",
      password: "",
      callerIdName: defaultValues?.callerIdName ?? "",
      callerIdNumber: defaultValues?.callerIdNumber ?? "",
      organizationId: defaultValues?.organizationId ?? "",
      context: defaultValues?.context ?? "default",
      tollAllow: defaultValues?.tollAllow ?? "domestic,international,local",
      isActive: defaultValues?.isActive ?? true,
    },
    onSubmit: async ({ value }) => {
      if (isEdit && extensionId) {
        const data: Record<string, unknown> = {
          callerIdName: value.callerIdName,
          callerIdNumber: value.callerIdNumber,
          organizationId: value.organizationId || null,
          context: value.context,
          tollAllow: value.tollAllow,
          isActive: value.isActive,
        };
        if (value.password) data.password = value.password;
        updateMutation.mutate({
          extensionId,
          data: data as Parameters<typeof updateMutation.mutate>[0]["data"],
        });
      } else {
        createMutation.mutate({
          extension: value.extension,
          password: value.password,
          callerIdName: value.callerIdName,
          callerIdNumber: value.callerIdNumber,
          organizationId: value.organizationId || undefined,
          context: value.context,
          tollAllow: value.tollAllow,
          isActive: value.isActive,
        });
      }
    },
  });

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Agent Extension" : "Add Agent Extension"}
          </DialogTitle>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <form.AppField name="extension">
              {(field) => (
                <field.Input
                  disabled={isEdit}
                  label="Extension Number"
                  placeholder="1001"
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

          <div className="grid grid-cols-2 gap-4">
            <form.AppField name="callerIdName">
              {(field) => (
                <field.Input label="Caller ID Name" placeholder="Agent 1" />
              )}
            </form.AppField>

            <form.AppField name="callerIdNumber">
              {(field) => (
                <field.Input
                  label="Caller ID Number"
                  placeholder="914226628808"
                />
              )}
            </form.AppField>
          </div>

          <form.AppField name="organizationId">
            {(field) => (
              <field.Select
                label="Organization (optional)"
                placeholder="No organization"
              >
                <SelectItem value="">No organization</SelectItem>
                {orgs.map((o) => (
                  <SelectItem key={o.id} value={o.id}>
                    {o.name}
                  </SelectItem>
                ))}
              </field.Select>
            )}
          </form.AppField>

          <div className="grid grid-cols-2 gap-4">
            <form.AppField name="context">
              {(field) => (
                <field.Input label="Dialplan Context" placeholder="default" />
              )}
            </form.AppField>

            <form.AppField name="tollAllow">
              {(field) => (
                <field.Input
                  label="Toll Allow"
                  placeholder="domestic,international,local"
                />
              )}
            </form.AppField>
          </div>

          <form.AppField name="isActive">
            {(field) => <field.Checkbox label="Active" />}
          </form.AppField>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              onClick={() => onOpenChange(false)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button disabled={isPending} type="submit">
              {isEdit ? "Save Changes" : "Add Extension"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
