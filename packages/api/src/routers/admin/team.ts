import { ORPCError } from "@orpc/client";
import {
	AddMemberInput,
	AddMemberOutput,
	ListTeamsInput,
	ListTeamsOutput,
	RemoveMemberInput,
	RemoveMemberOutput,
} from "@work-holo/api/lib/schemas/team";
import { auth } from "@work-holo/auth";
import { team } from "@work-holo/db/schema/index";
import { and, asc, count, desc, eq, gte, like, lte } from "drizzle-orm";
import { protectedProcedure } from "../../index";

export const adminTeamRouter = {
	listTeams: protectedProcedure
		.input(ListTeamsInput)
		.output(ListTeamsOutput)
		.handler(async ({ input, context: { db, session } }) => {
			const organizationId = session.session.activeOrganizationId;

			if (!organizationId)
				throw new ORPCError("BAD_REQUEST", {
					message: "No active organization",
				});

			const { page, limit, search, filters, sorting } = input;
			const offset = (page - 1) * limit;

			// Build where clause
			const conditions = [eq(team.organizationId, organizationId)];

			if (search) {
				conditions.push(like(team.name, `%${search}%`));
			}

			if (filters?.dateRange) {
				if (filters.dateRange.from) {
					conditions.push(gte(team.createdAt, filters.dateRange.from));
				}
				if (filters.dateRange.to) {
					conditions.push(lte(team.createdAt, filters.dateRange.to));
				}
			}

			const whereClause =
				conditions.length > 1 ? and(...conditions) : conditions[0];

			// Build order by
			// Default sort by createdAt desc if no sorting provided
			let orderBy = [desc(team.createdAt)];

			if (sorting && sorting.length > 0) {
				orderBy = sorting.map((sort) => {
					// We only support sorting by direct team fields for now
					// Cast sort.id to keyof typeof team but verify it exists
					// For safety, let's switch on supported sort keys or just allow if it's in team columns

					if (sort.id === "name")
						return sort.desc ? desc(team.name) : asc(team.name);
					if (sort.id === "createdAt")
						return sort.desc ? desc(team.createdAt) : asc(team.createdAt);

					// Fallback
					return desc(team.createdAt);
				});
			}

			// Get Data
			const teams = await db.query.team.findMany({
				where: whereClause,
				limit,
				offset,
				orderBy,
				with: {
					teamMembers: {
						with: {
							user: true,
						},
					},
				},
			});

			// Get Total Count
			const totalResult = await db
				.select({ count: count() })
				.from(team)
				.where(whereClause);

			// Using Number() because some drivers return count as string (BigInt)
			const total = Number(totalResult[0]?.count ?? 0);
			const pageCount = Math.ceil(total / limit);

			return { teams, total, pageCount };
		}),

	addMember: protectedProcedure
		.input(AddMemberInput)
		.output(AddMemberOutput)
		.handler(async ({ input: { teamId, userIds }, context: { headers } }) => {
			try {
				let addedCount = 0;
				const errors: string[] = [];

				for (const userId of userIds) {
					try {
						await auth.api.addTeamMember({
							body: {
								userId,
								teamId,
							},
							headers,
						});

						addedCount++;
					} catch (error) {
						errors.push(
							`Failed to add user ${userId}: ${
								error instanceof Error ? error.message : "Unknown error"
							}`
						);
					}
				}

				if (addedCount === 0) {
					throw new ORPCError("INTERNAL_SERVER_ERROR", {
						message: `Failed to add any members. Errors: ${errors.join(", ")}`,
					});
				}

				return {
					success: true,
					message:
						addedCount === userIds.length
							? `Successfully added ${addedCount} member(s)`
							: `Added ${addedCount} of ${
									userIds.length
								} member(s). Some failed: ${errors.join(", ")}`,
					addedCount,
				};
			} catch (error) {
				if (error instanceof ORPCError) {
					throw error;
				}
				throw new ORPCError("INTERNAL_SERVER_ERROR", {
					message:
						error instanceof Error
							? error.message
							: "Failed to add members to team",
				});
			}
		}),

	removeMember: protectedProcedure
		.input(RemoveMemberInput)
		.output(RemoveMemberOutput)
		.handler(async ({ input: { teamId, userIds }, context: { headers } }) => {
			try {
				let removedCount = 0;
				const errors: string[] = [];

				// Remove members one by one using Better Auth's API
				for (const userId of userIds) {
					try {
						await auth.api.removeTeamMember({
							body: {
								teamId,
								userId,
							},
							headers,
						});
						removedCount++;
					} catch (error) {
						errors.push(
							`Failed to remove user ${userId}: ${
								error instanceof Error ? error.message : "Unknown error"
							}`
						);
					}
				}

				if (removedCount === 0) {
					throw new ORPCError("INTERNAL_SERVER_ERROR", {
						message: `Failed to remove any members. Errors: ${errors.join(", ")}`,
					});
				}

				return {
					success: true,
					message:
						removedCount === userIds.length
							? `Successfully removed ${removedCount} member(s)`
							: `Removed ${removedCount} of ${
									userIds.length
								} member(s). Some failed: ${errors.join(", ")}`,
					removedCount,
				};
			} catch (error) {
				if (error instanceof ORPCError) {
					throw error;
				}
				throw new ORPCError("INTERNAL_SERVER_ERROR", {
					message:
						error instanceof Error
							? error.message
							: "Failed to remove members from team",
				});
			}
		}),
};
