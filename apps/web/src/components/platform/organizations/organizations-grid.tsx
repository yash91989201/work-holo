import {
  IconBuilding,
  IconSearch,
  IconUsers,
  IconX,
} from "@tabler/icons-react";
import { useDebouncedCallback } from "@tanstack/react-pacer";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Badge } from "@work-holo/ui/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@work-holo/ui/components/card";
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
import { useState } from "react";
import { queryUtils } from "@/utils/orpc";

export function OrganizationsGrid() {
  const search = useSearch({
    from: "/(authenticated)/platform/dashboard/organizations/",
  });

  const navigate = useNavigate({
    from: "/platform/dashboard/organizations/",
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

  const { data: orgs } = useSuspenseQuery(
    queryUtils.admin.listOrganizations.queryOptions({
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
            placeholder="Search organizations..."
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

      {orgs.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconSearch className="size-6" />
            </EmptyMedia>
            <EmptyTitle>No organizations found</EmptyTitle>
            <EmptyDescription>
              Try adjusting your search terms or filters to find what you're
              looking for.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orgs.map((org) => (
            <Link
              key={org.id}
              params={{ orgId: org.id }}
              to="/platform/dashboard/organizations/$orgId"
            >
              <Card className="cursor-pointer transition-shadow hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                      <IconBuilding className="size-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="truncate text-base">
                        {org.name}
                      </CardTitle>
                      <p className="truncate text-muted-foreground text-xs">
                        {org.slug}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <IconUsers className="size-4" />
                    <span>
                      {org.memberCount} member
                      {org.memberCount === 1 ? "" : "s"}
                    </span>
                  </div>
                  {org.owners.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {org.owners.map((owner) => (
                        <Badge key={owner.userId} variant="secondary">
                          {owner.userName}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <p className="text-muted-foreground text-xs">
                    Created {new Date(org.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function OrganizationsGridSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex w-full max-w-sm">
        <div className="group/input-group relative flex h-9 w-full min-w-0 items-center rounded-4xl border border-input bg-input/30">
          <div className="order-first flex h-auto cursor-text items-center justify-center gap-2 py-2 pr-3 pl-3 font-medium text-muted-foreground text-sm">
            <IconSearch className="size-4 text-muted-foreground" />
          </div>
          <p className="flex-1 text-muted-foreground text-sm">
            Search organizations...
          </p>
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton has no stable id
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-lg" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-36" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

OrganizationsGrid.Fallback = OrganizationsGridSkeleton;
