// DM Real-time utilities
// Note: Most real-time sync is handled by Electric SQL automatically.
// Pusher is only used for ephemeral events (typing indicators) that shouldn't be persisted.

export const getDmPresenceChannel = (conversationId: string) =>
  `presence-dm-${conversationId}`;

export const getDmTypingChannel = (conversationId: string) =>
  `private-typing-dm-${conversationId}`;

/**
 * Events sent via Pusher (ephemeral only).
 * All other updates (messages, reactions, edits, deletes, pins, read receipts)
 * are automatically synced via Electric SQL.
 */
export const DM_EVENTS = {
  TYPING_START: "typing-start",
  TYPING_STOP: "typing-stop",
} as const;
