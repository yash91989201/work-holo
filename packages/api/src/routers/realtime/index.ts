import { protectedProcedure } from "@work-holo/api/index";
import { db } from "@work-holo/db";
import { channelMemberTable } from "@work-holo/db/schema/index";
import type { JoinGrantClaims } from "@work-holo/realtime-shared";
import { eq } from "drizzle-orm";
import { SignJWT } from "jose";
import { z } from "zod";
import { env } from "../../env";

const secret = new TextEncoder().encode(env.REALTIME_GRANT_SECRET);

export const realtimeRouter = {
  issueTypingRoomGrant: protectedProcedure
    .input(
      z.object({
        channelId: z.string().min(1),
      })
    )
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;
      const { channelId } = input;

      const membership = await db.query.channelMemberTable.findFirst({
        where: eq(channelMemberTable.channelId, channelId),
      });

      if (!membership) {
        throw new Error("Not a member of this channel");
      }

      const now = Math.floor(Date.now() / 1000);
      const exp = now + 300;

      const claims: JoinGrantClaims = {
        iss: "work-holo-server",
        aud: "work-holo-realtime",
        sub: userId,
        room: `typing:${channelId}`,
        caps: ["broadcast"],
        exp,
        iat: now,
      };

      const token = await new SignJWT(claims as Record<string, unknown>)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt(now)
        .setExpirationTime(exp)
        .sign(secret);

      return { grant: token, room: `typing:${channelId}` };
    }),

  issuePresenceRoomGrant: protectedProcedure
    .input(
      z.object({
        channelId: z.string().min(1),
      })
    )
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;
      const { channelId } = input;

      const membership = await db.query.channelMemberTable.findFirst({
        where: eq(channelMemberTable.channelId, channelId),
      });

      if (!membership) {
        throw new Error("Not a member of this channel");
      }

      const now = Math.floor(Date.now() / 1000);
      const exp = now + 300;

      const claims: JoinGrantClaims = {
        iss: "work-holo-server",
        aud: "work-holo-realtime",
        sub: userId,
        room: `presence:${channelId}`,
        caps: ["presence"],
        exp,
        iat: now,
      };

      const token = await new SignJWT(claims as Record<string, unknown>)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt(now)
        .setExpirationTime(exp)
        .sign(secret);

      return { grant: token, room: `presence:${channelId}` };
    }),
};
