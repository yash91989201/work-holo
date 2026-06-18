import { member } from "@work-holo/db/schema/auth";
import { and, eq } from "drizzle-orm";
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

const requireAuth: MiddlewareHandler<ElectricEnv> = async (c, next) => {
  const context = c.var.context;

  if (!context.session?.user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  await next();
};

const requireOrgMember: MiddlewareHandler<ElectricEnv> = async (c, next) => {
  const context = c.var.context;

  if (!context.session?.user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const orgId = context.session.session.activeOrganizationId;

  if (!orgId) {
    return c.json({ error: "No active organization" }, 401);
  }

  const membership = await context.db.query.member.findFirst({
    where: and(
      eq(member.organizationId, orgId),
      eq(member.userId, context.session.user.id)
    ),
  });

  if (!membership) {
    return c.json({ error: "You are not a member of this organization" }, 403);
  }

  await next();
};

export const electricRouter = new Hono<ElectricEnv>();

const sendProxyResponse = async (originUrl: URL) => {
  const response = await proxyElectricRequest(originUrl);

  return response;
};

electricRouter.use("*", async (c, next) => {
  const context = await createElectricContext({ context: c });
  c.set("context", context);
  await next();
});

electricRouter.get("/shapes/messages", requireOrgMember, async (c) => {
  const context = c.var.context;
  const orgId = context.session?.session.activeOrganizationId;
  const userId = context.session?.user.id;

  const originUrl = prepareElectricUrl(c.req.url);
  originUrl.searchParams.set("table", "message");

  const filter = `"channelId" IN (SELECT id FROM channel WHERE "organizationId" = '${orgId}' AND id IN (SELECT "channelId" FROM "channelMember" WHERE "userId" = '${userId}'))`;
  originUrl.searchParams.set("where", filter);

  const res = await sendProxyResponse(originUrl);
  return res;
});

electricRouter.get("/shapes/message-mentions", requireOrgMember, async (c) => {
  const context = c.var.context;
  const orgId = context.session?.session.activeOrganizationId;
  const userId = context.session?.user.id;

  const originUrl = prepareElectricUrl(c.req.url);
  originUrl.searchParams.set("table", '"messageMention"');

  const filter = `"messageId" IN (SELECT id FROM message WHERE "channelId" IN (SELECT id FROM channel WHERE "organizationId" = '${orgId}' AND id IN (SELECT "channelId" FROM "channelMember" WHERE "userId" = '${userId}')))`;
  originUrl.searchParams.set("where", filter);

  const res = await sendProxyResponse(originUrl);
  return res;
});

electricRouter.get("/shapes/message-reactions", requireOrgMember, async (c) => {
  const context = c.var.context;
  const orgId = context.session?.session.activeOrganizationId;
  const userId = context.session?.user.id;

  const originUrl = prepareElectricUrl(c.req.url);
  originUrl.searchParams.set("table", '"messageReaction"');

  const filter = `"messageId" IN (SELECT id FROM message WHERE "channelId" IN (SELECT id FROM channel WHERE "organizationId" = '${orgId}' AND id IN (SELECT "channelId" FROM "channelMember" WHERE "userId" = '${userId}')))`;
  originUrl.searchParams.set("where", filter);

  const res = await sendProxyResponse(originUrl);
  return res;
});

electricRouter.get("/shapes/users", requireOrgMember, (c) => {
  const context = c.var.context;
  const orgId = context.session?.session.activeOrganizationId;

  const originUrl = prepareElectricUrl(c.req.url);
  originUrl.searchParams.set("table", "user");

  const filter = `id IN (SELECT "userId" FROM member WHERE "organizationId" = '${orgId}')`;
  originUrl.searchParams.set("where", filter);

  return sendProxyResponse(originUrl);
});

electricRouter.get("/shapes/attachments", requireOrgMember, (c) => {
  const context = c.var.context;
  const orgId = context.session?.session.activeOrganizationId;
  const userId = context.session?.user.id;

  const originUrl = prepareElectricUrl(c.req.url);
  originUrl.searchParams.set("table", "attachment");

  const filter = `"messageId" IN (SELECT id FROM message WHERE "channelId" IN (SELECT id FROM channel WHERE "organizationId" = '${orgId}' AND id IN (SELECT "channelId" FROM "channelMember" WHERE "userId" = '${userId}')))`;
  originUrl.searchParams.set("where", filter);

  return sendProxyResponse(originUrl);
});

electricRouter.get("/shapes/accounts", requireAuth, (c) => {
  const context = c.var.context;
  const originUrl = prepareElectricUrl(c.req.url);

  originUrl.searchParams.set("table", "account");
  const filter = `"userId" = '${context.session?.user.id}'`;
  originUrl.searchParams.set("where", filter);

  return sendProxyResponse(originUrl);
});

electricRouter.get("/shapes/sessions", requireAuth, (c) => {
  const context = c.var.context;
  const originUrl = prepareElectricUrl(c.req.url);

  originUrl.searchParams.set("table", "session");
  const filter = `"userId" = '${context.session?.user.id}'`;
  originUrl.searchParams.set("where", filter);

  return sendProxyResponse(originUrl);
});

electricRouter.get("/shapes/invitations", requireOrgMember, (c) => {
  const context = c.var.context;
  const originUrl = prepareElectricUrl(c.req.url);

  originUrl.searchParams.set("table", "invitation");
  const filter = `"organizationId" = '${context.session?.session.activeOrganizationId}'`;
  originUrl.searchParams.set("where", filter);

  return sendProxyResponse(originUrl);
});

electricRouter.get("/shapes/members", requireOrgMember, (c) => {
  const context = c.var.context;
  const originUrl = prepareElectricUrl(c.req.url);

  originUrl.searchParams.set("table", "member");
  const filter = `"organizationId" = '${context.session?.session.activeOrganizationId}'`;
  originUrl.searchParams.set("where", filter);

  return sendProxyResponse(originUrl);
});

electricRouter.get("/shapes/organizations", requireAuth, (c) => {
  const context = c.var.context;
  const originUrl = prepareElectricUrl(c.req.url);

  originUrl.searchParams.set("table", "organization");
  const filter = `id IN (SELECT "organizationId" FROM member WHERE "userId" = '${context.session?.user.id}')`;
  originUrl.searchParams.set("where", filter);

  return sendProxyResponse(originUrl);
});

electricRouter.get("/shapes/teams", requireOrgMember, (c) => {
  const context = c.var.context;
  const originUrl = prepareElectricUrl(c.req.url);

  originUrl.searchParams.set("table", "team");
  const filter = `"organizationId" = '${context.session?.session.activeOrganizationId}'`;
  originUrl.searchParams.set("where", filter);

  return sendProxyResponse(originUrl);
});

electricRouter.get("/shapes/team-members", requireOrgMember, (c) => {
  const context = c.var.context;
  const originUrl = prepareElectricUrl(c.req.url);

  originUrl.searchParams.set("table", '"teamMember"');
  const filter = `teamId IN (SELECT id FROM team WHERE "organizationId" = '${context.session?.session.activeOrganizationId}')`;
  originUrl.searchParams.set("where", filter);

  return sendProxyResponse(originUrl);
});

electricRouter.get("/shapes/verifications", requireAuth, (c) => {
  const context = c.var.context;
  const originUrl = prepareElectricUrl(c.req.url);

  originUrl.searchParams.set("table", "verification");
  const filter = `"userId" = '${context.session?.user.id}'`;
  originUrl.searchParams.set("where", filter);

  return sendProxyResponse(originUrl);
});

electricRouter.get("/shapes/attendance", requireOrgMember, (c) => {
  const context = c.var.context;
  const orgId = context.session?.session.activeOrganizationId;
  const userId = context.session?.user.id;

  const originUrl = prepareElectricUrl(c.req.url);
  originUrl.searchParams.set("table", "attendance");

  const filter = `"userId" = '${userId}' AND "organizationId" = '${orgId}'`;
  originUrl.searchParams.set("where", filter);

  return sendProxyResponse(originUrl);
});

electricRouter.get("/shapes/channels", requireOrgMember, (c) => {
  const context = c.var.context;
  const orgId = context.session?.session.activeOrganizationId;
  const userId = context.session?.user.id;

  const originUrl = prepareElectricUrl(c.req.url);
  originUrl.searchParams.set("table", "channel");

  const filter = `"organizationId" = '${orgId}' AND id IN (SELECT "channelId" FROM "channelMember" WHERE "userId" = '${userId}')`;
  originUrl.searchParams.set("where", filter);

  return sendProxyResponse(originUrl);
});

electricRouter.get("/shapes/channel-members", requireOrgMember, (c) => {
  const context = c.var.context;
  const orgId = context.session?.session.activeOrganizationId;
  const userId = context.session?.user.id;

  const originUrl = prepareElectricUrl(c.req.url);
  originUrl.searchParams.set("table", '"channelMember"');

  const filter = `"channelId" IN (SELECT id FROM channel WHERE "organizationId" = '${orgId}' AND id IN (SELECT "channelId" FROM "channelMember" WHERE "userId" = '${userId}'))`;
  originUrl.searchParams.set("where", filter);

  return sendProxyResponse(originUrl);
});

electricRouter.get("/shapes/notifications", requireAuth, (c) => {
  const context = c.var.context;
  const originUrl = prepareElectricUrl(c.req.url);

  originUrl.searchParams.set("table", "notification");
  const filter = `"userId" = '${context.session?.user.id}'`;
  originUrl.searchParams.set("where", filter);

  return sendProxyResponse(originUrl);
});

electricRouter.get("/shapes/message-read", requireAuth, (c) => {
  const context = c.var.context;
  const originUrl = prepareElectricUrl(c.req.url);

  originUrl.searchParams.set("table", '"messageRead"');
  const filter = `"userId" = '${context.session?.user.id}'`;
  originUrl.searchParams.set("where", filter);

  return sendProxyResponse(originUrl);
});

electricRouter.get("/shapes/channel-read", requireAuth, (c) => {
  const context = c.var.context;
  const originUrl = prepareElectricUrl(c.req.url);

  originUrl.searchParams.set("table", '"channelRead"');
  const filter = `"userId" = '${context.session?.user.id}'`;
  originUrl.searchParams.set("where", filter);

  return sendProxyResponse(originUrl);
});

electricRouter.get("/shapes/message-read-summary", requireAuth, (c) => {
  const originUrl = prepareElectricUrl(c.req.url);

  originUrl.searchParams.set("table", '"messageReadSummary"');

  return sendProxyResponse(originUrl);
});

electricRouter.get(
  "/shapes/channel-read-processed-watermark",
  requireAuth,
  (c) => {
    const originUrl = prepareElectricUrl(c.req.url);

    originUrl.searchParams.set("table", '"channelReadProcessedWatermark"');

    return sendProxyResponse(originUrl);
  }
);

electricRouter.get("/shapes/push-subscriptions", requireAuth, (c) => {
  const context = c.var.context;
  const originUrl = prepareElectricUrl(c.req.url);

  originUrl.searchParams.set("table", '"pushSubscription"');
  const filter = `"userId" = '${context.session?.user.id}'`;
  originUrl.searchParams.set("where", filter);

  return sendProxyResponse(originUrl);
});

// ============================================================
// Direct Message Shape Endpoints
// ============================================================

electricRouter.get("/shapes/dm-conversations", requireOrgMember, (c) => {
  const context = c.var.context;
  const orgId = context.session?.session.activeOrganizationId;
  const userId = context.session?.user.id;

  const originUrl = prepareElectricUrl(c.req.url);
  originUrl.searchParams.set("table", '"dmConversation"');

  const filter = `("participantOneId" = '${userId}' OR "participantTwoId" = '${userId}') AND "organizationId" = '${orgId}'`;
  originUrl.searchParams.set("where", filter);

  return sendProxyResponse(originUrl);
});

electricRouter.get("/shapes/dm-messages", requireOrgMember, (c) => {
  const context = c.var.context;
  const orgId = context.session?.session.activeOrganizationId;
  const userId = context.session?.user.id;

  const originUrl = prepareElectricUrl(c.req.url);
  originUrl.searchParams.set("table", '"dmMessage"');

  const filter = `"conversationId" IN (SELECT id FROM "dmConversation" WHERE ("participantOneId" = '${userId}' OR "participantTwoId" = '${userId}') AND "organizationId" = '${orgId}')`;
  originUrl.searchParams.set("where", filter);

  return sendProxyResponse(originUrl);
});

electricRouter.get("/shapes/dm-attachments", requireOrgMember, (c) => {
  const context = c.var.context;
  const orgId = context.session?.session.activeOrganizationId;
  const userId = context.session?.user.id;

  const originUrl = prepareElectricUrl(c.req.url);
  originUrl.searchParams.set("table", '"dmAttachment"');

  const filter = `"messageId" IN (SELECT id FROM "dmMessage" WHERE "conversationId" IN (SELECT id FROM "dmConversation" WHERE ("participantOneId" = '${userId}' OR "participantTwoId" = '${userId}') AND "organizationId" = '${orgId}'))`;
  originUrl.searchParams.set("where", filter);

  return sendProxyResponse(originUrl);
});

electricRouter.get("/shapes/dm-reactions", requireOrgMember, (c) => {
  const context = c.var.context;
  const orgId = context.session?.session.activeOrganizationId;
  const userId = context.session?.user.id;

  const originUrl = prepareElectricUrl(c.req.url);
  originUrl.searchParams.set("table", '"dmMessageReaction"');

  const filter = `"messageId" IN (SELECT id FROM "dmMessage" WHERE "conversationId" IN (SELECT id FROM "dmConversation" WHERE ("participantOneId" = '${userId}' OR "participantTwoId" = '${userId}') AND "organizationId" = '${orgId}'))`;
  originUrl.searchParams.set("where", filter);

  return sendProxyResponse(originUrl);
});

electricRouter.get("/shapes/dm-message-reads", requireOrgMember, (c) => {
  const context = c.var.context;
  const orgId = context.session?.session.activeOrganizationId;
  const userId = context.session?.user.id;

  const originUrl = prepareElectricUrl(c.req.url);
  originUrl.searchParams.set("table", '"dmMessageRead"');

  const filter = `"userId" = '${userId}' AND "messageId" IN (SELECT id FROM "dmMessage" WHERE "conversationId" IN (SELECT id FROM "dmConversation" WHERE ("participantOneId" = '${userId}' OR "participantTwoId" = '${userId}') AND "organizationId" = '${orgId}'))`;
  originUrl.searchParams.set("where", filter);

  return sendProxyResponse(originUrl);
});

electricRouter.get("/shapes/dm-conversation-reads", requireAuth, (c) => {
  const context = c.var.context;
  const originUrl = prepareElectricUrl(c.req.url);

  originUrl.searchParams.set("table", '"dmConversationRead"');
  const filter = `"userId" = '${context.session?.user.id}'`;
  originUrl.searchParams.set("where", filter);

  return sendProxyResponse(originUrl);
});

electricRouter.get("/shapes/dm-conversation-mutes", requireAuth, (c) => {
  const context = c.var.context;
  const originUrl = prepareElectricUrl(c.req.url);

  originUrl.searchParams.set("table", '"dmConversationMute"');
  const filter = `"userId" = '${context.session?.user.id}'`;
  originUrl.searchParams.set("where", filter);

  return sendProxyResponse(originUrl);
});
