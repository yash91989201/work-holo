import { describe, expect, mock, test } from "bun:test";
import { isMuted, resolveDeliveryChannels } from "../preference-resolver";

type QueryRow = Record<string, unknown>;

function createDbMock(queryResults: QueryRow[][]) {
  const queue = [...queryResults];

  const where = mock(async () => queue.shift() ?? []);
  const limit = mock(async () => queue.shift() ?? []);
  const from = mock(() => ({ where, limit }));
  const select = mock(() => ({ from }));

  return {
    db: { select },
    from,
    select,
    where,
  };
}

describe("preference resolver", () => {
  test("respects enabled and disabled global channel preferences", async () => {
    const { db } = createDbMock([
      [
        {
          deliveryChannel: "sound",
          enabled: true,
          entityId: null,
          entityType: null,
        },
        {
          deliveryChannel: "push",
          enabled: false,
          entityId: null,
          entityType: null,
        },
      ],
    ]);

    const channels = await resolveDeliveryChannels({
      db: db as never,
      entityId: null,
      entityType: null,
      eventType: "channel_message",
      orgId: "org-1",
      userId: "user-1",
    });

    expect(channels).toEqual(["sound"]);
  });

  test("uses entity-level overrides before global preferences", async () => {
    const { db } = createDbMock([
      [
        {
          deliveryChannel: "email",
          enabled: false,
          entityId: null,
          entityType: null,
        },
        {
          deliveryChannel: "email",
          enabled: true,
          entityId: "channel-1",
          entityType: "channel",
        },
      ],
    ]);

    const channels = await resolveDeliveryChannels({
      db: db as never,
      entityId: "channel-1",
      entityType: "channel",
      eventType: "channel_reply",
      orgId: "org-1",
      userId: "user-1",
    });

    expect(channels).toContain("email");
  });

  test("falls back to default preferences when no rows exist", async () => {
    const { db } = createDbMock([[]]);

    const channels = await resolveDeliveryChannels({
      db: db as never,
      entityId: null,
      entityType: null,
      eventType: "dm_reaction",
      orgId: "org-1",
      userId: "user-1",
    });

    expect(channels).toEqual(["sound"]);
  });

  test("returns true for muted channel membership", async () => {
    const { db } = createDbMock([[{ isMuted: true }]]);

    const muted = await isMuted({
      db: db as never,
      entityId: "channel-1",
      entityType: "channel",
      userId: "user-1",
    });

    expect(muted).toBe(true);
  });

  test("returns false when channel is not muted", async () => {
    const { db } = createDbMock([[{ isMuted: false }]]);

    const muted = await isMuted({
      db: db as never,
      entityId: "channel-1",
      entityType: "channel",
      userId: "user-1",
    });

    expect(muted).toBe(false);
  });
});
