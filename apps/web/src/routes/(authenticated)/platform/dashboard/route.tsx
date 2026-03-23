import {
  IconBuilding,
  IconCrown,
  IconHeadphones,
  IconLayoutDashboard,
  IconLogout,
  IconShieldCheck,
  IconUsers,
} from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  Outlet,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/(authenticated)/platform/dashboard")({
  component: AdminLayout,
});

const navItems = [
  {
    to: "/platform/dashboard",
    label: "Overview",
    icon: IconLayoutDashboard,
    superAdminOnly: false,
  },
  {
    to: "/platform/dashboard/organizations",
    label: "Organizations",
    icon: IconBuilding,
    superAdminOnly: false,
  },
  {
    to: "/platform/dashboard/owners",
    label: "Owners",
    icon: IconCrown,
    superAdminOnly: false,
  },
  {
    to: "/platform/dashboard/users",
    label: "Users",
    icon: IconUsers,
    superAdminOnly: false,
  },
  {
    to: "/platform/dashboard/admins",
    label: "Admins",
    icon: IconShieldCheck,
    superAdminOnly: true,
  },
  {
    to: "/platform/dashboard/support",
    label: "Support Agents",
    icon: IconHeadphones,
    superAdminOnly: true,
  },
] as const;

function AdminLayout() {
  const { adminRole } = Route.useRouteContext();
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();

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

  return (
    <div className="flex h-screen bg-background">
      <aside className="flex w-60 flex-col border-r p-4">
        <p className="mb-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
          Platform Admin
        </p>
        <div className="flex flex-1 flex-col gap-1">
          {navItems
            .filter(
              (item) => !item.superAdminOnly || adminRole === "super_admin"
            )
            .map((item) => (
              <Link
                activeOptions={{ exact: true }}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 font-medium text-sm transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  "[&.active]:bg-accent [&.active]:text-accent-foreground"
                )}
                key={item.to}
                to={item.to}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            ))}
        </div>
        <Button
          className="mt-auto flex items-center gap-3 text-destructive hover:text-destructive"
          onClick={logout}
          variant="ghost"
        >
          <IconLogout className="size-4" />
          Log out
        </Button>
      </aside>
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
