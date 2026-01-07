import { IconBroadcast } from "@tabler/icons-react";
import { Link, useParams } from "@tanstack/react-router";
import { ChevronRight, CircleAlert, Hash } from "lucide-react";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useUserChannels } from "@/hooks/communications/use-user-channels";
import { cn } from "@/lib/utils";

export function NavChannels() {
  const { state, isMobile } = useSidebar();
  const { channels } = useUserChannels();

  const { slug } = useParams({
    from: "/(authenticated)/org/$slug",
  });

  const params = useParams({
    from: "/(authenticated)/org/$slug/(modules)/communication/channels/$id",
    shouldThrow: false,
  });

  const [open, setOpen] = useState(false);

  const isPopover = state === "collapsed" && !isMobile;

  if (channels.length === 0) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton tooltip="No Channels">
          {isPopover ? <CircleAlert /> : "No Channels"}
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  if (isPopover) {
    return (
      <SidebarMenuItem>
        <Collapsible>
          <HoverCard onOpenChange={setOpen} open={open}>
            <HoverCardTrigger
              closeDelay={100}
              delay={50}
              render={
                <CollapsibleTrigger
                  render={
                    <SidebarMenuButton
                      aria-expanded="false"
                      aria-haspopup="true"
                      aria-label="Channels"
                    />
                  }
                />
              }
            >
              <IconBroadcast aria-hidden="true" />
              <span className="sr-only text-balance text-sm">Channels</span>
            </HoverCardTrigger>
            <HoverCardContent
              align="start"
              aria-label="Channels list"
              className="w-fit min-w-56 p-0"
              role="menu"
              side="right"
              sideOffset={8}
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-3 border-b p-3">
                  <span className="text-balance text-sm">Channels</span>
                </div>
                <SidebarMenuSub
                  className={cn(
                    isPopover && "mx-0 border-none p-1.5",
                    !isPopover && "border-gray-700"
                  )}
                  role="menu"
                >
                  {channels.map((channel) => (
                    <SidebarMenuSubItem key={channel.id}>
                      <SidebarMenuSubButton
                        className="[&>svg]:size-3"
                        isActive={channel.id === params?.id}
                        render={
                          <Link
                            onClick={() => setOpen(false)}
                            params={{ slug, id: channel.id }}
                            to="/org/$slug/communication/channels/$id"
                          />
                        }
                      >
                        <Hash />
                        <span>{channel.name}</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </div>
            </HoverCardContent>
          </HoverCard>
        </Collapsible>
      </SidebarMenuItem>
    );
  }

  // Expanded Sidebar
  return (
    <SidebarMenuItem>
      <Collapsible>
        <CollapsibleTrigger
          render={
            <SidebarMenuButton
              aria-expanded="false"
              aria-haspopup={channels.length ? "true" : undefined}
              aria-label="Channels"
            />
          }
        >
          <IconBroadcast aria-hidden="true" />
          <span>Channels</span>
        </CollapsibleTrigger>
        <CollapsibleTrigger
          render={
            <SidebarMenuAction
              aria-label="Toggle Channels submenu"
              className="cursor-pointer hover:bg-transparent data-[state=open]:rotate-90"
            />
          }
        >
          <ChevronRight aria-hidden="true" />
          <span className="sr-only">Toggle</span>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {channels.map((channel) => (
              <SidebarMenuSubItem key={channel.id}>
                <SidebarMenuSubButton
                  isActive={channel.id === params?.id}
                  render={
                    <Link
                      params={{ slug, id: channel.id }}
                      to="/org/$slug/communication/channels/$id"
                    />
                  }
                >
                  <Hash />
                  <span>{channel.name}</span>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}
