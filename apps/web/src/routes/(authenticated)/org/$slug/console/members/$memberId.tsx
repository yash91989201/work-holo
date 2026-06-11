import {
  IconArrowLeft,
  IconMail,
  IconShieldFilled,
  IconTrash,
  IconUserFilled,
} from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import type { MemberWithUserType } from "@work-holo/api/lib/types";
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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@work-holo/ui/components/avatar";
import { Badge } from "@work-holo/ui/components/badge";
import { Button } from "@work-holo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@work-holo/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@work-holo/ui/components/dialog";
import { FieldGroup } from "@work-holo/ui/components/field";
import { useAppForm } from "@work-holo/ui/components/form/hooks";
import { SelectItem } from "@work-holo/ui/components/select";
import { Separator } from "@work-holo/ui/components/separator";
import { Skeleton } from "@work-holo/ui/components/skeleton";
import { Spinner } from "@work-holo/ui/components/spinner";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { authClient } from "@/lib/auth-client";
import { getRoleBadgeVariant, getRoleIcon } from "@/lib/org";
import { UpdateMemberRoleSchema } from "@/lib/schemas/member";
import type { UpdateMemberRoleType } from "@/lib/types";
import { queryClient, queryUtils } from "@/utils/orpc";

export const Route = createFileRoute(
  "/(authenticated)/org/$slug/console/members/$memberId"
)({
  staticData: { crumb: "Member Details" },
  component: RouteComponent,
});

function UpdateMemberRole({
  member,
  open,
  onOpenChange,
}: {
  member: MemberWithUserType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const form = useAppForm({
    defaultValues: {
      role: member.role as "admin" | "member",
    } satisfies UpdateMemberRoleType as UpdateMemberRoleType,
    validators: {
      onSubmit: UpdateMemberRoleSchema,
    },
    onSubmit: async ({ value: data }) => {
      try {
        await authClient.organization.updateMemberRole({
          memberId: member.id,
          role: data.role,
        });

        queryClient.invalidateQueries({
          queryKey: queryUtils.org.member.list.queryKey(),
        });

        toast.success(`Member role updated to ${data.role}`);
        onOpenChange(false);
      } catch (error) {
        console.error("Failed to update member role:", error);
        toast.error("Failed to update member role");
      }
    },
  });

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-105">
        <DialogHeader>
          <DialogTitle>Update member role</DialogTitle>
          <DialogDescription>
            Change the role for {member.user.name}
          </DialogDescription>
        </DialogHeader>

        <form.AppForm>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.AppField name="role">
                {(field) => (
                  <field.Select
                    items={[
                      { value: "admin", label: "Admin" },
                      { value: "member", label: "Member" },
                    ]}
                    label="Role"
                    placeholder="Select a role"
                  >
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <IconShieldFilled className="h-4 w-4" />
                        Admin
                      </div>
                    </SelectItem>
                    <SelectItem value="member">
                      <div className="flex items-center gap-2">
                        <IconUserFilled className="h-4 w-4" />
                        Member
                      </div>
                    </SelectItem>
                  </field.Select>
                )}
              </form.AppField>
            </FieldGroup>

            <DialogFooter>
              <Button
                onClick={() => onOpenChange(false)}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <form.Subscribe
                selector={(state) => [
                  state.canSubmit,
                  state.isValidating,
                  state.isSubmitting,
                ]}
              >
                {([canSubmit, isValidating, isSubmitting]) => (
                  <Button
                    disabled={!canSubmit || isValidating || isSubmitting}
                    type="submit"
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner />
                        Updating...
                      </>
                    ) : (
                      "Update Role"
                    )}
                  </Button>
                )}
              </form.Subscribe>
            </DialogFooter>
          </form>
        </form.AppForm>
      </DialogContent>
    </Dialog>
  );
}

function RemoveMember({
  member,
  open,
  onOpenChange,
  onSuccess,
}: {
  member: MemberWithUserType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await authClient.organization.removeMember({
        memberIdOrEmail: member.id,
      });

      queryClient.invalidateQueries({
        queryKey: queryUtils.org.member.list.queryKey(),
      });

      toast.success(
        `${member.user.name} has been removed from the organization`
      );
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Failed to remove member:", error);
      toast.error("Failed to remove member");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove member</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove {member.user.name} from the
            organization? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isRemoving}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isRemoving}
            onClick={(e) => {
              e.preventDefault();
              handleRemove();
            }}
          >
            {isRemoving ? "Removing..." : "Remove"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function MemberDetailContent() {
  const { slug, memberId } = useParams({
    from: "/(authenticated)/org/$slug/console/members/$memberId",
  });
  const { user: currentUser } = useAuthedSession();

  const [isUpdateRoleOpen, setIsUpdateRoleOpen] = useState(false);
  const [isRemoveMemberOpen, setIsRemoveMemberOpen] = useState(false);

  const {
    data: { members },
  } = useSuspenseQuery(
    queryUtils.org.member.list.queryOptions({
      input: {
        page: 1,
        perPage: 1000,
      },
    })
  );

  const member = members.find((m) => m.id === memberId);

  if (!member) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <p className="text-lg text-muted-foreground">Member not found</p>
        <Button
          render={
            <Link params={{ slug }} to="/org/$slug/console/members">
              <IconArrowLeft className="mr-2 h-4 w-4" />
              Back to Members
            </Link>
          }
          variant="outline"
        />
      </div>
    );
  }

  const RoleIcon = getRoleIcon(member.role);
  const isCurrentUser = member.userId === currentUser.id;
  const isOwner = member.role === "owner";
  const canManage = !(isCurrentUser || isOwner);

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            render={
              <Link params={{ slug }} to="/org/$slug/console/members">
                <IconArrowLeft className="h-4 w-4" />
              </Link>
            }
            size="icon"
            variant="outline"
          />
          <div>
            <h1 className="font-bold text-2xl">Member Details</h1>
            <p className="text-muted-foreground text-sm">
              View and manage member information
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={member.user.image ?? undefined} />
                <AvatarFallback className="text-2xl">
                  {member.user.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="font-semibold text-xl">
                    {member.user.name ?? "Unknown"}
                  </h2>
                  <div className="mt-1 flex items-center gap-2 text-muted-foreground text-sm">
                    <IconMail className="h-4 w-4" />
                    {member.user.email}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div>
                    <p className="mb-1 text-muted-foreground text-xs">Role</p>
                    <Badge
                      className="gap-1"
                      variant={getRoleBadgeVariant(member.role)}
                    >
                      <RoleIcon className="h-3 w-3" />
                      {member.role}
                    </Badge>
                  </div>

                  {isCurrentUser && <Badge variant="outline">You</Badge>}
                </div>

                <Separator />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="mb-1 text-muted-foreground text-sm">
                      Member Since
                    </p>
                    <p className="font-medium">
                      {new Date(member.user.createdAt).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-muted-foreground text-sm">
                      Member ID
                    </p>
                    <p className="font-mono text-sm">{member.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {canManage && (
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full justify-start"
                onClick={() => setIsUpdateRoleOpen(true)}
                variant="outline"
              >
                <IconShieldFilled className="mr-2 h-4 w-4" />
                Update Role
              </Button>
              <Button
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={() => setIsRemoveMemberOpen(true)}
                variant="outline"
              >
                <IconTrash className="mr-2 h-4 w-4" />
                Remove from Organization
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <UpdateMemberRole
        member={member}
        onOpenChange={setIsUpdateRoleOpen}
        open={isUpdateRoleOpen}
      />

      <RemoveMember
        member={member}
        onOpenChange={setIsRemoveMemberOpen}
        onSuccess={() => {
          window.location.href = `/org/${slug}/console/members`;
        }}
        open={isRemoveMemberOpen}
      />
    </>
  );
}

function RouteComponent() {
  return (
    <div className="flex h-full flex-col py-4">
      <Suspense fallback={<MemberDetailContent.Fallback />}>
        <MemberDetailContent />
      </Suspense>
    </div>
  );
}

function MemberDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-6">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="flex-1 space-y-4">
              <div>
                <Skeleton className="mb-2 h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-6 w-24" />
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Skeleton className="mb-2 h-4 w-24" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div>
                  <Skeleton className="mb-2 h-4 w-24" />
                  <Skeleton className="h-5 w-48" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

MemberDetailContent.Fallback = MemberDetailSkeleton;
