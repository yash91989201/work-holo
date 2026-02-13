import type { PermissionKeyLiteral } from "@work-holo/permission";
import { usePermission } from "./permission-context";

interface CanProps {
  permission: PermissionKeyLiteral;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function Can({
  permission,
  fallback = null,
  children,
}: CanProps): React.ReactNode {
  const allowed = usePermission(permission);
  return allowed ? children : fallback;
}

export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  permission: PermissionKeyLiteral,
  Fallback?: React.ComponentType
) {
  function WrappedComponent(props: P) {
    const allowed = usePermission(permission);
    if (!allowed) {
      return Fallback ? <Fallback /> : null;
    }
    return <Component {...props} />;
  }
  WrappedComponent.displayName = `withPermission(${Component.displayName ?? Component.name ?? "Component"})`;
  return WrappedComponent;
}
