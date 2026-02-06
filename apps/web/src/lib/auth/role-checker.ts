import { redirect } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";

export type UserRole =
  | "owner"
  | "admin"
  | "team_admin"
  | "team_lead"
  | "member";

export function hasRequiredRole(
  userRole: UserRole | null,
  requiredRole: UserRole
): boolean {
  if (!userRole) return false;

  const roleHierarchy: Record<UserRole, number> = {
    member: 1,
    team_lead: 2,
    team_admin: 3,
    admin: 4,
    owner: 5,
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

export function getRoleHierarchy(minRole: UserRole): UserRole[] {
  const allRoles: UserRole[] = [
    "member",
    "team_lead",
    "team_admin",
    "admin",
    "owner",
  ];
  const roleHierarchy: Record<UserRole, number> = {
    member: 1,
    team_lead: 2,
    team_admin: 3,
    admin: 4,
    owner: 5,
  };

  return allRoles.filter(
    (role) => roleHierarchy[role] >= roleHierarchy[minRole]
  );
}

export async function requireRole(
  orgSlug: string,
  requiredRole: UserRole
): Promise<UserRole> {
  const { data, error } = await authClient.organization.getActiveMemberRole();

  if (error !== null) {
    throw redirect({
      to: "/login",
    });
  }

  const userRole = data.role as UserRole;
  if (!hasRequiredRole(userRole, requiredRole)) {
    throw redirect({
      to: "/org/$slug",
      params: { slug: orgSlug },
    });
  }

  return userRole as UserRole;
}

export async function requireOrganizationMember(): Promise<UserRole> {
  const { data, error } = await authClient.organization.getActiveMemberRole();

  if (error !== null) {
    throw redirect({
      to: "/login",
    });
  }

  const userRole = data.role as UserRole;

  if (!userRole) {
    // Redirect to organizations list if not a member
    throw redirect({
      to: "/org/new",
    });
  }

  return userRole;
}
