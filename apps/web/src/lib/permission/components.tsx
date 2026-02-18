import type { PermissionInput } from "@work-holo/permission/client";
import { useCan } from "./hooks";

interface CanProps {
  children: React.ReactNode | ((allowed: boolean) => React.ReactNode);
  fallback?: React.ReactNode;
  permission: PermissionInput;
}

/**
 * Conditionally renders children based on a permission check.
 * Supports a render prop pattern where children receive the `allowed` boolean.
 *
 * @example
 * ```tsx
 * // Basic gate
 * <Can permission={p => p.channel.create}>
 *   <CreateChannelButton />
 * </Can>
 *
 * // With fallback
 * <Can permission={p => p.org.update} fallback={<Unauthorized />}>
 *   <OrgSettings />
 * </Can>
 *
 * // Render prop
 * <Can permission={p => p.channel.message.create}>
 *   {(allowed) => <Editor disabled={!allowed} />}
 * </Can>
 *
 * // Combinators
 * <Can permission={(p, { or }) => or(p.org.role.assign, p.team.role.assign)}>
 *   <RoleManager />
 * </Can>
 * ```
 */
export function Can({
  permission,
  fallback = null,
  children,
}: CanProps): React.ReactNode {
  const allowed = useCan(permission);

  if (typeof children === "function") {
    return children(allowed);
  }

  return allowed ? children : fallback;
}

/**
 * Higher-order component that wraps a component with a permission gate.
 * Renders the component only when permitted; otherwise renders Fallback or nothing.
 *
 * @param Component - The component to protect.
 * @param permission - Permission key or selector callback.
 * @param Fallback - Optional component to render when denied.
 *
 * @example
 * ```tsx
 * const ProtectedSettings = withPermission(
 *   OrgSettings,
 *   p => p.org.update,
 *   Unauthorized
 * );
 * ```
 */
export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  permission: PermissionInput,
  Fallback?: React.ComponentType
) {
  function WrappedComponent(props: P) {
    const allowed = useCan(permission);
    if (!allowed) {
      return Fallback ? <Fallback /> : null;
    }
    return <Component {...props} />;
  }
  WrappedComponent.displayName = `withPermission(${Component.displayName ?? Component.name ?? "Component"})`;
  return WrappedComponent;
}
