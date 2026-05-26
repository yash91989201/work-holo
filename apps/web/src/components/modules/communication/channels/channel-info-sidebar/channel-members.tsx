import { IconSearch, IconX } from "@tabler/icons-react";
import { useDebouncedValue } from "@tanstack/react-pacer";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@work-holo/ui/components/avatar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@work-holo/ui/components/input-group";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@work-holo/ui/components/item";
import { ScrollArea } from "@work-holo/ui/components/scroll-area";
import { useState } from "react";
import { Can, useCan } from "@/lib/permission";
import { cn } from "@/lib/utils";
import { getInitials } from "@/utils";
import { AddChannelMember } from "./add-channel-member";
import { RemoveMemberDialog } from "./remove-member-dialog";

type Member = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  isOnline: boolean;
};

export const ChannelMembers = ({
  channelId,
  members,
}: {
  channelId: string;
  members: Member[];
}) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(query, { wait: 300 });
  const canRemoveMember = useCan((p) => p.channel.member.remove);

  const filtered = debouncedQuery.trim()
    ? members.filter(
        (m) =>
          m.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          m.email.toLowerCase().includes(debouncedQuery.toLowerCase())
      )
    : members;

  const sorted = [
    ...filtered.filter((m) => m.isOnline),
    ...filtered.filter((m) => !m.isOnline),
  ];

  const currentMemberIds = members.map((m) => m.id);

  return (
    <div className="flex h-full flex-col">
      <div className="space-y-3 p-3">
        <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
          {members.length} {members.length === 1 ? "Member" : "Members"}
        </p>

        <InputGroup>
          <InputGroupAddon align="inline-start">
            <IconSearch className="size-3.5" />
          </InputGroupAddon>
          <InputGroupInput
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search members…"
            value={query}
          />
          {query && (
            <InputGroupAddon align="inline-end">
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
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="px-3 pb-3">
          {sorted.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground text-sm">
              No members found.
            </p>
          ) : (
            <ItemGroup>
              {sorted.map((member) => (
                <Item key={member.id} size="xs">
                  <ItemMedia>
                    <div className="relative shrink-0">
                      <Avatar className="h-7 w-7">
                        <AvatarImage
                          alt={member.name}
                          src={member.image ?? undefined}
                        />
                        <AvatarFallback className="text-[10px]">
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span
                        className={cn(
                          "absolute right-0 bottom-0 h-2 w-2 rounded-full border-[1.5px] border-background",
                          member.isOnline
                            ? "bg-green-500"
                            : "bg-muted-foreground/40"
                        )}
                      />
                    </div>
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{member.name}</ItemTitle>
                    <ItemDescription>{member.email}</ItemDescription>
                  </ItemContent>
                  {canRemoveMember && (
                    <ItemActions>
                      <RemoveMemberDialog
                        channelId={channelId}
                        memberId={member.id}
                        memberName={member.name}
                      />
                    </ItemActions>
                  )}
                </Item>
              ))}
            </ItemGroup>
          )}
        </div>
      </ScrollArea>

      <Can permission={(p) => p.channel.member.add}>
        <div className="border-t p-3">
          <AddChannelMember
            channelId={channelId}
            currentMemberIds={currentMemberIds}
          />
        </div>
      </Can>
    </div>
  );
};
