# 📞 Work Holo Dialer System

## 🧭 Overview

The Work Holo Dialer is a multi-tenant communication workflow engine designed to manage outbound and inbound calling operations using modular, reusable components.

Instead of a traditional dialer, the system is built as a:
**Composable Workflow + Resource Engine**

---

# 🏗️ High-Level Architecture

## End-to-End Call Flow

Frontend (Web / Native)
        ↓
Hono API (oRPC)
        ↓
Dialer Service Layer
 ┌───────────────┬───────────────┬───────────────┐
 ↓               ↓               ↓
Postgres        RabbitMQ       Redis
(DB)            (Queue)        (Cache / State)
        ↓
SIP Worker (ESL Controller)
        ↓
FreeSWITCH
        ↓
SIP Trunk Providers
        ↓
PSTN (Customer)

---

## 📊 Logical System Architecture

                ┌────────────────────┐
                │     Campaign       │
                └────────┬───────────┘
                         │
     ┌───────────────────┼────────────────────┐
     ↓                   ↓                    ↓
┌────────────┐    ┌──────────────┐    ┌──────────────┐
│ Lead List  │    │ DID Pool     │    │ Agent Script │
└────────────┘    └──────────────┘    └──────────────┘
     ↓                   ↓                    ↓
┌────────────┐    ┌──────────────┐    ┌──────────────┐
│ DND List   │    │ IVR / Queue  │    │ Dispositions │
└────────────┘    └──────────────┘    └──────────────┘
                         ↓
                 ┌──────────────┐
                 │ CSAT Survey  │
                 └──────────────┘

---

## 🔁 Inbound Call Flow

Caller → DID → Call Announcement → IVR → Inbound Queue → Agent → CSAT Survey

---

## 📤 Outbound Call Flow

Campaign → Lead List → DND Check → Dial Attempt → Agent → Disposition

---

# 🚀 Implementation Phases

## Phase 1: Foundation

- DID Pool
- Lead List
- Disposition List
- DND List
- Agent Script
- System Recordings
- Inbound Queue
- Campaign

## Phase 2: Functional Expansion

- IVR (basic)
- Call Announcement
- Queue enhancements
- Disposition actions
- Callback system
- Lead enhancements
- Agent script dynamic fields
- CSAT basic

## Phase 3: Advanced Workflows

- Graph IVR
- Sub dispositions
- Smart retry
- Callback automation
- Scheduled calls
- TTS
- Lead state & locking

## Phase 4: Optimization

- Campaign templates
- Multi lead lists
- Queue visibility
- Agent UX improvements
- Reporting

## Phase 5: Advanced

- AI assistance
- Predictive dialing
- Skill routing
- Advanced IVR
- Lead scoring
- Compliance & RBAC

---

# 🧠 Key Principles

- Reusable resources
- Workflow-based design
- Scalable architecture
- Extensible system
