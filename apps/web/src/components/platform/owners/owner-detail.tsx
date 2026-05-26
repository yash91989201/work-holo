import {
  IconBuilding,
  IconCrown,
  IconMail,
  IconUsers,
} from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Badge } from "@work-holo/ui/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@work-holo/ui/components/card";
import { Skeleton } from "@work-holo/ui/components/skeleton";
import { queryUtils } from "@/utils/orpc";

export function OwnerDetail({ ownerId }: { ownerId: string }) {
  const { data } = useSuspenseQuery(
    queryUtils.admin.getOwnerOrganizations.queryOptions({
      input: { userId: ownerId },
    })
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 rounded-lg border p-4">
        <div className="flex size-12 items-center justify-center rounded-lg bg-amber-500/10">
          <IconCrown className="size-6 text-amber-500" />
        </div>
        <div>
          <h2 className="font-semibold text-xl">{data.owner.name}</h2>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <IconMail className="size-3" />
            {data.owner.email}
            {data.owner.banned && <Badge variant="destructive">Banned</Badge>}
          </div>
          <p className="mt-1 text-muted-foreground text-xs">
            Platform since {new Date(data.owner.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-medium text-lg">
          Owned Organizations ({data.organizations.length})
        </h3>
        {data.organizations.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            This user does not own any organizations.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.organizations.map((org) => (
              <Link
                key={org.orgId}
                params={{ orgId: org.orgId }}
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
                          {org.orgName}
                        </CardTitle>
                        <p className="truncate text-muted-foreground text-xs">
                          {org.orgSlug}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <IconUsers className="size-4" />
                      <span>
                        {org.memberCount} member
                        {org.memberCount === 1 ? "" : "s"}
                      </span>
                    </div>
                    <p className="mt-2 text-muted-foreground text-xs">
                      Created {new Date(org.orgCreatedAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function OwnerDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 rounded-lg border p-4">
        <Skeleton className="size-12 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
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
            <CardContent>
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

OwnerDetail.Fallback = OwnerDetailSkeleton;
