import { protectedProcedure } from "@work-holo/api/index";
import { db } from "@work-holo/db";
import {
  channelMemberTable,
  dmConversationTable,
  member,
} from "@work-holo/db/schema/index";
import { PusherClient } from "@work-holo/infrastructure";
import { and, eq, or } from "drizzle-orm";
import { z } from "zod";

const CHANNEL_ID_REGEX = /(?:presence-channel-|private-typing-)(.+)/;
const ORG_CHANNEL_REGEX = /^private-org-(.+)$/;
const USER_CHANNEL_REGEX = /^private-user-(.+)$/;
const DM_CHANNEL_REGEX = /^(?:presence-dm-|private-typing-dm-)(.+)$/;

export const realtimeRouter = {
  authorize: protectedProcedure
    .input(
      z.object({
        socketId: z.string(),
        channelName: z.string(),
      })
    )
    .handler(async ({ input, context }) => {
      const { socketId, channelName } = input;
      const userId = context.session.user.id;
      const userName = context.session.user.name ?? "Anonymous";

      const pusher = PusherClient.getClient();

      // Private user channel — verify the channel matches the authenticated user
      const userMatch = channelName.match(USER_CHANNEL_REGEX);
      if (userMatch?.[1]) {
        if (userMatch[1] !== userId) {
          throw new Error("Not authorized for this user channel");
        }
        return pusher.authorizeChannel(socketId, channelName);
      }

      // Private org channel — verify user is a member of the org
      const orgMatch = channelName.match(ORG_CHANNEL_REGEX);
      if (orgMatch?.[1]) {
        const orgMembership = await db.query.member.findFirst({
          where: and(
            eq(member.organizationId, orgMatch[1]),
            eq(member.userId, userId)
          ),
        });
        if (!orgMembership) {
          throw new Error("Not a member of this organization");
        }
        return pusher.authorizeChannel(socketId, channelName);
      }

      // DM channel — verify user is a participant in the conversation
      const dmMatch = channelName.match(DM_CHANNEL_REGEX);
      if (dmMatch?.[1]) {
        const conversationId = dmMatch[1];
        const conversation = await db.query.dmConversationTable.findFirst({
          where: and(
            eq(dmConversationTable.id, conversationId),
            or(
              eq(dmConversationTable.participantOneId, userId),
              eq(dmConversationTable.participantTwoId, userId)
            )
          ),
        });

        if (!conversation) {
          throw new Error("Not a participant in this conversation");
        }

        if (channelName.startsWith("presence-")) {
          const presenceData = {
            user_id: userId,
            user_info: {
              name: userName,
              avatar: context.session.user.image,
            },
          };
          return pusher.authorizeChannel(socketId, channelName, presenceData);
        }

        return pusher.authorizeChannel(socketId, channelName);
      }

      // Existing channel-based authorization (presence-channel-*, private-typing-*)
      const channelIdMatch = channelName.match(CHANNEL_ID_REGEX);
      if (!channelIdMatch?.[1]) {
        throw new Error("Invalid channel name");
      }
      const channelId = channelIdMatch[1];

      const membership = await db.query.channelMemberTable.findFirst({
        where: and(
          eq(channelMemberTable.channelId, channelId),
          eq(channelMemberTable.userId, userId)
        ),
      });

      if (!membership) {
        throw new Error("Not a member of this channel");
      }

      if (channelName.startsWith("presence-")) {
        const presenceData = {
          user_id: userId,
          user_info: {
            name: userName,
          },
        };
        return pusher.authorizeChannel(socketId, channelName, presenceData);
      }

      return pusher.authorizeChannel(socketId, channelName);
    }),
};
