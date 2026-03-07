import { IconHash, IconLockFilled } from "@tabler/icons-react";
import { useParams } from "@tanstack/react-router";
import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useChannel, useChannelInfoSidebar } from "@/stores/channel-store";
import { ChannelInfo } from "./channel-info";
import { ChannelNotificationSettings } from "./channel-notification-settings";
import { Members } from "./members";

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
            <TabsTrigger className="rounded-none" value="members">
              Members
            </TabsTrigger>
            <TabsTrigger className="rounded-none" value="notifications">
              Notifications
            </TabsTrigger>
            <TabsTrigger className="rounded-none" value="info">
              About
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members">
            <Members members={channelMembers} />
          </TabsContent>

          <TabsContent value="notifications">
            <Suspense fallback={<ChannelNotificationSettings.Fallback />}>
              <ChannelNotificationSettings channelId={channelId} />
            </Suspense>
          </TabsContent>
          <TabsContent value="info">
            <ChannelInfo
              channelDescription={channel.description ?? ""}
              createdAt={channel.createdAt}
              createdByName={channel.creator.name}
            />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};
