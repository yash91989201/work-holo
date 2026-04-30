import { useSuspenseQuery } from "@tanstack/react-query";
import { createContext } from "react";
import { useSession } from "@/hooks/use-session";
import { queryUtils } from "@/utils/orpc";

export type PermissionRecord = Record<string, boolean>;

export const PermissionContext = createContext<PermissionRecord>({});

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
  const session = useSession();
  const activeTeamId = session?.session.activeTeamId ?? undefined;

  const { data: permissionMap } = useSuspenseQuery(
    queryUtils.user.permission.get.queryOptions({
      input: {
        teamId: activeTeamId,
      },
    })
  );

  return (
    <PermissionContext value={permissionMap.permissions}>
      {children}
    </PermissionContext>
  );
}
