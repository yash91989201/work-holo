import { useSuspenseQuery } from "@tanstack/react-query";
import type { PermissionInput } from "@work-holo/permission/client";
import {
  evaluateExpression,
  resolvePermission,
} from "@work-holo/permission/client";
import { createContext, use } from "react";
import { queryUtils } from "@/utils/orpc";

type PermissionRecord = Record<string, boolean>;

const PermissionContext = createContext<PermissionRecord>({});

/**
 * Provides the permission map to all descendants via React Context.
 * Fetches the current user's permissions using a suspense query.
 * Must wrap any component tree that uses {@link useCan} or `<Can>`.
 *
 * @example
 * ```tsx
 * <Suspense fallback={<Loading />}>
 *   <PermissionProvider>
 *     <App />
 *   </PermissionProvider>
 * </Suspense>
 * ```
 */
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

/**
 * Returns the complete permission map from context.
 *
 * @example
 * ```tsx
 * const permissions = usePermissions();
 * const canCreate = permissions["channel.create"];
 * ```
 */
export function usePermissions(): PermissionRecord {
  return use(PermissionContext);
}

/**
 * Evaluates a permission input and returns whether it is allowed.
 * Accepts a string key or a selector callback with combinators.
 *
 * @param input - Permission key or selector callback.
 *
 * @example
 * ```tsx
 * // DSL accessor
 * const canCreate = useCan(p => p.channel.create);
 *
 * // With combinators
 * const canManage = useCan((p, { and }) =>
 *   and(p.channel.update, p.channel.delete)
 * );
 * ```
 */
export function useCan(input: PermissionInput): boolean {
  const permissions = use(PermissionContext);
  return evaluateExpression(resolvePermission(input), permissions);
}
