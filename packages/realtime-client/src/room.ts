import type {
  BroadcastEventMessage,
  ClientMessage,
  PresenceJoinMessage,
  PresenceLeaveMessage,
  PresenceSyncMessage,
} from "@work-holo/realtime-shared";

type BroadcastHandler = (event: BroadcastEventMessage) => void;
type PresenceSyncHandler = (message: PresenceSyncMessage) => void;
type PresenceJoinHandler = (message: PresenceJoinMessage) => void;
type PresenceLeaveHandler = (message: PresenceLeaveMessage) => void;

type GrantRefreshHandler = () => Promise<string> | string;

export interface RoomOptions {
  name: string;
  grant: string;
  onRefreshGrant?: GrantRefreshHandler;
  onBroadcast?: BroadcastHandler;
  onJoined?: () => void;
  onLeft?: () => void;
  onPresenceSync?: PresenceSyncHandler;
  onPresenceJoin?: PresenceJoinHandler;
  onPresenceLeave?: PresenceLeaveHandler;
}

export class Room {
  private joined = false;
  private tracked = false;
  private lastPresenceState: Record<string, unknown> | null = null;
  private readonly broadcastHandlers = new Set<BroadcastHandler>();
  private readonly presenceSyncHandlers = new Set<PresenceSyncHandler>();
  private readonly presenceJoinHandlers = new Set<PresenceJoinHandler>();
  private readonly presenceLeaveHandlers = new Set<PresenceLeaveHandler>();
  private readonly options: RoomOptions;
  private readonly send: (message: ClientMessage) => void;
  private joinedResolve: (() => void) | null = null;
  private joinedPromise: Promise<void> | null = null;

  // Mutable grant used for join/rejoin messages.
  private grant: string;

  // Prevent infinite refresh/rejoin loops.
  private hasRetriedJoinAfterRefresh = false;

  constructor(options: RoomOptions, send: (message: ClientMessage) => void) {
    this.options = options;
    this.send = send;
    this.grant = options.grant;

    if (options.onBroadcast) {
      this.broadcastHandlers.add(options.onBroadcast);
    }
    if (options.onPresenceSync) {
      this.presenceSyncHandlers.add(options.onPresenceSync);
    }
    if (options.onPresenceJoin) {
      this.presenceJoinHandlers.add(options.onPresenceJoin);
    }
    if (options.onPresenceLeave) {
      this.presenceLeaveHandlers.add(options.onPresenceLeave);
    }
  }

  join(): void {
    if (this.joined) {
      return;
    }

    // Create a promise that resolves when room:joined is received
    this.joinedPromise = new Promise((resolve) => {
      this.joinedResolve = resolve;
    });

    this.send({
      type: "room:join",
      room: this.options.name,
      grant: this.grant,
    });
  }

  /**
   * Rejoin the room (used after a reconnect).
   */
  rejoin(): void {
    // Force a fresh join handshake after reconnect.
    this.joined = false;

    // Allow one refresh-based retry per reconnect join.
    this.hasRetriedJoinAfterRefresh = false;

    this.joinedPromise = new Promise((resolve) => {
      this.joinedResolve = resolve;
    });

    this.send({
      type: "room:join",
      room: this.options.name,
      grant: this.grant,
    });
  }

  /**
   * Attempt to refresh the room's grant (if supported).
   */
  private async refreshGrantIfPossible(): Promise<boolean> {
    const refresh = this.options.onRefreshGrant;
    if (!refresh) {
      return false;
    }

    try {
      const newGrant = await refresh();
      if (!(typeof newGrant === "string" && newGrant.length > 0)) {
        return false;
      }
      this.grant = newGrant;
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Handle a join-related error by refreshing grant and retrying join once.
   */
  async handleJoinError(code: string): Promise<boolean> {
    // Only attempt refresh for auth-ish failures.
    const isAuthFailure = code === "INVALID_GRANT" || code === "UNAUTHORIZED";

    if (!isAuthFailure) {
      return false;
    }

    if (this.hasRetriedJoinAfterRefresh) {
      return false;
    }

    const refreshed = await this.refreshGrantIfPossible();
    if (!refreshed) {
      return false;
    }

    this.hasRetriedJoinAfterRefresh = true;

    // Retry join with refreshed grant.
    this.send({
      type: "room:join",
      room: this.options.name,
      grant: this.grant,
    });

    return true;
  }

  /**
   * Wait for the room join to be confirmed by the server
   */
  async waitForJoin(): Promise<void> {
    if (this.joined) {
      return;
    }
    if (this.joinedPromise) {
      return this.joinedPromise;
    }
    // If join() wasn't called yet, create the promise
    this.joinedPromise = new Promise((resolve) => {
      this.joinedResolve = resolve;
    });
    return this.joinedPromise;
  }

  leave(): void {
    if (!this.joined) {
      return;
    }

    if (this.tracked) {
      this.untrackPresence();
    }

    this.send({
      type: "room:leave",
      room: this.options.name,
    });
  }

  broadcast(event: string, payload: Record<string, unknown>): void {
    if (!this.joined) {
      console.warn("Cannot broadcast: not joined to room");
      return;
    }

    this.send({
      type: "broadcast:send",
      room: this.options.name,
      event,
      payload,
    });
  }

  trackPresence(state: Record<string, unknown>): void {
    // Persist for automatic restoration after reconnect.
    this.lastPresenceState = state;

    if (!this.joined) {
      console.warn("Cannot track presence: not joined to room");
      return;
    }

    this.tracked = true;
    this.send({
      type: "presence:track",
      room: this.options.name,
      state,
    });
  }

  untrackPresence(): void {
    if (!this.tracked) {
      return;
    }

    this.tracked = false;
    this.lastPresenceState = null;
    this.send({
      type: "presence:untrack",
      room: this.options.name,
    });
  }

  onBroadcast(handler: BroadcastHandler): () => void {
    this.broadcastHandlers.add(handler);

    return () => {
      this.broadcastHandlers.delete(handler);
    };
  }

  onPresenceSync(handler: PresenceSyncHandler): () => void {
    this.presenceSyncHandlers.add(handler);

    return () => {
      this.presenceSyncHandlers.delete(handler);
    };
  }

  onPresenceJoin(handler: PresenceJoinHandler): () => void {
    this.presenceJoinHandlers.add(handler);

    return () => {
      this.presenceJoinHandlers.delete(handler);
    };
  }

  onPresenceLeave(handler: PresenceLeaveHandler): () => void {
    this.presenceLeaveHandlers.add(handler);

    return () => {
      this.presenceLeaveHandlers.delete(handler);
    };
  }

  handleJoined(): void {
    this.joined = true;

    // New join handshake; allow future refresh-retry if another reconnect happens.
    this.hasRetriedJoinAfterRefresh = false;

    this.options.onJoined?.();

    // If we were tracking presence previously, restore it after the join handshake.
    if (this.tracked && this.lastPresenceState) {
      this.send({
        type: "presence:track",
        room: this.options.name,
        state: this.lastPresenceState,
      });
    }

    if (this.joinedResolve) {
      this.joinedResolve();
      this.joinedResolve = null;
      this.joinedPromise = null;
    }
  }

  handleLeft(): void {
    this.joined = false;
    // Server-side close will implicitly untrack, but we keep the user's intent so
    // we can restore after reconnect.
    // Note: do not clear lastPresenceState.
    this.options.onLeft?.();
  }

  handleBroadcast(message: BroadcastEventMessage): void {
    for (const handler of this.broadcastHandlers) {
      handler(message);
    }
  }

  handlePresenceSync(message: PresenceSyncMessage): void {
    for (const handler of this.presenceSyncHandlers) {
      handler(message);
    }
  }

  handlePresenceJoin(message: PresenceJoinMessage): void {
    for (const handler of this.presenceJoinHandlers) {
      handler(message);
    }
  }

  handlePresenceLeave(message: PresenceLeaveMessage): void {
    for (const handler of this.presenceLeaveHandlers) {
      handler(message);
    }
  }

  getName(): string {
    return this.options.name;
  }

  isJoined(): boolean {
    return this.joined;
  }

  isTracked(): boolean {
    return this.tracked;
  }
}
