import { IconPhone, IconSearch, IconVideo, IconX } from "@tabler/icons-react";
import { useDebouncedValue } from "@tanstack/react-pacer";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@work-holo/ui/components/avatar";
import { Badge } from "@work-holo/ui/components/badge";
import { Button } from "@work-holo/ui/components/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@work-holo/ui/components/hover-card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@work-holo/ui/components/input-group";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@work-holo/ui/components/sidebar";
import { Spinner } from "@work-holo/ui/components/spinner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@work-holo/ui/components/tabs";
import { useMemo, useState } from "react";
import { CallHistoryItem } from "@/components/modules/communication/calls/call-history-item";
import { useCall } from "@/hooks/communications/use-call";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { useListOrgMembers } from "@/hooks/use-list-org-members";
import type { PresenceStatus } from "@/hooks/use-presence";
import { useCallStore, useMissedCallCount } from "@/stores/call-store";
import { getInitials } from "@/utils";
import { queryUtils } from "@/utils/orpc";

// ─── Presence helpers ────────────────────────────────────────────────────────

function presencePriority(status: PresenceStatus | undefined): number {
  switch (status) {
    case "available":
    case "in_call":
      return 0;
    case "busy":
    case "in_meeting":
    case "dnd":
    case "on_break":
      return 1;
    case "away":
      return 2;
    default:
      return 3; // offline / unknown
  }
}

function presenceDotClass(status: PresenceStatus | undefined): string {
  switch (status) {
    case "available":
    case "in_call":
      return "bg-green-500";
    case "busy":
    case "in_meeting":
    case "dnd":
    case "on_break":
      return "bg-amber-500";
    case "away":
      return "bg-yellow-400";
    default:
      return "bg-muted-foreground/40";
  }
}

// ─── Call Directory ───────────────────────────────────────────────────────────

function CallDirectory() {
  const { user: me } = useAuthedSession();
  const { members } = useListOrgMembers();

  const { data: allowedData } = useSuspenseQuery(
    queryUtils.org.moduleConfig.listAllowedUsers.queryOptions({
      input: { module: "calling" },
    })
  );
  const allowedSet =
    allowedData?.userIds === null ? null : new Set(allowedData?.userIds ?? []);

  const { data: presenceData } = useQuery(
    queryUtils.org.presence.getOrgPresence.queryOptions({
      input: {},
      refetchInterval: 30_000,
    })
  );
  const presence = presenceData?.presence ?? {};

  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(query, { wait: 200 });
  const { initiate } = useCall();

  const sortedMembers = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return members
      .filter(
        (m) =>
          m.userId !== me.id &&
          (allowedSet === null || allowedSet.has(m.userId)) &&
          (!q || (m.user.name ?? "").toLowerCase().includes(q))
      )
      .sort((a, b) => {
        const pa = presencePriority(
          presence[a.userId]?.status as PresenceStatus
        );
        const pb = presencePriority(
          presence[b.userId]?.status as PresenceStatus
        );
        if (pa !== pb) return pa - pb;
        return (a.user.name ?? "").localeCompare(b.user.name ?? "");
      });
  }, [members, me.id, allowedSet, presence, debouncedQuery]);

  return (
    <div className="flex flex-col gap-1.5">
      <InputGroup>
        <InputGroupAddon align="inline-start" className="py-0">
          <IconSearch className="size-3.5" />
        </InputGroupAddon>
        <InputGroupInput
          className="h-7 text-xs"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search members…"
          value={query}
        />
        {query && (
          <InputGroupAddon align="inline-end" className="py-0">
            <InputGroupButton
              aria-label="Clear search"
              onClick={() => setQuery("")}
              size="icon-xs"
            >
              <IconX className="size-3" />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>

      <div className="max-h-64 overflow-y-auto">
        {sortedMembers.length === 0 ? (
          <p className="px-1 py-2 text-center text-muted-foreground text-xs">
            {debouncedQuery ? "No members found" : "No callable members"}
          </p>
        ) : (
          sortedMembers.map((m) => {
            const status = presence[m.userId]?.status as
              | PresenceStatus
              | undefined;
            return (
              <div
                className="flex items-center gap-2 rounded-md px-1.5 py-1 hover:bg-muted/50"
                key={m.userId}
              >
                <div className="relative shrink-0">
                  <Avatar className="size-6">
                    <AvatarImage src={m.user.image ?? undefined} />
                    <AvatarFallback className="text-[9px]">
                      {getInitials(m.user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className={`absolute -right-0.5 -bottom-0.5 size-2 rounded-full border border-sidebar ${presenceDotClass(status)}`}
                  />
                </div>
                <span className="min-w-0 flex-1 truncate text-sm">
                  {m.user.name ?? m.user.email}
                </span>
                <div className="flex shrink-0 gap-0.5">
                  <Button
                    aria-label={`Call ${m.user.name} (voice)`}
                    className="size-6 text-muted-foreground hover:text-foreground"
                    onClick={() =>
                      initiate({
                        calleeIds: [m.userId],
                        type: "voice",
                      })
                    }
                    size="icon-sm"
                    variant="ghost"
                  >
                    <IconPhone className="size-3.5" />
                  </Button>
                  <Button
                    aria-label={`Call ${m.user.name} (video)`}
                    className="size-6 text-muted-foreground hover:text-foreground"
                    onClick={() =>
                      initiate({
                        calleeIds: [m.userId],
                        type: "video",
                      })
                    }
                    size="icon-sm"
                    variant="ghost"
                  >
                    <IconVideo className="size-3.5" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ─── Call Recents ─────────────────────────────────────────────────────────────

function CallRecents() {
  const { user: me } = useAuthedSession();
  const { members } = useListOrgMembers();
  const { initiate } = useCall();
  const clearMissedCount = useCallStore((s) => s.clearMissedCount);

  // Clear the badge when this tab mounts (user is viewing recents)
  useEffect(() => {
    clearMissedCount();
  }, [clearMissedCount]);

  const memberMap = useMemo(() => {
    const map = new Map<
      string,
      { name: string | null; image: string | null }
    >();
    for (const m of members) {
      map.set(m.userId, { name: m.user.name, image: m.user.image ?? null });
    }
    return map;
  }, [members]);

  const { data, isLoading } = useQuery(
    queryUtils.communication.call.list.queryOptions({
      input: { limit: 20 },
    })
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Spinner className="size-4" />
      </div>
    );
  }

  const calls = data?.items ?? [];
  if (calls.length === 0) {
    return (
      <p className="px-1 py-3 text-center text-muted-foreground text-xs">
        No recent calls
      </p>
    );
  }

  return (
    <div className="max-h-72 overflow-y-auto">
      {calls.map((call) => {
        const otherParticipant = call.participants.find(
          (p) => p.userId !== me.id
        );
        const otherUser = otherParticipant
          ? memberMap.get(otherParticipant.userId)
          : null;

        const isChannelCall = call.sourceType === "channel";
        const label = isChannelCall
          ? `#${call.sourceConversationId ?? "channel"}`
          : (otherUser?.name ?? "Unknown");

        const avatarUrl = isChannelCall ? null : otherUser?.image;

        const canRedial = !isChannelCall && otherParticipant;

        return (
          <CallHistoryItem
            avatarUrl={avatarUrl}
            callId={call.id}
            endedAt={call.endedAt}
            key={call.id}
            label={label}
            onRedial={
              canRedial
                ? () =>
                    initiate({
                      calleeIds: [otherParticipant.userId],
                      type: "voice",
                    })
                : undefined
            }
            onVideoRedial={
              canRedial
                ? () =>
                    initiate({
                      calleeIds: [otherParticipant.userId],
                      type: "video",
                    })
                : undefined
            }
            sourceType={call.sourceType}
            startedAt={call.startedAt}
            status={call.status}
            type={call.type}
          />
        );
      })}
    </div>
  );
}

// ─── Shared tab content ───────────────────────────────────────────────────────

function CallsTabContent() {
  return (
    <Tabs className="w-full" defaultValue="directory">
      <TabsList className="w-full" variant="line">
        <TabsTrigger className="flex-1" value="directory">
          Directory
        </TabsTrigger>
        <TabsTrigger className="flex-1" value="recents">
          Recents
        </TabsTrigger>
      </TabsList>
      <TabsContent className="mt-2" value="directory">
        <CallDirectory />
      </TabsContent>
      <TabsContent className="mt-2" value="recents">
        <CallRecents />
      </TabsContent>
    </Tabs>
  );
}

// ─── Main sidebar group ───────────────────────────────────────────────────────

const CallsGroup = () => {
  const { state, isMobile } = useSidebar();
  const missedCount = useMissedCallCount();
  const isPopover = state === "collapsed" && !isMobile;

  if (isPopover) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Calls</SidebarGroupLabel>
        <SidebarGroupContent>
          <HoverCard>
            <HoverCardTrigger
              render={
                <SidebarMenuButton aria-label="Calls" className="relative">
                  <IconPhone />
                  <span className="sr-only">Calls</span>
                  {missedCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-destructive" />
                  )}
                </SidebarMenuButton>
              }
            />
            <HoverCardContent
              align="start"
              className="w-72 p-3"
              side="right"
              sideOffset={8}
            >
              <CallsTabContent />
            </HoverCardContent>
          </HoverCard>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup>
      <div className="flex items-center">
        <SidebarGroupLabel className="flex-1">Calls</SidebarGroupLabel>
        {missedCount > 0 && (
          <Badge
            className="mr-2 h-5 min-w-5 items-center justify-center rounded-full p-0 text-[10px]"
            variant="destructive"
          >
            {missedCount}
          </Badge>
        )}
      </div>
      <SidebarGroupContent className="px-2 pb-2">
        <CallsTabContent />
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

const CallsGroupSkeleton = () => (
  <SidebarGroup>
    <SidebarGroupLabel>Calls</SidebarGroupLabel>
    <SidebarGroupContent>
      <SidebarMenuItem>
        <SidebarMenuButton disabled>
          <IconPhone />
          <span>Calls</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarGroupContent>
  </SidebarGroup>
);

CallsGroup.Fallback = CallsGroupSkeleton;

export { CallsGroup };
