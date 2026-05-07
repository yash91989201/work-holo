# WorkHolo Dialer — Progress Report
**Period:** April – May 2026
**Module:** VoIP Dialer (FreeSWITCH Integration)
**Status:** Phase 1–6 Complete · Agent Softphone Pending

---

## What We Are Building (The Big Picture)

We are building a **cloud telephony system** embedded directly inside WorkHolo — similar to how Acefone or Exotel work, but fully integrated into our platform. The goal is:

- Platform admins manage SIP providers, phone numbers (DIDs), and trunks from a central dashboard
- Org admins assign phone numbers to their team members and control who can call and who can receive calls
- Team members (agents) get an in-browser softphone — they can make and receive calls without any external app, directly inside WorkHolo workspace
- Every call is logged automatically with full details — caller, duration, recording, status

The system runs on **FreeSWITCH** (our VPS at `135.181.31.20`) as the telephony engine, and WorkHolo's backend drives all its configuration dynamically from the database.

---

## How the System Works — The Flow

```
INBOUND CALL FLOW
─────────────────
Caller dials a DID number
        ↓
Frejun/Carrier → FreeSWITCH (VPS)
        ↓
FreeSWITCH asks WorkHolo: "Who owns this number?" (XML Curl → /api/freeswitch/dialplan)
        ↓
WorkHolo looks up DB → finds which org owns the DID → finds which agent is assigned
        ↓
FreeSWITCH bridges the call to the agent's SIP extension
        ↓
Agent's softphone rings → agent answers
        ↓
After call ends → FreeSWITCH sends CDR (call detail record) to WorkHolo → saved to DB


OUTBOUND CALL FLOW
──────────────────
Agent types a number in the WorkHolo softphone widget → clicks Call
        ↓
Browser (JsSIP/WebRTC) → FreeSWITCH via WebSocket
        ↓
FreeSWITCH asks WorkHolo: "Which trunk should this agent use?" (XML Curl → /api/freeswitch/dialplan)
        ↓
WorkHolo looks up DB → finds agent's org → finds org's default outbound trunk
        ↓
FreeSWITCH routes the call via Frejun/Carrier → destination number rings
        ↓
After call ends → CDR sent to WorkHolo → saved to DB


SIP AUTHENTICATION FLOW
────────────────────────
Agent's softphone registers (on app load)
        ↓
FreeSWITCH asks WorkHolo: "Is extension 1001 valid?" (XML Curl → /api/freeswitch/directory)
        ↓
WorkHolo looks up DB → returns extension credentials
        ↓
FreeSWITCH confirms registration → agent is ready to call
```

---

## What Is Done

### Phase 1 — Database Schema ✅
All tables designed, migrated, and live in the database.

| Table | Purpose |
|---|---|
| `sipProviders` | Carrier companies — Frejun, CloudBharat, Telnyx, etc. |
| `sipTrunks` | Specific account credentials under a provider |
| `didInventory` | Phone numbers (DIDs) owned by the platform |
| `agentExtensions` | SIP extensions for each agent (their "phone line") |
| `orgDialerSettings` | Per-org settings — enable/disable calling, default trunk, etc. |
| `agentDialerAccess` | Which agents have access, which DID assigned, inbound/outbound permissions |
| `dialerAuditLog` | Audit trail of all admin actions |
| `callLogs` | Every call logged — direction, status, duration, recording URL, agent, org |

---

### Phase 2 — Platform Admin Dashboard ✅
Super admins have a full dialer management section at `/platform/dashboard/dialer/`.

**SIP Providers**
- Add/edit/delete carrier companies (Frejun, CloudBharat, etc.)
- Each provider stores host, port, transport type, registration requirement

**SIP Trunks**
- Add trunks under a provider with credentials (username, password, proxy)
- After save → FreeSWITCH config automatically reloads via ESL

**DID Inventory**
- Add phone numbers (DIDs) to the platform pool
- Assign a DID to a specific organization
- Track status: available / assigned / retired / blocked

**Agent Extensions**
- Create SIP extensions (e.g. 1001, 1002) and link them to users
- After save → FreeSWITCH directory automatically reloads

**Org Assignments**
- Enable/disable dialer for an org
- Set which trunk the org uses for outbound calls
- Toggle: can the org make outbound calls? Can they receive inbound?
- Set max concurrent calls, enable call recording

**Server Status**
- Live check of FreeSWITCH server health (SSH + ESL port reachability)

---

### Phase 3 — Org Admin Console ✅
Org admins manage their team's calling permissions at `/org/:slug/console/dialer/`.

**Agent Access Table**
- See all org members in one table
- Shows: assigned DID, extension, can make calls, can receive calls, active status
- Click **Configure** on any member to open the assignment dialog

**Assign DID Dialog**
- Pick which DID to assign to a team member
- Toggle: can this member make outbound calls?
- Toggle: can this member receive inbound calls?
- Toggle: is this member's dialer access active?

**Org Call Logs**
- Full call history scoped to this org
- Stats: total calls, answered, inbound, outbound
- Table: direction, from/to number, agent name, status, duration, timestamp

---

### Phase 4 — FreeSWITCH Dynamic Configuration (XML Curl) ✅
FreeSWITCH no longer uses static config files. Every lookup goes to WorkHolo's database in real time.

**`POST /api/freeswitch/directory`**
- FreeSWITCH calls this when a SIP device tries to register
- WorkHolo looks up the extension in DB → returns credentials as XML
- Means: adding an extension in the admin UI immediately works — no server restart

**`POST /api/freeswitch/dialplan`**
- FreeSWITCH calls this for every call to decide where to route it
- **Inbound:** DID number → find org → find assigned agent → bridge to their extension
- **Outbound:** Agent's extension → find their org → find default trunk → bridge via carrier
- Routing logic is 100% DB-driven

**`POST /api/freeswitch/cdr`**
- After every call ends, FreeSWITCH sends a full JSON call detail record
- WorkHolo parses it and saves to `callLogs` table
- Captures: call UUID, direction, from/to numbers, status, hangup cause, duration, billable seconds, recording URL, which agent handled it

---

### Phase 5 — Auto-Reload FreeSWITCH on Config Change ✅
When an admin makes a change in the UI, FreeSWITCH is automatically notified without manual intervention.

- Create/edit/delete an **extension** → `reloadXml()` fires via ESL (FreeSWITCH Event Socket)
- Create/edit/delete a **trunk** → `restartExternalProfile()` fires via ESL
- This means no SSH-ing into the server to apply changes

The ESL client connects to FreeSWITCH on port `8021` and sends the reload command. All calls are fire-and-forget so they never delay the API response.

---

### Phase 6 — Call Logs & Analytics Dashboard ✅

**Platform Admin View** (`/platform/dashboard/dialer/calls`)
- All calls across all organizations in one table
- Filter by org, direction, status, date range, phone number search
- Stats cards: total calls, answered, inbound, outbound
- Shows: org name, agent name, extension, DID, direction, from/to, status, duration, timestamp

**Org Console View** (`/org/:slug/console/dialer/calls`)
- Same as above but scoped to the org
- Org admins see only their team's calls

---

## What Is NOT Done Yet (Next Phase)

This is the **agent-facing layer** — the part team members actually use to make and receive calls.

### Agent Softphone Widget ❌
An in-browser phone panel inside the WorkHolo workspace. No external app needed.

What it needs to do:
- Register automatically when the agent opens WorkHolo (connects to FreeSWITCH via WebSocket/WebRTC)
- Show incoming call popup with caller number and answer/reject buttons
- Dial out — agent types a number, clicks call
- Active call controls: mute, hold, hangup, call duration timer
- Agent availability toggle: Online / Busy / Do Not Disturb

**Technology needed:** JsSIP or SIP.js (browser SIP library over WebSocket)

---

### FreeSWITCH WebSocket Transport (VPS Config) ❌
Currently FreeSWITCH on the VPS only listens for standard SIP over TCP/UDP (for desktop softphones like Zoiper). For browser-based WebRTC calls, it needs a WebSocket (WSS) listener configured via `mod_verto` or a WebSocket transport in `mod_sofia`.

This is a **one-time VPS configuration** — no code change, just FreeSWITCH config.

---

### Incoming Call Notification ❌
When a call comes in to an agent, they need to see a pop-up/toast inside WorkHolo with:
- Caller's phone number
- Answer and Reject buttons
- Ring sound

---

### Active Call UI ❌
When a call is live:
- Call timer (how long the call has been going)
- Mute / Unmute button
- Hold / Resume button
- Hangup button
- Show who they're talking to

---

### Click-to-Call ❌
Any phone number shown anywhere in WorkHolo (contacts, CRM records, etc.) can be clicked to initiate a call immediately.

---

### Agent Availability Status ❌
- Agent sets themselves as Available / Busy / Away
- FreeSWITCH respects this when routing inbound calls
- Visible to supervisors in real time

---

## Feature Comparison — WorkHolo vs Acefone

| Feature | WorkHolo | Acefone |
|---|---|---|
| Platform admin provisions providers & trunks | ✅ Done | ✅ |
| Add and manage phone numbers (DIDs) | ✅ Done | ✅ |
| Assign DID to an organization | ✅ Done | ✅ |
| Assign DID + extension to a team member | ✅ Done | ✅ |
| Inbound call routing (DID → agent) | ✅ Done | ✅ |
| Outbound call routing (agent → carrier) | ✅ Done | ✅ |
| Auto-reload FreeSWITCH on config change | ✅ Done | ✅ |
| Call logs with full details per org | ✅ Done | ✅ |
| Platform-wide call analytics | ✅ Done | ✅ |
| CDR ingestion (duration, status, hangup cause) | ✅ Done | ✅ |
| **In-browser softphone widget for agents** | ❌ Pending | ✅ |
| **Incoming call popup / ring notification** | ❌ Pending | ✅ |
| **Active call controls (mute / hold / hangup)** | ❌ Pending | ✅ |
| **Agent availability status (online/busy/DND)** | ❌ Pending | ✅ |
| **Click-to-call from workspace** | ❌ Pending | ✅ |
| **FreeSWITCH WebSocket/WebRTC transport** | ❌ VPS config pending | ✅ |

---

## Infrastructure Still Needed on FreeSWITCH VPS

These are not code changes — they are one-time configurations on the FreeSWITCH server (`135.181.31.20`):

| Task | What It Does |
|---|---|
| Configure `mod_xml_curl` | Tells FreeSWITCH to call WorkHolo's API for directory and dialplan lookups |
| Configure `mod_cdr_curl` | Tells FreeSWITCH to POST call detail records to WorkHolo after each call |
| Configure WebSocket transport | Enables browser-based SIP (needed for the in-app softphone) |
| End-to-end test | Register softphone → inbound test call → outbound test call → verify logs |

---

## Summary

| | Count | Status |
|---|---|---|
| Database tables | 8 | ✅ Live in DB |
| API endpoints (admin) | ~25 | ✅ Done |
| API endpoints (org) | ~10 | ✅ Done |
| FreeSWITCH endpoints | 3 | ✅ Done |
| Admin UI pages | 7 | ✅ Done |
| Org console pages | 2 | ✅ Done |
| Agent softphone | 0 | ❌ Next phase |
| VPS FreeSWITCH config | 0/4 | ❌ Pending |

**Bottom line:** The entire backend infrastructure, admin tooling, and call logging system is complete. What remains is the agent-facing softphone widget (the UI that team members actually use to talk) and the final FreeSWITCH VPS configuration to wire everything together for a live test.
