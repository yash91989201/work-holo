import { IconBuilding, IconCrown, IconSearch } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Suspense, useState } from "react";
import { Badge } from "@/components/ui/badge";
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

export const Route = createFileRoute(
  "/(authenticated)/platform/dashboard/owners/"
)({
  component: OwnersPage,
});

function OwnersPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-2xl">Organization Owners</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Users who own one or more organizations. Click to view their
            organizations.
          </p>
        </div>
        <div className="relative w-64">
          <IconSearch className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search owners..."
            value={search}
          />
        </div>
      </div>
      <Suspense fallback={<OwnersTableSkeleton />}>
        <OwnersTable search={search} />
      </Suspense>
    </div>
  );
}

function OwnersTable({ search }: { search: string }) {
  const { data: owners } = useSuspenseQuery(
    queryUtils.admin.listOwners.queryOptions({
      input: {
        page: 1,
        limit: 50,
        search: search || undefined,
      },
    })
  );

  if (owners.length === 0) {
    return (
      <p className="py-8 text-center text-muted-foreground">No owners found.</p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Organizations Owned</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {owners.map((owner) => (
          <TableRow key={owner.userId}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <IconCrown className="size-4 text-amber-500" />
                {owner.userName}
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {owner.userEmail}
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {owner.organizations.map((org) => (
                  <Link
                    key={org.orgId}
                    params={{ orgId: org.orgId }}
                    to="/platform/dashboard/organizations/$orgId"
                  >
                    <Badge className="cursor-pointer gap-1" variant="secondary">
                      <IconBuilding className="size-3" />
                      {org.orgName}
                    </Badge>
                  </Link>
                ))}
              </div>
            </TableCell>
            <TableCell>
              {owner.banned ? (
                <Badge variant="destructive">Banned</Badge>
              ) : (
                <Badge variant="outline">Active</Badge>
              )}
            </TableCell>
            <TableCell>
              <Link
                params={{ ownerId: owner.userId }}
                to="/platform/dashboard/owners/$ownerId"
              >
                <Badge className="cursor-pointer" variant="outline">
                  View Details
                </Badge>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function OwnersTableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Organizations Owned</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 4 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton has no stable id
          <TableRow key={i}>
            {Array.from({ length: 5 }).map((__, j) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton has no stable id
              <TableCell key={j}>
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
