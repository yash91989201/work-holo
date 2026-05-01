import { IconEdit, IconPlus, IconShield, IconTrash } from "@tabler/icons-react";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useCan } from "@/lib/permission/hooks";
import { queryClient, queryUtils } from "@/utils/orpc";

type EditableRole = {
  id: string;
  displayName: string;
  description?: string | null;
  permissionKeys: string[];
};

type AvailablePermission = {
  key: string;
  resource: string;
  subResource: string;
  action: string;
  description?: string | null;
};

function formatPermissionLabel(permission: AvailablePermission) {
  return permission.key;
}

function RoleDialog({
  open,
  onOpenChange,
  role,
  availablePermissions,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: EditableRole;
  availablePermissions: AvailablePermission[];
}) {
  const isEditing = Boolean(role);
  const canCreate = useCan((p) => p.org.role.create);
  const canUpdate = useCan((p) => p.org.role.update);
  const isAllowed = isEditing ? canUpdate : canCreate;

  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setDisplayName(role?.displayName ?? "");
    setDescription(role?.description ?? "");
    setSelectedKeys(role?.permissionKeys ?? []);
  }, [open, role]);

  const groupedPermissions = useMemo(() => {
    return availablePermissions.reduce<Record<string, AvailablePermission[]>>(
      (acc, permission) => {
        const group = permission.resource;
        acc[group] ??= [];
        acc[group].push(permission);
        return acc;
      },
      {}
    );
  }, [availablePermissions]);

  const invalidateRoleQueries = async () => {
    await queryClient.invalidateQueries({
      queryKey: queryUtils.org.role.list.queryKey({}),
    });
  };

  const createMutation = useMutation(
    queryUtils.org.role.create.mutationOptions({
      onSuccess: async () => {
        await invalidateRoleQueries();
        toast.success("Custom role created");
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create custom role");
      },
    })
  );

  const updateMutation = useMutation(
    queryUtils.org.role.update.mutationOptions({
      onSuccess: async () => {
        await invalidateRoleQueries();
        toast.success("Custom role updated");
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update custom role");
      },
    })
  );

  const togglePermission = (permissionKey: string, checked: boolean) => {
    setSelectedKeys((current) => {
      if (checked) {
        return [...new Set([...current, permissionKey])];
      }

      return current.filter((key) => key !== permissionKey);
    });
  };

  const handleSubmit = async () => {
    if (!isAllowed) {
      toast.error("You do not have permission to manage custom roles");
      return;
    }

    const trimmedName = displayName.trim();
    if (trimmedName.length < 2) {
      toast.error("Role name must be at least 2 characters");
      return;
    }

    if (selectedKeys.length === 0) {
      toast.error("Select at least one permission for the role");
      return;
    }

    if (isEditing && role) {
      await updateMutation.mutateAsync({
        roleTemplateId: role.id,
        displayName: trimmedName,
        description: description.trim() || undefined,
        permissionKeys: selectedKeys,
      });
      return;
    }

    await createMutation.mutateAsync({
      displayName: trimmedName,
      description: description.trim() || undefined,
      permissionKeys: selectedKeys,
    });
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit custom team role" : "Create custom team role"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="role-display-name">Role name</Label>
              <Input
                id="role-display-name"
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Team lead"
                value={displayName}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role-description">Description</Label>
              <Textarea
                id="role-description"
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Can manage team members and channels"
                rows={3}
                value={description}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Permissions</Label>
              <Badge variant="outline">{selectedKeys.length} selected</Badge>
            </div>

            <ScrollArea className="h-[28rem] rounded-md border p-4">
              <div className="space-y-6">
                {Object.entries(groupedPermissions).map(
                  ([group, permissions]) => (
                    <div className="space-y-3" key={group}>
                      <div>
                        <h4 className="font-medium capitalize">{group}</h4>
                        <p className="text-muted-foreground text-xs">
                          Team-scoped permissions available for {group}
                        </p>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        {permissions.map((permission) => {
                          const checked = selectedKeys.includes(permission.key);

                          return (
                            <label
                              className="flex cursor-pointer items-start gap-3 rounded-lg border p-3"
                              key={permission.key}
                            >
                              <Checkbox
                                checked={checked}
                                onCheckedChange={(value) =>
                                  togglePermission(
                                    permission.key,
                                    value === true
                                  )
                                }
                              />
                              <div className="min-w-0 space-y-1">
                                <div className="font-medium text-sm">
                                  {formatPermissionLabel(permission)}
                                </div>
                                <div className="text-muted-foreground text-xs">
                                  {permission.description ||
                                    `${permission.resource}:${permission.subResource || "root"}`}
                                </div>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={() => onOpenChange(false)}
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
          <Button disabled={!isAllowed || isSubmitting} onClick={handleSubmit}>
            {isSubmitting ? (
              <>
                <Spinner />
                Saving...
              </>
            ) : isEditing ? (
              "Save changes"
            ) : (
              "Create role"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function CustomRoleManager() {
  const canCreate = useCan((p) => p.org.role.create);
  const canUpdate = useCan((p) => p.org.role.update);
  const canDelete = useCan((p) => p.org.role.delete);

  const { data } = useSuspenseQuery(queryUtils.org.role.list.queryOptions({}));
  const roles = data.roles;

  const [editingRole, setEditingRole] = useState<EditableRole | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const removeMutation = useMutation(
    queryUtils.org.role.remove.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: queryUtils.org.role.list.queryKey({}),
        });
        toast.success("Custom role deleted");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete custom role");
      },
    })
  );

  const openCreateDialog = () => {
    setEditingRole(undefined);
    setIsDialogOpen(true);
  };

  const openEditDialog = (role: EditableRole) => {
    setEditingRole(role);
    setIsDialogOpen(true);
  };

  const handleDelete = async (roleId: string, displayName: string) => {
    if (!canDelete) {
      toast.error("You do not have permission to delete custom roles");
      return;
    }

    if (!window.confirm(`Delete the custom role "${displayName}"?`)) {
      return;
    }

    await removeMutation.mutateAsync({ roleTemplateId: roleId });
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4 border-b py-4">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <IconShield className="h-5 w-5" />
              Custom team roles
            </CardTitle>
            <CardDescription>
              Create reusable team-scoped roles and choose which permissions
              they grant.
            </CardDescription>
          </div>

          {canCreate && (
            <Button onClick={openCreateDialog}>
              <IconPlus className="mr-2 h-4 w-4" />
              New role
            </Button>
          )}
        </CardHeader>

        <CardContent className="space-y-4 p-4">
          {roles.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 text-center text-muted-foreground text-sm">
              No custom roles yet. Create your first team-scoped role to start
              assigning permissions.
            </div>
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {roles.map((role) => (
                <div className="rounded-xl border p-4" key={role.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-base">
                          {role.displayName}
                        </h3>
                        <Badge variant="secondary">{role.scope}</Badge>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {role.description || "No description provided."}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {canUpdate && (
                        <Button
                          onClick={() => openEditDialog(role)}
                          size="icon"
                          variant="outline"
                        >
                          <IconEdit className="h-4 w-4" />
                        </Button>
                      )}
                      {canDelete && (
                        <Button
                          disabled={removeMutation.isPending}
                          onClick={() =>
                            handleDelete(role.id, role.displayName)
                          }
                          size="icon"
                          variant="outline"
                        >
                          <IconTrash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between text-muted-foreground text-xs">
                      <span>{role.permissionCount} permissions</span>
                      <span>{role.name}</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {role.permissionKeys.slice(0, 8).map((permissionKey) => (
                        <Badge key={permissionKey} variant="outline">
                          {permissionKey}
                        </Badge>
                      ))}
                      {role.permissionKeys.length > 8 && (
                        <Badge variant="outline">
                          +{role.permissionKeys.length - 8} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <RoleDialog
        availablePermissions={data.availablePermissions}
        onOpenChange={setIsDialogOpen}
        open={isDialogOpen}
        role={editingRole}
      />
    </>
  );
}

function CustomRoleManagerSkeleton() {
  return (
    <Card>
      <CardHeader className="border-b py-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-72" />
      </CardHeader>
      <CardContent className="grid gap-4 p-4 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div className="rounded-xl border p-4" key={index.toString()}>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="mt-2 h-4 w-full" />
            <Skeleton className="mt-4 h-4 w-24" />
            <div className="mt-3 flex gap-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

CustomRoleManager.Fallback = CustomRoleManagerSkeleton;
