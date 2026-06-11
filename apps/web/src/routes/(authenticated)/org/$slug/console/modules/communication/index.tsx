import { IconHash, IconMessage2 } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@work-holo/ui/components/tabs";
import { Suspense } from "react";
import { DirectMessageFeature } from "@/components/console/modules/communication/direct-message-feature";
import { ChannelsListTable } from "@/components/modules/communication/channels/channels-list-table";

export const Route = createFileRoute(
  "/(authenticated)/org/$slug/console/modules/communication/"
)({
  staticData: { crumb: "Communication" },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="p-6">
      <Tabs defaultValue="channels">
        <TabsList variant="line">
          <TabsTrigger value="channels">
            <IconHash className="h-4 w-4" />
            Channels
          </TabsTrigger>
          <TabsTrigger value="direct_message">
            <IconMessage2 className="h-4 w-4" />
            Direct Messages
          </TabsTrigger>
        </TabsList>

        <TabsContent className="pt-6" value="channels">
          <Suspense fallback={<ChannelsListTable.Fallback />}>
            <ChannelsListTable />
          </Suspense>
        </TabsContent>

        <TabsContent className="pt-6" value="direct_message">
          <Suspense fallback={<DirectMessageFeature.Fallback />}>
            <DirectMessageFeature />
          </Suspense>
        </TabsContent>
      </Tabs>
    </section>
  );
}
