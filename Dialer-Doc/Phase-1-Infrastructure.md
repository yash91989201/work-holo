# Phase 1 — Core Telephony Foundation

> **Goal:** Get a real PSTN call working end-to-end via FreeSWITCH before writing a single line of app code.
>
> **Timeline:** Weeks 1–3
>
> **Success Condition:** You can originate a real phone call using `fs_cli` and hear audio on both ends.

---

## What You Will Have at the End

```
Your Phone (PSTN)
      ↕
SIP Trunk Provider (e.g. Twilio, Telnyx, VoIP.ms)
      ↕
FreeSWITCH (running on VPS with public IP)
      ↕
SIP Softphone / WebRTC client (browser or Zoiper)
```

No app code. No workers. No database. Just raw telephony working.

---

## Prerequisites (Before You Start)

| What              | Details                                                       |
| ----------------- | ------------------------------------------------------------- |
| VPS provider      | DigitalOcean, Hetzner, AWS EC2, Vultr — any Linux VM          |
| OS                | Ubuntu 22.04 LTS (recommended)                                |
| Minimum specs     | 2 vCPU, 4 GB RAM (4 vCPU / 8 GB for production)               |
| Static public IP  | Required — FreeSWITCH + SIP cannot work behind NAT without it |
| SIP Trunk account | Telnyx (best for India), Twilio, or VoIP.ms                   |
| DID number        | Purchase at least 1 inbound number from your SIP provider     |
| Softphone         | Install **Zoiper5** (free) on your phone/laptop for testing   |
| Domain (optional) | Helpful but not required for Phase 1                          |

---

## Step 1 — Provision the VPS

### 1.1 Create your server

Recommended: **DigitalOcean Droplet** or **Hetzner CPX21**

- Ubuntu 22.04 LTS
- 4 vCPU / 8 GB RAM
- Assign a **Floating/Static IP** — do NOT use a server that changes IPs on reboot

### 1.2 SSH into the server

```bash
ssh root@<your-vps-ip>
```

### 1.3 Update system

```bash
apt update && apt upgrade -y
apt install -y curl wget gnupg2 software-properties-common
```

### 1.4 Configure the Firewall

```bash
# Allow SSH (don't lock yourself out)
ufw allow 22/tcp

# SIP signaling
ufw allow 5060/udp
ufw allow 5060/tcp
ufw allow 5080/udp
ufw allow 5080/tcp

# WebRTC / WSS (for browser clients later)
ufw allow 7443/tcp

# ESL — Event Socket (only allow from YOUR app server IP, not the world)
ufw allow from <your-app-server-ip> to any port 8021

# RTP Media (audio packets) — this range is mandatory
ufw allow 16384:32768/udp

# Enable firewall
ufw enable
ufw status
```

> ⚠️ **The RTP range (16384–32768 UDP) is critical.** If this is blocked, calls will connect but you'll hear silence (one-way or no audio).

---

## Step 2 — Install FreeSWITCH

### 2.1 Add FreeSWITCH repository

```bash
# Import signing key
wget -O - https://files.freeswitch.org/repo/deb/debian-release/fsstretch-archive-keyring.asc | apt-key add -

# For Ubuntu 22.04:
echo "deb [signed-by=/usr/share/keyrings/freeswitch-archive-keyring.gpg] https://files.freeswitch.org/repo/deb/debian-release/ bookworm main" \
  | tee /etc/apt/sources.list.d/freeswitch.list

# Alternative: use SignalWire token (recommended for newer installs)
# Register free at: https://signalwire.com/freeswitch
TOKEN=<your-signalwire-token>
wget --http-user=signalwire --http-password=$TOKEN \
  -O /usr/share/keyrings/signalwire-freeswitch-repo.gpg \
  https://freeswitch.org/repo/deb/debian-release/signalwire-freeswitch-repo.gpg
```

### 2.2 Install

```bash
apt update
apt install -y freeswitch freeswitch-meta-all
```

> This installs FreeSWITCH with all modules including Sofia-SIP (which handles SIP) and the event socket.

### 2.3 Start and enable

```bash
systemctl start freeswitch
systemctl enable freeswitch
systemctl status freeswitch   # Should show: active (running)
```

### 2.4 Verify with fs_cli

```bash
fs_cli
```

You should see a `freeswitch@hostname>` prompt. Run:

```
freeswitch@hostname> sofia status
```

Expected output shows 2 profiles:

- `internal` — for agent SIP registrations
- `external` — for SIP trunk / PSTN connections

Type `exit` to leave the CLI.

---

## Step 3 — Configure FreeSWITCH for Your Public IP

This is the **most important configuration step** — wrong IP = broken SIP.

### 3.1 Edit vars.xml

```bash
nano /etc/freeswitch/vars.xml
```

Find and set these lines:

```xml
<!-- Your public VPS IP -->
<X-PRE-PROCESS cmd="set" data="external_rtp_ip=<YOUR_VPS_PUBLIC_IP>"/>
<X-PRE-PROCESS cmd="set" data="external_sip_ip=<YOUR_VPS_PUBLIC_IP>"/>

<!-- Your public VPS IP (internal profile too) -->
<X-PRE-PROCESS cmd="set" data="local_ip_v4=<YOUR_VPS_PUBLIC_IP>"/>
```

Replace `<YOUR_VPS_PUBLIC_IP>` with your actual VPS IP (e.g. `157.230.12.56`).

### 3.2 Restart FreeSWITCH

```bash
systemctl restart freeswitch
fs_cli -x "sofia status"
```

Both `internal` and `external` profiles should show `RUNNING`.

---

## Step 4 — Configure SIP Trunk (Provider Gateway)

This connects FreeSWITCH to your SIP provider so it can make/receive PSTN calls.

### 4.1 Create gateway config file

```bash
nano /etc/freeswitch/sip_profiles/external/my_trunk.xml
```

#### For Telnyx (Recommended for India):

```xml
<include>
  <gateway name="telnyx_trunk">
    <param name="username" value="<YOUR_TELNYX_SIP_USERNAME>"/>
    <param name="password" value="<YOUR_TELNYX_SIP_PASSWORD>"/>
    <param name="proxy" value="sip.telnyx.com"/>
    <param name="register" value="true"/>
    <param name="caller-id-in-from" value="false"/>
    <param name="contact-params" value="telnyx_transport=udp"/>
    <param name="ping" value="25"/>
  </gateway>
</include>
```

#### For Twilio:

```xml
<include>
  <gateway name="twilio_trunk">
    <param name="username" value="<TWILIO_SIP_USERNAME>"/>
    <param name="password" value="<TWILIO_SIP_PASSWORD>"/>
    <param name="proxy" value="your-domain.pstn.twilio.com"/>
    <param name="register" value="false"/>
    <param name="from-user" value="<YOUR_TWILIO_NUMBER>"/>
    <param name="from-domain" value="your-domain.pstn.twilio.com"/>
  </gateway>
</include>
```

### 4.2 Reload the gateway

```bash
fs_cli -x "sofia profile external rescan"
fs_cli -x "sofia status gateway telnyx_trunk"
```

You should see: **REGED** (registered). If you see **NOREG** or **FAILED**, check credentials and firewall.

### 4.3 Test outbound call via fs_cli

```bash
fs_cli
```

```
# Replace with a real number in E.164 format
freeswitch@hostname> originate sofia/gateway/telnyx_trunk/+919876543210 &echo
```

If the call goes through and you hear an echo back — **your trunk is working**.

---

## Step 5 — Configure DID / Inbound Routing

When someone calls your DID number, FreeSWITCH needs to know where to route it.

### 5.1 Edit the public dialplan

```bash
nano /etc/freeswitch/dialplan/public.xml
```

Add inside `<context name="public">`:

```xml
<!-- Route inbound DID to extension 1001 -->
<extension name="inbound_did">
  <condition field="destination_number" expression="^\+?(<YOUR_DID_NUMBER>)$">
    <action application="transfer" data="1001 XML default"/>
  </condition>
</extension>
```

Replace `<YOUR_DID_NUMBER>` with your DID digits (e.g. `918884441234`).

### 5.2 Configure the SIP provider to point to your server

In your Telnyx / Twilio dashboard:

- Set the **SIP Connection destination** or **Voice webhook** to: `sip:<YOUR_VPS_IP>:5080`
- Telnyx: Go to SIP Connections → Inbound → set your server IP

### 5.3 Reload dialplan

```bash
fs_cli -x "reloadxml"
```

### 5.4 Test inbound

Call your DID number from any phone. If FreeSWITCH receives it, you'll see logs:

```bash
fs_cli -x "console loglevel debug"
# Then call the DID and watch logs
```

---

## Step 6 — Create Agent SIP Extensions

Agents will register as SIP extensions (softphone or browser WebRTC).

### 6.1 Edit the directory config

```bash
nano /etc/freeswitch/directory/default.xml
```

Inside `<domain name="$${domain}">`, add users:

```xml
<!-- Agent 1 -->
<user id="1001">
  <params>
    <param name="password" value="agent1pass"/>
    <param name="vm-password" value="1001"/>
  </params>
  <variables>
    <variable name="toll_allow" value="domestic,international,local"/>
    <variable name="accountcode" value="1001"/>
    <variable name="user_context" value="default"/>
    <variable name="effective_caller_id_name" value="Agent 1"/>
    <variable name="effective_caller_id_number" value="1001"/>
  </variables>
</user>

<!-- Agent 2 -->
<user id="1002">
  <params>
    <param name="password" value="agent2pass"/>
    <param name="vm-password" value="1002"/>
  </params>
  <variables>
    <variable name="toll_allow" value="domestic,international,local"/>
    <variable name="accountcode" value="1002"/>
    <variable name="user_context" value="default"/>
    <variable name="effective_caller_id_name" value="Agent 2"/>
    <variable name="effective_caller_id_number" value="1002"/>
  </variables>
</user>
```

### 6.2 Reload directory

```bash
fs_cli -x "reloadxml"
```

### 6.3 Register via Zoiper (Test)

Open Zoiper on your phone/laptop:

- **Account type**: SIP
- **Username**: `1001`
- **Password**: `agent1pass`
- **Domain**: `<YOUR_VPS_IP>:5060`
- **Transport**: UDP

After saving, Zoiper should show **Registered**.

Verify in fs_cli:

```bash
fs_cli -x "show registrations"
```

You should see `1001@<your-ip>` in the list.

---

## Step 7 — Configure Call Recording

### 7.1 Edit default dialplan

```bash
nano /etc/freeswitch/dialplan/default.xml
```

Add recording at the start of the `local_extension` section:

```xml
<action application="set" data="RECORD_STEREO=true"/>
<action application="set" data="recording_follow_transfer=true"/>
<action application="record_session" data="/var/lib/freeswitch/recordings/${uuid}.wav"/>
```

### 7.2 Create recordings directory

```bash
mkdir -p /var/lib/freeswitch/recordings
chown freeswitch:freeswitch /var/lib/freeswitch/recordings
```

### 7.3 Reload and test

```bash
fs_cli -x "reloadxml"
```

Make a test call. After hangup, check:

```bash
ls -la /var/lib/freeswitch/recordings/
# You should see a .wav file
# Play it:
aplay /var/lib/freeswitch/recordings/<uuid>.wav
```

> In Phase 2, you'll set up an S3/RustFS sync to push recordings to storage automatically.

---

## Step 8 — Basic Dialplan (Outbound + Inbound)

### 8.1 Outbound: Extension → PSTN

Edit `/etc/freeswitch/dialplan/default.xml`. Add:

```xml
<!-- Outbound calls to PSTN via trunk -->
<extension name="outbound_pstn">
  <!-- Match any 10-12 digit number starting with + or 0 or 91 -->
  <condition field="destination_number" expression="^(\+?[0-9]{10,12})$">
    <action application="set" data="effective_caller_id_number=<YOUR_DID_NUMBER>"/>
    <action application="set" data="effective_caller_id_name=Work-Holo"/>
    <action application="bridge" data="sofia/gateway/telnyx_trunk/$1"/>
  </condition>
</extension>
```

### 8.2 Test end-to-end

From Zoiper (registered as 1001), dial a real mobile number:

```
+919876543210
```

The call should go: **Zoiper → FreeSWITCH → Telnyx trunk → PSTN → Mobile phone**

### 8.3 Inbound: PSTN → Extension

Call your DID from any phone. It should ring Zoiper (extension 1001).

---

## Validation Checklist ✅

Before moving to Phase 2, verify ALL of these:

| Check                | Command / Method                                | Expected Result                                  |
| -------------------- | ----------------------------------------------- | ------------------------------------------------ |
| FreeSWITCH running   | `systemctl status freeswitch`                   | `active (running)`                               |
| Both SIP profiles up | `fs_cli -x "sofia status"`                      | `internal` + `external` = RUNNING                |
| Trunk registered     | `fs_cli -x "sofia status gateway telnyx_trunk"` | `REGED`                                          |
| Agent registered     | `fs_cli -x "show registrations"`                | `1001@<ip>` listed                               |
| Outbound PSTN call   | Dial from Zoiper → real number                  | Call connects, audio works                       |
| Inbound DID call     | Call your DID from phone                        | Zoiper rings                                     |
| Call recording       | After test call                                 | `.wav` file in `/var/lib/freeswitch/recordings/` |
| No one-way audio     | After outbound call                             | Both sides hear each other                       |

---

## Common Problems & Fixes

### 🔴 Trunk shows NOREG (not registered)

1. Double-check SIP credentials in `my_trunk.xml`
2. Verify port `5060` UDP is open: `ufw status`
3. Check logs: `tail -f /var/log/freeswitch/freeswitch.log | grep -i gateway`

### 🔴 Call connects but no audio (one-way or silence)

This is always a NAT or firewall issue:

```bash
# Verify RTP ports are open:
ufw status | grep 16384

# Verify external_rtp_ip is set to your PUBLIC IP (not 0.0.0.0):
grep external_rtp_ip /etc/freeswitch/vars.xml
```

### 🔴 Zoiper shows "Registration failed"

1. Verify port `5060` TCP/UDP is open
2. Check user credentials match `directory/default.xml`
3. Check `show registrations` in fs_cli — if nothing, the packet isn't reaching FS

### 🔴 Inbound calls not routing

1. DID not pointed to your server — check your SIP provider dashboard
2. Wrong DID number in `dialplan/public.xml` — verify the digit format
3. Run `reloadxml` after any dialplan change

---

## Useful fs_cli Commands (Quick Reference)

```bash
# Check all SIP registrations
fs_cli -x "show registrations"

# Check all active calls
fs_cli -x "show calls"

# Make a test call manually
fs_cli -x "originate sofia/gateway/telnyx_trunk/+919876543210 &echo"

# Check gateway status
fs_cli -x "sofia status gateway telnyx_trunk"

# Reload config without restarting
fs_cli -x "reloadxml"

# Reload SIP profile
fs_cli -x "sofia profile external rescan"

# Watch live call events
fs_cli -x "console loglevel debug"

# Hang up a call by UUID
fs_cli -x "uuid_kill <call-uuid>"
```

---

## What Comes Next (Phase 2 Preview)

Once ALL checks above pass, you move to **Phase 2: Platform Integration**:

1. Create `workers/sip-worker/` — Bun process that connects to FreeSWITCH via ESL
2. Add dialer tables to `packages/db` (calls, leads, campaigns)
3. Create `packages/api/src/routers/dialer/` (startCall, hangupCall APIs)
4. Wire RabbitMQ: API → queue → SIP Worker → FreeSWITCH originate
5. Publish call events → Soketi → React UI

**Do NOT start Phase 2 until your Phase 1 checklist is 100% green.**
