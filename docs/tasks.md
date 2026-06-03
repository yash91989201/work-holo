# Work Holo — Task Board

> Format: `[ ]` TODO · `[~]` IN PROGRESS · `[x]` DONE  
> Priority: 🔴 Critical · 🟠 High · 🟡 Medium · 🟢 Low  
> Updated: 2026-06-03

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
- [ ] **Attendance module gating** — `MODULE_IDS` only has `DIRECT_MESSAGE`. Add `ATTENDANCE` module ID and create an `attendanceProcedure` base (like `dmProcedure`) so attendance can be enabled/disabled per org
- [ ] **Shift management** — `attendanceTable.shiftId` exists in schema but no shift system is built. Add `shiftTable` schema, shift assignment procedures, and frontend shift management UI in console
- [ ] **QR code clock-in** — schema supports `clockInMethod: "qr_code"` but no QR generation or scan flow exists. Add QR generation endpoint + scanner UI (web + native)
- [ ] **Geofence clock-in** — schema supports `clockInMethod: "geofence"` but no geofence config or location validation exists. Add geofence zone management in settings + location check on clock-in

### Communication Module

- [ ] **Global search** — `global-search.tsx` component exists in the workspace header but likely renders a stub. Needs full cross-channel message, file, and member search using the `searchMessages` procedure
- [ ] **Console — more module configs** — only `communication` module has a console config page. Add console config pages for other modules (attendance, notifications) under `/org/$slug/console/modules/`
- [ ] **Notification sound preferences** — `sound-preferences.ts` router exists but no UI in settings/notifications for configuring per-event sound alerts

### Org / Team

- [ ] **Org manage section** — org owner controls: rename org, change slug, upload org logo, transfer ownership, danger zone (delete org). Backend partially exists in auth layer — needs proper oRPC wrappers + frontend
- [ ] **Team-based attendance view** — admins can currently view all members' attendance, but no team-filtered view. Add team filter to the attendance admin console
- [ ] **Member role management** — console members table exists but role change (member → admin → owner) flow is unclear. Verify role mutation procedures exist and wire up UI

---

## 🟡 Medium — Polish & Completeness

### Attendance

- [ ] **Attendance export** — add CSV/Excel export for attendance records (admin view). Backend: new export procedure. Frontend: download button in admin console
- [ ] **Attendance status correction** — admins should be able to manually correct status (absent → present, late → present) with a note. Backend: `updateAttendanceStatus` procedure + approval flow. Frontend: edit action in admin table
- [ ] **Attendance analytics — team breakdown** — analytics page currently shows user-level data. Add team-level breakdown chart for org-wide attendance health

### Communication

- [ ] **File search in Files view** — files page has filter toolbar component but search may not be fully wired to the `searchAttachments` backend procedure
- [ ] **Channel archive UI** — `archiveChannel` procedure exists but no UI in the channel header to trigger it. Add archive option to channel settings
- [ ] **Message search** — `searchMessages` and `searchDmMessages` procedures exist but there's no dedicated search UI beyond whatever global-search does

### Settings

- [ ] **Two-factor authentication** — settings security page exists but 2FA setup (TOTP/authenticator app) may not be implemented. Verify Better Auth 2FA config and add setup UI
- [ ] **Account deletion** — settings security or danger zone should include account deletion flow. Check if Better Auth supports it and add the UI
- [ ] **Email verification flow** — verify that email verification is enforced on signup and that resend-verification works

### Platform Admin Dashboard

- [ ] **Support tickets view** — `/platform/dashboard/support/index.tsx` exists — verify it's functional or is a placeholder
- [ ] **Platform analytics** — overview dashboard at `/platform/dashboard/index.tsx` — check if it shows real metrics or is hardcoded

---

## 🟢 Low — Nice to Have

### Native App (Expo)

- [ ] **Native auth screens** — login and signup using Better Auth's React Native client
- [ ] **Native attendance screen** — clock in/out from mobile with current location
- [ ] **Native notifications** — push notification integration for attendance and communication events
- [ ] **Native communication** — DM and channel message reading (read-only or full compose)
- [ ] **Native org switcher** — switch between orgs on mobile

### Web App

- [ ] **Keyboard shortcuts** — add `?` shortcut overlay showing all keyboard shortcuts for power users
- [ ] **Dark/light mode persistence** — verify theme preference is saved and restored correctly across sessions
- [ ] **Workspace welcome/onboarding** — first-time org member should see a guided setup (invite teammates, create first channel, mark attendance)

### Infrastructure / DevEx

- [ ] **E2E tests** — no test suite exists. Add Playwright tests for critical flows: signup, org creation, clock-in, send message
- [ ] **Health check endpoint** — `publicProcedure.handler(() => "OK")` exists — wire a proper health check that pings DB and Redis
- [ ] **Rate limiting** — add Hono rate-limiting middleware on the server for auth and clock-in endpoints
- [ ] **Error monitoring** — add Sentry (or equivalent) to web and server for production error tracking

---

## ✅ Done

- [x] Auth — Login, signup, accept invitation flow — complete
- [x] Org — Create org, org switcher, presence roster on org home — complete
- [x] Communication — Channels: full message composer (rich text, attachments, audio, mentions), threads, reactions, pinning, read receipts, unread counts — complete
- [x] Communication — Direct Messages: full DM flow, typing indicator, reactions, threads, pins, file sharing — complete
- [x] Communication — Files browser with grid/table view, filter toolbar — complete
- [x] Communication — Module config (enable/disable, org-wide vs team-based vs user-specific) — complete
- [x] Attendance — Clock in/out with work blocks — complete
- [x] Attendance — Analytics page with range selector, trend chart, status breakdown, insights — complete
- [x] Attendance — Admin records view (list, detail, stats) — backend complete
- [x] Notifications — In-app notification system with preferences per event type — complete
- [x] Notifications — Push notifications (web service worker + native) — complete
- [x] Teams — Team management, create team, team member management — complete
- [x] Presence — Real-time online/away/busy via Pusher with manual status override — complete
- [x] Settings — Profile, preferences (theme, font, spacing, radius), sessions, security, notification preferences — complete
- [x] Console — Members list, member detail, invitations, teams management — complete
- [x] Platform Admin — Users, orgs, org detail, admins, owners, support views — complete
- [x] Storage — File upload to object storage, attachment CRUD, signed URL generation — complete
- [x] Real-time — Pusher integration for channels, DMs, presence, typing indicators — complete
- [x] ElectricSQL — Local-first sync proxy wired up for offline-capable reads — complete
- [x] Client-side message ID generation (cuid2) for optimistic UI updates — complete
- [x] Agent system — 7 review agents, 8 commands, 4 skills — complete (2026-06-03)
