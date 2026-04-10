# Work Holo Dialer System
## Software Requirements Specification (SRS)

**Document Version:** 1.0  
**Last Updated:** April 2026  
**Status:** Ready for Development  
**Target Audience:** Development Team, QA, Technical Leads  

---

## Table of Contents

1. [Overview](#overview)
2. [System Components](#system-components)
3. [Data Requirements](#data-requirements)
4. [Functional Requirements (Detailed)](#functional-requirements-detailed)
5. [Interface Requirements](#interface-requirements)
6. [Performance Requirements](#performance-requirements)
7. [Security Requirements](#security-requirements)
8. [Database Schema](#database-schema)
9. [API Specification](#api-specification)
10. [System Integration Points](#system-integration-points)
11. [Testing Requirements](#testing-requirements)
12. [Deployment Requirements](#deployment-requirements)

---

## Overview

### Purpose

This SRS document provides detailed technical requirements for the Work Holo Dialer system, a multi-tenant communication platform enabling organizations to manage inbound/outbound calling operations.

### Scope

**System Boundaries:**
- Includes: Web dashboard, API backend, FreeSWITCH configuration management
- Excludes: IVR, TTS, predictive dialing, billing system

**Users:**
- Platform Admin (1-2 users)
- Organization Admins (100-1000 users)
- Agents (10,000+ users)

**Environment:**
- Production: Ubuntu 22.04 LTS (VPS)
- FreeSWITCH: 1.10.x+ with sophia-sip
- Database: PostgreSQL 14+
- Backend: Bun runtime with Hono framework
- Frontend: React 19+ with TypeScript

---

## System Components

### Component Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                        │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────────┐ │
│  │  Admin Dashboard │  │  Org Dashboard   │  │ Agent Interface│ │
│  │  (React Web App) │  │  (React Web App) │  │ (React Web App)│ │
│  └─────────┬────────┘  └─────────┬────────┘  └────────┬────────┘ │
│            │                      │                     │          │
└────────────┼──────────────────────┼─────────────────────┼──────────┘
             │                      │                     │
             └──────────┬───────────┴─────────────────────┘
                        │ (oRPC over HTTPS)
┌───────────────────────▼──────────────────────────────────────────┐
│                     API/APPLICATION LAYER                         │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │           HONO API SERVER (Node.js)                          │ │
│  │  ┌──────────────┐ ┌──────────────┐ ┌────────────────────┐  │ │
│  │  │  Dialer      │ │  Campaign    │ │  Call              │  │ │
│  │  │  Procedures  │ │  Procedures  │ │  Procedures        │  │ │
│  │  └──────────────┘ └──────────────┘ └────────────────────┘  │ │
│  │  ┌──────────────┐ ┌──────────────┐ ┌────────────────────┐  │ │
│  │  │  Lead        │ │  Resource    │ │  Admin             │  │ │
│  │  │  Procedures  │ │  Procedures  │ │  Procedures        │  │ │
│  │  └──────────────┘ └──────────────┘ └────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                        │                  │                       │
└────────────────────────┼──────────────────┼───────────────────────┘
                         │                  │
            ┌────────────┼──────────────────┼────────────┐
            │            │                  │            │
┌───────────▼──┐  ┌──────▼──────┐  ┌──────▼──────┐  ┌──▼─────────┐
│ PostgreSQL   │  │  RabbitMQ   │  │   Redis     │  │  File      │
│ Database     │  │  Message    │  │   Cache &   │  │  Storage   │
│              │  │  Queue      │  │   Realtime  │  │   (S3)     │
└──────────────┘  └─────────────┘  └─────────────┘  └────────────┘
       │                │                │                │
       └────────────────┼────────────────┼────────────────┘
                        │
            ┌───────────┼────────────┐
            │           │            │
   ┌────────▼──────┐ ┌──▼────────┐ ┌▼──────────────┐
   │ Config Sync   │ │ SIP       │ │ Events        │
   │ Service       │ │ Worker    │ │ Publisher     │
   │               │ │ (ESL)     │ │ (Soketi)      │
   └────────┬──────┘ └──┬───────┘ └┬──────────────┘
            │           │          │
            │ (SSH)      │(ESL)    │(WebSocket)
            │           │          │
            └───────────┼──────────┘
                        │
            ┌───────────▼──────────┐
            │   FREESWITICH        │
            │   Phone System       │
            │   (VPS)              │
            └──────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Technology |
|-----------|----------------|------------|
| **Frontend (Admin)** | Manage SIP trunks, DIDs, organizations | React, TypeScript, TailwindCSS |
| **Frontend (Org)** | Configure DIDs, campaigns, leads | React, TypeScript, TailwindCSS |
| **Frontend (Agent)** | Click-to-call, disposition, history | React, TypeScript, TailwindCSS |
| **API Server** | Business logic, data validation, auth | Hono, Bun, oRPC |
| **Database** | All persistent data | PostgreSQL, Drizzle ORM |
| **Message Queue** | Async job processing | RabbitMQ |
| **Cache Layer** | Agent state, session, real-time data | Redis |
| **Config Sync** | Watch DB → generate XML → deploy to FS | Bun script |
| **SIP Worker** | Connect to FreeSWITCH, handle call events | Bun, modesl ESL library |
| **Events Publisher** | Real-time updates to frontend | Soketi (WebSocket) |
| **File Storage** | Call recordings | S3 or compatible |
| **FreeSWITCH** | Phone switch, routing, recording | C, sophia-sip |

---

## Data Requirements

### Data Classification

| Data Type | Sensitivity | Retention | Encryption |
|-----------|------------|-----------|-----------|
| SIP Credentials | **HIGH** | Until revoked | AES-256 at rest |
| Lead Info (PII) | **HIGH** | Per campaign lifecycle | AES-256 at rest |
| Call Recordings | **HIGH** | 90 days default | AES-256 at rest |
| Call Metadata | **MEDIUM** | 2 years | Encrypted |
| Call Disposition | **MEDIUM** | 2 years | Plaintext |
| Configuration | **LOW** | Indefinite | Plaintext |
| Audit Logs | **MEDIUM** | 1 year | Plaintext |

### Data Volume Estimates (Year 1)

| Data Type | Volume | Growth |
|-----------|--------|--------|
| Organizations | 100 | +20% MoM |
| DIDs | 1,000 | +15% MoM |
| Leads | 1M | +50% MoM |
| Calls | 100K | +50% MoM |
| Call Recordings (GB) | 500 | +50% MoM |
| Database Size | 50 GB | +40% MoM |

---

## Functional Requirements (Detailed)

### FR-1: SIP Trunk Management

#### FR-1.1: Create SIP Trunk

**Actor:** Platform Admin  
**Precondition:** Admin logged in, SIP provider credentials obtained  
**Steps:**

1. Navigate to Admin > SIP Trunks
2. Click "Add Trunk"
3. Fill form:
   - Name (text, required)
   - Provider (dropdown: CloudBharat, Telnyx, Twilio, Custom)
   - Username (text, required)
   - Password (password field, required)
   - Proxy Server (FQDN, required) → Example: siptrunk.cloudbharat.in
   - From Domain (FQDN, optional)
   - Expire Seconds (number, default 60)
   - Ping Interval (number, default 25)
   - Register (checkbox, default true)
4. Submit form
5. System validates:
   - All required fields filled
   - Username/password not empty
   - Proxy is valid FQDN or IP
   - Expire/ping values > 0
6. If valid: Save to DB, encrypt credentials, show success
7. If invalid: Show validation errors

**Postcondition:** Trunk created, ready to test  
**Error Handling:**
- Duplicate trunk name → Show error "Trunk name already exists"
- Invalid FQDN → Show error "Invalid proxy server format"
- Database error → Show error "Failed to create trunk"

**Technical Details:**
- Credentials encrypted using AES-256
- Stored in `sip_trunks` table
- No automatic deployment (manual test first)

---

#### FR-1.2: Test SIP Trunk Connection

**Actor:** Platform Admin  
**Precondition:** Trunk created, not yet deployed  
**Steps:**

1. From trunk details, click "Test Connection"
2. System attempts ESL connection to FreeSWITCH
3. If trunk exists on FS: show "✅ Registered"
4. If trunk missing: show "⚠️ Not registered (not deployed yet)"
5. If credentials wrong: show "❌ Registration failed"

**Postcondition:** Admin sees registration status  
**Technical Details:**
- Runs `sofia status gateway <trunk_name>` via ESL
- Timeout: 5 seconds

---

#### FR-1.3: Deploy SIP Trunk to FreeSWITCH

**Actor:** Platform Admin or automated  
**Precondition:** Trunk created, validated  
**Steps:**

1. Admin clicks "Deploy" on trunk details
2. Config Sync Service:
   - Generates XML: `/conf/sip_profiles/external/<provider>_<id>.xml`
   - SSH to VPS, writes file
   - Runs: `sofia profile external rescan`
   - Waits 5 sec
   - Checks status via ESL
3. If successful: Update `deployedAt` timestamp, show ✅
4. If failed: Show error, retry button

**Postcondition:** Trunk active on FreeSWITCH  
**Error Handling:**
- SSH connection fail → "Could not reach VPS"
- XML generation fail → "Invalid trunk configuration"
- Rescan timeout → "FreeSWITCH not responding"

---

#### FR-1.4: Edit SIP Trunk

**Actor:** Platform Admin  
**Precondition:** Trunk exists  
**Steps:**

1. Click "Edit" on trunk
2. Modify allowed fields:
   - Name
   - Username
   - Password
   - Proxy Server
   - Settings (expire, ping, etc.)
3. Click "Save"
4. System validates
5. If valid: Update DB, re-deploy to FreeSWITCH
6. Show success

**Restrictions:**
- Cannot change provider (would require manual migration)

**Postcondition:** Changes applied, FreeSWITCH updated

---

#### FR-1.5: List All SIP Trunks

**Actor:** Platform Admin  
**Steps:**

1. Navigate to Admin > SIP Trunks
2. Display table with:
   - Trunk Name
   - Provider
   - Status (Registered / Not Registered / Error)
   - Last Updated
   - Actions (Edit, Test, Delete)

**Filtering:**
- Filter by provider
- Filter by status

**Sorting:**
- By name, by date, by status

---

#### FR-1.6: Delete SIP Trunk

**Actor:** Platform Admin  
**Precondition:** Trunk not in use (no active DIDs)  
**Steps:**

1. Click "Delete" on trunk
2. System checks: Does any DID use this trunk?
3. If yes: Show error "Cannot delete, X DIDs depend on this trunk"
4. If no: Show confirmation "Delete trunk <name>?"
5. On confirm: Delete from DB, remove XML from VPS, rescan FreeSWITCH

**Postcondition:** Trunk deleted from system

---

### FR-2: DID Inventory Management

#### FR-2.1: Add DIDs to Inventory (Bulk Import)

**Actor:** Platform Admin  
**Precondition:** SIP trunk exists  
**Steps:**

1. Navigate to Admin > DID Inventory
2. Click "Add DIDs"
3. Choose method:
   - Option A: Upload CSV
   - Option B: Manual entry
4. For CSV:
   - Column 1: DID number (format: +914226628808 or 914226628808)
   - Column 2: SIP Trunk (select from dropdown)
   - Column 3: Status (optional, default: available)
5. Upload file
6. System validates:
   - Format check (E.164 or 10-digit)
   - Duplicate check (within file and existing DB)
   - Trunk exists
   - 500 rows max per upload
7. If valid: Show preview, "Import 50 DIDs?"
8. On confirm: Insert to DB, update inventory
9. Show success "50 DIDs added to inventory"

**Example CSV:**
```
did_number,trunk_id,status
+914226628808,trunk_cloudbharat_001,available
+919876543210,trunk_cloudbharat_001,available
```

**Error Handling:**
- Invalid format → "Row 3: Invalid DID format"
- Duplicate → "Row 5: DID already exists"
- Trunk missing → "Row 2: Trunk not found"
- File too large → "Maximum 500 DIDs per import"

**Postcondition:** DIDs in inventory table, status="available"

---

#### FR-2.2: Assign DID to Organization

**Actor:** Platform Admin  
**Precondition:** DID in inventory (status="available"), organization exists  
**Steps:**

1. Navigate to Admin > DID Inventory
2. Filter: Status = "Available"
3. Select DID(s) → Click "Assign to Organization"
4. Choose organization from dropdown
5. Confirm: "Assign 1 DID to Acme Corp?"
6. System:
   - Updates `didInventory` → set `assignedToOrganizationId`, `assignedAt`, `status="assigned"`
   - Creates entry in `organizationDids` table with:
     - organizationId
     - didInventoryId
     - name="" (org fills later)
     - destinationType="hangup" (default)
     - isActive=false (org activates)
   - **Does NOT deploy yet** (org must configure first)
7. Send org email: "New DID assigned: +914226628808. Configure in your dashboard."
8. Show success

**Postcondition:** 
- DID assigned to org (in inventory + org table)
- Org can see DID in their dashboard
- Org must configure before it's active

**Technical Notes:**
- Can bulk-assign multiple DIDs
- Assignment is permanent (no un-assign)

---

#### FR-2.3: View DID Inventory (Admin)

**Actor:** Platform Admin  
**Precondition:** Logged in  
**Display:**

| Column | Data |
|--------|------|
| DID | +914226628808 |
| Trunk | CloudBharat Main |
| Status | Available / Assigned / Retired / Blocked |
| Assigned to | Acme Corp (or blank) |
| Assigned Date | 2026-04-10 |
| Actions | Assign / Retire / Block / Details |

**Filtering:**
- By status (Available, Assigned, Retired)
- By trunk
- By organization
- Search by DID number

**Sorting:**
- By DID, by assigned date, by status

**Bulk Actions:**
- Select multiple DIDs → "Assign to Org" or "Retire All"

---

#### FR-2.4: Retire DID

**Actor:** Platform Admin  
**Precondition:** DID exists, no active routing  
**Steps:**

1. Click "Retire" on DID
2. Confirm: "Retire +914226628808?"
3. System:
   - Updates `didInventory` → `status="retired"`
   - If assigned to org, removes from `organizationDids`
   - Removes FreeSWITCH routing rule
4. Show success "DID retired"

**Postcondition:** DID no longer available, calls to it fail

---

### FR-3: DID Configuration (Organization Level)

#### FR-3.1: View My DIDs

**Actor:** Organization Admin / Agent  
**Precondition:** Logged in to org  
**Steps:**

1. Navigate to Dialer > My DIDs
2. Display table:
   - DID number
   - Friendly name
   - Current routing (Agent, Queue, Hangup)
   - Status (Active / Inactive)
   - Recording (On / Off)
   - Last Modified

**Information per DID:**
- Phone number (immutable)
- Friendly name (editable)
- Description (editable)
- Routing destination
- Recording enabled toggle
- Status toggle
- Last configured by (user)
- Last configured date

---

#### FR-3.2: Configure DID Routing

**Actor:** Organization Admin  
**Precondition:** DID assigned to org  
**UI Form:**

```
┌─────────────────────────────────────────┐
│ Configure DID: +914226628808            │
├─────────────────────────────────────────┤
│                                         │
│ Friendly Name: [Sales Main Line     ]   │
│ Description:   [Calls to sales team ]   │
│                                         │
│ Routing:                                │
│ ○ Route to Agent                        │
│   [Dropdown: Select Agent]              │
│                                         │
│ ○ Route to Queue                        │
│   [Dropdown: Select Queue]              │
│                                         │
│ ○ Route to Hangup (no routing)          │
│                                         │
│ Features:                               │
│ ☑ Recording Enabled                     │
│ ☐ Sticky Agent (repeat callers same)    │
│                                         │
│ Status:                                 │
│ ☑ Active                                │
│                                         │
│ [Save] [Cancel]                         │
└─────────────────────────────────────────┘
```

**Validation Rules:**

1. Name required, max 50 chars
2. If routing = "Agent": agent must exist, must be active
3. If routing = "Queue": queue must exist, must be active
4. If routing = "Hangup": no target required
5. Cannot save if invalid

**Database Update:**
- `organizationDids` table:
  - name
  - description
  - destinationType
  - destinationTarget
  - stickyAgentEnabled
  - recordingEnabled
  - isActive
  - updatedAt
  - Updated by (user ID)

**Post-Save Actions:**
1. Publish message to RabbitMQ: `dialer.config.changed`
2. Config Sync Service picks up change
3. Generates FreeSWITCH dialplan XML
4. SSH deploys to VPS
5. FreeSWITCH reloads
6. Show user: "✅ Configuration saved and deployed"

**Error Handling:**
- Invalid agent → "Selected agent not found"
- Invalid queue → "Selected queue not found"
- Already active → "DID already active, no changes"
- Deployment failed → Show error, retry button

**Timeline:** Save → Deploy ≤ 30 seconds

---

#### FR-3.3: Enable/Disable DID

**Actor:** Organization Admin  
**Steps:**

1. On DID card, toggle "Active" switch
2. If enabling:
   - Validate routing is set
   - Deploy to FreeSWITCH
   - Show success
3. If disabling:
   - Update `isActive = false`
   - Deploy to FreeSWITCH
   - Calls to this DID get "hangup"

**Error Handling:**
- No routing configured → "Configure routing before activating"

---

### FR-4: Campaign Management

#### FR-4.1: Create Campaign

**Actor:** Organization Admin  
**Precondition:** 
- Logged in to org
- At least 1 DID assigned
- At least 1 inbound queue (if creating inbound campaign)

**UI Form:**

```
┌────────────────────────────────┐
│ Create Campaign                │
├────────────────────────────────┤
│                                │
│ Campaign Name: [             ] │
│ Type: [Outbound▼]              │
│ Description: [            ]    │
│                                │
│ Assigned DID: [DID▼]           │
│ Assigned Script: [Script▼]     │
│                                │
│ Disposition List: [List▼]      │
│                                │
│ Dialer Mode: [Manual▼]         │
│ Max Concurrent Calls: [1]      │
│                                │
│ Start Date: [  2026-04-10]     │
│ End Date:   [  2026-05-10]     │
│                                │
│ Daily Call Limit: [blank]      │
│                                │
│ [Create] [Cancel]              │
└────────────────────────────────┘
```

**Validation:**
- Name required, unique within org, max 100 chars
- Type required (Outbound / Inbound / IVR)
- DID required and must belong to org
- Script optional but recommended for outbound
- Disposition List required
- Dates valid (start < end)
- Concurrent calls > 0
- Daily limit > 0 (if set)

**Database Insert:**
- `campaigns` table:
  - organizationId
  - name
  - description
  - type
  - didId
  - scriptId (nullable)
  - dispositionListId
  - status = "draft"
  - dialerMode = "manual" (default)
  - maxConcurrentCalls
  - dailyCallLimit (nullable)
  - startDate
  - endDate
  - createdAt
  - updatedAt

**Postcondition:** Campaign created in "draft" state, ready to import leads

---

#### FR-4.2: Import Leads to Campaign

**Actor:** Organization Admin  
**Precondition:** Campaign created  
**Steps:**

1. Navigate to campaign
2. Click "Import Leads"
3. Upload CSV file
4. CSV Format:
   ```
   phone_number,first_name,last_name,email,company,budget
   +919876543210,John,Doe,john@acme.com,Acme Corp,100000
   ```
5. Validate:
   - Column "phone_number" required
   - Phone format check (E.164 or 10-digit)
   - Max 100,000 rows per import
   - Duplicate phone numbers in file → reject
   - Duplicate phone numbers in campaign → skip with warning
6. Show preview: "10 of 5000 leads" with sample data
7. On confirm: Insert to DB
8. Update campaign `leadCount`
9. Show: "✅ 5000 leads imported. Ready to activate."

**Database Insert:**
- `leads` table:
  - organizationId
  - campaignId
  - phoneNumber
  - firstName (optional)
  - lastName (optional)
  - email (optional)
  - customData (JSON, optional)
  - status = "new"
  - attempts = 0
  - createdAt

**Error Handling:**
- Invalid format → Show row numbers with errors
- Duplicate in file → Show count, ask to proceed?
- Duplicate in campaign → Skip with warning count
- File too large → "Max 100,000 leads per import"

---

#### FR-4.3: Activate Campaign

**Actor:** Organization Admin  
**Precondition:** 
- Campaign in "draft" state
- Campaign has leads
- DID configured

**Steps:**

1. Click "Activate" on campaign
2. System validates:
   - Status == "draft"
   - leadCount > 0
   - DID is active and configured
   - Script exists (if required)
3. If valid:
   - Update status = "active"
   - Update activatedAt = now
   - Publish message: `dialer.campaign.activated`
   - Notify agents
4. Show success "Campaign activated"

**Agents see:**
- Campaign in their dashboard
- Leads available to dial
- Script and disposition options

**Postcondition:** Campaign live, agents can start calling

---

#### FR-4.4: Pause/Resume Campaign

**Actor:** Organization Admin  
**Steps:**

1. From campaign details, click "Pause"
2. Update status = "paused"
3. Agents cannot dial new leads (current calls continue)
4. To resume: Click "Resume" → status = "active"

**No data loss** — leads remain with current status

---

### FR-5: Lead Management

#### FR-5.1: View Leads in Campaign

**Actor:** Organization Admin, Agent  
**Precondition:** Campaign has leads  
**Display Table:**

| Column | Data |
|--------|------|
| Phone | +919876543210 |
| Name | John Doe |
| Email | john@example.com |
| Status | New / Attempted / Reached / Not Reached / Callback / DND |
| Attempts | 3 |
| Disposition | Interested |
| Last Called | 2026-04-10 14:30 |

**Filtering:**
- By status
- By disposition
- By attempt count
- By assigned agent

**Sorting:**
- By status, by attempts, by last called date

**Bulk Actions (Admin only):**
- Select multiple → "Mark as Callback" or "Add to DND"

---

#### FR-5.2: Update Lead Status

**Actor:** Agent (after call), Admin (manual)  
**Steps (Agent Path):**

1. After call ends
2. Disposition prompt shows
3. Select outcome: "Interested", "Not Interested", etc.
4. Add optional notes
5. Click "Save"
6. System updates `leads` table:
   - status = derived from disposition
   - disposition = selected value
   - notes = agent notes
   - updatedAt = now
7. Lead removed from agent's queue (for this campaign)
8. Next lead displays

**Steps (Admin Manual Update):**

1. In lead list, click lead row
2. Edit modal opens:
   - Phone (read-only)
   - Name (editable)
   - Email (editable)
   - Status dropdown (editable)
   - Disposition dropdown (editable)
   - Notes textarea (editable)
3. Save changes
4. Update `leads` table

**Status Mapping:**
- Disposition "Interested" → Lead status "Reached"
- Disposition "Not Interested" → Lead status "Not Reached"
- Disposition "DND" → Lead status "DND"
- Disposition "Callback" → Lead status "Callback"
- Disposition "Wrong Number" → Lead status "Not Reached"

---

#### FR-5.3: DND (Do Not Call) Management

**Actor:** Agent, Admin  
**Automatic:**
- Agent selects "DND" disposition
- Lead status auto-set to "DND"
- Number added to org's DND list
- Future campaigns skip this number

**Manual:**
- Admin navigates to Dialer > DND List
- Clicks "Add to DND"
- Enters phone number
- Reason (optional)
- Expiry (optional, or permanent)

**Database:**
- `dndList` table:
  - organizationId
  - phoneNumber
  - reason
  - expiresAt (nullable)
  - createdAt

**Enforcement:**
- When dialing: Check lead's phone against org's DND list
- If found: Skip automatically, log as "skipped_dnd"
- If DND expired: Remove from list, allow dialing

---

### FR-6: Call Operations

#### FR-6.1: Initiate Outbound Call (Click-to-Call)

**Actor:** Agent  
**Precondition:** 
- Agent logged in to agent dashboard
- Campaign active
- Lead available (status="new")

**Steps:**

1. Agent sees lead in queue: "+919876543210 - John Doe"
2. Script displays (if assigned)
3. Agent clicks "Call Now"
4. System:
   - Generates unique `callId` (UUID)
   - Inserts to `calls` table:
     - id = callId
     - organizationId
     - campaignId
     - leadId
     - agentId = logged-in agent
     - direction = "outbound"
     - phoneNumber = lead's phone
     - callerId = assigned DID
     - status = "initiated"
     - fsUuid = null (will update when FS responds)
     - startedAt = now
   - Publishes to RabbitMQ queue: `dialer.call.request`
     ```json
     {
       "callId": "abc123",
       "phoneNumber": "+919876543210",
       "agentExtension": "1001",
       "didNumber": "+914226628808"
     }
     ```
   - Updates UI: Show "Calling..." + timer
   - Updates lead status = "attempted"

5. **SIP Worker receives message:**
   - Connects to FreeSWITCH ESL
   - Executes: `originate {origination_uuid=callId,origination_caller_id_number=+914226628808}sofia/gateway/cloudbharat_trunk/+919876543210 user/1001@internal`
   - FreeSWITCH bridges:
     - Outbound: FS dials lead's phone via SIP trunk
     - Inbound: Lead's phone rings

6. **Call Events:**
   - CHANNEL_CREATE: Lead's phone ringing
   - CHANNEL_ANSWER: Agent or lead answered
   - CHANNEL_HANGUP: Call ended

7. **UI Updates (Real-time):**
   - "Ringing..." → "Connected" → Timer starts
   - Lead info displays
   - Script visible

**Timing:**
- Click to ringing: < 2 seconds
- FreeSWITCH dials: < 3 seconds

**Error Handling:**
- Lead phone invalid → Show error "Invalid phone number"
- Agent extension offline → Show error "Agent not registered"
- SIP trunk down → Show error "Call failed - trunk unavailable"
- DND number → Show error "Cannot call - DND list"

---

#### FR-6.2: Receive Inbound Call

**Actor:** Customer (external), Agent (recipient)  
**Precondition:** 
- DID active and configured to route to queue
- Agents registered

**Steps:**

1. Customer dials: +914226628808 (org's DID)
2. SIP trunk receives call
3. FreeSWITCH looks up DID config in dialplan
4. Routing says: "Queue: support_team"
5. Call routed to `inboundQueues` → finds agents
6. Next available agent's phone rings
7. Agent answers
8. System:
   - Inserts to `calls` table:
     - direction = "inbound"
     - phoneNumber = customer's CallerID (or masked)
     - agentId = answering agent
     - status = "answered"
     - startedAt
   - Publishes real-time event to Soketi (agent's browser)
   - Browser updates: Show incoming call details

9. Agent takes call:
   - CRM shows customer info (if lead exists)
   - Script displays
   - Recording starts

10. Call ends: Agent logs disposition

**Recording:**
- Automatic, no manual action
- Stored as /recordings/{uuid}.wav on FreeSWITCH
- Metadata saved to DB

---

#### FR-6.3: End Call & Log Disposition

**Actor:** Agent  
**Precondition:** Call active  
**Steps:**

1. Agent hangs up OR customer hangs up
2. System detects CHANNEL_HANGUP event
3. Disposition prompt displays:
   ```
   ┌──────────────────────┐
   │ How did call go?     │
   ├──────────────────────┤
   │ ○ Interested         │
   │ ○ Not Interested     │
   │ ○ Wrong Number       │
   │ ○ Callback-Tomorrow  │
   │ ○ DND                │
   │                      │
   │ Notes: [          ]  │
   │                      │
   │ [Save]               │
   └──────────────────────┘
   ```

4. Agent selects disposition, adds optional notes
5. Clicks "Save"
6. System:
   - Updates `calls` table:
     - status = "ended"
     - endedAt = now
     - durationSeconds = calculated
     - disposition = selected
   - Updates `leads` table:
     - status = mapped from disposition
     - disposition = value
     - notes = agent notes
     - updatedAt
   - Updates `callEvents` with DISPOSITION_LOGGED
   - Recording available (linked in call record)
   - Show next lead

**Validation:**
- Disposition required (cannot skip)
- Notes optional but recommended

**Error Handling:**
- If disposition save fails: Show error "Could not save. Retry?"
- Still show next lead (call tracked in DB)

---

### FR-7: Call History & Recording

#### FR-7.1: View Call History

**Actor:** Organization Admin, Agent, Supervisor  
**Precondition:** Logged in  
**Steps:**

1. Navigate to Dialer > Call History
2. Display table with filters/search
3. Default: Last 100 calls, sorted by date DESC

**Table Columns:**
- Call ID (mini)
- Date/Time
- Lead Phone
- Lead Name (if known)
- Agent
- Direction (In/Out)
- Duration
- Disposition
- Recording (▶️ Play icon)
- Actions

**Filters:**
- Date range picker
- Agent dropdown
- Disposition dropdown
- Direction (Inbound/Outbound)
- Campaign dropdown
- Status (Completed, Failed, etc.)

**Sorting:**
- By date, by duration, by disposition

**Search:**
- By phone number
- By lead name

**Pagination:**
- 50 per page, load more button

---

#### FR-7.2: Play Call Recording

**Actor:** Any authorized user  
**Precondition:** Call has recording (recordingUrl not null)  
**Steps:**

1. Click ▶️ icon on call row
2. Modal opens with audio player
3. Display:
   - Call metadata (date, agent, lead, duration)
   - Audio player with playback controls
   - Download button
4. Audio streams from file storage (S3)
5. Can scrub, play, pause
6. Close modal when done

**Technical:**
- Presigned S3 URL (15 min expiry)
- Streams to browser
- No local download unless explicitly requested

---

#### FR-7.3: Download Recording

**Actor:** Organization Admin  
**Precondition:** Call has recording  
**Steps:**

1. Click "Download" on call row
2. System generates presigned S3 URL
3. Browser downloads .wav file
4. Filename: `call_{callId}_{timestamp}.wav`

---

#### FR-7.4: Export Call History

**Actor:** Organization Admin  
**Precondition:** At least 1 call exists  
**Steps:**

1. From call history, click "Export as CSV"
2. System generates CSV with columns:
   - Call ID
   - Date
   - Lead Phone
   - Lead Name
   - Agent
   - Direction
   - Duration (seconds)
   - Disposition
   - Notes
   - Recording URL (if exists)
3. Browser downloads file: `call_history_{date}.csv`

**Filtering:**
- Export respects applied filters
- Can export selected calls or all visible

---

## Interface Requirements

### Admin Dashboard Screens

#### Screen: SIP Trunk Manager

**URL:** `/admin/sip-trunks`  
**Sections:**
- Header: "SIP Trunks"
- Button: "+ Add Trunk"
- Table: All trunks with status badges
- Row actions: Edit, Test, Delete

**State:**
- Empty state: "No trunks configured. Add one to get started."
- Loaded: Table with data
- Error state: "Failed to load trunks"

---

#### Screen: DID Inventory

**URL:** `/admin/dids`  
**Sections:**
- Filter bar: Status, Trunk, Organization
- Search box: DID number
- Button: "+ Import DIDs"
- Table: DIDs with assignment info
- Bulk actions: Select multiple → "Assign to Org"

---

### Organization Dashboard Screens

#### Screen: My DIDs

**URL:** `/org/{orgId}/dialer/dids`  
**Sections:**
- Header: "Phone Numbers"
- List of DIDs (card or table view)
- Per-DID:
  - Phone number (large, prominent)
  - Friendly name
  - Status badge (Active/Inactive)
  - Routing summary ("Route to: Support Queue")
  - Button: "Configure"

---

#### Screen: Configure DID

**URL:** `/org/{orgId}/dialer/dids/{didId}/configure`  
**Form:** (as detailed in FR-3.2)

---

#### Screen: Campaigns

**URL:** `/org/{orgId}/dialer/campaigns`  
**Sections:**
- Button: "+ Create Campaign"
- Table/Cards: Active campaigns
  - Campaign name
  - Type (Outbound/Inbound)
  - Lead count
  - Calls made
  - Status (Draft/Active/Paused)
  - Actions: Activate, Pause, View Details

---

#### Screen: Leads in Campaign

**URL:** `/org/{orgId}/dialer/campaigns/{campaignId}/leads`  
**Sections:**
- Campaign header
- Button: "+ Import Leads"
- Filters/search
- Table: Leads with status
- Bulk actions

---

### Agent Interface Screens

#### Screen: Campaign Dashboard

**URL:** `/agent/campaigns/{campaignId}`  
**Sections:**
- Campaign header + stats
- Current lead card (prominent):
  - Phone number (large)
  - Name
  - Email (if available)
  - Custom fields
  - Script (if assigned)
  - Button: "Call Now"
- Below: Next 5 leads preview
- Call timer (when on call)
- Call recording indicator

---

#### Screen: Call History (Agent)

**URL:** `/agent/call-history`  
**Sections:**
- Filter: Date, Campaign, Disposition
- Table: My calls
  - Date, lead, duration, disposition
  - Play recording icon
  - View notes icon

---

## Performance Requirements

### Latency Targets

| Operation | Target | Measurement |
|-----------|--------|-------------|
| Click-to-Call → Ringing | < 2 sec | From click to lead phone rings |
| Save DID Config → Active | < 30 sec | From save to effective on FreeSWITCH |
| Dashboard Load | < 3 sec | Page fully loaded |
| Search Leads | < 1 sec | Results displayed |
| API Request | < 1 sec | oRPC response |
| Database Query | < 500 ms | Query execution time |
| File Upload (50MB) | < 30 sec | CSV or recording upload |

### Throughput Targets

| Metric | Target |
|--------|--------|
| Concurrent Calls | 1000+ |
| Calls per Second (Peak) | 100 |
| API Requests per Second | 500 |
| Database Connections | 100 (pool) |
| Message Queue Throughput | 1000 msg/sec |

### Resource Limits

| Resource | Limit | Notes |
|----------|-------|-------|
| API Response Size | 10 MB | Max JSON/data per response |
| File Upload Size | 100 MB | CSV, recordings, uploads |
| Lead Import Count | 100,000 | Rows per upload |
| Call History Retention | 2 years | Then archived/deleted |
| Recording Retention | 90 days | Then deleted (configurable) |
| Database Size | 500 GB (Year 1) | Plan for growth |

---

## Security Requirements

### Authentication

| Requirement | Implementation |
|-------------|-----------------|
| User Login | Email + password, session-based |
| Session Management | Secure cookies, 8-hour timeout |
| MFA (Future) | TOTP support (Phase 2+) |
| API Auth | Bearer token (oRPC) |
| Service-to-Service | API keys for workers |

### Authorization

- **Role-Based Access Control (RBAC):**
  - Super Admin: All system access
  - Platform Admin: SIP trunks, DIDs, organizations
  - Organization Admin: Manage org config
  - Agent: Call operations, disposition only
  - Agent View: Own calls only

### Data Protection

| Data | Protection |
|------|-----------|
| SIP Credentials | AES-256 encryption at rest |
| Lead PII | AES-256 encryption at rest |
| Passwords | Bcrypt hashing (never plaintext) |
| API Keys | Hashed, rotatable |
| Call Recordings | AES-256 encryption at rest, in-transit |
| Audit Logs | Immutable, append-only |

### Network Security

- ✅ All API endpoints over HTTPS (TLS 1.3)
- ✅ CORS configured (allow only known origins)
- ✅ Rate limiting (prevent brute force, DoS)
- ✅ Input validation (prevent injection attacks)
- ✅ SQL injection protection (Drizzle ORM parameterized queries)
- ✅ XSS protection (React built-in, CSP headers)
- ✅ CSRF protection (SameSite cookies)

### Compliance

- ✅ GDPR: Data deletion requests, consent tracking
- ✅ CCPA: Right to access, right to delete
- ✅ Audit logging: All user actions logged
- ✅ Data retention: Configurable per organization

---

## Database Schema

### Core Tables

#### `organizations`
```sql
id (UUID) PRIMARY KEY
name (VARCHAR 100)
slug (VARCHAR 50) UNIQUE
logo (TEXT nullable)
createdAt (TIMESTAMP)
updatedAt (TIMESTAMP)
```

#### `sip_trunks`
```sql
id (UUID) PRIMARY KEY
name (VARCHAR 100) UNIQUE
provider (VARCHAR 50)
username (VARCHAR 100) ENCRYPTED
password (VARCHAR 200) ENCRYPTED
proxyServer (VARCHAR 100)
fromDomain (VARCHAR 100) NULLABLE
expireSeconds (INT) DEFAULT 60
pingInterval (INT) DEFAULT 25
register (BOOLEAN) DEFAULT true
isActive (BOOLEAN) DEFAULT true
createdAt (TIMESTAMP)
updatedAt (TIMESTAMP)
deployedAt (TIMESTAMP) NULLABLE
```

#### `did_inventory`
```sql
id (UUID) PRIMARY KEY
didNumber (VARCHAR 20) UNIQUE
trunkId (UUID) FK → sip_trunks
assignedToOrganizationId (UUID) FK → organizations NULLABLE
assignedAt (TIMESTAMP) NULLABLE
status (ENUM: available, assigned, retired, blocked)
createdAt (TIMESTAMP)
```

#### `organization_dids`
```sql
id (UUID) PRIMARY KEY
organizationId (UUID) FK → organizations
didInventoryId (UUID) FK → did_inventory
name (VARCHAR 100)
description (TEXT) NULLABLE
destinationType (ENUM: agent, queue, ivr, announcement, hangup)
destinationTarget (VARCHAR 100) NULLABLE
stickyAgentEnabled (BOOLEAN) DEFAULT false
recordingEnabled (BOOLEAN) DEFAULT true
isActive (BOOLEAN) DEFAULT false
createdAt (TIMESTAMP)
updatedAt (TIMESTAMP)
deployedAt (TIMESTAMP) NULLABLE
```

#### `campaigns`
```sql
id (UUID) PRIMARY KEY
organizationId (UUID) FK
didId (UUID) FK → organization_dids
name (VARCHAR 100)
description (TEXT) NULLABLE
type (ENUM: inbound, outbound, ivr)
scriptId (UUID) FK → agent_scripts NULLABLE
dispositionListId (UUID) FK NULLABLE
status (ENUM: draft, active, paused, completed) DEFAULT draft
dialerMode (ENUM: manual, preview, progressive, predictive) DEFAULT manual
maxConcurrentCalls (INT) DEFAULT 1
dailyCallLimit (INT) NULLABLE
startDate (TIMESTAMP) NULLABLE
endDate (TIMESTAMP) NULLABLE
leadCount (INT) DEFAULT 0
callCount (INT) DEFAULT 0
createdAt (TIMESTAMP)
updatedAt (TIMESTAMP)
activatedAt (TIMESTAMP) NULLABLE
```

#### `leads`
```sql
id (UUID) PRIMARY KEY
organizationId (UUID) FK
campaignId (UUID) FK
phoneNumber (VARCHAR 20)
firstName (VARCHAR 50) NULLABLE
lastName (VARCHAR 50) NULLABLE
email (VARCHAR 100) NULLABLE
customData (JSONB) NULLABLE
status (ENUM: new, attempted, reached, not_reached, callback, dnd) DEFAULT new
attempts (INT) DEFAULT 0
lastAttemptAt (TIMESTAMP) NULLABLE
nextRetryAt (TIMESTAMP) NULLABLE
disposition (VARCHAR 50) NULLABLE
notes (TEXT) NULLABLE
createdAt (TIMESTAMP)
updatedAt (TIMESTAMP)
```

#### `calls`
```sql
id (UUID) PRIMARY KEY
organizationId (UUID) FK
campaignId (UUID) FK NULLABLE
leadId (UUID) FK NULLABLE
agentId (UUID) FK → users
direction (ENUM: inbound, outbound)
phoneNumber (VARCHAR 20)
callerId (VARCHAR 20) NULLABLE
status (ENUM: initiated, ringing, answered, ended, failed) DEFAULT initiated
fsUuid (VARCHAR 100) NULLABLE
startedAt (TIMESTAMP) DEFAULT now()
answeredAt (TIMESTAMP) NULLABLE
endedAt (TIMESTAMP) NULLABLE
durationSeconds (INT) NULLABLE
recordingUrl (TEXT) NULLABLE
disposition (VARCHAR 50) NULLABLE
notes (TEXT) NULLABLE
createdAt (TIMESTAMP)
```

#### `call_events`
```sql
id (UUID) PRIMARY KEY
callId (UUID) FK → calls
eventType (VARCHAR 50)
fsUuid (VARCHAR 100) NULLABLE
data (JSONB) NULLABLE
createdAt (TIMESTAMP)
```

#### `dnd_list`
```sql
id (UUID) PRIMARY KEY
organizationId (UUID) FK
phoneNumber (VARCHAR 20)
reason (TEXT) NULLABLE
expiresAt (TIMESTAMP) NULLABLE
createdAt (TIMESTAMP)
```

---

## API Specification

### oRPC Endpoints (Hono)

#### Admin Namespace: `/admin/*`

```typescript
// Trunks
POST   /admin/sip-trunks               createSipTrunk
GET    /admin/sip-trunks               listSipTrunks
PATCH  /admin/sip-trunks/{id}          updateSipTrunk
DELETE /admin/sip-trunks/{id}          deleteSipTrunk
POST   /admin/sip-trunks/{id}/test     testSipTrunk
POST   /admin/sip-trunks/{id}/deploy   deploySipTrunk

// DID Inventory
POST   /admin/dids                      importDids
GET    /admin/dids                      listDids
PATCH  /admin/dids/{id}                 updateDidStatus
POST   /admin/dids/{id}/assign          assignDidToOrg

// Organizations
GET    /admin/organizations             listOrganizations
POST   /admin/organizations             createOrganization
```

#### Dialer Namespace: `/dialer/*`

```typescript
// DIDs (Org-level)
GET    /dialer/dids                     listMyDids
PATCH  /dialer/dids/{id}/config         configureDidRouting
PATCH  /dialer/dids/{id}/status         toggleDidStatus

// Campaigns
POST   /dialer/campaigns                createCampaign
GET    /dialer/campaigns                listCampaigns
PATCH  /dialer/campaigns/{id}           updateCampaign
POST   /dialer/campaigns/{id}/activate  activateCampaign
POST   /dialer/campaigns/{id}/pause     pauseCampaign

// Leads
POST   /dialer/leads/import             importLeads
GET    /dialer/leads                    listLeads
PATCH  /dialer/leads/{id}/status        updateLeadStatus
POST   /dialer/leads/bulk-update        bulkUpdateLeads

// Calls
POST   /dialer/calls/start              startCall
POST   /dialer/calls/{id}/hangup        hangupCall
GET    /dialer/calls/history            getCallHistory
GET    /dialer/calls/{id}/download      downloadRecording

// Resources
POST   /dialer/scripts                  createScript
GET    /dialer/scripts                  listScripts
POST   /dialer/dispositions             createDispositionList
```

---

## System Integration Points

### 1. FreeSWITCH Integration (ESL + SSH)

**Connection Points:**
- ESL Port: 8021 (event socket)
- SSH: Port 22 (config deployment)
- SIP Ports: 5060 (internal), 5080 (external)
- RTP Ports: 16384-32768 (media)

**Sync Flow:**
```
DB Change → RabbitMQ → Config Sync Service
  ↓
Generates XML files
  ↓
SSH deploys to /usr/local/freeswitch/conf/
  ↓
Reloads FreeSWITCH config (sofia profile rescan)
  ↓
Changes live
```

**Event Flow:**
```
FreeSWITCH Call Event
  ↓
ESL Listener (SIP Worker)
  ↓
Parses event (CHANNEL_CREATE, CHANNEL_ANSWER, CHANNEL_HANGUP)
  ↓
Updates PostgreSQL
  ↓
Publishes to Soketi (WebSocket)
  ↓
Agent browser receives update (real-time)
```

### 2. RabbitMQ Integration

**Queues:**
- `dialer.call.request` — Initiate outbound call
- `dialer.call.hangup` — End call
- `dialer.config.changed` — Config update detected
- `dialer.events.publish` — Call events for real-time

**Message Format (example):**
```json
{
  "type": "call.request",
  "callId": "uuid",
  "phoneNumber": "+919876543210",
  "agentExtension": "1001",
  "didNumber": "+914226628808"
}
```

### 3. File Storage Integration (S3)

**Use Cases:**
- Store call recordings
- Presigned URLs for downloads
- Access control (org-specific bucket paths)

**Structure:**
```
s3://work-holo-recordings/
  {organizationId}/
    {campaignId}/
      {callId}_{timestamp}.wav
```

---

## Testing Requirements

### Unit Tests

| Module | Coverage Target |
|--------|-----------------|
| API Handlers | > 80% |
| Business Logic | > 90% |
| Database Queries | > 85% |
| Utilities | > 95% |

### Integration Tests

- ✅ API → Database (CRUD operations)
- ✅ API → FreeSWITCH (config deployment)
- ✅ API → RabbitMQ (message publishing)
- ✅ SIP Worker → FreeSWITCH (event listening)
- ✅ Lead import → Database validation

### End-to-End Tests

- ✅ Admin provisions DID → Org sees it → Org configures it → Calls route
- ✅ Agent dials lead → Call connects → Recording saved → History visible
- ✅ Campaign created → Leads imported → Campaign activated → Agents can call

### Performance Tests

- ✅ 1000 concurrent API requests
- ✅ 100 calls/second sustained
- ✅ Database query performance (< 500ms)
- ✅ Bulk lead import (100K rows in < 2 min)

### Security Tests

- ✅ SQL injection attempts
- ✅ XSS attempts
- ✅ CSRF token validation
- ✅ Multi-tenant data isolation
- ✅ Unauthorized access attempts

---

## Deployment Requirements

### Environment Setup

**Production VPS:**
- OS: Ubuntu 22.04 LTS
- CPU: 4 vCPU
- RAM: 8 GB
- Storage: 500 GB (grows 40%/month)
- Network: Public static IP

**Services:**
- PostgreSQL 14+
- RabbitMQ 3.12+
- Redis 7.0+
- FreeSWITCH 1.10.x
- Bun runtime (backend)
- Node.js 20+ (if needed)

### CI/CD Pipeline

1. **Code Push** → GitHub
2. **Tests Run** (unit, integration)
3. **Build** (compile TypeScript, bundle assets)
4. **Deploy to Staging** (test environment)
5. **Smoke Tests** (API health, DB connectivity)
6. **Deploy to Production** (blue-green or canary)
7. **Health Checks** (monitor system after deploy)

### Monitoring & Logging

- ✅ Application logs (Winston/Pino)
- ✅ Database query logs
- ✅ API request logs (duration, status)
- ✅ FreeSWITCH logs
- ✅ RabbitMQ monitoring
- ✅ System metrics (CPU, RAM, disk)
- ✅ Alerting (PagerDuty, Slack, email)

### Backup & Recovery

- ✅ Daily database backups (retention: 30 days)
- ✅ Recording backups (retention: 90 days)
- ✅ Configuration backups (daily)
- ✅ Disaster recovery plan (RTO: 1 hour)

---

## Acceptance Criteria

### Phase 1 Acceptance

**Admin Can:**
- ✅ Add SIP trunk and verify registration
- ✅ Bulk import DIDs to inventory
- ✅ Assign DIDs to organizations
- ✅ View DID status and assignments

**Organization Can:**
- ✅ View assigned DIDs
- ✅ Configure DID routing (agent/queue)
- ✅ Enable/disable DIDs
- ✅ See changes live on FreeSWITCH

**Technical:**
- ✅ Zero manual config needed for new DID
- ✅ Config syncs to FreeSWITCH < 30 sec
- ✅ Test calls route correctly
- ✅ Calls recorded automatically
- ✅ 99.9% system uptime in testing

---

**End of SRS Document**
