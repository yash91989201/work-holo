# Web Application

React + Vite frontend with TanStack Router, real-time features, and Tauri desktop support.

## Overview

The web app is the primary user interface for Work-Holo, providing organization management, team communication, attendance tracking, and admin dashboards.

**Tech Stack:**
- Framework: React 19 + Vite
- Routing: TanStack Router (file-based)
- State: Zustand + TanStack Query
- UI: shadcn/ui + Radix UI + Tailwind CSS 4
- Real-time: Pusher + ElectricSQL
- Auth: Better-Auth client
- API: oRPC client
- Desktop: Tauri 2

## Entry Point

**Files:**
- `index.html` - HTML template with `<div id="app">`
- `src/main.tsx` - React entry point, router setup
- `vite.config.ts` - Vite configuration

## Routing Structure

File-based routing in `src/routes/`:

```
routes/
├── __root.tsx                    # Root layout, context providers
├── (auth)/                       # Authentication routes
│   ├── login.tsx                 # Login page
│   ├── signup.tsx                # Signup page
│   └── accept-invitation.$id.tsx # Accept invite
├── (public)/                     # Public routes
│   └── index.tsx                 # Landing page
└── (authenticated)/              # Protected routes
    ├── org/
    │   ├── new.tsx               # Create organization
    │   └── $slug/                # Org-specific routes
    │       ├── console/          # Admin console
    │       │   ├── members/      # Member management
    │       │   └── teams/        # Team management
    │       ├── manage/           # Org settings
    │       └── workspace/        # Main workspace
    │           ├── index.tsx     # Dashboard
    │           └── teams/$teamId/
    │               └── (modules)/
    │                   ├── communication/
    │                   │   └── channels/
    │                   └── attendance/
    └── settings/                 # User settings
```

## Key Directories

```
src/
├── routes/           # TanStack Router routes (34 files)
├── components/       # React components (~150 files)
│   ├── ui/           # shadcn/ui components (66 files)
│   ├── org/          # Organization UI
│   ├── console/      # Admin console
│   ├── modules/      # Feature modules
│   │   └── communication/
│   │       ├── channel-header.tsx
│   │       ├── channels-list-table.tsx
│   │       ├── message-composer/
│   │       ├── message-list/
│   │       └── message-thread-sidebar/
│   └── shared/       # Shared utilities
├── hooks/            # Custom hooks (43 files)
├── stores/           # Zustand stores
├── lib/              # Core utilities
│   ├── auth-client.ts    # Better-Auth setup
│   ├── pusher.ts         # Real-time client
│   ├── electric.ts       # ElectricSQL sync
│   └── permission/       # Permission gating
├── utils/
│   └── orpc.ts       # oRPC client setup
├── providers/        # React providers
└── styles/           # CSS (Tailwind)
```

## State Management

### Zustand Stores

**Theme Store** (`stores/theme-store.ts`):
```typescript
{
  fontFamily: 'inter' | 'geist' | 'system' | ...,
  fontSize: number,
  radius: number,
  spacing: number,
  letterSpacing: number
}
```

**Channel Store** (`stores/channel-store.ts`):
```typescript
{
  infoSidebarOpen: boolean,
  messageThread: { messageId, open },
  pinnedMessagesOpen: boolean,
  mentionsSidebarOpen: boolean,
  highlightedMessageId: string | null
}
```

### TanStack Query

- Global query client in root route
- Error handling via QueryCache (shows toasts)
- Integrated with oRPC for type-safe queries

## API Integration

**File:** `utils/orpc.ts`

```typescript
import { createORPCClient } from '@orpc/client'
import type { AppRouter } from '@work-holo/api'

const client = createORPCClient<AppRouter>({
  // RPCLink with fetch, credentials: 'include'
})
```

**Usage:**
```typescript
// In components
const { data } = orpcClient.org.members.list.useQuery({ orgId })
const mutation = orpcClient.team.create.useMutation()
```

## Authentication

**File:** `lib/auth-client.ts`

Better-Auth client with plugins:
- Passkey, 2FA, Magic Links
- Organization/Teams management
- Session management

**Session Flow:**
1. Root route loads session in `beforeLoad`
2. Protected routes check `context.session`
3. Unauthenticated users redirected to `/login`

## Real-Time Features

### Pusher (`lib/pusher.ts`)

```typescript
const pusher = getPusherClient()
pusher.subscribe(`presence-channel-${channelId}`)
```

Features: Presence, private channels, typing indicators

### ElectricSQL (`lib/electric.ts`)

```typescript
const shapeUrl = `${SERVER_URL}/electric/shapes/messages`
// Real-time sync via shape subscriptions
```

## Permission System

**Location:** `lib/permission/`

**Components:**
```typescript
// Provider
<PermissionProvider>

// Conditional rendering
<Can permission="team.create">
  <CreateTeamButton />
</Can>

// Hook
const canCreate = useCan('team.create')
```

## Custom Hooks

| Hook | Purpose |
|------|---------|
| `use-channel-presence.ts` | Channel member presence |
| `use-messages.ts` | Message fetching |
| `use-message-reactions.ts` | Emoji reactions |
| `use-typing-indicator.ts` | Typing status |
| `use-push-notifications.ts` | Web push |
| ... and 38 more |

## UI Components

### shadcn/ui (`components/ui/`)

66 components including:
- Forms: input, button, checkbox, select, textarea
- Layout: card, accordion, tabs, separator
- Navigation: breadcrumb, dropdown, menubar
- Dialogs: dialog, alert-dialog, popover, tooltip
- Data: table, calendar, chart

### Feature Components

**Communication:**
- `message-composer/` - Tiptap rich text editor with mentions
- `message-list/` - Message rendering with threads
- `channel-header.tsx` - Channel controls
- `channel-info-sidebar/` - Channel details

**Console:**
- `members-table.tsx` - Member management
- `teams-table.tsx` - Team management
- `invitations-form.tsx` - Invite users

## Tauri Desktop

**Location:** `src-tauri/`

**Config:** `tauri.conf.json`
- Window: 800x600px, resizable
- Frontend: `../dist`
- Dev URL: `http://localhost:3001`

**Commands:**
```bash
bun desktop:dev    # Start Tauri dev
bun desktop:build  # Build desktop app
```

## Environment Variables

```bash
# Core
VITE_ENV=development
VITE_SERVER_URL=http://localhost:3000
VITE_WEB_URL=http://localhost:3001

# Real-time
VITE_PUSHER_KEY=work-holo-key
VITE_PUSHER_HOST=localhost
VITE_PUSHER_PORT=6001

# Services
VITE_IMAGE_TRANSFORMATION_URL=http://localhost:8000

# Push Notifications
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:your-email@gmail.com
```

## Running

### Development
```bash
bun run dev
# or from root
bun dev:web
```

Server runs on port 3001.

### Production Build
```bash
bun run build
bun run serve  # Preview build
```

### Desktop
```bash
bun desktop:dev    # Development
bun desktop:build  # Production
```

## Build Optimization

Vite config includes manual chunks for:
- React ecosystem
- TanStack (router, query, table)
- Tiptap editor
- UI libraries (Radix, shadcn)
- Charts (Recharts)
- ElectricSQL
- oRPC

## Key Files

| File | Purpose |
|------|---------|
| `src/main.tsx` | React entry point |
| `src/routes/__root.tsx` | Root layout, providers |
| `vite.config.ts` | Vite configuration |
| `src/utils/orpc.ts` | API client setup |
| `src/lib/auth-client.ts` | Auth configuration |
| `src/lib/pusher.ts` | Real-time client |
| `src/stores/*.ts` | Zustand stores |
| `src-tauri/` | Desktop app config |

## Feature Modules

### Communication
- Channel list and creation
- Rich message composer (Tiptap)
- Message threads
- Reactions, mentions, pins
- File attachments
- Typing indicators
- Read receipts

### Attendance
- Clock in/out
- Work blocks
- Daily analytics

### Dashboard
- Org statistics
- Productivity charts
- Recent messages
- Presence roster
