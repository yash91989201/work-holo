import { z } from "zod";

// Client → Server messages
export const RoomJoinMessage = z.object({
  type: z.literal("room:join"),
  room: z.string(),
  grant: z.string(),
  presenceKey: z.string().optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
});

export const RoomLeaveMessage = z.object({
  type: z.literal("room:leave"),
  room: z.string(),
});

export const BroadcastSendMessage = z.object({
  type: z.literal("broadcast:send"),
  room: z.string(),
  event: z.string(),
  payload: z.record(z.string(), z.unknown()),
});

export const PresenceTrackMessage = z.object({
  type: z.literal("presence:track"),
  room: z.string(),
  state: z.record(z.string(), z.unknown()),
});

export const PresenceUntrackMessage = z.object({
  type: z.literal("presence:untrack"),
  room: z.string(),
});

export const PingMessage = z.object({
  type: z.literal("ping"),
});

export const ClientMessage = z.discriminatedUnion("type", [
  RoomJoinMessage,
  RoomLeaveMessage,
  BroadcastSendMessage,
  PresenceTrackMessage,
  PresenceUntrackMessage,
  PingMessage,
]);

// Server → Client messages
export const ReadyMessage = z.object({
  type: z.literal("ready"),
  connectionId: z.string(),
});

export const RoomJoinedMessage = z.object({
  type: z.literal("room:joined"),
  room: z.string(),
});

export const RoomLeftMessage = z.object({
  type: z.literal("room:left"),
  room: z.string(),
});

export const BroadcastEventMessage = z.object({
  type: z.literal("broadcast:event"),
  room: z.string(),
  event: z.string(),
  payload: z.record(z.string(), z.unknown()),
  senderId: z.string().optional(),
});

export const PresenceSyncMessage = z.object({
  type: z.literal("presence:sync"),
  room: z.string(),
  presences: z.array(
    z.object({
      connectionId: z.string(),
      state: z.record(z.string(), z.unknown()),
    })
  ),
});

export const PresenceJoinMessage = z.object({
  type: z.literal("presence:join"),
  room: z.string(),
  connectionId: z.string(),
  state: z.record(z.string(), z.unknown()),
});

export const PresenceLeaveMessage = z.object({
  type: z.literal("presence:leave"),
  room: z.string(),
  connectionId: z.string(),
  state: z.record(z.string(), z.unknown()).optional(),
});

export const ErrorMessage = z.object({
  type: z.literal("error"),
  code: z.string(),
  message: z.string(),
  details: z.record(z.string(), z.unknown()).optional(),
});

export const PongMessage = z.object({
  type: z.literal("pong"),
});

export const ServerMessage = z.discriminatedUnion("type", [
  ReadyMessage,
  RoomJoinedMessage,
  RoomLeftMessage,
  BroadcastEventMessage,
  PresenceSyncMessage,
  PresenceJoinMessage,
  PresenceLeaveMessage,
  ErrorMessage,
  PongMessage,
]);

// Type exports
export type ClientMessage = z.infer<typeof ClientMessage>;
export type ServerMessage = z.infer<typeof ServerMessage>;
export type RoomJoinMessage = z.infer<typeof RoomJoinMessage>;
export type RoomLeaveMessage = z.infer<typeof RoomLeaveMessage>;
export type BroadcastSendMessage = z.infer<typeof BroadcastSendMessage>;
export type PresenceTrackMessage = z.infer<typeof PresenceTrackMessage>;
export type PresenceUntrackMessage = z.infer<typeof PresenceUntrackMessage>;
export type PingMessage = z.infer<typeof PingMessage>;
export type ReadyMessage = z.infer<typeof ReadyMessage>;
export type RoomJoinedMessage = z.infer<typeof RoomJoinedMessage>;
export type RoomLeftMessage = z.infer<typeof RoomLeftMessage>;
export type BroadcastEventMessage = z.infer<typeof BroadcastEventMessage>;
export type PresenceSyncMessage = z.infer<typeof PresenceSyncMessage>;
export type PresenceJoinMessage = z.infer<typeof PresenceJoinMessage>;
export type PresenceLeaveMessage = z.infer<typeof PresenceLeaveMessage>;
export type ErrorMessage = z.infer<typeof ErrorMessage>;
export type PongMessage = z.infer<typeof PongMessage>;
