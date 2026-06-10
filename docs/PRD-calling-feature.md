# PRD: Holo Communication Platform — Voice & Video Calling

**Document Owner:** Ashish Pandey
**Status:** Draft
**Created:** 2026-06-04
**Last Updated:** 2026-06-04 (v2 — channel call model, device switcher, emoji reactions, pill overlay, directory UX)
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

### 5.1 Core Calling — DM Calls (Direct Ring)
- As a user, I can start a **voice call** or **video call** from a DM conversation with one click.
- As a user, I can start a call from the **Calls sidebar** by browsing org members — no prior chat required.
- As a user, when I call someone from the directory with no prior DM, a DM conversation is **automatically created**.
- As a user, I receive an **incoming call popup** in the corner of my screen with the caller's name and call type.
- As a user, I receive a **browser push notification** if the tab is in the background or closed.
- As a user, if I do not answer within **30 seconds**, the call moves to **missed** and both parties are notified.
- As a user, I can **accept** or **decline** an incoming call from the popup.
- As a user calling someone whose presence shows `in_call`, I see a toast warning: *"Ashish is on a call — they may not answer."* The ring goes through anyway.

### 5.2 Core Calling — Channel Calls (Open Room / Huddle)
- As a user, I can start a call from a **group channel** — this opens an ambient room with no forced ring.
- As a channel member, I see a **"call in progress — N joined"** banner in the channel thread and a **pulsing live indicator** on the channel name in the sidebar.
- As a user, I can **join or leave** a channel call at will — no ring, no timeout pressure.
- As a user, a channel call **auto-closes after 5 minutes** if only 1 participant remains (via LiveKit `emptyTimeout`).
- As a user, channel calls I didn't join do **not** count as missed — they appear in the Calls sidebar as history only.

### 5.3 In-Call Experience
- As a user, the call opens as a **floating overlay** I can move around — I can keep browsing channels while on a call.
- As a user, I can **minimise** the overlay to a **floating pill** in the bottom-left corner showing call duration, mic toggle, and end button.
- As a user, I can **toggle my microphone** on/off at any time.
- As a user, I can **toggle my camera** on/off at any time.
- As a user on a voice call, I can **upgrade to video** by turning on my camera.
- As a user, I can **switch microphone, speaker, or camera** mid-call from a settings icon in the controls bar.
- As a user, I can **send emoji reactions** (👍 ❤️ 😂 🎉 ✋) that animate on my tile for 3 seconds — broadcast to all via LiveKit data channel.
- As a user, I can see a **connection quality indicator** on every participant's tile.
- As a user, I can **add other org members** to an ongoing call mid-conversation.
- As a user, I can **leave a call** at any time; the call continues for remaining participants.
- As a user, if I accidentally close my tab, I can **rejoin the call** as long as ≥1 participant remains.
- As a user already on a call, if I try to join a second call I see a prompt: *"Leave current call and join this one?"* — no auto-end.

### 5.4 Group Calls
- As a call initiator (host), I can **mute any participant**.
- As a call initiator (host), I can **remove a participant** from the call.
- As a call initiator (host), I can **end the call for everyone**.
- As a user in a group call, I see a **grid layout** for ≤4 participants and **active speaker layout** for 5–25 participants.
- Maximum group call size is **25 participants**.

### 5.5 Call History & Calls Sidebar
- As a user, every call appears as an **inline event** in the DM or channel thread (e.g., "Voice call · 4m 32s" or "📹 Video call · Missed").
- As a user, the **Calls sidebar** has two tabs: **Directory** (who to call) and **Recents** (all call history).
- As a user, the **Directory** shows org members online-first then alphabetical, with presence indicators and a search bar.
- As a user, I can **call back** directly from any entry in the Recents tab.
- As a user, **missed DM calls** show a red badge on the Calls sidebar icon. Channel calls never increment the missed badge.
- As a user, channel call history shows as *"Call in #engineering · 24 min · 5 joined"* — no missed state.

### 5.6 Permissions
- As an org admin, I can enable/disable the **calling module** org-wide, per team, or per specific users — using the existing module access system.
- As a user without calling access, call buttons are hidden and I cannot initiate or receive calls.
- As a user, the **call directory only shows members who have calling access** (via existing `listAllowedUsers("calling")` endpoint).

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
| Deployment | **Same VPS as backend** (`work-holo-internal`) via **Coolify** | VPS has 5+ GB RAM free; LiveKit added as a new Coolify service |

### 6.2 Server Capacity Analysis

LiveKit runs on the existing `work-holo-internal` VPS (4 CPU / 7.6 GB RAM). Current observed usage:

| Resource | Current Usage | Available for LiveKit |
|----------|-------------|----------------------|
| RAM | 2.4 GB / 7.6 GB (31%) | **~5 GB free** |
| CPU | 28.2% avg (4 cores) | **~3 cores headroom** |

**LiveKit resource requirements at scale:**

| Concurrent participants | Extra RAM | Extra CPU |
|------------------------|-----------|-----------|
| 10 (voice) | ~100 MB | ~5% |
| 25 (video) | ~400 MB | ~15% |
| 50 (video) | ~800 MB | ~30% |

**Conclusion:** Current VPS comfortably supports 50+ concurrent video participants alongside the full existing stack. A dedicated LiveKit server is **not needed** until sustained concurrent video participants exceed ~80–100.

**Deployment method:** LiveKit is added as a new service in **Coolify** (already running on this VPS) — same workflow as all other services. No new servers, no new infrastructure accounts.

**One manual step:** Open firewall ports on VPS provider:
- `TCP 7880` — LiveKit HTTP/WebSocket
- `TCP 7881` — WebRTC TCP fallback
- `UDP 50000–60000` — media port range (critical)

### 6.3 Call State Machine

**DM Calls (direct ring):**
```
[initiated]
     │
     ▼ Pusher private-user-{userId} + Push notification → callee
[ringing] ──── 30s RabbitMQ DLX ────► [missed]  → notify both parties
     │
     ├── callee declines ──────────────► [rejected]
     ├── caller cancels ──────────────► [cancelled]
     │
     ▼ callee accepts
  [active] ◄──── free rejoin while ≥1 participant present
     │
     ├── host ends for all ───────────► [ended]
     └── last participant leaves ──────► [ended]
          ▲
          └── LiveKit room_finished webhook → mark ended in DB
```

**Channel Calls (open room / huddle):**
```
[initiated] → status: active immediately (no ringing)
     │
     ▼ Pusher private-org-{orgId} → broadcast to all connected members
  pulsing live indicator on channel name in sidebar
  "call in progress" banner in channel thread
     │
  [active] ◄──── any channel member can join freely
     │
     ├── host ends for all ───────────► [ended]
     ├── last participant leaves ──────► 5-min emptyTimeout
     │                                       │
     │                                       ▼ [ended]
     └── LiveKit room_finished webhook → mark ended in DB
```

**Soft-switch (user already in a call):**
```
User tries to join/accept second call
     │
     ▼ callStore detects activeCall exists
  Prompt: "Leave [current call] and join this one?"
     ├── Confirm → end current call → join new call
     └── Cancel  → stay in current call
```

### 6.4 New Database Tables

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

### 6.5 New Backend Components

| Component | Location | Purpose |
|-----------|----------|---------|
| Call router | `packages/api/src/routers/communication/call.ts` | initiate, accept, reject, end, getJoinToken, list, addParticipant |
| Call timeout worker | `workers/call-timeout/` | RabbitMQ DLX consumer → marks missed, sends notifications |
| LiveKit webhook handler | `apps/server/src/api/livekit-webhook.ts` | Receives `room_finished`, `participant_joined`, `participant_left` → syncs DB |
| Module ID | `packages/api/src/lib/module-ids.ts` | Add `CALLING: "calling"` |
| Call schema | `packages/db/src/schema/call.ts` | New Drizzle tables |
| Ring timeout queue | `packages/infrastructure/src/queue.ts` | Add `CALL_RING_TIMEOUT` queue with DLX config |
| LiveKit config | `infra/livekit/livekit.yaml` | `room.empty_timeout: 300`, TURN config, API key/secret |

### 6.6 New Frontend Components

| Component | Purpose |
|-----------|---------|
| `callStore` (Zustand) | Global call state — activeCall, incomingCall, isMinimized, softSwitchPending |
| `<CallOverlay />` | Floating draggable full call window, persists across navigation |
| `<CallPill />` | Minimized floating pill — bottom-left, duration timer, mic toggle, end button |
| `<IncomingCallPopup />` | Corner notification — caller info, call type, accept/decline, ringing sound |
| `<SoftSwitchPrompt />` | Modal: "Leave [current] and join [new]?" — shown when joining while in a call |
| `<ParticipantGrid />` | ≤4 participants grid layout |
| `<ActiveSpeakerLayout />` | 5–25 participants, dominant speaker tile |
| `<CallControls />` | Mic, camera, device settings, reactions, add participant, end call |
| `<DeviceSwitcher />` | Dropdown for mic/camera/speaker using `useMediaDevices()` hook |
| `<CallReactionPicker />` | Emoji picker (👍 ❤️ 😂 🎉 ✋) — fires via `useDataChannel()` |
| `<ReactionAnimation />` | Floating emoji animation on participant tile for 3 seconds |
| `<ConnectionQualityIndicator />` | Signal icon overlay on each tile using `useConnectionQuality()` |
| `<ChannelCallBanner />` | "Call in progress · N joined" banner in channel thread |
| `<ChannelLiveIndicator />` | Pulsing green dot on channel name in sidebar when call is active |
| `<CallsSection />` | Sidebar Calls — two tabs: Directory and Recents |
| `<CallDirectory />` | Online-first member list with search bar, presence indicators, call buttons |
| `<CallRecents />` | Aggregated call history — missed (red), outgoing, incoming, quick-redial |
| `<CallHistoryItem />` | Inline call event in DM/channel thread with duration |

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
| Add LiveKit as new service in Coolify on `work-holo-internal` | 0.5 | 0.5 |
| Create `livekit.yaml` config (API key, secret, public IP, TURN) | 0.5 | 0.5 |
| Open UDP 50000–60000 + TCP 7880/7881 on VPS firewall *(manual)* | 0.5 | 0.5 |
| Add LiveKit to local `docker-compose.yml` for dev environment | 0.5 | 0.5 |
| Test room creation, verify TURN, confirm media flows | 0.5 | 0.5 |
| **Week 1 Total** | **2.5 days** | **2.5 days** |

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
| Pusher DM signaling: `call.incoming`, `call.accepted`, `call.rejected`, `call.ended` | 1 | 0.5 |
| Pusher channel call signaling: `call.channel.started`, `call.channel.ended` via `private-org-{orgId}` | 0.5 | 0.5 |
| RabbitMQ DLX queue for ring timeout (30s, DM calls only) | 1 | 0.5 |
| `workers/call-timeout/` — marks missed, fires notification | 1.5 | 1 |
| oRPC endpoints: `accept`, `reject`, `cancel`, `end` | 1.5 | 1 |
| LiveKit webhook handler (`room_finished`, `participant_joined`, `participant_left`) | 1 | 0.5 |
| Presence integration — set `in_call` on active, clear on end | 0.5 | 0.5 |
| **Week 3 Total** | **7 days** | **4.5 days** |

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
| `<CallOverlay />` — floating, draggable, full mode | 1.5 | 1 |
| `<CallPill />` — minimized bottom-left pill, `isMinimized` toggle | 1 | 0.5 |
| `<ParticipantGrid />` — ≤4 participants grid layout | 1 | 0.5 |
| `<ActiveSpeakerLayout />` — 5–25 participants speaker view | 1.5 | 1 |
| `<CallControls />` — mic toggle, camera toggle, end call, settings icon | 1 | 0.5 |
| `<DeviceSwitcher />` — mic/camera/speaker dropdown via `useMediaDevices()` | 0.5 | 0.5 |
| `<ConnectionQualityIndicator />` — signal icon on all tiles via `useConnectionQuality()` | 0.5 | 0.5 |
| `<CallReactionPicker />` + `<ReactionAnimation />` via `useDataChannel()` | 1 | 0.5 |
| Voice call (audio-only) vs Video call (camera-on) initiation | 0.5 | 0.5 |
| `<SoftSwitchPrompt />` — "leave and join?" modal in callStore | 0.5 | 0.5 |
| **Week 5 Total** | **9.5 days** | **6 days** |

#### Week 6 — Entry Points, Channel Calls, Calls Sidebar & Testing
| Task | Est. Days | With Claude AI |
|------|-----------|----------------|
| Voice/Video call buttons in DM conversation header | 0.5 | 0.5 |
| Call button in channel header (open-room model) | 0.5 | 0.5 |
| `<ChannelCallBanner />` — "call in progress · N joined" in thread | 0.5 | 0.5 |
| `<ChannelLiveIndicator />` — pulsing dot on channel name via `private-org-{orgId}` | 0.5 | 0.5 |
| `<CallsSection />` — two-tab sidebar (Directory + Recents) | 2 | 1.5 |
| `<CallDirectory />` — online-first, search bar, presence indicators | 1.5 | 1 |
| `<CallRecents />` — aggregated history, missed badge (DM only), quick-redial | 1 | 1 |
| Inline call event in DM/channel thread (`<CallHistoryItem />`) | 1 | 0.5 |
| Host controls — mute participant, remove participant, end for all | 1.5 | 1 |
| Add participant mid-call | 1 | 0.5 |
| Warning toast when calling user with `in_call` presence | 0.5 | 0.5 |
| End-to-end testing, bug fixes, polish | 2 | 1.5 |
| **Week 6 Total** | **12.5 days** | **8.5 days** |

#### Phase 1 Summary
| | Without Claude AI | With Claude AI ($20 plan) |
|-|-------------------|--------------------------|
| Estimated effort | ~44 dev-days (~9 weeks) | ~29 dev-days (~6 weeks) |
| Calendar time (1 dev) | **8–9 weeks** | **6–7 weeks** |

**Phase 1 Deliverables:**
- ✅ Voice and video 1-1 calls (direct ring model)
- ✅ Channel calls (open-room / huddle model, no forced ring)
- ✅ Group calls (up to 25 participants)
- ✅ Mid-call participant addition (1-1 → group escalation)
- ✅ Floating overlay persists across navigation
- ✅ Minimized pill — bottom-left, duration timer, mic toggle
- ✅ Incoming call corner popup + push notification
- ✅ 30-second ring timeout → missed call (DM only)
- ✅ Channel call 5-minute empty timeout (LiveKit native)
- ✅ Host controls (mute, remove, end for all)
- ✅ Soft-switch prompt (no concurrent calls)
- ✅ Rejoin while call is active
- ✅ In-call device switcher (mic/camera/speaker)
- ✅ Emoji reactions via LiveKit data channel
- ✅ Connection quality on all participant tiles
- ✅ Pulsing live indicator on channel name in sidebar
- ✅ Calls sidebar — Directory tab (online-first + search) + Recents tab
- ✅ Inline call events in chat thread
- ✅ Warning toast when calling someone already in a call
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
Week 1   ████████  Infrastructure (LiveKit in Coolify, firewall, local dev)
Week 2   ████████  DB Schema + Backend Foundation
Week 3   ████████  Signaling + Ring Timeout + State Machine + LiveKit Webhook
Week 4   ████████  Frontend State + Incoming Call Popup + Soft Switch
Week 5   ████████  LiveKit Integration + Full Call UI (pill, reactions, devices, quality)
Week 6   ████████  Entry Points + Channel Calls + Sidebar + Testing
Week 7   ████░░░░  Overflow / polish buffer
                   ── Phase 1 Complete ──
Week 8   ████░░░░  Screen Sharing
                   ── Phase 2 Complete ──
Week 9-10 ████████  Call Recording
                    ── Phase 3 Complete ──
```

| Phase | Feature | Calendar Time (with Claude AI) | Cumulative |
|-------|---------|-------------------------------|------------|
| Phase 1 | Voice + Video Calling (full feature set) | 6–7 weeks | 6–7 weeks |
| Phase 2 | Screen Sharing | 1 week | 7–8 weeks |
| Phase 3 | Call Recording | 1.5 weeks | 8.5–9.5 weeks |
| **Total** | **Full calling platform** | | **~9–10 weeks** |

> **Note on Claude AI impact:** Claude AI Pro ($20/month) is used for code generation, boilerplate scaffolding, debugging, and reviewing oRPC/Drizzle/Zustand patterns consistent with the existing codebase. Estimated 30–40% reduction in development time on implementation tasks. Research, architecture decisions, deployment configuration, and testing remain manual.

---

## 10. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| VPS firewall UDP range not opened, blocking WebRTC media | Medium | High | Open UDP 50000–60000 in Week 1 Day 1; test with LiveKit `lk room create` before writing any app code |
| Pusher event ordering causing double-ring or missed events | Low | Medium | Idempotent call state checks in all handlers |
| Floating overlay causing React re-renders in messaging | Low | Medium | Zustand store is outside React Query scope; test after Phase 1 |
| RabbitMQ DLX timing drift under load | Low | Low | Dead letter timeout is best-effort; UI shows elapsed ring time client-side |
| LiveKit SDK version incompatibility with React 19 | Low | High | Pin `@livekit/components-react` version; test in Week 5 Day 1 |
| Solo developer bottleneck (illness, blocker) | Medium | Medium | Phase 1 is self-contained; Phase 2/3 are independent and can slip |

---

## 11. Dependencies

| Dependency | Owner | Required By |
|------------|-------|-------------|
| UDP 50000–60000 + TCP 7880/7881 opened on VPS firewall | Ashish (VPS provider panel) | Week 1 |
| LiveKit API key + secret generated (`livekit-cli generate-key`) | Ashish | Week 1 |
| Pusher `private-user-{userId}` channel confirmed active | Already exists | Week 3 |
| RabbitMQ DLX plugin (native, no extra install) | Already supported | Week 3 |
| RustFS bucket for recordings | Already exists | Phase 3 |

---

## 12. Success Criteria (Phase 1)

- [ ] A user can initiate a voice or video call from a DM, channel, or call directory
- [ ] DM calls ring the callee directly; corner popup appears within 2 seconds
- [ ] Channel calls open an ambient room; pulsing indicator appears on channel name immediately
- [ ] Unanswered DM calls auto-move to missed after 30 seconds
- [ ] Channel calls auto-close after 5 minutes with 1 participant remaining
- [ ] The call overlay persists while navigating between channels and DMs
- [ ] Minimising shows a floating pill (bottom-left) with duration, mic toggle, end button
- [ ] A group call with 3+ participants shows active speaker layout
- [ ] A participant who leaves can rejoin while the call is active
- [ ] Trying to join a second call shows a soft-switch prompt — no auto-end
- [ ] The host can mute, remove, and end-for-all
- [ ] Device switcher works mid-call for mic, camera, and speaker
- [ ] Emoji reactions animate on tiles and broadcast to all participants
- [ ] Connection quality indicator is visible on all participant tiles
- [ ] Missed DM calls show a red badge on the Calls sidebar icon; channel calls do not
- [ ] Calls sidebar has Directory tab (online-first, searchable) and Recents tab
- [ ] Calling a user who is `in_call` shows a warning toast before ringing
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
| Channel call model | Open room / huddle — no ring, passive join, banner in thread + pulsing sidebar indicator |
| DM call model | Direct ring — corner popup + push notification + 30s timeout |
| Channel call empty timeout | 5 minutes via LiveKit `room.empty_timeout: 300` — no worker needed |
| Channel calls in missed badge | Never — history only, no badge increment |
| Concurrent calls | Soft-switch prompt — user chooses to leave current and join new |
| Calling someone in a call | Warning toast to caller, ring goes through, callee gets soft-switch |
| In-call chat | None — media-only overlay; minimise to use thread |
| Minimised overlay | Floating pill bottom-left — duration, mic toggle, end button |
| Device switcher | In-call via `useMediaDevices()` hook, settings icon in `<CallControls />` |
| Connection quality | All tiles via `useConnectionQuality()` |
| Emoji reactions | Full picker via `useDataChannel()` — zero server round-trip |
| Call directory layout | Online-first then alphabetical, search bar, presence indicators |
| Calls sidebar structure | Two tabs: Directory (who to call) + Recents (history + missed badge) |
| LiveKit deployment | Same VPS (`work-holo-internal`) via Coolify — no new server needed |
