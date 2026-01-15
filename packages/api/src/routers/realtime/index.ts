import { protectedProcedure } from "@work-holo/api/index";
import { db } from "@work-holo/db";
import { channelMemberTable } from "@work-holo/db/schema/index";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { pusher } from "../../lib/pusher";

const CHANNEL_ID_REGEX = /(?:presence-channel-|private-typing-)(.+)/;

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
