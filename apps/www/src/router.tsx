import "@/styles/index.css";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { orpcClient, queryClient, queryUtils } from "@/utils/orpc";
import { FullScreenLoader } from "./components/shared/full-screen-loader";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: false,
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
}
