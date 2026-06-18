import "dotenv/config";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { createContext } from "@work-holo/api/context";
import { electricRouter } from "@work-holo/api/routers/electric/index";
import { appRouter } from "@work-holo/api/routers/index";
import { auth } from "@work-holo/auth";
import { db } from "@work-holo/db";
import { env } from "@work-holo/env/server";
import {
  OpenSearchClient,
  PusherClient,
  Queue,
  Redis,
} from "@work-holo/infrastructure";
import { PermissionManagers } from "@work-holo/permission";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import health from "./routes/health";

await Redis.connect({ url: env.REDIS_URL });
await OpenSearchClient.connect({ url: env.OPENSEARCH_URL });

const isProduction = env.ENV === "production";

PusherClient.connect({
  appId: env.PUSHER_APP_ID,
  key: env.PUSHER_APP_KEY,
  secret: env.PUSHER_APP_SECRET,
  host: env.PUSHER_HOST,
  port: isProduction ? undefined : env.PUSHER_PORT,
  useTLS: isProduction,
});

Queue.connect({ url: env.RABBITMQ_URL });

PermissionManagers.initialize({
  db,
  redis: Redis.getClient(),
  pusher: PusherClient.getClient(),
});

const app = new Hono();

app.use(logger());
app.use(
  "/*",
  cors({
    origin: env.CORS_ORIGIN,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "user-agent"],
    credentials: true,
  })
);

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.route("/electric", electricRouter);

export const apiHandler = new OpenAPIHandler(appRouter, {
  plugins: [
    new OpenAPIReferencePlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
    }),
  ],
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

export const rpcHandler = new RPCHandler(appRouter, {
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

app.use("/*", async (c, next) => {
  const context = await createContext({
    context: c,
  });

  const rpcResult = await rpcHandler.handle(c.req.raw, {
    prefix: "/rpc",
    context,
  });

  if (rpcResult.matched) {
    return new Response(rpcResult.response.body, rpcResult.response);
  }

  const apiResult = await apiHandler.handle(c.req.raw, {
    prefix: "/api-reference",
    context,
  });

  if (apiResult.matched) {
    return new Response(apiResult.response.body, apiResult.response);
  }

  await next();
});

app.route("/health", health);
app.get("/", (c) => c.text("OK"));

let shuttingDown = false;
const shutdown = async (signal: string) => {
  if (shuttingDown) {
    return;
  }
  shuttingDown = true;
  console.log(`[server] received ${signal}, closing infrastructure...`);
  // Close Queue first so in-flight RabbitMQ publishes flush before teardown.
  await Promise.allSettled([
    Queue.close(),
    OpenSearchClient.close(),
    Redis.close(),
    PusherClient.close(),
  ]);
  process.exit(0);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

export default {
  fetch: app.fetch,
  port: env.PORT,
  idleTimeout: 255,
};
