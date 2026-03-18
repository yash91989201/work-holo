import { ORPCError } from "@orpc/server";
import {
  GetOrgPresenceInput,
  GetOrgPresenceOutput,
  HeartbeatInput,
  HeartbeatOutput,
  SetManualStatusInput,
  SetManualStatusOutput,
} from "@work-holo/api/lib/schemas/presence";
import { member } from "@work-holo/db/schema/index";
import { eq } from "drizzle-orm";
import { orgMemberProcedure } from "../../index";
import {
  getPresenceForUsers,
  setManualStatus,
  updatePresence,
} from "../../lib/presence";

export const presenceRouter = {
  /**
   * Sends a heartbeat to update the current user's presence state in Redis.
   * Should be called periodically by the client to keep presence data fresh.
   *
   * @param input.punchedIn - Whether the user is currently punched in
   * @param input.onBreak - Whether the user is on break
   * @param input.inCall - Whether the user is in a call
   * @param input.inMeeting - Whether the user is in a meeting
   * @param input.isTabFocused - Whether the browser tab is focused
   * @param input.isIdle - Whether the user is idle
   * @param input.manualStatus - Optional manually set status override
   * @returns The computed presence status
   * @throws INTERNAL_SERVER_ERROR if Redis is unavailable
   */
  heartbeat: orgMemberProcedure
    .input(HeartbeatInput)
    .output(HeartbeatOutput)
    .handler(async ({ input, context: { session, redis, orgId } }) => {
      const user = session.user;

      if (!redis) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: "Presence service is not available.",
        });
      }

      const status = await updatePresence(redis, user.id, orgId, {
        punchedIn: input.punchedIn,
        onBreak: input.onBreak,
        inCall: input.inCall,
        inMeeting: input.inMeeting,
        isTabFocused: input.isTabFocused,
        isIdle: input.isIdle,
        manualStatus: input.manualStatus ?? null,
      });

      return { status };
    }),

  /**
   * Sets a manual presence status override for the current user (e.g. "away", "dnd").
   * This persists in Redis until explicitly changed or cleared.
   *
   * @param input.status - The manual status to set
   * @returns Success confirmation
   * @throws INTERNAL_SERVER_ERROR if Redis is unavailable
   */
  setManualStatus: orgMemberProcedure
    .input(SetManualStatusInput)
    .output(SetManualStatusOutput)
    .handler(async ({ input, context: { session, redis, orgId } }) => {
      const user = session.user;

      if (!redis) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: "Presence service is not available.",
        });
      }

      await setManualStatus(redis, user.id, orgId, input.status);

      return { ok: true };
    }),

  /**
   * Retrieves the presence status of all members in the organization from Redis.
   * Returns an empty map if no members exist.
   *
   * @returns Map of userId to presence status for all org members
   * @throws INTERNAL_SERVER_ERROR if Redis is unavailable
   */
  getOrgPresence: orgMemberProcedure
    .input(GetOrgPresenceInput)
    .output(GetOrgPresenceOutput)
    .handler(async ({ context: { db, redis, orgId, permission } }) => {
      await permission.check(permission.org.read());
      if (!redis) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: "Presence service is not available.",
        });
      }

      const members = await db.query.member.findMany({
        where: eq(member.organizationId, orgId),
        columns: {
          userId: true,
        },
      });

      const userIds = members.map((m) => m.userId);

      if (userIds.length === 0) {
        return { presence: {} };
      }

      const presence = await getPresenceForUsers(redis, userIds);

      return { presence };
    }),
};
