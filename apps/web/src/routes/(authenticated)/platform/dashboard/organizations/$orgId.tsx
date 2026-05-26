import { IconArrowLeft } from "@tabler/icons-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@work-holo/ui/components/button";
import { Suspense, useState } from "react";
import { OrgDetail } from "@/components/platform/organizations/org-detail";

export const Route = createFileRoute(
  "/(authenticated)/platform/dashboard/organizations/$orgId"
)({
  staticData: { crumb: "Organization Details" },
  component: RouteComponent,
});

function RouteComponent() {
  const { orgId } = Route.useParams();
  const [search, setSearch] = useState("");

  return (
    <section className="space-y-6 p-6">
      <div className="flex items-center gap-3">
        <Link to="/platform/dashboard/organizations">
          <Button size="icon" variant="ghost">
            <IconArrowLeft className="size-4" />
          </Button>
        </Link>
        <h1 className="font-semibold text-2xl">Organization Details</h1>
      </div>
      <Suspense fallback={<OrgDetail.Fallback />}>
        <OrgDetail orgId={orgId} search={search} setSearch={setSearch} />
      </Suspense>
    </section>
  );
}
