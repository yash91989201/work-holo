import type { Queue } from "@work-holo/infrastructure";

export interface AllNotificationManagers {
  queueClient: ReturnType<typeof Queue.getClient>;
}

let queueClient: ReturnType<typeof Queue.getClient> | null = null;

const assertInitialized = (): AllNotificationManagers => {
  if (!queueClient) {
    throw new Error(
      "NotificationManagers not initialized. Call NotificationManagers.initialize() first."
    );
  }

  return {
    queueClient,
  };
};

export const NotificationManagers = {
  initialize(config: {
    queueClient: ReturnType<typeof Queue.getClient>;
  }): void {
    queueClient = config.queueClient;
  },

  getAll(): AllNotificationManagers {
    return assertInitialized();
  },

  reset(): void {
    queueClient = null;
  },
} as const;
