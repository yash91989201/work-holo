# Work Holo — Task Board

> Format: `[ ]` TODO · `[~]` IN PROGRESS · `[x]` DONE  
> Priority: 🔴 Critical · 🟠 High · 🟡 Medium · 🟢 Low  
> Updated: 2026-06-10

---

# Phase 1 — Calling Feature

> **Goal:** Ship production-grade voice & video calling (Slack Huddles / WhatsApp model)  
> **Stack:** LiveKit self-hosted · Pusher signaling · RabbitMQ DLX · Zustand callStore  
> **Estimated delivery:** 6–7 weeks (with Claude AI)  
> **PRD:** `docs/PRD-calling-feature.md`

---

## 1.1 — Infrastructure Setup
> Week 1 · Blocker for everything else · Do this first

- [x] 🔴 Add LiveKit service to local `docker-compose.yml` (image, ports 7880/7881/UDP range)
- [x] 🔴 Create `infra/livekit/livekit.yaml` — API key, secret, TURN config, `room.empty_timeout: 300`
- [ ] 🔴 Open firewall ports on VPS (`work-holo-internal`) — TCP 7880, TCP 7881, UDP 50000–60000
- [ ] 🔴 Add LiveKit as new service in Coolify on `work-holo-internal`
- [ ] 🔴 Verify room creation end-to-end — `lk room create` confirms media flows before writing app code

---

## 1.2 — Database & Backend Foundation
> Week 2 · Depends on 1.1

- [x] 🔴 Create `packages/db/src/schema/call.ts` — `call` table (id, orgId, type, status, initiatorId, sourceConversationId, sourceType, livekitRoomName, startedAt, endedAt, createdAt, updatedAt) + export from `schema/index.ts` barrel
- [x] 🔴 Create `callParticipant` table in same file (id, callId, userId, role, joinedAt, leftAt, isRemoved, createdAt, updatedAt)
- [x] 🔴 Run `bun run db:generate && bun run db:migrate`
- [x] 🔴 Add `CALLING: "calling"` to `packages/api/src/lib/module-ids.ts` (moduleSchema + `listAllowedUsers` auto-derive from this — no other permission code needed)
- [x] 🔴 Add `callingProcedure` to `packages/api/src/index.ts` — mirror `dmProcedure` module-enablement middleware
- [x] 🔴 Scaffold oRPC call router — `packages/api/src/routers/communication/call.ts` (initiate, accept, reject, cancel, end, getJoinToken, addParticipant, list)
- [x] 🔴 LiveKit JWT token generation — server-side per-user per-room access tokens
- [x] 🟠 Register call router in the main router index

---

## 1.3 — Signaling, State Machine & Ring Timeout
> Week 3 · Depends on 1.2

- [x] 🔴 Pusher DM signaling events — `call.incoming`, `call.accepted`, `call.rejected`, `call.cancelled`, `call.ended`, `call.missed` on `private-user-{userId}`
- [x] 🔴 Pusher channel call events — `call.channel.started`, `call.channel.ended` on `private-org-{orgId}`
- [x] 🔴 RabbitMQ DLX queue for 30s ring timeout — `CALL_RING_TIMEOUT` (TTL 30s + DLX) → `CALL_RING_TIMEOUT_DLX` in `packages/infrastructure/src/queue.ts` (verified: message dead-letters after 30s)
- [x] 🔴 Create `workers/call-timeout/` — DLX consumer: checks if call still `ringing` → marks `missed` → fires `call.missed` to both parties (verified: boots, consumes, idempotent no-op when call not ringing)
- [x] 🔴 oRPC endpoints — `accept`, `reject`, `cancel`, `end` in call router
- [x] 🔴 oRPC endpoint — `addParticipant` (mid-call invite)
- [x] 🔴 LiveKit webhook handler — `apps/server/src/lib/livekit-webhook.ts`, route `/webhooks/livekit` registered in `apps/server/src/index.ts`, webhook URL configured in `livekit.yaml` — handles `room_finished`, `participant_joined`, `participant_left` → syncs DB
- [x] 🟠 Presence integration — `setInCall` helper added to `presence.ts`; set `in_call` on accept (both parties) + channel initiate, clear on end (all participants)
- [ ] 🟠 Auto-create DM when calling from directory with no prior conversation — deferred to 1.6 entry-points work

---

## 1.4 — Frontend Core State & Incoming Call
> Week 4 · Depends on 1.3

- [x] 🔴 Create `callStore` (Zustand) — `apps/web/src/stores/call-store.ts`, mirror `dm-store.ts` pattern (no provider needed — Zustand stores are global hooks)
- [x] 🔴 Mount call UI in workspace layout `routes/(authenticated)/org/$slug/workspace/route.tsx` via `<CallManager />` — persists across workspace navigation (full `<CallOverlay />`/`<CallPill />` are 1.5; placeholder bar in place)
- [x] 🔴 Wire Pusher event listeners to `callStore` — `use-call-events.ts` subscribes `private-user-{userId}` for `call.incoming`/`accepted`/`rejected`/`cancelled`/`ended`/`missed`
- [ ] 🔴 New org-level Pusher hook — client does NOT yet subscribe to `private-org-{orgId}`; create `use-org-call-events.ts` (mirror `use-channel-presence.ts`) — deferred to 1.6 (channel calls)
- [x] 🔴 `<IncomingCallPopup />` — corner notification, caller avatar, call type badge (voice/video), accept (green) / decline (red), looping ringing sound
- [x] 🔴 Accept flow → `use-call.ts` requests join token via `accept` oRPC → sets activeCall (opens overlay in 1.5)
- [x] 🔴 Decline flow → fire `reject` oRPC call → dismiss popup
- [x] 🔴 Auto-dismiss after 32s safety timer (in addition to server ring-timeout `call.missed` event)
- [x] 🟠 `<SoftSwitchPrompt />` — modal shown when `softSwitchPending` is set: "Leave [current call] and join this one?"
- [ ] 🟠 Push notification for background tab — wire incoming call event to existing push notification worker — deferred to 1.6 polish

---

## 1.5 — LiveKit Integration & Call UI
> Week 5 · Depends on 1.4

- [x] 🔴 Install `@livekit/components-react` — pinned v2.9.21 + livekit-client + components-styles (React 19.2.6 verified working)
- [x] 🔴 Wire `<LiveKitRoom>` with JWT token from store (`accept`/`initiate` return token); `VITE_LIVEKIT_URL` added to web env
- [x] 🔴 `<CallOverlay />` — floating draggable window (pointer-drag handle), mounted in workspace layout via `<CallManager />`, persists across navigation
- [x] 🔴 `<CallPill />` — minimized state: bottom-left pill, duration timer, mic toggle, end/leave button. Toggle via `isMinimized` in callStore
- [x] 🔴 `<ParticipantGrid />` — `GridLayout` for ≤4 participants
- [x] 🔴 `<ActiveSpeakerLayout />` — `FocusLayout` + `CarouselLayout`, auto-switches at >4 tracks (loudest speaker focus)
- [x] 🔴 `<CallControls />` — mic toggle, camera toggle, device switcher, reactions, minimize, end/leave (add-participant in 1.6 host controls)
- [x] 🟠 `<DeviceSwitcher />` — dropdown for mic / speaker / camera via `useMediaDeviceSelect()`
- [x] 🟠 `<CallConnectionQuality />` — signal icon via `useConnectionQualityIndicator()` (renamed to avoid livekit `ConnectionQuality` enum collision)
- [x] 🟠 `<CallReactions />` — emoji picker (👍 ❤️ 😂 🎉 ✋) + floating animation via `useDataChannel("reactions")`, `float-up` keyframe in index.css
- [x] 🟠 Voice (audio-only) vs Video (camera-on) — `<LiveKitRoom video={type === "video"}>` sets initial track state
- [ ] 🟢 Reaction-on-sender-tile attribution — current impl floats reactions in a shared layer, not per-tile (polish, deferred)

---

## 1.6 — Entry Points, Channel Calls, Sidebar & Testing
> Week 6 · Depends on 1.5

- [x] 🔴 Voice + Video call buttons in DM conversation header (`<CallButtons />`)
- [x] 🔴 Call button in channel header — `<ChannelCallButton />` starts huddle (voice/video) or joins active one (no ring, ambient join)
- [x] 🔴 `<ChannelCallBanner />` — "call in progress · N joined · Join" banner inside channel thread (above MessageList)
- [x] 🔴 `<ChannelLiveIndicator />` — pulsing green dot on channel name in sidebar (both collapsed + expanded views), driven by `use-org-call-events` on `private-org-{orgId}`
- [x] 🔴 `use-org-call-events.ts` (deferred from 1.4) — subscribes `private-org-{orgId}` for `call.channel.started`/`ended`/`participant` → `callStore.activeChannelCalls`
- [x] 🔴 `<CallsSection />` — new sidebar group at `components/workspace/layout/sidebar/groups/calls.tsx` (mirror `groups/dm.tsx`) with two tabs: **Directory** and **Recents**
- [x] 🔴 `<CallDirectory />` — org members list: online-first then alphabetical, presence indicators (green/yellow/grey), search bar, call button per member. Filtered by `listAllowedUsers("calling")`
- [x] 🔴 `<CallRecents />` — aggregated call history across all conversations: missed calls (red badge), outgoing, incoming, channel calls. Quick-redial button per entry
- [x] 🔴 `<CallHistoryItem />` — inline call event in DM/channel thread ("📞 Voice call · 4m 32s" or "📹 Video call · Missed")
- [x] 🟠 Host controls in `<CallControls />` — mute individual participant, remove participant, end call for all (visible to host only)
- [x] 🟠 Add participant mid-call — search and invite org members to an active call
- [x] 🟠 Warning toast when initiating call to user with `in_call` presence status
- [x] 🟠 Missed call badge — red dot on Calls sidebar icon (DM missed calls only, not channel calls)
- [ ] 🟡 End-to-end call flow testing — 1-1 voice, 1-1 video, group call, channel huddle, mid-call add, rejoin after tab close
- [ ] 🟡 Bug fixes and polish pass

---

## 1.7 — Screen Sharing
> Phase 1B · ~1 week · Depends on 1.6 complete

- [ ] 🟠 Publish screen track via `getDisplayMedia` as separate LiveKit track
- [ ] 🟠 Screen share button in `<CallControls />`
- [ ] 🟠 Viewer layout — screen share tile becomes dominant tile, other video tiles shrink
- [ ] 🟠 "You are sharing your screen" indicator bar + stop sharing button
- [ ] 🟡 Transfer presenter role (give screen share control to another participant)
- [ ] 🟡 Testing & polish

---

## 1.8 — Call Recording
> Phase 1C · ~1.5 weeks · Depends on 1.7 complete

- [ ] 🟠 Deploy LiveKit Egress service in Coolify (separate container, same VPS)
- [ ] 🟠 Configure RustFS bucket as Egress recording destination
- [ ] 🟠 Recording start/stop API — host-only oRPC endpoints
- [ ] 🟠 Recording status indicator in call overlay ("🔴 Recording" badge)
- [ ] 🟠 Store recording metadata in new `callRecording` DB table
- [ ] 🟡 Recording playback UI in call history / Recents tab
- [ ] 🟡 Access control — who can view recordings (host, all participants, org admins)
- [ ] 🟡 Testing & polish

---

---

# Phase 2 — Platform Gaps & Polish

> **Goal:** Close existing feature gaps across attendance, communication, and org management  
> **Start after:** Phase 1.6 (calling core) is shipped

---

## 🔴 Critical — Broken / Placeholder

- [ ] **Attendance Settings page is a placeholder** — `apps/web/src/routes/(authenticated)/org/$slug/workspace/attendance/settings.tsx` renders `Hello "/.../apps/attendance/settings"!` — needs actual UI for org-level attendance config (shift hours, clock-in methods, geofence rules, IP restrictions)
- [ ] **Manage Org page is a placeholder** — `apps/web/src/routes/(authenticated)/org/$slug/manage/index.tsx` shows "coming soon" — org owner controls (billing, danger zone, org rename/delete) are entirely missing
- [ ] **Native app is a scaffold** — `apps/native/app/(drawer)/(tabs)/index.tsx` is "Tab One" placeholder — zero real screens built for mobile

---

## 🟠 High — Feature Gaps

### Attendance Module

- [ ] **Attendance Settings — backend + UI** — implement org-level attendance config: define work hours (start/end), allowed clock-in methods (manual, QR, geofence, IP), overtime rules, break policy. Backend: new `attendanceSettingsTable` schema + CRUD procedures. Frontend: replace placeholder settings page
- [ ] **Attendance admin console route** — add `/org/$slug/console/modules/attendance` route for admins to view/edit all member attendance records, approve manual entries, override status. Backend procedures exist in `records.ts` — needs frontend table + filters
- [ ] **Attendance module gating** — `MODULE_IDS` only has `DIRECT_MESSAGE` and `CALLING`. Add `ATTENDANCE` module ID and create an `attendanceProcedure` base so attendance can be enabled/disabled per org
- [ ] **Shift management** — `attendanceTable.shiftId` exists in schema but no shift system is built. Add `shiftTable` schema, shift assignment procedures, and frontend shift management UI in console
- [ ] **QR code clock-in** — schema supports `clockInMethod: "qr_code"` but no QR generation or scan flow exists. Add QR generation endpoint + scanner UI (web + native)
- [ ] **Geofence clock-in** — schema supports `clockInMethod: "geofence"` but no geofence config or location validation exists. Add geofence zone management in settings + location check on clock-in

### Communication Module

- [ ] **Global search is hardcoded fake data** — `apps/web/src/components/workspace/layout/header/global-search.tsx` opens a `CommandDialog` with static results: "John Doe", "Jane Smith", "Q4 Report.pdf" — no API calls at all. The per-channel message search in `channel-header.tsx` IS fully functional. Workspace-level search needs real API integration (members, channels, files, messages)
- [ ] **Console — more module configs** — only `communication` module has a console config page. Add console config pages for attendance, calling, and notifications under `/org/$slug/console/modules/`
- [ ] **Channel archive UI** — `archiveChannel` procedure exists in backend but channel header has no archive option. Add archive to channel info sidebar

### Org / Team

- [ ] **Org manage section** — org owner controls: rename org, change slug, upload logo, transfer ownership, delete org. Backend partially exists in auth layer — needs oRPC wrappers + frontend
- [ ] **Team-based attendance view** — admins can view all members' attendance but no team filter. Add team filter to attendance admin console
- [ ] **Member role management** — console members table exists but role change flow (member → admin → owner) needs verification and UI wiring

---

## 🟡 Medium — Polish & Completeness

### Attendance

- [ ] **Attendance export** — CSV/Excel export for attendance records (admin view). Backend: export procedure. Frontend: download button in admin console
- [ ] **Attendance status correction** — admins manually correct status (absent → present) with a note. Backend: `updateAttendanceStatus` procedure. Frontend: edit action in admin table
- [ ] **Attendance analytics — team breakdown** — analytics currently shows user-level data only. Add team-level breakdown chart

### Communication

- [ ] **Cross-channel message search** — per-channel search in channel header works. Missing: DM search UI, and a workspace-wide search page across all channels at once

### Settings

- [ ] **Two-factor authentication** — security page ONLY has `ChangePasswordForm`. No 2FA at all. Add TOTP flow via Better Auth's 2FA plugin
- [ ] **Account deletion** — no danger zone or account deletion anywhere in settings. Add confirmation flow
- [ ] **Email verification** — verify enforcement on signup and that resend-verification works

### Platform Admin

- [ ] **Admin (non-super-admin) overview** — regular admins land on a blank "use the sidebar" page. Super admins get live stats. Give admins an org-scoped overview instead

---

## 🟢 Low — Nice to Have

### Native App (Expo)

- [ ] **Native auth screens** — login and signup using Better Auth's React Native client
- [ ] **Native attendance screen** — clock in/out from mobile with current location
- [ ] **Native notifications** — push notification integration for attendance and communication events
- [ ] **Native communication** — DM and channel message reading (read-only or full compose)
- [ ] **Native org switcher** — switch between orgs on mobile
- [ ] **Native calling** — add `expo-dev-client`, install `@livekit/react-native`, wire call screens (depends on Phase 1 web calling complete)

### Web App

- [ ] **Keyboard shortcuts overlay** — `?` shortcut to show all keyboard shortcuts for power users
- [ ] **Workspace welcome/onboarding** — first-time org member sees guided setup (invite teammates, create first channel, mark attendance)

### Infrastructure / DevEx

- [ ] **E2E tests** — no test suite exists. Add Playwright for: signup, org creation, clock-in, send message, initiate call
- [ ] **Health check** — `publicProcedure.handler(() => "OK")` exists — wire a real health check that pings DB, Redis, and LiveKit
- [ ] **Rate limiting** — add Hono rate-limiting middleware on auth, clock-in, and call initiation endpoints
- [ ] **Error monitoring** — add Sentry (or equivalent) to web and server

---

## ✅ Done

- [x] Auth — Login, signup, accept invitation — complete
- [x] Org — Create org, org switcher, presence roster on org home — complete
- [x] Communication — Channels: rich text composer, attachments, audio, mentions, threads, reactions, pinning, read receipts, unread counts — complete
- [x] Communication — Direct Messages: full DM flow, typing indicator, reactions, threads, pins, file sharing — complete
- [x] Communication — Channel message search (per-channel): keyboard shortcut, infinite scroll, thread highlight — complete
- [x] Communication — Files browser: grid/table view, debounced search, type/sort/sender filters — complete
- [x] Communication — Module config (org-wide / team-based / user-specific / disabled) — complete
- [x] Attendance — Clock in/out with work blocks — complete
- [x] Attendance — Analytics page: range selector, trend chart, status breakdown, insights — complete
- [x] Attendance — Admin records view (list, detail, stats) — backend complete
- [x] Notifications — In-app notification system with per-event preferences — complete
- [x] Notifications — Push notifications (web service worker + native) — complete
- [x] Notifications — Sound preferences (presets + custom upload) — complete
- [x] Teams — Team management, create team, team member management — complete
- [x] Presence — Real-time online/away/busy via Pusher with manual status override — complete
- [x] Settings — Profile, preferences (theme, font, spacing, radius), sessions, change password, notification preferences — complete
- [x] Console — Members list, member detail, invitations, teams management — complete
- [x] Platform Admin — Users, orgs, org detail, admins, owners, support agents (ban/unban, role management) — complete
- [x] Platform Admin — Live stats cards for super_admin (total users, orgs, admins, support agents, banned) — complete
- [x] Storage — File upload to object storage, attachment CRUD, signed URL generation — complete
- [x] Real-time — Pusher integration for channels, DMs, presence, typing indicators — complete
- [x] ElectricSQL — Local-first sync proxy wired for offline-capable reads — complete
- [x] Client-side message ID generation (cuid2) for optimistic UI updates — complete
- [x] Agent system — 7 review agents, 8 commands, 4 skills in `.claude/` — complete (2026-06-03)
