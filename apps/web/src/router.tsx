import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { FullScreenLoader } from "@/components/shared/full-screen-loader";
import { routeTree } from "@/routeTree.gen";
import { orpcClient, queryClient, queryUtils } from "@/utils/orpc";
import "@/styles/index.css";

export const getRouter = () => {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultPendingComponent: () => <FullScreenLoader />,
    defaultNotFoundComponent: () => <div>Not Found</div>,
    context: { queryUtils, queryClient, orpcClient },
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  });

  return router;
};

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }

  interface StaticDataRouteOption {
    crumb?: string;
  }
}
