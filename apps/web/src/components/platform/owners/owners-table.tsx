import {
  IconBuilding,
  IconCrown,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { useDebouncedCallback } from "@tanstack/react-pacer";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Badge } from "@work-holo/ui/components/badge";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@work-holo/ui/components/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@work-holo/ui/components/input-group";
import { Skeleton } from "@work-holo/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@work-holo/ui/components/table";
import { useState } from "react";
import { queryUtils } from "@/utils/orpc";

export function OwnersTable() {
  const search = useSearch({
    from: "/(authenticated)/platform/dashboard/owners/",
  });

  const navigate = useNavigate({
    from: "/platform/dashboard/owners/",
  });

  const [query, setQuery] = useState(search.search ?? "");

  const debouncedNavigate = useDebouncedCallback(
    (value: string) => {
      navigate({
        search: { search: value || undefined },
        replace: true,
      });
    },
    { wait: 300 }
  );

  const { data: owners } = useSuspenseQuery(
    queryUtils.admin.listOwners.queryOptions({
      input: {
        page: 1,
        limit: 50,
        search: search.search || undefined,
      },
    })
  );

  const handleQueryChange = (value: string) => {
    setQuery(value);
    debouncedNavigate(value);
  };

  const handleClear = () => {
    setQuery("");
    debouncedNavigate("");
  };

  return (
    <div className="space-y-4">
      <div className="flex w-full max-w-sm">
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <IconSearch className="size-4 text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search owners..."
            value={query}
          />
          {query && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                aria-label="Clear search"
                onClick={handleClear}
                size="icon-xs"
              >
                <IconX className="size-3" />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>
      </div>

      {owners.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconSearch className="size-6" />
            </EmptyMedia>
            <EmptyTitle>No owners found</EmptyTitle>
            <EmptyDescription>
              Try adjusting your search terms to find what you're looking for.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
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
                        <Badge
                          className="cursor-pointer gap-1"
                          variant="secondary"
                        >
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
      )}
    </div>
  );
}

export function OwnersTableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Search input skeleton - static structure */}
      <div className="flex w-full max-w-sm">
        <div className="group/input-group relative flex h-9 w-full min-w-0 items-center rounded-4xl border border-input bg-input/30">
          <div className="order-first flex h-auto cursor-text items-center justify-center gap-2 py-2 pr-3 pl-3 font-medium text-muted-foreground text-sm">
            <IconSearch className="size-4 text-muted-foreground" />
          </div>
          <p className="flex-1 text-muted-foreground text-sm">
            Search owners...
          </p>
        </div>
      </div>

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
    </div>
  );
}

OwnersTable.Fallback = OwnersTableSkeleton;
