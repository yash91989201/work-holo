import { useEffect } from "react";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { getPusherClient } from "@/lib/pusher";
import { queryClient, queryUtils } from "@/utils/orpc";

interface PermissionRealtimePayload {
  affectedUserIds?: string[];
  reason?: string;
  targetRoleId?: string;
  targetUserId?: string;
}

interface PermissionRealtimeEvent {
  payload?: PermissionRealtimePayload;
  type?: string;
}

/**
 * Subscribes to realtime permission and role-management events via Pusher.
 *
 * It invalidates:
 * - the current user's permission map when targeted permission updates arrive
 * - the custom-role list when role templates change
 * - member-assignment queries for the specific affected users when assignments change
 *
 * Place this hook once near the root of your authenticated org layout.
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
  const { session, user } = useAuthedSession();

  useEffect(() => {
    const pusher = getPusherClient();
    const userChannelName = `private-user-${user.id}`;
    const userChannel = pusher.subscribe(userChannelName);
    const orgChannelName = session.activeOrganizationId
      ? `private-org-${session.activeOrganizationId}`
      : null;
    const orgChannel = orgChannelName ? pusher.subscribe(orgChannelName) : null;

    const invalidateRoleList = () => {
      queryClient.invalidateQueries({
        queryKey: queryUtils.org.role.list.queryKey({}),
      });
    };

    const invalidateMemberAssignments = (targetUserId?: string) => {
      if (!targetUserId) {
        return;
      }

      queryClient.invalidateQueries({
        queryKey: queryUtils.org.role.getMemberAssignments.queryKey({
          input: { userId: targetUserId },
        }),
      });
    };

    const invalidateAffectedMemberAssignments = (
      payload?: PermissionRealtimePayload
    ) => {
      const userIds = new Set<string>();

      if (payload?.targetUserId) {
        userIds.add(payload.targetUserId);
      }

      for (const userId of payload?.affectedUserIds ?? []) {
        if (userId) {
          userIds.add(userId);
        }
      }

      for (const userId of userIds) {
        invalidateMemberAssignments(userId);
      }
    };

    const handleUserPermissionUpdate = (event?: PermissionRealtimeEvent) => {
      queryClient.invalidateQueries({
        queryKey: queryUtils.user.permission.key(),
      });
      invalidateAffectedMemberAssignments(event?.payload);
    };

    const handleOrgPermissionChange = (event?: PermissionRealtimeEvent) => {
      if (event?.type === "role_assigned" || event?.type === "role_revoked") {
        invalidateAffectedMemberAssignments(event.payload);
        return;
      }

      if (event?.type === "policy_compiled") {
        if (
          event.payload?.targetRoleId ||
          event.payload?.reason?.startsWith("role_")
        ) {
          invalidateRoleList();
        }

        invalidateAffectedMemberAssignments(event.payload);
      }
    };

    userChannel.bind("permission:update", handleUserPermissionUpdate);
    orgChannel?.bind("permission:change", handleOrgPermissionChange);

    return () => {
      userChannel.unbind("permission:update", handleUserPermissionUpdate);
      pusher.unsubscribe(userChannelName);

      if (orgChannelName) {
        orgChannel?.unbind("permission:change", handleOrgPermissionChange);
        pusher.unsubscribe(orgChannelName);
      }
    };
  }, [session.activeOrganizationId, user?.id]);
}
