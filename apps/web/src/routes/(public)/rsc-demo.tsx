import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { renderServerComponent } from "@tanstack/react-start/rsc";

function ServerTimestamp() {
  const now = new Date();
  return (
    <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
      <h2 className="mb-2 text-lg font-semibold">React Server Component Demo</h2>
      <p className="text-muted-foreground">
        This content was rendered entirely on the server. No client-side
        JavaScript is shipped for this component.
      </p>
      <div className="mt-4 font-mono text-sm">
        Server time:
        {" "}
        {now.toISOString()}
      </div>
    </div>
  );
}

const getServerDemo = createServerFn({ method: "GET" }).handler(async () => {
  const Renderable = await renderServerComponent(<ServerTimestamp />);
  return { Renderable };
});

export const Route = createFileRoute("/(public)/rsc-demo")({
  loader: async () => {
    const { Renderable } = await getServerDemo();
    return { ServerDemo: Renderable };
  },
  component: RscDemoPage,
});

function RscDemoPage() {
  const { ServerDemo } = Route.useLoaderData();

  return (
    <div className="container mx-auto max-w-2xl py-20">
      <h1 className="mb-8 text-3xl font-bold">RSC + React Compiler Demo</h1>
      {ServerDemo}
      <p className="mt-4 text-sm text-muted-foreground">
        This page demonstrates TanStack Start React Server Components. The
        timestamp card above is rendered on the server and streamed to the
        client via React&apos;s Flight protocol.
      </p>
    </div>
  );
}
