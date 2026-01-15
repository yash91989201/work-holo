import { ORPCError, os } from "@orpc/server";
import { member } from "@work-holo/db/schema/auth";
import { eq } from "drizzle-orm";
import type { Context } from "./context";

export const o = os.$context<Context>();

export const publicProcedure = o;

const requireAuth = o.middleware(({ context, next }) => {
	if (!context.session?.user) {
		throw new ORPCError("UNAUTHORIZED");
	}

	return next({
		context: {
			session: context.session,
		},
	});
});

const requireAdmin = o.middleware(async ({ context, next }) => {
	if (!context.session?.user) {
		throw new ORPCError("UNAUTHORIZED");
	}

	const userMember = await context.db.query.member.findFirst({
		where: eq(member.userId, context.session.user.id),
	});

	if (!userMember) {
		throw new ORPCError("FORBIDDEN");
	}

	if (userMember.role !== "admin") {
		throw new ORPCError("FORBIDDEN");
	}

	return next();
});

export const protectedProcedure = publicProcedure.use(requireAuth);

export const adminProcedure = publicProcedure.use(requireAdmin);
