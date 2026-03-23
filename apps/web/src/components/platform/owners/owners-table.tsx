import { IconBuilding, IconCrown } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { queryUtils } from "@/utils/orpc";

export function OwnersTable({ search }: { search: string }) {
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

export function OwnersTableSkeleton() {
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
                <Skeleton className="h-4 w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

OwnersTable.Fallback = OwnersTableSkeleton;
