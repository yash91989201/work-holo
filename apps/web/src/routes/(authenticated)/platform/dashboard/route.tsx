<<<<<<< HEAD
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PlatformHeader } from "@/components/platform/header";
import { PlatformSidebar } from "@/components/platform/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const Route = createFileRoute("/(authenticated)/platform/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { adminRole } = Route.useRouteContext();

  return (
    <SidebarProvider
      defaultOpen={false}
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
          "--platform-header-height": "calc(var(--spacing) * 16)",
        } as React.CSSProperties
      }
    >
      <PlatformSidebar adminRole={adminRole} />
      <SidebarInset>
        <PlatformHeader />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
=======
import { useQueryClient } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  Outlet,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import {
  Building2,
  Crown,
  Headphones,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Users,
} from "lucide-react";
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
    icon: LayoutDashboard,
    superAdminOnly: false,
  },
  {
    to: "/platform/dashboard/organizations",
    label: "Organizations",
    icon: Building2,
    superAdminOnly: false,
  },
  {
    to: "/platform/dashboard/owners",
    label: "Owners",
    icon: Crown,
    superAdminOnly: false,
  },
  {
    to: "/platform/dashboard/users",
    label: "Users",
    icon: Users,
    superAdminOnly: false,
  },
  {
    to: "/platform/dashboard/admins",
    label: "Admins",
    icon: ShieldCheck,
    superAdminOnly: true,
  },
  {
    to: "/platform/dashboard/support",
    label: "Support Agents",
    icon: Headphones,
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
          <LogOut className="size-4" />
          Log out
        </Button>
      </aside>
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
>>>>>>> 9a25431 (fix: add missing newline at end of _journal.json file)
  );
}
