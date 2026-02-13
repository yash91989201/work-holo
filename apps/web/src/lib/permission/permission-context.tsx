import { useSuspenseQuery } from "@tanstack/react-query";
import type { PermissionKeyLiteral } from "@work-holo/permission";
import { createContext, use } from "react";
import { queryUtils } from "@/utils/orpc";

type PermissionRecord = Record<string, boolean>;

const PermissionContext = createContext<PermissionRecord>({});

export function PermissionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: permissionMap } = useSuspenseQuery(
    queryUtils.user.permission.get.queryOptions({})
  );

  return (
    <PermissionContext value={permissionMap.permissions}>
      {children}
    </PermissionContext>
  );
}

export function usePermissions(): PermissionRecord {
  return use(PermissionContext);
}

export function usePermission(key: PermissionKeyLiteral): boolean {
  const permissions = use(PermissionContext);
  return permissions[key] ?? false;
}

export function useCan(key: PermissionKeyLiteral): boolean {
  return usePermission(key);
}
