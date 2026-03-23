import { IconSearch } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense, useState } from "react";
import { OwnersTable } from "@/components/platform/owners/owners-table";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute(
  "/(authenticated)/platform/dashboard/owners/"
)({
  staticData: { crumb: "Owners" },
  component: RouteComponent,
});

function RouteComponent() {
  const [search, setSearch] = useState("");

  return (
    <section className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-2xl">Organization Owners</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Users who own one or more organizations. Click to view their
            organizations.
          </p>
        </div>
        <div className="relative w-64">
          <IconSearch className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search owners..."
            value={search}
          />
        </div>
      </div>
      <Suspense fallback={<OwnersTable.Fallback />}>
        <OwnersTable search={search} />
      </Suspense>
    </section>
  );
}
