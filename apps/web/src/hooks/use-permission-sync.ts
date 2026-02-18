import { useEffect } from "react";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { getPusherClient } from "@/lib/pusher";
import { queryClient, queryUtils } from "@/utils/orpc";

/**
 * Subscribes to real-time permission updates via Pusher.
 * When the server broadcasts a `permission:update` event for the current user,
 * invalidates the cached permission query so the UI re-fetches.
 *
 * Place this hook once near the root of your authenticated layout.
 *
 * @example
 * ```tsx
 * function AuthenticatedLayout() {
 *   usePermissionSync();
 *   return <Outlet />;
 * }
 * ```
 */
export function usePermissionSync() {
  const { user } = useAuthedSession();

  useEffect(() => {
    const pusher = getPusherClient();
    const channelName = `private-user-${user.id}`;
    const channel = pusher.subscribe(channelName);

    const handlePermissionUpdate = () => {
      queryClient.invalidateQueries({
        queryKey: queryUtils.user.permission.get.queryOptions({}).queryKey,
      });
    };

    channel.bind("permission:update", handlePermissionUpdate);

    return () => {
      channel.unbind("permission:update", handlePermissionUpdate);
      pusher.unsubscribe(channelName);
    };
  }, [user?.id]);
}
