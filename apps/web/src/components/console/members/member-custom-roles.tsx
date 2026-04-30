import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCan } from "@/lib/permission/hooks";
import { queryClient, queryUtils } from "@/utils/orpc";

type RoleAssignment = {
  id: string;
  roleTemplateId: string;
  roleDisplayName: string;
  roleDescription?: string | null;
  teamId: string;
  teamName: string;
  assignedAt: Date;
};

type AvailableRole = {
  id: string;
  displayName: string;
  description?: string | null;
};

type AvailableTeam = {
  id: string;
  name: string;
};

function invalidateMemberRoleAssignments(userId: string) {
  return queryClient.invalidateQueries({
    queryKey: queryUtils.org.role.getMemberAssignments.queryKey({
      input: { userId },
    }),
  });
}

function TeamRoleBadge({
  assignment,
  canRemove,
  isRemoving,
  onRemove,
}: {
  assignment: RoleAssignment;
  canRemove: boolean;
  isRemoving: boolean;
  onRemove: (assignment: RoleAssignment) => void;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1 text-xs">
      <div className="min-w-0">
        <div className="font-medium">{assignment.roleDisplayName}</div>
        {assignment.roleDescription && (
          <div className="text-[11px] text-muted-foreground">
            {assignment.roleDescription}
          </div>
        )}
      </div>

      {canRemove && (
        <Button
          className="h-6 w-6 rounded-full"
          disabled={isRemoving}
          onClick={() => onRemove(assignment)}
          size="icon"
          type="button"
          variant="ghost"
        >
          {isRemoving ? (
            <Spinner className="size-3" />
          ) : (
            <IconTrash className="h-3 w-3" />
          )}
        </Button>
      )}
    </div>
  );
}

export function MemberCustomRoles({
  userId,
  canManage,
}: {
  userId: string;
  canManage: boolean;
}) {
  const canAssign = useCan((p) => p.org.role.assign);
  const canRevoke = useCan((p) => p.org.role.remove);
  const allowAssign = canManage && canAssign;
  const allowRemove = canManage && canRevoke;

  const [selectedRoleByTeam, setSelectedRoleByTeam] = useState<
    Record<string, string>
  >({});
  const [assigningTeamId, setAssigningTeamId] = useState<string | null>(null);
  const [removingAssignmentId, setRemovingAssignmentId] = useState<
    string | null
  >(null);

  const { data } = useSuspenseQuery(
    queryUtils.org.role.getMemberAssignments.queryOptions({
      input: { userId },
    })
  );

  const assignMutation = useMutation(queryUtils.org.role.assign.mutationOptions());
  const revokeMutation = useMutation(queryUtils.org.role.revoke.mutationOptions());

  const teamRows = useMemo(() => {
    return data.availableTeams.map((team) => {
      const assignments = data.assignments.filter(
        (assignment) => assignment.teamId === team.id
      );
      const assignedRoleIds = new Set(
        assignments.map((assignment) => assignment.roleTemplateId)
      );
      const assignableRoles = data.availableRoles.filter(
        (role) => !assignedRoleIds.has(role.id)
      );

      return {
        team,
        assignments,
        assignableRoles,
      };
    });
  }, [data.assignments, data.availableRoles, data.availableTeams]);

  const handleAssign = async (teamId: string, fallbackRoleId?: string) => {
    if (!allowAssign) {
      toast.error("You do not have permission to assign custom roles");
      return;
    }

    const roleTemplateId = selectedRoleByTeam[teamId] ?? fallbackRoleId;
    if (!roleTemplateId) {
      toast.error("Select a role to assign");
      return;
    }

    try {
      setAssigningTeamId(teamId);
      await assignMutation.mutateAsync({
        userId,
        roleTemplateId,
        teamId,
      });
      await invalidateMemberRoleAssignments(userId);
      setSelectedRoleByTeam((current) => ({
        ...current,
        [teamId]: "",
      }));
      toast.success("Custom role assigned");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to assign custom role"
      );
    } finally {
      setAssigningTeamId(null);
    }
  };

  const handleRevoke = async (assignment: RoleAssignment) => {
    if (!allowRemove) {
      toast.error("You do not have permission to remove custom roles");
      return;
    }

    try {
      setRemovingAssignmentId(assignment.id);
      await revokeMutation.mutateAsync({
        userId,
        roleTemplateId: assignment.roleTemplateId,
        teamId: assignment.teamId,
      });
      await invalidateMemberRoleAssignments(userId);
      toast.success("Custom role removed");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to remove custom role"
      );
    } finally {
      setRemovingAssignmentId(null);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="gap-4 border-b bg-muted/20">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <CardTitle>Custom roles by team</CardTitle>
            <CardDescription>
              Every team this member belongs to is listed below. Assign or remove
              team-scoped custom roles directly from the table.
            </CardDescription>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <Badge variant="outline">{data.availableTeams.length} teams</Badge>
            <Badge variant="outline">{data.assignments.length} custom roles</Badge>
            {allowAssign && <Badge variant="secondary">Editable</Badge>}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {data.availableRoles.length === 0 ? (
          <div className="p-6 text-muted-foreground text-sm">
            No custom roles have been created yet. Create role templates from the
            Roles page first.
          </div>
        ) : data.availableTeams.length === 0 ? (
          <div className="p-6 text-muted-foreground text-sm">
            This member is not part of any teams yet, so there are no team role
            assignments to manage.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[220px]">Team</TableHead>
                <TableHead>Assigned custom roles</TableHead>
                <TableHead className="w-[320px]">Update team roles</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamRows.map(({ team, assignments, assignableRoles }) => {
                const selectedRoleId =
                  selectedRoleByTeam[team.id] ?? assignableRoles[0]?.id ?? "";
                const selectedRole = assignableRoles.find(
                  (role) => role.id === selectedRoleId
                );
                const isAssigning = assigningTeamId === team.id;

                return (
                  <TableRow key={team.id}>
                    <TableCell className="whitespace-normal align-top">
                      <div className="space-y-1">
                        <div className="font-medium">{team.name}</div>
                        <div className="text-muted-foreground text-xs">
                          {assignments.length > 0
                            ? `${assignments.length} assigned role${
                                assignments.length > 1 ? "s" : ""
                              }`
                            : "No custom role assigned"}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="whitespace-normal align-top">
                      {assignments.length === 0 ? (
                        <span className="text-muted-foreground text-sm">
                          No custom roles assigned for this team yet.
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {assignments.map((assignment) => (
                            <TeamRoleBadge
                              assignment={assignment}
                              canRemove={allowRemove}
                              isRemoving={removingAssignmentId === assignment.id}
                              key={assignment.id}
                              onRemove={handleRevoke}
                            />
                          ))}
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="whitespace-normal align-top">
                      {allowAssign ? (
                        assignableRoles.length > 0 ? (
                          <div className="space-y-2">
                            <div className="flex flex-col gap-2 lg:flex-row">
                              <Select
                                onValueChange={(value) =>
                                  setSelectedRoleByTeam((current) => ({
                                    ...current,
                                    [team.id]: value,
                                  }))
                                }
                                value={selectedRoleId}
                              >
                                <SelectTrigger className="w-full lg:flex-1">
                                  <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                  {assignableRoles.map((role) => (
                                    <SelectItem key={role.id} value={role.id}>
                                      {role.displayName}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>

                              <Button
                                disabled={isAssigning || !selectedRoleId}
                                onClick={() =>
                                  handleAssign(team.id, assignableRoles[0]?.id)
                                }
                                type="button"
                              >
                                {isAssigning ? (
                                  <>
                                    <Spinner />
                                    Assigning...
                                  </>
                                ) : (
                                  <>
                                    <IconPlus className="mr-2 h-4 w-4" />
                                    Add role
                                  </>
                                )}
                              </Button>
                            </div>

                            <p className="text-muted-foreground text-xs">
                              {selectedRole?.description ||
                                "Choose a role template to grant team-specific permissions."}
                            </p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            All available roles are already assigned for this
                            team.
                          </span>
                        )
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          {canManage
                            ? "You don't have permission to update team roles."
                            : "Role assignments are read-only for this member."}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

function MemberCustomRolesSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-80" />
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-4 w-24" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-36" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-28" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 3 }).map((_, index) => (
              <TableRow key={index.toString()}>
                <TableCell>
                  <Skeleton className="h-5 w-28" />
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-28 rounded-full" />
                    <Skeleton className="h-8 w-24 rounded-full" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Skeleton className="h-9 flex-1" />
                    <Skeleton className="h-9 w-28" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

MemberCustomRoles.Fallback = MemberCustomRolesSkeleton;
