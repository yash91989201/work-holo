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
import { env } from "@work-holo/env/www";
import { Toaster } from "@work-holo/ui/components/sonner";
import { useState } from "react";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import { SmoothScrollProvider } from "@/components/shared/smooth-scroll-provider";
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
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: ShellComponent,
  component: RootDocument,
});

function ShellComponent({ children }: { children: React.ReactNode }) {
  const [client] = useState<AppRouterClient>(() => createORPCClient(link));
  const [_orpcUtils] = useState(() => createTanstackQueryUtils(client));

  return (
    <html className="dark" lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
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
        <Scripts />
      </body>
    </html>
  );
}

function RootDocument() {
  return (
    <SmoothScrollProvider>
      <div className="flex min-h-svh flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
