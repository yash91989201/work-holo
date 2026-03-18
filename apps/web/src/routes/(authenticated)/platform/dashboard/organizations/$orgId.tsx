import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Building2, Search } from "lucide-react";
import { Suspense, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { queryUtils } from "@/utils/orpc";
import { IconClock, IconMail } from "@tabler/icons-react";

export const Route = createFileRoute(
  "/(authenticated)/platform/dashboard/organizations/$orgId"
)({
  component: OrganizationDetailPage,
});

function orgRoleBadgeVariant(role: string) {
  if (role === "owner") return "destructive" as const;
  if (role === "admin") return "default" as const;
  return "secondary" as const;
}

function platformRoleBadgeVariant(role: string | null) {
  if (role === "super_admin") return "destructive" as const;
  if (role === "admin") return "default" as const;
  if (role === "support") return "secondary" as const;
  return "outline" as const;
}

function OrganizationDetailPage() {
  const { orgId } = Route.useParams();
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link to="/platform/dashboard/organizations">
          <Button size="icon" variant="ghost">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <h1 className="font-semibold text-2xl">Organization Details</h1>
      </div>
      <Suspense fallback={<OrgDetailSkeleton />}>
        <OrgDetail orgId={orgId} search={search} setSearch={setSearch} />
      </Suspense>
    </div>
  );
}

function OrgDetail({
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
      {/* Org Header */}
      <div className="flex items-center gap-4 rounded-lg border p-4">
        <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
          <Building2 className="size-6 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold text-xl">{data.organization.name}</h2>
          <p className="text-muted-foreground text-sm">
            {data.organization.slug} &middot; {data.totalMembers} member
            {data.totalMembers !== 1 ? "s" : ""} &middot; Created{" "}
            {new Date(data.organization.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Search + Members Table */}
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-lg">Members</h3>
        <div className="relative w-64">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
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

      {/* Invited Users */}
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

function OrgDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 rounded-lg border p-4">
        <div className="size-12 animate-pulse rounded-lg bg-muted" />
        <div className="space-y-2">
          <div className="h-5 w-48 animate-pulse rounded bg-muted" />
          <div className="h-4 w-64 animate-pulse rounded bg-muted" />
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
                  <div className="h-4 w-full animate-pulse rounded bg-muted" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
