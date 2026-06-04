# PRD: Holo Communication Platform — Voice & Video Calling

**Document Owner:** Ashish Pandey
**Status:** Draft
**Created:** 2026-06-04
**Last Updated:** 2026-06-04
**Target Platform:** Web (work-holo)

---

## 1. Executive Summary

This document describes the design, architecture, and implementation plan for adding Voice and Video Calling to the Holo platform. The feature follows the Slack Huddles / WhatsApp model — persistent floating call overlay, both 1-1 and group calls, mid-call participant additions, and a dedicated Calls section in the sidebar.

The implementation is being executed by a solo developer assisted by **Claude AI (Pro, $20/month plan)**, which reduces estimated effort by approximately 30–40% compared to unassisted development. Total estimated delivery across all three phases is **9–10 weeks**.

---

## 2. Problem Statement

Holo currently supports rich async communication (DMs, channel messaging, reactions, file sharing) but has **no real-time voice or video capability**. Teams using Holo must switch to external tools (Google Meet, Zoom, WhatsApp) for live conversations, breaking workflow continuity and reducing platform stickiness.

---

## 3. Goals

| Goal | Metric |
|------|--------|
| Keep users inside Holo for real-time conversations | Reduce external tool switches per user per day |
| Match baseline quality of Slack Huddles / WhatsApp Web calls | Zero dropped calls due to infrastructure misconfiguration |
| Ship Phase 1 without disrupting existing messaging features | Zero regressions in DM / channel functionality |
| Respect org admin access controls | Calling module obeys existing module permission system |

---

## 4. Non-Goals (Explicitly Out of Scope)

- PSTN / phone number calling (no SIP, no carrier integration)
- Mobile app (Expo/React Native) — web only for all phases
- AI transcription, meeting summaries, closed captions
- Virtual backgrounds, background blur
- Noise cancellation (beyond browser-native)
- Dial-in numbers for external participants
- Webinar / broadcast mode (1-to-many)

---

## 5. User Stories

### 5.1 Core Calling
- As a user, I can start a **voice call** or **video call** from a DM conversation with one click.
- As a user, I can start a call from a **group channel**, bringing all members into the room.
- As a user, I can start a call from the **Calls sidebar** by browsing org members — no prior chat required.
- As a user, when I call someone from the directory with no prior DM, a DM conversation is **automatically created**.
- As a user, I receive an **incoming call popup** in the corner of my screen with the caller's name and call type.
- As a user, I receive a **browser push notification** if the tab is in the background or closed.
- As a user, if I do not answer within **30 seconds**, the call moves to **missed** and both parties are notified.
- As a user, I can **accept** or **decline** an incoming call from the popup.

### 5.2 In-Call Experience
- As a user, the call opens as a **floating overlay** I can move around — I can keep browsing channels while on a call.
- As a user, I can **toggle my microphone** on/off at any time.
- As a user, I can **toggle my camera** on/off at any time.
- As a user on a voice call, I can **upgrade to video** by turning on my camera.
- As a user, I can **add other org members** to an ongoing call mid-conversation.
- As a user, I can **leave a call** at any time; the call continues for remaining participants.
- As a user, if I accidentally close my tab, I can **rejoin the call** as long as ≥1 participant remains.

### 5.3 Group Calls
- As a call initiator (host), I can **mute any participant**.
- As a call initiator (host), I can **remove a participant** from the call.
- As a call initiator (host), I can **end the call for everyone**.
- As a user in a group call, I see a **grid layout** for ≤4 participants and **active speaker layout** for 5–25 participants.
- Maximum group call size is **25 participants**.

### 5.4 Call History
- As a user, every call appears as an **inline event** in the DM or channel thread (e.g., "Voice call · 4m 32s").
- As a user, I see all my calls (recent, missed, outgoing) in the **Calls section of the sidebar**.
- As a user, I can **call back** directly from the call history entry.
- As a user, **missed calls** show a red badge on the Calls sidebar icon.

### 5.5 Permissions
- As an org admin, I can enable/disable the **calling module** org-wide, per team, or per specific users — using the existing module access system.
- As a user without calling access, call buttons are hidden and I cannot initiate or receive calls.

---

## 6. Architecture Overview

### 6.1 Technology Stack

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Media Server | **LiveKit (self-hosted)** | Open source SFU, React SDK, single binary, active community |
| Signaling (ring) | **Pusher / soketi** (existing) | `private-user-{userId}` channel already wired |
| Ring Timeout | **RabbitMQ DLX** (existing) | Native TTL + dead-letter exchange, no plugins needed |
| Call State | **PostgreSQL + Drizzle** (existing) | `call` and `callParticipant` tables |
| Presence Integration | **Redis + existing presence** | `in_call` status already defined in presence system |
| Token Auth | **LiveKit JWT** issued by Hono server | Server-side, per-user, per-room access tokens |
| Deployment | **Dedicated VPS** (separate from FreeSWITCH VPS at 135.181.31.20) | Media server needs dedicated CPU/bandwidth |

### 6.2 Call State Machine

```
[initiated]
     │
     ▼ Pusher event + Push notification → callee
[ringing] ──── 30s RabbitMQ DLX ────► [missed]  → notify both parties
     │
     ├── callee declines ──────────────► [rejected]
     ├── caller cancels ──────────────► [cancelled]
     │
     ▼ callee accepts
  [active] ◄──── participants can rejoin freely while active
     │
     ├── host ends for all ───────────► [ended]
     └── last participant leaves ──────► [ended]
```

### 6.3 New Database Tables

#### `call`
| Column | Type | Notes |
|--------|------|-------|
| `id` | cuid2 PK | |
| `orgId` | text FK → organization | |
| `type` | enum: `voice` / `video` | Set at initiation |
| `status` | enum: `ringing` / `active` / `missed` / `rejected` / `cancelled` / `ended` | |
| `initiatorId` | text FK → user | The caller / host |
| `sourceConversationId` | text nullable | FK → dmConversation or channel |
| `sourceType` | enum: `dm` / `channel` nullable | |
| `livekitRoomName` | text unique | `call_{callId}` |
| `startedAt` | timestamp nullable | When first participant joined |
| `endedAt` | timestamp nullable | |
| `createdAt` | timestamp | |

#### `callParticipant`
| Column | Type | Notes |
|--------|------|-------|
| `id` | cuid2 PK | |
| `callId` | text FK → call | |
| `userId` | text FK → user | |
| `role` | enum: `host` / `participant` | |
| `joinedAt` | timestamp nullable | |
| `leftAt` | timestamp nullable | |
| `isRemoved` | boolean default false | Set by host |
| `createdAt` | timestamp | |

### 6.4 New Backend Components

| Component | Location | Purpose |
|-----------|----------|---------|
| Call router | `packages/api/src/routers/communication/call.ts` | initiate, accept, reject, end, getJoinToken, list, addParticipant |
| Call timeout worker | `workers/call-timeout/` | RabbitMQ DLX consumer → marks missed, sends notifications |
| Module ID | `packages/api/src/lib/module-ids.ts` | Add `CALLING: "calling"` |
| Call schema | `packages/db/src/schema/call.ts` | New Drizzle tables |
| Ring timeout queue | `packages/infrastructure/src/queue.ts` | Add `CALL_RING_TIMEOUT` queue with DLX config |

### 6.5 New Frontend Components

| Component | Purpose |
|-----------|---------|
| `callStore` (Zustand) | Global call state — active call, incoming call, participant list |
| `<CallOverlay />` | Floating draggable call window, persists across route navigation |
| `<IncomingCallPopup />` | Corner notification — caller info, accept/decline, ringing sound |
| `<ParticipantGrid />` | ≤4 participants grid layout |
| `<ActiveSpeakerLayout />` | 5–25 participants, dominant speaker tile |
| `<CallControls />` | Mic, camera, end call, add participant buttons |
| `<CallsSection />` | Sidebar Calls tab — directory + recent/missed call history |
| `<CallHistoryItem />` | Inline call event in DM/channel thread |
| `<CallDirectoryList />` | Browse org members with calling access, click to call |

---

## 7. Permission Model

Calling uses the **existing module access system** — zero new infrastructure:

```typescript
// packages/api/src/lib/module-ids.ts
export const MODULE_IDS = {
  DIRECT_MESSAGE: "direct_message",
  CALLING: "calling",          // ← new
} as const;
```

Admin controls (same UI as DM module config today):
- `disabled` — calling hidden for entire org
- `org_wide` — everyone can call everyone
- `team_based` — only members of selected teams
- `user_based` — only specific named users

The **call directory sidebar** uses the existing `listAllowedUsers("calling")` endpoint to show only callable members.

---

## 8. Phased Implementation Plan

---

### Phase 1 — Core Voice & Video Calling
**Duration: 6 weeks**
**Goal: Full 1-1 and group calling, floating overlay, call history**

#### Week 1 — Infrastructure Setup
| Task | Est. Days | With Claude AI |
|------|-----------|----------------|
| Provision dedicated VPS for LiveKit | 0.5 | 0.5 |
| Deploy LiveKit server via Docker, configure env vars | 1 | 0.5 |
| Add LiveKit service to `docker-compose.yml` (local dev) | 0.5 | 0.5 |
| Configure TURN (LiveKit built-in), test room creation | 1 | 0.5 |
| **Week 1 Total** | **3 days** | **2 days** |

#### Week 2 — Database & Backend Foundation
| Task | Est. Days | With Claude AI |
|------|-----------|----------------|
| New Drizzle schema: `call`, `callParticipant` tables | 0.5 | 0.5 |
| DB migration, seed data | 0.5 | 0.5 |
| Add `CALLING` to `MODULE_IDS` | 0.5 | 0.5 |
| oRPC call router skeleton — `initiate`, `getJoinToken`, `list` | 2 | 1.5 |
| LiveKit JWT token generation (server-side, per-user per-room) | 1 | 0.5 |
| **Week 2 Total** | **4.5 days** | **3.5 days** |

#### Week 3 — Signaling, State Machine & Ring Timeout
| Task | Est. Days | With Claude AI |
|------|-----------|----------------|
| Pusher signaling events: `call.incoming`, `call.accepted`, `call.rejected`, `call.ended` | 1.5 | 1 |
| RabbitMQ DLX queue for ring timeout (30s) | 1 | 0.5 |
| `workers/call-timeout/` — marks missed, fires notification | 1.5 | 1 |
| oRPC endpoints: `accept`, `reject`, `cancel`, `end` | 1.5 | 1 |
| Presence integration — set `in_call` on active, clear on end | 0.5 | 0.5 |
| **Week 3 Total** | **6 days** | **4 days** |

#### Week 4 — Frontend Core State & Incoming Call
| Task | Est. Days | With Claude AI |
|------|-----------|----------------|
| `callStore` (Zustand) — active call state, incoming call queue | 1 | 0.5 |
| Mount callStore above TanStack Router (root layout) | 0.5 | 0.5 |
| Pusher event listeners wired to callStore | 1 | 0.5 |
| `<IncomingCallPopup />` — corner notification, ringing sound | 1.5 | 1 |
| Accept → open overlay, Decline → send reject, Timeout → auto-dismiss | 1 | 0.5 |
| Push notification for background tab (existing push worker) | 1 | 0.5 |
| **Week 4 Total** | **6 days** | **3.5 days** |

#### Week 5 — LiveKit Integration & Call UI
| Task | Est. Days | With Claude AI |
|------|-----------|----------------|
| Install `@livekit/components-react`, wire up `LiveKitRoom` | 0.5 | 0.5 |
| `<CallOverlay />` — floating, draggable, minimizable | 2 | 1.5 |
| `<ParticipantGrid />` — ≤4 participants grid layout | 1 | 0.5 |
| `<ActiveSpeakerLayout />` — 5–25 participants speaker view | 1.5 | 1 |
| `<CallControls />` — mic toggle, camera toggle, end call | 1 | 0.5 |
| Voice call (audio-only) vs Video call (camera-on) initiation | 0.5 | 0.5 |
| **Week 5 Total** | **6.5 days** | **4.5 days** |

#### Week 6 — Entry Points, Calls Sidebar & Testing
| Task | Est. Days | With Claude AI |
|------|-----------|----------------|
| Voice/Video call buttons in DM conversation header | 0.5 | 0.5 |
| Call button in channel header | 0.5 | 0.5 |
| `<CallsSection />` sidebar — missed badge, recent calls, quick redial | 2 | 1.5 |
| `<CallDirectoryList />` — browse org members, filtered by module access | 1.5 | 1 |
| Inline call event in DM/channel thread (`<CallHistoryItem />`) | 1 | 0.5 |
| Host controls — mute participant, remove participant, end for all | 1.5 | 1 |
| Add participant mid-call | 1 | 0.5 |
| End-to-end testing, bug fixes, polish | 2 | 1.5 |
| **Week 6 Total** | **10 days** | **7 days** |

#### Phase 1 Summary
| | Without Claude AI | With Claude AI ($20 plan) |
|-|-------------------|--------------------------|
| Estimated effort | ~36 dev-days (~7.5 weeks) | ~24 dev-days (~5 weeks) |
| Calendar time (1 dev) | **7–8 weeks** | **5–6 weeks** |

**Phase 1 Deliverables:**
- ✅ Voice and video 1-1 calls
- ✅ Group calls (up to 25 participants)
- ✅ Mid-call participant addition (1-1 → group escalation)
- ✅ Floating overlay persists across navigation
- ✅ Incoming call corner popup + push notification
- ✅ 30-second ring timeout → missed call
- ✅ Host controls (mute, remove, end for all)
- ✅ Rejoin while call is active
- ✅ Calls sidebar with directory, history, missed badge
- ✅ Inline call events in chat thread
- ✅ Module-based permission control

---

### Phase 2 — Screen Sharing
**Duration: 1.5 weeks**
**Dependency: Phase 1 complete**

| Task | Est. Days | With Claude AI |
|------|-----------|----------------|
| Publish screen track via `getDisplayMedia` (LiveKit) | 1 | 0.5 |
| Screen share button in `<CallControls />` | 0.5 | 0.5 |
| Viewer layout — screen share tile as dominant | 1.5 | 1 |
| "You are sharing your screen" indicator + stop button | 0.5 | 0.5 |
| Transfer presenter role | 1 | 0.5 |
| Testing & polish | 1 | 0.5 |
| **Phase 2 Total** | **5.5 days** | **3.5 days** |

| | Without Claude AI | With Claude AI |
|-|-------------------|----------------|
| Calendar time | ~1.5 weeks | ~1 week |

---

### Phase 3 — Call Recording
**Duration: 2 weeks**
**Dependency: Phase 1 + Phase 2 complete, LiveKit Egress configured**

| Task | Est. Days | With Claude AI |
|------|-----------|----------------|
| Deploy LiveKit Egress service (Docker) | 1 | 0.5 |
| Configure RustFS as recording destination | 0.5 | 0.5 |
| Recording start/stop API (host-only control) | 1.5 | 1 |
| Recording status indicator in call overlay | 0.5 | 0.5 |
| Store recording metadata in DB | 1 | 0.5 |
| Recording playback UI in call history | 2 | 1.5 |
| Access control (who can view recordings) | 1 | 0.5 |
| Testing & polish | 2 | 1.5 |
| **Phase 3 Total** | **9.5 days** | **6.5 days** |

| | Without Claude AI | With Claude AI |
|-|-------------------|----------------|
| Calendar time | ~2.5 weeks | ~1.5 weeks |

---

## 9. Full Timeline Summary

```
Week 1   ████████  Infrastructure (LiveKit VPS, Docker, local dev)
Week 2   ████████  DB Schema + Backend Foundation
Week 3   ████████  Signaling + Ring Timeout + State Machine
Week 4   ████████  Frontend State + Incoming Call Popup
Week 5   ████████  LiveKit Integration + Call UI
Week 6   ████████  Entry Points + Sidebar + Testing
                   ── Phase 1 Complete ──
Week 7   ████░░░░  Screen Sharing
                   ── Phase 2 Complete ──
Week 8-9 ████████  Call Recording
                   ── Phase 3 Complete ──
```

| Phase | Feature | Calendar Time (with Claude AI) | Cumulative |
|-------|---------|-------------------------------|------------|
| Phase 1 | Voice + Video Calling | 5–6 weeks | 5–6 weeks |
| Phase 2 | Screen Sharing | 1 week | 6–7 weeks |
| Phase 3 | Call Recording | 1.5 weeks | 7.5–8.5 weeks |
| **Total** | **Full calling platform** | | **~8–9 weeks** |

> **Note on Claude AI impact:** Claude AI Pro ($20/month) is used for code generation, boilerplate scaffolding, debugging, and reviewing oRPC/Drizzle/Zustand patterns consistent with the existing codebase. Estimated 30–40% reduction in development time on implementation tasks. Research, architecture decisions, deployment configuration, and testing remain manual.

---

## 10. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| LiveKit VPS NAT/firewall issues blocking WebRTC | Medium | High | Use LiveKit built-in TURN; test early in Week 1 |
| Pusher event ordering causing double-ring or missed events | Low | Medium | Idempotent call state checks in all handlers |
| Floating overlay causing React re-renders in messaging | Low | Medium | Zustand store is outside React Query scope; test after Phase 1 |
| RabbitMQ DLX timing drift under load | Low | Low | Dead letter timeout is best-effort; UI shows elapsed ring time client-side |
| LiveKit SDK version incompatibility with React 19 | Low | High | Pin `@livekit/components-react` version; test in Week 5 Day 1 |
| Solo developer bottleneck (illness, blocker) | Medium | Medium | Phase 1 is self-contained; Phase 2/3 are independent and can slip |

---

## 11. Dependencies

| Dependency | Owner | Required By |
|------------|-------|-------------|
| Dedicated VPS provisioned for LiveKit | DevOps / Ashish | Week 1 |
| LiveKit API key + secret generated | Ashish | Week 2 |
| Pusher `private-user-{userId}` channel confirmed active | Already exists | Week 3 |
| RabbitMQ DLX plugin (native, no extra install) | Already supported | Week 3 |
| RustFS bucket for recordings | Already exists | Phase 3 |

---

## 12. Success Criteria (Phase 1)

- [ ] A user can initiate a voice or video call from a DM, channel, or call directory
- [ ] The callee receives a corner popup within 2 seconds of the call being initiated
- [ ] Unanswered calls automatically move to missed after 30 seconds
- [ ] The call overlay persists while navigating between channels and DMs
- [ ] A group call with 3+ participants shows active speaker layout
- [ ] A participant who leaves can rejoin while the call is active
- [ ] The host can mute, remove, and end-for-all
- [ ] Missed calls show a badge on the Calls sidebar icon
- [ ] Call events appear inline in the DM/channel thread with duration
- [ ] Org admins can enable/disable calling per org, team, or user

---

## 13. Open Questions (Resolved)

| Question | Decision |
|----------|----------|
| SFU vs peer-to-peer | SFU (LiveKit) — required for group calls and mid-call additions |
| Self-hosted vs managed | Self-hosted LiveKit on dedicated VPS |
| PSTN / phone number bridging | Out of scope — internal users only |
| Recording in Phase 1 | No — Phase 3 |
| Screen sharing in Phase 1 | No — Phase 2 |
| Mobile (Expo) | Out of scope for all phases currently planned |
| Permission model | Unified `calling` module, same as `direct_message` |
| Ring timeout | 30 seconds, RabbitMQ DLX |
| Call UI pattern | Floating overlay (Slack-style) |
| Incoming call UI | Corner popup with ringing sound |
| Group call limit | 25 participants |
| Layout switching | Grid ≤4 participants; active speaker 5–25 |
| Rejoin window | Free rejoin while call is active (≥1 participant present) |
| Call types | Voice (audio-first) and Video (camera-on), user chooses at initiation |
