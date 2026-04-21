import {
  IconBuilding,
  IconClock,
  IconMail,
  IconSearch,
} from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Badge } from "@work-holo/ui/components/badge";
import { Input } from "@work-holo/ui/components/input";
import { Skeleton } from "@work-holo/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@work-holo/ui/components/table";
import { queryUtils } from "@/utils/orpc";

function platformRoleBadgeVariant(
  role: string | null | undefined
): "default" | "secondary" | "outline" | "destructive" {
  if (role === "super_admin" || role === "admin") return "default";
  if (role === "support") return "secondary";
  return "outline";
}

function orgRoleBadgeVariant(
  role: string
): "default" | "secondary" | "outline" | "destructive" {
  if (role === "owner") return "default";
  if (role === "admin") return "secondary";
  return "outline";
}

function InvitationStatusBadge({
  status,
  expiresAt,
}: {
  status: string;
  expiresAt: Date;
}) {
  const isExpired = new Date(expiresAt) < new Date();

  if (status === "accepted") {
    return <Badge variant="default">Accepted</Badge>;
  }
  if (status === "rejected" || status === "canceled") {
    return <Badge variant="destructive">{status}</Badge>;
  }
  if (isExpired) {
    return <Badge variant="destructive">Expired</Badge>;
  }
  return <Badge variant="outline">Pending</Badge>;
}

export function OrgDetail({
  orgId,
  search,
  setSearch,
}: {
  orgId: string;
  search: string;
  setSearch: (s: string) => void;
}) {
  const { data } = useSuspenseQuery(
    queryUtils.admin.getOrganizationMembers.queryOptions({
      input: {
        orgId,
        page: 1,
        limit: 50,
        search: search || undefined,
      },
    })
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 rounded-lg border p-4">
        <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
          <IconBuilding className="size-6 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold text-xl">{data.organization.name}</h2>
          <p className="text-muted-foreground text-sm">
            {data.organization.slug} &middot; {data.totalMembers} member
            {data.totalMembers === 1 ? "" : "s"} &middot; Created{" "}
            {new Date(data.organization.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="font-medium text-lg">Members</h3>
        <div className="relative w-64">
          <IconSearch className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search members..."
            value={search}
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Org Role</TableHead>
            <TableHead>Platform Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined Org</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.members.map((m) => (
            <TableRow key={m.memberId}>
              <TableCell className="font-medium">{m.userName}</TableCell>
              <TableCell className="text-muted-foreground">
                {m.userEmail}
              </TableCell>
              <TableCell>
                <Badge variant={orgRoleBadgeVariant(m.orgRole)}>
                  {m.orgRole}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={platformRoleBadgeVariant(m.platformRole)}>
                  {m.platformRole ?? "user"}
                </Badge>
              </TableCell>
              <TableCell>
                {m.banned ? (
                  <Badge variant="destructive">Banned</Badge>
                ) : (
                  <Badge variant="outline">Active</Badge>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {new Date(m.joinedAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
          {data.members.length === 0 && (
            <TableRow>
              <TableCell
                className="py-8 text-center text-muted-foreground"
                colSpan={6}
              >
                No members found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {(data.invitations ?? []).length > 0 && (
        <>
          <div className="flex items-center gap-2">
            <IconMail className="size-4 text-muted-foreground" />
            <h3 className="font-medium text-lg">
              Invited Users ({data.invitations.length})
            </h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Invited Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Invited By</TableHead>
                <TableHead>Invited On</TableHead>
                <TableHead>Expires</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.invitations.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-medium">{inv.email}</TableCell>
                  <TableCell>
                    <Badge variant={orgRoleBadgeVariant(inv.role ?? "member")}>
                      {inv.role ?? "member"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <InvitationStatusBadge
                      expiresAt={inv.expiresAt}
                      status={inv.status}
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {inv.inviterName}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(inv.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    <div className="flex items-center gap-1">
                      <IconClock className="size-3" />
                      {new Date(inv.expiresAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
}

export function OrgDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 rounded-lg border p-4">
        <Skeleton className="size-12 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Org Role</TableHead>
            <TableHead>Platform Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined Org</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 4 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton has no stable id
            <TableRow key={i}>
              {Array.from({ length: 6 }).map((__, j) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton has no stable id
                <TableCell key={j}>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

OrgDetail.Fallback = OrgDetailSkeleton;
