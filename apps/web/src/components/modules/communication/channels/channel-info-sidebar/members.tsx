import { IconSearch, IconX } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getNameInitials } from "@/utils";

export const Members = ({
  members,
}: {
  members: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    isOnline: boolean;
  }[];
}) => {
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showSearch) {
      const t = setTimeout(() => inputRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [showSearch]);

  const filtered = query.trim()
    ? members.filter(
        (m) =>
          m.name.toLowerCase().includes(query.toLowerCase()) ||
          m.email.toLowerCase().includes(query.toLowerCase())
      )
    : members;

  const onlineMembers = filtered.filter((m) => m.isOnline);
  const offlineMembers = filtered.filter((m) => !m.isOnline);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
          {members.length} {members.length === 1 ? "Member" : "Members"}
        </p>
        <Button
          aria-label={showSearch ? "Close search" : "Search members"}
          className="h-6 w-6"
          onClick={() => {
            if (showSearch) {
              setShowSearch(false);
              setQuery("");
            } else {
              setShowSearch(true);
            }
          }}
          size="icon"
          variant="ghost"
        >
          {showSearch ? (
            <IconX className="h-3 w-3" />
          ) : (
            <IconSearch className="h-3 w-3" />
          )}
        </Button>
      </div>

      <div
        className={cn(
          "overflow-hidden transition-[max-height,opacity] duration-200 ease-out",
          showSearch ? "max-h-16 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <Input
          className="h-8 text-sm"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search members…"
          ref={inputRef}
          value={query}
        />
      </div>

      {filtered.length === 0 && (
        <p className="py-4 text-center text-muted-foreground text-sm">
          No members found.
        </p>
      )}

      {onlineMembers.length > 0 && (
        <div className="space-y-0.5">
          <p className="mb-1.5 font-medium text-[11px] text-muted-foreground/70 uppercase tracking-wider">
            Online — {onlineMembers.length}
          </p>
          {onlineMembers.map((member) => (
            <MemberRow key={member.id} member={member} />
          ))}
        </div>
      )}

      {offlineMembers.length > 0 && (
        <div className="space-y-0.5">
          <p className="mb-1.5 font-medium text-[11px] text-muted-foreground/70 uppercase tracking-wider">
            Offline — {offlineMembers.length}
          </p>
          {offlineMembers.map((member) => (
            <MemberRow key={member.id} member={member} />
          ))}
        </div>
      )}
    </div>
  );
};

const MemberRow = ({
  member,
}: {
  member: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    isOnline: boolean;
  };
}) => (
  <div className="flex cursor-pointer items-center gap-2.5 rounded-md px-1.5 py-1.5 transition-colors hover:bg-muted/60">
    <div className="relative shrink-0">
      <Avatar className="h-7 w-7">
        <AvatarImage alt={member.name} src={member.image ?? undefined} />
        <AvatarFallback className="text-[10px]">
          {getNameInitials(member.name)}
        </AvatarFallback>
      </Avatar>
      <span
        className={cn(
          "absolute right-0 bottom-0 h-2 w-2 rounded-full border-[1.5px] border-background",
          member.isOnline ? "bg-green-500" : "bg-muted-foreground/40"
        )}
      />
    </div>
    <div className="min-w-0 flex-1">
      <p className="truncate font-medium text-foreground text-sm leading-tight">
        {member.name}
      </p>
      <p className="truncate text-muted-foreground text-xs leading-tight">
        {member.isOnline ? "Active now" : member.email}
      </p>
    </div>
  </div>
);
