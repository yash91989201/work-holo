import { IconBuilding, IconSearch, IconUsers } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Suspense, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { queryUtils } from "@/utils/orpc";

export const Route = createFileRoute(
  "/(authenticated)/platform/dashboard/organizations/"
)({
  component: OrganizationsPage,
});

function OrganizationsPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-2xl">Organizations</h1>
        <div className="relative w-64">
          <IconSearch className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search organizations..."
            value={search}
          />
        </div>
      </div>
      <Suspense fallback={<OrganizationsGridSkeleton />}>
        <OrganizationsGrid search={search} />
      </Suspense>
    </div>
  );
}

function OrganizationsGrid({ search }: { search: string }) {
  const { data: orgs } = useSuspenseQuery(
    queryUtils.admin.listOrganizations.queryOptions({
      input: {
        page: 1,
        limit: 50,
        search: search || undefined,
      },
    })
  );

  if (orgs.length === 0) {
    return (
      <p className="py-8 text-center text-muted-foreground">
        No organizations found.
      </p>
    );
  }

  return (
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
                  {org.memberCount} member{org.memberCount !== 1 ? "s" : ""}
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
  );
}

function OrganizationsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton has no stable id
        <Card key={i}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="size-10 animate-pulse rounded-lg bg-muted" />
              <div className="flex-1 space-y-1">
                <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                <div className="h-3 w-20 animate-pulse rounded bg-muted" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-3 w-36 animate-pulse rounded bg-muted" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
