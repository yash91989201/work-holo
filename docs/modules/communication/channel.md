# Channels Feature Documentation

## Overview

The Channels feature is a comprehensive real-time messaging system that supports team, group, and direct messaging within organizations. It provides features like threaded conversations, reactions, mentions, read receipts, file attachments, audio messages, message pinning, and more.

## Architecture

### Technology Stack

- **Frontend**: React 19, TanStack Router, TanStack Virtual (for message virtualization)
- **State Management**: Zustand stores for UI state, TanStack Query for server state
- **Backend**: oRPC for type-safe API, Hono server
- **Database**: PostgreSQL with Drizzle ORM
- **Real-time**: ElectricSQL for data sync, Pusher for presence/typing indicators
- **Storage**: MinIO (S3-compatible) for file uploads
- **Queue**: RabbitMQ for background processing (read receipts)

### System Flow

```
User Action → Frontend Component → React Hook → oRPC Client → API Router → Database
                                                                         ↓
                                        ElectricSQL Sync ← Database Trigger
                                                  ↓
                                        Frontend Updates (Real-time)
```

---

## Complete Message Flow: Send to Read Receipt

This section traces the entire lifecycle of a message from the moment a user clicks "Send" to when read receipts are fully processed and displayed.

### Phase 1: Message Composition (Frontend)

**Location:** `apps/web/src/components/member/communication/channels/message-composer/index.tsx`

**Timeline:** 0ms - User action

```typescript
// User types message: "Hello @john, check this out!"
// User attaches file: document.pdf
// User clicks Send or presses Ctrl+Enter

handleSubmit() {
  // 1. Extract content
  const textToSend = "Hello @john, check this out!";
  const attachmentsToUpload = [{ file: File, id: "..." }];
  
  // 2. Clear UI immediately (optimistic update)
  setText("");
  setAttachments([]);
  
  // 3. Parse mentions from HTML
  const mentionRegex = /<span[^>]*data-id="([^"]+)"[^>]*>/g;
  const mentionUserIds = ["user-john-id"];  // Extracted from HTML
  
  // 4. Upload attachments in parallel
  const uploadPromises = attachmentsToUpload.map(att =>
    uploadToStorage(att.file, "message-attachment")
  );
  const uploadedAttachments = await Promise.all(uploadPromises);
  // Result: [{ fileName: "abc123.pdf", originalName: "document.pdf", ... }]
  
  // 5. Call mutation
  createMessage({
    channelId: "channel-xyz",
    content: textToSend,
    mentions: ["user-john-id"],
    attachments: uploadedAttachments,
    type: "text"
  });
}
```

**State at end of Phase 1:**
- UI cleared immediately
- File uploaded to MinIO
- API call initiated

---

### Phase 2: API Request (oRPC Client)

**Location:** `apps/web/src/hooks/communications/use-message-mutations.ts`

**Timeline:** ~50ms - Network transit

```typescript
// oRPC client makes type-safe API call
const result = await orpcClient.communication.message.create({
  channelId: "channel-xyz",
  content: "Hello @john, check this out!",
  mentions: ["user-john-id"],
  attachments: [{
    fileName: "abc123.pdf",
    originalName: "document.pdf",
    fileSize: 245760,
    mimeType: "application/pdf",
    type: "document",
    url: "https://minio/message-attachment/abc123.pdf"
  }],
  type: "text"
});
```

**Network Details:**
- HTTP POST to `/api/communication/message/create`
- Headers include authentication token
- Request body is JSON-serialized input
- Response will include `txid` (ElectricSQL transaction ID)

---

### Phase 3: Backend Processing (API Router)

**Location:** `packages/api/src/routers/communication/message.ts:111-340`

**Timeline:** ~100-300ms - Database transaction

```typescript
// Handler starts transaction
await db.transaction(async (tx) => {
  // Step 1: Generate ElectricSQL transaction ID (10ms)
  const txid = await generateTxId(tx);
  // Result: "01JG8XYZABC123"
  
  // Step 2: Validate channel exists (5ms)
  const channel = await tx.query.channelTable.findFirst({
    where: eq(channelTable.id, "channel-xyz")
  });
  // Result: { id: "channel-xyz", name: "General", ... }
  
  // Step 3: Insert message (15ms)
  const [newMessage] = await tx
    .insert(messageTable)
    .values({
      channelId: "channel-xyz",
      senderId: "user-alice-id",
      content: "Hello @john, check this out!",
      type: "text",
      // ... other fields with defaults
    })
    .returning();
  // Result: { id: "msg-abc123", createdAt: "2024-01-20T10:30:00Z", ... }
  
  // Step 4: Insert attachments (10ms)
  await tx.insert(attachmentTable).values({
    messageId: "msg-abc123",
    fileName: "abc123.pdf",
    originalName: "document.pdf",
    fileSize: 245760,
    mimeType: "application/pdf",
    type: "document",
    url: "https://minio/message-attachment/abc123.pdf",
    uploadedBy: "user-alice-id"
  });
  
  // Step 5: Create mention records (10ms)
  const mentionValues = [{
    messageId: "msg-abc123",
    mentionedById: "user-alice-id",
    mentionedUserId: "user-john-id",
    isSeen: false
  }];
  await tx.insert(messageMentionTable).values(mentionValues);
  
  // Step 6: Create notifications (10ms)
  const mentionNotifications = [{
    userId: "user-john-id",
    type: "mention",
    title: "Alice mentioned you in General",
    message: "Hello @john, check this out!",
    entityId: "msg-abc123",
    entityType: "message"
  }];
  await tx.insert(notificationTable).values(mentionNotifications);
  
  // Step 7: Get channel member count (5ms)
  const memberCount = await tx
    .select({ count: count() })
    .from(channelMemberTable)
    .where(eq(channelMemberTable.channelId, "channel-xyz"))
    .then(r => r[0]?.count ?? 0);
  // Result: 15 members (small channel)
  
  // Step 8: Mark as read for sender - Small channel path (10ms)
  const readTimestamp = new Date();
  await tx
    .insert(messageReadTable)
    .values({
      messageId: "msg-abc123",
      userId: "user-alice-id",
      readAt: readTimestamp
    })
    .onConflictDoNothing();
  
  // Step 9: Update channelRead table (15ms)
  await tx
    .insert(channelReadTable)
    .values({
      channelId: "channel-xyz",
      userId: "user-alice-id",
      lastReadMessageId: "msg-abc123",
      lastReadAt: readTimestamp
    })
    .onConflictDoUpdate({
      target: [channelReadTable.channelId, channelReadTable.userId],
      set: {
        lastReadMessageId: sql`
          CASE
            WHEN '2024-01-20T10:30:00Z'::timestamp > 
            COALESCE(
              (SELECT created_at FROM message WHERE id = channel_read.last_read_message_id),
              '1970-01-01'::timestamp
            )
            THEN 'msg-abc123'
            ELSE channel_read.last_read_message_id
          END
        `,
        lastReadAt: sql`...similar CASE statement...`
      }
    });
  
  // Transaction commits here (~100ms total)
  return { txid, message: newMessage };
});

// Step 10: Send push notifications (async, non-blocking)
Promise.resolve().then(async () => {
  const subscriptions = await db
    .select()
    .from(pushSubscriptionTable)
    .where(inArray(pushSubscriptionTable.userId, ["user-john-id"]));
  
  for (const sub of subscriptions) {
    await webpush.sendNotification(sub, JSON.stringify({
      title: "Work Holo",
      body: "Alice mentioned you in 'General' channel",
      data: { type: "mention", url: "/org/acme/communication/channels/channel-xyz" }
    }));
  }
});

// Return response
return { txid: "01JG8XYZABC123", message: { id: "msg-abc123", ... } };
```

**Database State After Transaction:**
- `message` table: 1 new row
- `attachment` table: 1 new row
- `messageMention` table: 1 new row
- `notification` table: 1 new row
- `messageRead` table: 1 new row (sender's read receipt)
- `channelRead` table: 1 updated row (sender's last read)

---

### Phase 4: ElectricSQL Replication (Real-time Sync)

**Timeline:** ~150-200ms - PostgreSQL → ElectricSQL → WebSocket

```
┌─────────────────────────────────────────────────────────┐
│ PostgreSQL Logical Replication                          │
│                                                          │
│ Transaction commit triggers:                            │
│ 1. WAL (Write-Ahead Log) entry created                 │
│ 2. Logical replication slot captures change            │
│ 3. Change data includes: operation, table, new values  │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│ ElectricSQL Server (port 5003)                          │
│                                                          │
│ 1. Receives replication stream                          │
│ 2. Transforms to Electric protocol                      │
│ 3. Filters by client subscriptions                      │
│ 4. Shapes data based on client queries                  │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│ WebSocket Broadcast                                      │
│                                                          │
│ Sends to all subscribed clients:                        │
│ {                                                        │
│   operation: "INSERT",                                   │
│   table: "message",                                      │
│   record: {                                              │
│     id: "msg-abc123",                                    │
│     channelId: "channel-xyz",                            │
│     senderId: "user-alice-id",                           │
│     content: "Hello @john, check this out!",             │
│     createdAt: "2024-01-20T10:30:00Z",                   │
│     // ... all fields                                    │
│   },                                                     │
│   sender: { id: "user-alice-id", name: "Alice", ... },   │
│   attachments: [{ id: "att-123", fileName: "abc123.pdf" }]│
│ }                                                        │
└──────────────────────────────────────────────────────────┘
```

**Connected Clients Receive:**
- Alice (sender): Message appears in her view (already optimistically rendered)
- John (mentioned): Message appears with notification
- Other 13 channel members: Message appears in their view

---

### Phase 5: Frontend Real-time Update (All Clients)

**Location:** `apps/web/src/hooks/communications/use-messages.ts:412-459`

**Timeline:** ~200-250ms - Client receives and processes update

```typescript
// TanStack Query with useLiveInfiniteQuery automatically:
// 1. Receives WebSocket message from ElectricSQL
// 2. Updates local cache
// 3. Triggers React re-render

const { pages } = useLiveInfiniteQuery(
  (q) => q.from({ message: messagesCollection })
    .where(eq(message.channelId, "channel-xyz"))
    // ... rest of query
);

// Cache update happens automatically:
// pages = [
//   [{ id: "msg-oldest", ... }, { id: "msg-old-2", ... }, ...],  // Page 1 (newest)
//   [{ id: "msg-old-1", ... }, ...]                         // Page 2
// ]

// Messages transformed to chronological order:
const messages = useMemo(() => buildOrderedMessages(pages), [pages]);
// messages = [
//   { id: "msg-oldest", ... },
//   { id: "msg-old-2", ... },
//   { id: "msg-abc123", ... }  // ← New message at end
// ]
```

**React Re-render Cascade:**
```
useLiveInfiniteQuery cache updated
         ↓
useMessages returns new messages array
         ↓
useVirtualMessages detects new message
         ↓
MessageList re-renders
         ↓
New MessageItem component rendered
```

---

### Phase 6: Auto-scroll Behavior (Sender & Near-bottom Users)

**Location:** `apps/web/src/hooks/communications/use-messages.ts:104-139`

**Timeline:** ~250-300ms - UI update and scroll animation

```typescript
// Effect triggers when messages array changes
useEffect(() => {
  const lastMessage = messages.at(-1);  // msg-abc123
  
  // Check if it's a new message
  if (lastMessage.id !== lastMessageIdRef.current) {
    lastMessageIdRef.current = lastMessage.id;
    
    // Calculate distance from bottom
    const distanceFromBottom = 
      scrollRef.current.scrollHeight - 
      scrollRef.current.scrollTop - 
      scrollRef.current.clientHeight;
    // Result: 50px (user is near bottom)
    
    // If within 500px of bottom, auto-scroll
    if (distanceFromBottom < 500) {
      isAutoScrollingRef.current = true;
      setShowScrollButton(false);
      
      requestAnimationFrame(() => {
        virtualizer.scrollToOffset(scrollRef.current.scrollHeight, {
          align: "end",
          behavior: "smooth"
        });
      });
      
      // Reset flag after animation
      setTimeout(() => {
        isAutoScrollingRef.current = false;
      }, 1000);
    }
  }
}, [messages]);
```

**Result:**
- Alice (sender): Scrolls to show her new message
- Users near bottom: Scroll to see new message
- Users scrolled up: See "Jump to latest" button (no auto-scroll)

---

### Phase 7: Visibility Tracking (All Clients)

**Location:** `apps/web/src/hooks/communications/use-visible-messages.ts`

**Timeline:** ~300ms onwards - Continuous tracking

```typescript
// Hook tracks which messages are currently visible in viewport
const { visibleMessageIds } = useVisibleMessages({
  virtualItems,      // From virtualizer.getVirtualItems()
  items,            // Messages + separators
  enabled: true
});

// Internal implementation:
useEffect(() => {
  // Get visible virtual items
  const visible = virtualItems.map(vItem => {
    const item = items[vItem.index];
    // Filter out separators
    if ('type' in item) return null;
    return item.id;
  }).filter(Boolean);
  
  // visible = ["msg-old-1", "msg-old-2", "msg-abc123", ...]
  
  setVisibleMessageIds(visible);
}, [virtualItems, items]);
```

**When John scrolls to see the new message:**
- Virtual scrolling renders message into viewport
- `visibleMessageIds` updated to include `"msg-abc123"`
- Triggers next phase (read receipt marking)

---

### Phase 8: Read Receipt Debouncing (Recipient Clients)

**Location:** `apps/web/src/hooks/communications/use-mark-messages-read.ts`

**Timeline:** ~300-800ms - Debounce wait period

```typescript
// Hook debounces visibility changes to prevent excessive API calls
useMarkMessagesRead(visibleMessageIds, { debounceMs: 500 });

// Internal implementation:
useEffect(() => {
  // Clear previous timer
  if (timerRef.current) {
    clearTimeout(timerRef.current);
  }
  
  // Set new timer (500ms)
  timerRef.current = setTimeout(() => {
    if (visibleMessageIds.length === 0) return;
    
    // Filter to messages from others
    const unreadMessages = visibleMessageIds.filter(msgId => {
      const message = findMessage(msgId);
      return message.senderId !== currentUserId;
    });
    
    if (unreadMessages.length > 0) {
      // Make API call
      markMessagesAsReadMutation.mutate({
        channelId: "channel-xyz",
        messageIds: unreadMessages  // ["msg-abc123"]
      });
    }
  }, 500);
  
  return () => clearTimeout(timerRef.current);
}, [visibleMessageIds]);
```

**State after 500ms of stable visibility:**
- John's client calls API to mark message as read
- Other users' clients do the same when they scroll to view it

---

### Phase 9: Read Receipt API Call (Backend)

**Location:** `packages/api/src/routers/communication/message.ts:963-1153`

**Timeline:** ~800-900ms - Database transaction

```typescript
// John's client makes request
await orpcClient.communication.message.markMessagesAsRead({
  channelId: "channel-xyz",
  messageIds: ["msg-abc123"]
});

// Backend handler
await db.transaction(async (tx) => {
  // Step 1: Generate transaction ID (10ms)
  const txid = await generateTxId(tx);
  
  // Step 2: Verify channel membership (5ms)
  const channelMember = await tx.query.channelMemberTable.findFirst({
    where: and(
      eq(channelMemberTable.channelId, "channel-xyz"),
      eq(channelMemberTable.userId, "user-john-id")
    )
  });
  
  // Step 3: Count channel members (5ms)
  const memberCount = await tx
    .select({ count: count() })
    .from(channelMemberTable)
    .where(eq(channelMemberTable.channelId, "channel-xyz"));
  // Result: 15 members (small channel)
  
  // Step 4: Get messages with details (10ms)
  const messages = await tx.query.messageTable.findMany({
    where: and(
      inArray(messageTable.id, ["msg-abc123"]),
      eq(messageTable.channelId, "channel-xyz"),
      eq(messageTable.isDeleted, false)
    ),
    orderBy: [desc(messageTable.createdAt)]
  });
  // Result: [{ id: "msg-abc123", senderId: "user-alice-id", createdAt: "..." }]
  
  // Step 5: Filter to messages from others (instant)
  const messagesFromOthers = messages.filter(
    msg => msg.senderId !== "user-john-id"
  );
  // Result: [{ id: "msg-abc123", ... }] (Alice's message)
  
  // Step 6: Get latest message (instant)
  const latestMessage = messagesFromOthers[0];
  const readTimestamp = new Date();
  
  // Step 7: Update channelRead (conditional) (20ms)
  await tx
    .insert(channelReadTable)
    .values({
      channelId: "channel-xyz",
      userId: "user-john-id",
      lastReadMessageId: "msg-abc123",
      lastReadAt: readTimestamp
    })
    .onConflictDoUpdate({
      target: [channelReadTable.channelId, channelReadTable.userId],
      set: {
        lastReadMessageId: sql`
          CASE
            WHEN '2024-01-20T10:30:00Z'::timestamp >
            COALESCE(
              (SELECT created_at FROM message WHERE id = channel_read.last_read_message_id),
              '1970-01-01'::timestamp
            )
            THEN 'msg-abc123'
            ELSE channel_read.last_read_message_id
          END
        `
      }
    });
  
  // Step 8: Insert messageRead record (small channel only) (15ms)
  if (memberCount <= 25) {
    await tx
      .insert(messageReadTable)
      .values({
        messageId: "msg-abc123",
        userId: "user-john-id",
        readAt: readTimestamp
      })
      .onConflictDoNothing();
  }
  
  // Step 9: Auto-mark mention as seen (10ms)
  await tx
    .update(messageMentionTable)
    .set({ isSeen: true })
    .where(
      and(
        eq(messageMentionTable.messageId, "msg-abc123"),
        eq(messageMentionTable.mentionedUserId, "user-john-id"),
        eq(messageMentionTable.isSeen, false)
      )
    );
  
  // Step 10: Mark mention notification as read (10ms)
  await tx
    .update(notificationTable)
    .set({
      status: "read",
      readAt: new Date()
    })
    .where(
      and(
        eq(notificationTable.userId, "user-john-id"),
        eq(notificationTable.type, "mention"),
        eq(notificationTable.entityId, "msg-abc123"),
        eq(notificationTable.status, "unread")
      )
    );
  
  return { txid, memberCount };
});
```

**Database State After Transaction:**
- `messageRead` table: 1 new/updated row (John's read receipt)
- `channelRead` table: 1 updated row (John's last read = msg-abc123)
- `messageMention` table: 1 updated row (John's mention marked seen)
- `notification` table: 1 updated row (John's notification marked read)

---

### Phase 10: Queue Publishing (Background Processing)

**Location:** `packages/api/src/routers/communication/message.ts:1136-1147`

**Timeline:** ~900-920ms - Publish to RabbitMQ

```typescript
// After transaction commits, publish to queue
try {
  const queueClient = getQueueClient();
  queueClient.publish("READ_RECEIPTS", {
    type: "process_channel",
    channelId: "channel-xyz",
    memberCount: 15,
    timestamp: new Date().toISOString()
  });
} catch (error) {
  // Non-blocking: log error but don't fail request
  console.error("Failed to publish to read receipts queue:", error);
}

// Return success immediately (don't wait for worker)
return { txid: "01JG8XYZ...", success: true };
```

**RabbitMQ State:**
- Queue: `READ_RECEIPTS`
- Message: `{ type: "process_channel", channelId: "channel-xyz", memberCount: 15 }`
- Worker will consume this message asynchronously

---

### Phase 11: Worker Processing (Background)

**Location:** `workers/read-receipt/src/index.ts`

**Timeline:** ~1-5 seconds later - Background aggregation

```typescript
// Worker consumes message from queue
rabbitMQ.consume("READ_RECEIPTS", async (msg) => {
  const { channelId, memberCount } = msg;
  
  if (memberCount <= 25) {
    // Small channel: aggregate from messageRead table
    await aggregateSmallChannel(channelId);
  } else {
    // Large channel: aggregate from channelRead table
    await aggregateLargeChannel(channelId);
  }
});

// Small channel aggregation
async function aggregateSmallChannel(channelId: string) {
  // Get all messages in channel with read counts
  const messageReads = await db
    .select({
      messageId: messageReadTable.messageId,
      userId: messageReadTable.userId,
      readAt: messageReadTable.readAt
    })
    .from(messageReadTable)
    .innerJoin(messageTable, eq(messageReadTable.messageId, messageTable.id))
    .where(eq(messageTable.channelId, channelId))
    .orderBy(desc(messageReadTable.readAt));
  
  // Group by message
  const grouped = {};
  for (const read of messageReads) {
    if (!grouped[read.messageId]) {
      grouped[read.messageId] = {
        messageId: read.messageId,
        readers: [],
        readCount: 0,
        lastReadAt: null
      };
    }
    grouped[read.messageId].readers.push(read.userId);
    grouped[read.messageId].readCount++;
    if (!grouped[read.messageId].lastReadAt || read.readAt > grouped[read.messageId].lastReadAt) {
      grouped[read.messageId].lastReadAt = read.readAt;
    }
  }
  
  // For msg-abc123:
  // {
  //   messageId: "msg-abc123",
  //   readers: ["user-alice-id", "user-john-id"],
  //   readCount: 2,
  //   lastReadAt: "2024-01-20T10:30:05Z"
  // }
  
  // Upsert to messageReadSummary
  for (const [messageId, summary] of Object.entries(grouped)) {
    await db
      .insert(messageReadSummaryTable)
      .values({
        messageId: summary.messageId,
        readCount: summary.readCount,
        lastReadAt: summary.lastReadAt,
        recentReaders: summary.readers.slice(0, 10)  // Keep last 10 readers
      })
      .onConflictDoUpdate({
        target: [messageReadSummaryTable.messageId],
        set: {
          readCount: summary.readCount,
          lastReadAt: summary.lastReadAt,
          recentReaders: summary.readers.slice(0, 10),
          updatedAt: new Date()
        }
      });
  }
  
  // Update processed watermark
  await db
    .insert(channelReadProcessedWatermarkTable)
    .values({
      channelId,
      lastProcessedAt: new Date()
    })
    .onConflictDoUpdate({
      target: [channelReadProcessedWatermarkTable.channelId],
      set: {
        lastProcessedAt: new Date(),
        updatedAt: new Date()
      }
    });
}
```

**Database State After Worker:**
- `messageReadSummary` table: 1 new/updated row
  ```typescript
  {
    messageId: "msg-abc123",
    readCount: 2,              // Alice + John
    lastReadAt: "2024-01-20T10:30:05Z",
    recentReaders: ["user-alice-id", "user-john-id"]
  }
  ```
- `channelReadProcessedWatermark` table: 1 updated row

---

### Phase 12: Read Receipt Sync Back (Real-time)

**Timeline:** ~1-5 seconds - ElectricSQL sync → Sender's client

```
Worker updates messageReadSummary table
         ↓
PostgreSQL triggers replication
         ↓
ElectricSQL captures change
         ↓
WebSocket broadcast to subscribed clients
         ↓
Alice's client receives update
         ↓
useLiveQuery cache updated
         ↓
MessageReadReceipts component re-renders
```

**Alice's Client Update:**
```typescript
// Component queries for read summary
const { data: readSummary } = useLiveQuery(
  db.messageReadSummary
    .findFirst({ where: eq(messageReadSummary.messageId, "msg-abc123") })
);

// Before worker: readSummary = { readCount: 1, recentReaders: ["user-alice-id"] }
// After worker:  readSummary = { readCount: 2, recentReaders: ["user-alice-id", "user-john-id"] }

// Component renders:
return (
  <div className="flex items-center gap-1">
    {/* Shows avatars of recent readers */}
    <Avatar src={alice.image} />
    <Avatar src={john.image} />
    {/* Shows total count if more than 3 */}
  </div>
);
```

---

### Complete Timeline Summary

```
Time    | Phase | Action                                  | Location
--------|-------|-----------------------------------------|---------------------------
0ms     | 1     | User clicks Send                        | MessageComposer
50ms    | 2     | oRPC API call initiated                 | useMessageMutations
100ms   | 3     | Backend transaction starts              | message.create handler
200ms   | 3     | Transaction commits                     | PostgreSQL
250ms   | 4     | ElectricSQL replicates change           | ElectricSQL server
300ms   | 5     | Frontend receives update                | useLiveInfiniteQuery
300ms   | 6     | Auto-scroll animation                   | useVirtualMessages
800ms   | 7-8   | John scrolls, sees message              | MessageList
1300ms  | 9     | John's read receipt transaction         | markMessagesAsRead handler
1400ms  | 10    | Queue message published                 | RabbitMQ
2000ms  | 11    | Worker processes queue                  | read-receipt worker
5000ms  | 11    | Worker updates summary table            | messageReadSummaryTable
5200ms  | 12    | ElectricSQL syncs summary back          | ElectricSQL server
5300ms  | 12    | Alice sees read receipt                 | MessageReadReceipts
```

---

### Key Optimizations in This Flow

1. **Optimistic UI Updates**: Message appears instantly in sender's view (Phase 1)
2. **Parallel Uploads**: Attachments upload while mentions are parsed (Phase 1)
3. **Async Push Notifications**: Don't block transaction commit (Phase 3)
4. **Conditional Read Table Inserts**: Only for small channels (Phase 3, 9)
5. **Timestamp-Based Conflict Resolution**: Prevents race conditions (Phase 3, 9)
6. **Debounced Read Receipts**: Reduces API calls (Phase 8)
7. **Background Aggregation**: Worker processes summaries asynchronously (Phase 11)
8. **Real-time Sync**: ElectricSQL provides instant updates (Phase 4, 12)

---

### Error Handling at Each Phase

**Phase 1 - Upload Failure:**
```typescript
try {
  await uploadToStorage(file);
} catch (error) {
  toast.error("Failed to upload file");
  // Restore UI state
  setAttachments(originalAttachments);
  return;
}
```

**Phase 3 - Transaction Failure:**
```typescript
try {
  await db.transaction(async tx => { ... });
} catch (error) {
  console.error(error);
  throw new ORPCError("INTERNAL_SERVER_ERROR", {
    message: "Failed to create message"
  });
}
```

**Phase 5 - Client Offline:**
```typescript
// ElectricSQL queues changes locally
// When reconnected, applies missed changes
// TanStack Query handles retry logic automatically
```

**Phase 9 - Read Receipt Failure:**
```typescript
// Non-critical failure - log but don't fail request
try {
  await markMessagesAsRead(...);
} catch (error) {
  console.error("Failed to mark as read:", error);
  // User experience unaffected
  // Can retry on next scroll/visibility change
}
```

**Phase 11 - Worker Failure:**
```typescript
// Queue message will retry automatically
// RabbitMQ redelivers unacked messages
// Worker can process in batches if backlog builds up
```

---

### Race Conditions Prevented

**Multiple Tabs Marking Same Message:**
```sql
-- onConflictDoNothing in messageRead table
INSERT INTO message_read (message_id, user_id, read_at)
VALUES ('msg-abc123', 'user-john-id', NOW())
ON CONFLICT (message_id, user_id) DO NOTHING;
```

**Out-of-Order Read Receipt Updates:**
```sql
-- Timestamp-based conditional update in channelRead
UPDATE channel_read
SET last_read_message_id = CASE
  WHEN new_message.created_at > old_message.created_at
  THEN 'msg-abc123'
  ELSE last_read_message_id
END
WHERE channel_id = 'channel-xyz' AND user_id = 'user-john-id';
```

**Concurrent Worker Processing:**
```typescript
// Watermark tracks last processing time
// Workers can deduplicate based on watermark
const lastProcessed = await getWatermark(channelId);
const newReads = await getReadsSince(channelId, lastProcessed);
// Process only new reads
```

---

## Data Models

### Core Tables

#### Channel Table
```typescript
{
  id: string;                    // CUID2 primary key
  name: string;                  // Channel name
  description?: string;          // Optional description
  type: 'team' | 'group' | 'direct';  // Channel type
  organizationId: string;        // Organization reference
  teamId?: string;               // Optional team reference
  createdBy: string;             // User who created channel
  isPrivate: boolean;            // Privacy setting
  isArchived: boolean;           // Archive status
  lastMessageAt?: Date;          // Last message timestamp
  messageCount: number;          // Total message count
  createdAt: Date;
  updatedAt: Date;
}
```

#### Message Table
```typescript
{
  id: string;                    // CUID2 primary key
  channelId: string;             // Channel reference
  senderId: string;              // Sender user ID
  receiverId?: string;           // For direct messages
  content?: string;              // Message text content
  type: 'text' | 'attachment' | 'audio';  // Message type
  parentMessageId?: string;      // For threaded replies
  threadCount: number;           // Number of replies
  isEdited: boolean;             // Edit status
  editedAt?: Date;               // Last edit time
  isDeleted: boolean;            // Soft delete flag
  isPinned: boolean;             // Pin status
  pinnedAt?: Date;               // Pin timestamp
  pinnedBy?: string;             // User who pinned
  deletedAt?: Date;              // Deletion timestamp
  createdAt: Date;
  updatedAt: Date;
}
```

#### Channel Member Table
```typescript
{
  id: string;
  channelId: string;
  userId: string;
  role: string;                  // 'member' | 'admin' | 'owner'
  joinedAt: Date;
  lastReadAt?: Date;             // Last read timestamp
  isMuted: boolean;              // Mute status
}
```

#### Attachment Table
```typescript
{
  id: string;
  messageId: string;
  fileName: string;              // Storage filename
  originalName: string;          // Original upload name
  fileSize: number;              // File size in bytes
  mimeType: string;              // MIME type
  type: 'image' | 'document' | 'video' | 'audio' | 'archive';
  url?: string;                  // Access URL
  thumbnailUrl?: string;         // Thumbnail URL
  uploadedBy: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Message Mention Table
```typescript
{
  id: string;
  messageId: string;
  mentionedById: string;
  mentionedUserId: string;
  isSeen: boolean;               // Whether mention was viewed
  createdAt: Date;
}
```

#### Message Reaction Table
```typescript
{
  id: string;
  messageId: string;
  userId: string;
  reaction: string;              // Emoji character
  createdAt: Date;
}
```

#### Read Receipt Tables

**Message Read Table** (for small channels ≤ 25 members):
```typescript
{
  id: string;
  messageId: string;
  userId: string;
  readAt: Date;
}
```

**Channel Read Table** (tracks last read message per user):
```typescript
{
  channelId: string;
  userId: string;
  lastReadMessageId?: string;
  lastReadAt?: Date;
}
```

**Message Read Summary Table** (aggregated read counts):
```typescript
{
  id: string;
  messageId: string;
  readCount: number;
  lastReadAt?: Date;
  recentReaders: string[];       // Array of user IDs
  createdAt: Date;
  updatedAt: Date;
}
```

---

## API Endpoints

### Channel Router (`packages/api/src/routers/communication/channel.ts`)

#### `channel.create`
Creates a new channel with automatic member assignment.

**Input:**
```typescript
{
  name: string;
  description?: string;
  type: 'team' | 'group' | 'direct';
  teamId?: string;
  isPrivate?: boolean;
  memberIds?: string[];          // For group channels
}
```

**Output:**
```typescript
{
  txid: string;                  // ElectricSQL transaction ID
  channel: Channel;
}
```

**Behavior:**
- Creates channel in a transaction
- Auto-adds organization owners/admins as members
- For team channels: adds all team members
- For group channels: adds specified member IDs
- Generates ElectricSQL transaction ID for sync

#### `channel.update`
Updates channel details.

**Input:**
```typescript
{
  channelId: string;
  name?: string;
  description?: string;
  isPrivate?: boolean;
  isArchived?: boolean;
}
```

#### `channel.get`
Retrieves a single channel with creator information.

**Input:**
```typescript
{
  channelId: string;
}
```

**Output:**
```typescript
{
  ...channel,
  creator: User;
}
```

#### `channel.list`
Lists channels with pagination, search, and filtering.

**Input:**
```typescript
{
  page: number;
  limit: number;
  search?: string;
  filters?: {
    type?: 'team' | 'group' | 'direct';
    teamId?: string;
    includeArchived?: boolean;
  };
  sorting?: Array<{
    id: 'name' | 'createdAt' | 'type';
    desc: boolean;
  }>;
}
```

**Output:**
```typescript
{
  channels: Channel[];
  total: number;
  pageCount: number;
}
```

#### `channel.listMembers`
Lists all members of a channel.

**Input:**
```typescript
{
  channelId: string;
  filter?: {
    role?: string;
  };
}
```

**Output:**
```typescript
Array<{
  id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
  joinedAt: Date;
}>
```

#### `channel.isMember`
Checks if current user is a channel member.

**Input:**
```typescript
{
  channelId: string;
}
```

**Output:**
```typescript
boolean
```

#### `channel.addMembers`
Adds members to a channel.

**Input:**
```typescript
{
  channelId: string;
  memberIds: string[];
}
```

#### `channel.removeMembers`
Removes members from a channel.

**Input:**
```typescript
{
  channelId: string;
  memberIds: string[];
}
```

#### `channel.joinRequest`
Creates a join request for a private channel.

**Input:**
```typescript
{
  channelId: string;
  note?: string;
}
```

#### `channel.listJoinRequests`
Lists all join requests for a channel.

**Input:**
```typescript
{
  channelId: string;
}
```

#### `channel.delete`
Deletes a channel and all associated data.

**Input:**
```typescript
{
  channelId: string;
}
```

**Behavior:**
- Deletes all notifications for the channel
- Cascades delete to messages, attachments, etc. (via DB constraints)
- Returns transaction ID for sync

---

### Message Router (`packages/api/src/routers/communication/message.ts`)

#### `message.create`
Creates a new message with attachments, mentions, and notifications.

**Input:**
```typescript
{
  channelId: string;
  content?: string;
  type: 'text' | 'attachment' | 'audio';
  parentMessageId?: string;      // For threaded replies
  receiverId?: string;           // For direct messages
  mentions?: string[];           // Array of mentioned user IDs
  attachments?: Array<{
    fileName: string;
    originalName: string;
    fileSize: number;
    mimeType: string;
    type: 'image' | 'document' | 'video' | 'audio' | 'archive';
    url: string;
  }>;
}
```

**Output:**
```typescript
{
  txid: string;
  message: Message;
}
```

**Behavior:**
1. Validates channel exists
2. Creates message in transaction
3. Inserts attachments if provided
4. Creates mention records for mentioned users
5. Creates notifications for mentions
6. Sends push notifications asynchronously
7. Increments thread count if replying to a message
8. Marks message as read for sender:
   - For small channels (≤25 members): adds to `messageRead` table
   - Always updates `channelRead` table with conditional update to prevent race conditions
9. Uses timestamp-based comparison to ensure latest message is tracked

#### `message.update`
Updates message content and mentions.

**Input:**
```typescript
{
  messageId: string;
  content: string;
  mentions?: string[];
}
```

**Behavior:**
- Sets `isEdited` flag and `editedAt` timestamp
- Deletes old mentions and creates new ones
- Creates new mention notifications
- Sends push notifications for new mentions

#### `message.delete`
Soft deletes a message and its attachments.

**Input:**
```typescript
{
  messageId: string;
}
```

**Behavior:**
- Fetches message with attachments
- Deletes files from MinIO storage
- Deletes message record (cascades to attachments, mentions, reactions)
- Deletes threaded replies

#### `message.getChannelMessages`
Retrieves all messages for a channel (used less frequently; prefer infinite query).

**Input:**
```typescript
{
  channelId: string;
}
```

#### `message.search`
Searches messages by content within a channel.

**Input:**
```typescript
{
  channelId: string;
  query: string;
  limit: number;
  offset: number;
}
```

**Output:**
```typescript
{
  messages: Message[];
  total: number;
  hasMore: boolean;
}
```

#### `message.get`
Retrieves a single message with sender info.

**Input:**
```typescript
{
  messageId: string;
}
```

#### `message.pin` / `message.unPin`
Pins or unpins a message in a channel.

**Input:**
```typescript
{
  messageId: string;
}
```

**Behavior:**
- Sets `isPinned`, `pinnedAt`, and `pinnedBy` fields
- Returns transaction ID for sync

#### `message.getPinnedMessages`
Retrieves all pinned messages in a channel.

**Input:**
```typescript
{
  channelId: string;
  query?: string;                // Optional search filter
}
```

#### `message.addReaction` / `message.removeReaction`
Adds or removes emoji reactions to messages.

**Add Input:**
```typescript
{
  messageId: string;
  emoji: string;
}
```

**Remove Input:**
```typescript
{
  reactionId: string;
}
```

**Behavior:**
- Uses `onConflictDoNothing` to prevent duplicate reactions
- Unique constraint on (messageId, userId, reaction)

#### `message.markMessagesAsRead`
Marks multiple messages as read, creating read receipts.

**Input:**
```typescript
{
  channelId: string;
  messageIds: string[];
}
```

**Output:**
```typescript
{
  txid: string;
  success: boolean;
}
```

**Behavior:**
1. Verifies user is channel member
2. Counts channel members to determine tracking strategy
3. Filters messages from other users (don't mark own messages)
4. Finds latest message by `createdAt`
5. Updates `channelRead` table with conditional timestamp-based update
6. For small channels (≤25 members): creates `messageRead` records
7. Auto-marks related mentions as seen
8. Marks mention notifications as read
9. Publishes to RabbitMQ queue for background processing
10. Background worker aggregates to `messageReadSummary` table

**Race Condition Prevention:**
Uses SQL `CASE` statement to compare message timestamps before updating:
```sql
CASE
  WHEN new_message.createdAt > (SELECT createdAt FROM message WHERE id = current_lastReadMessageId)
  THEN new_message.id
  ELSE current_lastReadMessageId
END
```

#### `message.getAllMessageReaders`
Retrieves all users who have read a specific message.

**Input:**
```typescript
{
  messageId: string;
}
```

**Output:**
```typescript
{
  readers: Array<{
    id: string;
    name: string;
    email: string;
    image?: string;
    readAt: Date;
  }>;
}
```

**Behavior:**
- Verifies message exists and user has access
- For small channels (≤25 members): queries `messageRead` table
- For large channels (>25 members): queries `channelRead` table to find users whose last read message is after this message's creation time

#### `message.searchUsers`
Searches channel members for mentions.

**Input:**
```typescript
{
  channelId: string;
  query: string;
}
```

#### `message.markMentionSeen` / `message.markAllMentionsSeen`
Marks mentions as seen by the mentioned user.

**Single Input:**
```typescript
{
  mentionId: string;
}
```

**All Input:**
```typescript
{
  channelId: string;
}
```

#### `message.getUnreadCount`
Gets unread message count for a channel.

**Input:**
```typescript
{
  channelId: string;
}
```

**Output:**
```typescript
{
  count: number;
}
```

**Behavior:**
- Checks user's `lastReadAt` from `channelMember` table
- Counts messages created after `lastReadAt`
- If no `lastReadAt`, returns total message count

---

## Frontend Components

### Message List (`apps/web/src/components/member/communication/channels/message-list/`)

#### Main Component: `MessageList`
Location: `message-list/index.tsx`

**Features:**
- Virtual scrolling using TanStack Virtual for performance with large message lists
- Infinite scroll loading (fetches older messages when scrolling to top)
- Date separators between messages from different days
- "New messages" separator showing unread message boundary
- Date filter for jumping to specific dates
- "Jump to latest" button when scrolled up
- Message highlighting for navigation from search/mentions
- Automatic read receipt tracking for visible messages
- Loading states and empty state

**Key Hooks Used:**
```typescript
const {
  scrollRef,           // Scroll container ref
  virtualizer,         // Virtualizer instance
  virtualItems,        // Currently visible virtual items
  totalSize,           // Total virtual height
  items,              // Messages + separators
  messages,           // Raw messages
  isLoading,          // Initial loading state
  isFetchingNextPage, // Loading older messages
  showScrollButton,   // Show "jump to latest" button
  scrollToBottom,     // Scroll to bottom function
  filterDate,         // Selected date filter
  scrollToDate,       // Jump to specific date
  dateRange,          // Min/max message dates
  highlightedMessageId, // Message to highlight
} = useVirtualMessages();

const { visibleMessageIds } = useVisibleMessages({
  virtualItems,
  items,
  enabled: true,
});

useMarkMessagesRead(visibleMessageIds, { debounceMs: 500 });
```

**Virtual Scrolling Implementation:**
- Uses 160px estimated item size
- 25 items overscan for smooth scrolling
- Dynamic height measurement via `virtualizer.measureElement`
- Absolute positioning with `translateY` transform

**Scroll Behavior:**
1. **Initial Load**: Scrolls to "new messages separator" or bottom
2. **New Message Received**: Auto-scrolls if within 500px of bottom
3. **Loading Older Messages**: Preserves scroll position
4. **Highlighted Message**: Centers message with smooth scroll animation

---

### Message Composer (`apps/web/src/components/member/communication/channels/message-composer/`)

#### Main Component: `MessageComposer`
Location: `message-composer/index.tsx`

**Features:**
- Rich text editor with markdown support
- User mentions with autocomplete (including @channel)
- File attachments with preview
- Audio recording with waveform visualization
- Emoji picker
- Typing indicators (broadcasts and displays)
- Message editing support
- Maximized composer mode for long messages
- Drag-and-drop file upload
- Send on Ctrl+Enter, new line on Enter

**Props:**
```typescript
interface MessageComposerProps {
  channelId: string;
  className?: string;
  parentMessageId?: string;      // For threaded replies
  placeholder?: string;
  showHelpText?: boolean;
  onSendSuccess?: () => void;
  onMaximize?: (content: string) => void;
  initialContent?: string;       // For editing
}
```

**Key Features Implementation:**

**Mentions:**
- Fetches channel members via `orpcClient.communication.message.searchUsers`
- Special `@channel` mention expands to all channel members
- Stores mentions as HTML spans with `data-type="mention"` and `data-id="userId"`
- Extracts mention IDs from HTML before sending

**Attachments:**
- Uploads to MinIO via `uploadToStorage` helper
- Supports images, documents, videos, audio files, archives
- Determines attachment type from MIME type
- Shows preview list before sending
- Can remove attachments before sending

**Audio Recording:**
- Uses `useAudioRecorder` hook
- Records in WebM format
- Shows recording duration and waveform
- Uploads to `message-audio` bucket
- Can cancel or send recording

**Typing Indicators:**
- Broadcasts typing status via Pusher
- 3-second timeout before stopping broadcast
- Shows typing users below composer

**Message Submission:**
```typescript
const handleSubmit = async () => {
  // 1. Extract text, attachments, audio
  // 2. Clear UI immediately for better UX
  // 3. Parse mentions from HTML
  // 4. Expand @channel mention to all members
  // 5. Upload attachments and audio in parallel
  // 6. Determine message type (text/attachment/audio)
  // 7. Call createMessage mutation
  // 8. Trigger onSendSuccess callback
};
```

---

### Message Item (`apps/web/src/components/member/communication/channels/message-list/message-item/`)

#### Main Component: `MessageItem`
Location: `message-item/index.tsx`

**Features:**
- Avatar with fallback initials
- Sender name and timestamp
- Edited badge (if edited)
- Pinned badge (if pinned)
- Thread count badge (if has replies)
- Message content with attachments/audio/images
- Hover actions menu (reply, react, edit, pin, delete)
- Reactions display and interaction
- Read receipts (for own messages)
- Reply-in-thread button (for threaded messages)
- Highlight animation when navigated to
- Different styling for own vs. other messages

**Props:**
```typescript
interface MessageItemProps {
  message: MessageWithSenderType;
  isThreadMessage?: boolean;     // Rendered in thread sidebar
  isPinnedMessage?: boolean;     // Rendered in pinned messages
  isHighlighted?: boolean;       // Should highlight (from navigation)
}
```

**Actions Menu:**
- **React**: Opens emoji picker
- **Reply**: Opens thread sidebar
- **Edit**: Opens maximized composer (own messages only)
- **Pin/Unpin**: Toggles pin status
- **Delete**: Deletes message (own messages only)

**Thread Badge:**
- Shows reply count
- Toggles thread sidebar on click
- Highlighted when thread is open

**Read Receipts:**
- Only shown for own messages
- Shows avatars of users who read the message
- Shows count if more than 3 readers
- Click to see full list

---

### Message Hooks (`apps/web/src/hooks/communications/`)

#### `useVirtualMessages`
Location: `use-messages.ts:26-408`

**Purpose:** Manages virtual scrolling, infinite scroll, and scroll behavior for message list.

**Key Features:**
1. **Virtual Scrolling**: Uses `@tanstack/react-virtual` for performance
2. **Infinite Scroll**: Loads older messages when scrolling to top (10% threshold)
3. **Scroll Anchoring**: Preserves scroll position when loading older messages
4. **Auto-scroll**: Scrolls to bottom for new messages if near bottom (500px threshold)
5. **Date Navigation**: Jump to messages on specific dates
6. **Initial Scroll**: Scrolls to "new messages separator" or bottom on mount
7. **Message Highlighting**: Scrolls to and highlights specific messages

**State Management:**
```typescript
const scrollRef = useRef<HTMLDivElement | null>(null);
const hasDoneInitialScrollRef = useRef(false);
const loadMoreAnchorRef = useRef<{ prevScrollHeight: number; prevScrollTop: number } | null>(null);
const isAutoScrollingRef = useRef(false);
const lastMessageIdRef = useRef<string | null>(null);
const pendingDateRef = useRef<Date | undefined>(undefined);
```

**Scroll Restoration Algorithm:**
```typescript
// When loading older messages:
1. Store current scrollHeight and scrollTop (anchor)
2. Wait for new messages to render
3. Calculate difference in scrollHeight
4. Add difference to previous scrollTop
5. Scroll to new position
```

#### `useMessages`
Location: `use-messages.ts:412-459`

**Purpose:** Fetches messages using ElectricSQL live infinite query.

**Implementation:**
```typescript
const { pages, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
  useLiveInfiniteQuery(
    (q) =>
      q.from({ message: messagesCollection })
       .innerJoin({ sender: usersCollection }, ...)
       .leftJoin({ attachment: attachmentsCollection }, ...)
       .innerJoin({ channel: channelsCollection }, ...)
       .where(({ message }) =>
         and(
           eq(message.channelId, channelId),
           isNull(message.deletedAt),
           isNull(message.parentMessageId)  // Exclude threaded replies
         )
       )
       .orderBy(({ message }) => message.createdAt, "desc")
       .select(...),
    { pageSize: 100 }
  );
```

**Features:**
- Live query: Automatically updates when database changes
- Infinite pagination with 100 messages per page
- Joins sender, attachments, and channel data
- Filters out deleted messages and threaded replies
- Orders by creation time descending (newest first)
- Returns messages in chronological order via `buildOrderedMessages`

---

## Key Features

### 1. Threading

**Implementation:**
- Messages have optional `parentMessageId` field
- `threadCount` tracks number of replies
- Thread sidebar shows all replies to a message
- Replies are excluded from main message list query
- Reply button opens thread sidebar
- Thread indicator badge shows reply count

**API Flow:**
```typescript
// Creating a reply:
message.create({
  parentMessageId: "parent-id",
  content: "Reply text",
  ...
})

// Backend automatically:
1. Creates message with parentMessageId
2. Increments parent message's threadCount
3. Returns new message
```

### 2. Reactions

**Implementation:**
- Users can react with any emoji to any message
- Multiple users can use the same emoji
- Each user can only react once per emoji per message
- Reactions are grouped by emoji and show user count
- Click reaction to toggle (add/remove)

**Database Constraint:**
```sql
UNIQUE INDEX (messageId, userId, reaction)
```

**API Flow:**
```typescript
// Add reaction:
message.addReaction({ messageId, emoji: "👍" })
// Uses onConflictDoNothing - idempotent

// Remove reaction:
message.removeReaction({ reactionId })
```

### 3. Mentions

**Implementation:**
- Type `@` to trigger mention autocomplete
- Search filters channel members by name/email
- Special `@channel` mention notifies all members
- Mentions stored as HTML spans with user IDs
- Backend parses HTML to extract mentioned user IDs
- Creates notification and push notification for each mention
- Auto-marks mentions as seen when message is read

**Frontend Flow:**
```typescript
// 1. User types "@" - shows mention list
// 2. User selects mention - inserts:
<span data-type="mention" data-id="user-id">@Name</span>

// 3. On submit, extract IDs:
const mentionRegex = /<span[^>]*data-type="mention"[^>]*data-id="([^"]+)"[^>]*>/g;
const mentionUserIds = [...content.matchAll(mentionRegex)].map(m => m[1]);

// 4. If @channel, expand to all members:
if (mentionUserIds.has(CHANNEL_MENTION_ID)) {
  const members = await channel.listMembers({ channelId });
  mentionUserIds.add(...members.map(m => m.id));
  mentionUserIds.delete(CHANNEL_MENTION_ID);
}
```

**Backend Flow:**
```typescript
// For each mention:
1. Insert messageMention record
2. Insert notification record
3. Send push notification (async)
```

### 4. Read Receipts

**Two-Tier Strategy:**

**Small Channels (≤25 members):**
- Detailed tracking in `messageRead` table
- Each read creates a record (messageId, userId, readAt)
- Can show exact read status per user per message
- Background worker aggregates to `messageReadSummary`

**Large Channels (>25 members):**
- Only tracks in `channelRead` table
- Stores last read message ID per user
- Background worker directly updates `messageReadSummary`
- Infers read status by comparing message timestamps

**Frontend Implementation:**
```typescript
// Track visible messages:
const { visibleMessageIds } = useVisibleMessages({
  virtualItems,
  items,
  enabled: true,
});

// Mark visible messages as read (debounced 500ms):
useMarkMessagesRead(visibleMessageIds, { debounceMs: 500 });
```

**Backend Flow:**
```typescript
markMessagesAsRead({
  channelId,
  messageIds: ["msg1", "msg2", "msg3"]
}) {
  // 1. Filter to messages from other users
  // 2. Find latest message by createdAt
  // 3. Update channelRead with timestamp-based conditional:
  INSERT INTO channelRead VALUES (...)
  ON CONFLICT (channelId, userId) DO UPDATE SET
    lastReadMessageId = CASE
      WHEN new_msg.createdAt > old_msg.createdAt
      THEN new_msg.id
      ELSE old_lastReadMessageId
    END

  // 4. For small channels: insert messageRead records
  // 5. Auto-mark related mentions as seen
  // 6. Publish to RabbitMQ for background aggregation
}
```

**Race Condition Prevention:**
- Uses timestamp comparison instead of simple ID comparison
- Compares `createdAt` of new message vs. current last read message
- Only updates if new message is actually newer
- Prevents out-of-order updates from overwriting newer reads

### 5. Attachments

**Supported Types:**
- Images (image/*)
- Documents (pdf, docx, etc.)
- Videos (video/*)
- Audio files (audio/*)
- Archives (zip, rar, 7z)

**Upload Flow:**
```typescript
// 1. User selects files
// 2. Show preview list
// 3. On send, upload in parallel:
const uploadPromises = attachments.map(att =>
  uploadToStorage(att.file, "message-attachment")
);
const uploaded = await Promise.all(uploadPromises);

// 4. Create message with attachment metadata:
message.create({
  channelId,
  content,
  attachments: uploaded.map(u => ({
    fileName: u.fileName,
    originalName: u.originalName,
    fileSize: u.fileSize,
    mimeType: u.mimeType,
    type: determineType(u.mimeType),
    url: u.url,
  }))
})
```

**Storage:**
- Files stored in MinIO S3-compatible storage
- Two buckets: `message-attachment` and `message-audio`
- Metadata stored in `attachment` table
- Files deleted when message is deleted

### 6. Audio Messages

**Recording:**
- Uses Web Audio API via `useAudioRecorder` hook
- Records in WebM format
- Shows live duration counter
- Waveform visualization during recording
- Can cancel or send recording

**Playback:**
- Custom audio player component
- Shows duration
- Play/pause controls
- Progress bar
- Download option

### 7. Pinning

**Features:**
- Any channel member can pin messages (if permitted)
- Pinned messages shown with pin badge
- Separate pinned messages view
- Can search pinned messages
- Pin/unpin from message actions menu
- Tracks who pinned and when

**API:**
```typescript
message.pin({ messageId })      // Sets isPinned, pinnedAt, pinnedBy
message.unPin({ messageId })    // Clears pin fields
message.getPinnedMessages({ channelId, query? })  // Lists pinned
```

### 8. Message Editing

**Features:**
- Only own text messages can be edited
- Opens maximized composer with current content
- Shows "Edited" badge on edited messages
- Tracks edit timestamp
- Can update mentions during edit

**Flow:**
```typescript
// 1. Click edit action
// 2. Opens maximized composer with message content
// 3. User edits content and mentions
// 4. On save:
message.update({
  messageId,
  content: newContent,
  mentions: newMentionIds,
})
// 5. Backend sets isEdited: true, editedAt: new Date()
```

### 9. Message Search

**Features:**
- Search messages by content within a channel
- Case-insensitive partial matching
- Returns messages with sender info
- Paginated results
- Click result to jump to message in list

**API:**
```typescript
message.search({
  channelId,
  query: "search term",
  limit: 20,
  offset: 0,
})
// Returns: { messages, total, hasMore }
```

### 10. Typing Indicators

**Implementation:**
- Uses Pusher for real-time presence
- Broadcasts typing status when user types
- 3-second timeout before stopping broadcast
- Shows "X is typing..." below composer
- Handles multiple simultaneous typers

**Flow:**
```typescript
// On text change:
broadcastTyping(true, userName)
setTimeout(() => broadcastTyping(false, userName), 3000)

// On empty text:
broadcastTyping(false, userName)
```

### 11. Date Navigation

**Features:**
- Date filter button with calendar picker
- Shows date range of all messages
- Jump to first message on selected date
- Automatically fetches older messages if needed
- Smooth scroll animation to target date

**Implementation:**
```typescript
scrollToDate(date) {
  // 1. Find index of first message on or after date
  const index = items.findIndex(item =>
    item.createdAt >= date
  );

  // 2. If found, scroll to it
  if (index !== -1) {
    virtualizer.scrollToIndex(index);
    return;
  }

  // 3. If not found, fetch more pages
  if (hasNextPage) {
    pendingDateRef.current = date;
    fetchNextPage();
    // Effect will retry when new messages load
  }
}
```

### 12. Unread Count

**Implementation:**
- Tracked per user per channel
- Based on `lastReadAt` in `channelMember` table
- Counts messages created after `lastReadAt`
- Updated when user marks messages as read
- Displayed as badge on channel list

**API:**
```typescript
message.getUnreadCount({ channelId })
// Returns: { count: number }
```

---

## Real-time Features

### ElectricSQL Sync

**Purpose:** Real-time database synchronization

**How it works:**
1. Database changes trigger PostgreSQL logical replication
2. ElectricSQL server captures changes
3. Changes streamed to connected clients via WebSocket
4. TanStack Query automatically updates cached data
5. UI re-renders with new data

**Synced Entities:**
- Channels
- Messages
- Attachments
- Reactions
- Mentions
- Read receipts
- Channel members

**Benefits:**
- Instant updates across all connected clients
- No polling required
- Automatic conflict resolution
- Offline support with sync on reconnect

### Pusher Integration

**Used For:**
- Typing indicators
- Presence (online/offline status)
- Custom real-time events

**Not Used For:**
- Message delivery (handled by ElectricSQL)
- State synchronization (handled by ElectricSQL)

---

## Performance Optimizations

### 1. Virtual Scrolling
- Only renders visible messages (not entire list)
- Significantly reduces DOM nodes for large channels
- Smooth scrolling with overscan buffer
- Dynamic height measurement

### 2. Infinite Scroll
- Loads messages in pages (100 per page)
- Only fetches when scrolling near top
- Preserves scroll position when loading
- Prevents unnecessary API calls

### 3. Debounced Read Receipts
- Groups visible messages into single API call
- 500ms debounce prevents excessive updates
- Only sends read receipts for messages from others
- Batched processing via background worker

### 4. Optimistic Updates
- UI updates immediately before server response
- Better perceived performance
- Reverts on error

### 5. Parallel Uploads
- Uploads all attachments simultaneously
- Doesn't block message send
- Shows progress during upload

### 6. Two-Tier Read Receipt Strategy
- Small channels: Detailed tracking
- Large channels: Aggregated tracking
- Prevents performance degradation at scale

### 7. Background Processing
- Read receipt aggregation in worker
- Push notifications sent asynchronously
- Doesn't block main transaction

---

## Security Considerations

### Authorization

**Channel Access:**
- Users must be channel members to view/send messages
- Private channels require explicit membership
- Organization owners/admins auto-added to all channels

**Message Actions:**
- Users can only edit/delete their own messages
- Pin/unpin requires channel membership
- Reactions available to all channel members

**API Layer:**
- All endpoints use `protectedProcedure` (require authentication)
- Session includes user ID and active organization
- Database queries filter by organization ID

### Input Validation

- All inputs validated with Zod schemas
- Content sanitized to prevent XSS
- File uploads restricted by size and type
- Rate limiting on API endpoints (if configured)

### File Security

- Files stored in private MinIO buckets
- Access URLs signed with expiration
- File deletion cascades when message deleted
- Virus scanning recommended (not implemented)

---

## Error Handling

### Frontend

**Network Errors:**
- Toast notifications for failed operations
- Retry logic in TanStack Query
- Optimistic updates reverted on error

**Validation Errors:**
- Inline form validation
- Error messages from API displayed to user

**Edge Cases:**
- Empty channel states
- Loading states
- Offline handling

### Backend

**Database Errors:**
- Wrapped in try-catch blocks
- Transactions ensure data consistency
- Detailed error logging

**Transaction Failures:**
- Automatic rollback on error
- ElectricSQL transaction IDs for sync
- Client-side retry with exponential backoff

---

## Testing Recommendations

### Unit Tests
- Message formatting utilities
- Mention parsing logic
- Read receipt calculation
- Date separator insertion

### Integration Tests
- Message creation flow
- Read receipt marking
- Mention notification creation
- File upload and deletion

### E2E Tests
- Send and receive messages
- React to messages
- Create threads
- Pin/unpin messages
- Upload attachments
- Record audio messages
- Jump to date
- Search messages

---

## Future Enhancements

### Suggested Features
1. **Voice/Video Calls**: Integrate WebRTC for real-time calls
2. **Message Forwarding**: Forward messages to other channels
3. **Rich Link Previews**: Automatically fetch and display link metadata
4. **Code Snippets**: Syntax highlighted code blocks
5. **Polls**: Create and vote on polls in channels
6. **Scheduled Messages**: Schedule messages for future delivery
7. **Message Templates**: Save and reuse message templates
8. **Analytics**: Message statistics and insights
9. **Export**: Export channel history to PDF/CSV
10. **Starred Messages**: Personal bookmarks for important messages

### Performance Improvements
1. **Image Optimization**: Automatic image compression and thumbnails
2. **CDN Integration**: Serve static assets from CDN
3. **Service Worker**: Offline support and caching
4. **Lazy Loading**: Lazy load message components
5. **Database Indexing**: Add more indexes for common queries

### UX Improvements
1. **Keyboard Shortcuts**: Navigate with keyboard
2. **Message Actions Context Menu**: Right-click for actions
3. **Drag-and-Drop Reordering**: Reorder pinned messages
4. **Emoji Reactions Suggestions**: Suggest popular reactions
5. **Reply Previews**: Show parent message preview in thread

---

## Troubleshooting

### Messages Not Appearing

**Check:**
1. ElectricSQL service is running
2. Database replication is active
3. User is a channel member
4. Messages aren't filtered (deleted/threaded)

**Debug:**
```typescript
// Check raw query results:
const { messages } = useMessages({ channelId });
console.log("Raw messages:", messages);

// Check ElectricSQL connection:
console.log("Electric status:", electric.isConnected);
```

### Read Receipts Not Working

**Check:**
1. RabbitMQ worker is running
2. Channel member count is correct
3. User is viewing messages (not just scrolling past)

**Debug:**
```typescript
// Check visible messages:
const { visibleMessageIds } = useVisibleMessages(...);
console.log("Visible messages:", visibleMessageIds);

// Check API response:
const result = await message.markMessagesAsRead({
  channelId,
  messageIds: visibleMessageIds,
});
console.log("Mark read result:", result);
```

### Slow Performance

**Check:**
1. Message count in channel (virtual scrolling should handle large lists)
2. Number of attachments per message
3. Network latency
4. Database query performance

**Optimize:**
- Add database indexes for slow queries
- Reduce page size if fetching too many messages
- Enable query result caching
- Profile with React DevTools

### Push Notifications Not Sending

**Check:**
1. Web Push certificates configured (VAPID keys)
2. User granted notification permission
3. Push subscription stored in database
4. Worker process running

**Debug:**
```typescript
// Check push subscription:
const subscription = await navigator.serviceWorker.ready
  .then(reg => reg.pushManager.getSubscription());
console.log("Push subscription:", subscription);
```

---

## Architecture Decisions

### Why ElectricSQL?
- Real-time sync without custom WebSocket code
- Automatic conflict resolution
- Offline-first architecture
- Type-safe queries with Drizzle

### Why Virtual Scrolling?
- Handles channels with thousands of messages
- Maintains smooth 60fps scrolling
- Reduces memory footprint
- Better mobile performance

### Why Two-Tier Read Receipts?
- Small channels need detailed tracking
- Large channels would have too many DB rows
- Aggregated approach scales to thousands of members
- Background worker prevents blocking main thread

### Why oRPC?
- End-to-end type safety
- Auto-generated client types
- Built on modern standards (fetch, Web Streams)
- Better DX than tRPC for HTTP-first APIs

### Why MinIO over Cloud Storage?
- Self-hosted, no vendor lock-in
- S3-compatible API (easy migration)
- Cost-effective for high storage needs
- Full control over data location

---

## Related Documentation

- [Better-Auth Documentation](../../auth.md) - Authentication system
- [Storage Module](../storage/README.md) - File storage implementation
- [Real-time System](../../realtime/README.md) - ElectricSQL and Pusher setup
- [Database Schema](../../../packages/db/README.md) - Complete database schema
- [API Reference](../../../packages/api/README.md) - All API endpoints

---

## Changelog

### Version 1.0.0 (Current)
- Initial implementation
- Basic messaging
- Threading
- Reactions
- Mentions
- Read receipts
- Attachments
- Audio messages
- Message pinning
- Search
- Date navigation

---

## Contributing

When contributing to the channels feature:

1. **Follow Type Safety**: Use Zod schemas for all inputs
2. **Test Real-time Sync**: Verify changes work with ElectricSQL
3. **Consider Scale**: Test with large channels (1000+ messages)
4. **Document Changes**: Update this file with new features
5. **Add Migrations**: Create DB migrations for schema changes
6. **Update API Types**: Regenerate types after API changes

---

## Support

For issues or questions:
- Check troubleshooting section above
- Review error logs in browser console and server logs
- Check ElectricSQL sync status
- Verify database state with Drizzle Studio (`bun db:studio`)
