import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
<<<<<<< HEAD
import { validateAdminRole } from "@/utils";

export const Route = createFileRoute("/(authenticated)/platform")({
  beforeLoad: ({ context }) => {
    const { isAdmin, role } = validateAdminRole(context.session.user.role);

    if (!isAdmin) {
      throw redirect({ to: "/" });
    }

    return { adminRole: role };
=======

type AdminRole = "admin" | "super_admin" | "support";

export const Route = createFileRoute("/(authenticated)/platform")({
  beforeLoad: ({ context }) => {
    const role = context.session.user.role as string | null | undefined;
    const allowedRoles: string[] = ["admin", "super_admin", "support"];

    if (!(role && allowedRoles.includes(role))) {
      throw redirect({ to: "/" });
    }

    return { adminRole: role as AdminRole };
>>>>>>> 9a25431 (fix: add missing newline at end of _journal.json file)
  },
  component: () => <Outlet />,
});
