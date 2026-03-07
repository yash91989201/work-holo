import { IconHash, IconLockFilled } from "@tabler/icons-react";
import { useParams } from "@tanstack/react-router";
import { ScrollArea } from "@/components/ui/scroll-area";
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

  const { channel, channelMembers, onlineUsersCount } = useChannel(channelId);
  const { isOpen, toggleInfoSidebar } = useChannelInfoSidebar();

  return (
    <Sheet onOpenChange={toggleInfoSidebar} open={isOpen}>
      <SheetContent
        className="flex h-full min-w-sm flex-col gap-0 border-border border-l bg-background p-0 sm:max-w-sm"
        side="right"
      >
        <SheetHeader className="shrink-0 border-border border-b px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
              {channel.isPrivate ? (
                <IconLockFilled className="h-4 w-4 text-primary" />
              ) : (
                <IconHash className="h-4 w-4 text-primary" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <SheetTitle className="truncate text-base">
                {channel.name}
              </SheetTitle>
              <div className="mt-0.5 flex items-center gap-2 text-muted-foreground text-xs">
                <span className="capitalize">{channel.type}</span>
                <span className="text-border">·</span>
                <span>{channel.isPrivate ? "Private" : "Public"}</span>
                <span className="text-border">·</span>
                <span>{channelMembers.length} members</span>
                <span className="text-border">·</span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
                  {onlineUsersCount} online
                </span>
              </div>
            </div>
          </div>
        </SheetHeader>

        <Tabs className="flex min-h-0 flex-1 flex-col" defaultValue="members">
          <div className="shrink-0 border-border border-b px-4">
            <TabsList className="h-auto w-full justify-start gap-0 rounded-none bg-transparent p-0">
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger
                className="h-9 rounded-none border-transparent border-b-2 px-3 text-xs data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
                value="notifications"
              >
                Notifications
              </TabsTrigger>
              <TabsTrigger value="info">About</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            className="mt-0 min-h-0 flex-1 data-[state=active]:flex data-[state=active]:flex-col"
            value="members"
          >
            <ScrollArea className="flex-1">
              <div className="p-4">
                <Members members={channelMembers} />
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent
            className="mt-0 min-h-0 flex-1 data-[state=active]:flex data-[state=active]:flex-col"
            value="info"
          >
            <ScrollArea className="flex-1">
              <div className="p-4">
                <ChannelInfo
                  channelDescription={channel.description ?? ""}
                  createdAt={channel.createdAt}
                  createdByName={channel.creator.name}
                />
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent
            className="mt-0 min-h-0 flex-1 data-[state=active]:flex data-[state=active]:flex-col"
            value="notifications"
          >
            <ScrollArea className="flex-1">
              <div className="p-4">
                <ChannelNotificationSettings channelId={channelId} />
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};
