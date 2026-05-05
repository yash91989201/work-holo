import {
  IconCheck,
  IconLogout,
  IconMoonFilled,
  IconSettingsFilled,
  IconSunFilled,
  IconUserFilled,
} from "@tabler/icons-react";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@work-holo/ui/components/avatar";
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
import { toast } from "sonner";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "@/providers/theme-provider";
import { queryClient } from "@/utils/orpc";

export function PlatformAccountDropdown() {
  const navigate = useNavigate();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { user } = useAuthedSession();

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
      <DropdownMenuTrigger
        render={
          <Button
            className="relative flex h-auto cursor-pointer items-center justify-center rounded-full bg-transparent p-0 transition-opacity hover:bg-transparent hover:opacity-80"
            type="button"
            variant="ghost"
          >
            <Avatar className="h-9 w-9 ring-2 ring-border/50 ring-offset-2 ring-offset-background transition-all hover:ring-primary/50">
              <AvatarImage
                alt={user.name ?? "User"}
                src={user.image ?? undefined}
              />
              <AvatarFallback className="bg-orange-500 font-semibold text-sm text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="relative h-28 w-full overflow-hidden rounded-t-lg bg-linear-to-br from-violet-500 via-purple-500 to-pink-500">
          <div className="absolute inset-0 bg-black/10" />
        </div>

        <div className="relative -mt-10 px-4 pb-3">
          <div className="flex items-end gap-3">
            <Avatar className="h-16 w-16 border-4 border-background shadow-lg">
              <AvatarImage
                alt={user.name ?? "User"}
                src={user.image ?? undefined}
              />
              <AvatarFallback className="bg-orange-500 font-semibold text-white text-xl">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="mt-3">
            <h3 className="font-semibold text-base">{user.name || "User"}</h3>
            <p className="text-muted-foreground text-sm">{user.email}</p>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuGroup className="px-1 py-1">
          <DropdownMenuLabel className="px-2 py-1.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
            Account
          </DropdownMenuLabel>
          <DropdownMenuItem
            render={
              <Link className="cursor-pointer" to="/settings/account/profile">
                <IconUserFilled className="h-4 w-4" />
                Profile
              </Link>
            }
          />
          <DropdownMenuItem
            render={
              <Link
                className="cursor-pointer"
                to="/settings/account/preferences"
              >
                <IconSettingsFilled className="h-4 w-4" />
                Preferences
              </Link>
            }
          />
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup className="px-1 py-1">
          <DropdownMenuLabel className="px-2 py-1.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
            Appearance
          </DropdownMenuLabel>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="gap-2">
              {theme === "dark" ? (
                <IconMoonFilled className="h-4 w-4" />
              ) : theme === "light" ? (
                <IconSunFilled className="h-4 w-4" />
              ) : (
                <IconSettingsFilled className="h-4 w-4" />
              )}
              <span>Theme</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="min-w-40" sideOffset={8}>
              <DropdownMenuItem
                className="justify-between"
                onClick={() => setTheme("light")}
              >
                <div className="flex items-center gap-2">
                  <IconSunFilled className="h-4 w-4" />
                  Light
                </div>
                {theme === "light" && (
                  <IconCheck className="h-4 w-4 text-primary" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="justify-between"
                onClick={() => setTheme("dark")}
              >
                <div className="flex items-center gap-2">
                  <IconMoonFilled className="h-4 w-4" />
                  Dark
                </div>
                {theme === "dark" && (
                  <IconCheck className="h-4 w-4 text-primary" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="justify-between"
                onClick={() => setTheme("system")}
              >
                <div className="flex items-center gap-2">
                  <IconSettingsFilled className="h-4 w-4" />
                  System
                </div>
                {theme === "system" && (
                  <IconCheck className="h-4 w-4 text-primary" />
                )}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <div className="p-1">
          <DropdownMenuItem
            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
            onClick={logout}
          >
            <IconLogout className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const PlatformAccountDropdownSkeleton = () => (
  <div className="relative flex items-center justify-center">
    <Skeleton className="h-9 w-9 rounded-full" />
  </div>
);

PlatformAccountDropdown.Fallback = PlatformAccountDropdownSkeleton;
