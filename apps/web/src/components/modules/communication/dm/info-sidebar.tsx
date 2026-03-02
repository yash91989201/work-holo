import { IconUser } from "@tabler/icons-react";
import { useParams } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useDmConversations } from "@/hooks/communications/dm/use-dm-conversations";
import { useDmPresence } from "@/hooks/communications/dm/use-dm-presence";
import { cn } from "@/lib/utils";
import { useDmInfoSidebar } from "@/stores/dm-store";

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
        className="flex h-full flex-col gap-0 border-border border-l bg-background/95 p-0 backdrop-blur-sm supports-backdrop-filter:bg-background/60 sm:max-w-md"
        side="right"
      >
        <div className="shrink-0 border-border border-b bg-muted/30 p-4">
          <div className="flex items-start gap-3">
            <div className="relative">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  alt={otherParticipant?.name}
                  src={otherParticipant?.image || undefined}
                />
                <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/10 font-medium text-lg text-primary">
                  {otherParticipant?.name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span
                className={cn(
                  "absolute -right-0.5 -bottom-0.5 h-4 w-4 rounded-full border-2 border-background",
                  isOnline ? "bg-emerald-500" : "bg-muted-foreground/40"
                )}
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold text-foreground text-lg">
                {otherParticipant?.name}
              </h3>
              <p className="text-muted-foreground text-sm">
                {otherParticipant?.email}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <Badge className="text-xs" variant="secondary">
                  <IconUser className="mr-1 h-3 w-3" />
                  Direct Message
                </Badge>
                <Badge
                  className={cn(
                    "text-xs",
                    isOnline && "bg-emerald-500/10 text-emerald-600"
                  )}
                  variant="outline"
                >
                  {isOnline ? "Online" : "Offline"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <ScrollArea className="h-0 flex-1">
          <div className="space-y-6 p-4">
            {/* Conversation Info */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Conversation Info</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Started</span>
                  <span>
                    {conversation?.createdAt
                      ? new Date(conversation.createdAt).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Messages</span>
                  <span>{conversation?.messageCount ?? 0}</span>
                </div>
              </div>
            </div>

            <Separator className="bg-border/50" />

            {/* Participant Info */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Participant</h4>
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    alt={otherParticipant?.name}
                    src={otherParticipant?.image || undefined}
                  />
                  <AvatarFallback>
                    {otherParticipant?.name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">
                    {otherParticipant?.name}
                  </p>
                  <p className="truncate text-muted-foreground text-sm">
                    {otherParticipant?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
