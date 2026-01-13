import { randomUUID } from "node:crypto";
import {
  type Connection,
  ConnectionRegistry,
  GrantVerifier,
  PresenceTracker,
  type PubSubMessage,
  RedisAdapter,
} from "@work-holo/realtime-api";
import {
  type BroadcastEventMessage,
  type ClientMessage,
  ClientMessage as ClientMessageSchema,
  type PresenceJoinMessage,
  type PresenceLeaveMessage,
  type PresenceSyncMessage,
  type ServerMessage,
} from "@work-holo/realtime-shared";
import { Elysia } from "elysia";
import { env } from "./env";

const registry = new ConnectionRegistry();
const grantVerifier = new GrantVerifier(env.REALTIME_GRANT_SECRET);
const redis = new RedisAdapter(env.REDIS_URL);
const presenceTracker = new PresenceTracker(redis);

// Map ws.id (Elysia's stable connection identifier) to our connectionId
const wsIdToConnectionId = new Map<string, string>();

// Minimal interface for WebSocket methods we use
interface WebSocketInstance {
  readonly id: string;
  send(data: string | ArrayBuffer | Uint8Array, compress?: boolean): number;
  close(code?: number, reason?: string): void;
}

function sendMessage(ws: WebSocketInstance, message: ServerMessage): void {
  ws.send(JSON.stringify(message));
}

function parseMessage(rawMessage: unknown): unknown | null {
  // Elysia automatically parses JSON messages, so rawMessage may already be an object
  if (typeof rawMessage === "object" && rawMessage !== null) {
    return rawMessage;
  }

  // Fallback for string/Buffer messages
  try {
    const messageStr =
      typeof rawMessage === "string"
        ? rawMessage
        : rawMessage instanceof Buffer
          ? rawMessage.toString()
          : String(rawMessage);
    return JSON.parse(messageStr);
  } catch {
    return null;
  }
}

async function handleRoomJoin(
  ws: WebSocketInstance,
  connectionId: string,
  connection: Connection,
  message: { grant: string; room: string }
): Promise<void> {
  let userId: string;
  try {
    const grant = await grantVerifier.verify(message.grant, message.room);
    userId = grant.sub;
  } catch (error) {
    sendMessage(ws, {
      type: "error",
      code: "INVALID_GRANT",
      message:
        error instanceof Error ? error.message : "Grant verification failed",
      details: {
        room: message.room,
        action: "room:join",
      },
    });
    return;
  }

  connection.userId = userId;

  const joined = registry.joinRoom(connectionId, message.room);

  if (!joined) {
    sendMessage(ws, {
      type: "error",
      code: "JOIN_FAILED",
      message: "Failed to join room",
      details: {
        room: message.room,
        action: "room:join",
      },
    });
    return;
  }

  await redis.subscribe(message.room, (msg: PubSubMessage) => {
    if (msg.senderId !== connectionId) {
      const broadcastMsg: BroadcastEventMessage = {
        type: "broadcast:event",
        room: msg.room,
        event: msg.event,
        payload: msg.payload,
        senderId: msg.senderId,
      };
      connection.send(broadcastMsg);
    }
  });

  sendMessage(ws, {
    type: "room:joined",
    room: message.room,
  });
}

function handleRoomLeave(
  ws: WebSocketInstance,
  connectionId: string,
  message: { room: string }
): void {
  const left = registry.leaveRoom(connectionId, message.room);

  if (!left) {
    sendMessage(ws, {
      type: "error",
      code: "LEAVE_FAILED",
      message: "Failed to leave room",
    });
    return;
  }

  sendMessage(ws, {
    type: "room:left",
    room: message.room,
  });
}

async function handleBroadcast(
  ws: WebSocketInstance,
  connectionId: string,
  message: { room: string; event: string; payload: Record<string, unknown> }
): Promise<void> {
  if (!registry.isInRoom(connectionId, message.room)) {
    sendMessage(ws, {
      type: "error",
      code: "NOT_IN_ROOM",
      message: "Must join room before broadcasting",
    });
    return;
  }

  const pubSubMsg: PubSubMessage = {
    room: message.room,
    event: message.event,
    payload: message.payload,
    senderId: connectionId,
  };

  await redis.publish(message.room, pubSubMsg);
}

async function handlePresenceTrack(
  ws: WebSocketInstance,
  connectionId: string,
  message: { room: string; state: Record<string, unknown> }
): Promise<void> {
  if (!registry.isInRoom(connectionId, message.room)) {
    sendMessage(ws, {
      type: "error",
      code: "NOT_IN_ROOM",
      message: "Must join room before tracking presence",
    });
    return;
  }

  await presenceTracker.track(message.room, connectionId, message.state);

  const joinMsg: PresenceJoinMessage = {
    type: "presence:join",
    room: message.room,
    connectionId,
    state: message.state,
  };

  const connections = registry.getRoomMembers(message.room);
  for (const conn of connections) {
    if (conn.id !== connectionId) {
      conn.send(joinMsg);
    }
  }

  const presences = await presenceTracker.getPresences(message.room);
  const syncMsg: PresenceSyncMessage = {
    type: "presence:sync",
    room: message.room,
    presences,
  };
  sendMessage(ws, syncMsg);
}

async function handlePresenceUntrack(
  connectionId: string,
  message: { room: string }
): Promise<void> {
  // Retrieve presence state before untracking
  const presence = await presenceTracker.getPresence(
    message.room,
    connectionId
  );

  await presenceTracker.untrack(message.room, connectionId);

  const leaveMsg: PresenceLeaveMessage = {
    type: "presence:leave",
    room: message.room,
    connectionId,
    state: presence?.state,
  };

  const connections = registry.getRoomMembers(message.room);
  for (const conn of connections) {
    if (conn.id !== connectionId) {
      conn.send(leaveMsg);
    }
  }
}

async function handleMessage(
  ws: WebSocketInstance,
  connectionId: string,
  connection: Connection,
  message: ClientMessage
): Promise<void> {
  switch (message.type) {
    case "room:join": {
      await handleRoomJoin(ws, connectionId, connection, message);
      break;
    }

    case "room:leave": {
      handleRoomLeave(ws, connectionId, message);
      break;
    }

    case "broadcast:send": {
      await handleBroadcast(ws, connectionId, message);
      break;
    }

    case "presence:track": {
      await handlePresenceTrack(ws, connectionId, message);
      break;
    }

    case "presence:untrack": {
      await handlePresenceUntrack(connectionId, message);
      break;
    }

    case "ping": {
      sendMessage(ws, {
        type: "pong",
      });
      break;
    }

    default: {
      break;
    }
  }
}

export const app = new Elysia()
  .ws("/ws", {
    open(ws) {
      const connectionId = randomUUID();
      wsIdToConnectionId.set(ws.id, connectionId);

      const connection: Connection = {
        id: connectionId,
        userId: "",
        rooms: new Set(),
        send: (message: unknown) => sendMessage(ws, message as ServerMessage),
      };

      registry.register(connection);

      sendMessage(ws, {
        type: "ready",
        connectionId,
      });
    },

    async message(ws, rawMessage) {
      const connectionId = wsIdToConnectionId.get(ws.id);

      if (!connectionId) {
        sendMessage(ws, {
          type: "error",
          code: "CONNECTION_NOT_FOUND",
          message: "Connection ID not found",
        });
        return;
      }

      const connection = registry.getConnection(connectionId);

      if (!connection) {
        sendMessage(ws, {
          type: "error",
          code: "CONNECTION_NOT_FOUND",
          message: "Connection not registered",
        });
        return;
      }

      const parsed = parseMessage(rawMessage);
      if (!parsed) {
        sendMessage(ws, {
          type: "error",
          code: "INVALID_JSON",
          message: "Message must be valid JSON",
        });
        return;
      }

      const result = ClientMessageSchema.safeParse(parsed);

      if (!result.success) {
        sendMessage(ws, {
          type: "error",
          code: "INVALID_MESSAGE",
          message: "Invalid message format",
          details: { errors: result.error.issues },
        });
        return;
      }

      const messageData = result.data;

      try {
        await handleMessage(ws, connectionId, connection, messageData);
      } catch (error) {
        sendMessage(ws, {
          type: "error",
          code: "INTERNAL_ERROR",
          message:
            error instanceof Error ? error.message : "Internal server error",
        });
      }
    },

    close(ws) {
      const connectionId = wsIdToConnectionId.get(ws.id);

      if (!connectionId) {
        return;
      }

      const connection = registry.getConnection(connectionId);

      if (connection) {
        const rooms = Array.from(connection.rooms);

        Promise.all(
          rooms.map(async (room) => {
            const presence = await presenceTracker.getPresence(
              room,
              connectionId
            );

            const leaveMsg: PresenceLeaveMessage = {
              type: "presence:leave",
              room,
              connectionId,
              state: presence?.state,
            };

            const connections = registry.getRoomMembers(room);
            for (const conn of connections) {
              if (conn.id !== connectionId) {
                conn.send(leaveMsg);
              }
            }
          })
        ).catch((error) => {
          console.error("Failed to broadcast leave messages:", error);
        });

        presenceTracker
          .cleanupConnection(connectionId, rooms)
          .catch((error) => {
            console.error("Failed to cleanup presence:", error);
          });
      }

      registry.unregister(connectionId);
      wsIdToConnectionId.delete(ws.id);
    },
  })
  .get("/ws", () => "WebSocket endpoint ready at /ws");
