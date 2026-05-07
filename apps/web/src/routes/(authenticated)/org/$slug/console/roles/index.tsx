import {
  IconShieldFilled,
  IconTargetArrow,
  IconUsersGroup,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { CustomRoleManager } from "@/components/console/members/custom-role-manager";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Can } from "@/lib/permission/components";

export const Route = createFileRoute(
  "/(authenticated)/org/$slug/console/roles/"
)({
  staticData: { crumb: "Roles" },
  component: RouteComponent,
});

function InfoCard({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start gap-3 space-y-0">
        <div className="rounded-xl bg-primary/10 p-2 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
}

function RouteComponent() {
  return (
    <section className="space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="font-bold text-3xl tracking-tight">Custom roles</h1>
        <p className="max-w-3xl text-muted-foreground">
          Create reusable team-scoped role templates, choose exactly which
          permissions they grant, then assign them from each member&apos;s
          detail page.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <InfoCard
          description="Define reusable permission bundles like Team Lead, Moderator, or Coordinator."
          icon={IconShieldFilled}
          title="Role templates"
        />
        <InfoCard
          description="Custom roles are team-scoped, so the same user can hold different roles in different teams."
          icon={IconTargetArrow}
          title="Team-specific access"
        />
        <InfoCard
          description="After creating a role here, assign it from the member details page for the relevant user and team."
          icon={IconUsersGroup}
          title="Assignment flow"
        />
      </div>

      <Can
        fallback={
          <Card>
            <CardContent className="p-6 text-muted-foreground">
              You don&apos;t have permission to view custom roles.
            </CardContent>
          </Card>
        }
        permission={(p) => p.org.role.list}
      >
        <Suspense fallback={<CustomRoleManager.Fallback />}>
          <CustomRoleManager />
        </Suspense>
      </Can>
    </section>
  );
}
