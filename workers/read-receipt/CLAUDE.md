# Read Receipt Worker

Processes read receipts from messaging channels and aggregates them into summary tables for efficient querying.

## Purpose

When users read messages in channels, individual read events are tracked. This worker consumes queue messages and computes aggregated read counts + recent readers for each message, avoiding expensive real-time queries.

## Architecture

```
Message Read Event (API)
        │
        ▼
   RabbitMQ Queue
   (read_receipts)
        │
        ▼
  ┌─────────────────┐
  │ QueueWorker     │
  │ (index.ts)      │
  └────────┬────────┘
           │
           ▼
  ┌─────────────────┐
  │ Processor       │  Strategy Selection
  │ (lib/processor) │  based on member count
  └────────┬────────┘
           │
     ┌─────┴─────┐
     ▼           ▼
Small Channel  Large Channel
(≤25 members)  (>25 members)
     │           │
     ▼           ▼
messageReadTable  channelReadTable
     │           │
     └─────┬─────┘
           ▼
messageReadSummaryTable (output)
```

## Dual Strategy Processing

### Small Channels (≤25 members)
- Uses `messageReadTable` for granular per-message read tracking
- More accurate but higher DB load
- Function: `processSmallChannelReadReceipts()`

### Large Channels (>25 members)
- Uses `channelReadTable` with user watermarks
- Aggregates from channel-level read positions
- More efficient for scale
- Function: `processLargeChannelReadReceipts()`

Threshold configurable via `MAX_MEMBERS_FOR_DETAILED_TRACKING` env var.

## Key Files

| File | Purpose |
|------|---------|
| `index.ts` | Entry point, QueueWorker class, message handling |
| `lib/processor.ts` | Core processing logic, dual-strategy implementation |
| `Dockerfile` | Multi-stage Docker build |
| `.env.example` | Environment template |

## Message Format

```typescript
{
  type: "process_channel",
  channelId: string,
  memberCount: number,
  timestamp: string
}
```

Messages published from `packages/api/src/routers/communication/message.ts` when channel reads are updated.

## Database Tables

| Table | Role |
|-------|------|
| `messageTable` | Source messages (filtered by `deletedAt IS NULL`) |
| `messageReadTable` | Individual user reads (small channel strategy) |
| `channelReadTable` | Channel-level read positions (large channel strategy) |
| `messageReadSummaryTable` | **Output** - aggregated read counts + recent readers |
| `channelReadProcessedWatermarkTable` | Tracks last processing timestamp per channel |
| `channelMemberTable` | Channel membership for member counts |

Schema: `packages/db/src/schema/communication.ts`

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | - | PostgreSQL connection string |
| `RABBITMQ_URL` | No | `amqp://admin:admin@localhost:5672` | RabbitMQ connection |
| `PREFETCH_COUNT` | No | `5` | Concurrent messages processed |
| `READ_RECEIPT_BATCH_SIZE` | No | `100` | Messages per processing batch |
| `MAX_MEMBERS_FOR_DETAILED_TRACKING` | No | `25` | Channel size threshold |
| `ENV` | No | `development` | Environment mode |

## Performance Features

- **Deduplication**: `processingChannels` Set prevents concurrent processing of same channel
- **Batching**: Processes in configurable batches to avoid memory exhaustion
- **Member Count Caching**: 30-second TTL cache reduces DB queries
- **Watermarking**: Avoids reprocessing same data
- **Auto Cache Cleanup**: Every 10 minutes

## Running

### Development
```bash
bun run dev
```

### Production
```bash
bun run start
```

### Docker
```bash
docker build -t read-receipt-worker .
docker run -e DATABASE_URL=... -e RABBITMQ_URL=... read-receipt-worker
```

## Error Handling

- Errors rethrown to trigger queue retry mechanism
- Messages acknowledged before processing (prevents timeout)
- Graceful shutdown on SIGINT/SIGTERM
- Uncaught exception handlers for cleanup
