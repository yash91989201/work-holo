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
  useLocation,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import type { AppRouterClient } from "@work-holo/api/routers/index";
import { env } from "@work-holo/env/www";
import { Toaster } from "@work-holo/ui/components/sonner";
import { useEffect, useState } from "react";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
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
  const location = useLocation();

  useEffect(() => {
    // Hash navigation → scroll to element with header offset
    if (location.hash) {
      const id = location.hash.replace("#", "");
      // Delay to let DOM render
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          const headerOffset = 100;
          const y = el.getBoundingClientRect().top + window.scrollY - headerOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 50);
      return;
    }
    // Page navigation → scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname, location.hash]);

  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
