import { db } from "@work-holo/db";
import {
  agentDialerAccess,
  agentExtensions,
  didInventory,
  orgDialerSettings,
} from "@work-holo/db/schema/dialer";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";

export const freeswitchRouter = new Hono();

// Optional shared secret — set FREESWITCH_SECRET in .env to lock down these endpoints
function isAuthorized(secret: string | undefined): boolean {
  const expected = process.env.FREESWITCH_SECRET;
  if (!expected) return true;
  return secret === expected;
}

function xmlNotFound(): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<document type="freeswitch/xml">
  <section name="result">
    <result status="not found"/>
  </section>
</document>`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Directory endpoint — FreeSWITCH calls this to authenticate a SIP user.
 *
 * FreeSWITCH sends: user=<extension>&domain=<sip_domain>&...
 * We respond with the user's credentials and variables.
 */
freeswitchRouter.post("/directory", async (c) => {
  const secret = c.req.header("X-FreeSWITCH-Secret");
  if (!isAuthorized(secret)) return c.text("Unauthorized", 401);

  const body = await c.req.parseBody();
  const extension = body["user"] as string;
  const domain = (body["domain"] as string) ?? "localhost";

  if (!extension) {
    return c.html(xmlNotFound(), 200);
  }

  const ext = await db.query.agentExtensions.findFirst({
    where: and(
      eq(agentExtensions.extension, extension),
      eq(agentExtensions.isActive, true)
    ),
  });

  if (!ext) {
    return c.html(xmlNotFound(), 200);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<document type="freeswitch/xml">
  <section name="directory">
    <domain name="${escapeXml(domain)}">
      <user id="${escapeXml(ext.extension)}">
        <params>
          <param name="password" value="${escapeXml(ext.password)}"/>
        </params>
        <variables>
          <variable name="toll_allow" value="${escapeXml(ext.tollAllow ?? "domestic,international,local")}"/>
          <variable name="accountcode" value="${escapeXml(ext.extension)}"/>
          <variable name="user_context" value="${escapeXml(ext.context ?? "default")}"/>
          <variable name="effective_caller_id_name" value="${escapeXml(ext.callerIdName)}"/>
          <variable name="effective_caller_id_number" value="${escapeXml(ext.callerIdNumber)}"/>
          <variable name="outbound_caller_id_name" value="${escapeXml(ext.callerIdName)}"/>
          <variable name="outbound_caller_id_number" value="${escapeXml(ext.callerIdNumber)}"/>
        </variables>
      </user>
    </domain>
  </section>
</document>`;

  return c.html(xml, 200);
});

/**
 * Dialplan endpoint — FreeSWITCH calls this to route an inbound call.
 *
 * FreeSWITCH sends: Caller-Destination-Number=<did>&Caller-Caller-ID-Number=<caller>&...
 * We look up which agent/extension owns that DID and return a bridge action.
 */
freeswitchRouter.post("/dialplan", async (c) => {
  const secret = c.req.header("X-FreeSWITCH-Secret");
  if (!isAuthorized(secret)) return c.text("Unauthorized", 401);

  const body = await c.req.parseBody();
  const destNumber =
    (body["Caller-Destination-Number"] as string) ??
    (body["destination_number"] as string);

  if (!destNumber) {
    return c.html(xmlNotFound(), 200);
  }

  const did = await db.query.didInventory.findFirst({
    where: and(
      eq(didInventory.number, destNumber),
      eq(didInventory.isActive, true)
    ),
  });

  if (!did?.organizationId) {
    return c.html(xmlNotFound(), 200);
  }

  // Verify org has inbound calling enabled
  const orgSettings = await db.query.orgDialerSettings.findFirst({
    where: eq(orgDialerSettings.organizationId, did.organizationId),
  });

  if (!(orgSettings?.isEnabled && orgSettings?.canReceiveInboundCalls)) {
    return c.html(xmlNotFound(), 200);
  }

  // Find which agent is assigned this DID
  const agentAccess = await db.query.agentDialerAccess.findFirst({
    where: and(
      eq(agentDialerAccess.assignedDidId, did.id),
      eq(agentDialerAccess.organizationId, did.organizationId),
      eq(agentDialerAccess.canReceiveCalls, true),
      eq(agentDialerAccess.isActive, true)
    ),
  });

  if (!agentAccess) {
    return c.html(xmlNotFound(), 200);
  }

  // Find the SIP extension for that agent
  const ext = await db.query.agentExtensions.findFirst({
    where: and(
      eq(agentExtensions.userId, agentAccess.userId),
      eq(agentExtensions.organizationId, did.organizationId),
      eq(agentExtensions.isActive, true)
    ),
  });

  if (!ext) {
    return c.html(xmlNotFound(), 200);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<document type="freeswitch/xml">
  <section name="dialplan">
    <context name="default">
      <extension name="inbound_did">
        <condition field="destination_number" expression="^${destNumber.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$">
          <action application="answer"/>
          <action application="sleep" data="500"/>
          <action application="bridge" data="user/${escapeXml(ext.extension)}"/>
        </condition>
      </extension>
    </context>
  </section>
</document>`;

  return c.html(xml, 200);
});
