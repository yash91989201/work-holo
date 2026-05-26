import { IconHash, IconLockFilled } from "@tabler/icons-react";
import { useParams } from "@tanstack/react-router";
import { Badge } from "@work-holo/ui/components/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@work-holo/ui/components/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@work-holo/ui/components/tabs";
import { Suspense } from "react";
import { useChannel, useChannelInfoSidebar } from "@/stores/channel-store";
import { ChannelInfo } from "./channel-info";
import { ChannelMembers } from "./channel-members";
import { ChannelNotificationSettings } from "./channel-notification-settings";

export const ChannelInfoSidebar = () => {
  const { channelId } = useParams({
    from: "/(authenticated)/org/$slug/workspace/communication/channels/$channelId",
  });

  const { channel, channelMembers } = useChannel(channelId);
  const { isOpen, toggleInfoSidebar } = useChannelInfoSidebar();

  return (
    <Sheet onOpenChange={toggleInfoSidebar} open={isOpen}>
      <SheetContent
        className="flex h-full min-w-md flex-col gap-0 border-border border-l bg-background p-0 sm:max-w-sm"
        side="right"
      >
        <SheetHeader className="flex flex-row items-center gap-3">
          <Badge
            className="flex size-9 shrink-0 items-center justify-center rounded-lg [&>svg]:size-6 [&>svg]:text-primary"
            variant="outline"
          >
            {channel.isPrivate ? <IconLockFilled /> : <IconHash />}
          </Badge>
          <SheetTitle className="truncate text-lg leading-tight">
            {channel.name}
          </SheetTitle>
        </SheetHeader>

        <Tabs className="flex min-h-0 flex-1 flex-col" defaultValue="members">
          <TabsList className="w-full rounded-none">
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="info">About</TabsTrigger>
          </TabsList>

          <TabsContent className="flex min-h-0 flex-col" value="members">
            <ChannelMembers channelId={channelId} members={channelMembers} />
          </TabsContent>

          <TabsContent value="notifications">
            <Suspense fallback={<ChannelNotificationSettings.Fallback />}>
              <ChannelNotificationSettings channelId={channelId} />
            </Suspense>
          </TabsContent>
          <TabsContent value="info">
            <ChannelInfo
              channelDescription={channel.description}
              createdAt={channel.createdAt}
              createdByName={channel.creator.name}
            />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};
