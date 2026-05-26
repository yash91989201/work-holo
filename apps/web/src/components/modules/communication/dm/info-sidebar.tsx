import { IconMessage } from "@tabler/icons-react";
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
import { useDmConversations } from "@/hooks/communications/dm/use-dm-conversations";
import { useDmPresence } from "@/hooks/communications/dm/use-dm-presence";
import { useDmInfoSidebar } from "@/stores/dm-store";
import { DmInfo } from "./dm-info";
import { DmNotificationSettings } from "./dm-notification-settings";

export function DmInfoSidebar() {
  const { conversationId } = useParams({
    from: "/(authenticated)/org/$slug/workspace/communication/dm/$conversationId",
  });

  const { conversations } = useDmConversations();
  const { isUserOnline } = useDmPresence(conversationId);
  const { isOpen, toggleInfoSidebar } = useDmInfoSidebar();

  const conversation = conversations.find((c) => c.id === conversationId);
  const otherParticipant = conversation?.otherParticipant;
  const isOnline = otherParticipant ? isUserOnline(otherParticipant.id) : false;

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
            <IconMessage />
          </Badge>
          <SheetTitle className="truncate text-lg leading-tight">
            {otherParticipant?.name}
          </SheetTitle>
        </SheetHeader>

        <Tabs
          className="flex min-h-0 flex-1 flex-col"
          defaultValue="notifications"
        >
          <TabsList className="w-full rounded-none">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="info">About</TabsTrigger>
          </TabsList>

          <TabsContent
            className="flex min-h-0 flex-1 flex-col"
            value="notifications"
          >
            <Suspense fallback={<DmNotificationSettings.Fallback />}>
              <DmNotificationSettings conversationId={conversationId} />
            </Suspense>
          </TabsContent>

          <TabsContent className="flex min-h-0 flex-1 flex-col" value="info">
            <DmInfo
              conversation={conversation ?? undefined}
              isOnline={isOnline}
              otherParticipant={otherParticipant ?? undefined}
            />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
