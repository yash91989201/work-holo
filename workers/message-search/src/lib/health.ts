import { OpenSearchClient, Queue } from "@work-holo/infrastructure";

let healthServer: ReturnType<typeof Bun.serve> | null = null;

export function startHealthServer(port: number) {
  healthServer = Bun.serve({
    port,
    fetch(req) {
      const url = new URL(req.url);

      if (url.pathname === "/health/live") {
        return Response.json({ status: "alive" });
      }

      if (url.pathname === "/health") {
        const services = {
          rabbitmq: Queue.isConnected(),
          opensearch: OpenSearchClient.isConnected(),
        };
        const allHealthy = Object.values(services).every(Boolean);

        return Response.json(
          {
            status: allHealthy ? "healthy" : "unhealthy",
            services,
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
          },
          { status: allHealthy ? 200 : 503 }
        );
      }

      return new Response("Not Found", { status: 404 });
    },
  });

  console.log(`[health] Server listening on port ${port}`);
}

export function stopHealthServer() {
  if (healthServer) {
    healthServer.stop();
    healthServer = null;
  }
}
