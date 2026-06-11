import { IconHash, IconMessage2 } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@work-holo/ui/components/tabs";
import { ChannelFeature } from "@/components/console/modules/communication/channel-feature";
import { DirectMessageFeature } from "@/components/console/modules/communication/direct-message-feature";

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
          <ChannelFeature />
        </TabsContent>

        <TabsContent className="pt-6" value="direct_message">
          <DirectMessageFeature />
        </TabsContent>
      </Tabs>
    </section>
  );
}
