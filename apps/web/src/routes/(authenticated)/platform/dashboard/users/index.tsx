import { IconSearch } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense, useState } from "react";
import { UsersTable } from "@/components/platform/users/users-table";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute(
  "/(authenticated)/platform/dashboard/users/"
)({
  staticData: { crumb: "Users" },
  component: RouteComponent,
});

function RouteComponent() {
  const [search, setSearch] = useState("");
  const { adminRole } = Route.useRouteContext();

  return (
    <section className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-2xl">Users</h1>
        <div className="relative w-64">
          <IconSearch className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email..."
            value={search}
          />
        </div>
      </div>
      <Suspense fallback={<UsersTable.Fallback />}>
        <UsersTable adminRole={adminRole} search={search} />
      </Suspense>
    </section>
  );
}
