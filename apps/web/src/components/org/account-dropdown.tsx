import {
  IconBellFilled,
  IconBriefcase,
  IconCircleFilled,
  IconLayoutDashboardFilled,
  IconLogout,
  IconSettingsFilled,
  IconShieldFilled,
  IconUserFilled,
} from "@tabler/icons-react";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { useMemberRole } from "@/hooks/use-member-role";
import { authClient } from "@/lib/auth-client";

export function AccountDropdown() {
  const navigate = useNavigate();
  const { slug } = useParams({
    from: "/(authenticated)/org/$slug",
  });

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
        <button
          className="relative flex cursor-pointer items-center justify-center rounded-full transition-opacity hover:opacity-80"
          type="button"
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
          <span className="absolute right-0 bottom-0 block h-2.5 w-2.5 rounded-full border-2 border-background bg-green-500 ring-2 ring-background" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="relative h-24 w-full overflow-hidden rounded-t-lg bg-linear-to-br from-violet-500 via-purple-500 to-pink-500" />

        <div className="relative -mt-12 px-4 pb-4">
          <Avatar className="h-20 w-20 border-4 border-background">
            <AvatarImage
              alt={user.name ?? "User"}
              src={user.image ?? undefined}
            />
            <AvatarFallback className="bg-orange-500 font-semibold text-2xl text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="mt-2">
            <h3 className="font-semibold text-lg">{user.name || "User"}</h3>
            <p className="text-muted-foreground text-sm">{user.email}</p>
            <Badge className="mt-1.5 h-5 rounded-sm bg-violet-600 px-2 font-bold text-[10px] text-white uppercase hover:bg-violet-600">
              {role}
            </Badge>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-2 font-semibold text-muted-foreground text-xs uppercase">
            Organization
          </DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link
              className="cursor-pointer"
              params={{ slug }}
              to="/org/$slug/workspace"
            >
              <IconBriefcase />
              Workspace
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              className="cursor-pointer"
              params={{ slug }}
              to="/org/$slug/console"
            >
              <IconUserFilled />
              Console
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              className="cursor-pointer"
              params={{ slug }}
              to="/org/$slug/manage"
            >
              <IconLayoutDashboardFilled />
              Manage
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel>Account</DropdownMenuLabel>
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

        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-2 font-semibold text-muted-foreground text-xs uppercase">
            Status
          </DropdownMenuLabel>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="justify-between">
              <div className="flex items-center">
                <IconCircleFilled className="mr-2 h-3 w-3 text-green-500" />
                Online
              </div>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="min-w-40" sideOffset={8}>
              <DropdownMenuItem>
                <IconCircleFilled className="mr-2 h-3 w-3 text-green-500" />
                Online
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconCircleFilled className="mr-2 h-3 w-3 text-amber-500" />
                Away
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconCircleFilled className="mr-2 h-3 w-3 text-rose-500" />
                Busy
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconCircleFilled className="mr-2 h-3 w-3 text-gray-400" />
                Offline
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

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

export function AccountDropdownSkeleton() {
  return (
    <div className="relative flex items-center justify-center">
      <Skeleton className="h-9 w-9 rounded-full" />
      <span className="absolute right-0 bottom-0 block h-2.5 w-2.5 rounded-full border-2 border-background bg-muted" />
    </div>
  );
}
