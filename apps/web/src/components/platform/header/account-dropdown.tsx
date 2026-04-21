import {
  IconLogout,
  IconMoonFilled,
  IconSettingsFilled,
  IconSunFilled,
} from "@tabler/icons-react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@work-holo/ui/components/avatar";
import { Button } from "@work-holo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@work-holo/ui/components/dropdown-menu";
import { Skeleton } from "@work-holo/ui/components/skeleton";
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
      <DropdownMenuTrigger asChild>
        <Button
          className="relative flex h-auto cursor-pointer items-center justify-center rounded-full bg-transparent p-0 transition-opacity hover:bg-transparent hover:opacity-80"
          type="button"
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
        </Button>
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
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
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

const PlatformAccountDropdownSkeleton = () => {
  return (
    <div className="relative flex items-center justify-center">
      <Skeleton className="h-9 w-9 rounded-full" />
    </div>
  );
};

PlatformAccountDropdown.Fallback = PlatformAccountDropdownSkeleton;
