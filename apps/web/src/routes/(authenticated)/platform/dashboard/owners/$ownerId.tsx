import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Building2, Crown, Mail, Users } from "lucide-react";
import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { queryUtils } from "@/utils/orpc";

export const Route = createFileRoute(
  "/(authenticated)/platform/dashboard/owners/$ownerId"
)({
  component: OwnerDetailPage,
});

function OwnerDetailPage() {
  const { ownerId } = Route.useParams();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link to="/platform/dashboard/owners">
          <Button size="icon" variant="ghost">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <h1 className="font-semibold text-2xl">Owner Details</h1>
      </div>
      <Suspense fallback={<OwnerDetailSkeleton />}>
        <OwnerDetail ownerId={ownerId} />
      </Suspense>
    </div>
  );
}

function OwnerDetail({ ownerId }: { ownerId: string }) {
  const { data } = useSuspenseQuery(
    queryUtils.admin.getOwnerOrganizations.queryOptions({
      input: { userId: ownerId },
    })
  );

  return (
    <div className="space-y-6">
      {/* Owner Info */}
      <div className="flex items-center gap-4 rounded-lg border p-4">
        <div className="flex size-12 items-center justify-center rounded-lg bg-amber-500/10">
          <Crown className="size-6 text-amber-500" />
        </div>
        <div>
          <h2 className="font-semibold text-xl">{data.owner.name}</h2>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Mail className="size-3" />
            {data.owner.email}
            {data.owner.banned && <Badge variant="destructive">Banned</Badge>}
          </div>
          <p className="mt-1 text-muted-foreground text-xs">
            Platform since {new Date(data.owner.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Owned Organizations */}
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
                        <Building2 className="size-5 text-primary" />
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
                      <Users className="size-4" />
                      <span>
                        {org.memberCount} member
                        {org.memberCount !== 1 ? "s" : ""}
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

function OwnerDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 rounded-lg border p-4">
        <div className="size-12 animate-pulse rounded-lg bg-muted" />
        <div className="space-y-2">
          <div className="h-5 w-48 animate-pulse rounded bg-muted" />
          <div className="h-4 w-64 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
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
            <CardContent>
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
