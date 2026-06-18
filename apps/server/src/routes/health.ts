import { OpenSearchClient, Queue, Redis } from "@work-holo/infrastructure";
import { Hono } from "hono";

interface HealthStatus {
  services: {
    redis: boolean;
    opensearch: boolean;
    rabbitmq: boolean;
  };
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  uptime: number;
}

const health = new Hono();

health.get("/", (c) => {
  const redis = Redis.isConnected();
  const opensearch = OpenSearchClient.isConnected();
  const rabbitmq = Queue.isConnected();

  const services = { redis, opensearch, rabbitmq };
  const allHealthy = redis && opensearch && rabbitmq;
  const noneHealthy = !(redis || opensearch || rabbitmq);

  let status: HealthStatus["status"];
  if (allHealthy) {
    status = "healthy";
  } else if (noneHealthy) {
    status = "unhealthy";
  } else {
    status = "degraded";
  }

  const response: HealthStatus = {
    status,
    services,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  };

  // Return 503 for unhealthy, 200 for healthy/degraded
  return c.json(response, noneHealthy ? 503 : 200);
});

// Simple liveness probe — always 200 if server process is running
health.get("/live", (c) => c.json({ status: "alive" }));

export default health;
