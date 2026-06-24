import { db } from "@work-holo/db";
import { callParticipantTable, callTable } from "@work-holo/db/schema/index";
import { and, eq, isNull } from "drizzle-orm";
import { WebhookReceiver } from "livekit-server-sdk";

const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_API_SECRET;
if (!(apiKey && apiSecret)) {
  // Fail closed: without keys, webhook signatures cannot be verified, so an
  // attacker could POST forged room/participant events that mutate call state.
  throw new Error(
    "LIVEKIT_API_KEY and LIVEKIT_API_SECRET must be set for webhook verification"
  );
}
const receiver = new WebhookReceiver(apiKey, apiSecret);

/** Room name convention is `call_{callId}` — recover the callId. */
function callIdFromRoom(roomName: string | undefined): string | null {
  if (!roomName?.startsWith("call_")) {
    return null;
  }
  return roomName.slice("call_".length);
}

/**
 * Validates and processes a LiveKit webhook. Returns true if handled.
 * Authoritative source for call lifecycle: LiveKit tells us who joined/left
 * and when the room finished, and we mirror that into the DB.
 */
export async function handleLivekitWebhook(
  body: string,
  authHeader: string | undefined
): Promise<void> {
  const event = await receiver.receive(body, authHeader);

  const roomName = event.room?.name;
  const callId = callIdFromRoom(roomName);
  if (!callId) {
    return;
  }

  switch (event.event) {
    case "room_finished": {
      await db
        .update(callTable)
        .set({ status: "ended", endedAt: new Date() })
        .where(and(eq(callTable.id, callId), isNull(callTable.endedAt)));

      await db
        .update(callParticipantTable)
        .set({ leftAt: new Date() })
        .where(
          and(
            eq(callParticipantTable.callId, callId),
            isNull(callParticipantTable.leftAt)
          )
        );
      break;
    }

    case "participant_joined": {
      const userId = event.participant?.identity;
      if (userId) {
        await db
          .update(callParticipantTable)
          .set({ joinedAt: new Date() })
          .where(
            and(
              eq(callParticipantTable.callId, callId),
              eq(callParticipantTable.userId, userId),
              isNull(callParticipantTable.joinedAt)
            )
          );
      }
      break;
    }

    case "participant_left": {
      const userId = event.participant?.identity;
      if (userId) {
        await db
          .update(callParticipantTable)
          .set({ leftAt: new Date() })
          .where(
            and(
              eq(callParticipantTable.callId, callId),
              eq(callParticipantTable.userId, userId),
              isNull(callParticipantTable.leftAt)
            )
          );
      }
      break;
    }

    default:
      break;
  }
}
