import { ORPCError } from "@orpc/server";
import type { db as _dbType } from "@work-holo/db";
import {
  callParticipantTable,
  callTable,
  channelMemberTable,
  member as memberTable,
  user as userTable,
} from "@work-holo/db/schema/index";
import { PusherClient, Queue } from "@work-holo/infrastructure";
import { and, desc, eq, inArray, isNull } from "drizzle-orm";
import { AccessToken, RoomServiceClient } from "livekit-server-sdk";
import { z } from "zod";
import { callingProcedure, orgMemberProcedure } from "../../index";
import { setInCall } from "../../lib/presence";
import {
  AcceptCallInput,
  AddParticipantInput,
  CancelCallInput,
  EndCallInput,
  GetJoinTokenInput,
  GetJoinTokenOutput,
  InitiateCallInput,
  InitiateCallOutput,
  ListCallsInput,
  MuteParticipantInput,
  RejectCallInput,
  RemoveParticipantInput,
} from "../../lib/schemas/call";

function getLivekitRoomService(): RoomServiceClient {
  const url = process.env.LIVEKIT_URL;
  const key = process.env.LIVEKIT_API_KEY;
  const secret = process.env.LIVEKIT_API_SECRET;
  if (!(url && key && secret)) {
    throw new ORPCError("INTERNAL_SERVER_ERROR", {
      message: "LiveKit not configured",
    });
  }
  return new RoomServiceClient(url, key, secret);
}

type DbClient = typeof _dbType;

async function makeLivekitToken(
  userId: string,
  userName: string,
  roomName: string
): Promise<string> {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  if (!(apiKey && apiSecret)) {
    throw new ORPCError("INTERNAL_SERVER_ERROR", {
      message: "LiveKit not configured",
    });
  }
  const at = new AccessToken(apiKey, apiSecret, {
    identity: userId,
    name: userName,
    ttl: "2h",
  });
  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
  });
  return at.toJwt();
}

/** Returns the user's org membership row, or throws if not a member. */
async function assertOrgMember(
  db: DbClient,
  orgId: string,
  userId: string
): Promise<void> {
  const m = await db.query.member.findFirst({
    where: and(
      eq(memberTable.organizationId, orgId),
      eq(memberTable.userId, userId)
    ),
    columns: { id: true },
  });
  if (!m) {
    throw new ORPCError("FORBIDDEN", {
      message: "User is not a member of this organization",
    });
  }
}

/** Loads a call scoped to the caller's org, or throws NOT_FOUND. */
async function getOrgCall(db: DbClient, callId: string, orgId: string) {
  const call = await db.query.callTable.findFirst({
    where: and(eq(callTable.id, callId), eq(callTable.orgId, orgId)),
  });
  if (!call) {
    throw new ORPCError("NOT_FOUND", { message: "Call not found" });
  }
  return call;
}

/** Returns the caller's non-removed participant row, or null. */
async function getParticipant(db: DbClient, callId: string, userId: string) {
  return db.query.callParticipantTable.findFirst({
    where: and(
      eq(callParticipantTable.callId, callId),
      eq(callParticipantTable.userId, userId),
      eq(callParticipantTable.isRemoved, false)
    ),
  });
}

// Procedure base by design:
//   initiate / addParticipant  → callingProcedure  (initiating requires the
//                                 CALLING module permission)
//   accept / reject / getJoinToken / cancel / end / list → orgMemberProcedure
//                                 (receiving/joining a call you were invited to
//                                 must NOT require calling permission — a callee
//                                 whose access is team/user-restricted can still
//                                 answer. These are instead gated by the
//                                 participant/host/channel-membership checks
//                                 inside each handler.)
export const callRouter = {
  initiate: callingProcedure
    .input(InitiateCallInput)
    .output(InitiateCallOutput)
    .handler(async ({ input, context: { db, orgId, session, redis } }) => {
      const caller = session.user;
      const isChannel = input.sourceType === "channel";

      // Channel calls: caller must be a member of the channel they're starting
      // a call in (prevents starting/announcing calls in private channels).
      if (isChannel) {
        if (!input.sourceConversationId) {
          throw new ORPCError("BAD_REQUEST", {
            message: "Channel calls require a sourceConversationId",
          });
        }
        const channelMembership = await db.query.channelMemberTable.findFirst({
          where: and(
            eq(channelMemberTable.channelId, input.sourceConversationId),
            eq(channelMemberTable.userId, caller.id)
          ),
          columns: { id: true },
        });
        if (!channelMembership) {
          throw new ORPCError("FORBIDDEN", {
            message: "Not a member of this channel",
          });
        }
      }

      // Validate callees are members of this org before ringing them.
      if (!isChannel) {
        if (input.calleeIds.length === 0) {
          throw new ORPCError("BAD_REQUEST", {
            message: "DM calls require at least one callee",
          });
        }
        const validCallees = await db
          .select({ userId: memberTable.userId })
          .from(memberTable)
          .where(
            and(
              eq(memberTable.organizationId, orgId),
              inArray(memberTable.userId, input.calleeIds)
            )
          );
        if (validCallees.length !== input.calleeIds.length) {
          throw new ORPCError("FORBIDDEN", {
            message: "One or more callees are not members of this organization",
          });
        }
      }

      const inserted = await db
        .insert(callTable)
        .values({
          orgId,
          type: input.type,
          status: isChannel ? "active" : "ringing",
          initiatorId: caller.id,
          sourceConversationId: input.sourceConversationId ?? null,
          sourceType: input.sourceType ?? null,
          livekitRoomName: "placeholder",
        })
        .returning({ id: callTable.id });

      const callId = inserted[0]?.id;
      if (!callId) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: "Failed to create call",
        });
      }

      const roomName = `call_${callId}`;

      await db
        .update(callTable)
        .set({ livekitRoomName: roomName })
        .where(eq(callTable.id, callId));

      await db.insert(callParticipantTable).values({
        callId,
        userId: caller.id,
        role: "host",
      });

      const token = await makeLivekitToken(
        caller.id,
        caller.name ?? caller.id,
        roomName
      );

      const pusher = PusherClient.getClient();

      if (isChannel) {
        await pusher.trigger(`private-org-${orgId}`, "call.channel.started", {
          callId,
          channelId: input.sourceConversationId,
          initiatorName: caller.name ?? caller.id,
          type: input.type,
        });
        if (redis) {
          await setInCall(redis, caller.id, orgId, true);
        }
      } else {
        for (const calleeId of input.calleeIds) {
          await db.insert(callParticipantTable).values({
            callId,
            userId: calleeId,
            role: "participant",
          });

          await pusher.trigger(`private-user-${calleeId}`, "call.incoming", {
            callId,
            callerId: caller.id,
            callerName: caller.name ?? caller.id,
            callerAvatar: caller.image ?? null,
            type: input.type,
          });
        }

        // Schedule the 30s ring timeout. Sits in the wait queue and dead-letters
        // to the worker after TTL; the worker no-ops if the call was answered.
        Queue.publish("CALL_RING_TIMEOUT", { callId, type: "ring_timeout" });
      }

      return { callId, livekitRoomName: roomName, token };
    }),

  getJoinToken: orgMemberProcedure
    .input(GetJoinTokenInput)
    .output(GetJoinTokenOutput)
    .handler(async ({ input, context: { db, session, orgId } }) => {
      const call = await getOrgCall(db, input.callId, orgId);

      if (
        call.status === "ended" ||
        call.status === "missed" ||
        call.status === "rejected" ||
        call.status === "cancelled"
      ) {
        throw new ORPCError("FORBIDDEN", {
          message: "Call is no longer active",
        });
      }

      const userId = session.user.id;
      let participant = await getParticipant(db, call.id, userId);

      // Channel calls are open rooms: any member of the channel may join.
      // Create a participant row on first join.
      if (!participant) {
        if (call.sourceType === "channel" && call.sourceConversationId) {
          const channelMembership = await db.query.channelMemberTable.findFirst(
            {
              where: and(
                eq(channelMemberTable.channelId, call.sourceConversationId),
                eq(channelMemberTable.userId, userId)
              ),
              columns: { id: true },
            }
          );
          if (!channelMembership) {
            throw new ORPCError("FORBIDDEN", {
              message: "Not a member of this channel",
            });
          }
          const [created] = await db
            .insert(callParticipantTable)
            .values({ callId: call.id, userId, role: "participant" })
            .returning();
          participant = created;
        } else {
          throw new ORPCError("FORBIDDEN", {
            message: "Not a participant of this call",
          });
        }
      }

      if (participant?.isRemoved) {
        throw new ORPCError("FORBIDDEN", {
          message: "You were removed from this call",
        });
      }

      const token = await makeLivekitToken(
        userId,
        session.user.name ?? userId,
        call.livekitRoomName
      );

      return { token, livekitRoomName: call.livekitRoomName };
    }),

  accept: orgMemberProcedure
    .input(AcceptCallInput)
    .output(z.object({ token: z.string(), livekitRoomName: z.string() }))
    .handler(async ({ input, context: { db, session, orgId, redis } }) => {
      const call = await getOrgCall(db, input.callId, orgId);

      if (call.status !== "ringing") {
        throw new ORPCError("NOT_FOUND", {
          message: "Call is not ringing",
        });
      }

      const participant = await getParticipant(db, call.id, session.user.id);
      if (!participant) {
        throw new ORPCError("FORBIDDEN", {
          message: "You are not a callee of this call",
        });
      }

      await db
        .update(callTable)
        .set({ status: "active", startedAt: new Date() })
        .where(eq(callTable.id, input.callId));

      await db
        .update(callParticipantTable)
        .set({ joinedAt: new Date() })
        .where(
          and(
            eq(callParticipantTable.callId, input.callId),
            eq(callParticipantTable.userId, session.user.id)
          )
        );

      const pusher = PusherClient.getClient();
      await pusher.trigger(
        `private-user-${call.initiatorId}`,
        "call.accepted",
        { callId: input.callId }
      );

      // Both parties are now on the call.
      if (redis) {
        await setInCall(redis, session.user.id, orgId, true);
        await setInCall(redis, call.initiatorId, orgId, true);
      }

      const token = await makeLivekitToken(
        session.user.id,
        session.user.name ?? session.user.id,
        call.livekitRoomName
      );
      return { token, livekitRoomName: call.livekitRoomName };
    }),

  reject: orgMemberProcedure
    .input(RejectCallInput)
    .output(z.object({ success: z.boolean() }))
    .handler(async ({ input, context: { db, session, orgId } }) => {
      const call = await getOrgCall(db, input.callId, orgId);

      if (call.status !== "ringing") {
        throw new ORPCError("NOT_FOUND", { message: "Call is not ringing" });
      }

      const participant = await getParticipant(db, call.id, session.user.id);
      if (!participant) {
        throw new ORPCError("FORBIDDEN", {
          message: "You are not a callee of this call",
        });
      }

      await db
        .update(callTable)
        .set({ status: "rejected" })
        .where(eq(callTable.id, input.callId));

      const pusher = PusherClient.getClient();
      await pusher.trigger(
        `private-user-${call.initiatorId}`,
        "call.rejected",
        { callId: input.callId }
      );

      return { success: true };
    }),

  cancel: orgMemberProcedure
    .input(CancelCallInput)
    .output(z.object({ success: z.boolean() }))
    .handler(async ({ input, context: { db, session, orgId } }) => {
      const call = await getOrgCall(db, input.callId, orgId);

      if (call.initiatorId !== session.user.id) {
        throw new ORPCError("FORBIDDEN", {
          message: "Only the caller can cancel",
        });
      }

      if (call.status !== "ringing") {
        throw new ORPCError("NOT_FOUND", { message: "Call is not ringing" });
      }

      await db
        .update(callTable)
        .set({ status: "cancelled" })
        .where(eq(callTable.id, input.callId));

      const participants = await db
        .select({ userId: callParticipantTable.userId })
        .from(callParticipantTable)
        .where(eq(callParticipantTable.callId, input.callId));

      const pusher = PusherClient.getClient();
      for (const p of participants) {
        if (p.userId !== session.user.id) {
          await pusher.trigger(`private-user-${p.userId}`, "call.cancelled", {
            callId: input.callId,
          });
        }
      }

      return { success: true };
    }),

  end: orgMemberProcedure
    .input(EndCallInput)
    .output(z.object({ success: z.boolean() }))
    .handler(async ({ input, context: { db, session, orgId, redis } }) => {
      const call = await getOrgCall(db, input.callId, orgId);

      if (call.status !== "active" && call.status !== "ringing") {
        throw new ORPCError("NOT_FOUND", { message: "Call is not active" });
      }

      // Only the host may end the call for everyone.
      const actor = await getParticipant(db, call.id, session.user.id);
      if (!actor || actor.role !== "host") {
        throw new ORPCError("FORBIDDEN", {
          message: "Only the host can end the call",
        });
      }

      await db
        .update(callTable)
        .set({ status: "ended", endedAt: new Date() })
        .where(eq(callTable.id, input.callId));

      await db
        .update(callParticipantTable)
        .set({ leftAt: new Date() })
        .where(
          and(
            eq(callParticipantTable.callId, input.callId),
            isNull(callParticipantTable.leftAt)
          )
        );

      const participants = await db
        .select({ userId: callParticipantTable.userId })
        .from(callParticipantTable)
        .where(eq(callParticipantTable.callId, input.callId));

      const pusher = PusherClient.getClient();

      if (call.sourceType === "channel" && call.sourceConversationId) {
        await pusher.trigger(
          `private-org-${call.orgId}`,
          "call.channel.ended",
          {
            callId: input.callId,
            channelId: call.sourceConversationId,
          }
        );
      } else {
        for (const p of participants) {
          await pusher.trigger(`private-user-${p.userId}`, "call.ended", {
            callId: input.callId,
          });
        }
      }

      if (redis) {
        for (const p of participants) {
          await setInCall(redis, p.userId, orgId, false);
        }
      }

      return { success: true };
    }),

  addParticipant: callingProcedure
    .input(AddParticipantInput)
    .output(z.object({ success: z.boolean() }))
    .handler(async ({ input, context: { db, session, orgId } }) => {
      const call = await getOrgCall(db, input.callId, orgId);

      if (call.status !== "active") {
        throw new ORPCError("NOT_FOUND", { message: "Call is not active" });
      }

      // Only an existing participant may pull others in.
      const actor = await getParticipant(db, call.id, session.user.id);
      if (!actor) {
        throw new ORPCError("FORBIDDEN", {
          message: "You are not a participant of this call",
        });
      }

      // Target must be a member of this org.
      await assertOrgMember(db, orgId, input.userId);

      const [targetUser] = await db
        .select({
          id: userTable.id,
          name: userTable.name,
          image: userTable.image,
        })
        .from(userTable)
        .where(eq(userTable.id, input.userId))
        .limit(1);

      if (!targetUser) {
        throw new ORPCError("NOT_FOUND", { message: "User not found" });
      }

      const existing = await db.query.callParticipantTable.findFirst({
        where: and(
          eq(callParticipantTable.callId, input.callId),
          eq(callParticipantTable.userId, input.userId)
        ),
      });

      if (!existing) {
        await db.insert(callParticipantTable).values({
          callId: input.callId,
          userId: input.userId,
          role: "participant",
        });
      }

      const pusher = PusherClient.getClient();
      await pusher.trigger(`private-user-${input.userId}`, "call.incoming", {
        callId: input.callId,
        callerId: session.user.id,
        callerName: session.user.name ?? session.user.id,
        callerAvatar: session.user.image ?? null,
        type: call.type,
      });

      return { success: true };
    }),

  list: orgMemberProcedure
    .input(ListCallsInput)
    .handler(async ({ input, context: { db, orgId, session } }) => {
      // Only calls the requester participated in.
      const myParticipations = await db
        .select({ callId: callParticipantTable.callId })
        .from(callParticipantTable)
        .where(eq(callParticipantTable.userId, session.user.id));

      const myCallIds = myParticipations.map((p) => p.callId);
      if (myCallIds.length === 0) {
        return { items: [], nextCursor: undefined };
      }

      const calls = await db.query.callTable.findMany({
        where: and(
          eq(callTable.orgId, orgId),
          inArray(callTable.id, myCallIds)
        ),
        orderBy: [desc(callTable.createdAt)],
        limit: input.limit + 1,
        with: {
          participants: {
            columns: {
              id: true,
              userId: true,
              role: true,
              joinedAt: true,
              leftAt: true,
              isRemoved: true,
            },
          },
        },
      });

      const hasMore = calls.length > input.limit;
      const items = hasMore ? calls.slice(0, input.limit) : calls;

      return {
        items,
        nextCursor: hasMore ? items[items.length - 1]?.id : undefined,
      };
    }),

  muteParticipant: callingProcedure
    .input(MuteParticipantInput)
    .output(z.object({ success: z.boolean() }))
    .handler(async ({ input, context: { db, session, orgId } }) => {
      const call = await getOrgCall(db, input.callId, orgId);

      if (call.status !== "active") {
        throw new ORPCError("NOT_FOUND", { message: "Call is not active" });
      }

      const actor = await getParticipant(db, call.id, session.user.id);
      if (!actor || actor.role !== "host") {
        throw new ORPCError("FORBIDDEN", {
          message: "Only the host can mute participants",
        });
      }

      const svc = getLivekitRoomService();
      await svc.mutePublishedTrack(
        call.livekitRoomName,
        input.participantUserId,
        input.trackSid,
        input.muted
      );

      return { success: true };
    }),

  removeParticipant: callingProcedure
    .input(RemoveParticipantInput)
    .output(z.object({ success: z.boolean() }))
    .handler(async ({ input, context: { db, session, orgId } }) => {
      const call = await getOrgCall(db, input.callId, orgId);

      if (call.status !== "active") {
        throw new ORPCError("NOT_FOUND", { message: "Call is not active" });
      }

      const actor = await getParticipant(db, call.id, session.user.id);
      if (!actor || actor.role !== "host") {
        throw new ORPCError("FORBIDDEN", {
          message: "Only the host can remove participants",
        });
      }

      if (input.participantUserId === session.user.id) {
        throw new ORPCError("BAD_REQUEST", {
          message: "Host cannot remove themselves — use end call instead",
        });
      }

      // Mark removed before kicking so they cannot rejoin.
      await db
        .update(callParticipantTable)
        .set({ isRemoved: true, leftAt: new Date() })
        .where(
          and(
            eq(callParticipantTable.callId, input.callId),
            eq(callParticipantTable.userId, input.participantUserId)
          )
        );

      const svc = getLivekitRoomService();
      await svc.removeParticipant(
        call.livekitRoomName,
        input.participantUserId
      );

      return { success: true };
    }),
};
