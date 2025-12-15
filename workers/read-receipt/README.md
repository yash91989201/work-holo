# Read Receipt Worker

A queue-based worker service for processing read receipts in channels. This worker consumes messages from a RabbitMQ queue and aggregates read receipt data from `messageRead` and `channelRead` tables into the `messageReadSummary` table for efficient querying.

## Architecture

### Queue-Based Processing

The worker listens to a RabbitMQ queue (`read_receipts`) for messages containing channel IDs to process. When a message is received, it processes read receipts for that specific channel using one of two strategies based on channel size:

- **Small channels (≤25 members)**: Uses detailed tracking via the `messageRead` table
- **Large channels (>25 members)**: Uses aggregated tracking via the `channelRead` watermark table

This event-driven approach ensures real-time processing triggered by user activity rather than periodic polling.

### Message Format

Messages in the queue have the following structure:

```json
{
  "type": "process_channel",
  "channelId": "channel-uuid",
  "memberCount": 50,
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

## Features

- **RabbitMQ Integration**: Event-driven processing via message queue
- **Concurrent Processing**: Configurable prefetch count for parallel message processing
- **Deduplication**: Prevents processing the same channel concurrently
- **Automatic Retry**: Failed messages are retried up to 3 times
- **Batch Processing**: Processes messages in configurable batches (default: 100)
- **Watermark Tracking**: Maintains processing watermarks per channel to avoid reprocessing
- **Member Count Caching**: Caches channel member counts (30s TTL) to reduce database queries
- **Automatic Cache Cleanup**: Cleans up expired cache entries every 10 minutes
- **Error Handling**: Robust error handling with per-channel error tracking
- **Graceful Shutdown**: Handles SIGINT/SIGTERM signals gracefully
- **Auto-Reconnection**: Automatically reconnects to RabbitMQ on connection loss

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | - | PostgreSQL connection string (required) |
| `RABBITMQ_URL` | `amqp://admin:admin@localhost:5672` | RabbitMQ connection string |
| `PREFETCH_COUNT` | `5` | Number of messages to process concurrently |
| `READ_RECEIPT_BATCH_SIZE` | `100` | Maximum messages to process per batch |
| `MAX_MEMBERS_FOR_DETAILED_TRACKING` | `25` | Threshold for switching to aggregated tracking |
| `NODE_ENV` | `production` | Environment mode |

## Development

### Prerequisites

- Bun runtime
- PostgreSQL database
- RabbitMQ server
- Access to the workspace packages (@work-holo/db, @work-holo/api)

### Install Dependencies

```bash
bun install
```

### Run Locally

```bash
# Start RabbitMQ (if not running)
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management-alpine

# With default settings
bun run dev

# With custom settings
RABBITMQ_URL=amqp://localhost:5672 PREFETCH_COUNT=10 bun run dev
```

### Run in Production

```bash
bun run start
```

## Docker Deployment

### Build the Image

```bash
docker build -t read-receipt-worker .
```

### Run with Docker

```bash
docker run -d \
  --name read-receipt-worker \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  -e RABBITMQ_URL="amqp://admin:admin@rabbitmq:5672" \
  read-receipt-worker
```

### Run with Docker Compose

The docker-compose configuration includes both the worker and RabbitMQ service:

```bash
# Create .env file with required variables
cp .env.example .env

# Start the worker and RabbitMQ
docker-compose up -d

# View logs
docker-compose logs -f read-receipt-worker

# Stop the services
docker-compose down
```

### Access RabbitMQ Management UI

When using docker-compose, the RabbitMQ management UI is available at:
- URL: http://localhost:15672
- Username: admin
- Password: admin

## How It Works

### Processing Flow

1. **Queue Consumption**: Worker connects to RabbitMQ and starts consuming from `read_receipts` queue
2. **Message Receipt**: Receives a message with channel ID and member count
3. **Deduplication Check**: Ensures the channel isn't already being processed
4. **Strategy Selection**: Determines small vs large channel strategy based on member count
5. **Batch Processing**: Processes messages in batches to avoid memory issues
6. **Summary Updates**: Upserts `messageReadSummary` records with:
   - Total read count
   - Last read timestamp
   - Recent readers (up to 10 most recent)
7. **Watermark Update**: Updates the channel's processing watermark
8. **Message Acknowledgment**: Acknowledges successful processing to RabbitMQ

### Small Channel Processing

For channels with ≤25 members:
- Queries the `messageRead` table for new reads since last watermark
- Aggregates read counts and recent readers per message
- More accurate but higher database load

### Large Channel Processing

For channels with >25 members:
- Queries the `channelRead` table for user watermarks
- Determines read counts based on watermark positions
- Less granular but more efficient for large channels

### Error Handling & Retries

- Failed messages are automatically retried up to 3 times
- Exponential backoff is handled by RabbitMQ's requeue mechanism
- After 3 failures, messages are discarded and logged

## Monitoring

The worker logs detailed information about processing:

```
===========================================
Read Receipt Worker Starting...
===========================================
Environment: production
RabbitMQ URL: amqp://admin:admin@rabbitmq:5672
Prefetch Count: 5
Batch Size: 100
Max Members for Detailed Tracking: 25
===========================================

Connected to RabbitMQ successfully
Queue "read_receipts" setup completed
Starting to consume messages from queue: read_receipts
Prefetch count: 5
Worker is now consuming messages. Press CTRL+C to exit.

Processing read receipts for channel: abc-123 (10 members, detailed tracking)
Successfully processed channel abc-123: {
  strategy: 'detailed',
  messagesProcessed: 45,
  summariesUpdated: 45
}
```

## Performance Considerations

- **Prefetch Count**: Higher values = more concurrent processing but more memory usage
- **Batch Size**: Larger batches = fewer transactions but more memory usage
- **Member Count Cache**: Reduces database queries but may be slightly stale (30s TTL)
- **Queue Configuration**: Messages expire after 1 hour, max 10k messages in queue

## Scaling

### Horizontal Scaling

The worker can be scaled horizontally by:
1. Running multiple worker instances consuming from the same queue
2. RabbitMQ will distribute messages across workers (round-robin)
3. Each worker maintains its own deduplication set

```bash
# Scale to 3 workers with docker-compose
docker-compose up -d --scale read-receipt-worker=3
```

### Vertical Scaling

Adjust resource limits in `docker-compose.yml`:

```yaml
deploy:
  resources:
    limits:
      cpus: '2'
      memory: 1G
```

## Troubleshooting

### Worker Not Processing Messages

1. Check RabbitMQ connection: Verify `RABBITMQ_URL` is correct
2. Check queue exists: Use RabbitMQ management UI at http://localhost:15672
3. Verify messages in queue: Check queue depth in management UI
4. Check worker logs: `docker-compose logs -f read-receipt-worker`

### High Memory Usage

- Reduce `PREFETCH_COUNT` (fewer concurrent messages)
- Reduce `READ_RECEIPT_BATCH_SIZE` (smaller batches)

### Slow Processing

- Increase `PREFETCH_COUNT` (more parallelization)
- Increase `READ_RECEIPT_BATCH_SIZE` (larger batches)
- Scale horizontally (more worker instances)

### Messages Being Discarded

- Check error logs for failure reasons
- Verify database connectivity
- Check if channels exist and aren't archived

## Integration

### Publishing Messages to Queue

To trigger read receipt processing, publish a message to the `read_receipts` queue:

```typescript
import { getQueueClient } from '@work-holo/api/lib/queue';

const queueClient = getQueueClient();

queueClient.publish('READ_RECEIPTS', {
  type: 'process_channel',
  channelId: 'channel-uuid',
  memberCount: 50,
  timestamp: new Date().toISOString(),
});
```

### Direct Import (Alternative)

Functions can also be imported directly:

```typescript
import { processChannelReadReceiptsNow } from '@work-holo/api/lib/read-receipt-worker';
import { db } from '@work-holo/db';

// Process a specific channel
const result = await processChannelReadReceiptsNow(db, channelId, memberCount);
console.log(result); // { channelId, messagesProcessed, summariesUpdated }
```

## License

Private - Part of the work-holo project
