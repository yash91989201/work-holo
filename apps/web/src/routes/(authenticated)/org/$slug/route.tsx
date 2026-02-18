import { createFileRoute, Outlet } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
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
  return <Outlet />;
}
