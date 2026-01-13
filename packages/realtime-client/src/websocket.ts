import {
  type ClientMessage,
  HEARTBEAT_INTERVAL_MS,
  RECONNECT_CONFIG,
  type ServerMessage,
} from "@work-holo/realtime-shared";

type MessageHandler = (message: ServerMessage) => void;

export type WebSocketState =
  | "connecting"
  | "connected"
  | "disconnected"
  | "reconnecting";

export interface WebSocketWrapperOptions {
  url: string;
  onMessage: MessageHandler;
  onStateChange?: (state: WebSocketState) => void;
}

export class WebSocketWrapper {
  private ws: WebSocket | null = null;
  private state: WebSocketState = "disconnected";
  private reconnectAttempts = 0;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  private readonly messageQueue: ClientMessage[] = [];
  private readonly options: WebSocketWrapperOptions;

  constructor(options: WebSocketWrapperOptions) {
    this.options = options;
  }

  connect(): void {
    if (this.state === "connected" || this.state === "connecting") {
      return;
    }

    this.setState("connecting");

    try {
      this.ws = new WebSocket(this.options.url);

      this.ws.onopen = () => {
        this.setState("connected");
        this.reconnectAttempts = 0;
        this.startHeartbeat();
        this.flushMessageQueue();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as ServerMessage;
          this.options.onMessage(data);
        } catch (error) {
          console.error("Failed to parse message:", error);
        }
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      this.ws.onclose = () => {
        this.stopHeartbeat();
        this.setState("disconnected");
        this.scheduleReconnect();
      };
    } catch (error) {
      console.error("Failed to create WebSocket:", error);
      this.setState("disconnected");
      this.scheduleReconnect();
    }
  }

  disconnect(): void {
    this.clearReconnectTimeout();
    this.stopHeartbeat();

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.setState("disconnected");
  }

  send(message: ClientMessage): void {
    if (this.state === "connected" && this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      this.messageQueue.push(message);
    }
  }

  getState(): WebSocketState {
    return this.state;
  }

  private setState(state: WebSocketState): void {
    if (this.state !== state) {
      this.state = state;
      this.options.onStateChange?.(state);
    }
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();

    this.heartbeatInterval = setInterval(() => {
      this.send({ type: "ping" });
    }, HEARTBEAT_INTERVAL_MS);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= RECONNECT_CONFIG.maxAttempts) {
      return;
    }

    const delay = Math.min(
      RECONNECT_CONFIG.initialDelayMs *
        RECONNECT_CONFIG.multiplier ** this.reconnectAttempts,
      RECONNECT_CONFIG.maxDelayMs
    );

    this.setState("reconnecting");
    this.reconnectAttempts++;

    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, delay);
  }

  private clearReconnectTimeout(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) {
        this.send(message);
      }
    }
  }
}
