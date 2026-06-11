import {
  IconBellFilled,
  IconBriefcase,
  IconCalendar,
  IconCircleFilled,
  IconCircleLetterXFilled,
  IconCoffee,
  IconLayoutDashboardFilled,
  IconLogout,
  IconMoonFilled,
  IconPhone,
  IconSettingsFilled,
  IconShieldFilled,
  IconSunFilled,
  IconUserFilled,
} from "@tabler/icons-react";
import {
  Link,
  useNavigate,
  useParams,
  useRouter,
} from "@tanstack/react-router";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@work-holo/ui/components/avatar";
import { Badge } from "@work-holo/ui/components/badge";
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
import { useMemberRole } from "@/hooks/use-member-role";
import { useOrgPresence, useSetManualStatus } from "@/hooks/use-presence";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "@/providers/theme-provider";
import { queryClient } from "@/utils/orpc";

const STATUS_CONFIG = {
  available: {
    label: "Available",
    dotColor: "bg-green-500",
    icon: <IconCircleFilled className="h-3 w-3 text-green-500" />,
  },
  away: {
    label: "Away",
    dotColor: "bg-yellow-500",
    icon: <IconMoonFilled className="h-3 w-3 text-yellow-500" />,
  },
  busy: {
    label: "Busy",
    dotColor: "bg-red-500",
    icon: <IconCircleLetterXFilled className="h-3 w-3 text-red-600" />,
  },
  dnd: {
    label: "Do Not Disturb",
    dotColor: "bg-red-700",
    icon: (
      <IconCircleLetterXFilled className="h-3 w-3 fill-red-700 text-red-700" />
    ),
  },
  on_break: {
    label: "On Break",
    dotColor: "bg-orange-500",
    icon: <IconCoffee className="h-3 w-3 text-orange-500" />,
  },
  in_call: {
    label: "In a Call",
    dotColor: "bg-blue-500",
    icon: <IconPhone className="h-3 w-3 text-blue-600" />,
  },
  in_meeting: {
    label: "In a Meeting",
    dotColor: "bg-purple-500",
    icon: <IconCalendar className="h-3 w-3 text-purple-600" />,
  },
  offline: {
    label: "Offline",
    dotColor: "bg-gray-400",
    icon: <IconCircleFilled className="h-3 w-3 text-gray-400" />,
  },
} as const;

type StatusKey = keyof typeof STATUS_CONFIG;

export function AccountDropdown() {
  const navigate = useNavigate();
  const router = useRouter();
  const { slug } = useParams({
    from: "/(authenticated)/org/$slug",
  });
  const { theme, setTheme } = useTheme();

  const { user } = useAuthedSession();
  const role = useMemberRole();

  const { mutateAsync: setManualStatus, isPending: isStatusPending } =
    useSetManualStatus();
  const { data: orgPresence } = useOrgPresence();

  const myPresence = orgPresence?.presence?.[user.id] ?? null;
  const manualStatus = (myPresence?.manualStatus || null) as
    | "dnd"
    | "busy"
    | "away"
    | null;

  let currentStatusKey: StatusKey;
  if (
    manualStatus === "dnd" ||
    manualStatus === "busy" ||
    manualStatus === "away"
  ) {
    currentStatusKey = manualStatus;
  } else {
    const computedStatus = myPresence?.status as StatusKey | undefined;
    currentStatusKey =
      computedStatus && computedStatus in STATUS_CONFIG
        ? computedStatus
        : "offline";
  }

  const current = STATUS_CONFIG[currentStatusKey];

  const handleStatusChange = async (status: "dnd" | "busy" | "away" | null) => {
    await setManualStatus({ status });
    toast.success("Status updated");
  };

  const logout = async () => {
    const signOutRes = await authClient.signOut();
    if (signOutRes.error) {
      toast("Unable to logout, try again");
      return;
    }
    queryClient.clear();
    await router.invalidate();
    navigate({ to: "/login" });
  };

  const initials =
    user?.name?.trim().slice(0, 2).toUpperCase() ??
    user?.email?.[0]?.toUpperCase() ??
    "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        nativeButton={false}
        render={
          <Avatar className="h-9 w-9">
            <AvatarImage
              alt={user.name ?? "User"}
              src={user.image ?? undefined}
            />
            <AvatarFallback className="bg-orange-500 font-semibold text-sm text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
        }
      />
      <DropdownMenuContent align="end" className="w-72">
        <div className="px-4 py-3">
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-sm">{user.name || "User"}</span>
            <span className="text-muted-foreground text-xs">{user.email}</span>
            <Badge className="mt-1 h-5 w-fit rounded-sm bg-violet-600 px-2 font-bold text-[10px] text-white uppercase hover:bg-violet-600">
              {role}
            </Badge>
          </div>
        </div>

        <DropdownMenuSeparator />

        {role !== "member" && (
          <DropdownMenuGroup>
            <DropdownMenuLabel>Organization</DropdownMenuLabel>
            <DropdownMenuItem
              render={
                <Link
                  className="cursor-pointer"
                  params={{ slug }}
                  to="/org/$slug/workspace"
                >
                  <IconBriefcase />
                  Workspace
                </Link>
              }
            />
            <DropdownMenuItem
              render={
                <Link
                  className="cursor-pointer"
                  params={{ slug }}
                  to="/org/$slug/console"
                >
                  <IconUserFilled />
                  Console
                </Link>
              }
            />
            {role === "owner" && (
              <DropdownMenuItem
                render={
                  <Link
                    className="cursor-pointer"
                    params={{ slug }}
                    to="/org/$slug/manage"
                  >
                    <IconLayoutDashboardFilled />
                    Manage
                  </Link>
                }
              />
            )}
            <DropdownMenuSeparator />
          </DropdownMenuGroup>
        )}

        <DropdownMenuGroup>
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuItem
            render={
              <Link className="cursor-pointer" to="/settings/account/profile">
                <IconUserFilled />
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
                <IconSettingsFilled />
                Preferences
              </Link>
            }
          />
          <DropdownMenuItem
            render={
              <Link
                className="cursor-pointer"
                to="/settings/account/notifications"
              >
                <IconBellFilled />
                Notifications
              </Link>
            }
          />
          <DropdownMenuItem
            render={
              <Link className="cursor-pointer" to="/settings/account/security">
                <IconShieldFilled />
                Security & Access
              </Link>
            }
          />
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

        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-2 font-semibold text-muted-foreground text-xs uppercase">
            Status
          </DropdownMenuLabel>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger
              className="gap-2"
              disabled={isStatusPending}
            >
              {current.icon}
              <span>{current.label}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="min-w-48" sideOffset={8}>
              <DropdownMenuItem onClick={() => handleStatusChange(null)}>
                {STATUS_CONFIG.available.icon}
                Available
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("away")}>
                {STATUS_CONFIG.away.icon}
                Away
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("busy")}>
                {STATUS_CONFIG.busy.icon}
                Busy
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("dnd")}>
                {STATUS_CONFIG.dnd.icon}
                Do Not Disturb
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

const AccountDropdownSkeleton = () => (
  <div className="relative flex items-center justify-center">
    <Skeleton className="h-9 w-9 rounded-full" />
    <span className="absolute right-0 bottom-0 block h-2.5 w-2.5 rounded-full border-2 border-background bg-muted" />
  </div>
);

AccountDropdown.Fallback = AccountDropdownSkeleton;
