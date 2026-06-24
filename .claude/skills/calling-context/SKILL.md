---
name: calling-context
description: Load all architectural decisions, DB schema, component map, and file locations for the work-holo Calling feature. Invoke at the start of any session touching Phase 1 (calling). Prevents re-deriving decisions already made.
allowed-tools: [Read]
---

You are loading context for the **work-holo Calling Feature** (Phase 1).

All decisions below were made and are final. Do not re-derive or re-question them unless the user explicitly asks to revisit.

---

## Current Phase Status

Read `tasks.md` and report which Phase 1.x sub-phase is currently in progress or up next.

---

## Architecture Decisions (Final)

### Media Server
- **LiveKit self-hosted** on `work-holo-internal` VPS via Coolify (same VPS as backend)
- Local dev: LiveKit runs in `docker-compose.yml`
- Config file: `infra/livekit/livekit.yaml`
- `room.empty_timeout: 300` — channel calls auto-close after 5 min with 1 participant
- Ports: TCP 7880, TCP 7881, UDP 50000–60000

### Call Types at Initiation
- **Voice call** — audio-only, camera off by default
- **Video call** — camera on by default
- User picks at initiation. Both types support mid-call camera toggle.

### DM Calls vs Channel Calls — Different Models
| | DM Call | Channel Call |
|--|---------|--------------|
| Ring model | Direct ring (corner popup + push notification) | Open room / huddle — no ring |
| Notification | `private-user-{userId}` Pusher + push worker | `private-org-{orgId}` Pusher broadcast |
| Timeout | 30s ring timeout → missed (RabbitMQ DLX) | 5-min empty timeout (LiveKit native) |
| Missed badge | Yes — increments red badge | No — history entry only |
| Dismiss | Accept / Decline / Auto-dismiss after 30s | Join freely, leave freely |

### Call State Machine — DM
```
initiated → ringing → active → ended
                   ↘ missed (30s DLX)
                   ↘ rejected (callee declines)
                   ↘ cancelled (caller hangs up before answer)
```

### Call State Machine — Channel
```
initiated → active immediately (no ringing phase)
          → ended (host ends for all OR last person leaves → 5-min timeout)
```

### LiveKit Webhook → DB Sync
- `room_finished` → mark call `ended`, set `endedAt`
- `participant_joined` → set `callParticipant.joinedAt`
- `participant_left` → set `callParticipant.leftAt`
- Webhook handler: `apps/server/src/lib/livekit-webhook.ts`, registered as a Hono route in `apps/server/src/index.ts` (mirror how the auth route is registered — there is NO `apps/server/src/api/` directory)

### Concurrent Calls — Soft Switch
- User can only be in ONE call at a time
- Trying to join a second: prompt "Leave [current] and join this one?"
- No auto-end — user decides
- Managed by `softSwitchPending` in `callStore`

### Calling Someone Already in a Call
- Show warning toast: *"[Name] is on a call — they may not answer"*
- Ring goes through anyway
- Callee gets incoming popup and can soft-switch

---

## Database Schema

### `call` table — `packages/db/src/schema/call.ts`
```
id               cuid2 PK
orgId            text FK → organization
type             enum: 'voice' | 'video'
status           enum: 'ringing' | 'active' | 'missed' | 'rejected' | 'cancelled' | 'ended'
initiatorId      text FK → user  (also the host)
sourceConversationId  text nullable  (FK → dmConversation or channel id)
sourceType       enum: 'dm' | 'channel' nullable
livekitRoomName  text unique  (convention: `call_${callId}`)
startedAt        timestamp nullable  (when first participant joined)
endedAt          timestamp nullable
createdAt        timestamp
updatedAt        timestamp  (project convention — $onUpdate(() => new Date()))
```

> Schema conventions verified against `packages/db/src/schema/direct-message.ts`: `import { cuid2 } from "drizzle-cuid2/postgres"`, `timestamp({ withTimezone: true })`, indexes as array in third arg, barrel export from `schema/index.ts`. DM tables have NO soft-delete column — calls don't need one either.

### `callParticipant` table — same file
```
id         cuid2 PK
callId     text FK → call (cascade delete)
userId     text FK → user
role       enum: 'host' | 'participant'
joinedAt   timestamp nullable
leftAt     timestamp nullable
isRemoved  boolean default false  (set by host when removing)
createdAt  timestamp
updatedAt  timestamp
```

---

## Pusher Channel Names for Calls

| Event | Channel | Payload |
|-------|---------|---------|
| Incoming DM call | `private-user-{calleeId}` | `{ callId, callerId, callerName, callerAvatar, type: 'voice'|'video' }` |
| Call accepted | `private-user-{callerId}` | `{ callId }` |
| Call rejected | `private-user-{callerId}` | `{ callId }` |
| Call cancelled | `private-user-{calleeId}` | `{ callId }` |
| Call ended | `private-user-{userId}` | `{ callId }` (sent to all participants) |
| Channel call started | `private-org-{orgId}` | `{ callId, channelId, initiatorName, type }` |
| Channel call ended | `private-org-{orgId}` | `{ callId, channelId }` |
| Participant joined channel call | `private-org-{orgId}` | `{ callId, channelId, userId, participantCount }` |

> Verified: server already triggers on `private-user-${userId}` (see `workers/notification/src/lib/handlers/pusher.ts`) and `private-org-${orgId}` exists server-side in the realtime router. The web client does NOT yet subscribe to `private-org-{orgId}` — a new hook is needed (mirror `apps/web/src/hooks/communications/use-channel-presence.ts`). Client subscribe pattern + ringing sound reuse: `apps/web/src/hooks/communications/use-notification-sound.ts`.

---

## LiveKit Room Naming Convention
```
call_{callId}
```
Example: `call_cm9x3a2b0000a1b2c3d4e5f6`

---

## callStore Shape (Zustand)

```typescript
interface CallStore {
  // Active call state
  activeCall: {
    callId: string
    roomName: string
    type: 'voice' | 'video'
    sourceType: 'dm' | 'channel' | null
    sourceConversationId: string | null
    isHost: boolean
    livekitToken: string
  } | null

  // Incoming call (DM ring)
  incomingCall: {
    callId: string
    callerId: string
    callerName: string
    callerAvatar: string | null
    type: 'voice' | 'video'
  } | null

  // UI state
  isMinimized: boolean

  // Soft switch — pending call to switch to
  softSwitchPending: {
    callId: string
    callerName: string
    type: 'voice' | 'video'
  } | null

  // Actions
  setActiveCall: (call: CallStore['activeCall']) => void
  setIncomingCall: (call: CallStore['incomingCall']) => void
  clearIncomingCall: () => void
  endCall: () => void
  toggleMinimized: () => void
  setSoftSwitchPending: (call: CallStore['softSwitchPending']) => void
  clearSoftSwitch: () => void
}
```

---

## Permission Model
- Module ID: `CALLING = "calling"` in `packages/api/src/lib/module-ids.ts`
- `moduleSchema` in `packages/api/src/routers/org/module-config.ts` is derived from `Object.values(MODULE_IDS)` — adding CALLING to module-ids.ts automatically makes `listAllowedUsers("calling")` and module config work. No other permission code needed.
- New `callingProcedure` mirrors `dmProcedure` in `packages/api/src/index.ts` (lines ~117–208) — copy its module-enablement middleware, swap module ID
- Same system as `DIRECT_MESSAGE` — org admin controls access
- Modes: `disabled` | `org_wide` | `team_based` | `user_based`
- Call directory filtered by `listAllowedUsers("calling")` — only shows callable members
- No permission needed to receive a call (only to initiate)

---

## Key File Locations

### New files to create (paths verified against codebase 2026-06-12)
| File | Purpose |
|------|---------|
| `packages/db/src/schema/call.ts` | DB schema (export from `schema/index.ts` barrel) |
| `packages/api/src/routers/communication/call.ts` | oRPC call router |
| `apps/server/src/lib/livekit-webhook.ts` | LiveKit webhook handler (register route in `apps/server/src/index.ts`) |
| `workers/call-timeout/` | RabbitMQ DLX ring timeout worker — mirror `workers/read-receipt/` structure (QueueWorker class, prefetch, ack pattern) |
| `infra/livekit/livekit.yaml` | LiveKit server config ✅ created |
| `apps/web/src/stores/call-store.ts` | Zustand callStore — mirror `stores/dm-store.ts` pattern. NO provider needed — Zustand stores are global hooks |
| `apps/web/src/hooks/communications/use-call.ts` | Call initiation hook (hooks live under `hooks/communications/`) |
| `apps/web/src/components/modules/communication/calls/` | All call UI components (matches existing `modules/communication/dm/` + `channels/` convention) |
| `apps/web/src/components/workspace/layout/sidebar/groups/calls.tsx` | Calls sidebar group (matches existing `groups/dm.tsx`, `groups/channel.tsx` pattern) |

### Existing files to modify
| File | Change |
|------|--------|
| `docker-compose.yml` | Add LiveKit service ✅ done |
| `packages/api/src/lib/module-ids.ts` | Add `CALLING: "calling"` — moduleSchema auto-derives from this |
| `packages/api/src/index.ts` | Add `callingProcedure` (mirror `dmProcedure`) |
| `packages/infrastructure/src/queue.ts` | Add CALL_RING_TIMEOUT queue with DLX args (existing QUEUES pattern: READ_RECEIPTS, NOTIFICATIONS, SEARCH_INDEXING — none use DLX yet) |
| `packages/api/src/routers/communication/index.ts` | Register call router |
| `apps/web/src/routes/(authenticated)/org/$slug/workspace/route.tsx` | Mount `<CallOverlay />`, `<CallPill />`, `<IncomingCallPopup />`, `<SoftSwitchPrompt />` inside `<SidebarInset>` — persists across workspace navigation (NOT `__root.tsx`; call UI needs authenticated org context) |
| `apps/web/src/components/workspace/layout/sidebar/groups/channel.tsx` | Add `<ChannelLiveIndicator />` pulsing dot |
| `apps/web/src/components/modules/communication/dm/dm-conversation-header.tsx` | Voice/video buttons in the `ml-auto` actions div |
| `apps/web/src/components/modules/communication/channels/channel-header.tsx` | Huddle button in actions area |

---

## New Frontend Components Map

| Component | Location | Purpose |
|-----------|----------|---------|
| `<CallOverlay />` | `components/modules/communication/calls/call-overlay.tsx` | Full floating call window |
| `<CallPill />` | `components/modules/communication/calls/call-pill.tsx` | Minimized pill, bottom-left |
| `<IncomingCallPopup />` | `components/modules/communication/calls/incoming-call-popup.tsx` | Corner ring notification |
| `<SoftSwitchPrompt />` | `components/modules/communication/calls/soft-switch-prompt.tsx` | Leave and join modal |
| `<ParticipantGrid />` | `components/modules/communication/calls/participant-grid.tsx` | ≤4 participants grid |
| `<ActiveSpeakerLayout />` | `components/modules/communication/calls/active-speaker-layout.tsx` | 5–25 participants layout |
| `<CallControls />` | `components/modules/communication/calls/call-controls.tsx` | Mic, camera, settings, reactions, end |
| `<DeviceSwitcher />` | `components/modules/communication/calls/device-switcher.tsx` | useMediaDevices() dropdown |
| `<CallReactionPicker />` | `components/modules/communication/calls/call-reaction-picker.tsx` | Emoji picker via useDataChannel() |
| `<ReactionAnimation />` | `components/modules/communication/calls/reaction-animation.tsx` | 3-second floating emoji on tile |
| `<ConnectionQualityIndicator />` | `components/modules/communication/calls/connection-quality.tsx` | Signal icon via useConnectionQuality() |
| `<ChannelCallBanner />` | `components/modules/communication/calls/channel-call-banner.tsx` | "Call in progress · N joined" in thread |
| `<ChannelLiveIndicator />` | `components/modules/communication/calls/channel-live-indicator.tsx` | Pulsing dot — rendered inside `sidebar/groups/channel.tsx` |
| `<CallsSection />` | `components/workspace/layout/sidebar/groups/calls.tsx` | Sidebar group with Directory + Recents tabs |
| `<CallDirectory />` | `components/modules/communication/calls/call-directory.tsx` | Online-first member list with search |
| `<CallRecents />` | `components/modules/communication/calls/call-recents.tsx` | Aggregated call history |
| `<CallHistoryItem />` | `components/modules/communication/calls/call-history-item.tsx` | Inline call event in DM/channel thread |

---

## Ring Timeout — RabbitMQ DLX Setup

```typescript
// Queue config to add to packages/infrastructure/src/queue.ts
CALL_RING_TIMEOUT: "call_ring_timeout"         // publish here on call initiate
CALL_RING_TIMEOUT_DLX: "call_ring_timeout_dlx" // dead-letter destination, worker consumes here

// Queue options for CALL_RING_TIMEOUT
{
  durable: true,
  arguments: {
    "x-message-ttl": 30_000,           // 30 seconds
    "x-dead-letter-exchange": "",       // default exchange
    "x-dead-letter-routing-key": "call_ring_timeout_dlx"
  }
}
```

---

## Calls Sidebar UX

- **Directory tab** — online-first then alphabetical, presence dots (green/yellow/grey), search bar, voice+video call buttons per member
- **Recents tab** — all calls across all conversations, chronological, missed DM calls show red "Missed" label, channel calls show "Call in #channel · N joined · Xm Xs", quick-redial button
- **Missed badge** — red dot on Calls nav icon, DM missed calls only, not channel calls

---

## Call Router Security Model (enforced in call.ts — do not regress)
- **Procedure base:** `initiate` + `addParticipant` use `callingProcedure` (need CALLING permission). `accept`/`reject`/`getJoinToken`/`cancel`/`end`/`list` use `orgMemberProcedure` — receiving/joining a call you were invited to must NOT require calling permission. They are gated by in-handler checks instead.
- **Every call lookup is org-scoped** via `getOrgCall(db, callId, orgId)` — `and(eq(id), eq(orgId))`. Never look up a call by id alone.
- **Token minting requires participation:** `getJoinToken`/`accept` only mint a LiveKit token after confirming a non-removed `callParticipant` row. Channel calls: `getJoinToken` verifies `channelMember` membership and inserts the participant row on first join.
- **`end` is host-only** (`actor.role === "host"`). **`cancel` is initiator-only.**
- **`initiate` validates** all `calleeIds` are org members (DM) / caller is a channel member (channel).
- **`list`** returns only calls the requester participated in (never the whole org's history).
- **Webhook** (`livekit-webhook.ts`) throws at load if `LIVEKIT_API_KEY/SECRET` missing (fail closed) — signature is verified by `WebhookReceiver`.
- `callParticipant` has a **unique index on `(callId, userId)`** — prevents duplicate rows from concurrent joins.

## Host Controls
- Mute individual participant (LiveKit `room.muteTrack`)
- Remove participant (LiveKit `room.removeParticipant` + mark `callParticipant.isRemoved = true`)
- End for all (call `end` oRPC endpoint + LiveKit `room.deleteRoom`)
- Controls visible to host only (check `callParticipant.role === 'host'`)

---

## Phase Tracker
See `tasks.md` Phase 1 section for detailed task checklist.
See `docs/PRD-calling-feature.md` for full PRD with timeline.
