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

- [ ] **Global search is hardcoded fake data** — `apps/web/src/components/workspace/layout/header/global-search.tsx` opens a `CommandDialog` with static results: "John Doe", "Jane Smith", "Q4 Report.pdf" — no API calls at all. The per-channel message search in `channel-header.tsx` IS fully functional. Workspace-level search needs real API integration (members, channels, files, messages)
- [ ] **Console — more module configs** — only `communication` module has a console config page. Add console config pages for attendance and notifications under `/org/$slug/console/modules/`
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

### Web App

- [ ] **Keyboard shortcuts overlay** — `?` shortcut to show all keyboard shortcuts for power users
- [ ] **Workspace welcome/onboarding** — first-time org member sees guided setup (invite teammates, create first channel, mark attendance)

### Infrastructure / DevEx

- [ ] **E2E tests** — no test suite exists. Add Playwright for: signup, org creation, clock-in, send message
- [ ] **Health check** — `publicProcedure.handler(() => "OK")` exists — wire a real health check that pings DB and Redis
- [ ] **Rate limiting** — add Hono rate-limiting middleware on auth and clock-in endpoints
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
