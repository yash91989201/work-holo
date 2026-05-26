import { IconArrowLeft } from "@tabler/icons-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@work-holo/ui/components/button";
import { Suspense } from "react";
import { OwnerDetail } from "@/components/platform/owners/owner-detail";

export const Route = createFileRoute(
  "/(authenticated)/platform/dashboard/owners/$ownerId"
)({
  staticData: { crumb: "Owner Details" },
  component: RouteComponent,
});

function RouteComponent() {
  const { ownerId } = Route.useParams();

  return (
    <section className="space-y-6 p-6">
      <div className="flex items-center gap-3">
        <Link to="/platform/dashboard/owners">
          <Button size="icon" variant="ghost">
            <IconArrowLeft className="size-4" />
          </Button>
        </Link>
        <h1 className="font-semibold text-2xl">Owner Details</h1>
      </div>
      <Suspense fallback={<OwnerDetail.Fallback />}>
        <OwnerDetail ownerId={ownerId} />
      </Suspense>
    </section>
  );
}
