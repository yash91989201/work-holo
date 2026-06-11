---
description: Verify the calling feature end-to-end — checks LiveKit health, walks through manual 2-tab test scenarios, then validates DB state and Pusher events fired correctly.
allowed-tools: [Bash, Read]
---

You are verifying the work-holo calling feature works correctly. Run each step in order and report pass/fail clearly.

---

## Step 1 — Infrastructure Health

Run these checks in parallel:

```bash
# LiveKit running?
curl -s http://localhost:7880 | head -5

# Dev server running?
curl -s http://localhost:3000/api/health 2>/dev/null || echo "server not running"

# Postgres reachable?
docker compose ps postgres | grep -c "running"

# soketi (Pusher) running?
docker compose ps soketi | grep -c "running"
```

Report each as ✅ or ❌. If LiveKit is not running, stop here and tell the user to run `docker compose up livekit -d` before continuing.

---

## Step 2 — DB Schema Check

Verify both call tables exist:

```bash
docker compose exec postgres psql -U postgres -d work_holo -c "\dt" 2>/dev/null | grep -E "call$|callParticipant"
```

Expected output: two rows — `call` and `callParticipant`. If missing, tell the user to run `/migrate`.

---

## Step 3 — LiveKit Room API Check

```bash
# List active rooms (should be empty at test start)
curl -s http://localhost:7880/twirp/livekit.RoomService/ListRooms \
  -H "Content-Type: application/json" \
  -d '{}' 2>/dev/null | head -20
```

Note: This requires a valid LiveKit API token. If it returns 401, confirm `LIVEKIT_API_KEY` and `LIVEKIT_API_SECRET` are set in the server `.env`.

---

## Step 4 — Manual Test Scenarios

Tell the user:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MANUAL TESTING REQUIRED — Open 2 browser tabs
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tab 1: Log in as User A
Tab 2: Log in as User B (use incognito or a different browser)

Run each scenario below and confirm pass/fail.
```

### Scenario 1 — 1-1 Voice Call (happy path)
```
1. Tab 1 (User A): Open DM with User B
2. Tab 1: Click the Voice Call button in the DM header
3. EXPECT Tab 2 (User B): Corner popup appears within 2 seconds — "Incoming voice call from [User A]"
4. EXPECT Tab 1 (User A): "Calling..." state shown
5. Tab 2: Click Accept (green button)
6. EXPECT both tabs: CallOverlay opens, audio connection established
7. EXPECT both tabs: Participant tiles visible, connection quality indicator showing
8. Tab 1: Click End Call
9. EXPECT both tabs: Overlay closes
10. EXPECT both DM threads: Inline call event — "Voice call · Xs"
```

### Scenario 2 — Missed Call (ring timeout)
```
1. Tab 1 (User A): Start a voice call to User B
2. EXPECT Tab 2: Incoming popup appears
3. DO NOTHING on Tab 2 — wait 30 seconds
4. EXPECT Tab 1: "No answer" or "Missed call" state shown, overlay closes
5. EXPECT Tab 2: Popup auto-dismisses
6. EXPECT Calls sidebar on Tab 2: Missed call badge (red dot) on Calls icon
7. EXPECT DM thread: "📞 Voice call · Missed"
```

### Scenario 3 — Call Rejected
```
1. Tab 1 (User A): Start a video call to User B
2. EXPECT Tab 2: Incoming popup with "Video call" badge
3. Tab 2: Click Decline (red button)
4. EXPECT Tab 1: "Call declined" or call ends immediately
5. EXPECT DM thread: "📹 Video call · Declined"
```

### Scenario 4 — Channel Huddle (open-room model)
```
1. Tab 1 (User A): Open a channel both users are in
2. Tab 1: Click the Call button in the channel header
3. EXPECT Tab 1: CallOverlay opens immediately (no ring)
4. EXPECT both tabs: Pulsing green dot appears on channel name in sidebar
5. EXPECT both threads: "Call in progress · 1 joined · Join" banner in channel
6. Tab 2: Click "Join" on the banner
7. EXPECT both tabs: Both participants visible in call
8. Tab 1: Leave the call
9. EXPECT Tab 2: Still in call alone, pulsing indicator still visible
10. Wait 5 minutes OR Tab 2 also leaves
11. EXPECT both tabs: Pulsing indicator disappears, banner updates to show call ended
```

### Scenario 5 — Soft Switch
```
1. Tab 1 (User A): Start a DM call with User B and accept it (both in call)
2. From a second DM (open separate tab or have User C call User A)
3. EXPECT Tab 1: "Leave current call and join this one?" prompt appears
4. Click Cancel — EXPECT: stays in original call
5. Click Confirm — EXPECT: original call ends, joins new call
```

### Scenario 6 — Minimise to Pill
```
1. Start any active call
2. Click the minimise button in CallOverlay
3. EXPECT: Full overlay disappears, small pill appears bottom-left
4. EXPECT pill: Shows call duration ticking up, mic toggle button, end call button
5. Navigate to a different channel
6. EXPECT: Pill persists, call remains connected
7. Click pill to expand
8. EXPECT: Full CallOverlay reopens
```

### Scenario 7 — Device Switcher
```
1. Start any active call
2. Click the settings/gear icon in CallControls
3. EXPECT: Dropdown shows available microphones, speakers, cameras
4. Switch to a different mic (if available)
5. EXPECT: No call drop, audio continues on new device
```

### Scenario 8 — Emoji Reactions
```
1. Start a 2-person call
2. Click the reaction picker in CallControls
3. EXPECT: Emoji picker opens (👍 ❤️ 😂 🎉 ✋)
4. Click an emoji
5. EXPECT: Floating emoji animation appears on YOUR tile in BOTH tabs for ~3 seconds
6. EXPECT: No network request made (pure LiveKit data channel)
```

---

## Step 5 — DB State Validation

After completing scenarios, validate the database:

```bash
# Check call records created
docker compose exec postgres psql -U postgres -d work_holo -c \
  "SELECT id, type, status, \"startedAt\", \"endedAt\" FROM call ORDER BY \"createdAt\" DESC LIMIT 5;"

# Check participants recorded correctly
docker compose exec postgres psql -U postgres -d work_holo -c \
  "SELECT cp.\"userId\", cp.role, cp.\"joinedAt\", cp.\"leftAt\", cp.\"isRemoved\"
   FROM \"callParticipant\" cp
   ORDER BY cp.\"createdAt\" DESC LIMIT 10;"

# Check missed calls have correct status
docker compose exec postgres psql -U postgres -d work_holo -c \
  "SELECT id, status, type FROM call WHERE status = 'missed' ORDER BY \"createdAt\" DESC LIMIT 3;"
```

Expected:
- Ended calls: `status = 'ended'`, both `startedAt` and `endedAt` populated
- Missed calls: `status = 'missed'`, `startedAt` null, `endedAt` null
- Each participant: `joinedAt` populated, `leftAt` populated after leaving

---

## Step 6 — Report

Summarise results in this format:

```
## Call Feature Test Results

### Infrastructure
- LiveKit: ✅/❌
- Dev Server: ✅/❌
- DB Tables: ✅/❌

### Scenarios
- Scenario 1 (1-1 Voice, happy path): ✅/❌
- Scenario 2 (Missed call, 30s timeout): ✅/❌
- Scenario 3 (Rejected call): ✅/❌
- Scenario 4 (Channel huddle): ✅/❌
- Scenario 5 (Soft switch): ✅/❌
- Scenario 6 (Minimise to pill): ✅/❌
- Scenario 7 (Device switcher): ✅/❌
- Scenario 8 (Emoji reactions): ✅/❌

### DB State
- Call records accurate: ✅/❌
- Participant records accurate: ✅/❌
- Missed calls correct status: ✅/❌

### Bugs Found
[list any failures with reproduction steps]
```
