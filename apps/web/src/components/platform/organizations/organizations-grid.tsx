import { IconBuilding, IconUsers } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { queryUtils } from "@/utils/orpc";

export function OrganizationsGrid({ search }: { search: string }) {
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

export function OrganizationsGridSkeleton() {
  return (
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
  );
}

OrganizationsGrid.Fallback = OrganizationsGridSkeleton;
