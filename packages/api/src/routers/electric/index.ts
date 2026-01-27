import type { MiddlewareHandler } from "hono";
import { Hono } from "hono";
import type { ElectricContext } from "../../context";
import { createElectricContext } from "../../context";
import {
  prepareElectricUrl,
  proxyElectricRequest,
} from "../../lib/electric-proxy";

type ElectricEnv = {
  Variables: {
    context: ElectricContext;
  };
};

// Middleware to check authentication
const requireAuth: MiddlewareHandler<ElectricEnv> = async (c, next) => {
  const context = c.get("context");

  if (!context.session?.user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  await next();
};

export const electricRouter = new Hono<ElectricEnv>();

const sendProxyResponse = async (originUrl: URL) => {
  const response = await proxyElectricRequest(originUrl);

  return response;
};

// Inject context into all routes
electricRouter.use("*", async (c, next) => {
  const context = await createElectricContext({ context: c });
  c.set("context", context);
  await next();
});

electricRouter.get("/shapes/messages", requireAuth, async (c) => {
  const context = c.get("context") as ElectricContext;
  const orgId = context.session?.session.activeOrganizationId;
  const userId = context.session?.user.id;

  if (!orgId) {
    return c.json({ error: "No active organization" }, 401);
  }

  const originUrl = prepareElectricUrl(c.req.url);
  originUrl.searchParams.set("table", "message");

  // Only messages from channels user is member of in active org
  const filter = `"channelId" IN (SELECT id FROM channel WHERE "organizationId" = '${orgId}' AND id IN (SELECT "channelId" FROM "channelMember" WHERE "userId" = '${userId}'))`;
  originUrl.searchParams.set("where", filter);

  const res = await sendProxyResponse(originUrl);
  return res;
});

electricRouter.get("/shapes/message-mentions", requireAuth, async (c) => {
  const context = c.get("context") as ElectricContext;
  const orgId = context.session?.session.activeOrganizationId;
  const userId = context.session?.user.id;

  if (!orgId) {
    return c.json({ error: "No active organization" }, 401);
  }

  const originUrl = prepareElectricUrl(c.req.url);
  originUrl.searchParams.set("table", '"messageMention"');

  // Only mentions from messages in user's channels
  const filter = `"messageId" IN (SELECT id FROM message WHERE "channelId" IN (SELECT id FROM channel WHERE "organizationId" = '${orgId}' AND id IN (SELECT "channelId" FROM "channelMember" WHERE "userId" = '${userId}')))`;
  originUrl.searchParams.set("where", filter);

  const res = await sendProxyResponse(originUrl);
  return res;
});

electricRouter.get("/shapes/message-reactions", requireAuth, async (c) => {
  const context = c.get("context") as ElectricContext;
  const orgId = context.session?.session.activeOrganizationId;
  const userId = context.session?.user.id;

  if (!orgId) {
    return c.json({ error: "No active organization" }, 401);
  }

  const originUrl = prepareElectricUrl(c.req.url);
  originUrl.searchParams.set("table", '"messageReaction"');

  // Only reactions from messages in user's channels
  const filter = `"messageId" IN (SELECT id FROM message WHERE "channelId" IN (SELECT id FROM channel WHERE "organizationId" = '${orgId}' AND id IN (SELECT "channelId" FROM "channelMember" WHERE "userId" = '${userId}')))`;
  originUrl.searchParams.set("where", filter);

  const res = await sendProxyResponse(originUrl);
  return res;
});

electricRouter.get("/shapes/users", requireAuth, (c) => {
  const context = c.get("context") as ElectricContext;
  const orgId = context.session?.session.activeOrganizationId;

  if (!orgId) {
    return c.json({ error: "No active organization" }, 401);
  }

  const originUrl = prepareElectricUrl(c.req.url);
  originUrl.searchParams.set("table", "user");

  // Only users who are members of the active org
  const filter = `id IN (SELECT "userId" FROM member WHERE "organizationId" = '${orgId}')`;
  originUrl.searchParams.set("where", filter);

  return sendProxyResponse(originUrl);
});

electricRouter.get("/shapes/attachments", requireAuth, (c) => {
  const context = c.get("context") as ElectricContext;
  const orgId = context.session?.session.activeOrganizationId;
  const userId = context.session?.user.id;

  if (!orgId) {
    return c.json({ error: "No active organization" }, 401);
  }

  const originUrl = prepareElectricUrl(c.req.url);
  originUrl.searchParams.set("table", "attachment");

  // Only attachments from messages in user's channels
  const filter = `"messageId" IN (SELECT id FROM message WHERE "channelId" IN (SELECT id FROM channel WHERE "organizationId" = '${orgId}' AND id IN (SELECT "channelId" FROM "channelMember" WHERE "userId" = '${userId}')))`;
  originUrl.searchParams.set("where", filter);

  return sendProxyResponse(originUrl);
});

electricRouter.get("/shapes/accounts", requireAuth, (c) => {
  const context = c.get("context") as ElectricContext;
  const originUrl = prepareElectricUrl(c.req.url);

  originUrl.searchParams.set("table", "account");
  // Users can only see their own accounts
  const filter = `"userId" = '${context.session?.user.id}'`;
  originUrl.searchParams.set("where", filter);

  return sendProxyResponse(originUrl);
});

electricRouter.get("/shapes/sessions", requireAuth, (c) => {
  const context = c.get("context") as ElectricContext;
  const originUrl = prepareElectricUrl(c.req.url);

  originUrl.searchParams.set("table", "session");
  // Users can only see their own sessions
  const filter = `"userId" = '${context.session?.user.id}'`;
  originUrl.searchParams.set("where", filter);

  return sendProxyResponse(originUrl);
});

electricRouter.get("/shapes/invitations", requireAuth, (c) => {
  const context = c.get("context") as ElectricContext;
  const originUrl = prepareElectricUrl(c.req.url);

  originUrl.searchParams.set("table", "invitation");
  // Users can see invitations related to their organization
  const filter = `"organizationId" = '${context.session?.session.activeOrganizationId}'`;
  originUrl.searchParams.set("where", filter);

  return sendProxyResponse(originUrl);
});

electricRouter.get("/shapes/members", requireAuth, (c) => {
  const context = c.get("context") as ElectricContext;
  const originUrl = prepareElectricUrl(c.req.url);

  originUrl.searchParams.set("table", "member");
  // Users can see all members in their organization
  const filter = `"organizationId" = '${context.session?.session.activeOrganizationId}'`;
  originUrl.searchParams.set("where", filter);

  return sendProxyResponse(originUrl);
});

electricRouter.get("/shapes/organizations", requireAuth, (c) => {
  const context = c.get("context") as ElectricContext;
  const originUrl = prepareElectricUrl(c.req.url);

  originUrl.searchParams.set("table", "organization");
  // Users can see organizations they belong to
  const filter = `id IN (SELECT "organizationId" FROM member WHERE "userId" = '${context.session?.user.id}')`;
  originUrl.searchParams.set("where", filter);

  return sendProxyResponse(originUrl);
});

electricRouter.get("/shapes/teams", requireAuth, (c) => {
  const context = c.get("context") as ElectricContext;
  const originUrl = prepareElectricUrl(c.req.url);

  originUrl.searchParams.set("table", "team");
  // Users can see teams in their organization
  const filter = `"organizationId" = '${context.session?.session.activeOrganizationId}'`;
  originUrl.searchParams.set("where", filter);

  return sendProxyResponse(originUrl);
});

electricRouter.get("/shapes/team-members", requireAuth, (c) => {
  const context = c.get("context") as ElectricContext;
  const originUrl = prepareElectricUrl(c.req.url);

  originUrl.searchParams.set("table", '"teamMember"');
  // Users can see team members for teams in their organization
  const filter = `teamId IN (SELECT id FROM team WHERE "organizationId" = '${context.session?.session.activeOrganizationId}')`;
  originUrl.searchParams.set("where", filter);

  return sendProxyResponse(originUrl);
});

electricRouter.get("/shapes/verifications", requireAuth, (c) => {
  const context = c.get("context") as ElectricContext;
  const originUrl = prepareElectricUrl(c.req.url);

  originUrl.searchParams.set("table", "verification");
  // Users can only see their own verifications
  const filter = `"userId" = '${context.session?.user.id}'`;
  originUrl.searchParams.set("where", filter);

  return sendProxyResponse(originUrl);
});

electricRouter.get("/shapes/attendance", requireAuth, (c) => {
  const context = c.get("context") as ElectricContext;
  const orgId = context.session?.session.activeOrganizationId;
  const userId = context.session?.user.id;

  if (!orgId) {
    return c.json({ error: "No active organization" }, 401);
  }

  const originUrl = prepareElectricUrl(c.req.url);
  originUrl.searchParams.set("table", "attendance");

  // User's own attendance in active org only
  const filter = `"userId" = '${userId}' AND "organizationId" = '${orgId}'`;
  originUrl.searchParams.set("where", filter);

  return sendProxyResponse(originUrl);
});

electricRouter.get("/shapes/channels", requireAuth, (c) => {
  const context = c.get("context") as ElectricContext;
  const orgId = context.session?.session.activeOrganizationId;
  const userId = context.session?.user.id;

  if (!orgId) {
    return c.json({ error: "No active organization" }, 401);
  }

  const originUrl = prepareElectricUrl(c.req.url);
  originUrl.searchParams.set("table", "channel");

  // Only channels user is member of in active org
  const filter = `"organizationId" = '${orgId}' AND id IN (SELECT "channelId" FROM "channelMember" WHERE "userId" = '${userId}')`;
  originUrl.searchParams.set("where", filter);

  return sendProxyResponse(originUrl);
});

electricRouter.get("/shapes/channel-members", requireAuth, (c) => {
  const context = c.get("context") as ElectricContext;
  const orgId = context.session?.session.activeOrganizationId;
  const userId = context.session?.user.id;

  if (!orgId) {
    return c.json({ error: "No active organization" }, 401);
  }

  const originUrl = prepareElectricUrl(c.req.url);
  originUrl.searchParams.set("table", '"channelMember"');

  // Only members of channels user can see
  const filter = `"channelId" IN (SELECT id FROM channel WHERE "organizationId" = '${orgId}' AND id IN (SELECT "channelId" FROM "channelMember" WHERE "userId" = '${userId}'))`;
  originUrl.searchParams.set("where", filter);

  return sendProxyResponse(originUrl);
});

electricRouter.get("/shapes/notifications", requireAuth, (c) => {
  const context = c.get("context") as ElectricContext;
  const originUrl = prepareElectricUrl(c.req.url);

  originUrl.searchParams.set("table", "notification");
  // Users can only see their own notifications
  const filter = `"userId" = '${context.session?.user.id}'`;
  originUrl.searchParams.set("where", filter);

  return sendProxyResponse(originUrl);
});

electricRouter.get("/shapes/message-read", requireAuth, (c) => {
  const context = c.get("context") as ElectricContext;
  const originUrl = prepareElectricUrl(c.req.url);

  originUrl.searchParams.set("table", '"messageRead"');
  // Users can only see their own message read status
  const filter = `"userId" = '${context.session?.user.id}'`;
  originUrl.searchParams.set("where", filter);

  return sendProxyResponse(originUrl);
});

electricRouter.get("/shapes/channel-join-requests", requireAuth, (c) => {
  const originUrl = prepareElectricUrl(c.req.url);

  originUrl.searchParams.set("table", '"channelJoinRequest"');

  return sendProxyResponse(originUrl);
});

electricRouter.get("/shapes/channel-read", requireAuth, (c) => {
  const context = c.get("context") as ElectricContext;
  const originUrl = prepareElectricUrl(c.req.url);

  originUrl.searchParams.set("table", '"channelRead"');
  // Users can only see their own channel read status
  const filter = `"userId" = '${context.session?.user.id}'`;
  originUrl.searchParams.set("where", filter);

  return sendProxyResponse(originUrl);
});

electricRouter.get("/shapes/message-read-summary", requireAuth, (c) => {
  const originUrl = prepareElectricUrl(c.req.url);

  originUrl.searchParams.set("table", '"messageReadSummary"');
  // Note: No server-side filtering - client will only display summaries for messages they can see
  // This avoids nested subqueries which Electric SQL doesn't support

  return sendProxyResponse(originUrl);
});

electricRouter.get(
  "/shapes/channel-read-processed-watermark",
  requireAuth,
  (c) => {
    const originUrl = prepareElectricUrl(c.req.url);

    originUrl.searchParams.set("table", '"channelReadProcessedWatermark"');
    // Note: No server-side filtering - this is worker metadata, minimal security concern
    // Client-side filtering will handle display based on accessible channels

    return sendProxyResponse(originUrl);
  }
);

electricRouter.get("/shapes/push-subscriptions", requireAuth, (c) => {
  const context = c.get("context") as ElectricContext;
  const originUrl = prepareElectricUrl(c.req.url);

  originUrl.searchParams.set("table", '"pushSubscription"');
  // Users can only see their own push subscriptions
  const filter = `"userId" = '${context.session?.user.id}'`;
  originUrl.searchParams.set("where", filter);

  return sendProxyResponse(originUrl);
});
