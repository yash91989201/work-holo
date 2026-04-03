# Work-Holo Dialer — Execution Guide

> **Your VPS:** `135.181.31.20` (Hetzner)
> **FreeSWITCH Path:** `/usr/local/freeswitch/`
> **SIP Trunk:** CloudBharat — `dsip914226628808` @ `siptrunk.cloudbharat.in`
> **DID:** `914226628808`
> **Trunk Expires:** 06/04/2026

---

## PART 1 — VPS / FreeSWITCH Setup (Phase 1)

> Goal: Make one real PSTN call work before writing any app code.

---

### Step 1 — Fix Default Password

**Why:** FreeSWITCH will delay every call by 10 seconds as a warning until this is changed.

```bash
nano /usr/local/freeswitch/conf/vars.xml
```

Use `Ctrl+W` → search `default_password`

Change:
```xml
<X-PRE-PROCESS cmd="set" data="default_password=1234"/>
```

To:
```xml
<X-PRE-PROCESS cmd="set" data="default_password=Holo@2026#FS"/>
```

Save: `Ctrl+O` → `Enter` → `Ctrl+X`

---

### Step 2 — Create SIP Gateway (CloudBharat Trunk)

```bash
nano /usr/local/freeswitch/conf/sip_profiles/external/cloudbharat_trunk.xml
```

Paste exactly:

```xml
<include>
  <gateway name="cloudbharat_trunk">
    <param name="username" value="dsip914226628808"/>
    <param name="password" value="GwD1QykrdSe4AycQHk3Kkezk8"/>
    <param name="proxy" value="siptrunk.cloudbharat.in"/>
    <param name="register" value="true"/>
    <param name="expire-seconds" value="60"/>
    <param name="ping" value="25"/>
    <param name="from-user" value="dsip914226628808"/>
    <param name="from-domain" value="siptrunk.cloudbharat.in"/>
    <param name="caller-id-in-from" value="false"/>
    <param name="contact-params" value="transport=udp"/>
    <param name="context" value="public"/>
  </gateway>
</include>
```

Save and exit.

---

### Step 3 — Restart FreeSWITCH & Verify Gateway

```bash
systemctl restart freeswitch
sleep 8
/usr/local/freeswitch/bin/fs_cli -x "sofia status gateway cloudbharat_trunk"
```

**Expected:**
```
State:    REGED
```

**If NOREG or FAILED — debug:**
```bash
tail -50 /usr/local/freeswitch/log/freeswitch.log | grep -i "cloudbharat\|REGED\|NOREG\|failed\|403\|401"
```

Common causes:
- Wrong credentials → recheck xml file
- Port 5080 blocked → `ufw allow 5080/udp && ufw allow 5080/tcp`
- DNS not resolving → `nslookup siptrunk.cloudbharat.in`

---

### Step 4 — Create SIP Users (Agents)

```bash
nano /usr/local/freeswitch/conf/directory/default/1001.xml
```

Paste:

```xml
<include>
  <user id="1001">
    <params>
      <param name="password" value="Agent1@Holo"/>
      <param name="vm-password" value="1001"/>
    </params>
    <variables>
      <variable name="toll_allow" value="domestic,international,local"/>
      <variable name="accountcode" value="1001"/>
      <variable name="user_context" value="default"/>
      <variable name="effective_caller_id_name" value="Agent 1"/>
      <variable name="effective_caller_id_number" value="914226628808"/>
    </variables>
  </user>
</include>
```

Create second agent:

```bash
nano /usr/local/freeswitch/conf/directory/default/1002.xml
```

```xml
<include>
  <user id="1002">
    <params>
      <param name="password" value="Agent2@Holo"/>
      <param name="vm-password" value="1002"/>
    </params>
    <variables>
      <variable name="toll_allow" value="domestic,international,local"/>
      <variable name="accountcode" value="1002"/>
      <variable name="user_context" value="default"/>
      <variable name="effective_caller_id_name" value="Agent 2"/>
      <variable name="effective_caller_id_number" value="914226628808"/>
    </variables>
  </user>
</include>
```

Reload:

```bash
/usr/local/freeswitch/bin/fs_cli -x "reloadxml"
```

---

### Step 5 — Configure Inbound DID Routing

When someone calls `914226628808`, route it to extension `1001`.

```bash
nano /usr/local/freeswitch/conf/dialplan/public/inbound_did.xml
```

Paste:

```xml
<include>
  <extension name="inbound_did_914226628808">
    <condition field="destination_number" expression="^\+?914226628808$">
      <action application="answer"/>
      <action application="set" data="RECORD_STEREO=true"/>
      <action application="set" data="recording_follow_transfer=true"/>
      <action application="record_session" data="/usr/local/freeswitch/recordings/${uuid}.wav"/>
      <action application="transfer" data="1001 XML default"/>
    </condition>
  </extension>
</include>
```

Reload:

```bash
/usr/local/freeswitch/bin/fs_cli -x "reloadxml"
```

---

### Step 6 — Configure Outbound Dialplan

```bash
nano /usr/local/freeswitch/conf/dialplan/default/outbound_pstn.xml
```

Paste:

```xml
<include>
  <extension name="outbound_pstn">
    <condition field="destination_number" expression="^(\+?91[0-9]{10})$">
      <action application="set" data="effective_caller_id_number=914226628808"/>
      <action application="set" data="effective_caller_id_name=WorkHolo"/>
      <action application="set" data="RECORD_STEREO=true"/>
      <action application="record_session" data="/usr/local/freeswitch/recordings/${uuid}.wav"/>
      <action application="bridge" data="sofia/gateway/cloudbharat_trunk/$1"/>
    </condition>
  </extension>
</include>
```

Reload:

```bash
/usr/local/freeswitch/bin/fs_cli -x "reloadxml"
```

---

### Step 7 — Create Recordings Directory

```bash
mkdir -p /usr/local/freeswitch/recordings
chown -R freeswitch:freeswitch /usr/local/freeswitch/recordings
chmod 755 /usr/local/freeswitch/recordings
```

---

### Step 8 — Test Outbound Call via fs_cli

```bash
/usr/local/freeswitch/bin/fs_cli -x "originate sofia/gateway/cloudbharat_trunk/+91XXXXXXXXXX &echo"
```

Replace `XXXXXXXXXX` with a real Indian mobile number.

**Expected:** Your phone rings. When you answer, you hear an echo of your voice → trunk is working.

**If call fails — debug:**
```bash
tail -100 /usr/local/freeswitch/log/freeswitch.log | grep -i "originate\|FAILED\|403\|404\|488"
```

---

### Step 9 — Register Zoiper (Test Agent)

Install **Zoiper5** on your phone or laptop.

Settings:
- **Account type:** SIP
- **Username:** `1001`
- **Password:** `Agent1@Holo`
- **Domain:** `135.181.31.20`
- **Port:** `5060`
- **Transport:** UDP

After saving, Zoiper should show **Registered**.

Verify:
```bash
/usr/local/freeswitch/bin/fs_cli -x "show registrations"
```

You should see `1001@135.181.31.20`.

---

### Step 10 — Test Full End-to-End Call

**Outbound (Agent → PSTN):**
From Zoiper, dial: `+91XXXXXXXXXX`
→ Should ring the real mobile number via CloudBharat trunk

**Inbound (PSTN → Agent):**
Call `914226628808` from any phone
→ Should ring Zoiper (extension 1001)

**After call — check recording:**
```bash
ls -la /usr/local/freeswitch/recordings/
```

---

### Phase 1 Validation Checklist

Run all of these before moving to Phase 2:

```bash
# 1. FreeSWITCH running?
systemctl status freeswitch | grep Active

# 2. Both SIP profiles running?
/usr/local/freeswitch/bin/fs_cli -x "sofia status"

# 3. Gateway REGED?
/usr/local/freeswitch/bin/fs_cli -x "sofia status gateway cloudbharat_trunk"

# 4. Agent registered?
/usr/local/freeswitch/bin/fs_cli -x "show registrations"

# 5. Active calls (during test)?
/usr/local/freeswitch/bin/fs_cli -x "show calls"

# 6. Recording file exists after test call?
ls /usr/local/freeswitch/recordings/
```

All green → move to Phase 2.

---

---

## PART 2 — Platform Integration (Phase 2)

> Goal: Work-Holo backend controls FreeSWITCH. Calls triggered from API.

---

### Architecture

```
React UI
  ↓ click-to-call
Hono API (oRPC)  →  packages/api/src/routers/dialer/
  ↓ publish job
RabbitMQ  →  queue: dialer.call.request
  ↓ consume
SIP Worker  →  apps/sip-worker/
  ↓ ESL command
FreeSWITCH  →  135.181.31.20:8021
  ↓
CloudBharat SIP Trunk
  ↓
PSTN
```

---

### Step 1 — Enable ESL on FreeSWITCH

The Event Socket Layer (ESL) allows our app to control FreeSWITCH.

```bash
nano /usr/local/freeswitch/conf/autoload_configs/event_socket.conf.xml
```

Make it look like this:

```xml
<configuration name="event_socket.conf" description="Socket Client">
  <settings>
    <param name="nat-map" value="false"/>
    <param name="listen-ip" value="0.0.0.0"/>
    <param name="listen-port" value="8021"/>
    <param name="password" value="HoloESL@2026"/>
    <param name="apply-inbound-acl" value="loopback.auto"/>
  </settings>
</configuration>
```

> **Important:** Note the password `HoloESL@2026` — this goes in your `.env`.

Restart:
```bash
systemctl restart freeswitch
```

Verify ESL is listening:
```bash
ss -tlnp | grep 8021
```

---

### Step 2 — Open ESL Port (Firewall)

ESL should only be reachable from your app server. If app server and FreeSWITCH are on the same VPS:

```bash
ufw allow from 127.0.0.1 to any port 8021
```

If separate servers:
```bash
ufw allow from <app-server-ip> to any port 8021
```

---

### Step 3 — Create SIP Worker App

In your repo, create `apps/sip-worker/`:

```
apps/sip-worker/
  ├── package.json
  ├── src/
  │   ├── index.ts          ← entry point
  │   ├── esl-client.ts     ← FreeSWITCH ESL connection
  │   ├── queue-consumer.ts ← RabbitMQ consumer
  │   └── call-events.ts    ← event normalizer + publisher
```

**`apps/sip-worker/package.json`:**

```json
{
  "name": "@work-holo/sip-worker",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "bun run --watch src/index.ts",
    "start": "bun run src/index.ts"
  },
  "dependencies": {
    "modesl": "^1.1.0",
    "amqplib": "^0.10.4"
  },
  "devDependencies": {
    "@types/amqplib": "^0.10.5",
    "bun-types": "latest"
  }
}
```

**`apps/sip-worker/src/esl-client.ts`:**

```typescript
import ESL from "modesl"

const ESL_HOST = process.env.FS_ESL_HOST ?? "127.0.0.1"
const ESL_PORT = Number(process.env.FS_ESL_PORT ?? 8021)
const ESL_PASSWORD = process.env.FS_ESL_PASSWORD ?? "HoloESL@2026"

let connection: ESL.Connection | null = null

export function connectESL(): Promise<ESL.Connection> {
  return new Promise((resolve, reject) => {
    const conn = new ESL.Connection(ESL_HOST, ESL_PORT, ESL_PASSWORD, () => {
      console.log("[ESL] Connected to FreeSWITCH")
      conn.events("json", "ALL")
      connection = conn
      resolve(conn)
    })

    conn.on("error", (err: Error) => {
      console.error("[ESL] Connection error:", err.message)
      reject(err)
    })
  })
}

export function getESL(): ESL.Connection {
  if (!connection) throw new Error("ESL not connected")
  return connection
}

export async function originateCall(
  phoneNumber: string,
  agentExtension: string,
  callId: string
): Promise<string> {
  const conn = getESL()
  const dialString = `sofia/gateway/cloudbharat_trunk/${phoneNumber}`
  const endpoint = `user/${agentExtension}@135.181.31.20`

  return new Promise((resolve, reject) => {
    conn.bgapi(
      `originate {origination_uuid=${callId},origination_caller_id_number=914226628808}${dialString} ${endpoint}`,
      (res: ESL.ESLevent) => {
        const body = res.getBody()
        if (body.startsWith("+OK")) {
          resolve(body.replace("+OK ", "").trim())
        } else {
          reject(new Error(`Originate failed: ${body}`))
        }
      }
    )
  })
}

export async function hangupCall(uuid: string): Promise<void> {
  const conn = getESL()
  conn.api(`uuid_kill ${uuid}`)
}
```

**`apps/sip-worker/src/call-events.ts`:**

```typescript
import type ESL from "modesl"

export type CallEvent = {
  type: "CHANNEL_CREATE" | "CHANNEL_ANSWER" | "CHANNEL_HANGUP"
  uuid: string
  direction: string
  callerNumber: string
  calleeNumber: string
  timestamp: string
}

export function normalizeEvent(event: ESL.ESLevent): CallEvent | null {
  const name = event.getHeader("Event-Name")
  const uuid = event.getHeader("Unique-ID") ?? ""
  const direction = event.getHeader("Call-Direction") ?? ""
  const callerNumber = event.getHeader("Caller-Caller-ID-Number") ?? ""
  const calleeNumber = event.getHeader("Caller-Destination-Number") ?? ""

  if (!["CHANNEL_CREATE", "CHANNEL_ANSWER", "CHANNEL_HANGUP"].includes(name ?? "")) {
    return null
  }

  return {
    type: name as CallEvent["type"],
    uuid,
    direction,
    callerNumber,
    calleeNumber,
    timestamp: new Date().toISOString(),
  }
}
```

**`apps/sip-worker/src/queue-consumer.ts`:**

```typescript
import amqplib from "amqplib"
import { originateCall, hangupCall } from "./esl-client"

const RABBITMQ_URL = process.env.RABBITMQ_URL ?? "amqp://localhost"
const CALL_REQUEST_QUEUE = "dialer.call.request"
const CALL_HANGUP_QUEUE = "dialer.call.hangup"

export type CallRequestJob = {
  callId: string
  phoneNumber: string
  agentExtension: string
}

export type HangupJob = {
  uuid: string
}

export async function startQueueConsumer() {
  const conn = await amqplib.connect(RABBITMQ_URL)
  const channel = await conn.createChannel()

  await channel.assertQueue(CALL_REQUEST_QUEUE, { durable: true })
  await channel.assertQueue(CALL_HANGUP_QUEUE, { durable: true })

  channel.prefetch(1)

  console.log("[Queue] Consuming dialer.call.request")

  channel.consume(CALL_REQUEST_QUEUE, async (msg) => {
    if (!msg) return
    const job = JSON.parse(msg.content.toString()) as CallRequestJob
    console.log(`[Queue] Call request: ${job.callId} → ${job.phoneNumber}`)

    try {
      const uuid = await originateCall(job.phoneNumber, job.agentExtension, job.callId)
      console.log(`[Queue] Originate success: ${uuid}`)
      channel.ack(msg)
    } catch (err) {
      console.error("[Queue] Originate failed:", err)
      channel.nack(msg, false, false) // dead letter
    }
  })

  channel.consume(CALL_HANGUP_QUEUE, async (msg) => {
    if (!msg) return
    const job = JSON.parse(msg.content.toString()) as HangupJob
    await hangupCall(job.uuid)
    channel.ack(msg)
  })
}
```

**`apps/sip-worker/src/index.ts`:**

```typescript
import { connectESL, getESL } from "./esl-client"
import { startQueueConsumer } from "./queue-consumer"
import { normalizeEvent } from "./call-events"

async function main() {
  console.log("[SipWorker] Starting...")

  // Connect to FreeSWITCH ESL
  const conn = await connectESL()

  // Subscribe to call events
  conn.on("esl::event::CHANNEL_CREATE::*", (event) => {
    const normalized = normalizeEvent(event)
    if (normalized) console.log("[Event]", JSON.stringify(normalized))
    // TODO: publish to Soketi + write to DB
  })

  conn.on("esl::event::CHANNEL_ANSWER::*", (event) => {
    const normalized = normalizeEvent(event)
    if (normalized) console.log("[Event]", JSON.stringify(normalized))
  })

  conn.on("esl::event::CHANNEL_HANGUP::*", (event) => {
    const normalized = normalizeEvent(event)
    if (normalized) console.log("[Event]", JSON.stringify(normalized))
  })

  // Start RabbitMQ consumer
  await startQueueConsumer()

  console.log("[SipWorker] Ready")
}

main().catch((err) => {
  console.error("[SipWorker] Fatal:", err)
  process.exit(1)
})
```

---

### Step 4 — Add DB Schema (calls + call_events)

In `packages/db/src/schema/`, create `dialer.ts`:

```typescript
import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core"
import { createId } from "@paralleldrive/cuid2"

export const calls = pgTable("calls", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  organizationId: text("organization_id").notNull(),
  agentId: text("agent_id").notNull(),
  agentExtension: text("agent_extension").notNull(),
  phoneNumber: text("phone_number").notNull(),
  direction: text("direction", { enum: ["inbound", "outbound"] }).notNull(),
  status: text("status", {
    enum: ["initiated", "ringing", "answered", "ended", "failed"],
  })
    .notNull()
    .default("initiated"),
  fsUuid: text("fs_uuid"),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  answeredAt: timestamp("answered_at"),
  endedAt: timestamp("ended_at"),
  durationSeconds: integer("duration_seconds"),
  recordingUrl: text("recording_url"),
  disposition: text("disposition"),
})

export const callEvents = pgTable("call_events", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  callId: text("call_id")
    .notNull()
    .references(() => calls.id),
  eventType: text("event_type").notNull(),
  fsUuid: text("fs_uuid"),
  data: text("data"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})
```

Add to `packages/db/src/schema/index.ts`:

```typescript
export * from "./dialer"
```

Run migration:

```bash
bun run db:generate
bun run db:migrate
```

---

### Step 5 — Add Dialer API Router

Create `packages/api/src/routers/dialer/index.ts`:

```typescript
import { z } from "zod"
import { router, protectedProcedure } from "../../procedures/base"
import { db } from "@work-holo/db"
import { calls } from "@work-holo/db/schema"
import { createId } from "@paralleldrive/cuid2"
import amqplib from "amqplib"

const RABBITMQ_URL = process.env.RABBITMQ_URL ?? "amqp://localhost"
const CALL_REQUEST_QUEUE = "dialer.call.request"
const CALL_HANGUP_QUEUE = "dialer.call.hangup"

async function publishToQueue(queue: string, payload: unknown) {
  const conn = await amqplib.connect(RABBITMQ_URL)
  const channel = await conn.createChannel()
  await channel.assertQueue(queue, { durable: true })
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), {
    persistent: true,
  })
  await channel.close()
  await conn.close()
}

export const dialerRouter = router({
  startCall: protectedProcedure
    .input(
      z.object({
        phoneNumber: z.string().min(10),
        agentExtension: z.string().default("1001"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const callId = createId()

      // Save to DB
      await db.insert(calls).values({
        id: callId,
        organizationId: ctx.session.user.activeOrganizationId ?? "",
        agentId: ctx.session.user.id,
        agentExtension: input.agentExtension,
        phoneNumber: input.phoneNumber,
        direction: "outbound",
        status: "initiated",
      })

      // Publish to RabbitMQ → SIP Worker → FreeSWITCH
      await publishToQueue(CALL_REQUEST_QUEUE, {
        callId,
        phoneNumber: input.phoneNumber,
        agentExtension: input.agentExtension,
      })

      return { callId, status: "initiated" }
    }),

  hangupCall: protectedProcedure
    .input(z.object({ uuid: z.string() }))
    .mutation(async ({ input }) => {
      await publishToQueue(CALL_HANGUP_QUEUE, { uuid: input.uuid })
      return { success: true }
    }),

  getCallHistory: protectedProcedure
    .input(z.object({ limit: z.number().default(20) }))
    .query(async ({ ctx }) => {
      return db.query.calls.findMany({
        where: (calls, { eq }) =>
          eq(calls.organizationId, ctx.session.user.activeOrganizationId ?? ""),
        orderBy: (calls, { desc }) => [desc(calls.startedAt)],
        limit: 20,
      })
    }),
})
```

Register in `packages/api/src/routers/index.ts`:

```typescript
import { dialerRouter } from "./dialer"

export const appRouter = router({
  // ... existing routers
  dialer: dialerRouter,
})
```

---

### Step 6 — Environment Variables

Add to your `.env`:

```env
# FreeSWITCH ESL
FS_ESL_HOST=135.181.31.20
FS_ESL_PORT=8021
FS_ESL_PASSWORD=HoloESL@2026

# RabbitMQ
RABBITMQ_URL=amqp://localhost:5672
```

---

### Step 7 — Run SIP Worker

```bash
# From repo root
bun run --filter @work-holo/sip-worker dev
```

You should see:
```
[SipWorker] Starting...
[ESL] Connected to FreeSWITCH
[Queue] Consuming dialer.call.request
[SipWorker] Ready
```

---

### Step 8 — Test Full API-Triggered Call

```bash
# From your API (Hono server running), trigger a call:
curl -X POST http://localhost:3000/api/dialer/startCall \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+91XXXXXXXXXX", "agentExtension": "1001"}'
```

**Flow:**
```
API → DB (status: initiated) → RabbitMQ → SIP Worker → FreeSWITCH → CloudBharat → PSTN → Phone rings
```

---

### Phase 2 Validation Checklist

```bash
# 1. ESL port open?
ss -tlnp | grep 8021

# 2. SIP Worker connected?
# Check worker logs for "[ESL] Connected to FreeSWITCH"

# 3. RabbitMQ queues exist?
# Open RabbitMQ management UI or:
rabbitmqctl list_queues

# 4. Call record in DB after API call?
# Check calls table in your DB studio:
bun run db:studio

# 5. Call events logged by worker?
# Check worker console output
```

---

## PART 3 — What Comes Next (Phase 3+)

Once Phase 2 is validated:

| What | Where |
|------|-------|
| Leads table + import | `packages/db/src/schema/leads.ts` |
| Campaigns table | `packages/db/src/schema/campaigns.ts` |
| Click-to-call UI button | `apps/web/src/components/dialer/` |
| Active call widget | `apps/web/src/components/dialer/ActiveCall.tsx` |
| Disposition modal | `apps/web/src/components/dialer/DispositionModal.tsx` |
| Real-time call events (Soketi) | SIP Worker → Soketi publish on CHANNEL_ANSWER/HANGUP |
| Redis agent state | `ready / on-call / break / offline` |
| Progressive dialer | Background job: pick lead → publish call request |

---

## Quick Reference — VPS Commands

```bash
# Check FreeSWITCH status
systemctl status freeswitch

# Restart FreeSWITCH
systemctl restart freeswitch

# Enter fs_cli
/usr/local/freeswitch/bin/fs_cli

# Check gateway
/usr/local/freeswitch/bin/fs_cli -x "sofia status gateway cloudbharat_trunk"

# Check registrations
/usr/local/freeswitch/bin/fs_cli -x "show registrations"

# Make test call
/usr/local/freeswitch/bin/fs_cli -x "originate sofia/gateway/cloudbharat_trunk/+91XXXXXXXXXX &echo"

# Reload config
/usr/local/freeswitch/bin/fs_cli -x "reloadxml"

# Reload external SIP profile (after gateway changes)
/usr/local/freeswitch/bin/fs_cli -x "sofia profile external rescan"

# Watch live logs
tail -f /usr/local/freeswitch/log/freeswitch.log

# Check recordings
ls -lh /usr/local/freeswitch/recordings/
```

---

## Progress Tracker

> Update this as you complete each step. Last updated: 2026-03-27

---

### Pre-requisites — Infrastructure

| Task | Status | Notes |
|------|--------|-------|
| VPS provisioned (Hetzner 4GB) | ✅ Done | `135.181.31.20` |
| Static public IP assigned | ✅ Done | `135.181.31.20` |
| FreeSWITCH installed (source build) | ✅ Done | `/usr/local/freeswitch/` |
| FreeSWITCH service running | ✅ Done | Uptime confirmed, `active (running)` |
| `fs_cli` accessible | ✅ Done | Prompt working |
| SIP profiles running (`internal` + `external`) | ✅ Done | Both `RUNNING` on 5060 / 5080 |
| Public IP set in `vars.xml` (`external_rtp_ip`, `external_sip_ip`) | ✅ Done | `135.181.31.20` |
| SIP trunk credentials obtained (CloudBharat) | ✅ Done | DID `914226628808`, expires 06/04/2026 |

---

### Phase 1 — VPS / FreeSWITCH

| Step | Task | Status | Notes |
|------|------|--------|-------|
| 1 | Fix default password in `vars.xml` | ✅ Done | Changed from `1234` to strong password |
| 2 | Create CloudBharat gateway config file | ✅ Done | `/conf/sip_profiles/external/cloudbharat_trunk.xml` |
| 3 | Gateway shows `REGED` state | ✅ Done | CloudBharat whitelisted `135.181.31.20` |
| 4 | Create SIP users `1001` + `1002` | ✅ Done | With outbound caller ID set to `914226628808` |
| 5 | Inbound DID routing configured | ✅ Done | `914226628808` → extension 1001 |
| 6 | Outbound dialplan configured | ✅ Done | `/conf/dialplan/default/outbound_pstn.xml` |
| 7 | Recordings directory created | ✅ Done | `/usr/local/freeswitch/recordings/` (owned by root) |
| 8 | Test outbound call via `fs_cli originate` | ✅ Done | 200 OK + ACTIVE confirmed in logs |
| 9 | Zoiper registered as `1001` | ✅ Done | Registered successfully |
| 10 | Full end-to-end call working + recording saved | ✅ Done | Audio working after enabling aggressive-nat-detection |

**Phase 1 Progress: 10 / 10 ✅ COMPLETE**

---

### Phase 2 — Platform Integration

| Step | Task | Status | Notes |
|------|------|--------|-------|
| 1 | ESL enabled + port 8021 open | ⬜ Todo | `event_socket.conf.xml` |
| 2 | `apps/sip-worker/` created | ⬜ Todo | ESL + queue consumer skeleton |
| 3 | SIP Worker connects to FreeSWITCH ESL | ⬜ Todo | Logs: `[ESL] Connected` |
| 4 | RabbitMQ queues created | ⬜ Todo | `dialer.call.request` + `dialer.call.hangup` |
| 5 | DB schema — `calls` + `callEvents` | ⬜ Todo | `packages/db/src/schema/dialer.ts` |
| 6 | Migration run | ⬜ Todo | `bun run db:migrate` |
| 7 | Dialer API router created | ⬜ Todo | `packages/api/src/routers/dialer/` |
| 8 | API call triggers FreeSWITCH originate | ⬜ Todo | Full flow working |

**Phase 2 Progress: 0 / 8**

---

### Phase 3 — Sales Dialer MVP

| Step | Task | Status | Notes |
|------|------|--------|-------|
| 1 | Leads DB schema + import | ⬜ Todo | |
| 2 | Campaigns DB schema | ⬜ Todo | |
| 3 | Agent state engine (Redis) | ⬜ Todo | ready / on-call / break / offline |
| 4 | Click-to-call UI button | ⬜ Todo | |
| 5 | Active call widget (timer + status) | ⬜ Todo | |
| 6 | Disposition modal after call | ⬜ Todo | |
| 7 | Real-time events via Soketi | ⬜ Todo | call.ringing / call.connected / call.ended |
| 8 | Basic call history / reporting | ⬜ Todo | |

**Phase 3 Progress: 0 / 8**

---

> **Legend:** ✅ Done · 🔄 In Progress · ⬜ Todo · ❌ Blocked
