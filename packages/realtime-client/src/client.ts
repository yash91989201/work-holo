import type { ServerMessage } from "@work-holo/realtime-shared";
import { Room, type RoomOptions } from "./room";
import { type WebSocketState, WebSocketWrapper } from "./websocket";

export interface RealtimeClientOptions {
  url: string;
  onStateChange?: (state: WebSocketState) => void;
  onError?: (error: Error) => void;
}

export class RealtimeClient {
  private readonly ws: WebSocketWrapper;
  private readonly rooms = new Map<string, Room>();
  private connectionId: string | null = null;
  private readonly options: RealtimeClientOptions;
  private readyResolve: (() => void) | null = null;
  private readonly readyPromise: Promise<void>;

  constructor(options: RealtimeClientOptions) {
    this.options = options;
    this.readyPromise = new Promise((resolve) => {
      this.readyResolve = resolve;
    });
    this.ws = new WebSocketWrapper({
      url: options.url,
      onMessage: this.handleMessage.bind(this),
      onStateChange: options.onStateChange,
    });
  }

  connect(): void {
    this.ws.connect();
  }

  disconnect(): void {
    this.ws.disconnect();

    for (const room of this.rooms.values()) {
      room.handleLeft();
    }

    this.rooms.clear();
    this.connectionId = null;
  }

  room(options: Omit<RoomOptions, "grant"> & { grant: string }): Room {
    const existing = this.rooms.get(options.name);
    if (existing) {
      return existing;
    }

    const room = new Room(options, (message) => {
      this.ws.send(message);
    });

    this.rooms.set(options.name, room);
    return room;
  }

  getState(): WebSocketState {
    return this.ws.getState();
  }

  getConnectionId(): string | null {
    return this.connectionId;
  }

  /**
   * Wait for the WebSocket connection to be ready (ready message received)
   */
  async waitForReady(): Promise<void> {
    return this.readyPromise;
  }

  private handleMessage(message: ServerMessage): void {
    try {
      switch (message.type) {
        case "ready":
          this.connectionId = message.connectionId;
          this.readyResolve?.();

          // After a reconnect, eagerly re-join all existing rooms.
          for (const room of this.rooms.values()) {
            room.rejoin();
          }
          break;

        case "room:joined": {
          const room = this.rooms.get(message.room);
          room?.handleJoined();
          break;
        }

        case "room:left": {
          const room = this.rooms.get(message.room);
          room?.handleLeft();
          break;
        }

        case "broadcast:event": {
          const room = this.rooms.get(message.room);
          room?.handleBroadcast(message);
          break;
        }

        case "presence:sync": {
          const room = this.rooms.get(message.room);
          room?.handlePresenceSync(message);
          break;
        }

        case "presence:join": {
          const room = this.rooms.get(message.room);
          room?.handlePresenceJoin(message);
          break;
        }

        case "presence:leave": {
          const room = this.rooms.get(message.room);
          room?.handlePresenceLeave(message);
          break;
        }

        case "error": {
          const roomName =
            typeof message.details?.room === "string"
              ? message.details.room
              : null;

          if (roomName) {
            const room = this.rooms.get(roomName);
            if (room) {
              // Fire-and-forget: try to refresh and rejoin silently.
              void room.handleJoinError(message.code).then((handled) => {
                if (!handled) {
                  this.options.onError?.(
                    new Error(`${message.code}: ${message.message}`)
                  );
                }
              });
              break;
            }
          }

          // Non-room-scoped error (or unknown room)
          this.options.onError?.(
            new Error(`${message.code}: ${message.message}`)
          );
          break;
        }

        case "pong":
          break;

        default:
          break;
      }
    } catch (error) {
      this.options.onError?.(
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }
}

export function createRealtimeClient(
  options: RealtimeClientOptions
): RealtimeClient {
  return new RealtimeClient(options);
}
