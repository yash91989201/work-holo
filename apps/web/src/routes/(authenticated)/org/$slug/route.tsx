import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Suspense } from "react";
import { FullScreenLoader } from "@/components/shared/full-screen-loader";
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

function RouteComponent() {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <PermissionProvider>
        <Outlet />
      </PermissionProvider>
    </Suspense>
  );
}
