import { IconSettings } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@work-holo/ui/components/empty";

export const Route = createFileRoute("/(authenticated)/org/$slug/manage/")({
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
          <EmptyTitle>Manage Organization</EmptyTitle>
          <EmptyDescription>
            Organization owner controls are being added here. Check back soon
            for new management features.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </section>
  );
}
