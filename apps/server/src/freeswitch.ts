import { db } from "@work-holo/db";
import { callLogs } from "@work-holo/db/schema/call-logs";
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
 * Dialplan endpoint — FreeSWITCH calls this to route calls.
 *
 * Inbound (context=public): DID → look up assigned agent → bridge to extension
 * Outbound (context=default): agent extension dials out → route through org's default trunk
 */
freeswitchRouter.post("/dialplan", async (c) => {
  const secret = c.req.header("X-FreeSWITCH-Secret");
  if (!isAuthorized(secret)) return c.text("Unauthorized", 401);

  const body = await c.req.parseBody();
  const context =
    (body["Hunt-Context"] as string) ??
    (body["context"] as string) ??
    "default";
  const destNumber =
    (body["Caller-Destination-Number"] as string) ??
    (body["destination_number"] as string);
  const callerUsername = body["Caller-Username"] as string | undefined;

  if (!destNumber) {
    return c.html(xmlNotFound(), 200);
  }

  // ── Outbound: agent softphone dialing an external number ──────────────────
  if (context === "default" && callerUsername) {
    const ext = await db.query.agentExtensions.findFirst({
      where: and(
        eq(agentExtensions.extension, callerUsername),
        eq(agentExtensions.isActive, true)
      ),
    });

    if (!ext?.organizationId) {
      return c.html(xmlNotFound(), 200);
    }

    const orgSettings = await db.query.orgDialerSettings.findFirst({
      where: eq(orgDialerSettings.organizationId, ext.organizationId),
      with: { defaultOutboundTrunk: true },
    });

    if (
      !(
        orgSettings?.isEnabled &&
        orgSettings?.canMakeOutboundCalls &&
        orgSettings?.defaultOutboundTrunk
      )
    ) {
      return c.html(xmlNotFound(), 200);
    }

    const trunkName = orgSettings.defaultOutboundTrunk.name;

    const xml = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<document type="freeswitch/xml">
  <section name="dialplan">
    <context name="default">
      <extension name="outbound_pstn">
        <condition field="destination_number" expression="^(\\+?[0-9]+)$">
          <action application="set" data="effective_caller_id_name=${escapeXml(ext.callerIdName)}"/>
          <action application="set" data="effective_caller_id_number=${escapeXml(ext.callerIdNumber)}"/>
          <action application="bridge" data="sofia/gateway/${escapeXml(trunkName)}/${escapeXml(destNumber)}"/>
        </condition>
      </extension>
    </context>
  </section>
</document>`;

    return c.html(xml, 200);
  }

  // ── Inbound: call arriving on a DID (context=public) ─────────────────────
  const did = await db.query.didInventory.findFirst({
    where: and(
      eq(didInventory.number, destNumber),
      eq(didInventory.isActive, true)
    ),
  });

  if (!did?.organizationId) {
    return c.html(xmlNotFound(), 200);
  }

  const orgSettings = await db.query.orgDialerSettings.findFirst({
    where: eq(orgDialerSettings.organizationId, did.organizationId),
  });

  if (!(orgSettings?.isEnabled && orgSettings?.canReceiveInboundCalls)) {
    return c.html(xmlNotFound(), 200);
  }

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
    <context name="public">
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

/**
 * CDR endpoint — FreeSWITCH posts a JSON CDR after every call ends.
 * Configure mod_cdr_curl in FreeSWITCH to POST to /api/freeswitch/cdr.
 */
freeswitchRouter.post("/cdr", async (c) => {
  const secret = c.req.header("X-FreeSWITCH-Secret");
  if (!isAuthorized(secret)) return c.text("Unauthorized", 401);

  let body: Record<string, unknown>;
  try {
    body = await c.req.json();
  } catch {
    return c.text("Bad Request", 400);
  }

  const vars = (body.variables ?? {}) as Record<string, string>;
  const callId = vars.uuid;
  if (!callId) return c.text("Missing uuid", 400);

  const direction = vars.direction === "outbound" ? "outbound" : "inbound";
  const fromNumber =
    vars.caller_id_number ?? vars.effective_caller_id_number ?? "";
  const toNumber = vars.destination_number ?? "";
  const startEpoch = Number(vars.start_epoch ?? 0);
  const answerEpoch = Number(vars.answer_epoch ?? 0);
  const endEpoch = Number(vars.end_epoch ?? 0);
  const duration = Number(vars.duration ?? 0);
  const billsec = Number(vars.billsec ?? 0);
  const hangupCause = vars.hangup_cause ?? null;
  const recordingUrl = vars.recording_url ?? null;

  let status = "missed";
  if (answerEpoch > 0) {
    status = "answered";
  } else if (hangupCause === "USER_BUSY") {
    status = "busy";
  } else if (
    hangupCause === "NO_ANSWER" ||
    hangupCause === "NO_USER_RESPONSE"
  ) {
    status = "no_answer";
  } else if (hangupCause && hangupCause !== "NORMAL_CLEARING") {
    status = "failed";
  }

  let organizationId: string | null = null;
  let agentUserId: string | null = null;
  let extensionId: string | null = null;
  let didId: string | null = null;

  if (direction === "outbound") {
    const callerExt = vars.accountcode ?? vars.caller_id_number;
    if (callerExt) {
      const ext = await db.query.agentExtensions.findFirst({
        where: eq(agentExtensions.extension, callerExt),
        columns: { id: true, organizationId: true, userId: true },
      });
      if (ext) {
        extensionId = ext.id;
        organizationId = ext.organizationId ?? null;
        agentUserId = ext.userId ?? null;
      }
    }
  } else {
    const did = await db.query.didInventory.findFirst({
      where: eq(didInventory.number, toNumber),
      columns: { id: true, organizationId: true },
    });
    if (did) {
      didId = did.id;
      organizationId = did.organizationId ?? null;
      const access = await db.query.agentDialerAccess.findFirst({
        where: and(
          eq(agentDialerAccess.assignedDidId, did.id),
          eq(agentDialerAccess.isActive, true)
        ),
        columns: { userId: true, assignedExtensionId: true },
      });
      if (access) {
        agentUserId = access.userId;
        extensionId = access.assignedExtensionId ?? null;
      }
    }
  }

  await db
    .insert(callLogs)
    .values({
      freeswitchCallId: callId,
      organizationId,
      agentUserId,
      extensionId,
      didId,
      direction,
      fromNumber,
      toNumber,
      status,
      hangupCause,
      startedAt: startEpoch ? new Date(startEpoch * 1000) : new Date(),
      answeredAt: answerEpoch ? new Date(answerEpoch * 1000) : null,
      endedAt: endEpoch ? new Date(endEpoch * 1000) : null,
      durationSeconds: duration,
      billableSeconds: billsec,
      recordingUrl,
    })
    .onConflictDoNothing();

  return c.text("OK", 200);
});
