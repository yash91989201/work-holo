import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { Suspense, useMemo } from "react";
import { FullScreenLoader } from "@/components/shared/full-screen-loader";
import { useNotifications } from "@/hooks/communications/use-notifications";
import {
  type NotificationContext,
  useNotificationPusher,
} from "@/hooks/notifications/use-notification-pusher";
import { useTabNotification } from "@/hooks/notifications/use-tab-notification";
import { authClient } from "@/lib/auth-client";
import { PermissionProvider } from "@/lib/permission";
import { queryClient, queryUtils } from "@/utils/orpc";

export const Route = createFileRoute("/(authenticated)/org/$slug")({
  loader: async ({ params }) => {
    const [activeOrganization, memberRole] = await Promise.all([
      authClient.organization.getFullOrganization(),
      authClient.organization.getActiveMemberRole(),
      queryClient.prefetchQuery(
        queryUtils.user.permission.get.queryOptions({})
      ),
    ]);

    if (memberRole.error !== null) {
      throw new Error("Failed to load member role");
    }

    return {
      orgName:
        activeOrganization.data?.name ??
        params.slug
          .split("-")
          .filter(Boolean)
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" "),
      role: memberRole.data.role,
    };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.orgName ?? "Work Holo",
      },
    ],
  }),
  component: RouteComponent,
});

const CHANNEL_PATH_RE = /\/channels\/([^/]+)/;
const DM_PATH_RE = /\/dm\/([^/]+)/;

function useCurrentNotificationContext(
  pathname: string
): NotificationContext | undefined {
  return useMemo(() => {
    const channelMatch = pathname.match(CHANNEL_PATH_RE);
    if (channelMatch?.[1]) {
      return { entityType: "channel" as const, entityId: channelMatch[1] };
    }
    const dmMatch = pathname.match(DM_PATH_RE);
    if (dmMatch?.[1]) {
      return { entityType: "dm" as const, entityId: dmMatch[1] };
    }
    return;
  }, [pathname]);
}

function RouteComponent() {
  const { slug } = Route.useParams();
  const loaderData = Route.useLoaderData();
  const orgName = loaderData?.orgName ?? "Work Holo";
  const { pathname } = useLocation();
  const context = useCurrentNotificationContext(pathname);
  const { unreadCount } = useNotifications();
  const { notify } = useTabNotification({ unreadCount, defaultTitle: orgName });
  useNotificationPusher(slug, context, notify);

  return (
    <Suspense fallback={<FullScreenLoader />}>
      <PermissionProvider>
        <Outlet />
      </PermissionProvider>
    </Suspense>
  );
}
