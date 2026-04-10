import { createORPCClient } from "@orpc/client";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { formDevtoolsPlugin } from "@tanstack/react-form-devtools";
import { pacerDevtoolsPlugin } from "@tanstack/react-pacer-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import type { AppRouterClient } from "@work-holo/api/routers/index";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/providers/theme-provider";
import type { orpcClient, queryUtils } from "@/utils/orpc";
import { link } from "@/utils/orpc";
import "@/styles/index.css";
import { env } from "@work-holo/env/web";
import { FullScreenLoader } from "@/components/shared/full-screen-loader";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useVersionCheck } from "@/hooks/use-version-check";
import { authClient } from "@/lib/auth-client";

export interface RouterAppContext {
  orpcClient: typeof orpcClient;
  queryClient: QueryClient;
  queryUtils: typeof queryUtils;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  beforeLoad: async () => {
    const session = await authClient.getSession();

    return {
      session: session.data,
    };
  },
  loader: async () => {
    const { data } = await authClient.organization.getFullOrganization();

    return {
      orgLogo: data?.logo ?? undefined,
      orgName: data?.name ?? undefined,
    };
  },
  head: ({ loaderData }) => {
    const orgName = loaderData?.orgName ?? "Work Holo";
    const faviconLink =
      loaderData?.orgLogo === undefined
        ? {
            rel: "icon",
            href: "/favicon.ico",
          }
        : {
            rel: "icon",
            href: loaderData.orgLogo,
          };

    return {
      meta: [
        {
          title: orgName,
        },
        {
          name: "description",
          content:
            "Work Holo is a lightweight, white-label team collaboration platform with secure channels, user management, and real-time communication tools.",
        },
      ],
      links: [
        faviconLink,
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossOrigin: "anonymous",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&family=Open+Sans:wght@300;400;600;700&family=Lato:wght@300;400;700&family=Poppins:wght@300;400;500;600;700&family=Nunito:wght@300;400;600;700&family=IBM+Plex+Sans:wght@300;400;500;600;700&family=Work+Sans:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap",
        },
      ],
    };
  },
  pendingComponent: () => <FullScreenLoader />,
  component: RootComponent,
});

function RootComponent() {
  const [client] = useState<AppRouterClient>(() => createORPCClient(link));
  const [_orpcUtils] = useState(() => createTanstackQueryUtils(client));

  useVersionCheck();

  return (
    <>
      <HeadContent />
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        disableTransitionOnChange
        storageKey="vite-ui-theme"
      >
        <TooltipProvider>
          <Outlet />
        </TooltipProvider>
        <Toaster richColors />
      </ThemeProvider>
      {env.VITE_ENV === "development" && (
        <TanStackDevtools
          plugins={[
            {
              name: "TanStack Query",
              render: <ReactQueryDevtoolsPanel />,
              defaultOpen: true,
            },
            {
              name: "TanStack Router",
              render: <TanStackRouterDevtoolsPanel />,
              defaultOpen: false,
            },
            formDevtoolsPlugin(),
            pacerDevtoolsPlugin(),
          ]}
        />
      )}
    </>
  );
}
