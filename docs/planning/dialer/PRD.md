# Work Holo Dialer System
## Product Requirements Document (PRD)

**Document Version:** 1.0  
**Last Updated:** April 2026  
**Status:** In Development  
**Author:** Work Holo Product Team  

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Product Vision](#product-vision)
3. [Goals & Objectives](#goals--objectives)
4. [Scope](#scope)
5. [System Architecture](#system-architecture)
6. [User Personas & Roles](#user-personas--roles)
7. [Core Features](#core-features)
8. [User Workflows](#user-workflows)
9. [Functional Requirements](#functional-requirements)
10. [Non-Functional Requirements](#non-functional-requirements)
11. [Data & Integrations](#data--integrations)
12. [Success Metrics](#success-metrics)
13. [Implementation Roadmap](#implementation-roadmap)

---

## Executive Summary

Work Holo Dialer is a **multi-tenant communication workflow platform** that enables organizations to manage inbound and outbound calls through a web-based dashboard. 

**Problem:** Currently, configuring phone numbers, SIP trunks, and call routing requires manual SSH access to servers and XML file editing. This is:
- Error-prone (typos break calls)
- Not scalable (supporting 100+ organizations is impossible)
- Requires technical expertise (not accessible to business users)
- Has no audit trail (who changed what and when?)

**Solution:** A two-tier dashboard system where:
- **Platform Admins** manage infrastructure (SIP trunks, phone numbers)
- **Organizations** configure their own call routing and run campaigns

**Key Benefit:** Organizations can manage entire calling operations without touching code or servers.

---

## Product Vision

Build a **self-service, scalable dialer platform** where:

1. Organizations can **buy or be assigned phone numbers** (DIDs)
2. Organizations can **configure how calls route** without technical help
3. Organizations can **create and manage campaigns** (inbound/outbound)
4. Organizations can **track and report on calls**
5. All configuration is **automatic and synchronized** to the FreeSWITCH phone system

---

## Goals & Objectives

### Primary Goals

| Goal | Why It Matters |
|------|----------------|
| **Eliminate Manual Config** | No more SSH, no more XML editing, no more downtime |
| **Enable Multi-Tenant** | One platform can serve 100+ organizations safely |
| **Self-Service** | Orgs manage themselves; support burden drops 80% |
| **Scalability** | Add new orgs/DIDs instantly without infrastructure changes |
| **Auditability** | Track all changes (who, what, when) for compliance |
| **Reliability** | Phone calls work every time, no surprises |

### Success Metrics

- ✅ Organizations can configure a DID in **< 2 minutes**
- ✅ Zero **manual FreeSWITCH config** needed per new DID
- ✅ **100+ organizations** can operate on one platform safely
- ✅ **99.9% call success rate** (calls complete as configured)
- ✅ **Zero config-related incidents** (no broken routing due to typos)
- ✅ **Full audit trail** of all configuration changes

---

## Scope

### What's Included (MVP)

| Feature | Status | Details |
|---------|--------|---------|
| **SIP Trunk Management** | ✅ In Scope | Add/manage SIP providers (CloudBharat, Telnyx, etc.) |
| **DID Provisioning & Assignment** | ✅ In Scope | Admin provisions DIDs, assigns to orgs |
| **DID Routing Configuration** | ✅ In Scope | Org configures: route to agent, queue, or hangup |
| **Inbound Call Handling** | ✅ In Scope | Calls arrive on assigned DIDs, route automatically |
| **Outbound Call Initiation** | ✅ In Scope | Agents click-to-call from dashboard |
| **Campaign Management** | ✅ In Scope | Create campaigns, assign DIDs, manage leads |
| **Lead Import & Management** | ✅ In Scope | Upload lead lists, track call status per lead |
| **Call Recording** | ✅ In Scope | Auto-record calls, store metadata |
| **Call History & Logs** | ✅ In Scope | View past calls, export data |
| **Disposition Tracking** | ✅ In Scope | Tag calls (e.g., "Interested", "Callback", "Wrong Number") |
| **Automatic Config Sync** | ✅ In Scope | Changes push to FreeSWITCH automatically |
| **Multi-Tenant Isolation** | ✅ In Scope | Each org sees only their own data |

### What's Excluded (Future Phases)

| Feature | When | Reason |
|---------|------|--------|
| **IVR (Interactive Voice Response)** | Phase 2+ | Complex, can build later |
| **TTS (Text-to-Speech)** | Phase 3+ | Requires API integration |
| **Call Announcements** | Phase 2+ | Pre-call recordings, can add after basic routing |
| **Call Surveys (CSAT)** | Phase 3+ | Post-call feedback, requires separate workflow |
| **Predictive Dialing** | Phase 4+ | Requires AI/ML, out of scope for MVP |
| **Skill-Based Routing** | Phase 3+ | Route based on agent skills, can build later |
| **Advanced Analytics/Reporting** | Phase 2+ | Charts/dashboards, MVP just needs basic logs |

---

## System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        END USERS                                    │
│  (Platform Admin)          (Organization Users)    (Agents)         │
│      │                              │                  │             │
└──────┼──────────────────────────────┼──────────────────┼─────────────┘
       │                              │                  │
       │                              │                  │
┌──────▼──────────────────────────────▼──────────────────▼─────────────┐
│                      WORK HOLO WEB APPLICATION                       │
│  (React + TypeScript)                                                 │
│  ├─ Admin Dashboard (Platform Admin only)                            │
│  │  └─ SIP Trunk Manager                                             │
│  │  └─ DID Inventory Manager                                         │
│  │  └─ Organization Management                                       │
│  │                                                                    │
│  ├─ Organization Dashboard (Per-org interface)                       │
│  │  └─ DID Configuration                                             │
│  │  └─ Campaign Manager                                              │
│  │  └─ Lead Management                                               │
│  │  └─ Call History & Reports                                        │
│  │                                                                    │
│  └─ Agent Interface                                                  │
│     └─ Click-to-Call                                                 │
│     └─ Active Call Dashboard                                         │
│     └─ Disposition Tracker                                           │
└──────┬──────────────────────────────────────────────────────────────┘
       │
       │ (oRPC API calls)
       │
┌──────▼──────────────────────────────────────────────────────────────┐
│                      HONO API SERVER                                 │
│  (Node.js Backend)                                                   │
│  ├─ dialer.admin.*                (Admin operations)                 │
│  ├─ dialer.org.*                  (Org operations)                   │
│  ├─ dialer.campaigns.*             (Campaign CRUD)                   │
│  ├─ dialer.leads.*                 (Lead management)                 │
│  ├─ dialer.calls.*                 (Call operations)                 │
│  └─ dialer.resources.*             (Scripts, dispositions, etc.)    │
└──────┬──────────────────────────────────────────────────────────────┘
       │
       ├─────────────────────┬──────────────────────┬──────────────────┐
       │                     │                      │                  │
┌──────▼────────┐   ┌────────▼───────┐   ┌────────▼────────┐   ┌──────▼──────┐
│  PostgreSQL   │   │   RabbitMQ     │   │     Redis       │   │  File       │
│  Database     │   │   (Job Queue)  │   │   (Cache/State) │   │  Storage    │
│               │   │                │   │                 │   │  (S3/etc)   │
│ • DIDs        │   │ • Call Requests│   │ • Agent Status  │   │             │
│ • Campaigns   │   │ • Config Syncs │   │ • Live Calls    │   │ • Call      │
│ • Leads       │   │ • Hangups      │   │ • Agent Queues  │   │   Recordings│
│ • Calls       │   │                │   │                 │   │             │
│ • Config Trail│   │                │   │                 │   │             │
└───────────────┘   └────────────────┘   └─────────────────┘   └─────────────┘
       │                     │                      │                  │
       │                     │                      │                  │
       │              ┌──────▼─────────┐            │                  │
       │              │                │            │                  │
       │         ┌────▼────────┐  ┌────▼────────┐   │                  │
       │         │ Config Sync │  │ SIP Worker  │   │                  │
       │         │ Service     │  │ (ESL)       │   │                  │
       │         │             │  │             │   │                  │
       │         │ • Watches   │  │ • Listens   │   │                  │
       │         │   DB changes│  │   for calls │   │                  │
       │         │ • Generates │  │ • Triggers  │   │                  │
       │         │   XML       │  │   originate │   │                  │
       │         │ • Deploys   │  │ • Publishes │   │                  │
       │         │   to VPS    │  │   events    │   │                  │
       │         │ • Reloads   │  │             │   │                  │
       │         │   FreeSW.   │  │             │   │                  │
       │         └────┬────────┘  └────┬────────┘   │                  │
       │              │                │            │                  │
       └──────────────┼────────────────┼────────────┼──────────────────┘
                      │                │            │
                      │ (SSH)          │ (ESL 8021) │
                      │                │            │
       ┌──────────────▼────────────────▼────────────▼──────────────────┐
       │                                                                │
       │         FREESWTICH PHONE SYSTEM                               │
       │         (VPS: 135.181.31.20)                                  │
       │                                                                │
       │  ├─ SIP Profiles (internal + external)                        │
       │  ├─ SIP Gateways (CloudBharat, Telnyx, etc.)                 │
       │  ├─ DID Routing Rules (Dialplan)                             │
       │  ├─ Agent Extensions (SIP Users)                             │
       │  ├─ Call Recording                                           │
       │  └─ Real-time Call Events                                    │
       │                                                                │
       └──────────────┬─────────────────┬──────────────────────────────┘
                      │                 │
                      │ (SIP 5060/5080) │
                      │                 │
       ┌──────────────▼──┐   ┌──────────▼────────────┐
       │                 │   │                       │
       │  SIP TRUNKS     │   │  AGENT SOFTPHONES     │
       │  (CloudBharat   │   │  (Zoiper, browser)    │
       │   Telnyx, etc)  │   │                       │
       │                 │   └───────────┬───────────┘
       │     ↕           │               │
       │  PSTN/Caller    │          Agent
       │                 │
       └─────────────────┘
```

### Key System Components

1. **Frontend (Web Application)**
   - React-based dashboard
   - Two main sections: Admin Panel + Organization Panel
   - Real-time call status updates

2. **Backend API (Hono Server)**
   - oRPC endpoints for all operations
   - Handles all business logic
   - Enforces security & isolation

3. **Database (PostgreSQL)**
   - Stores all configuration and operational data
   - Multi-tenant data model
   - Full audit trail

4. **Message Queue (RabbitMQ)**
   - Decouples API from long-running operations
   - Call requests go here → SIP Worker processes them

5. **Cache Layer (Redis)**
   - Agent status tracking (online/offline/on-call)
   - Active call state
   - Session management

6. **Config Sync Service**
   - Watches database for changes
   - Generates FreeSWITCH XML configs
   - SSH deploys to VPS
   - Triggers FreeSWITCH reload

7. **SIP Worker**
   - Connects to FreeSWITCH via ESL (Event Socket Layer)
   - Listens for call events
   - Publishes real-time updates to frontend

8. **FreeSWITCH (VPS)**
   - Actual phone system
   - Routes calls based on configuration
   - Records calls
   - Emits call events

---

## User Personas & Roles

### 1. Platform Admin (Super Admin)

**Who:** Work Holo employee or authorized platform manager

**Responsibilities:**
- Manage SIP trunk credentials and providers
- Provision phone numbers (DIDs)
- Allocate DIDs to organizations
- View platform-wide statistics
- Manage critical infrastructure

**Permissions:**
- ✅ Create/edit SIP trunks
- ✅ Add/edit DIDs to inventory
- ✅ Assign DIDs to organizations
- ✅ View all organizations and their usage
- ✅ Access audit logs
- ❌ Cannot modify organization data directly

**Use Case Example:**
> "I have 50 new phone numbers from Telnyx. I'll add them to the system and assign 5 to Acme Corp, 10 to TechCorp, and hold 35 for new customers."

---

### 2. Organization Admin

**Who:** Manager at a customer organization (e.g., Sales Manager at Acme Corp)

**Responsibilities:**
- Configure assigned DIDs for their organization
- Create and manage campaigns
- Set up call routing (which queue, which agent, etc.)
- Manage team members' access
- View organization-level reports

**Permissions:**
- ✅ View/configure their assigned DIDs
- ✅ Create campaigns
- ✅ Upload and manage leads
- ✅ Create inbound queues
- ✅ Create disposition lists
- ✅ Create agent scripts
- ❌ Cannot assign new DIDs (request from platform admin)
- ❌ Cannot access other orgs' data

**Use Case Example:**
> "We have 3 assigned phone numbers. I'll set up one for support (route to queue), one for sales (route to specific agent), and keep one inactive. Now I'll upload 5,000 leads and start a campaign."

---

### 3. Agent (Call Handler)

**Who:** Employee making/receiving calls (e.g., Sales Rep, Support Agent)

**Responsibilities:**
- Take calls or make outbound calls
- Log disposition (outcome) of each call
- Follow scripts
- Update lead information

**Permissions:**
- ✅ See their assigned calls
- ✅ Click-to-call
- ✅ View call scripts
- ✅ Log disposition
- ❌ Cannot configure anything
- ❌ Cannot access other agents' data

**Use Case Example:**
> "I see 10 leads assigned to me. I'll call the first one. The script tells me to introduce myself and ask about budget. Call connects, script displays. After the call, I mark it as 'Interested - Callback'."

---

## Core Features

### Feature 1: SIP Trunk Management

**Who Uses:** Platform Admin  
**What It Does:** Manage connections to phone providers

#### Description
A SIP trunk is the connection from Work Holo to the actual phone system (e.g., CloudBharat, Telnyx). Each trunk has:
- Provider name (CloudBharat, Telnyx, etc.)
- SIP username & password
- Proxy server address
- Connection settings

#### Key Functionality

| Action | Description |
|--------|------------|
| **Add Trunk** | Platform admin adds a new SIP trunk (one per provider) |
| **Edit Trunk** | Update credentials, proxy, settings |
| **Enable/Disable** | Turn trunk on/off without deleting |
| **View Status** | Check if trunk is registered and working |
| **Test Connection** | Verify credentials are correct |

#### Information Displayed

- Trunk name (e.g., "CloudBharat Main", "Telnyx Backup")
- Provider
- Current status (Registered / Not Registered / Error)
- Date created
- Last deployment date
- Active/Inactive toggle

#### Business Rules

- ✅ Each SIP provider can have multiple trunks (for redundancy)
- ✅ A trunk can serve multiple organizations
- ✅ Changes deploy automatically to FreeSWITCH
- ❌ Deleting a trunk with active DIDs is blocked
- ❌ Credentials are encrypted in the database

---

### Feature 2: DID Inventory & Assignment

**Who Uses:** Platform Admin (Inventory) → Organization (Usage)  
**What It Does:** Manage phone number pool and distribute to orgs

#### Description
DIDs (Direct Inward Dialing numbers) are the actual phone numbers (e.g., +914226628808). They come from SIP providers and are assigned to organizations to use.

#### Workflow

```
Step 1: Platform Admin Adds DIDs to Inventory
        └─ Buys/imports phone numbers from provider
        └─ Numbers are unassigned, ready for allocation

Step 2: Platform Admin Assigns DID to Organization
        └─ "This number goes to Acme Corp"
        └─ Organization now owns this number

Step 3: Organization Configures Their DID
        └─ "This number routes to our support queue"
        └─ Configuration is automatic
```

#### Key Functionality

| Action | Who | Description |
|--------|-----|-------------|
| **Add DIDs to Inventory** | Admin | Bulk upload phone numbers from provider |
| **Assign to Organization** | Admin | Give a DID to an organization |
| **View Inventory** | Admin | See all DIDs, their status, assignments |
| **View My DIDs** | Org | See DIDs assigned to me |
| **Configure Routing** | Org | Set where calls to this DID go |
| **Enable/Disable** | Org | Turn a DID on/off |
| **View DID Status** | Both | See if calls are working |

#### Information Displayed (Admin View)

- Phone number (e.g., +914226628808)
- SIP trunk it uses
- Status (Available, Assigned, Retired, Blocked)
- Assigned organization (if any)
- Date added
- Date assigned

#### Information Displayed (Org View)

- Phone number
- Friendly name (e.g., "Sales Main Line")
- Description
- Current routing (Agent, Queue, or Hangup)
- Recording enabled (Yes/No)
- Active status
- Last configuration change

#### Business Rules

- ✅ Admin can assign any available DID to any org
- ✅ Org can configure multiple DIDs differently
- ✅ One DID belongs to exactly one org
- ✅ Org can retire/disable a DID without deleting it
- ❌ Org cannot assign themselves new DIDs (request from admin)
- ❌ Org cannot see other orgs' DIDs
- ❌ DIDs cannot be moved between orgs once assigned

---

### Feature 3: DID Routing Configuration

**Who Uses:** Organization Admin  
**What It Does:** Set where incoming calls go

#### Description
When someone calls an assigned DID, where should the call go? This feature lets orgs define routing rules.

#### Routing Options

| Option | What Happens | When to Use |
|--------|--------------|------------|
| **Route to Agent** | Call rings a specific agent's phone | VIP clients, dedicated account managers |
| **Route to Queue** | Call joins a waiting queue, next available agent answers | Support, sales, general inquiries |
| **Route to Hangup** | Call ends immediately | Temporarily disabled numbers, parked |
| **Route to IVR** | Call hears menu, presses button to choose | Large orgs, multiple departments (Phase 2+) |

#### Configuration Screen

```
┌─────────────────────────────────────┐
│  Configure Routing for DID: +91XXXX │
├─────────────────────────────────────┤
│                                     │
│  Friendly Name:  [Sales Main Line]  │
│  Description:    [Support queue]    │
│                                     │
│  Routing Option:                    │
│  ○ Route to Specific Agent          │
│    [Select Agent: Agent John]        │
│                                     │
│  ○ Route to Queue                   │
│    [Select Queue: Support Queue]     │
│                                     │
│  ○ Route to Hangup                  │
│                                     │
│  ○ Route to IVR (Phase 2+)          │
│    [Select IVR: Main Menu]           │
│                                     │
│  Features:                          │
│  ☑ Recording Enabled                │
│  ☑ Sticky Agent (Route returning    │
│     callers to same agent)          │
│                                     │
│  Status: ☑ Active                   │
│                                     │
│  [Save] [Cancel]                    │
└─────────────────────────────────────┘
```

#### Business Rules

- ✅ Every active DID must have a routing destination
- ✅ Recording is enabled by default
- ✅ Changes apply immediately to FreeSWITCH
- ✅ Org can change routing anytime
- ❌ Cannot route to agent/queue that doesn't belong to org
- ❌ Cannot route to deleted/inactive agent or queue

---

### Feature 4: Campaign Management

**Who Uses:** Organization Admin  
**What It Does:** Create and manage calling campaigns

#### Description
A campaign is a coordinated calling operation. Examples:
- **Outbound:** "Call 5,000 leads about our new product"
- **Inbound:** "Support team handles all calls to this DID"

#### Campaign Types

| Type | Direction | Purpose |
|------|-----------|---------|
| **Outbound** | Agent calls lead | Sales calls, surveys, follow-ups |
| **Inbound** | Customer calls in | Support, inquiries, callbacks |
| **IVR** | Automated routing | Large call volumes, self-service (Phase 2+) |

#### Campaign Information

| Field | Description | Example |
|-------|-------------|---------|
| Name | Campaign identifier | "Q2 Sales Blitz" |
| Type | Outbound / Inbound | Outbound |
| Status | Draft / Active / Paused / Completed | Active |
| Assigned DID | Which phone number | +914226628808 |
| Assigned Script | Calling script for agents | "Product Intro v3" |
| Disposition List | Possible call outcomes | "Sales Dispositions" |
| Lead Count | Number of leads | 5,432 |
| Calls Made | How many calls completed | 1,203 |
| Start Date | When campaign starts | 2026-04-10 |
| End Date | When campaign ends | 2026-04-30 |

#### Campaign Workflow

```
1. Create Campaign
   ├─ Name it
   ├─ Choose type (Outbound/Inbound)
   ├─ Assign a DID
   ├─ Assign script & dispositions
   └─ Set date range

2. Upload Leads
   ├─ Import CSV with phone numbers
   ├─ Add custom fields (name, email, etc)
   └─ Review before importing

3. Activate Campaign
   ├─ Agents see leads in their queue
   ├─ Click-to-call initiates dials
   └─ All calls route through assigned DID

4. Track & Disposition
   ├─ Agent notes outcome
   ├─ Lead status updates
   └─ Call recorded & logged

5. Review Results
   ├─ View call history
   ├─ Export disposition report
   └─ Analyze success rate
```

#### Business Rules

- ✅ Campaign must have a valid, assigned DID
- ✅ Org can run multiple campaigns in parallel
- ✅ Leads can only be in one campaign
- ✅ Campaign can be paused/resumed anytime
- ❌ Cannot delete campaign (only complete/archive)
- ❌ Cannot use DIDs from other orgs
- ❌ Cannot start campaign without leads

---

### Feature 5: Lead Management

**Who Uses:** Organization Admin, Agents  
**What It Does:** Upload, track, and manage contact lists

#### Description
Leads are the people to call (or who will call you). Each lead has:
- Phone number
- Name (optional)
- Email (optional)
- Custom fields (any data relevant to your business)

#### Lead Statuses

| Status | Meaning | Next Action |
|--------|---------|------------|
| **New** | Not called yet | Waiting for agent |
| **Attempted** | Agent called, reached voicemail | Retry later |
| **Reached** | Agent spoke with person | Take disposition |
| **Not Reached** | Called multiple times, no answer | Archive or retry |
| **Callback** | Person requested callback | Schedule retry |
| **DND** | Do Not Disturb / Blocked | Never call again |
| **Completed** | Call successful, no further action | Archive |

#### Import Workflow

```
Step 1: Org Admin prepares CSV
        └─ Columns: Phone, First Name, Last Name, Email, Custom Fields

Step 2: Upload to Campaign
        └─ System validates phone numbers
        └─ Shows preview of 10 rows
        └─ Org confirms import

Step 3: Leads available to agents
        └─ Agents see list in UI
        └─ Click to dial next lead
        └─ Disposition automatically updates status
```

#### Example CSV Format

```csv
phone_number,first_name,last_name,email,company,budget
+919876543210,John,Doe,john@example.com,Acme Corp,50000
+919876543211,Jane,Smith,jane@example.com,TechCorp,100000
+919876543212,Bob,Johnson,bob@example.com,DataInc,25000
```

#### Business Rules

- ✅ Phone numbers must be in valid format
- ✅ Duplicate phone numbers in same campaign are prevented
- ✅ Orgs can view only their own leads
- ✅ Leads are linked to specific campaigns
- ❌ Cannot import leads to campaigns from other orgs
- ❌ Cannot modify lead phone number after import
- ✅ Can update notes/custom fields anytime

---

### Feature 6: Call Operations

**Who Uses:** Agents  
**What It Does:** Make/receive calls and track outcomes

#### Description
Agents use the system to call leads or receive customer calls. Every call is tracked, recorded, and logged.

#### Outbound Call Flow (Agent Calls Lead)

```
1. Agent opens campaign dashboard
   └─ Sees list of uncontacted leads

2. Agent selects a lead
   └─ Script displays
   └─ Lead information visible

3. Agent clicks "Call Now"
   └─ System dials through assigned DID
   └─ Lead's phone rings (via our SIP trunk)
   └─ Call connects to agent's extension

4. Call In Progress
   └─ Call timer shows duration
   └─ Agent can see lead details
   └─ Agent reads script
   └─ Recording happens automatically

5. Call Ends (agent hangup or customer hangup)
   └─ Disposition prompt appears
   └─ Agent selects outcome (e.g., "Interested", "Callback", etc)
   └─ Agent can add notes
   └─ Lead status updates

6. Recording Available
   └─ Call recording stored
   └─ Accessible in call history
```

#### Inbound Call Flow (Customer Calls In)

```
1. Customer dials assigned DID (+914226628808)
   └─ Calls arrive at SIP trunk

2. FreeSWITCH receives call
   └─ Checks DID configuration
   └─ Routes based on setting (Queue or Agent)

3. If Queue:
   └─ Call enters queue
   └─ Waits for next available agent
   └─ Agent's phone rings

4. If Agent:
   └─ Call rings that agent directly

5. Agent Answers
   └─ Call connects
   └─ CRM shows caller info (if known lead)
   └─ Script may display

6. After Call
   └─ Agent logs notes
   └─ Marks disposition
   └─ Recording saved
```

#### Call Information Logged

| Information | Purpose |
|-------------|---------|
| Call ID | Unique identifier |
| Campaign | Which campaign this call belongs to |
| Lead Phone | Who was called |
| Agent | Who took the call |
| Direction | Inbound or Outbound |
| Status | Initiated / Ringing / Answered / Ended / Failed |
| Start Time | When call began |
| End Time | When call ended |
| Duration | Total seconds on call |
| Disposition | Outcome (Interested, Not Interested, etc) |
| Recording URL | Link to call recording |
| Notes | Agent's notes |

#### Business Rules

- ✅ All calls recorded by default (can be disabled per campaign)
- ✅ Agent can only see calls from their campaigns
- ✅ Disposition is mandatory before lead can be re-assigned
- ✅ Call history is immutable (no editing previous calls)
- ✅ Agents can add notes to calls anytime
- ❌ Cannot delete calls (only archive)
- ❌ Cannot re-assign lead to different agent mid-call

---

### Feature 7: Disposition Tracking

**Who Uses:** Organization Admin (Setup), Agents (Usage)  
**What It Does:** Track outcomes of calls

#### Description
A disposition is the result/outcome of a call. Examples: "Interested", "Not Interested", "Callback", "Wrong Number", "DND (Do Not Call)".

#### Disposition List Setup

Organization admin creates a custom list of dispositions for their business:

```
┌────────────────────────────────┐
│ Create Disposition List        │
├────────────────────────────────┤
│                                │
│ List Name: [Sales Dispositions]│
│                                │
│ Dispositions:                  │
│ ☑ Interested (positive)        │
│ ☑ Interested-Later (positive)  │
│ ☑ Not Interested (negative)    │
│ ☑ Wrong Number (negative)      │
│ ☑ Callback-Tomorrow (neutral)  │
│ ☑ DND (negative)               │
│                                │
│ [Save]                         │
└────────────────────────────────┘
```

#### Using Dispositions in Calls

After a call, agent selects disposition:

```
┌──────────────────────────────┐
│ How Did The Call Go?         │
├──────────────────────────────┤
│                              │
│ ○ Interested                 │
│ ○ Interested-Later           │
│ ○ Not Interested             │
│ ○ Wrong Number               │
│ ○ Callback-Tomorrow          │
│ ○ DND (Do Not Call)          │
│                              │
│ Notes: [            ]        │
│                              │
│ [Save Disposition]           │
└──────────────────────────────┘
```

#### Business Rules

- ✅ Each org can create custom disposition lists
- ✅ Multiple disposition lists per org (for different teams/campaigns)
- ✅ Agent must select disposition before moving to next lead
- ✅ Disposition updates lead status automatically
- ✅ "DND" disposition automatically blocks future calls to that number
- ❌ Cannot delete disposition if used in past calls
- ❌ Cannot change a call's disposition if call is archived

---

### Feature 8: Call Recording & History

**Who Uses:** Organization Admin, Agents, Compliance  
**What It Does:** Store and manage call recordings and logs

#### Description
Every call is automatically recorded and stored. Organizations can:
- Listen to recordings
- Export call history
- Search by date, agent, lead, disposition
- Download recordings for compliance/training

#### Call History Features

| Feature | Functionality |
|---------|---------------|
| **Search** | Filter by date, agent, lead, disposition, campaign |
| **Sort** | Sort by date, duration, disposition |
| **Export** | Download as CSV for analysis |
| **Listen** | Play recording in browser |
| **Download** | Save .wav file locally |
| **Compliance Export** | All metadata for audit |

#### Information Accessible

```
Call ID: 23847-2847-2847
Campaign: Q2 Sales Blitz
Lead Name: John Doe
Lead Phone: +919876543210
Agent: John Smith
Direction: Outbound
Duration: 4 minutes 32 seconds
Date: 2026-04-10 14:30:00
Status: Answered
Disposition: Interested
Recording: [Play] [Download]
Notes: Customer interested in demo next week
```

#### Business Rules

- ✅ Recordings stored for 90 days (configurable)
- ✅ Agent can mark recording as "Private" (supervisor only)
- ✅ Org can export all call history
- ✅ Recordings cannot be modified (immutable)
- ✅ All call data remains after call is archived
- ❌ Agents cannot delete recordings
- ❌ Org cannot access other org's recordings

---

## User Workflows

### Workflow 1: Platform Admin Provisions a New Organization

**Actors:** Platform Admin, Organization (not involved yet)

```
Step 1: Admin has new phone numbers from provider
        └─ Purchased 20 numbers from CloudBharat
        └─ CSV file: numbers_batch_001.csv

Step 2: Admin adds DIDs to inventory
        └─ Goes to Admin Dashboard > DID Inventory
        └─ Clicks "Import DIDs"
        └─ Uploads CSV (auto-validates format)
        └─ System shows: "20 DIDs added, ready to assign"

Step 3: Admin assigns DIDs to organization
        └─ New customer "Acme Corp" onboarded
        └─ Admin selects 5 DIDs from inventory
        └─ Assigns all 5 to "Acme Corp"
        └─ System deploys routing rules to FreeSWITCH

Step 4: Organization notified
        └─ Acme Corp receives email:
           "5 new phone numbers assigned. Configure them in your dashboard"

Step 5: DIDs are ready
        └─ Acme Corp can now configure these numbers
        └─ No further admin action needed
```

**Outcome:** Acme Corp has 5 phone numbers, ready to use.

---

### Workflow 2: Organization Admin Sets Up Inbound Support Line

**Actors:** Acme Corp Admin, Agents

```
Step 1: Admin logs into organization dashboard
        └─ Sees assigned DID: +914226628808

Step 2: Admin configures the DID
        └─ Navigation: Dialer > DIDs > Configure
        └─ Selects DID +914226628808
        └─ Friendly Name: "Customer Support"
        └─ Routing: "Route to Queue"
        └─ Selects Queue: "Support Team" (created earlier)
        └─ Recording: ON
        └─ Status: ACTIVE
        └─ Saves configuration

Step 3: FreeSWITCH syncs automatically
        └─ Config Sync Service detects change
        └─ Generates XML routing rule
        └─ SSH deploys to VPS
        └─ FreeSWITCH reloads configuration
        └─ DID is now live

Step 4: Customer calls +914226628808
        └─ Call arrives at SIP trunk
        └─ FreeSWITCH receives call
        └─ Looks up DID configuration
        └─ Routes to "Support Team" queue
        └─ Next available agent's phone rings

Step 5: Agent takes call
        └─ Agent logs disposition
        └─ Call recorded and tagged

**Outcome:** All inbound calls to that number automatically route to support queue.

---

### Workflow 3: Agent Calls Leads from Campaign

**Actors:** Organization Admin (setup), Agent (calls), Leads (receive calls)

```
Step 1: Admin creates campaign
        └─ Name: "Q2 Sales Outreach"
        └─ Type: Outbound
        └─ DID: +914226628808 (assigned)
        └─ Script: "Product Intro v3"
        └─ Disposition List: "Sales"
        └─ Status: Active

Step 2: Admin uploads leads
        └─ Uploads CSV: q2_leads.csv
        └─ 5,000 phone numbers
        └─ System validates and imports
        └─ Leads visible in campaign

Step 3: Admin assigns campaign to agent
        └─ Selects Agent: John Smith
        └─ Adds 500 leads to John's queue
        └─ John receives notification

Step 4: Agent logs into dashboard
        └─ Sees campaign "Q2 Sales Outreach"
        └─ Shows 500 assigned leads
        └─ Clicks "Start Calling"

Step 5: Agent dials first lead
        └─ Sees: Phone: +919876543210, Name: Bob Johnson
        └─ Script displays: "Hi Bob, calling from Acme..."
        └─ Clicks "Call Now"
        └─ System dials lead through +914226628808 DID
        └─ Call rings through SIP trunk
        └─ Lead's phone rings (caller ID: +914226628808)

Step 6: Lead answers
        └─ Agent and lead connected
        └─ Recording starts automatically
        └─ Call timer shows duration

Step 7: Agent pitches product
        └─ Follows script
        └─ Takes notes
        └─ Lead says "Interested, send me info"

Step 8: Agent ends call
        └─ Clicks "End Call"
        └─ Disposition prompt: "Interested"
        └─ Adds note: "Sent demo link"
        └─ Lead status updates: "Interested"
        └─ Next lead auto-displays

Step 9: Call recorded
        └─ Recording stored in system
        └─ Available in Call History
        └─ Can be reviewed by supervisor

Step 10: Repeat for all leads
        └─ Agent continues through 500 leads
        └─ Each call tracked and recorded

**Outcome:** 500 calls made, outcomes tracked, all calls recorded.

---

### Workflow 4: Supervisor Reviews Call Quality

**Actors:** Supervisor (admin), Previous calls

```
Step 1: Supervisor opens Call History
        └─ Navigation: Dialer > Call History
        └─ Filters: Agent = "John Smith", Campaign = "Q2 Sales"
        └─ Date Range: Last 7 days
        └─ Shows: 50 calls

Step 2: Selects call to review
        └─ Clicks on call from 2026-04-10 14:30
        └─ Views:
           - Lead: +919876543210 (Bob Johnson)
           - Duration: 4 min 32 sec
           - Disposition: Interested
           - Notes: "Sent demo link"

Step 3: Listens to recording
        └─ Clicks "Play Recording"
        └─ Browser plays audio
        └─ Can listen, scrub, download

Step 4: Adds coaching note
        └─ "Great pitch, good pacing, needs to confirm email"
        └─ Note visible only to supervisor

Step 5: Exports call data
        └─ Selects multiple calls
        └─ "Export as CSV"
        └─ Downloads file for analysis
        └─ Can share with team

**Outcome:** Supervisor reviewed quality, identified training opportunities.

---

## Functional Requirements

### Admin Module (Platform Admin)

#### A. SIP Trunk Management

| Req ID | Requirement | Details |
|--------|-------------|---------|
| ADM-001 | Add SIP Trunk | Admin can add new SIP trunk with provider details |
| ADM-002 | Edit Trunk | Admin can update trunk credentials/settings |
| ADM-003 | Enable/Disable Trunk | Toggle trunk on/off without deleting |
| ADM-004 | View Trunk Status | Show registered/not registered/error state |
| ADM-005 | Test Trunk | Verify trunk connectivity without deploying |
| ADM-006 | List All Trunks | View all configured trunks with status |
| ADM-007 | Delete Trunk | Only if not in use (no active DIDs) |
| ADM-008 | Trunk Validation | System prevents invalid credentials |
| ADM-009 | Encrypted Storage | Passwords encrypted at rest |
| ADM-010 | Audit Log | All trunk changes logged (who, what, when) |

#### B. DID Inventory Management

| Req ID | Requirement | Details |
|--------|-------------|---------|
| ADM-101 | Bulk Add DIDs | Import phone numbers from CSV |
| ADM-102 | Validate DIDs | Check format, prevent duplicates |
| ADM-103 | View Inventory | See all DIDs with status |
| ADM-104 | Search DIDs | Filter by number, status, trunk |
| ADM-105 | Assign DID to Org | Select unassigned DID, assign to org |
| ADM-106 | View Assignments | See which org has which DID |
| ADM-107 | Unassign DID | Remove from org (only if no active routing) |
| ADM-108 | Retire DID | Mark as retired (no longer available) |
| ADM-109 | Block DID | Prevent use (for problematic numbers) |
| ADM-110 | Assignment History | View all assignment changes |

#### C. Platform Administration

| Req ID | Requirement | Details |
|--------|-------------|---------|
| ADM-201 | Manage Organizations | Create, edit, view organizations |
| ADM-202 | View Organization Stats | Member count, DID count, active campaigns |
| ADM-203 | Access Logs | View all platform activity (for security audit) |
| ADM-204 | System Health | Monitor FreeSWITCH, services, databases |
| ADM-205 | Backup Management | Trigger/schedule backups |
| ADM-206 | Configuration Audit | Track all infrastructure changes |

---

### Organization Module (Organization Admin + Agents)

#### A. DID Configuration

| Req ID | Requirement | Details |
|--------|-------------|---------|
| ORG-001 | View My DIDs | See all DIDs assigned to organization |
| ORG-002 | Configure DID | Set routing (agent, queue, hangup) |
| ORG-003 | Set Friendly Name | Name DIDs for easy identification |
| ORG-004 | Enable Recording | Toggle call recording per DID |
| ORG-005 | Sticky Agent | Route repeat callers to same agent |
| ORG-006 | Enable/Disable DID | Turn DID on/off temporarily |
| ORG-007 | View DID Status | See if DID is active and working |
| ORG-008 | Change Routing | Update destination anytime |
| ORG-009 | DID Validation | System prevents invalid routing |
| ORG-010 | Routing Preview | Show where calls will go before saving |

#### B. Campaign Management

| Req ID | Requirement | Details |
|--------|-------------|---------|
| ORG-101 | Create Campaign | Set name, type, DID, script, dates |
| ORG-102 | View Campaigns | List all campaigns with status |
| ORG-103 | Activate Campaign | Start accepting calls |
| ORG-104 | Pause Campaign | Temporarily stop (don't delete) |
| ORG-105 | Complete Campaign | Mark as finished |
| ORG-106 | Edit Campaign | Update settings (when not active) |
| ORG-107 | Campaign Stats | Show leads, calls, dispositions |
| ORG-108 | Assign Agents | Add agents to campaign |
| ORG-109 | Campaign Script | Link to or create script |
| ORG-110 | Campaign Dispositions | Link to disposition list |

#### C. Lead Management

| Req ID | Requirement | Details |
|--------|-------------|---------|
| ORG-201 | Import Leads | Upload CSV with phone numbers |
| ORG-202 | Validate Leads | Check format, prevent duplicates |
| ORG-203 | Lead Preview | Show sample before import |
| ORG-204 | View Leads | List leads in campaign |
| ORG-205 | Search Leads | Filter by phone, name, status |
| ORG-206 | Update Lead Info | Edit custom fields |
| ORG-207 | Lead Status | Track: New, Attempted, Reached, etc |
| ORG-208 | Bulk Actions | Update status for multiple leads |
| ORG-209 | Export Leads | Download lead list as CSV |
| ORG-210 | DND Management | View/manage do-not-call list |

#### D. Call Operations

| Req ID | Requirement | Details |
|--------|-------------|---------|
| ORG-301 | Click-to-Call | Agent clicks to dial lead |
| ORG-302 | Dial Through DID | Call originates from assigned DID |
| ORG-303 | Call Routing | System routes through SIP trunk |
| ORG-304 | Call Progress | Show ringing/connected state |
| ORG-305 | Call Timer | Display call duration |
| ORG-306 | Script Display | Show relevant script during call |
| ORG-307 | Lead Info | Show lead details during call |
| ORG-308 | Hangup | End call (agent or system) |
| ORG-309 | Call Failed | Show error if call cannot connect |
| ORG-310 | Failed Call Retry | Ability to retry failed call |

#### E. Disposition Tracking

| Req ID | Requirement | Details |
|--------|-------------|---------|
| ORG-401 | Create Disposition List | Define outcomes (Interested, DND, etc) |
| ORG-402 | Disposition Options | Select from list after call |
| ORG-403 | Add Notes | Agent can add call notes |
| ORG-404 | Update Lead Status | Disposition auto-updates lead status |
| ORG-405 | DND Blocking | DND disposition prevents future calls |
| ORG-406 | Disposition History | View all dispositions per lead |
| ORG-407 | Callback Scheduling | Schedule callback for future date |
| ORG-408 | Bulk Disposition | Update multiple leads at once |

#### F. Call History & Reporting

| Req ID | Requirement | Details |
|--------|-------------|---------|
| ORG-501 | Call History | View all calls with details |
| ORG-502 | Search Calls | Filter by date, agent, lead, disposition |
| ORG-503 | Sort Calls | Sort by date, duration, disposition |
| ORG-504 | Call Details | View full call record |
| ORG-505 | Play Recording | Listen to call in browser |
| ORG-506 | Download Recording | Save .wav file |
| ORG-507 | Export Data | Download call list as CSV |
| ORG-508 | Compliance Export | Full audit trail for compliance |
| ORG-509 | Call Statistics | Summary of calls, dispositions, duration |
| ORG-510 | Agent Performance | Per-agent call stats |

---

## Non-Functional Requirements

### Performance

| Requirement | Target | Details |
|-------------|--------|---------|
| **Call Initiation** | < 2 sec | Time from click-to-call to phone ringing |
| **DID Configuration** | < 30 sec | Time from save to active on FreeSWITCH |
| **Page Load Time** | < 3 sec | Dashboard loads in under 3 seconds |
| **Search Results** | < 1 sec | Search for leads/calls returns in <1 second |
| **Database Query** | < 500ms | Any DB query completes in <500ms |
| **API Response** | < 1 sec | oRPC endpoint responds in <1 second |
| **Recording Upload** | Real-time | Recording available immediately after call |

### Availability & Reliability

| Requirement | Target | Details |
|-------------|--------|---------|
| **System Uptime** | 99.9% | System available 99.9% of the time (8 min/month downtime allowed) |
| **Call Success Rate** | 99.5% | 99.5% of initiated calls connect successfully |
| **Database Availability** | 99.99% | Database always accessible |
| **Data Backup** | Daily | Daily backups with 30-day retention |
| **Disaster Recovery** | 1 hour | Recover from failure within 1 hour |
| **Redundancy** | High | Multiple FreeSWITCH instances for failover |

### Security

| Requirement | Details |
|-------------|---------|
| **Encryption at Rest** | All sensitive data (passwords, tokens) encrypted |
| **Encryption in Transit** | All API calls over HTTPS |
| **Multi-Tenant Isolation** | Organizations cannot access each other's data |
| **Authentication** | Secure login, session management |
| **Authorization** | Role-based access (Admin, Org, Agent) |
| **Audit Logging** | All changes logged with timestamp & user |
| **Data Retention** | Call recordings kept for 90 days (configurable) |
| **Compliance** | GDPR, CCPA, PCI-DSS (if storing payment info) |
| **PII Protection** | Lead data encrypted, access logged |

### Scalability

| Requirement | Details |
|-------------|---------|
| **Organizations** | Support 1000+ organizations on single platform |
| **DIDs per Org** | Support orgs with 1000+ DIDs each |
| **Concurrent Calls** | Handle 1000+ concurrent calls system-wide |
| **Leads per Campaign** | Support campaigns with 100,000+ leads |
| **Call History** | Store millions of call records without performance degradation |
| **Data Growth** | System scales horizontally (add servers) |

### Usability

| Requirement | Details |
|-------------|---------|
| **Accessibility** | WCAG 2.1 AA compliance |
| **Mobile Responsive** | Works on mobile (dashboard, not agent calling) |
| **Intuitive UI** | New users can configure DIDs without training |
| **Consistent Design** | Same design patterns throughout |
| **Clear Feedback** | User always knows result of action |
| **Error Messages** | Clear, actionable error messages |
| **Documentation** | User guides for each feature |
| **Support** | In-app help, email support |

---

## Data & Integrations

### Data Model Overview

```
PLATFORM LEVEL (Admin-controlled):
├─ SIP Trunks (provider credentials, status)
├─ DID Inventory (phone numbers, unassigned pool)

ORGANIZATION LEVEL (Per-org):
├─ Organization DIDs (assigned DIDs + routing config)
├─ Inbound Queues
├─ Agent Scripts
├─ Disposition Lists
├─ Campaigns
├─ Leads
├─ Calls (all call records)
├─ Call Events (real-time call events)
├─ Call Recordings (metadata + file reference)
├─ Configuration Audit Trail

CROSS-CUTTING:
├─ Users (agents, admins)
├─ Organization Memberships
└─ Access Logs
```

### External Integrations

#### 1. FreeSWITCH Phone System

**What It Does:** Actual phone switching, routing, recording  
**How We Connect:** 
- ESL (Event Socket Layer) on port 8021 for real-time events
- SSH for deploying configuration files
- SIP for SIP registrations and calls

**Data Flow:**
```
App DB → Config Service → SSH Deploy → FreeSWITCH Config
FreeSWITCH Events → ESL Listener → App DB → Frontend
```

#### 2. SIP Trunk Providers (CloudBharat, Telnyx, etc.)

**What They Do:** Connect to real phone network (PSTN)  
**How Calls Flow:**
```
Agent clicks call
  ↓
App initiates through FreeSWITCH ESL
  ↓
FreeSWITCH dials through SIP trunk provider
  ↓
Provider routes to real phone network
  ↓
Customer's phone rings
```

#### 3. File Storage (S3 or equivalent)

**What It Does:** Store call recordings  
**How It Works:**
```
FreeSWITCH saves recording → File Storage
App retrieves link → Browser can stream/download
```

---

## Success Metrics

### Business Metrics

| Metric | Target | Measure |
|--------|--------|---------|
| **Time to Configure DID** | < 2 min | How long for org to set up a new DID |
| **Support Tickets Related to Config** | 0 | No manual config requests |
| **DID Assignment Success** | 100% | All assigned DIDs work immediately |
| **Organization Satisfaction** | > 4.5/5 | NPS score or satisfaction survey |
| **Platform Adoption** | > 80% | Percentage of orgs using dashboard vs requesting manual config |

### Technical Metrics

| Metric | Target | Measure |
|--------|--------|---------|
| **Call Initiation Success** | > 99% | % of initiated calls that successfully dial |
| **Call Recording Rate** | 100% | All calls automatically recorded |
| **Config Deployment Time** | < 30 sec | Time from save to active on FreeSWITCH |
| **System Uptime** | > 99.9% | Platform availability |
| **API Response Time** | < 1 sec | All API calls respond within 1 second |
| **Database Query Time** | < 500ms | All queries complete in <500ms |
| **Zero Data Breaches** | Yes | No unauthorized access to customer data |

### Usage Metrics

| Metric | Target | Measure |
|--------|--------|---------|
| **Monthly Active Organizations** | Grow 10% MoM | Number of orgs using system |
| **Total Calls Processed** | Grow 20% MoM | Number of calls handled |
| **Average Calls per Campaign** | > 1000 | Average campaign size |
| **Calls per Day (Peak)** | > 10,000 | Maximum daily call volume |

---

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-4)

**Goal:** Get DIDs and basic routing working  
**Status:** In Progress

#### Deliverables

| Item | Description | Owner |
|------|-------------|-------|
| Database Schema | All tables for DIDs, campaigns, leads, calls | Backend |
| SIP Trunk Config | CloudBharat SIP trunk configured | DevOps |
| ESL Connection | SIP Worker connects to FreeSWITCH via ESL | Backend |
| Config Sync Service | Watches DB, deploys XML to FreeSWITCH | Backend |
| Admin DID Management API | Endpoints for adding/assigning DIDs | Backend |
| Organization DID Config API | Endpoints for org to configure routing | Backend |
| Basic UI (Admin) | SIP trunk, DID inventory, assignment screens | Frontend |
| Basic UI (Org) | DID configuration form | Frontend |

#### Success Criteria

- ✅ Platform admin can add DIDs to inventory
- ✅ Platform admin can assign DIDs to organizations
- ✅ Organization can configure DID routing
- ✅ Changes sync to FreeSWITCH within 30 seconds
- ✅ Test calls route correctly
- ✅ Call recordings stored

**Timeline:** Weeks 1-4  
**Blockers:** None

---

### Phase 2: Campaign & Calls (Weeks 5-8)

**Goal:** Organizations can create campaigns and agents can make calls

#### Deliverables

| Item | Description |
|------|-------------|
| Campaign CRUD API | Create, edit, view campaigns |
| Lead Import API | Upload CSV with phone numbers |
| Call Initiation API | Agent click-to-call |
| Disposition API | Agent logs outcome of call |
| Call History API | Search and view past calls |
| Campaign UI | Create/manage campaigns |
| Lead Upload UI | Import leads screen |
| Agent Dashboard | Click-to-call, script display, disposition |
| Call History UI | Search, filter, download |

#### Success Criteria

- ✅ Org can create campaign in < 3 min
- ✅ Org can upload 10,000 leads without errors
- ✅ Agent can click-to-call and reach lead
- ✅ Call records all details (duration, outcome, recording)
- ✅ Call recordings accessible in history

**Timeline:** Weeks 5-8  
**Blockers:** Phase 1 must complete

---

### Phase 3: Inbound Routing & Advanced Features (Weeks 9-12)

**Goal:** Full inbound call handling, queues, IVR prep

#### Deliverables

| Item | Description |
|------|-------------|
| Inbound Queue API | Create queues, manage agents |
| Queue Routing Logic | Route calls to next available agent |
| IVR Framework | Prep for Phase 3+ IVR support |
| Agent Scripts | Store and display scripts |
| Disposition Lists | Custom outcomes per campaign |
| Real-Time Agent Status | Online/offline/on-call |
| Supervisor Dashboard | Monitor queue, agent stats |
| Reporting | Basic call statistics |

#### Success Criteria

- ✅ Inbound calls route to queue automatically
- ✅ Next available agent's phone rings
- ✅ Agent can see caller info and script
- ✅ Call recorded and logged
- ✅ Supervisor can see queue stats in real-time

**Timeline:** Weeks 9-12  
**Blockers:** Phase 2 must complete

---

### Phase 4: Advanced Features & Polish (Weeks 13+)

**Goal:** IVR, TTS, advanced analytics, performance optimization

#### Deliverables

| Item | Description |
|------|-------------|
| IVR Builder (Simple) | Form-based IVR creation |
| IVR Builder (Graph) | Node-based IVR flow builder |
| TTS Integration | Text-to-speech for prompts |
| Call Announcements | Pre-call messages |
| Advanced Reporting | Charts, analytics, exports |
| Performance Optimization | Faster loading, better UX |
| Mobile Optimization | Mobile-friendly dashboard |
| API Documentation | Public API docs |

#### Success Criteria

- ✅ Org can create IVR without code
- ✅ TTS-generated prompts work in IVR
- ✅ Dashboard loads in < 3 sec on slow connection
- ✅ Mobile-friendly interface

**Timeline:** Weeks 13+  
**Blockers:** Phase 3 must complete

---

## Glossary

| Term | Definition |
|------|-----------|
| **DID** | Direct Inward Dialing - a phone number |
| **SIP** | Session Initiation Protocol - voice call protocol |
| **SIP Trunk** | Connection from app to phone provider (e.g., CloudBharat) |
| **FreeSWITCH** | Open-source phone switch (the actual phone system) |
| **ESL** | Event Socket Layer - real-time API for FreeSWITCH |
| **Dialplan** | FreeSWITCH's routing rules (XML-based) |
| **Extension** | Agent's SIP user (e.g., 1001, 1002) |
| **Queue** | Waiting area for inbound calls, routes to agents |
| **IVR** | Interactive Voice Response - automated menu system |
| **Disposition** | Outcome/result of a call |
| **Lead** | Contact to be called or who calls in |
| **Campaign** | Coordinated calling operation |
| **Multi-Tenant** | Single platform serves multiple organizations safely |
| **Organization** | Customer account (e.g., "Acme Corp") |
| **Agent** | Person making/receiving calls |
| **Recording** | Automatic audio capture of all calls |
| **PSTN** | Public Switched Telephone Network (real phone system) |

---

## Questions & Clarifications

### Q: How are calls billed?
**A:** Out of scope for MVP. Can be added in future phase based on organization's billing model.

### Q: What about international numbers?
**A:** Supported if SIP provider offers them. System is country-agnostic.

### Q: Can we transfer calls between agents?
**A:** Out of scope for Phase 1, can be added in Phase 3+.

### Q: Do we support WebRTC (browser calling)?
**A:** Out of scope for Phase 1. Can be added if agents want browser-based calling vs. softphone.

### Q: How do we handle caller ID spoofing?
**A:** Caller ID is set from assigned DID. No spoofing capability (by design, for compliance).

### Q: What if agent disconnects mid-call?
**A:** Call ends, automatically logged as disconnected. Lead can be re-called.

### Q: Can we re-assign lead to different agent?
**A:** Yes, anytime. If lead is currently on call, must complete first.

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-04-10 | Product Team | Initial PRD |

**Approval:** [To be signed off by stakeholders]

---

**End of Document**
