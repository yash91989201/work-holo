# Work‑Holo Dialer System — Complete Implementation Plan

---

## 1. Objective

Build a scalable, multi‑tenant Dialer System inside Work‑Holo enabling agents to make and receive real PSTN calls using SIP trunks and DID numbers. Agents will use WebRTC (browser/mobile) while FreeSWITCH handles SIP/PSTN bridging.

---

## 2. Target Capabilities

### Phase‑Aligned Feature Set

| Phase                           | Features                                                                                       |
| ------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Core Telephony (Foundation)** | Outbound PSTN calls, Inbound DID routing, Call recording, Agent registration                   |
| **Sales Dialer (MVP)**          | Click‑to‑call, Lead queue, Agent states (ready/break/offline), Call logs, Dispositions         |
| **Automation & Scaling**        | Progressive dialing, Retry rules, Rate limiting, Campaign scheduling                           |
| **Advanced Contact Center**     | Predictive dialer, Supervisor dashboard, Live monitoring / whisper / barge, Advanced analytics |

---

## 3. High‑Level Architecture

```
Frontend (React Web / Native)
        ↓
Hono API (oRPC)
        ↓
Dialer Service Layer
 ┌──────┼──────────┐
 ↓      ↓          ↓
DB   RabbitMQ   Redis/DF
        ↓
SIP Worker (ESL Controller)
        ↓
FreeSWITCH
        ↓
SIP Trunk Provider
        ↓
PSTN
```

---

## 4. Components to Introduce

### 4.1 FreeSWITCH (Telephony Core)

- SIP trunk connectivity
- DID routing
- Media handling
- Recording
- Call bridging

### 4.2 SIP Worker (Critical Service)

- Persistent ESL connection
- Originate / hangup / transfer commands
- RabbitMQ queue consumption
- Event streaming → Soketi

### 4.3 Dialer Module (App Layer)

- Lead selection
- Campaign logic
- Retry strategies
- Compliance enforcement

---

## 5. Database Changes (Drizzle Schema)

### New Tables

`leads` · `campaigns` · `campaignLeads` · `calls` · `callEvents` · `dispositions` · `didNumbers` · `sipTrunks` · `agentStatus` · `dncList`

### Key Fields

**leads**

```
id            (CUID2)
organizationId
name
phoneNumber
status
```

**calls**

```
id
organizationId
agentId
leadId
direction
status
startedAt
endedAt
recordingUrl
```

---

## 6. Backend Changes (Hono / oRPC)

### New Routers

```
dialer/
  ├── startCall
  ├── hangupCall
  ├── transferCall
  ├── setAgentState
  ├── fetchLeads
  └── submitDisposition
```

### API Flow

```
startCall → enqueue RabbitMQ → SIP Worker → FreeSWITCH originate
```

---

## 7. SIP Worker Design

**Responsibilities**

- Maintain ESL socket
- Consume queues
- Publish call events

**Events Captured**

- `CHANNEL_CREATE`
- `CHANNEL_ANSWER`
- `CHANNEL_HANGUP`

---

## 8. Frontend Changes (React)

### New UI Areas

- Dialer panel
- Active call widget
- Lead preview card
- Disposition modal

### Real‑Time Updates (Soketi events)

- `call.ringing`
- `call.connected`
- `call.ended`

---

## 9. Infrastructure Additions

### Required Services

- FreeSWITCH container/VM
- coturn (STUN/TURN)
- Recording storage bucket

### Ports

| Port        | Protocol | Purpose      |
| ----------- | -------- | ------------ |
| 5060 / 5080 | UDP/TCP  | SIP          |
| 7443        | TCP      | WSS (WebRTC) |
| 16384–32768 | UDP      | RTP Media    |

---

## 10. Compliance Layer

- DNC filtering
- Call window restrictions
- Recording consent logic

---

## 11. Scaling Strategy

| Stage                     | Description                                         |
| ------------------------- | --------------------------------------------------- |
| **Stage 1 — Single Node** | FreeSWITCH standalone, Single SIP Worker            |
| **Stage 2 — Growth**      | Dedicated SIP Worker pool, Redis call locks         |
| **Stage 3 — High Scale**  | FreeSWITCH cluster, Kamailio SIP proxy, HA RabbitMQ |

---

## 12. Delivery Roadmap

---

## ✅ Phase 1 — Core Telephony Foundation _(Weeks 1–3)_

### 🎯 Objective

Establish a stable telephony backbone capable of making and receiving real PSTN calls.

---

### 🧱 Step 1 — Infrastructure Preparation

**Tasks**

- Provision VPS / server (minimum 4 vCPU, 8 GB RAM recommended)
- Assign static public IP
- Configure firewall rules

**Ports to Open**

- `5060 / 5080` — SIP
- `7443` — WSS for WebRTC
- `16384–32768 UDP` — RTP media range

**✅ Deliverable:** Reachable FreeSWITCH server

---

### 🧱 Step 2 — Install & Verify FreeSWITCH

**Tasks**

- Install FreeSWITCH packages
- Start service
- Access `fs_cli`

**Validation**

- `fs_cli` connects successfully
- Sofia profiles running

**✅ Deliverable:** Operational FreeSWITCH instance

---

### 🧱 Step 3 — SIP Trunk Provisioning

**Tasks**

- Purchase SIP trunk
- Obtain credentials (username/password or IP auth)
- Configure gateway in FreeSWITCH

**Validation**

- Gateway registers (`REGED` state)
- Test outbound call via CLI `originate`

**✅ Deliverable:** Active PSTN connectivity

---

### 🧱 Step 4 — DID Number Setup

**Tasks**

- Purchase DID number(s)
- Map DID → FreeSWITCH
- Configure inbound dialplan

**Validation**

- Inbound PSTN call rings extension

**✅ Deliverable:** Working inbound routing

---

### 🧱 Step 5 — Extension / Agent Registration

**Tasks**

- Create agent SIP users (`1001`, `1002`…)
- Configure passwords

**Validation**

- Agent registers via SIP/WebRTC client

**✅ Deliverable:** Registered endpoints

---

### 🧱 Step 6 — Call Recording Pipeline

**Tasks**

- Configure `record_session` in dialplan
- Mount RustFS/S3 storage

**Validation**

- Recording file generated
- Playback successful

**✅ Deliverable:** Persistent call recordings

---

### 🧱 Step 7 — Basic Dialplan Logic

**Tasks**

- Outbound rule (prefix-based dialing)
- Inbound routing

**Validation**

- Extension → PSTN works
- PSTN → Extension works

**✅ Deliverable:** End-to-end call flow

---

### ✅ Phase 1 Success Criteria

- Outbound PSTN calls functional
- Inbound DID routing functional
- Agents register successfully
- Calls recorded & stored
- No NAT/audio issues

### ⚠️ Phase 1 Risks & Mitigations

| Risk                      | Mitigation                              |
| ------------------------- | --------------------------------------- |
| NAT / one-way audio       | Deploy coturn early                     |
| SIP trunk not registering | Verify firewall / credentials / IP auth |
| Codec mismatch            | Enforce G.711 / Opus transcoding        |

### 📦 Phase 1 Output

> ✅ Telephony backbone ready for platform integration

---

## ✅ Phase 2 — Platform Integration _(Weeks 4–6)_

### 🎯 Objective

Connect Work‑Holo backend and real‑time systems with FreeSWITCH to enable application‑controlled call handling.

---

### 🧱 Step 1 — SIP Worker Service Creation

**Tasks**

- Create new service: `apps/server/dialer-worker` or separate Bun worker
- Install ESL client (`modesl` or equivalent)
- Implement persistent FreeSWITCH ESL connection

**Validation**

- Worker connects to FreeSWITCH ESL
- Auto‑reconnect works

**✅ Deliverable:** Stable call control channel

---

### 🧱 Step 2 — ESL Event Subscription

**Tasks**

- Subscribe to FreeSWITCH events: `CHANNEL_CREATE`, `CHANNEL_ANSWER`, `CHANNEL_HANGUP`
- Normalize events → internal event schema

**Validation**

- Events logged in worker console

**✅ Deliverable:** Real‑time call lifecycle visibility

---

### 🧱 Step 3 — RabbitMQ Queue Integration

**Tasks**

- Create queues: `dialer.call.request`, `dialer.call.retry`
- Backend publishes call jobs
- SIP Worker consumes jobs

**Validation**

- Job → Worker → FreeSWITCH originate works

**✅ Deliverable:** Async call execution pipeline

---

### 🧱 Step 4 — Backend API (oRPC Routers)

**Tasks**

- Create `dialer.router.ts`: `startCall`, `hangupCall`, `setAgentState`

**Flow**

```
API → publish RabbitMQ → SIP Worker → FreeSWITCH
```

**Validation**

- API call triggers originate

**✅ Deliverable:** App‑level call control

---

### 🧱 Step 5 — Database Persistence (Calls & Events)

**Tasks**

- Create Drizzle schema for: `calls`, `callEvents`
- SIP Worker writes lifecycle updates

**Validation**

- Calls stored correctly
- Status transitions accurate

**✅ Deliverable:** Durable call history

---

### 🧱 Step 6 — Redis / Dragonfly Call State Cache

**Tasks**

- Track: Active calls, Agent availability, Lead locks

**Validation**

- Cache reflects live states

**✅ Deliverable:** Low‑latency call state management

---

### 🧱 Step 7 — Soketi Real‑Time Event Publishing

**Tasks**

- Worker publishes: `call.ringing`, `call.connected`, `call.ended`

**Validation**

- Frontend receives events instantly

**✅ Deliverable:** Live UI updates

---

### 🧱 Step 8 — Frontend Call State UI Hooks

**Tasks**

- Add dialer event listeners
- Display call toast / widget

**Validation**

- UI updates without refresh

**✅ Deliverable:** Real‑time UX foundation

---

### ✅ Phase 2 Success Criteria

- SIP Worker stable ESL connection
- Backend APIs trigger calls
- RabbitMQ queue operational
- Calls persisted in DB
- Redis reflects live state
- Soketi events visible in UI

### ⚠️ Phase 2 Risks & Mitigations

| Risk                | Mitigation                            |
| ------------------- | ------------------------------------- |
| ESL disconnects     | Implement heartbeat + reconnect logic |
| Duplicate call jobs | Redis idempotency locks               |
| Race conditions     | Call state machine enforcement        |

### 📦 Phase 2 Output

> ✅ Work‑Holo now controls telephony

---

## ✅ Phase 3 — Sales Dialer MVP _(Weeks 7–10)_

### 🎯 Objective

Deliver a usable dialer experience for agents to call leads from Work‑Holo.

---

### 🧱 Step 1 — Leads Management Schema

**Tasks**

- Create tables: `leads`, `leadLists`, `leadAssignments`
- Fields: `name`, `phoneNumber`, `status`, `lastCallAt`

**✅ Deliverable:** Lead database ready

---

### 🧱 Step 2 — Campaign Basics

**Tasks**

- Create tables: `campaigns`, `campaignLeads`
- Link leads → campaigns

**✅ Deliverable:** Campaign container logic

---

### 🧱 Step 3 — Agent State Engine

**States:** `Ready` · `On Call` · `Break` · `Offline`

- Persist in Redis + DB snapshot

**✅ Deliverable:** Agent availability control

---

### 🧱 Step 4 — Click‑to‑Call Flow

**Tasks**

- UI button → `startCall` API
- Lock lead via Redis

**✅ Deliverable:** Manual outbound calling

---

### 🧱 Step 5 — Lead Preview Panel

- Display lead info
- Show call history

**✅ Deliverable:** Agent context visibility

---

### 🧱 Step 6 — Call Logging UI

- Active call widget
- Timer
- Status indicators

**✅ Deliverable:** Real‑time call awareness

---

### 🧱 Step 7 — Disposition Capture

**Tasks**

- Modal after call end
- Store outcome: `Connected` / `No Answer` / `Callback` / `Sale`

**✅ Deliverable:** Sales workflow completion

---

### 🧱 Step 8 — Basic Reporting

- Calls per agent
- Outcomes summary

**✅ Deliverable:** MVP analytics

---

### ✅ Phase 3 Success Criteria

- Agents can click‑to‑call
- Leads rotate correctly
- Dispositions stored
- Calls logged & visible
- Multi‑tenant isolation maintained

### ⚠️ Phase 3 Risks & Mitigations

| Risk             | Mitigation                  |
| ---------------- | --------------------------- |
| Lead duplication | Redis locking & idempotency |
| Agent overload   | Agent state enforcement     |

### 📦 Phase 3 Output

> ✅ Functional sales dialer MVP

---

## ✅ Phase 4 — Smart Dialing & Automation _(Weeks 11–14)_

### 🎯 Objective

Introduce automated dialing logic, campaign intelligence, retry strategies, and performance controls to transition from manual sales dialer → scalable semi‑automated dialer.

### ✅ Feature Goals

- Progressive / Power Dialer
- Retry Rules Engine
- Rate Limiting & CPS Control
- Campaign Scheduling
- Lead Recycling Logic
- Agent Load Balancing
- Failure Handling
- Expanded Reporting

---

### 🧱 Step 1 — Progressive Dialer Engine

**Logic**

```
IF agent.state == READY → fetch eligible lead → enqueue originate
```

**Validation**

- Agent receives automatic calls
- No duplicate lead assignment

**✅ Deliverable:** Automated progressive dialing

---

### 🧱 Step 2 — Retry Rules Engine

**Retry Policies**

- No Answer → retry after X mins
- Busy → retry after Y mins
- Failed → escalate or discard

**Schema Additions:** `retryStrategy` · `retryCount` · `nextRetryAt`

**✅ Deliverable:** Intelligent call retries

---

### 🧱 Step 3 — Rate Limiting / CPS Guard

- Prevent carrier overload
- Redis token bucket / sliding window

**✅ Deliverable:** Carrier‑safe dialing

---

### 🧱 Step 4 — Campaign Scheduling System

**Rules**

- `StartTime` / `EndTime`
- `AllowedDays`
- `HolidayBlock`
- Timezone‑aware scheduling

**✅ Deliverable:** Compliance‑safe campaigns

---

### 🧱 Step 5 — Lead Recycling Logic

- Re‑queue leads based on outcome
- Prioritize callbacks / hot leads

**✅ Deliverable:** Lead lifecycle automation

---

### 🧱 Step 6 — Agent Load Balancing

- Distribute calls evenly
- Avoid agent starvation/overload

**✅ Deliverable:** Balanced dialing experience

---

### 🧱 Step 7 — Failure Handling & Resilience

- Detect originate failures
- Requeue / fallback logic
- Dead letter queues

**✅ Deliverable:** Fault‑tolerant dialing

---

### 🧱 Step 8 — Expanded Reporting

**Metrics:** Answer rate · Retry success rate · Agent utilization · Calls/hour

**✅ Deliverable:** Operational insights

---

### ✅ Phase 4 Success Criteria

- Progressive dialer stable
- Retries functioning
- CPS limits enforced
- Campaign scheduling active
- No carrier overload
- Reporting dashboards accurate

### ⚠️ Phase 4 Risks & Mitigations

| Risk            | Mitigation      |
| --------------- | --------------- |
| Over‑dialing    | CPS limiter     |
| Lead exhaustion | Recycling logic |
| Agent burnout   | Pacing rules    |

### 📦 Phase 4 Output

> ✅ Semi‑automated intelligent dialer — prepares system for Phase 5

---

## ✅ Phase 5 — Advanced Contact Center & Scaling _(Weeks 15–22)_

### 🎯 Objective

Evolve the dialer into a full contact‑center grade system with predictive dialing, supervisor controls, monitoring, and horizontal scalability.

### ✅ Feature Goals

- Predictive Dialer Engine
- Supervisor Dashboard
- Live Call Monitoring
- Whisper / Barge / Listen
- Advanced Agent Controls
- SLA & Queue Management
- High Availability Scaling
- Advanced Analytics & QA

---

### 🧱 Step 1 — Predictive Dialer Engine

**Dialing ratio calculated from:**

- Answer rate
- Agent availability
- Drop rate thresholds

**Validation**

- Calls connect without agent idle gaps
- Drop rate controlled

**✅ Deliverable:** Predictive auto‑dialer

---

### 🧱 Step 2 — Supervisor Dashboard

- Live agent status grid
- Active calls view
- Force logout / pause / ready controls

**✅ Deliverable:** Operational oversight UI

---

### 🧱 Step 3 — Live Call Monitoring

| Capability       | FreeSWITCH Command |
| ---------------- | ------------------ |
| Listen‑only      | `eavesdrop`        |
| Whisper to agent | `uuid_broadcast`   |
| Barge‑in         | `uuid_bridge`      |

**✅ Deliverable:** Real‑time supervision tools

---

### 🧱 Step 4 — Advanced Agent Controls

- Hold / Resume
- Warm transfer
- Blind transfer
- Conference merge

**✅ Deliverable:** Enterprise call handling

---

### 🧱 Step 5 — SLA & Queue Management

- Queue thresholds
- Wait time tracking
- Service level metrics

**✅ Deliverable:** Performance governance

---

### 🧱 Step 6 — High Availability & Scaling

| Stage                    | Strategy                                                                 |
| ------------------------ | ------------------------------------------------------------------------ |
| **Stage A — Vertical**   | Increase FreeSWITCH resources                                            |
| **Stage B — Horizontal** | Multiple FreeSWITCH nodes, Kamailio SIP proxy, Load‑balanced SIP Workers |
| **Stage C — HA Infra**   | RabbitMQ cluster, Redis replication                                      |

**✅ Deliverable:** Fault‑tolerant dialer infra

---

### 🧱 Step 7 — Advanced Analytics & QA

**Metrics:** Agent productivity · Conversion rates · Drop rates · Recording audits · QA scoring

**✅ Deliverable:** Contact‑center intelligence

---

### ✅ Phase 5 Success Criteria

- Predictive dialing stable
- Supervisor tools operational
- Monitoring features functional
- HA architecture validated
- Metrics reliable

### ⚠️ Phase 5 Risks & Mitigations

| Risk              | Mitigation               |
| ----------------- | ------------------------ |
| Call drops        | Conservative dial ratios |
| Scaling failures  | Staged rollout           |
| Supervisor misuse | RBAC controls            |

### 📦 Phase 5 Output

> ✅ Full contact‑center capable dialer

**🚀 System Now Supports**

- Large sales teams
- Support centers
- High‑volume campaigns
- Multi‑region expansion

---

## 13. Risks & Mitigations

| Risk                   | Mitigation                |
| ---------------------- | ------------------------- |
| NAT / Audio Issues     | Deploy coturn early       |
| Carrier Codec Mismatch | Enforce transcoding rules |
| Call Flooding          | Rate limiting & queues    |

---

## 14. Success Criteria

- Agents can place PSTN calls
- Calls recorded & logged
- Multi‑tenant isolation maintained
- Real‑time UI updates functional

---

## 15. Next Implementation Artifacts

- Drizzle schema files
- SIP Worker skeleton
- FreeSWITCH configs
- Dialer UI components
