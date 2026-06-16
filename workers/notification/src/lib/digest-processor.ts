import type { db as Db } from "@work-holo/db";
import { user } from "@work-holo/db/schema/auth";
import {
  notificationTable,
  pendingEmailDigestTable,
} from "@work-holo/db/schema/notification";
import {
  type DigestItem,
  DigestNotificationEmail,
  sendEmail,
} from "@work-holo/email";
import { and, eq, lte } from "drizzle-orm";
import { log } from "evlog";
import type { Transporter } from "nodemailer";
import { createElement } from "react";

const TAG = "notification:digest";

const DIGEST_INTERVAL_MS = 60_000;

const EVENT_TYPE_TO_DIGEST_TYPE: Record<string, DigestItem["type"]> = {
  channel_mention: "mention",
  channel_reply: "reply",
  dm_reply: "reply",
  channel_reaction: "reaction",
  dm_reaction: "reaction",
  dm_message: "dm",
  channel_message: "dm",
};

interface PendingDigestRow {
  id: string;
  notificationId: string;
  orgId: string;
  userId: string;
}

interface NotificationRow {
  actionUrl: string | null;
  createdAt: Date;
  id: string;
  message: string | null;
  metadata: unknown;
  title: string;
  type: string;
}

async function fetchPendingDigests(db: typeof Db): Promise<PendingDigestRow[]> {
  const now = new Date();

  return await db
    .select({
      id: pendingEmailDigestTable.id,
      userId: pendingEmailDigestTable.userId,
      orgId: pendingEmailDigestTable.orgId,
      notificationId: pendingEmailDigestTable.notificationId,
    })
    .from(pendingEmailDigestTable)
    .where(
      and(
        lte(pendingEmailDigestTable.scheduledAt, now),
        eq(pendingEmailDigestTable.sent, false)
      )
    );
}

function groupByUserOrg(
  rows: PendingDigestRow[]
): Map<string, PendingDigestRow[]> {
  const groups = new Map<string, PendingDigestRow[]>();

  for (const row of rows) {
    const key = `${row.userId}:${row.orgId}`;
    const group = groups.get(key);
    if (group) {
      group.push(row);
    } else {
      groups.set(key, [row]);
    }
  }

  return groups;
}

function buildDigestItem(notification: NotificationRow): DigestItem {
  const digestType = EVENT_TYPE_TO_DIGEST_TYPE[notification.type] ?? "dm";
  const metadata = (notification.metadata ?? {}) as Record<string, string>;

  return {
    type: digestType,
    title: notification.title,
    preview: notification.message ?? metadata.messagePreview ?? "",
    url: notification.actionUrl ?? "#",
    timestamp: notification.createdAt.toISOString(),
  };
}

async function processDigestGroup(
  db: typeof Db,
  transport: Transporter,
  fromAddress: string,
  entries: PendingDigestRow[]
): Promise<void> {
  const firstEntry = entries[0];
  if (!firstEntry) return;

  const [userInfo] = await db
    .select({ email: user.email, name: user.name })
    .from(user)
    .where(eq(user.id, firstEntry.userId))
    .limit(1);

  if (!userInfo?.email) {
    log.info(
      TAG,
      `User ${firstEntry.userId} has no email, marking entries as sent`
    );
    await markEntriesAsSent(db, entries);
    return;
  }

  const notificationIds = entries.map((e) => e.notificationId);
  const notifications: NotificationRow[] = [];

  for (const nId of notificationIds) {
    const [notification] = await db
      .select({
        id: notificationTable.id,
        type: notificationTable.type,
        title: notificationTable.title,
        message: notificationTable.message,
        actionUrl: notificationTable.actionUrl,
        metadata: notificationTable.metadata,
        createdAt: notificationTable.createdAt,
      })
      .from(notificationTable)
      .where(eq(notificationTable.id, nId))
      .limit(1);

    if (notification) {
      notifications.push(notification as NotificationRow);
    }
  }

  if (notifications.length === 0) {
    await markEntriesAsSent(db, entries);
    return;
  }

  const digestItems = notifications.map(buildDigestItem);

  await sendEmail(transport, {
    to: userInfo.email,
    from: fromAddress,
    subject: `Your notification digest — ${digestItems.length} update${digestItems.length === 1 ? "" : "s"}`,
    react: createElement(DigestNotificationEmail, {
      recipientName: userInfo.name,
      items: digestItems,
      period: "recent",
      dashboardUrl: "#",
    }),
  });

  await markEntriesAsSent(db, entries);

  log.info(
    TAG,
    `Sent digest with ${digestItems.length} items to ${userInfo.email}`
  );
}

async function markEntriesAsSent(
  db: typeof Db,
  entries: PendingDigestRow[]
): Promise<void> {
  for (const entry of entries) {
    await db
      .update(pendingEmailDigestTable)
      .set({ sent: true })
      .where(eq(pendingEmailDigestTable.id, entry.id));
  }
}

async function processDigests(
  db: typeof Db,
  transport: Transporter,
  fromAddress: string
): Promise<void> {
  const pending = await fetchPendingDigests(db);

  if (pending.length === 0) {
    return;
  }

  log.info(TAG, `Found ${pending.length} pending digest entries`);

  const groups = groupByUserOrg(pending);

  for (const [key, entries] of groups) {
    try {
      await processDigestGroup(db, transport, fromAddress, entries);
    } catch (error) {
      log.error({
        tag: TAG,
        message: `Failed to process digest for group ${key}`,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

export function startDigestProcessor(
  db: typeof Db,
  transport: Transporter,
  fromAddress: string
): NodeJS.Timeout {
  log.info(TAG, `Starting with ${DIGEST_INTERVAL_MS / 1000}s interval`);

  const intervalId = setInterval(() => {
    processDigests(db, transport, fromAddress).catch((error) => {
      log.error({
        tag: TAG,
        message: "Unhandled error",
        error: error instanceof Error ? error.message : String(error),
      });
    });
  }, DIGEST_INTERVAL_MS);

  return intervalId;
}
