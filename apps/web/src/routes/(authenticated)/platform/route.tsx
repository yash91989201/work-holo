import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

type AdminRole = "admin" | "super_admin" | "support";

export const Route = createFileRoute("/(authenticated)/platform")({
  beforeLoad: ({ context }) => {
    const role = context.session.user.role as string | null | undefined;
    const allowedRoles: string[] = ["admin", "super_admin", "support"];

    if (!(role && allowedRoles.includes(role))) {
      throw redirect({ to: "/" });
    }

    return { adminRole: role as AdminRole };
  },
  component: () => <Outlet />,
});
