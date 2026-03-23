import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { validateAdminRole } from "@/utils";

export const Route = createFileRoute("/(authenticated)/platform")({
  beforeLoad: ({ context }) => {
    const { isAdmin, role } = validateAdminRole(context.session.user.role);

    if (!isAdmin) {
      throw redirect({ to: "/" });
    }

    return { adminRole: role };
  },
  component: () => <Outlet />,
});
