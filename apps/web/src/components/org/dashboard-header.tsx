import { IconLogout } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import {
  Link,
  useLoaderData,
  useMatches,
  useNavigate,
} from "@tanstack/react-router";
import {
  Building2,
  ChevronDown,
  Circle,
  Plus,
  Search, 
} from "lucide-react";
import {
  IconBellFilled,
  IconUserFilled,
  IconSettingsFilled ,
  IconLayoutDashboardFilled ,
  IconShieldFilled ,
} from "@tabler/icons-react";
import { Suspense, useEffect, useRef } from "react";
import { toast } from "sonner";
import { NotificationSheet } from "@/components/shared/notification-sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { useMemberRole } from "@/hooks/use-member-role";
import { authClient } from "@/lib/auth-client";
import { queryUtils } from "@/utils/orpc";

function useCurrentPageName() {
  const matches = useMatches();

  const channelId = useMemo(() => {
    const lastMatch = matches[matches.length - 1];
    if (!lastMatch) return null;
    const params = (
      lastMatch as unknown as Record<string, Record<string, string>>
    ).params;
    if (params?.id && lastMatch.pathname.includes("/channels/")) {
      return params.id;
    }
    return null;
  }, [matches]);

  const { data: channel } = useQuery({
    ...queryUtils.communication.channel.get.queryOptions({
      input: { channelId: channelId ?? "" },
    }),
    enabled: !!channelId,
  });

  return useMemo(() => {
    if (channelId && channel?.name) {
      return `#${channel.name}`;
    }
    const lastMatch = matches[matches.length - 1];
    if (!lastMatch) return "Dashboard";

    const pathname = lastMatch.pathname;

    const orgPathMatch = pathname.match(/\/org\/[^/]+\/(.+)/);
    if (!orgPathMatch) return "Dashboard";

    const subPath = orgPathMatch[1].replace(/\/$/, ""); // trim trailing slash
    const segments = subPath.split("/").filter(Boolean);

    // Find the last named (non-ID) segment
    for (let i = segments.length - 1; i >= 0; i--) {
      const seg = segments[i];
      // Skip segments that look like IDs (UUIDs, numeric, nanoids, cuids, short random strings)
      if (
        /^[0-9a-f]{8}-/.test(seg) || // UUID
        /^\d+$/.test(seg) || // numeric
        (seg.length < 4 && /^[a-z0-9]+$/i.test(seg)) || // very short
        (seg.length >= 15 && /^[a-z0-9]+$/i.test(seg)) // long alphanumeric (nanoid, cuid, etc.)
      ) {
        continue;
      }

      return seg.charAt(0).toUpperCase() + seg.slice(1);
    }

    return "Dashboard";
  }, [matches, channel, channelId]);
}

export function DashboardHeader() {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const currentPage = useCurrentPageName();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+K (Windows/Linux) or Cmd+K (Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 flex h-18 items-center gap-4 border-b bg-background px-4">
      {/* Sidebar Toggle */}
      <SidebarTrigger className="h-9 w-9 text-muted-foreground hover:bg-muted hover:text-foreground" />

      {/* Organization Selector */}
      <Suspense fallback={<OrgSelectorSkeleton />}>
        <OrgSelector />
      </Suspense>

      {/* Breadcrumb Separator */}
      <span className="text-muted-foreground">/</span>

      {/* Current Page */}
      <span className="text-muted-foreground text-sm">{currentPage}</span>

      {/* Search - Centered */}
      <div className="mx-auto max-w-md flex-1">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-9 w-full rounded-lg border-border bg-muted/50 pr-12 pl-9 placeholder:text-muted-foreground focus-visible:ring-violet-500"
            placeholder="Search..."
            ref={searchInputRef}
            type="search"
          />
          <kbd className="pointer-events-none absolute top-1/2 right-2 flex h-5 -translate-y-1/2 select-none items-center gap-1 rounded border border-border bg-background px-1.5 font-medium font-mono text-[10px] text-muted-foreground">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <NotificationSheet />

        {/* User Menu */}
        <Suspense fallback={<UserMenuSkeleton />}>
          <UserMenuButton />
        </Suspense>
      </div>
    </header>
  );
}

function OrgSelector() {
  const { orgName } = useLoaderData({
    from: "__root__",
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="flex h-9 items-center gap-2 px-3 hover:bg-muted"
          variant="ghost"
        >
          {/* Org Icon */}
          <div className="flex h-6 w-6 items-center justify-center rounded bg-violet-600 font-bold text-white text-xs">
            {orgName?.charAt(0) || "T"}
          </div>
          <span className="font-semibold text-sm">
            {orgName || "Team Sales"}
          </span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Organizations</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Building2 className="mr-2 h-4 w-4" />
          <span>{orgName || "Team Sales"}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Plus className="mr-2 h-4 w-4" />
          <span>Create Organization</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function OrgSelectorSkeleton() {
  return (
    <div className="flex h-9 items-center gap-2 px-3">
      <Skeleton className="h-6 w-6 rounded" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}

function UserMenuButton() {
  const navigate = useNavigate();
  const { user } = useAuthedSession();
  const role = useMemberRole();

  const logout = async () => {
    const signOutRes = await authClient.signOut();
    if (signOutRes.error) {
      toast("Unable to logout, try again");
      return;
    }

    navigate({ to: "/login" });
  };

  const initials =
    user?.name?.trim().slice(0, 2).toUpperCase() ??
    user?.email?.[0]?.toUpperCase() ??
    "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="flex h-auto items-center gap-2 rounded-xl border border-border p-2 hover:bg-muted"
          variant="ghost"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage
              alt={user.name ?? "User"}
              src={user.image ?? undefined}
            />
            <AvatarFallback className="bg-orange-500 font-semibold text-sm text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-sm">{user.name || "User"}</span>
            <Badge className="h-4 rounded-sm bg-violet-600 px-1.5 font-bold text-[9px] text-white uppercase hover:bg-violet-600">
              {role}
            </Badge>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {/* Account Section */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-2 font-semibold text-muted-foreground text-xs uppercase">
            Account
          </DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link className="cursor-pointer" to="/settings/account/profile">
              <IconUserFilled />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link className="cursor-pointer" to="/settings/account/preferences">
              <IconSettingsFilled />
              Preferences
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              className="cursor-pointer"
              to="/settings/account/notifications"
            >
              {/* <Bell className="mr-2 h-4 w-4" /> */}
              <IconBellFilled />
              Notifications
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link className="cursor-pointer" to="/settings/account/security">
              <IconShieldFilled />
              Security & Access
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Organization Section */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-2 font-semibold text-muted-foreground text-xs uppercase">
            Organization
          </DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link
              className="cursor-pointer"
              params={{ slug: "current" }}
              to="/org/$slug"
            >
              <IconLayoutDashboardFilled />
              Dashboard
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Status Section */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-2 font-semibold text-muted-foreground text-xs uppercase">
            Status
          </DropdownMenuLabel>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="justify-between">
              <div className="flex items-center">
                <Circle className="mr-2 h-3 w-3 fill-green-500 text-green-500" />
                Online
              </div>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="min-w-40" sideOffset={8}>
              <DropdownMenuItem>
                <Circle className="mr-2 h-3 w-3 fill-green-500 text-green-500" />
                Online
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Circle className="mr-2 h-3 w-3 fill-amber-500 text-amber-500" />
                Away
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Circle className="mr-2 h-3 w-3 fill-rose-500 text-rose-500" />
                Busy
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Circle className="mr-2 h-3 w-3 fill-gray-400 text-gray-400" />
                Offline
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem
          className="text-destructive focus:bg-destructive/10 focus:text-destructive"
          onClick={logout}
        >
          <IconLogout className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserMenuSkeleton() {
  return (
    <div className="flex h-9 items-center gap-3 px-3">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="flex flex-col gap-1">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  );
}
