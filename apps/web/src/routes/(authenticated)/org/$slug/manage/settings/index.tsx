import { IconSettings } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export const Route = createFileRoute(
  "/(authenticated)/org/$slug/manage/settings/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="p-6">
      <Empty className="min-h-100 rounded-lg border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconSettings />
          </EmptyMedia>
          <EmptyTitle>Settings</EmptyTitle>
          <EmptyDescription>
            Organization settings are being added here. Check back soon for new
            management features.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </section>
  );
}
