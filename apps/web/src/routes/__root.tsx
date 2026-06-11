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
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import type { AppRouterClient } from "@work-holo/api/routers/index";
import { env } from "@work-holo/env/web";
import { Toaster } from "@work-holo/ui/components/sonner";
import { TooltipProvider } from "@work-holo/ui/components/tooltip";
import { useEffect, useState } from "react";
import { registerServiceWorker } from "@/lib/service-worker";
import { ThemeProvider } from "@/providers/theme-provider";
import appCss from "@/styles/index.css?url";
import type { orpcClient, queryUtils } from "@/utils/orpc";
import { link } from "@/utils/orpc";

export interface RouterAppContext {
  orpcClient: typeof orpcClient;
  queryClient: QueryClient;
  queryUtils: typeof queryUtils;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Work Holo",
      },
      {
        name: "description",
        content:
          "Work Holo is a lightweight, white-label team collaboration platform with secure channels, user management, and real-time communication tools.",
      },
    ],
    links: [
      {
        rel: "icon",
        href: "/favicon.ico",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
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
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&family=Open+Sans:wght@300;400;600;700&family=Lato:wght@300;400;700&family=Poppins:wght@300;400;500;600;700&family=Nunito:wght@300;400;600;700&family=IBM+Plex+Sans:wght@300;400;500;600;700&family=Work+Sans:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&family=Michroma&display=swap",
      },
    ],
  }),
  ssr: false,
  shellComponent: ShellComponent,
  component: RootDocument,
});

function ShellComponent({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootDocument() {
  useEffect(() => {
    registerServiceWorker().catch((err) => {
      console.error("Failed to register service worker:", err);
    });
  }, []);

  const [client] = useState<AppRouterClient>(() => createORPCClient(link));
  const [_orpcUtils] = useState(() => createTanstackQueryUtils(client));

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange
      storageKey="workholo-app-theme"
    >
      <TooltipProvider>
        <Outlet />
      </TooltipProvider>
      <Toaster richColors />
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
    </ThemeProvider>
  );
}
