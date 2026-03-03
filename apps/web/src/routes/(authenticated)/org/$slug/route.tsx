import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { Suspense, useMemo } from "react";
import { FullScreenLoader } from "@/components/shared/full-screen-loader";
import {
  type NotificationContext,
  useNotificationPusher,
} from "@/hooks/notifications/use-notification-pusher";
import { authClient } from "@/lib/auth-client";
import { PermissionProvider } from "@/lib/permission";
import { queryClient, queryUtils } from "@/utils/orpc";

export const Route = createFileRoute("/(authenticated)/org/$slug")({
  loader: async () => {
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
      logoSrc: activeOrganization.data?.logo ?? undefined,
      role: memberRole.data.role,
    };
  },
  head: ({ loaderData }) => ({
    links: [
      {
        rel: "icon",
        type: "image/png",
        href: loaderData?.logoSrc,
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
    return undefined;
  }, [pathname]);
}

function RouteComponent() {
  const { slug } = Route.useParams();
  const { pathname } = useLocation();
  const context = useCurrentNotificationContext(pathname);
  useNotificationPusher(slug, context);

  return (
    <Suspense fallback={<FullScreenLoader />}>
      <PermissionProvider>
        <Outlet />
      </PermissionProvider>
    </Suspense>
  );
}
