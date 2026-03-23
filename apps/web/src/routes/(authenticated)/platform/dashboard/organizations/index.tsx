import { IconSearch } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense, useState } from "react";
import { OrganizationsGrid } from "@/components/platform/organizations/organizations-grid";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute(
  "/(authenticated)/platform/dashboard/organizations/"
)({
  staticData: { crumb: "Organizations" },
  component: RouteComponent,
});

function RouteComponent() {
  const [search, setSearch] = useState("");

  return (
    <section className="space-y-6 p-6">
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
      <Suspense fallback={<OrganizationsGrid.Fallback />}>
        <OrganizationsGrid search={search} />
      </Suspense>
    </section>
  );
}
