import {
  IconBellFilled,
  IconBriefcase,
  IconLayoutDashboardFilled,
  IconLogout,
  IconMoonFilled,
  IconSettingsFilled,
  IconShieldFilled,
  IconSunFilled,
  IconUserFilled,
} from "@tabler/icons-react";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@work-holo/ui/components/avatar";
import { Badge } from "@work-holo/ui/components/badge";
import { Button } from "@work-holo/ui/components/button";
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
} from "@work-holo/ui/components/dropdown-menu";
import { Skeleton } from "@work-holo/ui/components/skeleton";
import { useActiveMemberRole } from "@/hooks/use-active-member-role";
import { useActiveOrgSlug } from "@/hooks/use-active-org-slug";
import { useSession } from "@/hooks/use-session";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "@/providers/theme-provider";
import { queryClient } from "@/utils/orpc";

export function AccountDropdown() {
  const navigate = useNavigate();
  const router = useRouter();
  const session = useSession();
  const slug = useActiveOrgSlug();
  const role = useActiveMemberRole();
  const { theme, setTheme } = useTheme();

  if (!session) {
    return (
      <Button asChild variant="outline">
        <Link to="/login">Log In</Link>
      </Button>
    );
  }

  const { user } = session;

  const logout = async () => {
    const signOutRes = await authClient.signOut();
    if (signOutRes.error) {
      toast("Unable to logout, try again");
      return;
    }
    queryClient.clear();
    await router.invalidate();
    navigate({ to: "/" });
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
            {role && (
              <Badge className="mt-1.5 h-5 rounded-sm bg-violet-600 px-2 font-bold text-[10px] text-white uppercase hover:bg-violet-600">
                {role}
              </Badge>
            )}
          </div>
        </div>

        {role && role !== "member" && slug && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>Organization</DropdownMenuLabel>
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
              {role === "owner" && (
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
              )}
            </DropdownMenuGroup>
          </>
        )}

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
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="gap-2">
              {theme === "dark" ? (
                <IconMoonFilled className="h-4 w-4" />
              ) : (
                <IconSunFilled className="h-4 w-4" />
              )}
              <span>Theme</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="min-w-32" sideOffset={8}>
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <IconSunFilled className="mr-2 h-4 w-4" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <IconMoonFilled className="mr-2 h-4 w-4" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <IconSettingsFilled className="mr-2 h-4 w-4" />
                System
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

const AccountDropdownSkeleton = () => {
  return (
    <div className="relative flex items-center justify-center">
      <Skeleton className="h-9 w-9 rounded-full" />
    </div>
  );
};

AccountDropdown.Fallback = AccountDropdownSkeleton;
