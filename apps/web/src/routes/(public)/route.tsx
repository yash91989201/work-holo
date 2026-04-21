import {
  createFileRoute,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { Header } from "@/components/public/header";
import { FullScreenLoader } from "@/components/shared/full-screen-loader";

export const Route = createFileRoute("/(public)")({
  pendingComponent: () => <FullScreenLoader />,
  component: RouteComponent,
});

function RouteComponent() {
  const isFetching = useRouterState({
    select: (s) => s.isLoading,
  });

  return (
    <div className="grid min-h-svh grid-rows-[auto_1fr_auto]">
      <Header />
      {isFetching ? <FullScreenLoader /> : <Outlet />}
    </div>
  );
}
